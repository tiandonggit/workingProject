<!--
  作者:许鹏
  用途:营养诊断结果
  -------------------
  Created by webStorm
  User: xp
  Date: 2019年10月29日
  Time: 17:50
  Application: Nutrition diagnostic results
  State: page
-->
<template>
  <div id="results">
    <!-- <common_header :customTitle="title" /> -->
    <commonHeader
      :share-disabled="true"
      :custom-title="'营养方案'"
      :header-show="true"
      :title="'营养报告'"
    ></commonHeader>
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
            >年龄:<span class="z">{{ person_info.age }}岁</span></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
            >性别:<span class="z">
              {{ person_info.sex == 1 ? "男" : "女" }}
            </span></span
          ><span class="nr"
            >科室:<span class="z">{{ person_info.bmi }}</span></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
            >身高:<span class="z"
              >{{
                person_info.height ? parseInt(person_info.height * 100) : "0"
              }}cm</span
            ></span
          ><span class="nr"
            >体重:<span class="z">{{ person_info.weight }}kg</span></span
          >
        </div>
        <!-- <div class="tag_n">
          <span class="nr"
            >既往疾病史:<span class="z">{{
              person_info.pasthistory ? person_info.pasthistory : "无"
            }}</span></span
          ><span class="nr"
            >既往过敏史:<span class="z">{{
              person_info.allergyhistory ? person_info.allergyhistory : "无"
            }}</span></span
          >
        </div> -->
        <div class="tag_nx">
          <div class="x">既往疾病史:</div>
          <div class="z">
            {{ person_info.pasthistory ? person_info.pasthistory : "无" }}
          </div>
        </div>
        <div class="tag_nx">
          <div class="x">既往过敏史:</div>
          <div class="z">
            {{ person_info.allergyhistory ? person_info.allergyhistory : "无" }}
          </div>
        </div>
        <div class="tag_n">
          <span
            >筛查时间:<span class="z">{{ person_info.createtime }}</span></span
          >
        </div>
      </div>
    </div>
    <div class="information">
      <!-- <div class="information_title">筛查信息</div> -->
      <div class="tag">
        <div class="tag_nt">
          <img src="../../assets/img/jcx.png" alt="" />
          <span>报告信息</span>
        </div>
        <div class="tag_n">
          <span class="nr"
            >疾病名称:<span class="z">{{ disease_info.illname }}</span></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
            >营养风险评分:<span class="z"
              >{{ disease_info.assessmentbranch }}分</span
            ></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
            >每日能量需求:<span class="z"
              >{{ disease_info.totalenergy }}kcal</span
            ></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
            >营养替代能量:<span class="z"
              >{{ disease_info.dtotalenergy }}kcal</span
            ></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
            >血清白蛋白值:<span class="z">{{
              disease_info.serumalbumin
                ? disease_info.serumalbumin + "g/L"
                : "无"
            }}</span></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
            >供能比:<span class="z"
              >{{ person_info.pcfprotein }}%蛋白质：{{
                person_info.pcffat
              }}%脂肪：{{ person_info.pcfcarbohydrate }}%碳水化合物</span
            ></span
          >
        </div>
      </div>
    </div>
    <div class="presentation">
      <div class="presentationlist" v-if="lsa.length != 0">
        <div class="tag_nt" v-if="lsa.length != 0">
          <img src="../../assets/img/jypl.png" alt="" />
          <span>所需营养素</span>
        </div>
        <!-- <div class="pre_title" v-if="lsa.length != 0">所需营养</div> -->
        <table v-if="lsa.length != 0">
          <tr class="tou">
            <th>类型</th>
            <th>详情</th>
          </tr>
          <tr v-for="(item, index) in lsa" :key="index">
            <td class="bor">
              <div class="xzyh">{{ item.pname }}</div>
            </td>
            <td>
              <div class="xzyh">{{ item.propetynames }}</div>
            </td>
          </tr>
        </table>
      </div>

      <div class="presentationlist" v-if="lsb.length != 0">
        <div class="tag_nt" v-if="lsb.length != 0">
          <img src="../../assets/img/splm.png" alt="" />
          <span>膳食纤维与益生菌</span>
        </div>
        <!-- <div class="pre_title" v-if="lsa.length != 0">所需营养</div> -->
        <table v-if="lsb.length != 0">
          <tr class="tou">
            <th>所需类型</th>
            <th>建议摄入量</th>
          </tr>
          <tr v-for="(item, index) in lsb" :key="index">
            <td class="bor">
              <div class="xzyh">{{ item.pname }}</div>
            </td>
            <td>
              <div class="xzyh">{{ item.propetynames }}</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="presentationlist">
        <div class="tag_nt" v-if="lsa.length != 0">
          <img src="../../assets/img/zysx.png" alt="" />
          <span>注意事项</span>
        </div>
        <!-- <div class="pre_title">注意事项</div> -->
        <div class="pre_nr">
          {{ disease_info.attention ? disease_info.attention : "无" }}
        </div>
      </div>
      <!-- <div class="pre_nr_zw" > -->
      <!-- </div> -->
    </div>
    <div class="pre_nr_out" @click="$throttle(lookCommen)">
      <span><img src="../../assets/img/xt.png" alt="" />营养产品推荐</span>
      <span class="look">点击查看 <van-icon name="arrow"/></span>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast } from "vant";
export default {
  name: "resultsx",
  data() {
    return {
      // title: "审核通过营养监测报告",
      person_info: {},
      disease_info: {},
      list: [],
      count: 0,
      lsa: [],
      lsb: []
    };
  },
  components: {
    commonHeader
  },
  created() {
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
          this.person_info = res.data.data.nNutritionPrescribePatient;
          this.disease_info = res.data.data.instance;
          this.lsa = res.data.data.lsita;
          this.lsb = res.data.data.lsitb;
          // this.list = res.data.data.prescriptionProductInfo;
          // this.count = res.data.data.productCount;
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    //页面跳转
    lookCommen() {
      if (this.$route.query.state == 1) {
        this.$router.push({
          name: "confirmOrder",
          query: {
            state: this.$route.query.state
          }
        });
      } else {
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
            if (res.data.data.departmentid) {
              this.$store.commit(
                "Patient/saveOrderId",
                res.data.data.departmentid
              );
              this.$router.push({
                name: "orderDetail"
              });
            } else {
              this.$router.push({
                name: "confirmOrder"
              });
            }
          })
          .catch(() => {
            Toast("接口异常");
          });
      }
    }
  }
};
</script>

<style scoped lang="less">
#results {
  .padding(0, 0, 20, 0);
  -webkit-overflow-scrolling: touch;
  background: @backcolor;
  .pass_tag {
    /*.margin(20, 0, 0, 0);*/
    .padding(59, 0, 0, 0);
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
        .height(46);
        .lineHeight(46);
        border-bottom: 1px solid @backcolor;
        padding-left: 2.7vw;
        color: @fontColor33;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        .fontSize(16);
        .nr {
          width: 50%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .z {
          color: @fontColor66;
        }
        .y {
          color: @mainColor;
          font-weight: 400;
        }
      }
      .tag_nx {
        width: 100%;
        height: auto;
        .lineHeight(46);
        border-bottom: 1px solid @backcolor;
        padding-left: 2.7vw;
        padding-right: 2.7vw;
        color: @fontColor33;
        // overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        display: flex;
        justify-content: flex-start;
        .fontSize(16);
        .z {
          color: @fontColor66;
          flex: 1;
          line-height: 20px;
          padding: 3.5vw 0 4vw 0;
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
          line-height: 50px;
          padding-top: 2px;
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
        .nr {
          color: @fontColor33;
          font-size: 16px;
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
        padding-left: 10px;
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
        }
      }
    }
  }
  .medicine {
    .margin(20, 0, 0, 0);
    .medicine_title {
      .fontSize(18);
      color: @fontColor33;
      span {
        font-weight: bold;
      }
      .margin(0, 0, 13, 12);
      .padding(0, 12, 0, 0);
      display: flex;
      justify-content: space-between;
      .medicine_num {
        .fontSize(14);
        .lineHeight(16);
        color: @fontColor66;
        font-weight: normal;
        .y {
          color: @mainColor;
          font-weight: 400;
        }
      }
    }
    .tag {
      width: 93.5vw;
      background: @fontColorff;
      margin: 0 auto;
      border-radius: 2.7vw;
      .padding(5, 10, 5, 10);
      .pre-line {
        border-bottom: 0.2vw solid rgba(0, 0, 0, 0.1);
      }
      .pre-line:last-child {
        border-bottom: 0px;
      }
      .pre-message {
        align-items: center;
        /*height: 14vw;*/
        .padding(10, 0, 10, 0);
        position: relative;
      }

      .pre-message-left {
        .width(92);
        .height(92);
        border-radius: 2vw;
        overflow: hidden;
      }

      .pre-message-left img {
        width: 100%;
        height: 100%;
        align-items: center;
      }

      .pre-message-right {
        width: 65%;
        .height(92);
        display: flex;
        margin-left: 5vw;
        flex-direction: column;
        justify-content: space-between;
        .padding(10, 0, 0, 0);
      }
      .pre-message-noDrug {
        position: absolute;
        z-index: 33;
        background: rgba(0, 0, 0, 0.1);
        .width(92);
        .height(92);
        border-radius: 2vw;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        img {
          width: 100%;
          margin: auto;
        }
      }
      .p-display-column {
        display: flex;
        flex-direction: column;
      }

      .p-display-row {
        display: flex;
        flex-direction: row;
      }

      .pre-span-line {
        justify-content: space-between;
      }

      .pre-span-4 {
        display: block;
        text-align: left;
        .fontSize(12);
        margin: 2% 0;
      }

      .pre-span-3 {
        color: red;
        .fontSize(16);
      }

      .pre-span-2 {
        .fontSize(14);
      }

      .pre-span {
        .fontSize(16);
        .lineHeight(24);
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
      }
      .num {
        display: flex;
        justify-content: space-between;
        .margin(10, 0, 0, 0);
        align-items: center;
      }
      .pre-spanLit {
        .fontSize(14);
        font-weight: 400;
        .lineHeight(16);
        color: @fontColor99;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
      }
      .pre-spanLit-y {
        .fontSize(14);
        font-weight: bold;
        font-weight: 400;
        .lineHeight(16);
        color: @fontColor33;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
      }
      .pre-message-bottom {
        .fontSize(15);
      }
      .pre-more {
        font-weight: 400;
        .padding(15, 15, 15, 15);
        display: flex;
        justify-content: center;
      }
    }
  }
  .presentation {
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
    .presentationlist {
      .width(351);
      margin: auto;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-radius: 10px;
      background: @fontColorff;
    }
    .margin(20, 0, 0, 0);
    /deep/ .pre_title {
      .fontSize(18);
      color: @fontColor33;
      font-weight: bold;
      .margin(0, 0, 0, 12);
    }
    /deep/ .pre_lil_title {
      &:first-child {
        margin-top: 0px;
      }
      .fontSize(16);
      color: @fontColor33;
      font-weight: 400;
      .margin(20, 0, 10, 12);
    }
    /deep/ .pre_lil_body {
      .padding(0, 12, 0, 12);
      text-align: justify;
      .lineHeight(20);
      .fontSize(14);
      color: @fontColor66;
      font-weight: 400;
      /deep/ span {
        font-weight: bold;
        color: @fontColor33;
      }
    }
    .pre_nr {
      width: 93.5vw;
      background: @fontColorff;
      margin: auto;
      border-radius: 2.7vw;
      padding: 13px 10px 0 10px;
      font-size: 16px;
      color: @fontColor33;
      line-height: 22px;
      text-align: justify;
      .look {
        font-size: 16px;
        color: @mainColor;
        float: right;
        /deep/ .van-icon {
          top: 3px;
          color: @fontColor66;
        }
      }
    }
    .pre_nr_zw {
      padding: 12px 10px;
      margin: 15px auto;
    }
  }
  /deep/ table {
    width: 88vw !important;
    margin: auto;
    margin-top: 4.3vw;
    border-radius: 2.1vw;
    border-spacing: 0px;
    -moz-box-shadow: 0px 1px 10px #e0d9d9;
    -webkit-box-shadow: 0px 1px 10px #e0d9d9;
    box-shadow: 0px 1px 10px #e0d9d9;
    overflow: hidden;
    font-size: 14px;
  }
  /deep/ tr {
    .height(36);
    background: @fontColorff;
  }
  /deep/ table tr:nth-child(odd) {
    background: @ed;
  }
  /deep/ table tr:first-child {
    .height(49);
    .lineHeight(49);
    background-color: @mainColor !important;
    color: @fontColorff;
    border: 0px;
  }
  /deep/ th {
    width: 50%;
    border: 0px;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
  }
  /deep/ td {
    text-align: center;
    .lineHeight(36);
    width: 50%;
    .xzyh {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0px auto;
    }
  }
  /deep/ tr:first-child {
    /deep/ th:first-child {
      border-top-left-radius: 2.1vw;
      width: 32%;
    }
  }
  /deep/ tr:first-child {
    /deep/ th:last-child {
      border-top-right-radius: 2.1vw;
      width: 68%;
    }
  }
  /deep/ tr:first-child {
    /deep/ td:first-child {
      border-top-left-radius: 2.1vw;
      width: 50%;
      .height(49);
      .lineHeight(49);
    }
  }
  /deep/ tr:first-child {
    /deep/ td:last-child {
      border-top-right-radius: 2.1vw;
      width: 50%;
      .height(49);
      .lineHeight(49);
    }
  }
  /deep/ tr:last-child {
    /deep/ td:first-child {
      border-radius: 0 0 0 2.1vw;
    }
    /deep/ td:last-child {
      border-radius: 0 0 2.1vw 0;
    }
  }
  /deep/ tr {
    td:first-child {
      border-right: 1px solid @d4;
      .xzyh {
        width: 107px;
      }
    }
    td:last-child {
      .xzyh {
        width: 222px;
        padding: 0 10px;
      }
    }
  }
  .report {
    .padding(20, 12, 0, 12);
    background: @backcolor !important;
    text-align: justify;
  }
  .pre_nr_out {
    bottom: 0px;
    left: 12px;
    width: 93.5vw;
    background: @fontColorff;
    margin: auto;
    border-radius: 2.7vw;
    padding: 12px 10px;
    font-size: 16px;
    color: @fontColor33;
    line-height: 22px;
    text-align: justify;
    display: flex;
    justify-content: space-between;
    span {
      display: flex;
      align-content: center;
    }
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    .look {
      font-size: 16px;
      color: @mainColor;
      float: right;
      /deep/ .van-icon {
        top: 3px;
        color: @fontColor66;
      }
    }
  }
}
</style>
