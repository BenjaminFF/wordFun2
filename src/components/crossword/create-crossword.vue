<template>
  <transition enter-active-class="animated slideInDown" v-on:after-enter="showCells">
    <div class="create-crossword-container">
      <div class="grids-container">
        <div class="cell-style" v-for="cell in cells">
          <div class="cell-content" v-if="cell.visibility"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "create-crossword",
      data(){
          return{
            cells:[]
          }
      },
      created(){
          this.initCells();

      },
      methods:{
        initCells(){
          let cells=[];
          for(let i=0;i<100;i++){
            let cell={
              text:"",
              isFocus:false,
              visibility:false
            }
            cells.push(cell);
          }
          this.cells=cells;
        },
        showCells(){
          let delay=0;
          /*for(let i=0;i<100;i++){
            setTimeout(()=>{
              this.cells[i].visibility=true;
            },delay);
            delay+=10;
          }*/
          /*let arr=[44,45,55,54];
          let startIndex=53;
          for(let i=3;i<=9;i+=2){
            for(let j=0;j<i*4;j++){
              arr.push(startIndex);
              if(j<i-1){
                startIndex-=10;
              }else
              if(j>=i-1&&j<i*2-1){
                startIndex+=1;
              }else
              if(j>=i*2-1&&j<i*3-1){
                startIndex+=10;
              }else
              if(j>=i*3-1){
                startIndex-=1;
              }
            }
          }
          for(let i=0;i<100;i++){
            setTimeout(()=>{
              this.cells[arr[i]].visibility=true;
            },delay);
            delay+=20;
          }*/
          let arr=[];
          for(let i=0;i<10;i++){
            let startIndex=i;
            for(let j=0;j<i*2+1;j++){
              let item={
                index:startIndex,
                delay:delay
              }
              arr.push(item);
              if(j<i){
                startIndex+=10;
              }else {
                startIndex-=1;
              }
            }
            delay+=50;
          }
          for(let i=0;i<100;i++){
            setTimeout(()=>{
              this.cells[arr[i].index].visibility=true;
            },arr[i].delay);
          }
        }
      }
    }
</script>

<style scoped>
  .create-crossword-container{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    background-color: #d48200;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .grids-container{
    display: grid;
    grid-template-columns: repeat(10,3rem);
    grid-template-rows: repeat(10,3rem);
    position: absolute;
  }
  .cell-style{
    width: auto;
    height: auto;
    margin: 2px;
  }
  .cell-content{
    width: 100%;
    height: 100%;
    border-radius: 3px;
    background-color: white;
    animation: fadeIn 0.4s ease-in-out;
  }
  @keyframes fadeIn {
    0%{
      opacity: 0;
    }
    100%{
      opacity: 100%;
    }
  }
</style>
