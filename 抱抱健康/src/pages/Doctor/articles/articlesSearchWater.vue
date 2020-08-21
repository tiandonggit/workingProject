/* * @Author: 田东 * @Date: 2020-01-07 11:29:01 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-07 13:31:41 * @name 瀑布流文章 医学中心 */
<template>
  <div class="articles_search_page">
    <common-header
      :share-disabled="true"
      :custom-title="titleName"
    ></common-header>
    <div class="search_box clearfix">
      <div class="header-div header-left" @click="headerBack()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
        placeholder="输入关键字搜索文章"
        @click.stop="onSearch"
        readonly
        v-model="searchName"
      ></van-search>
    </div>
    <div class="list-box">
      <articles-list-water :articles-list="articlesList" :type="type"></articles-list-water>
    </div>
    <div
      v-if="!articlesList || (!articlesList.length && !loading)"
      class="noResult"
    >
      <img src="../../../assets/images/no_articles.png" alt="" />
      <p class="top">暂无此类文章</p>
      <p class="again">
        未找到您要搜索的内容，请<span @click="inputAgain()">重新输入</span>
      </p>
    </div>
    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
import articlesListWater from "./articlesListWater";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "articlesSearchWater",
  components: {
    articlesListWater,
    commonHeader
  },
  data() {
    return {
      searchName: "", // 文章搜索名字,
      titleName: "",
      hashMore: false, // 是否还有更多
      loading: false,
      type: 2,
      page: 1, // 页数
      limit: 10, // 每页条数
      articlesList: [] // 文章列表数据
    };
  },
  methods: {
    /**
     * 文章页滑动到底部加载**/
    onLoad() {
      setTimeout(() => {
        this.getArticlesList();
      }, 500);
    },

    /**
     * 头部搜索框
     * 如果执行模糊查询,page初始为1**/
    onSearch() {
      this.$router.push({
        name: "docArticlesSearchAgainWater",
        query: {type: this.type}
      });
    },

    /**
     * 文章查询函数**/
    getArticlesList() {
      console.log("load more1111");
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
            this.page++;
            this.loading = false;
            this.articlesList = this.articlesList.length
              ? this.articlesList.concat(res.data.data)
              : res.data.data;
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
    this.titleName = this.$route.query.titleName;
    if(this.titleName == "医学中心") {
      this.type = 2;
    }else if(this.titleName == "康复方案") {
      this.type = 6;
    }
    this.getArticlesList();
  }
};
</script>

<style scoped lang="less">
.articles_search_page {
  background-color: @backgroundColor;
  width: 100%;
  .padding(0, 12, 0, 12);
  box-sizing: border-box;

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

  .list-box {
    .margin(54, 0, 0, 0);
  }
}

.articles_search_page .articles_list li {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2) !important;
  -moz-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2) !important;
  -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2) !important;
}

.articles-item {
  margin: 5px;

  .article_img_box {
    background-color: @backgroundColorT;
    position: relative;

    img {
      display: block;
      width: 100%;
    }

    .title_box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 16px;
      color: @backgroundColorT;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; // 控制多行的行数
      -webkit-box-orient: vertical;
      line-height: 18px;
      margin-bottom: 6px;
    }
  }

  .article-body {
    /*height: 48px;*/
    background-color: @backgroundColorT;
    border-radius: 0 0 8px 8px;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: @subtitleColor;

    span {
      flex: 1;
      width: 0;
      box-sizing: border-box;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-left: 12px;
    }
  }
}

#vueWaterfall {
  padding-bottom: 10px;
}
</style>
