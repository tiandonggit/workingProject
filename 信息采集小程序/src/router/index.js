import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import(/* webpackChunkName: "Home" */'@/pages/index.vue')
const registrationInfo = () => import(/* webpackChunkName: "registrationInfo" */'@/pages/registrationInfo.vue')
const infoConfirm = () => import(/* webpackChunkName: "registrationInfo" */'@/pages/infoConfirm.vue')
const successCode = () => import(/* webpackChunkName: "registrationInfo" */'@/pages/successCode.vue')
Vue.use(Router)

export default new Router({
  mode: 'hash',
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
