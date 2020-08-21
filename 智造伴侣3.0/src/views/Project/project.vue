<template>
  <div class="project_page">
    <div class="left-list">
      <div class="search-box">
        <div class="input-box">
          <img src="../../assets/image/icon-p-search.png" alt />
          <input v-model="searchValue" type="text" @change="searchProject" name id placeholder="搜索" />
        </div>
        <div class="add-project" @click.stop="addProject">
          <img src="../../assets/image/icon_add.png" alt />
        </div>
      </div>
      <div
        class="project-list"
        :class="{isActive: item.isActive}"
        v-for="(item, index) in projectData.projectList"
        :key="index"
        @click.stop="selectProject(index)"
      >
        <div class="line-box">
          <div class="img-box"></div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
      <div v-if="isAddProjectIng" class="project-list isActive">
        <div class="line-box">
          <div class="img-box"></div>
          <input
            ref="input"
            v-model="newProjectName"
            type="text"
            placeholder="请输入项目名称"
            @blur="submitNewProjectName"
          />
        </div>
      </div>
    </div>
    <div v-if="projectData.projectList.length > 0" class="right-content">
      <div class="content-top">
        <div class="left-box">
          <div class="name">
            <span>{{projectData.selectedProject.name}}</span>
            <img @click.stop="renameProject" src="../../assets/image/icon-p-rename.png" alt />
          </div>
          <div class="menu-box">
            <ul class="menu">
              <li
                :class="[{'checked':checked === 'board'}]"
                @click.stop="routerLink('board','board')"
              >
                <span>看板</span>
              </li>
              <li :class="[{'checked':checked === 'disk'}]" @click.stop="routerLink('disk','disk')">
                <span>文件</span>
              </li>
              <li
                :class="[{'checked':checked === 'member'}]"
                @click.stop="routerLink('member','member')"
              >
                <span>成员</span>
              </li>
              <li
                :class="[{'checked':checked === 'settings'}]"
                @click.stop="routerLink('settings','settings')"
              >
                <span>设置</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div class="search-box">
          <div class="input-box">
            <img src="../../assets/image/icon-p-search.png" alt />
            <input type="text" name id placeholder="搜索" />
          </div>
        </div> -->
      </div>
      <div class="routerView_box">
        <router-view></router-view>
      </div>
    </div>
    <div v-if="projectData.projectList.length == 0" class="no-project">
      <img src="../../assets/image/no_project.png" alt />
      <p>
        暂无项目，
        <span @click.stop="addProject">去创建</span>
      </p>
    </div>
    <input-dialog
      :inputType="dialogInfo.inputType"
      :id="dialogInfo.id"
      :dialogTtitle="dialogInfo.dialogTtitle"
      :tialogPlaceholder="dialogInfo.tialogPlaceholder"
      :dialogVisible="dialogVisible"
      @closeDialog="dialogVisible=false"
    ></input-dialog>
  </div>
</template>

<script>
import inputDialog from "@/components/inputDialog/inputDialog";
import { projectSrv } from "./project.service";
import { mapState } from "vuex";
export default {
  name: "project",
  components: {
    inputDialog
  },
  computed: {
    ...mapState([
      "imData",
      "loginData",
      "homeData",
      "mailListData",
      "projectData"
    ])
  },
  data() {
    return {
      leftList: [],
      selectedProject: {},
      searchValue: "",
      checked: "",
      dialogVisible: false,
      dialogInfo: {
        dialogTtitle: "设置项目名称",
        tialogPlaceholder: "请输入项目名称",
        inputType: 1,
        id: "01"
      },
      isAddProjectIng: false,
      newProjectName: ""
    };
  },
  watch: {
    $route: {
      handler(newValue, oldValue) {
        this.checked = this.$route.meta.secondChecked || "";
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.checked = this.$route.meta.secondChecked || "";
    this.selectProjectList();
  },
  mounted() {
    this.$nextTick(() => {
      this.$bus.on("showDialog", v => {
        this.dialogInfo = { ...v };
        this.dialogVisible = true;
      });
      this.$bus.on("submitHandle", v => {
        console.log("v: ", v);
      });
      // 修改项目名称
      this.$bus.on("saveProjectNameSubmit", v => {
        this.saveProjectNameSubmit(v);
      });
    });
  },
  methods: {
    // 查询项目看列表
    selectProjectList() {
      projectSrv
        .selectProject({name: this.searchValue})
        .then(response => {
          if (response.success && response.data) {
            response.data.forEach((v, e) => {
              v.isActive = false;
            });
            response.data.length > 0 && (response.data[0].isActive = true);
            this.$store.commit("projectData/saveProjectList", response.data);
            this.$store.commit(
              "projectData/saveSelectedProject",
              response.data[0]
            );
            let checkedFileSpaceMessage = {
              fileSpaceName: response.data[0].name || "",
              fileSpaceId: response.data[0].filespaceId || "",
              filePermission:  ['0','1','2','3','4','5','6','7','8']
            };
            this.$store.commit("fileDiskData/saveCheckedFileSpaceMessage", checkedFileSpaceMessage);
            this.$bus.emit("getFileListByFileSpaceId");
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchProject(){
      this.selectProjectList();
    },
    // 创建新项目
    addProject() {
      this.isAddProjectIng = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    submitNewProjectName() {
      if (!this.newProjectName) {
        this.isAddProjectIng = false;
        return;
      }
      this.isAddProjectIng = false;
      projectSrv
        .createProject({ name: this.newProjectName })
        .then(response => {
          if (response.success && response.data) {
            let projectListVuex = JSON.parse(
              JSON.stringify(this.projectData.projectList)
            );
            projectListVuex.forEach((v, e) => {
              v.isActive = false;
            });
            response.data.isActive = true;
            projectListVuex.push(response.data);
            this.$store.commit("projectData/saveProjectList", projectListVuex);
            this.$store.commit(
              "projectData/saveSelectedProject",
              response.data
            );
            this.newProjectName = "";
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 列表选择项目
    selectProject(index) {
      let projectListVuex = JSON.parse(
        JSON.stringify(this.projectData.projectList)
      );
      projectListVuex.forEach((v, e) => {
        if (e === index) {
          v.isActive = true;
          this.$store.commit("projectData/saveSelectedProject", v);
          let checkedFileSpaceMessage = {
            fileSpaceName: v.name || "",
            fileSpaceId: v.filespaceId || "",
            filePermission:  ['0','1','2','3','4','5','6','7','8']
          };
          this.$store.commit("fileDiskData/saveCheckedFileSpaceMessage", checkedFileSpaceMessage);
          this.$bus.emit("getFileListByFileSpaceId");
        } else {
          v.isActive = false;
        }
      });
      this.$store.commit("projectData/saveProjectList", projectListVuex);
    },
    // 路由跳转
    routerLink(routerName, check) {
      if (this.checked === check) {
        return false;
      } else {
        this.$routerLink(routerName);
      }
    },
    // 修改项目名称
    renameProject() {
      this.dialogInfo.dialogTtitle = "设置项目名称";
      this.dialogInfo.tialogPlaceholder = "请输入项目名称";
      this.dialogInfo.inputType = 1;
      this.dialogInfo.id = this.projectData.selectedProject.id;
      this.dialogVisible = true;
    },
    saveProjectNameSubmit(v) {
      projectSrv
        .updateProjectName({ id: v.id, name: v.newName })
        .then(response => {
          if (response.success) {
            let projectListVuex = JSON.parse(
              JSON.stringify(this.projectData.projectList)
            );
            projectListVuex.forEach((v1, e1) => {
              if (v1.id === v.id) {
                let projectDataVuex = JSON.parse(
                  JSON.stringify(this.projectData.selectedProject)
                );
                projectDataVuex.name = v.newName;
                v1.name = v.newName;
                this.$store.commit(
                  "projectData/saveSelectedProject",
                  projectDataVuex
                );
              }
            });
            this.$store.commit("projectData/saveProjectList", projectListVuex);
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    saveNameSubmit(v) {}
  }
};
</script>

<style scoped lang="less">
.project_page {
  height: 100%;
  display: flex;

  .no-project {
    flex: 1;
    width: 0;
    height: 100%;
    padding-right: 74px;

    img {
      width: 237px;
      display: block;
      margin: 177px auto 31px;
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

  .search-box {
    padding: 12px 10px;
    display: flex;
    justify-content: space-between;

    .input-box {
      background: @searchBackgroundColor;
      border-radius: 10px;
      width: 237px;
      height: 34px;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 21px;
        margin-right: 9px;
      }

      input {
        flex: 1;
        width: 0;
        background: @searchBackgroundColor;
        font-size: 16px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 20px;
      }
    }

    .add-project {
      width: 34px;
      height: 34px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .left-list {
    width: 306px;
    height: 100%;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);

    .project-list {
      padding: 0 10px;
      cursor: pointer;

      .line-box {
        padding: 12px 20px 12px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        display: flex;
        justify-items: center;
        align-items: center;

        .img-box {
          height: 44px;
          width: 44px;
          margin-right: 10px;
          background: url("../../assets/image/icon-p-default.png") center center
            no-repeat;
          background-size: 44px;
        }

        .name {
          flex: 1;
          width: 0;
          font-size: 16px;
          font-weight: bold;
          text-align: justify;
          color: @titleColor;
          line-height: 16px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        input {
          height: 30px;
          line-height: 30px;
          border-radius: 6px;
          font-size: 16px;
          padding-left: 10px;
        }
      }
    }

    .project-list.isActive {
      background: rgba(108, 203, 255, 0.25);

      .line-box {
        .img-box {
          background: url("../../assets/image/icon-p-active.png") center center
            no-repeat;
          background-size: 44px;
        }
      }
    }
  }

  .right-content {
    flex: 1;
    height: 100%;
    width: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .content-top {
      height: 81px;
      padding: 12px 74px 5px 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;

      .search-box {
        margin-right: 20px;
        padding: 0;
      }

      .left-box {
        .name {
          display: flex;
          align-items: center;

          span {
            margin: 0 10px;
            font-size: 18px;
            font-weight: bold;
            color: @titleColor;
            line-height: 18px;
          }

          img {
            width: 18px;
            cursor: pointer;
          }
        }

        .menu-box {
          margin-top: 16px;

          ul {
            height: 22px;
            display: flex;
            justify-content: center;
            align-items: center;

            li {
              cursor: pointer;
              width: 48px;
              margin-right: 30px;
              font-size: 14px;
              font-weight: 400;
              color: #666660;
              line-height: 14px;
              text-align: center;
            }

            li.checked {
              height: 22px;
              line-height: 22px;
              background: #51c1ff;
              border-radius: 5px;
              color: #ffffff;
            }
          }
        }
      }
    }

    .routerView_box {
      flex: 1;
      height: 0;
    }
  }
}
</style>
