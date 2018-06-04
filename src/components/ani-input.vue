<template>
  <div class="container" :style="{height:fontSize*6+'rem'}">
    <div class="placeholder" :style="phStyle">{{title}}</div>
    <div contenteditable="true" class="input" :style="inputStyle" @focus="Focus" @blur="Blur"></div>
    <div class="ani-bb" :style="bbStyle"></div>
    <div class="hint" :style="hintStyle">{{hint}}</div>
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

            }
          }
      },
      created:function(){
        this.inputStyle={
          height:this.fontSize*1.5+'rem',
          paddingTop:this.fontSize*0.25+'rem',
          paddingBottom:this.fontSize*0.25+'rem',
          fontSize:this.fontSize+'rem',
        }
        this.phStyle={
          height:this.fontSize*1.5+'rem',
          paddingTop:this.fontSize*0.25+'rem',
          paddingBottom:this.fontSize*0.25+'rem',
          fontSize:this.fontSize+'rem',
          top:this.fontSize*2+'rem'
        }
        this.bbStyle={
          width:0,
          height:0,
          bottom:this.fontSize*2+'rem',
        }
        this.hintStyle={
          height:this.fontSize*1.5+'rem',
          paddingTop:this.fontSize*0.25+'rem',
          paddingBottom:this.fontSize*0.25+'rem',
          fontSize:this.fontSize*0.9+'rem',
        }
      },
      methods:{
        Focus() {
          this.phStyle.top = 0;
          this.phStyle.fontSize=this.fontSize*0.9+'rem';
          this.bbStyle.width='80%';
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
            type:String
          },
        fontSize:{
          type:Number,
          required:true
        },
        bbColor:{
            type:String
        }
      },
    }
</script>

<style scoped>
  div,p,input{
    margin: 0;
    padding: 0;
  }
  .container{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    position: relative;
    justify-content: center;
  }

  .input{
    width: 80%;
    font-size: medium;
    height: fit-content;
    outline: none;
    border-bottom: 1px solid lightgray;
    z-index: 10;
  }

  .hint{
    width: 80%;
    position: absolute;
    bottom: 0;
  }

  .placeholder{
    width: 80%;
    display: flex;
    align-items: center;
    position: absolute;
    color: gray;
    transition: all 0.5s ease-in-out;
  }

  .ani-bb{
    position: absolute;
    transition: all 0.5s ease-in-out;
    border-bottom: 3px solid dodgerblue;
    left: 10%;
    z-index: 10;
    margin-bottom: -1px;
  }
</style>
