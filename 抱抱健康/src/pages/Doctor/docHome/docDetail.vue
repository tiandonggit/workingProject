/**
*@desc 医生详细信息
*@author houpai
*@date 2020/03/31 13:05:12
*/
<template>
  <div class="docDetail_page">
    <common-header :share-disabled="true" :custom-title="'医生名片'"></common-header>
    <div class="navBar">
      <van-nav-bar
        :title="isAdmin?'完善信息':'医生信息'"
        left-arrow
        :right-text="isAdmin?'保存':''"
        @click-left="onClickLeft"
        @click-right="onClickRight"
      ></van-nav-bar>
    </div>

    <div class="content">
      <p class="title">
        详细信息
        <span v-if="isAdmin">(此部分信息平台将严格保密,不会公开)</span>
      </p>
      <van-cell-group class="doctorMessage_form">
        <div class="doctorMessage_div">
          <van-field
            :placeholder="isAdmin?'请输入籍贯信息':'暂无信息'"
            class="labelWeight"
            :disabled="!isAdmin"
            maxlength="20"
            v-model="doctorMessage.nativeplace"
            clearable
            label="籍贯"
          ></van-field>
          <van-field
            :placeholder="isAdmin?'请输入您的民族':'暂无信息'"
            class="labelWeight"
            :disabled="!isAdmin"
            maxlength="10"
            v-model="doctorMessage.nation"
            clearable
            label="民族"
          ></van-field>
          <div class="van-cell-div borderWith">
            <p class="radio_title">婚姻</p>
            <van-radio-group label="婚姻" v-model="doctorMessage.marriage">
              <van-radio :name="2" class="MarginRight20Radio" :disabled="!isAdmin">未婚</van-radio>
              <van-radio :name="1" :disabled="!isAdmin">已婚</van-radio>
            </van-radio-group>
          </div>
          <div class="van-cell-div borderWith">
            <p class="radio_title">学历</p>
            <div class="select_education" @click.stop="selectEducation">
              <span v-if="doctorMessage.text">{{doctorMessage.text }}</span>
              <span v-else style="color: rgba(168, 168, 168, 1);">{{isAdmin?'请选择学历':'暂无信息'}}</span>
              <van-icon name="arrow" />
            </div>
          </div>
          <van-field
            :placeholder="isAdmin?'请输入常住地':'暂无信息'"
            class="labelWeight"
            :disabled="!isAdmin"
            type="textarea"
            :maxlength="50"
            autosize
            v-model="doctorMessage.homeaddress"
            clearable
            label="常住地"
          ></van-field>
        </div>
      </van-cell-group>
    </div>

    <van-popup v-model="dialogShow" class="makeSurePop">
      <div
        role="dialog"
        class="van-dialog"
        style="z-index: 2007;"
        v-if="dialogShow"
        aria-labelledby="是否保存该信息?"
      >
        <div class="van-dialog__content">
          <div class="van-dialog__message">{{ "是否保存该信息?" }}</div>
        </div>
        <div class="van-hairline--top van-dialog__footer van-dialog__footer--buttons">
          <button
            class="van-button van-button--default van-button--large van-dialog__cancel"
            @click.stop="cancelUpdateDetail"
          >
            <span class="van-button__text">取消</span>
          </button>
          <button
            class="van-button van-button--default van-button--large van-dialog__confirm van-hairline--left"
            @click.stop="updateDoctorDetail"
          >
            <span class="van-button__text">确认</span>
          </button>
        </div>
      </div>
    </van-popup>

    <van-action-sheet
      @click-overlay="selectShow=false"
      v-model="selectShow"
      :actions="educationList"
      @select="onSelect"
    />
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import { mapState } from "vuex";
import { Toast } from "vant";

export default {
  name: "docDetail",
  components: {
    commonHeader
  },
  data() {
    return {
      selectShow: false,
      educationList: [],
      dialogShow: false,
      isSave: false,
      doctorMessage: {
        nativeplace: "", // 籍贯
        nation: "", // 民族
        marriage: "", //婚否
        homeaddress: "", //常住地
        text: "", // 学历
        educations: "" // 学历id
      },
      // isAdmin: false,
      doctorId: "",
      isAdminQuery: ""
    };
  },
  computed: {
    ...mapState(["DoctorIM"]),
    isAdmin() {
      let admin = false;
      if (this.isAdminQuery) {
        admin = true;
      }
      return admin;
    }
  },
  methods: {
    /**
     * onSelect
     * **/
    onSelect(item) {
      this.doctorMessage.educations = item.code;
      this.doctorMessage.text = item.text;
      this.selectShow = false;
    },
    selectEducation() {
      if (!this.isAdmin) {
        return false;
      }
      this.selectShow = true;
    },
    /**
     * 取消按钮
     * **/
    cancelUpdateDetail() {
      this.isSave = true;
      this.$router.go(-1);
    },
    /**
     * router back
     * **/
    onClickLeft() {
      this.$router.go(-1);
    },
    /**
     * 保存信息
     * **/
    onClickRight() {
      if (!this.isAdmin) {
        return false;
      }
      this.updateDoctorDetail();
    },
    /**
     * 更改医生信息
     * **/
    updateDoctorDetail() {
      if (
        !this.doctorMessage.nativeplace &&
        !this.doctorMessage.nation &&
        !this.doctorMessage.marriage &&
        !this.doctorMessage.homeaddress &&
        !this.doctorMessage.educations
      ) {
        Toast("信息为空,请填写详细信息");
        return false;
      }
      let reg = /^[\u4e00-\u9fa5]+$/;
      if (this.doctorMessage.nativeplace) {
        if (!reg.test(this.doctorMessage.nativeplace)) {
          Toast("请输入正确的籍贯信息");
          return false;
        }
      }
      if (this.doctorMessage.nation) {
        if (!reg.test(this.doctorMessage.nation)) {
          Toast("请输入正确的民族");
          return false;
        }
      }
      let params = {};
      params = { ...this.doctorMessage };
      params.id = this.DoctorIM.doctorMessage.data.docId || "";
      delete params.education;
      this.$http
        .request({
          url: "/RDoctorController/insertOrUpdate",
          method: "post",
          body: params
        })
        .then(res => {
          if (res.data.success) {
            Toast("修改成功");
            this.$router.go(-1);
          } else {
            console.log("修改医生详细信息报错");
          }
          this.isSave = true;
        })
        .catch(e => {
          console.log(e);
          this.isSave = true;
        });
    },
    /**
     * 获取学历字典
     * **/
    getEducationList() {
      return new Promise((resolve, reject) => {
        this.$http
          .request({
            url: "/SysDictionaryController/selectEducation",
            method: "get",
            body: {}
          })
          .then(res => {
            if (res.data.success) {
              let educationList = res.data.data || [];
              try {
                educationList.forEach(item => {
                  item.name = item.text;
                });
              } catch (e) {
                console.log(e);
              }
              this.educationList = educationList;
              resolve(res.data.data);
            } else {
              console.log("获取学习字典接口报错");
              reject("err");
            }
          })
          .catch(err => {
            console.log(err);
            reject("err");
          });
      });
    },
    /**
     * 查询医生详细信息
     * **/
    getDoctorDetail() {
      this.$http
        .request({
          url: "/RDoctorController/selectDetailed",
          method: "get",
          body: this.doctorId ? { id: this.doctorId } : {}
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.doctorMessage = res.data.data;
          } else {
            console.log("查询新生详细信息接口报错");
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  created() {
    if (this.$route.query.doctorId) {
      this.doctorId = this.$route.query.doctorId;
    }
    if (this.$route.query.isAdminQuery) {
      this.isAdminQuery = this.$route.query.isAdminQuery;
    }
    let educationPromise = this.getEducationList();
    Promise.all([educationPromise]).then(() => {
      this.getDoctorDetail();
    });
  },
  /**
   * 路由钩子判断是否保存
   * 如果保存可以跳转**/
  beforeRouteLeave(to, from, next) {
    if (!this.isSave && this.isAdmin) {
      // this.handle();
      this.dialogShow = true;
      next(false);
    } else {
      next();
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

/deep/ .van-nav-bar {
  background-color: @backgroundColor;

  .van-icon {
    .fontSize(28);
    .margin(-4, 0, 0, 3);
    color: #555 !important;
  }

  .van-nav-bar__text {
    color: @mainColor;
    .fontSize(16);
  }
}

.docDetail_page /deep/ textarea {
  .fontSize(16);
  word-break: break-all !important;
  word-wrap: break-word !important;
}

.van-hairline--top-bottom::after {
  border: none;
}

.docDetail_page {
  .padding(0, 0, 24, 0);

  /deep/ .van-popup.makeSurePop {
    .width(320);
    .height(146);
    background: none;

    .van-dialog {
      top: 50%;
      .width(320);
    }
  }

  /deep/ .van-button--large {
    .height(50);
    .lineHeight(48);
  }

  /deep/ .van-radio-group {
    display: flex;
    align-items: center;
  }

  .doctorMessage_form /deep/ .van-radio__icon--checked .van-icon {
    color: #fff;
    background-color: @buttonColor;
    border-color: @buttonColor;
  }

  .labelWeight /deep/ .van-cell__title span {
    .fontSize(16);
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }

  .labelWeight.disabled /deep/ .van-cell__title span {
    color: #999;
  }

  /deep/ .van-field__body {
    font-size: 16px;
  }

  /deep/ .van-cell {
    .padding(15, 0, 15, 0);
    box-sizing: border-box;
  }

  /deep/ .van-radio__label {
    line-height: 20px;
    font-size: 16px;
    margin-left: 10px;
  }

  /deep/ .van-cell .van-field__control {
    font-size: 16px;
  }

  /deep/ .paddingBottom12.van-cell .van-field__body {
    padding-bottom: 12px;
  }

  .content {
    background: @backgroundColorT;
    .borderRadius(10, 10, 10, 10);
    .width(351);
    margin: 0 auto;

    .title {
      display: flex;
      align-items: center;
      .fontSize(16);
      font-weight: bold;
      color: @titleColor;
      .lineHeight(46);
      .padding(0, 0, 0, 27);
      border-bottom: 1px solid @backgroundColor;
      background: url("../../../assets/images/icon_zhu.png") 3.5vw center
        no-repeat;
      background-size: 1.07vw;

      span {
        .fontSize(14);
        color: rgba(168, 168, 168, 1);
      }
    }
  }

  .doctorMessage_form {
    box-sizing: border-box;
    .margin(0, 12, 0, 12);
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;

    .doctorMessage_div {
      background-color: #fff;
    }
  }

  .doctorMessage_form /deep/ .van-radio__icon--checked .van-icon {
    color: #fff;
    background-color: @buttonColor;
    border-color: @buttonColor;
  }

  .van-cell {
    border-bottom: 1px solid #ebedf0;
  }

  .van-cell.noBorderCell {
    border-bottom: none;
  }

  .van-cell-div.noborderBottom {
    border-bottom: 0 !important;
  }

  .van-cell-div {
    border-bottom: 1px solid #ebedf0;
    display: flex;
    padding: 15px 0px;
    .lineHeight(25);

    .radio_title {
      width: 90px;
      .fontSize(16);
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .radio_title.noDisabled {
      .fontSize(16);
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }

  .MarginRight20Radio.van-radio {
    margin-right: 20px;
    margin-left: 0 !important;
  }

  .select_education {
    flex: 1;
    display: flex;
    align-items: center;

    span {
      flex: 1;
    }

    i {
      font-size: 20px;
    }
  }
}
</style>
