<template>
    <div class="word-sets">
      <input class="set-filter" placeholder="filter sets there..."
             v-on:input="filterSets($event)"/>
      <div class="out-container">
        <wait-dialog :text="'W'" :color="'var(--seablue)'" style="margin-left: -1rem" v-if="!setinited"></wait-dialog>
        <div class="inner-container">
        <transition-group leave-active-class="animated fadeOutLeft" :duration="{ leave: 500 }"
          enter-active-class="animated fadeInRightBig">
          <set-item v-if="setinited" class="set-item" @click.native="setItemClick(item)"
                    v-for="(item,index) in items" :item="item" :key="index"></set-item>
        </transition-group>
          <transition enter-active-class="animated bounceInLeft">
            <div class="add-set" v-if="isEmpty" @click="createSet">{{$t('wordSets.create')}}</div>
          </transition>
        </div>
        <delete-dialog v-if="ddState" v-on:updateData="fetchData"></delete-dialog>
      </div>
    </div>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  import SetItem from "./setLearns/set-item";
  import WaitDialog from "./wait-dialog";
  import DeleteDialog from "./delete-dialog";
    export default {
        name: "word-set",
      components: {DeleteDialog, WaitDialog, SetItem},
      data(){
          return{
            items:[],
            setinited:false,
            filterText:"",
            isEmpty:'false'
          }
      },
      created(){
        this.setCreateState(false);
        this.selectCurLinkItem('/wordsets');
        console.log('wordsets created');
        this.isEmpty=false;
        this.fetchData();
      },
      methods:{
        createSet(){
          this.setCreateState(true);
          this.$router.push('createcontainer');
          this.setCookie('createSetMode','create',1);
        },
        fetchData(){
          this.setinited=false;
          let euname=this.getCookie("euname");
          this.axios.get('/api/getwordset', {
            params: {
              username:escape(euname)
            }
          })
            .then((response)=>{
              this.setWordSets(response.data.sets);
              this.items=this.getDealedSets(response.data.sets);
              if(this.items.length==0){
                this.isEmpty=true;
              }
              setTimeout(()=>{
                this.setinited=true;
              },500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        filterSets(event){
          let text=event.target.value;
          if(text==""||this.sets.length==0){
            this.items=this.getDealedSets(this.sets);
            return;
          }
          let regex=new RegExp(text,'i');
          let newItems=[];
          for(let i=0;i<this.sets.length;i++){
            if(regex.test(decodeURIComponent(this.sets[i].title))){
              newItems.push(this.getDealedSet(this.sets[i]));
            }
          }
          newItems.sort(function (item1,item2) {
            return item2.timeStamp-item1.timeStamp;
          });
          this.items=newItems;
        },
        getDealedSet(wordset){
          let title=decodeURIComponent(wordset.title);
          let subtitle=decodeURIComponent(wordset.subtitle);
          let termCount=wordset.termCount;
          let timeStamp=wordset.createtime;
          let item={
            title:title,
            subtitle:subtitle,
            termCount:termCount,
            timeStamp:timeStamp
          }
          return item;
        },
        getDealedSets(wordsets){
          let items=[];
          for(let i=0;i<wordsets.length;i++){
            let title=decodeURIComponent(wordsets[i].title);
            let subtitle=decodeURIComponent(wordsets[i].subtitle);
            let termCount=wordsets[i].termCount;
            let timeStamp=wordsets[i].createtime;
            let item={
              title:title,
              subtitle:subtitle,
              termCount:termCount,
              timeStamp:timeStamp
            }
            items.push(item);
          }
          items.sort(function (item1,item2) {
            return item2.timeStamp-item1.timeStamp;
          });
          return items;
        },
        setItemClick(item){
          this.setCurSet(item);
          this.setCookie('curSet',JSON.stringify(item),1);          //curSet存到cookie中，因为刷新后在set-learn中获取不到state.curSet
          this.$router.push('setLearn');
        },
        ...mapMutations({
          setCreateState:'wordset/setCreateState',
          selectCurLinkItem:'routerdata/selectCurLinkItem',
          setWordSets:'wordset/setWordSets',
          setCurSet:'wordset/setCurSet'
        }),
      },
      computed:{
        ...mapState({
          sets:state=>state.wordset.wordsets,
          ddState:state=>state.wordset.ddState
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
    border-bottom: 2px solid var(--tealdeer);
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: var(--vermilion);
    margin-left: 0.5rem;
  }
  .set-item{
    margin: 0.5rem 0.5rem 2rem;
  }
  .add-set{
    margin-left: 0.5rem;
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
    background-color: var(--tealdeer);
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 5px;
    position: absolute;
    top: 0;
  }
  .add-set:hover{
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
    transition: all 0.2s ease-in-out;
  }
</style>
