const state={
  text:'hello world',
  count:0,
}

const mutations={
  increment(){
    state.count++;
  },
}

const getters={

}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
