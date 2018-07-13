const api=require('./api');

const path=require('path');

const fs = require('fs');

const bodyparser=require('body-parser');

const express = require('express');
const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));

app.use(api);

app.listen(8088);
