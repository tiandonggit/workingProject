/*
 * @Author: 田东 
 * @Date: 2019-05-17 09:17:20 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-07-25 17:15:10
 * @name 确认收货地址（定位）
 */

<template>
  <div id="confirmAddress">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <div class="content_block">
      <div class="search_box clearfix">
        <div class="search_left">
          <span @click="selectCity()">{{cityShow}}</span>
          <i class="iconfont iconqianjin"></i>
          <i class="iconfont iconfengexianICON"></i>
          <i class="iconfont iconsousuo"></i>
          <input type="text" v-model="searchText" @change="searchAddress()" placeholder="搜索小区/写字楼等">
        </div>
        <div class="search_btn" @click="onSearch">搜索</div>
      </div>
      <div v-if="searchResultList.length > 0" class="search_result">
        <div
          class="item clearfix"
          v-for="(searchResult, key) in searchResultList"
          :key="key"
          @click="selectAddress(searchResult)"
        >
          <div class="item_left" :class="{first_result : key == 0}">
            <i class="iconfont icondingwei"></i>
          </div>
          <div class="item_right">
            <p>{{searchResult.name}}</p>
            <span>{{searchResult.address}}</span>
          </div>
        </div>
      </div>
      <div v-if="isNoSearchResult">
        <div class="no_result">
          <img src="../../assets/images/noAddress.png" alt>
          <p>未找到该地址</p>
          <p>请检查地址是否正确</p>
        </div>
      </div>
      <div class="search_history" v-if="historyList.length > 0 && isShowHistory">
        <div class="top">
          历史搜索
          <i class="iconfont iconshanchu" @click="clearHistory()"></i>
        </div>
        <div class="text">
          <a
            v-for="(history, key) in historyAddress"
            :key="key"
            @click="selectAddress(history.searchResult)"
          >{{history.searchResult.name}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import { Search, Toast, Dialog } from "vant";

export default {
  name: "confirmAddress",
  data() {
    return {
      // 组件数据
      title: "确认收货地址",
      buttonText: "保存",
      buttonClass: { "margin-top": "15.6vw" },
      // 本页数据
      params: {},
      city: "沈阳市",
      cityShow: "", // 城市名称超长 剪裁后显示的内容
      searchText: "",
      baiduaddress: "",
      baidulocationx: "",
      baidulocationy: "",
      historyList: [],
      historyAddress: [],
      isNoSearchResult: false,
      isShowHistory: true,
      searchResultList: []
    };
  },
  components: {
    "v-header": Header
  },
  mounted: function() {
    this.params = JSON.parse(window.localStorage.getItem("addAddressInfo"));
    // console.dir(this.params);
  },
  computed: {
    //历史
    history() {
      return this.$store.state.Address.historyAddress;
    }
  },
  created() {
    this.historyAddress = this.history;
    this.historyAddress.forEach((v, e) => {
      this.historyList.push(v.searchResult.name);
    });
    this.IPcoor();
  },
  methods: {
    // ip定位
    IPcoor() {
      if (this.$store.state.Home.address) {
        if (this.$store.state.Home.address.city.length > 3) {
          this.city =
            this.$store.state.Home.address.city.substring(0, 3) + "...";
        } else {
          this.city = this.$store.state.Home.address.city;
        }
      } else {
        this.$jsonp("http://api.map.baidu.com/location/ip", {
          ak: "hmVqEY5D33xZBKMOosca0XSXlV9uHAlt"
        })
          .then(response => {
            if (response.status != 0) {
              Toast("定位失败");
              return;
            }
            console.log(response);
            // console.log(response.content.address_detail);
            if (response.content.address_detail.city.length > 6) {
              this.city =
                response.content.address_detail.city.substring(0, 6) + "...";
            } else {
              this.city = response.content.address_detail.city;
            }
            this.city = response.content.address_detail.city;
            this.$store.commit("Home/address", response.content);
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.cityShow =
        this.city.length > 3 ? this.city.substring(0, 3) + "..." : this.city;
    },
    // 城市选择
    selectCity() {
      if (!this.scienceWX) {
        this.$router.push({
          path: "../SearchCity",
          query: { source: "address" }
        });
      } else {
        this.$routerWX.push({
          path: "../SearchCity",
          query: { source: "address" }
        });
      }
    },
    // 搜索框搜索
    searchAddress() {
      this.searchResultList = [];
      if (!this.searchText) {
        this.isNoSearchResult = false;
        this.isShowHistory = true;
        return;
      }
      if (this.searchText) {
        this.isNoSearchResult = false;
      }
      this.$jsonp("http://api.map.baidu.com/place/v2/search", {
        query: this.searchText,
        region: this.city,
        city_limit: true,
        output: "json",
        page_size: 20,
        ak: "hmVqEY5D33xZBKMOosca0XSXlV9uHAlt"
      })
        .then(response => {
          if (response.status != 0) {
            Toast("获取地址失败");
            this.isShowHistory = true;
            this.searchResultList = [];
            return;
          }
          console.log(response);
          // this.searchResultList = response.results;
          response.results.forEach((v, e) => {
            v.citycode = this.$store.state.Home.address.city_code;
            v.address = v.address ? v.address : "";
            v.area = v.area ? v.area : "";
            v.province = v.province ? v.province : "";
            v.city = v.city ? v.city : this.city;
            this.searchResultList.push(v);
          });
          if (this.searchResultList.length > 10) {
            this.searchResultList = this.searchResultList.slice(0, 10);
          }
          if (this.searchResultList.length == 0) {
            this.isNoSearchResult = true;
          }
          this.isShowHistory = false;
          // console.log(this.searchResultList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //设定历史搜索记录
    setHistory(searchResult, code) {
      this.$store.commit("Address/historyAddress", {
        searchResult: searchResult,
        address_code: searchResult.uid
      });
    },
    // 选择地址
    selectAddress(searchResult) {
      this.params.baiduaddress =
        searchResult.province + " " + searchResult.city + " " + searchResult.area + " " + searchResult.name;
      this.params.citycode = searchResult.citycode;
      this.params.baidulocationx = searchResult.location.lat;
      this.params.baidulocationy = searchResult.location.lng;
      this.setHistory(searchResult);
      window.localStorage.setItem(
        "addAddressInfo",
        JSON.stringify(this.params)
      );

      if (!this.scienceWX) {
        this.$router.back({
          path: "./addAddress"
        });
      } else {
        this.$routerWX.back({
          path: "./addAddress"
        });
      }
    },
    // 清楚搜索历史
    clearHistory() {
      Dialog.confirm({
        title: "",
        message: "确认删除全部历史记录吗？",
        confirmButtonText: "确认"
      })
        .then(() => {
          this.$store.commit("Address/delHistoryAddress");
          this.historyAddress = [];
          this.historyList = [];
        })
        .catch(() => {});
    },
    onSearch() {}
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

#confirmAddress {
  height: 100%;
  background: @backgroundColorT;

  .content_block {
    background: @backgroundColorT;

    .search_box {
      padding: 0 3.2vw 3.2vw;
      height: 11.2vw;
      position: fixed;
      top: 14vw;
      background: @backgroundColorT;
      width: 100%;

      .search_left {
        float: left;
        height: 100%;
        padding: 0 0 0 3.2vw;
        background: @backgroundColor;
        border-radius: 2.7vw;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        .iconfont {
          .fontSize(16);
        }

        .iconfengexianICON {
          margin-right: 1.1vw;
        }

        input {
          border: none;
          .fontSize(15);
          background: @backgroundColor;
          padding: 0 1.2vw;
          width: 45vw;
        }
      }

      .search_btn {
        float: right;
        background: @mainColor;
        border-radius: 2.6vw;
        color: @fontOne;
        width: 14.5vw;
        text-align: center;
        line-height: 8vw;
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: bold;
      }

      span {
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
        display: inline-block;
        width: 16vw;
        text-align: center;
      }
    }

    .search_result {
      margin-top: 3.2vw;
      padding-top: 8vw;

      .item {
        margin: 0 3.2vw;
        display: flex;
        align-items: center;
        padding: 3vw 0 3.2vw;
        &:not(:last-child) {
          border-bottom: 1px solid @borderColor;
        }

        .first_result {
          i {
            color: @mainColor;
          }
        }

        .item_left {
          float: left;

          .iconfont {
            .fontSize(22);
          }
        }

        .item_right {
          float: left;
          margin-left: 3.2vw;

          p {
            color: @titleColor;
            .fontSize(15);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
          }

          span {
            color: @subtitleColor;
            .fontSize(12);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
          }
        }
      }
    }

    .no_result {
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
        color: @descriptionColor;
      }
    }

    .search_history {
      padding-top: 8vw;

      .top {
        margin: 5vw 0 3.2vw;
        .fontSize(15);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        padding: 0 3.2vw;

        i {
          float: right;
          opacity: 0.5;
          margin-top: 0.5vw;
        }
      }

      .text {
        padding-left: 3.6vw;

        a {
          background: #ffecd8;
          display: inline-block;
          opacity: 0.4;
          border-radius: 2.7vw;
          color: @subtitleColor;
          .fontSize(15);
          font-family: PingFang-SC-Regular;
          font-weight: 400;
          line-height: 7.7vw;
          padding: 0 4.3vw;
          margin: 0 2.7vw 2.7vw 0;
        }
      }
    }
  }
}
</style>
