export default {
  checkLength(str) {
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
  },
  getChineseCount(str,end){
    let count=0;
    for(let i=0;i<end;i++){
      if(str.charCodeAt(i)>=127||str.charCodeAt(i)==94){
        count++;
      }
    }
    return count;
  },
}
