/**
 *@desc header
 *@author houpai
 *@date 2019/12/05 08:54:27
 */
<template>
  <div class="header_page">
    <div class="header_box">
      <div class="header_bar">
        <span class="header-time" v-tranTime=""></span>
      </div>
      <div class="title_box">
        -医汇智云健康数据管理系统-
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "header"
  }
</script>

<style scoped lang="less">
.header_page {
  color:#fff;
  .header_box {
    display: flex;
    position: relative;
    width: 100%;
    flex-direction: column;
    justify-content: flex-end;
    height: 118px;
    .header_bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 77px;
      background: url('../../../assets/images/headerBarBackGround.png') no-repeat center;
      background-size: 100% 100%;
      .header-time {
        margin-right: 45px;
        font-size:18px;
        font-weight:bold;
        color:rgba(255,255,255,1);
      }
    }
    .title_box {
      display: flex;
      position: absolute;
      top:0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background: url('../../../assets/images/headerBackGround.png') no-repeat center;
      background-size: 100% 100%;
      width: 521px;
      height: 118px;
      justify-content: center;
      align-items: center;
      font-size:30px;
      font-weight:bold;
      color:rgba(255,255,255,1);
    }
  }
}
</style>
