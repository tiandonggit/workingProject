<template>
  <div id="app">
    <router-view />
    <div class="has-bottombar"></div>
  </div>
</template>

<style lang="less">
#app {
  height: 100%;
}
* {
  box-sizing: border-box;
}
body {
  background: @backcolor;
}
.van-radio,
.van-checkbox {
  margin-top: 10px;
  height: 25px;
}

.van-radio__label,
.van-checkbox__label {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: @fontColor66;
  line-height: 14px;
}
// .van-icon-success:before {
//   // content: " ";
// }
.van-checkbox__icon,
.van-radio__icon {
  display: flex;
  align-items: center;
}
.van-checkbox__icon--round .van-icon,
.van-radio__icon--round .van-icon {
  width: 12px;
  height: 12px;
}
.van-checkbox__icon--checked .van-icon,
.van-radio__icon--checked .van-icon {
  width: 12px;
  height: 12px;
  border-color: @mainColor;
  background-color: @mainColor;
}
.van-button {
  border-radius: 10px;
  background: linear-gradient(52deg, @startColor 0%, @endColor 100%) !important;
  border: 1px solid @mainColor;
}
.van-dialog .van-button {
  border-radius: 0;
}
.van-dialog__cancel {
  background: @backgroundColorff !important;
}
.van-dialog__confirm {
  color: @fontColorff;
}
.van-button--warning{
  border: 1px solid @mainColor;
}
</style>
