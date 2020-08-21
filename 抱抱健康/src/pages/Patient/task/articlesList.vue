/** *@desc 患者端文章列表组件 *@author houpai *@date 2019/07/04 09:53:10 */
<template>
  <div class="articles_list_page">
    <ul class="articles_list">
      <li v-for="(item, index) in articlesList"
          :class="[{'withoutBorder':index === articlesList.length - 1}]"
          @click.stop="readArticleDetail(item.articleid)"
          :key="index">
        <img :src="item.articlelogourl" alt="">
        <ul class="articles_desc">
          <li class="articles_title">
            {{ item.articletitle }}
          </li>
          <li class="doctor_detail">
            <span class="doctor_name">
              {{ item.articletype === 2 ? item.docname : "健康资讯" }}
            </span>
            <span class="docdepartment">{{ item.docdepartment }}</span>
            <span class="dochospital">{{ item.dochospital }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "articlesList",
    props: {
      articlesList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      /**
       * 查看文章详情
       * @params id 文章id**/
      readArticleDetail(id) {
        if (id) {
          this.$router.push({
            path: "articleDetail",
            query: {
              articleId: id
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .articles_list_page {
    .articles_list {
      li.withoutBorder {
        border-bottom: none;
      }
      li {
        display: flex;
        box-sizing: border-box;
        .padding(15, 0, 15, 0);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        img {
          display: block;
          .width(60);
          .height(60);
          .borderRadius(10, 10, 10, 10);
          .margin(0, 10, 0, 0);
        }

        .articles_desc {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .articles_title {
            .padding(6,0,0,0);
          }

          .doctor_detail  {
            .padding(0,0,6,0);
          }

          li {
            display: block!important;
            .padding(0, 0, 0, 0);
            /*<!--.overflowline(1);-->*/
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: -webkit-box;
            border-bottom: none;
            .docdepartment {
              .margin(0,10,0,0);
            }
          }

          .articles_title {
            .fontSize(16);
            .lineHeight(20);
            overflow: hidden;
            font-weight:400;
            color:rgba(51,51,51,1);
          }

          .doctor_name {
            .fontSize(14);
            .lineHeight(18);
            font-weight:400;
            color:rgba(51,51,51,1);
            .margin(0,10,0,0);
          }

          .hospital_name {
            .margin(0,10,0,0);
          }

          span {
            .fontSize(14);
            .lineHeight(18);
            font-weight:400;
            color:rgba(153,153,153,1);
          }
        }
      }
    }
  }
</style>
