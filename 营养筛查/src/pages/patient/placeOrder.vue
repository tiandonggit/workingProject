<!--
  作者:马林
  用途:订单拆单页
  -------------------
  Created by webStorm
  User: tyx
  Date: 2019年8月7日
  Time: 09:40:38
  Application: placeOrder
  State: page
-->
<template>
  <div id="placeOrder">
    <div class="v-body">
      <common_header :customTitle="title" />

      <div class="v-box v-boxOrder">
        <div class="v-orderMain">
          <div class="v-boxOrderTitle">
            <div class="v-text">
              订单:13245678898556
            </div>
            <div></div>
          </div>
          <div>
            <div id="v-drugList">
              <div
                v-for="(v, k) in hospitalDrugs"
                :key="k"
                class="preList"
              >
                <div class="pre-message p-display-row">
                  <div class="pre-message-left">
                    <img
                      src="http://img.redocn.com/sheji/20170216/shuimianyaopinbaozhuangsheji_7871385_small.jpg"
                      alt=""
                    />
                  </div>
                  <div
                    class="pre-message-right"
                    :class="v.state === 1 ? 'preListNoDrug' : ''"
                  >
                    <div>
                      <div>
                        <span class="pre-span"
                          >多种维生素咀嚼片（儿童型）-迪士尼漫威装（60片装）儿童用药</span
                        >
                      </div>
                      <div></div>
                    </div>
                    <div class="p-display-row">
                      <span
                        class="pre-span-3"
                        :class="v.state === 1 ? 'preListNoDrug' : ''"
                        >¥25.40</span
                      >&nbsp;&nbsp;<span class="pre-span-2">x5</span>
                    </div>
                  </div>
                  <div v-if="v.state === 1" class="pre-message-noDrug">
                    <img src="../../assets/img/noDrug.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div class="v-bottomText">
              <div class="v-totalOne" :class="!shopState ? 'v-noGetText' : ''">
                共10件营养品，小计<span :class="!shopState ? 'v-noGetText' : ''"
                  >¥10204.58</span
                >
              </div>
              <div v-if="shopState" class="v-message">
                营养品一经售出概不退换
              </div>
            </div>
          </div>
          <div class="v-bottomHospital">
            <div class="v-title">
              智配柜地址
            </div>
            <div class="v-main" id="v-cabinet">
              <div class="main">
                <div class="main-bottom">
                  <div class="main-title">
                    <div class="main-text">
                      {{ information.name }}
                    </div>
                  </div>
                  <div class="pre-message p-display-row">
                    <div class="pre-message-left">
                      <img src="../../assets/img/cabinet.png" alt="" />
                    </div>
                    <div class="pre-message-right">
                      <!--<div>-->
                      <!--<div class="pre-span">-->
                      <!--客服电话：{{ information.phone }}-->
                      <!--</div>-->
                      <!--</div>-->
                      <div>
                        <div class="pre-span">
                          智配柜编号：{{ information.code }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="v-getHospital">
            智配柜自提
          </div>
        </div>
      </div>

      <div class="v-noBox"></div>
      <div class="v-pay">
        <div class="v-bottom" :class="!placeState ? 'noPlace' : ''">
          <van-button class="v-nextBottom" type="warning"
            >去支付 (¥1025.88)
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "placeOrder",
  data() {
    return {
      title: "订单详情",
      orderChecked: [], //订单多选数据
      hospitalDrugs: [
        { name: "a", state: 1 },
        { name: "a", state: 1 },
        { name: "a" }
      ],
      placeState: true, //医院库存是否正常
      shopDrugs: [{ name: "a" }, { name: "a" }, { name: "a" }],
      shopState: true, //药店库存是否正常
      information: {
        state: 0,
        name: "中国医科大学第二附属医院盛京医院",
        phone: "024-23456789",
        address: "沈阳市和平区十四纬路光荣街256号"
      } //医院自提
    };
  },
  methods: {}
};
</script>
<style lang="less" scoped>
//移动端
#placeOrder {
  width: 100%;
  height: 100%;
  color: @fontColor33;
  .v-body {
    width: 100%;
    height: 100%;
    .fontSize(16);
    .padding(10, 12, 0, 12);

    .v-box {
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 10, 0);
      position: relative;
      /*overflow: hidden;*/
      background: #fff;

      .v-orderId {
        .padding(15, 10, 15, 10);
        font-weight: bold;
        color: @fontColor33;
      }

      .v-boxMain {
        .padding(15, 10, 15, 10);
        display: flex;
        justify-content: space-between;
        .v-boxTitle {
          .lineHeight(19);
        }
      }
    }

    .v-boxOrder {
      .margin(26, 0, 10, 0);
      #v-drugList {
        .preList {
          color: @fontColor33;
          .padding(5);
          .preListNoDrug {
            color: @fontColor66 !important;
          }
          .pre-line {
            border-bottom: 0.2vw solid rgba(0, 0, 0, 0.1);
          }
          .pre-message {
            align-items: center;
            /*height: 14vw;*/
            .padding(10, 0, 10, 0);
            position: relative;
          }

          .pre-message-left {
            .width(92);
            .height(92);
            border-radius: 2vw;
            overflow: hidden;
          }

          .pre-message-left img {
            width: 100%;
            height: 100%;
            align-items: center;
          }

          .pre-message-right {
            width: 65%;
            .height(92);
            display: flex;
            margin-left: 5vw;
            flex-direction: column;
            justify-content: space-between;
          }
          .pre-message-noDrug {
            position: absolute;
            z-index: 33;
            background: rgba(0, 0, 0, 0.2);
            .width(92);
            .height(92);
            border-radius: 2vw;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            img {
              width: 100%;
              margin: auto;
            }
          }
          .p-display-column {
            display: flex;
            flex-direction: column;
          }

          .p-display-row {
            display: flex;
            flex-direction: row;
          }

          .pre-span-line {
            justify-content: space-between;
          }

          .pre-span-4 {
            display: block;
            text-align: left;
            .fontSize(12);
            margin: 2% 0;
          }

          .pre-span-3 {
            color: red;
            .fontSize(16);
          }

          .pre-span-2 {
            .fontSize(14);
          }

          .pre-span {
            .fontSize(16);
            .lineHeight(24);
            font-weight: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
          }
          .pre-spanNow {
            display: flex;
            justify-content: space-between;
          }
          .pre-spanCount {
            font-size: 14px;
          }
          .pre-spanLit {
            font-size: 14px;
            font-weight: 400;
            .lineHeight(24);
            color: @fontColor99;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
          }
          .pre-message-bottom {
            .fontSize(15);
          }
          .pre-more {
            font-weight: 400;
            .padding(15, 15, 15, 15);
            display: flex;
            justify-content: center;
          }
        }
      }
      .v-orderMain {
        .padding(36, 10, 10, 10);

        .v-boxOrderTitle {
          .lineHeight(16);
          display: flex;
          justify-content: space-between;

          .v-text {
            font-weight: bold;
          }
        }

        .v-freight {
          display: flex;
          justify-content: space-between;
          color: @fontColor33;
          .lineHeight(22);

          border-bottom: 0.2vw solid rgba(0, 0, 0, 0.1);
          .padding(15, 0, 15, 0);

          .v-text {
            font-weight: 400;
          }
        }

        .v-address {
          color: @fontColor33;
          .padding(24);

          .v-title {
            font-weight: bold;
            .lineHeight(16);
          }

          .v-main {
            .v-mainAddress {
              display: flex;
              .padding(16);
              justify-content: space-between;

              .v-main-title {
                width: 100%;
                display: flex;

                color: @fontColor33;
                .lineHeight(18);
                .fontSize(14);
                font-weight: bold;
                justify-content: space-between;
              }
            }
          }
        }

        .v-bottomText {
          .fontSize(14);
          .padding(15);
          text-align: right;
          .lineHeight(20);

          .v-totalOne {
            font-weight: 400;

            span {
              color: @fontColorRed;
              .fontSize(16);
            }
          }
          .v-message {
            .padding(8);
            color: @mainColor;
          }
        }

        .v-bottomHospital {
          .padding(24);
          color: @fontColor33;
          #v-cabinet {
            .main-bottom {
              border-radius: 3vw;
              overflow: hidden;
              /*border: 0.2vw solid red;*/
              background: #fff;
            }
            .main-title {
              width: 100%;
              color: #000;
              .lineHeight(18);
              .main-titleThis {
                font-weight: bold;
                padding-bottom: 10px;
              }
              .main-text {
                width: 90%;
                font-weight: 400;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .fontSize(14);
              }
            }
            .pre-message {
              align-items: center;
              /*height: 14vw;*/
              /*border-bottom: 1px solid @backgroundColor;*/
              .padding(10);
            }

            .pre-message-left {
              .width(78);
              .height(78);
              border-radius: 2vw;
              overflow: hidden;
            }

            .pre-message-left img {
              width: 100%;
              height: 100%;
              align-items: center;
            }

            .pre-message-right {
              width: 62%;
              .height(78);
              /*display: flex;*/
              margin-left: 5vw;
              /*flex-direction: column;*/
              /*justify-content: space-between;*/
            }

            .p-display-column {
              display: flex;
              flex-direction: column;
            }

            .p-display-row {
              display: flex;
              flex-direction: row;
            }

            .pre-span-line {
              justify-content: space-between;
            }

            .pre-span-4 {
              display: block;
              text-align: left;
              .fontSize(12);
              margin: 2% 0;
            }

            .pre-span-2 {
              .fontSize(14);
            }

            .pre-span {
              .fontSize(14);
              font-weight: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
              color: @fontColor99;
              .padding(0, 0, 10, 0);
              .lineHeight(22);
            }

            .pre-message-bottom {
              color: #666;
              .fontSize(15);
            }
          }
          .v-title {
            font-weight: bold;
            .lineHeight(16);
          }

          .v-main {
            .padding(16);
          }
        }

        .v-noGetShop {
          .padding(53, 0, 53, 0);
          display: flex;
          justify-content: center;

          .v-noTitle {
            color: @mainColor;
            font-weight: 400;
          }
        }
      }

      .v-getHospital {
        position: absolute;
        z-index: 33;
        top: -4.6vw;
        background: linear-gradient(44deg, @startColor 0%, @endColor 100%);
        .padding(0, 13, 0, 13);
        .lineHeight(32.5);
        .height(32);
        .borderRadius(16, 16, 16, 16);
        color: #fff;
        font-weight: bold;
      }
    }

    .v-noBox {
      width: 100%;
      .height(49);
    }
    .goOther {
      .padding(24, 0, 24, 0);
      color: @mainColor;
      .lineHeight(22);
      text-decoration: underline;
      text-align: center;
    }
    .v-pay {
      position: fixed;
      z-index: 99;
      left: 0;
      bottom: 0;
      width: 100%;
      .v-warning {
        padding: 10px 13px;
        font-size: 12px;
        color: @fontColorRed;
        background-color: #ffebd7;
      }
      .v-bottom {
        .height(60);
        background: #fff;

        display: flex;
        flex-direction: column;
        justify-content: center;
        /deep/ .van-button__text {
          font-size: 16px;
        }
        .v-nextBottom {
          .width(351);
          .height(40);
          .lineHeight(40);
          margin: auto;
        }
      }
      .noPlace {
        /deep/ .van-button {
          background: @backcolord1 !important;
          border: 1px solid @backcolord1 !important;
        }
      }
    }

    .v-postHospital {
      left: 23vw;
      z-index: 33;
    }

    .v-noChecked {
      background: rgba(0, 0, 0, 0) !important;
      z-index: 3 !important;
      color: @fontColor33 !important;
    }

    .v-getBack {
      .width(178);
      .height(32);
      position: absolute;
      z-index: 1;
      top: -4.6vw;
      background: rgba(255, 223, 191, 1);
      .borderRadius(16, 16, 16, 16);
    }
    .v-noGetChecked {
      background: linear-gradient(
        44deg,
        rgba(195, 195, 195, 1) 0%,
        rgba(222, 222, 222, 1) 100%
      ) !important;
    }
    .v-noPostChecked {
      background: linear-gradient(
        44deg,
        rgba(239, 239, 239, 1) 0%,
        rgba(231, 231, 231, 1) 100%
      );
    }
    .v-noGetText {
      color: @fontColor99 !important;
    }
    /deep/ .van-checkbox {
      .van-checkbox__icon--checked .van-icon {
        color: #fff;
        border-color: @mainColor;
        background-color: @mainColor;
      }
    }

    .v-line {
      border-bottom: 0.2vw solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
