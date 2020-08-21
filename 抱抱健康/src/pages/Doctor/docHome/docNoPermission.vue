/*
 * @Author: 田东 
 * @Date: 2020-06-09 13:27:52 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-06-09 13:54:54
 * @name 医生扫描医生二维码 —— 没有权限
 */

<template>
  <div id="docNoPermission">
    <div class="img-box">
      <img src="../../../assets/images/no-permission.png" alt />
      <p>该二维码仅供患者扫描使用</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "docNoPermission",
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang="less" scoped>
#docNoPermission {
  .img-box {
    .padding(108, 12, 12, 12);

    img {
      .width(200);
      display: block;
      margin: 0 auto;
    }

    p {
      text-align: center;
      .fontSize(18);
      color: @titleColor;
      font-weight: bold;
      .lineHeight(22);
      .margin(30, 0, 0, 0);
    }
  }
}
</style>
