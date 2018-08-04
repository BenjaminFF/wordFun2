<template>
    <div class="list-item" :style="{backgroundColor:backgroundColor}">
      <div class="cardId">{{cardId}}</div>
      <div class="termText" v-html="termText" @click="sayTerm"></div>
      <div class="defText" v-html="defText" @click="sayDef"></div>
      <icon class="voice" name="voice" @click.native="sayAll()"></icon>
    </div>
</template>

<script>

    export default {
        name: "list-item",
      components: {},
      data(){
          return{
            backgroundColor:""
          }
      },
      created(){
        this.backgroundColor=this.randomColor(0.8);
      },
      methods:{
        sayTerm(){
          window.speechSynthesis.cancel();
          setTimeout(()=>{
            let utterThis = new window.SpeechSynthesisUtterance(this.termText);
            window.speechSynthesis.speak(utterThis);
          },1000);
        },
        sayDef(){
          window.speechSynthesis.cancel();
          setTimeout(()=>{
            let utterThis = new window.SpeechSynthesisUtterance(this.defText);
            window.speechSynthesis.speak(utterThis);
          },500);
        },
        sayAll(){
          window.speechSynthesis.cancel();
          setTimeout(()=>{
            let text=this.termText+this.defText;
            let utterThis = new window.SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterThis);
          },500);
        }
      },
      props:{
        cardId:{
          type:Number,
          required:true
        },
        termText:{
          type:String,
          required:true
        },
        defText:{
          type:String,
          required:true
        },
      }
    }
</script>

<style scoped>
  .list-item{
     display: flex;
     width: 80%;
     height: fit-content;
     position: relative;
     color: white;
     background-color: yellowgreen;
     align-items: center;
     padding: 1rem 2rem;
    box-sizing: border-box;
    border-radius: 2rem;
    box-shadow: 3px 3px 5px 1px rgb(211, 211, 211);
   }
  .cardId{
    position: absolute;
    left: 1rem;
    user-select: none;
  }
  .termText{
    cursor: pointer;
    width: 49%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0rem 1.5rem;
  }
  .defText{
    padding: 0rem 1.5rem;
    cursor: pointer;
    width: 49%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .voice{
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    right: 1rem;
    cursor: pointer;
  }
</style>
