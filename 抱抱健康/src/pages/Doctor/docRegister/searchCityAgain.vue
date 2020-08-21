/* * @Author: 田东 * @Date: 2020-01-07 15:27:24 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-07 15:30:34 * @name 城市搜索 */
<template>
  <div id="SearchCityAgain">
    <!--      <span class="iconfont iconleft header-back" @click="back"></span>-->
    <common-header
      :share-disabled="true"
      :custom-title="'搜索城市'"
    ></common-header>
    <div class="search_box clearfix">
      <div class="header-div header-left" @click="headerBack()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
        placeholder="搜索城市"
        v-model="searchvalue"
        @change="onSearch"
      ></van-search>
    </div>

    <!--历史搜索-->
    <div class="history-search" v-show="!shade && !isNoSearchResult">
      <div class="history-search-title" v-if="historyAddress.length > 0">
        <span class="history-search-font">历史访问目的地</span>
        <span
          class="iconfont iconshanchu history-search-delete"
          @click="delHistory"
        ></span>
      </div>
      <div
        class="history-search-titleT clearfix"
        v-if="historyAddress.length > 0"
      >
        <span
          class="history-search-spanT"
          v-for="(item, index) in historyAddress"
          :key="index"
          @click="checkCity(item.city, item.city_code)"
          >{{ item.city }}</span
        >
      </div>
    </div>
    <div class="search-shade" v-show="shade">
      <div
        class="search-li"
        v-for="(item, index) in list"
        :key="index"
        @click="checkCity(item.name, item.areaid)"
      >
        {{ item.name }}
      </div>
    </div>
    <div v-if="isNoSearchResult" class="no_result">
      <div>
        <img src="../../../assets/images/locationFail.png" alt />
        <p>暂未开通此城市</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";

export default {
  name: "SearchCityAgain",
  data() {
    return {
      list: [],
      historyAddress: [],
      isHistory: true,
      searchvalue: "",
      title: "",
      headerClass: {
        backgroundColor: "#ffffff"
      },
      touchStatus: false,
      timeer: null,
      isNoSearchResult: false,
      shade: false
    };
  },
  computed: {
    //定位城市
    citystate() {
      return this.$store.state.DoctorInfoID.address.city;
    },
    //历史
    history() {
      return this.$store.state.DoctorInfoID.historyAddress;
    }
  },
  watch: {
    searchvalue(news, old) {
      this.shade = true;
      this.onSearch();
    }
  },
  created() {
    if (this.citystate) {
      this.title = this.citystate;
    }
    this.historyAddress = this.history;
  },
  methods: {
    //删除历史记录
    delHistory() {
      Dialog.confirm({
        title: "",
        message: "确认删除全部历史记录吗？"
      })
        .then(() => {
          this.$store.commit("DoctorInfoID/delHistoryAddress");
          this.historyAddress = [];
        })
        .catch(() => {});
    },
    //设定城市
    checkCity(cities, code) {
      this.setHistory(cities, code);
      this.$store.commit("DoctorInfoID/address", {
        city: cities,
        city_code: code
      });
      this.historyAddress = this.history;
      this.shade = false;
      this.$router.go(-2);
    },
    //设定历史搜索记录
    setHistory(cities, code) {
      this.$store.commit("DoctorInfoID/historyAddress", {
        city: cities,
        city_code: code
      });
    },
    //搜索事件监听
    onSearch() {
      if (this.searchvalue === "") {
        this.list = [];
        this.shade = false;
        this.isNoSearchResult = false;
        this.isHistory = true;
        return;
      }
      this.$http
        .request({
          //post/get 请求方式
          method: "get",
          url: "/BaidumapCitycodeController/selectCitys",
          body: {
            name: this.searchvalue
          }
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.list = res.data.data;
            this.isNoSearchResult = false;
            if (this.list.length == 0) {
              this.shade = false;
              this.isNoSearchResult = true;
              this.isHistory = false;
            }
          } else {
            console.log("获取城市失败");
          }
        })
        .catch(error => {
          Toast.clear();
          this.loading = false;
          this.finished = false;
        });
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
#SearchCityAgain {
  width: 100vw;
  height: 100vh;
  background-color: @backgroundColor;

  .search_box {
    position: fixed;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100vw;
    height: auto;
    background: @backgroundColor;

    .header-left {
      float: left;
      .height(44);
      .lineHeight(44);
      .padding(0, 0, 0, 10);

      .back-icon {
        .fontSize(20);
        font-weight: 600;
        color: @titleColor;
      }
    }

    /deep/ .van-search {
      .width(333);
      float: left;
      .padding(5, 0, 5, 8);
      background: @backgroundColor !important;

      .van-search__content {
        background-color: @backgroundColorT;
        .borderRadius(6, 6, 6, 6);
      }

      .van-icon-search,
      .van-field__control {
        .fontSize(16);
        .lineHeight(24);
      }

      .van-field__body,
      .van-field__left-icon {
        .lineHeight(24);
      }
    }
  }

  .history-search {
    .width(351);
    height: auto;
    margin: 17.1vw auto 0;
  }
  .history-search-title {
    span {
      color: @subtitleColor;
    }

    .history-search-delete {
      float: right;
      .fontSize(20);
    }
  }

  .history-search-titleT {
    .padding(0, 0, 15, 0);

    .history-search-spanT {
      .width(92);
      .height(36);
      .lineHeight(36);
      text-align: center;
      background: @backgroundColorT;
      border-radius: 5px;
      .margin(15, 5, 5, 5);
      display: inline-block;

      span {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @titleColor;
        line-height: 16px;
      }
    }
  }

  .no_result {
    width: 100%;
    position: absolute;
    top: 50%;
    .margin(-150, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      .width(205);
      height: auto;
      .margin(0, 0, 42, 0);
    }

    p {
      text-align: center;
      .fontSize(18);
      font-size: 18px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: @titleColor;
      .lineHeight(22);
    }
  }
}

.city-list {
  width: 100vw;
  height: auto;
}

.city-ul {
  width: 100%;
  height: auto;
}

.city-letter {
  width: 98%;
  height: 12vw;
  display: flex;
  align-items: center;
  padding-left: 2%;
}

.city-li {
  width: 98%;
  height: 12vw;
  display: flex;
  align-items: center;
  background-color: @backgroundColorT;
  padding-left: 2%;
}

.search-shade {
  width: 100%;
  height: auto;
  background-color: @backgroundColorT;
  position: absolute;
  top: 14vw;
  left: 0;
  z-index: 1;
}

.search-li {
  width: 96%;
  height: 12vw;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  margin: 0 2%;
  line-height: 12vw;
  .fontSize(15);
}

.van-overlay {
  background-color: rgba(0, 0, 0, 0);
}
</style>
