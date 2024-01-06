var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'my_db'
});

connection.connect();

connection.query('SELECT * from user', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});

connection.end();

// 모듈화한 커넥션 풀 사용
// pool((mysql) => {
//     mysql.query("select * from user", function (error, results, fields) {
//         if (error) throw error;
//         console.log(results);
//     })
//     mysql.release();
// })
