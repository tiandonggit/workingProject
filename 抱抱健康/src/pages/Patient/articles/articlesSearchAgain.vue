/** *@desc 文章搜索页 *@author houpai *@date 2019/07/04 13:22:54 */
<template>
  <div class="articles_search_page">
    <common-header
        :share-disabled="true"
        :custom-title="titleName"
    ></common-header>
    <div class="search_header_box">
      <div class="search_header">
        <div class="header-div header-left" @click="headerBack">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        <van-search
            @search="onSearch"
            placeholder="输入关键字搜索文章"
            v-model="searchName"></van-search>
      </div>
    </div>
    <articles-list :type="type"
                   :searchName="searchName"
                   :is-load="isLoad"
                   :articlesList="articlesList"></articles-list>
    <div v-if="noResult" class="noResult">
      <img src="../../../assets/images/no_articles.png" alt=""/>
      <p class="top">暂无此类文章</p>
      <p class="again">
        未找到您要搜索的内容，请<span @click="inputAgain()">重新输入</span>
      </p>
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
    name: "docArticlesSearchAgain",
    components: {
      articlesList,
      commonHeader
    },
    data() {
      return {
        titleName: "",
        type: 3, // 患者文章类型
        searchName: "", // 文章搜索名字,
        isLoad: true, // 是否还有更多
        loading: false,
        noResult: false,
        page: 1, // 页数
        limit: 10, // 每页条数
        articlesList: [] // 文章列表数据
      }
    },
    methods: {
      /**
       * 头部搜索框
       * 如果执行模糊查询,page初始为1**/
      onSearch() {
        this.page = 1
        this.getArticlesList()
      },

      // 重新输入
      inputAgain() {
        this.searchName = ""
        this.noResult = false
        this.$nextTick(() => {
          try {
            let searchInput = document.getElementsByClassName(
              "van-field__control"
            )[0]
            searchInput.focus()
          } catch (e) {
            console.log(e)
          }
        })
      },

      headerBack() {
        this.$router.go(-1)
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
              this.noResult = false
              if (res.data.data.length === 0) {
                this.noResult = true
              }
              this.articlesList =
                this.page !== 1
                  ? this.articlesList.concat(res.data.data)
                  : res.data.data
              this.isLoad = res.data.hashMore === true
            } else {
              console.log("获取文章接口业务报错")
            }
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      }
    },
    created() {
      if (this.$route.query.articleType) {
        this.type = this.$route.query.articleType
      }
      this.$nextTick(() => {
        try {
          let searchInput = document.getElementsByClassName(
            "van-field__control"
          )[0]
          searchInput.focus()
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .articles_search_page {
    width: 100%;
    box-sizing: border-box;
    .margin(54, 0, 0, 0);
    .padding(0, 12, 0, 12);
  }
</style>
