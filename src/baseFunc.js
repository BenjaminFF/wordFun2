  exports.install=function (Vue,options) {
    Vue.prototype.getCookie = function (c_name) {      //如果找到了我们要的 cookie，就返回值，否则返回空字符串。
      if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          let c_end = document.cookie.indexOf(";", c_start)
          if (c_end == -1) c_end = document.cookie.length;
          return decodeURIComponent(document.cookie.substring(c_start, c_end))
        }
      }
      return ""
    },
      Vue.prototype.setCookie = function (c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + encodeURIComponent(value) +
          ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
      },
      Vue.prototype.delCookie = function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != "")
          document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      },
      Vue.prototype.checkLength = function (str) {
        let len = 0;
        let newStr;
        for (let i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) >= 127 || str.charCodeAt(i) == 94) {            //中文字符算2个Length
            len += 2;
          } else {
            len++;
          }
        }
        return len;
      },
      Vue.prototype.checkChinese=function(str){
        let count=0;
        for (let i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) >= 127 || str.charCodeAt(i) == 94) {            //中文字符算2个Length
            count++;
          }
        }
        return count;
      },
      Vue.prototype.limitLength=function(str,maxlength,hasEllipsis){
        if(this.checkLength(str)>maxlength){
          let chineseCount=this.checkChinese(str);
          if(hasEllipsis){
            str=str.substring(0,Math.round(maxlength-chineseCount/2))+'...';
          }else {
            str=str.substring(0,Math.round(maxlength-chineseCount/2));
          }
        }
        return str;
      },
      Vue.prototype.randomColor = function (opacity) {
        var r = Math.round(Math.random() * 256);
        var g = Math.round(Math.random() * 256);
        var b = Math.round(Math.random() * 256);
        var a = opacity;
        if (r >= 200 && g >= 200 && b >= 200) {              //远离白色
          r -= 50;
        }
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      },
      Vue.prototype.getColor=function (colorArray) {
        let colorslen=colorArray.length;
        let randomIndex=parseInt(Math.random()*colorslen);
        return colorArray[randomIndex];
      }
      Vue.prototype.getSpecialColor=function(){
        let bgs=['#247BA0','#70C1B3','#B2DBBF','#2EC4B6','#FF9F1C','#9BC53D','#5BC0EB','#B5838D','#E5989B'];
        return this.getColor(bgs);
      },
      Vue.prototype.getRandomStr=function(strLength) {
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
        for (let i = 0; i < strLength; i++) {
          let index=parseInt(Math.random()*randomCharArr.length)
          str +=randomCharArr[index];
        }
        return str;
      }
  }
