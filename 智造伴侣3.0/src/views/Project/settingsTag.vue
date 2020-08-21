/*
 * @Author: 田东 
 * @Date: 2020-06-12 16:15:06 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-16 10:18:27
 * @name 设置——管理标签
 */
<template>
  <div class="settingsTag_page">
    <div class="container">
      <div class="title">管理标签</div>
      <el-scrollbar>
        <!-- 滚动条包裹部分 -->
        <div class="member-box">
          <div class="label-box">
            <div class="left">
              <p>项目标签</p>
              <span>设置可以访问当前项目的成员</span>
            </div>
            <div class="right" @click.stop="newAddProjectTag">新建项目标签</div>
          </div>
          <div class="field-box project-tag" @click.stop="topInputFocus(item.id)" v-for="(item, index1) in projectTag" :key="item.id">
            <div class="left">
              <el-color-picker v-model="item.color" :disabled="!item.isEdit"></el-color-picker>
              <el-input
                v-model="item.name"
                maxlength="10"
                :ref="`${item.id}`"
                v-if="item.isEdit"
                placeholder
              ></el-input>
              <span v-if="!item.isEdit">{{item.name}}</span>
            </div>
            <div class="right" v-if="item.isEdit">
              <div class="save" @click.stop="save('1', item, index1)">保存</div>
              <div class="cancel" @click.stop="cancel('1', item, index1)">取消</div>
            </div>
            <div class="right" v-else>
              <div class="edit" @click.stop="edit('1', item, index1)">编辑</div>
              <div class="remove" @click.stop="remove('1', item, index1)">删除</div>
            </div>
          </div>
          <div class="label-box">
            <div class="left">
              <p>全局标签</p>
              <span>可在所有项目哪使用</span>
            </div>
            <div class="right" @click.stop="newAddPublicTag">新建全局标签</div>
          </div>
          <div class="field-box public-tag" @click.stop="bottomInputFocus(item.id)" v-for="(item, index2) in publicTag" :key="item.id">
            <div class="left">
              <el-color-picker :disabled="!item.isEdit" v-model="item.color"></el-color-picker>
              <el-input
                v-model="item.name"
                maxlength="10"
                :ref="`${item.id}`"
                v-if="item.isEdit"
                placeholder
              ></el-input>
              <span v-if="!item.isEdit">{{item.name}}</span>
            </div>
            <div class="right" v-if="item.isEdit">
              <div class="save" @click.stop="save('2', item, index2)">保存</div>
              <div class="cancel" @click.stop="cancel('2', item, index2)">取消</div>
            </div>
            <div class="right" v-else>
              <div class="edit" @click.stop="edit('2', item, index2)">编辑</div>
              <div class="remove" @click.stop="remove('2', item, index2)">删除</div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectSrv } from "./project.service";
export default {
  name: "settingsTag",
  computed: {
    ...mapState(["projectData"])
  },
  data() {
    return {
      projectTag: [],
      publicTag: [],
      itemName: ""
    };
  },
  mounted () {
    document.addEventListener("click", () => {
      this.topInputBlur();
      this.bottomInputBlur();
    });
  },
  created() {
    this.selectTags();
  },
  methods: {
    // 查询标签
    selectTags() {
      projectSrv
        .selectTags({
          doGroup: 1,
          projectId: this.projectData.selectedProject.id
        })
        .then(response => {
          if (response.success) {
            response.data.project.forEach(v => {
              v.isEdit = false;
            });
            this.projectTag = response.data.project;

            response.data.all.forEach(v => {
              v.isEdit = false;
            });
            this.publicTag = response.data.all;
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 新建项目标签
    newAddProjectTag() {
      this.itemName = "";
      if(this.projectTag[0].isEdit && !this.projectTag[0].name) {
        return;
      } else {
        this.projectTag.forEach(v => {
          v.isEdit = false;
        })
      }
      this.projectTag.unshift({
        id: "newAddProject",
        name: "",
        color: "#FF3000",
        isEdit: true
      });
      this.$nextTick(() => {
        this.$refs.newAddProject[0].focus();
      });
    },
    topInputFocus(id){
      this.projectTag[0].isEdit && this.$refs[id][0].focus();
    },
    topInputBlur() {
      if (!this.itemName && !this.projectTag[0].name) {
        this.projectTag.splice(0, 1);
        return;
      }
    },
    // 新建全局标签
    newAddPublicTag() {
      this.itemName = "";
      if(this.publicTag[0].isEdit && !this.publicTag[0].name) {
        return;
      } else {
        this.publicTag.forEach(v => {
          v.isEdit = false;
        })
      }
      this.publicTag.unshift({
        id: "newAddPublic",
        name: "",
        color: "#0069FF",
        isEdit: true
      });
      this.$nextTick(() => {
        this.$refs.newAddPublic[0].focus();
      });
    },
    bottomInputFocus(id){
      this.publicTag[0].isEdit && this.$refs[id][0].focus();
    },
    bottomInputBlur() {
      if (!this.itemName && !this.publicTag[0].name) {
        this.publicTag.splice(0, 1);
      }
    },
    // 编辑
    edit(from, item, index) {
      item.isEdit = true;
      this.itemName = item.name;

      this.$nextTick(() => {
        console.log(this.$refs);
        this.$refs[item.id][0].select();
      });
    },
    // 保存
    save(from, item, index) {
      if (from === "1") {
        if (item.id === "newAddProject") {
          projectSrv
            .addTags({
              projectId: this.projectData.selectedProject.id,
              name: this.projectTag[index].name,
              color: this.projectTag[index].color
            })
            .then(response => {
              if (response.success) {
                this.projectTag.splice(index, 1);
                this.projectTag.unshift(response.data);
                // this.$message.success(response.message);
              } else {
                this.$message.error(response.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          projectSrv
            .updateTags({
              projectId: this.projectData.selectedProject.id,
              id: item.id,
              name: this.projectTag[index].name,
              color: this.projectTag[index].color
            })
            .then(response => {
              if (response.success) {
                this.projectTag[index].isEdit = false;
                this.$message.success(response.message);
              } else {
                this.$message.error(response.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      } else if (from === "2") {
        if (item.id === "newAddPublic") {
          projectSrv
            .addTags({
              projectId: "",
              id: item.id,
              name: this.publicTag[index].name,
              color: this.publicTag[index].color
            })
            .then(response => {
              if (response.success) {
                this.publicTag.splice(index, 1);
                this.publicTag.unshift(response.data);
                // this.$message.success(response.message);
              } else {
                this.$message.error(response.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          projectSrv
            .updateTags({
              projectId: "",
              id: item.id,
              name: this.publicTag[index].name,
              color: this.publicTag[index].color
            })
            .then(response => {
              if (response.success) {
                this.publicTag[index].isEdit = false;
                this.$message.success(response.message);
              } else {
                this.$message.error(response.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    },
    // 取消
    cancel(from, item, index) {
      if (from === "1") {
        if (this.itemName) {
          this.projectTag[index].isEdit = false;
          this.projectTag[index].name = this.itemName;
        } else {
          this.projectTag.splice(index, 1);
        }
      } else if (from === "2") {
        if (this.itemName) {
          this.publicTag[index].isEdit = false;
          this.publicTag[index].name = this.itemName;
        } else {
          this.publicTag.splice(index, 1);
        }
      }
    },
    // 删除
    remove(from, item, index) {
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          projectSrv
            .deleteTags({
              projectId:
                from === "1" ? this.projectData.selectedProject.id : "",
              id: item.id
            })
            .then(response => {
              if (response.success) {
                from === "1"
                  ? this.projectTag.splice(index, 1)
                  : this.publicTag.splice(index, 1);
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
.settingsTag_page {
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
      line-height: 20px;
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
            font-size: 14px;
            font-weight: 400;
            color: @descTitleColor;
            line-height: 14px;
          }
        }

        .right {
          cursor: pointer;
          width: 120px;
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
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          font-size: 16px;
          font-weight: 400;
          color: @titleColor;
          line-height: 16px;
          // text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;

          div.box {
            width: 20px;
            height: 20px;
            border-radius: 3px;
            margin-right: 15px;
          }

          /deep/ .el-input {
            width: 132px;
            height: 34px;
            border-radius: 10px;
            border: 1px solid @addBtnColor;
            padding: 0 14px;

            .el-input__inner {
              height: 32px;
              line-height: 32px;
              padding: 0;
              border: none;
            }
          }
        }

        .middle {
          font-size: 14px;
          font-weight: 400;
          color: @titleColor;
          line-height: 14px;
        }

        .right {
          width: 113px;
          display: flex;
          justify-content: space-between;

          div {
            cursor: pointer;
          }

          .edit {
            font-size: 14px;
            font-weight: 400;
            color: @addBtnColor;
            line-height: 14px;
            margin-left: 17px;
          }

          .remove {
            font-size: 14px;
            font-weight: 400;
            color: rgba(255, 48, 0, 0.8);
            line-height: 14px;
          }

          .save {
            width: 64px;
            height: 26px;
            background: @addBtnColor;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 400;
            text-align: center;
            color: @fontColorFFF;
            line-height: 26px;
          }

          .cancel {
            font-size: 14px;
            font-weight: 400;
            color: @addBtnColor;
            line-height: 26px;
          }
        }
      }
    }
  }

  /deep/ .el-color-picker {
    height: 20px;
    margin-right: 15px;
    border-radius: 3px;
    overflow: hidden;

    .el-color-picker__trigger {
      width: 20px;
      height: 20px;
      padding: 0;
      border: none;

      .el-color-picker__color {
        border: none;
      }
    }

    .el-color-picker__icon {
      display: none;
    }

    .el-color-picker__mask {
      background: none;
    }
  }
}
</style>
