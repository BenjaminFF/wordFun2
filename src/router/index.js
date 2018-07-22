import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import vueaixos from 'vue-axios'
import latestlearn from '@/components/latest-learn'
import wordgame from '@/components/word-game'
import wordset from '@/components/word-set'
import helpcenter from '@/components/help-center'
import createcontainer from '@/components/create-container'

Vue.use(Router)
Vue.use(vueaixos,axios)


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'latestlearn',
      component: latestlearn
    },
    {
      path: '/latestlearn',
      name: 'latestlearn',
      component: latestlearn
    },
    {
      path: '/wordgame',
      name: 'wordgame',
      component: wordgame
    },
    {
      path: '/wordset',
      name: 'wordset',
      component: wordset
    },
    {
      path: '/helpcenter',
      name: 'helpcenter',
      component: helpcenter
    },
    {
      path: '/createcontainer',
      name: 'createcontainer',
      component: createcontainer
    },
  ]
})
