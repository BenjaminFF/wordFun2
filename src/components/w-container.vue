<template>
    <div class="container">
      <div class="items">
        <div v-for="n in 9" class="item"></div>
      </div>
      <div class="funcs">
        <img v-for="n in 3"/>
      </div>
    </div>
</template>

<script>
    export default {
        name: "w-container"
    }
</script>

<style scoped>
  .container{
    height: 100%;
    width: 100%;
    border: 1px solid lightgray;
    position: relative;
  }

  .items{
    margin-top: 15%;
    margin-bottom: 10%;
    height: 75%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .items:hover{
    overflow-y: scroll;
  }

  .items::-webkit-scrollbar {/*滚动条整体样式*/
    width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  }

  .items::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 1px;
    background: gray;
  }

  .item{
    flex-grow: 0;
    margin-left: 10%;
    margin-right: 10%;
    box-sizing: border-box;
    flex-shrink: 0;
    width: 80%;
    height: 5em;
    margin-bottom: 2rem;
    border: 1px solid lightgray;
  }

  .funcs{
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 2rem;
    right: 2rem;
  }
  .funcs img{
    width: 2rem;
    height: 2rem;
  }
</style>
