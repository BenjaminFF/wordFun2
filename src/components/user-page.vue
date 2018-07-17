<template>
    <div class="userpage">
      <my-sidebar class="sidebar"></my-sidebar>
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
    import MySidebar from "./my-sidebar";
    export default {
        name: "user-page",
      components: {MySidebar}
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
