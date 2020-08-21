/**
 *@desc 文章详情
 *@author houpai
 *@date 2020/01/14 16:21:58
 */
<template>
  <div class="articleDetail_page" ref="articlePage">
    <common-header
        :share-disabled="false"
        :custom-title="'文章详情'"
        :header-show="true"
        title="文章详情"
    ></common-header>
    <div class="content-block">
      <p class="article_title">
        <span>{{ articlemsg && articlemsg.articletitle }}</span>
      </p>
      <div class="article_voice">
        <div
            class="play"
            v-if="!voiceToggle && articleVoice"
            @click="voiceToggleChange"
        >
          <img src="../../../assets/images/icon_voice.png" alt="" />
          <span v-if="!voiceToggle && articleVoice">朗读</span>
        </div>
        <div
            class="pause"
            v-if="voiceToggle && articleVoice"
            @click="voiceToggleChange"
        >
          <img src="../../../assets/images/icon_voice.png" alt="" />
          <span>暂停</span>
        </div>
      </div>
      <div class="doctor_message_box">
        <div class="doctor_photo_div">
          <img
              :src="articlemsg.docurl"
              alt
              class="doctor_photo"
              v-if="articlemsg.articletype === 2"
          />
          <img
              src="../../../assets/images/pingtai.png"
              alt
              class="doctor_photo"
              v-else
          />
        </div>
        <div class="doctor_message">
          <p class="doctor_only_name" v-if="articlemsg.articletype === 1">
            {{ $route.query.docname || '' }}
          </p>
          <p class="doctor_name" v-else>{{ articlemsg && articlemsg.docname }}</p>
          <p
              class="hospital_name"
              v-if="articlemsg && articlemsg.articletype === 2"
          >
            {{ articlemsg && articlemsg.dochospital }}
            <span class="department_name">
              {{ articlemsg && articlemsg.docdepartment }}
            </span>
          </p>
        </div>
      </div>
      <div :class="[articleId.length == 0 ? 'article_img' : 'img_detail']">
        <img :src="articlemsg && articlemsg.articlelogourl" alt />
      </div>
      <div
          class="article_html"
          v-html="articlemsg && articlemsg.articlehtml"
      ></div>
    </div>
    <div class="gaps">
      <img src="../../../assets/images/icon_artical_bottom.png" alt="" />
    </div>
    <div class="article_push">
      <p class="article_push_title">相关推荐</p>
      <ul class="article_push_list">
        <li
            v-for="(item, index) in relevancearticlelist"
            @click="changeRouteQuery(item.relevancearticleid, item.docname)"
            :key="index"
        >
          <div class="article_push_img">
            <img :src="item.relevancearticlelogourl" alt />
          </div>
          <div class="article_push_message">
            {{ item.relevancearticletitle }}
          </div>
        </li>
      </ul>
    </div>
    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import merge from "webpack-merge";
  export default {
    name: "articleDetail",
    components: {
      commonHeader
    },
    data() {
      return {
        articleAudio: new Audio(), // audio 实例
        voiceToggle: false, // 音频是否播放
        loading: false, // loading
        articleId: "", // 文章id
        articlemsg: {
          articletitle: "",
          articletype: 1,
          dochospital: "",
          articlelogourl: "",
          docname: "",
          articlevoice: "",
          docdepartment: "",
          articlehtml: ""
        }, // 文章信息
        articleVoice: [], // 文章音频文件
        relevancearticlelist: [], // 推荐文章
        netWorkType: "" // 当前网络状态
      };
    },
    watch: {
      articlemsg: function() {
        this.playArticleVoice();
      },
      $route(val, old) {
        if (val.query.articleId) {
          this.getArticleDetail(val.query.articleId);
        }
      }
    },
    methods: {
      changeRouteQuery(id, docname) {
        this.$router.push({
          query: merge(this.$route.query, { articleId: id }, { docname: this.$route.query.docname || docname })
        });
      },
      /**
       * 文章详情**/
      getArticleDetail(id) {
        return new Promise((resolve, rejected) => {
          this.articleAudio.pause();
          this.voiceToggle = this.voiceToggle
            ? !this.voiceToggle
            : this.voiceToggle;
          this.loading = true;
          this.$http
            .request({
              method: "get",
              url: "/PArticleController/selectArticleDetails",
              body: {
                id: id ? id : this.articleId
              }
            })
            .then(res => {
              if (res.data.success && res.data.data) {
                this.loading = false;

                if (res.data.data.articlemsg.length) {
                  this.articlemsg = res.data.data.articlemsg[0] || [];
                  this.relevancearticlelist =
                    res.data.data.relevancearticlelist ||
                    this.relevancearticlelist;
                  if (
                    res.data.data.articlemsg.length &&
                    res.data.data.articlemsg[0].articlevoice
                  ) {
                    this.articleVoice =
                      res.data.data.articlemsg[0].articlevoice
                        .split(",")
                        .reverse() || this.articleVoice;
                    localStorage.setItem(
                      "articleVoice",
                      JSON.stringify(this.articleVoice)
                    );
                  }
                }

                if (id) {
                  scrollTo(0, 0);
                }
                resolve(res.data.data);
              } else {
                this.loading = false;
                console.log("获取文章详情接口业务报错");
              }
            })
            .catch(e => {
              rejected(e);
              this.loading = false;
              console.log(e);
            });
        });
      },

      /**
       * 文章音频循环播放**/
      playArticleVoice() {
        this.articleAudio.preload = true;
        this.articleAudio.controls = true;
        this.articleAudio.autoplay = false;
        this.articleAudio.src = this.articleVoice.pop();
        this.articleAudio.style.display = "none";
        this.articleAudio.loop = false;
      },

      /**
       * 音频ended循环**/
      playEndedHandler() {
        try {
          if (!this.articleVoice.length) {
            this.articleVoice = localStorage.getItem("articleVoice")
              ? JSON.parse(localStorage.getItem("articleVoice"))
              : [];

            this.voiceToggle = false;
            this.playArticleVoice();
            return false;
          } else {
            this.articleAudio.src = this.articleVoice.pop();

            this.articleAudio.play();
          }
        } catch (e) {
          console.log(e);
        }
      },

      /**
       * 文章音频暂停与播放**/
      voiceToggleChange() {
        this.$nextTick(() => {
          if (this.voiceToggle) {
            this.articleAudio.pause();
            this.voiceToggle = !this.voiceToggle;
          } else {
            this.articleAudio.play();
            this.voiceToggle = !this.voiceToggle;
          }
        });
      },

      /**
       * 微信分享
       * 未完成**/
      articleShareByWeixinAndgetNetWorkType() {
        let _this = this;
        this.$http
          .request({
            method: "post",
            url: "/wechat/getJsApiSignature",
            body: {
              url: window.location.href.split("#")[0]
            }
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
                this.$wx.ready(() => {
                  console.log("window.href", window.location.href);
                  //自定义分享给朋友
                  this.$wx.onMenuShareAppMessage({
                    title: _this.articlemsg && _this.articlemsg.articletitle, // 分享标题
                    desc: "为您分享了一篇健康文章", // 分享标题
                    link: window.location.href, // 分享链接
                    imgUrl:
                      (_this.articlemsg && _this.articlemsg.articlelogourl) || "", // 分享图标
                    type: "", // 分享类型,music、video或link，不填默认为link
                    dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {},
                    cancel: function() {}
                  });
                  this.$wx.onMenuShareTimeline({
                    title: _this.articlemsg && _this.articlemsg.articletitle, // 分享标题
                    link: window.location.href,
                    imgUrl:
                      (_this.articlemsg && _this.articlemsg.articlelogourl) || "", // 分享图标
                    success: function() {},
                    cancel: function() {}
                  });
                });
              } catch (e) {
                console.log(e);
              }
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    created() {
      this.articleAudio.addEventListener("ended", this.playEndedHandler, false);
      let getArticleDetailPromise = null;

      if (this.$route.query.articleId) {
        this.articleId = this.$route.query.articleId;
        localStorage.setItem("articleId", this.$route.query.articleId);
        getArticleDetailPromise = this.getArticleDetail();
      } else {
        this.articleId = localStorage.getItem("articleId");
        getArticleDetailPromise = this.getArticleDetail();
      }
      Promise.all([getArticleDetailPromise]).then(() => {
        this.articleShareByWeixinAndgetNetWorkType();
      });
    },
    beforeDestroy() {
      if (this.articleAudio) {
        this.articleAudio.pause();
        localStorage.removeItem("articleVoice");
        this.articleAudio.removeEventListener(
          "ended",
          this.playEndedHandler,
          false
        );
      }
    }
  };
</script>

<style scoped lang="less">
  * {
    box-sizing: border-box;
  }

  .article_html /deep/ img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    margin: 0 auto;
    text-align: center;
    .borderRadius(8, 8, 8, 8);
  }

  .articleDetail_page {
    box-sizing: border-box;
    background: @backgroundColor;
    .padding(44,0,0,0);

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
          font-family: PingFangSC-Medium, PingFang SC;
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

      .doctor_message_box {
        display: flex;
        align-items: center;
        .height(55);
        .padding(10, 0, 5, 0);

        .doctor_photo_div {
          width: 32px;
          height: 32px;
          .margin(0, 12, 0, 10);

          .doctor_photo {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .doctor_message {
          flex: 1;
          width: 0;

          .doctor_name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .fontSize(16);
            font-weight: 400;
            color: @titleColor;
            .lineHeight(20);
            .margin(0, 0, 6, 0);
          }

          .doctor_only_name {
            .fontSize(16);
            font-weight: 400;
            color: @titleColor;
            .lineHeight(20);
          }

          .hospital_name {
            .lineHeight(18);
            .fontSize(14);
            font-weight: 500;
            color: @descriptionColor;

            .department_name {
              .margin(0,0,0,12);
            }
          }
        }
      }

      .article_img {
        .margin(16, 16, 16, 16);
        .borderRadius(8, 8, 8, 8);
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          /*height: 100%;*/
          object-fit: contain;
        }
      }

      .img_detail {
        .margin(16, 16, 16, 16);
        .borderRadius(8, 8, 8, 8);
        overflow: hidden;
        height: auto;

        img {
          display: block;
          width: 100%;
          height: 100%;
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
      }
    }

    .gaps {
      width: 93.6vw;
      margin: 0 auto;

      img {
        width: 100%;
      }
    }

    .article_push {
      .padding(0, 12, 0, 12);

      .article_push_title {
        .margin(20, 0, 15, 0);
        .lineHeight(22);
        .fontSize(18);
        font-weight: bold;
        color: @titleColor;
        display: inline-block;
        border-bottom: 4px solid @mainColor;
      }

      .article_push_list {
        .padding(0,0,30,0);

        li {
          width: 100%;
          display: flex;
          justify-content: space-between;
          background: @backgroundColorT;
          .borderRadius(10, 10, 10, 10);
          .height(78);
          .margin(0, 0, 15, 0);

          .article_push_message {
            width: 263 / 375 * 100vw;
            .lineHeight(20);
            .padding(0, 12, 0, 0);
            .margin(19, 0, 19, 10);
            .fontSize(16);
            font-weight: 400;
            color: @titleColor;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            height: fit-content;
          }

          .article_push_img {
            flex: 1;
            overflow: hidden;
            .width(78);
            .height(78);
            .borderRadius(10, 10, 10, 10);
            overflow: hidden;

            img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }
  }

</style>
