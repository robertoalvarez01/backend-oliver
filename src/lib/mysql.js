const mysql = require('mysql');
const {config} = require('../config/config.js');
const connection = mysql.createPool({
    host:config.dbHost,
    user:config.dbUser,
    database:config.dbName,
    password:config.dbPw
});

module.exports = connection;