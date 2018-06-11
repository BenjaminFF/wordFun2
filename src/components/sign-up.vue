<template>
    <div class="model">
      <div class="dialog">
        <div class="container">
          <ani-input :font-size="1.3" title="username" :hint="nameHint"
                     v-on:input="nameListener"></ani-input>
          <ani-input :font-size="1.3" title="email" :hint="emailHint"></ani-input>
          <ani-input :font-size="1.3" title="password" :hint="pwHint"></ani-input>
          <my-button :font-size="1.2" class="button">sign up</my-button>
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
            nameHint: {
              text:"length must greater than 6",
              color:'lightgrey'
            },
            pwHint: {
              text:"lenght>=6,must have letter,number",
              color:'lightgrey'
            },
            emailHint: {
              text:"wordfun@123.com",
              color:'lightgrey'
            },
            vNameIndex:0
          }
      },
      methods:{
          /*用户名不能小于6；用户名只能包含字母，数组，下划线；用户名不能重复*/
          nameListener(innerHTML){
            if(innerHTML.length<6){
              this.nameHint.text="username must greater than 6";
              this.nameHint.color="red";
              console.info(this.nameHint.color);
            }else {
              if(!/^\w+$/.test(innerHTML)){
                this.nameHint.text="username must only contain letter,number,underscore";
                this.nameHint.color="lightred";
              }else {
                this.vNameIndex++;
                var vNameIndex=this.vNameIndex;
                this.$http.get('api/verifyname',
                  {
                    name:innerHTML,
                    vNameIndex:vNameIndex
                  }
                ).then(function (response) {
                  console.info(response);
                },function (response) {
                });
              }
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
