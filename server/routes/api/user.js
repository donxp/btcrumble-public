const express = require('express');
const bcrypt = require('bcrypt');
const jimp = require('jimp');
const middleware = require('../../middleware');

const logger = require('../../util').logger;
const router = express.Router();

router.post('/changepassword', middleware.checkToken, (req, res) => {
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;
    let confirmNewPassword = req.body.confirmNewPassword;

    try {
        if(!(currentPassword && newPassword && confirmNewPassword)) {
            throw 'Required fields were not supplied.';
        }
        if(newPassword < 6) {
            throw 'Password must be at least 6 characters long.';
        }
        if(newPassword != confirmNewPassword) {
            throw 'Password confirmation does not match.';
        }

        // Check that current password is correct.
        req.getUser().then(user => {
            return Promise.all([bcrypt.compare(currentPassword, user.password), user]);
        }).spread(async (hashResponse, user) => {
            if(hashResponse) {
                let newHashedPassword = bcrypt.hashSync(newPassword, 1);
                user.password = newHashedPassword;
                await user.save();
                res.json({
                    success: true,
                });
            } else {
                res.json({
                    success: false,
                    message: 'Current password does not match.'
                });
            }
        }).catch(err => {
            throw err;
        });
    } catch (err) {
        res.json({
            success: false,
            message: err
        });
    }
});

router.post('/uploadavatar', middleware.checkToken, (req, res) => {
    let avatar = req.files.avatar;
    let fileRegex = /[A-z]+\.(jpg|jpeg|png)$/;

    if(!fileRegex.test(avatar.name)) {
        res.json({
            success: false,
            message: 'Image format is incorrect.'
        })
        return;
    }

    if(avatar) {
        jimp.read(avatar.data)
            .then(image => {
                return image
                .resize(100, 100)
                .write('./server/public/avatars/' + req.decoded.username + '.png');
            })
            .catch(err => {
                logger.error('Error trying to read avatar using jimp.', {user: req.decoded.username});
            });
        res.json({
            success: true
        });
    } else {
        logger.debug('avatar object is null', {user: req.decoded.username});
        res.json({
            success: false,
            message: 'Avatar is empty.'
        });
    }
});

module.exports = router;