/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: screeningReport *
@function: * @date: 2020/1/10 * @time: 11:14 * * */
<template>
  <div id="results">
    <!-- <common_header :customTitle="title" /> -->
    <commonHeader
      :share-disabled="true"
      :custom-title="'营养风险筛查'"
      :header-show="true"
      :title="'营养风险筛查结果'"
    ></commonHeader>
    <div class="main">
      <div class="pass_tag">
        <!-- <div class="pass_title">患者信息</div> -->
        <div class="tag">
          <div class="tag_nt">
            <img src="../../assets/img/xzjh.png" alt="" />
            <span>患者信息</span>
          </div>
          <div class="tag_n">
            <span class="nr"
              >姓名:<span class="z">{{ person_info.name }}</span></span
            ><span class="nr"
              >电话:<span class="z">{{ person_info.nphone }}</span></span
            >
          </div>
          <div class="tag_n">
            <span class="nr"
              >年龄:<span class="z"> {{ person_info.age }}岁 </span></span
            ><span class="nr"
              >性别:<span class="z">{{
                person_info.sex == 1 ? "男" : "女"
              }}</span></span
            >
          </div>
          <div class="tag_n">
            <span class="nr"
              >身高:<span class="z"
                >{{
                  person_info.height
                    ? Math.round(person_info.height * 100)
                    : "0"
                }}cm</span
              ></span
            ><span class="nr"
              >体重:<span class="z">{{ person_info.weight }}kg</span></span
            >
          </div>
          <div class="tag_n">
            既往疾病史:
            <span class="z">{{
              person_info.pasthistory ? person_info.pasthistory : "无"
            }}</span>
          </div>
          <div class="tag_n">
            既往过敏史:
            <span class="z">{{
              person_info.allergyhistory ? person_info.allergyhistory : "无"
            }}</span>
          </div>
          <div class="tag_n">
            <span
              >筛查时间:<span class="z">{{
                person_info.createtime
              }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="information">
        <!-- <div class="information_title">筛查信息</div> -->
        <div class="tag">
          <div class="tag_nt">
            <img src="../../assets/img/jcx.png" alt="" />
            <span>筛查信息</span>
            <span @click="onTap" class="tap_head">查看详情</span>
          </div>
          <div class="tag_n">
            <span class=""
              >营养风险评分:<span class="z">{{ score }}分</span></span
            >
          </div>
          <div class="tag_n">
            <span class=""
              >身体质量指数（BMI）:<span class="z">{{
                person_info.bmi ? person_info.bmi : "无"
              }}</span></span
            >
          </div>
          <div class="tag_n">
            <span class=""
              >血清蛋白值(g/L):<span class="z">{{
                person_info.serumalbumin == 0 ||
                person_info.serumalbumin == "" ||
                person_info.serumalbumin == "无"
                  ? "无"
                  : person_info.serumalbumin
              }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="information">
        <!-- <div class="information_title">筛查信息</div> -->
        <div class="tag">
          <div class="tag_nt">
            <img src="../../assets/img/docInfo.png" alt="" />
            <span>医生信息</span>
          </div>
          <div class="tag_n">
            <div class="nr">
              姓名:<span class="z">{{ doctor_info.docName }}</span>
            </div>
            <div class="nr">
              职称:<span class="z">{{ doctor_info.titleName }}</span>
            </div>
          </div>
          <div class="tag_n">
            <span class="nrl"
              >科室:<span class="z">{{ doctor_info.depName }}</span></span
            >
          </div>
          <div class="tag_n">
            <span class="nrl"
              >医院:<span class="z">{{ doctor_info.hosName }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="hint">
        {{
          this.typeStatus == 10
            ? "提交后请耐心等待医生为您定制营养方案"
            : "请与医生沟通进行营养方案定制"
        }}
      </div>
      <div class="foot">
        <van-button type="default" @click="onclose">{{
          this.typeStatus == 10 ? "确认提交" : "确认"
        }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Dialog, Toast } from "vant";
import wx from "weixin-js-sdk";
import { mapState } from "vuex";

export default {
  name: "resultsx",
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      // title: "审核通过营养监测报告",
      score: this.$route.query.score, //评分页面
      person_info: {},
      doctor_info: {},
      type: 1
    };
  },
  components: {
    commonHeader
  },
  created() {
    //是患者自己开的
    this.typeStatus =
      this.$route.query.typeStatus && this.$route.query.typeStatus != undefined
        ? this.$route.query.typeStatus
        : 0;

    if (this.$route.query.id) {
      window.sessionStorage.setItem("id", this.$route.query.id);
    }
    if (!window.sessionStorage.getItem("id")) {
      Toast("当前处方不存在");
    } else {
      this.showlist();
    }
    console.log(this.lsa);
  },
  methods: {
    onTap() {
      //跳转到下一页
      this.$router.push({
        path: "/nutritionalRiskScreeningDetails",
        query: {
          type: 10
        }
      });
    },
    onclose() {
      if (this.typeStatus == 10) {
        //医生患者用同一个

        this.dlog();

        //判断回到im还是关闭窗口
      } else {
        if (this.Patient.isIM) {
          window.sessionStorage.clear("id");
          console.log(this.Patient.pathNum);
          this.$router.go(-1*this.Patient.pathNum);
          // location.href =
          //   this.$globalServiceHost.serveHost +
          //   this.$globalServiceHost.projectName1 +
          //   "/#/chatIMDetail";
        } else {
          //关闭当前页
          wx.closeWindow();
        }
      }
    },
    dlog() {
      Dialog.confirm({
        message: "是否确认提交？"
      })
        .then(() => {
          this.generateScreeningPatient();
        })
        .catch(() => {});
    },
    generateScreeningPatient() {
      //患者选择医生之后生成营养筛查确认提交后发送给医生（为患者操作）
      // console.log(this.$globalServiceHost);
      // return;
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
            //判断是im还是关闭
            if (!this.Patient.isIM) {
              wx.closeWindow();
            } else {
              //IM里返回啊
              console.log("IM里返回啊");
              window.sessionStorage.clear("id");
              console.log(this.Patient.pathNum);
              this.$router.go(-1*this.Patient.pathNum);
              // location.href =
              //   this.$globalServiceHost.serveHost +
              //   this.$globalServiceHost.projectName1 +
              //   "/#/chatIMDetail";
              // this.$router.go(-5)
            }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    //展示数据
    showlist() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/selectByPrimaryKeyId",
          body: {
            id: window.sessionStorage.getItem("id")
            // id: "455106805983481857"
          }
        })
        .then(res => {
          console.log(res);
          this.person_info = res.data.data;
          this.selectDoc();
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    //医生信息
    selectDoc() {
      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/selectDoctor",
          body: {
            id: this.person_info.doctorid
            // id: "455106805983481857"
          }
        })
        .then(res => {
          console.log(res);
          this.doctor_info = res.data.data.data;
          // this.selectDoc();
        })
        .catch(() => {
          Toast("接口异常");
        });
    }
  }
};
</script>

<style scoped lang="less">
#results {
  .main {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: env(safe-area-inset-bottom);
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none !important;
      width: 0px;
      height: 0px;
    }
    -webkit-overflow-scrolling: touch;
    .hint {
      color: @fontColorFF3;
      font-size: 14px;
      line-height: 20px;
      padding: 15px 0 20px 12px;
    }
    .foot {
      padding: 0 12px 15px 12px;
      button {
        line-height: 44px;
        width: 100%;
        font-size: 18px;
        color: @fontColorff;
        background: linear-gradient(225deg, @startColor 0%, @endColor 100%);
      }
    }
  }
  .padding(0, 0, 20, 0);
  -webkit-overflow-scrolling: touch;
  background: @backcolor;
  .pass_tag {
    /*.margin(20, 0, 0, 0);*/
    .padding(15, 0, 0, 0);
    width: 100%;
    .pass_title {
      .fontSize(18);
      color: @fontColor33;
      font-weight: bold;
      .margin(0, 0, 13, 12);
    }
    .tag {
      width: 93.5vw;
      background: @fontColorff;
      margin: 0 auto;
      border-radius: 2.7vw;
      .tag_n {
        width: 100%;
        line-height: 22px;
        padding: 12px;
        border-bottom: 1px solid @backcolor;
        color: @fontColor33;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        font-size: 16px;
        .nr {
          width: 50%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .z {
          color: @fontColor66;
          flex: 1;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .y {
          color: @mainColor;
          font-weight: 400;
        }
      }
      .tag_nt {
        width: 100%;
        .height(46);
        .lineHeight(46);
        border-bottom: 1px solid @backcolor;
        padding-left: 2.7vw;
        color: @fontColor33;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        .fontSize(16);
        img {
          .width(18.8);
          .height(19.6);
          margin-right: 11px;
        }
        span {
          font-weight: bold;
        }
      }
      .zz {
        color: @fontColor33;
      }
      .tag_n:last-child {
        border-bottom: 0px;
      }
    }
  }
  .information {
    .padding(20, 0, 0, 0);
    .information_title {
      .fontSize(18);
      color: @fontColor33;
      font-weight: bold;
      .margin(0, 0, 13, 12);
    }
    .tag {
      width: 93.5vw;
      background: @fontColorff;
      margin: 0 auto;
      border-radius: 2.7vw;
      padding-bottom: 12px;
      .tag_n {
        width: 100%;
        min-height: 30px;
        line-height: 24px;
        padding: 0 10px;
        display: flex;
        .nr {
          color: @fontColor33;
          font-size: 16px;
          width: 50%;
          .z {
            color: @fontColor66;
          }
        }
      }

      .tag_nt {
        width: 100%;
        .height(46);
        .lineHeight(46);
        border-bottom: 1px solid @backcolor;
        // padding-left: 2.7vw;
        color: @fontColor33;
        padding: 0 10px;
        margin-bottom: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        .fontSize(16);
        img {
          .width(18.8);
          .height(19.6);
          margin-right: 11px;
        }
        span {
          font-weight: bold;
          flex: 1;
        }

        .tap_head {
          flex: none;
          font-size: 16px;
          font-weight: bold;
          color: @mainColor;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
