/*
 * @Author: 田东 
 * @Date: 2019-05-13 10:50:40 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-24 18:28:12
 * @name 订单详情
 */

<template>
  <div id="orderDetails">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 通告栏 -->
    <van-notice-bar wrapable :scrollable="false" mode="closeable">
      <span class="iconfont icontixing notice_icon"></span>
      <p class="notice_text">为了您的财产安全，不要点击陌生链接，请不要向任何人透露您的银行卡或验证信息，谨防诈骗！</p>
    </van-notice-bar>

    <div class="logistics_box">
      <div class="top">
        <p>{{subTypeMsg}}</p>

        <span v-if="subType == 0">剩余{{unPayLeftTime}}自动取消</span>
        <span v-if="subType == 2">剩余{{leftTime}}自动确认收货</span>
      </div>
      <div class="card_box">
        <div class="logistics" v-if="subType == 2">
          <span class="left_icon iconfont iconwuliu"></span>
          <!-- <span v-if="isShowLogistics" class="center_text">
            <span>您的订单已到达[沈阳市中转站]</span>
            <span class="time">2018-10-31 11:30:00</span>
          </span>-->
          <span class="center_text">
            <span id="expressCode">{{data.orderBaseList[0].expressCode}}</span>
            <span class="time">{{data.orderBaseList[0].expressName}}</span>
          </span>
          <!-- <span v-if="isShowLogistics" class="right_icon iconfont iconqianjin"></span> -->
          <span
            class="num_copy"
            @click="copyExpressCode(data.orderBaseList[0].expressCode, data.orderBaseList[0].expressName)"
          >复制</span>
        </div>
        <div class="xian" v-if="subType == 2"></div>
        <div class="address">
          <span class="left_icon iconfont icondizhi"></span>
          <span class="center_text">
            <span>{{data.orderBaseList[0].personName}} {{data.orderBaseList[0].mobile}}</span>
            <span
              class="time"
            >{{data.orderBaseList[0].baiDuAddress}} {{data.orderBaseList[0].address}}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="card_box">
      <div class="pharmacy_title">
        <i class="iconfont icondianpu header-leftFont"></i>
        {{data.orderBaseList[0].pharmacyName}}
      </div>
      <div
        class="drug_introduction clearfix"
        v-for="(orderProduct, key) in data.orderProductList"
        :key="key"
      >
        <div class="left_img">
          <img :src="orderProduct.productImg" alt>
        </div>
        <div class="right_info">
          <span class="right_top">{{orderProduct.productTitle}}</span>
          <div class="right_bottom">
            <span class="price">￥{{(orderProduct.price / 100).toFixed(2)}}</span>
            <span class="count">x{{orderProduct.productCount}}</span>
            <!-- 跳转400电话 -->
            <span class="service" v-if="payFinished == 1 && isDel != 2">
              <a href="tel:4000909975">售后</a>
            </span>
          </div>
        </div>
      </div>
      <div class="btn_group">
        <span v-if="subType == 0" class="btn_defult" @click="cancelOrder(subType)">
          <a>取消订单</a>
        </span>
        <span v-if="subType == 2" class="btn_defult" @click="logisticsInfo()">
          <a>查看物流</a>
        </span>
        <span
          v-if="subType == 2 && data.orderBaseList[0].takeType == 0"
          class="btn_defult"
          @click="delayReceiving()"
        >
          <a>延迟收货</a>
        </span>
        <span
          v-if="subType == 3 || subType == 4 || subType == 6"
          class="btn_defult"
          @click="deleteOrder()"
        >
          <a>删除订单</a>
        </span>
        <span v-if="subType == 2" class="btn_color" @click="confirmReceipt()">
          <a>确认收货</a>
        </span>
        <span
          v-if="subType == 3 || subType == 4 || subType == 6"
          class="btn_color"
          @click="buyOnce()"
        >
          <a>再次购买</a>
        </span>
        <span
          v-if="subType == 0"
          class="btn_color"
          @click="goPay(data.orderBaseList[0].totalPrice)"
        >
          <a>去付款</a>
        </span>
      </div>
    </div>
    <!-- 订单信息 -->
    <div class="card_box order_info">
      <div class="info_title">订单信息</div>
      <p>
        <span>订单编号</span>
        {{data.orderBaseList[0].subId}}
      </p>
      <p>
        <span>下单时间</span>
        {{data.orderBaseList[0].createTime}}
      </p>
      <p v-if="payFinished == 1 && isDel != 2">
        <span>支付方式</span>
        {{payTypeDesc}}
      </p>
      <p v-if="payFinished == 1 && isDel != 2">
        <span>支付时间</span>
        {{data.orderBaseList[0].finishTime}}
      </p>
      <p v-if="payFinished == 1 && deliverType == 1">
        <span>发货时间</span>
        {{data.orderBaseList[0].deliverTime}}
      </p>
    </div>
    <div class="card_box order_info">
      <div class="info_title">商品信息</div>
      <p>
        <span>商品总额</span>
        ¥{{(data.orderBaseList[0].totalPrice / 100).toFixed(2)}}
      </p>
      <p>
        <span>运费</span>
        ¥{{(data.orderBaseList[0].totaPostage / 100).toFixed(2)}}
      </p>
      <p>
        <span v-if="payFinished == 1">实付款</span>
        <span v-if="payFinished == 0">待付款</span>
        <span class="real_pay">¥{{(data.orderBaseList[0].sumPrice / 100).toFixed(2)}}</span>
      </p>
    </div>
    <!-- 是否删除弹出层 -->
    <van-popup v-model="isShowDeletePopup">
      <div class="popup_content">
        <p class="popup_title">确认删除该订单吗？</p>
        <p class="popup_hint">删除后该订单无法恢复，确认删除吗？</p>
        <div class="btn-box">
          <a class="btn_cancel" @click="isShowDeletePopup = false">取消</a>
          <a class="btn_delete" @click="deleteBtn()">删除</a>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import { Toast, Dialog } from "vant";
import { setTimeout, setInterval } from "timers";

export default {
  name: "orderDetails",
  data() {
    return {
      // 组件数据
      title: "订单详情",
      // 本页数据
      isShowDeletePopup: false,
      subType: "",
      subTypeMsg: "",
      orderId: "", // 订单号
      sPharmacyId: "", // 所属药房id
      data: {
        orderBaseList: [{ personName: "" }]
      },
      leftTime: "", // 距自动收货剩余时间
      unPayLeftTime: "", // 未支付订单剩余时间
      payTypeDesc: "", // 支付方式
      deliverType: 0, // 是否发货(0:未发货 1:已发货)
      takeType: 0, // 收货状态 (0:未收货 1:已收货,2:延迟收货)
      payFinished: 0, // 是否完成付款(0:未完成 1:已完成)
      isDel: 0, // 0:正常  1:逻辑删除不显示  2：已取消  3：等待取消
      timer: ""
    };
  },
  components: {
    "v-header": Header
  },
  destroyed() {
    window.clearInterval(this.timer);
  },
  created() {
    let par = JSON.parse(this.$route.query.params);
    // console.log(par);
    this.subType = par.subType;
    this.subTypeMsg = par.subTypeMsg;
    this.orderId = par.id;
    this.sPharmacyId = par.spharmacyid;
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .request({
          method: "post",
          url: "/SOrderSubController/orderDetail", // 订单详情
          body: { orderId: this.orderId, sPharmacyId: this.sPharmacyId }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.data = data.data[0];
            this.payTypeDesc =
              this.data.orderBaseList[0].payType == 1
                ? "微信支付"
                : "支付宝支付";
            this.deliverType = this.data.orderBaseList[0].deliverType;
            this.takeType = this.data.orderBaseList[0].takeType;
            this.payFinished = this.data.orderBaseList[0].payFinished;
            this.isDel = this.data.orderBaseList[0].isDel;
            if (this.deliverType == 1) {
              this.timer = window.setInterval(() => {
                this.showTime(
                  this.data.orderBaseList[0].deliverTime,
                  this.deliverType
                );
              }, 1000);
            }
            if (this.payFinished == 0) {
              this.timer = window.setInterval(() => {
                this.showTime(
                  this.data.orderBaseList[0].createTime,
                  this.payFinished
                );
              }, 1000);
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 倒计时计算
    showTime(time, status) {
      // 正常 time+15天， 延迟收货time+18天
      time = time.replace(/-/g, "/");
      let delayDay = this.takeType == 2 ? 18 : 15;
      let timedate = new Date(time); //
      let now = new Date(); //获取当前时间
      let date =
        parseInt(
          timedate.getTime() + delayDay * 24 * 60 * 60 * 1000 - now.getTime()
        ) / 1000; //得出的为秒数；
      let date2 =
        parseInt(timedate.getTime() + 2 * 60 * 60 * 1000 - now.getTime()) /
        1000; //得出的为秒数；
      let day = parseInt(date / 60 / 60 / 24);
      let day2 = parseInt(date2 / 60 / 60 / 24);
      let hour = parseInt((date / 60 / 60) % 24);
      let hour2 = parseInt((date2 / 60 / 60) % 24);
      let minute2 = parseInt((date2 / 60) % 60);
      let second2 = parseInt(date2 % 60);
      hour2 = hour2 < 10 ? "0" + hour2 : hour2;
      minute2 = minute2 < 10 ? "0" + minute2 : minute2;
      this.leftTime = day + "天" + hour + "时";
      this.unPayLeftTime = hour2 + "时" + minute2 + "分";
      // 自动收货
      if (status == 1 && day == 0 && hour == 0) {
        window.clearInterval(this.timer);
        this.confirmReceiptHttp();
      } else if (status == 0 && parseInt(hour2) <= 0 && parseInt(minute2) <= 0) {
        // 未支付超时取消订单
        window.clearInterval(this.timer);
        this.cancelOrderHttp();
      }
      if (second2 == 0) {
      }
    },
    // 删除订单
    // deleteOrder() {
    //   this.isShowDeletePopup = true;
    // },
    // 删除订单——确定删除
    deleteOrder() {
      // this.isShowDeletePopup = false;
      Dialog.confirm({
        title: "确认删除该订单吗？",
        message: "删除后该订单无法恢复，确认删除吗？"
      })
        .then(() => {
          this.$http
            .request({
              method: "post",
              url: "/SOrderSubController/delOrder",
              body: {
                id: this.orderId
              }
            })
            .then(res => {
              let data = res.data;
              if (data.success) {
                Toast("删除成功");
                setTimeout(() => {
                  if (!this.scienceWX) {
                    this.$router.push({
                      path: "./myOrder",
                      query: { active: 0 }
                    });
                  } else {
                    this.$routerWX.push({
                      path: "./myOrder",
                      query: { active: 0 }
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
        })
        .catch(() => {});
    },
    // 确认收货
    confirmReceipt() {
      Dialog.confirm({
        title: "",
        message: "是否确认收货"
      })
        .then(() => {
          this.confirmReceiptHttp();
        })
        .catch(() => {});
    },
    confirmReceiptHttp() {
      this.$http
        .request({
          method: "post",
          url: "/SOrderSubController/confirmReceipt", // 确认收货
          body: {
            id: this.orderId
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            // 输入密码成功后跳转
            if (!this.scienceWX) {
              this.$router.push({ path: "./receipt" });
            } else {
              this.$routerWX.push({ path: "./receipt" });
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 延迟收货
    delayReceiving() {
      Dialog.confirm({
        title: "",
        message:
          "每个订单只可进行一次延迟收货，延长收货时间为3天，确定延迟收货吗？"
      })
        .then(() => {
          this.$http
            .request({
              method: "post",
              url: "/SOrderSubController/delayReceiving",
              body: {
                id: this.orderId
              }
            })
            .then(res => {
              let data = res.data;
              if (data.success) {
                Toast("延迟收货成功");
                this.data.orderBaseList[0].takeType = "2";
              } else {
                Toast(data.message);
              }
            })
            .catch(error => {
              console.log("错误为" + error);
            });
        })
        .catch(() => {});
    },
    // 取消订单
    cancelOrder() {
      let msg = "";
      this.subType == 0 && (msg = "您确定取消订单吗？");
      this.subType == 1 &&
        (msg = "您若取消订单需等待卖家同意，您确认取消订单吗？");

      Dialog.confirm({
        title: "",
        message: msg
      })
        .then(() => {
          this.cancelOrderHttp();
        })
        .catch(() => {});
    },
    cancelOrderHttp() {
      this.$http
        .request({
          method: "post",
          url: "/SOrderSubController/cancelOrder",
          body: {
            id: this.orderId
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            if (this.subType == 0) {
              Toast("正在为您取消订单，请稍后");
            } else if (subType == 1) {
              Toast("等待卖家同意，请稍后");
            }
            window.localStorage.setItem("orderActive", 0);
            if (!this.scienceWX) {
              this.$router.push({ path: "./myOrder" });
            } else {
              this.$routerWX.push({ path: "./myOrder" });
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 再次购买
    buyOnce() {
      this.$http
        .request({
          method: "post",
          url: "/SOrderSubController/repurchase",
          body: {
            id: this.orderId
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            Toast("添加到购物车");
            this.$store.commit(
              "Home/shopCardNum",
              res.data.data.sproductcartsnum
            ); // 更新购物车数量
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 去付款
    goPay(totalPrice) {
      if (!this.scienceWX) {
        this.$router.push({
          path: "./payWay",
          query: { totalPrice: totalPrice, orderId: this.orderId }
        });
      } else {
        this.$routerWX.push({
          path: "./payWay",
          query: { totalPrice: totalPrice, orderId: this.orderId }
        });
      }
    },
    // 查看物流
    logisticsInfo() {
      Toast("暂未开放");
    },
    // 复制物流单号
    copyExpressCode(expressCode, expressName) {
      console.log(expressCode);
      this.copy(expressCode + expressName);
    },
    // 复制
    copy(copyText) {
      let target = null;
      target = document.createElement("div");
      target.id = "tempTarget";
      target.style.opacity = "0";
      target.innerText = copyText;
      document.body.appendChild(target);

      try {
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        Toast("复制成功");
      } catch (e) {
        Toast("复制失败");
      }

      target.parentElement.removeChild(target);
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

#orderDetails {
  .logistics_box {
    .top {
      background: @mainColor;
      height: 26.4vw;
      padding: 4vw 3.5vw;
      color: @fontOne;

      p {
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        margin-bottom: 1vw;
      }

      span {
        .fontSize(12);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        opacity: 0.8;
      }
    }
    .card_box {
      margin-top: -8.4vw;
      padding-bottom: 1vw;

      .logistics,
      .address {
        height: 14.6vw;

        .left_icon {
          float: left;
          line-height: 13.6vw;
          .fontSize(23);
        }

        .right_icon {
          float: right;
          line-height: 14.6vw;
          .fontSize(16);
        }

        .num_copy {
          .fontSize(12);
          font-family: PingFang-SC-Regular;
          font-weight: 400;
          color: @mainColor;
          vertical-align: top;
          line-height: 14.6vw;
        }

        .center_text {
          display: inline-block;
          width: 80%;
          margin-left: 2.9vw;
          padding-top: 1vw;

          span {
            .fontSize(15);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
          }

          .time {
            .fontSize(12);
            display: block;
            margin-top: 1.3vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .address {
        .left_icon {
          .fontSize(20);
        }
        .center_text {
          margin-left: 3.7vw;
        }
      }

      .xian {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        border-bottom: 1px solid @borderColor;
        margin-bottom: 3vw;
      }
    }
  }

  .card_box {
    width: 93.6vw;
    margin: 0 auto 3.2vw;
    padding: 3.2vw;
    background: @backgroundColorT;
    border-radius: 2.7vw;

    .pharmacy_title {
      .fontSize(15);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: @titleColor;
      margin-bottom: 4.6vw;

      i {
        .fontSize(21);
      }
    }

    .drug_introduction {
      margin-bottom: 3.8vw;

      .left_img {
        float: left;
        border-radius: 2.7vw;
        overflow: hidden;

        img {
          width: 24vw;
          display: block;
        }
      }

      .right_info {
        width: 60vw;
        float: right;
        .fontSize(14);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;

        .right_top {
          .fontSize(12);
          font-family: PingFang-SC-Regular;
          font-weight: 400;
          color: @titleColor;
          line-height: 4.8vw;
          height: 14.4vw;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .right_bottom {
          margin-top: 4.2vw;

          .price {
            .fontSize(15);
            font-family: PingFang-SC-Regular;
            font-weight: bold;
            color: @orderPriceColor;
          }

          .count {
            .fontSize(14);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
            color: @subtitleColor;
            margin-left: 1.1vw;
          }

          .service {
            .fontSize(11);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
            float: right;
            border: 0.5px solid @subtitleColor;
            border-radius: 1.3vw;
            width: 12.3vw;
            padding: 0.8vw 0;
            text-align: center;
            margin-top: 0.7vw;

            a {
              color: @titleColor;
              display: block;
              line-height: 3.2vw;
            }
          }
        }
      }
    }

    .btn_group {
      text-align: right;
      margin: 6.1vw 0 1.2vw;

      span {
        .fontSize(12);
        // line-height: 3.2vw;
        // padding: 1.2vw 0;
        padding: 0.7% 0;
        font-family: PingFang-SC-Regular;
        font-weight: bold;
        border: 0.5px solid @titleColor;
        border-radius: 1.3vw;
        margin-left: 2vw;
        width: 18.1vw;
        display: inline-block;
        text-align: center;

        a {
          color: @subtitleColor;
        }
      }
      .btn_color {
        border-color: @mainColor;

        a {
          color: @mainColor;
        }
      }
    }
  }

  .order_info {
    .info_title {
      .fontSize(16);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: @titleColor;
      margin-bottom: 2.8vw;
    }

    p {
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;

      span {
        display: inline-block;
        width: 25vw;
      }

      .real_pay {
        .fontSize(18);
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: @orderPriceColor;
        width: 50vw;
        padding-left: 1vw;
      }
    }
  }
}

// 通告栏
.van-notice-bar {
  height: 13.6vw;
  background: @noticeBgColor;
  color: @mainColor;
  .fontSize(12);
  line-height: 4.3vw;
  font-family: PingFang-SC-Regular;
  font-weight: 400;

  .notice_icon {
    line-height: 13.6vw;
  }
  .notice_text {
    width: 93%;
    float: right;
    margin-top: 2.4vw;
  }
}
</style>
