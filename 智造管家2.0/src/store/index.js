import Vue from "vue";
import Vuex from "vuex";
//解决f5刷新页面后数据不见
import createPersistedState from "vuex-persistedstate";

import homeData from "./modules/Home/homeData";
import loginData from "./modules/Login/loginData";
import imData from "./modules/Im/imData";
import mailListData from "./modules/mailList/mailListData"


Vue.use(Vuex);

export default new Vuex.Store({
  // plugins: [createPersistedState({
  //   reducer(val) {
  //     return {
  //       // homeData: val.homeData,
  //       loginData: val.loginData,
  //       mailListData: val.mailListData
  //     };
  //   }
  // })],

  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ],
  modules: {
    homeData,
    loginData,
    imData,
    mailListData
  }
});
