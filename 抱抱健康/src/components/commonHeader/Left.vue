<template>
  <div class="header-div header-left" @click="headerBack">
    <i class="iconfont iconleft back-icon"></i>
  </div>
</template>
<script>

  export default {
    name: "left",
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      /**
       * 返回上一页
       */
      headerBack() {
        if (window.history.length <= 1) {
          try {
            WeixinJSBridge.call("closeWindow")
          } catch (e) {
            console.log(e)
          }
        } else {
          this.$router.go(-1)
        }
      }
    },
    props: {}
  }
</script>
<style lang="less" scoped>
  .header-left {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .back-icon {
    .fontSize(20);
    font-weight: 600;
    color: @titleColor;
  }
</style>
