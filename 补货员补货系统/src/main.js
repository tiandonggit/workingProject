import Vue from "vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import wx from "weixin-js-sdk";
import VueJsonp from "vue-jsonp";
import "vant/lib/index.css";
import "./assets/iconfont/iconfont.css";
import "./assets/css/icon.css";
import App from "./App.vue";
import http from "./utils/request";
import method from "./utils/method.js";
import plugin from "./utils/plugin.js";
import md5 from "js-md5";
import "./assets/css/reset.css";
import './utils/startUp'


Vue.prototype.$md5 = md5;
Vue.prototype.$wx = wx;
Vue.use(method);
Vue.use(plugin);
Vue.use(Vant);
Vue.use(VueJsonp);
Vue.prototype.$http = http;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});
