const express=require('express');
const router=express.Router();
const mysql=require('mysql');

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

router.get('/api/verifyname',function (req,res) {
  queryData(req.query.username,res,'username');
});

router.get('/api/verifyemail',function (req,res) {
  queryData(req.query.email,res,'email');
});

module.exports = router;
