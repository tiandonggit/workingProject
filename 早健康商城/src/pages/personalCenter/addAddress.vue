/*
 * @Author: 田东 
 * @Date: 2019-05-14 16:25:22 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-07-25 17:29:37
 * @name 新增地址
 */

<template>
  <div id="addAddress">
    <!-- 头部 -->
    <div class="header">
      <!--左侧区域-->
      <div class="header-div header-left" @click="back()">
        <i class="iconfont iconleft"></i>
      </div>
      <!--文字区域-->
      <div class="header-div header-center">{{ title }}</div>
      <div class="header-right"></div>
    </div>
    <div class="header-bottom"></div>
    <!-- 内容区 -->
    <div class="content_input">
      <van-cell-group>
        <van-field v-model="name" type="text" label="联系人" placeholder="姓名"/>
        <van-field
          v-model="mobile"
          maxlength="11"
          type="text"
          label="联系电话"
          placeholder="请填写正确的联系电话"
        />
        <div class="item_address" @click="selectAddress()">
          <van-field
            v-model="baiduaddress"
            right-icon="arrow"
            type="text"
            label="所在地址"
            readonly
            placeholder="请选择收货地址"
          />
        </div>

        <van-field v-model="address" maxlength="40" type="text" label="详细地址" placeholder="请填写详细地址"/>
        <div class="is_default_cell van-cell">
          <p class="van-field__label">设为默认</p>
          <a class="default" @click="isdefaultFun()" :class="{select: isdefault == 1}">默认</a>
        </div>
      </van-cell-group>
    </div>
    <!-- 提交按钮 -->
    <v-button :buttonText="buttonText" :style="buttonClass" @callFather="sonFun()"></v-button>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import NextButton from "@/components/button/NextButton";

import { Cell, CellGroup, Button, Toast, Dialog } from "vant";
import { setTimeout } from "timers";

export default {
  name: "addAddress",
  data() {
    return {
      // 组件数据
      title: "新增地址",
      buttonText: "保存",
      buttonClass: { "margin-top": "15.6vw" },
      // 本页数据
      params: {},
      name: "",
      mobile: "",
      // addressCity: "",
      // addressNumber: "",
      address: "",
      citycode: "",
      baiduaddress: "",
      baidulocationx: "",
      baidulocationy: "",
      id: "",
      isdefault: 0,
      oldData: {}
    };
  },
  components: {
    "v-header": Header,
    "v-button": NextButton
  },
  created: function() {
    let query = this.$route.query;
    let addAddressInfo = window.localStorage.getItem("addAddressInfo");
    if (addAddressInfo) {
      this.params = JSON.parse(addAddressInfo);
    }
    if (window.localStorage.getItem("oldAddAddressInfo")) {
      this.oldData = JSON.parse(window.localStorage.getItem("oldAddAddressInfo"));
    }
    if (query.title) {
      this.title = query.title;
    }
    if (
      this.params.name ||
      this.params.mobile ||
      this.params.address ||
      this.params.baiduaddress ||
      this.params.isdefault ||
      this.params.id
    ) {
      this.name = this.params.name;
      this.mobile = this.params.mobile;
      this.address = this.params.address;
      this.citycode = this.params.citycode;
      this.baiduaddress = this.params.baiduaddress;
      this.baidulocationx = this.params.baidulocationx;
      this.baidulocationy = this.params.baidulocationy;
      this.isdefault = this.params.isdefault;
      this.id = this.params.id;
    }
  },
  watch: {
    mobile(newValue, oldValue) {
      if (!this.Testnum(newValue)) {
        this.mobile = this.mobile.replace(/[^0-9]/g, "");
      }
    }
  },
  methods: {
    // 选择定位地址
    selectAddress() {
      this.params = {
        name: this.name,
        mobile: this.mobile,
        address: this.address,
        citycode: this.citycode,
        baiduaddress: this.baiduaddress,
        baidulocationx: this.baidulocationx,
        baidulocationy: this.baidulocationy,
        isdefault: this.isdefault,
        id: this.id
      };
      window.localStorage.setItem(
        "addAddressInfo",
        JSON.stringify(this.params)
      );
      if (!this.scienceWX) {
        this.$router.push({
          path: "./confirmAddress",
          query: { params: JSON.stringify(this.params) }
        });
      } else {
        this.$routerWX.push({
          path: "./confirmAddress",
          query: { params: JSON.stringify(this.params) }
        });
      }
    },
    isdefaultFun() {
      if (this.isdefault == 0) {
        this.isdefault = 1;
      } else {
        this.isdefault = 0;
      }
    },
    sonFun() {
      this.save();
    },
    save() {
      if (!this.name) {
        Toast("请输入收货人姓名");
        return;
      }
      if (!this.mobile) {
        Toast("请输入收货人联系电话");
        return;
      }
      if (!/^[1]\d{10}$/.test(this.mobile)) {
        Toast("请输入正确的联系电话");
        return;
      }
      if (!this.baiduaddress) {
        Toast("请您选择您的所在地址");
        return;
      }
      if (!this.address) {
        Toast("请输入您的具体地址");
        return;
      }
      // this.address = this.baiduaddress + " " + this.addressNumber;

      this.$http
        .request({
          method: "post",
          url: "/SUserAddressController/insertOrUpdateSUserAddress",
          body: {
            name: this.name,
            mobile: this.mobile,
            address: this.address,
            citycode: this.citycode,
            baiduaddress: this.baiduaddress,
            baidulocationx: this.baidulocationx,
            baidulocationy: this.baidulocationy,
            isdefault: this.isdefault,
            id: this.id
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            Toast("新增或修改地址成功");
            this.$localStorage.removeItem("addAddressInfo");
            this.$localStorage.removeItem("oldAddAddressInfo");
            setTimeout(() => {
              if (!this.scienceWX) {
                this.$router.back({ path: "./addressList" });
              } else {
                this.$routerWX.back({ path: "./addressList" });
              }
            }, 1000);
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    back() {
      if (
        !this.name &&
        !this.mobile &&
        !this.baiduaddress &&
        !this.address &&
        this.isdefault == 0
      ) {
        this.backTurn();
      } else if (
        this.oldData.name == this.name &&
        this.oldData.mobile == this.mobile &&
        this.oldData.baiduaddress == this.baiduaddress &&
        this.oldData.address == this.address &&
        this.oldData.isdefault == this.isdefault
      ) {
        this.backTurn();
      } else {
        Dialog.confirm({
          title: "",
          message: "您尚未保存地址，是否直接返回"
        })
          .then(() => {
            this.backTurn();
          })
          .catch(() => {});
      }
    },
    backTurn() {
      this.$localStorage.removeItem("addAddressInfo");
      this.$localStorage.removeItem("oldAddAddressInfo");
      if (!this.scienceWX) {
        this.$router.back({ name: "addressList" });
      } else {
        this.$routerWX.back({ name: "addressList" });
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

#addAddress {
  .header-bottom {
    width: 100%;
    height: 14vw;
  }
  .header {
    width: 100%;
    height: 14vw;
    padding: 0 3%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    text-align: center;
    color: @titleColor;
    background: @backgroundColorT;
  }
  .header-div {
    width: auto;
  }
  .header-left {
    float: left;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: bold;
    text-align: left;
  }
  .header-center {
    font-weight: bold;
    white-space: nowrap;
  }
  .header-right {
    width: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .content_input {
    .van-cell input:disabled {
      color: @titleColor;
    }

    .item_address {
      position: relative;

      &::after {
        content: " ";
        position: absolute;
        pointer-events: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        left: 15px;
        right: 0;
        bottom: 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        border-bottom: 1px solid #ebedf0;
      }
    }

    .is_default_cell {
      p {
        // padding-right: 34px;
        width: 90px;
      }

      .default {
        .fontSize(13);
        width: 11.2vw;
        display: inline-block;
        text-align: center;
        border-radius: 1.1vw;
        color: @titleColor;
        border: 1px solid @titleColor;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        height: 5.1vw;
        line-height: 4.9vw;
        margin-top: 2px;
      }

      .select {
        background: linear-gradient(
          to right,
          @btnLeftColor 0%,
          @mainColor 100%
        );
        color: @fontOne;
        border: none;
        line-height: 5.2vw;
      }
    }
  }
}
</style>
