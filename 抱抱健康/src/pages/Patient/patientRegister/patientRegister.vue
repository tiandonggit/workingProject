/** *@desc 患者注册 *@author houpai *@date 2019/07/02 15:24:42 */
<template>
  <div class="user_login_page">
    <common-header
        :share-disabled="true"
        :custom-title="'身份信息'"
    ></common-header>
    <!--    未完成注册-->
    <div class="register_content" v-if="!PatientMessage.isbindfinished">
      <div class="registerImg">
        <img src="../../../assets/images/registerBackgrpund.png" alt=""/>
      </div>
      <div class="authentication_form">
        <van-cell-group>
          <van-field
              v-model="name"
              clearable
              label="姓名:"
              @input="name = name.replace(/[^\u4e00-\u9fa5]/g, '')"
              placeholder="请输入真实的姓名"
          ></van-field>
          <van-field
              v-model="phone"
              type="number"
              clearable
              label="手机号码:"
              placeholder="请输入手机号码"
          ></van-field>
          <van-field
              class="left_align noBorderBottom"
              v-model="verificationCode"
              type="number"
              maxlength="6"
              clearable
              label="验证码:"
              placeholder="请输入验证码"
          >
            <van-button
                slot="button"
                size="small"
                :class="codeNum > 0 ? 'codes' : ''"
                @click.stop="getIsRegistered"
                type="primary"
            >
              {{ codeNum ? codeNum + "秒后重发 " : "获取验证码" }}
            </van-button>
          </van-field>
        </van-cell-group>
      </div>
      <p class="tip">本软件对用户信息严格保密,请放心填写</p>
      <p class="second_tip">此为普通用户注册入口,专业医生请勿注册(如需注册请联系平台客服4000909975)</p>
      <div class="footer-box">
        <div class="agreement_tips">
          <p>
            完成个人信息提交即意味着已阅读并同意
            <span @click.stop="readAgreement('1')">
              {{ "《抱抱健康用户协议》" }}
            </span>
            <span @click.stop="readAgreement('2')">
              {{ "《隐私政策》" }}
            </span>
            <span @click.stop="readAgreement('3')">
              {{ "《礼品商城使用规则》" }}
            </span>
          </p>
        </div>
        <van-button
            slot="button"
            class="next-btn"
            size="large"
            @click="submitHandle"
        >完成
        </van-button>
      </div>
    </div>
    <!--        已经完成注册-->
    <div class="noResult" v-else>
      <img src="../../../assets/images/registered.png" alt="">
      <p class="top">验证成功</p>
      <p class="again">您已完成身份验证!</p>
    </div>
  </div>
</template>

<script>
  import Vue from "vue"
  import {Toast} from "vant"

  Vue.use(Toast)
  import commonHeader from "../../../components/commonHeader/common_header"
  import {mapState} from "vuex"

  export default {
    name: "patientRegister",
    components: {
      commonHeader
    },
    data() {
      return {
        // registered: false, // 是否完成验证
        name: "", // 姓名
        phone: "", // 电话号
        verificationCode: "", // 验证码
        codeNum: 0, // 验证码倒计时
        getCodeBoolean: false,
      }
    },
    computed: {
      ...mapState(["PatientMessage"])
    },
    watch: {
      /**
       * 手机号正则校验**/
      phone(val, oldVal) {
        if (!val) {
          return false
        } else {
          this.phone = val.replace(/[^0-9]+/g, "")
        }
      }
    },
    methods: {
      /**
       * 发送验证码之前先调用接口验证手机号是否已注册过
       * **/
      getIsRegistered() {
        if (!this.phone) {
          Toast({
            message: "请输入手机号",
            position: "bottom"
          })
          return false
        }
        if (this.phone) {
          if (!this.TestPhone(this.phone)) {
            Toast({
              message: "请输入格式正确的手机号",
              position: "bottom"
            })
            return false
          } else {
            // 查询电话是否注册过
            this.$http.request({
              method: "get",
              url: "/RPatientController/selectPatientPhone",
              body: {
                phone: this.phone
              }
            }).then(res => {
              if (res.data.success) {
                if (res.data.code == 1) {
                  this.sendCodeNum()
                } else if (res.data.code == 2) {
                  Toast({
                    message: "此手机号码已注册,请更换其他号码",
                    position: "bottom"
                  })
                }
              } else {
                console.log('查询手机号是否已经注册接口报错')
              }
            }).catch(e => {
              console.log(e)
            })
          }
        }
      },
      /**
       * 发送验证码**/
      sendCodeNum() {
        if (this.codeNum > 0) {
          return false
        }
        if (this.TestPhone(this.phone)) {
          this.codeNum = 60
          this.$http
            .request({
              method: "post",
              url: "/VerificationCode/sendVerificationCode",
              body: {
                phone: this.phone
              }
            })
            .then(res => {
              if (res.data.success) {
                this.getCodeBoolean = true
                Toast({
                  message: "验证码发送成功",
                  position: "bottom"
                })
                let clock = setInterval(() => {
                  this.codeNum--
                  if (this.codeNum === 0) {
                    window.clearInterval(clock)
                  }
                }, 1000)
              } else {
                Toast({
                  message: res.data.message,
                  position: "bottom"
                })
                this.codeNum = 0
              }
            })
            .catch(error => {
              Toast({
                message: "网络异常",
                position: "bottom"
              })
              this.codeNum = 0
            })
        } else {
          Toast({
            message: "请输入正确的手机号",
            position: "bottom"
          })
          return false
        }
      },
      /**
       * 查看协议**/
      readAgreement(type) {
        this.$router.push({
          name: "agreement",
          params: {
            type: type
          }
        })
      },
      /**
       * 提交校验**/
      submitHandle() {
        if (!this.name) {
          Toast({
            message: "请将信息填写完整",
            position: "bottom"
          })
          return false
        }
        if (!this.phone) {
          Toast({
            message: "请将信息填写完整",
            position: "bottom"
          })
          return false
        }
        if (this.phone) {
          if (!this.TestPhone(this.phone)) {
            Toast({
              message: "请输入格式正确的手机号",
              position: "bottom"
            })
            return false
          }
        }
        if (!this.getCodeBoolean) {
          Toast({
            message: "请获取验证码",
            position: "bottom"
          })
          return false
        }
        if (!this.verificationCode) {
          Toast({
            message: "请填写验证码",
            position: "bottom"
          })
          return false
        }
        this.getCodeNumberBoolean()
      },

      /**
       * 校验成功后修改用户信息**/
      updataPatientMessage() {
        this.$http
          .request({
            method: "post",
            url: "/RPatientController/updateByExample",
            body: {
              name: this.name,
              phone: this.phone
            }
          })
          .then(res => {
            if (res.data.success) {
              try {
                WeixinJSBridge.call("closeWindow")
              } catch (e) {
                console.log(e)
              }
            }
          })
          .catch(e => {
            console.log(e)
          })
      },

      /**
       *查询患者信息是否完善**/
      getPatientMessageCompleteBoolean() {
        this.$http
          .request({
            method: "get",
            url: "/RPatientController/selectByPrimaryS",
            body: {}
          })
          .then(res => {
            let isbindfinished = !!res.data.data.name
            this.$store.commit("PatientMessage/isbindfinished", isbindfinished)
          })
          .catch(e => {
            console.log(e)
          })
      },

      /**
       * 查看验证码是否正确**/
      getCodeNumberBoolean() {
        this.$http
          .request({
            method: "get",
            url: "/VerificationCode/getCode",
            body: {
              phone: this.phone,
              code: this.verificationCode
            }
          })
          .then(res => {
            if (res.data.success) {
              if (res.data.code === "2") {
                try {
                  this.updataPatientMessage()
                  Toast(res.data.message)
                } catch (e) {
                  console.log(e)
                }
              } else {
                Toast(res.data.message)
              }
            } else {
              console.log("验证码验证接口报错")
            }
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    created() {
      // if (!this.PatientMessage.isbindfinished) {
      this.getPatientMessageCompleteBoolean()
      // }
    }
  }
</script>

<style scoped lang="less">
  .user_login_page {
    .register_content {
      min-height: 100%;
      .margin(0, 12, 0, 12);

      .registerImg {

        img {
          display: block;
          .width(208);
          .height(142);
        }
      }
    }

    /*overflow: hidden;*/
    /*width: 100%;*/
    /*height: 100%;*/

    .authentication_form {
      flex: 1;
      background-color: #fff;
      overflow: hidden;
      box-sizing: border-box;
      .borderRadius(0, 10, 10, 10);
    }

    .tip, .second_tip {
      .fontSize(14);
      .lineHeight(18);
      color: #FF3000;
      .padding(20, 0, 0, 0);
    }

    .second_tip {
      color: rgba(102, 102, 102, 1) !important;
    }

  }

  .authentication_form /deep/ .van-button {
    background-color: @mainColor;
    border: none !important;
    .borderRadius(9, 9, 9, 9);
    color: #fff;
    .fontSize(16);
  }

  .authentication_form /deep/ .van-cell::after {
    position: relative !important;
  }

  .authentication_form /deep/ .van-hairline--top-bottom::after {
    border-width: 0 0;
  }

  .authentication_form /deep/ .van-button.codes {
    background-color: #fff;
    color: #ccc;
  }

  .authentication_form .left_align /deep/ .van-field__control {
    text-align: left;
  }

  .authentication_form /deep/ .van-cell-group.van-hairline--top-bottom {
    width: 100%;
    margin: 0 auto;
  }

  .flex_box {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .agreement_tips {
    .height(34);
    .fontSize(12);
    .margin(0, 13, 12, 14);
    text-align: center;
    color: #a7a7a7;
    .lineHeight(14);

    span {
      color: @mainColor;
      .lineHeight(18);
      .fontSize(14);
    }

    p {
      .fontSize(14);
    }
  }

  .user_login_page /deep/ .van-cell {
    font-size: 16px !important;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }

  .user_login_page /deep/ .van-cell.noBorderBottom {
    font-size: 16px !important;
    border-bottom: none;
  }
</style>
