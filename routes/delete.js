const express = require('express');
const router = express.Router();

const logged_in  = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.render('invalid');
    }
}

router.get('/delete/:id', logged_in, async (req, res) => {
    const contact = await req.db.findContactByID(req.params.id);
    res.render('delete', { contact: contact });
});

router.post('/delete/:id', logged_in, async (req, res) => {
    await req.db.deleteContact(req.params.id);
    res.redirect('/');
});

module.exports = router;