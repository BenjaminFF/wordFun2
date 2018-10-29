<template>
  <div class="fc-container" tabindex="-1" @keyup.space="turnCurCard" @keyup.s="shuffle" @keyup.m="defOption"
      @keyup.p="playCards"  @keyup.left="slideLeft('left')" @keyup.right="slideRight('right')" @keydown="banTab($event)">
    <div class="cards-container" v-if="!loading">
      <flashcard v-for="(card,index) in cards" :maxdef="card.maxdef" :maxterm="card.maxterm" :termText="card.term" :defText="card.definition"
         :style="{left:card.offset+'%'}" :key="index" :visibility="card.visibility" :textColor="theme.textColor"
                 :hideDef="hideDef" :backGround="card.bg" ref="flashcards" :middle-line-color="theme.middleLineColor"></flashcard>
      <icon name="left" class="slideLeft" @click.native="slideLeft('left')" v-if="leftVisibility" :style="{color:lIconColor}"
            @mouseenter.native="lIconColor=theme.iconActiveColor" @mouseleave.native="lIconColor=theme.iconColor"></icon>
      <icon name="right" class="slideRight" @click.native="slideRight('right')" v-if="rightVisibility" :style="{color:rIconColor}"
            @mouseenter.native="rIconColor=theme.iconActiveColor" @mouseleave.native="rIconColor=theme.iconColor"></icon>
      <icon name="keyboard" class="keyBoard" @click.native="showKBInstruct=true" :style="{color:kIconColor}"
            @mouseenter.native="kIconColor=theme.iconActiveColor" @mouseleave.native="kIconColor=theme.iconColor"></icon>
    </div>
    <div class="fc-sidebar"  v-if="!loading">
      <div class="inner-container">
        <div class="pgb-container" :style="{backgroundColor:theme.pgbBG}">
          <svg class="progressbar" viewBox="0 0 1500 1500">
            <circle r="500" cx="750" cy="750" class="bg-circle" :style="{stroke:theme.circleBG}"></circle>
            <path class="pgb-circle" d="M750 250A500 500 0 1 1 750 1250 A500 500 0 1 1 750 250" :style="{'stroke-dashoffset':dashOffset,stroke:theme.circleStroke}"></path>
            <text x="750" y="750" class="pgbText" :style="{fill:theme.circleStroke}">{{pgbText}}</text>
          </svg>
        </div>
        <div class="fc-side-item" :style="{backgroundColor:theme.sideItemBG,color:theme.sideItemColor}" @click="playCards">
          <icon :name="playIcon" class="fc-play-icon"></icon>
          {{$t('setLearn.flashCards.play')}}
        </div>
        <div class="fc-side-item" :style="{backgroundColor:theme.sideItemBG,color:theme.sideItemColor}" @click="shuffle">
          <icon name="relearn" class="fc-play-icon"></icon>
          {{$t('setLearn.flashCards.shuffle')}}
        </div>
        <div class="fc-side-item" :style="{backgroundColor:theme.sideItemBG,color:theme.sideItemColor}" @click="defOption">
          <icon :name="defOptionStyle.icon" class="fc-play-icon"></icon>
          {{defOptionStyle.text}}
        </div>
      </div>
      </div>
    <wait-dialog v-if="loading" :text="'F'" :color="theme.dialogColor" :style="{backgroundColor:theme.dialogBG}"></wait-dialog>
    <transition leave-active-class="animated fadeOut" enter-active-class="animated fadeIn">
      <div class="keyBoard-instruction" @click="showKBInstruct=false" v-if="showKBInstruct">
        <div class="KBI-container">
          <div class="KBI-item" v-for="item in KBIItems">
            <p style="color: yellowgreen">{{item.text}}</p>
            <svg width="1.8rem" height="1.8rem" viewBox="0 0 100 100">
              <rect height="100" width="100" style="stroke-width: 10px;stroke: yellowgreen;fill: transparent"></rect>
              <text x="50%" y="60%" class="svgText">{{item.svgText}}</text>
            </svg>
          </div>
          <div class="KBI-item">
            <p style="color: yellowgreen">{{$t('setLearn.flashCards.keyBoard[5]')}}</p>
            <svg width="3.6rem" height="1.8rem" viewBox="0 0 200 100">
              <rect x="0" y="0" height="100" width="200" style="stroke-width: 10px;stroke: yellowgreen;fill: transparent"></rect>
              <text x="50%" y="60%" class="svgText">SPACE</text>
            </svg>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
    import Flashcard from "./flashcard";
    import WaitDialog from "../wait-dialog";
    import theme from '../../assets/theme/TsetLearn'
    import _ from 'lodash'
    export default {
        name: "flashcards-container",
      components: {Flashcard,WaitDialog},
      data(){
          return{
            loading:true,
            cards:[],
            curIndex:0,
            leftVisibility:false,
            rightVisibility:false,
            pgbTotalLen:3140,
            pgbSingleLen:"",
            dashOffset:"",
            pgbText:"",
            play:"",
            playIcon:"",
            defOptionStyle:{},
            showKBInstruct:false,
            KBIItems:[],
            theme:{},
            lIconColor:'',
            rIconColor:'',
            kIconColor:'',
          }
      },
      created(){
          this.theme=theme[this.themeName].flashCardsT;
          this.lIconColor=this.rIconColor=this.kIconColor=this.theme.iconColor;

          this.fetchData();
          this.leftVisibility=false;
          this.rightVisibility=true;
          this.$nextTick(()=>{
            let fc=document.getElementsByClassName('fc-container');
            fc[0].focus();
          });
          this.playIcon='play';

          let text=this.$t('setLearn.flashCards.hideDef');
          this.defOptionStyle={
            icon:'hide',
            text:text
          }
          this.hideDef=false;
          let KBSvgTexts=['←','→','S','P','M'];
          let items=[];
          for(let i=0;i<KBSvgTexts.length;i++){
            let text=this.$t('setLearn.flashCards.keyBoard')[i];
            let item={
              svgText:KBSvgTexts[i],
              text:text
            }
            items.push(item);
          }
          this.KBIItems=items;
      },
      destroyed(){
        console.log("flashcards-container destroyed");
        this.updateflashedtoServer();      //在离开flashcards的时候更新数据
      },
      methods:{
        banTab(e){
          let keyCode=e.keyCode||e.which;
          if(keyCode===9){
            e.preventDefault();
          }
        },
        turnCurCard(){
          this.$refs.flashcards[this.curIndex].turnCard();
        },
        fetchData(){
          this.loading=true;
          this.curIndex=0;
          let login_taken=this.getCookie("login_token");
          let username=JSON.parse(login_taken).username;
          let curSet=JSON.parse(this.getCookie('curSet'));
          this.title=this.limitLength(curSet.title,40,true);     //title字数过长，影响视觉
          this.subtitle=this.limitLength(curSet.subtitle,40,true);
          let createTime=curSet.timeStamp;
          this.axios.get('/api/getCards', {        //获取卡片等数据不需要加密传输
            params: {
              username:username,
              createTime:createTime
            }
          })
            .then((response)=>{
              console.log(response.data);
              let cards=[];
              let lastCard={};
              let offset=0;      //positon left
              console.log(response.data);
              for(let i=0;i<response.data.length;i++){
                  let term=decodeURIComponent(response.data[i].term).replace(/\n/g,"<br>");   //用\n替代<br>才能实现换行
                  let definition=decodeURIComponent(response.data[i].definition).replace(/\n/g,"<br>");
                  let flashed=response.data[i].flashed;
                  let vid=response.data[i].vid;
                  let bg=this.getColor(this.theme.itemBGs);
                  if(this.theme.itemBGs.length!=1&&this.cards.length!=0){
                  while (bg==cards[i-1].bg){
                    bg=this.getColor(this.theme.itemBGs);
                    }
                  }

                  let maxdef = definition;
                  if (this.checkLength(definition) >= 140) {
                    let chineseLen=this.checkChinese(definition);
                    definition = definition.substring(0, 140-Math.round(chineseLen/2)) + '...';
                  }
                let maxterm=term;
                if (this.checkLength(term) >= 140) {
                  let chineseLen=this.checkChinese(term);
                  term = term.substring(0, 140-Math.round(chineseLen/2)) + '...';
                }
                let card={
                  vid:vid,
                  term:term,
                  definition:definition,
                  maxterm:maxterm,
                  maxdef: maxdef,
                  offset:0,
                  bg:bg,
                  flashed:flashed,
                  visibility:'hidden'
                }
                cards.push(card);
                lastCard=card;
              }
              for(let i=0;i<cards.length;i++){       //先加入flashed的card
                if(cards[i].flashed){
                  this.cards.push(cards[i]);
                  offset+=100;
                  this.curIndex+=1;
                }
              }
              for(let i=0;i<cards.length;i++){
                if(!cards[i].flashed){
                  this.cards.push(cards[i]);
                }
              }
              for(let i=0;i<this.cards.length;i++){
                this.cards[i].offset=offset;
                offset-=100;
              }
              this.pgbSingleLen=this.pgbTotalLen/this.cards.length;
              this.dashOffset=this.pgbTotalLen-this.pgbSingleLen*(this.curIndex+1);
              this.pgbText=this.curIndex+1+'/'+this.cards.length;

              if(this.curIndex==this.cards.length-1){
                this.rightVisibility=false;
                this.leftVisibility=true;
              }else if(this.curIndex==0){
                this.leftVisibility=false;
                this.rightVisibility=true;
              }else {
                this.leftVisibility=true;
                this.rightVisibility=true;
              }
              setTimeout(()=>{
                this.loading=false;
              },500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        slideLeft(invoker){
          if(invoker=='left'){          //判断该方法的调用者，如果是leftIcon,就停止playIcon的状态
            if(this.playIcon=='pause'){
              clearInterval(this.play);
              this.playIcon='play';
            }
          }
          if(this.curIndex>=1){
            this.curIndex--;
            for(let i=0;i<this.cards.length;i++){
              this.cards[i].offset-=100;
            }
            if(this.curIndex==0){
              this.leftVisibility=false;
              this.rightVisibility=true;
            }else {
              this.leftVisibility=true;
              this.rightVisibility=true;
            }
            this.dashOffset+=this.pgbSingleLen;
            this.pgbText=this.curIndex+1+'/'+this.cards.length;
          }
        },
        slideRight(invoker){
          if(invoker=='right'){
            if(this.playIcon=='pause'){
              clearInterval(this.play);
              this.playIcon='play';
            }
          }
          if(this.curIndex<this.cards.length-1){
            this.curIndex++;
            for(let i=0;i<this.cards.length;i++){
              this.cards[i].offset+=100;
            }
            if(this.curIndex==this.cards.length-1){
              this.rightVisibility=false;
              this.leftVisibility=true;
            }else {
              this.rightVisibility=true;
              this.leftVisibility=true;
            }
            this.dashOffset-=this.pgbSingleLen;
            this.pgbText=this.curIndex+1+'/'+this.cards.length;
          }
          console.log(this.curIndex);
          console.log("this.rightVisibility："+this.rightVisibility);
        },
        playCards(){
          if(this.playIcon=='play'){
            this.playIcon='pause';
            this.play=setInterval(()=>{
              if(this.curIndex<this.cards.length-1){
                this.slideRight("play");
              }else {
                clearInterval(this.play);
                this.playIcon='play';
              }
            },3000);
          }else if(this.playIcon=='pause'){
            this.playIcon='play';
            clearInterval(this.play);
          }
        },
        shuffle(){
          this.cards=_.shuffle(this.cards);
          let offset=0;
          for(let i=0;i<this.cards.length;i++){
            this.cards[i].offset=offset;
            offset-=100;
          }
          console.log(this.cards);
          this.curIndex=0;
          this.leftVisibility=false;
          this.rightVisibility=true;
          this.dashOffset=this.pgbTotalLen-this.pgbSingleLen;
          this.pgbText=this.curIndex+1+'/'+this.cards.length;
        },
        defOption(){
          if(this.defOptionStyle.icon=='hide'){
            this.defOptionStyle.icon='show';
            this.defOptionStyle.text=this.$t('setLearn.flashCards.showDef');
            this.hideDef=true;
          }else if(this.defOptionStyle.icon=='show'){
            this.defOptionStyle.icon='hide';
            this.defOptionStyle.text=this.$t('setLearn.flashCards.hideDef');
            this.hideDef=false;
          }
        },
        updateflashedtoServer(){      //上传记录到服务器，以便下次访问时可以进入到上次的状态。这种上传因为很频繁，就只能依赖https了
          let flashes=[];
          let cards=this.cards;
          for(let i=0;i<cards.length;i++){
            let data={};
            if(i<this.curIndex){
              data={
                vid:cards[i].vid,
                flashed:true
              }
            }else {
              data={
                vid:cards[i].vid,
                flashed:false
              }
            }
            flashes.push(data);
          }
          let login_token=this.getCookie("login_token");
          let jsondata=JSON.stringify(flashes);
          let username=JSON.parse(login_token).username;
          this.axios.post("/api/updateflashs",{
            params: {
              username:username,
              jsondata:jsondata
            }
          }).then((res)=>{
            console.log(res);
          }).catch((err)=>{
            console.log(err);
          })
        }
      },
      props:{
          themeName:{
            type:String,
            required:true
          }
      }
    }
</script>

<style scoped>
  .fc-container{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    outline: none;
    user-select: none;
  }
  .cards-container{
    width: 65%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition:all ease-in-out 1s;
  }

  .slideLeft{
    position: absolute;
    left: 0rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
  .slideRight{
    position: absolute;
    right: 0rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }



  .keyBoard{
     position: absolute;
     right: 0rem;
     bottom: 13%;
     width: 1.8rem;
     height: 1.8rem;
     color: gray;
     cursor: pointer;
   }

  .keyBoard:hover{
    color: var(--awesome);
  }

  .keyBoard-instruction{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.31);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .KBI-container{
    width: 10rem;
    height: fit-content;
    background-color: white;
    padding: 0rem 0.5rem;
    font-size: 1.2rem;
  }

  .KBI-item{
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid lightgrey;
  }

  .KBI-item .svgText{
    fill: yellowgreen;
    font-size: 50px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .fc-sidebar{
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    user-select: none;
  }

  .inner-container{
    width: 100%;
    height: 75%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .pgb-container{
    width: 100%;
    height: 13rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
  }

  .progressbar{
    width: 100%;
    height: 15rem;
  }

  .pgb-circle{
    fill: transparent;
    stroke-width: 80px;
    stroke-dasharray: 3140;
    transition: all 1s ease-in-out;
    stroke-linecap: round;
  }
  .pgbText{
    fill: var(--seablue);
    font-size: 200px;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .bg-circle{
    fill: transparent;
    stroke-width: 80px;
  }

  .fc-side-item{
    width: 100%;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
  }

  .fc-play-icon{
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    letter-spacing: 0.1rem;
  }

  .fc-side-item:hover{
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
    transition: all 0.2s ease-in-out;
  }
</style>
