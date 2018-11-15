<template>
    <div class="model">
        <div class="dialog animated bounceInDown">
          <div style="color: white;font-size: 1.5rem;margin-top: 1rem">{{headerText}}</div>
          <div style="color: white;font-size: 1.5rem;margin-top: 3rem">{{$t('createDialog.title')}}</div>
          <input class="edit title" v-on:input="titleUpdate($event)" :value="title"/>
          <div style="color: white;font-size: 1.5rem;margin-top: 4rem">
            {{$t('createDialog.subTitle')}}</div>
          <textarea class="edit subtitle" v-on:input="subtitleUpdate($event)" :value="subTitle"/>
          <icon name="cross" class="delete-icon" @click.native="dismiss($event,true)"></icon>
        </div>
    </div>
</template>

<script>
    import AniInput from "../ani-input";
    import { mapState,mapMutations } from 'vuex'
    export default {
        name: "create-dialog",
      components: {},
      data(){
          return{
            title:"",
            subTitle:"",
            isShow:false,
            headerText:'',
          }
      },
      props:{
        initTitle:{
          type:String,
          default:''
        },
        initSubTitle:{
          type:String,
          default:''
        }
      },
      created(){
          this.init();
      },
      methods:{
        init(){
          if(this.initTitle!=""){        //表示为修改的单词集，而不是创建的单词集
            this.headerText=this.$t('createDialog.editHeader');
          }else {
            this.headerText=this.$t('createDialog.header');
          }
          this.title=this.initTitle;
          this.subTitle=this.initSubTitle;
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
            this.title=event.target.value;
            this.$emit('update:title',this.title);
          },
        subtitleUpdate(event){
            this.subTitle=event.target.value;
          this.$emit('update:subtitle',this.subTitle);
          },
        dismiss(event,isIcon){
          if(event.target.className=="model"||isIcon){
              this.init();
              this.$emit('dismiss');
          }
        },
      },
      computed:{
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
    border-radius: 20px;
    background-color: var(--maximumblue);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
  }
  .edit{
    background-color: transparent;
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
    margin-top: 0.5rem;
  }
  .subtitle{
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    margin-top: 0.5rem;
    overflow: hidden;
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
    margin-top: 1rem;
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
