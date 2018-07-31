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
  queryData(req.query.username,res,'username');
});

router.get('/api/verifyemail',function (req,res) {
  escape(req.query.email);
  queryData(req.query.email,res,'email');
});

router.post('/api/signup',function (req,res) {
  let username = unescape(req.body.params.username);             //传过来的数据已经被escape一道了
  let email = unescape(req.body.params.email);
  let password = unescape(req.body.params.password);
  //insertdata(escape(username),escape(email),escape(password),res);
  let insertUserSql = 'insert into user(username,email,password) Values(\'' + escape(username) + '\',\''
    + escape(email) + '\',\'' + escape(password) + '\')';
  let insertDefaultFolder = 'insert into folder set ?';
  let folderdata = {
    title: 'All',
    author: escape(username)
  }
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.beginTransaction(function (err) {
      if (err) throw err;
      connection.query(insertUserSql, function (err) {
        if (err) {
          return connection.rollback(function (error, results, fields) {
            throw error;
          });
        }
        connection.query(insertDefaultFolder, folderdata, function (err) {
          if (err) {
            return connection.rollback(function () {
              throw err;
            });
          }
          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                throw err;
              });
            }
            console.log('success!');
            res.send('success');
            connection.release();
          })
        });
      });
    });
  });
});

router.post('/api/login',function (req,res) {
  let username=unescape(req.body.params.eu);
  let password=unescape(req.body.params.pw);
  queryeup(escape(username),escape(password),res);
});

router.get('/api/getfoldersandsets',function (req,res) {
  let getfoldersSql='select * from folder where author=?';
  let getsetsSql='select * from wordset where author=?';
  let folders=[];
  let sets=[];
  pool.getConnection((err,connection)=> {
    if(err) throw err;
    connection.beginTransaction((err)=>{
      if(err) throw err;
      connection.query(getfoldersSql,req.query.username,(err,result)=>{
        if(err){
          return connection.rollback((error, results, fields)=>{
            throw error;
          });
        }
        for(let i=0;i<result.length;i++){
          folders[i]=result[i].title;
        }
        connection.query(getsetsSql,req.query.username,(err,result)=>{
          if(err){
            return connection.rollback((error, results, fields)=>{
              throw error;
            });
          }
          for(let i=0;i<result.length;i++){
            let set=result[i];
            sets.push(set);
          };
          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                throw err;
              });
            }
            let data={
              folders:folders,
              sets:sets
            }
            let jsondata=JSON.stringify(data);
            console.log(jsondata);
            res.send(jsondata);
            connection.release();
          });
        })
      });
    });
  });
});
router.post('/api/pushwordset',function (req,res) {
  let cards = JSON.parse(req.body.params.jsoncards);
  let wordset = JSON.parse(req.body.params.jsonwordset);
  let valuesarr = [];
  for (let i = 0; i < cards.length; i++) {
    valuesarr.push(Object.values(cards[i]));
  }
  let insertcardsSql = 'insert into vocabulary values ?';
  let insertworsetSql='insert into wordset set ?';
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.beginTransaction(function (err) {
      if(err) throw err;
      connection.query(insertcardsSql, [valuesarr], function (err) {
        if (err) {
          return connection.rollback(function (error, results, fields) {
            throw error;
          });
        }
        connection.query(insertworsetSql, wordset, function (error, results, fields) {
          if (error) {
            return connection.rollback(function () {
              throw error;
            });
          }
          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function (err) {
                throw err;
              });
            }
            console.log('success!');
            res.send('success');
            connection.release();
          });
        })
      })
    })
  })
});

router.get('/api/getwordset',function (req,res) {
  pool.query('select * from wordset where author=?',req.query.username,function (err, result) {
    if (err) throw err;
    let sets=[];
    for(let i=0;i<result.length;i++){
      let set=result[i];
      sets.push(set);
    };
    let obj={
      sets:sets
    }
    let data=JSON.stringify(obj);
    res.send(data);
  });
});

router.post('/api/deleteSet',(req,res)=>{
  let createTime=req.body.params.createTime;
  let username=req.body.params.username;
  let dSetSql='delete from wordset where createtime=? and author=?';
  let dContentSql='delete from vocabulary where createtime=? and author=?';

  pool.getConnection((err,connection)=>{
    if(err) throw err;
    connection.beginTransaction((err)=>{
      if(err) throw err;

      connection.query(dSetSql,[createTime,username],(err)=>{
        if (err) {
          return connection.rollback((error)=> {
            throw error;
          });
        }

        connection.query(dContentSql,[createTime,username],(err)=>{
          if (err) {
            return connection.rollback((error)=> {
              throw error;
            });
          }

          connection.commit((err)=> {
            if (err) {
              return connection.rollback((err)=> {
                throw err;
              });
            }
            console.log('delete success!');
            res.send('delete success');
            connection.release();
          });
        })
      })
    })
  })
});

router.get('/api/getCards',(req,res)=>{
  let username=req.query.username;
  let createTime=req.query.createTime;
  let getCardsSql='select * from vocabulary where author=? and createtime=?';
  pool.query(getCardsSql,[username,createTime],(err,result)=>{
    if(err){
      res.send('err');
      throw err;
    }
    let cards=[];
    for(let i=0;i<result.length;i++){
      let term=result[i].term;
      let definition=result[i].definition;
      let card={
        term:term,
        definition:definition
      }
      cards.push(card);
    }
    let data=JSON.stringify(cards);
    res.send(data);
  });
});

module.exports = router;
