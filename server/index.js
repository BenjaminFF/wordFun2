const api=require('./api');

const path=require('path');

const fs = require('fs');

const bodyparser=require('body-parser');

const express = require('express');

const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname,'../dist')));

app.use(api);

app.listen(8080);



