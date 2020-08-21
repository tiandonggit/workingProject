/*
 * @Author: 田东 
 * @Date: 2019-09-03 11:00:02 
 * @Last Modified by:   田东 
 * @Last Modified time: 2019-09-03 11:00:02 
 */

<template>
  <div class="common-header"></div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  name: "common_header",
  props: {
    // 是否禁用微信分享按钮
    shareDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // 是否监听返回按钮并重定向
    backRedirect: {
      type: String,
      default() {
        return "";
      }
    },
    // 是否监听关闭按钮并重定向
    closeRedirect: {
      type: String,
      default() {
        return "";
      }
    },
    //  自定义标题 必填 否则title不更新
    customTitle: {
      type: String,
      default() {
        return "";
      }
    }
  },
  watch: {
    customTitle: function() {
      this.ChangePageTitle(this.customTitle);
    }
  },
  methods: {
    pushHistory() {
      let state = {
        title: "title",
        url: "#"
      };
      window.history.pushState(state, state.title, state.url);
    },
    /**
     * 重定向返回按钮
     * backRedirect为路由名 **/
    handle() {
      console.log("监听到浏览器返回事件", this.backRedirect);
      try {
        this.$router.push({ path: this.backRedirect });
        // window.location.href = this.backRedirect; // 在这里指定其返回的地址
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 微信禁止分享
     * 需要在微信内打开才有效
     * 并且需要weixin-js-sdk依赖包**/
    onBridgeReady() {
      if (this.shareDisabled) {
        try {
          WeixinJSBridge.call("hideOptionMenu");
        } catch (e) {
          console.log(e);
        }
      }
    },
    /**
     *  改变网页title标题
     *  因为微信在首次加载页面初始化title后，就再也不监听 document.title的change事件。
     * 解决思路：给页面加上一个内容为空的iframe，随后立即删除这个iframe，这时候会刷新title。
     * @params title 标题名**/
    ChangePageTitle(title) {
      let $body = document.getElementsByTagName("body")[0];
      document.title = title;
      let $iframe = document.createElement("iframe");
      $iframe.style.display = "none";
      $iframe.onload = function() {
        setTimeout(function() {
          // $iframe.off('load').remove();
          $body.removeChild($iframe);
        }, 0);
      };
      $body.appendChild($iframe);
    }
  },
  created() {
    if (this.shareDisabled) {
      document.addEventListener("WeixinJSBridgeReady", this.onBridgeReady);
    }
    if (this.backRedirect) {
      this.pushHistory();
      window.addEventListener("popstate", this.handle, false);
    }
    // if (this.customTitle) {
      this.ChangePageTitle(this.customTitle);
    // }
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.handle, false);
    document.removeEventListener("WeixinJSBridgeReady", this.onBridgeReady);
  }
};
</script>

<style scoped>
.common-header {
  height: 0;
}
</style>
