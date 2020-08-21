/**
 * @Description: Login模块
 * @Author: 侯湃
 * @Date: 2020/6/11
 */
<template>
  <div class="login_page" v-hotkey="{'enter': throttle}">
    <div class="login_box">
      <div class="logo_box">
        <img src="../../assets/image/logo.png" alt="" class="logo">
        <h1>智造办侣</h1>
      </div>
      <el-form ref="loginForm" :model="loginForm" label-width="70px">
        <el-form-item>
          <el-input v-model="loginForm.phone"
                    oninput="if(value.length>11)value=value.substr(0,11)"
                    type="number"
                    :min="0"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <!--          oninput="if(value.length>6)value=value.substr(0,6)"-->
          <el-input v-model="loginForm.password"
                    type="password"
                    :max="0"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn_box">
        <el-button
            type="primary"
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

  import {loginSrv} from "./login.service";

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

        if (!this.loginForm.password) {
          this.$message("请输入密码");
          return false;
        }

        this.login();
      },

      /**
       * 登录成功之后先获取imServer地址
       * **/
      login() {
        localStorage.removeItem("serviceToken");
        this.btnLoading = true;
        let loginParams = {
          phone: this.loginForm.phone,
          password: this.loginForm.password
        };
        loginSrv.login(loginParams).then(response => {
          this.btnLoading = false;
          if (response.success) {
            try {
              let userMessage = {...response.data};
              if (userMessage.token) {
                window.localStorage.setItem(
                  "serviceToken",
                  userMessage.token
                );
              }
              let checkedFileSpaceMessage = {
                fileSpaceName: "",
                fileSpaceId: "",
                filePermission: []
              };
              this.$store.commit("loginData/saveUserMessage", userMessage);
              this.$store.commit("imData/saveChatList", []);
              this.$store.commit("homeData/imSelectedInfo", {});
              this.$store.commit("homeData/listSelectedInfo", {});
              this.$store.commit("fileDiskData/saveCheckedFileSpaceMessage", checkedFileSpaceMessage);
              setTimeout(() => {
                this.getServerToken();
              }, 100);
            } catch (error) {
              console.log(error);
            }
          } else {
            this.$message.error("用户名或者密码不正确");
          }
        }).catch(error => {
          this.btnLoading = false;
          console.log(error);
        });
      },

      /**
       * 登录之后获取imServer地址和token
       * **/
      getServerToken() {
        loginSrv.getServerToken().then(response => {
          this.btnLoading = false;
          if (response.success) {
            try {
              let imServerToken = {...response.data};
              window.localStorage.setItem("serverToken", response.data.jwtToken || "");
              this.$store.commit("loginData/saveImServerToken", imServerToken);
              window.localStorage.setItem("online", "true");
              this.$routerLink("home");
            } catch (error) {
              console.log(error);
            }
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          this.btnLoading = false;
          console.log(error);
        });
      }
    }
  };
</script>

<style scoped lang="less">

  .login_page {
    display: flex;
    height: 100%;
    overflow: hidden;
    background: url("../../assets/image/loginBg.png") fixed 0 center;
    background-size: 100% 100%;

    .login_box {
      position: fixed;
      top: 20%;
      right: 14%;
      width: 400px;
      height: 453px;
      border-radius: 10px;
      background-color: @mainBackgroundColor;
      box-shadow: 0 2px 10px @descTitleColor;

      .logo_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .logo {
          display: block;
          width: 82px;
          height: 82px;
          margin: 40px 0 20px 0;
        }

        h1 {
          font-size: 24px;
          font-weight: bold;
          color: @titleColor;
          margin: 0 0 40px 0;
        }
      }

      .el-form {
        display: flex;
        flex-direction: column;
        align-items: center;

        .el-form-item {
          width: 340px;
          height: 46px;
          border-radius: 10px;
          overflow: hidden;

          /deep/ .el-form-item__label {
            height: 100% !important;
          }

          /deep/ .el-form-item__content {
            margin-left: 0 !important;
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
            background-color: rgba(243, 243, 243, 1) !important;
          }

          /deep/ .el-input__inner {
            height: auto;
            line-height: 46px !important;
            border: none;
            font-size: 16px;
            background-color: rgba(243, 243, 243, 1) !important;
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
        width: 340px;
        margin: 24px auto 0;

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
