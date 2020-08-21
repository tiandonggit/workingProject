var Fly = require("flyio")
var fly = new Fly
import { serviceHost, servicePort } from "httpConfig";
// Add interceptors111
fly.config.timeout = 10 * 1000;
fly.config.headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};
// Set the base url
fly.config.baseURL = serviceHost;
// if(window.localStorage.getItem("serviceToken")!= null){
//   fly.config.headers = {
//     "Content-Type": "application/x-www-form-urlencoded",
//    "X-Requested-With":"XMLHttpRequest",
//     "x-auth-token": window.localStorage.getItem("serviceToken")
//   };
// }else {
//   fly.config.headers = {
//     "Content-Type": "application/x-www-form-urlencoded",
//   };
// }
fly.interceptors.request.use((config, promise) => {
  console.log(config,"请求参数");
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // Add custom headers
  // if (config.method === 'post') {
  //   config.data = this.$qs.stringify(config.data)
  // }

  return config;
});
fly.interceptors.response.use(
  (response, promise) => {
    wx.hideLoading()
    // if (response.headers["x-auth-token"] != undefined) {
    //   window.localStorage.setItem(
    //       "serviceToken",
    //       response.headers["x-auth-token"]
    //   );
    // }
    // eslint-disable-next-line eqeqeq
    // if (typeof response.data === "string" && response.data != "") {
    //   response.data = JSON.parse(response.data);
    // }
    //
    // if (response.data.success === false) {
    //   console.log(response.data.success);
    // }
    // response.data=Mock.mock(response.data)
    // Do something with response data .
    // Just return the data field of response
  },
  (err, promise) => {
    wx.hideLoading()
    // Do something with response error
    // promise.resolve("ssss")

    if (err.status === 0) {
      return "网络连接异常";
    } else if (err.status === 1) {
      return "网络连接超时";
    } else if (err.status === 401) {
      return "用户未登录";
    } else {
      if (err.response.data.message) {
        return err.response.data.message;
      } else {
        return "请求数据失败,请稍后再试";
      }
    }
  }
);
export default fly;
