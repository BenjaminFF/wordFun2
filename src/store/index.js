import vuex from 'vuex'
import Vue from 'vue'
import test from './modules/test'
import wordset from './modules/wordset'
import routerdata from './modules/routerdata'
import captcha from './modules/captcha'
Vue.use(vuex)

export default new vuex.Store({
  modules:{
    test,
    wordset,
    routerdata,
    captcha
  }
});

