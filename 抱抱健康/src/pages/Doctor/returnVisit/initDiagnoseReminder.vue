<template>
  <div class="initDiagnoseReminder_page">
    <common-header :share-disabled="true" :custom-title="'医患沟通'" :header-show="true" title="发起复诊"></common-header>
    <div class="block-title">
      <p>
        复诊基础信息
        <span class="require">（必填信息）</span>
      </p>
    </div>

    <div class="info-box">
      <van-field v-model="patientname" type="text" readonly placeholder label="患者姓名：" />
      <van-field v-model="disease" type="text" placeholder="请编辑疾病名称" label="复诊疾病：" />
      <van-field
        v-model="dateTime"
        type="text"
        readonly
        placeholder="请选择患者复诊时间"
        label="复诊时间："
        right-icon="arrow"
        @click.stop="isShowTimePopup = true; minDate = new Date()"
      />
    </div>

    <div class="block-title">
      <p>
        复诊说明
        <span>（选填信息）</span>
      </p>
    </div>

    <div class="instructions-box">
      <textarea
        v-model="instructions"
        @input="edit"
        placeholder="请编辑复诊详细说明0-100字"
        maxlength="100"
        name
        id
      ></textarea>
      <div class="num-limit">{{num}}/100</div>
    </div>

    <div class="btn" @click.stop="send">
      <span>发送</span>
    </div>

    <van-popup v-model="isShowTimePopup" position="bottom" :style="{ height: '70vw' }">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="复诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmTime"
        @cancel="cancelTime"
      />
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
import { mapState } from "vuex";
export default {
  name: "initDiagnoseReminder",
  components: {
    commonHeader
  },
  computed: {
    ...mapState(["DoctorIM"])
  },
  data() {
    return {
      patientname: "",
      disease: "",
      time: "",
      dateTime: "",
      instructions: "",
      isShowTimePopup: false,
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      num: 0
    };
  },
  created() {
    this.patientname = this.$route.query.patientName;
  },
  methods: {
    cancelTime() {
      this.isShowTimePopup = false;
    },

    confirmTime() {
      let date = new Date(this.currentDate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let fm = m < 10 ? "0" + m : m;
      let d = date.getDate();
      let fd = d < 10 ? "0" + d : d;
      let h = date.getHours();
      let fh = h < 10 ? "0" + h : h;
      let f = date.getMinutes();
      let ff = f < 10 ? "0" + f : f;
      let s = date.getSeconds();
      let fs = s < 10 ? "0" + s : s;
      this.dateTime = y + "-" + fm + "-" + fd + " " + fh + ":" + ff + ":" + fs;
      this.isShowTimePopup = false;
    },

    edit() {
      this.num = 100 - this.instructions.length;
    },

    send() {
      if (!this.patientname || !this.disease || !this.dateTime) {
        Toast("复诊基础信息未填全");
        return;
      }

      let params = {
        patientId: this.$route.query.patientId,
        patientname: this.patientname,
        doctorid: this.DoctorIM.doctorMessage.data.docId,
        doctorname: this.DoctorIM.doctorMessage.data.docName,
        illnessname: this.disease,
        subsequentvisittime: this.dateTime,
        explain: this.instructions
      };

      this.$http
        .request({
          method: "post",
          url: "/SSubsequentVisitController/insertOrUpdate",
          body: params
        })
        .then(res => {
          if (res.data.success) {
            Toast("发送成功");
            setTimeout(() => {
              this.$router.push({
                name: "docChatIMDetail"
              });
            }, 300);
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

<style scoped lang="less">
* {
  box-sizing: border-box;
}

.initDiagnoseReminder_page {
  height: 100%;
  .padding(44, 12, 0, 12);

  .block-title {
    .margin(18, 0, 15, 0);
    .padding(0, 8, 0, 8);

    p {
      .fontSize(18);
      font-weight: bold;
      color: @titleColor;
      .lineHeight(25);

      span {
        .fontSize(14);
        font-weight: bold;
        color: @fontColor99;
        .lineHeight(25);
      }

      .require {
        color: @buttonFF59;
      }
    }
  }

  .info-box {
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;

    /deep/ .van-field {
      .van-field__label {
        .fontSize(16);
        color: @titleColor;
      }

      .van-field__control {
        .fontSize(16);
      }
    }
  }

  .instructions-box {
    .height(197);
    background: @backgroundColorff;
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;
    position: relative;

    textarea {
      height: 100%;
      width: 100%;
      outline: none;
      border: none;
      .padding(15, 10, 45, 10);
    }

    .num-limit {
      position: absolute;
      right: 10px;
      bottom: 15px;
      .fontSize(14);
      font-weight: 400;
      color: @descriptionColor;
      .lineHeight(20);
    }
  }

  .btn {
    width: 100%;
    .height(44);
    background: @mainColor;
    .borderRadius(10, 10, 10, 10);
    text-align: center;
    .lineHeight(44);
    .margin(20, 0, 0, 0);

    span {
      .fontSize(18);
      font-weight: 400;
      color: @fontOne;
      .lineHeight(25);
    }
  }
}
</style>