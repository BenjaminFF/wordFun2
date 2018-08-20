<template>
  <div class="container">
    <div class="matrixs-container" v-if="!loading">
      <matrix :term="m.term" v-on:dismiss="dismiss(index)"  v-for="(m,index) in matrixs"
                     :key="index" v-if="m.showMatrix" :maxdef="m.maxdef"
                     :definition="m.definition" class="matrix">
    </matrix>
      <div class="learn-end" v-if="isLearnEnd" :style="{backgroundColor:endBG}">
        <div class="header" v-html="$t('setLearn.matrix.endHeader')">
        </div>
        <div class="content">
          <div class="button" @click="relearn">{{$t('setLearn.matrix.startOver')+'!'}}</div>
        </div>
      </div>
    </div>
    <div class="sidebar"  v-if="!loading">
      <div class="sidebar-inner-container">
        <div class="pgb-container" :style="{backgroundColor:sidebarBG}">
          <svg class="progressbar" viewBox="0 0 1500 1500">
            <circle r="500" cx="750" cy="750" class="bg-circle" ></circle>
            <circle r="500" cx="750" cy="750" class="pgb-circle" :style="{'stroke-dashoffset':dashOffset}"></circle>
            <text x="750" y="750" class="pgbText">{{pgbText}}</text>
          </svg>
        </div>
        <div class="fc-side-item" :style="{backgroundColor:sidebarBG}" @click="relearn(false)">
          <icon name="shuffle" class="fc-play-icon"></icon>
          {{$t('setLearn.matrix.startOver')}}
        </div>
        <div class="fc-side-item" :style="{backgroundColor:sidebarBG}" @click="shuffle">
          <icon name="shuffle" class="fc-play-icon"></icon>
          {{$t('setLearn.matrix.shuffle')}}
        </div>
      </div>
    </div>
    <wait-dialog v-if="loading" :text="'F'" :color="'var(--seablue)'"></wait-dialog>
  </div>
</template>

<script>
    import Matrix from "./matrix";
    import WaitDialog from "../wait-dialog";
    import _ from 'lodash'
    export default {
        name: "matrix-container",
      components: {WaitDialog, Matrix},
      data(){
          return{
            loading:true,
            matrixs:[],
            pgbTotalLen:3140,
            pgbSingleLen:"",
            dashOffset:"",
            pgbText:"",
            curIndex:"",
            sidebarBG:"",
            isLearnEnd:false,
            endBG:'',
            mLength:''
          }
      },
      created(){
          this.fetchData(false);
          this.sidebarBG=this.randomColor(0.1);
          this.endBG=this.randomColor(0.1);
      },
      methods: {
        fetchData(isShuffle) {
          this.matrixs=[];
          this.curIndex=0;
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
              let matrixs = [];

              this.mLength=response.data.length;
              this.pgbSingleLen = this.pgbTotalLen / response.data.length;
              this.dashOffset = this.pgbTotalLen;
              this.pgbText = this.curIndex + '/' + response.data.length;

              for (let i = 0; i < response.data.length; i++) {
                if(response.data[i].matrixed){
                  this.curIndex+=1;
                  this.dashOffset-=this.pgbSingleLen;
                  this.pgbText = this.curIndex + '/' + response.data.length;
                  continue;
                }
                let term = decodeURIComponent(response.data[i].term).replace(/\n/g, "<br>");   //用\n替代<br>才能实现换行
                let definition = decodeURIComponent(response.data[i].definition).replace(/\n/g, "<br>");
                let vid=response.data[i].vid;
                let maxdef = definition;
                if (this.checkLength(definition) >= 100) {
                  definition = definition.substring(0, 180) + '...';
                }
                let matrix = {
                  vid:vid,
                  term: term,
                  definition: definition,
                  maxdef: maxdef,
                  showMatrix: false,
                  matrixed: response.data[i].matrixed
                }
                matrixs.push(matrix);
              }
              if(matrixs.length!=0){
                if(isShuffle){
                  this.matrixs=_.shuffle(matrixs);
                }else {
                  this.matrixs = matrixs;
                }
                this.matrixs[0].showMatrix = true;
              }else {
                this.isLearnEnd=true;
              }
              setTimeout(() => {
                this.loading = false;
              }, 500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        dismiss(index) {
          this.matrixs[index].showMatrix = false;
          let vid=this.matrixs[index].vid;
          console.log(vid);
          this.updateMatrix(vid,index);
        },
        showNext(index) {
          if (index != this.matrixs.length) {
            setTimeout(() => {
              this.matrixs[index].showMatrix = true;
            }, 500);
            this.curIndex++;
            this.dashOffset -= this.pgbSingleLen;
            this.pgbText = this.curIndex + '/' + this.mLength;
          }else {
            setTimeout(() => {
              this.isLearnEnd = true;
            }, 500);
            this.curIndex++;
            this.dashOffset -= this.pgbSingleLen;
            this.pgbText = this.curIndex + '/' + this.mLength;
          }
        },
        updateMatrix(vid,index){
          this.axios.post('/api/updatematrix', {
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
        updateMatrixs(createtime,euname,isShuffle){
          this.axios.post('/api/updatematrixs', {
            params: {
              createtime:createtime,
              euname:euname
            }
          }).then((response)=>{
            this.fetchData(isShuffle);
          }).catch(function (error) {
            console.log(error);
          });
        },
        shuffle(){
          if(this.isLearnEnd){
            this.relearn(true);
          }else {
            this.fetchData(true);
          }
        },
        relearn(isShuffle){
          let euname = this.getCookie("euname");
          let curSet = JSON.parse(this.getCookie('curSet'));
          let createTime = curSet.timeStamp;
          this.updateMatrixs(createTime,euname,isShuffle);
          this.isLearnEnd=false;
        }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    position: relative;
  }
  .matrixs-container{
    width: 55%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .sidebar{
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .sidebar-inner-container{
    width: 100%;
    height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .pgb-container{
    width: 100%;
    height: 60%;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    border-radius: 10px;
    user-select: none;
  }

  .progressbar{
    width: 100%;
    height: 100%;
  }

  .pgb-circle{
    fill: transparent;
    stroke: var(--seablue);
    stroke-width: 100px;
    stroke-dasharray: 3140;
    transition: all 1s ease-in-out;
  }
  .pgbText{
    fill: var(--seablue);
    font-size: 200px;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .bg-circle{
    fill: transparent;
    stroke: lightgrey;
    stroke-width: 100px;
  }

  .matrix{
    position: absolute;
    left: 0;
  }

  .learn-end{
    position: absolute;
    left: 0;
    background-color: rgb(207, 0, 128);
    width: 100%;
    height: 85%;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    border-radius: 10px;
  }

  .learn-end .header{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40%;
    font-size: 2rem;
    text-align: center;
    color: var(--seablue);
  }

  .learn-end .content{
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .learn-end .content .button{
    user-select: none;
    width: 10rem;
    height: 4rem;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    letter-spacing: 0.2rem;
    color: white;
    background-color: var(--seablue);
  }

  .learn-end .content .button:hover{
    cursor: pointer;
    box-shadow: 0px 0px 10px 3px rgb(195, 195, 195);
  }

  .fc-side-item{
    width: 100%;
    height: 3rem;
    box-shadow: 0px 0px 10px 3px rgba(211, 211, 211, 0.76);
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
