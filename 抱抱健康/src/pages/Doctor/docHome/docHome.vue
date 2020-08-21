/* * @Author: 田东 * @Date: 2020-01-06 15:23:40 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-07 16:36:12 * @name 首页 */
<template>
  <div class="docHome">
    <common-header :share-disabled="true" :custom-title="'首页'"></common-header>
    <div class="banner_box">
      <swiper-banner :swiperList="swiperList"></swiper-banner>
    </div>

    <div class="router_btns_box">
      <div class="order_link" @click.stop="routerLink('docDepartmentCard')">
        <img src="../../../assets/images/docCard.png" alt />
        <span>医生名片</span>
      </div>
      <div class="order_link" @click.stop="routerLink('docArticlesSearchWater', '医学中心')">
        <img src="../../../assets/images/docCenter.png" alt />
        <span>医学中心</span>
      </div>
      <!-- <div class="order_link" @click.stop="routerLink('')">
        <img src="../../../assets/images/order.png" alt />
        <span>康复方案</span>
      </div>-->
      <div class="order_link" @click.stop="routerLink('docArticlesSearch', '名医公开课')">
        <img src="../../../assets/images/docOpen.png" alt />
        <span>公开课</span>
      </div>
      <div class="order_link" @click.stop="routerLink('statistics')">
        <img src="../../../assets/images/statistics.png" alt />
        <span>数据统计</span>
      </div>
      <div class="order_link" @click.stop="integralIndex()">
        <img src="../../../assets/images/jifen.png" alt />
        <span>礼品商城</span>
      </div>
      <div class="order_link" @click.stop="$router.push({ path: 'introduceList' })">
        <img src="../../../assets/images/icon-jikangzhijie.png" alt />
        <span>疾康知介</span>
      </div>
      <div class="order_link" @click.stop="$router.push({ path: 'docChatIMList' })">
        <img src="../../../assets/images/docPatientIM.png" alt />
        <span>患者管理</span>
      </div>
      <div class="order_link" @click.stop="$router.push({ path: 'returnVisit' })">
        <div class="diagnose-box">
          <img src="../../../assets/images/icon-fuzhen.png" alt />
          <img v-if="isHaveTodayDR" class="diagnose-reminder" src="../../../assets/images/icon-diagnose.png" alt="">
        </div>
        <span>复诊提醒</span>
      </div>
    </div>
    <div class="articles_box">
      <p class="articles_title">
        <img src="../../../assets/images/icon_right.png" alt />
        <span class="articles_type">医学中心</span>
        <img src="../../../assets/images/icon_left.png" alt />
      </p>
      <articles-list-water :articlesList="articlesList" :loadMoreToggle="false"></articles-list-water>
    </div>
    <p class="bottom_link" @click.stop="routerLink('docArticlesSearchWater', '更多文章')">去学习更多健康知识</p>

    <!--    医生名片提示-->
    <div class="docCardTips_box" v-if="tipShow">
      <div class="block-box">
        <p v-html="tipMessage"></p>
        <div class="arrow-right"></div>
      </div>
    </div>

    <van-overlay :show="tipShow" z-index="10" @click="tipShow = false"></van-overlay>

    <div class="position-box" @click.stop="$router.push({ path: 'docChatIMList' })">
      <img src="../../../assets/images/im_pic.png" alt />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, Overlay } from "vant";
import { mapState } from "vuex";

Vue.use(Overlay);
Vue.use(Toast);
import commonHeader from "../../../components/commonHeader/common_header";
import articlesListWater from "../articles/articlesListWater";
import swiperBanner from "../../../components/swiperBanner/swiper_banner";

export default {
  name: "docHome",
  components: {
    commonHeader,
    swiperBanner,
    articlesListWater
  },
  data() {
    return {
      titleName: "首页",
      articlesList: [],
      isHaveTodayDR: false, // 是否显示 今日有复诊 提示
      flag: false,
      swiperList: [],
      tipShow: false, // 是否显示名片提示框
      tipMessage: "", // 显示的提示信息
      tipMessage1:
        "让患者更加了解您，&nbsp;<img src='" +
        require("../../../assets/images/icon_tishi.png") +
        "' style='width: 5.3vw; vertical-align: bottom;' alt='' />快来维护下您的名片吧！", // 提示信息1
      tipMessage2:
        "已为您生成专属的 &nbsp;&nbsp;<img src='" +
        require("../../../assets/images/icon_tishi.png") +
        "' style='width: 5.3vw; vertical-align: bottom;' alt='' />医生名片，快来查看吧!" // 提示信息2,
    };
  },

  computed: {
    ...mapState(["DoctorIM"])
  },

  watch: {
    "DoctorIM.doctorMessage": {
      handler(val, oldVal) {
        this.tipsChange(val.data);
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    /**
     * 首页路由跳转
     * @params routerName **/
    routerLink(routerName, titleName = null) {
      if (routerName && typeof routerName === "string") {
        this.$router.push({
          name: routerName,
          query: { titleName: titleName }
        });
      } else {
        Toast("暂未开通");
        return false;
      }
    },

    integralIndex() {
      this.$router.push({
        name: "integralIndex",
        query: { type: 1 }
      });
    },

    // 查询 今日是否有复诊
    getFollowUupVisitsToday() {
      this.$http
        .request({
          method: "get",
          url: "/SSubsequentVisitController/getFollowUupVisitsToday",
          body: {
            doctorid: this.DoctorIM.doctorMessage.data.docId
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.isHaveTodayDR = res.data.data.length > 0;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },

    /**
     * 首页查询文章
     * 查询4条**/
    getBanerImg() {
      this.$http
        .request({
          method: "get",
          url: "/BackgroundPictureController/select",
          body: {
            id: "424641159755862017" //后台写死的id
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.swiperList = res.data.data;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    /**
     * 首页查询文章
     * 查询4条**/
    getArticlesList() {
      this.$http
        .request({
          method: "get",
          url: "/PArticleController/selectArticle",
          body: {
            type: 2,
            searchName: "",
            page: 1,
            limit: 10
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.flag = true;
            this.articlesList = res.data.data;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },

    /**
     * 关闭提示和遮罩**/
    closeTip() {
      this.tipShow = false;
      try {
        let doctorMessage = JSON.parse(
          JSON.stringify(this.DoctorIM.doctorMessage)
        );
        doctorMessage.data.rdoccaretype = 3;
        this.$store.commit("DoctorIM/doctorMessage", doctorMessage);
      } catch (e) {
        console.log(e);
      }
    },

    tipsChange(docMessage) {
      switch (docMessage.rdoccaretype) {
        case 1:
          this.tipShow = true;
          this.tipMessage = this.tipMessage1;
          break;
        case 2:
          this.tipShow = true;
          this.tipMessage = this.tipMessage2;
          break;
        case 3:
          this.tipShow = false;
          break;
        default:
          this.tipShow = false;
      }
    }
  },
  created() {
    this.getArticlesList();
    this.getFollowUupVisitsToday();
    this.getBanerImg();
    this.tipsChange(this.DoctorIM.doctorMessage.data);
  }
};
</script>

<style scoped lang="less">
.docHome {
  background: @backgroundColor;
  height: 100%;

  /deep/ .van-overlay {
    background-color: rgba(0, 0, 0, 0.3) !important;
  }

  .banner_box {
    width: 100%;
    .height(200);

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .router_btns_box {
    .width(351);
    .height(208);
    margin: 5.3vw auto 0;
    .padding(10, 0, 10, 0);
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;
    background: @backgroundColorT;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;

    div.order_link {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: auto 0;
      width: 25%;

      img {
        display: block;
        width: 60 / 375 * 100vw;
        .height(60);
      }

      span {
        display: inline-block;
        .fontSize(16);
        color: @titleColor;
        .margin(8, 0, 0, 0);
      }
    }

    .diagnose-box {
      position: relative;

      .diagnose-reminder {
        position: absolute;
        bottom: 0;
        left: 0.8vw;
        .width(54);
        .height(16);
      }
    }
  }

  .articles_box {
    .padding(0, 7, 0, 7);
    background: @backgroundColor;

    .articles_title {
      text-align: center;
      .margin(20, 0, 15, 0);

      .articles_type {
        font-weight: 800;
        .fontSize(18);
        color: @titleColor;
        .margin(0, 10, 0, 10);
        font-weight: bold;
      }

      img {
        .width(38);
      }
    }
  }

  .bottom_link {
    width: 100%;
    color: @mainColor;
    .fontSize(16);
    text-align: center;
    .lineHeight(22);
    font-weight: 400;
    .padding(10, 0, 10, 0);
    text-decoration: underline;
    background: @backgroundColor;
  }

  .position-box {
    .height(90);
    .width(72);
    position: fixed;
    right: 3.2vw;
    top: 60.1vh;

    img {
      width: 100%;
    }
  }
}

/*医生名片提示*/
.docCardTips_box {
  box-sizing: border-box;
  position: absolute;
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 170 / 375 * 100vw;
  left: 42 / 375 * 100vw;
  .width(174);
  .height(54);
  .padding(10, 10, 10, 10);
  background: @backgroundColorT;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  .borderRadius(5, 5, 5, 5);

  .block-box {
    width: 100%;

    p {
      .fontSize(14);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @descriptionColor;
      .lineHeight(18);
      text-align: left;
    }

    .arrow-right {
      position: absolute;
      bottom: -3.1vw;
      left: 2.1vw;
      width: 0;
      height: 0;
      font-size: 0;
      border: solid 1.6vw;
      border-color: #ffffff rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    }
  }
}
</style>
