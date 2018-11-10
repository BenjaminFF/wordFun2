<template>
  <transition name="fade">
      <div class="model" v-if="isShow">
        <div class="dialog">
          <div class="dialog-container">
            <div class="dialog-front" :style="{transform:'rotateY('+signupInfo.frontDeg+'deg)'}" v-if="signupInfo.frontVisibility">
              <div class="dialog-front-container">
                <ani-input :font-size="1.3" :title="$t('SignUp.basic[0]')" :hint="nameInfo.hint" v-on:keyup.enter="turnCard"
                           v-on:input="nameListener" :validate="nameInfo.Validated" @keydown.native="banInput($event,nameInfo,25)"></ani-input>
                <ani-input :font-size="1.3" :title="$t('SignUp.basic[1]')" :hint="emailInfo.hint" v-on:keyup.enter="turnCard"
                           :validate="emailInfo.Validated"  v-on:input="emailListener" @keydown.native="banInput($event,emailInfo,30)"></ani-input>
                <ani-input :font-size="1.3" :title="$t('SignUp.basic[2]')" :hint="pwInfo.hint" :security="true" v-on:keyup.enter="turnCard"
                           v-on:input="pwListener" :validate="pwInfo.Validated" @keydown.native="banInput($event,pwInfo,30)"
                ></ani-input>
                <my-button :font-size="1.2" class="button" @click.native="turnCard">{{$t('SignUp.basic[3]')}}</my-button>
                <icon name="cross" class="rtimg" @click.native="dismiss($event)"></icon>
              </div>
            </div>
            <div class="dialog-back" :style="{transform:'rotateY('+signupInfo.backDeg+'deg)'}" v-if="signupInfo.backVisibility">
              <div class="dialog-back-container">
                <ani-input :font-size="1.3" :title="$t('SignUp.basic[4]')" :hint="rCodeInfo.hint" v-on:keyup.enter="signup"
                           v-on:input="rCodeListener" @keydown.native="banInput($event,rCodeInfo,7)"></ani-input>
                <my-button :font-size="1.2" class="button" @click.native="signup">{{signupInfo.text}}</my-button>
                <icon name="cross" class="rtimg" @click.native="dismiss($event)"></icon>
                <div class="signUp-notifyText">{{$t('SignUp.notifyText')}}</div>
              </div>
            </div>
          </div>
        </div>
        <my-toast :text="$t('SignUp.basic[6]')" v-if="showToast"></my-toast>
      </div>
  </transition>
</template>

<script>
    import AniInput from "./ani-input";
    import MyButton from "./my-button";
    import nodersa from "node-rsa"
    import MyToast from "./my-toast";
    export default {
        name: "sign-up",
      data(){
          return{
            nameInfo:{},
            emailInfo:{},
            pwInfo:{},
            rCodeInfo:{},
            isShow:this.showSU,
            signupInfo:{},
            showToast:false
          }
      },
      created(){
          this.init();
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
                      text:"",
                      color:'red',
                    },
                    isVerifying:false
          }
          this.emailInfo={
                value:"",
                Validated:false,
                hint:{
                text:"",
                  color:'red',
              },
              isVerifying:false
            }
          this.pwInfo={
                value:"",
                Validated:false,
                hint:{
                  text:"",
                  color:'red',
              },
              isVerifying:false
            },
            this.rCodeInfo={
              value:"",
              hint:{
                text:"",
                color:'red',
              },
            },
          this.signupInfo={
            text:this.$t("SignUp.basic[5]"),
            isSignUp:false,
            isSendingEmail:false,
            frontDeg:0,
            backDeg:180,
            backVisibility:false,
            frontVisibility:true
          }
        },
        banInput(event,inputInfo,length){
            if(this.checkLength(event.target.innerHTML)>length){
              // Backspace, del, 左右方向键
              var code=event.keyCode;
              if (code != 8&&code != 46&&code != 37&&code != 39){
                event.preventDefault();
              }
            }
          },
        /*假定用户1s完成输入，双手离开键盘，然后判断用户名,1s之内只判断一次*/
        nameListener(event){
            if(event.target.textContent!=undefined){
              this.nameInfo.value=event.target.textContent;       //兼容火狐
            }else {
              this.nameInfo.value=event.target.innerText;
            }
            if(!this.nameInfo.isVerifying){
              setTimeout(()=> {
                console.log(this.nameInfo.value);
                this.verifyname(this.nameInfo.value);     //that.nameInfo.value是1s后的value
                this.nameInfo.isVerifying=false;
              },1000);
              this.nameInfo.isVerifying=true;
            }
          },
        checkLength(str){
          let len=0;
          for(let i=0;i<str.length;i++){
            if(str.charCodeAt(i)>=127||str.charCodeAt(i)==94){            //中文字符算2个Length
              len+=2;
            }else {
              len++;
            }
          }
          return len;
        },
        checkChinese(str){
            let len=0;
          for(let i=0;i<str.length;i++){
            if(str.charCodeAt(i)>=127||str.charCodeAt(i)==94){            //中文字符算2个Length
              len++;
            }
          }
          return len;
        },
        /*用户名不能小于4；用户名只能包含字母，汉字，数组，下划线；用户名不能重复*/
        verifyname(value) {
          var that = this;
          if (value.length < 2) {
            that.nameInfo.hint.text=this.$t('SignUp.nameHint[1]');
            that.nameInfo.hint.color="red";
            that.nameInfo.Validated=false;
          } else if(value.length>15){
            that.nameInfo.hint.text=this.$t('SignUp.nameHint[5]');
            that.nameInfo.hint.color="red";
            that.nameInfo.Validated=false;
            }
            else {
            if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value)) {
              that.nameInfo.hint.text = this.$t('SignUp.nameHint[2]');
              that.nameInfo.hint.color = "red";
              that.nameInfo.Validated=false;
            } else {
              this.axios.get('/api/verifyname', {
                params: {
                  username: encodeURIComponent(value)
                }
              })
                .then(function (response) {
                  console.log(response.data);
                  if(!response.data.signed){
                    that.nameInfo.Validated=true;
                    that.nameInfo.hint.text = "";
                  }else if(response.data.signed){
                    that.nameInfo.Validated=false;
                    that.nameInfo.hint.text = that.$t('SignUp.nameHint[3]');
                    that.nameInfo.hint.color = "red";
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
          if(event.target.textContent!=undefined){
            that.emailInfo.value=event.target.textContent;       //兼容火狐
          }else {
            that.emailInfo.value=event.target.innerText;
          }
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
          console.log(encodeURIComponent(value));
          if(!/^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/.test(value)){
            that.emailInfo.hint.text=this.$t('SignUp.emailHint[0]');
            that.emailInfo.hint.color="orangered";
            that.emailInfo.Validated=false;
          }else {
            this.axios.get('/api/verifyemail', {
              params: {
                email: encodeURIComponent(value)
              }
            })
              .then((response)=> {
                console.log(response.data);
                if(!response.data.signed){
                  that.emailInfo.Validated=true;
                  that.emailInfo.hint.text = "";
                }else if(response.data.signed){
                  that.emailInfo.Validated=false;
                  that.emailInfo.hint.text = that.$t('SignUp.emailHint[1]');
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
          if(event.target.textContent!=undefined){
            that.pwInfo.value=event.target.textContent;       //兼容火狐
          }else {
            that.pwInfo.value=event.target.innerHTML;
          }
          console.log(that.pwInfo.value);
          if(!this.pwInfo.isVerifying){
            setTimeout(function () {
              that.verifypw(that.pwInfo.value);
              that.pwInfo.isVerifying=false;
            },1000);
            that.pwInfo.isVerifying=true;
          }
        },
        /*密码不少于6位，不多于30位,密码必须包含字母数字*/
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
          }else if(this.checkChinese(value)>0) {
          that.pwInfo.hint.text=this.$t('SignUp.pwHint[3]');
          that.pwInfo.hint.color="orangered";
          that.pwInfo.Validated=false;
           }else {
            that.pwInfo.hint.text="";
            that.pwInfo.hint.color="orangered";
            that.pwInfo.Validated=true;
          }
        },
        basicValidate(){
          let result=false;
          var elementList=document.querySelectorAll(".input");
          if(!this.nameInfo.Validated){
            if(this.nameInfo.value==""){
              this.nameInfo.hint.text=this.$t('SignUp.nameHint[4]');
            }
            elementList[0].focus();
          }else if(!this.emailInfo.Validated){
            if(this.emailInfo.value==""){
              this.emailInfo.hint.text=this.$t('SignUp.emailHint[2]');
            }
            elementList[1].focus();
          }else if(!this.pwInfo.Validated){
            if(this.pwInfo.value==""){
              this.pwInfo.hint.text=this.$t('SignUp.pwHint[2]');
            }
            elementList[2].focus();
          }else {
            result=true;
          }
          return result;
        },
        turnCard(){
          let curTime=new Date().getTime();
          let nonce=this.getRandomStr(30);
          if(this.basicValidate()){
            if(!this.signupInfo.isSendingEmail){        //同步，上一个请求完后才能进行下一个请求
              this.signupInfo.isSendingEmail=true;
              this.axios.post('/api/sendEmail',{       //保证发送email的唯一性
                params:{
                  curTime:curTime,
                  email:encodeURIComponent(this.emailInfo.value),
                  nonce:nonce
                }
              }).then((response)=>{
                this.signupInfo.isSendingEmail=false;
                console.log(response.data.result);
                if(response.data.result){
                  this.signupInfo.backVisibility=true;
                  setTimeout(()=>{
                    this.signupInfo.frontDeg=180;
                    this.signupInfo.backDeg=360;
                  },20);
                  setTimeout(()=>{
                    this.signupInfo.frontVisibility=false;
                  },800);
                }else {
                  //不合格的邮箱
                  console.log("invalid email");
                }
              }).catch((err)=>{
                if(err) throw  err;
              });
            }

          }
        },
        rCodeListener(event){

          if(event.target.textContent!=undefined){
            this.rCodeInfo.value=event.target.textContent;       //兼容火狐
          }else {
            this.rCodeInfo.value=event.target.innerText;
          }
        },
        signup(){
          var elementList=document.querySelectorAll(".input");
          if(this.rCodeInfo.value==""){
            this.rCodeInfo.hint.text=this.$t('SignUp.rCodeHint[0]');
            setTimeout(()=>{
              this.rCodeInfo.hint.text="";
            },2000);
            elementList[0].focus();
          }else if(!this.signupInfo.isSignUp){       //保持同步
              this.signupInfo.isSignUp=true;
              this.signupInfo.text+="...";
              this.axios.get('/static/wpublickey.pem').then((response)=> {
                var key=new nodersa(response.data);
                let curTime=new Date().getTime();
                let nonce=this.getRandomStr(20)+curTime+this.getRandomStr(20);
                let data={
                  username:encodeURIComponent(this.nameInfo.value),
                  email:encodeURIComponent(this.emailInfo.value),
                  password:encodeURIComponent(this.pwInfo.value),
                  rCode:this.rCodeInfo.value,
                  nonce:nonce,
                  curTime:curTime,

                }
                let encryptdata=key.encrypt(JSON.stringify(data),'base64');
                this.axios.post('/api/signup', {
                  params: {
                    encryptdata:encryptdata
                  }
                })
                  .then((response)=> {
                    console.log(response.data);
                    this.signupInfo.isSignUp=false;
                    this.signupInfo.text=this.$t("SignUp.basic[5]");
                    if(response.data.result){
                      this.showToast=true;
                      setTimeout(()=>{
                        this.isShow=false;
                        this.$emit("dismissAEDopensingup");
                        this.init();
                      },1000);
                    }else{
                      this.rCodeInfo.hint.text=this.$t('SignUp.rCodeHint[1]');
                      setTimeout(()=>{
                        this.rCodeInfo.hint.text="";
                      },2000);
                      elementList[0].focus();
                    }
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
        },
      },
      props:{
          showSU:{
          type:Boolean,
          default:function () {
            return false;
          }
        }
      },
      components: {MyToast, MyButton, AniInput}
    }
</script>

<style scoped>
  div{
    margin: 0;
    padding: 0;
  }
  .model{
    position: fixed;
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
    height: 90%;
    position: relative;
  }
  .dialog-container{
    transform-style: preserve-3d;
    perspective: 1200px;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .dialog-front{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all ease-in .7s;
    box-shadow: 1px 1px 10px #cdcdcd;
    border-radius: 10px;
  }
  .dialog-front-container{
    width: 80%;
    margin-top: 5rem;
  }

  .dialog-back{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: white;
    box-shadow: 1px 1px 10px #cdcdcd;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all ease-in .7s;
    border-radius: 10px;
  }

  .dialog-back-container{
    width: 80%;
    margin-top: 8rem;
    align-items: center;
    flex-direction: column;
    display: flex;
  }

  .button{
    margin-top: 1.8rem;
    border-radius: 5px;
  }

  .rtimg{
    width: 2rem;
    height: 2rem;
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: gray;
    cursor: pointer;
  }

  .rtimg:hover{
    color: #0FA3B1;
  }

  .signUp-notifyText{
    font-size: 1rem;
    width: fit-content;
    height: fit-content;
    position: absolute;
    bottom: 2rem;
    color: #0FA3B1;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
