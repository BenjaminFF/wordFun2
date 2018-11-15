<template>
  <div class="sidebar">
      <div class="item" v-for="item in linkItems">
        <router-link v-bind:to="item.link" :class="{active:item.selected}" class="itemtitle">{{$t("sidebar["+item.index+"]")}}</router-link>
      </div>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="folder" v-if="showSFolders">
        <div class="folder-header">{{$t('sidebar[3]')}}</div>
        <div class="folder-item" v-for="folder in dealFolders" :class="{active:folder.selected}" @click="selectFolder(folder)">
          {{folder.title}}
        </div>
        <div class="folder-item" @click="createFolder.showModel=true">{{$t('sidebar[4]')}}</div>
      </div>
    </transition>
    <transition enter-active-class="fadeIn" v-on:after-enter="createFolder.showDialog=true">
      <div class="create-folder-model" v-if="createFolder.showModel">
        <div class="create-folder-dialog animated bounceInDown" v-if="createFolder.showDialog">
          <icon name="cross" class="cf-icon" @click.native="createFolder.showModel=false"></icon>
          <div class="cf-dialog-container">
            <div class="cf-dialog-header">{{$t('createFolder[0]')}}</div>
            <ani-input :title="$t('createFolder[1]')" :fontSize="1.5" v-on:input="cfTitleListener"
                       :validate="createFolder.title.Validated" :hint="createFolder.title.hint"></ani-input>
            <ani-input :title="$t('createFolder[2]')" :fontSize="1.5" v-on:input="createFolder.intro.value=$event.target.innerHTML"></ani-input>
            <my-button :fontSize="1.2" class="cf-dialog-button" @click.native="createFolderToServer">{{$t('createFolder[3]')}}</my-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapState,mapMutations,mapGetters} from 'vuex';
  import AniInput from "./ani-input";
  import MyButton from "./my-button";
    export default {
        name: "my-sidebar",
      components: {MyButton, AniInput},
      data(){
          return{
            dealFolders:[],
            createFolder:{
              showModel:false,
              showDialog:false,
              title:{},
              intro:{}
            }

          }
      },
      created(){
        this.init();
      },
      methods:{
        init(){
          this.initLinkitems();
          let login_Info=this.getCookie("login_Info");
          let username=JSON.parse(login_Info).username;
          this.getFoldersFromServer(username);
          let currentPath=this.$router.currentRoute.fullPath;
          this.selectCurLinkItem(currentPath);

          this.createFolder.title={
            value:"",
            Validated:false,
            hint:{
              text:"",
              color:'red',
            },
            isVerifying:false
          }
          this.createFolder.intro={
            value:"",
          }
        },
        cfTitleListener(event){
          if(event.target.textContent!=undefined){
            this.createFolder.title.value=event.target.textContent;       //兼容火狐
          }else {
            this.createFolder.title.value=event.target.innerText;
          }
          if(!this.createFolder.title.isVerifying){
            setTimeout(()=> {
              console.log(this.createFolder.title.value);
              this.verifyCFTitle(this.createFolder.title.value);     //this.createFolder.title.value是1s后的value
              this.createFolder.title.isVerifying=false;
            },1000);
            this.createFolder.title.isVerifying=true;
          }
        },
        verifyCFTitle(title){
          if(title==""){
            this.createFolder.title.Validated=false;
            this.createFolder.title.hint.text = this.$t('createFolder[5]');
            this.createFolder.title.hint.color = "red";
            return;
          }
          let login_Info=this.getCookie("login_Info");
          let username=JSON.parse(login_Info).username;
          this.axios.get('/api/verifyfolder',{
            params: {
              username:username,
              title: encodeURIComponent(title)
            }
          }).then((response)=>{
            if(response.data.created){         //created表示这个文件夹已经被创建了
              this.createFolder.title.Validated=false;
              this.createFolder.title.hint.text = this.$t('createFolder[4]');
              this.createFolder.title.hint.color = "red";
            }else if(!response.data.created){
              this.createFolder.title.Validated=true;
              this.createFolder.title.hint.text = "";
            }
          }).catch((error)=>{
            console.log(error);
          })
        },
        createFolderToServer(){
          console.log(this.createFolder.intro.value);
        },
        getFoldersFromServer(author){
          this.axios.get('/api/getFolders',{
            params: {
              author:author
            }
          }).then((response)=>{
            this.dealFolders=this.getDealFolders(response.data);
          }).catch((err)=>{
            console.log(err);
          })
        },
        getDealFolders(folders){
          let dealFolders=[];
          let count=0;
          for(let i=0;i<folders.length;i++){
            if(folders[i]!="all"){
              let title=folders[i];
              if(title.length>15){
                title=title.substring(0,15)+"...";
              }
              let folder={
                title:folders[i],
                selected:false,
              }
              dealFolders.push(folder);
              if(count++==3){      //最多显示三个
                break;
              }
            }
          }
          return dealFolders;
        },
        selectFolder(folder){
          for(let i=0;i<this.dealFolders.length;i++){
            if(this.dealFolders[i].selected){
              this.dealFolders[i].selected=false;
            }
            folder.selected=true;
          }
        },
        ...mapMutations({
          initLinkitems:'routerdata/initLinkitems',
          selectCurLinkItem:'routerdata/selectCurLinkItem'
        }),
      },
      watch:{
        showSFolders(){
          for(let i=0;i<this.dealFolders.length;i++){
            if(this.dealFolders[i].selected){
              this.dealFolders[i].selected=false;
            }
          }
        },
      },
      computed:{
        ...mapState({
          linkItems:state=>state.routerdata.linkItems,
          showSFolders:state=>state.wordset.showSFolders,
        }),
      },
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
    height: fit-content;
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
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

  .folder{
    margin-top: 5rem;
    color: var(--lightblue);
    cursor: pointer;
  }

  .folder-header{
    margin-bottom: 1rem;
  }

  .folder-header:hover{
    color: var(--seablue);
  }

  .folder-item{
    font-size: 1rem;
    display: flex;
    height: 2rem;
    font-size: 1rem;
    align-items: center;
  }

  .folder-item:hover{
    color: var(--seablue);
  }

  .active{
    color: var(--seablue);
  }

  .create-folder-model{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.51);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .create-folder-dialog{
    width: 40%;
    height: 80%;
    background-color: #f3f3f3;
    border-radius: 15px;
    position: relative;
    display: flex;
    justify-content: center;
  }

  .cf-dialog-container{
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cf-dialog-header{
    margin-top: 1rem;
    font-size: 1.8rem;
    color: var(--seablue);
    margin-bottom: 2rem;
  }

  .cf-dialog-button{
    margin-top: 2rem;
    border-radius: 5px;
  }

  .cf-icon{
    position: absolute;
    right: 1rem;
    top: 1rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    color: #9f9f9f;
  }

  .cf-icon:hover{
    color: var(--seablue);
  }
</style>
