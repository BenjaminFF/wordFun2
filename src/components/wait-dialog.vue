<template>
  <div class="shadow">
    <div class="loading" :style="{'border-color':color}"></div>
    <div class="load_text" :style="{color:color}">{{text}}</div>
  </div>
</template>

<script>
    export default {
        name: "wait-dialog",
      props:{
          text:{
            type:String
          },
          color:{
            type:String,
            default:'var(--vermilion)'
          },
        }
    }
</script>

<style scoped>
  .shadow{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    z-index: 20;
    align-items: center;
  }
  .loading{
    position: absolute;
    width: 6rem;
    height: 6rem;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid var(--vermilion);
    clip: rect(0,6rem,3rem,0rem);
    transform-origin: center;
    animation: rotate 1.5s infinite linear;
  }
  .load_text{
    position: absolute;
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
