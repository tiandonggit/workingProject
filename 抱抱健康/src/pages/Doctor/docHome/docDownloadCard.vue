/*
 * @Author: 田东 
 * @Date: 2020-06-09 13:27:52 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-06-10 09:37:13
 * @name 医生下载名片跳转页
 */

<template>

  <div id="docDownloadCard">
    <common-header
      :share-disabled="true"
      :custom-title="'长按保存名片'"
    ></common-header>
    <img :src="imgUrl" alt="" >
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "docDownloadCard",
  components: {
    commonHeader
  },
  data() {
    return {
      imgUrl: ""
    };
  },
  created() {
    this.imgUrl = window.sessionStorage.getItem("downloadImgUrl");
  },
  methods: {}
};
</script>

<style lang="less" scoped>
#docDownloadCard {
  img {
    width: 100%;
  }
}
</style>
