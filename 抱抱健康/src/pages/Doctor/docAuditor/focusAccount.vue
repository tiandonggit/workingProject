/*
 * @Author: 田东 
 * @Date: 2020-01-10 16:34:07 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-01-10 16:35:43
 * @Description: 注册页面
 */
/*
<template>
  <div id="focusAccount">
    <common-header
      :share-disabled="true"
      :custom-title="'关注公众号'"
      :header-show="true"
      title="关注公众号"
    ></common-header>
    <div class="content">
      <img :src="attention" alt />
      <div class="tipOne">更多功能请先关注公众号</div>
    </div>
    <div></div>
  </div>
</template>

<script>
import attention from "../../../assets/images/attention.png";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "focusAccount",
  data() {
    return {
      attention: attention
    };
  },
  components: {
    commonHeader
  },
  methods: {}
};
</script>

<style lang="less" scoped>
#focusAccount {
  background: @backgroundColor;
  height: 100%;
  box-sizing: border-box;

  .content {
    width: 100%;
    .margin(155, 0, 0, 0);
    text-align: center;

    img {
      .width(205);
      margin: 0 auto;
      display: block;
    }

    .tipOne {
      color: @titleColor;
      .fontSize(18);
      .margin(25, 0, 0, 0);
      font-weight: bold;
      .lineHeight(22);
    }
  }
}
</style>
