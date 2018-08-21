<template>
  <div class="container">
     <div class="content-container">
       <write v-for="card in cards" :maxdef="card.maxdef" class="write-container"
              :definition="card.definition" :term="card.term" v-if="card.visibility"></write>
     </div>
    <div class="sidebar">
      <div class="pgb-container" :style="{backgroundColor:sidebarBG}">
        <svg class="round-pgb" viewBox="0 0 160 80">
          <path d="M30 50 A50 50 0 1 1 130 50" class="round-pgb-bg"></path>
          <path d="M30 50 A50 50 0 1 1 130 50" class="round-pgb-path"></path>
          <text x="80" y="50" class="round-percentage">1/3</text>
          <text x="80" y="80" style="font-size: 0.8rem;text-anchor: middle;fill: var(--seablue)">{{$t('setLearn.write.round')}}</text>
        </svg>
        <svg class="total-pgb" viewBox="0 0 160 80">
          <path d="M30 50 A50 50 0 1 1 130 50" class="total-pgb-bg"></path>
          <path d="M30 50 A50 50 0 1 1 130 50" class="total-pgb-path"></path>
          <text x="80" y="50" class="round-percentage">1/3</text>
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
            cards:[]
          }
      },
      created(){
          this.sidebarBG=this.randomColor(0.1);
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
                let term = decodeURIComponent(response.data[i].term).replace(/\n/g, "<br>");   //用\n替代<br>才能实现换行
                let definition = decodeURIComponent(response.data[i].definition).replace(/\n/g, "<br>");
                let maxdef = definition;
                let writed=response.data[i].writed;
                if (this.checkLength(definition) >= 100) {
                  definition = definition.substring(0, 180) + '...';
                }
                let card = {
                  term: term,
                  definition: definition,
                  maxdef:maxdef,
                  writed:writed,
                  visibility:false
                }
                cards.push(card);
              }
              this.cards=cards;
              this.cards[0].visibility=true;
              setTimeout(() => {
                this.loading = false;
              }, 500);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
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
    stroke-width: 8px;
    stroke: lightgrey;
    stroke-linecap: round;
  }

  .round-pgb-path{
    fill: transparent;
    stroke-width: 8px;
    stroke: var(--seablue);
    stroke-linecap: round;
  }

  .round-percentage{
    text-anchor: middle;
    dominant-baseline: middle;
    fill: var(--seablue);
  }

  .total-pgb-bg{
    fill: transparent;
    stroke-width: 8px;
    stroke: lightgrey;
    stroke-linecap: round;
  }

  .total-pgb-path{
    fill: transparent;
    stroke-width: 8px;
    stroke: var(--seablue);
    stroke-linecap: round;
  }

  .total-pgb{
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
