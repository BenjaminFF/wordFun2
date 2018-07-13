<template>
  <transition name="fade">
  <div class="model" v-if="isShow">
    <div class="dialog">
      <div class="container">
        <ani-input :title="$t('LogIn.basic[0]')" :fontSize="1.3" :hint="euInfo.hint" v-on:input="euListener"></ani-input>
        <ani-input :title="$t('LogIn.basic[1]')" :fontSize="1.3" :hint="pwInfo.hint" v-on:input="pwListener" :security="true"></ani-input>
        <my-button :fontSize="1.2" class="button" v-on:click.native="login">{{$t('LogIn.basic[2]')}}</my-button>
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
    import nodersa from "node-rsa"
    export default {
        name: "log-in",
      components: {MyButton, AniInput},
      data(){
          return {
            isShow:this.showLI,
            euInfo:{

            },
            pwInfo:{

            }
          }
      },
      created(){
        this.init();
      },
      methods:{
          init(){
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
            }
          },
          setCookie(c_name,value,expiredays){
            var exdate=new Date()
            exdate.setDate(exdate.getDate()+expiredays)
            document.cookie=c_name+ "=" +escape(value)+
              ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
          },
          getCookie(c_name){                   //如果找到了我们要的 cookie，就返回值，否则返回空字符串。
            if (document.cookie.length>0)
            {
              c_start=document.cookie.indexOf(c_name + "=")
              if (c_start!=-1)
              {
                c_start=c_start + c_name.length+1
                c_end=document.cookie.indexOf(";",c_start)
                if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
              }
            }
            return ""
          },
          login:function () {
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
            }else{
              escape(that.euInfo.value);
              this.axios.get('/static/wpublickey.pem').then(function (response) {
                var key=new nodersa(response.data);
                let encryptpw=key.encrypt(that.pwInfo.value,'base64');
                let vm=that;
                vm.axios.post('/api/login', {
                  params: {
                    eu:that.euInfo.value,
                    pw:escape(encryptpw)
                  }
                })
                  .then(function (response) {
                    if(response.data=='euempty'){
                      that.euInfo.hint.text=that.$t('LogIn.ueHint[1]');
                      that.euInfo.hint.color="red";
                      console.log("euempty");
                      setTimeout(function () {
                        that.euInfo.hint.text="";
                      },2000);
                    }else if(response.data=='falsepw'){
                      that.pwInfo.hint.text=that.$t('LogIn.pwHint[1]');
                      that.pwInfo.hint.color="red";
                      console.log("falsepw");
                      setTimeout(function () {
                        that.pwInfo.hint.text="";
                      },2000);
                    }else {
                      console.info('success');
                      that.setCookie('euname',that.euInfo.value,30);
                      that.setCookie('password',encryptpw,30);
                      window.location.reload(true);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              });

            }
          },
        euListener(event){
            this.euInfo.value=event.target.innerHTML;
        },
        pwListener(event){
          this.pwInfo.value=event.target.innerHTML;
        },
        dismiss(event){
          var isIcon=event.target.nodeName=='path'||event.target.nodeName=='svg';
          if(event.target.className=="model"||isIcon){
            this.isShow=false;
            this.$emit('dismiss');
            this.init();
          }
        }
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
