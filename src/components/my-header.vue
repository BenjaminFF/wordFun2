<template>
    <div class="header">
      <p class="title"><a href="/">WordFun</a></p>
      <div class="user">
      <p @click="showSU=true">{{$t('header.user[0]')}}</p>
      <p @click="showLI=true">{{$t('header.user[1]')}}</p>
    </div>
      <div class="switchLang" @click="changeLocale">{{$t('language.name')}}</div>
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
        changeLocale() {
          let locale = this.$i18n.locale
          locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'
          // LangStorage.setLang(this.$i18n.locale) //后面会用做切换和将用户习惯存储到本地浏览器
        }
      },
      components: {LogIn, SignUp, MyButton}
    }
</script>

<style scoped>
  div,p,a{
    margin: 0;
    padding: 0;
    user-select: none;
  }
  .header{
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
  }
  .title{
    position: absolute;
    left: 3rem;
    font-size: 1.8rem;
    user-select: none;
  }
  .title a{
    color: var(--seablue);
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
    color: var(--seablue);
    cursor: pointer;
  }
  .switchLang{
    position: absolute;
    right: 13rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10rem;
    border: 1px solid var(--seablue);
    color: var(--seablue);
    box-sizing: border-box;
  }
  .switchLang:hover{
    background-color: var(--seablue);
    color: white;
    cursor: pointer;
  }
</style>
