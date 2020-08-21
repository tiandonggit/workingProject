export default {
  namespaced: true,
  state: {
    imSelectedInfo: {}, // 保存聊天列表某条信息
    listSelectedInfo: {}, // 保存通讯录某条信息
    filterFileSpaceList:[], // im里用的文件空间列表,保存到个人网盘的时候需要权限过滤处理
  },
  mutations: {
    // 页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    homeData(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.homeData;
    },

    imSelectedInfo(state, val) {
      if (val === 0) {
        val = "";
      }
      state.imSelectedInfo = val;
    },

    listSelectedInfo(state, val) {
      if (val === 0) {
        val = "";
      }
      state.listSelectedInfo = val;
    },
    saveFilterFileSpaceList(state,data) {
      state.filterFileSpaceList = data;
    }
  },
  actions: {},
  getters: {}
};
