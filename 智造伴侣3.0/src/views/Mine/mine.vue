<template>
  <div class="mine_page">
    <div class="topBar">
      <div class="avatar_box">
        <img :src="loginData.userMessage.headurl || ''" alt />
        <div class="message_box">
          <p class="name">{{loginData.userMessage.nickname || ""}}</p>
          <p class="phone">{{loginData.userMessage.phone || ""}}</p>
        </div>
      </div>
      <div class="select_option_box">
        <div class="select-task">
          <el-dropdown @command="handleCommand" placement="bottom">
            <span class="el-dropdown-link">
              {{projectNameSelect}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item,index) in projectsList"
                :key="index"
                :command="item.id"
              >{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <ul class="select_type">
          <li
            style="margin-left: 20px"
            :class="[{'checked':taskType === 3}]"
            @click.stop="taskType=3"
          >所有任务</li>
          <li
            style="margin-left: 20px"
            :class="[{'checked':taskType === 1}]"
            @click.stop="taskType=1"
          >已完成的任务</li>
          <li
            style="margin: 0 20px"
            :class="[{'checked':taskType === 2}]"
            @click.stop="taskType=2"
          >我创建的任务</li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="content_box">
        <el-scrollbar>
          <!--          遮罩层 防止频繁点击tree节点,时间间隔1s-->
          <div class="content_mask" v-if="contentMaskShow"></div>
          <!--          所有任务tree-->
          <el-collapse v-if="taskType===4">
            <el-collapse-item title="项目1" v-for="(tree, index) in treeData" :key="index" name="1">
              <el-tree
                @check="treeCheck"
                :data="treeData"
                :render-content="renderContent"
                show-checkbox
                ref="tree"
                check-strictly
                default-expand-all
                node-key="id"
                :props="defaultProps"
              ></el-tree>
            </el-collapse-item>
          </el-collapse>
          <!--          我创建的任务和已完成的任务-->
          <div class="task_list" v-else>
            <ul class="task_ul" v-for="item in task_list" :key="item.taskId">
              <li class="task_item">
                <p class="task_name">{{item.key || ""}}</p>
                <ul class="task_item_ul">
                  <li class="task_item_li" v-for="(subItem,subIndex) in item.data" :key="subIndex">
                    <el-checkbox v-model="subItem.completed" @change="completeSubTask(subItem)" />
                    <span class="task_detail">{{subItem.name || ""}}</span>
                    <p
                      class="project_detail"
                    >{{subItem.projectName || ""}} - {{subItem.listName || ""}}</p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mineSrv } from "./mine.service";
import { projectSrv } from "../Project/project.service";

export default {
  name: "mine",
  computed: {
    ...mapState(["loginData"])
  },
  watch: {
    taskType: {
      handler: function(newValue) {
        if (newValue === 3) {
          this.getTreeData();
        } else {
          this.getTaskList();
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      contentMaskShow: false, // tree遮罩
      taskType: 3, // 任务option 1已完成 2我创建的 3所有任务
      projectId: "",
      projectNameSelect: "所有项目",
      projectIdSelect: "",
      projectsList: [{ name: "所有项目", id: "" }],
      treeData: [
        {
          id: 1,
          parentId: 0,
          label: "任务1",
          children: [
            {
              id: 4,
              label: "任务1-子任务1",
              children: [
                {
                  id: 9,
                  label: "任务1-子任务1-子任务1"
                },
                {
                  id: 10,
                  label: "任务1-子任务1-子任务2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          parentId: 0,
          label: "任务2",
          children: [
            {
              id: 5,
              label: "任务2-子任务1"
            },
            {
              id: 6,
              label: "任务2-子任务2"
            }
          ]
        }
      ], // 树形
      defaultProps: {
        children: "data",
        label: "name"
      }, // tree props
      task_list: [] // 我创建的任务/已完成的任务(非tree数据)
    };
  },
  methods: {
    /**
     * 获取项目列表
     * **/
    getProjectList() {
      projectSrv
        .selectProject({})
        .then(response => {
          if (response.success && response.data) {
            response.data.forEach((v, e) => {
              this.projectsList.push(v);
            });
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 获取tree组件Data
     * **/
    getTreeData() {
      console.log("getTreeData");
      let params = this.projectId ? {projectId: this.projectId} : {}
      mineSrv
        .myTasks(params)
        .then(response => {
          if (response.success) {
            // this.treeData = response.data
            response.data.forEach((v, e) => {
              v.data.forEach((v1, e1) => {
                if (v1.status === 2) {
                  v1.completed = true;
                } else {
                  v1.completed = false;
                }
              });
            });
            this.task_list = response.data;
            console.log("response.data: ", response.data);
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 获取任务List(非tree)
     * **/
    getTaskList() {
      console.log("getTaskList", this.taskType);
      let params = this.projectId ? {projectId: this.projectId} : {}
      if (this.taskType === 2) {
        mineSrv
          .myCreatedTasks(params)
          .then(response => {
            if (response.success) {
              response.data.forEach((v, e) => {
                v.data.forEach((v1, e1) => {
                  if (v1.status === 2) {
                    v1.completed = true;
                  } else {
                    v1.completed = false;
                  }
                });
              });
              this.task_list = response.data;
            } else {
              this.$message.error(response.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        let params = this.projectId ? { isFinish: 1, projectId: this.projectId} : { isFinish: 1}
        mineSrv
          .myTasks(params)
          .then(response => {
            if (response.success) {
              response.data.forEach((v, e) => {
                v.data.forEach((v1, e1) => {
                  if (v1.status === 2) {
                    v1.completed = true;
                  } else {
                    v1.completed = false;
                  }
                });
              });
              this.task_list = response.data;
            } else {
              this.$message.error(response.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    /**
     * 选择项目查看
     * **/
    handleCommand(command) {
      this.projectIdSelect = command;
      let selectItem = this.$hasValueFromArray(
        this.projectsList,
        "id",
        this.projectIdSelect
      );
      if (selectItem.value) {
        this.projectNameSelect = selectItem.value.name || "";
        this.projectId = selectItem.value.id || "";
        if (this.taskType === 3) {
          this.getTreeData();
        } else {
          this.getTaskList();
        }
      }
    },
    /**
     * tree组件render自定义渲染
     * **/
    renderContent(h, { node, data, store }) {
      console.log("data===", data);
      if (data.parentId == 0) {
        return (
          <div class="root_box">
            <ul class="task_name_parent">
              <li class="task_name">{data.name}</li>
              <li class="task_message">
                <span class="task_level">最高</span>
                <span class="task_major_name">洪勇建</span>
                <span class="task_time">5月21日-5月27日</span>
              </li>
            </ul>
            <ul class="task_overview">
              <li class="demand">需求</li>
              <li class="question">问题</li>
              <span>清单1</span>
            </ul>
          </div>
        );
      } else {
        return (
          <div class="root_box son_box">
            <ul class="task_name_parent">
              <li class="task_name">{data.name}</li>
              <li class="task_message">
                <span class="task_level">最高</span>
                <span class="task_major_name">洪勇建</span>
                <span class="task_time">5月21日-5月27日</span>
              </li>
            </ul>
          </div>
        );
      }
    },
    /**
     * tree节点勾选事件,判断是删除还是勾选,发送对应请求
     * @params data -- 选中的tree节点
     * @params checkData --- 节点Node
     * **/
    treeCheck(data, checkData) {
      console.log("data====", data);
      console.log("checkData====", checkData);
      this.showContentMask();
    },
    showContentMask(){
      this.contentMaskShow = true;
      setTimeout(() => {
        this.contentMaskShow = false;
      }, 1000);
    },
    completeSubTask(value) {
      this.showContentMask();
      let params = {
        id: value.id,
        status: value.completed ? 2 : 1
      };
      projectSrv
        .taskDetailUpadate(params)
        .then(response => {
          if (response.success) {
          } else {
            this.$message.error(response.message || "操作失败");
            value.completed = !value.completed;
          }
        })
        .catch(error => {
          console.log(error);
          this.getTaskList();
        });
    }
  },
  created() {
    this.getProjectList();
    // this.getTreeData();
  }
};
</script>

<style scoped lang="less">
.mine_page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-right: 74px;

  .topBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 81px;
    padding: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .select_option_box {
      display: flex;
      align-items: center;

      .select-task {
        width: 124px;
        height: 26px;
        border-radius: 10px;
        border: 1px solid @titleColor;
        text-align: center;

        /deep/ .el-dropdown {
          span {
            font-size: 14px;
            font-weight: 400;
            color: @titleColor;
            line-height: 24px;
          }
        }
      }

      .select_type {
        display: flex;

        li {
          font-size: 16px;
          font-weight: 400;
          color: @titleColor;
        }

        li.checked {
          color: @barBackgroundColor;
        }
      }
    }

    .avatar_box {
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 52px;
        height: 52px;
        border-radius: 6px;
      }

      .message_box {
        height: 100%;
        margin-left: 10px;

        .name {
          font-weight: bold;
          color: @titleColor;
          font-size: 18px;
          line-height: 22px;
          margin-bottom: 4px;
        }

        .phone {
          font-size: 16px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
        }
      }
    }
  }

  .content {
    flex: 1;
    height: 0;
    overflow: hidden;
    padding: 15px;

    .content_box {
      position: relative;
      height: 100%;
      overflow: hidden;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 10px 0 10px 20px;

      /deep/ .el-collapse {
        border-top: none !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
      }

      /deep/ .el-collapse-item__content {
        padding: 15px 20px 15px 0;
      }

      /deep/ .el-collapse-item__header {
        font-size: 16px;
        font-weight: bold;
        color: @titleColor;
      }

      /deep/ .el-collapse-item__wrap,
      /deep/ .el-collapse-item__header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
      }

      /deep/ .el-collapse-item__arrow {
        margin: 0 8px 0 10px;
        color: rgba(102, 102, 102, 1);
      }

      /deep/ .el-checkbox__inner,
      /deep/ .el-checkbox__input.is-indeterminate {
        width: 20px !important;
        height: 20px !important;
        overflow: hidden;
        border-radius: 2px !important;
      }

      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: @barBackgroundColor !important;
        border-color: @barBackgroundColor !important;
      }

      /deep/ .el-checkbox__input.is-indeterminate,
      /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: @barBackgroundColor !important;
        border-color: @barBackgroundColor !important;
      }

      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner::after {
        transform: rotate(45deg) scaleY(1.4) !important;
      }

      /deep/ .el-checkbox__inner::after {
        left: 7px !important;
        top: 3px !important;
        border: 2px solid #fff !important;
        border-left: 0 !important;
        border-top: 0 !important;
      }

      /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        height: 3px !important;
        top: 7px !important;
      }

      /deep/
        .el-tree--highlight-current
        .el-tree-node.is-current
        > .el-tree-node__content {
        background-color: @barBackgroundColor !important;
      }

      /deep/ .el-tree-node__content {
        margin: 0 !important;
        /*align-items: flex-start;*/
        align-items: center !important;
        min-height: 26px !important;
      }

      /deep/ .el-tree-node__content > label.el-checkbox {
        margin-right: 15px !important;
      }

      .content_mask {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 9999;
      }

      /deep/ .root_box {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 0;
        padding: 10px;

        .task_name_parent {
          display: flex;

          li {
            font-size: 14px;
            font-weight: bold;
            color: @titleColor;
          }

          .task_name {
            min-width: calc(100% / 5);
            max-width: 70%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .task_message {
            flex: 1;
            width: 0;
            display: flex;
            justify-content: flex-end;

            .task_level {
              font-size: 14px;
              font-weight: bold;
              color: @titleColor;
              margin-right: 40px;
            }

            .task_major_name {
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(255, 89, 0, 0.6);
              border-radius: 12px;
              color: @fontColorFFF;
              padding: 0 10px;
              margin-right: 20px;
              font-size: 12px;
            }

            .task_time {
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 203, 95, 0.6);
              border-radius: 12px;
              color: @fontColorFFF;
              padding: 0 10px;
              font-size: 12px;
            }
          }
        }
      }

      /deep/ .son_box {
        .task_level {
          font-weight: 400 !important;
        }

        .task_name {
          font-weight: 400 !important;
        }
      }

      /deep/ .task_overview {
        display: flex;
        align-items: center;
        margin-top: 8px;

        span {
          font-size: 14px;
          font-weight: 400;
          color: @titleColor;
        }

        li {
          margin-right: 15px;
        }

        .demand {
          background: rgba(255, 48, 0, 0.7);
          border-radius: 12px;
          padding: 0 8px;
          font-size: 12px;
          line-height: 22px;
          font-weight: 400;
          color: @fontColorFFF;
        }

        .question {
          display: flex;
          align-items: center;
          background: rgba(0, 105, 255, 0.8);
          border-radius: 12px;
          padding: 0 8px;
          font-size: 12px;
          line-height: 22px;
          font-weight: 400;
          color: @fontColorFFF;
        }
      }

      .task_list {
        .task_ul {
          .task_item {
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            .task_name {
              font-size: 16px;
              font-weight: bold;
              color: @titleColor;
              display: flex;
              align-items: center;
              height: 48px;
              line-height: 48px;
              background-color: #fff;
              cursor: pointer;
            }

            .task_item_ul {
              padding-bottom: 12px;
            }

            .task_item_li {
              margin: 8px 0;

              .task_detail {
                margin-left: 15px;
                font-size: 14px;
                font-weight: bold;
                color: @titleColor;
              }
            }

            .project_detail {
              padding-left: 40px;
              margin: 8px 0;
              font-size: 14px;
              font-weight: 400;
              color: @titleColor;
            }
          }
        }
      }
    }
  }
}
</style>
