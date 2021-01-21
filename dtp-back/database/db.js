const mysql = require('mysql');
const log = require('../log')

const {
    DATABASE_URL,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = process.env

var connection = mysql.createConnection({
    host: DATABASE_URL,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
});

connection.connect(function (err) {
    if (err) throw err;
    log.debug("Connection to database established")
});

module.exports = connection;