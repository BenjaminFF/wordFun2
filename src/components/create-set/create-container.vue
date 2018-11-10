<template>
  <transition enter-active-class="animated slideInDown" v-on:after-enter="createSetVisible=true">
    <div class="create-container">
      <create-set v-if="createSetVisible"></create-set>
    </div>
  </transition>
</template>

<script>
    import CreateSet from "./create-set";
    import {mapMutations} from 'vuex'
    export default {
        name: "create-container",
      components: {CreateSet},
      data(){
          return{
            createSetVisible:false
          }
      },
      created(){

      },
      methods:{

      }
    }
</script>

<style scoped>
  .create-container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10000;
    background-color: white;
  }
</style>
