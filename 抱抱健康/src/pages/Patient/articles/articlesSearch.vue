/** *@desc 患者端文章搜索页 *@author houpai *@date 2019/07/04 13:22:54 */
<template>
  <div class="articles_search_page">
    <common-header
        :share-disabled="true"
        :custom-title="'文章'"></common-header>
    <div class="search_header_box">
      <div class="search_header">
        <div class="header-div header-left" @click="headerBack">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        <van-search
            placeholder="输入关键字搜索文章"
            @click.stop="onSearch"
            v-model="searchName"></van-search>
      </div>
    </div>
    <articles-list :articles-list="articlesList"
                   :is-load="isLoad"
                   :articleType="type"></articles-list>
    <div v-if="noResult" class="noResult">
      <img src="../../../assets/images/no_articles.png" alt="" />
      <p class="top">暂无文章</p>
    </div>
    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"></van-loading>
  </div>
</template>

<script>
  import articlesList from "./articlesList"
  import commonHeader from "../../../components/commonHeader/common_header"

  export default {
    name: "articlesSearch",
    components: {
      articlesList,
      commonHeader
    },
    data() {
      return {
        noResult: false,
        searchName: "", // 文章搜索名字,
        isLoad: true, // 是否还有更多
        loading: false,
        page: 1, // 初始请求一页初始数据 继续加载在瀑布流组件里
        limit: 10, // 每页条数
        articlesList: [], // 文章列表数据
        type: 3, // 指定文章类型
      }
    },
    methods: {

      /**
       * 头部搜索框
       * 如果执行模糊查询,page初始为1**/
      onSearch() {
        this.$router.push({
          name: "articlesSearchAgain",
          query: {
            articleType:this.type
          }
        })
      },

      /**
       * 文章查询函数**/
      getArticlesList() {
        this.loading = true
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
            this.loading = false
            if (res.data.success && res.data.data) {
              if (res.data.data.length === 0 && this.page === 1) {
                this.noResult = true;
              }
              this.page++
              this.loading = false
              this.articlesList = this.articlesList.length
                ? this.articlesList.concat(res.data.data)
                : res.data.data
              this.isLoad = res.data.hashMore === true;
            } else {
              console.log("获取文章接口业务报错")
            }
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      },

      headerBack() {
        this.$router.go(-1)
      }
    },
    created() {
      if(this.$route.query.articleType) {
        this.type = this.$route.query.articleType;
      }
      this.getArticlesList()
    }
  }
</script>

<style lang="less" scoped>
  .articles_search_page {
    .margin(54,0,0,0);
    background-color: @backgroundColor;
    width: 100%;
    .padding(0, 12, 0, 12);
    box-sizing: border-box;
  }

  .articles_search_page .articles_list li {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2) !important;
    -moz-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2) !important;
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2) !important;
  }


  .articles-item {
    margin: 5px;

    .article_img_box {
      background-color: #fff;
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
        color: #fff;
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
      background-color: #fff;
      border-radius: 0 0 8px 8px;
      box-sizing: border-box;
      padding: 10px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);

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
