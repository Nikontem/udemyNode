const mongodb = require('mongodb');
const dotenv = require('dotenv').config();

const MongoClient = mongodb.MongoClient;

const username = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const db = process.env.DB_DATABASE;
const MongoConnect = (callback) => {

    MongoClient.connect(`mongodb+srv://${username}:${pass}@${db}.nx26p.mongodb.net/?retryWrites=true&w=majority`)
        .then(result => {
            console.log('Connected');
            callback(result);
        })
        .catch(err => console.error(err));
}

module.exports = MongoConnect;