const express=require('express');
const router=express.Router();
const mysql=require('mysql');
const nodersa=require('node-rsa');
const fs=require('fs');

function queryData(value,res,column){
  if(value!=undefined){
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'Iamaman886.',
      port: '3306',
      database: 'benjamin',
    });
    connection.connect();
    var sql='select * from user where '+column+'=\''+value+'\'';
    connection.query(sql,function (err, result) {
      if(err){
        console.log('[SELECT ERROR] - '+err.message)
        res.send('error');
        return;
      }else {
        if(result[0]!=undefined){
          res.send('signed');
        }else {
          res.send('notsign');
        }
      }
    });
    connection.end();
  }else {
    res.send('error');
  }
}

function insertdata(username,email,password){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Iamaman886.',
    port: '3306',
    database: 'benjamin',
  });
  connection.connect();
  var sql='insert into user(username,email,password) Values(\''+username+'\',\''+email+'\',\''
         +password+'\')';
  connection.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      return;
    }else {
      console.log("success");
    }
  });
}

router.get('/api/verifyname',function (req,res) {
  queryData(req.query.username,res,'username');
});

router.get('/api/verifyemail',function (req,res) {
  queryData(req.query.email,res,'email');
});

router.get('/api/signup',function (req,res) {
  if(req.query.password!=undefined){
    console.log(req.query.password);
    var data = fs.readFileSync('wprivatekey.pem');
    var key=new nodersa(data);
    var password=key.decrypt(req.query.password,'utf8');
    insertdata(req.query.username,req.query.email,password);
    res.send('insert success');
  }else {
    res.send('unknown error');
  }
});

module.exports = router;
