<!--
* @description
* @fileName 营养诊断结果.vue
* @author weixueyuan
* @date 2020/03/31 15:07:58
!-->
<template>
  <div id="details">
    <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="isFromGZH ? false : true"
        :title="title"
    ></commonHeader>
    <div class="nudiall" :class="[{'noPadding': isFromGZH}]">
      <div class="nudiaopt" @click="$throttle(toscr)" v-if="terminal == '1' && Patient.prestype == 0">
        <span>营养风险筛查详情</span>
      </div>
      <div
          :class="[(sgaStatus == 3 && generated=='1') ? 'nudiaopt' : 'nudiaoptx']"
          @click="$throttle(tosgar)"
      >
        <span>SGA综合评定详情</span>
      </div>
      <div
          :class="[(hairStatus != 1 && generated=='1') ? 'nudiaopt' : 'nudiaoptx']"
          @click="$throttle(totrre)"
      >
        <span>微量元素检测详情</span>
      </div>
      <div
          :class="[(bloodStatus != 1 && generated=='1') ? 'nudiaopt' : 'nudiaoptx']"
          @click="$throttle(toblre)"
      >
        <span>血液生化检测详情</span>
      </div>
      <div
          :class="[(urineStatus != 1 && generated=='1') ? 'nudiaopt' : 'nudiaoptx']"
          @click="$throttle(tourre)"
      >
        <span>尿液生化检测详情</span>
      </div>
      <div class="nudibut" @click="$throttle(toenre)" v-if="!isFromGZH">确认返回</div>
    </div>
  </div>
</template>

<script>
  import commonHeader from "@/components/commonHeader/common_header.vue";
  import {Toast} from "vant";
  import {mapState} from "vuex";

  export default {
    name: "details",
    data() {
      return {
        title: "更多详情",
        customTitle: "营养方案",
        sgaStatus: 1,
        hairStatus: 1,
        bloodStatus: 1,
        urineStatus: 1,
        sgaScore: 0,
        generated: 0,
        terminal: 0,
        isFromGZH: false
      };
    },

    components: {
      commonHeader
    },

    computed: {
      ...mapState(["Patient"])
    },

    created() {
      this.isFromGZH = this.$route.query.isFromGZH || "";
      if (typeof this.$route.query.id != "undefined" && this.$route.query.id != "") {
        window.sessionStorage.setItem("id", this.$route.query.id);
      }
      if (window.sessionStorage.getItem("terminal")) {
        this.terminal = window.sessionStorage.getItem("terminal");
      }
      // window.sessionStorage.setItem("id",511953014312013963)
      this.selnudi();
    },

    mounted: {},

    methods: {
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
              this.$router.push({name: "screeningReferenceGo"});
            } else {
              Toast("您还未绑定智配柜，无进行下一步操作");
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      },
      selnudi() {
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
            this.generated = res.data.data.generated;
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      },
      toscr() {
        this.$router.push({name: "nutritionalRiskScreeningDetails"});
      },
      tosgar() {
        if (this.sgaStatus != "3" || this.generated != "1") {
          Toast("未进行该项检测");
          return false;
        }
        this.$router.push({
          name: "SGAresult",
          query: {sgaScore: this.sgaScore}
        });
      },
      totrre() {
        if (this.hairStatus == "1" || this.generated != "1") {
          Toast("未进行该项检测");
          return false;
        }
        this.$router.push({name: "TraceResults"});
      },
      toblre() {
        if (this.bloodStatus == "1" || this.generated != "1") {
          Toast("未进行该项检测");
          return false;
        }
        this.$router.push({name: "BloodResults"});
      },
      tourre() {
        if (this.urineStatus == "1" || this.generated != "1") {
          Toast("未进行该项检测");
          return false;
        }
        this.$router.push({name: "UrineResult"});
      },
      toenre() {
        if (window.history.length <= 1) {
          //如果没有上一页了则退出公众号
          this.$wx.closeWindow();
          // this.$router.push({ path: "/" });
        } else {
          this.$router.go(-1);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #details {
    padding: 0px;
    width: 100%;
    height: 100%;

    .nudiall.noPadding {
      padding-top: 10px;
    }

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
        text-align: center;
        color: #fff;
        padding: 0px 10px;
      }

      .nudiaoptx {
        width: 100%;
        height: 46px;
        margin-top: 15px;
        border-radius: 10px;
        background-color: #fff;
        text-align: center;
        color: #999;
        padding: 0px 10px;
      }

      .nudibut {
        width: 351px;
        height: 44px;
        color: #ffffff;
        font-size: 18px;
        text-align: center;
        line-height: 44px;
        background: linear-gradient(225deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%);
        border-radius: 10px;
        position: absolute;
        bottom: 20px;
      }

      .nudifloat {
        width: 44px;
        height: 44px;
        background: linear-gradient(180deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%);
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
