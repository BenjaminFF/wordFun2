<template>
    <div class="card-slider">
      <button class="testb" @click="move">sdf</button>
      <transition-group name="slide-fade" v-on:after-leave="afterLeave"
                        leave-active-class="animated rollOut" enter-active-class="animated rollIn">
        <div class="item-content" v-for="item in items" :style="item.style"
             v-if="item.isShowing" :key="item">
            <div class="term">{{item.term}}</div>
            <div class="definition">{{item.definition}}</div>
        </div>
      </transition-group>
    </div>
</template>

<script>
    export default {
        name: "card-slider",
      data(){
          return{
            items:[],
            pointer:0
          }
      },
      created(){
          var colors=['#86E7B8','#A5D8FF','#0FA3B1','#E6E8E6','#D81159'];
          for(var i=0;i<5;i++){
            var term='palm'+i;
            var definition="the inside surface of your hand, in which you hold things";
            var item={
              term:term,
              definition:definition,
              isShowing:false,
              style:{
                backgroundColor:colors[i]
              }
            }
            this.items.push(item);
          }
          this.items[0].isShowing=true;
      },
      methods:{
          move(){
            this.items[this.pointer++].isShowing=false;
          },
          afterLeave(){
            this.items[this.pointer].isShowing=true;
          }
      }
    }
</script>

<style scoped lang="scss">
  @import  '../../node_modules/animate.css/animate.css';
  .card-slider{
    width: 40rem;
    height: 20rem;
    position: relative;
  }
  .item-content{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.5s linear;
    box-shadow: 0px 0px 10px 1px lightgrey;
    border-radius: 3px;
  }
  .term{
    flex: 1 0 0;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  .definition{
    flex: 2 0 0;
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  .testb{
    position: absolute;
    z-index: 1000;
    width: 50px;
    height: 20px;
    bottom: 0;
    transform: translateX(500%);
  }

  .slide-fade-enter-active {
    transition: 0.1s;
  }
  .slide-fade-leave-active {
  }
  .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform:translateX(10%);
    opacity: 0;
  }
  .slide-fade-enter{
    opacity: 0;
  }
</style>
