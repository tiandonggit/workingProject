/**
* @Description: 支付中(支付完成组件)
* @Author: 侯湃
* @Date: 2020/8/18
*/
<template>
  <div class="payProgress_component">
    <common-header
        :share-disabled="true"
        :header-show="false"
        :title="customTitle"
        :custom-title="customTitle"
    ></common-header>
    <div class="container_box">
      <img src="../../assets/images/paying.png" alt="" v-if="payStatus == 0">
      <img src="../../assets/images/pay_success.png" alt="" v-if="payStatus == 1">
      <p class="pay_tip" :class="[{'paying':payStatus == 0,'pay_success':payStatus == 1}]">
        {{ pay_tip }}
      </p>
      <p class="pay_desc">
        {{pay_desc}}
      </p>
      <div class="complete_btn" @click.stop="completePay" v-if="payStatus == 1">
        完成
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../commonHeader/common_header";

  export default {
    name: "payProgress",
    components: {
      commonHeader
    },
    data() {
      return {
        customTitle: "支付结果",
        orderId: "", // 订单id 用于轮询订单获取支付结果
        orderType: "", // 订单类型 0: 自营订单 1: 智配柜订单
        timer: null,
        payStatus: 0, // 0: 支付中 1: 支付完成
        pay_tip: "正在支付中…",
        pay_desc: "支付完成将自动跳转请稍后",
        routerName: "" // 需要跳转的路由
      };
    },
    methods: {
      /**
       * 根据订单类型和订单id 轮询订单接口(自营订单或者是智配柜订单)
       * **/
      timerInit(type = "timer") {
        if (type == "timer") {
          if (this.orderType == 0) {
            this.timer = setInterval(() => {
              this.$http.request({
                method: "get",
                url: "/ZyOrderDetailsController/selectDetailByOrderId",
                body: {
                  id: this.orderId
                }
              }).then(res => {
                if (res.data.success) {
                  let productOrderDetail = res.data.data.zyOrder || {};
                  if (productOrderDetail.orderstatus != 0) {
                    clearInterval(this.timer);
                    if (this.payStatus != 1) {
                      if (this.routerName) {
                        this.$router.push({
                          name: "productOrderDetail",
                          query: {
                            productOrderId: this.orderId
                          }
                        });
                      } else {
                        this.goBack();
                      }
                    }
                  }
                } else {
                  console.log("get productOrderDetail fail");
                }
              }).catch(e => {
                console.log(e);
              });
            }, 2000);
          } else if (this.orderType == 1) {
            this.timer = setInterval(() => {
              this.$http.request({
                baseURL: this.$globalServiceHost.selfMachineHost,
                method: "get",
                url: "/ROrderController/orderDetailOfMine",
                body: {
                  orderId: this.orderId
                }
              }).then(res => {
                if (res.data.success) {
                  let orderDetail = res.data.data.length && res.data.data[0].orderInfo;
                  if (orderDetail.payStatus == 1) {
                    clearInterval(this.timer);
                    if (this.payStatus != 1) {
                      if (this.routerName) {
                        this.$router.push({
                          name: "orderDetail",
                          query: {
                            orderId: this.orderId
                          }
                        });
                      } else {
                        this.goBack();
                      }
                    }
                  }
                } else {
                  console.log("get orderDetail fail");
                }
              }).catch(e => {
                console.log(e);
              });
            }, 2000);
          }
        } else {
          if (this.orderType == 0) {
            this.$http.request({
              method: "get",
              url: "/ZyOrderDetailsController/selectDetailByOrderId",
              body: {
                id: this.orderId
              }
            }).then(res => {
              if (res.data.success) {
                let productOrderDetail = res.data.data.zyOrder || {};
                if (productOrderDetail.orderstatus != 0) {
                  this.payStatus = 1;
                  this.pay_tip = "支付成功";
                  this.pay_desc = "订单支付完成";
                  // clearInterval()
                }
              } else {
                console.log("get productOrderDetail fail");
              }
            }).catch(e => {
              console.log(e);
            });
          } else if (this.orderType == 1) {
            this.$http.request({
              baseURL: this.$globalServiceHost.selfMachineHost,
              method: "get",
              url: "/ROrderController/orderDetailOfMine",
              body: {
                orderId: this.orderId
              }
            }).then(res => {
              if (res.data.success) {
                let orderDetail = res.data.data.length && res.data.data[0].orderInfo;
                if (orderDetail.payStatus == 1) {
                  this.payStatus = 1;
                  this.pay_tip = "支付成功";
                  this.pay_desc = "订单支付完成";
                }
              } else {
                console.log("get orderDetail fail");
              }
            }).catch(e => {
              console.log(e);
            });
          }
        }
      },

      /**
       * go back
       * **/
      goBack() {
        this.$router.go(-1);
      },

      /**
       * 完成支付
       * **/
      completePay() {
        try {
          WeixinJSBridge.call("closeWindow");
        } catch (e) {
          console.log(e);
        }
      }

    },
    created() {
      this.orderId = this.$route.query.orderId || "";
      this.orderType = this.$route.query.orderType || "";
      this.routerName = this.$route.query.routerName || "";
      this.timerInit("getPayStatus");
      if (this.orderId && this.payStatus != 1) {
        this.timerInit();
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  };
</script>

<style scoped lang="less">
  .payProgress_component {
    .padding(0, 0, 0, 0);

    .container_box {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        display: block;
        .width(96);
        .height(104);
        .margin(67, 0, 0, 0)
      }

      .pay_tip {
        .fontSize(16);
        font-weight: 400;
        .margin(17, 0, 10, 0);
      }

      .pay_desc {
        .fontSize(16);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .margin(0, 0, 30, 0);
      }

      .pay_tip.paying {
        color: rgba(5, 207, 103, 1);
      }

      .pay_tip.pay_success {
        color: rgba(0, 105, 255, 1);
      }
    }

    .complete_btn {
      .width(144);
      .height(44);
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
      border-radius: 10px;
      .borderRadius(10, 10, 10, 10);
      .fontSize(18);
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
  }
</style>
