/* * @Author: 田东 * @Date: 2019-10-29 16:33:20 * @Last Modified by: 田东 *
@Last Modified time: 2019-10-29 16:33:20 * @name 营养风险筛查 */

<template>
  <div id="nutritionalRisk">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>

    <div class="card-box">
      <p class="box-title">营养风险筛查</p>
      <div class="question">
        <p class="question-name">
          1.患者在过去3个月有体重下降吗？
          <span>(单选)</span>
          <span class="denger" v-show="isShow1">*</span>
        </p>
        <van-radio-group v-model="radio1">
          <van-radio name="1">是</van-radio>
          <van-radio name="0">否</van-radio>
        </van-radio-group>
      </div>
      <div class="question">
        <p class="question-name">
          2.患者在过去1周内有摄食减少吗？
          <span>(单选)</span>
          <span class="denger" v-show="isShow2">*</span>
        </p>
        <van-radio-group v-model="radio2">
          <van-radio name="1">是</van-radio>
          <van-radio name="0">否</van-radio>
        </van-radio-group>
      </div>
      <div class="question">
        <p class="question-name">
          3.患者有严重疾病吗？
          <span>(单选)</span>
          <span class="denger" v-show="isShow3">*</span>
        </p>
        <van-radio-group v-model="radio3">
          <van-radio name="1">是</van-radio>
          <van-radio name="0">否</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="v-bottom">
      <van-button @click="$throttle(submitPatient)" class="v-nextBottom" type="warning">
        <span>提交信息</span>
      </van-button>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast, Dialog } from "vant";
import { mapState } from "vuex";

export default {
  name: "nutritionalRisk",
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      title: "营养风险筛查",
      customTitle: "营养风险筛查",
      BMI: "",
      radio1: "",
      isShow1: false,
      radio2: "",
      isShow2: false,
      radio3: "",
      isShow3: false
    };
  },
  components: {
    commonHeader
  },
  created() {},
  methods: {
    submitPatient() {
      let isPass = 0;
      if (!this.radio1) {
        this.isShow1 = true;
        isPass = 1;
      } else {
        this.isShow1 = false;
      }
      if (!this.radio2) {
        this.isShow2 = true;
        isPass = 1;
      } else {
        this.isShow2 = false;
      }
      if (!this.radio3) {
        this.isShow3 = true;
        isPass = 1;
      } else {
        this.isShow3 = false;
      }
      if (isPass == 1) {
        this.Dialog();
        return;
      }
      // 全部选否
      if (this.radio1 == 0 && this.radio2 == 0 && this.radio3 == 0) {
        this.$http
          .request({
            method: "post",
            url:
              "/NNutritionPrescribePatientAssessmentController/insertAssessmentNP",
            body: {
              npatientid: window.sessionStorage.getItem("id"),
              assessmentone: "否",
              assessmentthree: "否",
              assessmenttwo: "否"
            }
          })
          .then(res => {
            let data = res.data;
            if (data.success) {
              if (this.Patient.isIM) {
                this.Patient.pathNum = 4;
                this.$router.push({
                  name: "screeningResult",
                  query: { score: data.total, from: "im" }
                });
              } else {
                if (this.Patient.isDoc) {
                  this.$router.push({
                    name: "screeningResult",
                    query: { score: data.total }
                  });
                } else {
                  this.$router.push({
                    name: "screeningResult",
                    query: { score: data.total, id: window.sessionStorage.getItem("id"), type: 10 }
                  });
                }

              }

            } else {
              Toast(data.message);
            }
          })
          .catch(() => {
            Toast("接口异常");
          });
      } else {
        let riskArr = [this.radio3, this.radio1, this.radio2];
        this.Patient.pathNum = 5;
        this.$router.push({
          name: "nutritionalRiskScreening",
          query: { riskArr: riskArr }
        });
      }
    },
    Dialog() {
      Dialog.confirm({
        title: "操作提示",
        message: "当前有未选择问题，请选择后进行下一步"
      })
        .then(() => {})
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
#nutritionalRisk {
  padding-top: 1px;
  .card-box {
    width: 351px;
    margin: 0 12px;
    background: @backgroundColorff;
    border-radius: 10px;
    margin-top: 60px;

    .box-title {
      font-size: 18px;
      font-weight: 400;
      color: @fontColor33;
      line-height: 45px;
      text-align: center;
    }
    /deep/ .van-radio {
      margin-top: 10px;
      height: 25px;

      .van-radio__icon .van-icon {
        width: 20px;
        height: 20px;
      }

      .van-radio__label {
        font-size: 16px;
      }
    }
    .question {
      padding: 14px 10px;
      border-top: 1px solid @backcolorF1;

      .question-name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @fontColor66;
        line-height: 16px;

        span {
          font-size: 16px;
          color: @mainColor;
        }

        .denger {
          color: @fontColorRed;
          float: right;
          line-height: 24px;
        }
      }
    }
  }

  .v-bottom {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    .margin(18);
    display: flex;
    justify-content: center;

    .v-nextBottom {
      .width(351);
      .height(44);
      .lineHeight(44);

      span {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @fontColorff;
        line-height: 22px;
      }
    }
  }
}
</style>
