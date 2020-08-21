//IM即时通讯
export default {
  namespaced: true,
  state: {},
  mutations: {
    //vuex保存数据
    IM(state) {
      let data = JSON.parse(window.sessionStorage.getItem("vuex"));
      state = data.IM;
    }
  },
  actions: {},
  getters: {}
};
