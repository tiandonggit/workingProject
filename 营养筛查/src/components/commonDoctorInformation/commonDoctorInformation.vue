<!--
  开发者:张松仁
  页面:医生信息展示组件
  -------------------
  Created by webStorm
  User: 张松仁
  Date: 2020-4-2
  Time: 15:38:13
  Application: 医生信息展示组件
  State: component
  Prop:  type Object
         @param  {Object}  doctorInfo    医生信息展示
 -->
<template>
  <div class="doctorInformation">
    <div class="content_top">
      <div class="tag_border"></div>
      <div>{{prestype==1?"诊断":"筛查"}}发起人</div>
    </div>

    <div class="list">
      <div class="list_box">
        <div class="list_box_l">
          <div class="left">姓名：</div>
          <div class="right illname">
            {{ doctorInfo.docName ? doctorInfo.docName : "" }}
          </div>
        </div>
        <div class="list_box_l">
          <div class="left">类型：</div>
          <div class="right illname">
            {{ doctorType == 1 ? "医生" : "用户" }}
          </div>
        </div>
      </div>
      <div class="list_box" v-show="doctorType == 1">
        <div class="list_box_l">
          <div class="left">科室：</div>
          <div class="right illname">
            {{ doctorInfo.depName ? doctorInfo.depName : "" }}
          </div>
        </div>
        <div class="list_box_l">
          <div class="left">职称：</div>
          <div class="right illname">
            {{ doctorInfo.titleName ? doctorInfo.titleName : "" }}
          </div>
        </div>
      </div>
      <div class="list_box" v-show="doctorType == 1">
        <div class="left">医院：</div>
        <div class="right">
          {{ doctorInfo.hosName ? doctorInfo.hosName : "无" }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "doctorInformation",
  data() {
    return {};
  },
  props: {
    doctorInfo: {
      type: Object,
      value: {}
    },
    doctorType: {
      type: Number,
      value: 1
    },
    prestype: {
      type: Number || String,
      value: 0
    }
  },
  created() {
    console.log(this.doctorInfo, "组件接值");
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.doctorInformation {
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
