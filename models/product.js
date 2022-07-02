const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');

class Product {
  constructor(_id, title, imageUrl, description, price, userId) {
    this._id = _id ? new mongoDb.ObjectId(_id) : null;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
  }

  save() {

    const db = getDb();
    let operation;
    if(this._id){
        operation = db.collection('products')
            .updateOne({_id: this._id}, { $set: this });
    }else{
        operation = db.collection('products')
            .insertOne(this)

    }

    return operation.then( )
        .catch((err => {
            console.error(err);
        }));

  }

  static findById(id){
      const db = getDb();
      return db.collection('products').find({_id: new mongoDb.ObjectId(id)}).next()
          .then(product => (product))
          .catch(err=>{
              console.error(err);
          });

  }

  static deleteById(id){
      const db = getDb();
      return db.collection('products')
          .deleteOne({ _id: new mongoDb.ObjectId(id)})
          .then(result => {
              console.log(result);
          })
          .catch(err => console.log(err));
  }

  static fetchAll() {
    return getDb()
        .collection('products')
        .find()
        .toArray()
        .then(products =>{
           return products;
        })
        .catch(err => {
          console.error((err));
        })
  }
}

module.exports = Product;
