const express=require('express');
const router=express.Router();
const pool=require('./mysql_pool');
const nodersa=require('node-rsa');
const mysql=require('mysql');
const fs=require('fs');
const redis=require("redis");

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
  let curTime=new Date().getTime();
  let wprivatekey=fs.readFileSync('wprivatekey.pem');
  var key=new nodersa(wprivatekey);
  let data=JSON.parse(key.decrypt(req.body.params.encryptdata,'utf8'));
  if(curTime-data.curTime<60*1000){       //一次正常的http请求不会超过60s
    let mClient=redis.createClient();
    mClient.smembers("login nonce",function(err,replies){
      if(err) throw err;
      for(let i=0;i<replies.length;i++){
        if(data.nonce==replies[i]){
          res.send("illegal request");
          return;
        }
      }
      if(replies.length>=60*1000){        //假设一分钟内有60000条请求
        mClient.del("login nonce");
      }
      mClient.sadd("login nonce",data.nonce);
      //到这步就排除了重放攻击，因为一分钟之内即使把加密数据劫持了之后，再直接传过来，nonce就已经重复
      let token=data.eu+data.nonce;
      queryeup(decodeURIComponent(data.eu),data.pw,res,mClient,data.nonce);
    });
  }else {
    res.send("illegal request");
  }
});

function queryeup(eu,pw,res,mClient,nonce){
  var eusql='select * from user where username =? or email=?';
  pool.query(eusql,[eu,eu],function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - '+err.message)
      res.send("query error");
    }else {
      if(result[0]==undefined){
        let json={
          result:'empty'
        }
        res.send(JSON.stringify(json));
        return;
      }else {
        var data = fs.readFileSync('wprivatekey.pem');
        var key=new nodersa(data);
        var password=key.decrypt(result[0].password,'utf8');
        if(password==pw){      //如果密码正确，则保存token(跟随客户端一起传过来的，客户端下要保存在cookie中)，以便下次直接登陆
          let token={
            username:result[0].username,
            token:nonce
          }
          mClient.sadd("valid login token",JSON.stringify(token));
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
      }
    }
    mClient.quit();
  });
}

router.post('/api/validate_token',(req,res)=>{
  let curTime=new Date().getTime();
  let wprivatekey=fs.readFileSync('wprivatekey.pem');
  var key=new nodersa(wprivatekey);
  let reqdata=JSON.parse(key.decrypt(req.body.params.encryptdata,'utf8'));
  if(reqdata.curTime-curTime<=60*1000){
    let mClient=redis.createClient();
    mClient.smembers("validate_token nonce",function(err,replies){
      if(err) throw err;
      for(let i=0;i<replies.length;i++){
        if(replies[i]==reqdata.nonce){
          res.send("illegal request");
          mClient.quit();
          return;
        }
      }
      mClient.sadd("validate_token nonce",reqdata.nonce);
      if(replies.length>=60*1000){
        mClient.del("validate_token nonce");
      }
      mClient.smembers("valid login token",(err,replies)=>{
        if(err) throw err;
        for(let i=0;i<replies.length;i++){
          console.log("reqdata.login_token: "+reqdata.login_token);
          console.log("valid login token: "+replies[i]);
          if(replies[i]==reqdata.login_token){
            let resdata={
              result:true
            }
            res.send(JSON.stringify(resdata));
            mClient.quit();
            return;
          }
        }
        let resdata={
          result:false
        }
        res.send(JSON.stringify(resdata));
        mClient.quit();
      });
    });
  }else {
    res.send("illegal request");
  }
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
      let matrixed=result[i].matrixed;
      let writed=result[i].writed;
      let card={
        vid:result[i].vid,
        term:term,
        definition:definition,
        matrixed:matrixed,
        writed:writed,
        flashed:result[i].flashed
      }
      cards.push(card);
    }
    let data=JSON.stringify(cards);
    res.send(data);
  });
});

router.get('/api/getmCards',(req,res)=>{
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
      let mmatrixed=result[i].mmatrixed;
      let mwrited=result[i].mwrited;
      let mflashed=result[i].mflashed;
      let card={
        vid:result[i].vid,
        term:term,
        definition:definition,
        mmatrixed:mmatrixed,
        mwrited:mwrited,
        mflashed:mflashed,
      }
      cards.push(card);
    }
    let data=JSON.stringify(cards);
    res.send(data);
  });
});        //get mobile cards,里面的writed等记录不同

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

router.post('/api/updatewordset',(req,res)=>{           //先将vocabulary里面的所有内容删除，然后再重新加,set可以用update
  let setInfo=JSON.parse(req.body.params.jsonwordset);
  let cards=JSON.parse(req.body.params.jsoncards);
  let updateSetSql='update wordset set title=?,subtitle=?,folder=?,termCount=? where createtime=? and author=?';
  let deleteCardsSql='delete from vocabulary where createtime=? and author=?';
  let insertCardsSql='insert into vocabulary values ?';
  let valuesarr = [];
  for (let i = 0; i < cards.length; i++) {
    valuesarr.push(Object.values(cards[i]));
  }
  pool.getConnection((err,connection)=>{
    connection.beginTransaction(err=>{
      if(err) throw err;
      connection.query(updateSetSql,[setInfo.title,
        setInfo.subtitle,setInfo.folder,
        setInfo.termCount,setInfo.createtime,setInfo.author],(err)=>{
        if (err) {
            return connection.rollback((error)=> {
              throw error;
            });
        }
        connection.query(deleteCardsSql,[setInfo.createtime,setInfo.author],(err)=>{
          if (err) {
            return connection.rollback((error)=> {
              throw error;
            });
          }

          connection.query(insertCardsSql,[valuesarr],(err)=>{
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
              console.log('update success!');
              res.send('update success');
              connection.release();
            });
          });
        })
      });
    });
  });
});

router.post('/api/updatematrix',(req,res)=>{
  let vid=req.body.params.vid;
  let euname=req.body.params.euname;

  pool.query('update vocabulary set matrixed=1 where vid=? and author=?',[vid,euname],(err)=>{
    if(err){
      res.send('err');
      throw err;
    }
    res.send('success');
  });
});

router.post('/api/updatematrixs',(req,res)=>{
  let createtime=req.body.params.createtime;

  let euname=req.body.params.euname;
  pool.query('update vocabulary set matrixed=0 where createtime=? and author=?',[createtime,euname],(err)=>{
    if(err){
      res.send('err');
      throw err;
    }
    res.send('success');
  });
});

function multiUpdate(data,author,columnName,res){
  let multiupdatesql="update vocabulary set "+columnName+"=case ";
  let i=0;
  var wheresql='where vid in (';
  data.forEach((item,index)=>{
    multiupdatesql+=mysql.format('when vid=? and author=? then ? ',[item.vid,author,item[columnName]]);
    if(index!=data.length-1){
      wheresql+=mysql.format('?,',[item.vid]);
    }else {
      wheresql+=mysql.format('?) ',[item.vid]);
    }
  });
  multiupdatesql+='END ';
  wheresql+=mysql.format('and author=?',[author]);
  multiupdatesql+=wheresql;

  pool.query(multiupdatesql,function (error) {
    if (error) {
      res.send('err');
      throw error;
    }
    res.send('multi update success');
  });
}

router.post('/api/updateflashs',(req,res)=>{
  let flashes=JSON.parse(req.body.params.jsondata);
  let author=req.body.params.username;
  multiUpdate(flashes,author,"flashed",res);
});

router.post('/api/updatewrites',(req,res)=>{
  let writes=JSON.parse(req.body.params.jsondata);
  let author=req.body.params.username;
  multiUpdate(writes,author,"writed",res);
});

router.post('/api/updatemflashs',(req,res)=>{
  let mflashes=req.body;
  var multiupdatesql='update vocabulary set mflashed=case ';
  var i=0;
  var wheresql='where vid in (';
  mflashes.forEach((item,index)=>{
    multiupdatesql+=mysql.format('when vid=? and author=? then ? ',[item.vid,item.author,item.mflashed]);
    if(index!=mflashes.length-1){
      wheresql+=mysql.format('?,',item.vid);
    }else {
      wheresql+=mysql.format('?) ',item.vid);
    }
  });
  let author=mflashes[0].author;
  multiupdatesql+='END ';
  wheresql+=mysql.format('and author=?',[author]);
  multiupdatesql+=wheresql;
  pool.query(multiupdatesql,function (error) {
    if (error) {
      res.send('err');
      throw error;
    }

    res.send('multi update success');
  });
});



module.exports = router;
