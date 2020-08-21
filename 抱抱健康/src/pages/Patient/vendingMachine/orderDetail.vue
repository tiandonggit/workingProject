/** *@desc 订单详情 *@author houpai *@date 2019/09/09 10:38:19 */
<template>
  <div class="orderDetail_page">
    <common-header
        :share-disabled="true"
        :title="'订单详情'"
        :header-show="true"
        :custom-title="'我的订单'"
    ></common-header>
    <div v-if="!loading">
      <div class="top_banner">
        <div class="order_title">
          <div class="state_img">
            <img
                v-if="orderDetail.payStatus !== 1 && orderDetail.payStatus !== 3"
                src="../../../assets/images/unpaid.png"
                alt=""
            />
            <img
                v-if="orderDetail.payStatus === 3 && orderDetail.payStatus !== 3"
                src="../../../assets/images/unpaid.png"
                alt=""
            />
            <img
                v-if="
                orderDetail.payStatus === 1 && orderDetail.pushOutStatus === 3
              "
                src="../../../assets/images/complete.png"
                alt=""
            />
            <!--            <img v-if="orderDetail.payStatus === 3" -->
            <!--                 src="../../../assets/images/cancel.png" alt=""/>-->
            <img v-else
                 src="../../../assets/images/unfetchedDrugs.png"
                 alt=""/>
          </div>
          <div class="state_desc_box">
            <div>
              <p class="order_state">
                {{ orderSate(orderDetail.payStatus, orderDetail.pushOutStatus) }}
              </p>
              <!--              <p class="state_desc" v-if="orderDetail && orderDetail.payStatus !== 1 &&orderDetail.payStatus !== 3">-->
              <!--                剩余{{ unPayLeftTime }}自动取消-->
              <!--              </p>-->
            </div>
          </div>
        </div>
      </div>
      <div class="vendingMachine_address address"
           :class="[{'noBorderRiadiusBottom':orderDetail && orderDetail.payStatus === 1}]">
        <div class="desc">
          <p class="address_title">
            <img src="../../../assets/images/place.png" alt=""/>
            智配柜地址
          </p>
          <p class="address_detail">
            {{ orderDetail.deviceFullAdress || "" }}
          </p>
          <div class="vendingMachine_img" v-if="orderDetail.deviceImgUrl">
            <img @click.stop="checkImg(orderDetail.deviceImgUrl)"
                 :src="orderDetail.deviceImgUrl | formatProductImg" alt="">
            <p>智配柜如图所示</p>
            <p>(点击放大图片)</p>
          </div>
        </div>
      </div>
      <!--      已付款待显示提货码-->
      <div class="code_li" v-if="orderDetail && orderDetail.payStatus === 1">
        <p class="code_title">自取提货码</p>
        <ul class="code">
          <li v-for="(item, index) in orderDetail &&
                orderDetail.pushOutCode.split('')"
              :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
      <ul class="order_list">
        <li>
          <div class="orderDetail_title">
            <div class="vendingMachine_number">
              <div class="icon_box">
                <img src="../../../assets/images/vendingMachine.png" alt=""/>
              </div>
              <span>智配柜编号{{ orderDetail.deviceCode || "" }}</span>
            </div>
            <!--          <span></span>-->
          </div>
          <ul class="drugs_list">
            <li v-for="(subItem, subIndex) in orderProductInfo"
                :class="[{'lastLiStyle':subIndex === orderProductInfo.length - 1 }]"
                :key="subIndex">
              <div class="drug_img_box">
                <img
                    :src="subItem.topImg | formatProductImg"
                    @click.stop="checkImg(subItem.topImg)"
                    alt=""
                />
              </div>
              <div class="drug_desc">
                <div>
                  <p class="drug_name">{{ subItem.productName }}</p>
                  <p class="drug_specifications">
                    {{ subItem.specificationName }}
                  </p>
                </div>
                <!--                <p class="drug_number">x{{ subItem.productCount }}</p>-->
                <div class="price">¥{{ subItem.productPrice | formatPrice }}</div>
              </div>
              <!--              <div class="price">¥{{ subItem.productPrice | formatPrice }}</div>-->
              <p class="drug_number">x{{ subItem.productCount }}</p>
            </li>
          </ul>
          <div class="btn_box"
               v-if="orderDetail && orderDetail.payStatus !== 1">
            <div class="detail_btn" @click.stop="$throttle(pay)">
              去付款
            </div>
          </div>
        </li>

        <li class="orderDetail_li">
          <div class="title">
            <div class="icon_box">
              <img src="../../../assets/images/integraOrderBook.png" alt=""/>
            </div>
            <span>订单详情</span>
          </div>
          <div>
            <p>订单编号: {{ orderDetail.orderId || "" }}</p>
            <p>下单时间: {{ orderDetail.orderCreateTime || "" }}</p>
            <p v-if="orderDetail.payStatus === 1">
              支付方式: {{ orderDetail.orderPayType | formatOrderPayType }}
            </p>
            <p v-if="orderDetail.payStatus === 1 && orderDetail.payTime">
              支付时间: {{ orderDetail.payTime || "" }}
            </p>
          </div>
        </li>

        <li class="drugDetail_li">
          <div class="title">
            <div class="icon_box">
              <img src="../../../assets/images/orderDetailIcon.png" alt=""/>
            </div>
            <span>商品详情</span>
          </div>
          <div>
            <p>
              商品总额:
              ¥{{ orderDetail && orderDetail.orderTotalPrice | formatPrice }}
            </p>
            <p v-if="orderDetail.payStatus === 1">
              实 付 款:
              ¥{{ orderDetail && orderDetail.orderTotalPrice | formatPrice }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"
    ></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast, ImagePreview} from "vant";

  export default {
    name: "orderDetail",
    components: {
      commonHeader
    },

    computed: {
      ...mapState(["PatientIM"])
    },

    data() {
      return {
        unPayLeftTime: "", // 未支付订单剩余时间
        timer: null, // 倒计时定时器
        orderDetail: "", // 订单详情信息
        orderProductInfo: "", // 自助柜信息
        loading: true,
        orderId: ""
      };
    },

    filters: {
      formatPrice(value) {
        let price = "";
        price = (value / 100).toFixed(2);
        return price;
      },

      formatProductImg(value) {
        let productImg = "";
        try {
          if (value) {
            productImg =
              value.split(",")[0] + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        return productImg;
      },

      formatOrderPayType(value) {
        let payType = "";
        if (value === 3) {
          payType = "微信支付";
        } else if (value === 2) {
          payType = "支付宝支付";
        }
        return payType;
      }
    },

    methods: {
      /**
       * 点击预览图片**/
      checkImg(img) {
        let productImg = "";
        try {
          if (img) {
            productImg = img.split(",")[0] + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        ImagePreview([productImg]);
      },

      /**
       * 订单状态显示
       * 未支付显示支付状态,已支付显示出货状态**/
      orderSate(payStatus, pushOutStatus) {
        let orderState = "";
        if (payStatus === 1) {
          if (pushOutStatus === 3) {
            orderState = "已完成";
          } else {
            orderState = "待取货";
          }
        } else {
          if (payStatus === 3) {
            orderState = "已取消";
          } else {
            orderState = "待付款";
          }
        }
        return orderState;
      },

      /**
       * 获取订单详情**/
      getOrderDetail() {
        this.loading = true;
        this.$http
          .request({
            baseURL: this.$globalServiceHost.selfMachineHost,
            method: "get",
            url: "/ROrderController/orderDetailOfMine",
            body: {
              orderId: this.orderId
            }
          })
          .then(res => {
            this.loading = false;
            if (res.data.success) {
              this.orderDetail =
                res.data.data.length && res.data.data[0].orderInfo;
              try {
                this.orderDetail.pushOutCode += "";
              } catch (e) {
                console.log(e);
              }
              this.orderProductInfo =
                res.data.data.length && res.data.data[0].orderProductInfo;
              // this.showTime(
              //   this.orderDetail.orderCreateTime,
              //   this.orderDetail.payStatus
              // );
              // this.timer = window.setInterval(() => {
              //   this.showTime(
              //     this.orderDetail.orderCreateTime,
              //     this.orderDetail.payStatus
              //   );
              // }, 1000);
            } else {
              console.log("get orderDetail fail");
            }
          })
          .catch(e => {
            this.loading = false;
            console.log(e);
          });
      },

      // /**
      //  * 倒计时计算**/
      // showTime(time, status) {
      //   time = time.replace(/-/g, "/");
      //   let timedate = new Date(time);
      //   //获取当前时间
      //   let now = new Date();
      //   //得出的为秒数
      //   // let date =
      //   //   parseInt(timedate.getTime() + 1 * 24 * 60 * 60 * 1000 - now.getTime()) /
      //   //   1000;
      //
      //   // 方便测试 未支付订单超时时间改成10分钟
      //   let date =
      //     parseInt(timedate.getTime() + 10 * 60 * 1000 - now.getTime()) /
      //     1000;
      //   if (date <= 0) {
      //     this.orderDetail.payStatus = 3;
      //     window.clearInterval(this.timer);
      //   } else {
      //     let hour = parseInt((date / 60 / 60) % 24);
      //     let minute = parseInt((date / 60) % 60);
      //     hour = hour < 10 ? "0" + hour : hour;
      //     minute = minute < 10 ? "0" + minute : minute;
      //     this.unPayLeftTime = hour + "时" + minute + "分";
      //     this.unPayLeftTime = this.unPayLeftTime.replace(/-/g, "");
      //     if (status === 3 && hour === 0 && minute === 0) {
      //       window.clearInterval(this.timer);
      //     }
      //   }
      // },

      /**
       * 微信config**/
      wxConfig() {
        return new Promise((resolve, reject) => {
          this.$http.request({
            method: "post",
            url: "/wechat/getJsApiSignature",
            body: {
              url: window.location.href.split("#")[0]
            }
          }).then(res => {
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
          }).catch(e => {
            console.log(e);
            reject(e);
          });
        });
      },
      /**
       * wx支付**/
      pay() {
        let ToastRequest = Toast.loading({
          duration: 0,
          mask: true,
          message: "加载中..."
        });
        this.$http.request({
          baseURL: this.$globalServiceHost.selfMachineHost,
          method: "post",
          url: "/ROrderController/unifiedPayment",
          body: {
            orderId: this.orderId,
            openId: this.PatientIM.patientMessage.opendId
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          ToastRequest.clear();
          if (res.data.success) {
            let _this = this;
            let data = res.data;
            this.$wx.ready(() => {
              this.$wx.chooseWXPay({
                appId: data.data.appId,
                timestamp: data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.data.paySign, // 支付签名
                success: function (res) {
                  console.log("pay success");
                  // _this.getOrderDetail();
                  // 新增支付中页面
                  _this.$router.push({
                    name: "payProgress",
                    query: {
                      orderType: 1,
                      orderId: _this.orderId
                    }
                  });
                },
                fail: function (e) {
                  console.log("pay fail");
                },
                cancel: function (e) {
                  _this.$router.push({
                    name: "payCancel",
                    query: {
                      onLineOrderId: _this.orderId
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
            this.getOrderDetail();
            return false;
          }
        }).catch(e => {
          ToastRequest.clear();
          console.log(e);
        });
      }
    },

    created() {
      let wxCofigPromise = null;
      wxCofigPromise = this.wxConfig();
      this.orderId = this.$route.query.orderId || "";
      Promise.all([wxCofigPromise]).then(() => {
        this.getOrderDetail();
      });
    },
    beforeDestroy() {
      window.clearInterval(this.timer);
    }
  };
</script>

<style scoped lang="less">
  .orderDetail_page {
    .padding(44, 0, 0, 0);
    background: rgba(242, 242, 242, 1);

    .code_li {
      position: relative;
      top: -40 / 375 * 100vw;
      box-sizing: border-box;
      .padding(39, 66, 0, 66);
      .margin(0, 12, 0, 12);
      .height(190);
      background: url('../../../assets/images/code.png') no-repeat center;
      background-size: cover;
      .borderRadius(0, 0, 10, 10);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;

      .code_title {
        .fontSize(16);
        .lineHeight(22);
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        .padding(0, 0, 15, 0);
      }


      .title {
        .padding(0, 0, 12, 0);
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        li:nth-child(4) {
          .margin(0, 0, 20, 0);
        }

        li:nth-child(8) {
          .margin(0, 0, 20, 0);
        }

        li {
          .margin(0, 20, 20, 0);
          .width(32);
          .height(32);
          .lineHeight(32);
          text-align: center;
          color: @mainColor;
          .fontSize(18);
          font-weight: bold;
          .borderRadius(4, 4, 4, 4);
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 1px 3px 0px rgba(0, 105, 255, 1);
          border: 2px solid rgba(255, 255, 255, 1);
        }
      }
    }

    .title {
      display: flex;
      align-items: center;
    }

    .icon_box {
      display: inline-block;
      .width(20);
      .height(20);

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .top_banner {
      box-sizing: border-box;
      width: 100%;
      .height(140);
      .padding(0, 12, 0, 12);
      background: url("../../../assets/images/orderDetailBanner.png") no-repeat center;
      background-size: cover;

      .order_title {
        display: flex;
        box-sizing: border-box;
        .padding(12, 12, 12, 12);

        .state_img {
          .width(78);
          .height(78);

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .state_desc_box {
          .margin(0, 0, 0, 6);
          flex: 1;
          display: flex;
          align-items: center;

          p {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .state_desc {
            .lineHeight(20);
            .fontSize(14);
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }

          .order_state {
            .lineHeight(22);
            .fontSize(16);
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            .padding(0, 0, 8, 0);
          }
        }
      }
    }

    .vendingMachine_address.noBorderRiadiusBottom {
      .borderRadius(10, 10, 0, 0);
      .padding(12, 12, 0, 12);
    }

    .vendingMachine_address {
      position: relative;
      top: -40 / 375 * 100vw;
      .margin(0, 12, 0, 12);
      .borderRadius(10, 10, 10, 10);
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .padding(12, 12, 12, 12);

      .desc {
        width: 100%;

        .address_title {
          display: flex;
          align-items: center;
          width: 100%;
          .fontSize(16);
          .lineHeight(20);
          .margin(0, 0, 12, 0);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);

          img {
            .width(20);
            .height(20);
            display: block;
            .margin(0, 10, 0, 0);
          }
        }

        .address_detail {
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: @fontColor33;
          .margin(0, 0, 0, 30);
          /*overflow: hidden;*/
          /*text-overflow: ellipsis;*/
          /*display: -webkit-box;*/
          /*-webkit-line-clamp: 2;*/
          /*-webkit-box-orient: vertical;*/
        }

        .vendingMachine_img {
          display: flex;
          align-items: center;
          flex-direction: column;

          img {
            display: block;
            .width(140);
            .height(140);
            .margin(20, 0, 20, 0);
            .borderRadius(10, 10, 10, 10);
          }

          p {
            .fontSize(14);
            font-weight: 400;
            color: @fontColor66;
            .lineHeight(20);
          }
        }
      }
    }

    .order_list {
      box-sizing: border-box;
      .padding(0, 12, 12, 12);
      .margin(-28, 0, 0, 0);

      li {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
        .borderRadius(10, 10, 10, 10);
        .padding(12, 12, 12, 12);
        .margin(0, 0, 12, 0);

        .orderDetail_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f2f2f2;
          .padding(0, 0, 12, 0);

          .vendingMachine_number {
            display: flex;
            align-items: center;
            width: 100%;
          }

          span {
            display: inline-block;
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .margin(0, 0, 0, 9);
            .fontSize(16);
            .lineHeight(20);
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }
        }
      }

      .orderDetail_li,
      .drugDetail_li {
        p {
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          .margin(12, 0, 12, 0);
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .title {
        .fontSize(16);
        .lineHeight(20);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);

        span {
          .margin(0, 0, 0, 9);
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
      }

      .drugs_list {
        .lastLiStyle {
          border-bottom: none;
          .margin(0, 0, 0, 0);
        }

        li {
          .padding(12, 0, 12, 0);
          .borderRadius(0, 0, 0, 0);
          border-bottom: 1px solid #f2f2f2;
          box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.1);
          display: flex;

          .drug_img_box {
            .width(78);
            .height(78);
            background: rgba(246, 246, 246, 1);
            .borderRadius(10, 10, 10, 10);
            overflow: hidden;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          .drug_desc {
            box-sizing: border-box;
            .margin(0, 0, 0, 12);
            flex: 1;
            width: 0;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            justify-content: space-between;
            flex-direction: column;

            .drug_number {
              .lineHeight(21);
              .fontSize(17);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
            }

            .drug_specifications {
              .fontSize(14);
              .lineHeight(18);
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
            }

            .drug_name {
              .fontSize(16);
              .lineHeight(20);
              .padding(0, 0, 8, 0);
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }

            p {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }

          .price {
            display: flex;
            align-items: center;
            .fontSize(16);
            font-weight: 400;
            color: rgba(255, 0, 0, 1);
          }
        }
      }

      .btn_box {
        display: flex;
        justify-content: flex-end;

        .detail_btn {
          .width(115);
          .height(31);
          .lineHeight(31);
          text-align: center;
          color: #fff;
          .borderRadius(10, 10, 10, 10);
          background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
        }
      }
    }
  }


</style>
