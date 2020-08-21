<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
* {
  box-sizing: border-box;
}
#app {
  height: 100%;
}

// 页面块统一样式
.card-box {
  background: @bgColorF;
  border-radius: 10px;
  margin: 0 12px 12px;
  padding: 12px 12px 0;

  .good-number {
    font-size: 14px;
    font-family: PingFangSC;
    font-weight: 400;
    color: @titleColor;
    line-height: 20px;
    margin-bottom: 12px;
  }

  .good-info {
    padding: 12px 0;
    position: relative;
    height: 102px;

    &::after,
    &::before {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 0;
      left: 0;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    &::after {
      bottom: 0;
    }

    &::before {
      top: 0;
    }

    .img {
      width: 78px;
      height: 78px;
      float: left;
      border-radius: 10px;
      overflow: hidden;

      img {
        width: 100%;
      }
    }
    .info {
      width: 237px;
      height: 78px;
      float: right;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-size: 14px;
        font-family: PingFang-SC;
        font-weight: bold;
        color: @titleColor;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .specification {
        font-size: 12px;
        font-family: PingFangSC;
        font-weight: 400;
        color: @titleColor;
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .good-count {
    height: 44px;
    padding: 6px 0;

    .left,
    .right {
      float: left;
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: @titleColor;
      line-height: 32px;
    }

    .right {
      float: right;

      input {
        width: 67px;
        height: 31px;
        background: @bgColorF2;
        border-radius: 16px;
        text-align: center;
        border: none;
        margin: 0 6px 0 3px;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        line-height: 20px;
        padding: 0 10px;
      }
    }

    .good-color {
      color: @mainColor;
    }
  }

  .good-detail {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    font-family: PingFangSC;
    font-weight: 400;
    color: @titleColor;
    border-top: 1px solid @borderColor;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .good-color {
    color: @mainColor;
  }
}
// 按钮统一样式
.btn-box {
  left: 0;
  right: 0;
  bottom: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: fixed;
  background-color: @bgColorF;
  height: 68px;
  padding: 12px;
}
.btn {
  background: linear-gradient(270deg, @btnRightColor 0%, @btnLeftColor 100%);
  border-radius: 22px;
  height: 44px;
  line-height: 42px;

  span {
    font-size: 16px;
    font-family: PingFangSC;
    font-weight: 400;
    color: @FFFColor;
    line-height: 22px;
  }
}
// popup统一样式
.popups {
  width: 330px;
  height: 100%;
  padding: 20px 12px;

  .popup-title {
    font-size: 16px;
    font-family: PingFang-SC;
    font-weight: bold;
    color: @titleColor;
    line-height: 22px;
    margin-bottom: 12px;
  }

  .cell {
    height: 30px;
    line-height: 28px;
    padding: 0 12px;
    margin: 0 12px 12px 0;
    float: left;
    background: @bgColorF2;
    border: 1px solid @bgColorF2;
    border-radius: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    font-size: 14px;
    font-family: PingFangSC;
    font-weight: 400;
    color: @titleColor;
  }

  .active {
    background: @selectColor;
    border-radius: 16px;
    border: 1px solid @mainColor;
  }

  .btn-box {
    border-top: 1px solid @borderColor;
  }
}
</style>
