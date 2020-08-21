//收货地址搜索历史
export default {
  namespaced: true,
  state: {
    historyAddress: [], //历史搜索地址
    ad: ""
  },
  mutations: {
    //城市历史
    historyAddress(state, searchResult) {
      for (let i = 0; i < state.historyAddress.length; i++) {
        if (
          searchResult.address_code === state.historyAddress[i].address_code
        ) {
          state.historyAddress.splice(i, 1);
        }
      }
      state.historyAddress.unshift(searchResult);
      if (state.historyAddress.length > 10) {
        state.historyAddress.splice(10, state.historyAddress.length - 9);
      }
    },
    //删除历史记录
    delHistoryAddress(state) {
      state.historyAddress = [];
    }
  },
  actions: {},
  getters: {}
};
