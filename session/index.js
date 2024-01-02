const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();

app.use(session({
    secret: 'asdfzxcv',             //secret을 가지고 암호화된 session id를 만듦
    resave: false,                  //세션의 값이 바뀌었을 때만 저장
    saveUninitialized: true,        //세션이 필요할 때만 구동
    store: new FileStore()          //파일에 session을 저장하는 형식
}))

app.get('/', ((req, res) => {
    req.session.num ? req.session.num += 1 : req.session.num = 1;
    res.send(`View: ${req.session.num}`);

    console.log(req.session)
}))

app.listen(3000)