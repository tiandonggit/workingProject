/* * @Author: 田东 * @Date: 2019-10-29 16:33:20 * @Last Modified by: 田东 *
@Last Modified time: 2019-10-29 16:33:20 * @name 营养风险筛查 */

<template>
  <div id="nutritionalRiskScreening">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>

    <div class="card-box-top">
      <p class="title">患者信息</p>
      <div class="item cf">
        <div class="left fl">
          <p>
            科室:
            <span>{{ info.departmentName }}</span>
          </p>
        </div>
        <div class="right fr">
          <p>
            性别:
            <span>{{ info.sex == "1" ? "男" : "女" }}</span>
          </p>
        </div>
      </div>
      <div class="item cf">
        <div class="left fl">
          <p>
            年龄:
            <span>{{ info.age }}</span>
          </p>
        </div>
        <div class="right fr">
          <p>
            身高:
            <span>{{ info.height }}cm</span>
          </p>
        </div>
      </div>
      <div class="item cf">
        <div class="left fl">
          <p>
            体重:
            <span>{{ info.weight }}kg</span>
          </p>
        </div>
        <div class="right fr">
          <p>
            BMI:
            <span>{{ info.bmi }}kg/m²</span>
          </p>
        </div>
      </div>
      <div class="item cf">
        <div class="left fl serumalbumin">
          <p>
            血清白蛋白值:
            <span>{{
              info.serumalbumin ? info.serumalbumin + "g/L" : "无"
            }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="card-box">
      <p class="title">营养风险筛查评估</p>
      <div class="question" v-for="(ques, index) in quesShowList" :key="index">
        <p class="question-name">
          {{ index + 1 }}.{{ ques.name }}
          <span>{{ ques.isRadio ? "(单选)" : "(多选)" }}</span>
          <span class="denger" v-show="!ques.isFill">*</span>
          <span class="explain" v-if="ques.name == '疾病严重程度？'">
            <van-icon name="question" @click="showPopup" />
            <span @click="showPopup">说明</span>
          </span>
        </p>
        <van-radio-group
          v-if="ques.isRadio"
          v-model="ques.radio"
          @change="changeQues3(ques.id, ques.radio)"
        >
          <van-radio
            :name="index + 1"
            v-for="(an, index) in ques.answer"
            :key="index"
            >{{ an.options }}</van-radio
          >
        </van-radio-group>
        <!--        <van-checkbox-group v-if="!ques.isRadio" v-model="selectNo" @change="change()">-->
        <!--          <van-checkbox name="1">其它</van-checkbox>-->
        <!--        </van-checkbox-group>-->
        <van-checkbox-group v-if="!ques.isRadio" v-model="ques.radio">
          <van-checkbox
            :name="index + 1"
            v-for="(an, index) in ques.answer"
            :disabled="isDisabled"
            :key="index"
            >{{ an.options }}</van-checkbox
          >
        </van-checkbox-group>
      </div>
      <div class="question question-age">
        <p class="question-name">
          {{ this.quesShowList.length + 1 }}.患者的年龄
        </p>
        <p class="age-anwser">{{ info.lastverifyadvice }}</p>
      </div>
    </div>
    <div class="v-bottom">
      <van-button
        @click="$throttle(submit)"
        class="v-nextBottom"
        type="warning"
      >
        <span>提交信息</span>
      </van-button>
    </div>
    <van-popup v-model="show">
      <div class="text ">
        <p><span>NRS2002营养风险筛查：</span></p>
        <p>
          <span
            >疾病严重程度评分中，如果与罗列疾病相同就在相应栏目打勾。如果不同则向表中所罗列的诊断靠拢，并参考以下标准，依照调查者的理解进行评分。</span
          >
        </p>
        <p>
          <span
            >1分:慢性疾病患者因出现并发症而住院治疗。病人虚弱但不需卧床。蛋白质需要量略有增加，但可通过口服补充来弥补。</span
          >
        </p>
        <p>
          <span
            >2分：患者需要卧床，如腹部大手术后，蛋白质需要量相应增加，但大多数人仍可以通过肠外或肠内营养支持得到恢复。</span
          >
        </p>
        <p>
          <span
            >3分：患者在加强病房中靠机械通气支持。蛋白质需要量增加而且不能被肠外或肠内营养支持所弥补。但是通过肠外或肠内营养支持可使蛋白质分解和氮丢失明显减少。</span
          >
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast, Dialog } from "vant";
import { mapState } from "vuex";

export default {
  name: "nutritionalRiskScreening",
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      par: {
        scoreOne: "",
        scoreTwo: "",
        scoreThree: "",
        scoreFour: "",
        scoreFive: "",
        scoreSix: "",
        scoreEight: "",
        assessmentone: "",
        assessmenttwo: "",
        assessmentthree: "",
        assessmentfour: "",
        assessmentfive: "",
        assessmentsix: "",
        assessmentseven: "",
        assessmenteight: ""
      },
      isDisabled: false,
      title: "营养风险筛查",
      customTitle: "营养风险筛查",
      BMI: "",
      riskArr: [],
      score: "",
      length: 0,
      info: "",
      show: false,
      id: "", // 营养产品id
      quesListPrev: [
        {
          name: "患者在过去3个月有体重下降吗？",
          key: "assessmentone",
          answer: ["否", "是"]
        },
        {
          name: "患者在过去1周内有摄食减少吗？",
          key: "assessmenttwo",
          answer: ["否", "是"]
        },
        {
          name: "患者有严重疾病吗？",
          key: "assessmentthree",
          answer: ["否", "是"]
        }
      ],
      quesList: [
        {
          name: "疾病严重程度？",
          id: 1,
          key: "assessmentfour",
          scoreKey: "scoreOne",
          radio: [],
          isRadio: false,
          isFill: true,
          answer: [
            // { options: "无", id: "1", score: 0, isDisabled: false },
            { options: "髋骨折", id: "2", score: 1, isDisabled: false },
            {
              options: "慢性疾病有并发症者",
              id: "3",
              score: 1,
              isDisabled: false
            },
            { options: "COPD", id: "4", score: 1, isDisabled: false },
            { options: "血液透析", id: "5", score: 1, isDisabled: false },
            { options: "肝硬化", id: "6", score: 1, isDisabled: false },
            {
              options: "一般恶性肿瘤患者",
              id: "7",
              score: 1,
              isDisabled: false
            },
            { options: "腹部大手术", id: "8", score: 2, isDisabled: false },
            { options: "脑卒中", id: "9", score: 2, isDisabled: false },
            { options: "重度肺炎", id: "10", score: 2, isDisabled: false },
            { options: "血液恶性肿瘤", id: "11", score: 2, isDisabled: false },
            { options: "颅脑损伤", id: "12", score: 3, isDisabled: false },
            { options: "骨髓移植", id: "13", score: 3, isDisabled: false },
            {
              options: "大于APACHE10分ICU患者",
              id: "14",
              score: 3,
              isDisabled: false
            }
          ]
        },
        {
          name: "体重下降是否超过5%？",
          id: 2,
          key: "assessmentfive",
          scoreKey: "scoreThree",
          radio: "",
          isRadio: true,
          isFill: true,
          answer: [
            { options: "是", id: "1", score: 0 },
            { options: "否", id: "2", score: 0 }
          ]
        },
        {
          name: "体重下降时间范围？",
          id: 3,
          key: "assessmentsix",
          scoreKey: "scoreFour",
          radio: "",
          isRadio: true,
          isFill: true,
          answer: [
            { options: "3个月内", id: "1", score: 1 },
            { options: "2个月内", id: "2", score: 2 },
            { options: "1个月内", id: "3", score: 3 }
          ]
        },
        {
          name: "过去1周内进食量较从前减少？",
          id: 4,
          key: "assessmentseven",
          scoreKey: "scoreSix",
          radio: "",
          isRadio: true,
          isFill: true,
          answer: [
            { options: "25～50%", id: "1", score: 1 },
            { options: "50～75%", id: "2", score: 2 },
            { options: "75～100%", id: "3", score: 3 }
          ]
        }
      ],
      quesShowList: [],
      selectNo: []
    };
  },
  created() {
    this.riskArr = this.$route.query.riskArr;
    if (this.riskArr[0] == "1") {
      this.quesShowList.push(this.quesList[0]);
      this.length++;
    }
    if (this.riskArr[2] == "1") {
      this.quesShowList.push(this.quesList[3]);
      this.length++;
    }
    if (this.riskArr[1] == "1") {
      this.quesShowList.push(this.quesList[1]);
      this.length++;
    }
    this.id = window.sessionStorage.getItem("id");
    this.getInfo();
  },
  methods: {
    showPopup() {
      //说明弹出层
      this.show = true;
    },
    getInfo() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/selectByPrimaryKeyId",
          body: { id: this.id }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.info = data.data;
            this.info.height = Math.round(this.info.height * 100);
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    change(value) {
      if (this.selectNo.indexOf("1") >= 0) {
        this.quesShowList[0].answer.forEach((v, e) => {
          this.quesShowList[0].radio = [];
          this.isDisabled = true;
        });
      } else {
        this.isDisabled = false;
      }
    },
    changeQues3(id, radio) {
      if (id !== 2) {
        return;
      }

      if (radio == "1") {
        this.quesShowList.push(this.quesList[2]);
      } else if (radio == "2") {
        if (this.quesShowList.length == this.length) {
          return;
        }

        this.quesShowList.splice(this.quesShowList.length - 1, 1);
        this.par.scoreFour = "";
        // console.log(this.quesShowList);
      }
    },
    Dialog() {
      Dialog.confirm({
        title: "操作提示",
        message: "当前有未选择问题，请选择后进行下一步"
      })
        .then(() => {})
        .catch(() => {});
    },
    submit() {
      let isPass = 0;
      this.quesShowList.forEach((v1, e1) => {
        if (v1.isRadio) {
          if (!v1.radio) {
            this.quesShowList[e1].isFill = false;
            this.Dialog();
            isPass = 1;
          } else {
            this.quesShowList[e1].isFill = true;
          }
        } else {
          if (v1.radio.length == 0 && this.selectNo.length == 0) {
            this.quesShowList[e1].isFill = false;
            this.Dialog();
            isPass = 1;
          } else {
            this.quesShowList[e1].isFill = true;
          }
        }
      });
      if (isPass == 1) {
        return;
      }

      this.quesShowList.forEach((v, e) => {
        if (!v.isRadio) {
          if (v.radio.length === 0) {
            this.par.assessmentfour = "其他";
            this.par.scoreOne = 0;
          } else {
            v.radio.forEach((v2, e2) => {
              this.par.assessmentfour += v.answer[v2 - 1].options + ",";
            });
            this.par.scoreOne = v.answer[Math.max(...v.radio) - 1].score;
          }
        } else {
          this.par[v.key] = v.answer[v.radio - 1].options;
          this.par[v.scoreKey] = v.answer[v.radio - 1].score;
        }
      });

      this.par.assessmentfour = this.par.assessmentfour.substring(
        0,
        this.par.assessmentfour.length - 1
      );

      if (this.riskArr[0] == "1") {
        this.par.assessmentthree = "是";
      } else {
        this.par.assessmentthree = "否";
      }

      if (this.riskArr[1] == "1") {
        this.par.assessmentone = "是";
      } else {
        this.par.assessmentone = "否";
      }

      if (this.riskArr[2] == "1") {
        this.par.assessmenttwo = "是";
      } else {
        this.par.assessmenttwo = "否";
      }

      // this.$router.push({ name: "screeningResult", query: { score: total } });
      let params = {
        npatientid: this.id,
        bmi: this.info.bmi,
        serumAlbumin: this.info.serumalbumin,
        scoreOne: this.par.scoreOne,
        scoreTwo: 0,
        scoreThree: this.par.scoreThree,
        scoreFour: this.par.scoreFour,
        scoreFive: 0,
        scoreSix: this.par.scoreSix,
        scoreEight: this.info.age,
        assessmentone: this.par.assessmentone,
        assessmenttwo: this.par.assessmenttwo,
        assessmentthree: this.par.assessmentthree,
        assessmentfour: this.par.assessmentfour,
        assessmentfive: this.par.assessmentfive,
        assessmentsix: this.par.assessmentsix,
        assessmentseven: this.par.assessmentseven,
        assessmenteight: this.info.lastverifyadvice
      };
      console.log("params: ", params);

      this.$http
        .request({
          method: "post",
          url:
            "/NNutritionPrescribePatientAssessmentController/insertAssessment",
          body: params
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            console.log(data.data);
            console.log(this.Patient.isDoc, "isDoc");
            if (this.Patient.isDoc) {
              //判断是医生
              if (this.Patient.isIM) {
                this.$router.push({
                  name: "screeningResult",
                  query: { score: data.total, from: "im" }
                });
              } else {
                this.$router.push({
                  name: "screeningResult",
                  query: { score: data.total }
                });
              }
            } else {
              //判断是患者
              if (this.Patient.isIM) {
                this.$router.push({
                  name: "screeningResult",
                  query: { score: data.total, id: this.id, type: 10, from: "im" }
                });
              } else {
                this.$router.push({
                  name: "screeningResult",
                  query: { score: data.total, id: this.id, type: 10 }
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
    }
  },
  components: {
    commonHeader
  }
};
</script>
<style lang="less" scoped>
.fl {
  float: left;
}

.fr {
  float: right;
}

.cf::after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}

#nutritionalRiskScreening {
  position: absolute;
  .card-box-top {
    width: 351px;
    margin: 60px 12px 12px 12px;
    background: @backgroundColorff;
    border-radius: 10px;
    .title {
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @fontColor33;
      line-height: 46px;
      text-align: center;
      // border-bottom: 1px solid @backcolorF1;
    }

    .item {
      height: 45px;

      div {
        height: 100%;
        width: 50%;
        padding-left: 10px;
        border-top: 1px solid @backcolorF1;

        p {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: @fontColor66;
          line-height: 45px;

          span {
            color: @fontColor33;
          }
        }
      }
      .serumalbumin {
        width: 100%;
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
  .card-box {
    width: 351px;
    margin: 12px;
    background: @backgroundColorff;
    border-radius: 10px;

    .title {
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @fontColor33;
      line-height: 46px;
      text-align: center;
      // border-bottom: 1px solid @backcolorF1;
    }

    .item {
      height: 45px;

      div {
        height: 100%;
        width: 50%;
        padding-left: 10px;
        border-top: 1px solid @backcolorF1;

        p {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: @fontColor66;
          line-height: 45px;

          span {
            color: @fontColor33;
          }
        }
      }
    }

    .question {
      padding: 14px 10px;
      border-top: 1px solid @backcolorF1;
      .van-checkbox-group {
        /deep/ .van-checkbox__label {
          color: @fontColor66;
          line-height: 14px;
          font-size: 16px;
        }
        /deep/ .van-checkbox__icon .van-icon {
          width: 20px;
          height: 20px;
        }
        /deep/ .van-radio {
          margin-top: 15px;
        }
      }
      .van-radio-group {
        /deep/ .van-radio__label {
          color: @fontColor66;
          line-height: 20px;
          font-size: 16px;
        }
        /deep/ .van-radio__icon .van-icon {
          width: 20px;
          height: 20px;
        }
        /deep/ .van-radio {
          margin-top: 15px;
        }
      }
      .question-name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @fontColor66;
        line-height: 16px;
        display: flex;
        span {
          font-size: 16px;
          color: @mainColor;
        }

        .denger {
          color: @fontColorRed;
          float: right;
          line-height: 24px;
        }

        .explain {
          display: flex;
          flex: 1;
          justify-content: flex-end;
          align-items: center;
          span {
            border-bottom: 1px solid @mainColor;
            margin-left: 5px;
          }
          /deep/ .van-icon {
            font-size: 20px;
          }
        }
      }

      .age-anwser {
        color: #666666;
        line-height: 20px;
        font-size: 16px;
        margin-top: 15px;
      }
    }
  }
  .v-bottom {
    margin: 18px 0;
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
  .van-popup {
    width: 80%;
    padding: 15px;
    border-radius: 10px;
    font-size: 14px;
    .text {
      p {
        padding: 5px;
        line-height: 20px;
      }
    }
  }
}
</style>
