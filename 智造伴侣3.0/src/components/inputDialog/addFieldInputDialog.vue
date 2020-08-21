/*
 * @Author: 田东 
 * @Date: 2020-06-12 13:38:30 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-06 10:37:40
 * @name 设置——添加字段弹窗组件
 */

<template>
  <el-dialog
    :title="'添加字段'"
    class="addFieldInputDialog_page"
    :visible.sync="dialogVisible"
    :show-close="true"
    :close-on-click-modal="true"
    center
    :before-close="handleClose"
  >
    <div class="option-box">
      <input v-model="newName" type="text" placeholder="请输入字段名称" />
      <div class="menu-box">
        <el-dropdown @command="handleCommand" trigger="click" placement="bottom">
          <span class="el-dropdown-link">
            {{fieldTypeSelect}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu class="field-type-dropdown" slot="dropdown">
            <el-dropdown-item
              v-for="(item,index) in fieldTypeList"
              :key="index"
              :command="item.type"
            >{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="set-options" v-show="isShowAddOption">
        <p class="title">设置选项</p>
        <div class="input-box" v-for="(option, index) in options" :key="index">
          <input readonly :value="option" type="text" />
          <img @click.stop="removeOption(index)" src="../../assets/image/icon_close.png" alt />
        </div>
        <div class="input-box" v-show="isShowAddOptionInput">
          <input @blur="addOptionInputBlur" ref="optionInput" v-model="addOptionNewName" type="text" />
          <img @click.stop="closeAddOptionInput" src="../../assets/image/icon_close.png" alt />
        </div>
        <p class="hint" v-show="isNoInputOption">不能为空</p>
        <span class="add-option" @click.stop="addOption">添加选项</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <button class="sure_btn option_btn" @click="submitHandle">保存</button>
      <button class="cancel_btn option_btn" @click="handleClose">取消</button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addFieldInputDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    from: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      newName: "",
      activeIndex: "",
      fieldTypeSelect: "请选择字段类型",
      fieldTypeSelectId: "",
      fieldTypeList: [
        { name: "文本字段", type: 0 },
        { name: "单选字段", type: 1 },
        { name: "多选字段", type: 2 },
        { name: "日期字段", type: 3 }
      ],
      addOptionNewName: "",
      options: [], // 已添加到选项
      isNoInputOption: false, // 添加选项输入框未填写提示
      isShowAddOption: false,
      isShowAddOptionInput: false
    };
  },
  methods: {
    handleCommand(command) {
      this.fieldTypeSelectId = command;
      if(command === 1 || command === 2) {
        this.isShowAddOption = true;
      }else {
        this.isShowAddOption = false;
        this.isShowAddOptionInput = false;
      }
      let selectItem = this.$hasValueFromArray(
        this.fieldTypeList,
        "type",
        command
      );
      if (selectItem.value) {
        this.fieldTypeSelect = selectItem.value.name || "";
      }
    },
    addOption() {
      if(!this.isShowAddOptionInput){
        this.isShowAddOptionInput = true;
        this.$nextTick(()=> {
          this.$refs.optionInput.focus()
        })
      } 
    },
    addOptionInputBlur(){
      if(!this.addOptionNewName) {
        this.isShowAddOptionInput = false;
      } else {
        this.isNoInputOption = false;
        this.options.push(this.addOptionNewName)
        this.isShowAddOptionInput = false;
        this.addOptionNewName = "";
      }
    },
    removeOption(index){
      this.options.splice(index, 1);
    },
    closeAddOptionInput (){
      this.isShowAddOptionInput = false;
      this.addOptionNewName = "";
    },
    handleClose() {
      this.$emit("closeDialog", false);
    },
    submitHandle() {
      if (!this.newName) {
        this.$message("请输入字段名称");
        return;
      }
      this.handleClose();
      this.$emit("saveField", {
        newName: this.newName,
        type: this.fieldTypeSelectId,
        options: this.options.join(",")
      });
      this.newName = "";
      this.options = [];
      this.fieldTypeSelect = "请选择字段类型";
      this.isShowAddOption = false;
    }
  }
};
</script>

<style scoped lang="less">
.field-type-dropdown {
  width: 280px;
  top: 38px;
  background: @bgColorF2;
  margin: 3px 0 0;
  border-radius: 10px;
  box-shadow: none;
}
.addFieldInputDialog_page {
  /deep/ .el-dialog {
    margin-top: 294px !important;

    .el-dialog__body {
      padding: 10px 65px 20px;

      input {
        width: 280px;
        height: 38px;
        padding: 0 15px;
        background: @bgColorF2;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 400;
        line-height: 18px;
      }

      .menu-box {
        width: 280px;
        height: 38px;
        background: @bgColorF2;
        border-radius: 10px;
        margin-top: 20px;

        .el-dropdown {
          width: 100%;
          height: 100%;
          font-size: 16px;
          padding: 0 15px;

          .el-dropdown-link {
            width: 100%;
            line-height: 38px;
            display: block;

            .el-icon--right {
              float: right;
              line-height: 38px;
              color: @addBtnColor;
            }
          }
        }
      }

      .set-options {
        margin-top: 20px;

        .title {
          font-size: 14px;
          font-weight: 400;
          color: @subTitleColor;
          line-height: 14px;
          margin-bottom: 10px;
        }

        .add-option {
          font-size: 14px;
          font-weight: 400;
          color: @addBtnColor;
          line-height: 14px;
          cursor: pointer;
        }

        .input-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          input {
            flex: 1;
            width: 0;
            height: 38px;
            background: @bgColorF2;
            border-radius: 10px;
          }

          img {
            width: 16px;
            height: 16px;
            margin-left: 10px;
          }
        }

        .hint {
          color: @exitGroupFontColor;
          font-size: 12px;
        }
      }
    }
  }
  .dialog-footer {
    .option_btn {
      width: 120px;
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
      margin-right: 20px;
    }

    .cancel_btn {
      border-radius: 10px;
      background: @fontColorFFF;
      color: @addBtnColor;
      border: 1px solid @addBtnColor;
    }
  }
}
</style>
