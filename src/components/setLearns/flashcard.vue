<template>
    <div class="container">
      <div class="inner-container">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div class="both" v-if="!hideDef" :style="{backgroundColor:backGround}">
            <div class="term" v-html="termText"></div>
            <div class="def" v-html="defText"></div>
          </div>
        </transition>
          <div class="single" v-if="hideDef">
            <div class="term" v-html="termText" :style="{transform:'rotateX('+sTermDeg+'deg)',backgroundColor:backGround}"></div>
            <div class="def" v-html="defText" :style="{transform:'rotateX('+sDefDeg+'deg)',backgroundColor:backGround}"></div>
          </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "flashcard",
      data(){
          return{
            sTermDeg:"",
            sDefDeg:""
        }
      },
      created(){
          this.sTermDeg=0;
          this.sDefDeg=180;
      },
      props:{
          termText:{
            type:String,
            required:true
          },
          defText:{
            type:String,
            required:true
          },
          hideDef:{
            type:Boolean,
            default:false
          },
          backGround:{
            type:String,
            required:true
          },
          visibility:{
            type:String,
            required:true
          }
      },
      methods:{
          turnCard(){
            console.log('turnCard');
            if(this.sTermDeg==0){
              this.sTermDeg=180;
              this.sDefDeg=360;
            }else {
              this.sTermDeg=0;
              this.sDefDeg=180;
            }
          }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 1s ease-in-out all;
    user-select: none;
  }
  .inner-container{
    width: 75%;
    height: 75%;
    background-color: transparent;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .both{
    width: 100%;
    height: 100%;
    color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    user-select: contain;
    box-sizing: border-box;
    padding: 1.5rem;
  }
  .both .term{
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    word-break: break-word;
    border-bottom: 1px solid white;
  }
  .both .def{
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    word-break: break-word;
  }

  .single{
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    perspective: 1200px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: white;
    border-radius: 10px;
    background-color: transparent;
  }

  .single .term{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in .7s;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    box-sizing: border-box;
    padding: 2rem;
  }

  .single .def{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in .7s;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 2rem;
  }
</style>
