<template>
    <div class="tools">
      <div class="tool" v-for="n in 10">{{n}}</div>
    </div>
</template>

<script>
    export default {
        name: "tools"
    }
</script>

<style scoped>
  .tools{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid lightgray;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .tools:hover{
    overflow-y: scroll;
  }

  .tools::-webkit-scrollbar {/*滚动条整体样式*/
    width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  }

  .tools::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 1px;
    background: lightgray;
  }

  .tool{
    flex-shrink: 0;
    box-sizing: border-box;
    width: 100%;
    height: 7em;
    border-bottom: 1px solid lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
