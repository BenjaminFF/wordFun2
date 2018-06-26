<template>
  <div class="sidebar">
      <div class="item" v-for="item in items">
        <p :class="{active:item.selected}" class="itemtitle">{{$t("sidebar["+item.index+"]")}}</p>
      </div>
  </div>
</template>

<script>
    export default {
        name: "my-sidebar",
      data(){
          return{
            items:[],
          }
      },
      created(){
          for(let i=0;i<4;i++){
            this.items[i]={
              index:i,
              selected:false,
            }
          }
          this.items[0].selected=true;
      }
    }
</script>

<style scoped>
  .sidebar{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    user-select: none;
  }
  .item{
    width: 100%;
    height: 3.2rem;
    display: flex;
    align-items: center;
  }
  .itemtitle{
    font-size: 1.5rem;
    color: var(--lightblue);
  }
  .itemtitle:hover{
    cursor: pointer;
    color: var(--seablue);
  }
  .active{
    color: var(--seablue);
  }
</style>
