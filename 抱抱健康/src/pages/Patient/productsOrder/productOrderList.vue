/** *@desc 我的订单 *@author houpai *@date 2019/09/09 10:38:30 */
<template>
  <div class="ordersList_page">
    <common-header
        :share-disabled="true"
        :header-show="true"
        :custom-title="'我的订单'"
        :title="'我的订单'"
    ></common-header>

    <ul class="order_list" v-if="productOrderList.length">
      <li v-for="(item, index) in productOrderList" :key="index">
        <div class="orderDetail_title">
          <div class="vendingMachine_number">
            <div class="icon_box">
              <img src="../../../assets/images/pharmacyIcon.png" alt=""/>
            </div>
            <span>{{item.ZyOrder.orderno || ""}}</span>
          </div>
          <span :class="['order_state',{complete:item.ZyOrder.orderstatus === 3 }]">
            {{ orderSate(item.ZyOrder.orderstatus) }}
          </span>
        </div>
        <ul class="drugs_list">
          <li v-for="(subItem, subIndex) in item.ZyOrderDetails"
              :key="subIndex">
            <div class="drug_img_box">
              <img :src="subItem.icon | formatProductImg" alt=""/>
            </div>
            <div class="drug_desc">
              <div>
                <p class="drug_name">{{ subItem.productname }}</p>
                <p class="drug_specifications">
                  <span class="drug_specificationName">
                    {{ subItem.specification }}
                  </span>
                  <span class="drug_number">
                     x{{ subItem.number }}
                  </span>
                </p>
              </div>
              <p class="price">¥{{ subItem.activityprice | formatPrice }}</p>
            </div>
          </li>
        </ul>
        <div class="btn_box">
          <div class="detail_btn"
               @click.stop="orderDetail(item.ZyOrder.orderno)">
            查看详情
          </div>
        </div>
      </li>
    </ul>

    <!--    搜索无结果-->
    <div class="noResult" v-if="!loading && productOrderList.length === 0">
      <img src="../../../assets/images/integralNoProduct.png" alt="">
      <p class="top">暂无订单</p>
      <p class="again">还没有相关的订单呢!</p>
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
  import order from "../../../store/modules/Patient/order";

  export default {
    name: "ordersList",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    data() {
      return {
        productOrderList: [], // 订单列表
        loading: false // loading
      };
    },
    methods: {
      /**
       * 获取订单列表**/
      getProductOrderList() {
        this.loading = true;
        this.$http
          .request({
            method: "get",
            url: "/ZyOrderDetailsController/selectByUserId",
            body: {}
          })
          .then(res => {
            this.loading = false;
            if (res.data.success) {
              this.productOrderList = res.data.data.length && res.data.data;
            } else {
              console.log("get productOrderList fail");
            }
          })
          .catch(e => {
            this.loading = false;
            console.log(e);
          });
      },

      /**
       * 查看订单详情**/
      orderDetail(id) {
        this.$router.push({
          name: "productOrderDetail",
          query:{
            productOrderId:id
          }
        });
      },

      /**
       * 订单状态显示
       * **/
      orderSate(orderstatus) {
        let orderState = "";
        switch (orderstatus) {
          case 0:
            orderState = "等待付款";
            break;
          case 1:
            orderState = "等待发货";
            break;
          case 2:
            orderState = "等待收货";
            break;
          case 3:
            orderState = "交易完成";
            break;
          case 4:
            orderState = "已取消";
            break;
          default:
            orderState = "等待付款";

        }
        return orderState;
      }
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
            productImg = value.split(",")[0] + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        return productImg;
      }
    },

    created() {
      // 清空选择地址的缓存
      this.$store.commit("Address/addressData", {
        id: "",
        status: 1,
        name: "",
        phone: "",
        address: "",
        pointnum: ""
      });
      this.getProductOrderList();
    }
  };
</script>

<style scoped lang="less">
  .ordersList_page {
    min-height: 100%;
    background: rgba(242, 242, 242, 1);
    box-sizing: border-box;
    .padding(54, 12, 12, 12);

    .icon_box {
      .width(20);
      .height(20);

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .order_list {
      li {
        background: rgba(255, 255, 255, 1);
        .borderRadius(10, 10, 10, 10);
        .padding(12, 12, 12, 12);
        .margin(0, 0, 12, 0);

        .orderDetail_title {
          display: flex;
          /*align-items: center;*/
          justify-content: space-between;
          border-bottom: 1px solid #f2f2f2;
          .padding(0, 0, 12, 0);

          .vendingMachine_number {
            display: flex;
            flex: 1;

            span {
              display: inline-block;
              flex: 1;
              width: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              align-items: center;
              .margin(0, 0, 0, 12);
              .fontSize(16);
              .lineHeight(20);
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }
          }

          .order_state {
            .fontSize(16);
            .lineHeight(20);
            font-weight: 400;
            color: rgba(0, 105, 255, 1);
          }

          /*订单状态不通,文字颜色不同*/

          .order_state.complete {
            color: rgba(51, 51, 51, 1);
          }
        }
      }

      .drugs_list {
        li {
          .padding(12, 0, 12, 0);
          .borderRadius(0, 0, 0, 0);
          border-bottom: 1px solid #f2f2f2;
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

            .drug_name {
              .fontSize(16);
              .lineHeight(20);
              .padding(0, 0, 8, 0);
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }

            .drug_specifications {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .drug_specificationName {
                flex: 1;
                width: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .fontSize(14);
                .lineHeight(18);
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }


              .drug_number {
                display: inline-block;
                .lineHeight(15);
                .fontSize(17);
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
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
          .width(92);
          .height(31);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          .borderRadius(10, 10, 10, 10);
          background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
          .fontSize(18);
        }
      }
    }

    .noOrder {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        display: block;
        .width(200);
        .height(200);
        .margin(71, 0, 30, 0)
      }

      p {
        .fontSize(18);
        .lineHeight(18);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        text-align: center;
      }
    }
  }

</style>
