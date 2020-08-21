<!--
* @description
* @fileName 营养诊断结果.vue
* @author weixueyuan
* @date 2020/03/31 15:07:58
!-->
<template>
  <div id="NutritionalDiagnosis">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="isFromGZH ? false : true"
      :title="title"
    ></commonHeader>
    <div class="nudiall" :style="isFromGZH ? 'padding-top:4px' : '' ">
      <div
        :class="[sgaStatus == 3 ? 'nudiaopt' : 'nudiaoptx']"
        @click="$throttle(tosgar)"
      >
        <span>SGA综合评定</span><span v-if="sgaStatus == 3">查看结果</span
        ><span v-else>未检测</span>
      </div>
      <div
        :class="[hairStatus != 1 ? 'nudiaopt' : 'nudiaoptx']"
        @click="$throttle(totrre)"
      >
        <span>微量元素检测</span><span v-if="hairStatus != 1">查看结果</span
        ><span v-else>未检测</span>
      </div>
      <div
        :class="[bloodStatus != 1 ? 'nudiaopt' : 'nudiaoptx']"
        @click="$throttle(toblre)"
      >
        <span>血液生化检测</span><span v-if="bloodStatus != 1">查看结果</span
        ><span v-else>未检测</span>
      </div>
      <div
        :class="[urineStatus != 1 ? 'nudiaopt' : 'nudiaoptx']"
        @click="$throttle(tourre)"
      >
        <span>尿液生化检测</span><span v-if="urineStatus != 1">查看结果</span
        ><span v-else>未检测</span>
      </div>
      <div class="nudibut" @click="$throttle(toenre)">{{Patient.prestype == 1?"下一步":"营养方案"}}</div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast } from "vant";
import { mapState } from "vuex";
export default {
  name: "NutritionalDiagnosis",
  data() {
    return {
      title: "营养诊断结果",
      customTitle: "营养诊断",
      sgaStatus: 0,
      hairStatus: 0,
      bloodStatus: 0,
      urineStatus: 0,
      sgaScore: 0,
      isFromGZH: false
    };
  },

  components: {
    commonHeader,
  },

  created() {
    this.isFromGZH = this.$route.query.isFromGZH || "";
    if (typeof this.$route.query.id != "undefined" && this.$route.query.id != "") {
      window.sessionStorage.setItem("id",this.$route.query.id);
    }
    if (typeof this.$route.query.type != "undefined" && this.$route.query.type != "") {
      this.Patient.prestype = 1;
      if (this.$route.query.type == 1) {
        this.Patient.isDoc = true;
      } else if (this.$route.query.type == 2) {
        this.Patient.isDoc = false;
      }

    } else {
      this.Patient.prestype = 0;
    }

    this.selnudi();
  },

  computed: {
    ...mapState(["Patient"])
  },

  mounted() {},

  methods: {
    selnudi() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectNNA",
          body: {
            patiId: window.sessionStorage.getItem("id"),
          },
        })
        .then((res) => {
          this.sgaStatus = res.data.data.sgaStatus;
          this.hairStatus = res.data.data.hairStatus;
          this.bloodStatus = res.data.data.bloodStatus;
          this.urineStatus = res.data.data.urineStatus;
          this.sgaScore = res.data.data.sgaScore;
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
    tosgar() {
      if (this.sgaStatus == 1 || this.sgaStatus == 2) {
        Toast("未进行该项检测");
      } else {
        this.$router.push({
          name: "SGAresult",
          query: { sgaScore: this.sgaScore },
        });
      }
    },
    totrre() {
      if (this.hairStatus == 1) {
        Toast("未进行该项检测");
      } else {
        this.$router.push({
          name: "TraceResults",
        });
      }
    },
    toblre() {
      if (this.bloodStatus == 1) {
        Toast("未进行该项检测");
      } else {
        this.$router.push({
          name: "BloodResults",
        });
      }
    },
    tourre() {
      if (this.urineStatus == 1) {
        Toast("未进行该项检测");
      } else {
        this.$router.push({
          name: "UrineResult",
        });
      }
    },
    toenre() {
      if (typeof this.$route.query.id != "undefined" && this.$route.query.id != "") {
        this.$router.push({
          name: "energyRequirement"
        })
      } else {
        if (this.Patient.prestype == 1) {
          this.$dialog.confirm({
            message: "是否确认完成并进入下一步",
          })
            .then(() => {
              //调用生成方案码
              this.$http
                .request({
                  method: "post",
                  url: "/NNutritionPrescribePatientController/generateNutrCode",
                  body: {
                    presId: window.sessionStorage.getItem("id"),
                  },
                })
                .then((res) => {
                  if (res.data.success) {
                    //跳转到诊断结果页
                    this.$router.push({
                      name: "code",
                      query: {
                        type: 1
                      }

                    })
                  } else {
                    this.$toast(res.data.message);
                  }
                })
                .catch((error) => {
                  console.log("错误为" + error);
                });

            })
            .catch(() => {});
        } else {
          this.$router.push({
            name: "energyRequirement",
          });
        }
      }


    },
  },
};
</script>

<style lang="less" scoped>
#NutritionalDiagnosis {
  padding: 0px;
  width: 100%;
  height: 100%;
  .nudiall {
    width: 351px;
    height: 100%;
    margin: 0 auto;
    padding-top: 48px;
    font-size: 16px;
    line-height: 46px;
    .nudiaopt {
      width: 100%;
      height: 46px;
      margin-top: 15px;
      border-radius: 10px;
      background-color: #0069ff;
      color: #fff;
      display: flex;
      justify-content: space-between;
      padding: 0px 10px;
    }
    .nudiaoptx {
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
    .nudibut {
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
  }
}
</style>
