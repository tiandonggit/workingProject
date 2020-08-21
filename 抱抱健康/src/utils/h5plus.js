/* eslint-disable */
export let _Vue;
export default {
  install(Vue) {
    if (this.installed && _Vue === Vue) return;
    this.installed = true;
    _Vue = Vue;
    _Vue.prototype.NOTICE = true;
    _Vue.mixin({
      created: function() {
        //  if (this.NOTICE)
      },
      mounted() {},
      methods: {
        test: function() {
          console.log("mixin test");
        },
        //h5plus初始化
        init() {
          console.log("h5plus初始化");
          document.addEventListener("touchstart", this.shield, false); //取消浏览器的所有事件，使得active的样式在手机上正常生效
          document.oncontextmenu = this.shield; //屏蔽选择函数
          if (window.plus) {
            this.plusReady();
          } else {
            document.addEventListener("plusready", this.plusReady, false);
          }
          // DOMContentLoaded事件处理
          document.addEventListener(
            "DOMContentLoaded",
            function() {
              // gInit();
              document.body.onselectstart = this.shield;
            },
            false
          );
        },
        shield() {
          return false;
        },
        plusReady() {
          console.log("初始化启动：plusReady");
          var ws = null;
          ws = plus.webview.currentWebview();
          plus.key.addEventListener("backbutton", function() {
                  window.history.back();
            },
            false
          );
        }
      }
    });
  }
};
/* eslint-enable */
