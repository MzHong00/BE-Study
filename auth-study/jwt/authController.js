import jwt from "jsonwebtoken";

const user = {
    email: "jwt",
    password: "1234",
    name: "kim"
}

const ACCESS_SECRET_KEY = 'access_secret_key'
const REFRESH_SECRET_KEY = 'refresh_secret_key'

const login = (req, res) => {
    const { email, password } = req.body;

    if (user.email !== email) {
        res.status(403).json('This email does not exist.');
    }

    if (user.password !== password) {
        res.status(403).json('Password is not valid.');
    }

    try {
        const accessToken = jwt.sign({
            email: user.email,
            name: user.name
        }, ACCESS_SECRET_KEY, {
            expiresIn: '1m',
            issuer: 'access issuer'
        })

        const refreshToken = jwt.sign({
            email: user.email,
            name: user.email
        }, REFRESH_SECRET_KEY, {
            expiresIn: '24h',
            issuer: 'refresh issuer'
        })

        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true
        })

        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true
        })

        res.status(200).json("login success")
    } catch {
        res.status(500).json("login failed")
    }
}

const accessToken = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const data = jwt.verify(token, ACCESS_SECRET_KEY);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const refreshToken = (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const data = jwt.verify(token, REFRESH_SECRET_KEY);

        const accessToken = jwt.sign({
            email: user.email,
            name: user.name
        }, ACCESS_SECRET_KEY, {
            expiresIn: '1m',
            issuer: 'access issuer'
        })

        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })

        res.status(200).json("Access Token Recreated");
    } catch {
        res.status(500).json(error);
    }
}

const logout = (req, res) => {

    try {
        res.clearCookie('accessToken');

        res.status(200).json("Logout Success");
    } catch (error) {
        res.status(500).json(error);
    }
}

export { login, accessToken, refreshToken, logout }