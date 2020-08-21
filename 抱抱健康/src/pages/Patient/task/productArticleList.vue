/**
*@desc 产品推荐文章列表页(多个产品推荐的时候任务页分为多个今日学习文章,so 加了这个页)
*@author houpai
*@date 2020/03/10 16:22:57
*/
<template>
  <div class="productArticleList_page">
    <common-header
        :share-disabled="true"
        :custom-title="'产品使用指导'"
    ></common-header>

    <van-list v-model="loading"
              :finished="finished"
              :error.sync="error"
              error-text="请求失败，点击重新加载"
              finished-text="没有更多了"
              @load="onLoad">
      <div class="article_list">
        <div class="articles-item"
             :class="[{'noBorderBottom':index === productArticleList.length - 1}]"
             v-for="(item,index) in productArticleList"
             @click.stop="productDescView(item)"
             :key="index">
          <div class="article_img_box">
            <img :src="item.logourl" alt=""/>
          </div>
          <div class="article_body">
            {{item.title || ""}}
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "productArticleList",
    components: {
      commonHeader
    },
    data() {
      return {
        orderId: "", // 产品文章列表请求参数,从url中获取(微信公众号模板消息跳转)
        loading: false,
        productArticleList: [],
        finished: false, // 是否全部加载完毕
        page: 1,
        limit: 20,
        error:false
      };
    },
    methods: {
      /**
       * 获取产品文章列表
       * **/
      getProductArticleList() {
        this.loading = true;
        this.$http.request({
          method: "get",
          url: "/TaskPushGoodsController/selectPageModelS",
          body: {
            orderId: this.orderId,
            page: this.page,
            limit: this.limit
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success && res.data.data) {
            this.productArticleList = this.page !== 1
              ? this.articlesList.concat(res.data.data)
              : res.data.data;
            this.finished = !res.data.hashMore;
            this.page++;
          } else {
            console.log("获取产品文章列表报错 -->", "/PArticleController/selectArticle");
            this.error = true;
          }
        }).catch(e => {
          this.loading = false;
          this.error = true;
          console.log(e);
        });
      },

      /**
       * 分页加载
       * **/
      onLoad() {
        setTimeout(() => {
          this.getProductArticleList();
        }, 500);
      },

      /**
       * 查看产品使用文章详情
       * 取产品说明列表里的sessionId和doctorId
       * (IM聊天必要参数,如果未关联医生,参数为空,文章详情里隐藏聊天按钮)
       * **/
      productDescView(item) {
        this.$router.push({
          path: "/diseaseMessage",
          query: {
            id: item.id,
            type: "study",
            sessionId: item.sessionid || '',
            doctorId: item.rdoctorid || '',
            userid: item.userid || '' // 知识学习特殊参数
          }
        });
      }
    },
    created() {
      if (this.$route.query.id) {
        this.orderId = this.$route.query.id;
      }
    }
  };
</script>

<style scoped lang="less">
  .productArticleList_page {
    .padding(10, 12, 12, 12);

    .article_list {
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);
    }

    .articles-item.noBorderBottom {
      border-bottom: 0;
    }

    .articles-item {
      display: flex;
      align-items: center;
      .padding(14, 10, 14, 10);
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);

      .article_img_box {
        .margin(0, 10, 0, 0);
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;

        img {
          display: block;
          .width(78);
          .height(78);
        }
      }

      .article_body {
        flex: 1;
        width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .fontSize(16);
        .lineHeight(20);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
</style>
