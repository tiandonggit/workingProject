/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-24 11:32:52
 * @name 系统设置
 */

<template>
  <div id="systemSettings">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <div v-if="isLogin" class="head_portrait_box" @click="goPersonInfo()">
      <van-cell :title="data.userInfo.nickname" :icon="data.userInfo.img" is-link/>
    </div>
    <div v-else class="head_portrait_box" @click="goLogin()">
      <van-cell :title="loginText" :icon="defaultImg" is-link/>
    </div>
    <div class="dividing">
      <van-cell title="账户安全" @click="toAccountSafety()" is-link/>
    </div>
    <van-cell-group>
      <!-- <van-cell title="清理缓存" @click="clearCache()" :value="cacheValue" is-link/> -->
      <van-cell
        title="版本更新"
        @click="versionUpdate()"
        :class="{new_version: isHasNewVersion}"
        is-link
      />
      <van-cell title="关于" @click="about()" is-link/>
    </van-cell-group>

    <!-- 提交按钮 -->
    <v-button v-if="isLogin" :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";

import { Cell, CellGroup, Dialog, Toast } from "vant";
import { setTimeout } from "timers";

export default {
  name: "systemSettings",
  data() {
    return {
      // 组件数据
      title: "系统设置",
      buttonText: "退出登录",
      buttonClass: { "margin-top": "41.3vw" },

      // 本页数据
      isLogin: false,
      defaultImg:
        "http://pfks-oss-center.oss-cn-beijing.aliyuncs.com/FFA39D19F7D4451AB657401E43C09E19.png",
      data: {
        userInfo: {
          img: this.defaultImg
        }
      },
      loginText: "登录/注册",
      cacheValue: "15.3M",
      isHasNewVersion: false // 是否有新版本
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  mounted: function() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .request({
          method: "get",
          url: "/SUserController/selectMine",
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.data = data.data;
            this.isLogin = true;
            if (!this.data.userInfo.img) {
              this.data.userInfo.img = this.defaultImg; // 未上传头像时显示默认头像
            }
          } else {
            if (data.code !== "00006") {
              Toast(data.message);
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 判断是否登录
    judgeIsLogin() {},
    // 登录注册
    goLogin() {
      if (!this.scienceWX) {
        this.$router.push({ path: "../loginRegistered/login" });
      } else {
        this.$routerWX.push({ path: "../loginRegistered/login" });
      }
    },
    // 个人信息
    goPersonInfo() {
      if (!this.scienceWX) {
        this.$router.push({ path: "./personInfo" });
      } else {
        this.$routerWX.push({ path: "./personInfo" });
      }
    },
    // 账号安全
    toAccountSafety() {
      if (this.isLogin) {
        if (!this.scienceWX) {
          this.$router.push({ path: "./accountSafety" });
        } else {
          this.$routerWX.push({ path: "./accountSafety" });
        }
      } else {
        Dialog.confirm({
          title: "",
          message: "您尚未登录，无法使用该功能，是否去登录？",
          confirmButtonText: "去登录"
        })
          .then(() => {
            this.goLogin();
          })
          .catch(() => {});
      }
    },
    // 清理缓存
    clearCache() {
      Dialog.confirm({
        title: "",
        message: "确定清除本地缓存吗？",
        confirmButtonText: "清除"
      })
        .then(() => {
          this.cacheValue = "0M";
          Toast("已清理");
        })
        .catch(() => {});
    },
    // 版本更新
    versionUpdate() {
      if (this.isHasNewVersion) {
        Dialog.confirm({
          title: "",
          message: "有新的版本可更新，是否更新新的版本？",
          confirmButtonText: "更新"
        })
          .then(() => {
            Toast("已更新");
          })
          .catch(() => {});
      } else {
        Toast("您所使用的已是最新版本");
      }
    },
    // 关于
    about() {
      // Toast("该功能暂未开放！");
      // return;
      if (!this.scienceWX) {
        this.$router.push({ path: "./about" });
      } else {
        this.$routerWX.push({ path: "./about" });
      }
    },
    sonFun() {
      this.exit();
    },
    // 退出登录
    exit() {
      this.$http
        .request({
          method: "post",
          url: "/SUserController/logout",
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.$localStorage.removeItem("serviceToken"); // 清除token
            this.$store.commit("Home/shopCardNum", 0); // 更新购物车数量
            Toast("您已退出, 请重新登录");
            setTimeout(() => {
              this.goLogin();
            }, 1000);
          } else {
            if (data.code == "00006") {
              Toast("您已退出");
              this.isLogin = false;
            } else {
              Toast(data.message);
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

html {
  height: 100%;
  background: @backgroundColor;
}

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}

#systemSettings {
  .head_portrait_box {
    .van-cell {
      line-height: 13.3vw;

      .van-icon {
        height: 13.3vw;
        line-height: 13.3vw;
      }
      .van-cell__left-icon {
        width: 13.3vw;
        margin-right: 4.5vw;
        border-radius: 6.7vw;
        overflow: hidden;
      }
    }
  }

  .dividing {
    margin: 3.5vw 0;
  }

  .van-cell__title {
    color: @titleColor;
    .fontSize(16);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
  }

  .van-cell__value {
    color: @subtitleColor;
    .fontSize(15);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
  }

  .new_version {
    .van-icon {
      &::after {
        position: absolute;
        top: 0;
        right: -3px;
        width: 8px;
        height: 8px;
        background-color: @orderStatusColor;
        border-radius: 100%;
        content: " ";
      }
    }
  }
}
</style>
