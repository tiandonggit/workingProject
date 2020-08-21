/** *@desc 患者端文章列表组件 *@author houpai *@date 2019/07/04 09:53:10 */
<template>
  <div class="articles_list_page">
    <waterfall :col="2" :data="articlesListCopy" @loadmore="loadmore">
      <template>
        <div class="articles-item"
             v-for="(item,index) in articlesListCopy"
             @click.stop="readArticleDetail(item.articleid,item)"
             :key="index">
          <div class="article_img_box">
            <img :src="item.articlelogourl" alt=""/>
            <p class="title_box">
              {{item.articletitle}}
            </p>
          </div>
          <div class="article-body">
            <img src="../../../assets/images/docPlan.png"
                 alt=""
                 class="doctor_photo"
                 v-if="articleType === 6"/>
            <img
                :src="item.docurl"
                alt=""
                class="doctor_photo"
                v-else-if="item.articletype === 2"/>
            <img
                src="../../../assets/images/pingtai.png"
                alt=""
                class="doctor_photo"
                v-else/>
            <span class="doctor" :class="[{ flexSpan: item.articletype !== 2 }]">
              {{ articleType === 6 ? "康复方案": item.articletype === 2 ? item.docname :"健康资讯"}}
            </span>
          </div>
        </div>
      </template>
    </waterfall>
    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"></van-loading>
  </div>
</template>

<script>
  export default {
    name: "articlesList",
    props: {
      articleType: {
        type: [Number, String],
        default() {
          return 3;
        }
      },
      searchName: {
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
      },
      // 限制是否继续加载,首页文章列表只固定请求10条
      isLoad: {
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
        loadMoreToggle: true, // 是否还有更多
        loading: false,
        page: 2, // 页数
        limit: 10 // 每页条数
      };
    },
    methods: {
      /**
       * 查看文章详情
       * @params id 文章id**/
      readArticleDetail(id,item) {
        if (id) {
          this.$router.push({
            path: "articleDetail",
            query: {
              articleId: id,
              docname:this.articleType === 6 ? "康复方案" : "健康资讯"
            }
          });
        }
      },

      /**
       * 瀑布流无限加载
       * **/
      loadmore() {
        if (this.loadMoreToggle && this.isLoad) {
          this.loading = true;
          this.$http
            .request({
              method: "get",
              url: "/PArticleController/selectArticle",
              body: {
                type: this.articleType,
                searchName: this.searchName,
                page: this.page,
                limit: this.limit
              }
            }).then(res => {
            this.loading = false;
            if (res.data.success && res.data.data) {
              this.page++;
              this.loading = false;
              this.articlesListCopy = this.articlesListCopy.length
                ? this.articlesListCopy.concat(res.data.data)
                : res.data.data;
              this.loadMoreToggle = res.data.hashMore === true;
            } else {
              console.log("获取文章接口业务报错");
            }
          }).catch(e => {
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
    margin: 5px;
    border-radius: 8px;
    overflow: hidden;

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
      height: 48px;
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

      .doctor_photo {
        display: block;
        width: 26px;
        height: 26px;
        border-radius: 50%;
      }

      .doctor {
        .fontSize(14);
        .lineHeight(18);
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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
