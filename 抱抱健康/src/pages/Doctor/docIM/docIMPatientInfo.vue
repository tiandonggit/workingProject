/* * @Author: 田东 * @Date: 2020-01-09 17:52:34 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-09 17:52:34 * @name 医生查看患者信息 */
<template>
  <div id="docIMPatientinfo">
    <common-header
      :share-disabled="true"
      :custom-title="'患者信息'"
    ></common-header>
    <div class="header_box clearfix">
      <div class="header-div header-left" @click="onClickLeft()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">{{ patientName }}</div>
      <div class="price header-right" @click="acitveDialog">
        <img src="../../../assets/images/icon_jiahao.png" alt />
        <div class="show-one" v-if="isOnce == 2">
          <div class="block-box">
            <p>
              点击此处可
              <img src="../../../assets/images/icon_tishi.png" alt="" />
              创建医疗团队
            </p>
            <div class="arrow-right"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="info clearfix">
        <div class="left" @click="getPatient">
          <img :src="imgUrl" alt />
        </div>
        <div class="right">
          <div class="rightOne">
            <p class="top">
              <span class="name">{{ patientName }}</span>
              <img src="../../../assets/images/icon_patient.png" alt="" />
            </p>
            <p class="bottom">
              <span class="hospital">{{ disease }}</span>
            </p>
          </div>
        </div>
      </div>
      <div
        class="remark"
        v-text="remark == '' ? '添加备注' : remark"
        @click="goEdit"
      ></div>
    </div>

    <!--弹出层-->
    <van-popup
      v-model="chatAdd"
      :overlay-style="{ background: 'rgba(0,0,0,0.1)' }"
    >
      <div class="chat_addButton" @click="addFriend()">添加医生</div>
      <div class="chat_addButton" @click="createGroup()">添加医生小组</div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Dialog, Icon, Toast, NavBar } from "vant";

Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Dialog);
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "docIMPatientinfo",
  data() {
    return {
      isOnce: null, // 创建医疗团队提示（只显示一次）
      confirmBtn: false,
      concelBtn: false,
      chatAdd: false, //弹出层
      deliveryRemark: "", //用于将备注传递到编辑页面
      patientName: "",
      disease: "",
      imgUrl: "",
      remark: "",
      patientId: ""
    };
  },
  components: {
    commonHeader
  },

  created() {
    this.getIsOnce();
    this.patientId = this.$route.query.patientId;
    this.getInfo();
  },
  methods: {
    getIsOnce(){ // 判断右上角弹窗是否显示
      this.$http
        .request({
          method: "get",
          url: "/ImSessionController/selectSessionDoc",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.isOnce = res.data.data;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    // 创建医生
    addFriend() {
      this.$router.push({
        name: "docAddChatGroupPerson",
        query: {
          res: "addDoc",
          id: this.$route.query.id, //会话id
          name: this.$route.query.name,
          isHasTitleName: true
        }
      });
    },
    // 创建医生小组
    createGroup() {
      this.$router.push({
        name: "docChatGroup",
        query: {
          type: "addGroup",
          id: this.$route.query.id,
          name: this.$route.query.name
        }
      });
    },
    //点击展示Diaglog
    acitveDialog() {
      this.chatAdd = true;
    },
    onClickLeft() {
      this.$router.push({ name: "docChatIMDetail" });
    },
    //点击头像获取具体信息
    getPatient() {
      this.$router.push({
        name: "docPatientInfo",
        query: { patientId: this.patientId, tag: "info" }
      });
    },
    //编辑备注
    goEdit() {
      this.$router.push({
        name: "docIMEditRemark",
        query: { id: this.$route.query.id, patientId: this.patientId, remark: this.deliveryRemark }
      });
    },
    getInfo() {
      this.$http
        .request({
          method: "get",
          url: "/RPatientController/selectIllnessByPatientId",
          body: {
            patientId: this.patientId
          }
        })
        .then(res => {
          if (res.data.success && res.data) {
            let { pname, purl, illness, rpatientnameremark } = res.data.data;
            this.patientName = pname;
            this.imgUrl = purl;
            this.disease = illness;
            this.deliveryRemark = rpatientnameremark;
            this.remark =
              rpatientnameremark.length > 20
                ? rpatientnameremark.substring(0, 20) + "..."
                : rpatientnameremark;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

.van-dialog__confirm {
  color: @mainColor !important;
}

#docIMPatientinfo {
  overflow: hidden;
  width: 100%;
  height: 100%;

  .header_box {
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100vw;
    height: auto;
    background: @backgroundColor;

    .header-left {
      float: left;
      .width(100);
      .height(44);
      .lineHeight(44);
      .padding(0, 0, 0, 10);

      .back-icon {
        .fontSize(20);
        font-weight: 600;
        color: @titleColor;
      }
    }

    .header-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      .fontSize(18);
      width: 0;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 400;
      color: @titleColor;
      .lineHeight(44);
    }

    .header-right {
      text-align: right;
      .width(100);
      .padding(0, 12, 0, 0);
      color: @fontFF3Color;
      .fontSize(16);
      font-weight: 500;
      .lineHeight(16);
      position: relative;

      .show-one {
        position: absolute;
        box-sizing: border-box;
        .width(115);
        .height(54);
        top: 0;
        right: 12.8vw;
        .padding(8, 10, 8, 10);
        background: @backgroundColorT;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        .borderRadius(5, 5, 5, 5);

        .block-box {
          p {
            .fontSize(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: @descriptionColor;
            .lineHeight(18);
            text-align: left;

            img {
              .width(20);
              vertical-align: bottom;
            }
          }

          .arrow-right {
            position: absolute;
            top: 1.6vw;
            right: -3.2vw;
            width: 0;
            height: 0;
            font-size: 0;
            border: solid 1.6vw;
            border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)
              @backgroundColorT;
          }
        }
      }

      img {
        .width(20);
        vertical-align: text-bottom;
      }
    }
  }

  .content {
    width: 100%;
    //min-height: 80%;
    height: 100%;
    margin-top: 17px;
    .padding(0, 12, 0, 12);

    .info {
      width: 100%;
      .height(75);
      .padding(0, 0, 14, 0);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .left {
        .width(60);
        .height(60);
        float: left;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .right {
        .margin(0, 0, 0, 10);
        float: left;
        display: flex;
        align-items: center;

        .rightOne {
          p.top {
            .margin(9, 0, 10, 0);

            .name {
              .fontSize(18);
              margin-right: 2.7vw;
              font-weight: 400;
              color: @titleColor;
              .lineHeight(20);
            }

            img {
              .width(38);
              vertical-align: top;
            }
          }

          p.bottom {
            .fontSize(14);
            font-weight: 400;
            color: @subtitleColor;
            .lineHeight(14);
          }
        }
      }
    }

    .remark {
      width: 100%;
      .height(44);
      .lineHeight(44);
      .fontSize(16);
      color: @titleColor;
      padding-left: 2.7vw;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  /deep/ .van-popup {
    background: none;
  }

  .chat_addButton {
    width: 280px;
    .height(46);
    background: @backgroundColorT;
    color: @mainColor;
    .fontSize(16);
    .borderRadius(10, 10, 10, 10);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1px;
    /*border: 1px solid red;*/
  }
}
</style>
