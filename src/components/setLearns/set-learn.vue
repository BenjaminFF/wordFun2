<template>
    <div class="set-learn">
      <div class="sidebar" :style="{backgroundColor:sidebarBG}">
      <div class="return" @click="backClick" :style="{color:returnItem.color}" @mouseleave="returnItem.color=sideBarT.textColor"
           @mouseenter="returnItem.color=sideBarT.textActiveColor">
        <icon name="return" class="return-icon"></icon>
        {{$t('setLearn.sideBar.back')}}
      </div>
        <div class="barItems-container">
          <div class="bar-item" v-for="item in barItems" @click="itemClick(item)" @mouseleave="leaveItem(item)"
               :style="{color:item.color}" @mouseenter="hoverItem(item)">
            <icon :name="item.icon" class="item-icon"></icon>
            {{item.title}}
          </div>
        </div>
        <div class="help-item" :style="{color:helpItem.color}" @mouseleave="helpItem.color=sideBarT.textColor"
             @mouseenter="helpItem.color=sideBarT.textActiveColor">
          <icon name="help" class="help-item-icon"></icon>
          {{$t('setLearn.sideBar.help')}}
        </div>
      </div>
      <div class="learn-container" :style="{backgroundColor:mainBG}">
        <component v-bind:is="curComponent"></component>
      </div>
    </div>
</template>

<script>
    import writeContainer from "./write-container";
    import matrixContainer from "./matrixs-container";
    import setListContainer from "./setlist-container";
    import flashcardsContainer from "./flashcards-container";
    import theme from '../../assets/theme/TsetLearn'
    export default {
        name: "set-learn",
      components: {flashcardsContainer,writeContainer,setListContainer,matrixContainer},
      data(){
          return{
            barItems:[],
            curComponent:"",
            sidebarBG:'',
            textColor:'',
            textBG:'',
            sideBarT:{},
            mainBG:'',
            returnItem:{
              color:''
            },
            helpItem:{
              color:''
            }
          }
      },
      created(){
          this.sideBarT=theme.default.sidebarT;
          this.mainBG=theme.default.mainContainer.bg;
          let sidebarT=this.sideBarT;
          this.barItems=[
            {icon:'list',title:this.$t('setLearn.sideBar.setList'),selected:true,comp:setListContainer,color:sidebarT.textColor},
            {icon:'write',title:this.$t('setLearn.sideBar.write'),selected:false,comp:writeContainer,color:sidebarT.textColor},
            {icon:'flashcards',title:this.$t('setLearn.sideBar.flashCards'),selected:false,comp:flashcardsContainer,color:sidebarT.textColor},
            {icon:'matrix',title:this.$t('setLearn.sideBar.matrix'),selected:false,comp:matrixContainer,color:sidebarT.textColor}
          ]
        this.curComponent=setListContainer;
        this.sidebarBG=this.sideBarT.sideBarBG;
        this.barItems[0].color=this.sideBarT.textActiveColor;

        this.returnItem.color=this.sideBarT.textColor;
        this.helpItem.color=this.sideBarT.textColor;
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
              this.barItems[i].color=this.sideBarT.textColor;
              break;
            }
          }
          item.selected=true;
          item.color=this.sideBarT.textActiveColor;
          this.curComponent=item.comp;
        },
        hoverItem(item){
          item.color=this.sideBarT.textActiveColor;
        },
        leaveItem(item){
          if(!item.selected){
            item.color=this.sideBarT.textColor;
          }
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
   }
  .sidebar{
    width: 17%;
    z-index: 1000;
    min-width: max-content;
    color: white;
    transition: .5s all ease-in-out;
    position: relative;
    user-select: none;
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
  .return-icon{
    width: 1.2rem;
    height: 1.2rem;
  }
  .learn-container{
    width: 83%;
  }
  .barItems-container{
    width: 100%;
    height: fit-content;
    margin-top: 6rem;
  }
  .bar-item{
    padding-left: 1rem;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    width: 100%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    margin-top: 0.2rem;
  }

  .help-item{
    width: 100%;
    height: 4rem;
    position: absolute;
    margin-left: 1.2rem;
    align-items: center;
    display: flex;
    font-size: 1.2rem;
    bottom: 3rem;
  }

  .help-item-icon{
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.3rem;
    cursor: pointer;
  }

  .help-item:hover{
    cursor: pointer;
  }
  .item-icon{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
  }
</style>
