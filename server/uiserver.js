import express from 'express';
import dotenv from 'dotenv';
import proxy from 'http-proxy-middleware';
import SourceMapSupport from 'source-map-support';
import render from './render.jsx';
const app = express();

SourceMapSupport.install();
dotenv.config();

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && process.env.NODE_ENV !== 'production') {
  console.log('Adding dev middleware, enabling HMR');
  /* eslint "global-require": "off" */
  /* eslint "import/no-extraneous-dependencies": "off" */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config.js')[0];

  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

app.use(express.static('public'));

const apiProxyTarget = process.env.API_PROXY_TARGET;

if (apiProxyTarget) {
  app.use('/graphql', proxy({ target: apiProxyTarget, changeOrigin: true }));
  app.use('/auth', proxy({ target: apiProxyTarget, changeOrigin: true }));
}

if (!process.env.UI_API_ENDPOINT) {
  process.env.UI_API_ENDPOINT = 'http://localhost:3000/graphql';
}

if (!process.env.UI_SERVER_API_ENDPOINT) {
  process.env.UI_SERVER_API_ENDPOINT = process.env.UI_API_ENDPOINT;
}
console.log(process.env.UI_AUTH_ENDPOINT);
if (!process.env.UI_AUTH_ENDPOINT) {
  process.env.UI_AUTH_ENDPOINT = 'http://localhost:3000/auth';
}

app.get('/env.js', (req, res) => {
  const env = {
    UI_API_ENDPOINT: process.env.UI_API_ENDPOINT,
    UI_AUTH_ENDPOINT: process.env.UI_AUTH_ENDPOINT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    FACEBOOK_APP_ID_OAUTH: process.env.FACEBOOK_APP_ID_OAUTH,
  };
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app.get('*', (req, res, next) => {
  console.log('*', req.params);
  render(req, res, next);
});
let server;
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const https = require('https');
  const key = fs.readFileSync(
    '/Users/nua/Workspace/pro-mern-stack-2/test-ssl.local.key'
  );
  const cert = fs.readFileSync(
    '/Users/nua/Workspace/pro-mern-stack-2/test-ssl.local.crt'
  );
  const options = {
    key: key,
    cert: cert,
  };
  server = https.createServer(options, app);
}
const port = process.env.PORT || 8000;
(server || app).listen(port, () => {
  console.log(`UI listen on port ${port}`);
});

if (module.hot) {
  module.hot.accept('./render.jsx');
}
