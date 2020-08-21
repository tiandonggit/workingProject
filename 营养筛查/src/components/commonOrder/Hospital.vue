<!--
  开发者:马林
  页面:药店展示组件
  -------------------
  Created by webStorm
  User: tyx
  Date: 2019-3-28
  Time: 13:26:03
  Application: 药店展示组件
  State: component
  Prop:  type Object
         @param  {int}     state    0:展示信息;1不展示(默认)
         @param  {string}  name     药店名称
         @param  {string}  phone    手机号
         @param  {string}  address  地址
 -->
<template>
  <div v-if="value.state != 1" class="main">
    <div class="main-bottom">
      <div class="main-title">
        <div class="main-text">
          {{ value.name }}
        </div>
        <div>
          <van-icon
            v-if="value.type === 'shop'"
            color="#C5C5C5"
            name="arrow"
          ></van-icon>
        </div>
      </div>
      <div class="pre-message p-display-row">
        <div class="pre-message-left">
          <img :src="value.img" alt="" />
        </div>
        <div class="pre-message-right">
          <div>
            <div class="pre-span">电话：{{ value.phone }}</div>
          </div>
          <div>
            <div class="pre-span">地址：{{ value.address }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrescriptionPharmacy",
  props: {
    value: {
      type: Object,
      default: function() {
        return { state: 1 };
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

.main {
}

.main-bottom {
  border-radius: 3vw;
  overflow: hidden;
  /*border: 0.2vw solid red;*/
  background: #fff;
}
.main-title {
  width: 100%;
  display: flex;
  color: @textBlack;
  .lineHeight(18);
  justify-content: space-between;
  .main-text {
    width: 90%;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .fontSize(14);
  }
}
.pre-message {
  align-items: center;
  /*height: 14vw;*/
  /*border-bottom: 1px solid @backgroundColor;*/
  .padding(10);
}

.pre-message-left {
  .width(78);
  .height(78);
  border-radius: 2vw;
  overflow: hidden;
}

.pre-message-left img {
  width: 100%;
  height: 100%;
  align-items: center;
}

.pre-message-right {
  width: 62%;
  .height(78);
  /*display: flex;*/
  margin-left: 5vw;
  /*flex-direction: column;*/
  /*justify-content: space-between;*/
}

.p-display-column {
  display: flex;
  flex-direction: column;
}

.p-display-row {
  display: flex;
  flex-direction: row;
}

.pre-span-line {
  justify-content: space-between;
}

.pre-span-4 {
  display: block;
  text-align: left;
  .fontSize(12);
  margin: 2% 0;
}

.pre-span-2 {
  .fontSize(14);
}

.pre-span {
  .fontSize(14);
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  color: @textAsh;
  .padding(0, 0, 10, 0);
  .lineHeight(22);
}

.pre-message-bottom {
  color: #666;
  .fontSize(15);
}
</style>
