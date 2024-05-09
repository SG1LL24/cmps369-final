const express = require('express');
const router = express.Router();

const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap'});

const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    const contacts = await req.db.getAllContacts();
    const default_user = await req.db.findUserByUsername('rcnj');

    if (default_user == undefined) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('password', salt);
        const id = await req.db.createUser('cmps369', 'user', 'rcnj', hash);
    }

    res.json({ contacts: contacts });
})

router.put('/', async (req, res) => {
    const result = await geocoder.geocode(req.body.address);

    if (result.length == 0) {
        res.json({ error: "Invalid address" })
        return;
    }

    const lat = result[0].latitude;
    const lng = result[0].longitude;

    const id = await req.db.createContact(req.body.first, req.body.last, req.body.title, req.body.address, req.body.phone, req.body.email, 
                                        req.body.canMail, req.body.canCall, req.body.canEmail, lat, lng);

    res.json({ error: undefined });
})

module.exports = router;