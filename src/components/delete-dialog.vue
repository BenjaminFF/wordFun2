<template>
  <div class="model">
    <div class="dialog animated bounceInDown">
      <div class="text">{{$t('deleteDialog.text')}}</div>
      <div class="buttons">
        <div class="cancel-button" @click="alterddState(false)">{{$t('deleteDialog.cancel')}}</div>
        <div class="delete-button" @click="deleteCurSet">{{$t('deleteDialog.delete')}}</div>
      </div>
      <icon name="cross" class="cross" @click.native="alterddState(false)"></icon>
    </div>
  </div>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
    export default {
        name: "delete-dialog",
      methods:{
        deleteCurSet(){
          console.log(this.curSet.title);
          let createTime=this.curSet.timeStamp;
          this.axios.post('/api/deleteSet',{
            params:{
              createTime:createTime
            }
          }).then((response)=>{
            console.log(response.data);
            this.alterddState(false);
            this.$emit('updateData',createTime);

          }).catch(function (error) {
            console.log(error);
          });
        },
        ...mapMutations({
          alterddState:'wordset/alterddState'
        }),
      },
      computed:{
        ...mapState({
          curSet:state=>state.wordset.curSet
        }),
      }
    }
</script>

<style scoped>
  .model{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .dialog{
    user-select: none;
    width: 23rem;
    height: 23rem;
    background-color: var(--seablue);
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  .text{
    flex: 5 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    font-size: 1.6rem;
    word-break: break-all;
    box-sizing: border-box;
    text-indent: 2rem;
    letter-spacing: 3px;
    color: white;
    line-height: 2.5rem;
  }
  .buttons{
    user-select: none;
    flex: 1.2 0 0;
    display: flex;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .cancel-button{
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--tealdeer);
  }
  .delete-button{
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
  }
  .cross{
    position: absolute;
    right: 1rem;
    top: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    color: white;
    cursor: pointer;
  }
</style>
