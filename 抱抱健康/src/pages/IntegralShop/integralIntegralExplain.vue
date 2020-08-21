/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name:
integralIntegralExplain * @function: 积分说明页 * @date: 2020/1/3 * @time: 9:40
* * */
<template>
  <div id="integralIntegralExplain">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="'true'"
    ></common-header>

    <div class="main">
      <div class="main_box">
        <div class="content" v-if="type == 0">
          <div class="content_title">
            1. 健康币获取方式
          </div>
          <div class="content_text">
            a) 完善个人信息，奖励200健康币（一次性任务）。
          </div>
          <div class="content_text">
            b) 每日阅读文章，奖励10健康币（每日限定一次）点击文章视为阅读查看。
          </div>
          <div class="content_text">
            c) 完成每日任务推送，每条任务奖励5健康币。
          </div>
          <div class="content_text">
            d) 每日知识学习一次，奖励10健康币（每日限定一次）点击文章视为阅读查看。
          </div>
          <div class="content_text">
            e) 购买产品，每笔订单支付成功后奖励200健康币。
          </div>
          <div class="content_title">
            2. 健康币查询
          </div>
          <div class="content_text">
            可在-抱抱健康公众号首页-礼品商城板块查询健康币余额，获取健康币明细及兑换记录。
          </div>
          <div class="content_title">
            3. 健康币使用
          </div>
          <div class="content_text">
            a) 只能用于兑换健康币商城中的商品。
          </div>
          <div class="content_text">
            b) 健康币不可兑现、不可转让,仅可在抱抱健康-健康币商城使用。
          </div>
        </div>
        <div class="content" v-else>
          <div class="content_title">
            1. 智币获取方式
          </div>
          <div class="content_text">
            a) 完善个人信息，奖励100智币（一次性任务）。
          </div>
          <div class="content_text">
            b) 患者完成产品购买，每笔订单奖励200智币。
          </div>
          <div class="content_text">
            c) 患者完成每日推送任务，每条任务奖励5智币。
          </div>
          <div class="content_text">
            d) 完成患教文章阅读，奖励15智币。（每日限定一次）。
          </div>
          <div class="content_text">
            e) 对患者完成营养筛查，奖励10智币。（每个患者每日一次）。
          </div>
          <div class="content_title">
            2. 智币查询
          </div>
          <div class="content_text">
            可在-抱抱健康公众号首页-智币商城板块查询智币余额，获取智币明细及兑换记录。
          </div>
          <div class="content_title">
            3. 智币使用
          </div>
          <div class="content_text">
            a) 只能用于兑换智币商城中的商品。
          </div>
          <div class="content_text">
            b) 智币不可兑现、不可转让,仅可在抱抱健康-智币商城使用。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "integralIntegralExplain",
  components: {
    commonHeader
  },
  data() {
    return {
      title: "健康币说明",
      customTitle: "礼品商城",
      type: 0 //0患者1医生
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.title = this.type == 0 ? "健康币说明" : "智币说明";
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}

#integralIntegralExplain {
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  background: @backgroundColor;

  .main {
    position: absolute;
    top: 59/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    left: 12/375 * 100vw;
    right: 12/375 * 100vw;

    .main_box {
      -webkit-overflow-scrolling: touch;
      background: @backgroundColorT;
      border-radius: 10px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 20/375 * 100vw;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none !important;
        width: 0px;
        height: 0px;
      }

      .content {
        .padding(8, 10, 33, 10);
        .fontSize(16);
        .lineHeight(30);
        color: @subtitleColor;

        .content_title {
          font-weight: bold;
          color: @titleColor;
        }
      }
    }
  }
}
</style>
