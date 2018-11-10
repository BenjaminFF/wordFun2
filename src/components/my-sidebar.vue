<template>
  <div class="sidebar">
      <div class="item" v-for="item in linkItems">
        <router-link v-bind:to="item.link" :class="{active:item.selected}" class="itemtitle">{{$t("sidebar["+item.index+"]")}}</router-link>
      </div>
  </div>
</template>

<script>
  import { mapState,mapMutations} from 'vuex';
    export default {
        name: "my-sidebar",
      data(){
          return{
          }
      },
      created(){
        this.initLinkitems();
        let currentPath=this.$router.currentRoute.fullPath;
        this.selectCurLinkItem(currentPath);
      },
      methods:{
        ...mapMutations({
          initLinkitems:'routerdata/initLinkitems',
          selectCurLinkItem:'routerdata/selectCurLinkItem'
        }),
      },
      computed:{
        ...mapState({
          linkItems:state=>state.routerdata.linkItems,
        }),
      },
    }
</script>

<style scoped>
  .sidebar{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    user-select: none;
  }
  .item{
    width: 100%;
    height: 3.2rem;
    display: flex;
    align-items: center;
  }
  .itemtitle{
    text-decoration: none;
    font-size: 1.5rem;
    color: var(--lightblue);
  }
  .itemtitle:hover{
    cursor: pointer;
    color: var(--seablue);
  }
  .active{
    color: var(--seablue);
  }
</style>
