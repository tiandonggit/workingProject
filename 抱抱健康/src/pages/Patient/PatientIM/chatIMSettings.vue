/** *@desc 我的医生 *@author houpai *@date 2019/07/15 09:46:52 */
<template>
  <div class="chatIMSetting_page">
    <common-header
        :share-disabled="false"
        :custom-title="'医疗团队'"
        :title="'医疗会话设置'"
        :header-show="true"
    ></common-header>
    <div class="chatIMSetting_title">
      <span>全部成员</span>
      <b v-if="sessionMemberCount">
        共<em>{{ sessionMemberCount - 1 }}</em
      >人
      </b>
    </div>
    <ul class="doctor_box">
      <li
          v-for="(item, index) in doctorList"
          v-if="item.userid !== '424987751667077197'"
          :key="index"
          @click="routerLink(item)"
      >
        <img :src="item.vxheadurl" alt=""/>
        <span>
          {{ item.username }}
        </span>
      </li>
    </ul>

    <div class="chatIMAction_bar" @click.stop="docGroupDetail">
      <span class="left">医疗团队服务名片</span>
    </div>

    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"
    ></van-loading>
  </div>
</template>

<script>

  import {Toast} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";

  export default {
    name: "chatIMSettings",
    components: {
      commonHeader
    },
    data() {
      return {
        doctorList: [], // 医生列表
        sessionId: "", // sessionId
        loading: false, // loading
        sessionMemberCount: 0, // 会话成员总数
      };
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    methods: {
      /**
       * 获取会话成员列表
       * 包含患者自己
       * 根据类型判断跳转**/
      getDoctorList() {
        this.loading = true;
        this.$http
          .request({
            method: "get",
            url: "/ImController/getPatientSessionBySessionId",
            body: {
              sessionId: this.sessionId
            }
          })
          .then(res => {
            this.loading = false;
            if (res.data.success) {
              this.doctorList = res.data.data.imSessionUserList || [];
              this.sessionMemberCount =
                res.data.data.imSessionUserList.length || 0;
            } else {
              console.log("获取会话成员列表接口报错");
            }
          })
          .catch(e => {
            this.loading = false;
            console.log(e);
          });
      },
      /**
       * 路由跳转
       * v1.9新增修改 如果是已关联的医生 可查看医生名片
       * 根据身份类型跳转 type 0 患者 1 医生**/
      routerLink(item) {
        if (item.type === 0) {
          this.$router.push({
            path: "patientMessageComplete",
            query: {}
          });
        }
        if (item.type === 1) {
          // this.$router.push({
          //   path: "doctorMessage",
          //   query: {
          //     doctorId: item.userid
          //   }
          // });
          this.seeDoctorDetail(item.userid);
        }
      },
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
                path: "/docDepartmentCard",
                query: {
                  doctorId: id,
                  isPatient: true
                }
              });
            } else {
              this.$router.push({
                path: "doctorMessage",
                query: {
                  doctorId: id
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
       * 医疗团队详情
       * **/
      docGroupDetail() {
        this.$router.push({
          path:'/docGroupCard',
          query: {
            id: this.sessionId,
            isPatient: true
          }
        })
      }
    },
    created() {
      this.sessionId = this.$route.query.sessionId || this.PatientIM.sessionMessage.sessionId || '';
      this.getDoctorList();
    }
  };
</script>

<style scoped lang="less">
  .chatIMSetting_page {
    .padding(44, 12, 0, 12);

    .chatIMAction_bar {
      .padding(15, 10, 15, 10);
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);
      .margin(15, 0, 0, 0);

      span.left {
        .fontSize(16);
        font-weight: bold;
        color: @titleColor;
        .lineHeight(16);
        .padding(0, 0, 0, 10);
        background: url("../../../assets/images/icon_zhu.png") 0 center no-repeat;
        background-size: 1.07vw;
      }
    }

    .chatIMSetting_title {
      background: #fff;
      position: relative;
      display: flex;
      align-items: center;
      .padding(15, 20, 15, 20);
      .fontSize(18);
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      border-bottom: 1px solid RGBA(242, 242, 242, 1);
      .borderRadius(10, 10, 0, 0);

      b {
        flex: 1;
        text-align: right;
        .fontSize(16);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);

        em {
          color: @mainColor;
        }
      }
    }

    .doctor_box {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      /*justify-content: space-around;*/
      .borderRadius(0, 0, 10, 10);
      background: #fff;
      .padding(15, 21, 0, 21);

      li {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          display: block;
          .width(60);
          .height(60);
          border-radius: 50%;
        }

        span {
          display: inline-block;
          width: 100%;
          text-align: center;
          .padding(10, 0, 10, 0);
          .fontSize(16);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
</style>
