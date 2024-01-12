//copy.js는 index.js를 쉽고 친근한 코드로 변경시킨 것이다.
const express = require('express');
const axios = require('axios')
const { OAuth2Client } = require('google-auth-library');
const opn = require('opn');

const app = express();

const keys = require('./oauth2.keys.json');

const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

app.get('/', async(req, res) => {
  let user = {};
  const googleApi = 'https://www.googleapis.com/oauth2/v2/userinfo';
  if (oAuth2Client.credentials.access_token) {
    const userInfo = await axios.get(googleApi, {
      headers: {
        Authorization: `Bearer ${oAuth2Client.credentials.access_token}`,
      }
    })
    user = userInfo.data;
    console.log(user)
  }

  res.send(
    `<div>
      <a href="/login">login</a>
      <a href="/logout">logout</a>
      <p>${user.name}</p>
      <img src="${user.picture}" />
    </div>`
  )
})
app.get('/login', (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
  });
  opn(authorizeUrl, { wait: false }).then(cp => cp.unref());

  res.send(authorizeUrl);
})
app.get('/login/redirect', async (req, res) => {
  try {
    const { code } = req.query;
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);

    res.send(`<div>
  <p>login success!!</p>
  <a href="/">home</a>
  </div>`)
  } catch (error) {
    res.status(400).redirect('/')
  }
})
app.get('/logout', (req, res) => {
  oAuth2Client.revokeCredentials((err, body) => {
    console.log(err, body)
  });
  res.send(`<a href="/">home</a>`)
})

app.listen(3000);