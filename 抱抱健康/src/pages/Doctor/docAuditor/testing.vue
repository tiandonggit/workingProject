/*
 * @Author: 田东 
 * @Date: 2020-01-08 09:56:47 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-01-10 17:55:46
 * @name 身份审核中
 */
<!---->
<template>
  <div id="testing">
    <common-header
      :share-disabled="true"
      :custom-title="'身份验证'"
    ></common-header>
    <div class="banner">
      <img :src="testinglog" alt="" />
    </div>
    <div class="content">
      <div class="top">身份审核中</div>
      <div class="tipOne">提交成功，请等待管理员审核！</div>
      <div class="tipTwo">
        您的身份认证信息提交成功，系统会在3个工作日之内完成审核，请您耐心等待
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import testinglog from "../../../assets/images/testinglog.png";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "testing",
  data() {
    return {
      testinglog: testinglog
    };
  },
  components: {
    commonHeader
  },
  methods: {}
};
</script>

<style lang="less" scoped>
#testing {
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
      .padding(0, 38, 0, 38);
      .lineHeight(20);
    }
  }
}
</style>
