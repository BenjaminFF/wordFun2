import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import vueaixos from 'vue-axios'
import helpcenter from '@/components/sidebaritems/help-center'
import wordgame from '@/components/sidebaritems/word-game'
import wordsets from '@/components/sidebaritems/word-sets'
import setLearn from '@/components/setLearns/set-learn';

Vue.use(Router)
Vue.use(vueaixos,axios)


export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'wordsets',
      component: wordsets
    },
    {
      path: '/wordgame',
      name: 'wordgame',
      component: wordgame
    },
    {
      path: '/wordsets',
      name: 'wordsets',
      component: wordsets
    },
    {
      path: '/helpcenter',
      name: 'helpcenter',
      component: helpcenter
    },
    {
      path: '/setLearn',
      name: 'setLearn',
      component: setLearn
    }
  ]
})
