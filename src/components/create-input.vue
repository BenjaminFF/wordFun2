<template>
    <div class="create-input" :style="pStyle" @mouseover="showDel=true" @mouseleave="showDel=false">
      <div class="term" contenteditable="true" v-on="inputListener" :style="{borderBottom:termBB}"></div>
      <div class="definition" contenteditable="true" v-on="inputListener" :style="{borderBottom:defBB}"></div>
      <icon name="delete" class="delete animated bounceIn" v-if="showDel" @click.native="$emit('delete')"></icon>
    </div>
</template>

<script>
    export default {
        name: "create-input",
      data(){
          return{
            pStyle:[],
            termLT:"",
            defLT:"",
            showDel:false,
            termBB:"1px solid white",
            defBB:"1px solid white"
          }
      },
      props:{
          termText:{
            required:true
          },
          defText:{
            required:true
          },
          termBorder:{
            type:String,
            default:'white 1px solid'
          },
          defBorder:{
            type:String,
            default:'white 1px solid'
          }
      },
      watch:{
          termLT:function (newval) {
            console.info(newval);
            this.$emit('update:termText', newval);
          },
          defLT:function (newval) {
            console.info(newval);
            this.$emit('update:defText', newval);
          },
        termBorder:function () {
          this.termBB=this.termBorder;
        },
        defBorder:function () {
          this.defBB=this.defBorder;
        },
      },
      created(){
          this.pStyle={
            backgroundColor:this.randomColor(0.6),
          }
      },
      computed:{
        inputListener(){
          var vm=this;
          return Object.assign({},
            this.$listeners,
            {
              input:function (event) {
                if(event.target.className=='term'){
                  vm.$emit('update:termText',event.target.innerHTML);
                }else if(event.target.className=='definition'){
                  vm.$emit('update:defText',event.target.innerHTML);
                }
              },
            }
          )
        }
      },
      methods:{
          randomColor(opacity){
            var r=Math.round(Math.random()*256);
            var g=Math.round(Math.random()*256);
            var b=Math.round(Math.random()*256);
            var a=opacity;
            if(r>=200&&g>=200&&b>=200){
              r-=50;
            }
            return 'rgba('+r+','+g+','+b+','+a+')';
          },
        input1(event){
          this.termLT=event.target.innerHTML;
          console.info(this.termLT);
        },
      }
    }
</script>

<style scoped>
  .create-input{
    height: fit-content;
    display: flex;
    align-items: center;
    padding: 1.5rem 2.5rem;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
  }
  .term{
    width: 48%;
    height: fit-content;
    color: white;
    outline: none;
  }
  .definition{
    width: 48%;
    height: fit-content;
    color: white;
    outline: none;
  }
  .delete{
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    right: 0.8rem;
    color: white;
  }
  .delete:hover{
    color: var(--seablue);
    cursor: pointer;
  }
</style>
