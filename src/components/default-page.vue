<template>
    <div class="default-page">
      <div class="matrix-container">
        <word-matrix :term="w.term" v-on:dismiss="dismiss(index)"  v-for="(w,index) in wordset"
             :key="index" v-if="w.showMatrix" :definition="w.definition" class="matrix"></word-matrix>
      </div>
      <div class="welcome" v-if="showWelcome">{{$t('defaultPage.welcome')}}</div>
    </div>
</template>

<script>
    import WordMatrix from "./word-matrix";
    import {mapMutations} from 'vuex'
    export default {
        name: "default-page",
      components: {WordMatrix},
      data(){
          return{
            wordset:[],
            showWelcome:false
          }
      },
      created(){
        this.setCreateState(true);           //默认界面隐藏create按钮
        let w1={
          term:'astrology',
          definition:'theory of the influence of planets and stars on human events',
          showMatrix:true
        }
        let w2={
          term:'homeopathic',
          definition:'medical treatment using naturally occuring curatives',
          showMatrix:false
        }
        let w3={
          term:'pseudo',
          definition:'false, deceptive',
          showMatrix:false
        }
        let wordset=[];
        wordset.push(w1);
        wordset.push(w2);
        wordset.push(w3);
        this.wordset=wordset;
      },
      methods:{
          dismiss(index){
            this.wordset[index].showMatrix=false;
            let nextIndex=index+1;
            setTimeout(()=>{
              this.showNext(index+1);
            },1000);
          },
        showNext(index){
          if(index!=this.wordset.length){
            this.wordset[index].showMatrix=true;
          }else {
            this.showWelcome=true;
          }
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
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .matrix-container{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .matrix{
    position: absolute;
    left: 0;
    top: 0;
  }
  .welcome{
    position: absolute;
    color: var(--vermilion);
    font-size: 2rem;
    user-select: none;
  }
</style>
