import express from 'express'
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";

import {
    login,
    accessToken,
    refreshToken,
    logout
} from './authController.js';

//esModule에서 __dirname을 가져올 수 있게 하는 방법
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const app = express();

app.use(express.static(__dirname))
//req.body 객체를 받아올 수 있게 함
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//req.cookies 객체를 받아올 수 있게 함
app.use(cookieParser())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

//accessToken, refreshToken 생성
app.post('/login', login)
//인증 후 데이터 응답
app.get("/accesstoken", accessToken);
//유효기간이 짧은 accessToken을 갱신
app.get("/refreshtoken", refreshToken);
//accessToken을 제거
app.get("/logout", logout);

app.listen(3000, () => {
    console.log('http://localhost:3000')
});