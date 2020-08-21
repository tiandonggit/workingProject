<!--
  作者：刘硕
  时间：2019/5/12
-->
<template>
  <div id="Searches">
    <div class="header">
      <span class="iconfont iconleft header-back" @click="back"></span>
      <form action="/" class="header-from">
        <van-search
          v-model="searchvalue"
          placeholder="搜索"
          background="#FFFFFF"
          show-action
        >
          <div slot="action" @click="onSearch" class="search-button">搜索</div>
        </van-search>
      </form>
    </div>
    <!--历史搜索-->
    <div class="history-search" v-if="historyProduct.length > 0">
      <div class="history-search-title">
        <span class="history-search-font">历史搜索</span>
        <span
          class="iconfont iconshanchu history-search-fontT"
          @click="delHistory"
        ></span>
      </div>
      <div class="history-search-content">
<!--        <span-->
<!--          class="history-search-spanT"-->
<!--          @click="prolist(item)"-->
<!--          v-for="(item, index) in historyProduct"-->
<!--          :key="index"-->
<!--          v-if="item.length>=4"-->
<!--          >{{ item.substring(0, 3) }}...</span-->
<!--        >-->
<!--        <span-->
<!--          class="history-search-spanT"-->
<!--          @click="prolist(item)"-->
<!--          v-else-->
<!--        >{{ item }}</span-->
<!--        >-->
        <span
          class="history-search-spanT"
          @click="prolist(item)"
          v-for="(item, index) in historyProduct"
          :key="index"
        >{{item}}</span
        >
      </div>
    </div>
    <!--热门搜索-->
    <div class="hot-search" v-if="hotProduct.length > 0">
      <div class="hot-search-title">
        <span class="hot-search-font">热门搜索</span>
      </div>
      <div class="hot-search-content">
        <span
          class="hot-search-spanT"
          v-for="(item, index) in hotProduct"
          :key="index"
          @click="prolist(item.hotcontent)"
          >{{ item.hotcontent }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import { Dialog } from 'vant';

Vue.use(Toast);
export default {
  name: "Searches",
  data() {
    return {
      hotProduct: [],
      historyProduct: new Set(),
      searchvalue: ""
    };
  },
  computed: {
    //获取历史记录
    getHistoryProduct() {
      return this.$store.state.Home.historyProduct;
      // return Array.from(this.$store.state.Home.historyProduct).reverse();
    }
  },
  created() {
    this.historyProduct = this.getHistoryProduct;
    this.allSelect();
  },
  methods: {
    //热门查询
    allSelect() {
      this.$http
        .request({
          method: "get",
          url: "/SSearchHotController/searchHotProduct",
          body: {}
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.hotProduct = res.data.data;
          } else {
            console.log("获取热门失败");
          }
        })
        .catch(error => {
          Toast.clear();
          console.log("接口异常");
        });
    },
    //跳转
    prolist(pro_name, pro_id) {
      if(pro_name !== ""){
        this.$store.commit("Home/historyProduct", pro_name);
      }
      this.historyProduct = this.getHistoryProduct;
      this.$router.push({
        name: "SearchesP",
        query: {
          name: pro_name,
          id: pro_id
        }
      });
    },
    //搜索事件监听
    onSearch() {
      this.prolist(this.searchvalue);
    },
    //取消事件
    onCancel() {},
    back() {
      this.$router.back(-1);
    },
    //删除历史记录
    delHistory() {
      Dialog.confirm({
        title: '',
        message: '确认删除全部历史记录吗？'
      }).then(() => {
        this.$store.commit("Home/delHistoryProduct");
        this.historyProduct = [];
      }).catch(() => {

      });

    }
  }
};
</script>

<style lang="less" scoped>
#Searches {
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
}
.header-back {
  .fontSize(20);
  color: @titleColor;
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
  width: 91%;
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
  margin: 0 2%;
}
.history-search-title {
  width: 98%;
  height: 10vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1%;
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
  max-width: 89%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hot-search {
  width: 96%;
  height: auto;
  margin: 0 2%;
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
.van-overlay{
  background-color: rgba(0,0,0,0);
}
</style>
