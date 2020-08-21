/* *@Description: 身份信息 *@Author: tiandong *@Date: 2020-1-2 */
<!---->
<template>
  <div id="docInfoID">
    <common-header :share-disabled="true" :custom-title="'身份信息'"></common-header>
    <div class="infoForm">
      <div class="block-box">
        <van-field
          type="text"
          v-model="inputName"
          center
          @blur="getName"
          :left-icon="iconInfo1"
          placeholder="请填写本人真实姓名"
        />
      </div>

      <div class="block-box" @click="getInfo('hospital')">
        <van-icon name="arrow" />
        <van-field
          type="text"
          center
          readonly
          v-model="inputHospital"
          :left-icon="iconInfo2"
          placeholder="请选择您所在医院"
        />
      </div>

      <div class="block-box" @click="getInfo('office')">
        <van-icon name="arrow" />
        <van-field
          type="text"
          center
          readonly
          v-model="inputOffice"
          :left-icon="iconInfo3"
          placeholder="请选择您所在科室"
        />
      </div>

      <div class="block-box" @click="showPopup">
        <van-field
          type="text"
          center
          readonly
          v-model="inputTitle"
          :left-icon="iconInfo4"
          placeholder="请选择您的职称"
        />
      </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>

    <div class="register-footer-box">
      <div class="agreement">
        注册登录成功即同意
        <span class="protocal" @click.stop="readAgreement('4')">《抱抱健康用户协议》</span>
        <span class="protocal" @click.stop="readAgreement('2')">《隐私政策》</span>
        <span class="protocal" @click.stop="readAgreement('5')">《礼品商城使用规则》</span>
        <span class="protocal" @click.stop="readAgreement('6')">《健康咨询服务协议》</span>
      </div>
      <van-button
        slot="button"
        class="next-btn"
        :disabled="btnDisable"
        size="large"
        @click="goNext"
      >提交审核</van-button>
    </div>
  </div>
</template>

<script>
import { Toast, Picker, Popup } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";

import iconInfo1 from "@/assets/images/icon_info1.png";
import iconInfo2 from "@/assets/images/icon_info2.png";
import iconInfo3 from "@/assets/images/icon_info3.png";
import iconInfo4 from "@/assets/images/icon_info4.png";

export default {
  name: "infoID",
  data() {
    return {
      items: [],
      isBorder: false,
      inputName: "",
      inputHospital: "",
      inputOffice: "",
      inputTitle: "",

      columns: [],
      showPicker: false,

      iconInfo1: iconInfo1,
      iconInfo2: iconInfo2,
      iconInfo3: iconInfo3,
      iconInfo4: iconInfo4,
      btnDisable: false
    };
  },
  components: {
    commonHeader
  },
  watch: {
    inputName(value) {
      //this.btnDisable = value ? false : true;
    }
  },
  computed: {
    selectHospital() {
      return this.$store.state.DoctorInfoID.hospital.hospital;
    },
    selectOffice() {
      return this.$store.state.DoctorInfoID.office.office;
    },
    stateName() {
      return this.$store.state.DoctorInfoID.name.name;
    },
    stateTitle() {
      return this.$store.state.DoctorInfoID.title.title;
    }
  },
  created() {
    //首先读取Store选中的数据
    if (this.selectHospital) {
      this.inputHospital =
        this.selectHospital.length > 14
          ? this.selectHospital.substring(0, 14) + "..."
          : this.selectHospital;
    }
    if (this.selectOffice) {
      this.inputOffice = this.selectOffice;
    }
    if (this.stateTitle) {
      this.inputTitle = this.stateTitle ? this.stateTitle : "请输入您的职务";
    }
    if (this.stateName) {
      this.inputName = this.stateName;
    }
    //请求医生职称
    this.$http
      .request({
        method: "get",
        url: "/SysDictionaryController/selectPosition"
      })
      .then(res => {
        if (res.data.success) {
          this.columns = res.data.data;
        } else {
          Toast(res.data.message);
        }
      })
      .catch(error => {
        Toast("刷新一下，或者检查网络连接");
      });
  },
  methods: {
    //选择职务
    onConfirm(value) {
      this.showPicker = false;
      this.inputTitle = value.text;

      this.$store.commit("DoctorInfoID/setTitle", {
        title: value.text,
        code: value.code
      });
    },
    showPopup() {
      this.showPicker = true;
    },
    /** * 查看协议**/
    readAgreement(type) {
      this.$router.push({
        name: "agreement",
        params: {
          type: type
        }
      });
    },
    getInfo(option) {
      if (option == "hospital") {
        this.$router.push({
          name: "confirmHospital"
        });
      } else if (option == "office") {
        if (this.inputHospital) {
          this.$router.push({
            name: "selectOffice"
          });
        } else {
          Toast("请先选择医院");
          return;
        }
      }
    },
    getName() {
      this.$store.commit("DoctorInfoID/setName", {
        name: this.inputName
      });
    },

    //提交审核
    goNext() {
      let infoIds = this.$store.state.DoctorInfoID;
      if (!this.TestCname(this.inputName)) {
        Toast("请补全身份信息");
        //this.btnDisable = true;
        return;
      }
      let infoData = this.$store.state.DoctorInfoID;

      if (
        !(
          this.inputName &&
          infoData.hospital.id &&
          infoData.office.id &&
          infoData.title.code
        )
      ) {
        Toast("请补全身份信息");
        //this.btnDisable = true;
        return;
      }

      //this.btnDisable = false;
      this.$http
        .request({
          method: "post",
          url: "/RDoctorController/submitApprove",
          body: {
            name: this.inputName,
            rhospitalid: infoData.hospital.id,
            rdepartmentid: infoData.office.id,
            positioncode: infoData.title.code
          }
        })
        .then(res => {
          if (res.data.success) {
            this.$router.push({
              name: "testing"
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("提交信息失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
#docInfoID {
  // overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: @backgroundColor;
  .padding(0, 12, 0, 12);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.infoForm {
  flex: 1;
  min-height: 107vw;
  width: 100%;
  .margin(97, 0, 0, 0);
  text-align: center;

  .block-box {
    box-sizing: border-box;
    .height(48);
    .borderRadius(10, 10, 10, 10);
    background-color: @backgroundColorT;
    .margin(0, 0, 20, 0);
    .padding(8, 20, 8, 20);
    position: relative;

    /deep/ .van-cell {
      padding: 0;

      input {
        .fontSize(18);
        // .lineHeight(20);
        .padding(5, 0, 5, 4);
      }

      .van-icon {
        .fontSize(32);
      }
    }

    /deep/ .van-icon-arrow {
      position: absolute;
      right: 10px;
      top: 4vw;

      &::before {
        color: @descriptionColor;
      }
    }
  }
}

.agreement {
  // width: 100%;
  text-align: left;
  .margin(0, 0, 15, 0);
  .padding(0, 0, 0, 10);
  .fontSize(14);
  color: @descriptionColor;
  .lineHeight(18);

  .protocal {
    color: @mainColor;
  }
}
</style>
