/** *@desc 公共头部组件 *@author houpai *@date 2019/07/02 15:19:53 */
<template>
  <div class="common-header">
    <div class="header" :style="[headerClass]" v-if="headerShow">
      <!--左侧区域-->
      <h-left v-if="left"></h-left>
      <div class="header-div header-left" v-else></div>
      <!--文字区域-->
      <div class="header-div header-center" :style="[headerCenterClass]">
        {{ title }}
      </div>
      <!--右侧区域-->
      <h-right
        v-if="right"
        class="header-right"
        :ricon="ricon"
        @rightIconClick="rightIconClick"
        :style="[rightClass]"
      ></h-right>
      <div
        class="header-right"
        @click.stop="rightContentClick"
        :style="[rightClass]"
        v-else
      >
        {{ rightContent }}
      </div>
    </div>
  </div>
</template>

<script>
  import Right from "./Right";
  import Left from "./Left";

  export default {
    name: "common_header",
    components: {
      "h-right": Right,
      "h-left": Left
    },
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
    //  自定义微信标题 必填 否则title不更新
    customTitle: {
      type: String,
      default() {
        return "";
      }
    },
    //  页面头标题
    title: {
      type: String,
      default() {
        return "";
      }
    },
    //左侧图标是否显示 true 显示
    left: {
      type: Boolean,
      default() {
        return true;
      }
    },
      //右侧图标是否显示 true 显示
      right: {
        type: Boolean,
        default() {
          return false;
        }
      },
      //右侧文字内容
      rightContent: {
        type: String,
        default() {
          return "";
        }
      },
      //右侧的图标样式
      ricon: {
        default: "",
        type: String
      },
      //头部组件的自定义属性
    headerClass: {
      default: function () {
        return {};
      },
      type: Object
    },
    rightClass: {
      default: function () {
        return {};
      },
      type: Object
    },
      //头部组件的标题文字自定义属性
      headerCenterClass: {
        default: function () {
          return {};
        },
        type: Object
      },
      // 是否显示头部 默认不显示
      headerShow: {
        type: Boolean,
        default() {
          return false;
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
          let child = document.querySelector("iframe");
          child.parentNode.removeChild(child);
        }, 0);
      };
      $body.appendChild($iframe);
    },
    /**
     * header右侧文字点击事件
     * **/
    rightContentClick() {
      console.log("header右侧点击触发");
      this.$emit("rightContentClick");
    },
    rightIconClick() {
      console.log(this.right);
      if (this.right) {
        console.log("header右侧点击触发");
        this.$emit("rightIconClick");
      }
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

<style scoped lang="less">
.common-header{
  position: fixed;
    z-index: 1999;
    width: 100%;
}
  .header-bottom {
    width: 100%;
    .height(44);
  }

  .header {
    /*width: 100%;*/
    .height(44);
    padding: 0 3%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    color: @titleColor;
    background-color: @backcolor !important;
  }

  .header-div {
    width: auto;
    .fontSize(20);
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }

  .header-left {
    width: 18%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: bold;
    text-align: left;
  }

  .header-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    .fontSize(18);
    width: 0;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }

  .header-right {
    width: 18%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
