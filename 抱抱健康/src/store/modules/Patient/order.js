//IM即时通讯
export default {
  namespaced: true,
  state: {
    historyAddress: [], //历史搜索地址
    ad: "",
    receiveAddress: {},
    xAuthToken: "", // 商城用户token
    orderParams: {
      contacts: "",
      phone: "",
      address: "",
      address_detail: ""
    },
  },
  mutations: {
    //vuex保存数据
    order(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.order;
    },
    //城市历史
    historyAddress(state, searchResult) {
      console.log(state, searchResult);
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
    },
    // 保存收货地址
    receiveAddress(state, res) {
      state.receiveAddress = res;
    },
    xAuthToken(state, res) {
      state.xAuthToken = res;
    },
    saveOrderParams(state,data) {
      state.orderParams = data;
    }
  },
  actions: {},
  getters: {}
};
