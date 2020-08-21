<template>
  <div class="header-div header-left" @click="headerBack">
    <!-- <i class="iconfont iconleft back-icon"></i> -->
    <van-icon name="arrow-left"  class="back-icon"/>
  </div>
</template>
<script>
import { Dialog } from "vant";
import wx from "weixin-js-sdk";
export default {
  name: "left",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    /**
     * 返回上一页
     */
    headerBack() {
      if (window.history.length <= 1) {
        //如果没有上一页了则退出公众号
        wx.closeWindow();
        // this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    }
  },
  props: {}
};
</script>
<style lang="less" scoped>
.header-left {
  height: 100%;
  display: flex;
  align-items: center;
}
.back-icon {
  .fontSize(20);
  font-weight: 600;
  color: @titleColor;
}
</style>
