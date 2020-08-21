<!--
  开发者:张松仁
  页面:患者信息展示组件
  -------------------
  Created by webStorm
  User: 张松仁
  Date: 2020-4-2
  Time: 15:38:13
  Application: 患者信息展示组件
  State: component
  Prop:  type Object
         @param  {Object}  person_info    患者展示信息
 -->
<template>
  <div class="patientInformation">
    <div class="content_top">
      <div class="tag_border"></div>
      <div>患者信息</div>
    </div>

    <div class="list">
      <div class="list_box">
        <div class="list_box_l">
          <div class="left">姓名：</div>
          <div class="right illname">
            {{ person_info.name ? person_info.name : "" }}
          </div>
        </div>
        <div class="list_box_l">
          <div class="left">电话：</div>
          <div class="right illname">
            {{ person_info.nphone ? person_info.nphone : "" }}
          </div>
        </div>
      </div>

      <div class="list_box">
        <div class="list_box_l">
          <div class="left">年龄：</div>
          <div class="right illname">
            {{ person_info.age ? person_info.age : "" }}岁
          </div>
        </div>
        <div class="list_box_l">
          <div class="left">性别：</div>
          <div class="right illname">
            {{ person_info.sex ? (person_info.sex == 1 ? "男" : "女") : "" }}
          </div>
        </div>
      </div>

      <div class="list_box">
        <div class="list_box_l">
          <div class="left">身高：</div>
          <div class="right illname">
            {{
              person_info.height ? Math.round(person_info.height * 100) : "0"
            }}cm
          </div>
        </div>
        <div class="list_box_l">
          <div class="left">体重：</div>
          <div class="right illname">
            {{ person_info.weight ? person_info.weight : "" }}kg
          </div>
        </div>
      </div>
      <div class="list_box">
        <div class="left">既往疾病史：</div>
        <div class="right">
          {{ person_info.pasthistory ? person_info.pasthistory : "无" }}
        </div>
      </div>
      <div class="list_box">
        <div class="left">既往过敏史：</div>
        <div class="right">
          {{ person_info.allergyhistory ? person_info.allergyhistory : "无" }}
        </div>
      </div>
      <div class="list_box">
        <div class="left">{{prestype==1?"诊断":"筛查"}}时间：</div>
        <div class="right">
          {{ person_info.createtime ? person_info.createtime : "" }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "patientInformation",
  data() {
    return {};
  },
  props: {
    person_info: {
      type: Object,
      value: {}
    },
    prestype: {
      type: Number || String,
      value: 0
    }
  },
  created() {
    console.log(this.person_info, "组件接值");
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.patientInformation {
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
  }
  .list {
    font-size: 16px;
    line-height: 20px;
    color: @fontColor33;
    .list_box {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      line-height: 24px;
      padding: 10px 10px;
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
        font-weight: bold;
      }
      .right {
        flex: 1;
        /*white-space: nowrap;!*内容超宽后禁止换行显示*!*/
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /*文字超出部分以省略号显示*/
        word-break: break-all;
      }
    }
  }
  .tab {
    display: flex;
    padding: 20px 10px;
    color: @fontColor33;
    border-bottom: 1px dashed #f1f1f1;
    font-size: 14px;
    &:last-child {
      border-bottom: 0;
    }
    .top {
      font-weight: bold;
      height: 30px;
      line-height: 20px;
      padding: 0 0 10px 15px;
    }
    .bot {
      font-weight: bold;
      line-height: 25px;
      height: 25px;
      padding-left: 10px;
      input {
        text-align: center;
        width: 45px;
        height: 23px;
        font-weight: 400;
        padding: 0px;
      }
      display: flex;
      .van-cell {
        padding: 0;
        width: 45px;
        border: 1px solid @boederColorF1;
        /deep/ input {
          text-align: center;
        }
      }
      .last {
        border: 0;
      }
    }
  }
}
</style>
