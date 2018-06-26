var mysql=require('mysql');
var pool=mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'Iamaman886.',
  database        : 'wordfun',
  port: '3306',
});

module.exports=pool;
