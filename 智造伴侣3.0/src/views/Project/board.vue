/*
 * @Author: 田东
 * @Date: 2020-06-19 16:51:42
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-16 10:42:24
 * @name 项目模块——看板
 */
<template>
  <div class="board_page">
    <div class="control-box">
      <div class="add-list" @click.stop="addList">
        <span>添加清单</span>
      </div>
      <div class="select-task">
        <el-dropdown @command="handleCommand" placement="bottom">
          <span class="el-dropdown-link">
            {{taskSelected}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="item.id"
              v-for="item in taskTypeList"
              :key="item.id"
            >{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="container">
      <el-scrollbar class="x-scroll">
        <div v-if="list.length == 0 && !isAddListIng" class="no-qingdan">
          <img src="../../assets/image/no_qingdan.png" alt />
          <p>
            暂无清单，
            <span @click.stop="addList">去添加</span>
          </p>
        </div>
        <div v-else class="content-block">
          <div class="box-card" v-for="(item, index) in list" :key="index">
            <div class="box">
              <div class="card-title">
                <div class="name">
                  <span>{{item.name}}</span>
                  <img
                    @click.stop="renameListName(item.id)"
                    src="../../assets/image/icon-p-rename.png"
                    alt
                  />
                </div>
                <el-dropdown @command="handleCommandMore($event, index)" placement="bottom">
                  <span class="el-dropdown-link">
                    <img src="../../assets/image/icon-p-more.png" alt />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">添加任务</el-dropdown-item>
                    <el-dropdown-item command="2">删除清单</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="card-content">
                <el-scrollbar class="y-scroll">
                  <div>
                    <div
                      @click.stop="lookInventoryInfo(i)"
                      v-for="(i, index2) in item.tasks"
                      :key="index2"
                      class="item-info"
                    >
                      <div class="one">
                        <div class="title">{{i.name}}</div>
                        <div class="del">
                          <img
                            @click.stop="deleteTask(i.id, index, index2)"
                            src="../../assets/image/icon-p-delete.png"
                            alt
                          />
                        </div>
                      </div>
                      <div class="two">
                        <div class style="position: relative">
                          <div
                            v-if="i.execUser"
                            class="name"
                            @click.stop="changName($event, index, index2, i.execUserNickname)"
                          >{{i.execUserNickname}}</div>
                          <div
                            v-else
                            class="img-box"
                            @click.stop="changName($event, index, index2, i.execUserNickname)"
                          >
                            <img src="../../assets/image/icon_i_fuzeren.png" alt />
                          </div>
                        </div>
                        <!-- <div
                          v-if="i.startDate"
                          class="date"
                          @click.stop="changDate(index,index2,i.startDate)"
                        >{{i.startDate}} - {{i.endDate}}</div>-->
                        <div
                          class="img-box"
                          :class="{imgBox: i.startDate}"
                          @click.stop="changDate(index,index2,i.startDate)"
                        >
                          <img v-if="!i.startDate" src="../../assets/image/icon_i_date.png" alt />
                          <date-picker
                            @changeSelectTimes="taskDetailUpadate"
                            :id="i.id"
                            :time="[i.startDate, i.endDate]"
                          ></date-picker>
                        </div>
                      </div>
                      <div
                        v-for="field in i.fields"
                        class="three"
                        :key="field.id"
                      >{{field.name}}：{{field.value}}</div>
                    </div>
                  </div>
                  <div class="task-name" v-show="item.isAddTaskIng">
                    <input
                      @blur="newTaskInputBlur(index, item.id, item.newTaskName)"
                      ref="newTaskInput"
                      v-model="item.newTaskName"
                      type="text"
                      placeholder="请输入任务名称"
                    />
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
          <div class="add-list-box" v-show="isAddListIng">
            <div class="add-list">
              <input
                @blur="newListingInputBlur()"
                ref="newListingInput"
                v-model="newListingName"
                type="text"
                placeholder="请输入清单名称"
              />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 清单信息 -->
    <inventory-info-dialog
      :isShowInventoryInfoDialog="isShowInventoryInfoDialog"
      v-if="isShowInventoryInfoDialog"
      @refreshList="getList"
      @closeInventoryInfoDialog="closeInventoryInfoDialog"
    ></inventory-info-dialog>

    <responsible-person-select-list
      @responsiblePersonUpdate="updateInventoryInfo"
      v-if="dialogShow.responsiblePersonSelectShow"
      :execUser="selectedTask.execUser"
      :positionLeft="responsiblePersonSelectListLeft"
      :positionTop="responsiblePersonSelectListTop"
    ></responsible-person-select-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectSrv } from "./project.service";
import inputDialog from "@/components/inputDialog/inputDialog";
import inventoryInfoDialog from "@/components/projectDialog/inventoryInfoDialog";
import datePicker from "../../components/projectDialog/datePicker/datePicker";
import responsiblePersonSelectList from "@/components/responsiblePersonSelect/responsiblePersonSelectList";
export default {
  name: "board",
  computed: {
    ...mapState(["projectData"])
  },
  components: {
    inputDialog,
    inventoryInfoDialog,
    datePicker,
    responsiblePersonSelectList
  },
  data() {
    return {
      list: [],
      isShowInventoryInfoDialog: false,
      isAddListIng: false,
      newListingName: "",
      renameListInfo: {},
      taskTypeList: [
        { id: "1", name: "未完成任务" },
        { id: "2", name: "已完成任务" },
        { id: "3", name: "所有任务" }
      ],
      taskSelected: "未完成任务",
      dialogShow: {
        responsiblePersonSelectShow: false // 选择负责人
      },
      responsiblePersonSelectListLeft: "",
      responsiblePersonSelectListTop: "",
      selectedTask: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      let _this = this;
      document.querySelector("body").onclick = function(e) {
        e.preventDefault();
        _this.dialogShow.responsiblePersonSelectShow = false;
      };
      this.$bus.on("saveListNameSubmit", v => {
        this.renameListInfo = { ...v };
        this.list.forEach((v1, e1) => {
          if (v1.id === v.id) {
            v1.name = v.newName;
          }
        });
      });
    });
  },
  watch: {
    'projectData.projectList': {
      handler: function(newValue, oldValue) {
        this.getList();
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getList();
  },
  methods: {
    // 获取清单列表
    getList() {
      projectSrv
        .list({
          projectId: this.projectData.selectedProject.id
        })
        .then(response => {
          if (response.success) {
            response.data.forEach(v => {
              v.isAddTaskIng = false;
            });
            this.list = response.data;
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 任务标签选择
    handleCommand(command) {
      let selectItem = this.$hasValueFromArray(
        this.taskTypeList,
        "id",
        command
      );
      if (selectItem.value) {
        this.taskSelected = selectItem.value.name || "";
      }
    },
    // 1添加任务 2删除清单
    handleCommandMore(command, index) {
      if (command === "1") {
        this.list[index].isAddTaskIng = true;
      } else if (command === "2") {
        this.$confirm("此操作将永久删除该清单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            projectSrv
              .deleteList({
                projectId: this.projectData.selectedProject.id,
                listId: this.list[index].id
              })
              .then(response => {
                if (response.success) {
                  this.list.splice(index, 1);
                  this.$message.success("删除清单成功");
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
    },
    // 添加清单
    addList() {
      this.isAddListIng = true;
      this.$nextTick(() => {
        this.$refs.newListingInput.focus();
      });
    },
    // 修改清单名称
    renameListName(id) {
      this.$bus.emit("showDialog", {
        inputType: 2,
        id: id,
        dialogTtitle: "修改清单名称",
        tialogPlaceholder: "请输入清单名称"
      });
    },
    // 添加清单输入框失焦事件
    newListingInputBlur() {
      this.isAddListIng = false;
      if (!this.newListingName) {
        return;
      }

      projectSrv
        .newList({
          projectId: this.projectData.selectedProject.id,
          name: this.newListingName
        })
        .then(response => {
          if (response.success) {
            response.data.isAddTaskIng = false;
            this.list.push(response.data);
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.newListingName = "";
    },
    // 添加清单中任务输入框失焦事件
    newTaskInputBlur(index, id, newTaskName) {
      console.log("id, newTaskName: ", id, newTaskName);
      this.list[index].isAddTaskIng = false;
      if (!newTaskName) {
        return;
      }

      projectSrv
        .createTask({
          projectId: this.projectData.selectedProject.id,
          name: newTaskName,
          parentId: 0,
          listId: id
        })
        .then(response => {
          if (response.success) {
            this.list[index].tasks.push(response.data);
            // this.$message.success(response.message);
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 删除任务
    deleteTask(id, index, index2) {
      this.dialogShow.responsiblePersonSelectShow = false;
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          projectSrv
            .deleteTask({
              projectId: this.projectData.selectedProject.id,
              id: id
            })
            .then(response => {
              if (response.success) {
                this.list[index].tasks.splice(index2, 1);
                this.$message.success("任务删除成功");
              } else {
                this.$message.error(response.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    // 任务修改负责人
    changName(e, index, index2, name) {
      e.preventDefault();
      this.selectedTask = this.list[index].tasks[index2];
      console.log("index, index2, name: ", index, index2, name);

      let top = e.pageY - 70 + "px";
      let left = e.pageX + 10 + "px";
      this.responsiblePersonSelectListLeft = left;
      this.responsiblePersonSelectListTop = top;

      this.dialogShow.responsiblePersonSelectShow = true;
    },
    updateInventoryInfo(v) {
      console.log("v: ", v);
      projectSrv
        .updateTask({
          projectId: this.projectData.selectedProject.id,
          id: this.selectedTask.id,
          execUser: v.execUser,
          execUserNickname: v.execUserNickname
        })
        .then(response => {
          if (response.success) {
            this.list.forEach((v1, e1) => {
              v1.tasks.forEach((v2, e2) => {
                if (v2.id === this.selectedTask.id) {
                  this.list[e1].tasks[e2].execUser = v.execUser;
                  this.list[e1].tasks[e2].execUserNickname = v.execUserNickname;
                }
              });
            });
            this.dialogShow.responsiblePersonSelectShow = false;
            console.log("this.list: ", this.list);
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 任务详情 update
     * @params fieldsObj key value 要更新的字段对象
     * **/
    taskDetailUpadate(fieldsObj) {
      console.log("updating task fields", fieldsObj);
      projectSrv
        .taskDetailUpadate(fieldsObj)
        .then(response => {
          if (response.success) {
            console.log("update response success");
          } else {
            this.$message.error(response.message || "操作失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 任务修改日期
    changDate(index, index2, date) {
      this.dialogShow.responsiblePersonSelectShow = false;
    },
    // 查看任务详情
    lookInventoryInfo(task) {
      this.dialogShow.responsiblePersonSelectShow = false;
      this.isShowInventoryInfoDialog = true;
      this.$store.commit("projectData/saveSelectedTask", task);
    },
    // 关闭任务详情弹窗
    closeInventoryInfoDialog() {
      this.isShowInventoryInfoDialog = false;
    }
  }
};
</script>

<style scoped lang="less">
.board_page {
  padding: 20px 74px 15px 0;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .control-box {
    padding-left: 20px;
    height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .add-list {
      cursor: pointer;
      width: 92px;
      height: 26px;
      background: @addBtnColor;
      text-align: center;
      border-radius: 10px;

      span {
        font-size: 14px;
        font-weight: 400;
        color: @fontColorFFF;
        line-height: 26px;
      }
    }

    .select-task {
      width: 124px;
      height: 26px;
      border-radius: 10px;
      border: 1px solid @addBtnColor;
      text-align: center;
      margin-right: 20px;

      /deep/ .el-dropdown {
        span {
          font-size: 14px;
          font-weight: 400;
          color: @addBtnColor;
          line-height: 24px;
        }
      }
    }
  }

  .container {
    flex: 1;
    height: 0;
    padding: 0 0 0 11px;
    // display: flex;
    // overflow-x: scroll;

    .x-scroll {
      /deep/ .el-scrollbar__view {
        padding-top: 15px;
        display: flex;
        height: 100%;
      }
    }

    .y-scroll {
      /deep/ .el-scrollbar__view {
        padding: 0 15px;
        display: block;
        height: auto;
      }
    }

    .add-list-box {
      width: 248px;
      height: 74px;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);

      .add-list {
        height: 44px;
        width: 218px;
        background: @bgColorED;
        border-radius: 10px;
        padding: 13px 15px;
        margin-bottom: 15px;

        input {
          line-height: 18px;
          background: @bgColorED;
        }
      }
    }

    .no-qingdan {
      width: 100%;
      height: 100%;

      img {
        width: 237px;
        display: block;
        margin: 37px auto 28px;
      }

      p {
        font-size: 18px;
        font-weight: 400;
        color: @titleColor;
        line-height: 25px;
        text-align: center;

        span {
          cursor: pointer;
          color: @addBtnColor;
          text-decoration: underline;
        }
      }
    }

    .content-block {
      height: 100%;
      // width: 100%;
      display: flex;
      padding: 5px;
    }

    .box-card {
      height: 100%;
      // overflow-y: scroll;
      width: 248px;
      margin-right: 18px;
      border: none;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;

      .box {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }

    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      height: 48px;
      // box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px 10px 0 0;

      .name {
        flex: 1;
        display: flex;
        align-items: center;

        span {
          margin-right: 10px;
          font-size: 16px;
          font-weight: bold;
          color: @titleColor;
          line-height: 18px;
        }

        img {
          width: 16px;
          cursor: pointer;
        }

        input {
          font-size: 16px;
        }
      }

      /deep/ .el-dropdown {
        width: 18px;
        cursor: pointer;

        img {
          width: 100%;
          vertical-align: middle;
        }
      }
    }

    .card-content {
      flex: 1;
      height: 0;

      .task-name {
        height: 44px;
        background: @bgColorED;
        border-radius: 10px;
        padding: 13px 15px;
        margin-bottom: 15px;

        input {
          line-height: 18px;
          background: @bgColorED;
        }
      }
    }

    .item-info {
      width: 220px;
      // height: 155px;
      background: @bgColorED;
      border-radius: 10px;
      margin-bottom: 15px;
      padding: 15px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;

      .one {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 14px;
          font-weight: bold;
          color: @titleColor;
          line-height: 16px;
        }

        .del {
          width: 14px;
          height: 14px;

          img {
            width: 100%;
          }
        }
      }

      .two {
        display: flex;
        // justify-content: space-between;
        align-items: center;

        .name {
          width: 56px;
          height: 20px;
          background: rgba(255, 89, 0, 0.6);
          border-radius: 12px;
          text-align: center;
          font-size: 12px;
          color: @fontColorFFF;
          line-height: 20px;
          margin-right: 10px;
        }

        .date {
          width: 116px;
          height: 20px;
          background: rgba(0, 203, 95, 0.6);
          border-radius: 12px;
          text-align: center;
          font-size: 12px;
          color: @fontColorFFF;
          line-height: 20px;
        }

        .imgBox {
          margin-right: 0 !important;
          display: block !important;
          cursor: pointer;
          width: 124px;
          height: 20px;
          background: rgba(0, 203, 95, 0.6);
          border-radius: 12px;
          text-align: center;
          font-size: 12px;
          color: @fontColorFFF;
          line-height: 20px;
          padding: 0 5px;
          overflow: hidden;
        }

        div.img-box {
          margin-right: 20px;
          cursor: pointer;
          display: flex;

          /deep/ .el-date-editor {
            // padding: 0;
            height: 20px;
            width: 100% !important;

            .el-range-input {
              color: @fontColorFFF;

              &:nth-child(2) {
                width: 100%
              }
            }

            .el-range-separator {
              line-height: 12px;
              color: @fontColorFFF;
            }
          }

          img {
            width: 20px;
            height: 20px;
            display: block;
          }
        }
      }

      .three,
      .four,
      .five {
        margin-top: 15px;
        font-size: 12px;
        font-weight: 400;
        color: @titleColor;
        line-height: 12px;
      }

      input {
        background: @bgColorED;
      }
    }
  }
}
</style>
