<template>
  <div class="container">
     <div class="content-container">
       <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
         <write v-for="(card,index) in roundcards" v-on:dismiss="dismiss(index)"
                :maxdef="card.maxdef" class="write-container" :key="index"
                :definition="card.definition" :term="card.term" v-if="card.visibility"></write>
       </transition-group>
       <div class="roundEnd" v-if="roundEnd.visibility"></div>
       <div class="learnEnd" v-if="learnEnd.visibility"></div>
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
              cardsLen:''
            },
            writedLen:0,
            roundEnd:{
              visibility:false
            },
            learnEnd:{
              visibility:false
            }
          }
      },
      created(){
          this.sidebarBG=this.randomColor(0.1);
          this.$nextTick(()=>{
            let pgEL=document.querySelector('.progress-pgb-bg');
            this.roundData.totalLen=pgEL.getTotalLength();
            this.pgData.totalLen=pgEL.getTotalLength();
          })
          this.fetchData();
      },
      methods:{
        fetchData() {
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
              this.cards=cards;

              let totalSetLen=this.cards.length+this.writedLen;

              if(totalSetLen>=8){

              }else {
                this.pgData.singlen=this.pgData.totalLen;
                this.pgData.offset=this.pgData.totalLen;
                this.pgData.percentage='0/1';
                this.pgData.curIndex=0;
                this.pgData.cardsLen=1;

                this.roundcards=this.cards;
                this.roundData.singlen=this.roundData.totalLen/totalSetLen;
                this.roundData.offset=this.roundData.totalLen-this.writedLen*this.roundData.singlen;
                console.log(this.roundData.offset);
                this.roundData.curIndex=this.writedLen;
                this.roundData.percentage=this.roundData.curIndex+'/'+totalSetLen;
                this.roundData.cardsLen=this.roundcards.length;
              }
              this.roundcards[0].visibility=true;
              setTimeout(() => {
                this.loading = false;
              }, 500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        dismiss(index){
          this.roundcards[index].visibility=false;
          let vid=this.roundcards[index].vid;

          this.updateWrite(vid,index);
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
          if(nextIndex!=this.roundData.cardsLen){
            setTimeout(() => {
              this.roundcards[nextIndex].visibility=true;
            }, 500);
            this.roundData.curIndex++;
            this.roundData.offset-=this.roundData.singlen;
            this.roundData.percentage=this.roundData.curIndex+'/'+this.roundData.cardsLen;
          }
        }
      },

    }
</script>

<style scoped>
  .container{
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
    background-color: yellowgreen;
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
    stroke-width: 10px;
    stroke: lightgrey;
    stroke-linecap: round;
  }

  .round-pgb-path{
    fill: transparent;
    stroke-width: 10px;
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
    stroke-width: 10px;
    stroke: lightgrey;
    stroke-linecap: round;
  }

  .progress-pgb-path{
    fill: transparent;
    stroke-width: 10px;
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
