<!--
  开发者:马林
  页面:处方下的药品列表组件
  -------------------
  Created by webStorm
  User: tyx
  Date: 2019-3-29
  Time: 13:06:17
  Application: 处方下的药品列表组件
  State: component
  Prop:  type Array
         @param  {string}  ProductImg_       药品图片地址
         @param  {string}  ProductName_      药品名称
         @param  {int}     ProductCount_     药品数量
         @param  {string}  Remark_     药品提示语
 -->
<template>
  <div>
    <div
      v-for="(v, k) in value"
      :key="k"
      class="preList"
      :class="num > 0 ? (num - 1 > k ? 'pre-line' : '') : 'pre-line'"
      v-show="num === 0 || num > k"
    >
      <div class="pre-message p-display-row">
        <div class="pre-message-left">
          <img
            src="http://img.redocn.com/sheji/20170216/shuimianyaopinbaozhuangsheji_7871385_small.jpg"
            alt=""
          />
        </div>
        <div class="pre-message-right" :class="v.state ===1 ?'preListNoDrug':''">
          <div>
            <div>
              <span class="pre-span"
                >多种维生素咀嚼片（儿童型）-迪士尼漫威装（60片装）儿童用药</span
              >
            </div>
            <div><span class="pre-spanLit">规格：一天一瓶</span></div>
          </div>
          <div class="p-display-row">
            <span class="pre-span-3" :class="v.state ===1 ?'preListNoDrug':''">¥25.40</span>&nbsp;&nbsp;<span
              class="pre-span-2"
              >x5</span
            >
          </div>
        </div>
        <div v-if="v.state === 1" class="pre-message-noDrug">
          <img src="../../assets/img/noDrug.png" alt="" />
        </div>
      </div>
    </div>
    <div v-show="num !== 0" @click="$emit('changeNum',0)" class="pre-more pre-line">
      <div>查看更多</div>
      <div class="pre-icon">
        <van-icon name="arrow-down" color="#C5C5C5"></van-icon>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MessageList",
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    num: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.preList {
  color: @textBlack;
  .padding(5);
}
.preListNoDrug {
  color: @textAsh !important;
}
.pre-line {
  border-bottom: 0.2vw solid rgba(0, 0, 0, 0.1);
}
.pre-message {
  align-items: center;
  /*height: 14vw;*/
  .padding(10, 0, 10, 0);
  position: relative;
}

.pre-message-left {
  .width(92);
  .height(92);
  border-radius: 2vw;
  overflow: hidden;
}

.pre-message-left img {
  width: 100%;
  height: 100%;
  align-items: center;
}

.pre-message-right {
  width: 65%;
  .height(92);
  display: flex;
  margin-left: 5vw;
  flex-direction: column;
  justify-content: space-between;
}
.pre-message-noDrug {
  position: absolute;
  z-index: 33;
  background: rgba(0, 0, 0, 0.1);
  .width(92);
  .height(92);
  border-radius: 2vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    width: 100%;
    margin: auto;
  }
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

.pre-span-3 {
  color: red;
  .fontSize(16);
}

.pre-span-2 {
  .fontSize(14);
}

.pre-span {
  .fontSize(16);
  .lineHeight(24);
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
}
.pre-spanLit {
  .fontSize(12);
  font-weight: 400;
  .lineHeight(24);
  color: @textAsh;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
}
.pre-message-bottom {
  .fontSize(15);
}
.pre-more {
  font-weight: 400;
  .padding(15, 15, 15, 15);
  display: flex;
  justify-content: center;
}
</style>
