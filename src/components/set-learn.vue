<template>
    <div class="set-learn">
      <div class="sidebar" :style="{backgroundColor:randomColor(0.6)}">
      <div class="return" @click="backClick">
        <icon name="return" class="return-icon"></icon>
        {{$t('setLearn.back')}}
      </div>
        <div class="barItems-container">
          <div class="bar-item" v-for="item in barItems" @click="itemClick(item)"
               :class="{itemSelected:item.selected}">
            <icon :name="item.icon" class="item-icon"></icon>
            {{item.title}}
          </div>
        </div>
      </div>
      <div class="learn-container">
        <component v-bind:is="curComponent"></component>
      </div>
    </div>
</template>

<script>
    import writeContainer from "./setLearns/write-container";
    import matrixContainer from "./setLearns/matrix-container";
    import setListContainer from "./setLearns/setlist-container";
    import flashcardsContainer from "./setLearns/flashcards-container";
    import {mapState} from 'vuex'
    export default {
        name: "set-learn",
      components: {flashcardsContainer,writeContainer,setListContainer,matrixContainer},
      data(){
          return{
            barItems:[],
            curComponent:"",
          }
      },
      created(){
          this.barItems=[
            {icon:'list',title:this.$t('setLearn.setList'),selected:true,comp:setListContainer},
            {icon:'write',title:this.$t('setLearn.write'),selected:false,comp:writeContainer},
            {icon:'flashcards',title:this.$t('setLearn.flashCards'),selected:false,comp:flashcardsContainer},
            {icon:'matrix',title:this.$t('setLearn.matrix'),selected:false,comp:matrixContainer}
          ]
        this.curComponent=setListContainer;
      },
      methods:{
        backClick(){
          this.$router.push('/wordsets');
        },
        itemClick(item){
          if(item.selected){
            return;
          }
          for(let i=0;i<this.barItems.length;i++){
            if(this.barItems[i].selected){
              this.barItems[i].selected=false;
              break;
            }
          }
          item.selected=true;
          this.curComponent=item.comp;
        }
      }
    }
</script>

<style scoped>
  .set-learn{
     position: fixed;
     width: 100%;
     height: 100%;
     left: 0;
     top: 0;
     display: flex;
     background-color: white;
   }
  .sidebar{
    width: 17%;
    background-color: #9BC53D;
    box-shadow: 10px 0px 20px 1px rgba(155, 155, 155, 0.31);
    z-index: 100;
    min-width: max-content;
    color: white;
    transition: .5s all ease-in-out;
    position: relative;
    padding-right: 1rem;
  }
  .return{
    user-select: none;
    cursor: pointer;
    display: flex;
    position: absolute;
    align-items: center;
    left: 1rem;
    top: 1rem;
    font-size: 1.2rem;
  }
  .return:hover{
    color: black;
  }
  .return-icon{
    width: 1.2rem;
    height: 1.2rem;
  }
  .learn-container{
    width: 83%;
    background-color: rgba(243, 243, 243, 0.6);
  }
  .barItems-container{
    width: 100%;
    height: fit-content;
    margin-top: 6rem;
  }
  .bar-item{
    cursor: pointer;
    user-select: none;
    width: 100%;
    height: 4rem;
    display: flex;
    margin-left: 1.2rem;
    align-items: center;
    font-size: 1.2rem;
  }
  .itemSelected{
    color: black;
  }
  .bar-item:hover{
    color: black;
  }
  .item-icon{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
  }
</style>
