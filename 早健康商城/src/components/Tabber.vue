<!--
  作者：刘硕
  时间：2019/5/9
-->
<template>
  <!--导航栏-->
  <van-tabbar v-model="active" active-color="#E98C2E" @change="tabchange">
    <van-tabbar-item>
      <span>首页</span>
      <span
        slot="icon"
        slot-scope="props"
        :class="props.active ? icon.home.active : icon.home.normal"
      ></span>
    </van-tabbar-item>
    <van-tabbar-item>
      <span>分类</span>
      <span
        slot="icon"
        slot-scope="props"
        :class="props.active ? icon.types.active : icon.types.normal"
      ></span>
    </van-tabbar-item>
    <van-tabbar-item v-if="getshopCardNum == 0">
      <span>购物车</span>
      <span
        slot="icon"
        slot-scope="props"
        :class="props.active ? icon.shopping.active : icon.shopping.normal"
      ></span>
    </van-tabbar-item>
    <van-tabbar-item v-else :info="getshopCardNum">
      <span>购物车</span>
      <span
        slot="icon"
        slot-scope="props"
        :class="props.active ? icon.shopping.active : icon.shopping.normal"
      ></span>
    </van-tabbar-item>
    <van-tabbar-item>
      <span>我的</span>
      <span
        slot="icon"
        slot-scope="props"
        :class="props.active ? icon.person.active : icon.person.normal"
      ></span>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "Tabber.vue",
  data() {
    return {
      //底部导航栏图标
      icon: {
        home: {
          normal: "iconfont iconshouye",
          active: "iconfont iconshouyetianchong"
        },
        types: {
          normal: "iconfont iconfenlei",
          active: "iconfont iconfenleitianchong"
        },
        shopping: {
          normal: "iconfont icongouwuche",
          active: "iconfont icongouwuchetianchong"
        },
        person: {
          normal: "iconfont icongerenzhongxin",
          active: "iconfont icongerenzhongxintianchong"
        }
      },
      //导航栏图标是否被选中
      active: 0
    };
  },
  computed:{
    getActive(){
      return this.$store.state.Home.trbbarActive;
    },
    //获取购物车数量
    getshopCardNum() {
      return this.$store.state.Home.shopCardNum;
    }
  },
  created(){
    this.active = this.getActive;
    // if (this.getshopCardNum) {
    //   this.shopCard = this.getshopCardNum;
    // } else {
    //   // this.shopCardNum();
    // }
  },
  methods: {
    //切换导航栏监听 e 下标
    tabchange(e) {
      switch (e) {
        case 0:
          this.active = e;
          this.$store.commit("Home/trbbarActive", e);
          this.$router.push({
            name: "MallHome"
          });
          break;
        case 1:
          this.active = e;
          this.$store.commit("Home/trbbarActive", e);
          this.$router.push({
            name: "category"
          });
          break;
        case 2:
          this.active = e;
          this.$store.commit("Home/trbbarActive", e);
          this.$router.push({
            name: "shoppingCar"
          });
          break;
        case 3:
          this.active = e;
          this.$store.commit("Home/trbbarActive", e);
          this.$router.push({
            name: "personalCenter"
          });
          break;
      }
    }
  }
};
</script>

<style scoped></style>
