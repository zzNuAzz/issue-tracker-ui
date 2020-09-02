import serialize from 'serialize-javascript';
import dotenv from 'dotenv';
dotenv.config();
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
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '${process.env.FACEBOOK_APP_ID_OAUTH}',
          cookie     : true,
          xfbml      : true,
          version    : '${process.env.FACEBOOK_GRAPH_VERSION}'  
       });
      FB.AppEvents.logPageView();};
      
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>
        <div id="contents">${body}</div>
        <script>window.__INITIAL_DATA__ = ${serialize(initialData)}</script>
        <script>window.__USER_DATA__ = ${serialize(userData)}</script>
        <script src="/env.js"></script>
        <script src="/vendor.bundle.js"></script>
        <script src="/app.bundle.js"></script>
    </body>

    </html>`;
}
