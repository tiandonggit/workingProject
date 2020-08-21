import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import homeData from "./modules/Home/homeData";
import loginData from "./modules/Login/loginData";
import imData from "./modules/Im/imData";
import mailListData from "./modules/mailList/mailListData"
import fileDiskData from './modules/CloudDisk/fileDiskData'
import uploadData from './modules/CloudDisk/uploadData'
import projectData from "./modules/project/projectData";


Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({
    reducer(val) {
      return {
        homeData: val.homeData,
        loginData: val.loginData,
        mailListData: val.mailListData,
        imData:val.imData,
        fileDiskData:val.fileDiskData,
        projectData:val.projectData
      };
    }
  })],
  // plugins: [
  //   createPersistedState({
  //     storage: window.localStorage
  //   })
  // ],
  modules: {
    homeData,
    loginData,
    imData,
    mailListData,
    fileDiskData,
    uploadData,
    projectData
  }
});
