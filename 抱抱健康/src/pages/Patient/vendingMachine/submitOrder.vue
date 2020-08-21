/** *@desc 提交订单 *@author houpai *@date 2019/09/10 11:18:59 */
<template>
  <div class="submitOrder_page">
    <common-header
        :share-disabled="true"
        :title="'提交订单'"
        :header-show="true"
        :custom-title="'智配柜'"></common-header>
    <div v-if="!loading">
      <div class="address_title">
        <div class="icon_box">
          <img src="../../../assets/images/place.png" alt=""/>
        </div>
        <h4>智配柜地址</h4>
      </div>
      <div class="address_detail">
        <div class="vendingMachineImg_box">
          <img src="../../../assets/images/vendingMachine2.png" alt="">
        </div>
        <div class="address_desc">
          <div class="address_content">
            <div>
              地址:
            </div>
            <div class="address_content_detail">
              {{ orderDetail && orderDetail.deviceFullAdress }}
            </div>
          </div>
          <div class="kefu_phone">
            <a href="tel:4000909975">客服电话: 4000909975</a>
          </div>
        </div>
      </div>
      <ul class="order_detail">
        <li class="order_detail_block">
          <div class="vendingMachine_number">
            <div class="icon_box">
              <img src="../../../assets/images/vendingMachine.png" alt=""/>
            </div>
            <span>智配柜编号{{ orderDetail && orderDetail.deviceCode }}</span>
          </div>
          <div class="drugsDetail">

            <ul class="drugs_list">
              <li v-for="(item, index) in drugsList" :key="index">
                <div class="drug_img_box" @click.stop="checkImg(item.topImg + '?x-oss-process=image/auto-orient,1')">
                  <img :src="item.topImg | formatProductImg" alt=""/>
                </div>
                <div class="drug_desc">
                  <div>
                    <p class="drug_name">{{ item.productName }}</p>
                    <p class="drug_specifications">{{ item.specificationName }}</p>
                  </div>
                  <p class="price_num">
                    <span class="price">¥{{ (item.productPrice / 100).toFixed(2) }}</span>
                    <span class="number">x{{ item.productCount }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <p class="totalPrice">
            商品总价: <span>¥{{orderDetail && (orderDetail.orderTotalPrice / 100).toFixed(2) }}</span>
          </p>
        </li>
      </ul>
    </div>

    <div class="footer-box" v-if="orderDetail && orderDetail.payStatus !== 1">
      <div class="next-btn"
           @click.stop="$throttle(pay)">
        <van-button slot="button" class="next-btn" size="large">
          支付 (¥{{ orderDetail && (orderDetail.orderTotalPrice / 100).toFixed(2) }})
        </van-button>
      </div>
    </div>
    <van-loading type="spinner"
                 color="#0069ff"
                 v-if="loading"></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast, ImagePreview} from "vant";

  export default {
    name: "submitOrder",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["vendingMachine"]),
      ...mapState(["PatientIM"])
    },
    filters: {
      formatProductImg(value) {
        let productImg = "";
        try {
          if (value) {
            productImg = value.split(",")[0];
          }
        } catch (e) {
          console.log(e);
        }
        return productImg;
      }
    },
    data() {
      return {
        orderDetail: "", // 订单详情
        loading: true, // loading
        productImgList: [], // 图片列表
        orderId: "",
        drugsList: []
      };
    },
    methods: {
      /**
       * 点击预览图片**/
      checkImg(img) {
        ImagePreview([img]);
        // ImagePreview({
        //   images: this.productImgList,
        //   startPosition: index
        // });
      },

      /**
       * 获取订单详细信息**/
      getOrderDetail() {
        this.loading = true;
        this.$http.request({
          baseURL: this.$globalServiceHost.selfMachineHost,
          method: "get",
          url: "/ROrderController/orderCommitDetail",
          body: {
            orderId: this.orderId
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            try {
              this.orderDetail = res.data.data.length && res.data.data[0];
              this.productImgList = this.orderDetail.productImgList.split(",");
              this.getDrugsList(this.orderId);
            } catch (e) {
              console.log(e);
            }
          } else {
            Toast(res.data.message || "获取订单详情接口报错");
          }
        }).catch(e => {
          this.loading = false;
          console.log(e);
        });
      },

      /**
       * 获取商品清单列表
       * 通过清单id查询 **/
      getDrugsList(id) {
        this.$http.request({
          baseURL: this.$globalServiceHost.selfMachineHost,
          method: "get",
          url: "/ROrderController/orderProductDetail",
          body: {
            orderId: id
          }
        }).then(res => {
          if (res.data.success) {
            this.drugsList = res.data.data || [];
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * 微信config**/
      wxConfig() {
        return new Promise((resolve, reject) => {
          let _this = this;
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
            openId:
            this.PatientIM.patientMessage.opendId
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
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
                  console.log("pay success");
                  // setTimeout(() => {
                  ToastRequest.clear();
                  // 新增支付中页面
                  _this.$router.push({
                    name: "payProgress",
                    query: {
                      orderType: 1,
                      orderId: _this.orderId,
                      routerName: "orderDetail"
                    }
                  });

                  // _this.$router.push({
                  //   name: "orderDetail",
                  //   query: {
                  //     orderId: _this.orderId
                  //   }
                  // });

                  // }, 2000);
                },
                fail: function (e) {
                  console.log("pay fail");
                  ToastRequest.clear();
                },
                cancel: function (e) {
                  ToastRequest.clear();
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
            ToastRequest.clear();
            if (res.data.code === 0 || res.data.code === "0") {
              Toast({
                message: "未找到订单",
                position: "bottom"
              });
              return false;
            } else if (res.data.code === 1 || res.data.code === "1") {
              Toast({
                message: "处方已被绑定",
                position: "bottom"
              });
              return false;
            }
          }
        }).catch(e => {
          ToastRequest.clear();
          console.log(e);
        });
      }
    },
    created() {
      this.orderId = this.$route.query.orderId || "";
      let wxCofigPromise = null;
      wxCofigPromise = this.wxConfig();
      Promise.all([wxCofigPromise]).then(() => {
        this.getOrderDetail();
      });
    }
  };
</script>

<style scoped lang="less">
  .submitOrder_page {
    .padding(44, 12, 54, 12);

    .address_title {
      display: flex;
      align-items: center;
      .padding(0, 10, 0, 10);
      box-sizing: border-box;
      .borderRadius(10, 10, 0, 0);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background-color: #fff;
      .height(46);

      .icon_box {
        .width(20);
        .height(20);
        .margin(0, 10, 0, 0);

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      h4 {
        flex: 1;
        width: 0;
        .fontSize(16);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }

    .address_detail {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      .height(108);
      background-color: #fff;
      .padding(0, 10, 0, 10);
      .borderRadius(0, 0, 10, 10);

      .vendingMachineImg_box {
        .width(78);
        .height(78);

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .address_desc {
        flex: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .height(78);
        .margin(0, 0, 0, 10);

        .address_content {
          display: flex;
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);

          .address_content_detail {
            .margin(0, 0, 0, 10);
            flex: 1;
            width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; // 控制多行的行数
            -webkit-box-orient: vertical;
          }
        }

        .kefu_phone {
          a {
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
        }
      }
    }

    .order_detail {
      .margin(20, 0, 0, 0);

      li {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        .padding(12, 12, 12, 12);
        background: rgba(255, 255, 255, 1);
        .borderRadius(0, 0, 10, 10);
      }


      .order_detail_block {
        display: block;
        .borderRadius(10, 10, 10, 10);

        .vendingMachine_number {
          border-bottom: 1px solid #f2f2f2;
          .padding(0, 0, 12, 0);
          display: flex;
          align-items: center;

          .icon_box {
            .width(18);
            .height(23);

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
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

        .drugsDetail {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .padding(12, 0, 0, 0);

          .drugs_list {
            width: 100%;

            li {
              display: flex;
              align-items: center;
              box-sizing: border-box;
              .padding(12, 12, 12, 12);
              .height(102);
              background: rgba(255, 255, 255, 1);
              border-radius: 0;
              border-bottom: 1px solid #f2f2f2;
              .margin(0, 0, 12, 0);

              .drug_img_box {
                .width(78);
                .height(78);
                .borderRadius(10, 10, 10, 10);
                overflow: hidden;

                img {
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }

              .drug_desc {
                display: flex;
                flex: 1;
                width: 0;
                flex-direction: column;
                justify-content: space-between;
                .margin(0, 8, 0, 8);
                height: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .drug_name {
                  .margin(0, 0, 10, 0);
                  .fontSize(16);
                  .lineHeight(20);
                  font-weight: bold;
                  color: rgba(51, 51, 51, 1);
                }

                .drug_specifications {
                  .fontSize(14);
                  .lineHeight(18);
                  font-weight: 400;
                  color: rgba(153, 153, 153, 1);
                }

                .price_num {
                  display: flex;
                  justify-content: space-between;

                  .price {
                    .fontSize(16);
                    .lineHeight(20);
                    font-weight: bold;
                    color: rgba(255, 48, 0, 1);
                  }

                  .number {
                    .fontSize(16);
                    .lineHeight(20);
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                  }
                }
              }
            }
          }
        }

        .totalPrice {
          .padding(6, 0, 6, 0);
          display: flex;
          justify-content: flex-end;
          .fontSize(16);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);

          span {
            color: rgba(255, 48, 0, 1);
          }
        }
      }
    }
  }
</style>
