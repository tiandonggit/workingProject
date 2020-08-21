<template>
  <div>
    <div class="logo" v-show="isLogin" :style="{}">
      <div class="logo_icon"></div>
      <p>新增医生注册信息</p>
      <div class="input_box">
        <div class="user_name">
          <div class="user_name_icon">
            <i class="icon_box"></i>
            <span class="num">86+</span>
            <div class="vertical"></div>
          </div>
          <input
            type="number"
            style="height:12.8vw;"
            maxlength="11"
            v-model="phoneNum"
            placeholder="请输入11位手机号码"
          />
        </div>
        <div class="password">
          <div class="password_icon">
            <i class="password_icon_box"></i>
          </div>
          <input
            type="number"
            v-model="verificationNumer"
            style="height:12.8vw;"
            maxlength="6"
            placeholder="请输入6位验证码"
          />
          <div
            class="verification"
            @click="verificationNum()"
            :style="{color:colorState?'#0069FF':'#999999'}"
          >{{content}}</div>
        </div>
      </div>
      <div class="kong" :style="{bottom:iphoneX?'44px':'10px'}">
        <button class="submit" @click="infoHref">下一步</button>
      </div>
    </div>
    <div v-show="isHide">
      <div v-show="canIUse" class="main">
        <div class="header">
          <i></i>
        </div>

        <div class="content">
          <KButton
            class="bottom"
            style="width:93.6vw; color: #fff; height: 11.733vw; line-height: 7.733vw;border-radius:10px;"
            open-type="getUserInfo"
            @getuserinfo="getUserInfo"
          >申请使用</KButton>
          <div class="content_icon_box">
            <div class="yanzheng">
              <i class></i>
              <p>验证用户手机号码</p>
            </div>
            <div class="shengchengcaijichenggu">
              <i class></i>
              <p>采集用户信息</p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div>请升级微信版本</div> -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
// import httpConfig from '@/../../utils/httpConfig'
export default Vue.extend({
  name: "Home",
  data() {
    return {
      iphoneX: false,
      phoneNum: "",
      content: "获取验证码",
      totalTime: 60,
      canClick: true, // 添加canClick
      verificationNumer: "",
      loadingToast: true,
      colorState: true,
      isHide: true,
      isLogin: false,
      // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
      canIUse: wx.canIUse("button.open-type.getUserInfo")
    };
  },
  created() {
    this.titleBGAuthorize(0);
    this.getSetting();
    this.iphoneX = this.$store.state.iphoneX;
    window.addEventListener("wxload", query =>
      console.log("page1 wxload", query)
    );
    window.addEventListener("wxshow", () => console.log("page1 wxshow"));
    window.addEventListener("wxready", () => console.log("page1 wxready"));
    window.addEventListener("wxhide", () => console.log("page1 wxhide"));
    window.addEventListener("wxunload", () => console.log("page1 wxunload"));
    // 环境判定
    if (process.env.isMiniprogram) {
      this.titleWX();
    } else {
      console.log("I am in Web");
      this.titleWeb();
    }
  },
  mounted() {
    document.querySelector("body").setAttribute("style", "background: #fffff");
  },
  methods: {
    // 小程序标题
    titleWX() {
      wx.setNavigationBarTitle({
        title: "身份验证"
      });
    },
    // web标题
    titleWeb() {
      document.title = "身份验证";
    },
    // 跳转信息页
    infoHref() {
      // this.$router.push({
      //   path: '/registrationInfo'
      // })
      if (this.phoneNum.length === 0 && this.phoneNum === "") {
        Toast("请输入手机号");
        return;
      } else {
        const re = /^1\d{10}$/;
        const str = this.phoneNum;
        if (!re.test(str)) {
          Toast("手机号格式不正确");
          return;
        }
      }

      if (
        this.verificationNumer.length === 0 &&
        this.verificationNumer === ""
      ) {
        Toast("请输入验证码");
        return;
      }
      this.$http
        .request({
          method: "post",
          url: "/InformationCollectionController/amendPasswordByCode",
          body: {
            phoneNum: this.phoneNum,
            code: this.verificationNumer
          }
        })
        .then(res => {
          console.log(JSON.stringify(res.data));
          this.$store.commit("savePhone", this.phoneNum);
          if (res.data.success) {
            this.$router.push({
              path: "/registrationInfo"
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast(`错误为${error}`);
        });
      // this.$router.push({
      //   path: '/registrationInfo'
      // })
    },
    // 获取验证码
    verificationNum() {
      if (this.phoneNum.length === 0 && this.phoneNum !== "") {
        Toast("请输入手机号");
        return;
      } else {
        const re = /^1[34578]\d{9}$/;
        const str = this.phoneNum;
        if (!re.test(str)) {
          Toast("手机号格式不正确");
          return;
        }
      }

      if (!this.canClick) return; // 改动的是这两行代码
      this.canClick = false;
      this.colorState = false;
      this.content = `${this.totalTime}s`;
      this.$http
        .request({
          method: "get",
          url: "/InformationCollectionController/sendVerificationCode",
          body: {
            phoneNum: this.phoneNum
          },
          headers: {
            // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
          }
        })
        .then(res => {
          console.log(JSON.stringify(res));
          console.log(JSON.stringify(res.data));
        })
        .catch(error => {
          Toast(error);
          console.log(error);
        });
      const clock = window.setInterval(() => {
        // eslint-disable-next-line no-plusplus
        this.totalTime--;
        this.content = `${this.totalTime}s`;
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.content = "获取送验证码";
          this.totalTime = 60;
          this.canClick = true; // 这里重新开启
          this.colorState = true;
        }
      }, 1000);
    },
    // 微信查看是否授权
    getSetting() {
      console.log("查看是否授权");
      const that = this;
      // 查看是否授权
      wx.getSetting({
        success(res) {
          console.log(res);
          console.log(res.authSetting["scope.userInfo"]);
          // {scope.userInfo:true}授权为true
          if (res.authSetting["scope.userInfo"]) {
            // 用户已授权
            // 关闭授权页面
            that.isHide = false;
            that.isLogin = true;
            that.titleBGAuthorize(1);
          } else {
            // 用户没有授权
            // 显示授权页面
            that.isHide = true;
            that.isLogin = false;
            that.titleBGAuthorize(0);
          }
        }
      });
    },
    // 头部背景颜色
    titleBGAuthorize(state) {
      // 授权页面
      if (state === 0) {
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#0E86FE"
          // animation: {
          //   duration: 400,
          //   timingFunc: 'easeIn'
          // }
        });
      }
      if (state === 1) {
        console.log(state);
        // 登录页面
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#ffffff"
          // animation: {
          //   duration: 400,
          //   timingFunc: 'easeIn'
          // }
        });
      }
    },
    // 微信授权
    getUserInfo(e) {
      console.log("=-------GetUserInfo");
      console.log(e);
      if (e.detail.userInfo) {
        // 用户按了允许授权按钮
        const that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail.userInfo);
        // 授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
        // that.setData({
        this.isHide = false;
        that.isLogin = true;
        this.titleBGAuthorize(1);
        // })
      } else {
        // 用户按了拒绝按钮
        wx.showModal({
          title: "警告",
          content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",
          showCancel: false,
          confirmText: "返回授权",
          success(res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log("用户点击了“返回授权”");
            }
          }
        });
      }

      wx.getUserInfo({
        success(res) {
          // 调用微信的 wx.login 接口，从而获取code
          wx.login({
            success: res => {
              console.log(`用户的code:${res.code}`);
              // 获取openID
              wx.request({
                method: "GET",
                url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx9cce37e6a8822d54&secret=ebbe37b9d3f4ff9859bcf39feef63475&js_code=${res.code}&grant_type=authorization_code`,
                success: res => {
                  // console.log("用户的openid:" + res);
                  console.log(JSON.stringify(res));
                  console.log(JSON.stringify(res.data));
                  // 获取到用户的 openid
                  console.log(`用户的openid:${res.data.openid}`);
                  wx.setStorageSync("openid", res.data.openid);
                }
              });
            }
          });
        }
      });
    }
  }
});
</script>

<style lang="less">
.abc {
  width: 30px;
  height: 30px;
  color: @fontColorRed;
  background-color: @fontColorRed;
}
.logo {
  padding-top: 53px;
  // position: fixed;
  background-color: #fff;
  height: 100%;
  .submit {
    width: 94%;
    margin: 0 auto;
    color: #fff;
    margin-left: 12px;
    margin-right: 12px;
    height: 44px;
    line-height: 44px;
    background: linear-gradient(
      270deg,
      rgba(14, 134, 254, 1) 0%,
      rgba(0, 105, 255, 1) 100%
    );
    border-radius: 10px;
    // position: fixed;
    // bottom: 10px;
  }
  .logo_icon {
    width: 150px;
    height: 150px;
    background-image: data-uri("./../assets/img/logo.png");
    background-repeat: no-repeat;
    margin: 0 auto;
    background-size: 100%;
  }
  p {
    color: @fontColor33;
    .fontSize(20);
    margin: 0 auto;
    margin-top: 30px;
    text-align: center;
  }
  .input_box {
    margin-top: 70px;
    padding-left: 12px;
    padding-right: 12px;
    line-height: 48px;
    .user_name {
      display: flex;
      .user_name_icon {
        display: flex;
        width: 95px;
        height: 48px;
        background: rgba(237, 237, 237, 1);
        .borderRadius(10, 0, 0, 10);
      }
      .num {
        margin-left: 15px;
        color: @fontColor33;
      }
      .vertical {
        border-left: 1px solid @fontColor33;
        margin-left: 11px;
        height: 21px;
        line-height: 48px;
        margin-top: 14px;
      }
      .icon_box {
        width: 22px;
        height: 32px;
        background-image: data-uri("./../assets/img/sj.png");
        background-repeat: no-repeat;
        display: block;
        margin-left: 15px;
        margin-top: 8px;
        background-size: 100%;
      }
      input {
        // padding-top: 10px;
        .fontSize(18);
        outline: none;
        border: 0;
        background: rgba(237, 237, 237, 1);
        height: 48px;
        line-height: 48px;
        .borderRadius(0, 10, 10, 0);
        padding-left: 8px;
        width: 254px;
        display: block;
      }
    }
    .password {
      display: flex;
      margin-top: 20px;
      .password_icon {
        display: flex;
        width: 52px;
        height: 48px;
        background: rgba(237, 237, 237, 1);
        .borderRadius(10, 0, 0, 10);
      }
      .password_icon_box {
        width: 22px;
        height: 32px;
        background-image: data-uri("./../assets/img/ys.png");
        background-repeat: no-repeat;
        display: block;
        margin-left: 15px;
        margin-top: 8px;
        background-size: 100%;
      }
      input {
        .fontSize(18);
        outline: none;
        border: 0;
        background: rgba(237, 237, 237, 1);
        height: 48px;
        line-height: 48px;
        padding-left: 8px;
        width: 146px;
        display: block;
      }
      .verification {
        .fontSize(18);
        width: 153px;
        color: @startColor;
        background: rgba(237, 237, 237, 1);
        .borderRadius(0, 10, 10, 0);
        text-align: right;
        padding-right: 12px;
      }
    }
  }
}

button {
  display: block;
  text-align: center;
  font-size: 20px;
  border: 0;
  outline: none;
  color: @fontColor99;
}

.main {
  width: 100%;
  height: 100%;
  position: relative;
}
.header {
  // margin-top: 60px;
  // margin-left: 25px;
  // margin-right: 25px;
  // margin-bottom: 40px;
  // margin: 45px 0 45px 0;
  text-align: center;
  width: 100%;
  height: 450px;
  // line-height: 225px;
}

.header i {
  width: 100%;
  height: 100%;
  background-image: data-uri("./../assets/img/authorizeBG.png");
  background-position: center center;
  background-repeat: no-repeat;
  margin: 0 auto;
  background-size: cover;
  display: block;
}

.content {
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 45px;
  margin-top: 70px;
}
.content span {
  color: #010101;
}
.content p {
  display: block;
  color: #9d9d9d;
  margin-top: 6px;
}

/deep/.main /deep/.miniprogram-root .weui-btn,
.weui-btn {
  // margin: 35px 25px;
  // height: 48px;
  color: #fff;
  text-align: center;
  width: 88%;
  margin-right: 6%;
  width: 351px;
  height: 44px;
  background: linear-gradient(
    270deg,
    rgba(14, 134, 254, 1) 0%,
    rgba(0, 105, 255, 1) 100%
  );

  border-radius: 10px;
}

.bottom {
  color: #fff;
  text-align: center;
  width: 88%;
  margin-right: 6%;
  width: 351px;
  height: 44px;
  background: linear-gradient(
    270deg,
    rgba(14, 134, 254, 1) 0%,
    rgba(0, 105, 255, 1) 100%
  );
  border-radius: 10px;
}
.content_icon_box {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
}

.yanzheng {
  // width: 40%;
  display: flex;
  justify-content: space-between;
}
.shengchengcaijichenggu {
  // width: 40%;
  display: flex;
  justify-content: space-between;
}
.yanzheng i {
  width: 22px;
  height: 22px;
  background-image: data-uri("./../assets/img/yanzheng.png");
  background-repeat: no-repeat;
  display: block;
  margin-top: 8px;
  background-size: 100%;
}
.yanzheng p {
  display: block;
  margin-left: 10px;
}
.shengchengcaijichenggu i {
  width: 20px;
  height: 18px;
  background-image: data-uri("./../assets/img/shengchengcaijichenggu.png");
  background-repeat: no-repeat;
  display: block;
  margin-left: 15px;
  margin-top: 8px;
  background-size: 100%;
}
.shengchengcaijichenggu p {
  margin-left: 10px;
}
</style>
