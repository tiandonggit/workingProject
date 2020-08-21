/**
 *@desc 确认操作弹窗组件
 *@author houpai
 *@date 2020/03/20 16:30:33
 */
<template>
  <el-dialog
      title="提示"
      class="logoutDialog_page"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :show-close="false"
      center
      :before-close="handleClose">
    <p class="desc_p">{{dialogRemindDesc}}</p>
    <span slot="footer" class="dialog-footer">
      <button class="cancel_btn option_btn" @click="handleClose">取 消</button>
      <button class="sure_btn option_btn" @click="submitHandle">确 定</button>
    </span>
  </el-dialog>

</template>

<script>

  export default {
    name: "logoutDialog",
    props: {
      dialogVisible: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dialogRemindDesc: {
        type: String,
        default() {
          return "您确定要退出登录状态么?";
        }
      },
      dialogType: {
        type: String,
        default() {
          return "makeSureLogout";
        }

      }
    },
    data() {
      return {};
    },
    methods: {
      /**
       * 关闭弹窗
       * **/
      handleClose() {
        this.$emit("closeDialog", false);
      },

      /**
       * 弹窗确认操作
       * **/
      submitHandle() {
        switch (this.dialogType) {
          case "makeSureLogout":
            window.localStorage.removeItem('online');
            this.$emit('submitHandle');
            break;
          case "makeSureDeleteChat":
            console.log("删除聊天");
            break;
          case "makeSureDeleteFile":
            this.$emit("makeSureDeleteFile");
            break;
          case "makeSureModifyFileName":
            this.$emit("makeSureModifyFileName");
            break;
          default:
            console.log("退出登录");
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .logoutDialog_page {
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


  }
</style>
