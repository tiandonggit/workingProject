/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: panicBuyingResult *
@function: 抢购结果页 * @date: 2020/2/20 * @time: 13:55 * * */
<template>
  <div id="panicBuyingResult">
    <common-header
      :share-disabled="true"
      custom-title="产品购买"
    ></common-header>
    <div class="main" v-if="result == 1">
      <div class="main_box">
        <img src="../../assets/images/panicBuyingResult2.png" alt="" />
        <p>很遗憾，抢购失败</p>
        <span>明天10:00再来吧～</span>
      </div>
    </div>
    <div class="main" v-else>
      <div class="main_box">
        <img src="../../assets/images/panicBuyingResult1.png" alt="" />
        <p>恭喜抢购成功</p>
        <span>请留意公众号内消息并及时付款， 超时订单将自动取消。</span>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "panicBuyingResult",
  components: {
    commonHeader
  },
  data() {
    return {
      result: ""
    };
  },
  created() {
    this.result = this.$route.query.result;
    console.log(this.result == "true");
    console.log(this.$route.query.result);
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}

#panicBuyingResult {
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  background: @backgroundColor;

  .main {
    position: absolute;
    top: 44/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    left: 68/375 * 100vw;
    right: 68/375 * 100vw;

    .main_box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .padding(15, 0, 0, 0);
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none !important;
        width: 0px;
        height: 0px;
      }

      text-align: center;

      img {
        .width(200);
        .padding(43, 0, 0, 0);
      }

      p {
        .padding(30, 0, 15, 0);
        font-weight: bold;
        .lineHeight(28);
        color: @titleColor;
        .fontSize(18);
      }

      span {
        .fontSize(16);
        .lineHeight(25);
        color: @qianSpan;
      }
    }
  }
}
</style>
