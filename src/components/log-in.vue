<template>
  <transition name="fade">
  <div class="model" v-if="isShow" @click="dismiss($event)">
    <div class="dialog">
      <div class="container">
        <ani-input title="username/email" :fontSize="1.3"></ani-input>
        <ani-input title="password" :fontSize="1.3"></ani-input>
        <my-button :fontSize="1.2" class="button" v-on:click.native="login">LOG IN</my-button>
        <p class="fg">forget password?</p>
      </div>
      <icon name="delete" class="rtimg"></icon>
    </div>
  </div>
  </transition>
</template>

<script>
    import AniInput from "./ani-input";
    import MyButton from "./my-button";
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
      methods:{
          init(){

          },
          login:function () {
            console.info("gg");
            this.$http.get('api/signup',
            ).then(function (response) {
              console.info(response);
            },function (response) {

            });
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
  }
  .dialog{
    width: 30rem;
    height: 30rem;
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
