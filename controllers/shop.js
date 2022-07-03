const Product = require('../models/product');
const Order = require('../models/Order');

exports.getProducts = (req, res) => {
    Product.find().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    });
};

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Product Details',
            path: '/products',
        });
    });
};


exports.getIndex = (req, res) => {
    Product.find().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            csrfToken: req.csrfToken()
        });
    });
};

exports.getCart = (req, res) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: user.cart.items,
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch(err => console.error(err));

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

exports.postDeleteCart = (req, res) => {
    const prodId = req.body.productId;
    req.user.deleteFromCart(prodId)
        .then(() => res.redirect('/cart'))
        .catch(err => console.error(err));
}

exports.getOrders = (req, res) => {
    Order.find({'user.userId': req.user._id})
        .then(orders=>{
            res.render('shop/orders',{
                path:'/orders',
                orders:orders,
                pageTitle: "Orders",
            })
        })
        .catch(err => console.error(err));
};

exports.getCheckout = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {

            const order = new Order({
                user: {
                    email: user.email,
                    userId: user._id
                },
                products: user.cart.items.map(i => ({quantity: i.quantity, product: {...i.productId._doc}})),
                total: user.cart.total
            });
            return order.save();
        })
        .then(() => {
            req.user.cart = {items:[], total: 0};
            return req.user.save();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err=> console.error(err));
};
