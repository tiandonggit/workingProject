//其它界面功能
export default {
  namespaced: true,
  state: {
    patientMessage: {}, // 患者信息,openId等等
    orderId: "",
    attention: "",
    orderParams: {
      contacts: "",
      phone: "",
      address: "",
      address_detail: ""
    },
    isDoc: true,
    isIM: false,
    prestype: 0,
    pathNum: 1
  },
  mutations: {
    //vuex保存数据
    Patient(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.Patient;
    },

    //保存患者信息
    patientMessage(state, data) {
      state.patientMessage = data;
    },

    //保存自助柜的orderId
    saveOrderId(state, data) {
      state.orderId = data;
    },

    //注意事项
    attention(state, data) {
      state.attention = data;
    },
    saveOrderParams(state, data) {
      state.orderParams = data;
    },
    isDoc(state, data) {
      state.isDoc = data;
    },
    isIM(state, data) {
      state.isIM = data;
    },
    pathNum(state, data) {
      state.pathNum = data;
    },
    prestype(state, data) {
      state.prestype = data;
    }
  },
  actions: {},
  getters: {}
};
