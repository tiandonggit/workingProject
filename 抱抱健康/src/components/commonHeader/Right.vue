<template>
  <div class="header-div header-right">
    <div @click="collapse()" :class="[righticon.classNames, 'header-div']">
      <van-icon :name="ricon" />
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
      default: "iconanjianfengexian",
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
      this.$emit("rightIconClick");
    }
  }
};
</script>
<style lang="less" scoped>
.left {
  float: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.header-div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  i {
    .fontSize(20);
  }
}
</style>
