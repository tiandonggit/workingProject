<template>
  <div class="submitOfflineOrder_page">
    <common-header
        :share-disabled="true"
        :title="'订单详情'"
        :header-show="true"
        :custom-title="'营养方案'"></common-header>
    <ul class="offLineOrderList">
      <li v-for="(subItem, subIndex) in orderProductInfo"
          :key="subIndex">
        <div class="img_box">
<!--                          @click.stop="checkImg(subItem.icon)"-->
          <img :src="subItem.topImg | formatProductImg" alt=""/>
          <div class="pre-message-label">
            营养成品
          </div>
        </div>
        <div class="product_message">
          <p class="product_name">
            {{ subItem.productName || ''}}
          </p>
          <p class="product_guige">
            <span class="guige">
               {{ subItem.specificationName || ''}}
            </span>
            <span class="number">x{{ subItem.productCount }}</span>
          </p>
          <p class="product_price">¥{{ subItem.productPrice | formatPrice}}</p>
        </div>
      </li>
      <li class="total_price">
        <p class="total">
          商品共{{productTotalNumber}}件，合计:
          <a>¥{{ orderDetail && orderDetail.orderTotalPrice | formatPrice }}</a>
        </p>
        <p class="tip">营养品一经售出概不退换</p>
      </li>
    </ul>

    <div class="address_box">
      <h4>
        <span class="address_title">
          <img src="../../../assets/images/place.png" alt="">
          邮寄地址
        </span>
        <span class="modify_address" @click.stop="modifyAddress">
          <img src="../../../assets/images/modify.png" alt="">
          修改
        </span>
      </h4>
      <ul>
        <li class="nameAndPhone">{{order.orderParams.contacts}} {{order.orderParams.phone}}</li>
        <li class="address">
          {{order.orderParams.address }} {{ order.orderParams.address_detail}}
        </li>
      </ul>
    </div>

    <div class="submit_btn_box"
         @click.stop="submitOrder">
      <div class="submit_btn">
        确认提交
      </div>
    </div>
    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"></van-loading>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Dialog, Toast, ImagePreview} from "vant";


  export default {
    name: "submitOfflineOrder",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["order"]),
      productTotalNumber() {
        let total = 0;
        if (this.orderProductInfo.length) {
          this.orderProductInfo.forEach(item => {
            total += Number(item.productCount);
          });
        }
        return total;
      }
    },
    filters: {
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
      formatPrice(value) {
        let price = "";
        price = (value / 100).toFixed(2);
        return price;
      }
    },
    data() {
      return {
        onLineOrderId: "",
        orderProductInfo: [],
        loading: false,
        orderDetail: {}
      };
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
       * 获取订单详情**/
      getOrderDetail() {
        this.loading = true;
        this.$http.request({
          baseURL: this.$globalServiceHost.selfMachineHost,
          method: "get",
          url: "/ROrderController/orderDetailOfMine",
          body: {
            orderId: this.onLineOrderId
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            this.orderDetail = res.data.data.length && res.data.data[0].orderInfo;
            this.orderProductInfo = res.data.data.length && res.data.data[0].orderProductInfo;
          } else {
            Toast(res.data.message || '获取线上订单接口报错');
          }
        }).catch(e => {
          this.loading = false;
          console.log(e);
        });
      },

      /**
       * 重新编辑地址等信息
       * **/
      modifyAddress() {
        this.$router.go(-1);
      },

      /**
       * 提交订单
       * **/
      submitOrder() {
        Dialog.confirm({
          message: "是否确认提交订单？"
        }).then(() => {
          this.$throttle(this.submitOrderHandle());
        }).catch(() => {
          // on cancel
        });
      },

      /**
       * 提交订单
       * **/
      submitOrderHandle() {
        this.$http.request({
          url: "/ROfflineOrderController/createOfflineOrderFromOnlineOrder",
          method: "post",
          body: {
            onlineOrderId: this.onLineOrderId,
            receiveName: this.order.orderParams.contacts || "",
            receivePhone: this.order.orderParams.phone || "",
            receiveAddress: this.order.orderParams.address || "",
            receiveAddressDetail: this.order.orderParams.address_detail || ""
          }
        }).then(res => {
          if (res.data.success) {
            this.$router.push({
              name:'payTip'
            });
          } else {
            Toast(res.data.message || "提交线下付款订单报错");
          }
        }).catch(e => {
          console.log(e);
        });
      }
    },
    created() {
      this.onLineOrderId = this.$route.query.onLineOrderId || "";
      this.getOrderDetail();
    }
  };
</script>

<style scoped lang="less">
  .submitOfflineOrder_page {
    .padding(60, 12, 100, 12);

    .offLineOrderList {
      .padding(0, 10, 0, 10);
      .borderRadius(10, 10, 10, 10);
      background-color: @backgroundColorff;

      li {
        display: flex;
        .padding(15, 0, 15, 0);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .img_box {
          .borderRadius(10, 10, 10, 10);
          overflow: hidden;
          position: relative;
          .pre-message-label {
            display: flex;
            align-items: center;
            .padding(0,5,0,5);
            .fontSize(14);
            .height(20);
            text-align: center;
            color: @fontColorff;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 32;
            background: linear-gradient(
                226deg,
                rgba(255, 146, 0, 1) 0%,
                rgba(255, 89, 0, 1) 100%
            );
            .borderRadius(10,0,10,0);
          }
          img {
            display: block;
            .width(78);
            .height(78);
          }
        }

        .product_message {
          flex: 1;
          .margin(0, 0, 0, 10);

          p {
            .margin(0, 0, 10, 0);
          }

          .product_name {
            .fontSize(16);
            .lineHeight(20);
            font-weight: 400;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; // 控制多行的行数
            -webkit-box-orient: vertical;
          }

          .product_guige {
            display: flex;
            align-items: center;

            span {
              .fontSize(14);
              color: rgba(51, 51, 51, 1);
              font-weight: 400;
            }

            .guige {
              color: rgba(153, 153, 153, 1);
              flex: 1;
              width: 0;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              .lineHeight(18);
            }

            .number {
              .fontSize(16);
              .margin(0, 0, 0, 10);
            }
          }

          .product_price {
            .fontSize(16);
            font-weight: bold;
            color: rgba(255, 48, 0, 1);
            .margin(0, 0, 0, 0);
          }
        }
      }

      .total_price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .padding(15, 10, 15, 15);
        border-bottom: 0;

        p {
          .fontSize(14);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }

        .total {
          .margin(0, 0, 15, 0);

          a {
            color: rgba(248, 40, 40, 1);
          }
        }

        .tip {
          color: rgba(0, 105, 255, 1);
        }
      }
    }

    .address_box {
      background-color: @backgroundColorff;
      overflow: hidden;
      .borderRadius(10, 10, 10, 10);
      .margin(20, 0, 0, 0);

      img {
        display: block;
        .width(20);
        .height(20);
        .margin(0, 4, 0, 0);
      }

      h4 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .padding(13, 10, 13, 10);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        span {
          display: flex;
          align-items: center;
        }

        .address_title {
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .modify_address {
          .fontSize(16);
          font-weight: bold;
          color: rgba(0, 105, 255, 1);
        }
      }

      ul {
        .padding(13, 10, 13, 10);

        .nameAndPhone {
          .margin(0, 0, 15, 0);
        }

        li {
          .fontSize(16);
          .lineHeight(22);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }

    .submit_btn_box {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background-color: @backgroundColor;

      .submit_btn {
        .margin(0, 12, 24, 12);
        .height(44);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bolder;
        color: @fontColorff;
        .fontSize(18);
        .borderRadius(10, 10, 10, 10);
        background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
      }
    }
  }
</style>
