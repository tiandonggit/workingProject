/*
 * @Author: 田东 
 * @Date: 2019-05-10 10:24:02 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-11 10:41:16
 * @name 确认收货
 */

<template>
  <div id="receipt">
    <!-- 头部 -->
    <v-header :title="title"></v-header>

    <div class="img_box">
      <img src="../../assets/images/receipt.png" alt>
    </div>

    <div class="text_box">
      <p>商品确认签收！</p>
    </div>

    <div class="button_group">
      <van-row gutter="18">
        <van-col span="12">
          <a class="btn" @click="backIndex()">返回首页</a>
        </van-col>
        <van-col span="12">
          <a class="btn btn_order" @click="goMyOrder()">查看订单</a>
        </van-col>
      </van-row>
    </div>

    <!-- 为您推荐 -->
    <!-- <p class="recommend">为您推荐</p> -->
    <Recommended :title="recommendTitle"></Recommended>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import Recommended from "@/components/Recommended";
import { Row, Col } from "vant";

export default {
  name: "receipt",
  data() {
    return {
      // 组件数据
      title: "确认收货",
      recommendTitle: "为您推荐"
      // 本页数据
    };
  },
  components: {
    "v-header": Header,
    Recommended: Recommended
  },
  mounted: function() {},
  methods: {
    backIndex() {
      if (!this.scienceWX) {
        this.$router.push({ path: "../" });
      } else {
        this.$routerWX.push({ path: "../" });
      }
    },
    goMyOrder() {
      if (!this.scienceWX) {
        this.$router.push({ path: "../order/myOrder" });
      } else {
        this.$routerWX.push({ path: "../order/myOrder" });
      }
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

#receipt {
  padding-bottom: 12vw;

  .img_box {
    background: @backgroundColorT;
    text-align: center;
    padding: 6.7vw 0;

    img {
      width: 21.5vw;
      display: block;
      margin: 0 auto;
    }
  }

  .text_box {
    background: @backgroundColorT;
    text-align: center;
    padding-bottom: 3.2vw;

    p {
      .fontSize(18);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @receiptColor;
    }
  }

  .button_group {
    padding: 6.3vw 13.1vw 4vw;
    background: @backgroundColorT;

    .btn {
      height: 10vw;
      line-height: 9.5vw;
      border: 1px solid @descriptionColor;
      border-radius: 2.7vw;
      display: block;
      text-align: center;
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: bold;
      color: @titleColor;
    }
    .btn_order {
      color: @mainColor;
      border-color: @mainColor;
    }
  }

  .recommend {
    .fontSize(15);
    text-align: center;
    color: @titleColor;
    margin-top: 5.2vw;
  }
}
</style>
