<template>
  <div class="updateRemark_page">
    <common-header
        :share-disabled="true"
        class="header"
        :custom-title="'添加备注'"
    ></common-header>
    <div class="navbar">
      <van-nav-bar
          title="添加备注"
          left-arrow
          @click-left="$router.go(-1)"
      ></van-nav-bar>
    </div>
    <van-cell-group>
      <van-field
          v-model="doctorRemark"
          placeholder="编辑备注内容0-500字"
          :clearable="false"
          type="textarea"
          maxlength="500"
      ></van-field>
    </van-cell-group>
    <p v-if="doctorRemark.length >= 500" class="textarea_tip">
      已超过文字输入上限
    </p>

    <van-popup v-model="dialogShow">
      <div role="dialog"
           class="van-dialog"
           style="z-index: 2007;"
           v-if="dialogShow"
           aria-labelledby="是否保存该备注?">
        <div class="van-dialog__content">
          <div class="van-dialog__message">是否保存该备注?</div>
        </div>
        <div class="van-hairline--top van-dialog__footer van-dialog__footer--buttons">
          <button class="van-button van-button--default van-button--large van-dialog__cancel"
                  @click.stop="cancelUpdateRemark"
                  style="color: rgb(254, 159, 63);">
            <span class="van-button__text">取消</span>
          </button>
          <button class="van-button van-button--default van-button--large van-dialog__confirm
                        van-hairline--left"
                  @click.stop="updateDoctorRemark"
                  style="color: rgb(254, 159, 63);">
            <span class="van-button__text">确认</span>
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import Vue from "vue";
  import {Toast, Popup} from "vant";
  import {mapState} from "vuex";
  // import {Dialog} from "vant";

  Vue.use(Toast);
  Vue.use(Popup);
  // Vue.use(Dialog);

  export default {
    name: "updateRemark",
    components: {
      commonHeader
    },
    data() {
      return {
        doctorRemark: "", // 医生备注
        doctorId: "", // 医生id
        isSave: false, // 是否保存
        dialogShow: false
      };
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    methods: {
      // /**
      //  * 监听返回键
      //  * 保存备注**/
      // handle() {
      //   try {
      //     Dialog.confirm({
      //       message: "是否保存该备注?",
      //       cancelButtonColor: "#fe9f3f",
      //       confirmButtonColor: "#fe9f3f"
      //     })
      //       .then(() => {
      //         this.updateDoctorRemark();
      //       })
      //       .catch(() => {
      //         console.log("取消保存");
      //         this.isSave = true;
      //         this.$router.go(-1);
      //       });
      //   } catch (e) {
      //     console.log(e);
      //   }
      // },

      /**
       * 修改医生备注 **/
      updateDoctorRemark() {
        this.$http
          .request({
            method: "post",
            url: "/ImController/setDoctorNameRemark",
            body: {
              doctorId: this.doctorId,
              nameRemark: this.doctorRemark
            }
          })
          .then(res => {
            if (res.data.success) {
              this.isSave = true;
              Toast({
                message: "保存成功",
                position: "bottom"
              });
              this.$router.go(-1);
            } else {
              console.log("设置医生备注接口报错");
              Toast({
                message: "保存失败",
                position: "bottom"
              });
            }
          });
      },

      /**
       * 取消返回上一页**/
      cancelUpdateRemark() {
        this.isSave = true;
        this.$router.go(-1);
      }
    },

    /**
     * 路由钩子判断是否保存
     * 如果保存可以跳转**/
    beforeRouteLeave(to, from, next) {
      if (!this.isSave) {
        // this.handle();
        this.dialogShow = true;
        next(false);
      } else {
        next();
      }
    },
    created() {
      if (this.$route.query.doctorId) {
        this.doctorId = this.$route.query.doctorId;
      } else {
        this.doctorId = this.PatientIM.patientMessage.doctorId;
      }
      this.doctorRemark = this.PatientIM.doctorRemark;
    }
  };
</script>

<style scoped lang="less">
  .van-icon {
    color: black;
  }

  .updateRemark_page {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.05);

    .navBar {
      width: 100%;
      .height(50);
      display: flex;
      text-align: center;
      align-items: center;
      background-color: #fff;
      .padding(0, 5, 0, 5);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    }

    /deep/ .van-icon-clear {
      color: @buttonColor !important;
    }

    /deep/ .van-cell {
      margin: 8px 0 0 0;
      /*box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);*/
    }

    .textarea_tip {
      width: 100%;
      color: red;
      text-align: left;
      margin: 8px 4px;
      background: none;
    }
  }

  .dialog {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    height: 120px;
    margin: auto;
    background-color: pink;
  }

  .updateRemark_page /deep/ .van-popup.van-popup--center {
    width: 320px !important;
    height: 120px !important;
  }
</style>
