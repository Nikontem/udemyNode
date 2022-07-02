const mongodb = require('mongodb');
const dotenv = require('dotenv').config();

const MongoClient = mongodb.MongoClient;

const username = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const db = process.env.DB_DATABASE;

let _db;
const MongoConnect = (callback) => {

    MongoClient.connect(
        `mongodb+srv://${username}:${pass}@${db}.nx26p.mongodb.net/shop?retryWrites=true&w=majority`)
        .then(client => {
            console.log('Connected');
            _db=client.db()
            callback();
        })
        .catch(err => console.error(err));
}

const getDb = () =>{
    if (_db){
        return _db;
    }
    throw 'No Database found';
}

exports.mongoConnect = MongoConnect;
exports.getDb =getDb;