<template>
    <div class="create-set">
      <div class="out-container">
        <div class="container">
          <div v-for="(item,index) in items"  :key="item.timestamp" class="item-container animated bounceInLeft">
            <create-input class="create-input" v-on:delete="deleteItem(index)"
                          :cardId="index+1"
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
      </div>
      <float-button iconname="tick" size="middle" class="fbTick" @click="fbTickClick"
                    @mouseenter="fbTickHover" @mouseleave="fbTickFlur"></float-button>
      <create-dialog v-if="showCD" v-bind:title.sync="title"
                     v-bind:subtitle.sync="subtitle"></create-dialog>
      <my-toast v-for="(toast,index) in toastlist" :text="toast.text" :key="index"></my-toast>
    </div>
</template>

<script>
    import CreateInput from "./create-input";
    import MyButton from "./my-button";
    import FloatButton from "./float-button";
    import CreateDialog from "./create-dialog";
    import MyToast from "./my-toast";
    import $ from 'jquery'
    import { mapState,mapMutations,mapGetters } from 'vuex';
    export default {
        name: "create-set",
        data(){
          return{
            items:[],
            toastlist:[],
            title:"",
            subtitle:"",
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
            this.setPushState(false);
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
          this.addTransition(el[index],deleteTransition);
            let vm=this;
              vm.$nextTick(function () {
                var o = el[index].getBoundingClientRect();
                let invert = o.bottom - o.top;
                let moveTransition = [
                  {transform: 'translateY(' + invert + 'px)'},
                  {transform: 'translateY(0)'}
                ]
                for (let i = index; i < vm.items.length; i++) {
                  vm.addTransition(el[i], moveTransition);
                }
                var addButton = document.querySelector('.add-button');
                vm.addTransition(addButton, moveTransition);
                vm.items.splice(index, 1);
              });
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
          var vm=this;
          for(let i=0;i<this.items.length;i++){
            let item=this.items[i];
            if(item.termText==""){
              item.termBorder="1px solid red";
              $('.term')[i].focus();
              setTimeout(function () {
                item.termBorder="1px solid white";
              },1500);
              let toast={
                text:i+1+vm.$t('createSet.termEmpty')
              }
              this.toastlist.push(toast);
              return;
            }else if(item.defText==""){
              item.defBorder="1px solid red";
              $('.definition')[i].focus();
              setTimeout(function () {
                item.defBorder="1px solid white";
              },1500);
              let toast={
                text:i+1+vm.$t('createSet.defEmpty')
              }
              this.toastlist.push(toast);
              return;
            }
          }
            if(this.items.length<2){
              let toast={
                text:vm.$t('createSet.setLength')
              }
              this.toastlist.push(toast);
            }else {
              if(!this.showCD){
                this.openCD();
              }else {
                if(this.title.length==0){
                  let toast={
                    text:vm.$t('createDialog.titleEmpty')
                  }
                  this.toastlist.push(toast);
                }else {
                  this.setPushState(true);
                  this.pushWordset();
                }
              }
            }
        },
        pushWordset(){
          let cards=[];
          let title=escape(this.title.substring(0,this.title.length));
          let subtitle=escape(this.subtitle.substring(0,this.subtitle.length));
          let author=escape(this.getCookie('euname'));
          let createtime=new Date().getTime();       //时间轴作为标识
          let folder="";
          for(let i=0;i<this.items.length;i++){
            let card={
              term:escape(this.items[i].termText),
              definition:escape(this.items[i].defText),
              author:author,
              createtime:createtime                  //这是它所属的单词集合的相同的createtime
            }
            cards.push(card);
          }
          for(let i=0;i<this.slideFolders.length;i++){
            if(this.slideFolders[i].offset==0){
              folder=escape(this.slideFolders[i].text);
              break;
            }
          }
          let wordset={
            title:title,
            subtitle:subtitle,
            author:author,
            createtime:createtime,
            folder:folder,
            termCount:cards.length
          }
          let jsoncards=JSON.stringify(cards);
          let jsonwordset=JSON.stringify(wordset);
          this.axios.post('/api/pushwordset', {
            params: {
              jsoncards:jsoncards,
              jsonwordset:jsonwordset
            }
          })
            .then((response)=> {
              console.log(response.data);
              this.$router.push('/wordsets');
              this.setCreateState(false);
            });
        },
        ...mapMutations({
          add:'test/increment',
          openCD:'wordset/openCD',
          setPushState:'wordset/setPushState',
          setCreateState:'wordset/setCreateState',
          unshiftWordsets:'wordset/unshiftWordsets'
        }),
      },
      computed:{
        ...mapState({
          showCD:state=>state.wordset.showCD,
          slideFolders:state=>state.wordset.slideFolders
        }),
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
   }
  .out-container{
    width: 100%;
    overflow: hidden;
  }
  .container{
    width: 105%;
    height: 25rem;
    overflow: auto;
  }
  .item-container{
    width: 95%;
    height: fit-content;
    transition: all 2s;
    overflow: hidden;
    box-sizing: border-box;
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

  .fbTick{
    position: absolute;
    right: 7rem;
    bottom: 2rem;
    cursor:pointer;
    box-shadow: 0px 0px 10px 1px #c4c4c4;
    z-index: 1000;
  }
</style>

