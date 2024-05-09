const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    console.log('Logging out');

    req.session.user = undefined;

    res.json({ user: undefined });
})

router.put('/', async (req, res) => {
    const user = await req.db.findUserByUsername(req.body.username);

    if(user && bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user;
        res.json({ user: user });
    } else {
        res.json({ user: undefined });
    }
});

module.exports = router;