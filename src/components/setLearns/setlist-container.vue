<template>
  <div class="container">
    <div class="header"></div>
    <div class="listItems-container">
      <div class="listItems-inner-container">
        <list-item v-for="(card,index) in cards" class="list-item"
                   :card-id="index+1" :termText="card.term" :defText="card.definition"></list-item>
      </div>
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
            cards:[]
          }
      },
      created(){
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
    width: 100%;
    height: 15%;
  }
  .listItems-container{
    width: 80%;
    height: 85%;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
  }
  .listItems-inner-container{
    margin-top: 2rem;
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
</style>
