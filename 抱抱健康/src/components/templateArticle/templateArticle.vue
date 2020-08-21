/**
* @Description: 公众号模板文章(v1.13新增)
* @Author: 侯湃
* @Date: 2020/7/16
*/
<template>
  <div class="templateArticle_page">
    <common-header
        :share-disabled="false"
        :header-show="false"
        :custom-title="'内容详情'"
    ></common-header>
    <div class="content-block">
      <p class="article_title">
        <span>{{ articleMsg.title || ''}}</span>
      </p>
      <div class="article_html"
           v-html="articleMsg && articleMsg.content"></div>
    </div>
    <div class="gaps">
      <img src="../../assets/images/icon_artical_bottom.png" alt=""/>
    </div>
    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"
    ></van-loading>
  </div>
</template>

<script>

  import commonHeader from "../../components/commonHeader/common_header";

  export default {
    name: "templateArticle",
    components: {
      commonHeader
    },
    computed: {
      requestUrl() {
        let requestUrl = "";
        if (this.type == 1) {
          requestUrl = "/DepartmentIllnessArticleController/selectByPrimaryKey";
        } else if (this.type == 2) {
          requestUrl = "/NNutritionScoreArticleController/selectByPrimaryKey";
        }
        return requestUrl;
      }
    },
    data() {
      return {
        loading: false,
        type: '',
        id: "",
        articleMsg: {
          content: "",
          title: ""
        }
      };
    },
    methods: {
      /**
       * 获取文章详情
       * **/
      getArticleDetail() {
        this.loading = true
        this.$http.request({
          url: this.requestUrl,
          method: "get",
          body: {
            type: this.type,
            id: this.id
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success && res.data.data) {
            this.articleMsg = res.data.data;
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(err => {
          this.loading = false;
          console.log(err);
        });
      }
    },
    created() {
      this.type = this.$route.query.type || '';
      this.id = this.$route.query.id || '';
      this.getArticleDetail();
    }
  };
</script>

<style scoped lang="less">
  .article_html /deep/ img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    margin: 0 auto;
    text-align: center;
    .borderRadius(8, 8, 8, 8);
    .margin(0, 0, 10, 0);
  }

  .templateArticle_page {
    box-sizing: border-box;
    .padding(0, 0, 64, 0);


    .content-block {
      .width(351);
      margin: 5.3vw auto 0;
      border-top-left-radius: 2.7vw;
      background-color: @backgroundColorT;
      background-image: url("../../assets/images/icon_artical_top.png");
      background-position: right -2px;
      background-repeat: no-repeat;
      background-size: 30px;

      .article_title {
        display: flex;
        .padding(14, 40, 14, 10);

        span {
          display: inline-block;
          flex: 1;
          text-align: left;
          .fontSize(20);
          .lineHeight(24);
          font-weight: 500;
          color: @titleColor;
        }
      }


      .article_html {
        width: 90%;
        margin: 0 auto;
        overflow: hidden;
        word-wrap: break-word;
        //.margin(0, 16, 0, 16);
        letter-spacing: 2px;
        line-height: 24px;
        .padding(0, 0, 10, 0);
      }
    }

    .gaps {
      width: 93.6vw;
      margin: 0 auto;

      img {
        width: 100%;
      }
    }
  }
</style>
