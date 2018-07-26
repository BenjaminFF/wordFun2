<template>
    <div class="create-container">
        <create-set v-if="loaded"></create-set>
      <div class="shadow" v-if="!loaded">
        <div class="loading"></div>
        <div class="load_text">C</div>
      </div>
    </div>
</template>

<script>
    import CreateSet from "./create-set";
    import {mapMutations} from 'vuex'
    export default {
        name: "create-container",
      components: {CreateSet},
      data(){
          return{
            loaded:false
          }
      },
      created(){
        this.setCreateState(true);
        setTimeout(()=>{
          this.loaded=true;
        },500);
      },
      methods:{
        ...mapMutations({
          setCreateState:'wordset/setCreateState',
        }),
      }
    }
</script>

<style scoped>
  .create-container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .loading{
    position: absolute;
    top: 5rem;
    width: 6rem;
    height: 6rem;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid var(--vermilion);
    clip: rect(0,6rem,3rem,0rem);
    transform-origin: center;
    animation: rotate 1.5s infinite linear;
  }
  .shadow{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    display: flex;
    justify-content: center;
  }
  .load_text{
    position: absolute;
    top: 5rem;
    width: 6rem;
    height: 6rem;
    box-sizing: border-box;
    border: 2px solid rgba(211, 211, 211, 0.4);
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    color: var(--vermilion);
    font-size: 2rem;
  }
</style>
