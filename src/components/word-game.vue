<template>
    <div class="word-game">
      WordGame 建设中。。。
    </div>
</template>

<script>
  import {mapMutations} from 'vuex'
    export default {
        name: "word-game",
      created(){
        this.setCreateState(false);
        this.selectCurLinkItem('/wordgame');
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
  .word-game{
    width: 100%;
    height: 100%;
  }
</style>
