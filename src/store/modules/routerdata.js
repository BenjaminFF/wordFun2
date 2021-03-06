const state={
  linkItems:[],
}

const mutations={
  initLinkitems(state){
    let items=[];
    let link=[/*'/latestlearn',*/'/wordsets','/wordgame','/helpcenter'];
    for(let i=0;i<3;i++){
      let item={
        index:i,
        selected:false,
        link:link[i]
      }
      items.push(item);
    }
    state.linkItems=items;
  },
  selectCurLinkItem(state,currentPath){
    if(currentPath=='/'){
      currentPath='/wordsets';
    }
    for(let i=0;i<state.linkItems.length;i++){
      state.linkItems[i].selected=false;
    }
    for(let i=0;i<state.linkItems.length;i++){
      if(state.linkItems[i].link==currentPath){
        state.linkItems[i].selected=true;
        break;
      }
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

