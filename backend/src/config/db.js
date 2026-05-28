const mysql = require('mysql2/promise'); 
require('dotenv').config(); 


const pool = mysql.createPool({
    host: process.env.DB_HOST,         // 'localhost'
    user: process.env.DB_USER,         // 'root'
    password: process.env.DB_PASS,     // Your MySQL password
    database: process.env.DB_NAME,     // 'hospital_management_db'
    waitForConnections: true,
    connectionLimit: 10,               // Max number of simultaneous connections
    queueLimit: 0
});

// We export this pool so other files (like your Services) can use it to run queries
module.exports = pool;