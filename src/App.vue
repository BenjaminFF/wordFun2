<template>
  <div id="app">
    <my-header class="header" v-on:signup="signup"></my-header>
    <div class="main-content">
      <my-sidebar class="sidebar"></my-sidebar>
      <div class="container">
        <create-set></create-set>
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from "./components/my-header";
import MySidebar from "./components/my-sidebar";
import WContainer from "./components/w-container";
import Tools from "./components/tools";
import LogIn from "./components/log-in";
import SignUp from "./components/sign-up";
import CardSlider from "./components/card-slider";
import SetSlider from "./components/set-slider";
import CreateInput from "./components/create-input";
import CreateSet from "./components/create-set";
import FloatButton from "./components/float-button";
import MenuTool from "./components/menu-tool";
export default {
  name: 'App',
  data(){
    return{
      showSU:false
    }
  },
  components: {
    MenuTool,
    FloatButton,
    CreateSet, CreateInput, SetSlider, CardSlider, SignUp, LogIn, Tools, WContainer, MySidebar, MyHeader},
  methods:{
    signup(){
      this.showSU=true;
    }
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
    --wintergreen:#4A9180
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

  .sidebar{
    flex: 2 0 0;
    margin-left: 3rem;
    margin-top: 3rem;
  }
  .container{
    flex: 8 0 0;
    margin-top: 3rem;
  }

  @font-face {
    font-family: HuaYI;
    src: url("./assets/font/HYQuBaoF2.ttf") format("opentype");
  }

  @font-face {
    font-family: HandWritting1;
    src: url("./assets/font/handwritting1.ttf") format("opentype");
  }
</style>
