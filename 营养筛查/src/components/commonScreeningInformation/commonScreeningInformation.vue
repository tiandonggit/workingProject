<!--
  开发者:张松仁
  页面:筛查信息展示组件
  -------------------
  Created by webStorm
  User: 张松仁
  Date: 2020-4-2
  Time: 15:38:13
  Application: 筛查信息展示组件
  State: component
  Prop:  type Object
         @param  {Object}    objData    筛查信息展示信息
         @param  {Function}  tapHead    点击标题事件
 -->
<template>
  <div class="screeningInformation">
    <div class="content_top">
      <div class="tag_border"></div>
      <div>{{prestype==1?"诊断":"筛查"}}信息</div>
      <div @click="tapHead" class="tap_head">更多详情</div>
    </div>

    <div class="list">
      <div class="list_box" v-if="fenShow">
        <div class="left">营养风险评分：</div>
        <div class="right illname">
          {{
            objData.assessmentbranch
              ? objData.assessmentbranch + "分"
              : objData.subillness
              ? objData.subillness + "分"
              : "0分"
          }}
        </div>
      </div>

      <div v-if="objData.illname" class="list_box">
        <div class="left">疾病名称：</div>
        <div class="right illname">
          {{ objData.illname ? objData.illname : "无" }}
        </div>
      </div>

      <div class="list_box">
        <div class="left">身体质量指数(BMI)：</div>
        <div class="right illname">{{ objData.bmi ? objData.bmi : "无" }}</div>
      </div>
      <div v-if="objData.totalenergy" class="list_box">
        <div class="left">每日能量需求：</div>
        <div class="right illname">
          {{ objData.totalenergy ? objData.totalenergy+"kcal" : "无" }}
        </div>
      </div>
<!--      <div v-if="type != '' && type != undefined && objData.dtotalenergy" class="list_box">-->
<!--        <div class="left">营养替代能量：</div>-->
<!--        <div class="right illname">-->
<!--          {{ objData.dtotalenergy ? objData.dtotalenergy+"kcal" : "无" }}-->
<!--        </div>-->
<!--      </div>-->
      <div class="list_box">
        <div class="left">血清白蛋白值(g/L)：</div>
        <div class="right illname">
          {{ objData.serumalbumin == 0 || objData.serumalbumin == "" || objData.serumalbumin == "无" ? "无" : objData.serumalbumin }}
        </div>
      </div>
      <div v-if="objData.advice" class="list_box">
        <div class="left">供能比建议：</div>
        <div class="right illname">
          {{ objData.advice ? objData.advice : "无" }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "screeningInformation",
  data() {
    return {};
  },
  props: {
    objData: {
      type: Object,
      value: {}
    },
    fenShow: {
      type: Boolean,
      value: true
    },
    prestype: {
      type: Number || String,
      value: 0
    }
    // type: {
    //   type: String || Number,
    //   value: ""
    // }
  },
  created() {
    console.log(this.person_info, "组件接值");
  },
  mounted() {},
  methods: {
    /**
     * 点击标题事件
     */
    tapHead() {
      this.$emit("tapHead");
    }
  }
};
</script>
<style lang="less" scoped>
.screeningInformation {
  background: @backgroundColorff;
  border-radius: 10px;
  margin-bottom: 15px;

  .content_top {
    display: flex;
    align-items: center;
    padding: 0 10px;
    line-height: 47px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    div {
      font-weight: bold;
      font-size: 18px;
      color: @fontColor33;
    }
    .tag_border {
      width: 4px;
      height: 14px;
      background: linear-gradient(
        180deg,
        rgba(0, 105, 255, 1) 0%,
        rgba(1, 128, 255, 1) 100%
      );
      border-radius: 2px;
      margin-right: 10px;
    }
    .tap_head {
      flex: 1;
      text-align: right;
      font-size: 16px;
      font-weight: bold;
      color: @mainColor;
      text-decoration: underline;
    }
  }
  .list {
    font-size: 16px;
    line-height: 20px;
    padding: 2px 0;
    .list_box {
      line-height: 20px;
      padding: 11px 10px;
      display: flex;
      justify-content: space-between;
      &:last-child {
        border-bottom: 0px;
      }
      .list_box_l {
        width: 48%;
        display: flex;
      }
      .left {
        line-height: 20px;
        font-size: 16px;
        color: @fontColor33;
        font-weight: bold;
      }
      .right {
        line-height: 20px;
        flex: 1;
        /*white-space: nowrap;!*内容超宽后禁止换行显示*!*/
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /*文字超出部分以省略号显示*/
        word-break: break-all;
        font-size: 16px;
        color: @fontColor66;
      }
    }
  }
}
</style>
