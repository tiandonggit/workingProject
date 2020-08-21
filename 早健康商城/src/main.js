import Vue from "vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import "./assets/iconfont/iconfont.css";
import "./assets/css/icon.css";

import App from "./App.vue";
import http from "./utils/request";
import method from "./utils/method.js";
import plugin from "./utils/plugin.js";
import h5plus from "./utils/h5plus/index.js";
import "./utils/appBack.js";
import errors from "./utils/error";

// Vue.use(h5plus);
import VueJsonp from "vue-jsonp";

Vue.use(VueJsonp);
Vue.use(Vant);
Vue.use(method);
Vue.use(plugin);
Vue.use(h5plus);
Vue.use(errors);
Vue.prototype.$http = http;
// Vue.prototype.$net = errors;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
