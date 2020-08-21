/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-21 16:14:11
 * @name 绑定手机
 */

<template>
  <div id="bindingPhone" :style="{ height: bodyHeight + 'px' }">
    <div class="top">
      <!-- 头部 -->
      <v-header :title="title"></v-header>
      <!-- 内容区 -->
      <div class="content_input">
        <van-cell-group>
          <van-field v-model="phoneNumber" maxlength="11" type="number" placeholder="请输入用户手机号码"/>
        </van-cell-group>
        <van-cell-group>
          <van-field v-model="verificationCode" type="number" placeholder="请输入短信验证码">
            <van-button slot="button" @click="getSms()" size="small" :text="content"></van-button>
          </van-field>
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

import { Cell, CellGroup, Button, Toast } from "vant";

export default {
  name: "bindingPhone",
  data() {
    return {
      // 组件数据
      title: "绑定手机",
      buttonText: "完成",
      buttonClass: { width: "83vw" },
      // 本页数据
      canClick: true,
      totalTime: 60,
      content: "获取验证码", // 按钮里显示的内容
      phoneNumber: "",
      verificationCode: "",
      bodyHeight: 0,
      key: "" // 微信登录返回key绑定手机号需要
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  watch: {
    phoneNumber(newValue, oldValue) {
      if (!this.Testnum(newValue)) {
        this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, "");
      }
    }
  },
  mounted: function() {
    window.setTimeout(() => {
      this.bodyHeight = document.documentElement.clientHeight;
    }, 100)
    this.key = this.$route.query.key;
  },
  methods: {
    getSms() {
      if (!this.canClick) return;
      if (!this.phoneNumber) {
        Toast("请填写手机号码");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.phoneNumber)) {
        Toast("请输入正确格式手机号");
        return;
      }
      this.canClick = false;
      this.sendSms();
      this.content = this.totalTime + "s后重新获取";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新获取";
        if (this.totalTime < 0) {
          this.content = "重新获取验证码";
          this.totalTime = 60;
          window.clearInterval(clock);
          this.canClick = true; //这里重新开启
        }
      }, 1000);
    },
    sendSms() {
      this.$http
        .request({
          method: "post",
          url: "/ApiController/sendSms",
          body: {
            phoneNum: this.phoneNumber
          }
        })
        .then(res => {
          console.log(res.data);
          let data = res.data;
          if (data.success) {
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    sonFun() {
      this.nextStep();
    },
    nextStep() {
      if (!this.phoneNumber) {
        Toast("请填写手机号码");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.phoneNumber)) {
        Toast("请输入正确格式手机号");
        return;
      }
      if (!this.verificationCode) {
        Toast("请输入验证码");
        return;
      }
      this.$http
        .request({
          method: "post",
          url: "/SUserController/bindPhoneNum",
          body: {
            code: this.verificationCode,
            key: this.key,
            phoneNum: this.phoneNumber
          }
        })
        .then(res => {
          // console.log(res.data);
          let data = res.data;
          if (data.data.code == "0") {
            // 绑定成功
            Toast(data.data.msg);
            let serviceToken = res.headers["x-auth-token"] ? res.headers["x-auth-token"] : res.headers["X-Auth-Token"];
            window.localStorage.setItem("serviceToken", serviceToken);
            setTimeout(() => {
              if (!this.scienceWX) {
                this.$router.push({ path: "../" });
              } else {
                this.$routerWX.push({ path: "../" });
              }
            }, 1000);
          } else if (data.data.code == "1") {
            // 设置密码
            if (!this.scienceWX) {
              this.$router.push({
                path: "./setPwd",
                query: { title: "设置密码", key: data.data.key }
              });
            } else {
              this.$routerWX.push({
                path: "./setPwd",
                query: { title: "设置密码", key: data.data.key }
              });
            }
          } else if (data.data.code == "2") {
            Toast(data.data.msg);
          } else if (data.data.code == "3") {
            // 登录超时
            Toast(data.data.msg);
            setTimeout(() => {
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

#bindingPhone {
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

  .van-button {
    border: none;

    span {
      .fontSize(14);
      color: @descriptionColor;
    }
  }
}
</style>
