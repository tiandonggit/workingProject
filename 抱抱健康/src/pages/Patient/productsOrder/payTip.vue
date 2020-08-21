<template>
  <div class="payTip_page">
    <common-header
        :share-disabled="true"
        :header-show="false"
        :custom-title="'营养方案'"></common-header>
    <div class="tip_box">
      <img src="../../../assets/images/successlog.png" alt="">
      <p>您的订单已提交!</p>
      <span class="pay_tip_message">
        我们将会第一时间为您邮寄请注意查收<br/>
        如有问题请联系客服: <a href="tel:4000909975">400-0909975</a>
      </span>
    </div>

    <div class="complete_btn_box" @click.stop="completeClick">
      <div class="complete_btn">
        完成
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "payTip",
    components: {
      commonHeader
    },
    data() {
      return {};
    },
    methods:{
      completeClick() {
        try {
          WeixinJSBridge.call("closeWindow");
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .payTip_page {
    .tip_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .padding(128, 12, 34, 12);

      img {
        display: block;
        .width(60);
        .height(60);
        .margin(0, 0, 25, 0);
      }

      p {
        .fontSize(18);
        text-align: center;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .margin(0, 0, 112, 0);
      }

      .pay_tip_message {
        display: inline-block;
        text-align:center;
        .fontSize(18);
        font-weight: bolder;
        color: rgba(51, 51, 51, 1);
        .lineHeight(22);

        a {
          color: rgba(0, 105, 255, 1);
          font-weight:bold;
        }
      }
    }


    .complete_btn_box {
      position: fixed;
      left: 0;
      right:0;
      bottom:0;
      z-index: 10;

      .complete_btn {
        .margin(0,12,34,12);
        .height(44);
        display:flex;
        justify-content: center;
        align-items: center;
        font-weight: bolder;
        color:@fontColorff;
        .fontSize(18);
        .borderRadius(10,10,10,10);
        background:linear-gradient(225deg,rgba(1,128,255,1) 0%,rgba(0,105,255,1) 100%);
      }
    }
  }
</style>
