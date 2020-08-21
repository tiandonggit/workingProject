/** *@desc 疾病详情 *@author houpai *@date 2019/07/08 17:28:55 */
<template>
  <div class="diseaseMessage_page" ref="diseasePage">
    <common-header
        :share-disabled="false"
        :header-show="true"
        :title="wxTitle"
        :custom-title="'今日任务'"
    ></common-header>
    <div class="content-block">
      <p class="article_title">
        <span>{{ (diseaseMsg && diseaseMsg.name) || diseaseMsg.title }}</span>
      </p>
      <div class="article_voice">
        <div
            class="play"
            v-if="!voiceToggle && diseaseVoice"
            @click="voiceToggleChange"
        >
          <img src="../../../assets/images/icon_voice.png" alt=""/>
          <span v-if="!voiceToggle && diseaseVoice">朗读</span>
        </div>
        <div
            class="pause"
            v-if="voiceToggle && diseaseVoice"
            @click="voiceToggleChange"
        >
          <img src="../../../assets/images/icon_voice.png" alt=""/>
          <span>暂停</span>
        </div>
      </div>
      <div
          class="article_html"
          v-html="diseaseMsg && diseaseMsg.html"
      ></div>
    </div>
    <div class="gaps">
      <img src="../../../assets/images/icon_artical_bottom.png" alt=""/>
    </div>


    <div class="footer-box" v-if="doctorId && sessionId">
      <div class="next-btn"
           @click="gotoChatWithDoctor">
        <van-button slot="button" class="next-btn" size="large">
          咨询医生
        </van-button>
      </div>
    </div>

    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"
    ></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "diseaseMessage",
    components: {
      commonHeader
    },
    data() {
      return {
        diseaseAudio: new Audio(), // audio 实例
        voiceToggle: false, // 音频是否播放
        loading: false, // loading
        diseaseId: "", // 疾病id
        diseaseMsg: {
          html: "",
          iconurl: "",
          id: "",
          logicdel: "",
          name: "",
          order: "",
          rdepartmentid: "",
          video: ""
        }, // 疾病信息
        diseaseVoice: "", // 疾病音频文件
        netWorkType: "", // 当前网络状态
        taskArticleId: "", // 任务文章类型
        taskArticleIds: "", // 任务文章类型
        doctorId: "", // 医生id
        sessionId: "", // 会话id
        userid: "" // 任务文章id(知识学习)
      };
    },
    computed: {
      wxTitle() {
        let wxTitle = "疾病详情";
        if (this.$route.query.type) {
          wxTitle = "任务详情";
        }
        return wxTitle;
      }
    },
    watch: {
      diseaseMsg: function () {
        this.playdiseaseVoice();
      }
    },
    methods: {
      /**
       * 疾病详情**/
      getDiseaseDetail(id) {
        return new Promise((resolve, rejected) => {
          this.diseaseAudio.pause();
          this.voiceToggle = this.voiceToggle
            ? !this.voiceToggle
            : this.voiceToggle;
          this.loading = true;
          this.$http
            .request({
              method: "get",
              url: "/RIllnessController/selectIllnessS",
              body: {
                id: id ? id : this.diseaseId
              }
            })
            .then(res => {
              if (res.data.success && res.data.data) {
                this.loading = false;
                this.diseaseMsg = res.data.data[0] || this.diseaseMsg;
                if (res.data.data[0].video) {
                  this.diseaseVoice =
                    res.data.data[0].video.split(",").reverse() ||
                    this.diseaseVoice;
                  localStorage.setItem(
                    "diseaseVoice",
                    JSON.stringify(this.diseaseVoice)
                  );
                }
                if (id) {
                  scrollTo(0, 0);
                }
              } else {
                this.loading = false;
                console.log("获取疾病介绍详情接口业务报错");
              }
              resolve(res);
            })
            .catch(e => {
              this.loading = false;
              console.log(e);
              rejected(e);
            });
        });
      },

      /**
       * 疾病音频循环播放**/
      playdiseaseVoice() {
        try {
          this.diseaseAudio.preload = true;
          this.diseaseAudio.controls = true;
          this.diseaseAudio.autoplay = false;
          this.diseaseAudio.src = this.diseaseVoice.pop();
          this.diseaseAudio.style.display = "none";
          this.diseaseAudio.loop = false;
        } catch (e) {
          console.log(e);
        }
      },

      /**
       * 音频ended循环**/
      playEndedHandler() {
        try {
          this.voiceToggle = false;
          if (!this.diseaseVoice.length) {
            this.diseaseVoice = localStorage.getItem("diseaseVoice")
              ? JSON.parse(localStorage.getItem("diseaseVoice"))
              : [];
            this.playdiseaseVoice();
            return false;
          }
          this.diseaseAudio.src = this.diseaseVoice.pop();
          this.diseaseAudio.play();
          // !this.diseaseVoice.length && this.diseaseAudio.removeEventListener("ended", this.playEndedHandler, false);
        } catch (e) {
          console.log(e);
        }
      },

      /**
       * 疾病音频暂停与播放**/
      voiceToggleChange() {
        this.$nextTick(() => {
          if (this.voiceToggle) {
            this.diseaseAudio.pause();
            this.voiceToggle = !this.voiceToggle;
          } else {
            this.diseaseAudio.play();
            this.voiceToggle = !this.voiceToggle;
          }
        });
      },

      /**
       * 微信分享
       * 未完成**/
      diseaseShareByWeixinAndgetNetWorkType() {
        let _this = this;
        this.$http
          .request({
            method: "post",
            url: "/wechat/getJsApiSignature",
            body: {}
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              let appId = res.data.data.appId || "";
              let timeStamp = res.data.data.timeStamp || "";
              let nonceStr = res.data.data.nonceStr || "";
              let signature = res.data.data.signature || "";
              try {
                this.$wx.config({
                  debug: false, // 开启调试模式
                  appId: appId, // 必填，公众号的唯一标识
                  timestamp: timeStamp, // 必填，生成签名的时间戳
                  nonceStr: nonceStr, // 必填，生成签名的随机串
                  signature: signature, // 必填，签名
                  jsApiList: [
                    "onMenuShareAppMessage",
                    "onMenuShareTimeline",
                    "getNetworkType"
                  ] // 必填，需要使用的JS接口列表
                });
                //自定义分享给朋友
                this.$wx.onMenuShareAppMessage({
                  title: _this.diseaseMsg.name || _this.diseaseMsg.title, // 分享标题
                  desc: "为您分享了一篇文章", // 分享标题
                  link: window.location.href, // 分享链接
                  imgUrl: "", // 分享图标
                  type: "", // 分享类型,music、video或link，不填默认为link
                  dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                  success: function () {
                  },
                  cancel: function () {
                  }
                });
                this.$wx.onMenuShareTimeline({
                  title: _this.diseaseMsg.name || _this.diseaseMsg.title, // 分享标题
                  link: window.location.href,
                  imgUrl: "", // 分享图标
                  success: function () {
                  },
                  cancel: function () {
                  }
                });
              } catch (e) {
                console.log(e);
              }
            }
          })
          .catch(e => {
            console.log("e=====", e);
          });
      },

      /**
       * 获取任务文章数据**/
      getTaskArticle() {
        return new Promise((resolve, rejected) => {
          this.loading = true;
          this.$http
            .request({
              method: "get",
              url: "/TaskDoctorController/selectTaskText",
              body: {
                id: this.taskArticleId,
                ids: this.taskArticleIds
              }
            })
            .then(res => {
              if (res.data.success && res.data.data) {
                this.loading = false;
                this.diseaseMsg = res.data.data || this.diseaseMsg;
              } else {
                this.loading = false;
                console.log("获取任务文章接口业务报错");
              }
              resolve(res);
            })
            .catch(e => {
              this.loading = false;
              console.log(e);
              rejected(e);
            });
        });
      },

      /**
       * 获取今日学习文章**/
      getStudyArticle() {
        return new Promise((resolve, rejected) => {
          this.loading = true;
          this.$http
            .request({
              method: "get",
              url: "/PArticleController/selectByPrimaryKey",
              body: {
                id: this.taskArticleId,
                userid: this.userid
              }
            })
            .then(res => {
              if (res.data.success && res.data.data) {
                this.loading = false;
                this.diseaseMsg = res.data.data || this.diseaseMsg;
                console.log("studyList===", res.data.data);
              } else {
                this.loading = false;
                console.log("获取任务文章接口业务报错");
              }
              resolve(res);
            })
            .catch(e => {
              this.loading = false;
              console.log(e);
              rejected(e);
            });
        });
      },

      /**
       * 跳转IM**/
      gotoChatWithDoctor() {
        if (!this.sessionId) {
          return false;
        }
        if (!this.doctorId) {
          return false;
        }
        let sessionMessage = {
          sessionType: 0,
          sessionId: this.sessionId,
          doctorId: this.doctorId
        };
        this.$store.commit("PatientIM/sessionMessage", sessionMessage);
        this.$router.push({
          path: "chatIMDetail",
          query: {
            sessionType: 0,
            sessionId: this.sessionId,
            doctorId: this.doctorId
          }
        });
      }
    },
    created() {
      if (this.$route.query.sessionId && this.$route.query.doctorId) {
        this.sessionId = this.$route.query.sessionId;
        this.doctorId = this.$route.query.doctorId;
      }
      this.diseaseAudio.addEventListener("ended", this.playEndedHandler, false);
      let getTaskArticle = null;
      let getDiseaseDetail = null;
      let getStudyArticle = null;
      this.diseaseShareByWeixinAndgetNetWorkType();
      if (this.$route.query.type === "article") {
        this.taskArticleId = this.$route.query.id;
        this.taskArticleIds = this.$route.query.ids;
        getTaskArticle = this.getTaskArticle();
        Promise.all([getTaskArticle]).then(() => {
          this.diseaseShareByWeixinAndgetNetWorkType();
        });
      } else if (this.$route.query.type === "study") {
        this.taskArticleId = this.$route.query.id;
        this.userid = this.$route.query.userid || "";
        getStudyArticle = this.getStudyArticle();
        Promise.all([getStudyArticle]).then(() => {
          this.diseaseShareByWeixinAndgetNetWorkType();
        });
      } else {
        if (this.$route.query.id) {
          this.diseaseId = this.$route.query.id;
          getDiseaseDetail = this.getDiseaseDetail();
        }
        Promise.all([getDiseaseDetail]).then(() => {
          this.diseaseShareByWeixinAndgetNetWorkType();
        });
      }
    },
    beforeDestroy() {
      if (this.articleAudio) {
        this.articleAudio.pause();
        localStorage.removeItem("diseaseVoice");
        this.diseaseAudio.removeEventListener(
          "ended",
          this.playEndedHandler,
          false
        );
      }
    }
  };
</script>

<style scoped lang="less">
  .article_html /deep/ img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    margin: 0 auto;
    text-align: center;
    .borderRadius(8, 8, 8, 8);
    .margin(0, 0, 10, 0);
  }

  .diseaseMessage_page {
    box-sizing: border-box;
    .padding(44, 0, 64, 0);


    .content-block {
      .width(351);
      margin: 5.3vw auto 0;
      border-top-left-radius: 2.7vw;
      background-color: @backgroundColorT;
      background-image: url("../../../assets/images/icon_artical_top.png");
      background-position: right -2px;
      background-repeat: no-repeat;
      background-size: 30px;

      .article_title {
        display: flex;
        .padding(14, 40, 14, 10);

        span {
          display: inline-block;
          flex: 1;
          text-align: left;
          .fontSize(20);
          .lineHeight(24);
          font-weight: 500;
          color: @titleColor;
        }
      }

      .article_voice {
        .lineHeight(20);
        .padding(0, 10, 0, 10);

        .play,
        .pause {
          img {
            .width(14);
          }

          span {
            .fontSize(14);
            font-weight: 400;
            color: @mainColor;
            .lineHeight(20);
            vertical-align: top;
            .margin(0, 0, 0, 10);
          }
        }
      }


      .article_html {
        width: 90%;
        margin: 0 auto;
        overflow: hidden;
        word-wrap: break-word;
        //.margin(0, 16, 0, 16);
        letter-spacing: 2px;
        line-height: 24px;
        .padding(0, 0, 10, 0);
      }
    }


    .disease_title {
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      .margin(20, 0, 8, 16);
      .height(28);
      .lineHeight(28);
      .fontSize(20);
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
    }


    .gaps {
      width: 93.6vw;
      margin: 0 auto;

      img {
        width: 100%;
      }
    }
  }
</style>
