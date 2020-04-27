const io = require('socket.io')();
const config = require('../server/config');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware').auth;
const Routes = require('./routes');
const Game = require('./game');

const apiPort = config.socket_service_api_port;
const socketPort = config.socket_service_port;
const updateInterval = config.pot_check_time;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(authMiddleware);

io.listen(socketPort);
console.log('Socket.io server online.');

let routes = new Routes(io, app);

app.listen(apiPort, () => console.log(`API server started on port ${apiPort}`));

io.on('connection', client => {
    client.on('chatMessage', (token, msg) => {
        console.log('chatMessage:', msg);

        jwt.verify(token, config.jwt_secret, (err, decoded) => {
            if(!err) {
                io.emit('chatMessage', {
                    username: decoded.username,
                    message: msg,
                    avatar: decoded.avatar
                });
            }
        });

        
    });
});

setInterval(async() => {
    Game.checkJackpot(io);
}, updateInterval);