<template>
  <div class="write-out-container" tabindex="-1" @keydown="banTab($event)" @keyup="pressKeyToContinue">
     <div class="content-container">
       <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
         <write v-for="(card,index) in roundcards" class="write-container" v-if="card.visibility"
                :key="index" v-on:dismiss="dismiss($event,index)" :style="{backgroundColor:card.bg}"
                :definition="card.definition" :term="card.term" :maxdef="card.maxdef" :textColor="theme.textColor" :hintColor="theme.hintColor"></write>
       </transition-group>
       <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
         <div class="roundEnd" v-if="roundEnd.visibility" :style="{backgroundColor:roundEnd.bg,color:theme.textColor}">
           <div class="roundEnd-header">很赞，再接再厉！</div>
           <div class="roundEnd-button" @click="startNextRound" :style="{border:'2px solid '+theme.textColor}">{{$t('setLearn.write.continue')}}</div>
         </div>
       </transition>
       <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
         <div class="learnEnd" v-if="learnEnd.visibility" :style="{backgroundColor:learnEnd.bg,color:theme.textColor}">
           <div class="learnEnd-header">{{$t('setLearn.write.learnEnd')}}</div>
           <div class="learnEnd-button" @click="relearn" :style="{border:'2px solid '+theme.textColor}">{{$t('setLearn.write.reLearn')}}</div>
         </div>
       </transition>
     </div>
    <div class="sidebar">
      <div class="pgb-container" :style="{backgroundColor:theme.pgbBG}">
        <svg class="round-pgb" viewBox="0 0 160 80">
          <path d="M30 50 A50 50 0 1 1 130 50" class="round-pgb-bg" :style="{stroke:theme.circleBG}"></path>
          <path d="M30 50 A50 50 0 1 1 130 50" class="round-pgb-path"
                :style="{'stroke-dasharray':roundData.totalLen,'stroke-dashoffset':roundData.offset,stroke:theme.circleStroke}"></path>
          <text x="80" y="50" class="round-percentage" :style="{fill:theme.sideItemColor}">{{roundData.text}}</text>
          <text x="80" y="80" style="font-size: 0.6rem;text-anchor: middle;" :style="{fill:theme.sideItemColor}">{{$t('setLearn.write.round')}}</text>
        </svg>
        <svg class="progress-pgb" viewBox="0 0 160 80">
          <path d="M30 50 A50 50 0 1 1 130 50" class="progress-pgb-bg" :style="{stroke:theme.circleBG}"></path>
          <path d="M30 50 A50 50 0 1 1 130 50" class="progress-pgb-path"
                :style="{'stroke-dasharray':pgData.totalLen,'stroke-dashoffset':pgData.offset,stroke:theme.circleStroke}"></path>
          <text x="80" y="50" class="round-percentage" :style="{fill:theme.sideItemColor}">{{pgData.text}}</text>
          <text x="80" y="80" style="font-size: 0.6rem;text-anchor: middle;" :style="{fill:theme.sideItemColor}">{{$t('setLearn.write.progress')}}</text>
        </svg>
      </div>
      <div class="fc-side-item" :style="{backgroundColor:theme.sideItemBG,color:theme.sideItemColor}" @click="relearn">
      <icon name="relearn" class="fc-play-icon"></icon>
      {{$t('setLearn.matrix.startOver')}}
    </div>
      <div class="fc-side-item" :style="{backgroundColor:theme.sideItemBG,color:theme.sideItemColor}" @click="shuffleCards">
        <icon name="shuffle" class="fc-play-icon"></icon>
        {{$t('setLearn.matrix.shuffle')}}
      </div>
    </div>
    <wait-dialog v-if="loading" :text="'W'" :color="theme.dialogColor" :style="{backgroundColor:theme.dialogBG}"></wait-dialog>
  </div>
</template>

<script>
    import Write from "./write";
    import WaitDialog from "../wait-dialog";
    import theme from '../../assets/theme/TsetLearn';
    import _ from 'lodash';
    export default {
        name: "write-container",
      components: {WaitDialog, Write},
      data(){
          return{
            loading:'',
            cards:[],
            roundcards:[],            //单轮卡片
            roundData:{},
            pgData:{},                //progressData
            roundEnd:{},
            learnEnd:{},
            theme:{},
            canPressAnyKey:false,
            writedLen:""
          }
      },
      created(){
          console.log("write-container created");
          this.theme=theme[this.themeName].writeT;
          this.$nextTick(()=>{
            let pgEL=document.querySelector('.progress-pgb-bg');
            this.roundData.totalLen=pgEL.getTotalLength();
            this.pgData.totalLen=pgEL.getTotalLength();
          });
          this.fetchData();
      },
      destroyed(){
        let login_Info=this.getCookie("login_Info");
        if(login_Info!="") {
          this.updatewritedToServer();
          console.log("ggggg");
        }
      },
      methods:{
        banTab(e){
          let keyCode=e.keyCode||e.which;
          if(keyCode===9){
            e.preventDefault();
          }
        },
        initWriteContainer(){
          this.writedLen=0;
          this.roundcards=[];
          this.cards=[];
          this.loading = true;
          this.roundData={
              offset:'',
              singleLen:'',     //offset,singleLen和totalLen代表进度条的长度控制
              totalLen:'',
              curIndex:'',
              cardsLen:'',
              text:''
          },
          this.pgData={                //progressData
              offset:'',
              singleLen:'',
              totalLen:'',
              curIndex:'',
              cardsLen:'',
              text:''
          }
          let bg=this.getColor(this.theme.itemBGs);
          this.roundEnd={
            visibility:false,
            bg:bg
          }
          this.learnEnd={
            visibility:false,
            bg:bg
          }
        },
        initCards(data){
          let cards=[];
          let roundcards=[];

          for (let i = 0; i <data.length; i++) {
            let term = decodeURIComponent(data[i].term).replace(/\n/g, "<br>");   //用\n替代<br>才能实现换行
            let definition = decodeURIComponent(data[i].definition).replace(/\n/g, "<br>");
            let maxdef = definition;
            let vid=data[i].vid;
            let writed=data[i].writed;

            if(writed){
              this.writedLen+=1;
            }

            let bg=this.getColor(this.theme.itemBGs);
            if(this.theme.itemBGs.length!=1&&this.cards.length!=0){
              while (bg==cards[i-1].bg){
                bg=this.getColor(this.theme.itemBGs);
              }
            }

            if (this.checkLength(definition) >= 160) {
              let chineseLen=this.checkChinese(definition);
              if(chineseLen>=100){
                chineseLen+=55;
              }
              definition = definition.substring(0, 160-Math.round(chineseLen/2)) + '...';
            }
            let card = {
              vid:vid,
              term: term,
              definition: definition,
              maxdef:maxdef,
              writed:writed,
              visibility:false,
              bg:bg
            }
            cards.push(card);
          }

          this.cards=cards;

          if(this.writedLen==data.length){
            this.learnEnd.visibility=true;
            return;
          }

          for(let i=0;i<this.cards.length;i++){
            if(!this.cards[i].writed){
              roundcards.push(this.cards[i]);
            }
            if(roundcards.length>=7){
              break;
            }
          }
          this.roundcards=roundcards;
          this.roundcards[0].visibility=true;
        },
        shuffleCards(){
          //this.roundData.curIndex代表当前可见卡片的index，包括当前卡片和以后的卡片需要shuffle,并且只剩一个卡片不用shuffle
          if(!this.roundEnd.visibility&&!this.learnEnd.visibility&&!(this.roundData.curIndex==this.roundcards.length-1)){
            this.roundcards[this.roundData.curIndex].visibility=false;
            let cards=[];
            let length=this.roundcards.length;
            for(let i=this.roundData.curIndex;i<length;i++){
              cards.push(this.roundcards.pop());
            }
            let shuffle_cards=[];
            if(!(this.roundData.curIndex==this.roundcards.length-2)){   //不只剩余两个的话就shuffle，只剩两个就直接交换
              shuffle_cards=_.shuffle(cards);
            }else {
              shuffle_cards=cards;
            }
            for(let i=0;i<shuffle_cards.length;i++){
              this.roundcards.push(shuffle_cards[i]);
            }
            setTimeout(()=>{
              this.roundcards[this.roundData.curIndex].visibility=true;
            },1000);
          }
        },
        setPGB(pgb,cardsLen,curIndex,isPercentage){
          pgb.cardsLen=cardsLen;
          pgb.singleLen=pgb.totalLen/cardsLen;

          pgb.curIndex=curIndex;
          pgb.offset=pgb.totalLen-curIndex*pgb.singleLen;

          if(isPercentage){
            pgb.text=Math.round(curIndex/cardsLen*100)+'%';
          }else {
            pgb.text=curIndex+'/'+cardsLen;
          }
        },
        initPGB(totalSetLen){
          let pgEL=document.querySelector('.progress-pgb-bg');
          this.roundData.totalLen=pgEL.getTotalLength();
          this.pgData.totalLen=pgEL.getTotalLength();
          this.setPGB(this.pgData,totalSetLen,this.writedLen,true);
          let leftedcardslen=totalSetLen-this.writedLen;
          if(leftedcardslen==0){
            this.setPGB(this.roundData,7,7,false);
          }else if(leftedcardslen<7){
            this.setPGB(this.roundData,leftedcardslen,0,false);
          }else {
            this.setPGB(this.roundData,7,0,false);
          }
        },
        fetchData() {
          this.initWriteContainer();
          let login_Info=this.getCookie("login_Info");
          let username="";
          if(login_Info!=""){
            username=JSON.parse(login_Info).username;
          }else {
            let default_Info=this.getCookie("default_Info");
            username=JSON.parse(default_Info).username;
          }
          let curSet = JSON.parse(this.getCookie('curSet'));
          let createTime = curSet.timeStamp;
          this.axios.get('/api/getCards', {
            params: {
              username: username,
              createTime: createTime
            }
          })
            .then((response) => {
              this.initCards(response.data);
              this.initPGB(response.data.length);
              setTimeout(()=>{
                this.loading=false;
              },500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        updateRoundData(){
          this.roundData.curIndex++;
          this.setPGB(this.roundData,this.roundData.cardsLen,this.roundData.curIndex,false);
        },
        updatePGData(){
          this.pgData.curIndex++;
          this.setPGB(this.pgData,this.pgData.cardsLen,this.pgData.curIndex,true);
        },
        dismiss(canUpdate,index){
          this.roundcards[index].visibility=false;

          if(canUpdate){       //canUpdate代表第一次就回答正确,就刷新cards里面的writed
            this.roundcards[index].writed=true;
            this.writedLen+=1;
            this.updatePGData();
          }
          this.updateRoundData();
          this.showNext(index+1);
        },
        showNext(nextIndex){
          if(this.writedLen==this.pgData.cardsLen){   //表示全部单词过完
            setTimeout(()=>{
              this.learnEnd.visibility=true;
            },1000);
            this.updateWriteLearnedCountToServer();
            return;
          }

          if(this.roundData.curIndex==this.roundData.cardsLen){           //表示这轮结束
            this.roundEnd.visibility=true;
            let fc=document.getElementsByClassName('write-out-container');
            fc[0].focus();
            var that=this;
            setTimeout(()=>{
              that.canPressAnyKey=true;
            },500);
          }else {
            setTimeout(()=>{
              this.roundcards[nextIndex].visibility=true;
            },500);
          }
        },
        updateWriteLearnedCountToServer(){
          let curTime=new Date().getTime();
          let nonce=this.getRandomStr(10)+curTime;
          let login_Info=this.getCookie("login_Info");
          let username=JSON.parse(login_Info).username;
          let curSet = JSON.parse(this.getCookie('curSet'));
          let createTime = curSet.timeStamp;
          this.axios.post("/api/updateWriteLearned",{
            params:{
              curTime:curTime,
              nonce:nonce,
              username:username,
              createTime:createTime
            }
          }).then((response)=>{
            console.log(response.data);
          }).catch((error)=>{
            throw error;
          });
        },
        pressKeyToContinue(){
          if(this.canPressAnyKey){
            this.startNextRound();
            let fc=document.getElementsByClassName('write-out-container');
            fc[0].blur();
            this.canPressAnyKey=false;
          }
        },
        startNextRound(){
          let roundcards=[];
          if(this.roundEnd.visibility){
            this.roundEnd.visibility=false;
            for(let i=0;i<this.cards.length;i++){
              if(!this.cards[i].writed){
                roundcards.push(this.cards[i]);
              }
              if(roundcards.length>=7){
                break;
              }
            }
            this.roundcards=roundcards;
            this.setPGB(this.roundData,roundcards.length,0,false);
            setTimeout(()=>{
              this.roundcards[0].visibility=true;
            },500);
          }
        },
        updatewritedToServer(){
          let writes=[];
          let cards=this.cards;
          for(let i=0;i<cards.length;i++){
            let data={
              vid:cards[i].vid,
              writed:cards[i].writed
            }
            writes.push(data);
          }
          let login_Info=this.getCookie("login_Info");
          let jsondata=JSON.stringify(writes);
          let username=JSON.parse(login_Info).username;
          let curTime=new Date().getTime();
          let nonce=this.getRandomStr(10)+curTime;
          this.axios.post("/api/updatewrites",{
            params: {
              curTime:curTime,
              nonce:nonce,
              username:username,
              jsondata:jsondata
            }
          }).then((res)=>{
            console.log(res);
          }).catch((err)=>{
            console.log(err);
          })
        },
        relearn(){
          this.loading=true;
          this.writedLen=0;
          if(this.learnEnd.visibility){
            this.learnEnd.visibility=false;
          }else if(this.roundEnd.visibility){
            this.roundEnd.visibility=false;
          }else {
            this.roundcards[this.roundData.curIndex].visibility=false;
          }
          for(let i=0;i<this.cards.length;i++){
            this.cards[i].writed=false;
          }
          let roundcards=[];

          for(let i=0;i<this.cards.length;i++){
            roundcards.push(this.cards[i]);
            if(roundcards.length>=7){
              break;
            }
          }
          this.roundcards=roundcards;
          this.roundcards[0].visibility=true;
          this.initPGB(this.cards.length);
          setTimeout(()=>{
            this.loading=false;
          },1000);
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
  .write-out-container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: white;
    user-select: none;
    position: relative;
    outline: none;
  }
  .content-container{
    width: 50%;
    height: 80%;
    border-radius: 10px;
    position: relative;
  }

  .write-container{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .roundEnd{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 10px;
    padding: 2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: var(--seablue);
    box-sizing: border-box;
  }

  .roundEnd-header{
    width: 100%;
    height: fit-content;
    font-size: 2rem;
    text-align: center;
  }

  .roundEnd-button{
    width: fit-content;
    height: fit-content;
    padding: 1rem 1rem;
    border-radius: 10px;
    margin-top: 50%;
  }

  .roundEnd-button:hover{
    cursor: pointer;
  }

  .learnEnd{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 10px;
    background-color: yellowgreen;
    padding: 2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: var(--seablue);
    box-sizing: border-box;
  }

  .learnEnd-header{
    width: 100%;
    height: fit-content;
    font-size: 2rem;
    text-align: center;
  }

  .learnEnd-button{
    width: fit-content;
    height: fit-content;
    font-size: 1.5rem;
    padding: 1rem 1rem;
    border-radius: 10px;
    margin-top: 50%;
  }

  .learnEnd-button:hover{
    cursor: pointer;
  }

  .sidebar{
    width: 20%;
    height: 80%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
  }

  .pgb-container{
    width: 100%;
    height: 60%;
    border-radius: 5px;
  }

  .round-pgb{
    width: 100%;
    height: 50%;
  }

  .round-pgb-bg{
    fill: transparent;
    stroke-width: 6px;
    stroke-linecap: round;
  }

  .round-pgb-path{
    fill: transparent;
    stroke-width: 6px;
    stroke-linecap: round;
    transition: all .5s ease-in;
  }

  .round-percentage{
    font-size: 0.8rem;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .progress-pgb-bg{
    fill: transparent;
    stroke-width: 6px;
    stroke-linecap: round;
  }

  .progress-pgb-path{
    fill: transparent;
    stroke-width: 6px;
    stroke-linecap: round;
    transition: all .5s ease-in;
  }

  .progress-pgb{
    width: 100%;
    height: 50%;
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
