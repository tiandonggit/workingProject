/* * @Author: 田东 * @Date: 2019-10-29 16:33:20 * @Last Modified by: 田东 *
@Last Modified time: 2019-10-29 16:33:20 * @name 筛查结果 */

<template>
  <div id="screeningResult">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="type == 1 ? false : true"
      :title="title"
    ></commonHeader>

    <div class="top_box"></div>
    <!-- <p class="hint">营养风险总评分</p> -->
    <nutritionalRiskScore :score="score"></nutritionalRiskScore>
    <div class="v-bottom">
      <van-button @click="$throttle(next)" class="v-nextBottom" type="warning">
        <span>{{
          this.typeStatus == 10 ? "下一步" : type == 1 ? "查看详情" : "下一步"
        }}</span>
      </van-button>
      <!-- <van-button v-else @click="$throttle(confirm)" class="v-nextBottom" type="warning">
        <span>确认</span>
      </van-button>-->
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import nutritionalRiskScore from "@/components/nutritionalRiskScore/nutritionalRiskScore.vue";
import { mapState } from "vuex";
import wx from "weixin-js-sdk";
import { Toast } from "vant";
// import { Toast } from "vant";

export default {
  name: "screeningResult",
  components: {
    commonHeader,
    nutritionalRiskScore
  },
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      title: "营养风险筛查评分",
      customTitle: "营养风险筛查",
      score: "0",
      type: 0,
      typeStatus: 0
    };
  },
  created() {
    if (this.$route.query.from && this.$route.query.from != "") {
      this.Patient.isIM = true;
    } else {
      this.Patient.isIM = false;
    }
    if (this.$route.query.score && this.$route.query.score != "") {
      this.score = this.$route.query.score;
    } else {
      //获取不到分数,通过接口获取
      this.getScore();
    }

    // 当跳转当前页面时做逻辑判断
    if (this.$route.query.id) {
      this.type = 1;
      window.sessionStorage.setItem("id", this.$route.query.id);
    }
    this.typeStatus =
      this.$route.query.type && this.$route.query.type != ""
        ? this.$route.query.type
        : 0;
  },
  methods: {
    getScore() {
      //查询分数
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientAssessmentController/selectId",
          body: {
            id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res);
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
    next() {
      // 异常 跳转下一步 营养筛查营养报告
      if (this.type == 1) {
        //之前的跳转
        if (this.typeStatus == 0) {
          this.Patient.pathNum = 2;
          this.$router.push({
            name: "screeningReport",
            query: { score: this.score }
          });
        } else {
          //患者自己开筛查
          this.$router.push({
            name: "screeningReport",
            query: { score: this.score, typeStatus: 10 }
          });
        }
      } else {
        this.$router.push({ name: "screeningReferenceGo", query: { type: 2 } });
      }
    }
  }
};
</script>
<style lang="less" scoped>
#screeningResult {
  width: 100%;
  height: 100%;
  background: @backcolor;
  position: absolute;
  .hint {
    text-align: center;
    padding-top: 30px;
    font-size: 16px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: @fontColor33;
    line-height: 22px;
  }
  .top_box {
    width: 100%;
    height: 48px;
  }

  .v-bottom {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: 40px;
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
