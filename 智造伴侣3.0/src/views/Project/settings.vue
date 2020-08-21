/*
 * @Author: 田东 
 * @Date: 2020-06-19 16:51:06 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-07 11:23:53
 * @name 项目模块——设置
 */
<template>
  <div class="settings_page">
    <div class="container">
      <div class="member-box">
        <div class="label-box">
          <div class="left">
            <p>管理标签</p>
            <span>设置当前项目可用的标签</span>
          </div>
          <div class="right" @click.stop="settingsTag">管理标签</div>
        </div>
        <div class="label-box">
          <div class="left">
            <p>管理字段</p>
            <span>设置当前项目的自定义字段</span>
          </div>
          <div class="right" @click.stop="settingsField">管理字段</div>
        </div>
        <div class="label-box">
          <div class="left">
            <p>删除项目</p>
            <span>项目删除后，所有的内容也将立刻删除</span>
          </div>
          <div class="delete" @click.stop="deleteProject">删除项目</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectSrv } from "./project.service";
export default {
  name: "settings",
  computed: {
    ...mapState(["projectData"])
  },
  data() {
    return {};
  },
  methods: {
    settingsField() {
      this.$router.push({ name: "settingsField" });
    },
    settingsTag() {
      this.$router.push({ name: "settingsTag" });
    },
    deleteProject() {
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          projectSrv
            .deleteProject({ id: this.projectData.selectedProject.id })
            .then(response => {
              if (response.success) {
                this.$message.success("删除成功");
                this.$parent.selectProjectList();
                this.$router.push({ name: "board" });
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
.settings_page {
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

    .member-box {
      .label-box {
        margin-bottom: 30px;
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
          width: 165px;
          height: 30px;
          text-align: center;
          border-radius: 10px;
          border: 1px solid @descTitleColor;
          font-size: 14px;
          font-weight: 400;
          color: @titleColor;
          line-height: 30px;
        }

        .delete {
          cursor: pointer;
          width: 165px;
          height: 30px;
          text-align: center;
          background: rgba(255, 48, 0, 0.7);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 400;
          color: @fontColorFFF;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
