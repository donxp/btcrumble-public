const express = require('express');
const middleware = require('../../middleware');
const SocketService = require('../../SocketService');
const config = require('../../config');
const _ = require('lodash');
const moment = require('moment');
const Big = require('big.js');
const logger = require('../../util').logger;

const router = express.Router();

const Bet = require('../../models').Bet;
const User = require('../../models').User;
const Pot = require('../../models').Pot;

router.post('/deposit', middleware.checkToken, async (req, res) => {
    let amount = req.body.amount;
    if(amount && amount >= config.jackpot_min_bet) {
        try {
            /* Take away the amount from the user balance and save */
            let user = await req.getUser();
            if(user.balance < amount) {
                throw 'Balance insufficient';
            }
            user.balance -= amount;
            await user.save();

            /* Get the token worth for the bet */
            let tokenAmount = (new Big(amount)).div(config.jackpot_min_bet_token_cost).toString();
            logger.info(`User ${user.username} bet ${tokenAmount} tokens`);

            let currentPot = await Pot.getCurrentPot();

            /* Check whether last bet was made by a different user (used for adding extra time) */
            let addExtraTime = false;
            let bets = await currentPot.getBets({
                include: [{all: true}],
                order: [['updatedAt', 'DESC']]
            });

            if(bets.length > 0) {
                logger.debug(`Last bet made by ${bets[0].User.username}`);
                if(bets[0].User.username != user.username) {
                    addExtraTime = true;
                }
            }

            let userBet = bets.find(function(el) {
                return el.user_id == user.id;
            });

            /* If bet already exists, just add the tokens */
            if(userBet !== undefined) {
                logger.debug('Bet exists, adding tokens and amount.');
                userBet.amount = (new Big(userBet.amount)).plus(amount).toString();
                userBet.tokens = parseInt(tokenAmount) + parseInt(userBet.tokens);
                await userBet.save();
            } else {
                logger.debug(`Creating new bet for ${tokenAmount} tokens from user ${user.username}`);
                await Bet.build({
                    user_id: user.id,
                    amount,
                    tokens: tokenAmount,
                    pot: currentPot.id
                }).save();
            }
            
            /* Stores formatted new 'timeleft' for DB saving. */
            let newTimeleftDateFormatted = null;
            /* Stores the new 'timeleft' seconds for broadcasting bet. */
            let newTimeleftDifference = null;
            
            if(addExtraTime) {
                if(currentPot.state == 0) {
                    logger.debug('Changing pot state to 1 due to 2 players.');
                    currentPot.state = 1;
                    currentPot.expiresAt = moment().add(config.jackpot_round_time, 's');
                }

                logger.debug('Adding extra time to the pot.');
                let timeleft = currentPot.getTimeleft();
                if(timeleft < 90) {
                    timeleft = Math.min(timeleft + config.jackpot_round_bet_add_time, 90);
                    // get difference from this to db version
                    timeleft = timeleft - currentPot.getTimeleft();
                    let newDate = moment(currentPot.expiresAt).add(timeleft, 'seconds');
                    newTimeleftDateFormatted = moment(currentPot.expiresAt).add(timeleft, 'seconds').format("Y-MM-DD HH:mm:ss");
                    newTimeleftDifference = moment(newTimeleftDateFormatted).diff(moment(), 'seconds');
                    currentPot.expiresAt = newTimeleftDateFormatted;
                }                
            }

            /* Broadcast bet via SocketService */
            let broadcastBetResponse = await SocketService.broadcastBet(
                user.username, user.avatar, amount, /*(newTimeleftDifference != null) ? newTimeleftDifference : */currentPot.getTimeleft()
            );

            if(!broadcastBetResponse.success) {
                throw broadcastBetResponse.message;
            }

            /* if(newTimeleftDateFormatted != null) {
                currentPot.expiresAt = newTimeleftDateFormatted;
            } */
            await currentPot.save();

            res.json({
                success: true,
                message: 'Deposited ' + amount
            });
        } catch(err) {
            console.log(err);
            res.json({
                success: false,
                message: 'Error: ' + err
            });
        }
    } else {
        res.json({
            success: false,
            message: 'Amount not supplied'
        });
    }
});

router.get('/currentpot', /*middleware.checkToken,*/ async (req, res) => {
    try {
        let pot = await Pot.getCurrentPot();
        if(!pot) {
            res.json({
                success: false,
                message: 'There is no pot.'
            });
            return;
        }
        let bets = await pot.getBets({
            include: [{all: true}]
        });
        let betsRefined = [];

        /* Build bets array */
        bets.forEach(bet => {
            betsRefined.push({
                username: bet.User.username,
                amount: bet.amount,
                avatar: bet.User.avatar,
                expiresAt: bet.expiresAt
            });
        });

        let timeleft = pot.getTimeleft();
        logger.debug('currentpot: timeleft = ' + timeleft + 's');

        res.json({
            success: true,
            bets: betsRefined,
            state: pot.state,
            timeleft: timeleft,
            isCountingDown: pot.isCountingDown()
        });
    } catch(err) {
        res.json({
            success: false,
            message: err
        });
        console.log('Error at /currentpot:', err);
    }
    
});

module.exports = router;