<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="word-matrix">
      <div class="def-container">
        {{definition}}
      </div>
      <div class="matrix-container" :style="{'--row':row,'--column':row}">
        <div v-for="(cell,index) in cells" class="cell" :class="{cellActive:cell.isActive}"
             @click="checkLetter(cell)" :key="index">
          {{cell.letter}}
          <icon name="space" class="cell-space" v-if="cell.isSpace"></icon>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import _ from 'lodash'
    export default {
        name: "word-matrix",
      data(){
          return{
            cells:[],
            row:0,
            curIndex:0,
            completed:true
          }
      },
      created(){
          this.initCells();
      },
      methods:{
        initCells(){
            let letters=this.term.toLowerCase().split("");
            if(letters.length<16){
              for(let i=letters.length;i<16;i++){
                let randomLetter=String.fromCharCode(parseInt(Math.random()*25)+97);   //A-Z是65~90 a-z是96~122,单词定义不区分大小写
                letters.push(randomLetter);
              }
            }else if(letters.length<25){
              for(let i=letters.length;i<25;i++){
                let randomLetter=String.fromCharCode(parseInt(Math.random()*25)+97);   //A-Z是65~90 a-z是96~122,单词定义不区分大小写
                letters[i]=randomLetter;
              }
            }
            letters=_.shuffle(letters);
            let cells=[];
            for(let i=0;i<letters.length;i++){
              let cell={
                letter:letters[i],
                isActive:false,
                isSpace:false
              }
              if(letters[i].charCodeAt(0)==32){
                cell.isSpace=true;
              }
              cells.push(cell);
            }
            this.cells=cells;
            this.initGrid();
          },
        initGrid(){
            this.row=Math.sqrt(this.cells.length);
          },
        checkLetter(cell){
          let curLetter=this.term[this.curIndex].toLowerCase();
          if(curLetter==cell.letter){
            cell.isActive=true;
            this.curIndex++;
          }
          if(this.curIndex==this.term.length){
            this.$emit('dismiss');
          }
        }
      },
      props:{
        term:{
          type:String,
          required:true
        },
        definition:{
            type:String,
            required:true
        },
      }
    }
</script>

<style scoped>
  .word-matrix{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .def-container{
    font-size: 2rem;
    margin: 3rem;
    user-select: none;
    color: var(--tealdeer);
  }
  .matrix-container{
    --row:5;
    --column:5;
    width: fit-content;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(var(--row),4rem);
    grid-template-rows: repeat(var(--column),4rem);
  }
  .cell{
    width: auto;
    height: auto;
    background-color: var(--tealdeer);
    margin: 5px;
    box-shadow: 0px 0px 5px 1px lightgrey;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    color: white;
    position: relative;
  }
  .cell-space{
    position: absolute;
    width: 1.8rem;
    height: 1.8rem;
  }
  .cellActive{
    background-color: var(--maximumblue);
  }
</style>
