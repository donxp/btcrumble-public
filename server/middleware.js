const jwt = require('jsonwebtoken');
const config = require('./config');

const User = require('./models').User;

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(!token) {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        })
    }
    if(token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if(token) {
        jwt.verify(token, config.jwt_secret, (err, decoded) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Auth token is not valid'
                });
            } else {
                req.decoded = decoded;
                req.getUser = function() {
                    return User.getByUsername(req.decoded.username);
                }
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = {
    checkToken: checkToken
};