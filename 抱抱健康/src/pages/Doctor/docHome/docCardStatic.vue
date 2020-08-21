/*
 * @Author: 田东 
 * @Date: 2020-05-20 11:46:10 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-05-20 13:47:23
 * @name 医生名片——静态
 */

<template>
  <div id="docCardStatic">
    <common-header
      :share-disabled="true"
      :custom-title="'医生名片'"
      :header-show="true"
      :title="docInfo.docname"
    ></common-header>

    <div class="container">
      <div class="doc-url">
        <img :src="docInfo.docurl" alt />
      </div>
      <div class="doc-name">{{docInfo.docname}}</div>
      <div class="doc-del">
        <span>{{docInfo.delname}}</span>
        <span>{{docInfo.titlename}}</span>
      </div>
      <div class="doc-hos">{{docInfo.hosname}}</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, NavBar } from "vant";

Vue.use(NavBar);
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "docCardStatic",
  data() {
    return {
      docInfo: {}
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.docInfo = this.$route.query.docInfo || {};
    this.docInfo = JSON.parse(this.docInfo);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
#docCardStatic {
  height: 100%;
  .padding(44, 12, 10, 12);
  box-sizing: border-box;
  background: @backgroundColor;

  .container {
    .height(537);
    .margin(20, 0, 0, 0);
    .padding(180, 36, 0, 36);
    background-image: url("../../../assets/images/doc_card_s.png");
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: contain;

    .doc-url {
      .width(72);
      .height(72);
      margin: 0 auto 2.7vw;
      border: 4px solid rgba(255, 255, 255, 0.5);
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .doc-name {
      .margin(0, 0, 15, 0);
      text-align: center;
      .fontSize(18);
      font-weight: bold;
      color: @titleColor;
      .lineHeight(20);
    }

    .doc-del {
      .margin(0, 0, 15, 0);
      text-align: center;

      span {
        .margin(0, 10, 0, 10);
        .fontSize(16);
        color: @titleColor;
        .lineHeight(18);
        font-weight: 400;
      }
    }

    .doc-hos {
      text-align: center;
      .fontSize(14);
      color: @titleColor;
      .lineHeight(16);
      font-weight: 400;
    }
  }
}
</style>
