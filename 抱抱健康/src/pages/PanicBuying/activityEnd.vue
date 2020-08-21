/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: activityEnd *
@function: 活动结束页 * @date: 2020/2/20 * @time: 13:57 * * */
<template>
  <div id="activityEnd">
    <common-header
      :share-disabled="true"
      custom-title="活动专场"
    ></common-header>
    <div class="main">
      <div class="main_box">
        <img src="../../assets/images/activityEnd.png" alt="" />
        <p>本次活动已结束</p>
        <span>更多活动敬请期待</span>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "activityEnd",
  components: {
    commonHeader
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}

#activityEnd {
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
