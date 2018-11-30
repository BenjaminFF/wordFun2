const api=require('./api');

const path=require('path');

const fs = require('fs');

const http=require('http');

const https=require('https');

const bodyparser=require('body-parser');

const express = require('express');

const cookieParser = require('cookie-parser');

const app = express();

app.all('*', ensureSecure); // at top of routing calls

app.use(cookieParser());

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname,'../dist')));

app.use(api);

const options={
  key:fs.readFileSync('./sslcert/ewordfunssl.key'),
  cert:fs.readFileSync('./sslcert/ewordfunssl.pem')
}

function ensureSecure(req, res, next){
  if(req.secure){
    // OK, continue
    return next();
  };
  // handle port numbers if you need non defaults
  // res.redirect('https://' + req.host + req.url); // express 3.x
  res.redirect('https://' + req.hostname + req.url); // express 4.x
}

http.createServer(app).listen(80);
https.createServer(options,app).listen(443);



