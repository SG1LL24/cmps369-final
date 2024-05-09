const express = require('express');
const router = express.Router();

const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap'});

const logged_in  = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.render('invalid');
    }
}

router.get('/edit/:id', logged_in, async (req, res) => {
    const contact = await req.db.findContactByID(req.params.id);
    res.render('edit', { contact: contact });
})

router.post('/edit/:id', logged_in, async (req, res) => {
    const result = await geocoder.geocode(req.body.address);

    if (result.length == 0) {
        res.status(400).send("Invalid address");
    }

    const lat = result[0].latitude;
    const lng = result[0].longitude;

    const firstname = req.body.first.trim();
    const lastname = req.body.last.trim();
    const title = req.body.title.trim();
    const address = req.body.address.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();

    const canMail = req.body.contact_by_mail !== undefined;
    const canCall = req.body.contact_by_phone !== undefined;
    const canEmail = req.body.contact_by_email !== undefined;

    await req.db.updateContact(req.params.id, firstname, lastname, title, address, phone, email, canMail, canCall, canEmail, lat, lng);
    res.redirect('/');
})

module.exports = router;