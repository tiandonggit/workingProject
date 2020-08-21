/**
*@desc 医疗小组名片详情
*@author houpai
*@date 2020/04/22 16:23:10
*/
<template>
  <div class="docGroupDetail_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医患沟通'"
        :header-show="true"
        :rightContent="'设置'"
        :rightClass="{'color':'rgba(0, 105, 255, 1)'}"
        @rightContentClick="rightContentClick"
        :title="'医疗小组'"
    ></common-header>
    <div class="cardBox">
      <div class="title_box">
        <p class="docGroupName">{{docGroupDetail.groupname ||''}}</p>
        <p class="docGroupLevel">{{docGroupDetail.grouplibeltext ||''}}</p>
        <div class="photo_box" @click.stop="$router.push({path:'/docDepartmentCard'})">
          <img :src="DoctorIM.doctorMessage.data.url" alt="">
          <img src="../../../assets/images/admin_icon.png" alt="" class="admin_icon">
        </div>
        <p class="adminName">{{DoctorIM.doctorMessage.data.docName}}</p>
      </div>
      <div class="docGroupMember_box">
        <h3 class="title">小组成员</h3>
        <ul class="docGroupMember_ul">
          <li v-for="(item,index) in docGroupList"
              @click.stop="docGroupMemberDetail(item.docId)"
              :key="index">
            <img :src="item.url" alt="">
            <span class="member_name">{{item.docName}}</span>
          </li>
        </ul>
      </div>
      <div class="docGroupMessage_box">
        <h3 class="title">团队简介</h3>
        <p class="docGroupMessage_p">
          {{docGroupDetail.groupintroduction || '暂无简介'}}
          <span class="modify_btn" @click.stop="modifyDocGroupMessage">编辑</span>
        </p>
      </div>
      <div class="docGroupCode_box">
        <img :src="docGroupDetail.QrCod" alt="">
        <p>{{ docGroupDetail.groupname || ''}}二维码</p>
      </div>
    </div>

    <van-popup v-model="memberActionPopup"
               :overlay-style="{ background: 'rgba(0,0,0,0.2)' }"
               :style="{ background: 'none' }">
      <div class="modify_name" @click.top="modifyDetail">编辑信息</div>
      <div class="addPerson" @click.top="personHandle('addDoc')">添加人员</div>
      <div class="delPerson" @click.top="personHandle('del')">删减人员</div>
    </van-popup>

  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {Toast} from "vant";
  import {mapState} from 'vuex';

  export default {
    name: "docGroupDetail",
    components: {
      commonHeader
    },
    computed:{
      ...mapState(["DoctorIM"]),
    },
    data() {
      return {
        docGroupDetail: {}, // 医疗小组详情
        docGroupList:[],
        docGroupMessage: "", // 医疗小组信息,管理员可编辑
        memberActionPopup: false // 删减成员弹窗
      };
    },
    methods: {
      modifyDocGroupMessage() {
        this.$router.push({
          path:'/modifyDocGroupMessage',
          query:{
            groupId:this.groupId,
            docGroupMessage:this.docGroupMessage,
            groupName:this.docGroupDetail.groupname || ''
          }
        })
      },
      /**
       * 获取医疗小组详情
       * **/
      getDocGroupDetail() {
        this.$http.request({
          url: "/ImGroupDoctorController/selectUsers",
          method: "get",
          body: {
            id: this.groupId,
            page:1,
            limit:999
          }
        }).then(res => {
          if (res.data.success) {
            this.docGroupDetail = res.data.data.imGroup || {};
            this.docGroupDetail.QrCod = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.data.QrCod ||'';
            this.docGroupList = res.data.data.imGroupDoctor.list || [];
            this.docGroupMessage = this.docGroupDetail.groupintroduction + '';
          } else {
            Toast("接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * header右侧设置按钮 删减医疗小组成员
       * **/
      rightContentClick() {
        this.memberActionPopup = true;
      },
      /**
       * 医疗小组成员删减
       * **/
      personHandle(type) {
        this.$router.push({
          name: "docAddGroupPerson",
          query: {
            res: type,
            id: this.groupId,
            fromType: "selectGroup",
            doctorNum:this.docGroupList.length,
          }
        });
      },
      /**
       * 编辑医疗小组信息
       * **/
      modifyDetail() {
        this.$router.push({
          path: "/createDocGroupFirst",
          query: {
            mode: "edit",
            groupId: this.groupId
          }
        });
      },
      /**
       * 医疗小组成员详情,跳转到医生名片页.查看非本人的名片只显示信息不可编辑
       * **/
      docGroupMemberDetail(id) {
        // this.$router.push({
        //   path:'/docCard',
        //   query:{
        //     doctorId:id
        //   }
        // })

        this.$router.push({
          path:'/docDepartmentCard',
          query:{
            doctorId:id
          }
        })




      }
    },
    created() {
      if (this.$route.query.gid) {
        this.groupId = this.$route.query.gid;
      }
      this.getDocGroupDetail();
    }
  };
</script>

<style scoped lang="less">
  .docGroupDetail_page {
    .padding(60, 12, 24, 12);

    .cardBox {
      background-color: rgba(0, 105, 255, 1);
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;
      .padding(0, 0, 15, 0);

      .title_box {
        background: url("../../../assets/images/docGroup_back.png") no-repeat;
        background-size: cover;


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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .padding(0, 0, 10, 0);

          img {
            display: block;
            .width(60);
            .height(60);
            border-radius: 50%;
            overflow: hidden;
          }

          img.admin_icon {
            position: relative;
            top: -10px;
            .width(83);
            .height(25);
            border-radius: 0;
          }
        }

        .adminName {
          .fontSize(16);
          font-weight: 400;
          color: @fontOne;
          .padding(0, 0, 20, 0);
          text-align: center;
        }
      }

      .docGroupMember_box {
        .margin(0, 10, 0, 10);
        .borderRadius(10, 10, 10, 10);
        .padding(15, 10, 10, 10);
        background-color: @backgroundColorT;

        .title {
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          .padding(0, 0, 15, 0);
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
        .margin(15, 10, 0, 10);
        .borderRadius(10, 10, 10, 10);
        .padding(15, 10, 10, 10);
        background-color: @backgroundColorT;

        .title {
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          .padding(0, 0, 15, 0);
        }

        .docGroupMessage_p {
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(102, 102, 102, 1);

          .modify_btn {
            .fontSize(16);
            .lineHeight(20);
            font-weight: 400;
            color: rgba(0, 105, 255, 1) !important;
            text-decoration: underline;
            .margin(0,0,0,4);
          }
        }
      }

      .docGroupCode_box {
        .margin(15, 10, 0, 10);
        .borderRadius(10, 10, 10, 10);
        .padding(15, 10, 10, 10);
        background-color: @backgroundColorT;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
          display: block;
          .width(150);
          .height(150);
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
  }


  /*弹窗pop样式*/
  /deep/ .van-popup.docGroupMessage_popup {
    width: 80%;
    box-sizing: border-box;
    .padding(20, 0, 0, 0);
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;

    .van-field__control {
      min-height: 96px;
    }

    h3 {
      text-align: center;
    }

    .btns_box {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 100%;
      .height(44);

      .btn {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .cancel_btn {
      color: @fontColor33;
      background-color: @backgroundColorff;
    }

    .sure_btn {
      color: @fontColorff;
      background-color: @mainColor;
    }
  }


  .addPerson,
  .modify_name,
  .delPerson {
    width: 280px;
    height: 50px;
    color: @mainColor;
    background: @backgroundColorT;
    .fontSize(16);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1px;
  }

</style>
