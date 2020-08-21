/*
 * @Author: 田东 
 * @Date: 2020-06-12 13:38:30 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-07 20:31:52
 * @name 设置名称弹窗组件
 */

<template>
  <el-dialog
    :title="dialogTtitle"
    class="inputDialog_page"
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="true"
    center
    :before-close="handleClose"
  >
    <div class="input-box">
      <input v-model="newName" maxlength="10" type="text" :placeholder="tialogPlaceholder" />
    </div>
    <span slot="footer" class="dialog-footer">
      <button class="sure_btn option_btn" @click="submitHandle">确 定</button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "inputDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    dialogTtitle: {
      type: String,
      default() {
        return "";
      }
    },
    tialogPlaceholder: {
      type: String,
      default() {
        return "";
      }
    },
    // 弹窗类型，用于区分修改位置
    inputType: {
      type: Number,
      default() {
        return 1;
      }
    },
    id: {
      type: String,
      default() {
        return ""
      }
    }
  },
  data() {
    return {
      newName: ""
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", false);
    },
    submitHandle() {
      if(!this.newName) {
        this.$message("名称不能为空");
        return;
      }
      this.handleClose();
      this.inputType === 1 && this.$bus.emit("saveProjectNameSubmit", {newName: this.newName, id: this.id})
      this.inputType === 2 && this.$bus.emit("saveListNameSubmit", {newName: this.newName, id: this.id})
      this.newName = "";
    }
  }
};
</script>

<style scoped lang="less">
.inputDialog_page {
  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 10px 65px 20px;

      input {
        width: 280px;
        height: 38px;
        background: @bgColorF2;
        border-radius: 10px;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        line-height: 18px;
      }
    }
  }
  .dialog-footer {
    .option_btn {
      width: 280px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
    }

    .sure_btn {
      background-color: @addBtnColor;
      color: @mainBackgroundColor;
    }
  }
}
</style>
