<template>
    <div class="help-center">
      helpcenter
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    export default {
        name: "help-center",
      created(){
          this.setCreateState(false);
          this.selectCurLinkItem('/helpcenter');
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
  .help-center{
    width: 100%;
    height: 100%;
    background-color: yellowgreen;
  }
</style>
