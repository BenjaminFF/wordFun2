<template>
    <div class="word-set">
      wordset
    </div>
</template>

<script>
  import {mapMutations} from 'vuex'
    export default {
        name: "word-set",
      created(){
        this.setCreateState(false);
        this.selectCurLinkItem('/wordset');
        console.log('wordset created');
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
  .word-set{
    width: 100%;
    height: 100%;
  }
</style>
