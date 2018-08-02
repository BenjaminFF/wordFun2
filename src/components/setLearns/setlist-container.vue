<template>
  <div class="container">
    <div class="header" :style="{backgroundColor:headerBackground}">
      <div class="title">{{limitLength(curSet.title,30,true)}}</div>
      <div class="subtitle">{{limitLength(curSet.subtitle,35,true)}}</div>
    </div>
    <div class="listItems-container">
      <div class="listItems-inner-container">
        <transition-group enter-active-class="animated slideInLeft">
          <list-item v-for="(card,index) in cards" class="list-item" :key="index" v-if="!loading"
                     :card-id="index+1" :termText="card.term" :defText="card.definition"></list-item>
        </transition-group>
      </div>
    </div>
    <div class="tool-container">
      <icon name="tool" class="tool" @click.native="showTools":style="{backgroundColor:toolStyle.backGround}"></icon>
      <icon name="edit" class="tool-edit" :style="{top:toolStyle.editTop,backgroundColor:toolStyle.backGround}"></icon>
      <icon name="share" class="tool-share" :style="{top:toolStyle.shareTop,backgroundColor:toolStyle.backGround}"></icon>
    </div>
    <wait-dialog v-if="loading" :text="'G'" :color="'var(--seablue)'"></wait-dialog>
  </div>
</template>

<script>
    import ListItem from "./list-item";
    import WaitDialog from "../wait-dialog";
    import {mapState} from 'vuex'
    import SetItem from "../set-item";
    export default {
        name: "setlist-container",
      data(){
          return{
            loading:true,
            cards:[],
            toolStyle:{
              editTop:0,
              shareTop:0,
              folded:true,
              backGround:""
            },
            headerBackground:""
          }
      },
      created(){
          this.headerBackground=this.randomColor(0.8);
          this.toolStyle.backGround=this.randomColor(1);
          this.fetchData();
      },
      methods:{
        fetchData(){
          this.loading=true;
          let euname=this.getCookie("euname");
          let createTime=this.curSet.timeStamp;
          this.axios.get('/api/getCards', {
            params: {
              username:escape(euname),
              createTime:createTime
            }
          })
            .then((response)=>{
              let cards=[];
              for(let i=0;i<response.data.length;i++){
                let term=decodeURIComponent(response.data[i].term).replace(/\n/g,"<br>");
                let definition=decodeURIComponent(response.data[i].definition).replace(/\n/g,"<br>");
                let card={
                  term:term,
                  definition:definition
                }
                cards.push(card);
              }
              this.cards=cards;
              setTimeout(()=>{
                this.loading=false;
              },500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        showTools(){
          if(this.toolStyle.folded){
            this.toolStyle.editTop='-100%';
            this.toolStyle.shareTop='-200%';
            this.toolStyle.folded=false;
          }else {
            this.toolStyle.editTop='0.2rem';
            this.toolStyle.shareTop='0.2rem';
            this.toolStyle.folded=true;
          }
        },
      },
      computed:{
        ...mapState({
          curSet:state=>state.wordset.curSet
        }),
      },
      components: {SetItem, ListItem,WaitDialog}
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .header{
    width: 70%;
    height: 10%;
    margin-top: 1rem;
    border-radius: 1rem;
    background-color: rgba(235, 235, 235, 0.8);
    box-shadow: 0px 10px 10px 1px rgb(211, 211, 211);
    display: flex;
    align-items: center;
    flex-direction: column;
    color: white;
  }
  .header .title{
    font-size: 2rem;
    margin-top: 0.8rem;
  }
  .header .subtitle{
    font-size: 1.3rem;
    margin-top: 0.8rem;
  }
  .listItems-container{
    margin-top: 1rem;
    width: 80%;
    height: 75%;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
  }
  .listItems-inner-container{
    width: 105%;
    height: 80%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .list-item{
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
  }
  .tool-container{
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 3rem;
    bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tool{
    padding: 0.8rem;
    width: 1.8rem;
    height: 1.8rem;
    background-color: yellowgreen;
    color: white;
    border-radius: 2rem;
    cursor: pointer;
    box-shadow: 0px 0px 20px 1px rgb(200, 200, 200);
    z-index: 20;
  }
  .tool-edit{
    position: absolute;
    padding: 0.8rem;
    width: 1.2rem;
    height: 1.2rem;
    top: 0;
    color: white;
    background-color: yellowgreen;
    border-radius: 2rem;
    cursor: pointer;
    box-shadow: 0px 0px 20px 1px rgb(200, 200, 200);
    transition: 0.5s all ease-in-out;
  }
  .tool-share{
    position: absolute;
    padding: 0.8rem;
    width: 1.2rem;
    height: 1.2rem;
    top: 0;
    color: white;
    background-color: yellowgreen;
    border-radius: 2rem;
    cursor: pointer;
    box-shadow: 0px 0px 20px 1px rgb(200, 200, 200);
    transition: 0.5s all ease-in-out;
  }
</style>
