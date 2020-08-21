/**
 * 解决hbuilder打包app之后点击手机返回键直接退出app的
 */

import Vue from "vue";
import router from "../router";
let first = null;
//监听返回键
const appback = () => {
  // console.log("监听开始backbutton");
  var webview = plus.webview.currentWebview();
  webview.canBack(function(e) {
    // console.log("返回");
    if (e.canBack) {
      if (!first) {
        plus.nativeUI.toast("再按一次退出应用");
        first = new Date().getTime();
        setTimeout(function() {
          first = null;
        }, 1000);
      } else {
        // console.log("时间差："+new Date().getTime() - first);
        if (new Date().getTime() - first < 1500) {
          plus.runtime.quit();
        }
      }
    }else{
      if (!first) {
        plus.nativeUI.toast("再按一次退出应用");
        first = new Date().getTime();
        setTimeout(function() {
          first = null;
        }, 1000);
      } else {
        // console.log("时间差："+new Date().getTime() - first);
        if (new Date().getTime() - first < 1500) {
          plus.runtime.quit();
        }
      }
    }
    // if (e.canBack) {
      // if (
      //   router.name === "MallHome" ||
      //   router.name === "category" ||
      //   router.name === "shoppingCar" ||
      //   router.name === "personalCenter"
      // ) {
      //   //如果是选项卡就退出app
      //   // 处理逻辑：1秒内，连续两次按返回键，则退出应用
      // var first = null;
      // plus.key.addEventListener(
      //   "backbutton",
      //   function() {
      //     // 首次按键，提示‘再按一次退出应用’
      //     if (!first) {
      //       plus.nativeUI.toast("再按一次退出应用");
      //       first = new Date().getTime();
      //       setTimeout(function() {
      //         first = null;
      //       }, 1000);
      //     } else {
      //       if (new Date().getTime() - first < 1500) {
      //         plus.runtime.quit();
      //       }
      //     }
      //   },
      //   false
      // );
      // } else {
      //   router.back();
      // }
    // } else {
    //   // console.log(first);
    //   if (!first) {
    //     plus.nativeUI.toast("再按一次退出应用");
    //     first = new Date().getTime();
    //     setTimeout(function() {
    //       first = null;
    //     }, 1000);
    //   } else {
    //     // console.log("时间差："+new Date().getTime() - first);
    //     if (new Date().getTime() - first < 1500) {
    //       plus.runtime.quit();
    //     }
    //   }
      // plus.runtime.quit();
      // webview.close() //hide,quit
      // plus.runtime.quit()
      // 首页返回键处理
      // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
      // let first = null;
      // plus.key.addEventListener(
      //   "backbutton",
      //   function() {
      //     // 首次按键，提示‘再按一次退出应用’
      //     if (!first) {
      //       plus.nativeUI.toast("再按一次退出应用");
      //       first = new Date().getTime();
      //       setTimeout(function() {
      //         first = null;
      //       }, 1000);
      //     } else {
      //       if (new Date().getTime() - first < 1500) {
      //         plus.runtime.quit();
      //       }
      //     }
      //   },
      //   false
      // );
    // }
  });
};
// document.addEventListener("plusready", function() {
//   // console.log("监听开始plusready");
//   // var webview = plus.webview.currentWebview();
//   plus.key.addEventListener("backbutton", appback);
// });

if(window.plus){
  plus.key.addEventListener("backbutton", appback);
}else{
  document.addEventListener("plusready",function() {
    plus.key.addEventListener("backbutton", appback);
  },false);
}
Vue.prototype.$appback = appback;
// export let _Vue;

// export function appBack (callack) {
// console.log(1);
// router.beforeEach((to, from, next) => {
//   console.log(to);
//   next();
// });
// console.log(router);
// export default {
//   install(Vue) {
//     if (this.installed && _Vue === Vue) return;
//     this.installed = true;
//     _Vue = Vue;
//     _Vue.mixin({
//       created: function() {
//         let that = this;
//         document.addEventListener("plusready", function() {
//           var webview = plus.webview.currentWebview();
//           plus.key.addEventListener("backbutton", function() {
//             webview.canBack(function(e) {
//               if (e.canBack) {
//                 that.customback();
//                 // that.appback();
//                 // console.log(that.$route.name);
//                 // webview.back();
//               } else {
//                 // webview.close() //hide,quit
//                 // plus.runtime.quit()
//                 // 首页返回键处理
//                 // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
//                 // var first = null;
//                 // plus.key.addEventListener(
//                 //   "backbutton",
//                 //   function() {
//                 //     // 首次按键，提示‘再按一次退出应用’
//                 //     if (!first) {
//                 //       first = new Date().getTime();
//                 //       setTimeout(function() {
//                 //         first = null;
//                 //       }, 1000);
//                 //     } else {
//                 //       if (new Date().getTime() - first < 1500) {
//                 //         plus.runtime.quit();
//                 //       }
//                 //     }
//                 //   },
//                 //   false
//                 // );
//               }
//             });
//           });
//         });
//       },
//       methods: {
//         //自定义返回事件
//         customback() {
//           console.log("返回上一页");
//           // this.$router.back();
//         },
//         //处理app返回
//         appback() {
//           if (
//             this.$route.name === "MallHome" ||
//             this.$route.name === "category" ||
//             this.$route.name === "shoppingCar" ||
//             this.$route.name === "personalCenter"
//           ) {
//             //如果是选项卡就退出app
//             // 处理逻辑：1秒内，连续两次按返回键，则退出应用
//             var first = null;
//             plus.key.addEventListener(
//               "backbutton",
//               function() {
//                 // 首次按键，提示‘再按一次退出应用’
//                 if (!first) {
//                   first = new Date().getTime();
//                   setTimeout(function() {
//                     first = null;
//                   }, 1000);
//                 } else {
//                   if (new Date().getTime() - first < 1500) {
//                     plus.runtime.quit();
//                   }
//                 }
//               },
//               false
//             );
//           } else {
//             this.customback();
//           }
//         }
//       }
//     });
//   }
// }
// };
// export default {appBack}
