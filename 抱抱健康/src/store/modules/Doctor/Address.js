//搜索历史
export default {
  namespaced: true,
  state: {
    historyAddress: [], //历史搜索地址
    ad: "",
    addressObj: { //新增(修改)地址
      id: "", //地址id
      businessid: "", //用户id
      status: 1, //是否默认 0默认 1非默认
      name: "", //姓名
      phone: "", //手机号
      address: "", //省市区
      pointnum: "", //详细地址
      isdel: 0, //是否删除
    },
    addressData: { //选择后的地址
      id: "",
      status: 1,
      name: "",
      phone: "",
      address: "",
      pointnum: ""
    }
  },
  mutations: {
    //页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    address(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.Address;
    },
    //城市历史
    historyAddress(state, searchResult) {
      for (let i = 0; i < state.historyAddress.length; i++) {
        if (
          searchResult.address_code === state.historyAddress[i].address_code
        ) {
          state.historyAddress.splice(i, 1);
        }
      }
      state.historyAddress.unshift(searchResult);
      if (state.historyAddress.length > 10) {
        state.historyAddress.splice(10, state.historyAddress.length - 9);
      }
    },
    //删除历史记录
    delHistoryAddress(state) {
      state.historyAddress = [];
    },
    addressObj(state, data) {
      state.addressObj = data;
    },
    addressData(state, data) {
      state.addressData = data;
    }
  },
  actions: {},
  getters: {}
};
