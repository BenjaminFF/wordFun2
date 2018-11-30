<template>
  <transition enter-active-class="animated slideInDown"  leave-active-class="animated slideOutUp"
              v-on:after-enter="createSetVisible=true">
    <div class="create-container">
      <create-set v-if="createSetVisible"></create-set>
      <div class="return" @click="createSetReturn">
        <icon name="return" class="return-icon" ></icon>
        {{$t('setLearn.sideBar.back')}}
      </div>
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
        createSetReturn(){
          this.dismissCreateSet();
          this.setFlushState(false);
        },
        ...mapMutations({
          dismissCreateSet:'wordset/dismissCreateSet',
          setFlushState:'wordset/setFlushState'
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
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10000;
    background-color: #fff9f2;
  }

  .return{
    user-select: none;
    cursor: pointer;
    display: flex;
    position: fixed;
    align-items: center;
    left: 1rem;
    top: 1rem;
    font-size: 1.2rem;
    color: gray;
  }
  .return-icon{
    width: 1.2rem;
    height: 1.2rem;
  }

  .return:hover{
    color: #3c9cd7;
  }

</style>
