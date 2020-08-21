/**
 * hospitalData 引入所有医院数据用于模拟今日开单数和今日交易额的增长(初始数据)
 * hospitalDataLocalStorage 保存在vuex中
 * **/
let hospitalData = JSON.parse(JSON.stringify(require('../../../resources/hospitalData/hospital')));
let hospitalDataLocalStorage = JSON.parse(localStorage.getItem('hospitalData')) || ''

export default {
  namespaced: true,
  state: {
    breadcrumb:['平台总览'],
    allowBack:false,
    hospitalData:hospitalDataLocalStorage || hospitalData
  },
  mutations: {
    //页面刷新，销毁前调用，兼容性存储方案，见utils/plugin.js
    homeData(state) {
      let data = JSON.parse(window.localStorage.getItem("vuex"));
      state = data.homeData;
    },
    // 更新面包屑数据
    saveBreadcrumb(state, data) {
      state.breadcrumb = data;
    },

    // 更新allowBack
    saveAllowBack(state, data) {
      state.allowBack = data;
    },

    // 更新hospitalData
    saveHospitalData(state, data) {
      state.hospitalData = data;
    }
  },
  actions: {},
  getters: {}
};
