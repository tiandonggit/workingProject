/**
*@desc 医疗团队名片(IM群聊v1.9新增)
*@author houpai
*@date 2020/04/26 14:51:20
*/
<template>
  <div class="docGroupCard_page">
    <common-header
        :share-disabled="true"
        :custom-title="'服务团队'"
        :header-show="true"
        :rightContent="isAdmin?'编辑':''"
        :rightClass="{'color':'rgba(0, 105, 255, 1)'}"
        @rightContentClick="rightContentClick"
        :title="groupDetail.sessionname || ''"
    ></common-header>

    <div class="cardBox">
      <div class="docGroupMember_box" :class="[{'padding_less':isAdmin}]">
        <div class="photo_box" @click.stop="seeMe">
          <img src="../../../assets/images/default.png" v-if="isAdmin" alt="">
          <img :src="adminDetail.vxheadurl || ''" v-else alt="">
          <img src="../../../assets/images/tuanzhang.png" alt="" class="admin_icon" v-if="!isAdmin">
          <p class="adminName" v-if="!isAdmin">{{adminDetail.username||""}}</p>
        </div>
        <!--        患者端显示,要先查看是否关联 关联了才可查看名片-->
        <ul class="docGroupMember_ul" v-if="isPatient">
          <li v-for="item in imSessionDoctor"
              @click.stop="isConnect(item.userid,item)"
              :key="item.id">
            <img :src="item.vxheadurl || ''" alt="">
            <span class="member_name">{{item.username|| ""}}</span>
          </li>
        </ul>
        <!--        <ul class="docGroupMember_ul" v-else>-->
        <!--          <li v-for="item in imSessionDoctor"-->
        <!--              @click.stop="docGroupMemberDetail(item.id)"-->
        <!--              :key="item.id">-->
        <!--            <img src="../../../assets/images/patient.png" alt="">-->
        <!--            <span class="member_name">张三</span>-->
        <!--          </li>-->
        <!--        </ul>-->
      </div>
      <div class="border_background" v-if="!isAdmin"></div>
      <div class="docGroupMessage_box">
        <p class="docGroupMessage_p">
          <span class="title">团队介绍:</span>
          {{groupDetail.sessionintroduction || "暂无介绍"}}
        </p>
      </div>
      <div class="border_background"></div>
      <div class="docGroupCode_box">
        <img :src="groupDetail.QrCod||''"
             alt="">
        <p>{{groupDetail.sessionname || ""}}二维码</p>
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {Toast} from "vant";
  import {mapState} from "vuex";

  export default {
    name: "docGroupCard",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["DoctorIM"]),
      /**
       * 是否为团长,团长可编辑医疗团队信息
       * 患者也可以查看医疗小组名片,前端自行判断是否为团长(团长可操作)
       * **/
      isAdmin() {
        let isAdmin = false;
        try {
          if (this.adminDetail.id === this.DoctorIM.doctorMessage.data.docId) {
            isAdmin = true;
          }
        } catch (e) {
          console.log(e);
        }
        isAdmin = !this.isPatient;
        return isAdmin;
      }
    },
    data() {
      return {
        isPatient: false,// 是否为患者
        groupId: "", // 医疗团队id(im的sessionId)
        groupDetail: {}, // 医疗团队信息
        adminDetail: {}, // 管理员信息
        imSessionDoctor: [] //医疗团队成员列表
      };
    },
    methods: {
      /**
       * 点击团长头像,患者查看医生名片(因为是已确定是已关联过的医生),医生正常查看好友医生名片
       * **/
      seeMe() {
        let fromDoctorIM = this.$route.query.fromDoctorIM || "";
        if(this.isPatient && !fromDoctorIM) {
          // this.$router.push({
          //   path:'/docCard',
          //   query:{
          //     doctorId:this.adminDetail.userid || '',
          //     isPatient:true
          //   }
          // })

          this.$router.push({
            path: "/docDepartmentCard",
            query: {
              doctorId: this.adminDetail.userid || '',
              isPatient: true
            }
          });
        }
        if(fromDoctorIM) {

          // this.$router.push({
          //   path:'/docCard',
          //   query:{
          //     doctorId:this.adminDetail.userid || '',
          //   }
          // })

          this.$router.push({
            path: "/docDepartmentCard",
            query: {
              doctorId: this.adminDetail.userid || '',
            }
          });
        }
      },
      /**
       * 患者端显示的时候查看是否关联该医生,关联才可查看医生名片
       * 因为成员里也同时包含了患者自己,医生端点击患者头像为查看患者信息, 点击其他医生头像则查看好友医生名片
       * 然后患者端点击医生头像的时候首先要查询是否关联了该医生,点击自己则查看患者完善信息页
       * 如果关联了医生点击头像查看的是医生名片,否者点击查看原有的doctorMessage页
       * **/
      isConnect(id, item) {
        let fromDoctorIM = this.$route.query.fromDoctorIM || "";
        if (fromDoctorIM) {
          // type 0 患者 type 1 医生
          if (item.type === 0) {
            this.$router.push({
              name: "docPatientInfo",
              query: {
                patientId: id
              }
            });
          } else {
            this.$router.push({
              path:'/docCard',
              query:{
                doctorId:id
              }
            })
          }
        } else {
          if (item.type === 0) {
            this.$router.push({
              path: "patientMessageComplete",
              query: {}
            });
          }
          if (item.type === 1) {
            this.seeDoctorDetail(id);
          }
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
                path: "/docCard",
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
       * 团长可编辑医疗团队介绍
       * **/
      rightContentClick() {
        if (!this.isAdmin) {
          return false;
        }
        this.$router.push({
          path: "/docGroupCardMessage",
          query: {
            docGroupCardMessage: this.groupDetail.sessionintroduction || "",
            groupId: this.groupId,
            sessionName: this.groupDetail.sessionname || "" // 接口必要参数 否则报错(接口待修改?)
          }
        });
      },
      /**
       * 医疗小组成员详情,跳转到医生名片页.查看非本人的名片只显示信息不可编辑
       * **/
      docGroupMemberDetail(id) {
        this.$router.push({
          path: "/docCard",
          query: {
            doctorId: id
          }
        });
      },
      /**
       * 获取医疗团队详情
       * **/
      getGroupChatDetail() {
        let url = this.isPatient ? "/ImSessionController/selectImSessionPatient" : "/ImSessionController/selectImSessionDoctor";
        this.$http.request({
          url: url,
          method: "get",
          body: {
            id: this.groupId
          }
        }).then(res => {
          if (res.data.success) {
            this.groupDetail = res.data.data.imSession || {};
            this.groupDetail.QrCod = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + res.data.data.QrCod || "";
            this.adminDetail = res.data.data.imSessionGLY || {};
            if (this.isPatient) {
              this.imSessionDoctor = res.data.data.imSessionDoctor || [];
            }
          } else {
            Toast(res.data.message || "接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      }
    },
    created() {
      if (this.$route.query.id) {
        this.groupId = this.$route.query.id;
      }
      if (this.$route.query.isPatient) {
        this.isPatient = this.$route.query.isPatient;
      }
      this.getGroupChatDetail();
    }
  };
</script>

<style scoped lang="less">
  .docGroupCard_page {

    .padding(60, 12, 24, 12);

    .cardBox {
      background: url("../../../assets/images/docGroup_background1.png") no-repeat center;
      background-size: cover;
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;
      .padding(67, 20, 20, 20);


      .docGroupName {
        text-align: center;
        .fontSize(18);
        font-weight: bold;
        color: @fontOne;
        .padding(30, 0, 12, 0);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .docGroupLevel {
        color: rgba(204, 204, 204, 1);
        .fontSize(16);
        font-weight: 400;
        .padding(0, 0, 20, 0);
        text-align: center;
      }

      .photo_box {
        position: absolute;
        width: calc(100% - 20 / 375 * 100vw);
        top: -36 / 375  *100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .padding(0, 0, 10, 0);

        img {
          display: block;
          .width(72);
          .height(72);
          border-radius: 50%;
          overflow: hidden;
          box-shadow:0px 3px 6px 0px rgba(214,231,255,1);
        }

        img.admin_icon {
          position: relative;
          top: -10px;
          .width(83);
          .height(25);
          border-radius: 0!important;
          box-shadow:none!important;
        }
      }

      .adminName {
        .fontSize(16);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .padding(0, 0, 20, 0);
        text-align: center;
      }

      .padding_less.docGroupMember_box {
        .padding(20, 10, 20, 10)!important;
      }
      .docGroupMember_box {
        .borderRadius(10, 10, 0, 0);
        .padding(90, 10, 20, 10);
        background-color: @backgroundColorT;
        position: relative;

        .title {
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .docGroupMember_ul {
          display: flex;
          flex-wrap: wrap;

          li {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 25%;
            .margin(0, 0, 10, 0);

            img {
              display: block;
              .width(60);
              .height(60);
              border-radius: 50%;
              overflow: hidden;
            }

            .member_name {
              display: inline-block;
              width: 100%;
              text-align: center;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              .fontSize(16);
              .lineHeight(20);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              .margin(10, 0, 0, 0);
            }
          }
        }
      }


      .docGroupMessage_box {
        .padding(15, 10, 10, 10);
        background-color: @backgroundColorff;
        overflow: hidden;

        .title {
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .docGroupMessage_p {
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
      }

      .docGroupCode_box {
        .padding(15, 10, 10, 10);
        background-color: @backgroundColorT;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .borderRadius(0, 0, 10, 10);
        overflow: hidden;

        img {
          display: block;
          .width(204);
          .height(204);
        }

        p {
          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          .padding(15, 0, 0, 0);
          .fontSize(16);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          text-align: center;
        }
      }
    }

    .border_background {
      /*<!--.height(21);-->*/
      height: 22px;
      background: url("../../../assets/images/border_backGround.png") no-repeat center;
      background-size: 100% 100%;
    }
  }

</style>
