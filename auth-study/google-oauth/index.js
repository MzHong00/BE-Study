'use strict';

const express = require('express');
const axios = require('axios')
const { OAuth2Client } = require('google-auth-library');
const opn = require('opn');

const app = express();
const port = 3000;

// Download your OAuth2 configuration from the Google
const keys = require('./oauth2.keys.json');

/**
 * Start by acquiring a pre-authenticated oAuth2 client.
 */
async function main() {
  const oAuth2Client = await getAuthenticatedClient();
  
  const resp2 = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${oAuth2Client.credentials.access_token}`,
    },
  });
  // After acquiring an access_token, you may want to check on the audience, expiration, or original scopes requested.
  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );

  console.log(resp2.data)
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content workflow. Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[0]
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    app.get('/login/redirect', async (req, res) => {
      const { code } = req.query;
      const r = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(r.tokens);
      resolve(oAuth2Client);
      res.send(oAuth2Client)
    })
    app.get('/oauth2callback', async (req, res) => {
      try {
        const code = req.query.code;
        console.log(`Code is ${code}`);
        res.send('Authentication successful! Please return to the console.');

        const r = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.');
        resolve(oAuth2Client);
      } catch (e) {
        reject(e);
      }
    });

    const server = app.listen(port, () => {
      opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
    });
    server.on('error', reject);
  });
}

main().catch(console.error);
