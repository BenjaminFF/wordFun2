<template>
    <div class="create-set">
        <div v-for="(item,index) in items"  :key="item.timestamp" class="item-container animated bounceInLeft">
          <create-input class="create-input" v-on:delete="deleteItem(index)"
                        :defText.sync="item.defText" :termText.sync="item.termText">
          </create-input>
          <div class="fb-container" @mouseover="showFB(index)" @mouseleave="hideFB(index)">
            <float-button size="small" class="fb-button animated bounceIn"
                          iconname="add" v-if="item.showfb" @click.native="insertItem(index)"></float-button>
          </div>
        </div>
        <div class="add-button" @click="addItem(items.length)"
             >+add item</div>
    </div>
</template>

<script>
    import CreateInput from "./create-input";
    import MyButton from "./my-button";
    import FloatButton from "./float-button";
    import $ from 'jquery'
    export default {
        name: "create-set",
        data(){
          return{
            items:[],
          }
        },
        created(){
          let timestamp=new Date().getTime();
          for(let i=0;i<2;i++){
            var item={
              timestamp:timestamp,
              termText:"",
              defText:"",
              showfb:false,
            }
            timestamp++;
            this.items.push(item);
          }
        },
      methods: {
          addItem(index){
            let timestamp=new Date().getTime();
            var item={
              timestamp:timestamp,
              termText:"",
              defText:"",
              showfb:false,
            }
            this.items.push(item);
            let insertTransition=[
                {
                  opacity:0,
                  transform: 'translateX(100px)',
                },
                {
                  opacity:1,
                  transform: 'translateX(0px)',
                },
            ];
            let vm=this;
            this.$nextTick(function () {
              let el=document.querySelectorAll('.item-container');
              let addButton=document.querySelector('.add-button');
              let o=el[index].getBoundingClientRect();
              let invert=o.top-o.bottom;
              let moveTransition=[
                { transform: 'translateY(' + invert + 'px)' },
                { transform: 'translateY(0)' }
              ]
              let player=vm.addTransition(addButton,moveTransition);
              player.onfinish=function(){
                $('.create-set').animate({scrollTop:addButton.offsetTop},600);
              };
              console.info(addButton.offsetTop);
            });
          },
          showFB(index){
            if(index!=this.items.length-1){
              this.items[index].showfb=true;
            }
          },
        hideFB(index){
          this.items[index].showfb=false;
        },
        insertItem(index){
          let timestamp=new Date().getTime();
          var item={
            timestamp:timestamp,
            termText:"",
            defText:"",
            showfb:false,
          }
          this.items.splice(index+1,0,item);
          let vm=this;
          this.$nextTick(function () {
            let el=document.querySelectorAll('.item-container');
            let o=el[index+1].getBoundingClientRect();
            let invert=o.top-o.bottom;
            let moveTransition=[
              { transform: 'translateY(' + invert + 'px)' },
              { transform: 'translateY(0)' }
            ]
            for(let i=index+2;i<vm.items.length;i++){
              vm.addTransition(el[i],moveTransition);
            }
            let addButton=document.querySelector('.add-button');
            vm.addTransition(addButton,moveTransition);
          });
          console.info(index);
        },
        deleteItem(index){
          var el=document.querySelectorAll('.item-container');
          let deleteTransition=[
            {
              opacity:1,
              transform: 'translateX(0)',
            },
            {
              opacity:0,
              transform: 'translateX(100px)',
            },
          ];
          var player=this.addTransition(el[index],deleteTransition);
            let vm=this;
            player.onfinish=function () {
              var o=el[index].getBoundingClientRect();
              let invert=o.bottom-o.top;
              let moveTransition=[
                { transform: 'translateY(' + invert + 'px)' },
                { transform: 'translateY(0)' }
              ]
              for(let i=index;i<vm.items.length;i++){
                vm.addTransition(el[i],moveTransition);
              }
              var addButton=document.querySelector('.add-button');
              vm.addTransition(addButton,moveTransition);
              vm.items.splice(index,1);
            };

            console.info(this.items[index].timestamp);
        },
        addTransition(el,transition){
            return el.animate(
              transition,
              {
                duration:600,
                easing: 'cubic-bezier(0,0,0.32,1)',
              }
            );
        },
      },
      components: {FloatButton, MyButton, CreateInput}
    }
</script>

<style scoped>
  .create-set{
     width: 35rem;
     height: 25rem;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
   }
  .item-container{
    width: 95%;
    height: fit-content;
    transition: all 2s;
    overflow: hidden;
  }
  .fb-container{
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: center;
  }
  .create-input{
    width: 100%;
    transition: all 0.5s;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 1px rgba(203, 203, 203, 0.7);
  }
  .fb-button{
    box-shadow: 0px 0px 10px 1px lightgrey;
    border-radius: 5px;
    cursor: pointer;
  }

  .add-button{
    width: 95%;
    height: 4.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: yellowgreen;
    cursor: pointer;
    text-decoration: underline;
    color: white;
    transition: all 0.6s ease-in-out;
    position: absolute;
  }

  .create-set::-webkit-scrollbar {/*滚动条整体样式*/
    width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  }

  .create-set::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 1px;
    background: var(--seablue);
  }

  .list-complete-leave-active {
    position: absolute;
  }
</style>
