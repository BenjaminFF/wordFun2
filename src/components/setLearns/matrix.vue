<template>
  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="container">
      <div class="def-container" @click="showMaxDef=true" v-html="definition" :style="{color:textColor}">
      </div>
      <div class="matrix-container">
        <div class="matrix-inner-container" :style="{'--row':row,'--column':row,'--size':size}">
          <div v-for="(cell,index) in cells" class="cell"
               @click="checkLetter(cell)" :key="index" :style="{backgroundColor:cell.BG,color:cell.color}">
            {{cell.letter}}
            <icon name="space" class="cell-space" v-if="cell.isSpace"></icon>
            <div class="subscript" v-if="cell.isActive" v-html="cell.subScript"></div>
          </div>
        </div>
      </div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut ">
        <div class="maxdef" v-if="showMaxDef" @click="showMaxDef=false" v-html="maxdef"></div>
      </transition>
      <icon name="idea" class="idea-icon" @click.native="autoFill" :style="{color:bulbColor}"
      @mouseleave.native="bulbColor=bulbStyle.normal" @mouseenter.native="bulbColor=bulbStyle.active"></icon>
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
          showMaxDef:false,
          canUpdate:false,
          bulbColor:''
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
        },
        cellStyle:{
          type:Object,
          required:true
        },
        textColor:{
          type:String,
          required:true
        },
        bulbStyle:{
          type:Object,
          required:true
        }
      },
      created(){
          this.canUpdate=true;       //初始化为true，如果启动了提示，就为false
          this.bulbColor=this.bulbStyle.normal;
          this.initCells();
      },
      methods:{
        initCells(){
          let letters=this.term.toLowerCase().split("");
          let cellStyle=this.cellStyle;
          if(letters.length<16){
            for(let i=letters.length;i<16;i++){
              let randomLetter=String.fromCharCode(parseInt(Math.random()*25)+97);   //A-Z是65~90 a-z是96~122,单词定义不区分大小写
              letters.push(randomLetter);
            }
            this.size='3.5rem';
          }else if(letters.length<25){
            for(let i=letters.length;i<25;i++){
              let randomLetter=String.fromCharCode(parseInt(Math.random()*25)+97);   //A-Z是65~90 a-z是96~122,单词定义不区分大小写
              letters[i]=randomLetter;
            }
            this.size='3rem';
          }
          letters=_.shuffle(letters);
          let cells=[];
          for(let i=0;i<letters.length;i++){
            let cell={
              letter:letters[i],
              isActive:false,
              isSpace:false,
              color:cellStyle.color,
              BG:cellStyle.BG,
              subScript:""
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
          if(this.curIndex==this.term.length||cell.isActive){      //已经选中就不能再选
            return;
          }
          let curLetter=this.term[this.curIndex].toLowerCase();
          if(curLetter==cell.letter){
            cell.isActive=true;
            this.curIndex++;
            cell.color=this.cellStyle.activeColor;
            cell.BG=this.cellStyle.activeBG;
            cell.subScript=this.curIndex;
          }
          if(this.curIndex==this.term.length){
            setTimeout(()=>{
              this.$emit('dismiss',this.canUpdate);
            },500);
          }
        },
        autoFill(){
          if(this.curIndex==this.term.length){
            return;
          }
          if(this.canUpdate){
            this.canUpdate=false;
          }
          let curLetter=this.term[this.curIndex].toLowerCase();
          for(let i=0;i<this.cells.length;i++){
            if(this.cells[i].letter==curLetter&&!this.cells[i].isActive){
              let cell=this.cells[i];
              cell.isActive=true;
              cell.color=this.cellStyle.activeColor;
              cell.BG=this.cellStyle.activeBG;
              this.curIndex++;
              cell.subScript=this.curIndex;
              break;
            }
          }

          if(this.curIndex==this.term.length){
            setTimeout(()=>{
              this.$emit('dismiss',this.canUpdate);
            },500);
          }
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
    height: 100%;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 2rem;
  }

  .def-container{
    width: 100%;
    height: 30%;
    font-size: 1.5rem;
    color: white;
    word-break: break-word;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    margin-bottom: 1.5rem;
    user-select: none;
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
    --size:3.5rem;
    width: fit-content;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(var(--row),var(--size));
    grid-template-rows: repeat(var(--column),var(--size));
  }
  .cell{
    position: relative;
    width: auto;
    height: auto;
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
    background-color: var(--seablue);
    color: white;
  }

  .maxdef{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 20rem;
    padding-right: 20rem;
    box-sizing: border-box;
    font-size: 2rem;
    color: yellowgreen;
    user-select: none;
    z-index: 1000;
    word-break: break-word;
  }

  .idea-icon{
    width: 2rem;
    height: 2rem;
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
  }

  .idea-icon:hover{
    cursor: pointer;
    color: yellow;
  }

  .subscript{
    position: absolute;
    right: 0.2rem;
    bottom: 0.2rem;
    font-size: 0.6rem;
  }
</style>
