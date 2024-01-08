var mysql = require('mysql');

//mysql 세팅이 되어야 아래 코드들도 실행이 성공적임
//일반적인 mysql 커넥션 생성과 쿼리문 실행 함수 및 종료
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'my_db' //schema 이름
});

connection.connect();

connection.query('SELECT * from user', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});

connection.end();


// conPoolModuel.js에서 모듈화한 커넥션 풀 사용
// pool((mysql) => {
//     mysql.query("select * from user", function (error, results, fields) {
//         if (error) throw error;
//         console.log(results);
//     })
//     mysql.release();
// })
