<template>
  <div class="write-out-container">
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
           <div class="learnEnd-button" @click="updateWrites" :style="{border:'2px solid '+theme.textColor}">{{$t('setLearn.write.reLearn')}}</div>
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
          <text x="80" y="80" style="font-size: 0.8rem;text-anchor: middle;" :style="{fill:theme.sideItemColor}">{{$t('setLearn.write.round')}}</text>
        </svg>
        <svg class="progress-pgb" viewBox="0 0 160 80">
          <path d="M30 50 A50 50 0 1 1 130 50" class="progress-pgb-bg" :style="{stroke:theme.circleBG}"></path>
          <path d="M30 50 A50 50 0 1 1 130 50" class="progress-pgb-path"
                :style="{'stroke-dasharray':pgData.totalLen,'stroke-dashoffset':pgData.offset,stroke:theme.circleStroke}"></path>
          <text x="80" y="50" class="round-percentage" :style="{fill:theme.sideItemColor}">{{pgData.text}}</text>
          <text x="80" y="80" style="font-size: 0.8rem;text-anchor: middle;" :style="{fill:theme.sideItemColor}">{{$t('setLearn.write.progress')}}</text>
        </svg>
      </div>
      <div class="fc-side-item" :style="{backgroundColor:theme.sideItemBG,color:theme.sideItemColor}" @click="updateWrites">
      <icon name="relearn" class="fc-play-icon"></icon>
      {{$t('setLearn.matrix.startOver')}}
    </div>
      <div class="fc-side-item" :style="{backgroundColor:theme.sideItemBG,color:theme.sideItemColor}" @click="shuffle">
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
            sidebarBG:"",
            loading:'',
            cards:[],
            roundcards:[],            //单轮卡片
            roundData:{},
            pgData:{},                //progressData
            writedLen:'',
            roundEnd:{},
            learnEnd:{},
            roundLen:'',           //在initPGB里面被初始化
            curRound:'',
            theme:{}
          }
      },
      created(){
          this.theme=theme[this.themeName].writeT;
          this.$nextTick(()=>{
            let pgEL=document.querySelector('.progress-pgb-bg');
            this.roundData.totalLen=pgEL.getTotalLength();
            this.pgData.totalLen=pgEL.getTotalLength();
          })
          this.fetchData(false);
      },
      methods:{
        initWrite(){
          this.writedLen=0;
          this.roundcards=[];
          this.cards=[];
          this.loading = true;
          this.roundData={
              offset:'',
              singleLen:'',
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
        initCards(data,isShuffle){
          let cards=[];

          let lastCard={};
          for (let i = 0; i <data.length; i++) {
            let writed=data[i].writed;

            if(writed){
              this.writedLen+=1;
              continue;
            }

            let term = decodeURIComponent(data[i].term).replace(/\n/g, "<br>");   //用\n替代<br>才能实现换行
            let definition = decodeURIComponent(data[i].definition).replace(/\n/g, "<br>");
            let maxdef = definition;
            let vid=data[i].vid;

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
          if(isShuffle){
            this.cards=_.shuffle(cards);
          }else {
            this.cards=cards;
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

          if(this.writedLen==totalSetLen) {     //表示全部writed
            this.learnEnd.visibility = true;
          }

          this.setPGB(this.pgData,totalSetLen,this.writedLen,true);
          let roundLen=parseInt(totalSetLen/7);
          if(parseInt(totalSetLen/7)!=totalSetLen/7){
            roundLen+=1;
          }

          this.roundLen=roundLen;
          if(roundLen==1){            //只有一轮,不必考虑roundEnd
            this.setPGB(this.roundData,totalSetLen,this.writedLen,false);
          }else if(roundLen>=2){
            let curRound=parseInt(this.writedLen/7);
            if(parseInt(this.writedLen/7)!=this.writedLen/7||this.writedLen==0){
              curRound+=1;
            }
            this.curRound=curRound;

            if(curRound==roundLen){         //最后一轮,不必考虑roundEnd
              let roundCardsLen=totalSetLen%7;
              let curRoundIndex=roundCardsLen-(totalSetLen-this.writedLen);
              this.setPGB(this.roundData,totalSetLen%7,curRoundIndex,false);
            }else {     //中间轮，要考虑roundEnd
              if(this.writedLen%7==0&&this.writedLen!=0) {
                this.roundEnd.visibility = true;
                this.setPGB(this.roundData,7,7,false);
              }else {
                this.setPGB(this.roundData,7,this.writedLen%7,false);
              }
            }
          }
        },
        fetchData(isShuffle) {
          this.initWrite();
          let euname = this.getCookie("euname");
          let curSet = JSON.parse(this.getCookie('curSet'));
          let createTime = curSet.timeStamp;
          this.axios.get('/api/getCards', {
            params: {
              username: escape(euname),
              createTime: createTime
            }
          })
            .then((response) => {
              this.initCards(response.data,isShuffle);
              this.initPGB(response.data.length);
              if(!this.roundEnd.visibility){
                if(this.roundLen==1||this.curRound==this.roundLen){     //只有一轮或是最后一轮就把cards全部给roundcards
                  let cardsLen=this.cards.length;
                  for(let i=0;i<cardsLen;i++){
                    this.roundcards.push(this.cards.shift());
                  }
                }else {         //总轮数大于1并且是中间轮
                  let cardsLen=7-this.roundData.curIndex;
                  for(let i=0;i<cardsLen;i++){
                    this.roundcards.push(this.cards.shift());
                  }
                }
                if(!this.learnEnd.visibility){
                  this.roundcards[0].visibility=true;
                }
              }
              setTimeout(()=>{
                this.loading=false;
              },500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        updateWrite(vid,euname,index){
          this.axios.post('/api/updateWrite', {
            params: {
              vid:vid,
              euname:euname
            }
          }).then((response)=>{
            let nextIndex = index + 1;
            this.showNext(nextIndex);
          }).catch(function (error) {
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

          if(canUpdate){
            let vid=this.roundcards[index].vid;
            let euname = this.getCookie("euname");
            this.updateWrite(vid,euname,index);
            this.writedLen+=1;
            this.updatePGData();
          }else {           //不能update，就判断cards里面是否已经包含这个roundcard
            let isContain=false;
            for(let i=0;i<this.cards.length;i++){
              if(this.cards[i].vid==this.roundcards[index].vid){
                isContain=true;
                break;
              }
            }
            if(!isContain){
              this.cards.push(this.roundcards[index]);       //如果回答错误,就把这个卡片push到总卡片中,并且不更新它的writed
            }
          }

          this.updateRoundData();
          this.showNext(index+1);
        },
        showNext(nextIndex){
          if(this.writedLen==this.pgData.cardsLen){
            this.learnEnd.visibility=true;
            return;
          }

          if(this.roundData.curIndex==this.roundData.cardsLen){           //表示这轮结束
            this.roundEnd.visibility=true;
          }else {
            this.roundcards[nextIndex].visibility=true;
          }
        },
        startNextRound(){
          this.roundcards=[];
          this.curRound++;
          console.log(this.curRound);
          if(this.roundEnd.visibility){
            this.roundEnd.visibility=false;
            if(this.roundLen==1||this.curRound==this.roundLen){     //只有一轮或是最后一轮就把cards全部给roundcards
              let cardsLen=this.cards.length;
              for(let i=0;i<cardsLen;i++){
                this.roundcards.push(this.cards.shift());
              }
            }else {         //总轮数大于1并且是中间轮
              let cardsLen=7-this.roundData.curIndex;
              for(let i=0;i<cardsLen;i++){
                this.roundcards.push(this.cards.shift());
              }
            }
            this.setPGB(this.roundData,this.roundcards.length,0,false);
            this.roundcards[0].visibility=true;
          }
        },

        updateWrites(){
          let curSet = JSON.parse(this.getCookie('curSet'));
          let euname = this.getCookie("euname");
          this.axios.post('/api/updateWrites', {
            params: {
              createtime:curSet.timeStamp,
              euname:euname
            }
          }).then((response)=>{
            this.learnEnd.visibility=false;
            this.fetchData();
          }).catch(function (error) {
            console.log(error);
          });
        },
        shuffle(){
          this.fetchData(true);
          console.log('gg');
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
    font-size: 1.5rem;
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
