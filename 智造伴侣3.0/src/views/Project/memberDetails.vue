<template>
  <div class="memberDetails_page">
    <div class="container">
      <div class="title">项目成员</div>
      <div class="title">{{projectData.selectedMember.nickname}}</div>
      <div class="member-box">
        <p class="remove-hint">从团队中移除 {{projectData.selectedMember.nickname}}</p>
        <span>被移除的成员将不能再访问项目信息，但相关数据不会被删除。</span>
        <div
          class="remove-btn"
          @click.stop="deleteMember"
        >确定并移除 {{projectData.selectedMember.nickname}}</div>
        <div class="permission">
          <p>权限</p>
          <el-radio v-model="radio" :label="1">管理员</el-radio>
          <el-radio v-model="radio" :label="0">成员</el-radio>
        </div>
      </div>
      <div class="add-member" @click="saveSettins">保存设置</div>
    </div>
  </div>
</template>

<script>
import { projectSrv } from "./project.service";
import { mapState } from "vuex";
export default {
  name: "memberDetails",
  computed: {
    ...mapState(["projectData"])
  },
  data() {
    return {
      memberId: "",
      radio: ""
    };
  },
  created() {
    this.radio = this.projectData.selectedMember.role;
  },
  methods: {
    // 删除成员
    deleteMember() {
      let par = {
        projectId: this.projectData.selectedProject.id,
        userId: this.projectData.selectedMember.id
      };
      projectSrv
        .projectDeleteMember(par)
        .then(response => {
          if (response.success) {
            this.$message.success(response.message);
            this.$router.go(-1);
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 保存设置
    saveSettins() {
      console.log(this.radio);
      let par = {
        projectId: this.projectData.selectedProject.id,
        userId: this.projectData.selectedMember.id,
        role: this.radio
      };
      projectSrv
        .projectUpdateMember(par)
        .then(response => {
          if (response.success) {
            this.$message.success(response.message);
            let selectedMemberVuex = JSON.parse(
              JSON.stringify(this.projectData.selectedMember)
            );
            selectedMemberVuex.role = this.radio;
            this.$store.commit(
              "projectData/saveSelectedMember",
              selectedMemberVuex
            );
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped lang="less">
.memberDetails_page {
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
      margin-bottom: 5px;

      &:first-child {
        margin-bottom: 30px;
      }
    }

    .member-box {
      margin: 15px 0 60px;

      .remove-hint {
        font-size: 14px;
        font-weight: 400;
        color: @titleColor;
        line-height: 16px;
        margin-bottom: 9px;
      }

      span {
        font-size: 14px;
        font-weight: 400;
        color: @descTitleColor;
        line-height: 14px;
      }

      .remove-btn {
        cursor: pointer;
        width: 139px;
        height: 26px;
        background: rgba(255, 48, 0, 0.7);
        border-radius: 10px;
        font-size: 14px;
        font-weight: 400;
        color: @fontColorFFF;
        line-height: 26px;
        margin: 15px 0 20px;
        text-align: center;
      }

      .permission {
        p {
          font-size: 14px;
          font-weight: 400;
          color: @titleColor;
          line-height: 16px;
          margin-bottom: 15px;
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
