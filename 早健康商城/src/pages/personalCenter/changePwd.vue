/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-13 12:50:04
 * @name 修改密码
 */

<template>
  <div id="changePwd">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <div class="content_input2">
      <van-cell-group>
        <van-field v-model="oldPwd" type="password" placeholder="原登录密码"/>
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="newPwd" maxlength="18" type="password" placeholder="新登录密码（6-18位字符，含数字及字母）"/>
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
import { setTimeout } from 'timers';

export default {
  name: "changePwd",
  data() {
    return {
      // 组件数据
      title: "修改密码",
      buttonText: "确认修改",
      buttonClass: {},
      // 本页数据
      oldPwd: "",
      newPwd: "",
      reNewPwd: ""
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  mounted: function() {},
  methods: {
    sonFun() {
      this.submit();
    },
    otherWay() {
      if (!this.scienceWX) {
        this.$router.replace({ path: "./changePwd2" });
      } else {
        this.$routerWX.replace({ path: "./changePWd2" });
      }
    },
    submit() {

      if (!this.oldPwd) {
        Toast("请输入原登录密码");
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
          url: "/SUserController/amendPasswordByOldPassword",
          body: { password: this.newPwd, oldPassword: this.oldPwd }
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

#changePwd {
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
        color: @descriptionColor;
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
