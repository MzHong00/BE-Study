const http = require('http');
const cookie = require('cookie')

http.createServer((req, res) => {
    let cookie_parse;
    req.headers.cookie && (cookie_parse = cookie.parse(req.headers.cookie))
    console.log(cookie_parse)

    res.writeHead(200, {
        'set-cookie': [
            'session_cookie=session',
            `permanent_cookie=permanent; Max-Age=${60}`,    //60초 뒤에 쿠키 만료. 이 외에도 날짜로 하는 Expires 존재
            `secure_cookie=secure; Secure`,                 //https로 요청했을 때 쿠키
            `httpOnly_cookie=httpOnly; HttpOnly`,           //클라이언트에서 document.cookie를 사용해도 나오지 않음 
            `path_cookie=path; Path=/path`,                 //해당 경로에서 주어지는 쿠키, 부모 경로의 쿠키도 갖고 있음
            `domain_cookie=domain; Domain=your_domain`      //해당 도메인에서 주어지는 쿠키
        ]
    });
    
    res.end("Developer Tools(F12) > Application > Cookie");
}).listen(3000);