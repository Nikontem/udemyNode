const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price,req.user._id);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product:product
    });
  }).catch(err => console.error(err));


};

exports.postEditProduct = (req, res) => {
  const _id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(_id, title,imageUrl,description, price);

  product.save();
  res.redirect('/');
};

exports.getDeleteProduct = (req, res) =>{
  const prodId = req.body.productId;
  Product.deleteById(prodId)
      .then( () => {
        res.redirect("/");
      })
}
exports.getProducts = (req, res) => {
  Product.fetchAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
