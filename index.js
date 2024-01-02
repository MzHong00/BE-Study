const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

const app = express();

app.use(express.static(__dirname))
app.use(session({
    secret: 'asdfzxcv',                             //secret을 가지고 session id를 만듦
    resave: false,                                  //세션의 값이 바뀌었을 때만 저장
    saveUninitialized: true,                        //세션이 필요할 때만 구동
    store: new FileStore({logFn: function(){}}),    //파일에 session을 저장하는 형식. logFn없으면 세션 스토어에 세션을 만들 때, 1초간 에러 메세지 뜸 (사용하는 것엔 지장이 없긴함)
}))
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize());
app.use(passport.session());

//원래는 DB를 사용해야 하지만 교육용으로 간소화
const user = {
    email: "pass",
    pwd: "123456",
    name: "Passport"
}

//로그인에 성공했을 때 1번 호출
//session 저장소에다가 저장하는 기능
passport.serializeUser((user, done) => {
    console.log("serialize", user);

    //done이 실행되면 두 번째 인자의 값을 세션 저장소에 "passport":{"user":"pass"}로 저장
    done(null, user.email);
})
//로그인에 성공한 후, 다른 페이지에 접속할 때마다 세션 스토어의 식별자를 가져옴
//식별자를 통해 로그인한 사용자가 맞는지 체크하는 기능
passport.deserializeUser((id, done) => {
    console.log("deserialize", id);

    //done의 두 번째 인자를 req.user에 객체로 생성해준다.
    done(null, user)
})
passport.use(new LocalStrategy({
    //form 태그의 name속성과 일치 시켜야 한다.
    usernameField: 'email',
    passwordField: 'pwd'
}, (email, pwd, done) => {
    console.log("LocalStrategy", email, pwd)

    //입력한 정보와 사용자 정보가 다르다면 error
    if (email !== user.email && pwd !== user.pwd) {
        return done(null, false, { message: "incorrect email" })
    }

    /*
        인증에 성공했다면, passport에게 user정보를 넘긴다.
        user 정보를 가지고 passport.serializeUser가 실행된다.
    */
    return done(null, user);
}))

//인증에 성공할 경우 successReidrect, 실패할 경우 failureRedirect 경로로 간다.
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/home', (req, res) => {
    //deserialize에서 사용자 식별 성공시 done함수의 두 번째 인자 객체를 req.user에서 사용
    res.send(`${req.user.name} | <a href="/logout">logout</a>`);
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.save(() => {
            res.redirect("/");
        })
    });
})

app.listen(3000);