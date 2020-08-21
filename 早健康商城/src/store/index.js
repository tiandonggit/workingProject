import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
//方案
import programme from "./modules/programme";
//IM即时通讯
import IM from "./modules/IM";
//主页
import Home from "./modules/Home";
// 添加收货地址
import Address from "./modules/Address";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ],
  modules: {
    programme,
    IM,
    Home,
    Address
  }
});
