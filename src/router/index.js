import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import axios from 'axios'
import vueaixos from 'vue-axios'

Vue.use(Router)
Vue.use(vueaixos,axios)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
