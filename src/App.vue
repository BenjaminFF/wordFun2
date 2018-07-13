<template>
  <div id="app">
    <my-header class="header" :defaultPage="isDefaultPage"></my-header>
    <div class="main-content">
      <component :is="curComponent"></component>
    </div>
    <transition leave-active-class="animated fadeOut" :duration="3000">
    <div class="shadow" v-if="Loading">
      <div class="loading"></div>
      <div class="load_text">W</div>
    </div>
  </transition>
  </div>
</template>

<script>
import MyHeader from "./components/my-header";
import DefaultPage from "./components/default-page";
import UserPage from "./components/user-page";
export default {
  name: 'App',
  data(){
    return{
      curComponent:DefaultPage,
      isDefaultPage:true,
      Loading:true
    }
  },
  created(){
    let euname=this.getCookie("euname");        //存入cookie中的还是经过escape后的，避免中文乱码
    let password=this.getCookie("password");
    let that=this;
    if(euname!=""&&password!=""){
      this.axios.post('/api/login', {
        params: {
          eu:euname,
          pw:password
        }
      }).then(function (response) {
        if(response.data=="truepw"){
          that.curComponent=UserPage;
          that.isDefaultPage=false;
        }
        setTimeout(function () {
          that.Loading=false;
        },3000);
      });
    }
  },
  components: {UserPage, DefaultPage, MyHeader},
  methods:{
    getCookie(c_name){                   //如果找到了我们要的 cookie，就返回值，否则返回空字符串。
      if (document.cookie.length>0)
      {
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
          c_start=c_start + c_name.length+1
          let c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length;
          return unescape(document.cookie.substring(c_start,c_end))
        }
      }
      return ""
    },
  }
}
</script>

<style>
  @import  '../node_modules/animate.css/animate.css';
  :root{
    --seablue: #0b8691;
    --lightblue: rgba(11, 141, 152, 0.51);
    --tealdeer:#86E7B8;
    --celestialblue:#3C9CD7;
    --wintergreen:#4A9180;
    --transblue: rgba(11, 134, 145, 0.21);
  }

  body,html{
    width: 100%;
    height: 100%;
    background-color: #f3f3f3;
    overflow: hidden;
    font-family: "HuaYI","HandWritting1";
    font-size: 1.3rem;
  }
  body,div,p{
    margin: 0;
    padding: 0;
  }
  #app{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header{
    flex: 1 0 0;
  }
  .main-content{
    width: 100%;
    flex: 8 0 0;
    display: flex;
  }
  .shadow{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    background-color: #f3f3f3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading{
    position: absolute;
    width: 6rem;
    height: 6rem;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid var(--seablue);
    clip: rect(0,6rem,3rem,0rem);
    transform-origin: center;
    animation: rotate 1.5s infinite linear;
  }
  .load_text{
    position: absolute;
    width: 6rem;
    height: 6rem;
    box-sizing: border-box;
    border: 2px solid var(--transblue);
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    color: var(--seablue);
    font-size: 2rem;
  }
  @font-face {
    font-family: HuaYI;
    src: url("./assets/font/HYQuBaoF2.ttf") format("opentype");
  }

  @font-face {
    font-family: HandWritting1;
    src: url("./assets/font/handwritting1.ttf") format("opentype");
  }
  @keyframes rotate
  {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
</style>
