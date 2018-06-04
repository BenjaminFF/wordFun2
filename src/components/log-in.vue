<template>
  <div class="model">
    <div class="dialog">
      <div class="header">Sign Up</div>
      <ani-input title="username" font-size="1.2"></ani-input>
      <ani-input title="email" :fontSize="1.2"></ani-input>
      <ani-input title="password" :fontSize="1.2"></ani-input>
    </div>
  </div>
</template>

<script>
    import AniInput from "./ani-input";
    export default {
        name: "log-in",
      components: {AniInput},
      data(){
          return {

          }
      },
      methods:{

      }
    }
</script>

<style scoped>
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
  }
  .header{
    background-color: dodgerblue;
    width: 100%;
    height: 5rem;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
</style>
