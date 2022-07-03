const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const errorController = require('./controllers/error');
const User = require('./models/User');
const {username, pass, db} = require('./util/env_params');
const connectionString = `mongodb+srv://${username}:${pass}@${db}.nx26p.mongodb.net/shop`;

const app = express();
const store = new MongoDbStore({
    uri: connectionString,
    collection: "session"
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (req.session) {
        User.findById(req.session.userId)
            .then(user => {
                req.user = user;
                next();
            })
            .catch((err => console.error(err)));
    } else {
        next();
    }
});

app.use((req, res, next) => {
    let message = req.flash('error');
    console.log(message);
    message = message.length > 0 ? message[0] : null;

    res.locals.errorMessage = message;
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
mongoose.connect(connectionString)
    .then(() => {
        console.info('Connected')
        app.listen(3000);
    })
    .catch(err => console.error(err));


