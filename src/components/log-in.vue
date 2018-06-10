<template>
  <div class="model">
    <div class="dialog">
      <div class="header">Sign Up</div>
      <div class="container">
        <ani-input title="username" :fontSize="1.3" :hint="nameHint"></ani-input>
        <ani-input title="email" :fontSize="1.3" :hint="emailHint"></ani-input>
        <ani-input title="password" :fontSize="1.3" :hint="pwHint"></ani-input>
        <my-button :fontSize="1.2" class="button">submit</my-button>
      </div>
    </div>
  </div>
</template>

<script>
    import AniInput from "./ani-input";
    import MyButton from "./my-button";
    export default {
        name: "log-in",
      components: {MyButton, AniInput},
      data(){
          return {
            nameHint:"",
            emailHint:"",
            pwHint:""
          }
      },
      methods:{

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
    height: 40rem;
    background-color: white;
    box-shadow: 1px 1px 10px gray;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .header{
    background-color: dodgerblue;
    width: 100%;
    font-size: 1.5rem;
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  .container{
    width: 80%;
    height: 100%;
    margin-top: 3rem;
  }
  .button{
    margin-top: 2rem;
  }
</style>
