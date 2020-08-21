<!--
  作者:许鹏
  用途:后台生成营养诊断报告
  -------------------
  Created by webStorm
  User: xp
  Date: 2019年10月31日
  Time: 13:10
  Application: Background Nutrition Diagnosis Report
  State: page
-->
<template>
  <div id="diagnosis">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div v-show="bg">
      <div class="bg"></div>
      <div class="refuse">
        <div class="refuse-nr">
          <div class="refuse-nr-title">确认审核</div>
          <div class="refuse-nr-body">确认提交审核?</div>
        </div>
        <div class="refuse-button">
          <van-button plain type="primary" @click="$throttle(qx)"
            >取消</van-button
          >
          <van-button type="info" @click="$throttle(refuse_true)"
            >确认</van-button
          >
        </div>
      </div>
    </div>
    <div class="zw"></div>
    <PrescriptionNote
      :value="baseInfo"
      :list="productInfo"
      :state="auditStatus"
      @confirm="confirm"
    />
    <div v-if="auditStatus == '0' || auditStatus == '5'">
      <div class="presentation" @click="$throttle(lookpreOther)">
        查看营养方案详情
      </div>
      <div class="but">
        <van-button plain type="primary" @click="$throttle(modify)"
          >修改</van-button
        >
        <van-button
          type="default"
          @click="$throttle(xz)"
          v-if="auditStatus == '0'"
          >完成并提交审核</van-button
        >
        <van-button
          type="default"
          @click="$throttle(xz)"
          v-else-if="auditStatus == '5'"
          >再次提交审核</van-button
        >
      </div>
    </div>
    <div v-else-if="auditStatus == '1' || auditStatus == '3'">
      <div class="append-but">
        <van-button type="default" @click="$throttle(lookpre)"
          >查看营养方案详情</van-button
        >
      </div>
      <div class="pass">
        <div class="pass_title">
          <div class="pass_tag"></div>
          智配柜信息
        </div>
        <div class="tag">
          智配柜编号：<span>{{ baseInfo.deviceCode }}</span
          ><br />
          地址：<span>{{ baseInfo.deviceFullAdress }}</span
          ><br />
          <!--							电话：{{}}-->
        </div>
      </div>
      <div class="pass" v-if="auditStatus == '3'">
        <div class="pass_title">
          <div class="pass_tag"></div>
          患者购买状态
        </div>
        <div class="tag">
          患者购药状态：<span class="y">{{ baseInfo.orderStateName }}</span
          ><br />
        </div>
      </div>
    </div>
    <div v-else-if="auditStatus == '2'">
      <div class="presentation" @click="$throttle(lookpreOther)">
        查看营养方案详情
      </div>
      <div class="but">
        <van-button plain type="primary" @click="$throttle(modify)"
          >驳回</van-button
        >
        <van-button type="default" @click="$throttle(xz)">通过</van-button>
      </div>
    </div>
    <div v-else-if="auditStatus == '4' || auditStatus == '6'">
      <div class="pass mar" v-if="auditStatus == '6'">
        <div class="pass_title">
          <div class="pass_tag"></div>
          未通过原因
        </div>
        <div class="tag_body">
          <span>{{ baseInfo.lastVerifyAdvice }}</span>
        </div>
      </div>
      <div class="append-but">
        <van-button type="default" @click="$throttle(lookpre)"
          >查看营养方案详情</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import PrescriptionNote from "@/components/PrescriptionNote.vue";
// import wx from "weixin-js-sdk";
import { Toast } from "vant";
import { mapState } from "vuex";
export default {
  name: "diagnosis",
  data() {
    return {
      title: "",
      customTitle: "营养方案",
      bg: false,
      baseInfo: {}, //处方详情信息
      productInfo: [], //处方药品信息
      // 是否审核传值
      // (可能值为:  0:未审核; 1:医生端审核中; 2:营养师审核中; 3:医生端,营养师审核通过; 4:患者端审核通过; 5:医生端审核未通过; 6:营养师审核未通过)
      auditStatus: "",
      //登录端(0:医生端; 1:营养师端; 2:患者端)
      terminal: "0",
      //审核GUID(营养师端审核专用)
      lastVerifyGuid: "",
      //下一页二维码展示
      codeType: ""
    };
  },
  components: {
    commonHeader,
    PrescriptionNote
  },
   computed: {
    ...mapState(["Patient"])
  },
  created() {
    if (this.$route.query.id) {
      window.sessionStorage.setItem("id", this.$route.query.id);
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
    if (!window.sessionStorage.getItem("id")) {
      Toast("当前处方不存在");
    } else {
      this.findReport();
    }
  },
  methods: {
    confirm(str){
      console.log("chuanguolai");
      this.$http
        .request({
          method: "post",
          url: "/NNutritionPrescribePatientController/updateByPrimaryKeySelective",
          body: {
            id: window.sessionStorage.getItem("id"),
            supplement: str
          }
        })
        .then(res => {

          if (res.data.success) {
            this.baseInfo.supplement = str;
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    //改变页面样式
    changePage() {
      if (this.auditStatus == "0") {
        this.title = "营养方案提交";
      } else if (this.auditStatus == "1") {
        this.title = "营养方案审核中";
      } else if (this.auditStatus == "2") {
        this.title = "待审核营养方案";
      } else if (this.auditStatus == "3") {
        this.title = "审核已通过";
      } else if (this.auditStatus == "4") {
        this.title = "营养方案";
      } else if (this.auditStatus == "5") {
        this.title = "审核未通过";
      } else if (this.auditStatus == "6") {
        this.title = "审核未通过";
      }
      window.sessionStorage.setItem("auditStatus", this.auditStatus);
    },
    //提交审核
    xz() {
      this.bg = true;
    },
    //弹出框取消按钮
    qx() {
      this.bg = false;
    },
    //弹出框确认按钮
    refuse_true() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/submitExaminePrescribe",
          body: {
            patiId: window.sessionStorage.getItem("id")
          }
        })
        .then(res => {
          this.auditStatus = 1;
          this.changePage();
          this.bg = false;
          console.log(res);
          //判断是进入二维码页还是退出
          if (this.codeType == 1) {
            //展示二维码
            window.sessionStorage.setItem("pid", this.baseInfo.lowerdoctorid);
            this.$router.push({
              name: "code",
              query: {
                val: this.baseInfo.preSaleCode
              }
            });
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    //查看营养监测报告
    lookpre() {
      window.sessionStorage.setItem("terminal", this.terminal);
      this.$router.push({
        name: "results",
        query: {
          prescriptionId: window.sessionStorage.getItem("id"),
          state: 1
        }
      });
    },
    //查看营养监测报告(修改)
    lookpreOther() {
      window.sessionStorage.setItem("terminal", this.terminal);
      this.$router.push({
        name: "results",
        query: {
          prescriptionId: window.sessionStorage.getItem("id"),
          type: 2,
          from: "doctor"
        }
      });
    },
    //修改当前处方
    modify() {
      this.$store.commit("Doctor/planNutritionList", []);
      this.$router.push({
        name: "ProductSearch",
        query: {
          nutritionType: 1,
          deviceId: this.baseInfo.deviceId
        }
      });
    },
    //请求诊断报告信息
    findReport() {
      this.$http
        .request({
          method: "get",
          url:
            "/NNutritionPrescribeGoodsController/selectNutritionPrescribeData",
          body: {
            patiId: window.sessionStorage.getItem("id")
          }
        })
        .then(res => {
          console.log("--------" + res);
          // console.log(JSON.stringify(res));
          if (res.data.success) {
            // alert(13);
            this.codeType = res.data.data.type;
            this.baseInfo = res.data.data;
            this.productInfo = res.data.data.specList;
            if (res.data.data.currentPage < 11) {
              this.auditStatus = 0;
            } else if (res.data.data.currentPage == 11 && this.terminal == 0) {
              this.auditStatus = 1;
            } else if (res.data.data.currentPage == 11 && this.terminal == 1) {
              this.auditStatus = 2;
            } else if (
              res.data.data.currentPage == 12 &&
              (this.terminal == 0 || this.terminal == 1)
            ) {
              this.auditStatus = 3;
            } else if (res.data.data.currentPage == 12 && this.terminal == 2) {
              this.auditStatus = 4;
            } else if (res.data.data.currentPage == 13 && this.terminal == 0) {
              this.auditStatus = 5;
            } else if (res.data.data.currentPage == 13 && this.terminal == 1) {
              this.auditStatus = 6;
            }
            this.lastVerifyGuid = res.data.data.lastVerifyGuid;
            // if (res.data.data.prescriptionBaseInfo.checkStatus === 1) {
            //   this.pic = require("../../assets/img/htbgz.png");
            //   this.head_title = "营养诊断报告审核中...";
            // }
            this.changePage();
          } else {
            Toast(res.data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    }
  }
};
</script>

<style scoped lang="less">
#diagnosis {
  padding-bottom: 54px;
  /*  padding-top: (20/375) * 100vw;*/
  -webkit-overflow-scrolling: touch;
  .refuse {
    position: fixed;
    z-index: 1000;
    .width(242);
    .height(124);
    background: @fontColorff;
    .margin(188, 66, 0, 66);
    .borderRadius(10, 10, 10, 10);
    .refuse-nr {
      .refuse-nr-title {
        color: @fontColor33;
        .fontSize(16);
        text-align: center;
        font-weight: bold;
        .margin(16, 0, 0, 0);
      }
      .refuse-nr-body {
        color: @fontColor33;
        .fontSize(14);
        text-align: center;
        .margin(16, 0, 15, 0);
      }
    }
    .refuse-button {
      position: absolute;
      bottom: 0px;
      /deep/ .van-button {
        color: @fontColorff;
        font-size: 4.3vw;
        border: 0px;
        .width(121);
        .height(47);
        .lineHeight(47);
        .fontSize(16);
        .borderRadius(0, 0, 10, 0);
      }

      /deep/ .van-button--primary {
        background: @fontColorff !important;
        color: @fontColor33;
        border-top: 1px solid #e5e5e5;
        .borderRadius(0, 0, 0, 10);
      }
    }
  }
  .bg {
    background: @fontColor00;
    opacity: 0.5;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 999;
  }
  .zw {
    height: 10px;
  }
  .presentation {
    color: @mainColor;
    .fontSize(14);
    text-align: center;
    .margin(20, 0, 30, 0);
    text-decoration: underline;
  }
  .but {
    width: 100%;
    //.margin(0, 0, 20, 0);
    /deep/ .van-button {
      margin-left: 3.2vw;
      color: @fontColorff;
      font-size: 4.3vw;
      .width(170);
      .height(44);
      .lineHeight(44);
      .fontSize(16);
      .borderRadius(6, 6, 6, 6);
    }

    /deep/ .van-button--primary {
      background: @backcolor !important;
      color: @mainColor;
      border: 1px solid @mainColor;
    }
  }
  .append-but {
    width: 100%;
    /deep/ .van-button {
      margin-left: 12px;
      color: @fontColorff;
      width: 351px;
      .height(44);
      .lineHeight(44);
      .fontSize(18);
      .borderRadius(10, 10, 10, 10);
      font-weight: bold;
      background: linear-gradient(225deg, @endColor 0%, @startColor 100%);
    }
  }
  .pass {
    margin-top: 20px;
    width: 351px;
    height: auto;
    margin-left: 12px;
    background: @fontColorff;
    border-radius: 10px;
    .pass_title {
      height: 52px;
      line-height: 52px;
      font-size: 16px;
      font-weight: bold;
      color: @fontColor33;
      padding-left: 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      .pass_tag {
        width: 4px;
        height: 14px;
        background: linear-gradient(180deg, @startColor 0%, @endColor 100%);
        border-radius: 2px;
        position: absolute;
        top: 19px;
        left: 10px;
      }
    }
    .tag {
      padding: 10px 10px 10px 10px;
      min-height: 36px;
      line-height: 36px;
      font-size: 16px;
      color: @fontColor66;
      span {
        color: @fontColor33;
      }
      .y {
        color: @mainColor;
        font-weight: 400;
      }
    }
    .tag_body {
      padding: 10px 10px 10px 10px;
      min-height: 36px;
      font-size: 16px;
      line-height: 22px;
      color: @fontColor33;
    }
  }
  .mar {
    margin-bottom: 20px;
  }
}
</style>
