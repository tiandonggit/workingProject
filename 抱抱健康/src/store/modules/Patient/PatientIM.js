//IM即时通讯
export default {
  namespaced: true,
  state: {
    patientMessage: {}, // 患者信息
    chatListVuex: [], // 患者聊天列表未读消息缓存
    sessionMessage: {
      sessionId: "", // 会话id,
      sessionType: "", // 会话类型 0 单聊 1 群聊
      doctorId: "" // 医生id
    },
    doctorRemark: "", // 医生备注
    patientChatList: [] // 患者聊天列表,聊天详情里要用到头像等信息
  },
  mutations: {
    //vuex保存数据
    PatientIM(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.PatientIM;
    },
    //保存患者聊天列表未读信息缓存
    patientMessage(state, data) {
      state.patientMessage = data;
    },
    //保存患者聊天列表未读信息缓存
    chatListVuex(state, data) {
      state.chatListVuex = data;
    },
    // 保存会话信息 包含会话id 会话类型 医生id
    sessionMessage(state, data) {
      state.sessionMessage = data;
    },
    // 保存医生备注,修改医生备注时回显
    doctorRemark(state, data) {
      state.doctorRemark = data;
    },
    // 保存患者聊天列表,详情里要用到头像等信息
    patientChatList(state, data) {
      state.patientChatList = data;
    }
  },
  actions: {},
  getters: {}
};
