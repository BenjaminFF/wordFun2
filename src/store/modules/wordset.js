import funcs from '../funcs'
const state={
  showCD:false,                      //show create dialog
  folders:[],
  slideFolders:[],
  isSetCreating:false,                 //正在创建单词集
  isPushing:false,
  wordsets:[],
  vocabulary:[],
  ddState:false,                  //delete dialog state
  curSet:""                     //在word-sets里面点击其中一个set然后赋值，主要给delete dialog用
}

const mutations={
  setCurSet(state,curSet){
    state.curSet=curSet;
  },
  alterddState(state,isShow){
    state.ddState=isShow;
  },
  setPushState(state,pushState){
    state.isPushing=pushState;
  },
  setCreateState(state,isCreating){
    state.isSetCreating=isCreating;
  },
  setFolders(state,folders){
    state.folders=folders;
  },
  setWordSets(state,sets){
    state.wordsets=sets;
  },
  unshiftWordsets(state,item){
    state.wordsets.unshift(item);
  },
  setVocabulary(state,vocabulary){
    state.vocabulary=vocabulary;
  },
  setSlideFolders(state){
    let offset=parseInt(state.folders.length/2)*(-100);
    for(let i=0;i<state.folders.length;i++){
      let text=state.folders[i];
      if(funcs.checkLength(text)>=26){
        let end=26-parseInt(funcs.getChineseCount(text,26)/2);
        text=text.substring(0,end)+"...";
      }
      let item={
        offset:offset,
        text:text,
        transform:'translateX('+offset+'%)'
      }
      state.slideFolders.push(item);
      offset+=100;
    }
  },
  slideRight(state){
    let LItem=state.slideFolders.pop();
    LItem.offset-=(state.slideFolders.length+1)*100;
    LItem.transform='translateX('+LItem.offset+'%)';
    state.slideFolders.unshift(LItem);
    let offset=state.slideFolders[0].offset;
    for(let i=0;i<state.slideFolders.length;i++){
      state.slideFolders[i].offset+=100;
      state.slideFolders[i].transform='translateX('+state.slideFolders[i].offset+'%)';
    }
  },
  slideLeft(state){
    let fItem=state.slideFolders.shift();
    fItem.offset+=(state.slideFolders.length+1)*100;
    fItem.transform='translateX('+fItem.offset+'%)';
    state.slideFolders.push(fItem);
    let offset=state.slideFolders[0].offset;
    for(let i=0;i<state.slideFolders.length;i++){
      state.slideFolders[i].offset-=100;
      state.slideFolders[i].transform='translateX('+state.slideFolders[i].offset+'%)';
    }
  },
  openCD(state){
    state.showCD=true;
  },
  closeCD(state){
    state.showCD=false;
  }
}

const getters={
  getDealedSets:(state)=>{
    let items=[];
    for(let i=0;i<state.wordsets.length;i++){
      let title=unescape(state.wordsets[i].title);
      let termCount=state.wordsets[i].termCount;
      let timeStamp=state.wordsets[i].createtime;
      let item={
        title:title,
        termCount:termCount,
        timeStamp:timeStamp
      }
      items.push(item);
    }
    return items;
  }
}

const actions={

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
