import Vue from "vue";
import Vuex from "vuex";
//解决f5刷新页面后数据不见
import createPersistedState from "vuex-persistedstate";

import homeData from "./modules/Home/homeData";
import mapData from "./modules/Map/mapData";


Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    homeData,
    mapData
  }
});
