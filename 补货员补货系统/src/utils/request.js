import fly from "flyio";
import { Toast } from "vant";
let ToastRequest = "";
import { serviceHost, servicePort } from "@/utils/httpConfig";

// Add interceptors
fly.config.timeout = 10000 * 1000;
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
  // Add custom headers
  // if (config.method === 'post') {
  //   config.data = this.$qs.stringify(config.data)
  // }

  ToastRequest = Toast.loading({
    duration: 0,
    mask: true,
    message: "加载中..."
  });

  return config;
});
fly.interceptors.response.use(
  (response, promise) => {
    ToastRequest.clear();

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
  }
);

export default fly;
