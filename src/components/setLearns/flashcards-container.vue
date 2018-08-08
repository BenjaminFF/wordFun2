<template>
  <div class="container">
    <div class="cards-container" v-if="!loading">
      <flashcard v-for="card in cards" :termText="card.term" :defText="card.definition"
         :style="{backgroundColor:card.bg,transform:'translate3d('+card.offset+'%'+',0,0)'}"></flashcard>
      <icon name="left" class="slideLeft" @click.native="slideLeft" v-if="leftVisibility"></icon>
      <icon name="right" class="slideRight" @click.native="slideRight" v-if="rightVisibility"></icon>
    </div>
    <div class="progressbar" :style="{backgroundColor:progressBG}" v-if="!loading">
    </div>
    <wait-dialog v-if="loading" :text="'F'" :color="'var(--seablue)'"></wait-dialog>
  </div>
</template>

<script>
    import Flashcard from "./flashcard";
    import WaitDialog from "../wait-dialog";
    export default {
        name: "flashcards-container",
      components: {Flashcard,WaitDialog},
      data(){
          return{
            loading:true,
            cards:[],
            curIndex:0,
            leftVisibility:false,
            rightVisibility:false,
            progressBG:""
          }
      },
      created(){
          this.fetchData();
          this.leftVisibility=false;
          this.rightVisibility=true;
          this.progressBG=this.randomColor(0.1);
      },
      methods:{
        fetchData(){
          this.loading=true;
          let euname=this.getCookie("euname");
          let curSet=JSON.parse(this.getCookie('curSet'));
          this.title=this.limitLength(curSet.title,40,true);     //title字数过长，影响视觉
          this.subtitle=this.limitLength(curSet.subtitle,40,true);
          let createTime=curSet.timeStamp;
          this.axios.get('/api/getCards', {
            params: {
              username:escape(euname),
              createTime:createTime
            }
          })
            .then((response)=>{
              let cards=[];
              let offset=0;      //positon left
              for(let i=0;i<response.data.length;i++){
                let term=decodeURIComponent(response.data[i].term).replace(/\n/g,"<br>");   //用\n替代<br>才能实现换行
                let definition=decodeURIComponent(response.data[i].definition).replace(/\n/g,"<br>");
                let bg=this.randomColor(0.6);
                let card={
                  term:term,
                  definition:definition,
                  offset:offset,
                  bg:bg
                }
                offset-=100;
                cards.push(card);
              }
              this.cards=cards;
              console.log(this.cards);
              setTimeout(()=>{
                this.loading=false;
              },500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        slideLeft(){
          if(this.curIndex>=1){
            this.curIndex--;
            for(let i=0;i<this.cards.length;i++){
              this.cards[i].offset-=100;
            }
            if(this.curIndex==0){
              this.leftVisibility=false;
              this.rightVisibility=true;
            }else {
              this.leftVisibility=true;
              this.rightVisibility=true;
            }
          }
        },
        slideRight(){
          if(this.curIndex<this.cards.length-1){
            this.curIndex++;
            for(let i=0;i<this.cards.length;i++){
              this.cards[i].offset+=100;
            }
            if(this.curIndex==this.cards.length-1){
              this.rightVisibility=false;
              this.leftVisibility=true;
            }else {
              this.rightVisibility=true;
              this.leftVisibility=true;
            }
          }
          console.log(this.curIndex);
          console.log("this.rightVisibility："+this.rightVisibility);
        },
      }
    }
</script>

<style scoped>
  .container{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
  }
  .cards-container{
    width: 50%;
    height: 80%;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    margin-top: 4rem;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .progressbar{
    margin-top: 4rem;
    width: 20%;
    height: 50%;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
  }
  .slideLeft{
    position: absolute;
    left: 1rem;
    width: 2rem;
    height: 2rem;
    color: white;
    z-index: 100;
    cursor: pointer;
  }
  .slideRight{
    position: absolute;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    color: white;
    z-index: 100;
    cursor: pointer;
  }
  .slideLeft:hover{
    color: black;
  }
  .slideRight:hover{
    color: black;
  }
</style>
