import Vue from "vue"
import router from "./router"
import store from "./store"
import App from "./App.vue"
import http from "./utils/request"
import method from "./utils/method.js"
import plugin from "./utils/plugin.js"
import "./assets/css/reset.css"
import './directives'
import $ from 'jquery'
import './utils/startUp'

import { Dialog, Icon,Row,Col,Scrollbar } from 'element-ui';

Vue.use(Dialog)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Scrollbar)

Vue.use(method)
Vue.use(plugin)
Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
