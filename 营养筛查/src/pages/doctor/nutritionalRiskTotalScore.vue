/*
 * @Author: 田东
 * @Date: 2020-04-09 09:58:21
 * @Last Modified by: 田东
 * @Last Modified time: 2020-04-13 10:18:17
 * @name 营养风险总评分
 */

<template>
  <div id="nutritionalRiskTotalScore">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>

    <div class="top_box"></div>

    <nutritionalRiskScore :score="score"></nutritionalRiskScore>

    <div class="v-bottom">
      <van-button @click="$throttle(goNutritionPrograms())" class="v-nextBottom">
        <span>营养诊断</span>
      </van-button>
      <van-button @click="$throttle(goEnergyRequirement())" class="v-nextBottom">
        <span>营养方案</span>
      </van-button>
      <van-button @click="$throttle(goScreeningReferenceGo())" class="v-nextBottom btn">
        <span>查看风险筛查报告</span>
      </van-button>
    </div>
    <!-- <floatball></floatball> -->
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import nutritionalRiskScore from "@/components/nutritionalRiskScore/nutritionalRiskScore.vue";
// import floatball from "@/components/floatball.vue";
import { Toast, Dialog } from "vant";

export default {
  name: "nutritionalRiskTotalScore",
  components: {
    commonHeader,
    nutritionalRiskScore,
    // floatball
  },
  data() {
    return {
      title: "营养风险筛查评分",
      customTitle: "营养方案",
      score: 0
    };
  },
  created() {
    this.getScore();
  },
  methods: {
    getScore() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientAssessmentController/selectId",
          body: { id: window.sessionStorage.getItem("id") }
        })
        .then(res => {
          if (res.data.success) {
            this.score = res.data.data.assessmentbranch;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    goNutritionPrograms() {
      this.$router.push({ name: "NutritionPrograms" });
    },
    goEnergyRequirement() {
      Dialog.confirm({
        title: "提示",
        message: "是否确认不进行营养诊断直接进入拟定营养方案流程？"
      })
        .then(() => {
          this.$router.push({ name: "energyRequirement" });
        })
        .catch(() => {});
      // this.$http
      //   .request({
      //     method: "get",
      //     url: "/NNutritionAssessmentController/selectNNA",
      //     body: { patiId: window.sessionStorage.getItem("id") }
      //   })
      //   .then(res => {
      //     if (res.data.success) {
      //       if (res.data.code == "1") {
      //         Dialog.confirm({
      //           title: "提示",
      //           message: "是否确认不进行营养诊断直接进入拟定营养方案流程？"
      //         })
      //           .then(() => {
      //             this.$router.push({ name: "energyRequirement" });
      //           })
      //           .catch(() => {});
      //       } else {
      //         this.$router.push({ name: "energyRequirement" });
      //       }
      //     } else {
      //       Toast(res.data.message);
      //     }
      //   })
      //   .catch(() => {
      //     Toast("接口异常");
      //   });
    },
    goScreeningReferenceGo() {
      this.$router.push({ name: "screeningReferenceGo", query: { type: 3 } });
    }
  }
};
</script>
<style lang="less" scoped>
#nutritionalRiskTotalScore {
  width: 100%;
  height: 100%;
  background: @backcolor;
  position: absolute;

  .top_box {
    width: 100%;
    height: 48px;
  }

  .v-bottom {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .v-nextBottom {
      .width(351);
      .height(44);
      .lineHeight(44);
      margin: 0 auto 20px;

      span {
        font-size: 16px;
        font-weight: 400;
        color: @fontColorff;
        line-height: 22px;
      }
    }

    .btn {
      width: 351px;
      height: 44px;
      border-radius: 10px;
      border: 2px solid @mainColor;
      background: #fff !important;

      span {
        color: @mainColor;
      }
    }
  }
}
</style>
