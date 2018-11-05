<template>
    <div class="container">
      <div class="inner-container" :style="{color:textColor}">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div class="both" v-if="!hideDef" :style="{backgroundColor:backGround}">
            <div class="term" v-html="termText" :style="{'border-bottom':'1px solid '+middleLineColor}" @click="showMaxTerm=true"></div>
            <div class="def" v-html="defText" @click="showMaxDef=true"></div>
          </div>
        </transition>
          <div class="single" v-if="hideDef" @click="showMaxDialog">
            <div class="term" v-html="termText" :style="{transform:'rotateX('+sTermDeg+'deg)',backgroundColor:backGround}"></div>
            <div class="def" v-html="defText" :style="{transform:'rotateX('+sDefDeg+'deg)',backgroundColor:backGround}"></div>
          </div>
      </div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut ">
        <div class="max-text-dialog" v-if="showMaxDef" @click="showMaxDef=false" v-html="maxdef"></div>
      </transition>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut ">
        <div class="max-text-dialog" v-if="showMaxTerm" @click="showMaxTerm=false" v-html="maxterm"></div>
      </transition>
    </div>
</template>

<script>
    export default {
        name: "flashcard",
      data(){
          return{
            sTermDeg:"",
            sDefDeg:"",
            showMaxDef:false,
            showMaxTerm:false,
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
        maxterm:{
          type:String,
          required:true
        },
          maxdef:{
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
          },
          textColor:{
            type:String,
            required:true
          },
          middleLineColor:{
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
        },
        showMaxDialog(){
          if(this.sDefDeg==360){
            this.showMaxDef=true;
          }else {
            this.showMaxTerm=true;
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
    border-radius: 10px;
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
    cursor: pointer;
  }
  .both .def{
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    word-break: break-word;
    cursor: pointer;
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
    border-radius: 10px;
    background-color: transparent;
    cursor: pointer;
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
    box-sizing: border-box;
    padding: 2rem;
    word-break: break-all;
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
    word-break: break-all;
  }

  .max-text-dialog{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 20rem;
    padding-right: 20rem;
    box-sizing: border-box;
    font-size: 2rem;
    color: gold;
    user-select: none;
    word-break: break-all;
    z-index: 1000;
  }
</style>
