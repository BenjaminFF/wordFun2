<template>
    <div class="word-sets">
      <input class="set-filter" placeholder="filter sets there..."
             v-on:input="filterSets($event)"/>
      <div class="out-container">
        <wait-dialog :text="'W'" :color="'var(--seablue)'" style="margin-left: -1rem" v-if="!setinited"></wait-dialog>
        <div class="inner-container">
        <transition-group leave-active-class="animated fadeOutLeft"
          enter-active-class="animated fadeInRightBig">
          <set-item v-if="setinited" class="set-item" v-for="(item,index) in items" :item="item" :key="index"></set-item>
        </transition-group>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  import SetItem from "./set-item";
  import WaitDialog from "./wait-dialog";
    export default {
        name: "word-set",
      components: {WaitDialog, SetItem},
      data(){
          return{
            items:[],
            setinited:false,
            filterText:""
          }
      },
      created(){
        this.setCreateState(false);
        this.selectCurLinkItem('/wordsets');
        console.log('wordsets created');

        let euname=this.getCookie("euname");
        this.axios.get('/api/getwordset', {
          params: {
            username:escape(euname)
          }
        })
          .then((response)=>{
            console.log(response.data.sets);
            this.setWordSets(response.data.sets);
            this.items=this.getDealedSets(response.data.sets);
            setTimeout(()=>{
              this.setinited=true;
            },300);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      methods:{
        filterSets(event){
          let text=event.target.value;
          if(text==""){
            this.items=this.getDealedSets(this.sets);
            return;
          }
          let regex=new RegExp(text,'i');
          let newItems=[];
          for(let i=0;i<this.sets.length;i++){
            if(regex.test(unescape(this.sets[i].title))){
              newItems.push(this.getDealedSet(this.sets[i]));
            }
          }
          this.items=newItems;
        },
        getDealedSet(wordset){
          let title=unescape(wordset.title);
          let termCount=wordset.termCount;
          let timeStamp=wordset.createtime;
          let item={
            title:title,
            termCount:termCount,
            timeStamp:timeStamp
          }
          return item;
        },
        getDealedSets(wordsets){
          let items=[];
          for(let i=0;i<wordsets.length;i++){
            let title=unescape(wordsets[i].title);
            let termCount=wordsets[i].termCount;
            let timeStamp=wordsets[i].createtime;
            let item={
              title:title,
              termCount:termCount,
              timeStamp:timeStamp
            }
            items.push(item);
          }
          return items;
        },
        ...mapMutations({
          setCreateState:'wordset/setCreateState',
          selectCurLinkItem:'routerdata/selectCurLinkItem',
          setWordSets:'wordset/setWordSets',
        }),
      },
      computed:{

        ...mapState({
          sets:state=>state.wordset.wordsets,
        }),
      }
    }
</script>

<style scoped>
  .word-sets{
    width: 100%;
    height: 100%;
  }
  .out-container{
    width: 32rem;
    overflow: hidden;
    position: relative;
  }
  .inner-container{
    width: 105%;
    height: 22rem;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .set-filter{
    width: 30rem;
    line-height: 2rem;
    background-color: transparent;
    outline: none;
    border: 0px;
    border-bottom: 2px solid var(--seablue);
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: var(--seablue);
    margin-left: 1rem;
  }
  .set-item{
    margin: 0.5rem 0.5rem 2rem;
  }
</style>
