const express=require('express');
const router=express.Router();
const pool=require('./mysql_pool');
const nodersa=require('node-rsa');
const fs=require('fs');

function queryData(value,res,column){
    var sql='select * from user where '+column+'=\''+value+'\'';
    pool.query(sql,function (err, result) {
      if(err){
        console.log('[SELECT ERROR] - '+err.message)
        return;
      }else {
        if(result[0]!=undefined){
          let json={
            signed:true
          }
          let data=JSON.stringify(json);
          res.send(data);
        }else {
          let json={
            signed:false
          }
          let data=JSON.stringify(json);
          res.send(data);
        }
      }
    });
}

function queryFolder(username,res) {
  var sql='select * from folder where author=\''+username+"\'";
  pool.query(sql,function (err,result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      res.send('err');
      return;
    }else {
      if(result.length!=0){
        res.send(result);
        return;
      }
    }
  });
}

function insertdata(username,email,password,res){
  var sql='insert into user(username,email,password) Values(\''+username+'\',\''+email+'\',\''
         +password+'\')';
  pool.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      return;
    }else {
      res.send('success');
    }
  });
}

function queryeup(eu,pw,res){
  var eusql='select * from user where username =\''+eu+'\' or email=\''+eu+'\'';
  pool.query(eusql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      res.send('error');
      return;
    }else {
      if(result[0]==undefined){
        let json={
          result:'empty'
        }
        let data=JSON.stringify(json);
        res.send(data);
        return;
      }else {
        console.log(result[0].username);
        var data = fs.readFileSync('wprivatekey.pem');
        var key=new nodersa(data);
        var password=key.decrypt(unescape(result[0].password),'utf8');
        var decryptpw=key.decrypt(unescape(pw),'utf8');
        if(password==decryptpw){
          let json={
            result:true,
            username:result[0].username
          }
          let data=JSON.stringify(json);
          res.send(data);
        }else {
          let json={
            result:false,
          }
          let data=JSON.stringify(json);
          res.send(data);
        }
        return;
      }
    }
  });
}

router.get('/api/verifyname',function (req,res) {
  escape(req.query.username);
  console.log(req.query.username);
  queryData(req.query.username,res,'username');
});

router.get('/api/verifyemail',function (req,res) {
  escape(req.query.email);
  queryData(req.query.email,res,'email');
});

router.post('/api/signup',function (req,res) {
    let username=unescape(req.body.params.username);             //传过来的数据已经被escape一道了
    let email=unescape(req.body.params.email);
    let password=unescape(req.body.params.password);
    console.log(req.body.params.username);
    insertdata(escape(username),escape(email),escape(password),res);
});

router.post('/api/login',function (req,res) {
  let username=unescape(req.body.params.eu);
  let password=unescape(req.body.params.pw);
  queryeup(escape(username),escape(password),res);
});

router.get('/api/getfolder',function (req,res) {
  if(req.query.username!=undefined){
    queryFolder(req.query.username,res);
  }
});
router.post('/api/pushwordset',function (req,res) {
  let cards=JSON.parse(req.body.params.jsoncards);
  let valuesarr=[];
  for(let i=0;i<cards.length;i++){
    valuesarr.push(Object.values(cards[i]));
  }
  let insertcardsSql='insert into vocabulary values ?';
  pool.query(insertcardsSql,[valuesarr],function (err) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      res.send('error');
      return;
    }else {
      res.send('success');
    }
  });
})
module.exports = router;
