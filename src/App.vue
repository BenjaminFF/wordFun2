<template>
  <div id="app">
    <my-header class="header"></my-header>
    <div class="main-content">
      <my-sidebar class="sidebar"></my-sidebar>
      <w-container class="container"></w-container>
    </div>
    <sign-up></sign-up>
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
  components: {SignUp, LogIn, Tools, WContainer, MySidebar, MyHeader}
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
    width: 80%;
    flex: 8 0 0;
    display: flex;
    margin: 2em 10%;
  }

  .sidebar{
    flex: 2 0 0;
  }
  .container{
    flex: 8 0 0;
    margin-left: 2em;
  }
  .tools{
    flex: 1 0 0;
    margin-left: 2em;
  }
</style>
