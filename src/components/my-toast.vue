<template>
  <transition>
    <div v-if="isShow" class="toast">{{text}}</div>
  </transition>
</template>

<script>
    export default {
        name: "my-toast",
      data(){
          return{
            isShow:true
          }
      },
      mounted(){
          let that=this;
          setTimeout(function () {
            that.isShow=false;
          },this.duration);
      },
      props:{
          text:{
            type:String
          },
          duration:{
            type:Number,
            default:2000
          }
      }
    }
</script>

<style scoped>
  .toast{
    user-select: none;
    position: fixed;
    width: fit-content;
    height: fit-content;
    padding: 1rem 2rem;
    background-color: var(--lightblue);
    border-radius: 2rem;
    bottom: 5rem;
    transform: translateX(50%);
    color: white;
  }
</style>
