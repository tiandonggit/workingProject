/**
*@desc 推荐产品确认订单
*@author houpai
*@date 2020/02/15 10:43:45
*/
<template>
  <div class="submitProductOrder_page">
    <common-header
        :share-disabled="true"
        :custom-title="'产品购买'"
        :header-show="true"
        :title="'确认订单'"
    ></common-header>
    <!--    收货地址-->
    <div class="address_box">
      <div class="withAddress_box"
           @click.stop="checkAddress"
           v-if="addressPerson.id">
        <p class="message_title">
          <img src="../../../assets/images/place.png" alt="">
          <span>收货人信息</span>
        </p>
        <p class="nameAndPhone">
          <span>
            <b class="name"> {{ addressPerson.name }}</b>
            <b class="phone"> {{ addressPerson.phone }}</b>
          </span>
          <van-icon name="arrow"></van-icon>
        </p>
        <p class="address_detail">
          {{ addressPerson.address + addressPerson.pointnum }}
        </p>
      </div>
      <div class="withOutAddress_box" v-else @click="checkAddress">
        <p class="message_title">
          <img src="../../../assets/images/place.png" alt="">
          <span>请添加收货人地址</span>
        </p>
        <van-icon name="arrow"></van-icon>
      </div>
    </div>

    <!--    产品清单-->
    <ul class="productList_box">
      <h3 class="product_title">
        <img src="../../../assets/images/vendingMachine.png" alt="">
        <span>{{productOrederDetail.orderno || ""}}</span>
      </h3>

      <li class="product_item"
          :class="[{'withoutBorderBottom':index === 4}]"
          v-for="(item,index) in productOrderList"
          :key="index">
        <div class="productImg_box">
          <img :src="item.icon | formatProductImg"
               alt=""/>
        </div>
        <div class="productDesc_box">
          <p class="product_name">{{ item.productname }}</p>
          <p class="product_specifications">{{ item.specification }}</p>
          <p class="priceAndNumber">
            <span class="price">¥{{ (item.activityprice / 100).toFixed(2) }}</span>
            <span class="number">x{{ item.number }}</span>
          </p>
        </div>
      </li>

      <div class="totalPrice_box" v-if="JSON.stringify(productOrederDetail) !== '{}'">
        <p v-if="productOrederDetail.ordertype == 0">商品总价: <span>¥{{productOrederDetail.ordermoney && productOrederDetail.deliverycosts && ((productOrederDetail.ordermoney - productOrederDetail.deliverycosts) / 100).toFixed(2) || (productOrederDetail.ordermoney / 100).toFixed(2)}}</span>
        </p>
        <p v-if="productOrederDetail.ordertype == 1">商品总价: <span>¥{{productOrederDetail.ordermoney  && ((productOrederDetail.ordermoney - productOrederDetail.deliverycosts) / 100).toFixed(2) || ""}}</span>
        </p>
        <p v-if="productOrederDetail.ordertype == 0">快递费: <span>¥{{productOrederDetail && (productOrederDetail.deliverycosts / 100).toFixed(2) || ""}}</span>
        </p>
      </div>
    </ul>

    <div class="footer-box"
         v-if="productOrederDetail && productOrederDetail.orderstatus === 0">
      <div class="next-btn"
           @click.stop="$throttle(pay)">
        <van-button slot="button" class="next-btn" size="large">
          去付款(¥{{productOrederDetail && (productOrederDetail.ordermoney / 100).toFixed(2) }})
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast, ImagePreview} from "vant";

  export default {
    name: "submitProductOrder",
    data() {
      return {
        productOrderId:'',
        addressPerson: {}, // 地址
        productOrderList: [], // 产品列表
        productOrederDetail: {}// 产品订单信息
      };
    },
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    filters: {
      formatProductImg(value) {
        let productImg = "";
        try {
          if (value) {
            productImg = value.split(",")[0] + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        return productImg;
      }
    },
    methods: {
      /**
       * 地址处理**/
      addressInit() {
        let addressData = this.$store.state.Address.addressData;
        if (addressData.id) {
          this.addressPerson = addressData;
        } else {
          this.getUserAddress();
        }
      },

      /**
       * 当vuex被清除,再次查询是否有地址,选择第一个作为地址**/
      getUserAddress() {
        this.$http.request({
          method: "get",
          url: "/RUserAddressController/getListRUserAddress",
          body: {}
        }).then(res => {
          if (res.data.success) {
            if (res.data.data.length > 0) {
              if (res.data.data[0].status === 0) {
                this.addressPerson = res.data.data[0] || {};
                this.$store.commit("Address/addressData", this.addressPerson);
              }
            }
          } else {
            console.log("地址查询接口报错");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 再次选择地址
       * **/
      checkAddress() {
        this.$router.push({
          name: "integralAddressSelect",
          query: {}
        });
      },

      /**
       * 获取订单详情
       * **/
      getProductOrderDetail() {
        this.$http.request({
          method: "get",
          url: "/ZyOrderDetailsController/selectDetailByOrderId",
          body: {
            id:this.productOrderId
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            this.productOrderList = res.data.data.zyOrderDetails || [];
            this.productOrederDetail = res.data.data.zyOrder || {};
            let selectFrom = localStorage.getItem("productGo");
            if (!selectFrom && this.productOrderDetail.ruseraddressid) {
              this.addressPerson.id = this.productOrderDetail.ruseraddressid;
              this.addressPerson.phone = this.productOrderDetail.phonenumber;
              this.addressPerson.name = this.productOrderDetail.username;
              this.addressPerson.address = this.productOrderDetail.address;
              this.addressPerson.pointnum = "";
            }
          } else {
            console.log("获取订单接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * wx config init
       * **/
      wxConfigInit() {
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
       * wx支付**/
      pay() {
        if (!this.addressPerson.id) {
          Toast({
            message: "请先添加收货地址",
            position: "bottom"
          });
          return false;
        }
        let ToastRequest = Toast.loading({
          duration: 0,
          mask: true,
          message: "加载中..."
        });
        this.$http.request({
          method: "post",
          url: "/ZyOrderController/wechatPayOrder",
          body: {
            orderId: this.productOrderId,
            addressId: this.addressPerson.id
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          ToastRequest.clear();
          if (res.data.success) {
            let data = res.data;
            let _this = this;
            this.$wx.ready(() => {
              this.$wx.chooseWXPay({
                appId: data.data.appId,
                timestamp: data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.data.paySign, // 支付签名
                success: function (res) {
                  _this.$router.push({
                    name:'payProgress',
                    query:{
                      orderType:0,
                      orderId:_this.productOrderId,
                      routerName:'productOrderDetail'
                    }
                  })

                  // 新增加支付中页面
                  // _this.$router.push({
                  //   name: "productOrderDetail",
                  //   query:{
                  //     productOrderId:_this.productOrderId
                  //   }
                  // });
                },
                fail: function (err) {
                  console.log("pay fail", err);
                }
              });
            });
          } else {
            console.log("产品订单支付接口报错");
          }
        }).catch(e => {
          ToastRequest.clear();
          console.log(e);
        });
      }
    },
    created() {
      this.addressInit();
      let wxCofigPromise = null;
      this.productOrderId = this.$route.query.productOrderId || ''
      wxCofigPromise = this.wxConfigInit();
      Promise.all([wxCofigPromise]).then(() => {
        this.getProductOrderDetail();
      });
    },
    beforeDestroy() {
      localStorage.removeItem("productGo");
    }
  };
</script>

<style scoped lang="less">
  .submitProductOrder_page {
    .padding(54, 12, 60, 12);

    .address_box {
      background: #fff;
      .borderRadius(10, 10, 10, 10);
      .padding(15, 10, 10, 10);

      .withAddress_box {
        p {
          .margin(0, 0, 15, 0);
        }

        .message_title {
          display: flex;
          align-items: center;

          img {
            .width(18);
            .height(18);
            .margin(0, 10, 0, 0);
          }

          span {
            .fontSize(18);
            .lineHeight(22);
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }
        }

        .nameAndPhone {
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            display: inline-block;
            flex: 1;
            width: 0;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .name {
            .fontSize(14);
            .lineHeight(18);
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            .margin(0, 10, 0, 0);
          }

          .phone {
            .fontSize(16);
            .lineHeight(20);
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }

          i {
            color: #333333;
            .fontSize(24);
          }
        }

        .address_detail {
          .margin(0, 0, 0, 0);
          .padding(0, 24, 0, 0);
          .fontSize(14);
          .lineHeight(18);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }

      .withOutAddress_box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .message_title {
          display: flex;
          align-items: center;

          img {
            .width(18);
            .height(18);
            .margin(0, 10, 0, 0);
          }

          span {
            .fontSize(16);
            .lineHeight(20);
            font-weight: bold;
            color: rgba(153, 153, 153, 1);
          }

        }

        i {
          .fontSize(24);
        }
      }
    }

    .productList_box {
      background: #fff;
      overflow: hidden;
      .borderRadius(10, 10, 10, 10);
      .margin(20, 0, 0, 0);

      .product_title {
        display: flex;
        align-items: center;
        .padding(10, 10, 10, 10);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        img {
          .width(18);
          .height(18);
          .margin(0, 10, 0, 0);
        }

        span {
          .fontSize(16);
          .lineHeight(20);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
      }

      .product_item {
        display: flex;
        /*align-items: center;*/
        .margin(0, 10, 0, 10);
        .padding(10, 0, 10, 0);
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);

        .productImg_box {
          .width(78);
          .height(78);
          overflow: hidden;
          .borderRadius(10, 10, 10, 10);
          .margin(0, 10, 0, 0);

          img {
            width: 100%;
            height: 100%;
          }
        }

        .productDesc_box {
          flex: 1;
          width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          p {
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .product_name {
            .fontSize(16);
            .lineHeight(20);
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }

          .product_specifications {
            .fontSize(14);
            .lineHeight(18);
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }

          .priceAndNumber {
            display: flex;
            justify-content: space-between;

            .number {
              color: rgba(51, 51, 51, 1);
              .fontSize(16);
              .lineHeight(20);
              font-weight: 400;
            }

            .price {
              color: rgba(255, 48, 0, 1);
              .fontSize(16);
              .lineHeight(20);
              font-weight: bold;
            }
          }
        }

      }

      .totalPrice_box {
        .padding(15, 10, 0, 10);

        p {
          .fontSize(14);
          .lineHeight(18);
          .margin(0, 0, 15, 0);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);

          span {
            .fontSize(14);
            .lineHeight(18);
            color: rgba(255, 48, 0, 1);
            font-weight: bolder;
          }
        }
      }
    }
  }
</style>
