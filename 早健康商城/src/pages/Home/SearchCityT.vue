<template>
  <div id="SearchCityT">
    <div class="header">
      <!--      <span class="iconfont iconleft header-back" @click="back"></span>-->
      <form action="/" class="header-from">
        <van-search
          v-model="searchvalue"
          placeholder="城市"
          background="#FFFFFF"
          show-action
        >
          <div slot="action" @click="onCancel" class="search-button">取消</div>
        </van-search>
      </form>
    </div>

    <!--历史搜索-->
    <div v-if="historyAddress.length > 0" class="history-search">
      <div class="history-search-title">
        <span class="history-search-font">历史搜索</span>
        <span
          class="iconfont iconshanchu history-search-fontT"
          @click="delHistory"
        ></span>
      </div>
      <div class="history-search-content">
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
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import { Dialog } from 'vant';

Vue.use(Toast);
import headers from "@/components/Header/Header";
export default {
  name: "SearchCityT",
  data() {
    return {
      list: [],
      historyAddress: [],
      searchvalue: "",
      title: "",
      headerClass: {
        backgroundColor: "#ffffff"
      },
      touchStatus: false,
      timeer: null,
      shade: false
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
        title: '',
        message: '确认删除全部历史记录吗？'
      }).then(() => {
        this.$store.commit("Home/delHistoryAddress");
        this.historyAddress = [];
      }).catch(() => {

      });
    },
    //设定城市
    checkCity(cities, code) {
      this.setHistory(cities, code);
      this.$store.commit("Home/address", { city: cities, city_code: code });
      this.historyAddress = this.history;
      this.shade = false;
      this.$router.go(-2);
    },
    //设定历史搜索记录
    setHistory(cities, code) {
      this.$store.commit("Home/historyAddress", {
        city: cities,
        city_code: code
      });
    },
    //搜索事件监听
    onSearch() {
      if (this.searchvalue === "") {
        this.list = "";
        return;
      }
      this.$http
        .request({
          //post/get 请求方式
          method: "get",
          url: "/SBaidumapCitycodeController/selectCitysDim",
          body: {
            searchName: this.searchvalue
          }
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.list = res.data.data;
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
    //取消事件
    onCancel() {
      this.searchvalue = "";
      this.back();
    },
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
  margin-bottom: 1vw;
  color: #333;
}
#SearchCityT {
  width: 100vw;
  height: 100vh;
  background-color: @backgroundColorT;
}
.header {
  width: 96%;
  height: auto;
  display: flex;
  align-items: center;
  padding: 0 2%;
  background-color: @backgroundColorT;
}
.header-back {
  .fontSize(20);
  color: @titleBack;
  margin-right: 2%;
}
.van-search {
  padding-left: 0 !important;
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
.header-from {
  width: 100%;
}
.van-search__content {
  width: 80%;
}
.van-search__action {
  padding: 0 0 0 14px !important;
}
.history-search {
  width: 96%;
  height: auto;
  margin: 0;
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
  margin-top: 2%;
}
.history-search-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.history-search-spanT {
  .fontSize(15);
  color: @shenSpan;
  display: block;
  background-color: @backgroundColorTh;
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
.search-shade {
  width: 100%;
  min-height: 34vw;
  height: auto;
  background-color: #ffffff;
  position: absolute;
  top: 14vw;
  left: 0;
  z-index: 1;
}
.search-li {
  width: 96%;
  height: 12vw;
  border-bottom: 0.1vw solid #f2f2f2;
  color: #333;
  margin: 0 2%;
  line-height: 12vw;
  .fontSize(15);
}
.van-overlay{
  background-color: rgba(0,0,0,0);
}
</style>
