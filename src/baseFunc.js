  exports.install=function (Vue,options) {
  Vue.prototype.getCookie=function (c_name) {      //如果找到了我们要的 cookie，就返回值，否则返回空字符串。
      if (document.cookie.length>0)
      {
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
          c_start=c_start + c_name.length+1;
          let c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length;
          return unescape(document.cookie.substring(c_start,c_end))
        }
      }
      return ""
  },
  Vue.prototype.setCookie=function (c_name,value,expiredays) {
      var exdate=new Date()
      exdate.setDate(exdate.getDate()+expiredays)
      document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
  },
  Vue.prototype.delCookie=function (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval =this.getCookie(name);
      if (cval != "")
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },
  Vue.prototype.checkLength=function (str) {
      let len=0;
      let newStr;
      for(let i=0;i<str.length;i++){
        if(str.charCodeAt(i)>=127||str.charCodeAt(i)==94){            //中文字符算2个Length
          len+=2;
        }else {
          len++;
        }
      }
      return len;
  }
}
