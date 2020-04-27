const express = require('express');
const middleware = require('../../middleware');
const BlockIoService = require('../../BlockIoService');
const validator = require('validator');

const router = express.Router();

/* 
    Generates a new wallet address for depositing.

    1. Reject if user already has a deposit address.
    2. Request from service a new address with the label being users' username.
    3. Reject if request fails.
    4. Otherwise save the address in the database.
*/
router.get('/generateaddress', middleware.checkToken, async (req, res) => {
    let user = await req.getUser();

    /* If user doesn't already have a deposit address generate a new one and save it. */
    if(user.depositAddress == '') {
        try {
            let addressResponse = await BlockIoService.generateNewAddress(user.username + '3');

            if(addressResponse.status == 'fail') {
                console.log('Unable to generate address, error:', addressResponse.data.error_message);
                throw 'Unable to retrieve a new address from provider.';
            } else if(addressResponse.status == 'success') {
                let address = addressResponse.data.address;

                user.depositAddress = address;
                await user.save();

                res.json({
                    success: true,
                    address
                });
            } else {
                throw 'unrecognized response status';
            }
        } catch(err) {
            res.json({
                success: false,
                message: 'Error generating address: ' + err
            });
        }
    } else {
        res.json({
            success: false,
            message: 'Address already exists',
            address: user.depositAddress
        });
    }

});

/*
    Withdraw bitcoin from wallet.

    1. Reject if address or amount was not provided.
    2. Reject if address doesn't match bitcoin address format.
    3. Reject if amount is in the wrong format or contains symbols like -, +
    4. Reject if amount exceeds user balance.
    5. Request withdrawal from service.
    6. Reject if request failed.
    7. Otherwise subtract amount from users balance.
*/
router.post('/withdraw', middleware.checkToken, async (req, res) => {
    let user = await req.getUser();

    let address = req.body.address;
    let amount = req.body.amount;

    const addressRegex = /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/igm;

    try {
        if(!address || !amount) {
            throw 'Invalid parameters supplied';
        }

        if(!address.match(addressRegex)) {
            throw 'Address is in invalid format';
        }

        if(!validator.isNumeric(amount, {no_symbols: true})) {
            throw 'Invalid amount';
        }

        if(user.balance > amount) {
            throw 'Insufficient balance';
        }

        
    } catch(error) {
        res.json({
            success: false,
            message: error
        });
    }

    /* if(address && amount) {
        console.log(`Withdraw request ${amount} to ${address}`);
        res.json({
            success: true,
            message: 'Good'
        });
    } else {
        res.json({
            success: false,
            message: 'Invalid parameters supplied'
        });
    } */
    
});

module.exports = router;