const dotenv = require('dotenv').config();

exports.username = process.env.DB_USER;
exports.pass = process.env.DB_PASSWORD;
exports.db = process.env.DB_DATABASE;

