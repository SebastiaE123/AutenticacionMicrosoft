require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cookieSession = require('cookie-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_SECRET || 'default_key'],
  maxAge: 24 * 60 * 60 * 1000 // 1 día
}));

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;
const redirectUri = process.env.REDIRECT_URL;

const msAuthUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
const msTokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

app.get('/', (req, res) => res.send('Backend activo'));

app.get('/auth/microsoft', (req, res) => {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    response_mode: 'query',
    scope: 'openid profile email User.Read'
  }).toString();

  res.redirect(`${msAuthUrl}?${params}`);
});

app.get('/auth/microsoft/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code');

  try {
    const tokenResponse = await axios.post(msTokenUrl, new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    // Obtener datos del usuario
    const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // Guardar solo lo necesario en la sesión
    req.session.user = {
      displayName: userResponse.data.displayName,
      mail: userResponse.data.mail || userResponse.data.userPrincipalName,
      id: userResponse.data.id
    };

    // Redirigir al frontend (en Codespaces suele tardar, el PDF menciona 10s)
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
  } catch (err) {
    console.error('Callback error', err.response ? err.response.data : err.message);
    return res.status(500).send('Authentication failed');
  }
});

app.get('/user', (req, res) => {
  if (!req.session || !req.session.user) return res.status(401).json({ ok: false });
  return res.json({ ok: true, user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
