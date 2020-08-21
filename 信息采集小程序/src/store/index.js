import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ],
  state: {
    headerTips: 'hello',
    input: '',
    iphoneX: false,
    phoneNum: '',
    saveInfoObject: {},
  },
  mutations: {
    changeValue(state, newVal) {
      state.iphoneX = newVal
    },
    savePhone(state, num) {
      state.phoneNum = num
    },
    saveInfoObject(state, Val) {
      state.saveInfoObject = Val
    }
  },
  actions,
})
