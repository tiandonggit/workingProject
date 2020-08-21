/* * @Author: 田东 * @Date: 2020-03-11 14:36:32 * @Last Modified by: 田东 *
@Last Modified time: 2020-03-11 14:36:55 * @name 医生医院选择 */

<template>
  <div id="confirmHospital">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="'搜索医院'"
    ></common-header>
    <!-- 内容区 -->
    <div class="content_block">
      <div class="search_box clearfix">
        <i class="iconfont iconleft back-icon" @click="headerBack()"></i>
        <div class="search_left">
          <span @click="selectCity()">{{ cityShow }}</span>
          <i class="iconfont iconqianjin" @click.stop="getCity()"></i>
          <i class="iconfont iconanjianfengexian"></i>
          <i class="iconfont iconsousuo"></i>
          <input
            type="text"
            @change="onSearch"
            v-model="searchText"
            placeholder="医院名称搜索"
          />
        </div>
      </div>
      <!-- 遮罩 -->
      <van-overlay
        v-show="isShowOverlay"
        :z-index="10"
        :show="isShowOverlay"
        @click="clickOverlay()"
      />
      <!-- 点击下拉 -->
      <div class="getCityItem" v-if="isSelect">
        <van-list>
          <van-cell
            v-for="(city, key) in getCityList"
            :key="key"
            :title="city.text"
            @click="getActiveCity(city)"
          />
        </van-list>
      </div>
      <!-- 正常搜索 -->
      <div v-if="searchResultList.length > 0" class="search_result">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="(searchResult, key) in searchResultList"
            :key="key"
            @click="selectHospital(searchResult)"
            :title="searchResult.name"
          />
        </van-list>
      </div>
    </div>
    <div v-if="isNoSearchResult" class="no_result">
      <div>
        <img src="../../../assets/images/no_articles.png" alt />
        <p>暂无此医院</p>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import Vue from "vue";
import { Toast, Dialog, List, Overlay } from "vant";

Vue.use(List);
Vue.use(Overlay);
export default {
  name: "confirmHospital",
  data() {
    return {
      // 本页数据
      isShowOverlay: false,
      isSelect: false,
      loading: false,
      finished: false,
      totalItem: "",
      //params: {},
      city: "沈阳市",
      citycode: "",
      cityShow: "", // 城市名称超长 剪裁后显示的内容
      pageIndex: 1,
      dataType: 1, //是全局搜索，点击搜索框搜索2，还是初始化搜索1
      isNoSearchResult: false,
      searchText: "",
      getCityList: [],
      searchResultList: [],
      isOnceOnLoad: true
    };
  },
  components: {
    commonHeader
  },
  mounted: function() {
    //this.params = JSON.parse(window.localStorage.getItem("addAddressInfo"));
  },
  computed: {
    // //历史
    // history() {
    //   return this.$store.state.Address.historyAddress;
    // }
  },

  created() {
    // this.historyAddress = this.history;
    // this.historyAddress.forEach((v, e) => {
    //   this.historyList.push(v.searchResult.name);
    // });
    this.IPcoor();
  },
  methods: {
    clickOverlay() {
      this.isSelect = false;
      this.isShowOverlay = false;
    },
    //选定医院
    selectHospital(option) {
      this.$store.commit("DoctorInfoID/setHospital", {
        hospital: option.name,
        id: option.id
      });

      this.$router.push({ name: "infoID" });
    },
    // ip定位
    IPcoor() {
      if (this.$store.state.DoctorInfoID.address.city_code) {
        let cityItem = this.$store.state.DoctorInfoID.address.city;
        this.cityCode = this.$store.state.DoctorInfoID.address.city_code;
        //根据定位城市直接显示数据

        this.searchAddress(this.cityCode, this.pageIndex, this.dataType);

        this.city =
          cityItem.length > 3 ? cityItem.substring(0, 3) + "..." : cityItem;
      } else {
        this.$jsonp("https://api.map.baidu.com/location/ip", {
          ak: "hmVqEY5D33xZBKMOosca0XSXlV9uHAlt"
        })
          .then(response => {
            if (response.status != 0) {
              Toast("定位失败");
              return;
            }

            let resCity = response.content.address_detail.city;
            this.cityCode = response.content.address_detail.city_code;
            //根据定位城市直接显示数据
            this.searchAddress(this.cityCode, this.pageIndex, this.dataType);

            this.city =
              resCity.length > 6 ? resCity.substring(0, 6) + "..." : resCity;
            this.$store.commit("DoctorInfoID/address", {
              city: resCity,
              city_code: this.cityCode
            });
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
      this.$router.push({
        name: "searchCity"
      });
    },
    // 根据定位城市直接显示和搜索框搜索显示
    searchAddress(cityCode, n, type, searchText = null) {
      this.$http
        .request({
          method: "get",
          url: "/RHospitalController/selectRHospitalByCodeAndSearch",
          body: {
            areaid: cityCode,
            page: n,
            limit: 10,
            name: searchText,
            type: type
          }
        })
        .then(res => {
          if (res.data.success) {
            this.totalItem = res.data.total;
            this.loading = false;
            this.searchResultList = this.searchResultList.concat(res.data.data);
            this.pageIndex++;
            if (this.searchResultList.length == this.totalItem) {
              this.finished = true;
            }
            this.isNoSearchResult = false;
            if (res.data.data.length == 0) {
              this.isNoSearchResult = true;
            }
          } else {
            this.searchResultList = [];
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("加载失败 请检查网络连接");
        });
    },
    //上滑的回调事件
    onLoad() {
      console.log("onLoad: ");
      //防止初始化就触发，插件默认的功能，二次处理
      if (this.isOnceOnLoad) {
        this.loading = false;
        this.isOnceOnLoad = false;
        return;
      }
      //数据全部加载完成
      if (this.searchResultList.length == this.totalItem) {
        this.loading = false;
        this.finished = true;
      }
      this.searchAddress(this.cityCode, this.pageIndex, this.dataType);
    },
    getCity() {
      this.isSelect = !this.isSelect;
      // this.isShowOverlay = !this.isShowOverlay;
      this.$http
        .request({
          method: "get",
          url: "/RHospitalController/selectHospital",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.getCityList = res.data.data;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("请求数据失败");
        });
    },
    getActiveCity(city) {
      this.cityCode = city.citycode;
      this.pageIndex = 1;
      this.searchResultList = [];
      this.finished = false;
      this.citycode = city.citycode;
      this.cityShow =
        city.text.length > 3 ? city.text.substring(0, 3) + "..." : city.text;
      this.isSelect = false;
      this.isShowOverlay = false;
      this.searchAddress(this.cityCode, this.pageIndex, 1);
    },
    //点击搜索
    onSearch() {
      this.pageIndex = 1;
      this.searchResultList = [];
      this.finished = false;
      if (this.searchText) {
        this.dataType = 2;
        this.searchAddress(
          this.cityCode,
          this.pageIndex,
          this.dataType,
          this.searchText
        );
      } else {
        Toast("请输入医院名称");
      }
    },
    // 返回上一页
    headerBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

p {
  margin: 0;
  padding: 0;
  background: none;
}
#confirmHospital /deep/ .van-overlay {
  top: 60px;
  background-color: rgba(0, 0, 0, 0.2);
}
.clearfix::after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}

#confirmHospital {
  height: 100%;
  position: relative;
  background: @backgroundColor;

  .content_block {
    //height: 11.2vw;
    position: relative;

    .search_box {
      .padding(0, 12, 0, 10);
      .height(34);
      position: absolute;
      top: 2.2vw;
      width: 100%;

      .back-icon {
        .fontSize(18);
        .lineHeight(34);
        font-weight: 600;

        &::before {
          color: @titleColor;
        }
      }

      .search_left {
        position: relative;
        float: right;
        height: 100%;
        // padding: 0 0 0 3.2vw;
        background: @backgroundColorT;
        .borderRadius(6, 6, 6, 6);
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        .width(325);

        .iconfont {
          .fontSize(16);
        }
        .iconqianjin {
          transform: rotate(90deg);
        }
        .iconfengexianICON {
          margin-right: 1.1vw;
        }

        input::-webkit-input-placeholder {
          .fontSize(16);
        }
        input::-moz-input-placeholder {
          .fontSize(16);
        }
        input::-ms-input-placeholder {
          .fontSize(16);
        }

        input {
          border: none;
          .fontSize(16);
          background-color: transparent;
          padding: 0 1.2vw;
          width: 52vw;
        }
      }

      span {
        .fontSize(16);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
        display: inline-block;
        margin-right: 1vw;
        //width: 16vw;
        //text-align: center;
      }
    }

    .search_result,
    .getCityItem {
      //margin-top: 3.2vw;
      padding-top: 13vw;

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

    .search_result {
      position: absolute;
      top: 11.3vw;
      right: 0;
      width: 100%;
      .height(400);
      padding-top: 0;
      background: @backgroundColorT;
      .borderRadius(6, 6, 6, 6);
      overflow: auto;
      .width(325);
      float: right;
      .margin(0, 12, 0, 0);
      border-top: 1px solid #ebedf0;

      &::-webkit-scrollbar {
        display: none;
      }

      .van-list {
        width: 100%;
        .height(400);

        .van-cell__title {
          span {
            .fontSize(16);
            color: @titleColor;
          }
        }
      }
    }
    .getCityItem {
      position: absolute;
      top: 11.3vw;
      right: 0;
      width: 100%;
      padding-top: 0;
      background: @backgroundColorT;
      .borderRadius(6, 6, 6, 6);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      .width(325);
      float: right;
      .margin(0, 12, 0, 0);
      border-top: 1px solid #ebedf0;
      z-index: 10;

      .van-list {
        width: 100%;
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

  .no_result {
    width: 100%;
    // .height(300);
    //margin-top: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      .width(208);
      height: auto;
      margin-bottom: 13px;
    }

    p {
      text-align: center;
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @descriptionColor;
    }
  }
}
</style>
