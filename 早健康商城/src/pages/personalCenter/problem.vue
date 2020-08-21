/*
 * @Author: 田东 
 * @Date: 2019-05-13 16:31:35 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-05-29 13:30:43
 * @name 常见问题
 */

<template>
  <div id="problem">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <div
      class="content_block clearfix"
      v-for="(data, key) in list"
      :key="key"
    >
      <div class="left">
        <div>
          <img :src="data.questiontypeimg" alt>
          <p>{{data.questionname}}</p>
        </div>
        <div class="triangle"></div>
      </div>
      <div class="right">
        <p
          v-for="(question, key) in data.questionson"
          :key="key"
          @click="problemAnswer(question.id)"
        >{{question.questionname}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import { Toast } from "vant";

export default {
  name: "problem",
  data() {
    return {
      // 组件数据
      title: "常见问题",
      // 本页面数据
      list: []
    };
  },
  components: {
    "v-header": Header
  },
  mounted: function() {
    this.getQuestionList();
  },
  methods: {
    getQuestionList(){
      this.$http
        .request({
          method: "get",
          url: "/SQuestionController/selectQuestionS", // 获取问题列表
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.list = data.data
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    problemAnswer(id) {
      if (!this.scienceWX) {
        this.$router.push({ path: "./problemAnswer", query: {id: id}});
      } else {
        this.$routerWX.push({ path: "./problemAnswer", query: {id: id} });
      }
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
.clearfix::after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}

#problem {
  .content_block {
    display: flex;
    margin-top: 3.2vw;

    .left {
      margin-right: 1.1vw;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 21.2vw;
      background: @backgroundColorT;
      position: relative;

      img {
        width: 7.6vw;
        display: block;
        margin: 0 auto;
        margin-bottom: 1.8vw;
      }

      p {
        .fontSize(12);
        font-family: PingFang-SC-Regular;
        font-weight: bold;
        color: @titleColor;
        opacity: 0.9;
      }

      .triangle {
        position: absolute;
        width: 14px;
        height: 14px;
        right: 0;
        font-size: 0;
        line-height: 0;
        overflow: hidden;
        border-width: 7px;
        border-style: dashed solid dashed dashed;
        border-color: transparent #f2f2f2 transparent transparent;
      }
    }
    .right {
      width: 77.7vw;
      background: @backgroundColorT;

      p {
        line-height: 8.8vw;
        margin: 0 2.9vw;
        padding-left: 0.8vw;
        .fontSize(14);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @titleColor;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:not(:last-child) {
          border-bottom: 1px solid #f2f2f2;
        }
      }
    }
  }
}
</style>
