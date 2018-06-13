<template>
    <div class="model">
      <div class="dialog">
        <div class="container">
          <ani-input :font-size="1.3" title="username" :hint="nameInfo.hint"
                     v-on:input="nameListener" :validate="nameInfo.Validated" @keydown.native="checkLength"
                     @blur="nameBlur"
          ></ani-input>
          <ani-input :font-size="1.3" title="email" :hint="emailInfo.hint"></ani-input>
          <ani-input :font-size="1.3" title="password" :hint="pwInfo.hint"></ani-input>
          <my-button :font-size="1.2" class="button" >sign up</my-button>
        </div>
      </div>
    </div>
</template>

<script>
    import AniInput from "./ani-input";
    import MyButton from "./my-button";
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
          }
      },
      methods:{
          checkLength(event){
            if(event.target.innerHTML.length>=15){
              // Backspace, del, 左右方向键
              var code=event.keyCode;
              if (code != 8&&code != 46&&code != 37&&code != 39){
                this.nameInfo.hint.text="username length no more than 15";
                this.nameInfo.hint.color="orangered";
                event.preventDefault();
              }
            }
          },
          nameBlur(){
            if(this.nameInfo.value.length==15){
              this.nameInfo.hint.text="";
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
            that.nameInfo.hint.text="username must greater than 6";
            that.nameInfo.hint.color="orangered";
            that.nameInfo.Validated=false;
          } else {
            if (!/^\w+$/.test(value)) {
              that.nameInfo.hint.text = "username must only contain letter,number,underscore";
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
                    that.nameInfo.hint.text = "username has already signed";
                    that.nameInfo.hint.color = "orangered";
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }
          console.log(value+" verifyed");
          this.isVerifyIng=false;
        },
        emailListener(innerHTML){

        },
        verifyemail(value){

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
  }
  .dialog{
    width: 35rem;
    height: 40rem;
    background-color: white;
    box-shadow: 1px 1px 10px gray;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .container{
    margin-top: 4rem;
    width: 80%;
    height: 2rem;
  }

  .button{
    margin-top: 3rem;
  }
</style>
