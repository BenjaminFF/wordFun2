<template>
  <div class="set-item" :class="{hover:hovered}"
       @mouseenter="hovered=true" @mouseleave="hovered=false"
       :style="{backgroundColor:backgroundColor}">
    <div class="item-title">{{limitLength(item.title,30,true)}}</div>
    <div class="term-count">{{item.termCount+" terms"}}</div>
    <div class="createtime">{{timeStamp2String(item.timeStamp)}}</div>
    <icon name="delete" class="delete" v-if="hovered" v-on:click.native.stop="deleteItem"></icon>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
    export default {
        name: "set-item",
      data(){
          return{
            hovered:false,
            backgroundColor:""
          }
      },
      created(){
          this.backgroundColor=this.randomColor(1);
      },
      methods:{
        deleteItem(){
          this.setCookie('deleteInfo',this.item.timeStamp,1);
          this.alterddState(true);       //show delete dialog
        },
        timeStamp2String(timeStamp){
          let dateTime=new Date(timeStamp);
          let year=dateTime.getFullYear();
          let month=dateTime.getMonth()+1;
          let date=dateTime.getDate();       //返回月份的某一天
          return year+'/'+month+'/'+date;
        },
        mouseenter(){
          this.hovered=true;
        },
        mouseleave(){
          this.hovered=false;
        },
        ...mapMutations({
          alterddState:'wordset/alterddState',
        }),
      },
      computed:{
        ...mapState({
          ddState:state=>state.wordset.ddState
        }),
      },
      props:{
       item:{
         type:Object,
         required:true
       }
      }
    }
</script>

<style scoped>
  .set-item{
    width: 30rem;
    height: 4.5rem;
    border-radius: 20px;
    color: white;
    user-select: none;
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    box-shadow: 3px 3px 5px 1px rgb(211, 211, 211);
  }
  .item-title{
    margin-top: 0.3rem;
    width: fit-content;
    height: fit-content;
    font-size: 1.4rem;
    margin-left: 1rem;
  }
  .term-count{
    margin-top: 0.3rem;
    margin-left: 1rem;
    font-size: 1rem;
  }
  .createtime{
    font-size: 1rem;
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 1rem;
    bottom: 0.5rem;
  }
  .hover{
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
    transition: all 0.2s ease-in-out;
  }
  .delete{
    position: absolute;
    right: 0.8rem;
    width: 1.2rem;
    height: 1.2rem;
    top: 25%;
  }
  .delete:hover{
    color: black;
  }
</style>
