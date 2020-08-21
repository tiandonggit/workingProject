<template>
  <div>
    <div class="header" :style="[headerClass]">
      <!--左侧区域-->
      <h-left v-if="left"></h-left>
      <div class="header-div header-left" v-else></div>
      <!--文字区域-->
      <div class="header-div header-center" :style="[headerCenterClass]">
        {{ title }}
      </div>
      <!--右侧区域-->
      <h-right v-if="right" class="header-right" :ricon="ricon"></h-right>
      <div class=" header-left" v-else></div>
    </div>
    <div class="header-bottom"></div>
  </div>
</template>
<script>
/**
 * Author：liushuo
 * Creatime: 2019/3/15
 */
import Right from "@/components/Header/Right";
import Left from "@/components/Header/Left";
export default {
  name: "v-header",
  data() {
    return {};
  },
  components: {
    "h-right": Right,
    "h-left": Left
  },
  created() {
    document.title = this.title;
  },
  mounted() {},
  methods: {},
  props: {
    title: {
      default: "标题", // 中间区域文字显示
      type: String
    },
    left: {
      default: true, //左侧图标是否显示 true 显示
      type: Boolean
    },
    right: {
      default: true, //右侧图标是否显示 true 显示
      type: Boolean
    },
    ricon: {
      default: "iconmore", //右侧的图标样式
      type: String
    },
    headerClass: {
      default: function() {
        return {
          backgroundColor: '#ffffff',
        };
      }, //头部组件的自定义属性
      type: Object
    },
    headerCenterClass: {
      default: function() {
        return {
          // color: 'red'
        };
      }, //头部组件的标题文字自定义属性
      type: Object
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";
.header-bottom {
  width: 100%;
  height: 14vw;
}
.header {
  width: 94%;
  height: 14vw;
  padding: 0 3%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  text-align: center;
  color: @titleColor;
}
.header-div {
  width: auto;
}
.header-left {
  float: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-weight: bold;
  text-align: left;
}
.header-center {
  font-weight: bold;
  white-space: nowrap;
}
.header-right {
  width: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
