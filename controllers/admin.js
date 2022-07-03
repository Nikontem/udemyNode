const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        _id: null,
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        userId: req.user
    });
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findOne({_id: req.body.productId, userId: req.session.userId}).then(product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product: product,
        });
    }).catch(err => console.error(err));


};

exports.postEditProduct = (req, res) => {

    Product.findOne({_id: req.body.productId, userId: req.session.userId}).then(product => {
        if(!product){
            return res.redirect('/');
        }
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.price = req.body.price;
        product.description = req.body.description;
        return product.save();

    }).then(() => res.redirect('/'))
};

exports.getDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findOneAndDelete({_id: prodId, userId: req.session.userId})
        .then(() => {
            res.redirect("/admin/products");
        })
}
exports.getProducts = (req, res) => {
    Product.find({userId: req.session.userId}).then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
};
