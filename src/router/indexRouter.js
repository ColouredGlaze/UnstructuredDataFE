import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index'
import Main from '@/views/main/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Main',
      component: Main
    }
  ]
})
