<template>
  <div class="sidebar">
    <div class="title">
      All Set
      <img src="../assets/bar3.svg"/>
    </div>
    <div class="list">
      <div class="item" v-for="n in 20">
        <p>ldakjfdalksfjalkfasfasfasfsfasfasfsafasfsfsafsafasfassafasfasfafsaf</p>
      </div>
    </div>
  </div>
</template>

<script>
  import '../assets/feather.svg'
  var f=require('../assets/feather.svg');
    export default {
        name: "my-sidebar",
      data(){
          return{

          }
      }
    }
</script>

<style scoped>
  .sidebar{
    width: 100%;
    height: 100%;
    border: 1px solid lightgray;
    display: flex;
    flex-direction: column;
  }
  .title{
    width: 100%;
    height: 3em;
    border-bottom: 1px solid lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-shrink: 0;
  }

  .list{
    margin-top: 1em;
    width: 100%;
    height: fit-content;
    margin-bottom: 1em;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: hidden;
  }

  .list:hover{
    overflow-y: scroll;
  }

  .list::-webkit-scrollbar {/*滚动条整体样式*/
    width: 3px;     /*高宽分别对应横竖滚动条的尺寸*/
  }

  .list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 1px;
    background: gray;
  }

  .title img{
    position: absolute;
    width: 1.2em;
    height: 1.2em;
    right: 1em;
    cursor: pointer;
  }
  .item{
    width: 80%;
    height: 3em;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item p{
    width: fit-content;
    max-width: 12em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    cursor: pointer;
  }
</style>
