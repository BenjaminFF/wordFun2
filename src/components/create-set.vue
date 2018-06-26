<template>
    <div class="create-set">
      <create-input v-for="item in items" class="create-input" :key="item.index"
                    :defText.sync="item.defText" :termText.sync="item.termText">
      </create-input>
      <div class="add-button" @click="showText">add item</div>
    </div>
</template>

<script>
    import CreateInput from "./create-input";
    import MyButton from "./my-button";
    export default {
        name: "create-set",
        data(){
          return{
            items:[]
          }
        },
        created(){
          for(let i=0;i<5;i++){
            var item={
              index:i,
              termText:"",
              defText:""
            }
            this.items.push(item);
          }
          this.items[0].termText="0gg";
        },
      methods: {
        showText() {

        },
      },
      components: {MyButton, CreateInput}
    }
</script>

<style scoped>
  .create-set{
     width: 35rem;
     height: 25rem;
    overflow: scroll;
   }
  .create-input{
    width: 95%;
  }

  .create-set:hover{
    overflow-y: scroll;
  }

  .add-button{
    width: 95%;
    height: 4.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: yellowgreen;
    cursor: pointer;
    text-decoration: underline;
    color: white;
  }

  .create-set::-webkit-scrollbar {/*滚动条整体样式*/
    width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  }

  .create-set::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 1px;
    background: var(--seablue);
  }
</style>
