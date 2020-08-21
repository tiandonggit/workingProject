/** *@desc 订单列表 *@author houpai *@date 2019/10/29 16:49:46 */
<template>
  <div class="orderList_page">
    <!-- <common-header
        :share-disabled="false"
        :custom-title="'营养诊断报告订单'"
    ></common-header> -->
    <commonHeader
      :share-disabled="true"
      :custom-title="'营养方案'"
      :header-show="true"
      :left="false"
      :title="'营养方案订单'"
    ></commonHeader>
    <div class="alltop">
      <van-tabs :active="payStatus" @change="orderTypeChange">
        <van-tab title="未付款">
          <ul class="orderList_ul">
            <li
              v-for="(item, index) in unPayOrdersList"
              @click.stop="getOrderDetail(item.orderInfo.orderId)"
              :key="index"
            >
              <div class="order_header">
                <h3>订单编号: {{ item.orderInfo.orderId }}</h3>
                <span
                  :class="[
                    'order_state',
                    {
                      pay: item.orderInfo.payStatus === 1,
                      unPay: item.orderInfo.payStatus === 0
                    }
                  ]"
                >
                  {{
                    orderState(
                      item.orderInfo.payStatus,
                      item.orderInfo.pushOutStatus
                    )
                  }}
                </span>
              </div>
              <div class="order_detail">
                <img
                  v-for="(imgItem,
                  imgIndex) in item.orderInfo.productImgList.split(',')"
                  :key="imgIndex"
                  :src="imgItem"
                  alt=""
                />
              </div>
              <div class="order_message">
                <p>
                  订单价格:
                  <span class="price">
                    ¥{{ item.orderInfo.orderTotalPrice | formatPrice }}
                  </span>
                </p>
                <!--              <p>-->
                <!--                订单状态:-->
                <!--                {{ orderState(item.orderInfo.payStatus,item.orderInfo.pushOutStatus) }}-->
                <!--              </p>-->
              </div>

              <div class="btn_box" v-if="item.orderInfo.payStatus !== 3">
                <div
                  class="pay_btn"
                  @click.stop="gotoPay(item.orderInfo.orderId)"
                >
                  去付款
                </div>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab title="已付款">
          <ul class="orderList_ul">
            <li
              v-for="(item, index) in payOrdersList"
              @click.stop="getOrderDetail(item.orderInfo.orderId)"
              :key="index"
            >
              <div class="order_header">
                <h3>订单编号: {{ item.orderInfo.orderId }}</h3>
                <span
                  :class="[
                    'order_state',
                    {
                      pay: item.orderInfo.payStatus == 1,
                      unPay:
                        item.orderInfo.payStatus == 0 ||
                        item.orderInfo.pushOutStatus == 0
                    }
                  ]"
                >
                  {{
                    orderState(
                      item.orderInfo.payStatus,
                      item.orderInfo.pushOutStatus
                    )
                  }}
                </span>
              </div>
              <div class="order_detail">
                <img
                  v-for="(imgItem,
                  imgIndex) in item.orderInfo.productImgList.split(',')"
                  :key="imgIndex"
                  :src="imgItem"
                  alt=""
                />
              </div>
              <div class="order_message">
                <p>
                  订单价格:
                  <span class="price">
                    ¥{{ item.orderInfo.orderTotalPrice | formatPrice }}
                  </span>
                </p>
                <!--              <p>-->
                <!--                订单状态:-->
                <!--                <span v-if="item.orderInfo.payStatus == 1 && item.orderInfo.pushOutStatus == 0">-->
                <!--                  已付款,-->
                <!--                </span>-->
                <!--                {{ orderState(item.orderInfo.payStatus,item.orderInfo.pushOutStatus) }}-->
                <!--              </p>-->
              </div>
              <div
                v-if="
                  item.orderInfo.payStatus == 1 &&
                    item.orderInfo.pushOutStatus == 0
                "
                class="btn_box"
              >
                <div
                  class="pay_btn"
                  @click.stop="
                    showCode(item.orderInfo.orderId, item.orderInfo.pushOutCode)
                  "
                >
                  出示自提码
                </div>
              </div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import { mapState } from "vuex";

export default {
  name: "orderList",
  components: {
    commonHeader
  },
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      payStatus: 1, // 支付状态（查询订单列表时为必需参数）0：未支付 1：已支付
      payOrdersList: [],
      unPayOrdersList: []
    };
  },
  methods: {
    /**
     * orderType change**/
    orderTypeChange(event) {
      if (event === 0 && !this.unPayOrdersList.length) {
        this.getOrdersList(event);
      }
      if (event === 1 && !this.payOrdersList.length) {
        this.getOrdersList(event);
      }
    },

    /**
     * 获取订单列表**/
    getOrdersList(event) {
      this.$http
        .request({
          baseURL: this.$globalServiceHost.mockServiceHost,
          method: "get",
          url: "/ROrderController/nOrderDetaionOfMine",
          body: {
            openId:
              this.Patient.patientMessage.opendId || this.$route.query.opendId,
            payStatus: event !== "undefined" ? event : this.payStatus
          }
        })
        .then(res => {
          if (event === 1 && res.data.data.length) {
            this.payOrdersList = res.data.data;
          }

          if (event === 0 && res.data.data.length) {
            this.unPayOrdersList = res.data.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    gotoPay(id) {
      this.$store.commit("Patient/saveOrderId", id);
      this.$router.push({
        path: "/orderDetail"
      });
    },
    showCode(id, code) {
      this.$store.commit("Patient/shim", id);
      this.$router.push({
        path: "/shipmentCode",
        query: {
          shipmentCode: code
        }
      });
    },

    /**
     * 查看订单详情**/
    getOrderDetail(id) {
      this.$store.commit("Patient/saveOrderId", id);
      this.$router.push({
        path: "/orderDetail"
      });
    },

    orderState(value, pushOutStatus) {
      let state = "";
      switch (value) {
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
      if (pushOutStatus !== 0 && value === 1) {
        state = "交易完成";
      }
      if (pushOutStatus === 0 && value === 1) {
        state = "待自提";
      }
      return state;
    }
  },

  filters: {
    formatPrice(value) {
      let price = "";
      price = (value / 100).toFixed(2);
      return price;
    }
  },

  created() {
    this.getOrdersList(this.payStatus);
  }
};
</script>

<style scoped lang="less">
.alltop {
  padding-top: 44px;
  /deep/ .van-tabs--line {
    padding-top: 0 !important;
  }
}
.orderList_page /deep/ .van-tabs__line {
  width: 54px !important;
  background-color: rgba(0, 105, 255, 1);
}

.orderList_page /deep/ .van-ellipsis {
  font-size: 18px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

/deep/.van-tab--active {
  span {
    font-weight: bold;
  }
}

.orderList_page /deep/ .van-tab .van-tab--active .van-ellipsis {
  font-weight: 400;
}

.orderList_page /deep/ .van-tabs--line .van-tabs__wrap {
  margin: 0 12px;
  border-radius: 10px;
}

.orderList_page /deep/ .van-tabs__content {
  padding: 12px;
}

.orderList_page {
  .orderList_ul {
    li {
      border-radius: 10px;
      margin-bottom: 12px;
      background-color: #fff;
      padding: 10px;

      .order_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 5px;
        padding-bottom: 14px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 22px;
        border-bottom: 1px solid #f2f2f2;

        // .pay {
        /*color: #FF2828!important;*/
        // }

        .unPay {
          color: #0069ff !important;
        }
      }

      .order_detail {
        white-space: nowrap;
        width: 100%;
        overflow-x: auto;
        padding: 15px 0 0 0;

        img {
          display: inline-block;
          width: 78px;
          height: 78px;
          border-radius: 10px;
          margin-right: 10px;
        }
      }

      .order_message {
        padding: 12px 0;
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 32px;

        p {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .price {
          color: #ff3000;
        }
      }

      .btn_box {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border-top: 1px solid #f2f2f2;
        padding-top: 12px;

        .pay_btn {
          width: 110px;
          height: 30px;
          border-radius: 10px;
          font-size: 18px;
          font-weight: 400;
          background: linear-gradient(top, #0180ff, #0069ff);
          background: -ms-linear-gradient(top, #0180ff, #0069ff);
          background: -webkit-linear-gradient(top, #0180ff, #0069ff);
          background: -moz-linear-gradient(top, #0180ff, #0069ff);
          color: #ffffff;
          line-height: 30px;
          text-align: center;
        }
      }
    }
  }
}

.orderList_page /deep/ .order_detail::-webkit-scrollbar {
  display: none;
}

.van-loading {
  text-align: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
