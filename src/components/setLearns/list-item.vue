<template>
    <div class="list-item">
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

          }
      },
      created(){
      },
      methods:{
        sayTerm(){
          //window.speechSynthesis.cancel();
          if(responsiveVoice.isPlaying()){
            responsiveVoice.cancel();
          }
          responsiveVoice.speak(this.termText);
          setTimeout(()=>{
            /*let utterThis = new window.SpeechSynthesisUtterance(this.termText);
            window.speechSynthesis.speak(utterThis);*/

          },1000);
        },
        sayDef(){
          //window.speechSynthesis.cancel();
          if(responsiveVoice.isPlaying()){
            responsiveVoice.cancel();
          }
          responsiveVoice.speak(this.defText);
          setTimeout(()=>{
            /*let utterThis = new window.SpeechSynthesisUtterance(this.defText);
            window.speechSynthesis.speak(utterThis);*/
          },500);
        },
        sayAll(){
          /*window.speechSynthesis.cancel();
          setTimeout(()=>{
            let text=this.termText+this.defText;
            let utterThis = new window.SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterThis);
          },500);*/
          if(responsiveVoice.isPlaying()){
            responsiveVoice.cancel();
          }
          responsiveVoice.speak(this.termText+"     "+this.defText);
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
     background-color: yellowgreen;
     align-items: center;
     padding: 1rem 2rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
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
    word-break: break-word;
  }
  .defText{
    padding: 0rem 1.5rem;
    cursor: pointer;
    width: 49%;
    display: flex;
    justify-content: center;
    align-items: center;
    word-break: break-word;
  }
  .voice{
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    right: 1rem;
    cursor: pointer;
  }
</style>
