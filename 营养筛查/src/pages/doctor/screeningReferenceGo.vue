/** *@desc 营养个体化方案(筛查参考) *@author 张松仁 *@date 2019/10/29 16:49:46
*/
<template>
  <div class="screeningReference">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="main">
      <div class="content">
        <commonPatient :person_info="patientData" :prestype="Patient.prestype"></commonPatient>
      </div>
      <div class="content">
        <commonScreening
          :fenShow="Patient.prestype != 1"
          :objData="objData"
          :prestype="Patient.prestype"
          @tapHead="tapHead"
        ></commonScreening>
      </div>
      <div class="content">
        <commonDoctor
          :doctorInfo="doctorInfo"
          :doctorType="doctorType"
          :prestype="Patient.prestype"
        ></commonDoctor>
      </div>
      <div class="foot" v-if="type == 1">
        <van-button type="default" @click="onSubmitOne(3)">下一步</van-button>
      </div>
      <div class="foot" v-else-if="type == 2">
        <van-button type="default" @click="onSubmitOne(4)">确认提交</van-button>
      </div>
      <div class="foot" v-else-if="type == 3">
        <van-button type="default" @click="onSubmitOne(5)">确认返回</van-button>
      </div>
      <div class="foot" v-else>
        <van-button type="default" @click="onSubmitOne(0)"
          >系统推荐套餐方案</van-button
        >
        <van-button type="default" @click="onSubmitOne(1)"
          >我的经验套餐方案</van-button
        >
        <van-button type="default" @click="onSubmitOne(2)"
          >患者定制套餐方案</van-button
        >
      </div>
    </div>
    <!-- <floatball v-show="type == 1 || type == 3"></floatball> -->
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import commonPatient from "@/components/commonPatientInformation/commonPatientInformation.vue";
import commonScreening from "@/components/commonScreeningInformation/commonScreeningInformation.vue";
import commonDoctor from "@/components/commonDoctorInformation/commonDoctorInformation.vue";
// import floatball from "@/components/floatball.vue";
import { Toast } from "vant";
import wx from "weixin-js-sdk";
import { mapState } from "vuex";

export default {
  name: "screeningReference",
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      title: "营养方案选择",
      customTitle: "营养方案",
      id: 0,
      type: "", //从哪里跳进的页面 1列表页 2评分页 3确认返回
      prescriptionsourcetype: 1, //用户类型
      patientData: {
        //患者信息
        name: "", //姓名
        nphone: "", //电话
        age: "", //年龄
        sex: "", //性别 男1 女0
        height: "", //身高 单位米
        weight: "", //体重 单位KG
        pasthistory: "", //既往疾病史
        allergyhistory: "", //既往过敏史
        createtime: "" //筛查时间
      },
      objData: {
        assessmentbranch: "", //分值
        advice: "", //供能比建议
        serumalbumin: "", //血清白蛋白值
        bmi: "", //身体质量指数(BMI)
        dtotalenergy: "", //每日能量需求
        illname: "", //疾病名称
        totalenergy: "" //每日能量需求
      },
      doctorInfo: {
        docName: "", //姓名
        titleName: "", //职称
        depName: "", //科室
        hosName: "" //医院
      },
      doctorType: 1, //筛查发起人类型
      lowerdoctorid: "0"
    };
  },
  components: {
    commonHeader,
    commonPatient,
    commonScreening,
    commonDoctor,
    // floatball
  },
  created() {
    this.prescriptionsourcetype = this.$store.state.Doctor.prescriptionsourcetype;
    console.log(this.prescriptionsourcetype);
    if (this.$route.query.id) {
      window.sessionStorage.setItem("id", this.$route.query.id);
    }
    if (!window.sessionStorage.getItem("id")) {
      Toast("当前处方不存在");
    } else {
      this.id = sessionStorage.getItem("id");

      this.type = this.$route.query.type;
      if (this.type == 2) {
        this.title = "营养风险筛查报告";
        this.customTitle = "营养风险筛查";
      } else if (this.type == 1) {
        this.title = "营养风险筛查报告";
        this.customTitle = "待处理报告";
      } else if (this.type == 3) {
        this.title = "营养风险筛查报告";
        this.customTitle = "营养方案";
      }
      if (this.type == 2 || this.type == 1 || this.type == 3) {
        this.selectPatient();
      } else {
        this.selectKey();
        this.showlist();
      }
    }
  },
  methods: {
    //点击筛查信息标题
    tapHead() {
      console.log("点击了跳转查看详情页");
      //从问卷页跳转过来跳转sga这个页面
      if (this.type == 2 || this.type == 1 || this.type == 3) {
        this.$router.push({
          path: "/nutritionalRiskScreeningDetails",
          query: {
            type: 10
          }
        });
      } else {
        this.$router.push({
          path: "/details",
          query: {}
        });
      }
    },
    //展示数据
    showlist() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/selectAll",
          body: {
            id: window.sessionStorage.getItem("id")
            // id: "455106805983481857"
          }
        })
        .then(res => {
          console.log(res);
          if (!res.data.success) return;
          this.Patient.prestype = res.data.data.nNutritionPrescribePatient.prestype;
          this.patientData = res.data.data.nNutritionPrescribePatient;
          this.disease_info = res.data.data.instance;
          this.lowerdoctorid =
            res.data.data.nNutritionPrescribePatient.doctorid;


          this.doctorType = res.data.data.nNutritionPrescribePatient.usertype;
          if (this.doctorType == 3) {
            this.screeningDoctor(this.doctorType,res.data.data.nNutritionPrescribePatient.patientid);
          } else {
            this.screeningDoctor(this.doctorType,this.lowerdoctorid);
          }

        })
        .catch(() => {
          this.$toast("接口异常");
        });
    },
    //获取筛查医生信息
    screeningDoctor(type,id) {
      let  url = type==3?"/RPatientController/selectByPrimaryKey" : "/RDoctorController/selectDoctor"
      this.$http
        .request({
          method: "get",
          url: url,
          body: {
            id: id
            // id: "455106805983481857"
          }
        })
        .then(res => {
          console.log(res.data);
          console.log(res.data.data.data);
          if (type == 3) {
            this.doctorInfo.docName = res.data.data.name;
          } else {
            if (!res.data.success) return;
            this.doctorInfo = res.data.data.data;
          }

        })
        .catch(() => {
          this.$toast("接口异常");
        });
    },
    generateScreeningPatient() {
      //患者选择医生之后生成营养筛查确认提交后发送给医生（为患者操作）
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/generateScreeningPatient",
          body: {
            id: window.sessionStorage.getItem("id"),
            type: this.Patient.isIM ? 2 : 1,
            state: this.Patient.isDoc ? 2 : 1
          }
        })
        .then(res => {
          console.log(res);

          if (res.data.success) {
            //IM里返回啊
            console.log("IM里返回啊");
            window.sessionStorage.clear("id");
            // location.href =
            //   this.$globalServiceHost.serveHost +
            //   this.$globalServiceHost.projectName2 +
            //   "/#/docChatIMDetail";
            console.log(-1*this.Patient.pathNum);
            this.$router.go(-1*this.Patient.pathNum);
            // window.history.back(-1);
          } else {
            Toast(res.data.message);
            // this.$router.go(-5)
            // console.log(this.$router);
            // window.history.back(-1);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    onSubmitOne(val) {
      if (val == 3) {
        //列表页进来传type 传值1 跳转到营养风险筛查评分页;
        //查询是否有药柜
        this.$http
          .request({
            method: "get",
            url: "/NNutritionPrescribeGoodsController/selectDeviceListState",
            body: {
              npatientId: window.sessionStorage.getItem("id")
            }
          })
          .then(res => {
            console.log(res.data.data);
            if (res.data.success) {
              if (res.data.data.length != 0) {
                if (res.data.code < 11) {
                  this.$router.push({
                    path: "/nutritionalRiskTotalScore" //跳转待处理下一步
                  });
                } else {
                  this.$router.push({ name: "diagnosis" }); // 跳转到审核中||已通过||未通过页面 审核结果页
                }
              } else {
                this.$toast("您当前还未绑定智配柜，无法进行下一步操作");
              }
            } else {
              this.$toast(res.data.message);
            }
          })
          .catch(error => {
            this.$toast(error);
            console.log("错误为" + error);
          });
      } else if (val == 4) {
        /* 作废了 评分页进来传type 传值2 跳转到二维码页 判断prescriptionsourcetype为1正常进入二维码页 为0 则进入营养风险筛查评分页
        let prescriptionsourcetype = this.$store.state.Doctor
          .prescriptionsourcetype;*/
        this.$dialog
          .confirm({
            message: "是否确认完成并进入下一步"
          })
          .then(() => {
            // on confirm
            console.log("确认");
            //调用接口,给医生发送客服消息
            //判断是不是IM
            if (this.Patient.isIM) {
              //在IM里调用接口
              this.generateScreeningPatient();
            } else {
              //不在按原来的逻辑
              this.$http
                .request({
                  method: "get",
                  url: "/NNutritionPrescribePatientController/insertHH",
                  body: {
                    id: this.id
                  }
                })
                .then(res => {
                  console.log(res.data.data);
                  if (res.data.success) {
                    //进入二维码页
                    this.$router.push({
                      path: "/code",
                      query: { val: res.data.data, type: 1 }
                    });
                    /*//成功关闭当前页
                    wx.closeWindow();*/
                  } else {
                    this.$toast(res.data.message);
                  }
                })
                .catch(error => {
                  this.$toast(error);
                  console.log("错误为" + error);
                });
            }
          })
          .catch(() => {
            // on cancel
            console.log("取消");
          });
        /* 作废了
        if (prescriptionsourcetype != 1) {
          //不是智能机,弹窗

        } else {
          this.$router.push({
            path: "/code",
            query: {}
          });
        }*/
      } else if (val == 5) {
        //返回上一页
        this.$router.go(-1);
      } else {
        this.$router.push({
          path: "/selectionScheme",
          query: { name: this.objData.illname, val: val }
        });
      }
    },
    selectKey() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeDepartmentPatientController/selectKey",
          body: {
            id: this.id
          }
        })
        .then(res => {
          console.log(res.data.data);
          if (!res.data.success) return;
          this.objData = res.data.data;
          this.doctorType = res.data.data.usertype;
        })
        .catch(error => {
          this.$toast(error);
          console.log("错误为" + error);
        });
    },
    selectPatient() {
      //查询未绑定疾病的信息
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/selectByPrimaryKeyId",
          body: {
            id: this.id
          }
        })
        .then(res => {
          console.log(res.data.data.usertype, "啊实打实大");
          console.log(res.data.data);
          if (!res.data.success) return;
          this.objData = res.data.data;
          this.patientData = res.data.data;
          this.lowerdoctorid = res.data.data.lowerdoctorid;
          this.Patient.prestype = res.data.data.prestype;
          this.doctorType = res.data.data.usertype;
          if (this.doctorType == 3) {
            this.screeningDoctor(this.doctorType,res.data.data.patientid);
          } else {
            this.screeningDoctor(this.doctorType,res.data.data.doctorid);
          }

        })
        .catch(error => {
          this.$toast(error);
          console.log("错误为" + error);
        });
    }
  }
};
</script>

<style scoped lang="less">
.screeningReference {
  .main {
    padding: 58px 12px 20px;
    .content {
      background: @backgroundColorff;
      border-radius: 10px;
      margin-bottom: 15px;
      .tag_border {
        width: 100%;
        margin-top: 14px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .content_top {
        padding: 20px 10px 0;
        text-align: center;
        font-size: 16px;
        color: @fontColor33;
        line-height: 22px;
        font-weight: bold;
      }
      .list {
        padding: 15px 10px 0;
        border-bottom: 1px dashed @boederColorF1;
        font-size: 14px;
        line-height: 20px;
        color: @fontColor33;
        .list_box {
          padding-bottom: 15px;
          display: flex;
          flex-wrap: nowrap;
          .list_box_l {
            width: 50%;
          }
          .list_box_r {
            width: 50%;
          }
          .left {
            font-weight: bold;
            float: left;
          }
          .right {
            display: flex;
            flex-wrap: wrap;
            padding-left: 5px;
          }
          .illname {
            max-width: 260px;
          }
          .all {
            max-width: 230px;
          }
          .ter {
            max-width: 130px;
          }
          .pcf {
            max-width: 230px;
          }
        }
      }
      .tab {
        display: flex;
        padding: 20px 10px;
        color: @fontColor33;
        border-bottom: 1px dashed #f1f1f1;
        font-size: 14px;
        &:last-child {
          border-bottom: 0;
        }
        .top {
          font-weight: bold;
          height: 30px;
          line-height: 20px;
          padding: 0 0 10px 15px;
        }
        .bot {
          font-weight: bold;
          line-height: 25px;
          height: 25px;
          padding-left: 10px;
          input {
            text-align: center;
            width: 45px;
            height: 23px;
            font-weight: 400;
            padding: 0px;
          }
          display: flex;
          .van-cell {
            padding: 0;
            width: 45px;
            border: 1px solid @boederColorF1;
            /deep/ input {
              text-align: center;
            }
          }
          .last {
            border: 0;
          }
        }
      }
    }
    .foot {
      padding-top: 5px;
      button {
        margin-bottom: 20px;
        border-radius: 10px;
        width: 351px;
        background: linear-gradient(
          225deg,
          rgba(1, 128, 255, 1) 0%,
          rgba(0, 105, 255, 1) 100%
        );
        height: 44px;
        line-height: 44px;
        color: @fontColorff;
        font-size: 18px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
