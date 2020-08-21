/* * @Author: 田东 * @Date: 2020-01-06 13:33:17 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-06 13:43:26 * @name 医患沟通 —— 医生名片 */
<!---->
<template>
  <div id="docIMCardDetail">
    <common-header
      :share-disabled="true"
      :custom-title="'医生名片'"
      :header-show="true"
      :title="'医生 ' + docInfo.docName"
    ></common-header>

    <div class="content">
      <div class="info clearfix">
        <div class="left">
          <img :src="docInfo.url" alt />
        </div>
        <div class="right">
          <p class="top public-title">
            <span class="name">{{ docInfo.docName }}</span>
            <span class="office">
              <span>{{ docInfo.titleName }}</span>
            </span>
            <span class="department">{{ docInfo.depName }}</span>
          </p>
          <p class="bottom">
            <span class="hospital">{{ docInfo.hosName }}</span>
          </p>
        </div>
      </div>
      <div class="box-card">
        <p class="title">专业擅长</p>
        <div class="detail">
          {{ docInfo.speciality ? docInfo.speciality : "无" }}
        </div>
      </div>
      <div class="box-card">
        <p class="title">个人简介</p>
        <div class="detail">
          {{ docInfo.dprofile ? docInfo.dprofile : "无" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, NavBar } from "vant";

Vue.use(NavBar);
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "docIMCardDetail",
  data() {
    return {
      docInfo: {},
      id: ""
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.id = this.$route.query.doctorId;
    this.getInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getInfo() {
      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/selectDoctor",
          body: {
            id: this.id
          }
        })
        .then(res => {
          if (res.data.success && res.data) {
            this.docInfo = res.data.data.data;
            //this.$router.push({ name: "docIMCardDetail" });
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

#docIMCardDetail {
  width: 100%;
  min-height: 100%;
  background-color: @backgroundColor;
  padding-top: 12.8vw;

  .content {
    .width(351);
    margin: 0 auto;
    background-color: @backgroundColorT;
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;

    .info {
      .height(99);
      .padding(20, 10, 19, 10);

      .left {
        .width(60);
        .height(60);
        float: left;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .right {
        .width(257);
        .height(51);
        float: right;

        .bottom {
          span {
            .fontSize(14);
            font-weight: 400;
            color: @subtitleColor;
            .lineHeight(18);
            word-break: break-all;
            .overflowline(1);
          }
        }
      }
    }

    .box-card {
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      .title {
        .fontSize(16);
        font-weight: bold;
        color: @titleColor;
        .lineHeight(16);
        .margin(15, 0, 13, 0);
        .padding(0, 0, 0, 24);
        background: url("../../../assets/images/icon_zhu.png") 2.7vw center
          no-repeat;
        background-size: 1.07vw;
      }

      .detail {
        .padding(0, 12, 12, 12);
        .fontSize(16);
        font-weight: 400;
        color: @subtitleColor;
        .lineHeight(20);
      }
    }
  }
}
</style>
