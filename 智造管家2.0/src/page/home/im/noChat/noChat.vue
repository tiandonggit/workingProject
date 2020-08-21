<template>
  <div class="noChat_page">
    <div class="top"></div>
    <div class="container">
      <img src="../../../../assets/images/no_chat.png" alt />
      <p>暂无信息！</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "noChat"
};
</script>

<style scoped lang="less">
.noChat_page {
  width: 100%;
  height: 100%;

  .top {
    height: 55px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .container {
    img {
      display: block;
      width: 200px;
      margin: 146px auto 0;
    }

    p {
      margin-top: 38px;
      text-align: center;
      font-size: 18px;
      font-weight: 400;
      color: @titleColor;
      line-height: 20px;
    }
  }
}
</style>
