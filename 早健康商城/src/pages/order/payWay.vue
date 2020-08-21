/* 
* @Author: 田东 
* @Date: 2019-05-10 10:24:02 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-05 11:58:49
* @name 支付方式 
*/

<template>
  <div id="payWay">
    <!-- 头部 -->
    <v-header :title="title"></v-header>

    <div class="amount">
      <span>待支付金额</span>
      <p>¥{{ totalPrice }}</p>
    </div>

    <div class="card_box">
      <van-radio-group v-model="radio">
        <van-cell-group>
          <div class="cell cell_zfb" @click="radio = '2'">
            <i class="iconfont iconzhifubao1"></i>
            <span>支付宝支付</span>
            <van-radio name="2" checked-color="#E98C2E"/>
          </div>
          <div class="cell cell_wx" @click="radio = '1'">
            <i class="iconfont iconweixinzhifu"></i>
            <span>微信支付</span>
            <van-radio name="1" checked-color="#E98C2E"/>
          </div>
        </van-cell-group>
      </van-radio-group>
    </div>
    <!-- 提交按钮 -->
    <v-button :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";

import { Toast } from "vant";

export default {
  name: "payWay",
  data() {
    return {
      // 组件数据
      title: "支付方式",
      buttonText: "确定",
      buttonClass: { "margin-top": "10.3vw" },
      // 本页数据
      totalPrice: 0,
      orderId: 0,
      radio: "1" // 支付方式：1、微信；2、支付宝。默认微信
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  mounted: function() {
    this.totalPrice = (this.$route.query.totalPrice / 100).toFixed(2);
    this.orderId = this.$route.query.orderId;
    window.localStorage.setItem("payBack", true);
  },
  methods: {
    sonFun() {
      let channel = "";
      if (this.radio === "1") {
        channel = "wxpay";
      }
      if (this.radio === "2") {
        channel = "alipay";
      }
      let that = this;
      // 获取支付通道
      plus.payment.getChannels(
        function(channels) {
          for (let i = 0; i < channels.length; i++) {
            if (channels[i].id === channel) {
              that.pay(channels[i]);
            }
          }
        },
        function(e) {
          Toast("当前环境不支持此支付通道！");
          console.log(e);
        }
      );
      // this.submit();
    },
    submit() {
      // console.log(this.orderId, this.totalPrice * 100);
      // this.pay(this.radio, this.orderId)
      this.$http
        .request({
          method: "post",
          url: "/SOrderMainController/pay",
          body: {
            payType: this.radio,
            orderId: this.orderId,
            totalPrice: parseInt(this.totalPrice * 100)
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            Toast("支付成功");
            window.localStorage.setItem("payType", this.radio);
            window.localStorage.setItem("orderId", this.orderId);
            this.$localStorage.removeItem("payBack");
            setTimeout(() => {
              if (!this.scienceWX) {
                this.$router.push({
                  path: "./submitOrder",
                  query: { isPay: true }
                });
              } else {
                this.$routerWX.push({
                  path: "./submitOrder",
                  query: { isPay: true }
                });
              }
            }, 1000);
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 支付
    pay(channel) {
      console.log(channel);
      let keystr = "";
      let url = "";
      if (this.radio === "1") {
        url = "/SOrderMainController/payByWeChat";
      }
      if (this.radio === "2") {
        url = "/SOrderMainController/payByAli";
      }
      // 支付宝支付
      this.$http
        .request({
          method: "post",
          url: url,
          body: {
            orderId: this.orderId
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            if (this.radio === "1") {
              keystr = JSON.stringify(data.data);
            }else{
              keystr = data.data;
            }
            console.log(keystr);
            //keystr = 'service="mobile.securitypay.pay"&partner="2088801273866834"&_input_charset="UTF-8"&out_trade_no="20190604090404"&subject="DCloud项目捐赠"&payment_type="1"&seller_id="payservice@dcloud.io"&total_fee="0.01"&body="DCloud致力于打造HTML5最好的移动开发工具，包括终端的Runtime、云端的服务和IDE，同时提供各项配套的开发者服务。"&it_b_pay="1d"&notify_url="http%3A%2F%2Fdemo.dcloud.net.cn%2Fhelloh5%2Fpayment%2Fnotify.php"&show_url="http%3A%2F%2Fdemo.dcloud.net.cn%2Fhelloh5%2Fpayment%2F"&sign="C0nfh19QIdvbRfMaHFGXxAFiiACRL%2BMKCXM6k9mUlYzUs9YWNJTCrGgFSN%2FAJOiwwPK%2BQhdY%2BzkR6ohuNiLYMkkwV5zAx4vSSv84EgL5B6me7%2F8HL3W2gIgZ8bquXeo5ofIwwESxh2KqM5xLCCOxlUIzPDneXheNOfXsKSftpcs%3D"&sign_type="RSA"'
            // 调起手机软件支付
            plus.payment.request(
              channel,
              keystr,
              result => {
                console.log(result);
                plus.nativeUI.toast("支付成功！");
                window.localStorage.setItem("payType", this.radio);
                window.localStorage.setItem("orderId", this.orderId);
                this.$localStorage.removeItem("payBack");
                if (!this.scienceWX) {
                  this.$router.push({
                    path: "./submitOrder",
                    query: { isPay: true }
                  });
                } else {
                  this.$routerWX.push({
                    path: "./submitOrder",
                    query: { isPay: true }
                  });
                }
              },
              error => {
                console.log(error);
                if (error.code == "-100") {
                  plus.nativeUI.toast(
                    "您已取消支付，未支付订单有效保留时长为一天"
                  );
                } else {
                  plus.nativeUI.toast("未能支付成功");
                }
              }
            );
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

#payWay {
  padding-bottom: 12vw;
  line-height: normal;

  .amount {
    margin: 10.5vw 0 14.8vw;
    text-align: center;

    span {
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;
    }

    p {
      .fontSize(30);
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: @mainColor;
    }
  }

  .card_box {
    width: 94vw;
    margin: 2vw auto 3vw;
    padding: 0;
    background: @backgroundColorT;
    border-radius: 2.7vw;
    overflow: hidden;

    .cell {
      // line-height: 11.7vw;
      padding: 2.9vw 3.2vw;

      .iconfont {
        .fontSize(24);
        color: @zhifubaoColor;
      }

      span {
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
        display: inline-block;
        vertical-align: top;
        margin: 0.5vw 0 0 2.9vw;
      }

      .van-radio {
        float: right;
      }
    }
    .cell_wx {
      .iconfont {
        .fontSize(24);
        color: @weixinColor;
      }
    }
  }
}
</style>
