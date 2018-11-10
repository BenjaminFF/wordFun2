import vuex from 'vuex'
import Vue from 'vue'
import wordset from './modules/wordset'
import routerdata from './modules/routerdata'
import captcha from './modules/captcha'
Vue.use(vuex)

export default new vuex.Store({
  modules:{
    wordset,
    routerdata,
    captcha
  }
});

