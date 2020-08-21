/* * @Author: 田东 * @Date: 2020-01-07 09:41:34 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-07 09:44:02 * @name 文章搜索结果 */
<template>
  <div class="articles_search_page">
    <common-header
      :share-disabled="true"
      :custom-title="titleName"
    ></common-header>
    <div class="search_box">
      <div class="header-div header-left" @click="headerBack">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
        placeholder="输入关键字搜索文章"
        @search="onSearch"
        show-action
        v-model="searchName"
      >
        <div slot="action" @click="onSearch" v-if="searchName">搜索</div>
        <div slot="action" @click="$router.go(-1)" v-if="!searchName">取消</div>
      </van-search>
    </div>
    <van-list
      v-if="articlesList.length"
      v-model="loading"
      :finished="hashMore"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <articles-list
        v-if="flag"
        :title="titleName"
        :articlesList="articlesList"
      ></articles-list>
    </van-list>
    <div v-if="noResult" class="noResult">
      <img src="../../../assets/images/no_articles.png" alt="" />
      <p class="top">暂无此类文章</p>
      <p class="again">
        未找到您要搜索的内容，请<span @click="inputAgain()">重新输入</span>
      </p>
    </div>
    <van-loading type="spinner" color="#0069FF" v-if="loading"></van-loading>
  </div>
</template>

<script>
import articlesList from "./articlesList";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "docArticlesSearchAgain",
  components: {
    articlesList,
    commonHeader
  },
  data() {
    return {
      titleName: "",
      type: 2, //指定模块内容
      searchName: "", // 文章搜索名字,
      hashMore: false, // 是否还有更多
      loading: false,
      flag: false,
      noResult: false,
      page: 1, // 页数
      limit: 4, // 每页条数
      articlesList: [] // 文章列表数据
    };
  },
  methods: {
    /**
     * 文章页滑动到底部加载**/
    onLoad() {
      setTimeout(() => {
        this.page++;
        this.getArticlesList();
      }, 500);
    },

    /**
     * 头部搜索框
     * 如果执行模糊查询,page初始为1**/
    onSearch() {
      this.page = 1;
      this.getArticlesList();
    },

    /**
     * 文章查询函数**/
    getArticlesList() {
      this.loading = true;
      this.$http
        .request({
          method: "get",
          url: "/PArticleController/selectArticle",
          body: {
            type: this.type,
            searchName: this.searchName,
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.noResult = false;
            if (res.data.data.length == 0 && this.page === 1) {
              this.noResult = true;
            }

            this.articlesList =
              this.page !== 1
                ? this.articlesList.concat(res.data.data)
                : res.data.data;
            this.flag = true;
            this.hashMore = !res.data.hashMore;

            // 加载状态结束
            this.loading = false;
          } else {
            this.loading = false;
            console.log("获取文章接口业务报错");
          }
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    },

    // 重新输入
    inputAgain() {
      this.searchName = "";
      this.noResult = false;
      let search = document.getElementsByClassName("van-field__control")[0];
      search.focus();
    },

    // 返回上一页
    headerBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    }
  },
  created() {
    this.$nextTick(() => {
      try {
        let search = document.getElementsByClassName("van-field__control")[0];
        search.focus();
      } catch (e) {
        console.log(e);
      }
    });
    this.titleName = this.$route.query.titleName
      ? this.$route.query.titleName
      : "医学中心";

    if (this.titleName == "名医公开课") {
      this.type = 4;
    }
    //this.getArticlesList();
  }
};
</script>

<style scoped lang="less">
.articles_search_page {
  background-color: @backgroundColor !important;
  height: 100%;
  overflow: auto; /* winphone8和android4+ */
  -webkit-overflow-scrolling: touch; /* ios5+ */
  width: 100%;
  .padding(0, 12, 0, 12);
  box-sizing: border-box;

  .van-list {
    margin-top: 14.4vw;
    width: 100%;
    //height: 85%;
    overflow: auto;
    box-sizing: border-box;
  }

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
}
</style>
