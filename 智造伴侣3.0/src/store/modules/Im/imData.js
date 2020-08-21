export default {
  namespaced: true,
  state: {
    chatList:[], // im缓存的聊天列表
    imSocketState: false,// true:正常状态 false:异常状态
  },
  mutations: {
    // 页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    imData(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.imData;
    },
    saveChatList(state,data) {
      state.chatList = data;
    },
    saveImSocketState(state,data) {
      state.imSocketState = data;
    }
  },
  actions: {},
  getters: {}
};
