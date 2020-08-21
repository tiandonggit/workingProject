/* * @Author: 田东 * @Date: 2020-01-08 13:21:21 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-08 13:22:38 * @name 编辑备注 */
<!---->
<template>
  <div id="docIMEditRemark">
    <common-header :share-disabled="true" :custom-title="'添加备注'"></common-header>

    <div class="header_box clearfix">
      <div class="header-div header-left" @click="onClickLeft()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">添加备注</div>
      <div class="price header-right">
        <span @click="save()">保存</span>
      </div>
    </div>

    <div class="content">
      <p class="title" v-text="'备注'"></p>
      <div class="edit">
        <van-cell-group>
          <van-field
              v-model="message"
              type="textarea"
              row="6"
              :placeholder="'编辑备注内容(0-500个字)'"
              @input="active(message)"
              :maxlength="500"
              autosize
          ></van-field>
        </van-cell-group>
      </div>
      <div class="warning" v-if="isWarning">您输入的文字已超过上限</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Dialog, Icon, Field, Toast, NavBar } from "vant";

Vue.use(NavBar);
Vue.use(Icon);
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "docIMEditRemark",
  data() {
    return {
      isWarning: false,
      message: "",
      patientName: "张小三"
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.message = this.$route.query.remark;
  },
  methods: {
    active(message) {
      this.isWarning = message.length == 500 ? true : false;
    },
    onClickLeft() {
      Dialog.confirm({
        message: "是否保存该备注"
      })
        .then(() => {
          this.saveRemark();
        })
        .catch(() => {
          this.$router.go(-1);
        });
    },
    save() {
      this.saveRemark();
    },
    saveRemark() {
      this.$http
        .request({
          method: "post",
          url: "/ImController/setPatientNameRemark",
          body: {
            patientId: this.$route.query.patientId,
            nameRemark: this.message
          }
        })
        .then(res => {
          if (res.data.success && res.data) {
            this.$router.push({
              name: "docIMPatientInfo",
              query: { id: this.$route.query.id, patientId: this.$route.query.patientId }
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("保存数据失败");
        });
    },
    getInfo() {
      this.$http
        .request({
          method: "post",
          url: "/RDoctorController/updateDoctor",
          body: {
            checkstatus: this.dataType,
            profile: this.profile,
            speciality: this.speciality
          }
        })
        .then(res => {
          if (res.data.success && res.data) {
            this.$router.push({ name: "docIMPatientinfo" });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("保存数据失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

#docIMEditRemark {
  width: 100%;
  padding-top: 44px;
  display: flex;
  flex-direction: column;

  .header_box {
    position: fixed;
    -webkit-box-align: center;
    -ms-flex-align: center;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100vw;
    height: auto;
    background: @backgroundColor;
    padding: 0 12px;

    .header-left {
      width: 20%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-weight: bold;
      text-align: left;

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
      width: 20%;
      height: 100%;
      color: @mainColor;
      .fontSize(16);
      font-weight: 500;
      .lineHeight(16);
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .content {
      width: 94%;
      min-height: 280px;
      //height: 30%;
      margin: 0 auto;
      margin-bottom: 0 !important;
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);

      .title {
        .fontSize(16);
        font-weight: bold;
        color: @titleColor;
        .lineHeight(46);
        .padding(0, 0, 0, 27);
        border-bottom: 1px solid @backgroundColor;
        background: url("../../../assets/images/icon_zhu.png") 3.5vw center no-repeat;
        background-size: 1.07vw;
      }

      .van-cell {
        .padding(15, 10, 15, 10);
      }

      .van-cell-group {
        .borderRadius(0, 0, 10, 10);
        overflow: hidden;
      }

      .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border-width: 0;
      }

      .warning {
        color: @fontFF3Color;
        .margin(0, 0, 15, 10);
        .fontSize(16);
      }
    }
}
</style>
