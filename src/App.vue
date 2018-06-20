<template>
  <div id="app">
    <my-header class="header" v-on:signup="signup"></my-header>
    <div class="main-content">

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
export default {
  name: 'App',
  data(){
    return{
      showSU:false
    }
  },
  components: {SignUp, LogIn, Tools, WContainer, MySidebar, MyHeader},
  methods:{
    signup(){
      this.showSU=true;
    }
  }
}
</script>

<style>
  body,html{
    width: 100%;
    height: 100%;
    background-color: #f3f3f3;
    overflow: hidden;
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
  }
  .container{
    flex: 8 0 0;
    margin-left: 2em;
  }
</style>
