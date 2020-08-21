/**
*@desc 新建文件夹弹窗
*@author houpai
*@date 2020/03/21 13:09:14
*/
<template>
  <el-dialog
      title="新建文件夹名称"
      class="newFolderDialog_page"
      :append-to-body="true"
      :visible.sync="newFolderDialogShow"
      :show-close="false"
      center
      :before-close="handleClose">
    <p class="desc_p">
      <el-input
          maxLength="50"
          placeholder="请输入新建文件夹名称"
          v-model="newFolderName"></el-input>
    </p>
    <span slot="footer" class="dialog-footer">
      <button class="cancel_btn option_btn" @click="handleClose">取 消</button>
      <button class="sure_btn option_btn" @click="$throttle(submitHandle)">确 定</button>
    </span>
  </el-dialog>

</template>

<script>

  export default {
    name: "newFolderDialog",
    props: {
      newFolderDialogShow: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        newFolderName: ""
      };
    },
    methods: {
      /**
       * 关闭弹窗
       * **/
      handleClose() {
        this.$emit("closeNewFolderDialog", false);
      },

      /**
       * 确认操作
       * **/
      submitHandle() {
        if (!this.newFolderName) {
          this.$message({
            message: "请输入新建文件夹名称",
          });
          return false;
        }

        if(!this.$fileNameTest(this.newFolderName)) {
          this.$message({
            message: "名称不能包含 \\ / : * ? \" < > |",
            type: 'error'
          });
          return false
        }
        this.$emit("submitNewFolderDialog", this.newFolderName);
      }
    }
  };
</script>

<style scoped lang="less">
  .newFolderDialog_page {
    .desc_p {
      font-size: 14px;
      font-weight: 400;
      color: @titleColor;
      line-height: 18px;
      text-align: center;
    }

    .dialog-footer {

      .option_btn {
        width: 165px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
      }

      .sure_btn {
        background-color: @highlightFontColor;
        color: @mainBackgroundColor;
        margin-left: 10px;
      }

      .cancel_btn {
        background-color: @mainBackgroundColor;
        color: @barBackgroundColor;
        border: 1px solid @barBackgroundColor;
        margin-right: 10px;
      }
    }

    /deep/ .el-input__inner {
      border: none;
      outline: none;
      background: @searchBackgroundColor;
      font-size: 16px;
      font-weight: 400;
      color: @subTitleColor;
    }
  }
</style>
