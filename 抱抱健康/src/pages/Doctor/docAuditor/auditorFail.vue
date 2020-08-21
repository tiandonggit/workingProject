/* * @Author: 田东 * @Date: 2020-01-08 09:34:32 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-08 09:39:12 * @name 医生身份审核失败 */
<!---->
<template>
  <div id="auditorFail">
    <common-header
      :share-disabled="true"
      :custom-title="'身份验证'"
    ></common-header>
    <div class="banner">
      <img :src="faillog" alt />
    </div>
    <div class="content">
      <div class="top">审核失败</div>
      <div class="tipOne">抱歉，您的身份验证未通过！</div>
      <div class="tipTwo">{{ statusMsg }}</div>
    </div>
    <div class="footer-box">
      <van-button slot="button" class="next-btn" size="large" @click="goNext"
        >修改信息</van-button
      >
    </div>
  </div>
</template>

<script>
import faillog from "../../../assets/images/faillog.png";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "auditorFail",
  data() {
    return {
      statusMsg: "",
      faillog: faillog
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.getState();
  },
  methods: {
    goNext() {
      this.$router.push({
        name: "infoID"
      });
    },
    getState() {
      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/selectDoctor",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.data.data.checkstatus == 2) {
              this.statusMsg = res.data.data.data.checkremark;
            }
          } else {
            this.statusMsg = "请求信息失败";
          }
        })
        .catch(e => {
          this.statusMsg = "无法获得审核状态";
          console.log(e);
        });
    }
  }
};
</script>

<style lang="less" scoped>
#auditorFail {
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .banner {
    width: 100%;
    .padding(123, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      .width(60);
      .height(60);
    }
  }
  .content {
    width: 100%;
    text-align: center;
    .margin(25, 0, 0, 0);

    .top {
      .fontSize(18);
      font-weight: 400;
      color: @titleColor;
      .lineHeight(18);
    }

    .tipOne {
      .fontSize(18);
      .margin(112, 0, 11, 0);
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: @titleColor;
      .lineHeight(22);
    }

    .tipTwo {
      color: @descriptionColor;
      .fontSize(16);
    }
  }
}
</style>
