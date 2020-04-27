const express = require('express');
const router = express.Router();

const authMiddleware = require('./middleware').auth;

class Routes {
    constructor(io, app) {
        Routes.io = io;

        app.post('/jackpot/broadcastbet', Routes.jackpotBroadcastBet);
    }

    static jackpotBroadcastBet(req, res) {
        let username = req.body.username;
        let avatar = req.body.avatar;
        let amount = req.body.amount;
        let timeleft = req.body.potTimeleft;

        Routes.io.emit('jackpotBet', {
            username,
            avatar,
            amount,
            timeleft
        });

        console.log('Emitted event');

        res.json({
            success: true,
            message: 'Bet broadcasted'
        });
    }
}

module.exports = Routes;