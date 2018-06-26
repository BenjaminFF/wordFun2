<template>
  <transition name="fade">
    <div class="model" v-if="isShow" @click="dismiss($event)">
        <div class="dialog">
          <div class="container">
            <ani-input :font-size="1.3" :title="$t('SignUp.basic[0]')" :hint="nameInfo.hint"
                       v-on:input="nameListener" :validate="nameInfo.Validated" @keydown.native="checkLength($event,nameInfo,20)"></ani-input>
            <ani-input :font-size="1.3" :title="$t('SignUp.basic[1]')" :hint="emailInfo.hint"
                       :validate="emailInfo.Validated"  v-on:input="emailListener" @keydown.native="checkLength($event,emailInfo,30)"></ani-input>
            <ani-input :font-size="1.3" :title="$t('SignUp.basic[2]')" :hint="pwInfo.hint" :security="true"
                       v-on:input="pwListener" :validate="pwInfo.Validated" @keydown.native="checkLength($event,pwInfo,20)"
            ></ani-input>
            <my-button :font-size="1.2" class="button" @click.native="signup">{{$t('SignUp.basic[3]')}}</my-button>
          </div>
            <icon name="cross" class="rtimg"></icon>
        </div>
    </div>
  </transition>
</template>

<script>
    import AniInput from "./ani-input";
    import MyButton from "./my-button";
    import nodersa from "node-rsa"
    export default {
        name: "sign-up",
      data(){
          return{
            nameInfo:{
              value:"",
              Validated:false,
              hint:{
                text:"username123",
                color:'lightgrey',
              },
              isVerifying:false
            },
            emailInfo:{
              value:"",
              Validated:false,
              hint:{
                text:"wordfun@123.com",
                color:'lightgrey',
              }
            },
            pwInfo:{
              value:"",
              Validated:false,
              hint:{
                text:"",
                color:'lightgrey',
              }
            },
            isShow:this.showSU
          }
      },
      watch:{
          showSU:function () {
            this.isShow=this.showSU;
          }
      },
      methods:{
          init(){
            this.nameInfo={
              value:"",
              Validated:false,
              hint:{
                text:"username123",
                color:'lightgrey',
              },
              isVerifying:false
            }
            this.emailInfo={
              value:"",
                Validated:false,
                hint:{
                text:"wordfun@123.com",
                  color:'lightgrey',
              }
            }
            this.pwInfo={
              value:"",
                Validated:false,
                hint:{
                text:"",
                  color:'lightgrey',
              }
            }
          },
          checkLength(event,inputInfo,length){
            if(event.target.innerHTML.length>=length){
              // Backspace, del, 左右方向键
              var code=event.keyCode;
              if (code != 8&&code != 46&&code != 37&&code != 39){
                event.preventDefault();
              }
            }
          },
          /*假定用户1s完成输入，双手离开键盘，然后判断用户名*,1s之内只判断一次*/
          nameListener(event){
            var that=this;
            that.nameInfo.value=event.target.innerHTML;
            if(!this.nameInfo.isVerifying){
              setTimeout(function () {
                that.verifyname(that.nameInfo.value);
                that.nameInfo.isVerifying=false;
              },1000);
              that.nameInfo.isVerifying=true;
            }
          },
        /*用户名不能小于6；用户名只能包含字母，数组，下划线；用户名不能重复*/
        verifyname(value) {
          var that = this;
          if (value.length < 6) {
            that.nameInfo.hint.text=this.$t('SignUp.nameHint[1]');
            that.nameInfo.hint.color="orangered";
            that.nameInfo.Validated=false;
          } else {
            if (!/^\w+$/.test(value)) {
              that.nameInfo.hint.text = this.$t('SignUp.nameHint[2]');
              that.nameInfo.hint.color = "orangered";
              that.nameInfo.Validated=false;
            } else {
              this.axios.get('/api/verifyname', {
                params: {
                  username: value
                }
              })
                .then(function (response) {
                  console.log(response.data);
                  if(response.data=='notsign'){
                    that.nameInfo.Validated=true;
                    that.nameInfo.hint.text = "";
                    that.nameInfo.hint.color = "orangered";
                  }else {
                    that.nameInfo.Validated=false;
                    that.nameInfo.hint.text = this.$t('SignUp.nameHint[3]');
                    that.nameInfo.hint.color = "orangered";
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }
        },
        emailListener(event){
          var that=this;
          that.emailInfo.value=event.target.innerHTML;
          if(!this.emailInfo.isVerifying){
            setTimeout(function () {
              that.verifyemail(that.emailInfo.value);
              that.emailInfo.isVerifying=false;
            },1000);
            that.emailInfo.isVerifying=true;
          }
        },
        verifyemail(value){
          var that=this;
          if(!/^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/.test(value)){
            that.emailInfo.hint.text=this.$t('SignUp.emailHint[0]');
            that.emailInfo.hint.color="orangered";
            that.emailInfo.Validated=false;
          }else {
            this.axios.get('/api/verifyemail', {
              params: {
                email: value
              }
            })
              .then(function (response) {
                console.log(response.data);
                if(response.data=='notsign'){
                  that.emailInfo.Validated=true;
                  that.emailInfo.hint.text = "";
                }else {
                  that.emailInfo.Validated=false;
                  that.emailInfo.hint.text = this.$t('SignUp.emailHint[1]');
                  that.emailInfo.hint.color = "orangered";
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        },
        pwListener(event){
          var that=this;
          that.pwInfo.value=event.target.innerHTML;
          if(!this.pwInfo.isVerifying){
            setTimeout(function () {
              that.verifypw(that.pwInfo.value);
              that.pwInfo.isVerifying=false;
            },1000);
            that.pwInfo.isVerifying=true;
          }
        },
        /*密码不少于6位，不多于20位,密码必须包含字母数字*/
        verifypw(value){
          var that=this;
          if(value.length<6){
            that.pwInfo.hint.text=this.$t('SignUp.pwHint[0]');
            that.pwInfo.hint.color="orangered";
            that.pwInfo.Validated=false;
          }else if(!(/[0-9]/.test(value)&&/[a-zA-Z]/.test(value))){
            that.pwInfo.hint.text=this.$t('SignUp.pwHint[1]');
            that.pwInfo.hint.color="orangered";
            that.pwInfo.Validated=false;
          }else {
            that.pwInfo.hint.text="";
            that.pwInfo.hint.color="orangered";
            that.pwInfo.Validated=true;
          }
        },
        signup(){
          var that=this;
          var elementList=document.querySelectorAll(".input");
          if(!this.nameInfo.Validated){
            if(this.nameInfo.Validated==""){
              this.nameInfo.hint.text=this.$t('SignUp.nameHint[4]');
            }
            this.nameInfo.hint.color="orangered";
            elementList[0].focus();
          }else if(!this.emailInfo.Validated){
            if(this.emailInfo.Validated==""){
              this.emailInfo.hint.text=this.$t('SignUp.emailHint[2]');
            }
            this.emailInfo.hint.color="orangered";
            elementList[1].focus();
          }else if(!this.pwInfo.Validated){
            if(this.pwInfo.Validated==""){
              this.pwInfo.hint.text=this.$t('SignUp.pwHint[2]');
            }
            this.pwInfo.hint.color="orangered";
            elementList[2].focus();
          }else {
            console.info("success");
            var encryptpw;
            this.axios.get('/static/wpublickey.pem').then(function (response) {
              var key=new nodersa(response.data);
              encryptpw=key.encrypt(that.pwInfo.value,'base64');
              var vm=that;
              vm.axios.get('/api/signup', {
                params: {
                  username:that.nameInfo.value,
                  email:that.emailInfo.value,
                  password:encryptpw
                }
              })
                .then(function (response) {
                  console.log(response.data);
                })
                .catch(function (error) {
                  console.log(error);
                });
            });
          }
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
          showSU:{
          type:Boolean,
          default:function () {
            return false;
          }
        }
      },
      components: {MyButton, AniInput}
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
    margin-top: 4rem;
    width: 80%;
    height: 2rem;
  }

  .button{
    margin-top: 1.8rem;
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
