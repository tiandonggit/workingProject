import Vue from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";

import http from "./utils/request";
import method from "./utils/method.js";
import plugin from "./utils/plugin.js";
import md5 from "js-md5";

import "./directives";
import "./assets/css/reset.css";
import $ from "jquery";
import "./utils/startUp";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import VueHotkey from "v-hotkey";
import vClickOutside from "v-click-outside";
import VueScrollTo from "vue-scrollto";
import VueLazyload from "vue-lazyload";
import "../src/assets/iconfont/iconfont.css"

import {globalServiceHost} from "./utils/httpConfig";

Vue.prototype.$md5 = md5;
Vue.use(method);
Vue.use(plugin);
Vue.use(ElementUI);
Vue.use(VueHotkey);
Vue.use(vClickOutside);

// example
// <div v-show="show"
//      v-click-outside="onClickOutside" >
//   Hide me when a click outside this element happens
// </div>
Vue.use(VueLazyload);

// You can also pass in the default options
Vue.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "ease",
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

// example
// <a href="#" v-scroll-to="'#element'">Scroll to #element</a>


Vue.prototype.$http = http;
Vue.prototype.$globalServiceHost = globalServiceHost;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
