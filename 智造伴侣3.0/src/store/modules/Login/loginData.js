export default {
  namespaced: true,
  state: {
    userMessage: {},
    imServerToken: {
      ImServer: ""
    }
  },
  mutations: {
    //vuex保存数据
    loginData(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.loginData;
    },
    // 保存用户登录信息
    saveUserMessage(state, data) {
      state.userMessage = data;
    },
    // 保存imServer地址和im登录的Token
    saveImServerToken(state, data) {
      state.imServerToken = data;
    }
  },
  actions: {},
  getters: {}
};
