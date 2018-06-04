<template>
    <div class="header">
      <p class="title"><a href="/">WordFun</a></p>
      <p style="position: absolute;right: 15em;font-size: 1.2em">Login | signup</p>
    </div>
</template>

<script>
    export default {
        name: "my-header"
    }
</script>

<style scoped>
  div,p,a{
    margin: 0;
    padding: 0;
  }
  .header{
    width: 80%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
    border-left: 1px solid lightgray;
    border-right: 1px solid lightgray;
    margin-left: 10%;
    margin-right: 10%;
    box-sizing: border-box;
  }
  .title{
    margin-left: 3em;
    font-size: 2.0em;
    font-family: "Arial";
  }
  .title a{
    color: black;
    text-decoration: none;
  }
</style>
