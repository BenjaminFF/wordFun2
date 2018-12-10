var mysql=require('mysql');
var pool=mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'Iamaman',
  database        : 'wordfun',
  port: '3306',
  multipleStatements: true
});

module.exports=pool;
