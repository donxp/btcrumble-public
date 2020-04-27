const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('../../config');
const middleware = require('../../middleware');
const bcrypt = require('bcrypt')

const router = express.Router();

const User = require('../../models').User;

router.get('/verify', middleware.checkToken, (req, res) => {
    req.getUser().then(user => {
        res.json({
            success: true,
            data: {
                username: req.decoded.username,
                balance: user.balance,
                depositAddress: user.depositAddress
            }
        });
    }).catch(err => {
        console.log('Unable to verify user', err);
        res.json({
            success: false,
            message: 'Unable to verify user.'
        });
    });
});

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username && password) {
        User.getByUsername(username).then(user => {
            return Promise.all([bcrypt.compare(password, user.password), user]);
        }).spread((hashResponse, user) => {
            if(hashResponse) {
                let token = jwt.sign({username, avatar: user.avatar},
                    config.jwt_secret,
                    { expiresIn: '24h' }
                );
                res.json({
                    success: true,
                    token,
                    username,
                    balance: user.balance,
                    depositAddress: user.depositAddress
                });
            } else {
                res.json({
                    success: false,
                    message: 'Username or password is incorrect.'
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                success: false,
                message: 'Username or password is incorrect.'
            });
        });
    } else {
        res.json({
            success: false,
            message: 'Username or password not supplied'
        });
    }
});

router.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let password_confirm = req.body.password_confirm;
    let email = req.body.email;

    if(username && password && password_confirm && email) {
        if(username.length < 4) {
            res.json({
                success: false,
                message: 'Username must be at least 4 characters long.'
            });
            return;
        }
        if(password != password_confirm) {
            res.json({
                success: false,
                message: 'Passwords do not match'
            });
            return;
        }
        if(password.length < 6) {
            res.json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
            return;
        }
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!emailPattern.test(email)) {
            res.json({
                success: false,
                message: 'Email is not in a valid format.'
            });
            return;
        }
        // TODO: Email validation
        bcrypt.hash(password, 1).then(hash => {
            return User.create({
                username,
                email,
                password: hash
            });
        }).then(user => {
            res.json({
                success: true,
                message: 'User registered'
            });
        }).catch(err => {
            res.json({
                success: false,
                message: 'Failed to register'
            });
            console.log('Failed to register user ' + username, err);
        });        
    } else {
        res.json({
            success: false,
            message: 'Required parameters not supplied'
        });
    }
});

module.exports = router;