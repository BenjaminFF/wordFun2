<template>
    <div class="create-set">
      <div class="out-container">
        <div class="container">
          <div v-for="(item,index) in items"  :key="item.timestamp" class="item-container animated bounceInLeft">
            <create-input class="create-input" v-on:delete="deleteItem(index)"
                          :cardId="index+1" :hasInitValue="item.hasInitValue"
                          :initTermText="item.initTermText"
                          :initDefText="item.initDefText"
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
      <create-dialog v-if="showCD" v-bind:title.sync="title" :initTitle="initTitle" :initSubTitle="initSubTitle"
                     v-bind:subtitle.sync="subtitle"></create-dialog>
      <my-toast v-for="(toast,index) in toastlist" :text="toast.text" :key="index"></my-toast>
      <wait-dialog :text="'C'" v-if="!loaded"></wait-dialog>
    </div>
</template>

<script>
    import CreateInput from "./create-input";
    import MyButton from "../my-button";
    import FloatButton from "../float-button";
    import CreateDialog from "./create-dialog";
    import MyToast from "../my-toast";
    import $ from 'jquery'
    import { mapState,mapMutations,mapGetters } from 'vuex';
    import WaitDialog from "../wait-dialog";
    export default {
        name: "create-set",                  //create-set有两个mode，editmode和createmode。用cookie来存储mode
        data(){
          return{
            items:[],
            toastlist:[],
            title:"",
            subtitle:"",
            initTitle:"",
            initSubTitle:"",
            loaded:false,
            hasInitValue:""
          }
        },
      created(){
          this.closeCD();         //防止刷新打开了create dialog
          this.setPushState(false);
          if(this.getCookie('createSetMode')=='create'){   //createSetMode放在cookie中是为了重新刷新也不会丢失这个值，放在state中会
            let items=[];
            let timestamp=new Date().getTime();
            for(let i=0;i<2;i++){
              var item={
                timestamp:timestamp,        //这个timestamp作为key而不用index原因是插入删除时timestamp不会变，index会变
                termText:"",
                defText:"",
                showfb:false,
                defBorder:"",
                termBorder:"",
                initTermText:"",
                initDefText:"",
                hasInitValue:false
              }
              timestamp++;
              items.push(item);
            }
            this.items=items;
            setTimeout(()=>{
              this.loaded=true;
            },500);
          }else if(this.getCookie('createSetMode')=='edit'){
            let curSet=JSON.parse(this.getCookie('curSet')); //curSet在打开一个单词集就有了，这个create-set是从那个单词集跳转来的，可以获取，只是history.go时候的状态可能有问题
            let euname=this.getCookie("euname");
            this.initTitle=curSet.title;
            this.initSubTitle=curSet.subtitle;
            this.title=curSet.title;            //如果title没有修改，就用这个title
            this.subtitle=curSet.subtitle;      //同上
            this.axios.get('/api/getCards', {
              params: {
                username:escape(euname),
                createTime:curSet.timeStamp
              }
            })
              .then((response)=>{
                let cards=[];
                let timestamp=new Date().getTime();
                for(let i=0;i<response.data.length;i++){
                  let term=decodeURIComponent(response.data[i].term).replace(/\n/g,"<br>");   //用\n替代<br>才能实现换行
                  let definition=decodeURIComponent(response.data[i].definition).replace(/\n/g,"<br>");
                  let card={
                    timestamp:timestamp,
                    termText:term,
                    defText:definition,
                    showfb:false,
                    defBorder:"",
                    termBorder:"",
                    initTermText:term,
                    initDefText:definition,
                    hasInitValue:true
                  }
                  cards.push(card);
                  timestamp++;
                }
                this.items=cards;
                console.log(cards);
                setTimeout(()=>{
                  this.loaded=true;
                },500);
              })
              .catch(function (error) {
                console.log(error);
              });
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
              termBorder:"",
              initTermText:"",
              initDefText:"",
              hasInitValue:false
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
            termBorder:"",
            initTermText:"",
            initDefText:"",
            hasInitValue:false
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
            item.termText=item.termText.trim();
            item.defText=item.defText.trim();
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
          let title=encodeURIComponent(this.title.substring(0,this.title.length));
          let subtitle=encodeURIComponent(this.subtitle.substring(0,this.subtitle.length));
          let author=escape(this.getCookie('euname'));
          let postUrl='';
          let createtime=null;       //时间轴作为标识
          if(this.getCookie('createSetMode')=='edit'){
            postUrl='/api/updatewordset';
            let curSet=JSON.parse(this.getCookie('curSet'));
            createtime=curSet.timeStamp;
            curSet.title=this.title;
            curSet.subtitle=this.subtitle;
            this.setCookie('curSet',JSON.stringify(curSet),1);
          }else if(this.getCookie('createSetMode')=='create'){
            postUrl='/api/pushwordset';
            createtime=new Date().getTime();
          }
          let folder="";
          for(let i=0;i<this.items.length;i++){
            let vid=this.items[i].timestamp;
            let card={
              vid:vid,
              term:encodeURIComponent(this.items[i].termText),
              definition:encodeURIComponent(this.items[i].defText),
              author:author,
              createtime:createtime,                  //这是它所属的单词集合的相同的createtime
              matrixed:false                         //用来记录单词矩阵中单个item的状态
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
          console.log(postUrl);
          this.axios.post(postUrl, {
            params: {
              jsoncards:jsoncards,
              jsonwordset:jsonwordset
            }
          })
            .then((response)=> {
              console.log(response.data);
              if(this.getCookie('createSetMode')=='edit'){
                this.$router.push('/setLearn');
              }else if(this.getCookie('createSetMode')=='create'){
                this.$router.push('/wordsets');
              }
              this.setCreateState(false);
            });
        },
        ...mapMutations({
          add:'test/increment',
          openCD:'wordset/openCD',
          closeCD:'wordset/closeCD',
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
      components: {WaitDialog, MyToast, CreateDialog, FloatButton, MyButton, CreateInput}
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
    padding-right: 1rem;
    padding-left: 1rem;
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
    border-radius: 30px;
    box-shadow: 5px 5px 10px 1px lightgrey;
  }
  .fb-button{
    box-shadow: 0px 0px 10px 1px lightgrey;
    border-radius: 5px;
    cursor: pointer;
  }

  .add-button{
    user-select: none;
    width: 90%;
    height: 4.5rem;
    box-sizing: border-box;
    margin-left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    background-color: yellowgreen;
    cursor: pointer;
    text-decoration: underline;
    color: white;
    transition: all 0.6s ease-in-out;
    box-shadow: 5px 5px 10px 1px rgba(211, 211, 211, 0.6);
  }

  .fbTick{
    position: fixed;
    right: 7rem;
    bottom: 2rem;
    cursor:pointer;
    box-shadow: 0px 0px 10px 1px rgba(196, 196, 196, 0.6);
    z-index: 1000;
  }
</style>

