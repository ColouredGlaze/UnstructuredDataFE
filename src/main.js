// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router/indexRouter'
import Icon from 'vue-svg-icon/Icon.vue'
import api from './api'
import 'jquery'

Vue.prototype.api = api
Vue.component('icon', Icon)
Vue.use(ElementUI, { size: 'medium' })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

router.beforeEach((to, from, next) => {
  console.log('main.js:beforeEach' + from.path)
  console.log('main.js:beforeEach' + to.path)
  next()
})
