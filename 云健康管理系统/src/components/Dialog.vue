/*
 * @Author: 田东 
 * @Date: 2019-12-03 16:58:09 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-12-20 13:09:51
 */

<template>
  <el-dialog
    :modal="false"
    :visible.sync="isShow"
    :show-close="false"
    :before-close="beforeClose"
    top="140px"
    :class="{ isLeft: position === 'left', isRight: position === 'right' }"
  >
    <slot></slot>
    <div
      class="icon"
      v-if="position !== 'middle'"
      :class="{
        isLeftIcon: position === 'left',
        isRightIcon: position === 'right'
      }"
      @click="beforeClose()"
    >
      <img v-if="position === 'left'" src="../assets/images/left.png" alt="" />
      <img
        v-if="position === 'right'"
        src="../assets/images/right.png"
        alt=""
      />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    position: {
      type: String,
      default: "middle"
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    beforeClose() {
      this.$parent.beforeClose();
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .el-dialog {
  // height: 789px;
  background: url("../assets/images/dialog_border.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 1255px;
  height: 789px;
  margin-bottom: 0;
  margin-top: 140px !important;

  .icon {
    width: 36px;
    position: absolute;
    top: 342px;

    img {
      width: 100%;
    }
  }

  .isLeftIcon {
    right: -40px;
  }

  .isRightIcon {
    left: -40px;
  }

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 30px 35px;
    height: 100%;

    .slot {
      height: 100%;
    }
  }
}
.isLeft /deep/ .el-dialog {
  margin-left: 35px;
}

.isRight /deep/ .el-dialog {
  margin-left: 628px;
}
</style>
