/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-21 16:28:43
 * @name 设置密码
 */

<template>
  <div id="setPwd" :style="{ height: bodyHeight + 'px' }">
    <div class="top">
      <!-- 头部 -->
      <v-header :title="title"></v-header>
      <!-- 内容区 -->
      <div class="content_input">
        <van-cell-group>
          <van-field
            v-model="pwd"
            maxlength="18"
            type="password"
            placeholder="请输入密码（6-18位，数字+字母）"
          />
        </van-cell-group>
        <van-cell-group>
          <van-field v-model="rePwd" type="password" placeholder="请确认新密码"/>
        </van-cell-group>
      </div>
      <!-- 提交按钮 -->
      <v-button :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>
    </div>
    <div class="tel">
      <a href="tel:4000909975">客服电话：4000909975</a>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";

import { Cell, CellGroup, Toast } from "vant";
import { setTimeout } from "timers";

export default {
  name: "setPwd",
  data() {
    return {
      // 组件数据
      title: "",
      buttonText: "完成",
      buttonClass: { width: "83vw" },
      // 本页数据
      phone: "",
      verificationCode: "",
      pwd: "",
      rePwd: "",
      randomNumber: "", // 忘记密码key
      bodyHeight: 0,
      key: "" // 微信登录key
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  mounted: function() {
    window.setTimeout(() => {
      this.bodyHeight = document.documentElement.clientHeight;
    }, 10)
    this.title = this.$route.query.title;
    if (this.$route.query.randomNumber) {
      this.randomNumber = this.$route.query.randomNumber;
    }
    if (this.$route.query.phone) {
      this.phone = this.$route.query.phone;
      this.verificationCode = this.$route.query.verificationCode;
    }
    if (this.$route.query.key) {
      this.key = this.$route.query.key;
    }
  },
  methods: {
    sonFun() {
      this.submit();
    },
    submit() {
      if (!this.pwd) {
        Toast("请填写您的新密码");
        return;
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(this.pwd)) {
        Toast("请输入正确格式的新密码");
        this.pwd = "";
        this.rePwd = "";
        return;
      }
      if (!this.rePwd) {
        Toast("请再次输入您的新密码");
        return;
      }
      if (this.pwd != this.rePwd) {
        Toast("两次密码不一致，请确认密码");
        this.rePwd = "";
        return;
      }

      // 忘记密码的设置密码
      if (this.randomNumber) {
        this.$http
          .request({
            method: "post",
            url: "/SUserController/forgetPasswordBySetPassword",
            body: {
              key: this.randomNumber,
              password: this.pwd
            }
          })
          .then(res => {
            let data = res.data;
            if (data.success) {
              Toast("密码设置成功");
              setTimeout(() => {
                // 密码登录
                if (!this.scienceWX) {
                  this.$router.push({
                    path: "../loginRegistered/login",
                    query: { loginType: 2 }
                  });
                } else {
                  this.$routerWX.push({
                    path: "../loginRegistered/login",
                    query: { loginType: 2 }
                  });
                }
              }, 1000);
            } else {
              Toast(data.message);
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      } else if (this.phone) {
        // 验证码登录的设置密码
        this.$http
          .request({
            method: "post",
            url: "/SUserController/setPasswordLogin",
            body: {
              phone: this.phone,
              verificationCode: this.verificationCode,
              password: this.pwd
            }
          })
          .then(res => {
            let data = res.data;
            if (data.code == "3") {
              Toast("密码设置成功");
              let serviceToken = res.headers["x-auth-token"] ? res.headers["x-auth-token"] : res.headers["X-Auth-Token"];
              window.localStorage.setItem("serviceToken", serviceToken);
              setTimeout(() => {
                // 首页
                if (!this.scienceWX) {
                  this.$router.push({ path: "../" });
                } else {
                  this.$routerWX.push({ path: "../" });
                }
              }, 1000);
            } else if (data.code == "1") {
              Toast(data.message);
              setTimeout(() => {
                // 首页
                if (!this.scienceWX) {
                  this.$router.push({ path: "./login" });
                } else {
                  this.$routerWX.push({ path: "./login" });
                }
              }, 1000);
            } else {
              Toast(data.message);
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      } else if (this.key) {
        // 微信登录设置密码
        this.$http
          .request({
            method: "post",
            url: "/SUserController/wxSetPassword",
            body: {
              key: this.key,
              password: this.pwd
            }
          })
          .then(res => {
            let data = res.data;
            if (data.data.code == "0") {
              Toast("密码设置成功");
              let serviceToken = res.headers["x-auth-token"] ? res.headers["x-auth-token"] : res.headers["X-Auth-Token"];
              window.localStorage.setItem("serviceToken", serviceToken);
              setTimeout(() => {
                // 首页
                if (!this.scienceWX) {
                  this.$router.push({ path: "../" });
                } else {
                  this.$routerWX.push({ path: "../" });
                }
              }, 1000);
            } else if (data.data.code == "3") {
              // 登录超时
              Toast(data.data.msg);
              setTimeout(() => {
                // 首页
                if (!this.scienceWX) {
                  this.$router.push({ path: "./login" });
                } else {
                  this.$routerWX.push({ path: "./login" });
                }
              }, 1000);
            } else {
              Toast(data.message);
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      }
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

#setPwd {
  height: 100%;
  background: @backgroundColorT;

  .top {
    height: 95%;
  }

  .tel {
    height: 5%;
    text-align: center;

    a {
      .fontSize(12);
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @descriptionColor;
    }
  }
}

.content_input {
  margin: 4vw 0 12.8vw;
  padding: 0 8vw;

  .van-hairline--top-bottom::after {
    border-top: none;
  }

  .van-cell {
    .fontSize(15);
    padding: 2.7vw 0;
  }
}
</style>
