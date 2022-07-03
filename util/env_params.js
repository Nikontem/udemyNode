const dotenv = require('dotenv').config();

exports.username = process.env.DB_USER;
exports.pass = process.env.DB_PASSWORD;
exports.db = process.env.DB_DATABASE;
exports.dbConnString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_DATABASE}.nx26p.mongodb.net/messages`;

