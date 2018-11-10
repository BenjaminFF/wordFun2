import funcs from '../funcs'
const state={
  showCD:false,                      //show create dialog
  folders:[],
  slideFolders:[],
  isPushing:false,                    //主要用于create-dialog中的进度条，判断单词集push的状态
  vocabulary:[],
  ddState:false,                  //delete dialog state
  createSetInfo:{
    containerVisibility:false
  }
}

const mutations={
  alterddState(state,isShow){
    state.ddState=isShow;
  },
  showCreateSet(state){
    state.createSetInfo.containerVisibility=true;
  },
  dismissCreateSet(state){
    state.createSetInfo.containerVisibility=false;
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
