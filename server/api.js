const express=require('express');
const router=express.Router();
const mysql=require('mysql');



router.get('/api/verifyname',function (req,res) {
  if(req.query.username!=undefined){
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'Iamaman886.',
      port: '3306',
      database: 'benjamin',
    });
    connection.connect();
    var sql='select * from user where username=\''+req.query.username+'\'';
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
});

module.exports = router;
