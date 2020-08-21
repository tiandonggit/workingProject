//搜索历史
export default {
  namespaced: true,
  state: {
    historyData: []
  },
  mutations: {
    //页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    History(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.History;
    },
    historyData(state, data) {
      state.historyData = data;
    }
  },
  actions: {},
  getters: {}
};
