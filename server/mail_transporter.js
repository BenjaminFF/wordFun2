const nodemailer=require('nodemailer');

let transporter=nodemailer.createTransport({
  host:'smtp.qq.com',
  secureConnection: true, // use SSL
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: '990460889@qq.com',
    pass: 'ujhkenbyzqxqbeie'  //授权码
  }
})

module.exports=transporter;




