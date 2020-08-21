/* * @Author: 田东 * @Date: 2020-01-07 16:34:04 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-08 09:49:17 * @name 瀑布流文章列表 */
<template>
  <div class="articles_list_page">
    <waterfall :col="2" :data="articlesListCopy" @loadmore="loadmore">
      <template>
        <div
          class="articles-item"
          v-for="(item, index) in articlesListCopy"
          @click.stop="readArticleDetail(item)"
          :key="index"
        >
          <div class="article_img_box">
            <img :src="item.articlelogourl" alt="" />
            <p class="title_box">
              {{ item.articletitle }}
            </p>
          </div>
          <div class="article-body">
            <img
              :src="item.docurl"
              alt=""
              class="doctor_photo"
              v-if="item.articletype === 2"
            />
            <img
              src="../../../assets/images/docPlan.png"
              alt=""
              class="doctor_photo"
              v-else-if="type === 6"
            />
            <img
              src="../../../assets/images/pingtai.png"
              alt=""
              class="doctor_photo"
              v-else
            />

            <span
              class="doctor"
              :class="[{ flexSpan: item.articletype !== 2 }]"
            >
              {{ item.articletype === 2 ? item.docname : type === 6 ? "康复方案" : "医学中心" }}
            </span>
          </div>
        </div>
      </template>
    </waterfall>
    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
export default {
  name: "articlesList",
  props: {
    articlesList: {
      type: Array,
      default() {
        return [];
      }
    },
    searchName: {
      type: String,
      default() {
        return "";
      }
    },
    type: {
      type: Number,
      default() {
        return 2;
      }
    },
    loadMoreToggle: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  watch: {
    articlesList() {
      this.articlesListCopy = this.articlesList;
    }
  },
  data() {
    return {
      articlesListCopy: [],
      // searchName: "", // 文章搜索名字,
      hashMore: true, // 是否还有更多
      loading: false,
      page: 2, // 页数
      limit: 10 // 每页条数
      // articlesList: [] // 文章列表数据
    };
  },
  methods: {
    /**
     * 查看文章详情
     * @params id 文章id**/
    readArticleDetail(item) {
      if (item) {
        this.$router.push({
          path: "docArticlesDetail",
          query: {
            articleId: item.articleid,
            docname: this.type == 6 ? "康复方案" : "医学中心"
          }
        });
      }
    },

    /**
     * 瀑布流无限加载
     * **/
    loadmore() {
      if (this.loadMoreToggle) {
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
              this.articlesListCopy = this.articlesListCopy.length
                ? this.articlesListCopy.concat(res.data.data)
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
      }
    }
  },
  created() {
    this.$nextTick(() => {
      let ohtml = document.getElementById("htmlId");
      ohtml.style.height = "auto";
    });
  },
  beforeDestroy() {
    let ohtml = document.getElementById("htmlId");
    ohtml.style.height = "100%";
  }
};
</script>

<style lang="less" scoped>
.articles-item {
  .margin(5, 5, 10, 5);
  .borderRadius(8, 8, 8, 8);
  overflow: hidden;

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
      .fontSize(16);
      color: @fontOne;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; // 控制多行的行数
      -webkit-box-orient: vertical;
      .lineHeight(22);
      .padding(2, 10, 2, 10);
      background: rgba(0, 0, 0, 0.2);
    }
  }

  .article-body {
    .height(52);
    background-color: @backgroundColorT;
    .borderRadius(0, 0, 8, 8);
    box-sizing: border-box;
    .padding(10, 10, 10, 10);
    display: flex;
    align-items: center;
    .fontSize(14);
    font-weight: 400;
    color: @subtitleColor;

    span {
      flex: 1;
      width: 0;
      box-sizing: border-box;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .margin(0, 0, 0, 10);
    }

    .doctor_photo {
      display: block;
      .width(32);
      .height(32);
      border-radius: 50%;
    }

    .doctor {
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .fontSize(14);
      color: @subtitleColor;
      .lineHeight(32);
    }

    .hospital {
      flex: 1;
      width: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

.noHasMore {
  text-align: center;
  padding: 6px 0;
}
</style>
