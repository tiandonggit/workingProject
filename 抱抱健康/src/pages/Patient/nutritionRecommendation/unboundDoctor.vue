/**
 * @Description: 使用营养推荐未绑定医生提示
 * @Author: 侯湃
 * @Date: 2020/7/21
 */
<template>
  <div class="unboundDoctor_page">
    <img src="../../../assets/images/unbound_doctor.png" alt="">
    <p>
      请关联医生后再使用“营养推荐”
    </p>
  </div>
</template>

<script>
  export default {
    name: "unboundDoctor"
  };
</script>

<style scoped lang="less">
.unboundDoctor_page {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    display: block;
    .width(200);
    .height(200);
    .margin(116,0,30,0);
  }

  p {
    .fontSize(18);
    color:@fontColor33;
    font-weight:bold;
  }
}
</style>
