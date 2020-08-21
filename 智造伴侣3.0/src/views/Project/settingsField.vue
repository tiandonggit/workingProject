/*
 * @Author: 田东 
 * @Date: 2020-06-12 16:15:06 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-07 11:29:22
 * @name 设置——管理字段
 */
<template>
  <div class="settingsField_page">
    <div class="container">
      <div class="title">管理字段</div>
      <div class="member-box">
        <div class="label-box">
          <div class="left">
            <p>项目字段</p>
            <span>仅在项目内使用，管理员可编辑</span>
          </div>
          <div class="right" @click.stop="addField('1')">添加字段</div>
        </div>
        <div class="field-box" v-for="(item, index) in projectField" :key="item.id">
          <div class="block">
            <div class="left">{{item.name}}</div>
            <div class="middle">{{$hasValueFromArray(fieldTypeList, "type", item.type).value.name}}</div>
            <div class="right">
              <span @click.stop="remove('1', item.id, index)">删除</span>
            </div>
          </div>
          <div class="options" v-if="item.type === 1 || item.type === 2">
            <span v-for="(option, index2) in item.optionsArray" :key="index2">{{option}}</span>
          </div>
        </div>
        <div class="label-box">
          <div class="left">
            <p>全局字段</p>
            <span>可在所有项目哪使用</span>
          </div>
          <div class="right" @click.stop="addField('2')">添加字段</div>
        </div>
        <div class="field-box" v-for="(item, index) in publicField" :key="item.id">
          <div class="block">
            <div class="left">{{item.name}}</div>
            <div class="middle">{{$hasValueFromArray(fieldTypeList, "type", item.type).value.name}}</div>
            <div class="right">
              <span @click.stop="remove('2', item.id, index)">删除</span>
            </div>
          </div>
          <div class="options" v-if="item.type === 1 || item.type === 2">
            <span v-for="(option, index2) in item.optionsArray" :key="index2">{{option}}</span>
          </div>
        </div>
      </div>
    </div>

    <add-field-input-dialog
      :from="form"
      :dialogVisible="dialogVisible"
      @saveField="saveField"
      @closeDialog="dialogVisible=false"
    ></add-field-input-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import addFieldInputDialog from "@/components/inputDialog/addFieldInputDialog";
import { projectSrv } from "./project.service";
export default {
  name: "settingsField",
  computed: {
    ...mapState(["projectData"])
  },
  components: {
    addFieldInputDialog
  },
  data() {
    return {
      dialogVisible: false,
      form: "", // 1:项目字段  2：全局字段
      projectField: [],
      publicField: [],
      fieldTypeList: [
        { name: "文本字段", type: 0 },
        { name: "单选字段", type: 1 },
        { name: "多选字段", type: 2 },
        { name: "日期字段", type: 3 }
      ]
    };
  },
  created() {
    this.selectFields();
  },
  methods: {
    selectFields() {
      projectSrv
        .selectFields({
          doGroup: 1,
          projectId: this.projectData.selectedProject.id
        })
        .then(response => {
          if (response.success) {
            this.projectField = response.data.project;
            this.publicField = response.data.all;
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addField(from) {
      this.form = from;
      this.dialogVisible = true;
    },
    saveField(v) {
      console.log("from: ", this.form, v);
      // 项目字段
      let par = {
        projectId: this.form === "1" ? this.projectData.selectedProject.id : "",
        name: v.newName,
        type: v.type,
        options: v.options
      };
      projectSrv
        .addField(par)
        .then(response => {
          if (response.success) {
            this.form === "1"
              ? this.projectField.push(response.data)
              : this.publicField.push(response.data);
            // this.$message.success(response.message);
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    remove(from, id, index) {
      this.$confirm("此操作将永久删除该字段, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          projectSrv
            .removeField({
              id: id,
              projectId: from === "1" ? this.projectData.selectedProject.id : ""
            })
            .then(response => {
              if (response.success) {
                from === "1"
                  ? this.projectField.splice(index, 1)
                  : this.publicField.splice(index, 1);
                this.$message.success(response.message);
              } else {
                this.$message.error(response.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="less">
.settingsField_page {
  height: 100%;
  padding: 20px 94px 20px 20px;

  .container {
    height: 100%;
    padding: 20px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: @titleColor;
      line-height: 16px;
    }

    .member-box {
      .label-box {
        margin: 20px 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          p {
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 400;
            color: @titleColor;
            line-height: 16px;
          }

          span {
            font-size: 12px;
            font-weight: 400;
            color: @descTitleColor;
            line-height: 14px;
          }
        }

        .right {
          cursor: pointer;
          width: 92px;
          height: 26px;
          text-align: center;
          background: @addBtnColor;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 400;
          color: @fontColorFFF;
          line-height: 26px;
        }
      }

      .field-box {
        margin-bottom: 15px;

        .block {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left {
            width: 200px;
            font-size: 14px;
            font-weight: 400;
            color: @titleColor;
            line-height: 16px;
            // text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
          }

          .middle {
            font-size: 14px;
            font-weight: 400;
            color: @titleColor;
            line-height: 16px;
          }

          .right {
            width: 200px;
            text-align: right;

            span {
              cursor: pointer;
              font-size: 14px;
              font-weight: 400;
              color: rgba(255, 48, 0, 0.8);
              line-height: 14px;
            }
          }
        }

        .options {
          padding-left: 15px;
          margin-top: 12px;

          span {
            display: inline-block;
            padding: 0 15px;
            height: 24px;
            background: rgba(0, 203, 95, 0.6);
            border-radius: 12px;
            font-size: 12px;
            font-weight: 400;
            color: @fontColorFFF;
            line-height: 24px;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>
