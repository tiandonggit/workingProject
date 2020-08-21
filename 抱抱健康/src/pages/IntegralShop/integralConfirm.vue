<!--
  作者:马林
  用途:
  -------------------
  Created by webStorm
  User: tyx
  Date: 2020/1/2 0002
  Time: 9:24
  Application: integralConfirm
  State: page
-->
<template>
  <div class="integralConfirm">
    <div class="v-title">
      <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="true"
        :title="title"
      ></commonHeader>
    </div>
    <div class="v-body">
      <div
        @click="
          $router.push({
            name: 'integralAddressSelect',
            query: { id: id, type: type }
          })
        "
        v-if="addressPerson.id"
        class="v-box"
      >
        <div class="v-address">
          <div class="v-addressTitle">
            <div class="v-addressIcon">
              <van-icon
                :name="require('../../assets/images/integraOrderLoaction.png')"
              ></van-icon>
            </div>
            <div class="v-titleName">收货人信息</div>
          </div>
          <div class="v-name">
            <div class="v-text">
              <div class="v-personName">
                {{ addressPerson.name }}
              </div>
              <div class="v-personPhone">
                {{ addressPerson.phone }}
              </div>
            </div>
            <div class="v-icon">
              <van-icon name="arrow"></van-icon>
            </div>
          </div>
          <div class="v-site">
            <div class="v-text">
              {{ addressPerson.address + addressPerson.pointnum }}
            </div>
          </div>
        </div>
      </div>
      <div
        @click="
          $router.push({
            name: 'integralAddressSelect',
            query: { id: id, type: type }
          })
        "
        v-if="!addressPerson.id"
        class="v-box"
      >
        <div class="v-address v-noAddress">
          <div class="v-addressTitle">
            <div class="v-addressIcon">
              <van-icon
                :name="require('../../assets/images/integraOrderLoaction.png')"
              ></van-icon>
            </div>
            <div class="v-titleName">请添加收货人地址</div>
          </div>
          <div class="v-icon">
            <van-icon name="arrow"></van-icon>
          </div>
        </div>
      </div>
      <div class="v-box">
        <div class="v-product">
          <div class="v-img">
            <img :src="product.productimg" alt="" />
          </div>
          <div class="v-main">
            <div class="v-name">
              {{ product.saletitle }}
            </div>
            <div class="v-number">
              <div class="v-total">
                <span>{{ product.points }}</span
                >{{ type == 0 ? "健康" : "智" }}币
              </div>
              <div v-show="points" class="v-num">
                <van-stepper
                  :disable-input="true"
                  button-size="18px"
                  v-model="num"
                  :max="maxNum"
                ></van-stepper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="v-bottom">
      <div class="v-bottomTotal">
        {{ type == 0 ? "健康" : "智" }}币: <span>{{ points }}</span>
      </div>
      <div class="v-bottomButton" :class="points == '--' ? 'v-noPay' : ''">
        <van-button @click="$throttle(pay)" type="info">立即支付</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from "../../components/commonHeader/common_header";
import { Toast } from "vant";
export default {
  name: "integralConfirm",
  data() {
    return {
      customTitle: "礼品商城",
      title: "确认订单",
      id: this.$route.query.id,
      point: window.sessionStorage.getItem("userPoint"),
      type: this.$route.query.type ? this.$route.query.type : 0, //身份:0患者 1医生
      addressPerson: {
        /*    id: 1,
        name: "李娜",
        phone: "13567899876",
        address: "辽宁省沈阳市和平区",
        pointnum:
          "盛景医院住院部盛景医院住院部盛景医院住院部盛景医院住院部盛景医院住院部盛景医院住院部"*/
      },
      product: {
        /*saletitle:
          "舒脑欣滴丸天津中新药厂制作缓解头痛舒脑欣滴丸天津中新药厂制作缓解头痛嗷嗷灵验了", //商品标题
        points: "100", //积分数
        specification: "12g*10袋/盒", //规格
        store: "3837", //库存
        productimg:
          "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1226102349,2613178901&fm=15&gp=0.jpg"*/
      },
      num: 1,
      maxNum: 1
    };
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.selectByPrimaryKey(); //查询商品详情
      this.changeAddress(); //处理地址问题
    },
    /**
     * 处理地址
     */
    changeAddress() {
      let addressData = this.$store.state.Address.addressData;
      if (addressData.id) {
        this.addressPerson = addressData;
      } else {
        this.getListRFirstUserAddress();
      }
    },
    /**
     * 确认下单
     */
    pay() {
      if (!this.addressPerson.id) {
        Toast("请先添加收货地址");
        return;
      }
      this.$http
        .request({
          method: "post",
          url: "/OrderManagerController/opintsExchangeProduct",
          body: {
            productId: this.id,
            rUserAddressId: this.addressPerson.id,
            num: this.num
          }
        })
        .then(res => {
          if (res.data.success) {
            Toast("兑换成功");
            this.$router.replace({
              name: "integralOrderDetail",
              query: {
                orderId: res.data.data,
                type: this.type,
                downOrder: true
              }
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast(error);
        });
    },
    /**
     * 查询商品详情
     */
    selectByPrimaryKey() {
      this.$http
        .request({
          method: "get",
          url: "/ProductManagerController/selectByPrimaryKey",
          body: {
            id: this.id
          }
        })
        .then(res => {
          if (res.data.success) {
            this.product = res.data.data.productManager;
            this.images = res.data.data.productImgList;
            console.log(res.data.data.productManager.points > 0);
            if (
              this.point &&
              this.point > 0 &&
              this.point / res.data.data.productManager.points > 0
            ) {
              this.maxNum = parseInt(
                this.point / res.data.data.productManager.points
              );
              console.log(this.product.store, this.maxNum);
              if (this.product.store < this.maxNum) {
                this.maxNum = this.product.store;
              }
            }
          } else {
            Toast("查询商品信息失败");
          }
        })
        .catch(error => {
          Toast(error);
        });
    },
    /**
     * 查询第一个收货地址
     */
    getListRFirstUserAddress() {
      this.$http
        .request({
          method: "get",
          url: "/RUserAddressController/getListRUserAddress",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.data.length > 0) {
              if (res.data.data[0].status == 0) {
                this.addressPerson = res.data.data[0];
                this.$store.commit("Address/addressData", this.addressPerson);
              }
            }
          } else {
            Toast("查询用户积分数失败");
          }
        })
        .catch(error => {
          Toast(error);
        });
    }
  },
  computed: {
    /**
     * 总积分数
     */
    points() {
      let points = "--";
      if (this.point && this.point > 0 && this.product && this.product.points) {
        points = this.product.points * this.num;
      }
      return points;
    }
  },
  components: {
    commonHeader
  }
};
</script>

<style lang="less" scoped>
.integralConfirm {
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
  }

  .v-body {
    flex: 1;
    overflow: auto;

    .v-box {
      .margin(20, 12, 0, 12);
      .borderRadius(10, 10, 10, 10);
      background-color: #fff;

      .v-address {
        .padding(15, 12, 15, 12);

        .v-addressTitle {
          display: flex;
          .fontSize(18);

          .v-titleName {
            font-weight: bold;
            .margin(0, 0, 0, 10);
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
        }

        .v-site {
          .margin(15, 0, 0, 24);

          .v-text {
            .fontSize(14);
            font-weight: 400;
            //.overflowline(1);
            .lineHeight(18);
          }
        }
      }

      .v-noAddress {
        display: flex;
        justify-content: space-between;

        .v-addressTitle {
          .v-titleName {
            font-weight: 400;
            color: @qianSpan;
            .lineHeight(23);
          }
        }

        .v-icon {
          .fontSize(18);

          /deep/ .van-icon-arrow:before {
            .lineHeight(22);
          }
        }
      }

      .v-product {
        .margin(15, 0, 0, 0);
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

              /deep/ .van-stepper__input:disabled {
                background-color: #fff;
                color: @titleColor;
                -webkit-text-fill-color: @titleColor;
              }

              /deep/ .van-stepper__minus {
                width: (28 / 375) * 100vw !important;
                .borderRadius(9, 9, 9, 9);
              }

              /deep/ .van-stepper__plus {
                width: (28 / 375) * 100vw !important;
                .borderRadius(9, 9, 9, 9);
              }
            }
          }
        }
      }
    }
  }

  .v-bottom {
    display: flex;
    justify-content: space-between;
    .padding(8, 12, 8, 12);
    background-color: #fff;

    .v-bottomTotal {
      .lineHeight(30);

      span {
        color: @redOne;
      }
    }

    .v-bottomButton {
      /deep/ .van-button {
        .width(112);
        .height(30);
        .lineHeight(30);
        .fontSize(18);
        .borderRadius(10, 10, 10, 10);
        background: linear-gradient(
          225deg,
          @buttonRightColorBlue 0%,
          @buttonColor 100%
        );

        .van-button__text {
          font-weight: bold;
        }
      }
    }
    .v-noPay {
      /deep/ .van-button {
        background: @descriptionColor;
        border: 0;
      }
    }
  }

  /* 判断iphoneX 将 footerBox 的 padding-bottom 填充到最底部 */
  @supports (bottom: env(safe-area-inset-bottom)) {
    .v-bottom {
      margin-bottom: env(safe-area-inset-bottom);
    }
  }
}
</style>
