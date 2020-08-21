import HttpUtils from "../../utils/http.utils";
import {serviceHost, globalServiceHost} from "../../utils/httpConfig";

const urls = {
  "GETFILELIST": globalServiceHost.fileDiskServiceHost + "file/getChildren", // 获取网盘文件列表
  "GETALLROUTE": globalServiceHost.fileDiskServiceHost + "file/returnPath", // 获取文件的全路径(面包屑)
  "SUBMITNEWFOLDER": globalServiceHost.fileDiskServiceHost + "file/createNewFolder", // 新建文件夹
  "SUBMITDOWNLOADFILE": globalServiceHost.fileDiskServiceHost + "file/downloadPath", // 文件是否可以下载
  "MAKESUREDELETEFILE": globalServiceHost.fileDiskServiceHost + "file/delete", // 删除文件
  "SUBMITMOVEFILE": globalServiceHost.fileDiskServiceHost + "file/move", // 移动文件
  "SUBMITSHAREFILE": globalServiceHost.fileDiskServiceHost + "file/share", //分享文件
  "MAKESUREMODIFYFILENAME":globalServiceHost.fileDiskServiceHost + 'file/rename', // 修改文件名称
  "SEARCHFILEBYNAME":globalServiceHost.fileDiskServiceHost + 'file/lookup', // 搜索文件
};

let cloudDiskSrv = {
  getFileList: function (params) {
    return HttpUtils.get(urls.GETFILELIST, params);
  },
  getAllRoute: function (params) {
    return HttpUtils.get(urls.GETALLROUTE, params);
  },
  submitNewFolder: function (params) {
    return HttpUtils.get(urls.SUBMITNEWFOLDER, params);
  },
  submitDownloadFile: function (params) {
    return HttpUtils.get(urls.SUBMITDOWNLOADFILE, params);
  },
  makeSureDeleteFile: function (params) {
    return HttpUtils.get(urls.MAKESUREDELETEFILE, params);
  },
  submitMoveFile: function (params) {
    return HttpUtils.get(urls.SUBMITMOVEFILE, params);
  },
  submitShareFile: function (params) {
    return HttpUtils.post(urls.SUBMITSHAREFILE, params);
  },
  makeSureModifyFileName:function (params) {
    return HttpUtils.get(urls.MAKESUREMODIFYFILENAME,params);
  },
  searchFileByName:function (params) {
    return HttpUtils.get(urls.SEARCHFILEBYNAME,params);
  }
};


export {cloudDiskSrv};
