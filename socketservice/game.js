const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');
const config = require('../server/config');
const Pot = require('../server/models').Pot;
const _ = require('lodash');

class Game {
    static async checkJackpot(io) 
    {
        //console.log('Checking jackpot');
        let pot = await Pot.getCurrentPot();
        if(pot) {
            if(pot.getTimeleft() <= 0 && pot.state == 1) {
                /* ROLL NOW */
                await Game.rollPot(io, pot);
                console.log(`Pot ${pot.id} rolled. Making next one...`);
                await Game.createPot();
            }
        }
    }

    static async rollPot(io, pot)
    {
        // Rolling logic and calculations
        const winningPercentage = parseInt((pot.finalHash).substr(0, 5), 16) / 1000000;
        const bets = await pot.getBets({include: [{all: true}]});
        const totalTokens = _.sumBy(bets, 'tokens');
        const winningToken = Math.floor(winningPercentage * totalTokens);

        console.log('Winning percentage:', winningPercentage);
        console.log('Total tokens:', totalTokens);
        console.log('Winning token:', winningToken);

        let tokenCount = 0;
        let winningBet = null;
        let allBets = [];
        for(let i = 0; i < bets.length; i++) {
            let bet = bets[i];

            allBets.push({
                username: bet.User.username,
                avatar: bet.User.avatar,
                chance: (bet.tokens / totalTokens).toFixed(2)
            });

            if(tokenCount + bet.tokens >= winningToken) {
                winningBet = bet;
            } else {
                tokenCount += bet.tokens;
            }
        }
        //console.log(winningBet);

        console.log('Winning bet id:', winningBet.id);
        pot.winner = winningBet.id;
        pot.state = 2;
        await pot.save();
        
        io.emit('jackpotRoll', {
            winner: winningBet.User.username,
            all: allBets
        });
    }

    static async createPot()
    {
        try {
            const serverSecret = Game.generateRandomString(13);
            let hashedServerSecret = Game.encryptAes(serverSecret);
            const randomRequest = await Game.randomOrgString(13);
            const randomRequestSignature = randomRequest.result.signature;
            const randomObject = randomRequest.result.random;
            const randomRequestString = randomObject.data[0];
            const finalHash = Game.encryptAes(serverSecret + randomRequestString);

            await Pot.build({
                state: 0,
                serverSecret,
                hashedServerSecret,
                randomString: randomRequestString,
                randomSignature: randomRequestSignature,
                randomObject: JSON.stringify(randomObject),
                finalHash,
                expiresAt: moment().add(config.jackpot_round_time, 's')
            }).save();

            console.log('Pot created');

        } catch(err) {
            throw err;
        }
    }

    static generateRandomString(length)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!£$%^&*()_+-=/.";
        
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        return text;
    }

    static async randomOrgString(length)
    {
        const randomOrgUrl = 'https://api.random.org/json-rpc/2/invoke';
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(randomOrgUrl, {
                    "jsonrpc": "2.0",
                    "method": "generateSignedStrings",
                    "params": {
                        "apiKey": config.random_org_api_key,
                        "n": 1,
                        "length": length,
                        "characters": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!£$%^&*()_+-=/.",
                        "replacement": true,
                        "userData": null
                    },
                    "id": 1
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(response.status == 200) {
                    resolve(response.data);
                } else {
                    reject('Error status code: ' + response.status);
                }
            } catch(err) {
                reject(err);
            }
        });
    }

    static encryptAes(string)
    {
        var cipher = crypto.createCipher(config.jackpot_hash_algorithm, config.jackpot_hash_secret);
        var crypted = cipher.update(string, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    static decryptAes(string)
    {
        var decipher = crypto.createDecipher(config.jackpot_hash_algorithm, config.jackpot_hash_secret);
        var dec = decipher.update(string, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
}

module.exports = Game;