const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    // TODO: Fetch actual values
    // Use cache
    const minimumDeposit = '0.0003';
    let total24HrDeposits = '5.48';
    let games24Hr = '5';
    let biggestPot = '0.67';
    res.json({
        success: true,
        stats: {
            //minimumDeposit,
            total24HrDeposits,
            games24Hr,
            biggestPot
        }
    });
});

module.exports = router;