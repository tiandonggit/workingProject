import HttpUtils from "../../utils/http.utils";
import {
  serviceHost,
  globalServiceHost
} from "../../utils/httpConfig";

const urls = {
  "MYCREATEDTASKS": serviceHost + "project/myCreated", // 我创建的任务
  "MYTASKS": serviceHost + "project/myProject", // 我的任务
};

let mineSrv = {
  myCreatedTasks: function (params) {
    return HttpUtils.get(urls.MYCREATEDTASKS, params);
  },
  myTasks: function (params) {
    return HttpUtils.get(urls.MYTASKS, params);
  },
};

export {
  mineSrv
};