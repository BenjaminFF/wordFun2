<template>
    <div class="container">
      <div class="both">
        <div class="term" v-html="termText"></div>
        <div class="def" v-html="defText"></div>
      </div>
      <div class="single" v-if="false">
        <div class="stage">
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "flashcard",
      data(){
          return{
        }
      },
      created(){
      },
      props:{
          termText:{
            type:String,
            required:true
          },
          defText:{
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
    position: absolute;
    transition: all 0.8s ease-in-out;
  }
  .both{
    width: 100%;
    height: 100%;
    color: white;
  }
  .term{
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
  }
  .def{
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
