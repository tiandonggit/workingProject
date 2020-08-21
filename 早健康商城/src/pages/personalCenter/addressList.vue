/*
 * @Author: 田东 
 * @Date: 2019-05-14 14:42:19 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-14 10:26:40
 * @name 地址列表
 */

<template>
  <div id="addressList">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <div v-if="list.length > 0">
      <div class="card_box" v-for="(data, key) in list" :key="key">
        <van-swipe-cell :right-width="72">
          <div class="info" @click="selectAddress(data)">
            <span class="name">{{data.name}}</span>
            <span v-if="data.isdefault" class="default">默认</span>
            <span class="phone">{{data.mobile}}</span>
          </div>
          <p class="address" @click="selectAddress(data)">{{data.baiduaddress}} {{data.address}}</p>
          <span class="swipe_right" slot="right">
            <div @click="edit(data)">
              <i class="iconfont iconbianji"></i>
            </div>
            <div @click="remove(data.id)">
              <i class="iconfont iconshanchu"></i>
            </div>
          </span>
        </van-swipe-cell>
      </div>
    </div>
    <div v-if="list.length == 0">
      <div class="no_address">
        <img src="../../assets/images/noAddress.png" alt />
        <p>您还没有设置位置</p>
      </div>
    </div>
    <!-- 提交按钮 -->
    <v-button :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";

import { SwipeCell, Toast, Dialog } from "vant";

export default {
  name: "addressList",
  data() {
    return {
      // 组件数据
      title: "收货地址",
      buttonText: "新增地址",
      buttonClass: { "margin-top": "8.4vw" },
      // 本页数据
      isDefault: true,
      list: [],
      isFromPersonal: false
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  mounted: function() {
    if (window.localStorage.getItem("toAddressList")) {
      this.toAddressList = window.localStorage.getItem("toAddressList");
    }
    this.getAddress();
  },
  methods: {
    sonFun() {
      this.addAddress();
    },
    // 获取地址列表
    getAddress() {
      this.$http
        .request({
          method: "get",
          url: "/SUserAddressController/selectUserAddresses",
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.list = data.data;
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 选择地址
    selectAddress(data) {
      if (this.toAddressList == "submitOrder") {
        window.localStorage.setItem("addressInfo", JSON.stringify(data));
        if (!this.scienceWX) {
          this.$router.push({
            path: "../order/submitOrder",
            query: { data: JSON.stringify(data) }
          });
        } else {
          this.$routerWX.push({
            path: "../order/submitOrder",
            query: { data: JSON.stringify(data) }
          });
        }
      }
    },
    // 修改地址
    edit(data) {
      window.localStorage.setItem("addAddressInfo", JSON.stringify(data));
      window.localStorage.setItem("oldAddAddressInfo", JSON.stringify(data));
      if (!this.scienceWX) {
        this.$router.push({
          path: "./addAddress",
          query: { title: "修改地址" }
        });
      } else {
        this.$routerWX.push({
          path: "./addAddress",
          query: { title: "修改地址" }
        });
      }
    },
    // 删除地址
    remove(id) {
      console.log(id);
      Dialog.confirm({
        title: "",
        message: "确认删除该地址吗？",
        confirmButtonText: "删除"
      })
        .then(() => {
          // on confirm
          this.$http
            .request({
              method: "post",
              url: "/SUserAddressController/deleteSUserAddress",
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
        .catch(() => {
          // on cancel
        });
    },
    // 新增地址
    addAddress() {
      this.$localStorage.removeItem("addAddressInfo");
      if (!this.scienceWX) {
        this.$router.push({ path: "./addAddress" });
      } else {
        this.$routerWX.push({ path: "./addAddress" });
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

#addressList {
  height: 100%;
  // background: @backgroundColorT;

  .card_box {
    // height: 21.5vw;
    border-radius: 2.7vw;
    overflow: hidden;
    width: 93.7vw;
    margin: 3.3vw auto 0;
    // padding: 3.4vw 4.5vw 3vw;
    background: @backgroundColorT;

    .van-swipe-cell {
      .swipe_right {
        display: inline-block;
        height: 100%;

        div {
          width: 36px;
          height: 100%;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;

          .iconfont {
            color: @fontOne;
            .fontSize(16);
          }
        }
      }
    }

    .info {
      background: @backgroundColorT;
      padding: 2vw 4.5vw 0 4.5vw;
      .name {
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: bold;
        color: @titleColor;
      }

      .default {
        .fontSize(12);
        width: 8.5vw;
        margin-left: 2.9vw;
        display: inline-block;
        text-align: center;
        border-radius: 1.1vw;
        background: linear-gradient(
          to right,
          @btnLeftColor 0%,
          @mainColor 100%
        );
        color: @fontOne;
      }

      .phone {
        .fontSize(15);
        float: right;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
      }
    }

    .address {
      padding: 1.5vw 4.5vw 1vw 4.5vw;
      background: @backgroundColorT;
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 5.9vw;
      word-wrap: break-word;
    }
  }

  .no_address {
    img {
      display: block;
      width: 61.3vw;
      margin: 15.7vw auto 6vw;
    }

    p {
      text-align: center;
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @defaultPhoneColor;
    }
  }
}
</style>
