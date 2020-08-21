/* * @Author: 田东 * @Date: 2020-01-10 14:09:09 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-10 14:15:22 * @name 医疗会话设置 */
<template>
  <div class="chatIMSetting_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医患沟通'"
        :header-show="true"
        title="医疗会话设置"
    ></common-header>
    <div class="chatIMSetting_title">
      <span class="left">全部成员</span>
      <span class="right">
        共<span>{{ imSessionUserList.length }}</span>人
      </span>
    </div>
    <ul class="doctor_box">
      <li v-for="(item, index) in imSessionUserList"
          :key="index"
          @click="routerLink(item.type, item.userid)">
        <img :src="item.vxheadurl" alt/>
        <span>{{ item.username }}</span>
      </li>
      <li class="addPerson" v-if="isAdd" @click="addDoc">
        <img src="../../../assets/images/add_person.png" alt="">
      </li>
    </ul>

    <div class="chatIMAction_bar" @click.stop="docGroupDetail">
      <span class="left">医疗团队服务名片</span>
    </div>

    <div class="chatIMAction_bar" @click.stop="modifyDocGroupName">
      <span class="left">修改医疗团队名称</span>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import {Icon, NavBar} from "vant";

  Vue.use(NavBar);
  Vue.use(Icon);
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "docIMSettings",
    components: {
      commonHeader
    },
    data() {
      return {
        isAdd: false,
        avatar: "",
        sessionname: "",
        DoctorIM: {},
        imSessionUserList: []
      };
    },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      /**
       * 路由跳转
       * @params routerName **/
      routerLink(type, userid) {
        if (type == 0) {
          //患者
          this.$router.push({
            name: "docPatientInfo",
            query: {
              patientId: userid
            }
          });
        } else if (type == 1) {
          //医生
          // this.$router.push({
          //   name: "docIMCardDetail",
          //   query: {
          //     doctorId: userid
          //   }
          // });

          // this.$router.push({
          //   name: "docCard",
          //   query: {
          //     doctorId: userid
          //   }
          // });

          this.$router.push({
            path: "/docDepartmentCard",
            query: {
              doctorId: userid,
            }
          });
        }
      },
      getUserList() {
        this.$http
          .request({
            method: "get",
            url: "/ImSessionUserController/select",
            body: {
              id: this.DoctorIM.currentSessionId
            }
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              this.imSessionUserList = res.data.data.filter(function (item) {
                return item.userid !== "424987751667077197";
              });

              if (
                this.DoctorIM.doctorMessage.data.docId ==
                this.imSessionUserList[1].userid
              ) {
                this.isAdd = true;
              }
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },
      addDoc() {
        this.$router.push({
          name: "docAddChatGroupPerson",
          query: {
            res: "addSteam", // addDoc ,addSteam
            id: this.DoctorIM.currentSessionId,
            name: this.sessionname
          }
        });
      },
      /**
       * 修改医疗团队名称
       * **/
      modifyDocGroupName() {
        this.$router.push({
          path:'/modifyDoctorGroupName',
          query: {
            id: this.DoctorIM.currentSessionId,
            name: this.sessionname
          }
        })
      },
      /**
       * 医疗团队详情
       * **/
      docGroupDetail() {
        this.$router.push({
          path:'/docGroupCard',
          query: {
            id: this.DoctorIM.currentSessionId,
            name: this.sessionname
          }
        })
      }
    },
    created() {
      this.DoctorIM = this.$store.state.DoctorIM;
      this.sessionname = this.$route.query.sessionname || '';
      this.getUserList();
    }
  };
</script>

<style scoped lang="less">
  * {
    box-sizing: border-box;
  }

  .chatIMSetting_page {
    height: 100%;
    overflow-y: auto;
    background: @backgroundColor;
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
      .padding(15, 10, 15, 10);
      background: @backgroundColorT;
      .borderRadius(10, 10, 0, 0);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      span.left {
        .fontSize(16);
        font-weight: bold;
        color: @titleColor;
        .lineHeight(16);
        .padding(0, 0, 0, 10);
        background: url("../../../assets/images/icon_zhu.png") 0 center no-repeat;
        background-size: 1.07vw;
      }

      .right {
        float: right;
        .fontSize(16);
        font-weight: 400;
        color: @titleColor;
        .lineHeight(16);

        span {
          color: @mainColor;
        }
      }
    }

    .doctor_box {
      .borderRadius(0, 0, 10, 10);
      display: flex;
      background: @backgroundColorT;
      flex-wrap: wrap;
      .padding(7, 9, 7, 9);

      li {
        .width(60);
        .margin(8, 11, 8, 11);
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;

        img {
          display: block;
          width: 100%;
          border-radius: 50%;
        }

        span {
          display: inline-block;
          width: 100%;
          text-align: center;
          .margin(10, 0, 0, 0);
          .fontSize(16);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: @titleColor;
          .lineHeight(16);
        }
      }
    }
  }
</style>
