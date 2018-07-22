<template>
    <div class="latest-learn">
      latest-learn
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    export default {
        name: "latest-learn",
      created(){
        this.setCreateState(false);
        this.selectCurLinkItem('/latestlearn');
        console.log('latest');
      },
      methods:{
        ...mapMutations({
          setCreateState:'wordset/setCreateState',
          selectCurLinkItem:'routerdata/selectCurLinkItem'
        }),
      }
    }
</script>

<style scoped>
  .latest-learn{
    width: 100%;
    height: 100%;
  }
</style>
