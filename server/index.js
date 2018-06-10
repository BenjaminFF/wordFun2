const api=require('./api');

const path=require('path');

const fs = require('fs');

const express = require('express');
const app = express();

app.use(api);

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/user', function (req, res) {
  res.send('Hello World!');
});

app.listen(8088);
