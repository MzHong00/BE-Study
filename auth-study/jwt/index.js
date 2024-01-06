const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const { auth } = require('./authMiddleware')

const { login } = require("./controller/jwtVerify")

var app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http:localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}))

app.get("/login", auth, login);

app.listen(process.env.PORT)

// app.get("/login", (req, res) => {
//     console.log(req.headers.authorization)
//     const email = "google@gmail.com"
//     const name = "kr_user01"

//     //jwt.sign(payload, secretOrPrivateKey, [options, callback])
//     token = jwt.sign({
//         type: 'JWT',
//         email: email,
//         name: name
//     }, SECRET_KEY, {
//         expiresIn: '15m', // 만료시간 15분
//     });

//     res.cookie('Authorization', `Bearer ${token}`)
    
//     res.send("Set JWT to Cookie")
// })
// app.get('/payload', auth, (req, res) => {
//     const nickname = req.decoded.nickname;
//     const profile = req.decoded.profile;
//     return res.status(200).json({
//         code: 200,
//         message: '토큰은 정상입니다.',
//         data: {
//             nickname: nickname,
//             profile: profile
//         }
//     });
// });
