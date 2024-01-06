const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'my_db',
    connectionLimit: 10
});


module.exports = (callback) => {
    pool.getConnection((error, connection) => {
        if (error) throw error;
        callback(connection)
    })
}