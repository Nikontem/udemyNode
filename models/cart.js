const fs = require('fs');
const path = require('path');
const rootPath = require('../util/path')

const p = path.join(
    rootPath,
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, price){
        // Fetch cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err) {
                if (fileContent.length > 0) {
                    cart = JSON.parse(fileContent);
                }
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct= cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty +=1;

                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct = {
                    id:id,
                    qty: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += +price;
            fs.writeFile(p, JSON.stringify(cart), err => {
                if(err) console.error(err);
            })
        })
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                return;
            }
        })
    }
}