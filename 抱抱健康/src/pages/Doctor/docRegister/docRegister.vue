/* *@Description: 注册页面 *@Author: tiandong *@Date: 2020-1-2 11:37 */
<!---->
<template>
  <div id="docRegister">
    <common-header
      :share-disabled="true"
      :custom-title="'登录 - 注册'"
    ></common-header>
    <div class="authForm">
      <div class="number-box">
        <div class="left">+86</div>
        <div class="right">
          <van-field
            maxlength="11"
            type="number"
            v-model="phoneNum"
            placeholder="请输入11位手机号码"
          />
        </div>
      </div>
      <div class="code-box">
        <van-field
          v-model="codeTest"
          maxlength="6"
          type="number"
          clearable
          placeholder="请输入6位验证码"
        >
          <van-button
            slot="button"
            size="small"
            class="send-code"
            @click="sendCode"
            :text="content"
          ></van-button
          >>
        </van-field>
      </div>
    </div>

    <div class="register-footer-box">
      <div class="agreement">
        注册登录成功即同意
        <span class="protocal" @click.stop="readAgreement('4')">
          《抱抱健康用户协议》
        </span>
        <span class="protocal" @click.stop="readAgreement('2')">
          《隐私政策》
        </span>
        <span class="protocal" @click.stop="readAgreement('5')">
          《礼品商城使用规则》
        </span>
        <span class="protocal" @click.stop="readAgreement('6')">
          《健康咨询服务协议》
        </span>
      </div>
      <van-button slot="button" class="next-btn" size="large" @click="goNext">
        下一步
      </van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "docRegister",
  data() {
    return {
      phoneNum: "",
      codeTest: "",
      totalTime: 60,
      clock: null,
      content: "发送验证码",
      isScend: false
    };
  },
  components: {
    commonHeader
  },
  methods: {
    //发送验证码
    sendCode() {
      if (!this.TestPhone(this.phoneNum)) {
        Toast("请正确填写手机号码");
        return;
      }

      if (this.totalTime >= 0 && this.totalTime < 60 && this.isScend) {
        Toast("验证码已发送，请60s后获取");
        return;
      }

      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/selectDocPhone",
          body: {
            phone: this.phoneNum
          }
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.data == 1) {
              Toast("手机号已被注册");
            } else {
              this.$http
                .request({
                  method: "post",
                  url: "/VerificationCode/sendVerificationCode",
                  body: {
                    phone: this.phoneNum
                  }
                })
                .then(res => {
                  if (res.data.success) {
                    Toast("验证码已发送，请注意查收！");
                  } else {
                    Toast("验证码发送失败");
                  }
                })
                .catch(error => {
                  Toast("验证码发送失败");
                });

              this.isScend = true;
              this.content = this.totalTime + "s";
              this.clock = window.setInterval(() => {
                this.totalTime--;
                this.content = this.totalTime + "s";
                if (this.totalTime == 0) {
                  this.totalTime = 60;
                  this.isScend = false;
                  this.content = "获取验证码";
                  window.clearInterval(this.clock);
                }
              }, 1000);
            }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          console.log('error: ', error);
        });
    },
    //下一步
    goNext() {
      if (!this.TestPhone(this.phoneNum)) {
        Toast("请填先写手机号码");
        return;
      }
      if (!this.codeTest) {
        Toast("请填写验证码");
        return;
      }
      if (!this.TestTestCode(this.codeTest)) {
        Toast("请填写正确验证码");
        return;
      }
      this.$http
        .request({
          method: "get",
          url: "/VerificationCode/getCode",
          body: {
            phone: this.phoneNum,
            code: this.codeTest
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            Toast(res.data.message);
          } else if (res.data.code == 2) {
            this.submit();
          } else if (res.data.code == 3) {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          console.log('error: ', error);
        });
    },
    //提交手机号
    submit() {
      this.$http
        .request({
          method: "post",
          url: "/RDoctorController/setPhone",
          body: {
            phone: this.phoneNum
          }
        })
        .then(res => {
          if (res.data.success) {
            this.$router.push({
              name: "infoID"
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          console.log('error: ', error);
        });
    },
    /**
     * 查看协议**/
    readAgreement(type) {
      this.$router.push({
        name: "agreement",
        params: {
          type: type
        }
      });
    }
  },
  watch: {},
  destroyed() {
    this.clock = null;
  }
};
</script>

<style lang="less" scoped>
#docRegister {
  // overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: @backgroundColor;
  .padding(0, 12, 0, 12);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.authForm {
  flex: 1;
  min-height: 107vw;
  width: 100%;
  .margin(97, 0, 0, 0);
  text-align: center;

  .number-box,
  .code-box {
    box-sizing: border-box;
    .height(48);
    .borderRadius(10, 10, 10, 10);
    background-color: @backgroundColorT;
    .margin(0, 0, 20, 0);
    .padding(12, 0, 0, 47);

    /deep/ .van-cell {
      padding: 0;

      input {
        .fontSize(18);
        .lineHeight(24);
        .padding(0, 0, 0, 4);
      }
    }
  }

  .number-box {
    background-image: url("../../../assets/images/icon_shouji.png");
    background-position: 4vw center;
    background-repeat: no-repeat;
    background-size: 8.53vw;

    .left {
      float: left;
      .width(48);
      border-right: 1px solid @titleColor;
      text-align: left;
      .padding(0, 0, 0, 5);
      .fontSize(18);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @titleColor;
      .lineHeight(20);
      .margin(2, 5, 0, 0);
    }

    .right {
      float: left;
      .width(235);
    }
  }

  .code-box {
    background-image: url("../../../assets/images/icon_code.png");
    background-position: 4vw center;
    background-repeat: no-repeat;
    background-size: 8.53vw;

    .send-code {
      .height(24);
      background: none;
      border: none;
      .padding(0, 20, 0, 15);
      .fontSize(18);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @mainColor;
      .lineHeight(24);
    }
  }
}

.agreement {
  // width: 100%;
  text-align: left;
  .margin(0, 0, 15, 0);
  .padding(0, 0, 0, 10);
  .fontSize(14);
  color: @descriptionColor;
  .lineHeight(18);

  .protocal {
    color: @mainColor;
  }
}
</style>
