// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Icon from 'vue-svg-icon/Icon.vue'
import VueI18n from 'vue-i18n'
import store from './store'
import basefunc from './baseFunc'
import langStorage from './lang'

Vue.config.productionTip = false;
Vue.component('icon',Icon)
Vue.use(VueI18n)
Vue.use(basefunc)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  i18n: new VueI18n({
    // locale: LangStorage.getLang('zh'),          // 语言标识，后面会用做切换和将用户习惯存储到本地浏览器
    locale: langStorage.getLang('zh'),   // 语言标识
    messages: {
      'zh': require('./assets/lang/zh'),
      'en': require('./assets/lang/en')
    }
  }),
})

