/*
 * @Author: 田东 
 * @Date: 2019-05-09 17:42:36 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-19 11:31:17
 * @name 注册/登录
 */
<template>
  <div class="all" :style="{ height: bodyHeight + 'px' }">
    <div class="top">
      <!-- 头部 -->
      <v-header :title="title"></v-header>

      <div class="logobox">
        <img class="logo" src="../../assets/images/loginLogo.png">
      </div>
      <div class="shuru content_input">
        <van-cell-group>
          <van-field maxlength="11" type="number" v-model="phone" placeholder="请输入手机号"/>
        </van-cell-group>
        <van-field
          v-if="logointype == 2"
          key="save"
          center
          v-model="password"
          type="password"
          placeholder="请输入密码"
          class="dingweia"
        ></van-field>
        <van-field
          v-if="logointype == 1"
          key="edit"
          center
          v-model="verificationCode"
          type="number"
          placeholder="请输入验证码"
          class="dingweia"
        >
          <van-button slot="button" size="small" @click="getSms" :text="content"></van-button>
        </van-field>
      </div>
      <v-button :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>

      <div v-if="logointype == 1" class="qiehuan">
        <span @click="passwordlogin()">账号密码登录</span>
      </div>
      <div v-if="logointype == 2" class="qiehuan">
        <span @click="phonelogin()">验证码登录</span>
        <span @click="forgetPwd()" class="forget_pwd">忘记密码</span>
      </div>
      <div class="weixin" v-show="isWx">
        <div class="quick_login">快捷登录</div>
        <span @click="wxlogin()" class="WX_login iconfont iconweixin"></span>
      </div>
    </div>
    <div class="agreement_hint">
      登录注册即代表您已阅读并同意以下协议
      <span v-for="(agreement, key) in agreementList" :key="key">
        <a @click="goAgreementDetails(agreement.id)">《{{agreement.sagreementname}}》</a>
        <span v-if="key == agreementList.length-2">及</span>
      </span>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";
import { Toast } from "vant";

export default {
  name: "login",
  data() {
    return {
      // 组件数据
      title: "",
      buttonText: "登录/注册",
      buttonClass: { width: "83vw", "margin-top": "12.8vw" },
      // 本页数据
      logointype: 1,
      content: "获取验证码", // 按钮里显示的内容
      totalTime: 60, //记录具体倒计时时间
      canClick: true, //添加canClick
      phone: "",
      verificationCode: "",
      password: "",
      agreementList: [],
      bodyHeight: 0,
      // 微信授权登录对象
      aweixin: null,
      // 当前环境支持的所有授权登录对象
      auths: null,
      isWx: true
    };
  },
  created() {
    // if (this.getshopCardNum) {
    //   this.shopCard = this.getshopCardNum;
    // } else {
    //   this.shopCardNum();
    // }
    this.isWx = true;
    this.getService();
  },
  destroyed() {
    this.$localStorage.removeItem("loginType"); // 清除token
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  computed: {
    //获取购物车数量
    getshopCardNum() {
      return this.$store.state.Home.shopCardNum;
    }
  },
  watch: {
    phone(newValue, oldValue) {
      if (!this.Testnum(newValue)) {
        this.phone = this.phone.replace(/[^0-9]/g, "");
      }
    }
  },
  mounted() {
    this.getAgreement();
    let loginT = this.$route.query.loginType;
    if (window.localStorage.getItem("loginType")) {
      loginT = window.localStorage.getItem("loginType");
    }
    loginT == 2 && this.passwordlogin();
    loginT == 1 && this.phonelogin();
    this.bodyHeight = document.documentElement.clientHeight;
  },
  methods: {
    //检测微信
    openWeixin(){
      let _this = this;
      if ( plus.os.name === "Android" ) {
        plus.runtime.launchApplication( {pname:"com.tencent.mm"}, function ( e ) {
          _this.isWx = false;
        });
      } else if ( plus.os.name === "iOS" ) {
        plus.runtime.launchApplication( {action:"weixin://RnUbAwvEilb1rU9g9yBU"}, function ( e ) {
          _this.isWx = false;
        });
      }
    },
    getAgreement() {
      this.$http
        .request({
          method: "get",
          url: "/SAgreementController/selectSagreementcontentS", // 获取协议
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.agreementList = data.data;
          } else {
            // 其他
            Toast(data.message);
          }
          this.bodyHeight = document.documentElement.clientHeight;
        })
        .catch(error => {
          console.log("错误为" + error);
          this.bodyHeight = document.documentElement.clientHeight;
        });
    },
    sonFun() {
      this.login();
    },
    passwordlogin() {
      this.logointype = 2;
      this.verificationCode = "";
    },
    phonelogin() {
      this.logointype = 1;
      this.password = "";
    },
    login() {
      // 密码登录
      if (this.logointype == 2) {
        if (!this.phone) {
          Toast("请填写手机号码");
          return;
        }
        if (this.phone.length !== 11) {
          Toast("请输入长度为11位的电话号");
          return;
        }
        if (!/^[1]\d{10}$/.test(this.phone)) {
          Toast("请输入正确格式手机号");
          return;
        }
        if (!this.password) {
          Toast("请输入密码");
          return;
        }
        this.httplogin(this.phone, this.password, 2);
      }
      // 验证码登录
      if (this.logointype == 1) {
        if (!this.phone) {
          Toast("请填写手机号码");
          return;
        }
        if (this.phone.length !== 11) {
          Toast("请输入长度为11位的电话号");
          return;
        }
        if (!/^[1]\d{10}$/.test(this.phone)) {
          Toast("请输入正确格式手机号");
          return;
        }
        if (!this.verificationCode) {
          Toast("请填写验证码");
          return;
        }
        this.httplogin(this.phone, this.verificationCode, 1);
      }
    },
    wxlogin() {
      this.authLogin();
    },
    getSms() {
      if (!this.canClick) return;
      if (!this.phone) {
        Toast("请填写手机号码");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.phone)) {
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
            phoneNum: this.phone
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
    httplogin(phones, password, type) {
      this.$localStorage.removeItem("serviceToken"); // 清除token
      if (type == 2) {
        this.$http
          .request({
            method: "post",
            url: "/SUserController/passWordlogin",
            body: {
              phone: phones,
              passWord: password
            }
          })
          .then(res => {
            let data = res.data;
            if (data.code == "3") {
              Toast("登录成功");
              let serviceToken = res.headers["x-auth-token"] ? res.headers["x-auth-token"] : res.headers["X-Auth-Token"];
              window.localStorage.setItem("serviceToken", serviceToken);
              this.shopCardNum();
              setTimeout(() => {
                if (!this.scienceWX) {
                  this.$router.push({ path: "../" });
                } else {
                  this.$routerWX.push({ path: "../" });
                }
              }, 1000);
            } else if (data.code == "1") {
              // 密码错误
              Toast(data.message);
            } else if (data.code == "2") {
              // 您还未注册，请通过验证码登录/注册
              Toast(data.message);
              this.logointype = 1;
              this.password = "";
            } else {
              // 其他
              Toast(data.message);
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      }
      if (type == 1) {
        this.$http
          .request({
            method: "post",
            url: "/SUserController/verificationCodeLogin",
            body: {
              phone: phones,
              verificationCode: password
            }
          })
          .then(res => {
            let data = res.data;
            if (data.code == "3") {
              Toast("登录成功");
              let serviceToken = res.headers["x-auth-token"] ? res.headers["x-auth-token"] : res.headers["X-Auth-Token"];
              window.localStorage.setItem("serviceToken", serviceToken);
              this.shopCardNum();
              setTimeout(() => {
                if (!this.scienceWX) {
                  this.$router.push({ path: "../" });
                } else {
                  this.$routerWX.push({ path: "../" });
                }
              }, 1000);
            } else if (data.code == "1") {
              // 请输入正确验证码
              Toast(data.message);
            } else if (data.code == "2") {
              // 请设置密码
              this.shopCardNum();
              if (!this.scienceWX) {
                this.$router.push({
                  path: "./setPwd",
                  query: {
                    title: "设置密码",
                    phone: phones,
                    verificationCode: password
                  }
                });
              } else {
                this.$routerWX.push({
                  path: "./setPwd",
                  query: {
                    title: "设置密码",
                    phone: phones,
                    verificationCode: password
                  }
                });
              }
            } else {
              // 其他
              Toast(data.message);
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      }
    },
    forgetPwd() {
      if (!this.scienceWX) {
        this.$router.push({ path: "./forgetPwd" });
      } else {
        this.$routerWX.push({ path: "./forgetPwd" });
      }
    },
    goAgreementDetails(id) {
      if (!this.scienceWX) {
        this.$router.push({
          path: "./agreementDetails",
          query: { id: id }
        });
      } else {
        this.$routerWX.push({
          path: "./agreementDetails",
          query: { id: id }
        });
      }
    },
    //购物车数量
    shopCardNum() {
      this.$http
        .request({
          method: "get",
          url: "/SProductCartController/selectSProductCartsNum",
          body: {}
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.shopCard = res.data.data.sproductcartsnum;
            this.$store.commit("Home/shopCardNum", this.shopCard);
          } else {
            console.log("获取购物车数量失败");
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },

    //==================微信登录=================

    // 获取登录授权认证服务列表，单独保存微信登录授权对象
    // 5+APP在plusready事件中调用，uni-app在vue页面的onLoad中调用
    getService() {
      let _this = this;
      plus.oauth.getServices(
        services => {
          // plus.nativeUI.alert(JSON.stringify(services));
          _this.auths = services;
          services.forEach((v, e) => {
            if (v.id == "weixin") {
              _this.aweixin = v;
              return;
            }
          });
          // this.aweixin = services["weixin"];
        },
        e => {
          plus.nativeUI.alert("获取登录授权服务列表失败：" + JSON.stringify(e));
        }
      );
    },

    // 获取微信登录授权对象后可进行授权操作
    authorize() {
      let _this = this;
      if (!this.aweixin) {
        plus.nativeUI.alert("当前环境不支持微信登录");
        return;
      }
      this.aweixin.authorize(
        e => {
          console.log("授权成功：" + JSON.stringify(e));
          _this.authLogin();
        },
        e => {
          if(e.code=="-8"){
            _this.isWx = false;
            plus.nativeUI.alert("检测到您的手机未安装微信应用，请使用其他登陆方式！");
          }else {
            console.log("授权失败：" + JSON.stringify(e));
            plus.nativeUI.alert(e.message);
          }
        },
        {
          scope: "snsapi_userinfo",
          state: "authorize test",
          // appid: "wxce215993f7c526f9"
        }
      );
    },

    authLogin() {
      let _this = this;
      if (!this.aweixin) {
        plus.nativeUI.alert("当前环境不支持微信登录");
        return;
      }
      if (!this.aweixin.authResult) {
        this.aweixin.login(
          e => {
            // plus.nativeUI.alert("登录认证成功!");
            console.log(_this.aweixin);
            // _this.wxloginHttp(_this.aweixin.authResult.code);
            _this.authUserInfo();
          },
          e => {
            console.log("登录认证失败: " + JSON.stringify(e));
            plus.nativeUI.alert("登录认证失败")
          }
        );
      } else {
        // plus.nativeUI.alert("已经登录认证!");
        // this.aweixin.logout(
        //   function(e) {
        //     console.log("注销登录认证成功!");
        //   },
        //   function(e) {
        //     console.log("注销登录认证失败: " + JSON.stringify(e));
        //   }
        // );
        this.authUserInfo();
      }
    },

    authUserInfo() {
      let _this = this;
      console.log(this.aweixin);
      if (!this.aweixin) {
        plus.nativeUI.alert("当前环境不支持微信登录");
        return;
      }
      if (this.aweixin.authResult) {
        this.aweixin.getUserInfo(
          e => {
            console.log(
              "获取用户信息成功：" + JSON.stringify(_this.aweixin.userInfo)
            );
            _this.wxloginHttp(JSON.stringify(_this.aweixin.userInfo));
          },
          e => {
            console.log("获取用户信息失败： " + JSON.stringify(e));
            plus.nativeUI.alert("获取用户信息失败!");
          }
        );
      } else {
        plus.nativeUI.alert("未登录认证!");
      }
    },

    wxloginHttp(code) {
      this.$localStorage.removeItem("serviceToken"); // 清除token
      this.$http
        .request({
          method: "post",
          url: "/SUserController/WeChatLogin",
          body: {
            code: code
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            if (data.data.code == "0") {
              Toast("登录成功");
              let serviceToken = res.headers["x-auth-token"] ? res.headers["x-auth-token"] : res.headers["X-Auth-Token"];
              window.localStorage.setItem("serviceToken", serviceToken);
              this.shopCardNum();
              setTimeout(() => {
                if (!this.scienceWX) {
                  this.$router.push({ path: "../" });
                } else {
                  this.$routerWX.push({ path: "../" });
                }
              }, 1000);
            } else if (data.data.code == "1") {
              // 1：未绑定手机号
              // Toast(data.data.message);
              if (!this.scienceWX) {
                this.$router.push({
                  path: "./bindingPhone",
                  query: { key: data.data.key }
                });
              } else {
                this.$routerWX.push({
                  path: "./bindingPhone",
                  query: { key: data.data.key }
                });
              }
            } else if (data.data.code == "2") {
              // 2：未设置密码
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
            } else {
              Toast(data.data.message);
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    }

    //==================微信登录end==========================
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

.all {
  width: 100vw;
  height: 100%;
  background-color: @backgroundColorT;
}

.top {
  height: 91%;
  background-color: @backgroundColorT;
}

.logobox {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}

.logo {
  width: 37.9vw;
}

.van-cell:not(:last-child)::after {
  border: none !important;
}

.qiehuan {
  width: 83vw;
  margin: 6.7vw auto 0;
  .fontSize(15);
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: @yellowOne;

  .forget_pwd {
    float: right;
  }
}

.quick_login {
  .fontSize(12);
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: @descriptionColor;
  text-align: center;
  display: table;
  white-space: nowrap;
  padding: 0 3.2vw;
  margin: 0 auto 4.2vw;

  &::before,
  &::after {
    content: "";
    display: table-cell;
    position: relative;
    top: 50%;
    width: 16vw;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC);
  }

  &::before {
    background-position: right 1em top 50%;
  }

  &::after {
    background-position: left 1em top 50%;
  }
}

.weixin {
  flex-direction: column;
  margin-top: 13.3vw;
  text-align: center;
}

.su {
  display: flex;
  justify-content: center;
  align-items: center;
}

.WX_login {
  .fontSize(26);
  color: @WeChatColor;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.content_input {
  margin: 4vw 0 12.8vw;
  padding: 0 8.5vw;

  .van-hairline--top-bottom::after {
    border-top: none;
  }

  .van-cell {
    .fontSize(15);
    padding: 2.7vw 0;
    position: relative;

    &::after {
      content: " ";
      position: absolute;
      pointer-events: none;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      left: 0;
      right: 0;
      bottom: 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      border-bottom: 1px solid @borderColor;
    }
  }

  .van-button {
    border: none;
    height: 6.4vw;
    line-height: 6.4vw;
    padding: 0;

    span {
      .fontSize(14);
      color: @descriptionColor;
    }
  }
}

.agreement_hint {
  width: 83vw;
  height: 5%;
  margin: 0 auto;
  .fontSize(12);
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: 666;

  a {
    color: @mainColor;
  }
}
</style>
