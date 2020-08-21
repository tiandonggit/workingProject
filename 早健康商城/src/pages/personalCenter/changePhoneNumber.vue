/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-18 17:51:13
 * @name 修改手机号
 */

<template>
  <div id="changePhoneNumber">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <div class="content_input2">
      <van-cell-group>
        <van-field v-model="oldPhoneNum" maxlength="11" type="number" placeholder="请输入原手机号"/>
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="newPhoneNum" maxlength="11" type="number" placeholder="请输入新手机号">
          <van-button slot="button" size="small" @click="getSms()" :text="content"></van-button>
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="verificationCode" type="number" placeholder="请输入验证码"/>
      </van-cell-group>
    </div>
    <!-- 提交按钮 -->
    <v-button :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";

import { Toast } from "vant";
import { setTimeout } from "timers";

export default {
  name: "changePhoneNumber",
  data() {
    return {
      // 组件数据
      title: "修改手机号",
      buttonText: "确认修改",
      buttonClass: { "margin-top": "13.6vw" },
      // 本页数据
      canClick: true,
      totalTime: 60,
      content: "获取验证码", // 按钮里显示的内容
      oldPhoneNum: "",
      newPhoneNum: "",
      verificationCode: ""
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  watch: {
    oldPhoneNum(newValue, oldValue) {
      if (!this.Testnum(newValue)) {
        this.oldPhoneNum = this.oldPhoneNum.replace(/[^0-9]/g, "");
      }
    },
    newPhoneNum(newValue, oldValue) {
      if (!this.Testnum(newValue)) {
        this.newPhoneNum = this.newPhoneNum.replace(/[^0-9]/g, "");
      }
    }
  },
  mounted: function() {},
  methods: {
    getSms() {
      if (!this.canClick) return;
      if (!this.newPhoneNum) {
        Toast("请填写手机号码");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.newPhoneNum)) {
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
            phoneNum: this.newPhoneNum
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
      this.submit();
    },
    submit() {
      if (!this.oldPhoneNum) {
        Toast("请输入原手机号");
        return;
      }

      if (!this.newPhoneNum) {
        Toast("请输入新手机号");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.newPhoneNum)) {
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
          url: "/SUserController/updatePhoneNum", // 修改手机号
          body: {
            oldPhoneNum: this.oldPhoneNum,
            newPhoneNum: this.newPhoneNum,
            verificationCode: this.verificationCode
          }
        })
        .then(res => {
          let data = res.data;
          if (data.code == "0") {
            Toast("修改成功");
            // 显示修改成功跳转账户安全页
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else if (data.code == "1") {
            // 原手机号错误
            Toast(data.message);
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

#changePhoneNumber {
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
