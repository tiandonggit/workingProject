export default {
  namespaced: true,
  state: {
    projectList: [],
    selectedProject: {}, // 选中的项目
    selectedMember: {}, // 选中的项目后选中成员进行操作
    selectedTask: {}, // 选中的任务
    sysMsgProjectId: "" // 系统消息需要跳转到项目时保存的项目id
  },
  mutations: {
    // 页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    projectData(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.projectData;
    },
    saveSelectedProject(state,data) {
      state.selectedProject = data;
    },
    saveSelectedMember(state,data) {
      state.selectedMember = data;
    },
    saveSelectedTask(state,data) {
      state.selectedTask = data;
    },
    saveProjectList(state,data) {
      state.projectList = data;
    },
    saveSysMsgProjectId(state,data) {
      state.sysMsgProjectId = data;
    },
  },
  actions: {},
  getters: {}
};
