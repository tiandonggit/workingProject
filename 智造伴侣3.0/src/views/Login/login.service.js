/**
 * @Description: Login模块API
 * @Author: 侯湃
 * @Date: 2020/6/11
 */
import HttpUtils from "../../utils/http.utils";
import {serviceHost, globalServiceHost} from "../../utils/httpConfig";

const urls = {
  "LOGIN": serviceHost + "ImUserController/Login", // 登录接口
  "GETSERVERTOKEN": serviceHost + "ImSeverController/getTokenAndServer", // 获取serverToken接口
};

let loginSrv = {
  login: function (params) {
    return HttpUtils.postToQs(urls.LOGIN, params);
  },
  getServerToken: function (params) {
    return HttpUtils.get(urls.GETSERVERTOKEN, params);
  }
};

export {loginSrv};
