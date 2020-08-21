/* * @Author: 田东 * @Date: 2020-01-13 17:20:32 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-13 17:23:03 * @name 查看患者问卷调查 */
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
        <van-radio-group v-if="item.queryType === 0" v-model="item.answer">
          <van-radio
            disabled
            :name="subItem.id"
            v-for="(subItem, subIndex) in item.list"
            :key="subIndex"
            >{{ subItem.title }}</van-radio
          >
        </van-radio-group>
        <!--        多选-->
        <van-checkbox-group v-if="item.queryType === 1" v-model="item.answer">
          <van-checkbox
            disabled
            :name="subItem.id"
            v-for="(subItem, subIndex) in item.list"
            :key="subIndex"
            shape="square"
            >{{ subItem.title }}</van-checkbox
          >
        </van-checkbox-group>
        <!--        问答-->
        <van-cell-group v-if="item.queryType === 2">
          <van-field
            v-model="item.answer"
            type="textarea"
            disabled
            autosize
            placeholder="请如实填写真实情况.(限200字)"
            maxlength="200"
          ></van-field>
        </van-cell-group>
      </li>
    </ul>
    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);

export default {
  name: "questionnaire",
  components: {
    commonHeader
  },
  data() {
    return {
      id: "", // 调查问卷查询参数,
      patientId: "",
      questionnaireData: [], // 调查问卷
      pageTitle: "", // 网页标题
      loading: false
    };
  },
  methods: {
    /**
     *  获取调研数据**/
    getQuestionnaireData() {
      this.loading = true;
      this.$http
        .request({
          method: "get",
          url: "/TaskQueryController/selectTaskQueryAnswerP",
          body: {
            id: this.id,
            patientId: this.patientId
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.loading = false;
            this.questionnaireData =
              res.data.data.data || this.questionnaireData;

            this.questionnaireData.forEach((item, index) => {
              if (item.queryType == 1) {
                //如果是多选
                item.answer = item.answer.split(",");
              }
            });

            this.pageTitle =
              res.data.data.data[0] && res.data.data.data[0].title;
          } else {
            console.log("调查问卷查询接口报错");
          }
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.patientId = this.$route.query.patientId;
      localStorage.setItem("questionnaireId", this.id);
      localStorage.setItem("questionnairepatientId", this.patientId);
      this.getQuestionnaireData();
    } else {
      this.id = localStorage.getItem("questionnaireId");
      this.patientId = localStorage.getItem("questionnairepatientId");
      this.getQuestionnaireData();
    }
  }
};
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}

.questionnaire_page {
  .padding(64, 0, 0, 0);

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
        font-family: PingFangSC-Medium, PingFang SC;
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
          border: 2px solid #67abff;
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
        // .height(154);
        background: @backgroundColorT;
        .borderRadius(0, 0, 10, 10);
        .padding(5, 18, 5, 18);

        .van-radio,
        .van-checkbox {
          .margin(9, 0, 19, 0);

          .van-radio__label,
          .van-checkbox__label {
            .fontSize(16);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: @titleColor;
            .lineHeight(18);
          }

          // &:last-child {
          //   margin: 0;
          // }
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

      /deep/ .van-checkbox__icon .van-icon {
        .borderRadius(5, 5, 5, 5);
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
  .van-loading {
    text-align: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    color: @titleColor;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
