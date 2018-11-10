<template>
    <div class="userpage">
      <my-sidebar class="sidebar"></my-sidebar>
      <div class="container">
        <router-view></router-view>
      </div>
      <create-container v-if="createSetInfo. containerVisibility"></create-container>
    </div>
</template>

<script>
    import MySidebar from "./my-sidebar";
    import {mapState} from 'vuex'
    import CreateContainer from "./create-set/create-container";
    export default {
        name: "user-page",
      components: {CreateContainer, MySidebar},
      computed:{
        ...mapState({
          createSetInfo:state=>state.wordset.createSetInfo
        }),
      }
    }
</script>

<style scoped>
  .userpage{
    display: flex;
    width: 100%;
    height: 100%;
  }
  .sidebar{
    flex: 2 0 0;
    margin-left: 3rem;
    margin-top: 3rem;
  }
  .container{
    flex: 8 0 0;
    margin-top: 3rem;
  }
</style>
