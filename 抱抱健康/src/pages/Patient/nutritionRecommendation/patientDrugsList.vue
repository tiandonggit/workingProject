/**
* @Description: 患者自选自营产品列表页(提交订单购买)
* @Author: 侯湃
* @Date: 2020/7/14
*/
<template>
  <div id="patientDrugsList">
    <common-header
        :share-disabled="true"
        :custom-title="'推荐产品'"
        :header-show="true"
        title="产品清单"
    ></common-header>
    <div class="container">
      <div class="block-item" v-for="(item, index) in list" :key="index">
        <div class="top-info">
          <div class="img-box">
            <img :src="item.icon" alt=""/>
          </div>
          <div class="right-info">
            <p class="name">{{ item.name }}</p>
            <p class="specification">{{ item.specification }}</p>
            <p class="manufacturer">{{ item.manufacturers }}</p>
            <p class="price-box">
              <span class="activity">
                ¥{{ (item.activityprice / 100).toFixed(2) }}
              </span>
              <span class="price">
                ¥{{ (item.sellingprice / 100).toFixed(2) }}
              </span>
              <span class="num">
                x{{ item.number }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-box">
      <van-button
          slot="button"
          class="next-btn"
          size="large"
          @click="$throttle(confirm)">
        确认购买
      </van-button>
    </div>
  </div>
</template>

<script>

  import {Toast, Dialog, Stepper} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";


  export default {
    name: "patientDrugsList",
    data() {
      return {
        list: []
      };
    },
    components: {
      commonHeader
    },
    created() {
      this.dataList = JSON.parse(window.localStorage.getItem("patientDrugsList"));
      this.list = this.dataList.filter(v => {
        return v.number > 0;
      });
    },
    methods: {
      /**
       * 提交获取订单
       * **/
      confirm() {
        let params = [];
        this.list.forEach(v => {
          params.push({productid: v.id, number: v.number});
        });
        // 提交订单
        this.$http.request({
          method: "post",
          url: "ZyOrderController/insertOrUpdate",
          body: {
            list: JSON.stringify(params),
            type:1
          }
        }).then(res => {
          if (res.data.success) {
            // 提交订单成功回调,获取订单id,跳转自营产品列表页(带有倒计时的那个页)
            // window.localStorage.removeItem("patientDrugsList");
            this.$router.push({
              path: "/productList",
              query: {
                productOrderId: res.data.data || ""
              }
            });
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  #patientDrugsList {
    .padding(44, 12, 80, 12);

    .container {
      .block-item {
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
        .padding(15, 10, 0, 10);
        background: @backgroundColorT;
        .margin(0, 0, 15, 0);

        .top-info {
          display: flex;

          .img-box {
            .width(78);
            .height(78);
            background: @backgroundColorImg;
            .borderRadius(10, 10, 10, 10);
            overflow: hidden;
            .margin(0, 10, 0, 0);
            position: relative;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }

            .inventory {
              position: absolute;
              right: 0;
              left: 0;
              bottom: 0;
              .height(20);
              background: rgba(0, 0, 0, 0.3);
              display: flex;
              justify-content: center;
              align-items: center;

              span {
                .fontSize(12);
                font-weight: 400;
                color: @fontOne;
                .lineHeight(14);
              }
            }
          }

          .right-info {
            flex: 1;
            width: 0;

            p {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .name {
              .fontSize(16);
              font-weight: bold;
              color: @titleColor;
              .lineHeight(18);
            }

            .specification {
              .margin(13, 0, 13, 0);
              .fontSize(16);
              font-weight: 400;
              color: @subtitleColor;
              .lineHeight(18);
            }

            .manufacturer {
              .fontSize(14);
              font-weight: 400;
              color: @descriptionColor;
              .lineHeight(16);
            }

            .price-box {
              .margin(13, 0, 14, 0);

              .activity {
                .fontSize(16);
                font-weight: bold;
                color: @orderPriceColor;
                .lineHeight(18);
                .margin(0, 10, 0, 0);
              }

              .price {
                .fontSize(12);
                font-weight: 400;
                color: @descriptionColor;
                .lineHeight(14);
                text-decoration: line-through;
              }

              .num {
                .fontSize(16);
                font-weight: bold;
                color: @titleColor;
                .lineHeight(19);
                float: right;
              }
            }
          }
        }

        .bottom-num {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          .height(45);
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            .fontSize(16);
            font-weight: 400;
            color: @titleColor;
            .lineHeight(18);
          }

          /deep/ .van-stepper {
            .van-stepper__minus,
            .van-stepper__plus {
              .width(28);
              .height(18);
              background: @backgroundColorImg;
              .borderRadius(9, 9, 9, 9);
            }

            .van-stepper__input {
              background-color: @backgroundColorT;
              .fontSize(16);
            }
          }
        }
      }
    }
  }

</style>
