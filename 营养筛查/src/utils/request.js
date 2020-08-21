import fly from "flyio";
import { Toast } from "vant";
let ToastRequest = "";
import { serviceHost, servicePort } from "@/utils/httpConfig";
// Add interceptors
fly.config.timeout = 30 * 1000;
fly.config.headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};
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
  ToastRequest = Toast.loading({
    duration: 0,
    mask: false,
    message: "加载中..."
  });

  // Add custom headers
  // if (config.method === 'post') {
  //   config.data = this.$qs.stringify(config.data)
  // }

  return config;
});
fly.interceptors.response.use(
  (response, promise) => {
    //获取后台通过http请求头传过来的token
    //后台只有登录接口才带上x-auth-token，其它接口不带，要判断拦截接口，以免获取不到值把undefined赋值上
    // if (response.headers["x-auth-token"] != undefined) {
    //   window.localStorage.setItem(
    //       "serviceToken",
    //       response.headers["x-auth-token"]
    //   );
    // }

    // eslint-disable-next-line eqeqeq
    if (typeof response.data === "string" && response.data != "") {
      response.data = JSON.parse(response.data);
    }

    // if (response.data.code === "C501") {}
    ToastRequest.clear();

    // response.data=Mock.mock(response.data)
    // Do something with response data .
    // Just return the data field of response
  },
  (err, promise) => {
    // Do something with response error
    // promise.resolve("ssss")

    ToastRequest.clear();

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

    // wx.showToast({
    //   title:'网络不流畅，请稍后再试！',
    //   icon:'none',
    // });
  }
);
// Set the base url
fly.config.baseURL = serviceHost;

export default fly;
