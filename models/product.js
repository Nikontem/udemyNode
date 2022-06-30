const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id){
        const productIndex = products.findIndex(p => p.id === this.id);
        products[productIndex] = this;
      }else{
        this.id = Math.random().toString();
        products.push(this);
      }

      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static deleteById(id) {
      getProductsFromFile(products=> {
         products = products.filter(p => p.id !== this.id);
         fs.writeFile(p, JSON.stringify((products), err => {
            if(!err){

            }
         }))
      })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb){
    getProductsFromFile(products =>{
      const product = products.find(p=> p.id === id);
      cb(product);
    })
  }
};
