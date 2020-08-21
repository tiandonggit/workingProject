<!--
  作者:马林
  用途:
  -------------------
  Created by webStorm
  User: tyx
  Date: 2020/1/2 0002
  Time: 9:25
  Application: integralOrderDetail
  State: page
-->
<template>
  <div class="integralOrderDetail">
    <div class="v-title">
      <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="true"
        :title="title"
      ></commonHeader>
    </div>
    <div class="v-body">
      <div class="v-orderDetail">
        <div class="top_banner">
          <div class="order_title">
            <div class="state_img">
              <img
                v-if="orderDetail.status == 2"
                src="../../assets/images/integraOrderOpenBox.png"
                alt=""
              />
              <img
                v-else
                src="../../assets/images/integraOrderSealBox.png"
                alt=""
              />
            </div>
            <div class="state_desc_box">
              <div>
                <p class="order_state">
                  {{ orderDetail.status | orderStatus }}
                </p>
                <!--              <p class="state_desc" v-if="orderDetail && orderDetail.payStatus !== 1 &&orderDetail.payStatus !== 3">-->
                <!--                剩余{{ unPayLeftTime }}自动取消-->
                <!--              </p>-->
              </div>
            </div>
          </div>
        </div>

        <div class="vendingMachine_address address">
          <div v-if="orderDetail.trackingnumber" class="v-address">
            <div class="v-addressTitle">
              <div class="v-addressIcon">
                <van-icon
                  :name="require('../../assets/images/integraOrderCard.png')"
                ></van-icon>
              </div>
              <div class="v-titleName">快递信息</div>
            </div>
            <div class="v-name">
              <div class="v-text">
                {{ orderDetail.expresscompany }}
                {{ orderDetail.trackingnumber }}
              </div>
              <div @click="copyCode(orderDetail.trackingnumber)" class="v-copy">
                复制
              </div>
            </div>
          </div>
          <div v-if="orderDetail.trackingnumber" class="v-line"></div>
          <div class="v-address">
            <div class="v-addressTitle">
              <div class="v-addressIcon">
                <van-icon
                  :name="
                    require('../../assets/images/integraOrderLoaction.png')
                  "
                ></van-icon>
              </div>
              <div class="v-titleName">收货人信息</div>
            </div>
            <div class="v-name">
              <div class="v-text">
                <div class="v-personName">
                  {{ orderDetail.username }}
                </div>
                <div class="v-personPhone">
                  {{ orderDetail.phonenumber }}
                </div>
              </div>
              <div class="v-icon">
                <!--<van-icon name="arrow"></van-icon>-->
              </div>
            </div>
            <div class="v-site">
              <div class="v-text">
                {{ orderDetail.address }}
              </div>
            </div>
          </div>
        </div>
        <div class="vendingMachine_address address">
          <div class="v-address">
            <div class="v-addressTitle">
              <div class="v-addressIcon">
                <van-icon
                  :name="require('../../assets/images/integraOrderBag.png')"
                ></van-icon>
              </div>
              <div class="v-titleName">礼品详情</div>
            </div>
          </div>
          <div class="v-line"></div>
          <div class="v-product">
            <div class="v-img">
              <img :src="orderDetail.imgicon" alt="" />
            </div>
            <div class="v-main">
              <div class="v-name">
                {{ orderDetail.saletitle }}
              </div>
              <div class="v-number">
                <div class="v-total">
                  <span>{{ orderDetail.pricepoint }}</span
                  >{{ type == 0 ? "健康" : "智" }}币
                </div>
                <div class="v-num">x{{ orderDetail.num }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="vendingMachine_address address">
          <div class="v-address">
            <div class="v-addressTitle">
              <div class="v-addressIcon">
                <van-icon
                  :name="require('../../assets/images/integraOrderBook.png')"
                ></van-icon>
              </div>
              <div class="v-titleName">订单详情</div>
            </div>
          </div>
          <div class="v-detailList">
            <div class="v-listMain">订单编号：{{ orderDetail.orderno }}</div>
            <div class="v-listMain">兑换时间：{{ orderDetail.ordertime }}</div>
            <div v-if="orderDetail.deliverytime" class="v-listMain">
              发货时间：{{ orderDetail.deliverytime }}
            </div>
            <div v-if="orderDetail.confirmtime" class="v-listMain">
              确定时间：{{ orderDetail.confirmtime }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="orderDetail.status == 1" class="footer-box">
      <van-button
        @click="$throttle(orderVerify)"
        slot="button"
        class="next-btn"
        size="large"
        >确认收货
      </van-button>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import { Toast } from "vant";
export default {
  name: "integralOrderDetail",
  data() {
    return {
      customTitle: "礼品商城",
      title: "订单详情",
      orderId: this.$route.query.orderId,
      downOrder: this.$route.query.downOrder, //身份:0患者 1医生
      point: window.sessionStorage.getItem("userPoint"),
      type: this.$route.query.type ? this.$route.query.type : 0, //身份:0患者 1医生
      orderDetail: {
        /*id: "1", //订单id
        orderno: "321654", //订单号
        num: "2", //商品数量
        ordertime: "2020年1月10日11:45:06", //兑换时间
        saletitle: "商品标题", //商品标题
        points: "1000", //总积分
        username: "松仁", //联系人
        phonenumber: "15541414141", //联系电话
        address: "沈阳市沈河区奉天银座C沈阳市沈河区奉天银座C沈阳市沈河区奉天银座C沈阳市沈河区奉天银座C沈阳市沈河区奉天银", //地址
        status: 1, //状态(0表示未发货，1表示已发货，2已完成)
        expresscompany: "快递公司", //快递公司
        trackingnumber: "45613461312313", //快递单号
        deliverytime: "2020年1月10日13:56:05", //发货时间
        confirmtime: "2020年1月10日13:56:20", //完成时间
        imgicon:
          "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1022776950,3969976370&fm=26&gp=0.jpg", //商品封面
        pricepoint: "100" //商品单价*/
      }
    };
  },
  created() {
    this.init();
  },
  beforeRouteLeave(to, from, next) {
    // console.log(this.downOrder);
    // console.log(to, from);
    if (to.fullPath === "/integralOrderList") {
      return next();
    }
    if (this.downOrder) {
      next("/integralOrderList");
    } else {
      next();
    }
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.selectByPrimaryKey(); //查询订单详情
    },
    /**
     * 复制物流单号
     */
    copyCode(res) {
      if (!res) {
        Toast("请选择复制的内容");
        return;
      }
      this.copyText(res, () => {
        Toast("复制成功");
      });
    },
    /**
     * 复制文本
     */
    copyText(text, callback) {
      // text: 要复制的内容， callback: 回调
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = text;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      if (callback) {
        callback(text);
      }
    },
    /**
     * 确认收货接口
     */
    orderVerify() {
      this.$http
        .request({
          method: "post",
          url: "/OrderManagerController/orderVerify",
          body: {
            id: this.orderDetail.id
          }
        })
        .then(res => {
          if (res.data.success) {
            Toast("收货成功");
            this.selectByPrimaryKey();
          } else {
            Toast("查询用户积分数失败");
          }
        })
        .catch(error => {
          Toast(error);
        });
    },
    /**
     * 查询订单详情
     */
    selectByPrimaryKey() {
      console.log(this.orderId);
      this.$http
        .request({
          method: "get",
          url: "/OrderManagerController/selectByPrimaryKey",
          body: {
            id: this.orderId
          }
        })
        .then(res => {
          if (res.data.success) {
            this.orderDetail = res.data.data;
          } else {
            Toast("查询用户积分数失败");
          }
        })
        .catch(error => {
          Toast(error);
        });
    }
  },
  filters: {
    orderStatus(val) {
      let mess = "--";
      switch (val) {
        case 0:
          mess = "商品待发货";
          break;
        case 1:
          mess = "商品已发货";
          break;
        case 2:
          mess = "交易完成";
          break;
        default:
          mess = "未知状态";
          break;
      }
      return mess;
    },
    formatPrice(value) {
      let price = "";
      price = (value / 100).toFixed(2);
      return price;
    }
  },
  components: {
    commonHeader
  }
};
</script>

<style lang="less" scoped>
.integralOrderDetail {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .fontSize(16);
  color: @titleColor;
  background-color: @backgroundColor;

  .v-title {
    width: 100%;
    .height(44);
    /*border-bottom: 1px solid red;*/
  }

  .v-body {
    flex: 1;
    overflow: auto;

    .v-orderDetail {
      min-height: 100%;
      background: rgba(242, 242, 242, 1);

      .top_banner {
        .height(140);
        width: 100%;
        background-image: url("../../assets/images/orderDetailBanner.png");
        background-size: 100% 100%;
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
              font-family: PingFangSC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            }

            .order_state {
              .lineHeight(22);
              .fontSize(16);
              font-family: PingFangSC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
      }

      .vendingMachine_address {
        position: relative;
        top: -40 / 375 * 100vw;
        .margin(0, 12, 20, 12);
        .borderRadius(10, 10, 10, 10);
        background: rgba(255, 255, 255, 1);
        /*box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);*/
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        box-sizing: border-box;

        .v-address {
          width: 100%;
          .padding(14, 10, 14, 10);

          .v-addressTitle {
            display: flex;
            .fontSize(16);

            .v-titleName {
              font-weight: bold;
              .margin(0, 0, 0, 10);
              line-height: 18px;
            }
          }

          .v-name {
            .margin(15, 0, 0, 24);
            display: flex;
            justify-content: space-between;

            .v-text {
              display: flex;
              .lineHeight(22);

              .v-personName {
                .fontSize(14);
                font-weight: bold;
              }

              .v-personPhone {
                .fontSize(16);
                font-weight: 400;
                .margin(0, 0, 0, 10);
              }
            }

            .v-icon {
              .fontSize(18);

              /deep/ .van-icon-arrow:before {
                .lineHeight(21);
              }
            }

            .v-copy {
              color: @mainColor;
              text-decoration: underline;
              .lineHeight(22);
            }
          }

          .v-site {
            .margin(15, 0, 0, 24);

            .v-text {
              .fontSize(14);
              .lineHeight(18);
              font-weight: 400;
              //.overflowline(1);
            }
          }
        }

        .v-product {
          background-color: #fff;
          .borderRadius(10, 10, 10, 10);
          display: flex;
          .padding(15, 10, 15, 10);

          .v-img {
            .width(78);
            .height(78);
            .borderRadius(10, 10, 10, 10);
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .v-main {
            .margin(0, 0, 0, 10);
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .v-name {
              .width(238);
              font-weight: bold;
              .overflowline(2);
              .lineHeight(20);
            }

            .v-number {
              display: flex;
              justify-content: space-between;

              .v-total {
                .fontSize(14);
                color: @redOne;

                span {
                  .fontSize(18);
                }
              }

              .v-num {
                font-weight: 400;
                .lineHeight(18);
              }
            }
          }
        }

        .v-detailList {
          .padding(0, 10, 10, 10);

          .v-listMain {
            .padding(0, 0, 5, 0);
          }
        }
      }
    }

    .v-line {
      width: 100%;
      .height(2);
      background-color: @backgroundColor;
    }
  }
}
</style>
