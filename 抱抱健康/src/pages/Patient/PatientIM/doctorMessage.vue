/** *@desc 医生信息 *@author houpai *@date 2019/07/18 11:58:33 */
<template>
  <div class="doctorMessage_page">
    <common-header
        :share-disabled="true"
        :header-show="true"
        :title="'医生信息'"
        :custom-title="'医生信息'"
    ></common-header>
    <div class="doctorMessageContent">
      <ul class="doctor_message_box"
          v-if="doctorMessage">
        <li class="chat_lists_item">
          <div class="img_box" @click.stop="seeDoctorDetail(doctorId)">
            <img :src="doctorMessage && doctorMessage.url" alt=""/>
            <p class="doctor_type">{{ doctorMessage && doctorMessage.titleName }}</p>
          </div>
          <ul class="doctor_message_desc">
            <li class="name_box">
              <!--            <span class="name">-->
              <!--              {{ doctorMessage && doctorMessage.docName }}-->
              <!--            </span>-->
              {{ doctorMessage && doctorMessage.docName }}
            </li>
            <li class="depName_box">
              {{ doctorMessage && doctorMessage.depName }}
            </li>
            <li class="hosName_box">
              {{ doctorMessage && doctorMessage.hosName }}
            </li>
          </ul>
        </li>
      </ul>

      <div class="content_box">
        <div class="doctor_major">
          <p>
            <img src="../../../assets/images/shanchang.png" alt="">
            <span>专业擅长</span>
          </p>
          <div class="major_detail">
            {{ doctorMessage.speciality || "暂无信息"}}
          </div>
        </div>
      </div>

      <div class="content_box ">
        <div class="doctor_introduction">
          <p>
            <img src="../../../assets/images/jianjie.png" alt="">
            <span>个人简介</span>
          </p>
          <div class="introduction_detail">
            {{ doctorMessage.dprofile || "暂无信息" }}
          </div>
        </div>
      </div>
      <!--      v1.9新增修改 未关联也可以查看下列信息-->
      <!--      v-if="beRelated"-->
      <div class="content_box">
        <ul class="doctor_option_box">
          <li @click.stop="addDiseaseTask" v-if="beRelated">
            <p class="boldSpan_box">
              <img src="../../../assets/images/diseaseInfo.png" alt="">
              <span>疾病任务</span>
            </p>
            <van-icon name="arrow"></van-icon>
          </li>
          <!--        1.7版本中删除患者给医生添加备注的功能-->
          <!--        <li @click.stop="updateRemark">-->
          <!--          <span>-->
          <!--            {{-->
          <!--              doctorRemark-->
          <!--                ? doctorRemark.length > 20-->
          <!--                  ? doctorRemark.substring(0, 20) + "..."-->
          <!--                  : doctorRemark-->
          <!--                : "添加备注"-->
          <!--            }}-->
          <!--          </span>-->
          <!--          <van-icon name="arrow"></van-icon>-->
          <!--        </li>-->
        </ul>
      </div>

    </div>
    <div class="send_message"
         v-if="beRelated"
         @click="routerLink('chatIMDetail')">
      <em>
        <van-icon name="chat-o"></van-icon>
        <span>发消息</span>
      </em>
    </div>
    <!--    <p v-if="!doctorMessage" style="text-align: center;margin: 10px auto">暂无信息</p>-->
    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"
    ></van-loading>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast} from "vant";

  export default {
    name: "doctorMessage",
    components: {
      commonHeader
    },
    data() {
      return {
        beRelated: false, // 当前医生是否关联
        doctorId: "", // 医生id,
        doctorMessage: "", // 医生信息
        doctorRemark: "", // 医生备注
        sessionId: "", // 医生sessionId
        loading: false // loading
      };
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    methods: {
      /**
       * 点击医生头像跳转,如果是已关联的医生,可查看医生名片
       * @params id 医生id
       * **/
      seeDoctorDetail(id) {
        this.$http.request({
          url: "/RReportController/selectRelation",
          method: "get",
          body: {
            id: id
          }
        }).then(res => {
          if (res.data.success) {
            if (res.data.code === "0001") {
              this.$router.push({
                path: "/docCard",
                query: {
                  doctorId: id,
                  isPatient: true
                }
              });
            }
          } else {
            Toast("接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 修改备注**/
      updateRemark() {
        this.$store.commit("PatientIM/doctorRemark", this.doctorRemark);
        let sessionMessage = JSON.parse(
          JSON.stringify(this.PatientIM.sessionMessage)
        );
        sessionMessage.doctorId = this.doctorId;
        this.$store.commit("PatientIM/sessionMessage", sessionMessage);
        this.$router.push({
          path: "updateRemark",
          query: {
            doctorId: this.doctorId
          }
        });
      },
      /**
       * 查询医生信息**/
      getDoctorMessage() {
        this.loading = true;
        this.$http
          .request({
            method: "get",
            url: "/RDoctorController/selectDoctorS",
            body: {
              id: this.doctorId
            }
          })
          .then(res => {
            this.loading = false;
            if (res.data.success) {
              this.doctorMessage = res.data.data.data || "";
              this.doctorRemark = res.data.data.rdoctornameremark;
              this.beRelated = res.data.data.state === 1;
              this.sessionId = res.data.data.imSessionId;
            } else {
              console.log("查询医生信息接口报错");
            }
          })
          .catch(e => {
            this.loading = false;
            console.log(e);
          });
      },

      /**
       * 发起会话**/
      routerLink(name) {
        let sessionMessage = JSON.parse(
          JSON.stringify(this.PatientIM.sessionMessage)
        );
        sessionMessage.sessionId = this.sessionId;
        sessionMessage.doctorId = this.doctorId;
        sessionMessage.sessionType = 0;
        this.$store.commit("PatientIM/sessionMessage", sessionMessage);
        this.$router.push({
          path: name,
          query: {}
        });
      },

      /**
       * 添加疾病任务**/
      addDiseaseTask() {
        this.$router.push({
          path: "/chooseDisease",
          query: {
            doctorId: this.doctorId,
            from:'im'
          }
        });
      }
    },
    created() {
      if (this.$route.query.doctorId) {
        this.doctorId = this.$route.query.doctorId;
      } else {
        this.doctorId = this.PatientIM.patientMessage.doctorId;
      }
      this.getDoctorMessage();
    }
  };
</script>

<style scoped lang="less">
  .doctorMessage_page {
    .padding(44, 12, 44, 12);

    .doctorMessageContent {
      background-color: #fff;
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;
    }

    .doctor_message_box {
      .borderRadius(10, 10, 0, 0);
      overflow: hidden;

      li.chat_lists_item {
        box-sizing: border-box;
        background-color: #fff;
        .padding(17, 15, 17, 15);
        display: flex;

        .img_box {
          display: flex;
          flex-direction: column;
          align-items: center;
          .margin(0, 25, 0, 0);

          img {
            display: block;
            .width(60);
            .height(60);
            border-radius: 50%;
          }

          .doctor_type {
            .fontSize(12);
            .lineHeight(14);
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            background: @mainColor;
            text-align: center;
            .padding(3, 3, 3, 3);
            .borderRadius(4, 4, 4, 4);
          }
        }

        .doctor_message_desc {
          flex: 1;
          width: 0;

          li {
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .lineHeight(28);
            .fontSize(16);
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }

          .name_box {
            .fontSize(18);
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }

          .depName_box {

          }

          .hosName_box {

          }
        }
      }
    }

    .doctor_major, .doctor_introduction {
      p {
        display: flex;
        align-items: center;

        img {
          display: block;
          .width(20);
          .height(20);
        }

        span {
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          .margin(0, 0, 0, 10);
        }
      }

    }

    .content_box {
      background: #fff;
      box-sizing: border-box;
      .padding(0, 12, 12, 12);
    }

    .doctor_major {
      background: @backgroundColor;
      .padding(15, 10, 15, 10);
      .borderRadius(10, 10, 10, 10);
      word-break: break-all;

      .major_detail {
        .fontSize(16);
        .lineHeight(20);
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        .padding(15, 0, 0, 0);
      }
    }

    .doctor_introduction {
      background: @backgroundColor;
      .padding(15, 10, 15, 10);
      .borderRadius(10, 10, 10, 10);

      .introduction_detail {
        .fontSize(16);
        .lineHeight(20);
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        .padding(15, 0, 0, 0);
      }
    }

    .doctor_option_box {
      li {
        .lineHeight(50);
        .height(50);
        display: flex;
        align-items: center;
        background: @backgroundColor;
        .borderRadius(10, 10, 10, 10);
        box-sizing: border-box;
        .padding(0, 10, 0, 10);
        .fontSize(16);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        .margin(0, 0, 12, 0);

        span {
          display: inline-block;
          color: #333;
          flex: 1;
          width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .boldSpan_box {
          height: 100%;
          display: flex;
          align-items: center;
          flex: 1;

          img {
            display: block;
            .width(20);
            .height(20);
            .margin(0, 10, 0, 0);
          }

          span {
            .fontSize(16);
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }
        }

        /deep/ .van-icon {
          .fontSize(24);
          color: rgba(51, 51, 51, 1);
        }
      }
    }

    .send_message {
      .margin(20, 0, 0, 0);
      .height(48);
      .borderRadius(10, 10, 10, 10);
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      em {
        .fontSize(18);
        font-weight: 400;
        color: @mainColor;
        display: flex;
        align-items: center;

        i {
          .margin(0, 10, 0, 0);
          .fontSize(24);
        }
      }
    }
  }

</style>
