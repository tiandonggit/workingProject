/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: selectPhone *
@function: 选择是不是智能机用户 * @date: 2020/4/15 * @time: 16:50 * * */
<template>
  <div id="selectPhone">
    <commonHeader
      :left="true"
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="false"
      :title="title"
    ></commonHeader>
    <div class="main">
      <van-button type="default" @click="goNext(1)">正常手机用户</van-button>
      <van-button type="default" @click="goNext(0)">无手机、智能机用户</van-button>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
export default {
  name: "selectPhone",
  data() {
    return {
      title: "",
      customTitle: "患者类型"
    };
  },
  components: {
    commonHeader
  },
  created() {},
  mounted() {},
  methods: {
    goNext(val) {
      console.log(val);
      //val 如果是1有智能机 如果是0没有智能机
      this.$store.commit("Doctor/prescriptionsourcetype", val);
      this.$router.push({ path: "/selectDoctor"})
    }
  }
};
</script>

<style lang="less" scoped>
#selectPhone {
  .main {
    padding: 15px 12px 0;
    button {
      width: 100%;
      color: @fontColorff;
      font-size: 16px;
      line-height: 46px;
      height: 46px;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
