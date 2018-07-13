<template>
    <div class="model" @click="dismiss($event,false)" v-if="isShow">
        <div class="dialog animated bounceInDown">
          <div style="color: white;font-size: 1.5rem;margin-top: 0.8rem">{{$t('createDialog.header')}}</div>
          <div style="color: white;font-size: 1.5rem;margin-top: 1rem">{{$t('createDialog.title')}}</div>
          <div contenteditable="true" class="edit title" v-on:input="titleUpdate($event)"></div>
          <div class="title-hint"></div>
          <div style="color: white;font-size: 1.5rem;margin-top: 1.5rem">
            {{$t('createDialog.subTitle')}}</div>
          <div contenteditable="true" class="edit subtitle" v-on:input="subtitleUpdate($event)"></div>
          <div class="subtitle-hint"></div>
          <div style="color: white;font-size: 1.5rem;margin-top: 1.5rem">{{$t('createDialog.folder')}}</div>
          <div class="folder">
            <div v-for="item in folderItems" class="folder-item"
                 :style="{transform:item.transform}">{{item.text}}</div>
            <icon name="left" class="left" @click.native="clickLeft"></icon>
            <icon name="right" class="right" @click.native="clickRight"></icon>
          </div>
          <div class="folder-hint" style="color: rgba(175,0,0,0.41);margin-top: 0.2rem">{{folderHint}}</div>
          <icon name="cross" class="delete-icon" @click.native="dismiss($event,true)"></icon>
        </div>
    </div>
</template>

<script>
    import AniInput from "./ani-input";
    export default {
        name: "create-dialog",
      data(){
          return{
            title:"",
            subTitle:"",
            folderItems:[],
            isShow:false,
            titleHint:"",
            folderHint:""
          }
      },
      created(){
          let folder=["dskajfkadsfkjaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","水水水水水水水水水"];
          let offset=parseInt(folder.length/2)*(-100);
          for(let i=0;i<folder.length;i++){
            if(this.checkLength(folder[i])>=26){
              let end=26-parseInt(this.getChineseCount(folder[i],26)/2);
              folder[i]=folder[i].substring(0,end)+"...";
            }
            let item={
              offset:offset,
              text:folder[i],
              transform:'translateX('+offset+'%)'
            }
            this.folderItems.push(item);
            offset+=100;
          }
      },
      methods:{
          titleUpdate(event){
            this.title=event.target.innerHTML;
            this.$emit('update:title',this.title);
          },
          subtitleUpdate(event){
          this.subTitle=event.target.innerHTML;
          this.$emit('update:subtitle',this.subTitle);
          },
          checkLength(str){
            let len=0;
            let newStr;
            for(let i=0;i<str.length;i++){
              if(str.charCodeAt(i)>=127||str.charCodeAt(i)==94){            //中文字符算2个Length
                len+=2;
              }else {
                len++;
              }
            }
            return len;
          },
          getChineseCount(str,end){
            let count=0;
            for(let i=0;i<end;i++){
              if(str.charCodeAt(i)>=127||str.charCodeAt(i)==94){
                count++;
              }
            }
            return count;
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
            if(this.folderItems.length==1){
              this.folderHint=this.$t('createDialog.folderHint');
              setTimeout(function () {
                vm.folderHint="";
              },1500);
              return;
            }
             let fItem=this.folderItems.shift();
             fItem.offset+=(this.folderItems.length+1)*100;
             fItem.transform='translateX('+fItem.offset+'%)';
             this.folderItems.push(fItem);
             let offset=this.folderItems[0].offset;
             for(let i=0;i<this.folderItems.length;i++){
               let item=this.folderItems[i];
               item.offset-=100;
               item.transform='translateX('+item.offset+'%)';
             }

            let that=this;
            this.$nextTick(function () {
              let el=document.querySelectorAll('.folder-item');
              console.log(el.length);
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
            if(this.folderItems.length==1){
              console.log("only you");
              this.folderHint=this.$t('createDialog.folderHint');
              setTimeout(function () {
                vm.folderHint="";
              },1500);
              return;
            }
            let LItem=this.folderItems.pop();
            LItem.offset-=(this.folderItems.length+1)*100;
            LItem.transform='translateX('+LItem.offset+'%)';
            this.folderItems.unshift(LItem);
            let offset=this.folderItems[0].offset;
            for(let i=0;i<this.folderItems.length;i++){
              let item=this.folderItems[i];
              item.offset+=100;
              item.transform='translateX('+item.offset+'%)';
            }

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
          },
          dismiss(event,isIcon){
            if(event.target.className=="model"||isIcon){
              this.isShow=false;
              this.$emit('dismiss');
              this.init();
            }
          }
      },
      components: {AniInput},
      props:{
          showCD:{
            type:Boolean,
            default:function () {
              return false;
            }
          }
      },
      watch:{
          showCD:function () {
            this.isShow=this.showCD;
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
    background-color: var(--seablue);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
  }
  .edit{
    border: 1px solid white;
    width: 70%;
    height: fit-content;
    outline: none;
    color: white;
    border-radius: 10px;
  }
  .title{
    text-align: center;
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
  }
  .subtitle{
    text-align: center;
    padding: 0.2rem 1rem;
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
  .title-hint{
    width: 60%;
    height: 1.2rem;
  }
  .subtitle-hint{
    width: 60%;
    height: 1.2rem;
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
</style>
