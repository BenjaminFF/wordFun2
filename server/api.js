const express=require('express');
const router=express.Router();

router.get('/api/signup',function (req,res) {
  res.send('hello nodejs');
});

module.exports = router;
