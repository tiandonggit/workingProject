import HttpUtils from "../../utils/http.utils";
import {serviceHost, globalServiceHost} from "../../utils/httpConfig";

const urls = {
  "GETMAILLIST": serviceHost + "ImUserController/selectUserList", // 获取通讯录接口
  "SELECTPROGECT": serviceHost + "project/list", // 查询项目列表
  "GETFILESPACELIST": globalServiceHost.fileDiskServiceHost + "file/fileSpaceList", // 获取文件空间列表
  "SEARCHBYCHATNAME": serviceHost + "ImUserController/selectUserByName", // 搜索通讯录接口
  "SENDMSGSERVER": serviceHost + "ImSeverController/DataToMqByJson", // 发送消息 
  "SAVETOMYWP": serviceHost + "file/saveToMyWP", // 聊天窗口保存文件接口
  "GETGROUPMEMBER": serviceHost + "ImGroupUserController/selectUserListByGroupId", // 获取群成员
  "GETGROUPOUTMEMBER": serviceHost + "ImUserController/selectUserWithoutExists", // 获取除群成员外的成员列表
  "ADDGROUPMEMBER": serviceHost + "ImGroupController/addGroupUser", // 添加群成员 
  "DELETEGROUPMEMBER": serviceHost + "ImGroupController/deleteGroupUser", // 删除群成员
  "OUTFROMGROUP": serviceHost + "ImGroupUserController/getOutFromGroup", // 退出群聊
  "CREATEGROUP": serviceHost + "ImGroupController/insertGroup", // 创建群聊
  "GETSEARCHMEMBER": serviceHost + "ImUserController/selectUserByName", // 成员搜索
};

let homeSrv = {
  getMailList: function (params) {
    return HttpUtils.get(urls.GETMAILLIST, params);
  },
  selectProject: function (params) {
    return HttpUtils.get(urls.SELECTPROGECT, params);
  },
  getFileSpaceList: function (params) {
    return HttpUtils.get(urls.GETFILESPACELIST, params);
  },
  searchByChatName: function (params) {
    return HttpUtils.post(urls.SEARCHBYCHATNAME, params);
  },
  sendMsgServer: function(params) {
    return HttpUtils.post(urls.SENDMSGSERVER, params)
  },
  saveToMyWP: function(params) {
    return HttpUtils.get(urls.SAVETOMYWP, params)
  },
  getGroupMember: function(params) {
    return HttpUtils.get(urls.GETGROUPMEMBER, params)
  },
  getGroupOutMember: function(params) {
    return HttpUtils.get(urls.GETGROUPOUTMEMBER, params)
  },
  addGroupMember: function(params) {
    return HttpUtils.post(urls.ADDGROUPMEMBER, params)
  },
  deleteGroupMember: function(params) {
    return HttpUtils.post(urls.DELETEGROUPMEMBER, params)
  },
  exitFromGroup: function(params) {
    return HttpUtils.post(urls.OUTFROMGROUP, params)
  },
  createGroup: function(params) {
    return HttpUtils.post(urls.CREATEGROUP, params)
  },
  getSearchMember: function(params) {
    return HttpUtils.post(urls.GETSEARCHMEMBER, params)
  }
};

export {homeSrv};
