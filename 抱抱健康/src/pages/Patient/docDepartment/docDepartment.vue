/**
* @Description: 患者端查看医生科室名片
* @Author: 侯湃
* @Date: 2020/6/8
*/
<template>
  <div class="docDepartment_page" id="docDepartmentCard" ref="swiperCardBox">
    <common-header
        :share-disabled="true"
        :custom-title="''"
        :header-show="true"
        v-if="departmentList.length"
        :title="title"
    ></common-header>
    <div class="bg-block" v-if="departmentList.length">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in departmentList" :key="index">
            <div class="swiper-item">
              <div class="swiper-title">
                <p>{{item.businesscard || ""}}</p>
                <div class="img_box">
                  <img src="../../../assets/images/departmentBg.png" alt="">
                </div>
              </div>
              <div class="department-info">
                <p class="title">
                  {{item.businesscard || ""}}简介
                  <img src="../../../assets/images/left_jiao_icon.png" alt="" class="left_jiao">
                  <img src="../../../assets/images/right_jiao_icon.png" alt="" class="right_jiao">
                </p>
                <p class="desc">{{item.text}}</p>
              </div>
              <div class="doc-info">
                <p class="title">
                  {{item.title}}
                  <img src="../../../assets/images/left_jiao_icon.png" alt="" class="left_jiao">
                  <img src="../../../assets/images/right_jiao_icon.png" alt="" class="right_jiao">
                </p>
                <div class="doc-message-box">
                  <div class="left_message_box">
                    <div class="doc-title">
                      {{item.docname || ""}}
                      <span>工作室</span>
                    </div>
                    <ul class="doc-detail">
                      <li>
                        <span class="title_name">{{item.titlename}}</span>
                      </li>
                      <li>
                        <span>{{item.delname}}</span>
                      </li>
                      <li>
                        <span>{{item.hosname}}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="right_avatar_box" @click="selectCheckDocCard(item)">
                    <div style="position: relative">
                      <img :src="item.docurl" alt="">
                      <img src="../../../assets/images/isLink.png"
                           v-if="item.state == 2"
                           class="isNotRelation"
                           alt="">
                      <img src="../../../assets/images/icon_hand.png" class="hand" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-info" v-for="(group, index2) in item.group" :key="index2">
                <p class="title">
                  {{group.groupname}}
                  <img src="../../../assets/images/left_jiao_icon.png" alt="" class="left_jiao">
                  <img src="../../../assets/images/right_jiao_icon.png" alt="" class="right_jiao">
                </p>
                <div class="group-introduce">
                  简介：
                  <span>{{group.grouptext}}</span>
                </div>
                <div class="group-leader">
                  <div class="line left">
                    <span></span>
                  </div>
                  <div class="img-box" @click="selectCheckDocCard(group)">
                    <img class="url" :src="group.docurl" alt/>
                    <img class="img" src="../../../assets/images/d-card-5.png" alt/>
                    <img src="../../../assets/images/icon_hand.png" alt="" class="hand">
                    <img src="../../../assets/images/isLink.png"
                         v-if="group.state == 2"
                         class="isNotRelation" alt="">
                    <p>{{group.docname}}</p>
                  </div>
                  <div class="line right">
                    <span></span>
                  </div>
                </div>
                <div class="member-list clearFix">
                  <div class="cell-box"
                       v-for="(member, index3) in group.doctor"
                       :key="index3"
                       @click="selectCheckDocCard(member)"
                  >
                    <div class="isNotRelation_box">
                      <img :src="member.docurl" alt/>
                      <img src="../../../assets/images/isLink.png"
                           v-if="member.state == 2"
                           class="isNotRelation" alt="">
                      <img src="../../../assets/images/icon_hand.png" class="hand" alt="">
                    </div>
                    <p>{{member.docname}}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
    <div class="deletedDepartment" v-if="!departmentList.length && !loading">
      <div class="img-box">
        <img src="../../../assets/images/deletedDepartmentTip.png" alt/>
        <p>当前名片已停用</p>
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast} from "vant";

  export default {
    name: "docDepartment",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    data() {
      return {
        loading: false,
        doctorId: "",
        patientid: "",
        departmentList: [],
        title: "",
        departmentId: "" //  科室查询参数
      };
    },
    methods: {
      /**
       * 获取医生科室详情
       * **/
      getDocDepartmentDetail() {
        this.loading = true;
        this.$http.request({
          url: "/RStudioController/selectId",
          method: "get",
          body: {
            id: this.departmentId,
            patientid: this.patientid
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            if (res.data.data) {
              this.departmentList.push(res.data.data);
              this.title = this.departmentList.length ? this.departmentList[0].name : "";
            }
          } else {
            Toast(res.data.message || "查询科室接口报错");
          }
        }).catch(e => {
          this.loading = false;
          console.log(e);
        });
      },
      /**
       * 医生工作室点击医生头像,如未关联,点击查看医生名片二维码,如已关联,跳转IM聊天页
       * **/
      selectCheckDocCard(item) {
        if (item.rdoctor && item.rdoctor != "0") {
          let lastconsultstatus = false;
          if (item.lastconsultstatus == 1 || item.lastconsultstatus == 2 || item.lastconsultstatus == 3) {
            lastconsultstatus = true;
          }
          // 已关联的医生跳转医患会话
          if (item.state == 2) {
            let sessionMessage = {
              sessionType: 0,
              sessionId: item.imsessionid,
              doctorId: item.rdoctor,
              lastconsultstatus: lastconsultstatus
            };
            this.$store.commit("PatientIM/sessionMessage", sessionMessage);
            this.$router.push({
              path: "chatIMDetail",
              query: {}
            });
          } else {
            this.$router.push({
              name: "docCard",
              query: {
                doctorId: item.rdoctor,
                isPatient: true
              }
            });
          }
        } else {
          // 假医生提示 -- 医生未上线
          Toast("该医生未上线");
          return false;
        }
      }
    },
    created() {
      if (this.$route.query.id) {
        this.departmentId = this.$route.query.id || "";
        this.patientid = this.$route.query.patientid || "";
      }
      this.getDocDepartmentDetail();
    }
  };
</script>

<style scoped lang="less">
  .docDepartment_page {

    .deletedDepartment {
      .img-box {
        .padding(108, 12, 12, 12);

        img {
          .width(200);
          display: block;
          margin: 0 auto;
        }

        p {
          text-align: center;
          .fontSize(18);
          color: @titleColor;
          font-weight: bold;
          .lineHeight(22);
          .margin(30, 0, 0, 0);
        }
      }
    }

    .flex_box {
      display: flex;
    }

    .isNotRelation_box {
      position: relative;

      img {
        border-radius: 50%;
      }
    }

    img.isNotRelation {
      display: block;
      .width(20)!important;
      .height(20)!important;
      position: absolute;
      top:0;
      right: -8/375*100vw;
      z-index: 12;
    }

    img.hand {
      display: block;
      .width(15)!important;
      .height(16)!important;
      position: absolute!important;
      bottom:-7/375*100vw;
      right: -4/375*100vw;
      z-index: 12;
    }

    .right_avatar_box {
      img.hand {
        bottom:0!important;
      }
    }
  }
</style>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  /*清除浮动*/
  .clearFix:before,
  .clearFix:after {
    content: " ";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  #docDepartmentCard {
    .padding(53, 12, 12, 12);

    .bg-block {
      .borderRadius(10, 10, 10, 10);
    }

    .swiper-container {
      .swiper-slide {
        background-color: @mainColor;
        overflow: hidden;
        .borderRadius(10, 10, 10, 10);
      }

      .swiper-title {
        display: flex;
        .padding(10, 0, 0, 0);

        p {
          flex: 1;
          width: 0;
          text-align: center;
          .fontSize(24);
          font-weight: bold;
          color: @fontColorff;
          .lineHeight(30);
          .padding(42, 12, 42, 12);
        }

        .img_box {
          .width(132);
          /*height: 100%;*/
          min-height: 128/375*100vw;
          position: relative;

          img {
            position: absolute;
            bottom: 0;
            right: 0;
            display: block;
            width: 100%;
            .height(128);
          }
        }

      }

      .department-info {
        .padding(0, 0, 15, 0) !important;
        .width(331);
        margin: 0 auto 24/375*100vw;
        background: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);

        p {
          .fontSize(16);
          font-weight: bold;
          color: @titleColor;
          .lineHeight(20);
        }

        p.desc {
          font-weight: 400;
          .padding(0, 10, 0, 10);
        }

        p.title {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          .width(246);
          background-color: rgba(201, 227, 255, 1);
          min-height: 47/375*100vw;
          .padding(8, 10, 8, 10);
          position: relative;
          top: -10/375*100vw;
          left: 42/375*100vw;
          .fontSize(16);
          color: @fontColor33;
          font-weight: bold;
          .lineHeight(22);
          .borderRadius(0, 0, 10, 10);

          img {
            position: absolute;
            top: 0;
            display: block;
            width: 7px;
            height: 10px;
          }

          .left_jiao {
            left: -7/375*100vw;
          }

          .right_jiao {
            right: -7/375*100vw;
          }
        }
      }

      .doc-info {
        .width(331);
        margin: 0 auto 24/375*100vw;
        background: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);
        .padding(0, 0, 15, 0) !important;

        p.title {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          .width(246);
          background-color: rgba(201, 227, 255, 1);
          min-height: 47/375*100vw;
          .padding(8, 10, 8, 10);
          position: relative;
          top: -10/375*100vw;
          left: 42/375*100vw;
          .fontSize(16);
          color: @fontColor33;
          font-weight: bold;
          .lineHeight(22);
          .borderRadius(0, 0, 10, 10);

          img {
            position: absolute;
            top: 0;
            display: block;
            .width(7);
            .height(10);
          }

          .left_jiao {
            left: -7/375*100vw;
          }

          .right_jiao {
            right: -7/375*100vw;
          }
        }

        .doc-message-box {
          display: flex;
          .padding(0, 10, 0, 10);

          .left_message_box {
            flex: 1;
            width: 0;

            .doc-title {
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              .padding(14, 0, 16, 0);
              .fontSize(16);
              font-weight: 400;
              color: @titleColor;


              span {
                background: linear-gradient(230deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
                .borderRadius(5, 5, 5, 5);
                .padding(2, 6, 2, 6);
                .fontSize(14);
                color: @fontColorff;
                .margin(0, 0, 0, 14);
              }
            }

            .doc-detail {
              .padding(14,0,0,0);
              li {
                .title_name {
                  .margin(0, 24, 0, 0);
                }

                span {
                  .fontSize(14);
                  .lineHeight(28);
                  font-weight: 400;
                  color: rgba(102, 102, 102, 1);
                }
              }
            }
          }

          .right_avatar_box {
            .margin(0, 0, 0, 10);

            img {
              display: block;
              .width(60);
              .height(60);
              border-radius: 50%;
            }
          }
        }
      }


      .group-info {
        .width(331);
        margin: 0 auto 24/375*100vw;
        background: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);

        p.title {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          .width(246);
          background-color: rgba(201, 227, 255, 1);
          min-height: 47/375*100vw;
          .padding(8, 10, 8, 10);
          position: relative;
          top: -10/375*100vw;
          left: 42/375*100vw;
          .fontSize(16);
          color: @fontColor33;
          font-weight: bold;
          .lineHeight(22);
          .borderRadius(0, 0, 10, 10);

          img {
            position: absolute;
            top: 0;
            display: block;
            .width(7);
            .height(10);
          }

          .left_jiao {
            left: -7/375*100vw;
          }

          .right_jiao {
            right: -7/375*100vw;
          }
        }

        .group-introduce {
          .padding(12, 10, 0, 10);
          .fontSize(16);
          font-weight: bold;
          color: @fontColor33;
          .lineHeight(20);
          margin-bottom: 4vw;

          span {
            font-weight: 400;
          }
        }

        .member {
          .padding(0, 0, 0, 10);
          .fontSize(16);
          font-weight: bold;
          color: @fontColor33;
          .lineHeight(20);
        }

        .group-leader {
          padding: 4vw 0;
          display: flex;
          align-items: center;

          .line {
            width: calc(100% - 87 / 375 * 50vw);;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              width: 100%;
              height: 1px;
              display: inline-block;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
          }

          .line.left {
            .padding(0, 20, 0, 10)
          }

          .line.right {
            .padding(0, 10, 0, 20)
          }

          .img-box {
            .width(87);
            .height(99);
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;

            img.hand {
              bottom:30/375*100vw!important;
            }

            .url {
              .width(72);
              .height(72);
              margin: 0 auto;
              display: block;
              border-radius: 50%;
            }

            .img {
              .width(87);
              position: absolute;
              top: 14.7vw;
            }

            p {
              .fontSize(16);
              font-weight: 400;
              color: @fontColor33;
              .lineHeight(18);
              .margin(9, 0, 0, 0);
              text-align: center;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }

        .member-list {
          .borderRadius(0,0,10,10);
          .cell-box {
            .width(60);
            float: left;
            .margin(0, 11, 15, 11);

            div {
              .width(60);
              .height(60);

              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }

            p {
              position: relative;
              z-index: 11;
              .fontSize(16);
              font-weight: 400;
              color: @fontColorff;
              .borderRadius(6,6,6,6);
              .lineHeight(18);
              .margin(-2, 0, 0, 0);
              text-align: center;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              background-color: rgba(0, 105, 255, 1);
              .padding(2,0,2,0);
            }
          }
        }
      }
    }

  }
</style>


