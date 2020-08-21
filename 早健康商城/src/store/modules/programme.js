//方案
export default {
  namespaced: true,
  state: {},
  mutations: {
    //vuex保存数据
    programme(state) {
      let data = JSON.parse(window.sessionStorage.getItem("vuex"));
      state = data.programme;
    }
  },
  actions: {},
  getters: {}
};
