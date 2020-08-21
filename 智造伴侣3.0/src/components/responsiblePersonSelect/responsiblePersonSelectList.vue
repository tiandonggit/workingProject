/**
* @Description: 负责人选择
* @Author: 侯湃
* @Date: 2020/6/23
*/
<template>
  <div
    :class="[{'subTaskDialog':taskType === 'subTask' || taskType === 'addTask','responsiblePersonSelect_page':taskType !== 'subTask' && taskType !== 'addTask'}]"
    :style="{'left': positionLeft, 'top': positionTop}"
  >
    <div class="input-box" @click.stop="$stopstop">
      <img src="../../assets/image/icon-p-search.png" alt/>
      <input
          type="text"
          @click.stop="$stopstop"
          placeholder="搜索"
          v-model="searchText"
          @input="getSearchProjectMember"/>
    </div>
    <ul class="project_member">
      <li v-for="item in projectMember"
          v-if="item.isShowSearch"
          @click.stop="responsiblePersonUpdate(item)"
          :key="item.id">
        <img
            :src="item.headurl"
            alt=""
            class="head">
        <span class="member_name">
          {{item.nickname || ""}}
        </span>
        <img
            v-if="execUser === item.id"
            src="../../assets/image/selected.png"
            alt="">
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import {projectSrv} from "../../views/Project/project.service";

  export default {
    name: "responsiblePersonSelect",
    computed: {
      ...mapState(["projectData"])
    },
    props: {
      execUser: {
        type: [String, Number],
        default() {
          return 1;
        }
      },
      taskType: {
        type: String,
        default() {
          return "";
        }
      },
      taskId: {
        type: [String, Number],
        default() {
          return "";
        }
      },
      positionLeft: {
        type: [String, Number],
        default() {
          return "";
        }
      },
      positionTop: {
        type: [String, Number],
        default() {
          return "";
        }
      }
    },
    data() {
      return {
        searchText: "",
        projectMember: [] // 项目成员列表
      };
    },
    methods: {
      /**
       * 获取项目成员列表
       * **/
      getProjectMemberList() {
        projectSrv.getProjectMember({projectId: this.projectData.selectedProject.id}).then(response => {
          if (response.success) {
            let projectMember = response.data || [];
            projectMember.forEach(item => {
              item.isShowSearch = true;
            });
            this.projectMember = projectMember;
          } else {
            this.$message.error(response.message);
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 项目成员搜索
       * **/
      getSearchProjectMember() {
        if (!this.searchText) {
          this.projectMember.forEach(item => {
            item.isShowSearch = true;
          });
          return false;
        } else {
          this.projectMember.forEach(item => {
            item.isShowSearch = item.nickname.search(this.searchText) != -1;
          });
        }
      },
      /**
       * 更新项目负责人
       * **/
      responsiblePersonUpdate(memberItem) {
        let params = {
          execUser: memberItem.id,
          execUserNickname: memberItem.nickname,
          id: this.taskId,
          taskType: this.taskType
        };
        this.$emit("responsiblePersonUpdate", params);
      }
    },
    created() {
      this.getProjectMemberList();
    }
  };
</script>

<style scoped lang="less">

  .subTaskDialog {
    display: flex;
    flex-direction: column;
    position: fixed;
    width: 160px;
    height: 154px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    z-index: 9999;
    overflow: hidden;
    bottom: 30px;
    left: 4px;

    .input-box {
      background: @mainBackgroundColor;
      width: 100%;
      padding: 10px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      img {
        width: 21px;
        margin-right: 9px;
        margin-left: -6px;
      }

      input {
        flex: 1;
        width: 100px;
        background: @mainBackgroundColor;
        font-size: 16px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 20px;
      }
    }

    .project_member {
      flex: 1;
      height: 0;
      overflow-y: scroll;

      li {
        display: flex;
        padding: 6px 8px;
        align-items: center;

        img.head {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        img {
          display: block;
          width: 20px;
          height: 20px;
        }

        .member_name {
          flex: 1;
          width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          line-height: 18px;
          font-weight: 400;
          color: @titleColor;
          padding-left: 10px;
        }
      }
    }
  }

  .responsiblePersonSelect_page {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 227px;
    height: 154px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    top: 30px;
    left: 4px;
    z-index: 9999;
    overflow: hidden;

    .input-box {
      background: @mainBackgroundColor;
      width: 100%;
      padding: 10px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      img {
        width: 21px;
        margin-right: 9px;
        margin-left: -6px;
      }

      input {
        flex: 1;
        width: 100px;
        background: @mainBackgroundColor;
        font-size: 16px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 20px;
      }
    }

    .project_member {
      flex: 1;
      height: 0;
      overflow-y: scroll;

      li {
        display: flex;
        padding: 6px 8px;
        align-items: center;

        img.head {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        img {
          display: block;
          width: 20px;
          height: 20px;
        }

        .member_name {
          flex: 1;
          width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          line-height: 18px;
          font-weight: 400;
          color: @titleColor;
          padding-left: 10px;
        }
      }
    }
  }
</style>
