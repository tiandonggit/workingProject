//IM即时通讯
export default {
  namespaced: true,
  state: {
    doctorMessage: {}, //医生个人信息，main.js中utils/startup
    addFriendList: [], //可添加到小组的好友信息
    searchFriendList: [], //搜索到的小组
    groupNum: 1, //小组数量
    groupName: "", //小组名字
    chatList: [], //会话列表消息
    unreadList: [], // 会话列表未读
    setSessionType: "", //会话类型
    currentSessionId: "", //当前的sessionid
    fromType: "", // 来源
    historyProduct: [],
    productList: [],
    planProductList: [],
    tabIndex: 1, // 下标 tab,
    // 新增 医疗小组的级别和名称
    docGroupVuex:{
      docGroupName:'',
      docGroupLevelId:''
    }
  },
  mutations: {
    //页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    doctorIM(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.DoctorIM;
    },
    //保存小组名
    saveGroupName(state, data) {
      state.groupName = data;
    },
    //清除医生名
    clearGroupName(state, data) {
      state.groupName = "";
    },
    //保存医生信息
    doctorMessage(state, data) {
      state.doctorMessage = data;
    },
    //设置当前的会话sessionID
    setSessionid(state, data) {
      state.currentSessionId = data;
    },
    //设置当前会话类型
    setSessionType(state, data) {
      state.setSessionType = data;
    },
    //修改会话列表消息
    saveChatList(state, data) {
      state.chatList = data;
    },
    //修改小组数量
    saveGroupNum(state, data) {
      state.groupNum++;
    },
    //添加好友信息(小组)
    saveAddFriendList(state, data) {
      state.addFriendList = data;
    },
    //删除好友信息(小组)
    delAddFriendList(state, data) {
      state.addFriendList = data;
    },
    //清除历史产品
    delHistoryProduct(state) {
      state.historyProduct = [];
    },
    //添加历史产品
    saveHistoryProduct(state, data) {
      state.historyProduct = data;
    },
    //添加历史产品
    saveProductList(state, data) {
      state.productList = data;
    },
    savePlanProductList(state, data) {
      state.planProductList = data;
    },
    //清空好友信息(小组)
    clearAddFriendList(state) {
      state.addFriendList = [];
    },
    //添加好友信息(小组)
    saveSearchFriendList(state, data) {
      state.searchFriendList = data;
    },
    //清除好友信息(小组)
    clearSearchFriendList(state) {
      state.searchFriendList = [];
    },
    //修改页面来源
    saveFromType(state, data) {
      state.fromType = data;
    },
    //修改tab标签
    saveTabIndex(state, data) {
      state.tabIndex = data;
    },
    //修改未读
    saveUnreadList(state, data) {
      state.unreadList = data;
    },
    //保存新建医疗小组信息,创建成功之后清空
    saveDocGroupVuex(state, data) {
      state.docGroupVuex = data;
    }
  },
  actions: {},
  getters: {}
};
