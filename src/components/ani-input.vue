<template>
  <div class="ani-input" :style="{height:fontSize*5.5+'rem'}">
    <div class="placeholder" :style="phStyle">{{title}}</div>

      <div contenteditable="true" class="input" :style="inputStyle" @focus="Focus" @blur="Blur"
           v-bind="$attrs" v-on="inputListeners" :class="{security:security}"
      ></div>
      <icon name="tick" :style="imgStyle" class="tick" v-if="validate"></icon>
      <div class="ani-bb" :style="bbStyle"></div>

    <div class="hint" v-bind:style="hintStyle">{{hint.text}}</div>
  </div>
</template>

<script>
    export default {
        name: "ani-input",
      data(){
          return{
            inputStyle:{

            },
            phStyle:{

            },
            bbStyle:{

            },
            hintStyle:{

            },
            imgStyle:{

            }
          }
      },
      created:function(){
        let vm=this;
        this.inputStyle={
          height:vm.fontSize*1.5+'rem',
          paddingTop:vm.fontSize*0.25+'rem',
          paddingBottom:vm.fontSize*0.25+'rem',
          fontSize:vm.fontSize+'rem',
          top:vm.fontSize*2+'rem'
        }
        this.phStyle={
          height:vm.fontSize*1.5+'rem',
          paddingTop:vm.fontSize*0.25+'rem',
          paddingBottom:vm.fontSize*0.25+'rem',
          fontSize:vm.fontSize+'rem',
          top:vm.fontSize*2+'rem'
        }
        this.bbStyle={
          width:0,
          height:0,
          top:vm.fontSize*4+'rem',
        }
        this.hintStyle={
          height:vm.fontSize*1.5+'rem',
          paddingTop:vm.fontSize*0.5+'rem',
          paddingBottom:vm.fontSize*0.1+'rem',
          fontSize:vm.fontSize*0.8+'rem',
          color:vm.hint.color
        }
        this.imgStyle={
          width:vm.fontSize*1.5+'rem',
          height:vm.fontSize*1.5+'rem',
          paddingTop:vm.fontSize*0.25+'rem',
          paddingBottom:vm.fontSize*0.25+'rem',
          top:vm.fontSize*2+'rem',
        }
      },
      watch:{
          hint:function () {
            this.hintStyle.color=this.hint.color;
          }
      },
      computed:{
        inputListeners:function () {
          var vm=this;
          return Object.assign({},
            this.$listeners,
            {
              input:function (event) {
                vm.$emit('input',event);
              },
              keydown:function (event) {
                if(event.keyCode==13){
                  event.preventDefault();
                }
              }
            }
          )
        }
      },
      methods:{
        Focus() {
          this.phStyle.top = 0;
          this.phStyle.fontSize=this.fontSize*0.9+'rem';
          this.bbStyle.width='100%';
          this.phStyle.color='#0FA3B1';
        },
        Blur(){
          this.bbStyle.width=0;
        }
      },
      props:{
          title:{
            type:String,
            required:true
          },
          hint:{
            type:Object,
            default:function () {
              return {
                text:"",
                color:"red"
              }
            }
          },
          value:{
            type:String
          },
        fontSize:{
          type:Number,
          required:true
        },
        bbColor:{
            type:String
        },
        validate:{
            type:Boolean,
          default(){
              return false;
          }
        },
        security:{
            type:Boolean,
          default(){
              return false;
          }
        }
      },
    }
</script>

<style scoped>
  div,p,input{
    margin: 0;
    padding: 0;
    user-select: none;
  }
  .ani-input{
    width: 100%;
    position: relative;
    font-smoothing: antialiased;
  }

  .input{
    width: 100%;
    outline: none;
    z-index: 10;
    position: absolute;
    outline: none;
    border: 0px;
    border-bottom: 1px solid lightgray;
    color: #0FA3B1;
  }

  .hint{
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: flex-end;
  }

  .placeholder{
    width: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    color: gray;
    transition: all 0.5s ease-in-out;
  }

  .ani-bb{
    position: absolute;
    transition: all 0.5s ease-in-out;
    border-bottom: 3px solid #0FA3B1;
    left: 0;
    z-index: 10;
  }
  .tick{
    position: absolute;
    right: 0;
    color: dodgerblue;
    user-select: none;
  }
  .security{
    -webkit-text-security:disc;
  }
</style>
