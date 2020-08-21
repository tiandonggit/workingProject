/* * @Author: 田东 * @Date: 2020-01-03 16:25:02 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-03 16:27:49 * @name 患者信息 */
<!---->
<template>
  <div id="docPatientinfo">
    <common-header
      :share-disabled="true"
      :custom-title="'患者信息'"
      :header-show="true"
      title="患者信息"
    ></common-header>

    <div class="content">
      <div class="basic basicInfo">
        <p class="title">
          <span>基本信息</span>
        </p>
        <div>
          <span>姓名</span>
          <span>{{ name }}</span>
        </div>
        <div>
          <span>性别</span>
          <span>{{ sex }}</span>
        </div>
        <div class="lastDiv">
          <span>出生日期</span>
          <span>{{ birthday }}</span>
        </div>
      </div>
      <div class="basic diseaseHistory">
        <p class="title">
          <span>病史</span>
        </p>
        <div>
          <span>病史</span>
          <span>{{ diseaseHistory ? "有" : "无" }}</span>
        </div>

        <div class="item" v-if="diseaseHistory">
          <span>{{ diseaseHistory }}</span>
        </div>

        <div>
          <span>过敏史</span>
          <span>{{ allergy ? "有" : "无" }}</span>
        </div>

        <div class="item" v-if="allergy">
          <span>{{ allergy }}</span>
        </div>

        <div>
          <span>家族病史</span>
          <span>{{ familyHistory ? "有" : "无" }}</span>
        </div>

        <div class="lastDiv item" v-if="familyHistory">
          <span>{{ familyHistory }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Toast } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "docPatientinfo",
  data() {
    return {
      id: "",
      name: "",
      diseaseHistory: "",
      allergy: "",
      familyHistory: "",
      birthday: "",
      sex: ""
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.id = this.$route.query.patientId;
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http
        .request({
          method: "get",
          url: "/RPatientController/selectByPrimarySId",
          body: {
            id: this.id
          }
        })
        .then(res => {
          if (res.data.success && res.data) {
            let {
              name,
              age,
              cardno,
              illness,
              irritability,
              inheritance,
              sex
            } = res.data.data;
            this.name = name;
            this.age = age;
            this.sex = sex;
            if (this.sex == 1) {
              this.sex = "男";
            } else if (this.sex == 2) {
              this.sex = "女";
            } else {
              this.sex = "";
            }
            this.allergy = irritability;
            this.familyHistory = inheritance;
            this.diseaseHistory = illness;
            this.birthday = this.$testIDgetBirthday(cardno);
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("保存数据失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.van-nav-bar .van-icon {
  color: black;
}

#docPatientinfo {
  //overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;
  .padding(44, 0, 0, 0);

  .content {
    overflow: auto;
    .width(351);
    .fontSize(16);
    margin: 0 auto;

    .basic {
      background-color: @backgroundColorT;
      width: 100%;
      // .height(178);
      // min-height: 47.467vw;
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 20, 0);

      .title {
        .height(40);
        display: flex;
        align-items: center;
        padding-left: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: url("../../../assets/images/icon_zhu.png") 3.2vw center
          no-repeat;
        background-size: 1.07vw;

        span {
          .padding(0, 0, 0, 14);
          .width(80);
          .height(16);
          .fontSize(16);
          display: inline-block;
          font-weight: bold;
          color: @titleColor;
          .lineHeight(17);
        }
      }

      div {
        width: 100%;
        .height(44);
        .fontSize(14);
        display: flex;
        .padding(0, 15, 0, 15);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        align-items: center;
        justify-content: space-between;

        span {
          .fontSize(16);
          font-weight: 400;
          color: @titleColor;
          .lineHeight(16);
        }
      }

      .item {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        height: auto !important;
        word-break: break-all;
        white-space: pre-wrap;
        .padding(15, 15, 15, 15);

        span {
          display: inline-block;
          //.width(60);
          //.height(20);
          color: #999 !important;
        }
      }

      .lastDiv {
        border-bottom: none;
      }
    }
  }
}
</style>
