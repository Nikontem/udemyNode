
const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product',(req, res) =>{
    res.render('add-product', {pageTitle: 'Add Product', path: 'admin/add-product'});
});

router.post('/product', (req, res) => {
    console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');
});

module.exports.routes = router;
module.exports.products = products;