import funcs from '../funcs'
const state={
  createSetInfo:{
    containerVisibility:false,
  },
  flushState:false,          //用来返回createSet后刷新wordset
  ddState:false,             //delete dialog state
  showSFolders:false         //用来决定sidebar folders是否显示
}

const mutations={
  showCreateSet(state){
    state.createSetInfo.containerVisibility=true;
  },
  dismissCreateSet(state){
    state.createSetInfo.containerVisibility=false;
  },
  setFlushState(state,flushState){
    state.flushState=flushState;
  },
  setddState(state,ddState){
    state.ddState=ddState;
  },
  setSFoldersState(state,sFoldersState){
    state.showSFolders=sFoldersState;
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
