<template>
  <div class="set-item" :class="{hover:hovered}"
       @mouseenter="hovered=true" @mouseleave="hovered=false"
       :style="{backgroundColor:backgroundColor}">
    <div class="item-title">{{limitLength(item.title,30,true)}}</div>
    <div class="term-count">{{item.termCount+" terms"}}</div>
    <div class="createtime" v-if="!isDefaultPage">{{timeStamp2String(item.timeStamp)}}</div>
    <div class="createtime" v-if="isDefaultPage">{{"xxxx/xx/xx"}}</div>
    <icon name="delete" class="delete" v-if="hovered&&!isDefaultPage" v-on:click.native.stop="deleteItem"></icon>
    <icon name="info" class="info-icon" v-if="hovered&&!isDefaultPage" @mouseenter.native="infoHovered=true" @mouseleave.native="infoHovered=false"></icon>
    <div class="iconWithBadge" v-for="badgeIcon in badgeIcons" :style="{right:badgeIcon.right}" v-if="infoHovered">
      <icon :name="badgeIcon.icon" class="iconWithBadge-icon" :class="{badgeIconActive:badgeIcon.badge!=0}"></icon>
      <div class="iconWithBadge-badge" v-if="badgeIcon.badge!=0">{{badgeIcon.badge}}</div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
    export default {
        name: "set-item",
      data(){
          return{
            hovered:false,
            backgroundColor:"",
            badgeIcons:[],
            infoHovered:false,
          }
      },
      created(){
          this.init();
      },
      methods:{
        init(){
          this.backgroundColor=this.getSpecialColor();
          let icons=['write','matrix'];
          let badges=[this.item.writeLearnedCount,this.item.matrixLearnedCount];
          for(let i=0;i<icons.length;i++){
            let badgeIcon={
              icon:icons[i],
              badge:badges[i],
              right:-(i+1)*4+'rem'
            }
            this.badgeIcons.push(badgeIcon);
          }
        },
        deleteItem(){
          this.setCookie('deleteInfo',this.item.timeStamp,1); //deletedialog要用
          this.setddState(true);       //show delete dialog
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
          setddState:'wordset/setddState',
        }),
      },
      watch:{
         item(oldItem,newItem){
           this.badgeIcons=[];
           let icons=['write','matrix'];
           let badges=[this.item.writeLearnedCount,this.item.matrixLearnedCount];
           for(let i=0;i<icons.length;i++){
             let badgeIcon={
               icon:icons[i],
               badge:badges[i],
               right:-(i+1)*4+'rem'
             }
             this.badgeIcons.push(badgeIcon);
           }
           console.log(newItem);
         }
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
       },
       isDefaultPage:{
         type:Boolean,
         default:false
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
    width: fit-content;
    height: fit-content;
    position: absolute;
    left: 1rem;
    top: 0.5rem;
  }
  .term-count{
    font-size: 1rem;
    position: absolute;
    left: 1rem;
    bottom: 0.5rem;
    width: fit-content;
    height: fit-content;
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
    top: 0.5rem;
  }
  .delete:hover{
    color: #494949;
  }
  .info-icon{
    position: absolute;
    right: 2.4rem;
    width: 1.2rem;
    height: 1.2rem;
    top: 0.5rem;
  }
  .info-icon:hover{
    color: #494949;
  }
  .iconWithBadge{
    position: absolute;
    width: 2rem;
    height: 2rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .iconWithBadge-icon{
    width: 100%;
    height: 100%;
    color: lightgrey;
  }
  .badgeIconActive{
    color: black;
  }
  .iconWithBadge-badge{
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    right: -1rem;
    top: -1rem;
    background-color: #3c9cd7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
