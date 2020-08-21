<!--
  作者:马林
  用途:下单页
  -------------------
  Created by webStorm
  User: tyx
  Date: 2019年11月7日
  Time: 09:47:52
  Application: confirmOrder
  State: page
-->
<template>
  <div id="confirmOrder">
    <div>
      <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="true"
        :title="title"
      ></commonHeader>
    </div>
    <div class="v-body">
      <!-- <common_header :customTitle="title" /> -->
      <!-- <commonHeader
              :share-disabled="true"
              :custom-title="customTitle"
              :header-show="true"
              :title="title"
      ></commonHeader> -->
      <div class="v-box">
        <div class="v-orderId">
          <div v-if="information.state != 1" class="main">
            <div class="main-bottom">
              <div class="main-title">
                <img src="../../assets/img/guiiocn.png" />
                <div class="main-titleThis">
                  自提柜编号{{ information.code }}
                </div>
                <!-- <div class="main-text">

                </div> -->
              </div>
              <div class="pre-message p-display-row">
                <div
                  @click="
                    checkImg(
                      information.deviceImgUrl
                        ? information.deviceImgUrl
                        : require('../../assets/img/vendingMachine2.png')
                    )
                  "
                  class="pre-message-left"
                >
                  <img
                    :src="
                      information.deviceImgUrl
                        ? information.deviceImgUrl
                        : require('../../assets/img/vendingMachine2.png')
                    "
                    alt=""
                  />
                  <div class="pre-message-left-tip">
                    点击放大图片
                  </div>
                </div>
                <div class="pre-message-right">
                  <div>
                    <div class="pre-span">
                      客服电话：{{ information.phone }}
                    </div>
                  </div>
                  <div>
                    <div class="pre-span">
                      地址：
                      <p>{{ information.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="v-box v-boxOrder">
        <div class="v-orderMain">
          <div class="v-orderMainTitle">
            <img src="../../assets/img/yyptits.png" />
          </div>
          <div>
            <div v-for="(v, k) in hospitalDrugs" :key="k" class="preList">
              <div class="pre-message p-display-row">
                <div class="pre-message-left">
                  <img :src="v.topImg" alt="" />
                </div>
                <div class="pre-message-right">
                  <div>
                    <span class="pre-span">{{ v.productName }}</span>
                  </div>
                  <div>
                    <div class="pre-spanNow">
                      <div class="pre-spanLit">{{ v.specificationName }}</div>
                      <div class="pre-spanLit">
                        <span>×{{ v.quantity }}</span>
                      </div>
                    </div>
                    <!--  <div class="p-display-row">
                      <span class="pre-spanCount"
                            :class="
                              v.productStore == 0 || v.quantity > v.productStore
                                ? 'preListNoDrug'
                                : ''
                            "
                        >库存剩余: {{ v.productStore }}</span
                      >
                    </div>-->
                  </div>
                </div>
                <div
                  v-show="v.productStore == 0 || v.quantity > v.productStore"
                  class="pre-message-noDrug"
                >
                  <img src="../../assets/img/empty.png" alt="" />
                </div>
                <!-- <div class="pre-message-label">
                  营养成品
                </div> -->
              </div>
            </div>
            <div class="v-freight">
              <div class="v-text">
                运费
              </div>
              <div class="v-text">
                ¥15.00
              </div>
            </div>
            <div class="v-bottomText">
              <div class="v-totalOne">
                共{{ hospitalDrugs.length }}件营养品，小计<span
                  >{{ orderTotalPrice }}}}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding-bottom: 44px"></div>
      <div
        v-if="mainState == 0"
        class="v-pay"
        :class="placeState ? 'v-noPay' : ''"
      >
        <div v-if="!placeState" class="v-warning">
          *库存不足，请联系客服，客服电话:4000909975
        </div>
        <div
          @click="$throttle(placeNext)"
          class="v-bottom"
          :class="!placeState ? 'noPlace' : ''"
        >
          <van-button class="v-nextBottom" type="warning">确认购买</van-button>
        </div>
      </div>
      <div
        v-else-if="mainState == 3 || mainState == 4 || mainState == 1"
        class="v-pay"
        :class="placeState ? 'v-noPay' : ''"
      >
        <div @click="$router.go(-1)" class="v-bottom">
          <van-button class="v-nextBottom" type="warning">确认返回</van-button>
        </div>
      </div>
      <div
        v-else-if="mainState == 2"
        class="v-pay"
        :class="placeState ? 'v-noPay' : ''"
      >
        <div @click="modifyProduct" class="v-bottom">
          <van-button class="v-nextBottom" type="warning">修改商品</van-button>
        </div>
      </div>
      <div class="v-noBox"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Toast, ImagePreview } from "vant";
import commonHeader from "../../components/commonHeader/common_header";
import { mapState } from "vuex";

export default {
  name: "confirmOrder",
  components: {
    commonHeader
  },
  computed: {
    ...mapState(["Doctor"])
  },
  data() {
    return {
      customTitle: "营养方案",
      title: "营养产品推荐",
      prescriptionId: window.sessionStorage.getItem("id"), //处方id
      // prescriptionId: "473566300027886820", //处方id
      commitProductInfo: [], //准备发送的药品集合
      orderTotalPrice: 0, //订单总价
      openId: "", //医生的openId
      deviceId: 0, //自助柜id
      orderId: "", //订单id
      drugNum: 0, //商品总数量

      hospitalDrugs: [],
      placeState: true, //是否能够下单购买
      mainState: this.$route.query.state || 0, //底部购买信息是否显示(是否显示返回按钮和修改商品按钮)
      information: {
        state: 0,
        name: "",
        phone: "400-0909975",
        code: ""
      }, //医院自提
      shopGet: true //是否为药店自提 默认是
    };
  },
  created() {
    this.showMain();
  },
  methods: {
    //确认下单
    placeNext() {
      if (!this.placeState || this.orderTotalPrice === 0) {
        return;
      }
      Toast.loading({
        mask: true,
        message: "订单生成中..."
      });
      this.$http
        .request({
          baseURL: this.$globalServiceHost.mockServiceHost,
          method: "post",
          url: "/ROrderController/createNOrder",
          body: {
            commitProductInfo: JSON.stringify(this.commitProductInfo),
            orderTotalPrice: this.orderTotalPrice,
            deviceId: this.deviceId,
            orderProductNum: this.drugNum,
            openId: this.openId,
            prescriptionId: this.prescriptionId,
            payOpenId: this.$store.state.Patient.patientMessage.opendId
          }
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.$store.commit("Patient/saveOrderId", res.data.data);
            this.orderId = res.data.data;
            this.Relation();
          } else {
            Toast(res.data.message);
            setTimeout(() => {
              this.showMain();
            }, 1500);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("接口异常");
        });
    },
    //关联处方id与订单id
    Relation() {
      this.$http
        .request({
          method: "post",
          url: "/NNutritionPrescribePatientController/update",
          body: {
            id: this.prescriptionId,
            departmentid: this.orderId
          }
        })
        .then(res => {
          if (res.data.success) {
            this.$router.replace({
              name: "orderDetail",
              query: {}
            });
          } else {
            Toast("订单创建成功,但关联出错");
          }
        })
        .catch(error => {
          Toast("接口异常");
        });
    },
    //展示相关信息
    showMain() {
      this.$http
        .request({
          method: "get",
          url:
            "/NNutritionPrescribeGoodsController/selectNutritionPrescribeData",
          body: {
            patiId: this.prescriptionId
          }
        })
        .then(res => {
          console.log("--------" + res);
          // console.log(JSON.stringify(res));
          let total = 0;
          let num = 0;
          let drugInfo = [];
          if (res.data.success) {
            window.sessionStorage.getItem("id");
            this.information.name = res.data.data.deviceFullAdress; //设备地址
            this.deviceId = res.data.data.deviceId; //自助柜id
            this.information.code = res.data.data.deviceCode; //药柜code
            this.information.deviceImgUrl = res.data.data.deviceImgUrl; //药柜图片
            this.hospitalDrugs = res.data.data.specList; //药品列表
            this.openId = res.data.data.doctorOpenId; //医生的openId

            for (let i = 0; i < res.data.data.specList.length; i++) {
              //是否可以下单购买
              if (res.data.data.specList[i].productStore === 0) {
                this.placeState = false;
              }
              //计算订单总价
              total +=
                res.data.data.specList[i].productPrice *
                res.data.data.specList[i].quantity;
              num += res.data.data.specList[i].quantity;
              //拼接json
              drugInfo.push({
                specificationId: res.data.data.specList[i].specificationId,
                goodsId: res.data.data.specList[i].goodsId,
                productCount: res.data.data.specList[i].quantity,
                productPrice: res.data.data.specList[i].productPrice
              });
            }
            this.orderTotalPrice = total; //订单总价
            this.commitProductInfo = drugInfo;
            console.log(this.commitProductInfo);
            console.log(JSON.stringify(this.commitProductInfo));
            this.drugNum = num;
          } else {
            Toast("当前处方信息有误");
          }
        })
        .catch(error => {
          Toast("接口异常");
        });
    },
    /**
     * 营养师修改处方产品,清空缓存
     * **/
    modifyProduct() {
      this.$store.commit("Doctor/modifyProductList", "");
      if (this.$route.query.from == "doctor") {
        this.$store.commit("Doctor/planNutritionList", "");
        this.$router.push({
          name: "ProductSearch",
          query: {
            nutritionType: 1
          }
        });
      } else {
        this.$router.push({
          path: "/modifyProducts",
          query: {
            type: this.mainState
          }
        });
      }
    },
    /**
     * 点击预览图片**/
    checkImg(img) {
      if (img) {
        let productImg = "";
        try {
          if (img) {
            productImg = img + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        ImagePreview([productImg]);
      }
    }
  }
};
</script>
<style lang="less" scoped>
#confirmOrder {
  width: 100%;
  /*min-height: 100%;*/
  color: @fontColor33;
  /*.common-header{
          width: 100vw;
          padding: 0;
          position: relative;
          top: -12px;
          left: -12px;
        }*/

  .v-body {
    width: 100%;
    height: 100%;
    .fontSize(16);
    .padding(54, 12, 0, 12);
    // margin-top: 15px;
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

        .main-bottom {
          overflow: hidden;
          /*border: 0.2vw solid red;*/
          background: #fff;
        }

        .main-title {
          width: 100%;
          color: #000;
          display: flex;
          justify-content: flex-start;
          .lineHeight(18);

          img {
            width: 16px;
            height: 20px;
            margin-top: -2px;
            margin-right: 8px;
          }

          .main-titleThis {
            font-weight: bold;
            padding-bottom: 10px;
          }

          .main-text {
            width: 100%;
            font-weight: 400;
            /*overflow: hidden;*/
            /*white-space: nowrap;*/
            /*text-overflow: ellipsis;*/
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
          position: relative;
          .pre-message-left-tip {
            position: absolute;
            bottom: 0;
            width: 78px;
            height: 17px;
            font-size: 12px;
            line-height: 17px;
            border-radius: 0 0 10px 10px;
            font-weight: 400;
            color: #fff;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
          }
        }

        .pre-message-left img {
          width: 100%;
          height: 100%;
          align-items: center;
        }

        .pre-message-right {
          width: 70%;
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
          color: @fontColor99;
          .margin(0, 0, 10, 0);
          .lineHeight(22);
          display: flex;
          justify-content: flex-start;

          p {
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
          }
        }

        .pre-message-bottom {
          color: #666;
          .fontSize(15);
        }
      }

      .v-boxMain {
        .padding(15, 10, 15, 10);
        display: flex;
        justify-content: space-between;

        .v-orderState {
          .v-title {
            font-weight: bold;
          }

          .v-tip {
            .padding(20);
            .fontSize(14);
            font-weight: 400;
          }
        }

        .v-message {
          width: 100%;

          .v-text {
            &:first-child {
              .padding(0);
            }

            font-weight: bold;
            .padding(12);
            .lineHeight(24);
          }

          .v-copyText {
            display: flex;

            justify-content: space-between;

            .v-copyCode {
              font-weight: bold;
            }

            .v-copyThis {
              font-weight: 400;
              .fontSize(14);
              .lineHeight(24);
              color: @mainColor;
            }
          }

          .pre-more {
            font-weight: 400;
            .padding(30);
            display: flex;
            justify-content: center;
          }
        }

        .v-boxTitle {
          .lineHeight(19);
        }
      }
    }

    .v-boxOrder {
      .v-orderMain {
        .padding(0, 10, 10, 10);

        .v-orderMainTitle {
          // padding: 15px 0;
          padding-top: 5px;
          text-align: center;
          border-bottom: 1px solid @backcolor;

          img {
            width: 204px;
            height: 29px;
          }
        }

        .preList {
          color: @fontColor33;
          .padding(5);

          .preListNoDrug {
            color: @fontColor99 !important;
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
            .width(78);
            .height(78);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            img {
              width: 100%;
              height: 100%;
              align-items: center;
            }
          }
          .pre-message-right {
            width: 65%;
            .height(78);
            display: flex;
            margin-left: 5vw;
            flex-direction: column;
            justify-content: space-between;
          }

          .pre-message-noDrug {
            position: absolute;
            z-index: 33;
            background: rgba(0, 0, 0, 0.2);
            .width(78);
            .height(78);
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

          .pre-message-label {
            font-size: 14px;
            text-align: center;
            line-height: 20px;
            color: #fff;
            position: absolute;
            top: 10px;
            z-index: 32;
            width: 66px;
            height: 20px;
            background: linear-gradient(
              226deg,
              rgba(255, 146, 0, 1) 0%,
              rgba(255, 89, 0, 1) 100%
            );
            border-radius: 10px 0 10px 0;
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

            span {
              color: @fontColor33;
            }
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

        .v-boxOrderTitle {
          .lineHeight(16);
          display: flex;
          justify-content: space-between;

          .v-text {
            font-weight: bold;
          }
        }

        .v-freight {
          display: none;
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
          display: none;

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
      .height(126);
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
      background-color: @backcolor;
      z-index: 99;
      left: 0;
      bottom: 0px;
      width: 100%;
      box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, 0.1);

      .v-warning {
        padding: 10px 13px;
        font-size: 12px;
        color: @fontColorFF3;
      }

      .v-bottom {
        .height(60);
        // background: #fff;
        // background: linear-gradient(306deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%) !important;
        display: flex;
        flex-direction: column;
        justify-content: center;

        /deep/ .van-button__text {
          font-size: 16px;
        }

        .v-nextBottom {
          // background: #CCCCCC !important;
          border: none;
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

    .v-noPay {
      box-shadow: 0 0 0 0;
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

<style>
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  /*导航操作栏上移*/
  .v-pay {
    padding-bottom: 20px;
  }
}
</style>
