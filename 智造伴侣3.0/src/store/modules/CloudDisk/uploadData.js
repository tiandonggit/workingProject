export default {
  namespaced: true,
  state: {
    uploadFileAry:[], // 需要上传的input filesList 同步上传(网盘模块)
    uploadingFileList:[], // 正在上传的文件 显示在filelist里 自行计算上传进度(网盘模块)
    uploadFileAryProject:[], // 需要上传的input filesList  (项目文件模块)
    uploadingFileListProject:[], // 正在上传的文件 显示在filelist里 自行计算上传进度(项目文件模块)
  },
  mutations: {
    saveUploadFileAry(state, data) {
      state.uploadFileAry = data;
    },
    saveUploadingFileList(state,data) {
      state.uploadingFileList = data;
    },
    saveUploadFileAryProject(state, data) {
      state.uploadFileAryProject = data;
    },
    saveUploadingFileListProject(state,data) {
      state.uploadingFileListProject = data;
    }
  },
  actions: {},
  getters: {}
};
