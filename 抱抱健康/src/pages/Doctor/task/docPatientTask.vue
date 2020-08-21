/* * @Author: 田东 * @Date: 2020-01-15 11:09:32 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-19 15:30:30 * @name 任务 */
<template>
  <div class="patientTask_page">
    <common-header :share-disabled="true" :custom-title="'今日任务'"></common-header>
    <div class="swiper-container" v-if="diseaseList.length !== 0">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in diseaseList" :key="index">
          <div class="swiper-item">
            <div class="taskBanner_box">
              <div class="task_desc">
                <p class="recovery_days">康复第{{ item.isbindillness }}天</p>
                <p class="disease_name">
                  <span>{{ item.rillnessname }}</span>
                  <van-icon name="arrow"></van-icon>
                </p>
                <p class="complete_taskNumber">已完成任务数 {{ item.rpatientid }}</p>
              </div>
              <div class="bannerImg_box">
                <img src="../../../assets/images/taskBanner.png" alt />
              </div>
            </div>
            <div class="noResult_box" v-if="!hasTask">
              <img src="../../../assets/images/noTask.png" alt />
              <p>您目前没有康复任务要完成</p>
            </div>
            <div
              class="completeMessage_box"
              v-if="patientMessageComplete === false"
              :class="[{ withMarginTop: !hasTask }]"
            >
              <p class="taskTitle">
                <img src="../../../assets/images/completeMessageIcon.png" alt />
                完善信息
              </p>
              <ul class="task_list">
                <li class="withoutBorder">
                  <img src="../../../assets/images/patientCompleteMessage.png" alt />
                  <p class="task_name">完善个人信息</p>
                  <div
                    class="complete_btn"
                    :class="[{ disable_btn: patientMessageComplete === true }]"
                  >
                    {{ patientMessageComplete === true ? "已完成" : "未完成" }}
                    <!-- <span
                      class="unComplete_tag"
                      v-if="patientMessageComplete === false"
                    ></span>-->
                  </div>
                </li>
              </ul>
            </div>
            <div
              class="wenjuan_box"
              v-if="questionnaireTaskList.length && !questionnaireTaskComplete"
            >
              <p class="taskTitle">
                <img src="../../../assets/images/wenjuanIcon.png" alt />
                问卷调查
              </p>
              <ul class="task_list">
                <li
                  :class="[
                    {
                      withoutBorder: index === questionnaireTaskList.length - 1
                    }
                  ]"
                  v-for="(item, index) in questionnaireTaskList"
                  :key="item.id"
                >
                  <img :src="item.coverurl" alt />
                  <span
                    class="tasklevel"
                    v-if="item.tasklevel === 1"
                  >{{ item.tasklevel === 1 ? "必看" : "" }}</span>
                  <p class="task_name">{{ item.title }}</p>
                  <div class="complete_btn" :class="[{ disable_btn: item.delaydays == 1 }]">
                    {{ item.delaydays == 1 ? "已完成" : "未完成" }}
                    <!-- <span
                      class="unComplete_tag"
                      v-if="item.delaydays != 1"
                    ></span>-->
                  </div>
                </li>
              </ul>
            </div>
            <div class="task_box" v-if="diseaseArticlesList.length">
              <p class="taskTitle">
                <img src="../../../assets/images/taskIcon.png" alt />
                今日任务
              </p>
              <ul class="task_list">
                <li
                  :class="[
                    { withoutBorder: index === diseaseArticlesList.length - 1 }
                  ]"
                  :key="item.id"
                  v-for="(item, index) in diseaseArticlesList"
                >
                  <img :src="item.coverurl" alt />
                  <span
                    class="tasklevel"
                    v-if="item.tasklevel === 1"
                  >{{ item.tasklevel === 1 ? "必看" : "" }}</span>
                  <p class="task_name">{{ item.title }}</p>
                  <div class="complete_btn" :class="[{ disable_btn: item.delaydays == 1 }]">
                    {{ item.delaydays == 1 ? "已完成" : "未完成" }}
                    <!-- <span
                      class="unComplete_tag"
                      v-if="item.delaydays != 1"
                    ></span>-->
                  </div>
                </li>
              </ul>
            </div>
            <div class="study_box" v-if="todayStudyList.length">
              <p class="taskTitle">
                <img src="../../../assets/images/studyTodayIcon.png" alt />
                知识学习
              </p>
              <ul class="task_list">
                <li
                  :class="[
                    { withoutBorder: index === todayStudyList.length - 1 }
                  ]"
                  v-for="(item, index) in todayStudyList"
                  :key="item.id"
                >
                  <img :src="item.logourl" alt />
                  <span
                    class="tasklevel"
                    v-if="item.tasklevel === 1"
                  >{{ item.tasklevel === 1 ? "必看" : "" }}</span>
                  <p class="task_name">{{ item.title }}</p>
                  <div class="complete_btn" :class="[{ disable_btn: item.score == 1 }]">
                    {{ item.score == 1 ? "已完成" : "未完成" }}
                    <!-- <span class="unComplete_tag" v-if="item.score != 1"></span> -->
                  </div>
                </li>
              </ul>
            </div>
            <div
              class="completeMessage_box"
              v-if="patientMessageComplete === true"
              :class="[{ withMarginTop: !hasTask }]"
            >
              <p class="taskTitle">
                <img src="../../../assets/images/completeMessageIcon.png" alt />
                完善信息
              </p>
              <ul class="task_list">
                <li class="withoutBorder">
                  <img src="../../../assets/images/patientCompleteMessage.png" alt />
                  <p class="task_name">完善个人信息</p>
                  <div
                    class="complete_btn"
                    :class="[{ disable_btn: patientMessageComplete === true }]"
                  >
                    {{ patientMessageComplete === true ? "已完成" : "未完成" }}
                    <!-- <span
                      class="unComplete_tag"
                      v-if="patientMessageComplete === false"
                    ></span>-->
                  </div>
                </li>
              </ul>
            </div>
            <div
              class="wenjuan_box"
              v-if="questionnaireTaskList.length && questionnaireTaskComplete"
            >
              <p class="taskTitle">
                <img src="../../../assets/images/wenjuanIcon.png" alt />
                问卷调查
              </p>
              <ul class="task_list">
                <li
                  :class="[
                    {
                      withoutBorder: index === questionnaireTaskList.length - 1
                    }
                  ]"
                  v-for="(item, index) in questionnaireTaskList"
                  :key="item.id"
                >
                  <img :src="item.coverurl" alt />
                  <span
                    class="tasklevel"
                    v-if="item.tasklevel === 1"
                  >{{ item.tasklevel === 1 ? "必看" : "" }}</span>
                  <p class="task_name">{{ item.title }}</p>
                  <div
                    class="complete_btn"
                    :class="[{ disable_btn: item.score == 1 }]"
                    @click.stop="patientTasks(item)"
                  >
                    {{ item.score == 1 ? "已完成" : "未完成" }}
                    <!-- <span class="unComplete_tag" v-if="item.score != 1"></span> -->
                  </div>
                </li>
              </ul>
            </div>
            <div class="article_box" v-if="articlesList.length">
              <p class="taskTitle">
                <img src="../../../assets/images/articleIcon.png" alt />
                文章推荐
              </p>
              <van-list v-if="articlesList.length" :finished="hashMore" finished-text="没有更多了">
                <articles-list :articles-list="articlesList"></articles-list>
              </van-list>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>

    <div v-show="diseaseList.length>0" class="swiper-button-prev"></div>
    <div v-show="diseaseList.length>0" class="swiper-button-next"></div>

    <div v-if="!diseaseLoading && !diseaseList.length" class="noDiseaseTask_box">
      <img src="../../../assets/images/noTask.png" alt />
      <p>您目前没有康复任务要完成</p>
    </div>

    <van-loading type="spinner" color="#0069ff" v-if="taskListLoading"></van-loading>
    <van-loading type="spinner" color="#0069ff" v-if="diseaseLoading"></van-loading>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import articlesList from "./articlesList";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";

export default {
  name: "docPatientTask",
  components: {
    commonHeader,
    articlesList
  },
  data() {
    return {
      page: 1, // 文章页数
      hashMore: false, // 是否还有更多
      loading: false, // 文章加载
      articlesList: [], // 文章列表数据
      swiper: null, // swiper实例
      diseaseList: [], // 疾病列表
      diseaseLoading: false,
      reportIdIndex: "", // 疾病id索引
      taskListLoading: false,
      diseaseId: "", // IM跳转传过来的疾病id
      diseaseIndex: "", // 疾病真实下标,用于swiper滑动到对应位置
      doctorIdIndex: "", // 医生id真实下标 取值于疾病列表 用于查询对应医生发表的文章
      patientMessageComplete: null,
      hasTask: true, // 是否有康复任务需要完成
      questionnaireTaskComplete: false, // 调查问卷是否全部完成
      diseaseArticlesList: [], // 今日任务列表(文章)
      questionnaireTaskList: [], //问卷调查列表(问卷调查)
      todayStudyList: [], // 今日学习列表(文章)
      doctorId: "", // 用于文章和任务详情里IM聊天跳转
      sessionId: "" // 用于文章和任务详情里IM聊天跳转
    };
  },
  watch: {
    diseaseList() {
      this.$nextTick(() => {
        this.swiperInit(this.reportIdIndex);
      });
    },
    reportIdIndex() {
      let index = this.reportIdIndex;
      this.getTaskListById(index);
    },
    doctorIdIndex() {
      this.articlesList = [];
      this.getArticlesList(this.doctorIdIndex);
    },
    diseaseIndex() {
      this.$nextTick(() => {
        this.swiper.slideTo(this.diseaseIndex, 1000, function() {});
      });
    }
  },
  methods: {
    /**
     * 文章页滑动到底部加载**/
    onLoad() {
      setTimeout(() => {
        // this.page++;
        // this.getArticlesList();
      }, 500);
    },
    /**
     * 患者任务页查询医生发表的文章 待修改**/
    getArticlesList() {
      this.loading = true;
      this.$http
        .request({
          method: "get",
          url: "/PArticleController/selectArticle",
          body: {
            type: 3,
            searchName: "",
            page: 1,
            limit: 4,
            docid: this.docId
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.loading = false;
            this.articlesList = res.data.data;
            this.hashMore = !res.data.hashMore;
            // 加载状态结束
            this.loading = false;
          } else {
            this.loading = false;
            console.log("获取文章接口业务报错");
          }
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    },
    /**
     * 任务卡片初始化**/
    swiperInit() {
      let vm = this;
      this.swiper = new Swiper(".swiper-container", {
        loop: false,
        grabCursor: true,
        onlyExternal: false,
        centeredSlides: true,
        slidesPerView: "auto",
        autoplayDisableOnInteraction: false,
        // pagination: {
        //   el: ".swiper-pagination",
        //   type: "progressbar"
        // },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        height: window.innerHeight,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        on: {
          /**
           * swiper切换重新查询对应疾病的未完成任务
           * loop为true的时候需要使用realIndex获取真实索引**/
          slideChangeTransitionEnd: function() {
            vm.reportIdIndex = this.activeIndex;
            vm.doctorIdIndex = this.activeIndex;
            vm.doctorId = vm.diseaseList[this.activeIndex].rdoctorid;
            vm.sessionId = vm.diseaseList[this.activeIndex].imid;
          }
        }
      });
      if (this.diseaseIndex) {
        this.swiper.slideTo(this.diseaseIndex, 1000, function() {});
      }
      this.getArticlesList(vm.doctorIdIndex || 0);
    },
    /**
     * 路由跳转
     * @params routerName **/
    routerLink(routerName, params, score) {
      // 是否已经完成信息完善,已完成点击不跳转
      if (score) {
        return false;
      }
      if (routerName && typeof routerName === "string") {
        this.$router.push({
          path: "/" + routerName,
          query: params ? params : {}
        });
      } else {
        return false;
      }
    },

    /**
     * 获取所有疾病列表**/
    getDiseaseList() {
      this.diseaseLoading = true;
      this.$http
        .request({
          method: "get",
          url: "/TaskPushController/selectPD",
          body: {
            patientId: this.patientId
          }
        })
        .then(res => {
          if (res.data.success && res.data.data.length) {
            this.diseaseList = res.data.data;
            if (this.diseaseId) {
              for (let i = 0; i < this.diseaseList.length; i++) {
                if (this.diseaseList[i].id === this.diseaseId) {
                  this.diseaseIndex = i;
                  break;
                }
              }
            }
            this.reportIdIndex = 0;
            this.doctorId = this.diseaseList[0].rdoctorid || "";
            this.sessionId = this.diseaseList[0].imid || "";
          } else {
            console.log("获取疾病接口报错");
          }
          this.diseaseLoading = false;
        })
        .catch(e => {
          console.log(e);
          this.diseaseLoading = false;
        });
    },
    /**
     * 获取具体疾病信息**/
    getSpecialDisease() {
      this.$http
        .request({
          method: "get",
          url: "/TaskPushController/selectP",
          body: {
            reportId: this.diseaseId
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.diseaseList.push(res.data.data);
          } else {
            console.log("获取疾病接口报错");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**根据疾病id查询任务**/
    getTaskListById(index) {
      this.taskListLoading = true;
      this.diseaseArticlesList = [];
      this.questionnaireTaskList = [];
      this.todayStudyList = [];
      let reportId = this.diseaseList && this.diseaseList[index].id;
      this.$http
        .request({
          method: "get",
          url: "/TaskPushController/selectTaskP",
          body: {
            reportId: reportId,
            patientId: this.patientId
            // reportId: "460436251259048321" // 临时测试数据
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.taskListLoading = false;
            this.patientMessageComplete = res.data.code == "1";
            let sortDiseaseArticlesList = res.data.data.listb || [];
            let sortTodayStudyList = res.data.data.listc || [];
            let sortQuestionnaireTaskList = res.data.data.lista || [];
            // sortDiseaseArticlesList = sortDiseaseArticlesList.sort(this.$compareBy('score', true))
            // sortTodayStudyList = sortTodayStudyList.sort(this.$compareBy('score', true))
            // sortQuestionnaireTaskList = sortQuestionnaireTaskList.sort(this.$compareBy('score', true))
            // sortDiseaseArticlesList = sortDiseaseArticlesList.sort(this.$compareBy('tasklevel', false))
            // sortTodayStudyList = sortTodayStudyList.sort(this.$compareBy('tasklevel', false))
            // sortQuestionnaireTaskList = sortQuestionnaireTaskList.sort(this.$compareBy('tasklevel', false))
            for (let i = 0; i < sortQuestionnaireTaskList.length; i++) {
              if (!sortQuestionnaireTaskList[i].score) {
                this.questionnaireTaskComplete = false;
                break;
              } else {
                this.questionnaireTaskComplete = true;
              }
            }
            this.diseaseArticlesList = sortDiseaseArticlesList;
            this.todayStudyList = sortTodayStudyList;
            this.questionnaireTaskList = sortQuestionnaireTaskList;
            this.hasTask =
              this.diseaseArticlesList.length !== 0 ||
              this.todayStudyList !== 0 ||
              this.questionnaireTaskList !== 0;
          } else {
            this.taskListLoading = false;
            console.log("获取疾病接口报错");
          }
        })
        .catch(e => {
          this.taskListLoading = false;
          console.log(e);
        });
    },

    /**
     * 患者任务
     * 根据任务类型跳转路由
     * 问卷 文章 **
     * 查询参数**/
    patientTasks(item) {
      if (item.score == 1 || item.delaydays == 1) {
        return false;
      }
      // 调研任务
      if (item.typedicid === "415125399991881729") {
        this.routerLink("questionnaire", {
          id: item.html,
          ids: item.rillnessid
        });
      }
      // 日常任务(文章)
      else if (item.typedicid === "415125570892992514") {
        this.routerLink("diseaseMessage", {
          id: item.id,
          ids: item.rillnessid,
          type: "article",
          sessionId: this.sessionId,
          doctorId: this.doctorId
        });
      } else {
        this.routerLink("diseaseMessage", {
          id: item.id,
          type: "study",
          sessionId: this.sessionId,
          doctorId: this.doctorId
        });
      }
    }
  },
  created() {
    // IM跳转获取参数
    if (this.$route.query) {
      //推送任务查看
      this.docId = this.$route.query.docid;
      this.patientId = this.$route.query.patientId;
      // this.getArticlesList();
    }

    if (this.$route.query.diseaseId) {
      this.diseaseId = this.$route.query.diseaseId;
      // this.getSpecialDisease();
    }
    this.getDiseaseList();

    if (this.$route.query.allDisease) {
      // this.getDiseaseList();
    }
  }
};
</script>

<style scoped lang="less">
.patientTask_page {
  box-sizing: border-box;
  .padding(10, 12, 35, 12);
  min-height: 100%;

  .swiper-container {
    z-index: 0;
    min-height: 100%;
    background: @backgroundColorT;
    .borderRadius(10, 10, 10, 10);

    // .swiper-pagination {
    //   position: fixed;
    //   z-index: 1000;
    //   bottom: 18 / 375 * 100vw;
    // }

    .swiper-slide {
      position: relative;

      .swiper-img {
        width: 100%;
      }
    }

    .swiper-item {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .padding(12, 12, 12, 12);

      .taskBanner_box {
        display: flex;
        justify-content: space-between;
        z-index: 999;

        .task_desc {
          .fontSize(16);
          .lineHeight(16);
          font-weight: 400;
          color: @descriptionColor;
          flex: 1;
          width: 0;

          p {
            .padding(6, 0, 6, 0);
          }

          .recovery_days {
            .fontSize(16);
            .lineHeight(16);
            font-weight: 400;
            color: @descriptionColor;
          }

          .disease_name {
            display: flex;
            align-items: center;
            /*overflow: hidden;*/
            /*text-overflow: ellipsis;*/
            /*white-space: nowrap;*/

            i {
              .fontSize(20);
              .lineHeight(20);
              color: @titleColor;
              font-weight: bold;
              .margin(0, 0, 0, 10);
            }

            span {
              /*flex: 1;*/
              /*width: 0;*/
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 160 / 375 * 100vw;
              .fontSize(20);
              .lineHeight(20);
              color: @titleColor;
              font-weight: bold;
            }
          }

          .complete_taskNumber {
            .fontSize(16);
            .lineHeight(16);
            font-weight: 400;
            color: @titleColor;
          }
        }

        .bannerImg_box {
          img {
            display: block;
            .width(116);
            .height(117);
          }
        }
      }

      .noResult_box {
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        background: @backgroundColor;
        .borderRadius(10, 10, 10, 10);
        flex-direction: column;

        img {
          display: block;
          .width(200);
          .height(200);
          .margin(30, 0, 30, 0);
        }

        p {
          .fontSize(18);
          .lineHeight(18);
          font-weight: bold;
          color: @titleColor;
          text-align: center;
          .padding(0, 0, 20, 0);
        }
      }

      .completeMessage_box p.taskTitle,
      .task_box p.taskTitle,
      .article_box p.taskTitle,
      .wenjuan_box p.taskTitle,
      .study_box p.taskTitle {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: @titleColor;
        .fontSize(16);
        .padding(4, 0, 0, 0);

        img {
          display: block;
          .width(20);
          .height(20);
          .margin(0, 10, 0, 0);
        }
      }

      .completeMessage_box.withMarginTop {
        .margin(15, 0, 15, 0);
      }

      .completeMessage_box,
      .wenjuan_box,
      .study_box,
      .task_box {
        .margin(0, 0, 15, 0);
        .padding(10, 10, 10, 10);
        background: @backgroundColor;
        .borderRadius(10, 10, 10, 10);

        .disable_btn {
          background: @mainColor !important;
          opacity: 0.6 !important;
        }

        .task_list {
          li.withoutBorder {
            border-bottom: none;
          }

          li {
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            .padding(0, 0, 15, 0);
            .margin(15, 0, 0, 0);
            position: relative;
            .borderRadius(10, 0, 0, 0);

            img {
              display: block;
              .width(60);
              .height(60);
              .margin(0, 10, 0, 0);
              .borderRadius(10, 10, 10, 10);
            }

            .tasklevel {
              display: inline-block;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 10;
              background: linear-gradient(
                226deg,
                rgba(255, 146, 0, 1) 0%,
                rgba(255, 89, 0, 1) 100%
              );
              .borderRadius(10, 0, 10, 0);
              .fontSize(14);
              .lineHeight(14);
              .padding(3, 5, 3, 5);
              font-weight: 400;
              color: @fontOne;
            }

            .task_name {
              flex: 1;
              width: 0;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              .padding(10, 10, 10, 0);
            }

            .complete_btn {
              text-align: center;
              .width(84);
              .height(30);
              .lineHeight(30);
              color: @backgroundColorT;
              background: #ccc;
              .borderRadius(6, 6, 6, 6);
              position: relative;

              .unComplete_tag {
                display: inline-block;
                .width(10);
                .height(10);
                border-radius: 50%;
                background: @fontFF3Color;
                position: absolute;
                right: -2 / 375 * 100vw;
                top: -2 / 375 * 100vw;
              }
            }
          }
        }
      }

      .article_box {
        .margin(0, 0, 15, 0);
        .padding(10, 10, 10, 10);
        background: @backgroundColor;
        .borderRadius(10, 10, 10, 10);
      }
    }
  }

  .noDiseaseTask_box {
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
      display: block;
      .width(200);
      .height(200);
      .margin(74, 0, 30, 0);
    }

    p {
      text-align: center;
      .fontSize(18);
      .lineHeight(18);
      font-weight: bold;
      color: @titleColor;
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    position: fixed !important;
    z-index: 20;
    top: 180/375 * 100vw;
    .width(32);
    .height(32);
    background-size: cover;
    padding: 2px;
  }

  .swiper-button-prev {
    background-image: url("../../../assets/images/left_swiper.png");
    left: 12/375 * 100vw;
  }

  /*改变了颜色和加粗的样式*/

  .swiper-button-next {
    background-image: url("../../../assets/images/right_swiper.png");
    right: 12/375 * 100vw;
  }
}
</style>
