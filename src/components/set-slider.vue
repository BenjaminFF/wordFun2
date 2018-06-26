<template>
    <div class="set-slider">
      <div v-for="color in colors" :style="{backgroundColor:color}" class="item">
        {{color}}
      </div>
    </div>
</template>

<script>
    export default {
        name: "set-slider",
      data(){
          colors:""
      },
      created(){
        var colors=['#86E7B8','#A5D8FF','#0FA3B1','#E6E8E6',
          '#D81159','#86E7B8','#A5D8FF','#0FA3B1','#E6E8E6','#D81159'];
        this.colors=colors;
      }
    }
</script>

<style scoped>
  .set-slider{
    width: 30rem;
    height: 25rem;
    overflow: scroll;
  }
  .item{
    width: 90%;
    height: 4rem;
    margin-bottom: 1rem;
    box-shadow: 0px 0px 10px 1px lightgrey;
    border-radius: 3px;
  }
</style>
