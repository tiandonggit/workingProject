<template>
  <div class="header-div header-left" @click="headerBack">
    <i class="iconfont iconleft"></i>
  </div>
</template>
<script>
/**
 * Author：liushuo
 * Creatime: 2019/3/15
 */
import { Dialog } from "vant";
export default {
  name: "left",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    /**
     * 返回上一页
     */
    headerBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
      } else {
        // console.log(this.$route.name);
        var formPageName = this.$route.name;
        if (formPageName == "myOrder") {
          if (!this.scienceWX) {
            this.$router.push({ name: "personalCenter" });
          } else {
            this.$routerWX.push({ name: "personalCenter" });
          }
        } else if (
          formPageName == "paySuccess" ||
          formPageName == "submitOrder"
        ) {
          if (!this.scienceWX) {
            this.$router.push({ name: "shoppingCar" });
          } else {
            this.$routerWX.push({ name: "shoppingCar" });
          }
        } else if (this.$route.name === "forgetPwd") {
          window.localStorage.setItem("loginType", 2);
          if (!this.scienceWX) {
            this.$router.back({
              path: "./login"
            });
          } else {
            this.$routerWX.back({
              path: "./login"
            });
          }
        } else {
          this.$router.go(-1);
        }
      }

      // setTimeout(() => {
      //   const res = wx.getSystemInfoSync();
      //   if (typeof (res) == 'object') {
      //     try {
      //       alert('setTime');
      //       WeixinJSBridge.call('closeWindow');
      //     } catch (e) {
      //
      //     }
      //   }
      // },500)
    }
  },
  props: {}
};
</script>
<style></style>
