<template>
  <div class="member_page">
    <div class="container">
      <div class="title">项目成员</div>
      <div class="member-box">
        <div class="cell-box" v-for="(member, index) in projectMember" :key="index" @click.stop="memberDetails(member)">
          <div class="img">
            <img :src="member.headurl" alt />
          </div>
          <div class="name">{{member.nickname}}</div>
        </div>
      </div>
      <div class="add-member" @click.stop="addProjectMember">添加成员</div>
    </div>

    <!-- 群聊增减成员 -->
    <project-add-member-dialog
      v-if="isShowProjectAddMemberDialog"
      :memberList="memberList"
      :isShowPeojectAddMemberDialog="isShowProjectAddMemberDialog"
      @addProjectMemberSubmit="addProjectMemberSubmit"
      @closePopup="closeProjectAddMemberDialog"
      :projectId="projectData.selectedProject.id"
    ></project-add-member-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import projectAddMemberDialog from "@/components/memberDialog/projectAddMemberDialog";
import { projectSrv } from "./project.service";
export default {
  name: "member",
  computed: {
    ...mapState(["homeData", "loginData", "imData", "mailListData", "projectData"])
  },
  components: {
    projectAddMemberDialog
  },
  data() {
    return {
      isShowProjectAddMemberDialog: false,
      memberList: [],
      projectMember: []
    };
  },
  watch: {
    projectData: {
      handler: function(newValue, oldValue) {
        this.getProjectMember();
      },
      deep: true,
      immediate: true
    }
  },
  created () {
  },
  methods: {
    // 获取项目成员
    getProjectMember(){
      projectSrv
        .getProjectMember({ projectId: this.projectData.selectedProject.id })
        .then(response => {
          if (response.success) {
            this.projectMember = response.data
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 查看成员信息
    memberDetails(member) {
      this.$store.commit("projectData/saveSelectedMember", member);
      this.$router.push({ name: "memberDetails" });
    },
    // 添加成员
    addProjectMember() {
      projectSrv
        .getProjectOutMember({ projectId: this.projectData.selectedProject.id })
        .then(response => {
          if (response.success) {
            this.memberList = response.data;
            this.isShowProjectAddMemberDialog = true;
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addProjectMemberSubmit(v) {
      let par = {
        projectId: this.projectData.selectedProject.id,
        userIds: v.join(",")
      }
      projectSrv
        .projectAddMember(par)
        .then(response => {
          if (response.success) {
            this.$message.success(response.message);
            this.getProjectMember();
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.isShowProjectAddMemberDialog = false;
    },
    closeProjectAddMemberDialog() {
      this.isShowProjectAddMemberDialog = false;
    }
  }
};
</script>

<style scoped lang="less">
.member_page {
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
      margin: 15px 0 15px;

      .cell-box {
        cursor: pointer;
        float: left;
        margin: 0 25px 15px 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        .img {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 9px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          font-size: 14px;
          font-weight: 400;
          color: @titleColor;
          line-height: 16px;
        }
      }
    }

    .add-member {
      cursor: pointer;
      width: 165px;
      height: 32px;
      background: @addBtnColor;
      border-radius: 10px;
      font-size: 16px;
      text-align: center;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @fontColorFFF;
      line-height: 32px;
    }
  }
}
</style>
