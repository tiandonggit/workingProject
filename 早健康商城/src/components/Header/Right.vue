<template>
  <div class="header-div header-right">
    <div @click="collapse()" :class="[righticon.classNames, 'header-div']">
      <i :class="['iconfont', ricon]"></i>
    </div>
  </div>
</template>
<script>
/**
 * Author：liushuo
 * Creatime: 2019/3/15
 */
export default {
  name: "right",
  data() {
    return {
      righticon: {
        isActive: false,
        classNames: "right-icon"
      }
    };
  },
  props: {
    ricon: {
      default: "iconmore",
      type: String
    }
  },
  methods: {
    /**
     * 折叠区域
     * show 打开
     * close 关闭
     * 默认切换
     */
    collapse(state) {
      switch (state) {
        case "show":
          this.righticon = { isActive: false, classNames: "right-icon-close" };
          break;
        case "close":
          this.righticon = { isActive: true, classNames: "right-icon-active" };
          break;
        default:
          this.righticon.isActive
            ? (this.righticon = {
                isActive: false,
                classNames: "right-icon-close"
              })
            : (this.righticon = {
                isActive: true,
                classNames: "right-icon-active"
              });
      }
    }
  }
};
</script>
<style type="less" scoped>
/**
    图标开启
   */
.right-icon-active {
  transition: transform 100ms linear 0s;
  -webkit-transition: transform 100ms linear 0s;
  -ms-transition: transform 100ms linear 0s;
  -moz-transition: transform 100ms linear 0s;
  -o-transition: transform 100ms linear 0s;

  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -o-transform: rotate(90deg);

  /*transform-origin:100% 100%;*/
  /*-ms-transform-origin:100% 100%;*/
  /*-moz-transform-origin:100% 100%;*/
  /*-webkit-transform-origin:100% 100%;*/
  /*-o-transform-origin:100% 100%;*/
}
/**
    图标关闭
   */
.right-icon-close {
  transition: transform 100ms linear 0s;
  -webkit-transition: transform 100ms linear 0s;
  -ms-transition: transform 100ms linear 0s;
  -moz-transition: transform 100ms linear 0s;
  -o-transition: transform 100ms linear 0s;

  transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -o-transform: rotate(0deg);

  /*transform-origin:100% 100%;*/
  /*-ms-transform-origin:100% 100%;*/
  /*-moz-transform-origin:100% 100%;*/
  /*-webkit-transform-origin:100% 100%;*/
  /*-o-transform-origin:100% 100%;*/
}
.left {
  float: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
