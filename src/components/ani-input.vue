<template>
  <div class="ani-input" :style="{height:fontSize*5.5+'rem'}">
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
          top:this.fontSize*2+'rem'
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
          top:this.fontSize*4+'rem',
        }
        this.hintStyle={
          height:this.fontSize*1.3+'rem',
          paddingTop:this.fontSize*0.1+'rem',
          paddingBottom:this.fontSize*0.1+'rem',
          fontSize:this.fontSize*0.9+'rem',
        }
      },
      methods:{
        Focus() {
          this.phStyle.top = 0;
          this.phStyle.fontSize=this.fontSize*0.9+'rem';
          this.bbStyle.width='100%';
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
    border-bottom: 1px solid lightgray;
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
    border-bottom: 3px solid dodgerblue;
    left: 0;
    z-index: 10;
  }
</style>
