//主页
export default {
  namespaced: true,
  state: {
    address: "", //定位地址
    historyAddress: [], //历史搜索地址
    cityList: [], //城市列表 字母
    historyProduct: [], //商品历史搜索
    trbbarActive: 0, //标签栏当前下标
    shopCardNum: "",//购物车商品数量
  },
  mutations: {
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
      if (state.historyAddress.length > 10) {
        state.historyAddress.splice(10, state.historyAddress.length - 3);
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
    //历史商品
    historyProduct(state, val) {
      if(state.historyProduct.includes(val)){
        state.historyProduct.splice(state.historyProduct.indexOf(val),1);
      }
      state.historyProduct.unshift(val);
      if (state.historyProduct.length > 10) {
        state.historyProduct.splice(10, state.historyProduct.length - 9);
      }
    },
    //删除历史商品记录
    delHistoryProduct(state, val){
      state.historyProduct = []
    },
    //设置当前下标
    trbbarActive(state,val){
      state.trbbarActive = val;
    },
    //设置购物车数量
    shopCardNum(state,val){
      if(val===0){
        val = "";
      }
      state.shopCardNum = val;
    },
  },
  actions: {},
  getters: {}
};
