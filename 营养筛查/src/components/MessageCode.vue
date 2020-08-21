<template>
  <div class="dialog">
    <div class="dialog-cover back" @click="closeMyself" v-if="isShow"></div>
    <transition name="drop">
      <div
        class="dialog-content"
        :style="{
          fontsize: fonts + 'vw',
          top: topDistance + '%',
          width: widNum + '%',
          left: leftSite + '%',
          height: 'auto'
        }"
        v-if="isShow"
      >
        <div class="dialog_head back">
          <slot name="header">提示信息</slot>
        </div>
        <div class="dialog_main" :style="{ paddingTop: pdt + 'vw' }">
          <slot name="main"> </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
      required: true //必须
    },
    fonts: {
      type: Number,
      default: 77.5
    },
    widNum: {
      type: Number,
      default: 72
    },
    heiNum: {
      type: Number,
      default: 50
    },
    leftSite: {
      type: Number,
      default: 13.86666
    },
    topDistance: {
      type: Number,
      default: 32
    },
    pdt: {
      type: Number,
      default: 0
    },
    pdb: {
      type: Number,
      default: 0
    }
  },
  name: "MessageCode",
  methods: {
    closeMyself() {
      this.$emit("on-close");
    }
  }
};
</script>

<style lang="less" scoped>
.dialog_main {
  width: 100%;
  margin: 0 auto;
}
.dialog_head {
  margin-top: 10.1vw;
  font-weight: 500;
  margin-bottom: 10.1vw;
}
.dialog {
  position: relative;
  color: #333;
  .fontSize(16);
}
.dialog-cover {
  background: rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 1000001;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialog-content {
  border-radius: 1vw;
  background-color: #fff;
  position: fixed;
  /*display: none !important;*/
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  align-items: center;
  z-index: 1000001;
  border-radius: 10px;
}
</style>
