const secret = require('../server/config').socket_service_secret;

let auth = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if(!token) {
        return res.json({
            success: false,
            message: 'Service auth token is not supplied'
        })
    }

    if(token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if(token == secret) {
        next();
    } else {
        return res.json({
            success: false,
            message: 'Invalid secret'
        });
    }
}

module.exports = {
    auth
}