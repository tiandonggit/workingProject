/*
 * @Author: 田东
 * @Date: 2020-01-07 13:19:03
 * @Last Modified by: 田东
 * @Last Modified time: 2020-01-07 13:21:07
 * @name 名医公开课文章列表
 */
<template>
  <div class="articles_list_page">
    <ul class="articles_list">
      <li v-for="(item, index) in list" @click.stop="readArticleDetail(item)" :key="index">
        <p class="articles_title">
          <img :src="item.docurl" alt class="doctor_photo" v-if="item.articletype === 2" />
          <img src="../../../assets/images/pingtai.png" alt class="doctor_photo" v-else />
          <span class="doctor" :class="[{ flexSpan: item.articletype !== 2}]">{{ item.docname}}</span>
          <span
            class="hospital"
            v-if="item.articletype === 2"
          >{{ item.dochospital }} {{ item.docdepartment }}</span>
          <span class="hospital" v-else></span>
        </p>
        <p class="article_summary">{{ item.articletitle }}</p>
        <div class="article_img_box">
          <img :src="item.articlelogourl" alt />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "articlesList",
  props: {
    title: {
      type: String,
      default() {
        return "";
      }
    },
    articlesList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    list: function() {
      for (let i = 0; i < this.articlesList.length; i++) {
        if (this.articlesList[i].articletype == 1) {
          if (this.title == "名医公开课") {
            this.articlesList[i].docname = "名医公开课";
          } else {
            this.articlesList[i].docname = "医学中心";
          }
        }
      }

      return JSON.parse(JSON.stringify(this.articlesList));
    }
  },
  methods: {
    /**
     * 查看文章详情
     * @params id 文章id**/
    readArticleDetail(item) {
      if (item.articleid) {
        this.$router.push({
          path: "docArticlesDetail", // articleDetail
          query: {
            docname: item.docname,
            articleId: item.articleid
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.articles_list_page {
  .articles_list {
    li {
      .margin(0, 0, 15, 0);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      .padding(15, 15, 15, 15);
      .borderRadius(10, 10, 10, 10);
      background: @backgroundColorT;
      .articles_title {
        display: flex;
        align-content: center;

        .doctor_photo {
          display: block;
          .width(34);
          .height(34);
          border-radius: 50%;
        }

        .doctor {
          display: inline-block;
          max-width: 64px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 3.73333333vw;
          color: @subtitleColor;
          margin-left: 2.66666667vw;
          line-height: 34px;
        }

        .flexSpan {
          display: inline-block !important;
          flex: 1 !important;
          max-width: 100% !important;
        }

        .hospital {
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          .fontSize(11);
          color: @descriptionColor;
          margin-left: 10 / 375 * 100vw;
          line-height: 34px;
        }
      }

      .article_summary {
        width: 100%;
        .height(30);
        .lineHeight(30);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .fontSize(16);
        color: @titleColor;
        //.margin(15, 15, 15, 15);
      }

      .article_img_box {
        width: 100%;
        .height(145);
        .borderRadius(8, 8, 8, 8);
        overflow: hidden;

        img {
          display: block;
          width: 100%;
        }
      }

      &:last-child {
        margin: 0;
      }
    }
  }
}
</style>
