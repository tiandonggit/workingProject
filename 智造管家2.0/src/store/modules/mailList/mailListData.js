export default {
  namespaced: true,
  state: {
    userList: {},
    groupList:{},
  },
  mutations: {
    // 页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    mailListData(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.mailListData;
    },
    // 保存用户登录信息
    userList(state, data) {
      state.userList = data;
    },
    // 保存imServer地址和im登录的Token
    groupList(state,data) {
      state.groupList = data;
    }
  },
  actions: {},
  getters: {}
};
