<template>
    <div class="create-input" :style="pStyle" @mouseover="showDel=true" @mouseleave="showDel=false">
      <div class="cardId">{{cardId}}</div>
      <div class="term" contenteditable="true" v-on="inputListener" v-html="initTermText"
           :placeholder="termHint"
           :style="{borderBottom:termBB}" @paste="onPaste($event)"></div>
      <div class="definition" contenteditable="true" v-on="inputListener" v-html="initDefText"
           :placeholder="defHint"
           :style="{borderBottom:defBB}" @paste="onPaste($event)"></div>
      <icon name="delete" class="delete animated bounceIn" v-if="showDel" @click.native="$emit('delete')"></icon>
    </div>
</template>

<script>
    export default {
        name: "create-input",
      data(){
          return{
            pStyle:[],
            termLT:"",
            defLT:"",
            showDel:false,
            termBB:"1px solid white",
            defBB:"1px solid white",
            termHint:"",
            defHint:""
          }
      },
      props:{
          termText:{
            required:true
          },
          defText:{
            required:true
          },
          termBorder:{
            type:String,
            default:'white 1px solid'
          },
          defBorder:{
            type:String,
            default:'white 1px solid'
          },
          cardId:{
            type:Number
          },
          hasInitValue:{
            type:Boolean,
            default:false
          },
          initTermText:{
            type:String,
            default:""
          },
          initDefText:{
          type:String,
            default:""
          }
      },
      watch:{
        termBorder:function () {
          this.termBB=this.termBorder;
        },
        defBorder:function () {
          this.defBB=this.defBorder;
        },
      },
      created(){
          this.pStyle={
            backgroundColor:this.randomColor(0.6),
          }
          if(this.hasInitValue){             //如果input里面有初始值，就让term和def的hint为空
            this.termHint="";
            this.defHint="";
          }else {
            this.termHint=this.$t('createSet.termHint');
            this.defHint=this.$t('createSet.definitionHint');
          }
      },
      computed:{
        inputListener(){
          var vm=this;
          return Object.assign({},
            this.$listeners,
            {
              input:function (event) {
                if(event.target.className=='term'){
                  console.log(event.target.innerText);
                  vm.$emit('update:termText',event.target.innerText);
                }else if(event.target.className=='definition'){
                  vm.$emit('update:defText',event.target.innerText);
                }
              },
            }
          )
        }
      },
      methods:{
        onPaste(e){
          e.preventDefault();
          var text = null;

          if(window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text');
          } else {
            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
          }
          if (document.body.createTextRange) {
            if (document.selection) {
              textRange = document.selection.createRange();
            } else if (window.getSelection) {
              sel = window.getSelection();
              var range = sel.getRangeAt(0);

              // 创建临时元素，使得TextRange可以移动到正确的位置
              var tempEl = document.createElement("span");
              tempEl.innerHTML = "&#FEFF;";
              range.deleteContents();
              range.insertNode(tempEl);
              textRange = document.body.createTextRange();
              textRange.moveToElementText(tempEl);
              tempEl.parentNode.removeChild(tempEl);
            }
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
          } else {
            // Chrome之类浏览器
            document.execCommand("insertText", false, text);
          }
        },
      }
    }
</script>

<style scoped>
  [contenteditable=true]:empty:before{
    content: attr(placeholder);
    display: block; /* For Firefox */
    cursor: text;
  }
  .create-input{
    height: fit-content;
    display: flex;
    align-items: center;
    padding: 1.5rem 2.5rem;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
    color: white;
  }
  .cardId{
    position: absolute;
    left: 1rem;
    user-select: none;
  }
  .term{
    width: 48%;
    height: fit-content;
    color: white;
    outline: none;
    min-height: 1.6rem;                  /*兼容firefox*/
    white-space: pre-wrap;
  }
  .definition{
    width: 48%;
    height: fit-content;
    color: white;
    outline: none;
    min-height: 1.6rem;
    white-space: pre-wrap;
  }
  .delete{
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    right: 0.8rem;
    color: white;
  }
  .delete:hover{
    color: var(--seablue);
    cursor: pointer;
  }
</style>
