<template>
  <div class="notFound_page 404_page">
    <div class="notFound">
      <div class="back_btn" @click.stop="backPrePage">
        返回上一页
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Page404',
    methods:{
      backPrePage() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style scoped lang="less">

  .notFound_page {
    height: 100%;
    background: @mainBackgroundColor;
  }
  .notFound {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 20;
    background: url("../../assets/images/404.png") no-repeat center;
    background-size: contain;

    .back_btn {
      width:126px;
      height:36px;
      line-height: 36px;
      text-align: center;
      background:linear-gradient(270deg,rgba(1,128,255,1) 0%,rgba(0,105,255,1) 100%);
      border-radius:10px;
      color: @fontColorFFF;
      margin-bottom: 118px;
    }
  }

</style>
