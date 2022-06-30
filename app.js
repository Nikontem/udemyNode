const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require("path");

app.set('view engine', 'ejs');
app.set('views','views');//./views is the default -> This is redundant

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use((req, res) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);
