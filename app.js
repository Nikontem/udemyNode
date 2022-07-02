const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/User');
const {username, pass, db} = require('./util/env_params');
const connectionString = `mongodb+srv://${username}:${pass}@${db}.nx26p.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("62c08b549cddc182df5f031e")
        .then(user => {
            req.user = user;
            next();
        })
        .catch((err => console.err(err)));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoose.connect(connectionString)
    .then(() => {
        User.findOne().then(user => {
            if(!(user)){
                const user = new User({name:'Nikos',email:"random@node.js"});
                user.save();
            }
        })
        console.info('connected');
        app.listen(3000);
    })
    .catch(err => console.error(err));


