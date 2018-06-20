<template>
    <div class="header">
      <icon name="menu" class="menu-icon"></icon>
      <p class="title"><a href="/">WordFun</a></p>
      <div class="user">
      <p @click="showSU=true">SIGNUP</p>
      <p @click="showLI=true">LOGIN</p>
    </div>
      <sign-up :showSU="showSU" v-on:dismiss="showSU=false"></sign-up>
      <log-in :showLI="showLI" v-on:dismiss="showLI=false"></log-in>
    </div>
</template>

<script>
    import MyButton from "./my-button";
    import SignUp from "./sign-up";
    import LogIn from "./log-in";
    export default {
        name: "my-header",
      data(){
          return{
            showSU:false,
            showLI:false
          }
      },
      methods:{

      },
      components: {LogIn, SignUp, MyButton}
    }
</script>

<style scoped>
  div,p,a{
    margin: 0;
    padding: 0;
  }
  .header{
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
  }
  .title{
    margin-left: 3rem;
    font-size: 2.0rem;
    justify-self: center;
  }
  .title a{
    color: #0FA3B1;
    text-decoration: none;
  }
  .user{
    display: flex;
    font-size: 1rem;
    width: fit-content;
    border-radius: 1.2rem;
    user-select: none;
    position: absolute;
    right: 2rem;
  }
  .user p{
    padding: 0.2rem 0.6rem;
    color: #0FA3B1;
    cursor: pointer;
  }
  .menu-icon{
    position: absolute;
    left: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    color: #0FA3B1;
  }
</style>
