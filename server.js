const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const Database = require('./db.js');
const db = new Database();
db.initialize();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.locals.pretty = true;

app.use(express.static(path.join(__dirname, "static")));

app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(express.static('public'));

app.use((req, res, next) => {
    req.db = db;
    next();
})

app.use((req, res, next) => {
    if(req.session.user) {
        res.locals.user = {
            id: req.session.user.id, 
            firstname: req.session.user.firstname,
            lastname: req.session.user.lastname,
            username: req.session.user.username
        }
    }
    next();
});

app.use('/list', require('./routes/list.js'));
app.use('/login', require('./routes/login.js'));
app.use('/signup', require('./routes/signup.js'));
app.use('/', require('./routes/delete.js'));
app.use('/', require('./routes/edit.js'));
app.use('/', require('./routes/logout.js'));

app.use('/', (req, res) => {
    res.render('overview', {});
})

app.listen('8080', () => {
    console.log('Server is running on port 8080');
})