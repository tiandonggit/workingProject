/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-12 17:45:15
 * @name 修改密码
 */

<template>
  <div id="changePwd2">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <p class="number_hint">您的绑定手机号是{{mobileShow}}，请点击“获取验证码”</p>
    <div class="content_input2">
      <van-cell-group>
        <van-field v-model="verificationCode" type="number" placeholder="请输入验证码">
          <van-button @click="getSms()" slot="button" size="small" :text="content"></van-button>
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="newPwd" maxlength="18" type="password" placeholder="设置新密码 6-18位字符，含数字、字母"/>
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="reNewPwd" maxlength="18" type="password" placeholder="确认新登录密码"/>
      </van-cell-group>
    </div>
    <a class="other_way" @click="otherWay()">其他方式</a>
    <div class="clearfix"></div>
    <!-- 提交按钮 -->
    <v-button :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";

import { Cell, CellGroup, Button, Toast } from "vant";

export default {
  name: "changePwd2",
  data() {
    return {
      // 组件数据
      title: "修改密码",
      buttonText: "确认修改",
      buttonClass: {},
      // 本页数据
      canClick: true,
      totalTime: 60,
      content: "获取验证码", // 按钮里显示的内容
      mobile: "",
      mobileShow: "", // 显示脱敏后手机号
      verificationCode: "",
      newPwd: "",
      reNewPwd: ""
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  mounted: function() {
    this.getMobile();
  },
  methods: {
    getMobile() {
      this.$http
        .request({
          method: "get",
          url: "/SUserController/selectPhone", // 获取手机号
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.mobile = data.data;
            this.mobileShow = data.data.replace(/(\d{3})\d*(\d{4})/,'$1****$2');
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    sonFun() {
      this.submit();
    },
    otherWay() {
      if (!this.scienceWX) {
        this.$router.replace({ path: "./changePwd" });
      } else {
        this.$routerWX.replace({ path: "./changePWd" });
      }
    },
    getSms() {
      if (!this.canClick) return;
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
            phoneNum: this.mobile
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
    submit() {
      if (!this.verificationCode) {
        Toast("请输入验证码");
        return;
      }
      if (!this.newPwd) {
        Toast("请填写您的新密码");
        return;
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(this.newPwd)) {
        Toast("请输入正确格式的新密码");
        this.newPwd = "";
        this.reNewPwd = "";
        return;
      }
      if (!this.reNewPwd) {
        Toast("请再次输入您的新密码");
        return;
      }
      if (this.newPwd != this.reNewPwd) {
        Toast("两次密码不一致，请确认密码");
        this.reNewPwd = "";
        return;
      }

      this.$http
        .request({
          method: "post",
          url: "/SUserController/amendPasswordByCode", // 根据手机验证码修改密码
          body: {code: this.verificationCode, password: this.newPwd }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            Toast("修改成功");
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000) 
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
.clearfix::after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}

#changePwd2 {
  .number_hint {
    .fontSize(12);
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    color: @defaultPhoneColor;
    margin: 2.4vw 0 1.9vw 3.2vw;
  }

  .content_input2 {
    .van-hairline--top-bottom::after {
      border-top: none;
    }

    .van-cell {
      .fontSize(15);
      padding: 2.7vw 3.2vw;
    }

    .van-button {
      border: none;

      span {
        .fontSize(14);
        color: @mainColor;
      }
    }
  }

  .other_way {
    .fontSize(15);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: @mainColor;
    float: right;
    margin: 3.1vw 3.5vw 6.5vw 0;
  }
}
</style>
