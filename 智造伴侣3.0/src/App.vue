<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    mounted() {
      let vm = this;
      window.addEventListener("beforeunload", vm.$returnValue, false);
      document.oncontextmenu = function () {
        return false;
      };
    }
  };
</script>

<style scoped lang="less">
  #app {
    height: 100%;
  }
</style>
