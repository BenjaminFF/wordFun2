const state={
  captchaInfo:{},
  captchaResText:""       //你回答的text
}

const mutations={
  setCaptchaInfo(state,captchaInfo){
    state.captchaInfo=captchaInfo;
  },
  setCaptchaResText(state,captchaResText){
    state.captchaResText=captchaResText;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}
