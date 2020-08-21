<template>
  <div class="unBound_page">
    <!-- <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader> -->

    <div class="common-header">
      <div class="header">
        <div class="header-div header-left">
          <i @click="onclose()" class="back-icon van-icon van-icon-arrow-left">
            <!---->
          </i>
        </div>
        <div class="header-div header-center">暂未绑定自提柜</div>
        <div class="header-right"></div>
      </div>
    </div>

    <div class="tipsImg_box">
      <img src="../../assets/img/unBound.png" alt />
      <p class="tips">
        您还未绑定智配柜 请绑定后再进行营养筛查
      </p>
    </div>
  </div>
</template>

<script>
// import wx from "weixin-js-sdk";
import commonHeader from "../../components/commonHeader/common_header";
export default {
  name: "unBound",
  data() {
    return {
      title: "暂未绑定自提柜",
      customTitle: "营养筛查"
    };
  },
  methods: {
    onclose() {
      //关闭当前页
      this.$wx.closeWindow();
    }
  },
  components: {
    commonHeader
  }
};
</script>

<style scoped lang="less">
.unBound_page {
  .tipsImg_box {
    padding-top: 100px;
    align-items: center;
    position: fixed;
    width: 312px;
    left: 0;
    right: 0;
    top: 48px;
    bottom: 0;
    margin: auto;
    text-align: center;
    img {
      display: block;
      width: 209px;
      height: 204px;
      margin: 0 auto;
    }

    .tips {
      font-size: 16px;
      font-weight: 400;
      color: @fontColor99;
      line-height: 20px;
      text-align: center;
      margin-top: 75px;
      // span{
      //    color: @mainColor;
      // }
    }
  }
}

.common-header {
  position: fixed;
  z-index: 999999;
  width: 100%;
}
.header-bottom {
  width: 100%;
  .height(44);
}

.header {
  width: 100%;
  .height(44);
  padding: 0 3%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  color: @titleColor;
  background-color: @backcolor !important;
}

.header-div {
  width: auto;
  .fontSize(20);
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

.header-left {
  width: 18%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-weight: bold;
  text-align: left;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  .fontSize(18);
  width: 0;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

.header-right {
  width: 18%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
