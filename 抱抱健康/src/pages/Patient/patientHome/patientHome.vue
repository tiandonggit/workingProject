/** *@desc 患者首页 *@author houpai *@date 2019/07/03 17:09:04 */
<template>
  <div class="patient_home_page">
    <common-header
        :share-disabled="true"
        :custom-title="'康复中心'"
    ></common-header>
    <div class="banner_box">
      <swiper-banner :swiperList="swiperList"></swiper-banner>
    </div>
    <div class="router_btns_box">
      <div class="order_link" @click.stop="routerLink('patientTask')">
        <img src="../../../assets/images/task.png" alt=""/>
        <span>今日任务</span>
      </div>
      <div class="order_link" @click.stop="routerLink('chatIMList')">
        <img src="../../../assets/images/doctorTeam.png" alt=""/>
        <span>医生团队</span>
      </div>
      <div class="order_link" @click.stop="routerLink('productOrderList')">
        <img src="../../../assets/images/order.png" alt=""/>
        <span>我的订单</span>
      </div>
      <div class="order_link" @click.stop="routerLink('personalCenter')">
        <img src="../../../assets/images/personCenter.png" alt=""/>
        <span>个人中心</span>
      </div>
      <!-- 新增健康管家 -张松仁 -->
      <div class="order_link" @click.stop="routerLink('stewardIM')">
        <img src="../../../assets/images/steward.png" alt=""/>
        <span>健康管家</span>
      </div>
      <!-- 新增健康管家 -张松仁 -->
      <div class="order_link" @click.stop="routerLink('integralIndex')">
        <img src="../../../assets/images/jifen.png" alt=""/>
        <span>礼品商城</span>
      </div>
      <!-- 疾康知介  -->
      <div class="order_link" @click.stop="$router.push({ path: 'introduceList' })">
        <img src="../../../assets/images/icon-jikangzhijie.png" alt/>
        <span>疾康知介</span>
      </div>
      <div class="order_link" @click.stop="$router.push({ path: 'returnVisitP' })">
        <div class="diagnose-box">
          <img src="../../../assets/images/icon-fuzhen.png" alt/>
          <img v-if="isHaveTodayPR" class="diagnose-reminder" src="../../../assets/images/icon-diagnose.png" alt="">
        </div>
        <span>复诊提醒</span>
      </div>
    </div>
    <div class="articles_box">
      <p class="articles_title"></p>
      <articles-list :articlesList="articlesListData" :isLoad="false"></articles-list>
    </div>
    <p class="bottom_link" @click.stop="routerLink('articlesSearch')">
      了解更多健康常识
    </p>
  </div>
</template>

<script>

  import {Toast} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";
  import articlesList from "../articles/articlesList";
  import swiperBanner from "../../../components/swiperBanner/swiper_banner";
  import {mapState} from "vuex";

  export default {
    name: "patientHome",
    components: {
      commonHeader,
      articlesList,
      swiperBanner
    },
    data() {
      return {
        articlesListData: [], // 文章列表数据
        swiperList: [],
        isHaveTodayPR: false // 今日是否有复诊
      };
    },
    computed: {
      ...mapState(["Patient"])
    },
    methods: {
      /**
       * 首页路由跳转
       * @params routerName **/
      routerLink(routerName, query = {}) {
        if (routerName && typeof routerName === "string") {
          this.$router.push(
            {
              name: routerName,
              query: query
            }
          );
        } else {
          Toast("暂未开通");
          return false;
        }
      },
      /**
       * 患者首页查询文章
       * 查询4条**/
      getArticlesList() {
        this.$http.request({
          method: "get",
          url: "/PArticleController/selectArticle",
          body: {
            type: 3,
            searchName: "",
            page: 1,
            limit: 10
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            this.articlesListData = res.data.data;
          } else {
            console.log("首页获取文章接口业务报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 轮播banner**/
      getSwiperBannerList() {
        this.$http.request({
          method: "get",
          url: "/BackgroundPictureController/select",
          body: {
            id: "424641993625440258"
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            this.swiperList = res.data.data;
          } else {
            Toast(res.data.message || "获取轮播图banner接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 查询 今日是否有复诊
       * **/
      getVisitsToday() {
        this.$http.request({
          method: "get",
          url: "/SSubsequentVisitController/getFollowUupVisitsToday",
          body: {
            patientId: this.Patient.patientMessage.id || ""
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            this.isHaveTodayPR = res.data.data.length > 0;
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(err => {
          console.log(err);
        });
      }
    },
    created() {
      this.getSwiperBannerList();
      this.getArticlesList();
      this.getVisitsToday();
    }
  };
</script>

<style scoped lang="less">
  .patient_home_page {
    background: @backgroundColor;
    min-height: 100%;

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
      background: #fff;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .margin(20, 12, 15, 12);
      .padding(20, 0, 0, 0);
      .borderRadius(10, 10, 10, 10);


      div.order_link {
        display: flex;
        flex-direction: column;
        align-items: center;
        .margin(0, 0, 20, 0);
        width: 25%;

        img {
          display: block;
          .width(60);
          .height(60);
        }

        span {
          display: inline-block;
          .fontSize(16);
          color: @titleColor;
          .margin(8, 0, 0, 0);
          font-weight: 400;
          .lineHeight(20);
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
      .margin(0, 12, 0, 12);

      .articles_title {
        .height(26);
        background: url("../../../assets/images/articleTitle.png") no-repeat center;
        background-size: 60% 100%;
        .margin(17, 0, 6, 0);
      }
    }

    .bottom_link {
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 105, 255, 1);
      text-align: center;
      .margin(20, 0, 0, 0);
      .padding(0, 0, 20, 0);
      background-color: @backgroundColor;
      text-decoration: underline;
    }
  }
</style>
