/*
 * @Author: 田东 
 * @Date: 2019-05-10 10:24:02 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-24 17:40:22
 * @name 我的订单
 */

<template>
  <div id="myOrder">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-tabs
        v-model="active"
        :swipeable="swipeable"
        title-active-color="#000"
        color="#E98C2E"
        fontSize="12px"
        @change="changeTabs()"
      >
        <van-tab v-for="(tab, key) in tabs" :key="key" :title="tab">
          <!-- 内容区 -->
          <div class="card_box" v-for="(data, key) in list" :key="key">
            <div class="pharmacy_title">
              <i class="iconfont icondianpu header-leftFont"></i>
              {{data.spharmacyname}}
              <span>{{data.subTypeMsg}}</span>
            </div>
            <div
              v-if="data.type == '1'"
              @click="orderDetails(data.subType, data.subTypeMsg, data.id, data.spharmacyid)"
              class="drug_introduction clearfix"
            >
              <div class="left_img">
                <img :src="data.productimg" alt>
              </div>
              <div class="right_info clearfix">
                <span class="right_desc">{{data.producttitle}}</span>
                <p v-if="data.subType == 6 || data.subType == 0">
                  共{{data.producttotal}}种商品 待付款：
                  <span>￥{{(data.sumprice / 100).toFixed(2)}}</span>
                </p>
                <p v-else>
                  共{{data.producttotal}}种商品 实付款：
                  <span>￥{{(data.sumprice / 100).toFixed(2)}}</span>
                </p>
              </div>
            </div>
            <div
              v-if="data.type == '0'"
              @click="orderDetails(data.subType, data.subTypeMsg, data.id, data.spharmacyid)"
              class="drug_list clearfix"
            >
              <div class="img_content clearfix">
                <ul>
                  <li class="cells" v-for="(url, key) in data.imgList" :key="key">
                    <img :src="url" alt>
                  </li>
                </ul>
              </div>
              <div class="right_info clearfix">
                <p v-if="data.subType == 6 || data.subType == 0">
                  共{{data.producttotal}}种商品 待付款：
                  <span>￥{{(data.sumprice / 100).toFixed(2)}}</span>
                </p>
                <p v-else>
                  共{{data.producttotal}}种商品 实付款：
                  <span>￥{{(data.sumprice / 100).toFixed(2)}}</span>
                </p>
              </div>
            </div>
            <div class="btn_group">
              <span
                v-if="data.subType == 0"
                class="btn_defult"
                @click="cancelOrder(data.subType, data.id)"
              >
                <a>取消订单</a>
              </span>
              <span v-if="data.subType == 2" class="btn_defult" @click="logisticsInfo(data.id)">
                <a>查看物流</a>
              </span>
              <span
                v-if="data.subType == 2 && data.taketype == 0"
                class="btn_defult"
                @click="delayReceiving(data.id)"
              >
                <a>延迟收货</a>
              </span>
              <span
                v-if="data.subType == 3 || data.subType == 4 || data.subType == 6"
                class="btn_defult"
                @click="deleteOrder(data.id)"
              >
                <a>删除订单</a>
              </span>
              <span v-if="data.subType == 2" class="btn_color" @click="confirmReceipt(data.id)">
                <a>确认收货</a>
              </span>
              <span
                v-if="data.subType == 3 || data.subType == 4 || data.subType == 6"
                class="btn_color"
                @click="buyOnce(data.id)"
              >
                <a>再次购买</a>
              </span>
              <span
                v-if="data.subType == 0"
                class="btn_color"
                @click="goPay(data.id, data.sumprice)"
              >
                <a>去付款</a>
              </span>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-list>
    <!-- 是否删除弹出层 -->
    <van-popup v-model="isShowDeletePopup">
      <div class="popup_content">
        <p class="popup_title">确认删除该订单吗？</p>
        <p class="popup_hint">删除后该订单无法恢复，确认删除吗？</p>
        <div class="btn-box">
          <a class="btn_cancel" @click="isShowDeletePopup = false">取消</a>
          <a class="btn_delete" @click="deleteBtn()">删除</a>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import { Tab, Tabs, Popup, Toast, Dialog, List } from "vant";
import { setTimeout } from "timers";

export default {
  name: "myOrder",
  data() {
    return {
      // 组件数据
      title: "我的订单",
      // 本页数据
      active: 0,
      page: 1, // 查询第几页
      limit: 10, // 每页数据个数
      loading: false,
      finished: true, // 上拉加载是否结束
      tabs: ["全部", "待付款", "待发货", "待收货"],
      list: [],
      isShowDeletePopup: false,
      deleteId: "",
      canChangeTabs: true,
      swipeable: false // 禁止tab滑动切换
    };
  },
  components: {
    "v-header": Header
  },
  mounted: function() {
    this.active = window.localStorage.getItem("orderActive")
      ? window.localStorage.getItem("orderActive")
      : 0;
    this.getOrderList();
  },
  methods: {
    // 获取我的订单
    getOrderList() {
      this.$http
        .request({
          method: "get",
          url: "/SOrderSubController/selectUserOrders",
          body: { page: this.page, limit: this.limit, subtype: this.active }
        })
        .then(res => {
          this.canChangeTabs = true;
          let data = res.data;
          if (data.success) {
            data.data.forEach((v, e) => {
              this.list.push(v);
            });
            this.page++;
            if (data.data.length == this.limit) {
              this.finished = false;
            } else {
              this.finished = true;
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 上拉加载
    onLoad() {
      // 异步更新数据
      window.setTimeout(() => {
        this.getOrderList();
        // 加载状态结束
        this.loading = false;
        // this.getOrderList();
      }, 500);
    },
    // 切换tab标签
    changeTabs() {
      this.page = 1;
      this.list = [];
      window.localStorage.setItem("orderActive", this.active);
      if (!this.canChangeTabs) return;
      this.canChangeTabs = false;
      this.getOrderList();
    },
    // 订单详情
    orderDetails(subType, subTypeMsg, id, spharmacyid) {
      let params = {
        subType: subType,
        subTypeMsg: subTypeMsg,
        id: id,
        spharmacyid: spharmacyid
      };
      if (!this.scienceWX) {
        this.$router.push({
          path: "../order/orderDetails",
          query: { params: JSON.stringify(params) }
        });
      } else {
        this.$routerWX.push({
          path: "../order/orderDetails",
          query: { params: JSON.stringify(params) }
        });
      }
    },
    // 删除订单
    // deleteOrder(id) {
    //   this.deleteId = id;
    //   this.isShowDeletePopup = true;
    // },
    // 删除订单——确定删除
    deleteOrder(id) {
      // this.isShowDeletePopup = false;

      Dialog.confirm({
        title: "确认删除该订单吗？",
        message: "删除后该订单无法恢复，确认删除吗？"
      })
        .then(() => {
          this.$http
            .request({
              method: "post",
              url: "/SOrderSubController/delOrder",
              body: {
                id: id
              }
            })
            .then(res => {
              let data = res.data;
              if (data.success) {
                Toast("删除成功");
                this.list.forEach((v, e) => {
                  if (v.id == id) {
                    this.list.splice(e, 1);
                  }
                });
              } else {
                Toast(data.message);
              }
            })
            .catch(error => {
              console.log("错误为" + error);
            });
        })
        .catch(() => {});
    },
    // 确认收货
    confirmReceipt(id) {
      Dialog.confirm({
        title: "",
        message: "是否确认收货"
      })
        .then(() => {
          this.$http
            .request({
              method: "post",
              url: "/SOrderSubController/confirmReceipt", // 确认收货
              body: {
                id: id
              }
            })
            .then(res => {
              let data = res.data;
              if (data.success) {
                // 输入密码成功后跳转
                if (!this.scienceWX) {
                  this.$router.push({ path: "./receipt" });
                } else {
                  this.$routerWX.push({ path: "./receipt" });
                }
              } else {
                Toast(data.message);
              }
            })
            .catch(error => {
              console.log("错误为" + error);
            });
        })
        .catch(() => {});
    },
    // 延迟收货
    delayReceiving(id) {
      Dialog.confirm({
        title: "",
        message:
          "每个订单只可进行一次延迟收货，延长收货时间为3天，确定延迟收货吗？"
      })
        .then(() => {
          this.$http
            .request({
              method: "post",
              url: "/SOrderSubController/delayReceiving",
              body: {
                id: id
              }
            })
            .then(res => {
              let data = res.data;
              if (data.success) {
                Toast("延迟收货成功");
                this.list.forEach((v, e) => {
                  if (v.id == id) {
                    v.taketype = 2;
                  }
                });
              } else {
                Toast(data.message);
              }
            })
            .catch(error => {
              console.log("错误为" + error);
            });
        })
        .catch(() => {});
    },
    // 取消订单
    cancelOrder(subType, id) {
      let msg = "";
      subType == 0 && (msg = "您确定取消订单吗？");
      subType == 1 && (msg = "您若取消订单需等待卖家同意，您确认取消订单吗？");

      Dialog.confirm({
        title: "",
        message: msg
      })
        .then(() => {
          this.$http
            .request({
              method: "post",
              url: "/SOrderSubController/cancelOrder",
              body: {
                id: id
              }
            })
            .then(res => {
              let data = res.data;
              if (data.success) {
                if (subType == 0) {
                  if (data.data.returnStatus == 0) {
                    Toast("正在为您取消订单，请稍后");
                    setTimeout(() => {
                      this.changeTabs()
                    }, 1000);
                  } else {
                    Toast(data.data.msg);
                    this.changeTabs();
                  }
                } else if (subType == 1) {
                  if (data.data.returnStatus == 0) {
                    Toast("等待卖家同意，请稍后");
                    this.list.forEach((v, e) => {
                      if (v.id == id) {
                        this.list.subType = 5;
                      }
                    });
                  } else {
                    Toast(data.data.msg);
                    this.changeTabs();
                  }
                }
              } else {
                Toast(data.message);
              }
            })
            .catch(error => {
              console.log("错误为" + error);
            });
        })
        .catch(() => {});
    },
    // 再次购买
    buyOnce(id) {
      this.$http
        .request({
          method: "post",
          url: "/SOrderSubController/repurchase",
          body: {
            id: id
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.$store.commit(
              "Home/shopCardNum",
              res.data.data.sproductcartsnum
            ); // 更新购物车数量
            Toast("添加到购物车");
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 查看物流
    logisticsInfo(id) {
      Toast("暂未开放");
    },
    // 去支付
    goPay(id, totalPrice) {
      if (!this.scienceWX) {
        this.$router.push({
          path: "./payWay",
          query: { totalPrice: totalPrice, orderId: id }
        });
      } else {
        this.$routerWX.push({
          path: "./payWay",
          query: { totalPrice: totalPrice, orderId: id }
        });
      }
    },
    submit() {
      console.log("点击");
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

#myOrder {
  padding-bottom: 12vw;

  .van-tabs__wrap.van-hairline--top-bottom {
    position: fixed;
    top: 14vw;
  }

  .card_box {
    width: 100vw;
    margin-bottom: 3.2vw;
    padding: 3.2vw;
    background: @backgroundColorT;

    .pharmacy_title {
      .fontSize(15);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: @titleColor;
      margin-bottom: 4.6vw;

      i {
        .fontSize(21);
      }

      span {
        float: right;
        .fontSize(12);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @orderStatusColor;
        margin-top: 0.6vw;
      }
    }

    .drug_introduction,
    .drug_list {
      .left_img {
        float: left;
        border-radius: 2.7vw;
        overflow: hidden;

        img {
          width: 24vw;
          display: block;
        }
      }
      .right_info {
        width: 66.2vw;
        float: right;
        .fontSize(14);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;

        .right_desc {
          line-height: 4.8vw;
          height: 14.4vw;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        p {
          text-align: right;
          .fontSize(12);
          font-family: PingFang-SC-Regular;
          font-weight: 400;
          margin-top: 6.5vw;
          line-height: 3.3vw;

          span {
            .fontSize(15);
          }
        }
      }

      .img_content {
        ul {
          width: auto;
          overflow-x: auto;
          white-space: nowrap;

          li {
            width: 24vw;
            border-radius: 2.7vw;
            overflow: hidden;
            margin-right: 1.3vw;
            display: inline-block;

            img {
              width: 100%;
              display: block;
            }
          }
        }
      }
    }

    .drug_list {
      .right_info {
        p {
          margin-top: 3.5vw;
        }
      }
    }

    .btn_group {
      text-align: right;
      margin: 6.1vw 0 1.2vw;

      span {
        .fontSize(12);
        padding: 0.7% 0;
        font-family: PingFang-SC-Regular;
        font-weight: bold;
        border: 0.5px solid @titleColor;
        border-radius: 1.3vw;
        margin-left: 2vw;
        width: 18.1vw;
        display: inline-block;
        text-align: center;

        a {
          color: @subtitleColor;
        }
      }
      .btn_color {
        border-color: @mainColor;

        a {
          color: @mainColor;
        }
      }
    }
  }
}

// 弹出层
.van-popup {
  border-radius: 2.7vw;
  overflow: hidden;
}
.popup_content {
  width: 75.5vw;
  // height: 36.3vw;
  text-align: center;

  .popup_title {
    .fontSize(16);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: @titleColor;
    margin-top: 6.4vw;
  }

  .popup_hint {
    .fontSize(15);
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    margin: 5.2vw 0 6.3vw;
    color: @titleColor;
  }
  .btn-box {
    height: 10.3vw;
    border-top: 1px solid @borderColor;

    a {
      height: 10.3vw;
      width: 50%;
      line-height: 10.3;
      display: inline-block;
      text-align: center;
      .fontSize(16);
      line-height: 9.3vw;
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;
    }

    .btn_delete {
      background: linear-gradient(to right, @btnLeftColor 0%, @mainColor 100%);
      color: @backgroundColorT;
    }
  }
}
</style>
