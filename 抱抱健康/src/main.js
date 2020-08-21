import Vue from "vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import waterfall from 'vue-waterfall2'
import wx from "weixin-js-sdk";
import VueJsonp from "vue-jsonp";
import "vant/lib/index.css";
import "./assets/iconfont/iconfont.css";
import "./assets/css/icon.css";
import "./assets/css/reset.css";
import App from "./App.vue";
import {Lazyload} from 'vant';


import VueHashCalendar from "vue-hash-calendar";
import "vue-hash-calendar/lib/vue-hash-calendar.css";

import http from "./utils/request";
import method from "./utils/method.js";
import plugin from "./utils/plugin.js";
import md5 from "js-md5";

import "./utils/startUp";
import { globalServiceHost } from "./utils/httpConfig";

Vue.prototype.$md5 = md5;
Vue.prototype.$wx = wx;
Vue.use(Lazyload);
Vue.use(method);
Vue.use(plugin);
Vue.use(Vant);
Vue.use(VueHashCalendar);
Vue.use(waterfall)
Vue.use(VueJsonp);
Vue.prototype.$http = http;
Vue.prototype.$globalServiceHost = globalServiceHost;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
