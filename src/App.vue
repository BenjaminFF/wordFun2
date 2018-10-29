<template>
  <div id="app">
    <my-header class="header" :defaultPage="isDefaultPage" :username="username"></my-header>
    <div class="main-content">
      <component :is="curComponent"></component>
    </div>
    <transition leave-active-class="animated fadeOut">
    <div class="shadow" v-if="Loading">
      <div class="loading" v-if="showLT"></div>
      <div class="load_text" v-if="showLT">W</div>
    </div>
  </transition>
  </div>
</template>

<script>
import MyHeader from "./components/my-header";
import DefaultPage from "./components/default-page";
import UserPage from "./components/user-page";
import { mapState,mapMutations } from 'vuex';
import nodersa from "node-rsa"
export default {
  name: 'App',
  data(){
    return{
      curComponent:DefaultPage,
      isDefaultPage:true,
      Loading:true,
      username:"",
      showLT:false           //show left toolbar
    }
  },
  created(){
    let login_token=this.getCookie("login_token");
    let currentPath=this.$router.currentRoute.fullPath;
    if(currentPath=='/'){
      this.showLT=true;
    }
    if(currentPath=='/createcontainer'){
      this.setCreateState(true);
    }else {
      this.setCreateState(false);
    }
    if(login_token!=""){
      this.axios.get("/static/wpublickey.pem").then((response)=>{
        let key=new nodersa(response.data);
        let curTime=new Date().getTime();
        let nonce=this.getRandomStr(5)+curTime;
        let reqdata={
          login_token:login_token,
          curTime:curTime,
          nonce:nonce
        }
        let jsondata=JSON.stringify(reqdata);
        let encryptdata=key.encrypt(jsondata,'base64');
        this.axios.post("/api/validate_token",{
          params: {
            encryptdata:encryptdata
          },
          timeout:10000,
        }).then((response)=>{
          console.log(response.data.result);
          if(response.data.result){
            let resdata=JSON.parse(login_token);
            this.isDefaultPage=false;
            this.curComponent=UserPage;
            this.username=resdata.username;
          }
          this.Loading=false;
        }).catch((error)=>{
          console.log(error);
        })
      });
    }else {
      this.Loading=false;
    }
  },
  components: {UserPage, DefaultPage, MyHeader},
  methods:{
    initFoldersAndSets(euname){
      let that=this;
      this.axios.get('/api/getfoldersandsets', {
        params: {
          username:euname
        }
      })
        .then((response)=>{
          console.log(response.data.sets);
          this.setFolders(response.data.folders);
          this.setSlideFolders();
          this.setWordSets(response.data.sets);
          this.Loading=false;
          console.log("App created");
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getRandomStr(length){
      let str="";
      for(let i=0;i<length;i++){
        str+=String.fromCharCode(Math.abs(Math.random()*26)+97);
      }
      return str;
    },
    ...mapMutations({
      setFolders:'wordset/setFolders',
      setSlideFolders:'wordset/setSlideFolders',
      setCreateState:'wordset/setCreateState',
      setWordSets:'wordset/setWordSets'
    }),
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
    --maximumblue:#3FA7D6;
    --royalblue:#4456DD;
    --vermilion:#DD6E42;
    --awesome:#FF1654;
    --lightseagreen: rgba(178, 219, 191, 0.5);
    --seagreen:#B2DBBF
  }

  body,html{
    width: 100%;
    height: 100%;
    background-color: #f3f3f3;
    overflow: hidden;
    font-family: "HandWritting1","PingFang SC";
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
    font-family: HandWritting1;
    src: url("./assets/font/handwritting1.ttf") format("opentype");
  }
  @keyframes rotate
  {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
</style>
