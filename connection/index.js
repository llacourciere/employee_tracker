require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER,
    database: 'employee_tracker',
    password: process.env.MYSQL_PASSWORD
});

db.connect();

module.exports = db;