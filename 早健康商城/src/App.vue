<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { Toast } from "vant";
import { Dialog } from "vant";

export default {
  name: "app",
  data() {
    return {};
  },
  mounted() {
    this.$createNETs();
  },
  methods: {}
};
</script>
<style lang="less">
html,
body {
  height: 100%;
  background: #f2f2f2;
}
html,
body,
#app {
  height: 100%; // 父元素必须要有高度
  width: 100%; // 如果已经是block元素，则可以忽略
  background-color: @backgroundColor;
}
p {
  // background-color: @yellowOne;
}
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.net {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
}
.net img {
  width: 100%;
  height: 100%;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.van-search__content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background-color: #f7f8fa;
  .borderRadius(10, 10, 10, 10);
  padding-left: 2.6vw;
}

.van-overlay {
  // background-color: rgba(0,0,0,0);
  height: 10000px;
}

.van-dialog {
  border-radius: 2.67vw;
  background: url("assets/images/E98C2E.png") -0.5px bottom no-repeat;
  background-size: 100% 50px;
}

.van-dialog__content,
.van-dialog__cancel {
  background: @fontOne;
}

.van-dialog__footer--buttons,
.van-dialog__header {
  background: @fontOne;
}
.van-dialog__confirm,
.van-dialog__confirm:active {
  background: @mainColor;
  color: @fontOne;
}

.van-tabbar-item {
  .iconfont {
    .fontSize(22);
  }
}

.van-info {
  top: -4px;
  background-color: @mainColor;
}

*::-webkit-scrollbar {
  display: none;
}

#addressList {
  .van-swipe-cell {
    &__left,
    &__right {
      background-color: @mainColor;
    }
  }
}

#myOrder {
  .van-tabs__wrap.van-hairline--top-bottom {
    position: fixed;
    top: 14vw;

    &::after {
      border-top: none;
    }
  }
  .van-tab {
    .van-ellipsis {
      .fontSize(12);
      color: @titleColor;
      font-family: PingFang-SC-Regular;
      font-weight: 400;
    }
  }
  .van-tab--active {
    .van-ellipsis {
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: bold;
      color: @titleColor0;
    }
  }
}

#Particular {
  .rich_media_content {
    img {
      display: block;
    }
  }
}

#shoppingCar {
  .header-right {
    width: 0;
  }

  .card_box {
    .van-checkbox__label {
      .fontSize(15);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @titleColor;
      background: none;
      margin-left: 10px;
      display: inline-block;
      width: 89%;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
