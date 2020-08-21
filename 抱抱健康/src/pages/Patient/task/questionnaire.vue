<template>
  <div class="questionnaire_page">
    <common-header
        :share-disabled="true"
        :custom-title="pageTitle"
        :header-show="true"
        title="调研问答"
    ></common-header>
    <ul class="questionnaire_box">
      <li v-for="(item, index) in questionnaireData" :key="index">
        <div class="question_title" :class="{ inputBox: item.queryType === 2 }">
          <div class="index-num">
            <span>{{ index + 1 }}</span>
          </div>
          <div class="title">
            {{ item.titleQuery }}
          </div>
          <div class="text">
            <span class="right-text" v-if="item.queryType === 0">单选</span>
            <span class="right-text" v-if="item.queryType === 1">多选</span>
          </div>
        </div>
        <!--        单选-->
        <van-radio-group v-if="item.queryType === 0" v-model="item.check">
          <van-radio
              :name="subItem.id"
              v-for="(subItem, subIndex) in item.list"
              :key="subIndex"
          >{{ subItem.title }}
          </van-radio
          >
        </van-radio-group>
        <!--        多选-->
        <van-checkbox-group v-if="item.queryType === 1" v-model="item.check">
          <van-checkbox
              :name="subItem.id"
              v-for="(subItem, subIndex) in item.list"
              :key="subIndex"
              shape="square"
          >{{ subItem.title }}
          </van-checkbox
          >
        </van-checkbox-group>
        <!--        问答-->
        <van-cell-group v-if="item.queryType === 2">
          <van-field
              v-model="item.check"
              type="textarea"
              autosize
              placeholder="请如实填写真实情况.(限200字)"
              maxlength="200"
          ></van-field>
        </van-cell-group>
      </li>
    </ul>
    <div class="footer-box">
      <div class="next-btn"
           @click.stop="submitQuestionnaireNoRepeat"
           v-if="questionnaireData">
        <van-button slot="button" class="next-btn" size="large">完成提交</van-button>
      </div>
    </div>
    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header"
  import Vue from "vue"
  import {Toast} from "vant"

  Vue.use(Toast)

  export default {
    name: "questionnaire",
    components: {
      commonHeader
    },
    data() {
      return {
        id: "", // 调查问卷查询参数,
        ids: "", // 调查问卷提交状态参数
        questionnaireData: [], // 调查问卷
        pageTitle: "", // 网页标题
        loading: false // loading
      }
    },
    methods: {
      /**
       *  获取调研数据**/
      getQuestionnaireData() {
        this.loading = true
        this.$http
          .request({
            method: "get",
            url: "/TaskQueryController/selectTaskQuery",
            body: {
              id: this.id
            }
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              this.loading = false
              this.questionnaireData =
                res.data.data.data || this.questionnaireData
              this.pageTitle =
                res.data.data.data[0] && res.data.data.data[0].title
            } else {
              console.log("调查问卷查询接口报错")
            }
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      },

      /**
       * 提交问卷 拼接json参数
       * 校验填写内容,添加非空校验**/
      submitQuestionnaire() {
        // 拼接参数
        let queryjson = []
        let complete = true
        this.questionnaireData.forEach(item => {
          let answerObj = {}
          answerObj.taskQueryItemId = item.queryId
          answerObj.type = item.queryType
          if (item.queryType === "1" || item.queryType === 1) {
            answerObj.taskqueryitemchooseid =
              (item.check && item.check.join()) || ""
            if (!answerObj.taskqueryitemchooseid) {
              complete = false
            }
          }
          if (item.queryType === "0" || item.queryType === 0) {
            answerObj.taskqueryitemchooseid = item.check
            if (!answerObj.taskqueryitemchooseid) {
              complete = false
            }
          }
          if (item.queryType === "2" || item.queryType === 2) {
            answerObj.answer = item.check
            if (!answerObj.answer) {
              complete = false
            }
          }
          queryjson.push(answerObj)
        })
        // 参数非空校验
        if (!complete) {
          Toast({
            message: "请回答全部问题",
            position: "bottom"
          })
          return false
        } else {
          this.$http
            .request({
              method: "post",
              url: "/TaskQueryItemChooseController/insertTaskQuery",
              body: {
                queryJson: JSON.stringify(queryjson),
                ids: this.ids,
                ida: this.id
              }
            })
            .then(res => {
              if (res.data.success) {
                console.log("问卷调差提交成功")
                this.$router.go(-1)
              } else {
                console.log("提交问卷调查接口报错")
              }
            })
            .catch(e => {
              console.log(e)
            })
        }
      },

      /**
       * 函数节流,防止连续点击多次提交**/
      submitQuestionnaireNoRepeat() {
        let _this = this
        this.$throttle(_this.submitQuestionnaire)
      }
    },
    created() {
      if (this.$route.query.id && this.$route.query.ids) {
        this.id = this.$route.query.id
        this.ids = this.$route.query.ids
        localStorage.setItem("questionnaireId", this.id)
        localStorage.setItem("questionnaireIds", this.ids)
        this.getQuestionnaireData()
      } else {
        this.id = localStorage.getItem("questionnaireId")
        this.ids = localStorage.getItem("questionnaireIds")
        this.getQuestionnaireData()
      }
    }
  }
</script>

<style scoped lang="less">
  * {
    box-sizing: border-box;
  }

  .questionnaire_page {
    .padding(64, 0, 64, 0);

    .questionnaire_box {
      li {
        .width(351);
        .margin(0, 12, 15, 12);
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;

        .question_title {
          .height(74);
          .lineHeight(22);
          .fontSize(18);
          font-weight: 500;
          color: @fontOne;
          .lineHeight(22);
          .padding(15, 10, 15, 12);
          background-image: url("../../../assets/images/bg-xuanze.png");
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 93.6vw;
          display: flex;
          align-content: center;

          .index-num {
            .width(24);
            .height(24);
            .margin(10, 0, 0, 0);
            border-radius: 50%;
            background: @backgroundColorT;
            border: 2px solid #67ABFF;
            display: flex;
            align-content: center;
            justify-content: center;

            span {
              .fontSize(16);
              font-weight: 400;
              color: @mainColor;
              .lineHeight(20);
              margin: 0;
            }
          }

          .title {
            flex: 1;
            width: 0;
            position: relative;
            .padding(0, 0, 0, 10);
            display: flex;
            align-items: center;
            word-break: break-all;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .text {
            .width(30);
            position: relative;

            .right-text {
              position: absolute;
              top: -3.5vw;
              right: -0.5vw;
              .fontSize(14);
              font-weight: 400;
              color: @mainColor;
              .lineHeight(14);
            }
          }
        }

        .inputBox {
          background-image: url("../../../assets/images/bg-wenben.png");
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 93.6vw;
        }

        /deep/ .van-cell-group {
          .height(154);

          textarea {
            .fontSize(16);
          }
        }

        /deep/ .van-radio-group,
        /deep/ .van-checkbox-group {
          /*<!--.height(154);-->*/
          background: @backgroundColorT;
          .borderRadius(0, 0, 10, 10);
          .padding(5, 18, 5, 18);

          .van-radio,
          .van-checkbox {
            .margin(10, 0, 20, 0);

            .van-radio__label,
            .van-checkbox__label {
              .fontSize(16);
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: @titleColor;
              .lineHeight(16);
            }

            &:last-child {
              margin: 0;
            }
          }
        }

        /deep/ .van-checkbox__icon,
        /deep/ .van-radio__icon {
          .width(16);
          .height(16);
          .fontSize(16);
        }

        /deep/ .van-checkbox__icon--checked .van-icon,
        /deep/ .van-radio__icon--checked .van-icon {
          background-color: @mainColor;
          border-color: @mainColor;
        }
      }
    }

    .submit_btn {
      position: fixed;
      left: 12px;
      right: 12px;
      bottom: 20px;
      .height(46);
      .lineHeight(46);
      .borderRadius(4, 4, 4, 4);
      .fontSize(16);
      text-align: center;
      background: @mainColor;
      font-weight: 400;
      color: @fontOne;
    }
  }
</style>
