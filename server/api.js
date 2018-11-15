const express=require('express');
const router=express.Router();
const pool=require('./mysql_pool');
const nodersa=require('node-rsa');
const mysql=require('mysql');
const fs=require('fs');
const redis=require("redis");
const svgCaptcha = require('svg-captcha');
const bcrypt = require('bcrypt');

function queryData(value,res,column){
    var sql='select * from user where '+ column + '= ?';
    pool.query(sql,value,function (err, result) {
      if(err){
        res.send('err');
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

router.use((req,res,next)=> {                    //增删改set都需要有auth

  let require_auth_urls=['/api/validate_auth','/api/pushSV','/api/deleteSet','/api/logout',
  '/api/updateSV','/api/updateflashs','/api/updatematrixs','/api/updatewrites'];
  let isAuthRequired=false;
  for(let i=0;i<require_auth_urls.length;i++){
    if(req.url==require_auth_urls[i]){
      isAuthRequired=true;
      break;
    }
  }
  console.log(req.url+" isAuthRequired: "+isAuthRequired);

  if(isAuthRequired){
    let curTime=req.body.params.curTime;
    let nonce=req.body.params.nonce;
    let web_auth_key=req.cookies.web_auth_key;
    let web_auth_value=req.cookies.web_auth_value;
    if(curTime==undefined||nonce==undefined||web_auth_key==undefined||web_auth_value==undefined){
      let data={
        result:false,
        info:'invalid params!'
      }
      res.send(JSON.stringify(data));
    }else {
      if(new Date().getTime()-curTime>=60*1000){
        let data={
          result:false,
          info:'judged as reply attack because timeout!'
        }
        res.send(JSON.stringify(data));
        return;
      }

      let mClient=redis.createClient();
      mClient.smembers("user_web_auth nonce",(err,replies)=>{
        if(err){
          let data={
            result:false,
            info:'unknown err'
          }
          res.send(JSON.stringify(data));
          mClient.quit();
          throw err;
        }
        for(let i=0;i<replies.length;i++){
          if(nonce==replies[i]){
            let data={
              result:false,
              info:'judged as reply attack because nonce repeat!'
            }
            res.send(JSON.stringify(data));
            mClient.quit();
            return;
          }
        }
        mClient.sadd("user_web_auth nonce",nonce);
        if(replies.length>=60*1000){        //假设一分钟最多有60000个请求
          mClient.del("user_web_auth nonce");
        }
        //到这步排除重放攻击
        mClient.get(web_auth_key,(err,reply)=>{
          if(err){
            let data={
              result:false,
              info:'unknown err'
            }
            res.send(JSON.stringify(data));
            mClient.quit();
            throw err;
          }
          if(reply==null){       //user_web_auth没有
            let data={
              result:false,
              info:'web_auth is expired!'
            }
            res.send(JSON.stringify(data));
          }else if(reply!=web_auth_value){
            let data={
              result:false,
              info:'web_auth_value is incorrect!'
            }
            res.send(JSON.stringify(data));
          }else {
            next();
          }
          mClient.quit();
        });
      });
    }
  }else {
    next();
  }

});

router.get('/api/verifyname',function (req,res) {
  queryData(req.query.username,res,'username');
});

router.get('/api/verifyemail',function (req,res) {
  encodeURIComponent(req.query.email);
  queryData(req.query.email,res,'email');
});

//先模拟以下，域名通过以后再完善发送邮箱
router.post('/api/sendEmail',(req,res)=>{
  let curTime=new Date().getTime();
  let sendEmail_nonce=req.body.params.nonce;
  let email=req.body.params.email;
  if(curTime-req.body.params.curTime<60*1000){
    let mClient=redis.createClient();
    mClient.smembers("sendEmail_nonce",(err,replies)=>{
      if(err) throw err;
      let is_illegal=true;
      for(let i=0;i<replies.length;i++){
        if(sendEmail_nonce==replies[i]){
          res.send("illegal request");
          mClient.quit();
          return;
        }
      }

      mClient.sadd("sendEmail_nonce",sendEmail_nonce);
      if(replies.length>30*1000){
          mClient.del("sendEmail_nonce");
      }
      let key=email;
      let randomCode=getRandomStr(6);
      mClient.set(key,randomCode,"EX",60*60);        //1小时后过期
      console.log(randomCode);
      mClient.quit();
      let data={
          result:true
      }
      res.send(JSON.stringify(data));
      //sendEmail...
    });
  }else {
    res.send("illegal request");
  }
});

//注册的用户名和邮箱是被encode过了的
router.post('/api/signup',function (req,res) {
  let wprivatekey=fs.readFileSync('wprivatekey.pem');
  var key=new nodersa(wprivatekey);
  let reqdata=JSON.parse(key.decrypt(req.body.params.encryptdata,'utf8'));
  let curTime=new Date().getTime();
  if(curTime-reqdata.curTime<60*1000){
    let mClient=redis.createClient();
    mClient.smembers("signup nonce",(err,replies)=>{
      if(err){
        res.send("err");
        throw err;
      }

      for(let i=0;i<replies.length;i++){
        if(reqdata.nonce==replies[i]){
          res.send("illegal request");
          mClient.quit();
          return;
        }
      }
      mClient.sadd("signup nonce",reqdata.nonce);
      if(replies.length>=30*1000){
        mClient.del("signup nonce");
      }

      mClient.get(reqdata.email,(err,reply)=>{
        if(reply==null||reply.toUpperCase()!=reqdata.rCode.toUpperCase()){
          let data={
            result:false
          }
          res.send(JSON.stringify(data));
          mClient.quit();
        }else {
          signup_insertData(reqdata,res);
        }
      });
    });
  }
});

function signup_insertData(reqdata,res) {
  let saltRounds=10;
  bcrypt.hash(reqdata.password,saltRounds,(err,hash)=>{
    if(err){
      res.send("bcrypt err");
      throw err;
    }
    pool.getConnection((err,connection)=>{
      if(err){
        res.send("pool connection err");
        throw err;
      }

      connection.beginTransaction((err)=>{
        if(err){
          res.send("pool connection err");
          throw err;
        }
        let user={
          username:reqdata.username,
          email:reqdata.email,
          password:hash
        }
        connection.query("insert into user set ?",user,(err)=>{
          if (err) {
            res.send('pool connection err');
            return connection.rollback(function (error, results, fields) {
              throw error;
            });
          }

          connection.query("insert into folder (title,author) values (? , ?)",
            ["all",reqdata.username],(err)=>{
              if (err) {
                res.send('pool connection err');
                return connection.rollback(function (error, results, fields) {
                  throw error;
                });
              }

              connection.commit(function (err) {
                if (err) {
                  res.send('pool connection err');
                  return connection.rollback(function (err) {
                    throw err;
                  });
                }
                let data={
                  result:true
                }
                res.send(JSON.stringify(data));
                connection.release();
              });
          })
        });
      });
    });
  });
};

function getRandomStr(strLength) {
  let str = "";
  let randomCharArr=[];
  for(let i=0;i<10;i++){
    randomCharArr.push(String.fromCharCode(i+48));
  }
  for(let i=0;i<26;i++){
    randomCharArr.push(String.fromCharCode(i+65));
  }
  for(let i=0;i<26;i++){
    randomCharArr.push(String.fromCharCode(i+97));
  }
  for(let i=0;i<9;i++){
    randomCharArr.push(i);
  }
  for (let i = 0; i < strLength; i++) {
    let index=parseInt(Math.random()*randomCharArr.length)
    str +=randomCharArr[index];
  }
  return str;
};

router.get('/api/captcha',(req,res)=>{
  var captcha = svgCaptcha.create({
    size:5,
    color:false,
    fontSize:35
  });
  res.type('svg');
  let text=captcha.text;
  let curTime=new Date().getTime();
  let json={
    captchaData:captcha.data,
    captchaKey:getRandomStr(10)+curTime+getRandomStr(10)          //后来用来验证captcha的key
  }
  let mClient=redis.createClient();
  mClient.set(json.captchaKey,captcha.text,"EX",60*3);       //3分钟过期
  res.send(JSON.stringify(json));
});

router.post('/api/validate_auth',(req,res)=>{
  //前面的验证中间件已经做了
  let data={
    result:true,
    info:'validate_auth succeed!'
  }
  res.send(JSON.stringify(data));
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
      mClient.get(data.captchaKey,(err,reply)=>{
        console.log(reply);
        if(err){
          res.send("err");
          throw err;
        }
        if(reply==null){
          let data={
            result:"captcha expired"
          }
          res.send(JSON.stringify(data));
          mClient.quit();
        }else {
          if(reply.toUpperCase()!=data.captchaResText.toUpperCase()){
            let data={
              result:"incorrect captcha"
            }
            res.send(JSON.stringify(data));
            mClient.quit();
          }else {
            queryeup(decodeURIComponent(data.eu),data.pw,res,mClient);
          }
        }
      });
    });
  }else {
    res.send("illegal request");
  }
});

router.post('/api/logout',(req,res)=>{
  res.clearCookie("web_auth_key");
  res.clearCookie("web_auth_value");
  let web_auth_key=req.cookies.web_auth_key;
  let mClient=redis.createClient();
  mClient.del(web_auth_key);
  mClient.quit();
  res.send("delCookie succeed!");
});

function queryeup(eu,pw,res,mClient){
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
        mClient.quit();
        return;
      }else {
        bcrypt.compare(pw,result[0].password,(err,compare_result)=>{
          if(compare_result==true){
            let web_auth_key=result[0].username+getRandomStr(20);
            let web_auth_value=getRandomStr(128);
            res.cookie("web_auth_key",web_auth_key,{maxAge:60*1000*60*24*15,httpOnly:true});
            res.cookie("web_auth_value",web_auth_value,{maxAge:60*1000*60*24*15,httpOnly:true});
            mClient.set(web_auth_key,web_auth_value,"EX",60*60*24*15);    //15天过期
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
          mClient.quit();
        })
      }
    }
  });
};

function EqualSet(arr,obj){            //createtime等，set就相等。一个set可以属于多个folder
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].createtime === obj.createtime) {
      return true;
    }
  }
  return false;
}

router.get('/api/getwordsets',function (req,res) {
  pool.query('select * from wordset where author=?',req.query.username,function (err, result) {
    if (err) throw err;
    let sets=[];
    for(let i=0;i<result.length;i++){
      if(!EqualSet(sets,result[i])){
        sets.push(result[i]);
      }
    };
    let obj={
      sets:sets
    }
    let data=JSON.stringify(obj);
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

router.get('/api/verifyfolder',(req,res)=>{
  let username=req.query.username;
  let title=req.query.title;
  pool.query('select * from folder where author=? and title=?',[username,title],(err,result)=>{
    if(err){
      res.send('unknown err');
      throw err;
    }else {
      let data={
        created:false
      }
      if(result[0]!=undefined){
        data.created=true;
      }
      res.send(JSON.stringify(data));
    }
  });
});

router.get('/api/getFolders',(req,res)=>{
  let username=req.query.author;
  pool.query('select * from folder where author=?',[username],(err,result)=>{
    if(err){
      res.send('err');
      throw err;
    }

    let folders=[];
    for(let i=0;i<result.length;i++){
      folders.push(result[i].title);
    }

    res.send(JSON.stringify(folders));
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

router.post('/api/pushSV',function (req,res) {          //push set,vocabulary
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

router.post('/api/deleteSet',(req,res)=>{
  let username=req.body.params.username;
  let createTime=req.body.params.createTime;

  let dSetSql='delete from wordset where createtime=? and author=?';
  let dContentSql='delete from vocabulary where createtime=? and author=?';

  pool.getConnection((err,connection)=>{
    if(err) {
      res.send('err');
      throw err;
    }
    connection.beginTransaction((err)=>{
      if(err) {
        res.send('err');
        throw err;
      }

      connection.query(dSetSql,[createTime,username],(err)=>{
        if (err) {
          res.send('err');
          return connection.rollback((error)=> {
            throw error;
          });
        }

        connection.query(dContentSql,[createTime,username],(err)=>{
          if (err) {
            res.send('err');
            return connection.rollback((error)=> {
              throw error;
            });
          }

          connection.commit((err)=> {
            if (err) {
              res.send('err');
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

router.post('/api/updateSV',(req,res)=>{           //先将vocabulary里面的所有内容删除，然后再重新加,set可以用update
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

function multiUpdate(data,author,columnName,res){
  for(let i=0;i<data.length;i++){
    if(data[i][columnName]!=1&&data[i][columnName]!=0){
      res.send("illegal request!");
      return;
    }
  }
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

router.post('/api/updatematrixs',(req,res)=>{
  let matrixs=JSON.parse(req.body.params.jsondata);
  let author=req.body.params.username;
  console.log(matrixs);
  multiUpdate(matrixs,author,"matrixed",res);
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
