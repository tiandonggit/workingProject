/*
 * @Author: 田东 
 * @Date: 2019-05-15 13:51:57 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-10 15:38:19
 * @name 使用协议
 */

<template>
  <div id="agreementDetails">
    <!-- 头部 -->
    <v-header :title="data.sagreementname"></v-header>
    <!-- 内容区 -->
    <div class="content_block">
      <p class="agreement_title">{{data.sagreementname}}</p>
      <div class="agreement_details" v-html="data.sagreementcontent"></div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

export default {
  name: "agreementDetails",
  data() {
    return {
      // 组件数据
      title: "",
      // 本页数据
      data: {}
    };
  },
  components: {
    "v-header": Header
  },
  mounted: function() {
    let id = this.$route.query.id;
    this.getDate(id);
  },
  methods: {
    getDate(id) {
      this.$http
        .request({
          method: "get",
          url: "/SAgreementController/selectByPrimaryKey", // 获取协议详情
          body: { id: id }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.data = data.data;
          } else {
            // 其他
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}

#agreementDetails {
  height: 100%;
  background: @backgroundColorT;

  .content_block {
    padding: 0 3.3vw;

    .agreement_title {
      margin: 5.1vw 0 9.1vw;
      .fontSize(15);
      line-height: 4vw;
      text-align: center;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: @titleColor;
    }

    .agreement_details {
      .fontSize(14);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: @titleColor;
      line-height: 5.6vw;
      word-wrap: break-word;
    }
  }
}
</style>
