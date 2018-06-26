const express=require('express');
const router=express.Router();
const pool=require('./mysql_pool');
const nodersa=require('node-rsa');
const fs=require('fs');

function queryData(value,res,column){
  if(value!=undefined){
    var sql='select * from user where '+column+'=\''+value+'\'';
    pool.query(sql,function (err, result) {
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
  }else {
    res.send('error');
  }
}

function insertdata(username,email,password){
  var sql='insert into user(username,email,password) Values(\''+username+'\',\''+email+'\',\''
         +password+'\')';
  pool.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      return;
    }else {
      console.log("success");
    }
  });
  pool.query('')
}

function queryeup(eu,pw,res){
  var eusql='select password from user where username =\''+eu+'\' or email=\''+eu+'\'';
  pool.query(eusql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      res.send('error');
      return;
    }else {
      if(result[0]==undefined){
        res.send('euempty');
        return;
      }else {
        var data = fs.readFileSync('wprivatekey.pem');
        var key=new nodersa(data);
        var password=key.decrypt(result[0].password,'utf8');
        var decryptpw=key.decrypt(pw,'utf8');
        if(password==decryptpw){
          res.send('truepw');
        }else {
          res.send('falsepw');
        }
        return;
      }
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
    insertdata(req.query.username,req.query.email,req.query.password);
    res.send('insert success');
  }else {
    res.send('unknown error');
  }
});

router.get('/api/login',function (req,res) {
  queryeup(req.query.eu,req.query.pw,res);
});

module.exports = router;
