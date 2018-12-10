<template>
    <div class="container">
      <div class="definition" v-html="definition" @click="showMaxDef=true" :style="{color:textColor}"></div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="wrong-hint" :style="{color:hintColor}" v-if="showWrongHint">
          <div style="width: 100%;height: 50%;word-break: break-all">{{$t('setLearn.write.ya')+limitLength(twInput.value,50,true)}}</div>
          <div style="width: 100%;height: 50%">{{$t('setLearn.write.ra')+term}}</div>
        </div>
      </transition>
      <div class="term-write">
        <div class="tw-input-container">
          <input class="tw-input" @focus="twInputFocus" @keyup.enter="checkAnswer" :style="{color:textColor}"
                 v-model="twInput.value" v-focus/>
          <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <icon name="enter" class="tw-input-icon" @click.native="checkAnswer"
                  v-if="twInput.isIconVisible" :style="{color:textColor}"></icon>
          </transition>
          <div class="tw-ani-bb" :style="{width:twInput.twBB,'border-bottom':'3px solid '+textColor}"></div>
        </div>
        <div class="term-write-hint" :style="{color:textColor}">{{$t('setLearn.write.typeAnswer')}}</div>
      </div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="maxdef" v-if="showMaxDef" @click="showMaxDef=false" v-html="maxdef"></div>
      </transition>
      <div class="noidea" @click="showAnswer" :style="{color:textColor}">
        <icon name="noidea" class="noidea-icon"></icon>
        {{$t('setLearn.write.noidea')}}
      </div>
      <icon class="voice" name="voice" @click.native="sayDef()" :style="{color:textColor}"></icon>
    </div>
</template>

<script>
    export default {
        name: "write",
      data(){
          return{
            twInput:{
              twBB:0,
              isIconVisible:false,
              value:"",
            },
            bg:"",
            showMaxDef:false,
            showWrongHint:false,
            canUpdate:false,                //如果第一次答案错误就不能update
          }
      },
      created(){
          this.bg=this.randomColor(0.1);
      },
      directives: {
        focus: {
          // directive definition
          inserted: function (el) {
            el.focus()
          }
        }
      },
      methods:{
          twInputFocus(){
            this.twInput.twBB='100%';
            this.twInput.isIconVisible=true;
          },
          checkAnswer(){
            if(this.twInput.value==this.term){           //如果从没有出现错误提示，canUpdate就为true
              if(!this.showWrongHint){
                this.canUpdate=true;
              }
              this.$emit('dismiss',this.canUpdate);
            }else if(this.twInput.value!=this.term){
              this.canUpdate=false;
              this.showWrongHint=true;
            }
          },
          showAnswer() {
              this.showWrongHint = true;
          },
        sayDef(){
          //window.speechSynthesis.cancel();
          if(responsiveVoice.isPlaying()){
            responsiveVoice.cancel();
          }
          responsiveVoice.speak(this.filterVoiceText(this.maxdef));
          /*setTimeout(()=>{
            let utterThis = new window.SpeechSynthesisUtterance(this.defText);
            window.speechSynthesis.speak(utterThis);
          },500);*/
        },
      },
      props:{
        term:{
          type:String,
          required:true
        },
        definition:{
          type:String,
          required:true
        },
        maxdef:{
          type:String,
          required:true
        },
        textColor:{
          type:String,
          required:true
        },
        hintColor:{
          type:String,
          required:true
        }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    padding: 3rem 3rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
  }
  .definition{
    width: 100%;
    height: 50%;
    word-break: break-all;
    font-size: 1.5rem;
    display: flex;
    cursor: pointer;
    transition: 1s all ease-in-out;
  }
  .wrong-hint{
    width: 100%;
    height: 30%;
  }
  .term-write{
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .tw-input-container{
    width: 100%;
    height: 2rem;
    position: relative;
    display: flex;
    align-items: center;
    padding-bottom: 0.2rem;
  }
  .tw-input{
    outline: none;
    border: none;
    width: 90%;
    height: 100%;
    word-break: break-word;
    background-color: transparent;
    font-family: inherit;
    font-size: 1.5rem;
    font-weight: lighter;
    z-index: 10;
  }

  .tw-input-icon{
    position: absolute;
    right: 0;
    width: 1.8rem;
    height: 1.8rem;
    cursor: pointer;
    z-index: 10;
  }

  .tw-ani-bb{
    position: absolute;
    width: 0%;
    height: 100%;
    left: 0;
    top: 0;
    transition: 1s all ease-in-out;
    transition-delay: .2s;
  }

  .term-write-hint{
    width: 100%;
    height: 2rem;
    font-size: 1rem;
    margin-top: 0.5rem;
  }

  .maxdef{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 20rem;
    padding-right: 20rem;
    box-sizing: border-box;
    font-size: 2rem;
    color: yellowgreen;
    user-select: none;
    z-index: 1000;
    word-break: break-word;
  }

  .noidea{
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.2rem;
  }
  .noidea-icon{
    right: 2rem;
    bottom: 3rem;
    width: 1rem;
    height: 1.2rem;
    cursor: pointer;
  }
  .voice{
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    right: 1rem;
    top: 1rem;
    cursor: pointer;
    color: white;
  }
</style>
