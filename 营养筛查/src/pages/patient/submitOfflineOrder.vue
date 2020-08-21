<template>
  <div class="submitOfflineOrder_page">
    <common-header
        :share-disabled="true"
        :title="'订单详情'"
        :header-show="true"
        :custom-title="'营养方案'"></common-header>
    <div class="padding_box">
      <ul class="offLineOrderList">
        <li v-for="(item, index) in orderProductInfo"
            :key="index">
          <div class="img_box">
            <img :src="item.topImg" alt=""/>
            <div class="pre-message-label">
              营养成品
            </div>
          </div>
          <div class="product_message">
            <p class="product_name">
              {{ item.productName || ""}}
            </p>
            <p class="product_guige">
            <span class="guige">
              {{ item.specificationName || "" }}
            </span>
              <span class="number">x{{ item.productCount || "" }}</span>
            </p>
            <p class="product_price">¥{{ item.productPrice | formatPrice }}</p>
          </div>
        </li>
        <li class="total_price">
          <p class="total">
            商品共{{productTotalNumber}}件，合计:
            <a>¥{{ orderInfo && orderInfo.orderTotalPrice | formatPrice }}</a>
          </p>
          <p class="tip">营养品一经售出概不退换</p>
        </li>
      </ul>
    </div>

    <div class="address_box">
      <h4>
        <span class="address_title">
          <img src="../../assets/img/place.png" alt="">
          邮寄地址
        </span>
        <span class="modify_address" @click.stop="modifyAddress">
          <img src="../../assets/img/modify.png" alt="">
          修改
        </span>
      </h4>
      <ul>
        <li class="nameAndPhone">{{Patient.orderParams.contacts}} {{Patient.orderParams.phone}}</li>
        <li class="address">
          {{Patient.orderParams.address }} {{ Patient.orderParams.address_detail}}
        </li>
      </ul>
    </div>

    <div class="submit_btn_box" @click.stop="submitOrder">
      <div class="submit_btn">
        确认提交
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Dialog, Toast} from "vant";

  export default {
    name: "submitOfflineOrder",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["Patient"]),
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
        orderList: [],
        orderInfo: "", // 订单信息
        orderProductInfo: [] // 自助柜信息
      };
    },
    methods: {
      /**
       * 获取订单详情
       * **/
      getOrderDetail(id) {
        this.$http.request({
          baseURL: this.$globalServiceHost.mockServiceHost,
          method: "get",
          url: "/ROrderController/nOrderDetaionOfMine",
          body: {
            openId: this.Patient.patientMessage.opendId,
            orderId: id
          }
        }).then(res => {
          if (res.data.success && res.data.data.length) {
            this.orderInfo = res.data.data[0].orderInfo;
            this.orderProductInfo = res.data.data[0].orderProductInfo;
          }
        }).catch(e => {
          console.log(e);
        });
      },
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
            receiveName: this.Patient.orderParams.contacts || "",
            receivePhone: this.Patient.orderParams.phone || "",
            receiveAddress: this.Patient.orderParams.address || "",
            receiveAddressDetail: this.Patient.orderParams.address_detail || ""
          }
        }).then(res => {
          if (res.data.success) {
            this.$router.push({
              name:'payTip'
            })
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
      this.getOrderDetail(this.onLineOrderId);
    }
  };
</script>

<style scoped lang="less">

  /deep/ .header {
    padding: 0 !important;
  }

  .submitOfflineOrder_page {

    .padding_box {
      .padding(60, 0, 0, 0);
    }

    .padding(0, 12, 100, 12);

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
            .padding(0, 5, 0, 5);
            .fontSize(14);
            .height(20);
            text-align: center;
            color: @fontColorff;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 32;
            background: linear-gradient(226deg,
            rgba(255, 146, 0, 1) 0%,
            rgba(255, 89, 0, 1) 100%);
            .borderRadius(10, 0, 10, 0);
          }

          img {
            display: block;
            .width(78);
            .height(78);
          }
        }

        .product_message {
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

    // 弹窗统一样式颜色
    .van-dialog {
      .van-dialog__message {
        .fontSize(16);
        font-weight: 400;
        color: @titleColor;
        .lineHeight(16);
        .padding(40, 30, 40, 30);
      }

      .van-dialog__cancel {
        span {
          .fontSize(18);
          font-weight: bold;
          color: @titleColor;
        }
      }

      .van-dialog__confirm {
        background: @mainColor;

        span {
          color: @fontOne !important;
          .fontSize(18);
          font-weight: bold;
        }
      }
    }
  }
</style>
