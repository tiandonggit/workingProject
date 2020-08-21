/**
*@desc 问题详情
*@author houpai
*@date 2019/11/07 10:31:07
*/
<template>
  <div class="answerByAssistant_page">
    <common-header
        :share-disabled="true"
        :header-show="true"
        :title="'详情'"
        :custom-title="'咨询管理'"
    ></common-header>
    <div class="top_backGround">
      <img src="../../assets/images/anwserAssistantBackGround.png" alt="">
    </div>
    <div class="content_box">
      <div class="content">
        <h3 class="answer_title">
          {{answerTitle}}
        </h3>
        <p class="answer_content">
          {{answerContent}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from '../../components/commonHeader/common_header'

  export default {
    name: "answerByAssistant",
    components: {
      commonHeader
    },
    data() {
      return {
        answerId: '',
        answerTitle: '',
        answerContent: '',
      }
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1)
      },
      /**
       * 获取问题答案**/
      getAnswer(id) {
        this.$http.request({
          method: "get",
          url: "/PQuestionAnswerController/selectByPrimaryKey",
          body: {
            id: id
          }
        }).then((res) => {
          if (res.data.success) {
            this.answerTitle = res.data.data.question || ''
            this.answerContent = res.data.data.answer || ''
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    },
    created() {
      if (this.$route.query.answerId) {
        this.answerId = this.$route.query.answerId
        this.getAnswer(this.answerId)
      }
    }
  }
</script>

<style scoped lang="less">
  .answerByAssistant_page {
    .padding(44, 12, 12, 12);
    box-sizing: border-box;

    .top_backGround {
      .height(112);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .content_box {
      background: linear-gradient(180deg, rgba(1, 153, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
      .padding(12, 12, 12, 12);
      .borderRadius(0,0,10,10);
      overflow: hidden;

      .content {
        .padding(12, 12, 12, 12);
        background: #fff;
        box-sizing: border-box;
        .borderRadius(10, 10, 10, 10);

        .answer_title {
          .fontSize(18);
          .lineHeight(22);
          width: 100%;
          text-align: center;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .answer_content {
          text-indent: 2em;
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          letter-spacing:2 / 375 *100vw;
        }
      }
    }

  }

</style>
