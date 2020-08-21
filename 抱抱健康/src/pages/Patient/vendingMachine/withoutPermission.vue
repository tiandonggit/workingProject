/** *@desc 无权限操作 *@author houpai *@date 2019/09/09 19:02:51 */
<template>
  <div class="withoutPermission_page">
    <common-header
      :share-disabled="true"
      :custom-title="'无权限'"
    ></common-header>
    <div class="img_box">
      <img src="../../../assets/images/withoutPermission.png" alt="" />
    </div>
    <p class="withoutPermission_tip">您没有权限访问该页面</p>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "withoutPermission",
  components: {
    commonHeader
  }
};
</script>

<style scoped lang="less">
.withoutPermission_page {
  display: flex;
  flex-direction: column;
  align-items: center;

  .img_box {
    .margin(118, 0, 30, 0);
    width: 100%;
    .height(200);
    .width(200);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .withoutPermission_tip {
    text-align: center;
    .fontSize(18);
    font-weight:bold;
    color:rgba(51,51,51,1);
  }
}
</style>
