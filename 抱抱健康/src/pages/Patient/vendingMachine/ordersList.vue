/** *@desc 我的订单 *@author houpai *@date 2019/09/09 10:38:30 */
<template>
  <div class="ordersList_page">
    <common-header
        :share-disabled="true"
        :custom-title="'我的订单'"
    ></common-header>
    <ul class="order_list" v-if="orderList.length">
      <li v-for="(item, index) in orderList" :key="index">
        <div class="orderDetail_title">
          <div class="vendingMachine_number">
            <div class="icon_box">
              <img src="../../../assets/images/vendingMachine.png" alt=""/>
            </div>
            <span>智配柜编号{{ item.orderInfo.deviceCode || "" }}</span>
          </div>
          <span
              :class="[
              'order_state',
              {
                cancel: item.orderInfo.payStatus == 3,
                complete:
                  item.orderInfo.payStatus == 1 &&
                  item.orderInfo.pushOutStatus == 3,
                unpaid: item.orderInfo.payStatus != 1,
                unfetchedDrugs:
                  item.orderInfo.pushOutStatus == 0 || 
                  item.orderInfo.pushOutStatus == 1 &&
                  item.orderInfo.payStatus == 1
              }
            ]"
          >
            {{
              orderSate(item.orderInfo.payStatus, item.orderInfo.pushOutStatus)
            }}
          </span>
        </div>
        <ul class="drugs_list">
          <li
              v-for="(subItem, subIndex) in item.orderProductInfo"
              :key="subIndex"
          >
            <div class="drug_img_box">
              <img :src="subItem.topImg | formatProductImg" alt=""/>
            </div>
            <div class="drug_desc">
              <div>
                <p class="drug_name">{{ subItem.productName }}</p>
                <p class="drug_specifications">
                  {{ subItem.specificationName }}
                </p>
              </div>
              <p class="price">¥{{ subItem.productPrice | formatPrice }}</p>
            </div>
            <div class="drug_number">
              x{{ subItem.productCount }}
            </div>
          </li>
        </ul>
        <div class="btn_box">
          <div
              class="detail_btn"
              @click.stop="orderDetail(item.orderInfo.orderId)"
          >
            查看详情
          </div>
        </div>
      </li>
    </ul>

    <!--    搜索无结果-->
    <div class="noResult" v-if="!orderList.length && !loading">
      <img src="../../../assets/images/noDisease.png" alt="">
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
  import commonHeader from "../../../components/commonHeader/common_header"
  import {mapState} from "vuex"
  import order from "../../../store/modules/Patient/order"

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
        orderList: [], // 订单列表
        loading: false // loading
      }
    },
    methods: {
      /**
       * 获取订单列表**/
      getOrderList() {
        this.loading = true
        this.$http
          .request({
            baseURL: this.$globalServiceHost.selfMachineHost,
            method: "get",
            url: "/ROrderController/orderDetailOfMine",
            body: {
              openId:
              this.PatientIM.patientMessage.opendId
            }
          })
          .then(res => {
            this.loading = false
            if (res.data.success) {
              this.orderList = res.data.data.length && res.data.data
            } else {
              console.log("get orderList fail")
            }
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      },

      /**
       * 查看订单详情**/
      orderDetail(id) {
        this.$store.commit("vendingMachine/saveOrderId", id)
        this.$router.push({
          name: "orderDetail",
          query:{
            orderId:id
          }
        })
      },

      /**
       * 订单状态显示
       * 未支付显示支付状态,已支付显示出货状态**/
      orderSate(payStatus, pushOutStatus) {
        let orderState = ""
        if (payStatus === 1) {
          if (pushOutStatus === 3) {
            orderState = "已完成"
          } else {
            orderState = "待取货"
          }
        } else {
          if (payStatus === 3) {
            orderState = "已取消"
          } else {
            orderState = "待付款"
          }
        }
        return orderState
      }
    },

    filters: {
      formatPrice(value) {
        let price = ""
        price = (value / 100).toFixed(2)
        return price
      },

      formatProductImg(value) {
        let productImg = ''
        try {
          if (value) {
            productImg = value.split(',')[0] + '?x-oss-process=image/auto-orient,1'
          }
        } catch (e) {
          console.log(e)
        }
        return productImg
      }
    },

    created() {
      this.getOrderList()
    }
  }
</script>

<style scoped lang="less">
  .ordersList_page {
    min-height: 100%;
    background: rgba(242, 242, 242, 1);
    box-sizing: border-box;
    .padding(12, 12, 12, 12);

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
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
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
            color: rgba(51, 51, 51, 1);
          }

          /*订单状态不通,文字颜色不同*/

          .order_state.cancel {
            color: rgba(153, 153, 153, 1);
          }

          .order_state.complete {
            /*color: rgba(62, 187, 0, 1);*/
          }

          .order_state.unpaid {
            color:@mainColor;
          }

          .order_state.unfetchedDrugs {
            color:@mainColor;
          }
        }
      }

      .drugs_list {
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
              .lineHeight(15);
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
        .margin(71,0,30,0)
      }

      p {
        .fontSize(18);
        .lineHeight(18);
        font-weight:bold;
        color:rgba(51,51,51,1);
        text-align: center;
      }
    }
  }

</style>
