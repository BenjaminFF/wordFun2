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

function insertdata(username,email,password,res){
  var sql='insert into user(username,email,password) Values(\''+username+'\',\''+email+'\',\''
         +password+'\')';
  pool.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      res.send('err');
      return;
    }else {
      console.log("success");
      res.send('success');
    }
  });
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
        var password=key.decrypt(unescape(result[0].password),'utf8');
        var decryptpw=key.decrypt(unescape(pw),'utf8');
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
  escape(req.query.username);
  queryData(req.query.username,res,'username');
});

router.get('/api/verifyemail',function (req,res) {
  escape(req.query.email);
  queryData(req.query.email,res,'email');
});

router.post('/api/signup',function (req,res) {
    unescape(req.body.params.username);  //username可以为中文，客户端已转义一次，为了不出现乱码
    let username=escape(req.body.params.username);
    let email=escape(req.body.params.email);
    let password=escape(req.body.params.password);
    insertdata(username,email,password,res);
});

router.post('/api/login',function (req,res) {
  let username=unescape(req.body.params.eu);
  let password=unescape(req.body.params.pw);
  queryeup(escape(username),escape(password),res);
});

module.exports = router;
