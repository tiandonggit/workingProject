import Vue from 'vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import Vant from 'vant'
import http from './utils/request'
import KboneUI from 'kbone-ui'
import 'vant/lib/index.css'
import 'kbone-ui/lib/weui/weui.css'
import './assets/iconFont/iconfont.css'
import App from './App.vue'

Vue.use(Vant)
Vue.use(KboneUI)
Vue.prototype.$http = http
Vue.config.productionTip = false

sync(store, router)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
