const express = require('express');

const router = express.Router();

// get posts
router.get('/', (req, res) => {
    res.send('hello');
})
// add post

// delete post

module.exports = router;