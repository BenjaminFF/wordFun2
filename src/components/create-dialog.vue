<template>
    <div class="model">
        <div class="dialog animated bounceInDown">
          <div style="color: white;font-size: 1.5rem;margin-top: 0.8rem">{{$t('createDialog.header')}}</div>
          <div style="color: white;font-size: 1.5rem;margin-top: 1rem">{{$t('createDialog.title')}}</div>
          <div contenteditable="true" class="edit title" v-on="inputListener"
               v-on:input="titleUpdate($event)" @keydown="banInput($event,40)"
          @paste="onPaste($event)" @keyup="checkTitle($event)"></div>
          <div style="color: white;font-size: 1.5rem;margin-top: 1.5rem">
            {{$t('createDialog.subTitle')}}</div>
          <div contenteditable="true" @keydown="banInput($event,50)"  @paste="onPaste($event)"
               @keyup="checkTitle($event)"
               class="edit subtitle" v-on:input="subtitleUpdate($event)"></div>
          <div style="color: white;font-size: 1.5rem;margin-top: 1.5rem">{{$t('createDialog.folder')}}</div>
          <div class="folder">
            <div v-for="item in slideFolders" class="folder-item"
                 :style="{transform:item.transform}">{{item.text}}</div>
            <icon name="left" class="left" @click.native="clickLeft"></icon>
            <icon name="right" class="right" @click.native="clickRight"></icon>
          </div>
          <icon name="cross" class="delete-icon" @click.native="dismiss($event,true)"></icon>
          <div class="loading" v-if="isPushing"></div>
        </div>
    </div>
</template>

<script>
    import AniInput from "./ani-input";
    import { mapState,mapMutations } from 'vuex'
    export default {
        name: "create-dialog",
      data(){
          return{
            title:"",
            subTitle:"",
            isShow:false,
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

          if(text.length>=20){
            text=text.substring(0,20);
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
        banInput(event,length){
          if(this.checkLength(event.target.innerText)>length){
            // Backspace, del, 左右方向键
            var code=event.keyCode;
            if (code != 8&&code != 46&&code != 37&&code != 39){
              event.preventDefault();
            }
          }
        },
          titleUpdate(event){
            let text;
            if(event.target.textContent!=undefined){
              text=event.target.textContent;       //兼容火狐
            }else {
              text=event.target.innerText;
            }
            this.title=text;
            this.$emit('update:title',this.title);
          },
          checkTitle(event){
            let text;
            if(event.target.textContent!=undefined){
              text=event.target.textContent;       //兼容火狐
            }else {
              text=event.target.innerText;
            }
            if(this.checkLength(text)>40){
              let text=event.target.innerText.substring(0,40);
              console.log(text);
              event.target.innerHTML="";
              document.execCommand("insertText", false, text);
              this.titleUpdate(event);
            }
          },
          subtitleUpdate(event){
          this.subTitle=event.target.innerText;
          this.$emit('update:subtitle',this.subTitle);
          },
        checksubTitle(event){
          if(this.checkLength(event.target.innerText)>60){
            let text=event.target.innerText.substring(0,60);
            console.log(text);
            event.target.innerText="";
            document.execCommand("insertText", false, text);
            this.subtitleUpdate(event);
          }
        },
          init(){
            this.title="";
            this.subTitle="";
          },
          addTransition(el,transition,delay){
          return el.animate(
            transition,
            {
              duration:600,
              easing: 'cubic-bezier(0,0,0.32,1)',
            }
          );
        },
          clickLeft(){
            var vm=this;
            if(this.slideFolders.length==1){
              this.folderHint=this.$t('createDialog.folderHint');
              setTimeout(function () {
                vm.folderHint="";
              },1500);
              return;
            }
            this.slideLeft();
            let that=this;
            this.$nextTick(function () {
              let el=document.querySelectorAll('.folder-item');
              let o=el[0].getBoundingClientRect();
              let invert=o.left-o.right;
              let m=parseInt(el.length/2);
              let start=0;
              let end=invert;
              for(let i=m-1;i<=m;i++){
                var moveTransition=[
                  { transform: 'translateX(' + start + 'px)' },        //以0为相对位置！！！
                  { transform: 'translateX(' + end + 'px)' }
                ]
                that.addTransition(el[i],moveTransition);
                start=-invert;
                end=0;
              }
            });
          },
          clickRight(){
            var vm=this;
            if(this.slideFolders.length==1){
              console.log("only you");
              this.folderHint=this.$t('createDialog.folderHint');
              setTimeout(function () {
                vm.folderHint="";
              },1500);
              return;
            }
            this.slideRight();
            let that=this;
            this.$nextTick(function () {
              let el=document.querySelectorAll('.folder-item');
              console.log(el.length);
              let o=el[0].getBoundingClientRect();
              let invert=o.left-o.right;
              let m=parseInt(el.length/2);
              if(el.length==2){
                let start=0;
                let end=-invert;
                for(let i=0;i<=1;i++){
                  var moveTransition=[
                    { transform: 'translateX(' + start + 'px)' },        //以0为相对位置！！！
                    { transform: 'translateX(' + end + 'px)' }
                  ]
                  that.addTransition(el[i],moveTransition);
                  start=invert;
                  end=0;
                }
              }else {
                let start=invert;
                let end=0;
                for(let i=m;i<=m+1;i++){
                  var moveTransition=[
                    { transform: 'translateX(' + start + 'px)' },        //以0为相对位置！！！
                    { transform: 'translateX(' + end + 'px)' }
                  ]
                  that.addTransition(el[i],moveTransition);
                  start=0;
                  end=-invert;
                }
              }
            });
            console.log(this.slideFolders);
          },
          dismiss(event,isIcon){
            if(event.target.className=="model"||isIcon){
              this.closeCD();
              this.init();
            }
        },
        ...mapMutations({
          slideLeft:'wordset/slideLeft',
          slideRight:'wordset/slideRight',
          closeCD:'wordset/closeCD',
        }),
      },
      components: {AniInput},
      computed:{
        ...mapState({
          slideFolders:state=>state.wordset.slideFolders,
          showCD:state=>state.wordset.showCD,
          isPushing:state=>state.wordset.isPushing
        }),
        inputListener(){
          var vm=this;
          return Object.assign({},
            this.$listeners,
          )
        }
      }
    }
</script>

<style scoped>
  div,p{
    margin: 0;
    padding: 0;
    user-select: none;
  }
  .model{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.21);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dialog{
    width: 25rem;
    height: 80%;
    background-color: white;
    border-radius: 5px;
    background-color: var(--maximumblue);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
  }
  .edit{
    border: 1px solid white;
    width: 80%;
    outline: none;
    color: white;
    border-radius: 10px;
    min-height: 1.5rem;
    word-break: break-all;
    height: fit-content;
    line-height: 1.5rem;
    user-select: text;
  }
  .title{
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
  }
  .subtitle{
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
  }
  .delete-icon{
    position: absolute;
    right: 0.8rem;
    top: 0.8rem;
    color: white;
    width: 1.8rem;
    height: 1.8rem;
    cursor: pointer;
  }
  .folder{
    width: 80%;
    height: 1.8rem;
    padding: 0rem 1rem;
    position: relative;
    overflow: hidden;
  }
  .left{
    width: 1.8rem;
    height: 1.8rem;
    position: absolute;
    left: 0;
    color: white;
    cursor: pointer;
  }
  .right{
    width: 1.8rem;
    height: 1.8rem;
    position: absolute;
    right: 0;
    color: white;
    cursor: pointer;
  }
  .folder-item{
    width: 100%;
    height: 100%;
    position: absolute;
    vertical-align: center;
    text-align: center;
    color: white;
    left: 0;
  }
  .loading{
    position: absolute;
    width: 4rem;
    height: 4rem;
    box-sizing: border-box;
    border: 2px solid white;
    clip: rect(0,4rem,2rem,0rem);
    transform-origin: center;
    animation: rotate 1.5s infinite linear;
    bottom: 2rem;
  }
</style>
