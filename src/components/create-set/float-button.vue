<template>
    <div class="float-button" :style="{width:mWidth+'rem',height:mHeight+'rem'}" v-on="Listener">
      <icon :name="iconname" class="icon"
            :style="{width:mWidth/2+'rem',height:mHeight/2+'rem'}"></icon>
    </div>
</template>

<script>
    export default {
        name: "float-button",
      data(){
        return{
            mWidth:"",mHeight:""
        }
      },
      created(){
          let width,height;
          if(this.size=='small'){
            width=height=2;
          }else if(this.size=='middle'){
            width=height=3;
          }else {
            width=height=3.5;
          }
          this.mWidth=width;
          this.mHeight=height;
      },
      computed:{
        Listener(){
          var vm=this;
          return Object.assign({},
            this.$listeners
          )
        }
      },
      props:{
          iconname:{
            required:true,
            type:String
          },
        size:{
            required:true,
          type:String,
          validator: function (value) {
            // 这个值必须匹配下列字符串中的一个
            return ['small', 'middle', 'large'].indexOf(value) !== -1
          }
        }
      }
    }
</script>

<style scoped>
  .float-button{
    width:3rem;
    height: 3rem;
    border-radius: 3rem;
    background-color: var(--maximumblue);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon{
    color: white;
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
