import funcs from '../funcs'
const state={
  showCD:false,                      //show create dialog
  folders:[],
  slideFolders:[],
}

const mutations={
  setFolders(state,folders){
    state.folders=folders;
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
