<!--
  开发者:马林
  页面:处方签详情组件
  -------------------
  Created by webStorm
  User: tyx
  Date: 2019-3-28
  Time: 09:36:55
  Application: 处方签详情组件
  State: component
 -->
<template>
  <div class="main">
    <div class="main-head">{{ value.patiName }}营养方案</div>
    <div class="main-body">
      <div class="tag_n" v-if="value.preSaleCode">
        营养方案码:<span class="z">{{ value.preSaleCode }}</span>
      </div>
      <div class="tag_n">
        方案编号:<span class="z">{{ value.patiCode }}</span>
      </div>
      <div class="tag_n">
        科别:<span class="z">{{ value.depName }}</span>
      </div>
      <div class="tag_n">
        姓名:<span class="z">{{ value.patiName }}</span>
      </div>
      <div class="tag_n">
        性别:<span class="z" v-if="value.patiSex">{{
          value.patiSex == 1 ? "男" : "女"
        }}</span>
      </div>
      <div class="tag_n">
        年龄:<span class="z">{{ value.patiAge }}岁</span>
      </div>
      <div class="tag_n">
        电话:<span class="z">{{ value.patiPhone }}</span>
      </div>
      <div class="tag_n">
        既往疾病史:<span class="z">{{
          value.pastHistory ? value.pastHistory : "无"
        }}</span>
      </div>
      <div class="tag_n">
        药物过敏史:<span class="z">{{
          value.allergyHistory ? value.allergyHistory : "无"
        }}</span>
      </div>
      <div class="tag_n">
        日期:<span class="z">{{ value.createTime }}</span>
      </div>
    </div>
    <div class="main-drugs">
      <div v-if="list.length > 0" class="main-drugs-head">
        使用方法 <span v-if="state == '0'" @click="supplement()">补充</span>
      </div>
      <div v-for="(item, index) in list" :key="index" class="main-drugs-body">
        <div class="main-drugs-body-name">
          {{ index + 1 }}.{{ item.productName
          }}<span class="r">{{ item.quantity }}盒</span>
        </div>
        <div class="main-drugs-body-sig">
          Sig:<span class="z"
            >每日{{ item.dailydose }}袋，{{ item.timesday }}，共{{
              item.takingtime
            }}天</span
          >
        </div>
      </div>
      <!--<div class="main-drugs-body">-->
      <!--<div class="main-drugs-body-name">-->
      <!--1.蛋白粉<span class="r">3盒</span>-->
      <!--</div>-->
      <!--<div class="main-drugs-body-sig">-->
      <!--Sig:<span class="z">口服1日一次，每次2g，共三天。</span>-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <div class="main-end">
      <div class="supplement"  >
        补充：{{ value.supplement == "" ? "无" : value.supplement }}
      </div>
      <div>
        使用详情请遵医嘱
      </div>
    </div>
    <div class="main-doc">
      <div>医师：{{ value.doctorName }}</div>
      <div>
        营养师审核：
        <span class="red" v-if="state == '5' || state == '6'">未通过</span>
        <span class="green" v-else-if="state == '3' || state == '4'"
          >已通过</span
        >
        <span v-else></span>
      </div>
    </div>
    <div class="main-append" v-if="state == '5'">
      <div class="main-line"></div>
      未通过原因：{{ value.lastVerifyAdvice }}
    </div>
    <van-dialog v-model="show" title="使用方法补充" show-cancel-button @confirm="confirm">
      <van-field
        v-model="str"
        rows="3"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入补充内容"
        show-word-limit
      />
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "PrescriptionNote",
  props: {
    value: {
      type: Object,
      default: function() {
        return { state: 1 };
      }
    },
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    state: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      title: "***",
      show: false,
      str: ""
    };
  },
  methods: {
    supplement() {
      this.show = true;
    },
    confirm() {
      //判断str
      this.$emit("confirm",this.str);
    }
  }
};
</script>

<style lang="less" scoped>
@media screen and (min-width: 1px) and (max-width: 500px) {
  .main {
    width: 93.5vw;
    background: @fontColorff;
    margin: 40px auto;
    border-radius: 2.7vw;
    /*   margin-top: (10/375) * 100vw;*/
    margin-bottom: (20/375) * 100vw;
    position: relative;
    .padding(0, 10, 20, 10);
    .main-end {
      color: @fontColor33;
      .fontSize(16);
      .margin(15, 0, 0, 0);
      .supplement {
        color: @fontColor66;
        .padding(0,0,10,0);
        .lineHeight(22);
        word-wrap: break-word;
        word-break: break-all;
      }
    }
    .main-doc {
      color: @fontColor33;
      .fontSize(16);
      .margin(20, 0, 0, 0);
      width: 100%;
      height: 16px;
      position: relative;
      div {
        float: left;
        width: 50%;
      }
      .red {
        color: @fontColorFF3;
      }
      .green {
        color: @fontColor00C;
      }
    }
    .main-header {
      text-align: center;
      .fontSize(18);
      font-weight: 400;
      padding: 3.8vw 4vw 5vw 4vw;
    }
    .main-body {
      .fontSize(16);
      color: @fontColor66;
      .tag_n {
        .fontSize(16);
        .minheight(36);
        .lineHeight(36);
        display: flex;
        white-space: nowrap;
        /*justify-content: space-between;*/
        .z {
          width: 70%;
          color: @fontColor33;
          .margin(0, 0, 0, 10);
        }
      }
    }
    .main-drugs {
      /*border: 1px solid red;*/
      .margin(20, 0, 0, 0);
      .main-drugs-head {
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          color: @mainColor;
          font-size: 16px;
          text-decoration: underline;
        }
      }
      .main-drugs-body {
        .margin(20, 0, 0, 0);
        .main-drugs-body-name {
          color: @fontColor33;
          .fontSize(16);
          .r {
            float: right;
          }
        }
        .main-drugs-body-sig {
          .margin(10, 0, 0, 0);
          color: @fontColor66;
          .fontSize(16);
          .lineHeight(20);
          text-align: justify;
          .z {
            .margin(0, 0, 0, 10);
          }
        }
      }
    }
    .main-append {
      clear: both;
      font-size: 16px;
      font-weight: 400;
      color: @fontColor33;
      line-height: 22px;
      .main-line {
        width: 100%;
        margin-top: 14px;
        margin-bottom: 14px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
      }
    }
    .main-head {
      font-size: 16px;
      font-weight: 400;
      color: @fontColor33;
      height: 46px;
      line-height: 46px;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
    }
  }
  /deep/.van-dialog {
    .van-dialog__header {
      padding-top: 13px;
    }
    .van-cell__value--alone {
      border: 1px solid @fontColor66;
      padding: 5px 10px;
      border-radius: 4px;
    }

  }
}
</style>
