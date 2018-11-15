<template>
    <div class="create-set">
      <div class="out-container">
        <div class="container">
          <div v-for="(item,index) in items"  :key="item.timestamp" class="item-container"
               v-bind:class="{'animated bounceInLeft':item.visibility,'animated bounceOutLeft':!item.visibility}">
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

          <transition enter-active-class="animated fadeIn">
            <div class="add-button" @click="addItem(items.length)" v-if="showAddButton">{{$t('addText')}}</div>
          </transition>
        </div>
      </div>
      <float-button iconname="tick" size="middle" class="fbTick" @click="fbTickClick"
                    @mouseenter="fbTickHover" @mouseleave="fbTickFlur"></float-button>
      <create-dialog v-bind:title.sync="title" :initTitle="initTitle" :initSubTitle="initSubTitle"
                     v-bind:subtitle.sync="subtitle" v-if="createDialog.visibility" v-on:dismiss="createDialog.visibility=false"></create-dialog>
      <my-toast v-for="(toast,index) in toastlist" :text="toast.text" :key="index"></my-toast>
    </div>
</template>

<script>
    import CreateInput from "./create-input";
    import MyButton from "../my-button";
    import FloatButton from "./float-button";
    import CreateDialog from "./create-dialog";
    import MyToast from "../my-toast";
    import $ from 'jquery';
    import { mapState,mapMutations } from 'vuex';
    import WaitDialog from "../wait-dialog";
    export default {
        name: "create-set",                  //create-set有两个mode，editmode和createmode。用cookie来存储mode
        data(){
          return{
            items:[],
            toastlist:[],
            bgs:[],
            title:"",
            subtitle:"",
            initTitle:"",
            initSubTitle:"",
            isPushing:false,
            createDialog:{
              visibility:false
            },
            showAddButton:false,
            isAddingOrDeleting:false,
            settings: {
              maxScrollbarLength: 60
            }
          }
        },
      created(){
        console.log("create-set created");

        this.init();
      },
      methods: {
        init(){
          //createSet可以用来修改或者创建单词集合
          //createSetMode放在cookie中是为了重新刷新也不会丢失这个值，放在state中会
          if(this.getCookie('createSetMode')=='create'){
            let items=[];
            let timestamp=new Date().getTime();
            for(let i=0;i<3;i++){
              var item={
                timestamp:timestamp,        //这个timestamp作为key而不用index原因是插入删除时timestamp不会变，index会变
                termText:"",
                defText:"",
                showfb:false,
                defBorder:"",
                termBorder:"",
                initTermText:"",
                initDefText:"",
                hasInitValue:false,
                visibility:false                //注意，这里visibility用来开始结束动画
              }
              timestamp++;
              items.push(item);
            }
            this.items=items;
          }else if(this.getCookie('createSetMode')=='edit'){
            let curSet=JSON.parse(this.getCookie('curSet')); //curSet在打开一个单词集就有了，这个create-set是从那个单词集跳转来的，可以获取，只是history.go时候的状态可能有问题
            let login_Info=this.getCookie("login_Info");
            let username=JSON.parse(login_Info).username;
            this.initTitle=curSet.title;
            this.initSubTitle=curSet.subtitle;
            this.title=curSet.title;            //如果title没有修改，就用这个title
            this.subtitle=curSet.subtitle;      //同上
            this.axios.get('/api/getCards', {
              params: {
                username:username,
                createTime:curSet.timeStamp
              }
            })
              .then((response)=>{
                let cards=[];
                for(let i=0;i<response.data.length;i++){
                  let term=decodeURIComponent(response.data[i].term).replace(/\n/g,"<br>");   //用\n替代<br>才能实现换行
                  let definition=decodeURIComponent(response.data[i].definition).replace(/\n/g,"<br>");
                  let card={
                    timestamp:response.data[i].vid,
                    termText:term,
                    defText:definition,
                    showfb:false,
                    defBorder:"",
                    termBorder:"",
                    initTermText:term,
                    initDefText:definition,
                    hasInitValue:true,
                    visibility:false
                  }
                  cards.push(card);
                }
                this.items=cards;
              })
              .catch(function (error) {
                console.log(error);
              });
          }

          for(let i=0;i<this.items.length;i++){
            this.items[i].visibility=true;
          }
          setTimeout(()=>{
            this.showAddButton=true;
          },500);
        },
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
              hasInitValue:false,
              visibility:true
            }
            this.items.push(item);
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
                $('.container').animate({scrollTop:addButton.offsetTop},600,()=>{
                });
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
          if(!this.isAddingOrDeleting){
            this.isAddingOrDeleting=true;
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
              hasInitValue:false,
              visibility:true
            }
            this.items.splice(index+1,0,item);
            this.$nextTick(()=>{
              let el=document.querySelectorAll('.item-container');
              let o=el[index+1].getBoundingClientRect();
              let invert=o.top-o.bottom;
              let moveTransition=[
                { transform: 'translateY(' + invert + 'px)' },
                { transform: 'translateY(0)' }
              ]
              for(let i=index+2;i<this.items.length;i++){
                this.addTransition(el[i],moveTransition);
              }
              let addButton=document.querySelector('.add-button');
              this.addTransition(addButton,moveTransition);
              el[index+1].addEventListener("animationend",()=>{
                console.log("insertItem completed!");
                this.isAddingOrDeleting=false;
              },false);
            });
        }
        },
        deleteItem(index){
          this.$nextTick(()=>{
              var el=document.querySelectorAll('.item-container');
              var o = el[index].getBoundingClientRect();
              let invert = o.bottom - o.top;
              let moveTransition = [
                {transform: 'translateY(' + invert + 'px)'},
                {transform: 'translateY(0)'},
              ]

              this.items[index].visibility=false;
              el[index].addEventListener("animationstart",()=>{     //可能会多次执行
                if(!this.isAddingOrDeleting){
                  this.isAddingOrDeleting=true;
                  setTimeout(()=>{
                    for (let i = index; i < this.items.length; i++) {
                      this.addTransition(el[i], moveTransition);
                    }
                    var addButton = document.querySelector('.add-button');
                    let player=this.addTransition(addButton, moveTransition);
                    this.items.splice(index, 1);
                    this.isAddingOrDeleting=false;
                  },700);
                }
              });
          });
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
          if(this.verifySets()){
            if(!this.createDialog.visibility){
              this.createDialog.visibility=true;
            }else {
              if(this.title.length==0){
                let toast={
                  text:this.$t('createDialog.titleEmpty')
                }
                this.toastlist.push(toast);
              }else {
                if(!this.isPushing){
                  this.isPushing=true;
                  this.pushWordset();
                }
              }
            }
          }
        },
        verifySets(){
          var vm=this;
          for(let i=0;i<this.items.length;i++){
            let item=this.items[i];
            item.termText=item.termText.trim();  //删除两端空白字符
            item.defText=item.defText.trim();
            if(item.termText==""){
              item.termBorder="1px solid red";
              $('.term')[i].focus();
              setTimeout(()=> {
                item.termBorder="1px solid white";
              },1500);
              let toast={
                text:i+1+vm.$t('createSet.termEmpty')
              }
              this.toastlist.push(toast);
              return false;
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
              return false;
            }
          }
          //到这步term和def就都不为空

          if(this.items.length<3){
            let toast={
              text:vm.$t('createSet.setLength')
            }
            this.toastlist.push(toast);
            return false;
          }

          return true;
        },
        pushWordset(){
          let cards=[];
          let title=encodeURIComponent(this.title);
          let subtitle=encodeURIComponent(this.subtitle);
          if(title.length>48){
            title=title.substring(0,48);
          }
          if(subtitle.length>128){
            subtitle=subtitle.substring(0,128);
          }
          let login_Info=this.getCookie("login_Info");
          let author=JSON.parse(login_Info).username;
          let postUrl='';
          let createtime=null;       //时间轴作为标识
          if(this.getCookie('createSetMode')=='edit'){
            postUrl='/api/updateSV';
            let curSet=JSON.parse(this.getCookie('curSet'));
            createtime=curSet.timeStamp;
            curSet.title=title;
            curSet.subtitle=subtitle;
            this.setCookie('curSet',JSON.stringify(curSet),1);    //要更新，因为title,subtitle可能会变
          }else if(this.getCookie('createSetMode')=='create'){
            postUrl='/api/pushSV';
            createtime=new Date().getTime();
          }
          for(let i=0;i<this.items.length;i++){
            let vid=this.items[i].timestamp;
            let card={
              vid:vid,
              term:encodeURIComponent(this.items[i].termText),
              definition:encodeURIComponent(this.items[i].defText),
              author:author,
              createtime:createtime,                  //这是它所属的单词集合的相同的createtime
              matrixed:false,                        //用来记录单词矩阵中单个item的状态
              writed:false,                      //用来记录拼写中单词的状态
              mmatrixed:false,
              mwrited:false,
              mflashed:false,
              flashed:false,
            }
            cards.push(card);
          }
          let wordset={
            title:title,
            subtitle:subtitle,
            author:author,
            createtime:createtime,
            folder:"all",
            termCount:cards.length
          }
          let jsoncards=JSON.stringify(cards);
          let jsonwordset=JSON.stringify(wordset);
          let curTime=new Date().getTime();
          let nonce=this.getRandomStr(10)+curTime;
          this.axios.post(postUrl, {
            params: {
              curTime:curTime,
              nonce:nonce,
              jsoncards:jsoncards,
              jsonwordset:jsonwordset
            }
          })
            .then((response)=> {
              this.dismissCreateSet();
              this.setFlushState(true);
            });
        },
        ...mapMutations({
          dismissCreateSet:'wordset/dismissCreateSet',
          setFlushState:'wordset/setFlushState'
        }),
      },
      components: { WaitDialog, MyToast, CreateDialog, FloatButton, MyButton, CreateInput}
    }
</script>

<style scoped>
  div,p{
    margin: 0;
    padding: 0;
  }
  .create-set{
     width: 60%;
     height: 80%;
   }

  .out-container{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .container{
    width: 105%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .item-container{
    width: 90%;
    height: fit-content;
    transition: all 2s;
    box-sizing: border-box;
    margin-left: 5%;
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
    margin-left: 5%;
    height: 4.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    cursor: pointer;
    text-decoration: underline;
    color: white;
    transition: all 0.6s ease-in-out;
    background-color: var(--maximumblue);
    box-shadow: 5px 5px 10px 1px rgba(211, 211, 211, 0.6);
  }

  .fbTick{
    position: fixed;
    right: 5%;
    bottom: 2rem;
    cursor:pointer;
    box-shadow: 0px 0px 10px 1px rgba(196, 196, 196, 0.6);
    z-index: 1000;
  }

</style>

