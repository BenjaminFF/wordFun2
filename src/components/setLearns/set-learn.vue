<template>
    <div class="set-learn">
      <div class="sidebar" :style="{backgroundColor:sidebarBG}">
      <div class="return" @click="backClick" :style="{color:returnItem.color}" @mouseleave="returnItem.color=sideBarT.textColor"
           @mouseenter="returnItem.color=sideBarT.textActiveColor">
        <icon name="return" class="return-icon"></icon>
        {{$t('setLearn.sideBar.back')}}
      </div>
        <div class="barItems-container">
          <div class="bar-item" v-for="item in barItems" @click="itemClick(item)"
               :style="{color:item.color}"  @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)">
            <icon :name="item.icon" class="item-icon"></icon>
            {{item.title}}
          </div>
        </div>
        <div class="theme-item" :style="{color:helpItem.color}" @mouseleave="helpItem.color=sideBarT.textColor" @click="themeChoose.visibility=true"
             @mouseenter="helpItem.color=sideBarT.textActiveColor">
          <icon name="theme" class="theme-item-icon"></icon>
          {{$t('setLearn.sideBar.theme')}}
        </div>
      </div>
      <div class="learn-container" :style="{backgroundColor:mainBG}">
        <component v-bind:is="curItem.comp" :themeName="themeName" v-if="hackReset"></component>
      </div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="theme-choose" v-if="themeChoose.visibility" @click="themeChoose.visibility=false">
        <div class="theme-choose-item" v-for="theme in themeChoose.themes" @click="updateTheme(theme.name)">
          <div style="width: 100%;height: 50%;text-align: center;color: white">{{theme.name}}</div>
          <div style="width: 100%;height: 100%;display: flex;">
            <div v-for="color in theme.colors" style="flex: 1 0 0"
                 :style="{backgroundColor:color}"></div>
          </div>
        </div>
      </div>
      </transition>
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
            curItem:{},
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
            },
            themeChoose:{
              visibility:false,
              themes:[]
            },
            themeName:"",
            hackReset:true,
            createTime:""
          }
      },
      created(){
         this.initLearn();
      },
      methods:{
        initLearn(){
          this.hackReset=true;
          this.themeChoose.visibility=false;
          this.themeChoose.themes=[
            {name:'default',colors:['#FDFFFC','#70C1B3','#1A936F','#247BA0']},
            {name:'dark',colors:['#3A506B','#0B132B','#5BC0BE','#6FFFE9']},
          ]

          let curSet = JSON.parse(this.getCookie('curSet'));
          this.createTime=curSet.timeStamp;

          let themeName = window.localStorage.getItem(this.createTime+'themeName')||'default';

          this.themeName=themeName;
          this.sideBarT=theme[themeName].sidebarT;
          this.mainBG=theme[themeName].mainContainer.bg;

          this.returnItem.color=this.sideBarT.textColor;
          this.helpItem.color=this.sideBarT.textColor;
          let sidebarT=this.sideBarT;
          this.barItems=[
            {icon:'list',name:'setList',title:this.$t('setLearn.sideBar.setList'),selected:false,comp:setListContainer,color:sidebarT.textColor},
            {icon:'write',name:'write',title:this.$t('setLearn.sideBar.write'),selected:false,comp:writeContainer,color:sidebarT.textColor},
            {icon:'flashcards',name:'flashcards',title:this.$t('setLearn.sideBar.flashCards'),selected:false,comp:flashcardsContainer,color:sidebarT.textColor},
            {icon:'matrix',name:'matrix',title:this.$t('setLearn.sideBar.matrix'),selected:false,comp:matrixContainer,color:sidebarT.textColor}
          ]
          let curBarName=window.localStorage.getItem(this.createTime+'curBarName')||'setList';
          this.curItem=this.getItemByName(curBarName,this.barItems);
          this.curItem.selected=true;
          this.curItem.color=this.sideBarT.textActiveColor;

          this.sidebarBG=this.sideBarT.sidebarBG;
        },
        getItemByName(name,items){
          for(let i=0;i<items.length;i++){
            if(items[i].name==name){
              return items[i];
            }
          }
        },
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
            }
          }

          item.selected=true;
          item.color=this.sideBarT.textActiveColor;
          this.curItem=item;
          window.localStorage.setItem(this.createTime+'curBarName',this.curItem.name);
        },
        hoverItem(item){
          item.color=this.sideBarT.textActiveColor;
        },
        leaveItem(item){
          if(!item.selected){
            item.color=this.sideBarT.textColor;
          }
        },
        updateTheme(themeName){
          this.themeName=themeName;
          window.localStorage.setItem(this.createTime+'themeName', themeName);

          this.initLearn();

          this.hackReset=false;
          this.$nextTick(()=>{
            this.hackReset=true;
          });
        }
      }
    }
</script>

<style scoped>
  .set-learn{
    background-color: white;
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

  .theme-item{
    width: 100%;
    height: 4rem;
    position: absolute;
    margin-left: 1.2rem;
    align-items: center;
    display: flex;
    font-size: 1.2rem;
    bottom: 3rem;
    cursor: pointer;
  }

  .theme-item-icon{
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.3rem;
    cursor: pointer;
  }

  .item-icon{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
  }

  .theme-choose{
    position: fixed;
    background-color: rgba(0, 0, 0, 0.61);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .theme-choose-item{
    width: 15rem;
    height: 4rem;
    display: flex;
    cursor: pointer;
    margin-bottom: 2rem;
    flex-direction: column;
  }
</style>
