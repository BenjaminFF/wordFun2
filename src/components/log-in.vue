<template>
  <transition name="fade">
  <div class="model" v-if="isShow">
    <div class="dialog">
      <div class="container">
        <ani-input :title="$t('LogIn.basic[0]')" :fontSize="1.3" :hint="euInfo.hint" v-on:input="euListener" v-on:keyup.enter="login"></ani-input>
        <ani-input :title="$t('LogIn.basic[1]')" :fontSize="1.3" :hint="pwInfo.hint" v-on:input="pwListener" :security="true" v-on:keyup.enter="login"></ani-input>
        <ani-input :title="$t('LogIn.basic[4]')" :fontSize="1.3" :hint="captchaStyleInfo.hint"
                   v-on:input="captchaListener" v-on:keyup.enter="login" :show-captcha="true"></ani-input>
        <my-button :fontSize="1.2"
                   class="button" v-on:click.native="login">{{LoginText}}</my-button>
        <p class="fg">{{$t('LogIn.basic[3]')}}</p>
      </div>
      <icon name="cross" class="rtimg"  @click.native="dismiss($event)"></icon>
    </div>
  </div>
  </transition>
</template>

<script>
    import AniInput from "./ani-input";
    import MyButton from "./my-button";
    import nodersa from "node-rsa";
    import {mapMutations,mapState} from 'vuex'
    export default {
        name: "log-in",
      components: {MyButton, AniInput},
      data(){
          return {
            isShow:this.showLI,
            euInfo:{},
            pwInfo:{},
            captchaStyleInfo:{},
            isLogin:false,
            LoginText:""
          }
      },
      created(){
        this.init();
      },
      computed:{
        ...mapState({
          captchaResText:state=>state.captcha.captchaResText,
          captchaInfo:state=>state.captcha.captchaInfo
        }),
      },
      methods:{
          init(){
            this.LoginText=this.$t('LogIn.basic[2]');
            this.euInfo={
              value:"",
              hint:{
                text:"",
                color:'red',
              }
            }
            this.pwInfo={
              value:"",
              hint:{
                text:"",
                color:'red',
              }
            },
              this.captchaStyleInfo={
                value:"",
                hint:{
                  text:"",
                  color:'red',
                }
              }
          },
        login() {
            if(!this.isLogin){
              let that=this;
              let elementList=document.querySelectorAll(".input");
              if(this.euInfo.value==""){
                this.euInfo.hint.text=this.$t('LogIn.ueHint[0]');
                this.euInfo.hint.color="red";
                setTimeout(function () {
                  that.euInfo.hint.text="";
                },2000);
                elementList[0].focus();
              }else if(this.pwInfo.value==""){
                this.pwInfo.hint.text=this.$t('LogIn.pwHint[0]');
                this.pwInfo.hint.color="red";
                setTimeout(function () {
                  that.pwInfo.hint.text="";
                },2000);
                elementList[1].focus();
              }else if(this.captchaStyleInfo.value==""){
                this.captchaStyleInfo.hint.text=this.$t('LogIn.captchaHint[2]');
                this.captchaStyleInfo.hint.color="red";
                setTimeout(()=> {
                  this.captchaStyleInfo.hint.text="";
                },2000);
                elementList[2].focus();
              }else{
                this.isLogin=true;
                this.LoginText+="...";
                this.axios.get('/static/wpublickey.pem').then((response)=>{
                  let key=new nodersa(response.data);
                  let curTime=new Date().getTime();
                  let nonce=that.getRandomStr(10)+curTime+that.getRandomStr(10);
                  let reqdata={
                    eu:encodeURIComponent(that.euInfo.value),
                    pw:encodeURIComponent(that.pwInfo.value),
                    curTime:curTime,
                    nonce:nonce,
                    captchaKey:this.captchaInfo.captchaKey,
                    captchaResText:this.captchaResText
                  }
                  let jsonData=JSON.stringify(reqdata);
                  let encryptdata=key.encrypt(jsonData,'base64');
                  let vm=that;
                  vm.axios.post('/api/login', {
                    params: {
                      encryptdata:encryptdata
                    },
                    timeout:10000,
                  })
                    .then((response) =>{
                      setTimeout(()=>{
                        this.isLogin=false;
                        this.LoginText=this.$t('LogIn.basic[2]');
                      },1000);
                      let resdata=response.data;
                      console.log(resdata);
                      if(resdata.result===undefined){
                        return;
                      }
                      if(resdata.result=="captcha expired"){
                        this.captchaStyleInfo.hint.text=this.$t('LogIn.captchaHint[0]');
                        this.captchaStyleInfo.hint.color="red";
                        setTimeout(()=> {
                          this.captchaStyleInfo.hint.text="";
                        },2000);
                      }else if(resdata.result=="incorrect captcha"){
                        this.captchaStyleInfo.hint.text=this.$t('LogIn.captchaHint[1]');
                        this.captchaStyleInfo.hint.color="red";
                        setTimeout(()=> {
                          this.captchaStyleInfo.hint.text="";
                        },2000);
                      }else if(resdata.result=='empty'){      //用户不存在
                        that.euInfo.hint.text=that.$t('LogIn.ueHint[1]');
                        that.euInfo.hint.color="red";
                        setTimeout(function () {
                          that.euInfo.hint.text="";
                        },2000);
                      }else if(!resdata.result){      //用户密码错误
                        that.pwInfo.hint.text=that.$t('LogIn.pwHint[1]');
                        that.pwInfo.hint.color="red";
                        console.log("falsepw");
                        setTimeout(function () {
                          that.pwInfo.hint.text="";
                        },2000);
                      }else if(resdata.result){
                        console.info('success');
                        let login_token={
                          username:resdata.username,
                          token:reqdata.nonce
                        }
                        that.setCookie("login_token",JSON.stringify(login_token),30);
                        window.location.reload(true);
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                });

              }
            }
        },
        euListener(event){
            this.euInfo.value=event.target.innerHTML;
        },
        pwListener(event){
          this.pwInfo.value=event.target.innerHTML;
        },
        captchaListener(event){
            this.captchaStyleInfo.value=event.target.innerHTML;
            this.setCaptchaResText(event.target.innerHTML);
            console.log(this.captchaResText);
        },
        dismiss(event){
          var isIcon=event.target.nodeName=='path'||event.target.nodeName=='svg';
          if(event.target.className=="model"||isIcon){
            this.isShow=false;
            this.$emit('dismiss');
            this.init();
          }
        },
        ...mapMutations({
          setCaptchaInfo:'captcha/setCaptchaInfo',
          setCaptchaResText:'captcha/setCaptchaResText',
        }),
      },
      props:{
        showLI:{
          type:Boolean,
          default:function () {
            return false;
          }
        }
      },
      watch:{
          showLI:function () {
            this.isShow=this.showLI;
        },
      }
    }
</script>

<style scoped>
  div{
    margin: 0;
    padding: 0;
  }
  .model{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(211, 211, 211, 0.51);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .dialog{
    width: 30rem;
    height: 95%;
    background-color: white;
    box-shadow: 1px 1px 10px gray;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .container{
    width: 80%;
    height: 100%;
    margin-top: 4rem;
  }
  .button{
    margin-top: 2rem;
  }
  .fg{
    text-align: center;
    margin-top: 1.5rem;
    cursor: pointer;
    color: rgb(16, 198, 213);
    text-decoration: underline;
  }
  .rtimg{
    width: 2rem;
    height: 2rem;
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: gray;
  }
  .rtimg:hover{
    cursor: pointer;
    color: #0FA3B1;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
