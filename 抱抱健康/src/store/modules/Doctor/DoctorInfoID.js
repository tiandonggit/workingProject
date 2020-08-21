//医生个人信息
export default {
  namespaced: true,
  state: {
    address: "", //定位地址
    historyAddress: [], //历史搜索地址
    cityList: [], //城市列表 字母
    trbbarActive: 0, //标签栏当前下标
    name: "",
    hospital: { hospital: "", id: "" },
    office: { office: "", id: "" },
    title: { title: "", code: "" }
  },
  mutations: {
    //页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    doctorInfoID(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.DoctorInfoID;
    },
    //选定名字
    setName(state, val) {
      state.name = val;
    },
    //选定科室
    setOffice(state, val) {
      state.office = val;
    },
    //选定职务
    setTitle(state, val) {
      state.title = val;
    },
    //选定医院
    setHospital(state, val) {
      state.hospital = val;
      state.office = {}; //将科室置空
    },
    //IP 定位地址
    address(state, val) {
      state.address = val;
    },
    //城市历史
    historyAddress(state, val) {
      for (let i = 0; i < state.historyAddress.length; i++) {
        if (val.city_code === state.historyAddress[i].city_code) {
          state.historyAddress.splice(i, 1);
        }
      }
      state.historyAddress.unshift(val);
      if (state.historyAddress.length > 4) {
        state.historyAddress.splice(4, state.historyAddress.length - 1);
      }
    },
    //删除历史记录
    delHistoryAddress(state) {
      state.historyAddress = [];
    },
    //城市列表 字母
    cityList(state, val) {
      state.cityList = val;
    },

    //设置当前下标
    trbbarActive(state, val) {
      state.trbbarActive = val;
    }
  },
  actions: {},
  getters: {}
};
