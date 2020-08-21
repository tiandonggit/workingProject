/* * @Author: 田东 * @Date: 2019-10-29 16:33:20 * @Last Modified by: 田东 *
@Last Modified time: 2019-10-29 16:33:20 * @name 营养风险筛查 */

<template>
  <div id="riskScreening">
 <commonHeader
              :share-disabled="true"
              :custom-title="customTitle"
              :header-show="true"
              :title="title"
      ></commonHeader>

    <div class="block">
      <img src="../../assets/img/risk_normal.png" alt />
      <p class="title">您的营养监测正常！</p>
      <p>请每周重复监测一次</p>
    </div>
    <div class="v-bottom">
      <van-button @click="$throttle(submit)" class="v-nextBottom" type="warning">
        <span>确认返回</span> 
      </van-button>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
// import { Toast } from "vant";

export default {
  name: "riskScreening",
  data() {
    return {
      title: "检测结果",
      customTitle:"营养筛查",
      radio1: "",
      radio2: "",
      radio3: ""
    };
  },
  methods: {
    submit() {
      WeixinJSBridge.call("closeWindow");
    }
  },
  components: {
    commonHeader
  },
};
</script>
<style lang="less" scoped>
#riskScreening {
  height: 100%;
  background: @backcolor;

  .block {
    padding-top: 125px;

    img {
      display: block;
      width: 209px;
      margin: 0 auto 21px;
    }

    p {
      text-align: center;
      margin-bottom: 12px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @fontColor66;
      line-height: 20px;
    }

    p.title {
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: @fontColor33;
      line-height: 22px;
    }
  }

  .v-bottom {
    .margin(182);
    display: flex;
    justify-content: center;

    .v-nextBottom {
      .width(351);
      .height(44);
      .lineHeight(44);

      span {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @fontColorff;
        line-height: 22px;
      }
    }
  }
}
</style>
