const express = require('express');
const router = express.Router();

router.get('/logout', async (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})

module.exports = router;