/*
 * @Author: 田东 
 * @Date: 2019-05-13 16:31:52 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-05-31 13:53:51
 * @name 常见问题解答
 */

<template>
  <div id="problemAnswer">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <div class="answer_content" v-html="answer"></div>

    <div class="divide">以上回答解决您的问题了吗</div>

    <div class="btn_group clearfix">
      <button
        class="btn btn_zan"
        :disabled="isDisabled"
        :class="{ active: select == 1 }"
        @click="btnClick(1)"
      >
        <i class="iconfont iconzan1"></i>
        已解决
      </button>
      <button
        class="btn btn_buzan"
        :disabled="isDisabled"
        :class="{ active: select == 2 }"
        @click="btnClick(2)"
      >
        <i class="iconfont iconzan4"></i>
        未解决
      </button>
    </div>
  </div>
</template>

<script>
import { serviceHost } from "@/utils/httpConfig.js";
import Header from "@/components/Header/Header";

import { Cell, Toast } from "vant";

export default {
  name: "problemAnswer",
  data() {
    return {
      // 组件数据
      title: "",
      // 本页数据
      id: "",
      answer: "",
      select: "", // 保存选中按钮 以控制高亮
      isDisabled: false // 是否禁用按钮
    };
  },
  components: { "v-header": Header },
  mounted: function() {
    this.id = this.$route.query.id;
    this.getQuestionAnswer();
  },
  methods: {
    getQuestionAnswer() {
      this.$http
        .request({
          method: "get",
          url: "/SQuestionController/selectByPrimaryKey", // 根据id获取对应问题及回答
          body: { id: this.id }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.title = data.data.questionname;
            this.title =
              this.title.length > 8
                ? this.title.substring(0, 8) + "..."
                : this.title;
            this.answer = data.data.answername;
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 点击按钮事件
    btnClick(index) {
      this.select = index;
      this.isDisabled = true;
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

#problemAnswer {
  background: @backgroundColorT;
  min-height: 100%;
  padding-bottom: 8vw;
  
  .answer_content {
    min-height: 48vw;
    .fontSize(15);
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    padding: 5.2vw 3.2vw;
    word-wrap: break-word;
  }

  .divide {
    .fontSize(12);
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    color: @titleColor;
    text-align: center;
    display: table;
    white-space: nowrap;
    padding: 0 3.2vw;

    &::before,
    &::after {
      content: "";
      display: table-cell;
      position: relative;
      top: 50%;
      width: 50%;
      background-repeat: no-repeat;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC);
    }

    &::before {
      background-position: right 1em top 50%;
    }

    &::after {
      background-position: left 1em top 50%;
    }
  }

  .btn_group {
    margin-top: 8vw;
    padding: 0 10.9vw;

    .btn {
      line-height: 10.9vw;
      width: 30.9vw;
      border-radius: 2.7vw;
      display: inline-block;
      .fontSize(12);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      align-items: center;
      display: flex;
      justify-content: center;
      background: @backgroundColorT;

      .iconfont {
        .fontSize(22);
        margin-right: 2.1vw;
      }
    }

    .btn_zan {
      float: left;
      color: @buzanColor;
      border: 1px solid @buzanBorderColor;
    }

    .btn_buzan {
      color: @buzanColor;
      float: right;
      border: 1px solid @buzanBorderColor;
    }

    .active {
      background: linear-gradient(to right, @btnLeftColor 0%, @mainColor 100%);
      color: @fontOne;
    }
  }
}
</style>
