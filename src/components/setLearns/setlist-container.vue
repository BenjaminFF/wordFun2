<template>
  <div class="container" :style="{color:theme.itemTextColor}">
    <div class="header" :style="{backgroundColor:header.bg}">
      <div class="title">{{header.title}}</div>
      <div class="subtitle">{{header.subtitle}}</div>
    </div>
    <div class="listItems-container">
      <div class="listItems-inner-container">
        <transition-group enter-active-class="animated fadeIn">
          <list-item v-for="(card,index) in cards" class="list-item" :key="index" v-if="!loading" :style="{backgroundColor:card.bg}"
                     :card-id="index+1" :termText="card.term" :defText="card.definition"></list-item>
        </transition-group>
      </div>
    </div>
    <div class="tool-container">
      <icon name="tool" class="tool" @click.native="showTools" :style="{backgroundColor:toolStyle.bg}"></icon>
      <icon name="edit" class="tool-edit" @click.native="editToCreateSet" :style="{top:toolStyle.editTop,backgroundColor:toolStyle.bg}"></icon>
      <icon name="share" class="tool-share" :style="{top:toolStyle.shareTop,backgroundColor:toolStyle.bg}"></icon>
    </div>
    <wait-dialog v-if="loading" :text="'S'" :color="theme.dialogColor" :style="{backgroundColor:theme.dialogBG}"></wait-dialog>
  </div>
</template>

<script>
    import ListItem from "./list-item";
    import WaitDialog from "../wait-dialog";
    import {mapState,mapMutations} from 'vuex'
    import SetItem from "../sidebaritems/set-item";
    import theme from '../../assets/theme/TsetLearn';
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
              bg:''
            },
            header:{
              title:"",
              subtitle:"",
              bg:''
            },
            theme:{},
          }
      },
      watch:{
        flushState(){
          if(this.flushState){
            this.fetchData();
            this.setFlushState(false);
            console.log(this.flushState);
          }
        }
      },
      computed:{
        ...mapState({
          flushState:state=>state.wordset.flushState,
        }),
      },
      created(){
          this.theme=theme[this.themeName].setListT;
          this.toolStyle.bg=this.getColor(this.theme.itemBGs);
          this.header.bg=this.getColor(this.theme.itemBGs);
          this.fetchData();
      },
      destroyed(){
        console.log("setlist-container destroyed");
      },
      methods:{
        fetchData(){
          this.loading=true;
          let login_Info=this.getCookie("login_Info");
          let username=JSON.parse(login_Info).username;
          let curSet=JSON.parse(this.getCookie('curSet'));
          this.header.title=decodeURIComponent(this.limitLength(curSet.title,40,true));     //title字数过长，影响视觉
          this.header.subtitle=decodeURIComponent(this.limitLength(curSet.subtitle,100,true));
          let createTime=curSet.timeStamp;
          this.axios.get('/api/getCards', {
            params: {
              username:username,
              createTime:createTime
            }
          })
            .then((response)=>{
              let cards=[];
              for(let i=0;i<response.data.length;i++){
                let term=decodeURIComponent(response.data[i].term).replace(/\n/g,"<br>");   //用\n替代<br>才能实现换行
                let definition=decodeURIComponent(response.data[i].definition).replace(/\n/g,"<br>");
                let bg=this.getColor(this.theme.itemBGs);
                if(i!=0&&this.theme.itemBGs.length!=1){
                  while (bg==cards[i-1].bg){
                    bg=this.getColor(this.theme.itemBGs);
                  }
                }
                let card={
                  term:term,
                  definition:definition,
                  bg:bg
                }
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
        editToCreateSet(){
          this.setCookie('createSetMode','edit',1);
          this.showCreateSet();
        },
        ...mapMutations({
          setCreateState:'wordset/setCreateState',
          showCreateSet:'wordset/showCreateSet',
          setFlushState:'wordset/setFlushState'
        }),
      },
      components: {SetItem, ListItem,WaitDialog},
      props:{
        themeName:{
          type:String,
          required:true
        }
      }
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
    user-select: none;
  }
  .header{
    width: 70%;
    height: 10%;
    display: flex;
    align-items: center;
    flex-direction: column;
    user-select: text;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
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
    user-select: text;
  }
  .tool-container{
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tool{
    padding: 0.8rem;
    width: 1.8rem;
    height: 1.8rem;
    background-color: yellowgreen;
    border-radius: 2rem;
    cursor: pointer;
    z-index: 20;
  }
  .tool-edit{
    position: absolute;
    padding: 0.8rem;
    width: 1.2rem;
    height: 1.2rem;
    top: 0;
    background-color: yellowgreen;
    border-radius: 2rem;
    cursor: pointer;
    transition: 0.5s all ease-in-out;
  }
  .tool-share{
    position: absolute;
    padding: 0.8rem;
    width: 1.2rem;
    height: 1.2rem;
    top: 0;
    background-color: yellowgreen;
    border-radius: 2rem;
    cursor: pointer;
    transition: 0.5s all ease-in-out;
  }
</style>
