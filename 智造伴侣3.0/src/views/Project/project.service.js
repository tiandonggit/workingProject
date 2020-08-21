import HttpUtils from "../../utils/http.utils";
import {
  serviceHost,
  globalServiceHost
} from "../../utils/httpConfig";

const urls = {
  // 项目相关
  "SELECTPROGECT": serviceHost + "project/list", // 查询项目列表
  "CREATEPROGECT": serviceHost + "project/create", // 创建项目
  "UPDATEPROGECTNAME": serviceHost + "project/update", // 修改项目名
  "DELETEPROGECT": serviceHost + "project/delete", // 删除项目

  // 清单相关
  "NEWLIST": serviceHost + "project/newList", // 添加清单
  "UPDATELIST": serviceHost + "project/updateList", // 修改清单名
  "DELETELIST": serviceHost + "project/deleteList", // 删除清单
  "LIST": serviceHost + "task/list", // 清单列表
  "CREATETASK": serviceHost + "task/create", // 新建任务
  "UPDATETASK": serviceHost + "task/update", // 更新任务
  "DELETETASK": serviceHost + "task/delete", // 删除任务

  // 成员相关
  "GETPROGECTMEMBER": serviceHost + "project/userList", // 获取项目成员
  "GETPROGECTOUTMEMBER": serviceHost + "project/usersToInvite", // 获取项目外成员
  "PROGECTADDMEMBER": serviceHost + "project/addUser", // 添加项目成员
  "PROGECTDELETEMEMBER": serviceHost + "project/deleteUser", // 删除项目成员
  "PROGECTUPDATEMEMBER": serviceHost + "project/updateUser", // 更新项目成员，修改成员权限

  // 标签相关
  "SELECTTAGS": serviceHost + "project/tags", // 查询标签
  "DELETETAGS": serviceHost + "project/deleteTag", // 删除标签
  "UPDATETAGS": serviceHost + "project/updateTag", // 更新标签
  "ADDTAGS": serviceHost + "project/addTag", // 添加标签

  // 字段相关
  "SELECTFIELDS": serviceHost + "project/fields", // 自定义字段
  "ADDFIELD": serviceHost + "project/addField", // 添加自定义字段
  "REMOVEFIELD": serviceHost + "project/removeField", // 删除字段

  // 弹窗详情相关
  "GETTASKDETAIL": serviceHost + "task/detail", // 任务详情弹窗
  "TASKDETAILUPDATE": serviceHost + "task/update", // 任务详情update
  "ADDTASKTAGS": serviceHost + "task/addTag", // 给任务添加标签
  "REMOVETASKTAGS": serviceHost + "task/removeTag", // 给任务移除标签
  "ADDSUBTASK":serviceHost + 'task/create', // 创建子任务
  'GETFIELDS':serviceHost + 'project/fields', // 查询自定义字段
  'ADDFIELDFORTASK':serviceHost + 'task/addField',// 给任务添加自定义字段
  'DELETEFIELDFORTASK':serviceHost + 'task/removeField', // 给任务删除自定义字段
  'SETFIELDVALUE':serviceHost + 'task/setField', // 给自定义字段设置值
};

let projectSrv = {
  selectProject: function (params) {
    return HttpUtils.get(urls.SELECTPROGECT, params);
  },
  createProject: function (params) {
    return HttpUtils.get(urls.CREATEPROGECT, params);
  },
  updateProjectName: function (params) {
    return HttpUtils.get(urls.UPDATEPROGECTNAME, params);
  },
  deleteProject: function (params) {
    return HttpUtils.get(urls.DELETEPROGECT, params);
  },

  newList: function (params) {
    return HttpUtils.get(urls.NEWLIST, params);
  },
  updateList: function (params) {
    return HttpUtils.get(urls.UPDATELIST, params);
  },
  deleteList: function (params) {
    return HttpUtils.get(urls.DELETELIST, params);
  },
  list: function (params) {
    return HttpUtils.get(urls.LIST, params);
  },
  createTask: function (params) {
    return HttpUtils.get(urls.CREATETASK, params);
  },
  updateTask: function (params) {
    return HttpUtils.get(urls.UPDATETASK, params);
  },
  deleteTask: function (params) {
    return HttpUtils.get(urls.DELETETASK, params);
  },

  getProjectMember: function (params) {
    return HttpUtils.get(urls.GETPROGECTMEMBER, params);
  },
  getProjectOutMember: function (params) {
    return HttpUtils.get(urls.GETPROGECTOUTMEMBER, params);
  },
  projectAddMember: function (params) {
    return HttpUtils.get(urls.PROGECTADDMEMBER, params);
  },
  projectDeleteMember: function (params) {
    return HttpUtils.get(urls.PROGECTDELETEMEMBER, params);
  },
  projectUpdateMember: function (params) {
    return HttpUtils.get(urls.PROGECTUPDATEMEMBER, params);
  },

  selectTags: function (params) {
    return HttpUtils.get(urls.SELECTTAGS, params);
  },
  deleteTags: function (params) {
    return HttpUtils.get(urls.DELETETAGS, params);
  },
  updateTags: function (params) {
    return HttpUtils.get(urls.UPDATETAGS, params);
  },
  addTags: function (params) {
    return HttpUtils.get(urls.ADDTAGS, params);
  },

  selectFields: function (params) {
    return HttpUtils.get(urls.SELECTFIELDS, params);
  },
  addField: function (params) {
    return HttpUtils.get(urls.ADDFIELD, params);
  },
  removeField: function (params) {
    return HttpUtils.get(urls.REMOVEFIELD, params);
  },
  getTaskDetail: function (params) {
    return HttpUtils.get(urls.GETTASKDETAIL, params);
  },
  taskDetailUpadate: function (params) {
    return HttpUtils.get(urls.TASKDETAILUPDATE, params);
  },
  addTaskTags: function (params) {
    return HttpUtils.get(urls.ADDTASKTAGS, params);
  },
  removeTaskTags:function (params) {
    return HttpUtils.get(urls.REMOVETASKTAGS,params);
  },
  addSubTask:function (params) {
    return HttpUtils.get(urls.ADDSUBTASK,params);
  },
  getFields:function (params) {
    return HttpUtils.get(urls.GETFIELDS,params);
  },
  addFieldForTask:function (params) {
    return HttpUtils.get(urls.ADDFIELDFORTASK,params);
  },
  deleteFieldForTask:function (params) {
    return HttpUtils.get(urls.DELETEFIELDFORTASK,params)
  },
  setFieldValue:function (params) {
    return HttpUtils.get(urls.SETFIELDVALUE,params);
  }
};

export {
  projectSrv
};
