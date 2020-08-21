/*
 * @Author: 田东
 * @Date: 2020-04-07 09:58:06
 * @Last Modified by: 田东
 * @Last Modified time: 2020-04-07 11:28:42
 * @name 营养风险筛查详情
 */

<template>
  <div id="nutritionalRiskScreeningDetails">
    <commonHeader
      :share-disabled="true"
      :custom-title="type == 10 ? '待处理报告' :'营养风险筛查'"
      :header-show="true"
      :title="'营养风险筛查详情'"
    ></commonHeader>
    <div class="content-block">
      <div class="item-box" v-for="(question, index) in quesShowList" :key="index">
        <p class="title">{{index + 1}}.{{question.question}}</p>
        <p class="anwser">{{question.anwser}}</p>
      </div>
    </div>
    <div class="v-bottom">
      <van-button @click="$throttle(back)" class="v-nextBottom" type="warning">
        <span>确认返回</span>
      </van-button>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast, Dialog } from "vant";

export default {
  name: "nutritionalRiskScreeningDetails",

  components: {
    commonHeader
  },
  data() {
    return {
      type: 0,
      quesList: [
        {
          name: "患者在过去3个月有体重下降吗？",
          key: "assessmentone"
        },
        {
          name: "患者在过去1周内有摄食减少吗？",
          key: "assessmenttwo"
        },
        {
          name: "患者有严重疾病吗？",
          key: "assessmentthree"
        },
        {
          name: "疾病严重程度？",
          key: "assessmentfour"
        },
        {
          name: "体重下降是否超过5%？",
          key: "assessmentfive"
        },
        {
          name: "体重下降时间范围？",
          key: "assessmentsix"
        },
        {
          name: "过去1周内进食量较从前减少？",
          key: "assessmentseven"
        },
        {
          name: "患者的年龄",
          key: "assessmenteight"
        }
      ],
      quesShowList: []
    };
  },
  created() {
    this.getData();
    this.type = this.$route.query.type;
  },
  methods: {
    getData() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientAssessmentController/selectId",
          body: { id: window.sessionStorage.getItem("id") }
        })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            for (let key in data) {
              let ques = "";
              this.quesList.forEach((v2, e2) => {
                if (key === v2.key) {
                  ques = v2.name;
                  if (data[key]) {
                    this.quesShowList.push({
                      question: ques,
                      anwser: data[key]
                    });
                  }
                }
              });
            }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    back() {
      this.$router.go(-1);
    }
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

#nutritionalRiskScreeningDetails {
  position: absolute;

  .content-block {
    .width(351);
    .margin(60, 12, 12, 12);
    .borderRadius(10, 10, 10, 10);
    background: #fff;

    .item-box {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .padding(15, 10, 15, 10);

      &:last-child {
        border: none;
      }

      .title {
        .fontSize(16);
        font-weight: 400;
        color: @titleColor;
        .lineHeight(18);
        .margin(0, 0, 13, 0);
      }

      .anwser {
        .fontSize(16);
        font-weight: 400;
        color: @mainColor;
        .lineHeight(18);
      }
    }
  }

  .v-bottom {
    margin: 20px auto;
    display: flex;
    justify-content: center;

    .v-nextBottom {
      .width(351);
      .height(44);
      .lineHeight(44);
      margin: 0 auto;

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
