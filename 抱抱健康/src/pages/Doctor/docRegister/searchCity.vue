/* *@Description: 搜索城市 *@Author: tiandong *@Date: 2020-01-03 */
<template>
  <div id="SearchCity">
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
        readonly
        @click.stop="onSearch"
      ></van-search>
    </div>

    <!--历史搜索-->
    <div class="history-search">
      <div class="history-search-title">
        <span class="history-search-font">您所在的地区</span>
      </div>
      <div class="history-search-titleT clearfix">
        <span class="history-search-spanT" @click="checkCity(city, cityCode)">{{
          city
        }}</span>
      </div>
      <div class="history-search-title" v-if="historyAddress.length > 0">
        <span class="history-search-font">历史访问目的地</span>
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

    <!--城市列表-->
    <div class="city-list">
      <div
        class="city-ul"
        v-for="(item, index) in citylist"
        :id="item.initial"
        :key="index"
      >
        <div class="city-letter">{{ item.initial }}</div>
        <div
          class="city-li"
          v-for="(item2, index2) in item.citys"
          :key="index2"
          @click="checkCity(item2.name, item2.areaid)"
        >
          {{ item2.name }}
        </div>
      </div>
    </div>
    <!--滑动城市-->
    <div class="touchcity">
      <div class="touchcityleft">#</div>
      <div
        class="touchcityleft"
        v-for="(item, index) in citylist"
        :key="index"
        :class="index == selected ? 'activeUI' : ''"
        @click="handleTouch(item.initial, index)"
      >
        {{ item.initial }}
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";

import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "SearchCity",
  data() {
    return {
      selected: -1,
      historyAddress: [], // 历史搜索
      citylist: [], //城市列表 字母
      city: "未识别定位",
      cityCode: "",
      searchvalue: ""
    };
  },
  computed: {
    //定位城市
    citystate() {
      return this.$store.state.DoctorInfoID.address;
    },
    //历史
    history() {
      return this.$store.state.DoctorInfoID.historyAddress;
    },
    //城市列表 字母
    cityLists() {
      return this.$store.state.DoctorInfoID.cityList;
    }
  },
  components: {
    commonHeader
  },
  created() {
    if (this.citystate) {
      this.city = this.citystate.city;
      this.cityCode = this.citystate.city_code;
    }
    this.historyAddress = this.history;

    if (this.cityLists.length > 0) {
      this.citylist = this.cityLists;
    } else {
      this.selectCitys();
    }
    window.scroll(0, 0);
  },
  methods: {
    //设定历史搜索记录
    setHistory(cities, code) {
      this.$store.commit("DoctorInfoID/historyAddress", {
        city: cities,
        city_code: code
      });
    },
    //设定城市
    checkCity(cities, code) {
      this.setHistory(cities, code);
      this.$store.commit("DoctorInfoID/address", {
        city: cities,
        city_code: code
      });

      this.$router.back(-1);
    },
    //查询城市 字母
    selectCitys() {
      this.$http
        .request({
          method: "get",
          url: "/BaidumapCitycodeController/selectCitys",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.citylist = res.data.data;
            //this.$store.commit("HomDoctorInfoIDe/cityList", res.data.data);
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("刷新一下，或者检查网络连接");
        });
    },
    //ip定位
    IPcoor() {
      this.city = "定位中...";
      this.$jsonp("https://api.map.baidu.com/location/ip", {
        ak: "4DqvvHg6LtEkiBPwcjdolbcH5LitO9NI"
      })
        .then(response => {
          let result = response.content.address_detail;

          this.city =
            result.city.length > 6
              ? result.city.substring(0, 6) + "..."
              : result.city;
          this.cityCode = result.city_code;
          this.$store.commit("DoctorInfoID/address", {
            city: result.city,
            city_code: result.city_code
          });
        })
        .catch(err => {
          this.city = "定位失败";
        });
    },
    //触摸滑动定位
    handleTouch(selector, activeIndex) {
      this.selected = activeIndex;
      let anchor = this.$el.querySelector("#" + selector).offsetTop;
      window.scrollTo(0, anchor);
    },
    //搜索事件监听
    onSearch() {
      this.$router.push({
        name: "searchCityAgain"
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
//隐藏滚动条
.element::-webkit-scrollbar {
  width: 0 !important;
}
van-cell {
  justify-content: center;
  van-cell__value {
    flex: none;
  }
}

.element {
  -ms-overflow-style: none;
}
.element {
  overflow: -moz-scrollbars-none;
}
.touchcity {
  width: 6vw;
  position: fixed;
  right: 0;
  top: 50vw;
  z-index: 99;
}
.touchcityleft {
  color: #333;
  .fontSize(10);
}
#SearchCity {
  width: 100vw;
  height: 100vh;
  /*background: url("./city.png") no-repeat;*/
  /*background-size: 100% 100%;*/
  background-color: @backgroundColor;
  /*padding-top: 16px;*/

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

    /deep/.van-search {
      .width(333);
      float: left;
      .padding(5, 0, 5, 8);
      background: @backgroundColor !important;

      .van-search__content {
        background-color: @backgroundColorT;
        .borderRadius(6, 6, 6, 6);
      }

      .van-field__body,
      .van-field__left-icon {
        .lineHeight(24);
      }
    }
  }
}

.history-search {
  .width(351);
  height: auto;
  margin: 17.1vw auto 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.history-search-title {
  span {
    color: @subtitleColor;
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

.history-search-font {
  .fontSize(16);
  color: @titleColor;
  margin-top: 2%;
}

.history-search-fontFi {
  .fontSize(16);
  color: @titleColor;
  margin-top: 2%;
  margin-left: 1.2vw;
}

.history-search-fontTEi {
  .fontSize(16);
  color: #e98c2e;
  margin-top: 2%;
}

.history-search-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
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
  background-color: @backgroundColor;
}
.city-li {
  width: 98%;
  height: 12vw;
  display: flex;
  align-items: center;
  background-color: @backgroundColorT;
  padding-left: 2%;
  border-bottom: 1px solid #ebedf0;
}
.activeUI {
  color: @mainColor;
}
.touchcity {
  text-align: center;
  .touchcityleft {
    .lineHeight(20);
  }
}

.van-overlay {
  background-color: rgba(0, 0, 0, 0);
}
</style>
