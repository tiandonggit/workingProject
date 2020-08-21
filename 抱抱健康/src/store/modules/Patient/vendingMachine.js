//IM即时通讯
export default {
  namespaced: true,
  state: {
    orderId: '',
  },
  mutations: {
    //vuex保存数据
    vendingMachine(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.vendingMachine;
    },

    //保存自助柜的orderId
    saveOrderId(state, data) {
      state.orderId = data;
    }
  },
  actions: {},
  getters: {}
};
