/*
 * @Author: 田东 
 * @Date: 2019-08-29 10:33:33 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-09-17 17:48:20
 * @name 登录
 */
<template>
  <div class="login_page">
    <common-header :share-disabled="true" :custom-title="'登录'"></common-header>
    <div class="login-box">
      <p class="title">智能柜配送系统</p>
      <van-field v-model="mobile" maxlength="11" type="number" center clearable placeholder="手机号"></van-field>
      <van-field class="verify-code" v-model="sms" type="number" center clearable placeholder="验证码"></van-field>
      <div
        class="get-sms"
        :class="{'disabled': !canClick}"
        slot="button"
        size="small"
        type="primary"
        @click="getSms()"
      >{{content}}</div>
      <van-button class="btn login-btn" size="large" @click="login()">登录</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "login",
  components: {
    commonHeader
  },

  data() {
    return {
      content: "获取验证码", // 按钮里显示的内容
      totalTime: 60, //记录具体倒计时时间
      canClick: true, //添加canClick
      mobile: "",
      sms: ""
    };
  },
  methods: {
    getSms() {
      if (!this.mobile.trim()) {
        Toast("请输入手机号码");
        return;
      }
      if (this.mobile.length !== 11) {
        Toast("请输入长度为11位的电话号码");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.mobile)) {
        Toast("请输入正确格式手机号码");
        return;
      }
      Toast("验证码已发送");
      this.canClick = false;
      this.$http
        .request({
          method: "post",
          url: "/VerificationCode/sendVerificationCode",
          body: { phone: this.mobile }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            console.log(data);
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
      this.content = this.totalTime + "s后重新获取";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新获取";
        if (this.totalTime <= 0) {
          this.content = "重新获取";
          this.totalTime = 60;
          window.clearInterval(clock);
          this.canClick = true; //这里重新开启
        }
      }, 1000);
    },
    login() {
      if (!this.mobile.trim()) {
        Toast("请输入手机号码");
        return;
      }
      if (this.mobile.length !== 11) {
        Toast("请输入长度为11位的电话号码");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.mobile)) {
        Toast("请输入正确格式手机号码");
        return;
      }
      if (!this.sms.trim()) {
        Toast("请输入验证码");
        return;
      }
      this.$http
        .request({
          method: "get",
          url: "/MSupplyUserController/selectPhone",
          body: { phone: this.mobile, code: this.sms }
        })
        .then(res => {
          let data = res.data;
          console.log(data);
          if (data.success) {
            if (data.code === "2") {
              window.localStorage.setItem("memberId", data.data.id);
              this.$router.push({ name: "index" });
            } else {
              Toast(data.message);
            }
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

<style scoped lang="less">
.login_page {
  background: url("../../assets/images/login-bg.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100%;

  .login-box {
    padding: 100px 34px;

    .title {
      font-size: 20px;
      font-family: PingFangSC;
      font-weight: 600;
      color: @titleColor;
      line-height: 28px;
      margin-bottom: 48px;
    }

    .van-field {
      border-radius: 22px;
      padding-left: 20px;
      margin-bottom: 12px;
    }
    .van-cell:not(:last-child)::after {
      border: none;
    }

    .verify-code {
      width: 203px;
      display: inline-block;
    }

    .get-sms {
      float: right;
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: @titleColor;
      line-height: 44px;
      margin-right: 10px;
    }
    .disabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.6;
    }
  }

  .login-btn {
    margin-top: 20px;
  }
}
</style>
