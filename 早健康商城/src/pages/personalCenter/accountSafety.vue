/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-03 10:48:23
 * @name 账号安全
 */

<template>
  <div id="accountSafety">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <van-cell-group>
      <van-cell title="修改密码" is-link @click="goChangePwd()"/>
      <van-cell title="修改手机号" :value="mobileShow" is-link @click="goChangeMobile()"/>
    </van-cell-group>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import { Cell, CellGroup, Toast } from "vant";

export default {
  name: "accountSafety",
  data() {
    return {
      // 组件数据
      title: "账号安全",
      // 本页数据
      mobile: "",
      mobileShow: ""
    };
  },
  components: {
    "v-header": Header
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
    goChangePwd() {
      if (!this.scienceWX) {
        this.$router.push({ path: "./changePwd" });
      } else {
        this.$routerWX.push({ path: "./changePWd" });
      }
    },
    goChangeMobile() {
      if (!this.scienceWX) {
        this.$router.push({ path: "./changePhoneNumber" });
      } else {
        this.$routerWX.push({ path: "./changePhoneNumber" });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

html {
  height: 100%;
  background: @backgroundColor;
}

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}

#accountSafety {
  .van-cell__title {
    color: @titleColor;
    .fontSize(15);
    font-family: PingFang-SC-Regular;
    font-weight: 400;
  }

  .van-cell__value {
    color: @subtitleColor;
    .fontSize(15);
    font-family: PingFang-SC-Medium;
    font-weight: 400;
  }
}
</style>
