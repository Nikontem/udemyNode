const mongoDb = require('mongodb');
const objectId = mongoDb.ObjectId;
const getDb = require('../util/database').getDb;
const {ObjectId, Promise} = require("mongodb");
const Product = require('./product');

class User {
    constructor(_id, name, email, cart) {
        this._id = _id == null ? null : new ObjectId(_id);
        this.name = name;
        this.email = email;
        this.cart = cart;
    }

    save() {
        const db = getDb();
        db.collection('users').insertOne(this);
    }

    updateCart(cart) {
        const db = getDb();
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: cart}});
    }

    addToCart(product) {
        console.log(this.cart);
        if (!this.cart || this.cart.length === 0) {
            this.cart = {items: [{_id: product._id, quantity: 1}], total: +product.price};

        } else {
            let cartProduct = this.cart && this.cart.items ? this.cart.items.find(cp => JSON.stringify(product._id) === JSON.stringify(cp._id)) : null;
            if (cartProduct) {
                cartProduct.quantity += 1;
            } else {
                this.cart.items.push({_id: new ObjectId(product._id), quantity: 1});
            }
            this.cart.total += +product.price;
        }
        return this.updateCart(this.cart);

    }

    async getCart() {
        const db = getDb();
        if (this.cart && this.cart.items) {
            const productIds = this.cart.items.map(i => (i._id));
            return db
                .collection('products')
                .find({_id: {$in: productIds}})
                .toArray()
                .then(products => (products.map(p => {
                    return {...p, quantity: this.cart.items.find(i => i._id.toString() === p._id.toString()).quantity}
                })))
                .catch(err => console.log(err));
        }

        return new Promise(resolve => resolve([]));
    }

    deleteFromCart(productId) {
        const currentProdIdx = this.cart.items.findIndex(ci => ci._id.toString() === productId);
        const currentProd = this.cart.items[currentProdIdx];

        return Product.findById(productId)
            .then(product => {
                if (currentProd.quantity > 1) {
                    currentProd.quantity -= 1;
                } else {
                    this.cart.items = this.cart.items.filter(i => i._id.toString() !== currentProd._id.toString());
                }
                this.cart.total -= +product.price;
                if (this.cart.total < 0) this.cart.total = 0;
                return this.updateCart(this.cart);
            });
    }

    async addOrder() {
        const db = getDb();
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

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray().then(orders => orders).catch(err => console.log(err));
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').find({_id: new objectId(userId)})
            .next()
            .then(user => (user))
            .catch(err => console.log(err));
    }
}

module.exports = User;