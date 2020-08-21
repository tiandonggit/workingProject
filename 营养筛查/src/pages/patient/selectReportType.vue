/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: selectReportType *
@function: * @date: 2020/4/30 * @time: 15:33 * * */
<template>
  <div id="selectReportType">
    <!-- 标题 -->
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="false"
    ></commonHeader>
    <div class="main">
      <div class="list" @click="goNext(2)">
        <div class="left">
          <img src="../../assets/img/selectReportType2.png" alt="" />
        </div>
        <div class="center">
          <div class="top">
            输入营养推荐方案码
          </div>
          <div class="bottom">
            通过营养推荐为您生成的方案码
          </div>
        </div>
        <div class="right">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="list" @click="goNext(1)">
        <div class="left">
          <img src="../../assets/img/selectReportType1.png" alt="" />
        </div>
        <div class="center">
          <div class="top">
            输入营养筛查方案码
          </div>
          <div class="bottom">
            通过营养筛查为您生成的方案码
          </div>
        </div>
        <div class="right">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
export default {
  name: "selectReportType",
  components: { commonHeader },
  data() {
    return {
      customTitle: "方案领取",
      value: "",
      showKeyboard: false,
      errorInfo: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    goNext(type) {
      console.log(type);
      this.$router.push({ name: "getReport", query: { type: type } });
    }
  }
};
</script>

<style lang="less" scoped>
#selectReportType {
  .main {
    padding: 10px 12px 0;
    .list {
      padding: 12px 10px;
      background: @backgroundColorff;
      border-radius: 10px;
      margin-bottom: 15px;
      display: flex;
      .left {
        padding-right: 10px;
        display: flex;
        align-items: center;
        img {
          width: 48px;
        }
      }
      .center {
        flex: 1;
        .top {
          font-size: 16px;
          line-height: 22px;
          color: @fontColor33;
          font-weight: bold;
        }
        .bottom {
          padding-top: 9px;
          font-size: 16px;
          line-height: 22px;
          color: @fontColor66;
        }
      }
      .right {
        font-size: 26px;
        color: @fontColor66;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
