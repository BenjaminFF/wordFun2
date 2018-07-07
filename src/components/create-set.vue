<template>
    <div class="create-set">
      <div class="container">
        <div v-for="(item,index) in items"  :key="item.timestamp" class="item-container animated bounceInLeft">
          <create-input class="create-input" v-on:delete="deleteItem(index)"
                        :defBorder="item.defBorder" :termBorder="item.termBorder"
                        :defText.sync="item.defText" :termText.sync="item.termText">
          </create-input>
          <div class="fb-container" @mouseover="showFB(index)" @mouseleave="hideFB(index)">
            <float-button size="small" class="fb-button animated bounceIn"
                          iconname="add" v-if="item.showfb" @click.native="insertItem(index)"></float-button>
          </div>
        </div>
        <div class="add-button" @click="addItem(items.length)">{{$t('addText')}}</div>
      </div>
      <float-button iconname="tick" size="middle" class="fbTick" @click="fbTickClick"
                    @mouseenter="fbTickHover" @mouseleave="fbTickFlur"></float-button>
      <create-dialog :showCD="showCD" v-on:dismiss="showCD=false"></create-dialog>
      <my-toast v-for="toast in toastlist" :text="toast.text"></my-toast>
    </div>
</template>

<script>
    import CreateInput from "./create-input";
    import MyButton from "./my-button";
    import FloatButton from "./float-button";
    import $ from 'jquery'
    import CreateDialog from "./create-dialog";
    import MyToast from "./my-toast";
    export default {
        name: "create-set",
        data(){
          return{
            items:[],
            showCD:false,
            toastlist:[]
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
              defBorder:"",
              termBorder:""
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
              defBorder:"",
              termBorder:""
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
                $('.container').animate({scrollTop:addButton.offsetTop},600);
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
            defBorder:"",
            termBorder:""
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
        fbTickHover(){
            $('.fbTick').addClass('animated tada');
        },
        fbTickFlur(){
          $('.fbTick').removeClass('animated tada');
        },
        fbTickClick(){
          for(let i=0;i<this.items.length;i++){
            let item=this.items[i];
            if(item.termText==""){
              item.termBorder="1px solid red";
              $('.term')[i].focus();
              setTimeout(function () {
                item.termBorder="1px solid white";
              },1500);
              return;
            }else if(item.defText==""){
              item.defBorder="1px solid red";
              $('.definition')[i].focus();
              setTimeout(function () {
                item.defBorder="1px solid white";
              },1500);
              return;
            }
          }
            if(this.items.length<2){
              let toast={
                text:"A Set at least contains 2 card!"
              }
              this.toastlist.push(toast);
            }else {
            }
        }
      },
      components: {MyToast, CreateDialog, FloatButton, MyButton, CreateInput}
    }
</script>

<style scoped>
  div,p{
    margin: 0;
    padding: 0;
  }
  .create-set{
     width: 40rem;
     height: 25rem;

    position: relative;
   }
  .container{
    width: 80%;
    height: 25rem;
    overflow-x: hidden;
    overflow-y: scroll;
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
    user-select: none;
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
  }

  .container::-webkit-scrollbar {/*滚动条整体样式*/
    width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  }

  .container::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 1px;
    background: var(--seablue);
  }

  .fbTick{
    position: absolute;
    right: 0;
    bottom: 2rem;
    cursor:pointer;
    box-shadow: 0px 0px 10px 1px #c4c4c4;
    z-index: 1000;
  }
</style>
