import serialize from 'serialize-javascript';

export default function template(body, initialData, userData) {
  return `<!DOCTYPE HTML>
    <html lang="en">

    <head>
    <title>Pro MERN Stack</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
    <script src="https://apis.google.com/js/api:client.js"></script>
    <style>
 

    .panel-title a {
      display: block;
      cursor: pointer;
    }

    html {
      position: relative;
      min-height: 100%;
    }

    body {
      padding-top: 70px;
      padding-bottom: 70px;
      height: 100%
    }
  </style>
    </head>

    <body>
        <div id="contents">${body}</div>
        <script>window.__INITIAL_DATA__ = ${serialize(initialData)}</script>
        <script>window.__USER_DATA__ = ${serialize(userData)}</script>
        <script src="/env.js"></script>
        <script src="/vendor.bundle.js"></script>
        <script src="/app.bundle.js"></script>
    </body>

    </html>`;
}
