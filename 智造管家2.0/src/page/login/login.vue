/**
*@desc 登录模块
*@author houpai
*@date 2020/03/20 15:51:21
*/
<template>
  <div class="login_page" v-hotkey="{'enter': throttle}">
    <div class="login_box">
      <h3 class="login_title">
        手机号登录
      </h3>
      <el-form ref="loginForm" :model="loginForm" label-width="70px">
        <el-form-item label="手机号码">
          <el-input v-model="loginForm.phone"
                    oninput="if(value.length>11)value=value.substr(0,11)"
                    type="number"
                    :min="0"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
<!--          oninput="if(value.length>6)value=value.substr(0,6)"-->
          <el-input v-model="loginForm.password"
                    type="password"
                    :max="0"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <!--        <el-form-item label="验证码" class="code_input_item">-->
        <!--          <el-input v-model="loginForm.code"-->
        <!--                    oninput="if(value.length>6)value=value.substr(0,6)"-->
        <!--                    type="number"-->
        <!--                    :min="0"-->
        <!--                    placeholder="请输入验证码">-->
        <!--            <span slot="append" @click.stop="getCode">-->
        <!--              {{ codeCountDown > 0 ? `${codeCountDown}秒后重发`:"获取验证码" }}-->
        <!--            </span>-->
        <!--          </el-input>-->
        <!--        </el-form-item>-->
      </el-form>

      <div class="btn_box">
        <el-button type="primary"
                   class="btn disabled_btn"
                   :class="[{'login_btn':loginForm.phone && loginForm.password}]"
                   @click="$throttle(submitHandle)"
                   :loading="btnLoading">
          登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "login",
    watch: {
      "loginForm.phone": {
        handler(newValue, oldValue) {
          if (!newValue) {
            return false;
          } else {
            this.loginForm.phone = newValue.replace(/[^0-9]+/g, "");
          }
        }
      },
      "loginForm.code": {
        handler(newValue, oldValue) {
          if (!newValue) {
            return false;
          } else {
            this.loginForm.code = newValue.replace(/[^0-9]+/g, "");
          }
        }
      }
    },
    data() {
      return {
        loginForm: {
          phone: "",
          code: "",
          password: ""
        },
        codeCountDown: 0, // 验证码倒计时
        getCodeBoolean: false, // 是否已经获取了验证码
        btnLoading: false
      };
    },
    methods: {
      /**
       * throttle submit
       * **/
      throttle() {
        this.submitHandle();
      },
      /**
       * 获取验证码
       * **/
      // getCode() {
      //   if (this.codeCountDown > 0) {
      //     return false;
      //   }
      //   if (this.TestPhone(this.loginForm.phone)) {
      //     // this.$http.request({
      //     //   method: "post",
      //     //   url: "/VerificationCode/sendVerificationCode",
      //     //   body: {
      //     //     phone: this.loginForm.phone
      //     //   }
      //     // }).then(res => {
      //     //   if (res.data.success) {
      //
      //
      //     this.getCodeBoolean = true;
      //     this.$message({
      //       message: "验证码发送成功",
      //       type: "success"
      //     });
      //     this.codeCountDown = 60;
      //     let clock = setInterval(() => {
      //       this.codeCountDown--;
      //       if (this.codeCountDown === 0) {
      //         window.clearInterval(clock);
      //       }
      //     }, 1000);
      //
      //
      //     //   } else {
      //     //     this.$message.error(res.data.message || "操作失败");
      //     //   }
      //     // }).catch(error => {
      //     //   console.log("error---", error);
      //     // });
      //   } else {
      //     this.$message("请输入格式正确的手机号");
      //     return false;
      //   }
      // },

      /**
       * 登录验证
       * **/
      submitHandle() {
        if (!this.loginForm.phone && !this.loginForm.password) {
          return false;
        }
        if (!this.loginForm.phone) {
          this.$message("请输入电话号码");
          return false;
        }
        if (!this.TestPhone(this.loginForm.phone)) {
          this.$message.error("请输入格式正确的手机号");
          return false;
        }

        // if (!this.getCodeBoolean) {
        //   this.$message( "请先获取验证码");
        //   return false;
        // }

        if (!this.loginForm.password) {
          this.$message("请输入密码");
          return false;
        }

        // if (!this.TestTestCode(this.loginForm.code)) {
        //   this.$message.error("请输入6位验证码数字");
        //   return false;
        // }

        this.login();
      },

      /**
       * 登录成功之后先获取imServer地址
       * **/
      login() {
        localStorage.removeItem("serviceToken");
        this.btnLoading = true;
        this.$http.request({
          url: "/ImUserController/Login",
          method: "post",
          body: {
            phone: this.loginForm.phone,
            password: this.loginForm.password
          }
        }).then((res => {
          this.btnLoading = false;
          if (res.data.success) {
            try {
              let userMessage = {...res.data.data};
              if (userMessage.token) {
                window.localStorage.setItem(
                  "serviceToken",
                  userMessage.token
                );
              }
              this.$store.commit("loginData/saveUserMessage", userMessage);
              this.$store.commit("imData/saveChatList", []);
              this.$store.commit("homeData/imSelectedInfo", {});
              this.$store.commit("homeData/listSelectedInfo", {});
              setTimeout(() => {
                this.getServerToken();
              }, 100);
            } catch (e) {
              console.log(e);
            }
          } else {
            this.$message.error("用户名或者密码不正确");
          }
        })).catch(e => {
          this.btnLoading = false;
          console.log(e);
        });
      },

      /**
       * 登录之后获取imServer地址和token
       * **/
      getServerToken() {
        this.$http.request({
          url: "/ImSeverController/getTokenAndServer",
          method: "get"
        }).then(res => {
          this.btnLoading = false;
          if (res.data.success) {
            try {
              let imServerToken = {...res.data.data};
              window.localStorage.setItem("serverToken", res.data.data.jwtToken || "");
              this.$store.commit("loginData/saveImServerToken", imServerToken);
              window.localStorage.setItem("online", "true");
              this.$routerLink("home");
            } catch (e) {
              console.log(e);
            }
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).catch(e => {
          this.btnLoading = false;
          console.log(e);
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .login_page {
    height: 100%;

    .login_box {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 454px;
      height: 554px;
      border-radius: 10px;
      background-color: @mainBackgroundColor;
      box-shadow: 0 2px 10px @descTitleColor;

      .login_title {
        margin: 70px 0 0 0;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: @mainFontColor;
        line-height: 24px;
      }

      .el-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 50px 0 0 0;

        .el-form-item {
          width: 294px;
          height: 46px;
          background-color: @mainBackgroundColor;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          overflow: hidden;

          /deep/ .el-form-item__label, el-form-item__content {
            height: 100% !important;
          }

          /deep/ .el-form-item__label {
            box-sizing: border-box;
            padding-left: 10px;
            padding-right: 0;
            text-align: left !important;
            font-size: 16px;
            line-height: 46px;
            font-weight: bold;
            color: @mainFontColor;
            text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
          }

          /deep/ .el-input {
            height: 100% !important;
            line-height: 46px !important;
          }

          /deep/ .el-input__inner {
            height: auto;
            line-height: 46px !important;
            border: none;
            font-size: 16px;
            /*padding-left: 0;*/
          }

          .code_input_item {
            /deep/ .el-input__inner {
              border-right: 1px solid rgba(0, 0, 0, 0.1);
            }
          }

          /deep/ .el-input-group__append {
            background: none;
            border: none;
            padding: 0 !important;

            span {
              display: inline-block;
              width: 111px;
              text-align: center;
              padding: 0 10px 0 20px;
              border-left: 1px solid rgba(0, 0, 0, 0.1);
              font-size: 16px;
              font-weight: 400;
              color: @barBackgroundColor;
              line-height: 20px;
              text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
            }
          }

        }
      }

      .btn_box {
        width: 294px;
        margin: 139px auto 0;

        .btn {
          width: 100%;
          cursor: pointer;
          height: 46px;
          color: @mainBackgroundColor;
          border-radius: 10px;
          text-align: center;
          border: none;

          span {
            font-size: 18px;
            font-weight: bold;
            color: @mainBackgroundColor;
          }
        }

        .login_btn {
          background: @barBackgroundColor !important;
        }

        .disabled_btn {
          background: rgba(204, 204, 204, 1);
        }
      }
    }
  }
</style>
