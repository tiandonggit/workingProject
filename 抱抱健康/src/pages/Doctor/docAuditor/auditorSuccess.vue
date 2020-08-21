/* * @Author: 田东 * @Date: 2020-01-08 09:23:52 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-08 09:25:56 * @name 医生身份审核通过 */
<!---->
<template>
  <div id="auditorSuccess">
    <common-header
      :share-disabled="true"
      :custom-title="'身份验证'"
    ></common-header>
    <div class="banner">
      <img :src="successlog" alt="" />
    </div>
    <div class="content">
      <div class="top">身份验证通过</div>
      <div class="tipOne">恭喜，您的身份验证审核已通过！</div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { Toast } from "vant";
import successlog from "../../../assets/images/successlog.png";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "auditorSuccess",
  data() {
    return {
      successlog: successlog
    };
  },
  components: {
    commonHeader
  },
  mounted() {
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: "spinner",
      message: "5 秒后自动跳转首页"
    });
    let second = 5;
    const timer = setInterval(() => {
      second--;
      if (second) {
        toast.message = `${second} 秒后自动跳转首页`;
      } else {
        clearInterval(timer);
        Toast.clear();
        this.$router.push({ name: "docHome" });
      }
    }, 1000);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
#auditorSuccess {
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
      .margin(112, 0, 0, 0);
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: @titleColor;
      .lineHeight(22);
    }
  }
}
</style>
