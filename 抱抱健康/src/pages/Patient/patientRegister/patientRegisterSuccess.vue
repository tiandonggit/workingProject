/**
 *@desc 患者注册成功提示页
 *@author houpai
 *@date 2020/02/26 11:36:34
 */
<template>
  <div class="patientRegisterSuccess_page">
    <common-header
        :share-disabled="true"
        :custom-title="'身份信息'"
    ></common-header>
    <div class="noResult">
      <img src="../../../assets/images/registered.png" alt="">
      <p class="top">验证成功</p>
      <p class="again">您已完成身份验证!</p>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header"

  export default {
    name: "patientRegisterSuccess",
    components:{
      commonHeader
    }
  }
</script>

