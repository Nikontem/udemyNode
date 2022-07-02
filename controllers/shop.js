const Product = require('../models/product');
const User = require('../models/User');

exports.getProducts = (req, res) => {
    Product.fetchAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('shop/product-detail', {product: product, pageTitle: 'Product Details', path: '/products'});
    });
};


exports.getIndex = (req, res) => {
    Product.fetchAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getCart = (req, res) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));

};

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    const user = req.user;
    Product.findById(prodId)
        .then(product => {
            user.addToCart(product);
            res.redirect('/products');
        })
        .catch(err => console.error(err));

}

exports.postDeleteCart= (req, res) =>{
    const prodId = req.body.productId;
    req.user.deleteFromCart(prodId)
        .then(()=> res.redirect('/cart'))
        .catch(err=> console.log(err));
}

exports.getOrders = (req, res) => {
    req.user.getOrders()
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                path: '/orders', orders: orders, pageTitle: 'Your Orders'
            });
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res) => {
    req.user.addOrder()
        .then(() => res.redirect('/orders'))
        .catch(err => console.log(err));
};
