require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'process.env.MYSQL_USER',
    database: 'todos_db',
    password: 'process.env.MYSQL_PASSWORD',
});