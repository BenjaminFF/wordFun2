<template>
    <div class="header">
      <p class="title"><a href="/">eWordFun</a></p>
      <div class="addws" v-if="!defaultPage"
                   @click="createSet">
        <icon name="addws" class="addwsicon"></icon>
        {{$t('header.create')}}
      </div>
      <div class="default" v-if="defaultPage">
        <p @click="signup">{{$t('header.user[0]')}}</p>
        <p @click="showLogin">{{$t('header.user[1]')}}</p>
      </div>
      <div class="user" v-if="!defaultPage" @click="showUserFunc">{{username}}
        <icon name="down" class="user-icon" :class="{iconUp:isIconUp}"></icon>
        <div class="user-func" v-if="showUF">
          <div class="funcItem">{{$t('header.userfunc[0]')}}</div>
          <div class="funcItem">{{$t('header.userfunc[1]')}}</div>
          <div class="funcItem" @click="logout">{{$t('header.userfunc[2]')}}</div>
        </div>
      </div>
      <div class="switchLang" @click="changeLocale">{{$t('language.name')}}</div>
      <sign-up :showSU="showSU" v-on:dismiss="showSU=false" v-on:dismissAEDopensingup="dismissAEDopensingup"></sign-up>
      <log-in :showLI="showLI" v-on:dismiss="showLI=false"></log-in>
    </div>
</template>

<script>
    import MyButton from "./my-button";
    import SignUp from "./sign-up";
    import LogIn from "./log-in";
    import {mapMutations,mapState} from 'vuex'
    import langStorage from '../lang'
    import nodersa from "node-rsa"
    export default {
      name: "my-header",
      data() {
        return {
          showSU: false,
          showLI: false,
          showUF: false,
          rotateDeg: 0,
          isIconUp: false,
        }
      },
      created() {

      },
      methods: {
        changeLocale() {
          let locale = this.$i18n.locale
          locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'
          // LangStorage.setLang(this.$i18n.locale) //后面会用做切换和将用户习惯存储到本地浏览器
          langStorage.setLang(this.$i18n.locale) // 保存用户习惯
        },
        showUserFunc() {
          this.showUF = !this.showUF;
          if (this.showUF) {
            this.isIconUp = true;
          } else {
            this.isIconUp = false;
          }
        },
        createSet(){
          this.setCookie("createSetMode","create");
          this.showCreateSet();
        },
        signup(){
          this.axios.get("/api/captcha").then((response)=>{
            this.setCaptchaInfo(response.data);
            this.showSU=true;
          }).catch((err)=>{
            throw err;
          });
        },
        showLogin(){                  //打开login dialog时刷新验证码
          this.axios.get("/api/captcha").then((response)=>{
            this.setCaptchaInfo(response.data);
            this.showLI=true;
          }).catch((err)=>{
            throw err;
          });
        },
        logout() {
          let curTime=new Date().getTime();
          let nonce=this.getRandomStr(10)+curTime;
          this.axios.post('/api/logout',{
            params:{
              curTime:curTime,
              nonce:nonce
            }
          }).then((response)=>{
            console.log(response.data);
            this.delCookie('login_Info');
            this.$router.push('/');
            window.location.reload(true);
          });
        },
        dismissAEDopensingup(){
          this.showSU=false;
          this.axios.get("/api/captcha").then((response)=>{
            setTimeout(()=>{
              this.setCaptchaInfo(response.data);
              this.showLI=true;
            },200);
          }).catch((err)=>{
            throw err;
          });
        },
        ...mapMutations({
          setCreateState:'wordset/setCreateState',
          setCaptchaInfo:'captcha/setCaptchaInfo',
          showCreateSet:'wordset/showCreateSet'
        }),
      },
      props:{
          defaultPage:{
            type:Boolean,
            default:false
          },
        username:{
            type:String,
          default:""
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
  .addws{
    text-decoration: none;
    cursor: pointer;
    display: flex;
    position: absolute;
    right: 25rem;
    width: fit-content;
    height: fit-content;
    color: var(--seablue);
    font-size: 1rem;
  }
  .addwsicon{
    margin-right: 0.1rem;
    width: 1.2rem;
    height: 1.2rem;
  }
  .default{
    display: flex;
    font-size: 1rem;
    width: fit-content;
    border-radius: 1.2rem;
    user-select: none;
    position: absolute;
    right: 2rem;
  }
  .default p{
    padding: 0.2rem 0.6rem;
    color: var(--seablue);
    cursor: pointer;
  }
  .user{
    cursor: pointer;
    position: absolute;
    right: 3rem;
    width: fit-content;
    height: fit-content;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    color: var(--seablue);
  }
  .user-func{
    position: absolute;
    top: 150%;
    width: max-content;
    height: fit-content;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: right;
  }
  .funcItem{
    width: 100%;
    height: fit-content;
    text-align: right;
    margin-bottom: 0.5rem;
  }
  .funcItem:hover{
    text-decoration: underline;
  }
  .user-icon{
    width: 0.7rem;
    height: 0.7rem;
    margin-top: 0.2rem;
    margin-left: 0.2rem;
    transition: 0.5s all ease-out;
  }
  .iconUp{
    transform: rotate(180deg);
  }
  .switchLang{
    position: absolute;
    right: 15rem;
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
