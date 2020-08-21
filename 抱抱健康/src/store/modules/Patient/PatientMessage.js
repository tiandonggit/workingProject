//IM即时通讯
export default {
  namespaced: true,
  state: {
    isbindfinished: false, // 用户是否注册
    patientName: "" // 患者姓名
  },
  mutations: {
    //vuex保存数据
    PatientMessage(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.PatientMessage;
    },
    //修改用户注册状态
    isbindfinished(state, res) {
      state.isbindfinished = res;
    },
    //修改用户注册状态
    patientName(state, res) {
      state.patientName = res;
    }
  },
  actions: {},
  getters: {}
};
