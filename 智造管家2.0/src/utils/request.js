import fly from "flyio";
import {serviceHost, servicePort} from "@/utils/httpConfig";
import {Message} from "element-ui";

import store from "../store/index";
// console.log('store.state', store.state.loginData.userMessage);

// Add interceptors
fly.config.timeout = 10000 * 1000;
// Set the base url
fly.config.baseURL = serviceHost;
fly.config.headers = {
  // "X-Requested-With": "XMLHttpRequest",
  // "x-auth-token": window.localStorage.getItem("serviceToken"),
  "Content-Type": "application/x-www-form-urlencoded"
};


fly.interceptors.request.use(request => {
  if (window.localStorage.getItem("serviceToken")) {
    request.headers["x-auth-token"] = window.localStorage.getItem("serviceToken");
    request.headers["X-Requested-With"] = "XMLHttpRequest";
  }
  return request;
});


fly.interceptors.response.use(
  (response, promise) => {
    // if (response.headers["x-auth-token"]) {
    //   window.localStorage.setItem(
    //     "serviceToken",
    //     response.headers["x-auth-token"]
    //   );
    // }

    // 登录失效或者未登录
    if (response.data.code === "00006") {
      Message("登录已过期,请重新登录");
      try {
        store.commit("imData/saveChatList", []);
        store.commit("homeData/imSelectedInfo", {});
        store.commit("homeData/listSelectedInfo", {});
        window.localStorage.removeItem("serverToken");
      } catch (e) {
        console.log(e);
      }
      location.href = location.origin + '/im_webpage/#/login'
    }
  },

  (err, promise) => {
    // Do something with response error
    if (err.status === 0) {
      Message.error("网络连接异常");
      return "网络连接异常";
    } else if (err.status === 1) {
      Message.error("网络连接超时");
      return "网络连接超时";
    } else if (err.status === 401) {
      return "用户未登录";
    } else {
      if (err.response.data.code === "00006") {
        Message("登录已过期,请重新登录");
        try {
          store.commit("imData/saveChatList", []);
          store.commit("homeData/imSelectedInfo", {});
          store.commit("homeData/listSelectedInfo", {});
          window.localStorage.removeItem("serverToken");
        } catch (e) {
          console.log(e);
        }
        location.href = location.origin + '/im_webpage/#/login'
      } else if (err.response.data.message) {
        return err.response.data.message;
      } else {
        Message.error("操作失败");
        return "请求数据失败,请稍后再试";
      }
    }
  }
);

export default fly;
