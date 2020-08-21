/**
 * 错误页面
 */
import netPng from "../assets/images/net.png";
import { Toast } from 'vant';

export let _Vue;

export default {
  install(Vue) {
    // _Vue = Vue;
    // _Vue.mixin({
    //   created: function() {
    //
    //   },
    //   mounted() {},
    //   methods: {
    //     createNETs() {
    //
    //     }
    //   }
    // });
    Vue.prototype.$createNETs = function () {
      let div = document.createElement("div");
      let img = document.createElement("img");
      div.style.position = "fixed";
      div.style.top = 0;
      div.style.left = 0;
      div.style.width = "100vw";
      div.style.height = "100vh";
      div.style.display = "none";
      div.style.zIndex = -100;
      div.id = "net";
      div.onclick = () => {
        // window.location.reload();
      };
      img.style.width = "100%";
      img.style.height = "100%";
      img.setAttribute("src", netPng);
      div.appendChild(img);
      document.getElementById("app").appendChild(div);
      console.log(document.getElementById("app"));
      window.addEventListener("online", function() {
        document.getElementById("net").style.display = "none";
        document.getElementById("net").style.zIndex = -100;
      });
      window.addEventListener("offline", function() {
        document.getElementById("net").style.display = "block";
        document.getElementById("net").style.zIndex = 999;
      });
    }
  }
};
/* eslint-enable */
