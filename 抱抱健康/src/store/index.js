import Vue from "vue";
import Vuex from "vuex";
//解决f5刷新页面后数据不见
import createPersistedState from "vuex-persistedstate";
//医生
// 添加地址
import Address from "./modules/Doctor/Address";
//IM即时通讯
import DoctorIM from "./modules/Doctor/DoctorIM";
//医生个人信息
import DoctorInfoID from "./modules/Doctor/DoctorInfoID";
//患者
//IM即时通讯
import PatientIM from "./modules/Patient/PatientIM";
//患者注册
import PatientMessage from "./modules/Patient/PatientMessage";

import order from "./modules/Patient/order";

import addressCity from "./modules/Patient/addressCity";

import vendingMachine from "./modules/Patient/vendingMachine";
//历史搜索记录
import History from "./modules/History/history";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    Address,
    DoctorIM,
    DoctorInfoID,
    PatientIM,
    PatientMessage,
    order,
    addressCity,
    vendingMachine,
    History
  }
});
