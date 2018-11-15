<template>
    <div class="word-game">
      <div class="create-button" @click="showCreateCW=true"></div>
      <create-crossword v-if="showCreateCW"></create-crossword>
    </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import MyButton from "../my-button";
  import CreateCrossword from "../crossword/create-crossword";
    export default {
        name: "word-game",
      components: {CreateCrossword, MyButton},
      data(){
          return{
            showCreateCW:false
          }
      },
      created(){
        this.setSFoldersState(false);
        this.selectCurLinkItem('/wordgame');
        console.log("wordgame");
      },
      methods:{
        ...mapMutations({
          selectCurLinkItem:'routerdata/selectCurLinkItem',
          setSFoldersState:'wordset/setSFoldersState'
        }),
      }
    }
</script>

<style scoped>
  .word-game{
    width: 100%;
    height: 100%;
  }
  .create-button{
    width: 6rem;
    height: 3rem;
    background-color: black;
  }
</style>
