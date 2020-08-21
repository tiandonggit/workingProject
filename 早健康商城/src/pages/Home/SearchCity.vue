<!--
  作者：刘硕
  时间：2019/5/13
  城市搜索页
-->
<template>
  <div id="SearchCity">
    <v-header :title="title" :headerClass="headerClass"></v-header>
    <div class="search-cloud">
      <div class="search-from">
        <form action="/" @click="onSearch">
          <van-search
            v-model="searchvalue"
            placeholder="搜索"
            background="#F2F2F2"
            disabled
          >
          </van-search>
        </form>
      </div>
    </div>
    <!--历史搜索-->
    <div class="history-search">
      <div class="history-search-titleT">
        <div>
          <span class="iconfont iconlocation history-search-fontT"></span>
          <span class="history-search-fontFi">{{ city }}</span>
        </div>

        <span class="history-search-fontTEi" @click="IPcoor">重新定位</span>
      </div>
      <div class="history-search-title" v-if="historyAddress.length > 0">
        <span class="history-search-font">历史搜索</span>
        <!--        <span class="iconfont iconshanchu history-search-fontT"></span>-->
      </div>
      <div class="history-search-content" v-if="historyAddress.length > 0">
        <span
          class="history-search-spanT"
          @click="checkCity(item.city, item.city_code)"
          v-for="(item, index) in historyAddress"
          :key="index"
          v-if="item.city.length >= 4"
          >{{ item.city.substring(0, 3) }}...</span
        >
        <span
          class="history-search-spanT"
          @click="checkCity(item.city, item.city_code)"
          v-else
          >{{ item.city }}</span
        >
      </div>
    </div>
    <!--热门搜索-->
    <div class="hot-search">
      <div class="hot-search-title">
        <span class="hot-search-font">热门搜索</span>
      </div>
      <div class="hot-search-content">
        <span class="hot-search-spanT" @click="checkCity('上海市', 289)"
          >上海市</span
        >
        <span class="hot-search-spanT" @click="checkCity('杭州市', 179)"
          >杭州市</span
        >
        <span class="hot-search-spanT" @click="checkCity('北京市', 131)"
          >北京市</span
        >
        <span class="hot-search-spanT" @click="checkCity('广州市', 257)"
          >广州市</span
        >
        <span class="hot-search-spanT" @click="checkCity('天津市', 332)"
          >天津市</span
        >
        <span class="hot-search-spanT" @click="checkCity('南京市', 315)"
          >南京市</span
        >
        <span class="hot-search-spanT" @click="checkCity('武汉市', 218)"
          >武汉市</span
        >
        <span class="hot-search-spanT" @click="checkCity('苏州市', 224)"
          >苏州市</span
        >
      </div>
    </div>
    <!--城市列表-->
    <div class="city-list">
      <div
        class="city-ul"
        :id="item.letter"
        v-for="(item, index) in citylist"
        :key="index"
      >
        <div class="city-letter">{{ item.letter }}</div>
        <div
          class="city-li"
          v-for="(item2, index2) in item.cityList"
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
        @click="handleTouch(item.letter)"
        v-for="(item, index) in citylist"
        :key="index"
      >
        {{ item.letter }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);
import headers from "@/components/Header/Header";
export default {
  name: "SearchCity",
  data() {
    return {
      historyAddress: [], // 历史搜索
      citylist: [], //城市列表 字母
      city: "未识别定位",
      //搜索
      searchvalue: "",
      title: "未识别定位",
      headerClass: {
        backgroundColor: "#ffffff"
      },
      touchStatus: false,
      timeer: null
    };
  },
  computed: {
    //定位城市
    citystate() {
      return this.$store.state.Home.address.city;
    },
    //历史
    history() {
      return this.$store.state.Home.historyAddress;
    },
    //城市列表 字母
    cityLists() {
      return this.$store.state.Home.cityList;
    }
  },
  components: {
    "v-header": headers
  },
  created() {
    if (this.citystate) {
      this.city = this.citystate;
      this.title = this.citystate;
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
      this.$store.commit("Home/historyAddress", {
        city: cities,
        city_code: code
      });
    },
    //设定城市
    checkCity(cities, code) {
      this.setHistory(cities, code);
      this.$store.commit("Home/address", { city: cities, city_code: code });
      this.$router.back(-1);
    },
    //查询城市 字母
    selectCitys() {
      this.$http
        .request({
          //post/get 请求方式
          method: "get",
          url: "/SBaidumapCitycodeController/selectCitys",
          body: {}
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.citylist = res.data.data;
            this.$store.commit("Home/cityList", res.data.data);
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
    //ip定位
    IPcoor() {
      this.city = "定位中...";
      this.$jsonp("http://api.map.baidu.com/location/ip", {
        ak: "4DqvvHg6LtEkiBPwcjdolbcH5LitO9NI"
      })
        .then(response => {
          if (response.content.address_detail.city.length > 6) {
            this.city =
              response.content.address_detail.city.substring(0, 6) + "...";
            this.title =
              response.content.address_detail.city.substring(0, 6) + "...";
          } else {
            this.city = response.content.address_detail.city;
            this.title = response.content.address_detail.city;
          }
          this.$store.commit("Home/address", {
            city: response.content.address_detail.city,
            city_code: response.content.address_detail.city_code
          });
        })
        .catch(err => {
          this.city = "定位失败";
        });
    },
    //触摸滑动定位
    handleTouch(selector) {
      let anchor = this.$el.querySelector("#" + selector).offsetTop - 100;
      window.scrollTo(0, anchor);
    },
    //搜索事件监听
    onSearch() {
      this.$router.push({
        name: "SearchCityT"
      });
    },
    //取消事件
    onCancel() {},
    back() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="less" scoped>
//隐藏滚动条
.element::-webkit-scrollbar {
  width: 0 !important;
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
  /*margin-bottom: 1vw;*/
  color: #333;
  font-size: 3vw;
}
#SearchCity {
  width: 100vw;
  height: 100vh;
  /*background: url("./city.png") no-repeat;*/
  /*background-size: 100% 100%;*/
  background-color: @backgroundColor;
  /*padding-top: 16px;*/
}
.search-cloud{
  width: 100vw;
  position: fixed;
  top: 14vw;
}
.search-from {
  width: 100vw;
  /*padding: 2%;*/
}
.van-search {
  /*padding-left: 0 !important;*/
}
.search-button {
  width: 14vw;
  color: #ffffff;
  text-align: center;
  line-height: 2.3;
  height: 100%;
  background-color: @homeHeaderBackgroundColor;
  .borderRadius(10, 10, 10, 10);
}
.van-search__content {
  //width: 80%;
  background-color: #ffffff;
}
.van-search__action {
  //padding: 0 0 0 14px !important;
}
.history-search {
  width: 96%;
  height: auto;
  margin-top: 14.3vw;
  background-color: #ffffff;
  padding: 1% 2%;
}
.history-search-title {
  width: 98%;
  height: 10vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1%;
}
.history-search-titleT {
  width: 98%;
  height: 10vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1%;
  border-bottom: 0.1vw solid #f2f2f2;
}
.history-search-font {
  .fontSize(16);
  color: @titleColor;
  margin-top: 2%;
}
.history-search-fontT {
  .fontSize(16);
  color: @qianSpan;
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
  color: @homeHeaderBackgroundColor;
  /*margin-top: 2%;*/
}
.history-search-content {
  width: 94%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.history-search-spanT {
  .fontSize(15);
  color: @shenSpan;
  display: block;
  background-color: #f2f2f2;
  padding: 1% 4%;
  .borderRadius(10, 10, 10, 10);
  margin: 2% 1%;
}

.hot-search {
  width: 96%;
  height: auto;
  background-color: #ffffff;
  margin-top: 6%;
  padding: 1% 2%;
}
.hot-search-title {
  width: 98%;
  height: 10vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1%;
}
.hot-search-font {
  .fontSize(16);
  color: @titleColor;
  margin-top: 2%;
}
.hot-search-fontT {
  .fontSize(16);
  color: @qianSpan;
  margin-top: 2%;
}
.hot-search-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.hot-search-spanT {
  .fontSize(15);
  color: @shenSpan;
  display: block;
  background-color: @backgroundColor;
  padding: 1% 4%;
  .borderRadius(10, 10, 10, 10);
  margin: 2% 1%;
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
  background-color: #ffffff;
  padding-left: 2%;
}
.van-overlay{
  background-color: rgba(0,0,0,0);
}
</style>
