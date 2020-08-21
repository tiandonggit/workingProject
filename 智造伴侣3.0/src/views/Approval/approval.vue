/**
* @Description: 审批页
* @Author: 侯湃
* @Date: 2020/6/12
*/
<template>
  <div class="approval_page">
    <div class="approval_box">
      <img src="../../assets/image/approval_not_open.png" alt="">
      <span>功能暂未开放</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "approval"
  };
</script>

<style scoped lang="less">
  .approval_page {
    padding: 20px;
    height: 100%;

    .approval_box {
      margin-right: 74px;
      display: flex;
      align-items: center;
      flex-direction: column;
      background: @mainBackgroundColor;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      height: 100%;

      img {
        display: block;
        width: 240px;
        height: 233px;
        margin: 182px 0 30px 0;
      }

      span {
        font-size: 18px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
</style>
