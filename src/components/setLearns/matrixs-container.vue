<template>
  <div class="container">
    <div class="matrixs-container" v-if="!loading">
      <matrix :term="w.term" v-on:dismiss="dismiss(index)"  v-for="(w,index) in matrixs"
                     :key="index" v-if="w.showMatrix" :maxdef="w.maxdef"
                     :definition="w.definition" class="matrix">
    </matrix>
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
      </div>
    </div>
    <wait-dialog v-if="loading" :text="'F'" :color="'var(--seablue)'"></wait-dialog>
  </div>
</template>

<script>
    import Matrix from "./matrix";
    import WaitDialog from "../wait-dialog";
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
            sidebarBG:""
          }
      },
      created(){
          this.fetchData();
          this.sidebarBG=this.randomColor(0.1);
      },
      methods:{
        fetchData(){
          this.loading=true;
          let euname=this.getCookie("euname");
          let curSet=JSON.parse(this.getCookie('curSet'));
          this.title=this.limitLength(curSet.title,40,true);     //title字数过长，影响视觉
          this.subtitle=this.limitLength(curSet.subtitle,40,true);
          let createTime=curSet.timeStamp;
          this.axios.get('/api/getCards', {
            params: {
              username:escape(euname),
              createTime:createTime
            }
          })
            .then((response)=>{
              let matrixs=[];
              console.log(response.data);
              for(let i=0;i<response.data.length;i++){
                let term=decodeURIComponent(response.data[i].term).replace(/\n/g,"<br>");   //用\n替代<br>才能实现换行
                let definition=decodeURIComponent(response.data[i].definition).replace(/\n/g,"<br>");
                let maxdef=definition;
                if(this.checkLength(definition)>=100){
                  definition=definition.substring(0,180)+'...';
                }
                let matrix={
                  term:term,
                  definition:definition,
                  maxdef:maxdef,
                  showMatrix:false,
                  matrixed:response.data[i].matrixed
                }
                matrixs.push(matrix);
              }
              matrixs[0].showMatrix=true;
              this.matrixs=matrixs;

              this.curIndex=0;

              this.pgbSingleLen=this.pgbTotalLen/matrixs.length;
              this.dashOffset=this.pgbTotalLen-this.pgbSingleLen;
              this.pgbText=this.curIndex+1+'/'+matrixs.length;

              console.log(this.matrixs);
              setTimeout(()=>{
                this.loading=false;
              },500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        dismiss(index){
          this.matrixs[index].showMatrix=false;
          let nextIndex=index+1;
          this.showNext(index+1);
        },
        showNext(index){
          if(index!=this.matrixs.length){
            setTimeout(()=>{
              this.matrixs[index].showMatrix=true;
            },500);
            this.curIndex++;
            this.dashOffset-=this.pgbSingleLen;
            this.pgbText=this.curIndex+1+'/'+this.matrixs.length;
          }
        },
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
  }

  .pgb-container{
    width: 100%;
    height: 40%;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    border-radius: 10px;
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
</style>
