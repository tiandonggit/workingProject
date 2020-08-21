import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
//患者
import Patient from "./modules/Patient/Patient";
import Doctor from "./modules/Doctor/Doctor";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ],
  modules: {
    Patient,
    Doctor
  }
});
