<template>
  <div class="sidebar">
      <div class="item" v-for="item in items">
        <router-link v-bind:to="item.link" :class="{active:item.selected}" class="itemtitle" @click.native="selected(item)">{{$t("sidebar["+item.index+"]")}}</router-link>
      </div>
  </div>
</template>

<script>
  import $ from 'jquery';
    export default {
        name: "my-sidebar",
      data(){
          return{
            items:[],
          }
      },
      created(){
          let link=['/latestlearn','/wordset','/wordgame','/helpcenter'];
          for(let i=0;i<4;i++){
            let item={
              index:i,
              selected:false,
              link:link[i]
            }
            this.items.push(item);
          }
          this.items[0].selected=true;
      },
      methods:{
          selected(item){
            if(item.selected){
              return;
            }else {
              for(let i=0;i<4;i++){
                if(this.items[i].selected){
                  this.items[i].selected=false;
                  break;
                }
              }
              item.selected=true;
            }
          }
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
    text-decoration: none;
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
