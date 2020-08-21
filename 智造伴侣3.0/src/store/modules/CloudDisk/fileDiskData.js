export default {
  namespaced: true,
  state: {
    checkedFileSpaceMessage: {
      fileSpaceName: "", // 文件空间名称 (面包屑根目录)
      fileSpaceId: "", // 文件空间id (面包屑根目录)
      filePermission:[], // 文件空间操作权限
    }
  },
  mutations: {
    // 页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    fileDiskData(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.mailListData;
    },
    // 保存已经选择的文件空间信息(网盘模块查询参数)
    saveCheckedFileSpaceMessage(state, data) {
      state.checkedFileSpaceMessage = data;
    }
  },
  actions: {},
  getters: {}
};
