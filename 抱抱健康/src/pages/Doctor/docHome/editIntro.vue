/* * @Author: 田东 * @Date: 2020-01-06 10:52:50 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-06 10:54:18 * @name 编辑： 擅长疾病 个人简介 */
<!---->
<template>
  <div id="editIntro">
    <common-header
        :share-disabled="true"
        :custom-title="editorTitle"
    ></common-header>
    <div class="navBar">
      <van-nav-bar
          :title="editorTitle"
          left-arrow
          :right-text="isAdmin?'保存':''"
          @click-left="onClickLeft"
          @click-right="onClickRight"
      ></van-nav-bar>
    </div>
    <div class="content">
      <p class="title" v-text="dataType == 1 ? '擅长疾病' : '个人简介'"></p>
      <div class="edit">
        <van-cell-group>
          <van-field
              v-model="message"
              :disabled="!isAdmin"
              type="textarea"
              row="6"
              :placeholder="placeholder"
              :maxlength="dataType == 1 ? 500 : 500"
              autosize
          ></van-field>
        </van-cell-group>
      </div>
    </div>
    <div style="height: 10px"></div>

    <van-popup v-model="dialogShow">
      <div
          role="dialog"
          class="van-dialog"
          style="z-index: 2007;"
          v-if="dialogShow"
          aria-labelledby="是否保存该备注?"
      >
        <div class="van-dialog__content">
          <div class="van-dialog__message">{{ popupMsg }}</div>
        </div>
        <div
            class="van-hairline--top van-dialog__footer van-dialog__footer--buttons"
        >
          <button
              class="van-button van-button--default van-button--large van-dialog__cancel"
              @click.stop="cancelUpdateRemark"
          >
            <span class="van-button__text">取消</span>
          </button>
          <button
              class="van-button van-button--default van-button--large van-dialog__confirm
                        van-hairline--left"
              @click.stop="updateDoctorRemark"
          >
            <span class="van-button__text">确认</span>
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import Vue from "vue";
  import {Field, Dialog, NavBar, Toast, popup} from "vant";

  Vue.use(Field);
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "editIntro",
    data() {
      return {
        option: "",
        dataType: 1, //1 代表疾病 2 代表简介
        message: "",
        isSave: false,
        placeholder: "",
        profile: "", //后端简介字段
        speciality: "", //后端疾病字段
        editorTitle: "",
        dialogShow: false,
        popupMsg: "",
        // isAdmin: false,
        doctorId: ""
      };
    },
    components: {
      commonHeader
    },
    watch: {
      message(value) {
        //检测表情
        let reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

        this.message = value.replace(reg2, "").trim();
      }
    },
    created() {
      this.option = this.$route.query.option;
      if (this.$route.query.doctorId) {
        this.doctorId = this.$route.query.doctorId;
      }
      if (this.option == "disease") {
        this.dataType = 1;
        this.placeholder = "请填写您擅长的疾病（500字以内）";
        this.popupMsg = "是否保存擅长疾病？";
        if(!this.isAdmin) {
          this.placeholder = "暂无信息";
        }
      }
      if (this.option == "introduce") {
        this.dataType = 2;
        this.placeholder = "请填写您的个人信息（500字以内）";
        if(!this.isAdmin) {
          this.placeholder = "暂无信息";
        }
        this.popupMsg = "是否保存个人简介？";
      }

      this.getInfo();
    },
    methods: {
      //医生基本信息
      getInfo() {
        this.$http
          .request({
            method: "get",
            url: "/RDoctorController/selectDoctor",
            body: this.doctorId ? {id: this.doctorId} : {}
          })
          .then(res => {
            if (res.data.success && res.data) {
              let data = res.data.data.data;
              this.name = data.docName;
              if (this.dataType == 1) {
                this.editorTitle = `${data.docName}的擅长疾病`;
                this.message = data.speciality;
              }
              if (this.dataType == 2) {
                this.editorTitle = `${data.docName}的个人简介`;
                this.message = data.dprofile;
              }
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("保存数据失败");
          });
      },

      onClickLeft() {
        this.$router.go(-1);
      },
      onClickRight() {
        if (!this.isAdmin) {
          return false;
        }
        this.updateDoctorRemark();
      },
      cancelUpdateRemark() {
        this.isSave = true;
        this.$router.go(-1);
      },
      updateDoctorRemark() {
        if (this.option == "disease") {
          this.speciality = this.message;
        } else if (this.option == "introduce") {
          this.profile = this.message;
        }
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
              this.isSave = true;
              this.$router.go(-1);
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("保存数据失败");
          });
      }
    },
    computed:{
      isAdmin() {
        let admin = false;
        if(this.$route.query.isAdminQuery) {
          admin = true
        }
        return admin
      }
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
      .fontSize(24);
      color: @titleColor !important;
    }

    .van-nav-bar__text {
      color: @mainColor;
      .fontSize(16);
    }
  }

  #editIntro /deep/ textarea {
    .fontSize(16);
    word-break: break-all !important;
    word-wrap: break-word !important;
  }

  .van-hairline--top-bottom::after {
    border: none;
  }

  #editIntro {
    width: 100%;
    min-height: 100%;
    background-color: @backgroundColor;

    /deep/ .van-popup {
      .width(320);
      .height(146);
      background: none;

      .van-dialog {
        top: 50%;
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
    }
  }
</style>
