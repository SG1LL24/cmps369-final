const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

router.put('/', async (req, res) => {
    const firstname = req.body.firstname.trim();
    const lastname = req.body.lastname.trim();
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();

    if(p1 != p2) {
        res.json({ status: 'match' });
        return;
    }

    const user = await req.db.findUserByUsername(req.body.username);

    if(user) {
        res.json({ status: 'exists'});
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(p1, salt);

    const id = await req.db.createUser(firstname, lastname, username, hash);
    req.session.user = await req.db.findUserByID(id);
    res.json({ status: 'success' });
})

module.exports = router;