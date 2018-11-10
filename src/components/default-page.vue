<template>
    <div class="default-page">
      <div class="default-page-container">
        <div class="learn-container">
          <div class="learn-item" v-for="(item,index) in learnItems">
            <div class="learn-item-content" :style="{backgroundColor:item.bg}">
              <icon :name="item.iconName" class="learn-item-icon"></icon>
              <div class="learn-item-text">{{$t("defaultPage.learnItemsText["+index+"]")}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    export default {
        name: "default-page",
      components: {},
      data(){
          return{
            learnItems:[]
          }
      },
      created(){
        this.initDefaultPage();
        this.setCreateState(true);           //默认界面隐藏create按钮
      },
      methods:{
        initDefaultPage(){
          let learnItems=[];
          let iconNames=["list","matrix","flashcards","write"];
          let itemBGs=['#247BA0','#70C1B3','#B2DBBF','#FF1654','#2EC4B6','#FF9F1C','#9BC53D','#5BC0EB','#E55934'];
          let learnItemsText=this.$t('defaultPage.learnItemsText');
          for(let i=0;i<4;i++){
            let bg=this.getColor(itemBGs);
            if(i!=0){
              while (bg==learnItems[i-1].bg){
                bg=this.getColor(itemBGs);
              }
            }
            let item={
              iconName:iconNames[i],
              bg:bg,
            }
            learnItems.push(item);
          }
          this.learnItems=learnItems;
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
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .learn-container{
    display: grid;
    grid-template-columns: repeat(2,18rem);
    grid-template-rows: repeat(2,12rem);
    position: absolute;
  }

  .learn-item{
    width: auto;
    height: auto;
    margin: 10px;
  }

  .learn-item-content{
    width: 100%;
    height: 100%;
    background-color: green;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    cursor: pointer;
  }

  .learn-item-content:hover{
    box-shadow: 1px 1px 15px #b9b9b9;
  }

  .learn-item-icon{
    width: 4rem;
    height: 4rem;
  }

  .learn-item-text{
    margin-top: 1rem;
    width: fit-content;
    height: fit-content;
    font-size: 2rem;
  }
</style>
