const mongoose = require('mongoose');
const Product = require('./product');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
                quantity: {type: Number, required: true}
            }
        ],
        total: {
            type: Number,
            required: true
        }
    }
});

UserSchema.methods.addToCart = function (product) {
    if (!this.cart || !this.cart.items || this.cart.items.length === 0 ) {
        this.cart = {items: [{productId: product._id, quantity: 1}], total: product.price};

    } else {
        let cartProduct = this.cart && this.cart.items ? this.cart.items.find(cp => JSON.stringify(product._id) === JSON.stringify(cp.productId)) : null;
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            this.cart.items.push({productId: product._id, quantity: 1});
        }
        this.cart.total += product.price;
    }
    return this.save();
}

UserSchema.methods.deleteFromCart = function(productId){
    const currentProdIdx = this.cart.items.findIndex(ci => ci.productId.toString() === productId.toString());
    const currentProd = this.cart.items[currentProdIdx];

    return Product.findById(productId)
        .then(product => {
            if (currentProd.quantity > 1) {
                currentProd.quantity -= 1;
            } else {
                this.cart.items = this.cart.items.filter(i => i._id.toString() !== currentProd._id.toString());
            }
            this.cart.total -= product.price;
            if (this.cart.total < 0) this.cart.total = 0;
            return this.save();
        });
}

UserSchema.methods.addOrder = function(){
    if (this.cart) {
        this.getCart().then(products => {

            const order = {
                products: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name
                },
                total: products.reduce((p1, p2) => p1 + p2.quantity * p2.price, 0)
            }
            return db.collection('orders').insertOne(order).then(() => {
                return this.updateCart([]);
            });
        })
    }
    return new Promise(resolve => resolve([]));
}

module.exports = mongoose.model('User', UserSchema);