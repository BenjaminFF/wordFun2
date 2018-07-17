<template>
  <div id="app">
    <my-header class="header" :defaultPage="isDefaultPage" :username="username"></my-header>
    <div class="main-content">
      <component :is="curComponent"></component>
    </div>
    <transition leave-active-class="animated fadeOut">
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
import { mapState,mapMutations } from 'vuex'
export default {
  name: 'App',
  data(){
    return{
      curComponent:DefaultPage,
      isDefaultPage:true,
      Loading:true,
      username:""
    }
  },
  created(){
    let euname=this.getCookie("euname");        //存入cookie中的还是经过escape后的，避免中文乱码
    let password=this.getCookie("password");
    console.log(euname);
    let that=this;
    if(euname!=""&&password!=""){
      this.axios.post('/api/login', {
        params: {
          eu:euname,
          pw:password
        }
      }).then(function (response) {
        if(response.data.result){
          that.curComponent=UserPage;
          that.isDefaultPage=false;
          that.username=euname;
        }
        setTimeout(function () {
          that.Loading=false;
        },1000);
      });
      this.initFolderFromDB(euname);
    }else {
      setTimeout(function () {
        that.Loading=false;
      },2000);
    }
  },
  components: {UserPage, DefaultPage, MyHeader},
  methods:{
    initFolderFromDB(euname){
      let that=this;
      this.axios.get('/api/getfolder', {
        params: {
          username:escape(euname)
        }
      })
        .then(function (response) {
          let i;
          let folders=[];
          for(i=0;i<response.data.length;i++){
            folders[i]=response.data[i].title;
          }
          that.setFolders(folders);
          that.setSlideFolders();
          console.log(folders);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    ...mapMutations({
      setFolders:'wordset/setFolders',
      setSlideFolders:'wordset/setSlideFolders'
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
