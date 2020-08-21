import Vue from "vue";
import Vuex from "vuex";
//解决f5刷新页面后数据不见
import createPersistedState from "vuex-persistedstate";


// import Address from "./modules/Doctor/Address";


Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {

  }
});
