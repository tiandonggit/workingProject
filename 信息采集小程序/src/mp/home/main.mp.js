import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import wx from 'weixin-js-sdk'
import './../../assets/iconFont/iconfont.css'
import KboneUI from 'kbone-ui'
import 'kbone-ui/lib/weui/weui.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import http from '../../utils/requestWX'
import App from '../../App.vue'
import store from '../../store'
import Home from '../../pages/index.vue'
import registrationInfo from '../../pages/registrationInfo.vue'
import infoConfirm from '../../pages/infoConfirm.vue'
import successCode from '../../pages/successCode.vue'


Vue.use(KboneUI)
Vue.use(Vant)
Vue.prototype.$http = http
Vue.prototype.$wx = wx
Vue.use(Router)


const router = new Router({
  mode: 'history',
  routes: [{
    path: '/(home|index)?',
    name: 'Home',
    component: Home,
  }, {
    path: '/index.html',
    name: 'HomeHtml',
    component: Home,
  }, {
    path: '/test/(home|index)',
    name: 'HomeTest',
    component: Home,
  },
  {
    path: '/registrationInfo',
    name: 'registrationInfo',
    component: registrationInfo,
  },
  {
    path: '/infoConfirm',
    name: 'infoConfirm',
    component: infoConfirm,
  },
  {
    path: '/successCode',
    name: 'successCode',
    component: successCode,
  }
  ],
})


export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.config.productionTip = false

  sync(store, router)

  return new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
