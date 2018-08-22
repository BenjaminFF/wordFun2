<template>
    <div class="container" :style="{backgroundColor:bg}">
      <div class="definition" v-html="definition" @click="showMaxDef=true"></div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="wrong-hint" style="color:red" v-if="showWrongHint">
          <div style="width: 100%;height: 50%;word-break: break-all">{{$t('setLearn.write.ya')+limitLength(twInput.value,50,true)}}</div>
          <div style="width: 100%;height: 50%">{{$t('setLearn.write.ra')+term}}</div>
        </div>
      </transition>
      <div class="term-write">
        <div class="tw-input-container">
          <input class="tw-input" @focus="twInputFocus" @keyup.enter="checkAnswer"
                 v-model="twInput.value" v-focus/>
          <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <icon name="enter" class="tw-input-icon" @click.native="checkAnswer"
                  v-if="twInput.isIconVisible"></icon>
          </transition>
          <div class="tw-ani-bb" :style="{width:twInput.twBB}"></div>
        </div>
        <div class="term-write-hint">{{$t('setLearn.write.typeAnswer')}}</div>
      </div>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="maxdef" v-if="showMaxDef" @click="showMaxDef=false" v-html="maxdef"></div>
      </transition>
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
              value:""
            },
            bg:"",
            showMaxDef:false,
            showWrongHint:false
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
            if(this.twInput.value==this.term){
              this.$emit('dismiss');
            }else if(!this.showWrongHint) {
              this.showWrongHint = true;
              setTimeout(()=>{
                this.showWrongHint = false;
              },3000);
            }
            console.log('gg');
          }
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
        }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    padding: 3rem 2rem;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 3px rgb(211, 211, 211);
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    color: var(--seablue);
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
    border-bottom: 3px solid lightgrey;
  }
  .tw-input{
    outline: none;
    border: none;
    width: 90%;
    height: 100%;
    word-break: break-word;
    background-color: transparent;
    font-size: 1.5rem;
    z-index: 10;
    color: seagreen;
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
    border-bottom: 3px solid var(--seablue);
    transition: 1s all ease-in-out;
    transition-delay: .2s;
  }

  .term-write-hint{
    width: 100%;
    height: 2rem;
    font-size: 1rem;
    margin-top: 0.1rem;
  }

  .maxdef{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.71);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 20rem;
    padding-right: 20rem;
    box-sizing: border-box;
    font-size: 2rem;
    color: yellowgreen;
    user-select: none;
    z-index: 100;
    word-break: break-word;
  }
</style>
