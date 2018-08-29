<template>
  <div class="write-out-container" tabindex="-1" @keyup="startNextRound">
     <div class="content-container">
       <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
         <write v-for="(card,index) in roundcards" class="write-container" v-if="card.visibility"
                :key="index" v-on:dismiss="dismiss($event,index)"
                :definition="card.definition" :term="card.term" :maxdef="card.maxdef"></write>
       </transition-group>
       <div class="roundEnd" v-if="roundEnd.visibility" :style="{backgroundColor:sidebarBG}">
       <div class="roundEnd-header">很赞，再接再厉！</div>
       <div class="roundEnd-button">{{$t('setLearn.write.continue')}}</div>
     </div>
       <div class="learnEnd" v-if="learnEnd.visibility" :style="{backgroundColor:learnEnd.bg}">
         <div class="learnEnd-header">{{$t('setLearn.write.learnEnd')}}</div>
         <div class="learnEnd-button">{{$t('setLearn.write.reLearn')}}</div>
       </div>
     </div>
    <div class="sidebar">
      <div class="pgb-container" :style="{backgroundColor:sidebarBG}">
        <svg class="round-pgb" viewBox="0 0 160 80">
          <path d="M30 50 A50 50 0 1 1 130 50" class="round-pgb-bg"></path>
          <path d="M30 50 A50 50 0 1 1 130 50" class="round-pgb-path"
                :style="{'stroke-dasharray':roundData.totalLen,'stroke-dashoffset':roundData.offset}"></path>
          <text x="80" y="50" class="round-percentage">{{roundData.percentage}}</text>
          <text x="80" y="80" style="font-size: 0.8rem;text-anchor: middle;fill: var(--seablue)">{{$t('setLearn.write.round')}}</text>
        </svg>
        <svg class="progress-pgb" viewBox="0 0 160 80">
          <path d="M30 50 A50 50 0 1 1 130 50" class="progress-pgb-bg"></path>
          <path d="M30 50 A50 50 0 1 1 130 50" class="progress-pgb-path"
                :style="{'stroke-dasharray':pgData.totalLen,'stroke-dashoffset':pgData.offset}"></path>
          <text x="80" y="50" class="round-percentage">{{pgData.percentage}}</text>
          <text x="80" y="80" style="font-size: 0.8rem;text-anchor: middle;fill: var(--seablue)">{{$t('setLearn.write.progress')}}</text>
        </svg>
      </div>
      <div class="fc-side-item" :style="{backgroundColor:sidebarBG}">
        <icon name="shuffle" class="fc-play-icon"></icon>
        {{$t('setLearn.matrix.startOver')}}
      </div>
      <div class="fc-side-item" :style="{backgroundColor:sidebarBG}">
        <icon name="shuffle" class="fc-play-icon"></icon>
        {{$t('setLearn.matrix.shuffle')}}
      </div>
    </div>
    <wait-dialog v-if="loading" :text="'W'" :color="'var(--seablue)'"></wait-dialog>
  </div>
</template>

<script>
    import Write from "./write";
    import WaitDialog from "../wait-dialog";
    export default {
        name: "write-container",
      components: {WaitDialog, Write},
      data(){
          return{
            sidebarBG:"",
            loading:true,
            cards:[],
            roundcards:[],            //单轮卡片
            roundData:{
              totalLen:'',
              offset:'',
              singlen:'',
              percentage:'',
              curIndex:'',
              cardsLen:''
            },
            pgData:{                //progressData
              totalLen:'',
              offset:'',
              singlen:'',
              percentage:'',
              curIndex:'',
              cardsLen:'',
              roundLen:''
            },
            writedLen:0,
            roundEnd:{
              visibility:false,
              bg:''
            },
            learnEnd:{
              visibility:false
            }
          }
      },
      created(){
          this.sidebarBG=this.randomColor(0.1);
          this.learnEnd.bg=this.randomColor(0.2);
          this.$nextTick(()=>{
            let pgEL=document.querySelector('.progress-pgb-bg');
            this.roundData.totalLen=pgEL.getTotalLength();
            this.pgData.totalLen=pgEL.getTotalLength();
          })
          this.fetchData();
      },
      methods:{
        fetchData() {
          this.roundcards=[];
          this.cards=[];
          this.loading = true;
          let euname = this.getCookie("euname");
          let curSet = JSON.parse(this.getCookie('curSet'));
          this.title = this.limitLength(curSet.title, 40, true);     //title字数过长，影响视觉
          this.subtitle = this.limitLength(curSet.subtitle, 40, true);
          let createTime = curSet.timeStamp;
          this.axios.get('/api/getCards', {
            params: {
              username: escape(euname),
              createTime: createTime
            }
          })
            .then((response) => {
              let cards=[];
              for (let i = 0; i < response.data.length; i++) {
                let writed=response.data[i].writed;

                if(writed){
                  this.writedLen+=1;
                  continue;
                }

                let term = decodeURIComponent(response.data[i].term).replace(/\n/g, "<br>");   //用\n替代<br>才能实现换行
                let definition = decodeURIComponent(response.data[i].definition).replace(/\n/g, "<br>");
                let maxdef = definition;
                let vid=response.data[i].vid;

                if (this.checkLength(definition) >= 160) {
                  let chineseLen=this.checkChinese(definition);
                  if(chineseLen>=100){
                    chineseLen+=55;
                  }
                  definition = definition.substring(0, 160-Math.round(chineseLen/2)) + '...';
                  console.log(definition.length);
                }
                let card = {
                  vid:vid,
                  term: term,
                  definition: definition,
                  maxdef:maxdef,
                  writed:writed,
                  visibility:false
                }
                cards.push(card);
              }
              this.cards=cards;         //除去了writed的

              let totalSetLen=response.data.length;

              if(totalSetLen>=8){
                this.pgData.roundLen=parseInt(totalSetLen/7);
                if(parseInt(totalSetLen/7)<totalSetLen/7){
                  this.pgData.roundLen+=1;
                }
                this.pgData.curIndex=parseInt(this.writedLen/7);

                if(this.cards.length>7){
                  for(let i=0;i<7;i++){
                    this.roundcards.push(this.cards.shift());
                  }
                  this.roundData.curIndex=0;
                  this.roundData.cardsLen=7;
                }else if(this.cards.length!=0){
                  for(let i=0;i<this.cards.length;i++){
                    this.roundcards.push(this.cards.shift());
                  }
                  this.roundData.curIndex=0;
                  this.roundData.cardsLen=this.cards.length;
                }else {            //如果this.cards.length==0,表示已经完成所有内容
                  if(parseInt(this.writedLen/7)<this.writedLen/7){
                    this.pgData.curIndex+=1;
                  }
                  this.roundData.cardsLen=totalSetLen%7;
                  this.roundData.curIndex=totalSetLen%7;
                }
                this.roundData.percentage=this.roundData.curIndex+'/'+this.roundData.cardsLen;
                this.roundData.singlen=this.roundData.totalLen/this.roundData.cardsLen;
                this.roundData.offset=this.roundData.totalLen;

                this.pgData.percentage=this.pgData.curIndex+'/'+this.pgData.roundLen;

              }else {
                this.roundcards=this.cards;
                this.cards=[];
                this.roundData.singlen=this.roundData.totalLen/totalSetLen;
                this.roundData.offset=this.roundData.totalLen-this.writedLen*this.roundData.singlen;

                this.roundData.curIndex=this.writedLen;
                this.roundData.percentage=this.roundData.curIndex+'/'+totalSetLen;
                this.roundData.cardsLen=totalSetLen;

                this.pgData.singlen=this.pgData.totalLen;
                this.pgData.offset=this.pgData.totalLen;
                if(this.roundData.curIndex==totalSetLen){         //如果当前卡片已经没有了，就体现结束
                  this.pgData.percentage='1/1';
                  this.learnEnd.visibility=true;
                  this.pgData.offset-=this.pgData.singlen;
                }else {
                  this.pgData.percentage='0/1';
                  this.pgData.curIndex=0;
                  this.pgData.cardsLen=1;
                  this.roundcards[0].visibility=true;
                }
              }
              setTimeout(() => {
                this.loading = false;
              }, 500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        dismiss(isAnswerWrong,index){
          this.roundcards[index].visibility=false;
          let vid=this.roundcards[index].vid;

          if(!isAnswerWrong){
            this.updateWrite(vid,index);
          }else {
            let isContain=false;
            for(let i=0;i<this.cards.length;i++){
              if(this.cards[i]===this.roundcards[index]){
                isContain=true;
                break;
              }
            }
            if(!isContain){
              this.cards.push(this.roundcards[index]);       //如果回答错误,就把这个卡片push到总卡片中,并且不更新它的writed
            }
            this.showNext(index+1);
          }
        },
        updateWrite(vid,index){
          this.axios.post('/api/updateWrite', {
            params: {
              vid:vid
            }
          }).then((response)=>{
            let nextIndex = index + 1;
            this.showNext(nextIndex);
          }).catch(function (error) {
            console.log(error);
          });
        },
        showNext(nextIndex){
          if(nextIndex!=this.roundcards.length){      //这里是判断roundcards是否为空，注意，roundcards是除去了writed card的
            setTimeout(() => {
              this.roundcards[nextIndex].visibility=true;
            }, 500);
          }else {
            if(this.cards.length==0){        //总卡片里面没有卡片，就代表整个结束
              this.learnEnd.visibility=true;
              this.pgData.offset-=this.pgData.singlen;
              this.pgData.curIndex++;
              this.pgData.percentage=this.pgData.curIndex+'/'+this.pgData.cardsLen;
            }else {                          //有卡片，就将剩余卡片推给下一轮
              this.pgData.curIndex=0;
              this.roundEnd.visibility=true;
              this.roundcards=[];
              if(this.cards.length<8){
                this.roundcards=this.cards;
                this.cards=[];
              }else {
                for(let i=0;i<7;i++){
                  this.roundcards.push(this.cards.shift());
                }
              }

              let el=document.getElementsByClassName('write-out-container');
              el[0].focus();
            }
          }
          this.roundData.curIndex++;
          this.roundData.offset-=this.roundData.singlen;
          this.roundData.percentage=this.roundData.curIndex+'/'+this.roundData.cardsLen;
        },
        startNextRound(){
          if(this.roundEnd.visibility){
            this.roundEnd.visibility=false;
            this.roundcards[0].visibility=true;
          }
        }
      },

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
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
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
    background-color: var(--seablue);
    color: white;
    border-radius: 10px;
    margin-top: 50%;
  }

  .roundEnd-button:hover{
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    cursor: pointer;
  }

  .learnEnd{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
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
    background-color: var(--seablue);
    color: white;
    border-radius: 10px;
    margin-top: 50%;
  }

  .learnEnd-button:hover{
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
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
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
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
    stroke: lightgrey;
    stroke-linecap: round;
  }

  .round-pgb-path{
    fill: transparent;
    stroke-width: 6px;
    stroke: var(--seablue);
    stroke-linecap: round;
    transition: all .5s ease-in;
  }

  .round-percentage{
    text-anchor: middle;
    dominant-baseline: middle;
    fill: var(--seablue);
  }

  .progress-pgb-bg{
    fill: transparent;
    stroke-width: 6px;
    stroke: lightgrey;
    stroke-linecap: round;
  }

  .progress-pgb-path{
    fill: transparent;
    stroke-width: 6px;
    stroke: var(--seablue);
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
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: var(--seablue);
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
