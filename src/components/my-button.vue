<template>
    <div class="my-button" :style="bStyle">
      <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "my-button",
      data(){
          return{
            bStyle:{

            }
          }
      },
      props:{
          fontSize:{
            type:Number,
            required:true
          }
      },
      created(){
          this.bStyle={
            fontSize:this.fontSize+'rem',
            paddingTop:this.fontSize*0.5+'rem',
            paddingBottom:this.fontSize*0.5+'rem'
          }
      }
    }
</script>

<style scoped>
  div{
    padding: 0;
    margin: 0;
  }
  .my-button{
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease-in-out;
    color: white;
    background-color: dodgerblue;
    width: 100%;
    height: fit-content;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-smoothing: antialiased;
    box-shadow: 1px 1px 5px lightgray;
  }
  .my-button:hover{
    background-color: yellowgreen;
    cursor: pointer;
  }
</style>
