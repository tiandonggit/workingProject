<!--
* @description
* @fileName 营养诊断项目.vue
* @author weixueyuan
* @date 2020/03/31 13:56:29
!-->
<template>
  <div id="NutritionPrograms">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="nuprall">
      <div class="nupraopt" @click="$throttle(tosgac)">
        <span>SGA综合评定</span
        ><span class="nupraoptr" v-if="sgaStatus == '3'"
          >已完善<van-icon name="arrow"/></span
        ><span v-else-if="sgaStatus == '1'">未检测<van-icon name="arrow"/></span
        ><span v-else-if="sgaStatus == '2'"
          >未完善<van-icon name="arrow"
        /></span>
      </div>
      <div class="nupraopt" @click="$throttle(totrev)">
        <span>微量元素检测</span
        ><span class="nupraoptr" v-if="hairStatus == '3'"
          >已完善<van-icon name="arrow"/></span
        ><span v-else-if="hairStatus == '1'"
          >未检测<van-icon name="arrow"/></span
        ><span v-else-if="hairStatus == '2'"
          >未完善<van-icon name="arrow"
        /></span>
      </div>
      <div class="nupraopt" @click="$throttle(toblbi)">
        <span>血液生化检测</span
        ><span class="nupraoptr" v-if="bloodStatus == '3'"
          >已完善<van-icon name="arrow"/></span
        ><span v-else-if="bloodStatus == '1'"
          >未检测<van-icon name="arrow"/></span
        ><span v-else-if="bloodStatus == '2'"
          >未完善<van-icon name="arrow"
        /></span>
      </div>
      <div class="nupraopt" @click="$throttle(tourbi)">
        <span>尿液生化检测</span
        ><span class="nupraoptr" v-if="urineStatus == '3'"
          >已完善<van-icon name="arrow"/></span
        ><span v-else-if="urineStatus == '1'"
          >未检测<van-icon name="arrow"/></span
        ><span v-else-if="urineStatus == '2'"
          >未完善<van-icon name="arrow"
        /></span>
      </div>
      <div class="nuprbut" @click="$throttle(showmsg)">提交</div>
    </div>
    <!-- <floatball v-if="Patient.prestype != 1"></floatball> -->
    <msgcode
      :is-show="isShowPublish"
      :top-distance="topNum"
      :heiNum="heiNum"
      @on-close="close"
    >
      <div slot="header" class="header">是否确认提交生成诊断结果？</div>
      <div class="dialog_publish_main" slot="main">
        <div class="dialogbut">
          <div class="dialogbutl" @click="$throttle(closemsg)">取消</div>
          <div class="dialogbutr" @click="$throttle(tomsg)">确定</div>
        </div>
      </div>
    </msgcode>
  </div>
</template>

<script>
import msgcode from "@/components/MessageCode";
import commonHeader from "@/components/commonHeader/common_header.vue";
// import floatball from "@/components/floatball.vue";
import { Toast } from "vant";
import { mapState } from "vuex";
export default {
  name: "NutritionPrograms",
  data() {
    return {
      title: "营养诊断项目",
      customTitle: "营养诊断",
      sgaStatus: "0",
      hairStatus: "0",
      bloodStatus: "0",
      urineStatus: "0",
      sgaScore: "0",
      isShowPublish: false
    };
  },

  components: {
    commonHeader,
    msgcode,
    // floatball
  },

  created() {
    // window.sessionStorage.setItem("id",'501393130705262510')
    this.selstatus();
  },

  computed: {
    ...mapState(["Patient"])
  },

  mounted() {},

  methods: {
    close() {
      this.isShowPublish = false;
    },
    closemsg() {
      this.isShowPublish = false;
    },
    tomsg() {
      this.$http
        .request({
          method: "post",
          url: "/NNutritionAssessmentController/computeScore",
          body: {
            patiId: window.sessionStorage.getItem("id")
          }
        })
        .then(res => {
          this.isShowPublish = false;
          if (res.data.success) {
            this.$router.push({
              name: "NutritionalDiagnosis",
              query: {
                type: this.Patient.prestype
              }
            });
          } else {
            Toast("提交失败");
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    showmsg() {
      if (
        this.sgaStatus < 3 &&
        this.hairStatus == 1 &&
        this.bloodStatus == 1 &&
        this.urineStatus == 1
      ) {
        Toast("当前信息不足以生成评定结果");
      } else {
        this.isShowPublish = true;
      }
    },
    toscre() {
      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/getDeviceList",
          body: {
            patiId: window.sessionStorage.getItem("id")
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.data) {
            this.$router.push({ name: "screeningReferenceGo" });
          } else {
            Toast("您还未绑定智配柜，无进行下一步操作");
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    selstatus() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectNNA",
          body: {
            patiId: window.sessionStorage.getItem("id")
          }
        })
        .then(res => {
          this.sgaStatus = res.data.data.sgaStatus;
          this.hairStatus = res.data.data.hairStatus;
          this.bloodStatus = res.data.data.bloodStatus;
          this.urineStatus = res.data.data.urineStatus;
          this.sgaScore = res.data.data.sgaScore;
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    tosgac() {
      this.$router.push({ name: "SGAComprehensiveEvaluation" });
    },
    totrev() {
      this.$router.push({ name: "TraceelementsEvaluation" });
    },
    toblbi() {
      this.$router.push({ name: "BloodBiochemistry" });
    },
    tourbi() {
      this.$router.push({ name: "UrineBiochemistry" });
    }
  }
};
</script>

<style lang="less" scoped>
#NutritionPrograms {
  padding: 0px;
  width: 100%;
  height: 100%;
  .dialogbut {
    height: 44px;
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-content: center;
    .dialogbutl {
      width: 50%;
      text-align: center;
      line-height: 44px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
    .dialogbutr {
      width: 50%;
      text-align: center;
      line-height: 44px;
      background: linear-gradient(
        228deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%
      );
      color: #fff;
      border-bottom-right-radius: 10px;
    }
  }
  .nuprall {
    width: 351px;
    height: 100%;
    margin: 0 auto;
    padding-top: 48px;
    font-size: 16px;
    line-height: 46px;
    .nupraopt {
      width: 100%;
      height: 46px;
      margin-top: 15px;
      border-radius: 10px;
      background-color: #fff;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 0px 10px;
    }
    .nupraoptr {
      height: 46px;
      color: #0069ff;
    }
    .nupraoptx {
      width: 100%;
      height: 46px;
      margin-top: 15px;
      border-radius: 10px;
      background-color: #fff;
      color: #333333;
      display: flex;
      justify-content: space-between;
      padding: 0px 10px;
    }
    span {
      display: flex;
      align-items: center;
      i {
        margin-left: 5px;
        color: #333;
      }
    }
    .nuprbut {
      width: 351px;
      height: 44px;
      color: #ffffff;
      font-size: 18px;
      text-align: center;
      line-height: 44px;
      background: linear-gradient(
        225deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%
      );
      border-radius: 10px;
      position: absolute;
      bottom: 20px;
    }
    .nuprfloat {
      width: 44px;
      height: 44px;
      background: linear-gradient(
        180deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%
      );
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 50%;
      position: fixed;
      top: 400px;
      right: 12px;
      color: #fff;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 16px;
      text-align: center;
    }
  }
}
</style>
