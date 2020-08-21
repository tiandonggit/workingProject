import fly from "flyio";
import { Toast } from "vant";
let ToastRequest = "";
import httpConfig from "@/utils/httpConfig";
const host = httpConfig.serviceHost;
//let serviceToken = this.$localStorage.getItem("serviceToken");
//serviceToken = serviceToken ? true : false;
// Add interceptors
fly.config.timeout = 10 * 1000;
fly.interceptors.request.use((config, promise) => {
  // console.log("request");
  // console.log(window.localStorage.getItem("serviceToken"))
  config.headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
    "x-auth-token": window.localStorage.getItem("serviceToken")
  };
  // console.log(config);
  ToastRequest = Toast.loading({
    duration: 0,
    mask: true,
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
    // console.log("response");    // console.log(response.headers["x-auth-token"])
    // console.log(response.headers)
    // console.log(response.headers['X-Auth-Token'])//X-Auth-Token
    // if (response.headers["x-auth-token"] != undefined) {
    //   window.localStorage.setItem(
    //     "serviceToken",
    //     response.headers["x-auth-token"]
    //   );
    //   fly.config.headers = {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "X-Requested-With": "XMLHttpRequest",
    //     "x-auth-token": window.localStorage.getItem("serviceToken")
    //   };
    // }
    // console.log(response.headers["x-auth-token"]);
    // if(response.headers["x-auth-token"]){
    //   // console.log("x-auth-token: "+response.headers["x-auth-token"]);
    //   window.localStorage.setItem(
    //     "serviceToken",
    //     response.headers["x-auth-token"]
    //   );
    // }

    fly.config.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
      //"x-auth-token": window.localStorage.getItem("serviceToken")
    };

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
      // let div = document.createElement("div");
      // let img = document.createElement("img");
      // div.style.position = "fixed";
      // div.style.top = 0;
      // div.style.left = 0;
      // div.style.width = "100vw";
      // div.style.height = "100vh";
      // div.style.zIndex = 999;
      // div.onclick = () => {
      //   window.location.reload();
      // }
      // img.style.width = "100%";
      // img.style.height = "100%";
      // img.setAttribute("src", netPng);
      // div.appendChild(img);
      // document.getElementById("app").appendChild(div);
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
fly.config.baseURL = host;

export default fly;
