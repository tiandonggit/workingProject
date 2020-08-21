/*
 * @Author: 田东 
 * @Date: 2019-05-09 10:32:19 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-12 18:02:57
 * @name 个人中心
 */


<template>
  <div id="personalCenter">
    <div class="top">
      <i class="iconfont iconshezhi" @click="goSystemSettings"></i>
      <i class="iconfont iconxiaoxi1" @click="goVerified()"></i>
    </div>

    <div class="card">
      <div class="img_box">
        <img v-if="isLogin" @click="goPersonInfo()" :src="data.userInfo.img" alt>
        <img v-else @click="goLogin()" :src="defaultImg" alt>
      </div>
      <span v-if="isLogin" @click="goPersonInfo()">{{data.userInfo.nickname}}</span>
      <span v-else @click="goLogin()">登录/注册</span>
    </div>

    <div class="tabs">
      <van-row>
        <van-col span="6">
          <a @click="myOrder(0)">
            <i class="iconfont iconquanbudingdan"></i>
            <p class="tab_title">全部订单</p>
          </a>
        </van-col>
        <van-col span="6">
          <a @click="myOrder(1)">
            <i class="iconfont icondaifukuan">
              <div class="badge" v-if="data.noPayCount > 0">{{data.noPayCount}}</div>
            </i>
            <p class="tab_title">待付款</p>
          </a>
        </van-col>
        <van-col span="6">
          <a @click="myOrder(2)">
            <i class="iconfont icondaifahuo">
              <div class="badge" v-if="data.noDeliverCount > 0">{{data.noDeliverCount}}</div>
            </i>
            <p class="tab_title">待发货</p>
          </a>
        </van-col>
        <van-col span="6">
          <a @click="myOrder(3)">
            <i class="iconfont icondaishouhuo">
              <div class="badge" v-if="data.noTakeCount > 0">{{data.noTakeCount}}</div>
            </i>
            <p class="tab_title">待收货</p>
          </a>
        </van-col>
      </van-row>
    </div>

    <div class="list">
      <div class="cell" @click="goCollect()">
        <i class="iconfont iconshoucang"></i>
        <span>收藏</span>
      </div>
      <div class="cell" @click="goAddressList()">
        <i class="iconfont icondingwei"></i>
        <span>地址管理</span>
      </div>
      <div class="cell" @click="goVerified()">
        <i class="iconfont iconshimingrenzheng"></i>
        <span>实名认证</span>
      </div>
    </div>
    <div class="list">
      <div class="cell" @click="goProblem()">
        <i class="iconfont iconchangjianwenti"></i>
        <span>常见问题</span>
      </div>
      <div class="cell" @click="goVerified()">
        <i class="iconfont iconyijianfankui"></i>
        <span>意见反馈</span>
      </div>
      <div class="cell" @click="onlineService(4000909975)">
        <i class="iconfont iconkefu"></i>
        <span>在线客服</span>
      </div>
    </div>
    <Tabber></Tabber>
  </div>
</template>

<script>
import Tabber from "@/components/Tabber";

import { Row, Col, Dialog, Toast, Badge, BadgeGroup } from "vant";

export default {
  name: "personalCenter",
  data() {
    return {
      isLogin: false,
      defaultImg:
        "http://pfks-oss-center.oss-cn-beijing.aliyuncs.com/FFA39D19F7D4451AB657401E43C09E19.png",
      data: {}
    };
  },
  components: { Tabber: Tabber },
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
            } else {
              this.$store.commit("Home/shopCardNum", 0); // 更新购物车数量
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
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
    // 系统设置
    goSystemSettings() {
      if (!this.scienceWX) {
        this.$router.push({ path: "./systemSettings" });
      } else {
        this.$routerWX.push({ path: "./systemSettings" });
      }
    },
    // 我的订单
    myOrder(active) {
      window.localStorage.setItem("orderActive", active);
      if (this.isLogin) {
        if (!this.scienceWX) {
          this.$router.push({ path: "../order/myOrder" });
        } else {
          this.$routerWX.push({ path: "../order/myOrder" });
        }
      } else {
        this.needLoginDialog();
      }
    },
    // 收藏
    goCollect() {
      if (this.isLogin) {
        Toast("暂未开通请稍后");
      } else {
        this.needLoginDialog();
      }
    },
    // 地址管理
    goAddressList() {
      if (this.isLogin) {
        window.localStorage.setItem("toAddressList", "personalCenter");
        if (!this.scienceWX) {
          this.$router.push({
            path: "./addressList"
          });
        } else {
          this.$routerWX.push({
            path: "./addressList"
          });
        }
      } else {
        this.needLoginDialog();
      }
    },
    // 实名认证、意见反馈  公共均为开通 共用一个方法
    goVerified() {
      if (this.isLogin) {
        Toast("暂未开通请稍后");
      } else {
        this.needLoginDialog();
      }
    },
    // 常见问题
    goProblem() {
      if (!this.scienceWX) {
        this.$router.push({ path: "./problem" });
      } else {
        this.$routerWX.push({ path: "./problem" });
      }
    },
    // 在线客服
    onlineService(mobile) {
      window.location.href = "tel:4000909975";
    },
    // 未登录时弹出需要登录窗口
    needLoginDialog() {
      Dialog.confirm({
        title: "",
        message: "您尚未登录无法查看该内容，请先登录",
        confirmButtonText: "去登录"
      })
        .then(() => {
          this.goLogin();
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}

#personalCenter {
  height: 100%;
  height: 667px;
  background: @backgroundColor;
  background-image: url("../../assets/images/personCenter.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 0 0;

  .top {
    text-align: right;
    color: @backgroundColorT;
    padding: 3.9vw 3.3vw 4.9vw 0;

    i {
      .fontSize(24);
    }

    .iconshezhi {
      .fontSize(26);
      margin-right: 3.2vw;
    }
  }

  .card {
    height: 36.5vw;
    width: 93.5vw;
    margin: 0 auto;
    background-image: url("../../assets/images/personCenter2.png");
    background-repeat: no-repeat;
    background-size: 93.5vw;
    background-position: 0 0;
    padding: 11.6vw 10.2vw;
    align-items: center;
    display: flex;

    .img_box {
      width: 13.3vw;
      height: 13.3vw;
      border-radius: 6.7vw;
      overflow: hidden;
      display: inline-block;
      margin-right: 6vw;

      img {
        width: 100%;
      }
    }

    span {
      .fontSize(18);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 53.8vw;
      overflow: hidden;
    }
  }

  .tabs {
    background: @backgroundColorT;
    margin-top: 3vw;
    padding: 3.2vw 0 3.5vw;
    text-align: center;

    .iconfont {
      .fontSize(28);
      color: @titleColor;
      position: relative;

      .badge {
        position: absolute;
        right: 0;
        top: 0;
        color: @fontOne;
        .fontSize(12);
        font-weight: 500;
        font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
        text-align: center;
        box-sizing: border-box;
        padding: 0.2vw 0.4vw 0;
        min-width: 4.3vw;
        line-height: 3.7vw;
        border: 1px solid @mainColor;
        border-radius: 4.3vw;
        background-color: @mainColor;
        -webkit-transform: translateX(50%);
        transform: translateX(50%);
        -webkit-transform-origin: 100%;
        transform-origin: 100%;
      }
    }

    .tab_title {
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;
    }
  }

  .list {
    margin-top: 3vw;
    padding: 0 2.7vw;
    background: @backgroundColorT;

    .cell {
      height: 10.7vw;
      align-items: center;
      display: flex;

      &:not(:first-child) {
        border-top: 1px solid @borderColor;
      }

      i {
        .fontSize(22);
      }

      .iconshoucang {
        color: @iconshoucang;
      }

      .icondingwei {
        color: @icondingwei;
      }

      .iconshimingrenzheng {
        color: @iconshimingrenzheng;
      }

      .iconchangjianwenti {
        color: @iconchangjianwenti;
      }

      .iconyijianfankui {
        color: @iconyijianfankui;
      }

      .iconkefu {
        color: @iconkefu;
      }

      a {
        display: block;
        width: 100%;

        span {
          vertical-align: text-bottom;
        }
      }

      span {
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
        margin-left: 3.3vw;
      }
    }
  }
}
</style>
