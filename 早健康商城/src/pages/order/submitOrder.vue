/*
 * @Author: 田东 
 * @Date: 2019-05-10 10:24:02 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-24 17:42:59
 * @name 提交订单
 */

<template>
  <div id="submitOrder">
    <!-- 头部 -->
    <v-header :title="title" v-show="!isIosFocus"></v-header>

    <div class="card_box">
      <div class="address_box">
        <div v-if="!isHasAddress" is-link class="no_address" @click="goaddAddress()">请添加收货地址</div>
        <div v-else class="has_address" @click="goAddressList()">
          <p>{{addressInfo.name}} {{addressInfo.mobile}}</p>
          <span>{{addressInfo.baiduaddress}} {{addressInfo.address}}</span>
        </div>
        <i class="iconfont iconqianjin"></i>
      </div>
    </div>

    <div class="card_box" v-for="(data, key) in list" :key="key" :id="'id'+key">
      <div class="pharmacy_box">
        <div class="pharmacy_title">
          <i class="iconfont icondianpu header-leftFont"></i>
          {{data.PharmacyName_}}
        </div>
        <div class="drug_details clearfix" @click="checkProduct(data.sPharmacyId)">
          <div class="left">
            <div
              v-for="(url, key) in (data.productImgList.length <= 4 ? data.productImgList : data.productImgList.slice(0, 4))"
              :key="key"
            >
              <img :src="url" alt>
            </div>
          </div>
          <div class="right">
            共{{data.productCount}}件
            <i class="iconfont iconqianjin"></i>
          </div>
        </div>
        <div class="description">
          <van-cell-group>
            <van-cell title="运费" :value="'¥' + (data.productPostageTotal / 100).toFixed(2)"/>
            <van-cell title="商品总价" :value="'¥' + (data.productTotalPrice / 100).toFixed(2)"/>
            <van-cell title="买家留言">
              <van-field
                maxlength="50"
                v-model="data.message"
                input-align="right"
                @focus="inputFocus($event,key)"
                @blur="inputBlur()"
                placeholder="建议留言前先与商家沟通联系"
                :key="key"
              />
            </van-cell>
          </van-cell-group>
        </div>
      </div>
    </div>

    <div class="card_box money_box">
      <van-cell-group>
        <van-cell title="商品金额" :value="'¥' + (data.totalProductPrice / 100).toFixed(2)"/>
        <van-cell title="运费" :value="'+¥' + (data.totalPost / 100).toFixed(2)"/>
      </van-cell-group>
    </div>
    <div class="card_box" style="height: 25px; background: #f2f2f2"></div>
    <van-submit-bar
      v-show="!isIosFocus"
      :price="data.totalPrice"
      button-text="提交订单"
      @submit="sumbitOrder"
    />

    <van-popup v-model="isShowModal" :close-on-click-overlay="false">
      <div class="popup_content">
        <div class="popup_title">付款结果</div>
        <div class="popup_button">
          <a @click="isOverPay(1)">已付款</a>
        </div>
        <div class="popup_button">
          <a @click="payProblem()">付款遇到问题？</a>
        </div>
        <div class="popup_button">
          <a @click="isOverPay(0)">未付款</a>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="isShowProduct" class="product_details" position="bottom">
      <div class="popup_top">
        <span>商品详情</span>
        <i class="iconfont iconguanbi" @click="isShowProduct = false"></i>
      </div>
      <div class="popup_container">
        <div class="popop_item clearfix" v-for="(product, key) in productList" :key="key">
          <div class="item_left">
            <img :src="product.productImg" alt>
          </div>
          <div class="item_right">
            <div class="title">{{product.productTitle}}</div>
            <div class="subtitle">{{product.SpecificationName_}}</div>
            <div class="price">
              <span>¥{{(product.ProductPrice_ / 100).toFixed(2) }}</span>
              <span class="count">x{{product.ProductCount_}}</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import {
  Cell,
  CellGroup,
  Row,
  Col,
  Field,
  SubmitBar,
  Popup,
  Toast,
  Dialog
} from "vant";
import { setInterval } from "timers";

export default {
  name: "submitOrder",
  data() {
    return {
      // 组件数据
      title: "提交订单",
      // 本页数据
      isHasAddress: false,
      name: "",
      tel: "",
      address: "",
      addressInfo: { name: "", mobile: "", baiduaddress: "", address: "" },
      data: {},
      list: [],
      message: "",
      isShowModal: false,
      productCartId: "",
      totalPrice: 0,
      orderId: "",
      payType: "", // 支付方式
      problemCount: 0, // 点击付款遇到问题次数
      timer: "",
      pollNum: 0,
      isShowProduct: false,
      productList: [],
      isIosFocus: false,
      isAndroid: "",
      isiOS: "",
      isFocusHide: false
    };
  },
  components: {
    "v-header": Header
  },
  mounted: function() {
    if (window.localStorage.getItem("payBack")) {
      this.isShowModal = true;
      this.$localStorage.removeItem("payType");
    }

    if (this.$route.query.isPay) {
      this.isShowModal = true;
      // 弹框后默认轮询 判断是否支付成功
      this.timer = window.setInterval(() => {
        this.isOverPay(2);
        this.pollNum++;
        if (this.pollNum >= 15) {
          window.clearInterval(this.timer);
        }
      }, 1000);
    }
    this.data = JSON.parse(window.localStorage.getItem("orderData"));
    this.productCartId = window.localStorage.getItem("productCartId");
    this.data.list.forEach((v, e) => {
      v.productImgList = v.productImgList.split(",");
      if (!v.message) {
        v.message = "";
      }
    });
    this.list = this.data.list;
    this.totalPrice = this.data.totalPrice;

    if (this.$route.query.data) {
      this.isHasAddress = true;
      this.addressInfo = JSON.parse(this.$route.query.data);
      this.addressInfo.mobile = this.addressInfo.mobile.replace(
        /(\d{3})\d*(\d{4})/,
        "$1****$2"
      );
    } else {
      this.getDefaultAddress();
    }

    if (window.localStorage.getItem("orderId")) {
      this.orderId = window.localStorage.getItem("orderId");
    }
    if (window.localStorage.getItem("payType")) {
      this.payType = window.localStorage.getItem("payType");
    }

    let u = navigator.userAgent;
    this.isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  },
  methods: {
    // 获取默认收货地址
    getDefaultAddress() {
      this.$http
        .request({
          method: "get",
          url: "/SUserAddressController/selectDefaultAddress",
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            if (data.data) {
              this.addressInfo = data.data;
              this.isHasAddress = true;
            }
          } else {
            if (data.code == "00006") {
              Dialog.confirm({
                title: "",
                message: "您已退出登录，请重新登录",
                confirmButtonText: "去登录"
              })
                .then(() => {
                  if (!this.scienceWX) {
                    this.$router.push({ name: "login" });
                  } else {
                    this.$routerWX.push({ name: "login" });
                  }
                })
                .catch(() => {});
            } else {
              Toast(data.message);
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 新增收货地址
    goaddAddress() {
      this.data.list.forEach((v, e) => {
        v.productImgList = v.productImgList.join(",");
      });
      window.localStorage.setItem("toAddressList", "submitOrder");
      window.localStorage.setItem("orderData", JSON.stringify(this.data));
      if (!this.scienceWX) {
        this.$router.push({
          path: "../personalCenter/addAddress"
        });
      } else {
        this.$routerWX.push({
          path: "../personalCenter/addAddress"
        });
      }
    },
    // 修改收货地址
    goAddressList() {
      this.data.list.forEach((v, e) => {
        v.productImgList = v.productImgList.join(",");
      });
      window.localStorage.setItem("toAddressList", "submitOrder");
      window.localStorage.setItem("orderData", JSON.stringify(this.data));
      if (!this.scienceWX) {
        this.$router.push({
          path: "../personalCenter/addressList"
        });
      } else {
        this.$routerWX.push({
          path: "../personalCenter/addressList"
        });
      }
    },
    //
    checkProduct(sPharmacyId) {
      this.$http
        .request({
          method: "post",
          url: "/SProductCartController/pharmacyOrderDetail",
          body: {
            productCartId: this.productCartId,
            pharmacyId: sPharmacyId
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.productList = data.data;
            this.isShowProduct = true;
          } else {
            if (data.code == "00006") {
              Dialog.confirm({
                title: "",
                message: "您已退出登录，请重新登录",
                confirmButtonText: "去登录"
              })
                .then(() => {
                  if (!this.scienceWX) {
                    this.$router.push({ name: "login" });
                  } else {
                    this.$routerWX.push({ name: "login" });
                  }
                })
                .catch(() => {});
              // 其他
            } else {
              Toast(data.message);
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 提交订单
    sumbitOrder() {
      if (!this.isHasAddress) {
        Dialog.confirm({
          title: "",
          message: "您尚未填写收货地址请填写收货地址",
          confirmButtonText: "去添加"
        })
          .then(() => {
            this.goaddAddress();
          })
          .catch(() => {});
        return;
      }
      window.localStorage.setItem("addressInfo", this.addressInfo);
      let params = {
        productCartId: this.productCartId,
        addressId: this.addressInfo.id
      };
      this.list.forEach((v, e) => {
        params[v.sPharmacyId] = v.message;
      });

      this.$http
        .request({
          method: "post",
          url: "/SOrderMainController/orderCommit", // 提交订单
          body: params
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            if (data.code == 1) {
              this.$store.commit(
                "Home/shopCardNum",
                res.data.data.sproductcartsnum
              ); // 更新购物车数量
              // 返回订单号
              let orderId = data.data.orderId;
              window.localStorage.setItem("orderId", orderId);
              if (!this.scienceWX) {
                this.$router.push({
                  path: "./payWay",
                  query: { totalPrice: this.totalPrice, orderId: orderId }
                });
              } else {
                this.$routerWX.push({
                  path: "./payWay",
                  query: { totalPrice: this.totalPrice, orderId: orderId }
                });
              }
            } else if (data.code == 0) {
              // 库存不足
              Toast(data.message);
            } else {
              // 有商品不在配送范围
              Toast(data.message);
            }
          } else {
            if (data.code == "00006") {
              Dialog.confirm({
                title: "",
                message: "您已退出登录，请重新登录",
                confirmButtonText: "去登录"
              })
                .then(() => {
                  if (!this.scienceWX) {
                    this.$router.push({ name: "login" });
                  } else {
                    this.$routerWX.push({ name: "login" });
                  }
                })
                .catch(() => {});
              // 其他
            } else {
              Toast(data.message);
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 已付款
    overPay() {
      // 判断是否付款
      if ("已付款") {
        if (!this.scienceWX) {
          this.$router.push({
            path: "./paySuccess",
            query: { totalPrice: this.data.totalPrice }
          });
        } else {
          this.$routerWX.push({
            path: "./paySuccess",
            query: { totalPrice: this.data.totalPrice }
          });
        }
      } else {
        Toast("您尚未付款，请点击未付款若您确认付款则可点击付款遇到问题");
      }
      // 若已付款点击已付款提示您尚未付款，您可以点击付款遇到问题，点击一次进行一次查询，点击第三次则跳转联系客服页。
    },
    // 未付款
    noPay() {
      // 判断是否付款
      if ("已付款") {
        Toast("您已付款，请点击已付款。");
      } else {
        // 待付款订单页
        window.localStorage.setItem("orderActive", 1);
        if (!this.scienceWX) {
          this.$router.push({ path: "../order/myOrder" });
        } else {
          this.$routerWX.push({ path: "../order/myOrder" });
        }
      }
    },
    // 1已付款；0未付款；2默认轮询
    isOverPay(isOverPay) {
      this.$http
        .request({
          method: "get",
          url: "/SAccountFlowController/selectOrderPayResult", // 是否付款
          body: {
            out_trade_no: this.orderId,
            payType: this.payType
          }
        })
        .then(res => {
          let data = res.data;
          // 点击已付款
          if (isOverPay == 1) {
            window.clearInterval(this.timer);
            if (data.code == "1") {
              if (!this.scienceWX) {
                this.$router.push({
                  path: "./paySuccess",
                  query: { totalPrice: this.data.totalPrice }
                });
              } else {
                this.$routerWX.push({
                  path: "./paySuccess",
                  query: { totalPrice: this.data.totalPrice }
                });
              }
            } else if (data.code == "0") {
              Toast(
                "您尚未付款，请点击未付款。若您确认付款则可点击付款遇到问题"
              );
            } else {
              Toast(data.message);
            }
          } else if (isOverPay == 0) {
            window.clearInterval(this.timer);
            // 点击未付款
            if (data.code == "1") {
              Toast("您已付款，请点击已付款。");
            } else if (data.code == "0") {
              // 待付款订单页
              window.localStorage.setItem("orderActive", 1);
              if (!this.scienceWX) {
                this.$router.push({ path: "../order/myOrder" });
              } else {
                this.$routerWX.push({ path: "../order/myOrder" });
              }
            } else {
              Toast(data.message);
            }
          } else if (isOverPay == 2) {
            if (data.code == "1") {
              window.clearInterval(this.timer);
              if (!this.scienceWX) {
                this.$router.push({
                  path: "./paySuccess",
                  query: { totalPrice: this.data.totalPrice }
                });
              } else {
                this.$routerWX.push({
                  path: "./paySuccess",
                  query: { totalPrice: this.data.totalPrice }
                });
              }
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 付款遇到问题
    payProblem() {
      this.$http
        .request({
          method: "post",
          url: "/SOrderMainController/payResultRequest", // 付款遇到问题
          body: {
            out_trade_no: this.orderId,
            payType: this.payType
          }
        })
        .then(res => {
          let data = res.data;
          window.clearInterval(this.timer);
          if (data.code == "1") {
            Toast("您已付款，请点击已付款。");
            this.problemCount++;
          } else if (data.code == "0") {
            Toast("您尚未付款，请点击未付款。");
            this.problemCount++;
          } else {
            Toast(data.message);
          }

          if (this.problemCount === 3) {
            window.location.href = "tel:4000909975";
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    inputFocus(e, key) {
      // this.isFocusHide = true;
      if (this.isiOS) {
        this.isIosFocus = true;
      }
      if (this.isAndroid) {
        var div = document.getElementById("id" + key);
        var height = div.offsetTop;
        setTimeout(function() {
          document.documentElement.scrollTop = height;
          if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = height;
          } else {
            document.body.scrollTop = height;
          }
        }, 300);
      }
    },
    inputBlur() {
      // this.isFocusHide = false;
      if (this.isiOS) {
        this.isIosFocus = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}
.clearfix::after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}
#submitOrder {
  padding-bottom: 12vw;

  .card_box {
    width: 94vw;
    margin: 3vw auto;
    padding: 3vw 3vw 2vw;
    background: @backgroundColorT;
    border-radius: 2.7vw;

    .address_box {
      height: 13.5vw;
      background: url("../../assets/images/icon-address.png") 0 center no-repeat;
      background-size: 4.7vw;
      position: relative;

      .iconfont {
        position: absolute;
        right: 0;
        top: 4.8vw;
      }
      div {
        padding-left: 7.8vw;
      }

      .iconfont {
        float: right;
        .fontSize(13);
      }

      .no_address {
        .fontSize(15);
        color: @subtitleColor;
        line-height: 13.5vw;
      }

      .has_address {
        p {
          .fontSize(15);
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: @titleColor;
          line-height: 6.7vw;
        }
        span {
          .fontSize(13);
          font-family: PingFang-SC-Regular;
          font-weight: 400;
          color: @titleColor;
          line-height: 6.7vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          width: 93%;
        }
      }
    }

    .pharmacy_box {
      .pharmacy_title {
        .fontSize(15);
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: @titleColor;
        margin-bottom: 3.5vw;

        i {
          .fontSize(21);
        }
      }

      .drug_details {
        div {
          float: left;

          img {
            display: block;
            width: 100%;
          }
        }

        div.left {
          div {
            width: 15.5vw;
            margin-right: 2.8vw;
            padding: 3vw 2vw;
          }
        }

        div.right {
          float: right;
          margin-top: 8.3vw;
          .fontSize(12);
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: @titleColor;

          .iconfont {
            vertical-align: middle;
          }
        }
      }
    }

    .van-cell {
      padding: 2.7vw 0;
      &:not(:last-child)::after {
        left: 0;
      }

      &:last-child {
        padding-bottom: 0;
        .van-cell__title {
          // display: contents;
          flex: none;
        }
      }

      .van-cell__title,
      .van-cell__value {
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
      }
    }

    .van-field {
      padding: 0;
      width: 80%;
      float: right;
    }

    .van-hairline--top-bottom::after {
      border-bottom: none;
    }

    &:last-child {
      padding-top: 0;

      .van-cell:last-child {
        .van-cell__value {
          color: @orderPriceColor;
        }
      }
    }
  }

  .money_box {
    padding-top: 0;

    .van-cell:last-child {
      .van-cell__value {
        color: @orderPriceColor;
      }
    }
  }
}

// 结算
.van-submit-bar {
  .van-submit-bar__bar {
    height: 50px;
  }

  .van-checkbox {
    padding-left: 6vw;

    .van-checkbox__label {
      color: @subtitleColor;
      margin-left: 2vw;
    }
  }

  .van-submit-bar__text {
    text-align: left;
    padding-left: 3.2vw;
    color: @orderPriceColor;

    .van-submit-bar__price {
      .fontSize(18);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
    }

    .save_money {
      .fontSize(12);
      color: @titleColor;
    }
  }

  .van-button {
    width: 33vw;
    background: @mainColor;
    border: none;

    .van-button__text {
      color: @submitOrderColor;
    }
  }
}

// 弹出层
.van-popup {
  border-radius: 2.7vw;
  overflow: hidden;
}
.popup_content {
  width: 58.9vw;
  height: 61.6vw;
  text-align: center;

  .popup_title {
    height: 16.1vw;
    line-height: 16.1vw;
    margin-bottom: 4.1vw;
    .fontSize(16);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: @titleColor;
    background: url("../../assets/images/submitOrderModal.png") center center
      no-repeat;
    background-size: 58.9vw;
  }
  .popup_button {
    width: 51.6vw;
    height: 9.3vw;
    margin: 0 auto 3.3vw;
    border: 1px solid @borderColor;
    border-radius: 2.7vw;

    a {
      .fontSize(15);
      line-height: 9.3vw;
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;
    }
  }
}
.product_details.van-popup {
  border-radius: 0;
  max-height: 78%;
  overflow: scroll;

  .popup_top {
    padding: 5vw 3.2vw 6.9vw;
    .fontSize(16);
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: @titleColor;

    .iconfont {
      float: right;
      .fontSize(16);
      margin-top: 0.8vw;
    }
  }

  .popup_container {
    .popop_item {
      margin-bottom: 4vw;
      padding: 0 3.2vw;

      .item_left {
        float: left;
        width: 23vw;
        height: 23vw;
        // background: @backgroundColor;
        border-radius: 2.7vw;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
        }
      }

      .item_right {
        float: right;
        width: 67vw;
        height: 23vw;
        position: relative;

        .price {
          position: absolute;
          bottom: 0;
          .fontSize(16);
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: @redColor;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .count {
            .fontSize(14);
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: @subtitleColor;
          }
        }

        .title {
          .fontSize(16);
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: @titleColor;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .subtitle {
          .fontSize(14);
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: @descriptionColor;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
