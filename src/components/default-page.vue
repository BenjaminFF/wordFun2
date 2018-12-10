<template>
    <div class="default-page">
      <div class="default-page-container">
        <div class="title">{{$t('defaultPage.title')}}</div>
        <div class="item-container">
          <transition-group leave-active-class="animated bounceOutDown"
                            enter-active-class="animated bounceInUp">
            <set-item class="set-item" @click.native="setItemClick(item)" :isDefaultPage="true"
                      v-for="(item,index) in items" :item="item" :key="index"></set-item>
          </transition-group>
        </div>
      </div>
      <set-learn v-if="showSetLearn" v-on:dismiss="showSetLearn=false" :isDefaultPage="true"></set-learn>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import SetItem from "./sidebaritems/set-item";
    import SetLearn from "./setLearns/set-learn";
    export default {
        name: "default-page",
      components: {SetLearn, SetItem},
      data(){
          return{
            items:[],
            showSetLearn:false
          }
      },
      created(){
        console.log("default page created");
        this.initDefaultPage();
        this.setCreateState(true);           //默认界面隐藏create按钮
      },
      methods:{
        initDefaultPage(){
          this.fetchData();
        },
        fetchData(){
          if(this.getCookie("default_Info")!=""){
            let default_Info=JSON.parse(this.getCookie("default_Info"));
            let username=default_Info.username;
            this.axios.get('/api/getwordsets', {
              params: {
                username:username
              }
            })
              .then((response)=>{
                this.items=this.getDealedSets(response.data.sets);
              }).catch((error)=> {
              console.log(error);
            });
          }
        },
        setItemClick(item){
          this.setCookie('curSet',JSON.stringify(item),1);          //curSet存到cookie中，因为刷新后在set-learn中获取不到state.curSet
          this.showSetLearn=true;
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
            let item={
              title:title,
              subtitle:subtitle,
              termCount:termCount,
              timeStamp:timeStamp,
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
        ...mapMutations({
          setCreateState:'wordset/setCreateState'
        }),
      }
    }
</script>

<style scoped>
  .default-page{
    width: 100%;
    height: 100%;
  }

  .default-page-container{
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .title{
    font-size: 1.8rem;
    color: #3c9cd7;
    margin-top: 2rem;
    letter-spacing: 5px;
    width: fit-content;
    height: fit-content;
  }

  .subtitle{
    font-size: 1.2rem;
    height: fit-content;
  }

  .item-container{
    margin-top: 3rem;
  }

  .set-item{
    margin: 0.5rem 0.5rem 2rem;
  }

</style>
