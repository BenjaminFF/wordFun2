<template>
    <div class="word-sets">
      <input class="set-filter" placeholder="filter sets there..." v-on:input="filterSets($event)"/>
      <div class="out-container">
        <wait-dialog :text="'W'" :color="'var(--seablue)'" style="margin-left: -5rem" v-if="!setinited"></wait-dialog>
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
  import {mapMutations,mapState,mapGetters} from 'vuex'
  import SetItem from "./set-item";
  import WaitDialog from "../wait-dialog";
  import DeleteDialog from "./delete-dialog";
    export default {
        name: "word-set",
      components: {DeleteDialog, WaitDialog, SetItem},
      data(){
          return{
            items:[],
            setinited:false,
            filterText:"",
            isEmpty:'false',
            sets:[]
          }
      },
      created(){
        this.selectCurLinkItem('/wordsets');
        console.log('wordsets created');
        this.isEmpty=false;
        this.fetchData();
      },
      methods:{
        createSet(){
          this.setCookie("createSetMode","create");
          this.showCreateSet();
        },
        fetchData(){
          this.setinited=false;
          let login_Info=this.getCookie("login_Info");
          let username=JSON.parse(login_Info).username;
          this.axios.get('/api/getwordsets', {
            params: {
              username:username
            }
          })
            .then((response)=>{
              this.sets=this.items=this.getDealedSets(response.data.sets);
              if(this.items.length==0){
                this.isEmpty=true;
              }else {
                this.isEmpty=false;
              }
              setTimeout(()=>{
                this.setSFoldersState(true);
                this.setinited=true;
              },500);
            }).catch((error)=> {
              console.log(error);
            });
        },
        filterSets(event){
          let text=event.target.value;
          console.log(text);
          if(text==""||this.sets.length==0){
            this.items=this.sets;
            return;
          }

          if(text.substring(0,1)=='$'){
            this.items=this.sets;
            if(/learnStateDes/i.test(text)||(new RegExp(encodeURIComponent("学习情况降序"))).test(encodeURIComponent(text))){
              console.log("gg");
              this.items.sort((item1,item2)=>{
                return item2.writeLearnedCount+item2.matrixLearnedCount-item1.writeLearnedCount-item1.matrixLearnedCount;
              });
            }else if(/learnStateAsc/i.test(text)||(new RegExp(encodeURIComponent("学习情况升序"))).test(encodeURIComponent(text))){
              this.items.sort((item2,item1)=>{
                return item2.writeLearnedCount+item2.matrixLearnedCount-item1.writeLearnedCount-item1.matrixLearnedCount;
              });
            }else {
              this.items.sort(function (item1, item2) {
                return item2.timeStamp - item1.timeStamp;
              });
            }
          } else {
            let regex = new RegExp(text, 'i');
            let newItems = [];
            for (let i = 0; i < this.sets.length; i++) {
              if (regex.test(decodeURIComponent(this.sets[i].title))) {
                newItems.push(this.sets[i]);
              }
            }
            newItems.sort(function (item1, item2) {
              return item2.timeStamp - item1.timeStamp;
            });
            this.items = newItems;
          }
        },
        getDealedSet(wordset){
          let title=decodeURIComponent(wordset.title);
          let subtitle=decodeURIComponent(wordset.subtitle);
          let termCount=wordset.termCount;
          let timeStamp=wordset.createtime;
          let writeLearnedCount=wordset.writeLearnedCount;
          let matrixLearnedCount=wordset.matrixLearnedCount;
          let item={
            title:title,
            subtitle:subtitle,
            termCount:termCount,
            timeStamp:timeStamp,
            writeLearnedCount:writeLearnedCount,
            matrixLearnedCount:matrixLearnedCount
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
            let writeLearnedCount=wordsets[i].writeLearnedCount;
            let matrixLearnedCount=wordsets[i].matrixLearnedCount;
            let folder=wordsets[i].folder;
            let item={
              title:title,
              subtitle:subtitle,
              termCount:termCount,
              timeStamp:timeStamp,
              folder:folder,
              writeLearnedCount:writeLearnedCount,
              matrixLearnedCount:matrixLearnedCount
            }
            items.push(item);
          }
          items.sort(function (item1,item2) {
            return item2.timeStamp-item1.timeStamp;
          });
          return items;
        },
        setItemClick(item){
          this.setCookie('curSet',JSON.stringify(item),1);          //curSet存到cookie中，因为刷新后在set-learn中获取不到state.curSet
          this.$router.push('setLearn');
        },
        ...mapMutations({
          selectCurLinkItem:'routerdata/selectCurLinkItem',
          showCreateSet:'wordset/showCreateSet',
          setFlushState:'wordset/setFlushState',
          setSFoldersState:'wordset/setSFoldersState'
        }),
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

  .set-filter{
    width: 30rem;
    line-height: 2rem;
    background-color: transparent;
    outline: none;
    border: 0px;
    border-bottom: 2px solid var(--tealdeer);
    margin-bottom: 2rem;
    color: var(--vermilion);
    margin-left: 0.5rem;
    font-family: inherit;
    font-weight: lighter;
    font-size: 1.3rem;
  }

  .out-container{
    width: 42rem;
    overflow: hidden;
    position: relative;
  }
  .inner-container{
    width: 105%;
    height: 22rem;
    overflow-x: hidden;
    overflow-y: scroll;
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
