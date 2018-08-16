<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="container" :style="{backgroundColor:bg}">
      <div class="def-container" @click="showMaxDef=true" v-html="definition">

      </div>
      <div class="matrix-container">
        <div class="matrix-inner-container" :style="{'--row':row,'--column':row,'--size':size}">
          <div v-for="(cell,index) in cells" class="cell" :class="{cellActive:cell.isActive}"
               @click="checkLetter(cell)" :key="index" :style="{color:cell.color}">
            {{cell.letter}}
            <icon name="space" class="cell-space" v-if="cell.isSpace"></icon>
          </div>
        </div>
      </div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut ">
        <div class="maxdef" v-if="showMaxDef" @click="showMaxDef=false" v-html="maxdef"></div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import _ from 'lodash'
    export default {
        name: "matrix",
      data(){
        return{
          cells:[],
          row:0,
          curIndex:0,
          size:0,
          bg:"",
          cellColor:"",
          showMaxDef:false
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
        maxdef:{
          type:String,
          required:true
        }
      },
      created(){
          this.bg=this.randomColor(0.8);
          this.showmaxdef=false;
          this.initCells();
      },
      methods:{
        initCells(){
          let letters=this.term.toLowerCase().split("");
          if(letters.length<16){
            for(let i=letters.length;i<16;i++){
              let randomLetter=String.fromCharCode(parseInt(Math.random()*25)+97);   //A-Z是65~90 a-z是96~122,单词定义不区分大小写
              letters.push(randomLetter);
              this.size='4rem';
            }
          }else if(letters.length<25){
            for(let i=letters.length;i<25;i++){
              let randomLetter=String.fromCharCode(parseInt(Math.random()*25)+97);   //A-Z是65~90 a-z是96~122,单词定义不区分大小写
              letters[i]=randomLetter;
              this.size='3.5rem';
            }
          }
          letters=_.shuffle(letters);
          let cells=[];
          let bg=this.bg;
          for(let i=0;i<letters.length;i++){
            let cell={
              letter:letters[i],
              isActive:false,
              isSpace:false,
              color:bg,
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
            cell.color='white';
          }
          if(this.curIndex==this.term.length){
            this.$emit('dismiss');
          }
        },
        test(){
          console.log('gg');
        }
      }
    }
</script>

<style scoped>
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 85%;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 2rem;
  }

  .def-container{
    width: 100%;
    height: 30%;
    font-size: 1.5rem;
    color: white;
    word-wrap: break-word;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    margin-bottom: 2rem;
  }

  .matrix-container{
    width: 100%;
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .matrix-inner-container{
    --row:5;
    --column:5;
    --size:4rem;
    width: fit-content;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(var(--row),var(--size));
    grid-template-rows: repeat(var(--column),var(--size));
  }
  .cell{
    width: auto;
    height: auto;
    background-color: white;
    margin: 7px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
  }
  .cell-space{
    position: absolute;
    width: 1.8rem;
    height: 1.8rem;
  }
  .cellActive{
    background-color: #0FA3B1;
    color: white;
  }

  .maxdef{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.71);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 20rem;
    padding-right: 20rem;
    box-sizing: border-box;
    font-size: 2rem;
    color: yellowgreen;
    user-select: none;
  }
</style>
