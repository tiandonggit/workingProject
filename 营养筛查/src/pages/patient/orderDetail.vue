/** *@desc 订单详情 *@author houpai *@date 2019/10/29 16:51:30 */
<template>
  <div>
    <commonHeader
      :share-disabled="true"
      :custom-title="'营养方案'"
      :header-show="true"
      :title="orderInfo.payStatus == 1 ? '已付款订单详情' : '订单详情'"
    ></commonHeader>
    <!-- <common-header
                :share-disabled="false"
                :custom-title="'订单详情'"
        ></common-header> -->
    <div class="orderDetail_page">
      <ul
        v-if="orderInfo && orderInfo.payStatus !== 1"
        style="margin-bottom: 30px"
        class="payOrderDetail_ul"
      >
        <li>
          您的订单在 <span style="color:red">{{ date }}</span> 后失效
        </li>
      </ul>
      <!--    未付款显示-->
      <div v-if="orderInfo && orderInfo.payStatus !== 1" class="tip">
        <img src="../../assets/img/ygziti.png" />
      </div>
      <ul v-if="orderInfo && orderInfo.payStatus !== 1" class="products_list">
        <div class="ordernum">
          <img src="../../assets/img/ordernum.png" />订单编号:{{
            orderInfo && orderInfo.orderId
          }}
        </div>
        <li v-for="(item, index) in orderProductInfo" :key="index">
          <img :src="item.topImg" @click.stop="checkImg(item.topImg)" alt="" />
          <div class="product_desc">
            <p class="product_name">
              {{ item.productName }}
            </p>
            <p class="spec">
              <span class="specl">{{ item.specificationName }}</span>
              <span class="specr">x{{ item.productCount }}</span>
            </p>
            <p class="numberPrice">
              <span> ¥{{ item.productPrice | formatPrice }} </span>
            </p>
          </div>
          <div class="pre-message-label">
            营养成品
          </div>
        </li>
        <div class="total_price">
          商品共{{ orderProductInfo.length }}件, 合计
          <span>
            ¥{{ orderInfo && orderInfo.orderTotalPrice | formatPrice }}
          </span>
          <p>营养品一经出售概不退换</p>
        </div>
      </ul>

      <div class="vendingMachine_address">
        <div class="guiicon">
          <img src="../../assets/img/guiiocn.png" />
          <h3>
            自提柜编号{{ orderInfo && orderInfo && orderInfo.deviceCode }}
          </h3>
        </div>
        <!--            <p class="address_detail">-->
        <!--                -->
        <!--            </p>-->
        <div class="icon_box">
          <div @click="checkImg(orderInfo.deviceImgUrl?orderInfo.deviceImgUrl:require('../../assets/img/vendingMachine2.png'))" class="box_img">
            <img :src="orderInfo.deviceImgUrl?orderInfo.deviceImgUrl:require('../../assets/img/vendingMachine2.png')" alt="" />
            <div class="box_tip">
              点击放大图片
            </div>
          </div>
          <div class="phone">
            地址:
            <p class="vendingMachine_number">
              {{ orderInfo && orderInfo.deviceFullAdress }}
            </p>
          </div>
        </div>
      </div>

      <!--    已付款显示-->
      <ul v-if="orderInfo.payStatus != 0" class="payOrderDetail_ul">
        <li>订单编号: {{ orderInfo && orderInfo.orderId }}</li>
        <li>
          订单状态:
          <!--          <span v-if="orderInfo && orderInfo.pushOutStatus === 0 && orderInfo.payStatus === 1">-->
          <!--            已付款,-->
          <!--          </span>-->
          <span
            >{{
              isInvalid === true && orderInfo.payStatus !== 1
                ? "已取消"
                : orderState
            }}
          </span>
        </li>
        <li v-if="orderInfo && orderInfo.payStatus === 1">
          支付时间: {{ orderInfo && orderInfo.payTime }}
        </li>
        <li v-if="orderInfo && orderInfo.payStatus === 1">
          支付金额: {{ orderInfo && orderInfo.orderTotalPrice | formatPrice }}元
        </li>
        <!--      未取货显示-->
        <li v-if="orderInfo && orderInfo.pushOutStatus === 0">
          取货方式: 药柜自提
        </li>
      </ul>

      <!--    已付款显示-->
      <ul
        class="products_list products_list1"
        v-if="orderInfo && orderInfo.payStatus === 1"
      >
        <li v-for="(item, index) in orderProductInfo" :key="index">
          <img :src="item.topImg" @click.stop="checkImg(item.topImg)" alt="" />
          <div class="product_desc">
            <p class="product_name">
              {{ item.productName }}
            </p>
            <p class="spec">
              <span class="specl">{{ item.specificationName }}</span>
              <span class="specr">x{{ item.productCount }}</span>
            </p>
            <p class="numberPrice">
              <span> ¥{{ item.productPrice | formatPrice }} </span>
            </p>
          </div>
          <!--<div class="pre-message-label">
            营养成品
          </div>-->
        </li>
        <div class="total_price">
          商品共{{ orderProductInfo.length }}件, 合计
          <span>
            ¥{{ orderInfo && orderInfo.orderTotalPrice | formatPrice }}
          </span>
          <p>营养品一经出售概不退换</p>
        </div>
      </ul>

      <div class="btn_box" v-if="orderInfo && orderInfo.payStatus !== 3">
        <div
          class="codeShow_btn"
          @click.stop="getCode(orderInfo && orderInfo.pushOutCode)"
          v-if="orderInfo && orderInfo.payStatus === 1"
        >
          自提码
        </div>
        <div
          class="pay_btn"
          v-if="
            orderInfo &&
              orderInfo.payStatus !== 3 &&
              orderInfo.payStatus !== 1 &&
              isInvalid !== true
          "
          @click.stop="$throttle(gotoPay)"
        >
          支付 ( ¥{{ orderInfo && orderInfo.orderTotalPrice | formatPrice }} )
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import { Toast, ImagePreview } from "vant";
import { mapState } from "vuex";

export default {
  name: "orderDetail",
  components: {
    commonHeader
  },
  computed: {
    ...mapState(["Patient"]),
    orderState() {
      let state = "";
      switch (this.orderInfo && this.orderInfo.payStatus) {
        case 0:
          state = "未付款";
          break;
        case 1:
          state = "已付款";
          break;
        case 3:
          state = "已取消";
          break;
        default:
          state = "未付款";
      }
      if (
        this.orderInfo &&
        this.orderInfo.pushOutStatus !== 0 &&
        this.orderInfo.payStatus === 1
      ) {
        state = "已完成";
      }

      if (
        this.orderInfo &&
        this.orderInfo.pushOutStatus === 0 &&
        this.orderInfo.payStatus === 1
      ) {
        state = "待自提";
      }
      return state;
    }
  },
  data() {
    return {
      loading: false,
      orderInfo: "", // 订单信息
      orderProductInfo: [], // 自助柜信息
      date: "", //显示过期时间
      countDown: "", //倒计时时间
      isInvalid: false // 订单是否失效,catch后端订单失效延时问题,待修改
    };
  },

  filters: {
    formatPrice(value) {
      let price = "";
      price = (value / 100).toFixed(2);
      return price;
    }
  },

  methods: {
    getOrderDetail(id) {
      this.$http
        .request({
          baseURL: this.$globalServiceHost.mockServiceHost,
          method: "get",
          url: "/ROrderController/nOrderDetaionOfMine",
          body: {
            openId: this.Patient.patientMessage.opendId,
            // openId: "ouR7Ps2BOllOiuCyytTT6hanji1w",
            orderId: id
            // orderId: "456517334992032399"
          }
        })
        .then(res => {
          if (res.data.data.length) {
            this.orderInfo = res.data.data[0].orderInfo;
            this.orderProductInfo = res.data.data[0].orderProductInfo;
            this.date = this.dateAdd10Min(
              res.data.data[0].orderInfo.orderCreateTime,
              this.countDown * 60
            );
            try {
              let orderCreateTime = res.data.data[0].orderInfo.orderCreateTime;
              let orderCreateTimeDate = new Date(
                orderCreateTime.replace(/-/g, "/")
              ).getTime(); //开始时间
              let nowTimeDate = new Date().getTime();
              if (nowTimeDate - orderCreateTimeDate >= 600000) {
                this.isInvalid = true;
              }
            } catch (e) {
              console.log(e);
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 增加过期时间
     * **/
    dateAdd10Min(time, out) {
      console.log(time);
      console.log("------------");
      // let timeDate = (new Date(time).getTime()) / 1000 + 600;
      var date = new Date(time.replace(/-/g, "/")); //开始时间
      var timeDate = date.getTime() / 1000 + out;
      return this.format(timeDate * 1000);
    },
    format(dataString) {
      console.log(dataString);
      //dataString是整数，否则要parseInt转换
      var time = new Date(dataString);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var day = time.getDate();
      var hour = time.getHours();
      var minute = time.getMinutes();
      var second = time.getSeconds();
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day) +
        " " +
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (minute < 10 ? "0" + minute : minute)
      );
    },
    gotoPay() {
      let ToastRequest = Toast.loading({
        duration: 0,
        mask: true,
        message: "加载中..."
      });
      this.$http
        .request({
          baseURL: this.$globalServiceHost.mockServiceHost,
          method: "post",
          url: "/ROrderController/unifiedPayment",
          body: {
            orderId: this.Patient.orderId,
            openId: this.Patient.patientMessage.opendId
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          ToastRequest.clear();
          if (res.data.success) {
            let _this = this;
            let data = res.data;
            this.$wx.ready(() => {
              this.$wx.chooseWXPay({
                appId: data.data.appId,
                timestamp: data.data.timeStamp,
                nonceStr: data.data.nonceStr,
                package: data.data.package,
                signType: data.data.signType,
                paySign: data.data.paySign,
                success: function(res) {
                  console.log("pay success");
                  _this.getOrderDetail(_this.Patient.orderId);
                  try {
                    WeixinJSBridge.call("closeWindow");
                  } catch (e) {
                    console.log(e);
                  }
                },
                fail: function(e) {
                  console.log("pay fail");
                },
                cancel: function(e) {
                  _this.$router.push({
                    name: "payCancel",
                    query: {
                      onLineOrderId: _this.Patient.orderId
                    }
                  });
                }
              });
            });
          } else {
            Toast({
              message: res.data.message || "操作失败",
              position: "bottom"
            });
            return false;
          }
        })
        .catch(e => {
          ToastRequest.clear();
          console.log(e);
        });
    },

    getCode(code) {
      this.$router.push({
        path: "/shipmentCode",
        query: {
          shipmentCode: code
        }
      });
    },
    /**
     * 获取订单倒计时时间
     * **/
    getCountDown() {
      return new Promise((resolve, reject) => {
        this.$http
          .request({
            baseURL: this.$globalServiceHost.mockServiceHost,
            method: "get",
            url: "/ROrderController/selectOrderCancleTime",
            body: {
              orderId: this.Patient.orderId
            }
          })
          .then(res => {
            console.log("跳转到这里");
            if (res.data.success) {
              this.countDown = res.data.data;
              resolve();
            } else {
              console.log("get CountDown fail");
            }
          })
          .catch(e => {
            reject(e);
            console.log(e);
          });
      });
    },
    /**
     * 微信config**/
    wxConfig() {
      return new Promise((resolve, reject) => {
        let _this = this;
        this.$http
          .request({
            method: "post",
            url: "/wechat/getJsApiSignature",
            body: {
              url: window.location.href.split("#")[0]
            }
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              let appId = res.data.data.appId || "";
              let timeStamp = res.data.data.timeStamp || "";
              let nonceStr = res.data.data.nonceStr || "";
              let signature = res.data.data.signature || "";
              try {
                this.$wx.config({
                  debug: false, // 开启调试模式
                  appId: appId, // 必填，公众号的唯一标识
                  timestamp: timeStamp, // 必填，生成签名的时间戳
                  nonceStr: nonceStr, // 必填，生成签名的随机串
                  signature: signature, // 必填，签名
                  jsApiList: ["chooseWXPay"]
                });
              } catch (e) {
                console.log(e);
              }
              resolve(res.data.data);
            }
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      });
    },

    /**
     * 点击预览图片**/
    checkImg(img) {
      if (img) {
        let productImg = "";
        try {
          if (img) {
            productImg = img + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        ImagePreview([productImg]);
      }
    }
  },

  created() {
    let wxCofigPromise = null;
    let getCountDown = null;
    wxCofigPromise = this.wxConfig();
    getCountDown = this.getCountDown();
    if (this.Patient.orderId) {
      console.log("请求接口");
      Promise.all([wxCofigPromise, getCountDown]).then(() => {
        this.getOrderDetail(this.Patient.orderId);
      });
    }
    console.log(this.dateAdd10Min("2019-10-10 11:11"));
  }
};
</script>

<style scoped lang="less">
.spec {
  display: flex;
  justify-content: space-between;

  .specl {
    color: #999999 !important;
  }

  .specr {
    color: #333333 !important;
  }
}

.orderDetail_page {
  .common-header {
    width: 100vw;
    padding: 0;
    position: relative;
    top: -12px;
    left: -12px;
  }

  padding: 56px 12px 64px 12px;

  .vendingMachine_address {
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    padding: 10px;
    // margin-top: 15px;
    .guiicon {
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 16px;
        height: 20px;
        margin-right: 8px;
      }
    }

    h3 {
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 32px;
    }

    .address_detail {
      font-size: 14px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
      width: 100%;
      /*text-overflow: ellipsis;*/
      /*white-space: nowrap;*/
      /*overflow: hidden;*/
    }

    .icon_box {
      display: flex;
      padding-top: 12px;
      color: #333333 !important;

      a {
        color: #999999 !important;
      }
      .box_img {
        display: inline-block;
        width: 78px;
        height: 78px;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
        .box_tip {
          position: absolute;
          bottom: 0;
          width: 78px;
          height: 17px;
          font-size: 12px;
          line-height: 17px;
          border-radius: 0 0 10px 10px;
          font-weight: 400;
          color: #fff;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
        }
      }

      .phone {
        flex: 1;
        margin-left: 10px;

        .vendingMachine_number {
          float: right;
          width: 80%;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
        }
      }
    }
  }

  .payOrderDetail_ul {
    margin: 15px 0 0 0;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;

    li {
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 32px;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .products_list1 {
    position: relative;
    background-color: #fff;
    margin: 15px 0 0 0;
    border-radius: 10px;
    margin-bottom: 12px;

    li {
      padding: 10px;
      display: flex;

      img {
        display: inline-block;
        width: 78px;
        height: 78px;
        border-radius: 10px;
      }

      .product_desc {
        flex: 1;
        margin-left: 10px;
        display: flex;
        justify-content: space-between;
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;

        p {
          font-size: 16px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 24px;

          span {
            color: #ff3000;
          }
        }
      }
    }

    .total_price {
      border-top: 1px solid #f2f2f2;
      padding: 10px;
      text-align: right;
      font-size: 14px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;

      span {
        color: #f82828;
      }

      p {
        font-size: 14px;
        font-weight: 400;
        color: #0069ff;
        line-height: 28px;
      }
    }
  }

  .products_list {
    position: relative;
    background-color: #fff;
    // margin: 15px 0 0 0;
    border-radius: 10px;
    margin-bottom: 12px;

    li {
      padding: 10px;
      display: flex;
      position: relative;
      img {
        display: inline-block;
        width: 78px;
        height: 78px;
        border-radius: 10px;
      }

      .product_desc {
        flex: 1;
        margin-left: 10px;
        display: flex;
        justify-content: space-between;
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;

        p {
          font-size: 16px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 24px;

          span {
            color: #ff3000;
          }
        }
      }
      .pre-message-label {
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        color: #fff;
        position: absolute;
        top: 10px;
        z-index: 32;
        width: 66px;
        height: 20px;
        background: linear-gradient(
          226deg,
          rgba(255, 146, 0, 1) 0%,
          rgba(255, 89, 0, 1) 100%
        );
        border-radius: 10px 0 10px 0;
      }
    }

    .total_price {
      border-top: 1px solid #f2f2f2;
      padding: 10px;
      text-align: right;
      font-size: 14px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;

      span {
        color: #f82828;
      }

      p {
        font-size: 14px;
        font-weight: 400;
        color: #0069ff;
        line-height: 28px;
      }
    }
  }

  .ordernum {
    font-size: 16px;
    padding: 12px 0;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    overflow: hidden;

    img {
      width: 16px;
      height: 17px;
      margin: 0 12px 0 10px;
    }
  }

  .tip {
    /*position: absolute;*/
    /*top: -16px;*/
    /*text-align: center;*/
    /*line-height: 32px;*/
    /*width: 90px;*/
    /*height: 32px;*/
    /*background: linear-gradient(44deg, rgba(233, 140, 46, 1) 0%, rgba(255, 160, 64, 1) 100%);*/
    /*border-radius: 16px;*/
    /*color: #fff;*/
    height: 46px;
    background-color: #f2f2f2;
    display: none;

    img {
      margin-left: 13px;
      width: 144px;
      height: 46px;
    }
  }

  .btn_box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px;
    // background-color: #fff;

    .codeShow_btn,
    .pay_btn {
      color: #fff;
      height: 40px;
      line-height: 40px;
      background: linear-gradient(
        306deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%
      );
      border-radius: 10px;
      text-align: center;
    }
  }
}
</style>
