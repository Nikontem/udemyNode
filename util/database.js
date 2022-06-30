const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const MongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://nntemkas:P87BM6e9aSnLvaTc@nodejscluster.nx26p.mongodb.net/?retryWrites=true&w=majority')
        .then(result => {
            console.log('Connected');
            callback(result);
        })
        .catch(err => console.error(err));
}

module.exports = MongoConnect;