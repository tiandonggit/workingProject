<template>
  <div class="modal-box">
    <el-dialog
      class="projectAddMemberDialog_page"
      :modal-append-to-body="false"
      :visible.sync="isShowPeojectAddMemberDialog"
      :show-close="false"
      :before-close="handleClose"
    >
      <div class="popup-box">
        <div class="search-box">
          <div class="input-box">
            <img src="../../assets/image/icon-p-search.png" alt />
            <input
              v-model="searchText"
              @change="getSearchList()"
              type="text"
              name
              id
              placeholder="请输入搜索内容"
            />
          </div>
        </div>
        <div class="member-list">
          <el-scrollbar>
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="item.id" v-for="(item, index) in memberListCopy" :key="index">
                <div class="member-info">
                  <img :src="item.headurl" alt />
                  <p>{{item.nickname}}</p>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </el-scrollbar>
        </div>
        <div class="btn-group">
          <div class="btn1" @click.stop="handleClose">
            <span>取消</span>
          </div>
          <div class="btn2" :class="{'btnDisabled': checkList.length === 0}" @click.stop="confirm">
            <span>添加</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectSrv } from "../../views/Project/project.service";
export default {
  name: "projectAddMemberDialog",
  computed: {
    ...mapState(["projectData"])
  },
  props: {
    isShowPeojectAddMemberDialog: {
      type: Boolean,
      default() {
        return false;
      }
    },
    memberList: {
      type: Array,
      default() {
        return [];
      }
    },
    projectId: {
      // 小组id
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      searchText: "",
      checkList: [],
      memberListCopy: []
    };
  },
  watch: {
    memberType(newValue, oldValue) {
      this.checkList = [];
      this.searchText = "";
    },
    memberList(newValue, oldValue) {
      this.memberListCopy = newValue || [];
    }
  },
  methods: {
    getSearchList() {
      let reg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){0,20}$/;
      if(!reg.test(this.searchText)) {
        this.$message.error("只允许输入中英文和数字");
        return;
      }
      let par;
      par = { name: this.searchText, projectId: this.projectData.selectedProject.id }; // 添加群成员// 删除群成员
      projectSrv
        .getProjectOutMember(par)
        .then(res => {
          if (res.success) {
            this.memberListCopy = res.data || [];
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleClose() {
      this.checkList = [];
      this.searchText = "";
      this.$emit("closePopup", false);
    },
    confirm() {
      if (this.checkList.length === 0) return false;
      this.$emit("addProjectMemberSubmit", this.checkList);
    }
  },
  created() {
    this.memberListCopy = this.memberList || [];
  }
};
</script>

<style scoped lang="less">
.projectAddMemberDialog_page {
  /deep/ .el-dialog {
    border-radius: 10px;
    overflow: hidden;
    width: 448px !important;
    height: 593px;
    margin-top: 129px !important;
  }

  /deep/ .el-dialog__header {
    padding: 0 !important;
  }

  /deep/ .el-dialog__footer {
    padding: 20px !important;
  }

  /deep/ .el-dialog__body {
    height: 100%;
    padding: 0 !important;
  }

  .popup-box {
    width: 100%;
    height: 100%;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index:10001;

    .search-box {
      width: 100%;
      padding: 15px 10px;
      height: 66px;
      background-position: 15px 8px;
      background-repeat: no-repeat;
      background-size: 21px;

      .input-box {
        background: @searchBackgroundColor;
        border-radius: 10px;
        width: 428px;
        height: 36px;
        padding: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 18px;
          margin-right: 10px;
        }

        input {
          flex: 1;
          background: @searchBackgroundColor;
          font-size: 16px;
          font-weight: 400;
          color: @subTitleColor;
          line-height: 20px;
        }
      }
    }

    .member-list {
      flex: 1;
      width: 100%;
      overflow-y: auto;

      /deep/ .el-checkbox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse;
        padding: 6px 10px;
        margin-right: 0;
        cursor: pointer;

        &:hover {
          background: @bgActiveIM;
        }

        .el-checkbox__label {
          padding-left: 0;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: @addBtnColor;
          border-color: @addBtnColor;
        }

        .el-checkbox__input {
          width: 20px;
          height: 20px;
          border-radius: 50%;

          .el-checkbox__inner {
            width: 20px;
            height: 20px;
            border-radius: 50%;

            &::after {
              width: 5px;
              height: 11px;
              left: 6px;
            }
          }
        }

        .member-info {
          display: flex;
          align-items: center;
          margin-right: 0;
        }

        // &:hover {
        //   background: rgba(0, 105, 255, 0.05);
        // }

        img {
          width: 36px;
          height: 36px;
          border-radius: 6%;
          display: block;
          margin-right: 10px;
        }

        p {
          font-size: 16px;
          // font-weight: bold;
          color: @titleColor;
          line-height: 16px;
        }
      }
    }

    .btn-group {
      height: 54px;
      width: 100%;
      padding: 12px 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);

      .btn1 {
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid @addBtnColor;
        border-radius: 10px;
        cursor: pointer;

        span {
          font-size: 16px;
          font-weight: 400;
          color: @addBtnColor;
          line-height: 16px;
        }
      }

      .btn2 {
        cursor: pointer;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: @addBtnColor;
        border-radius: 10px;

        span {
          font-size: 16px;
          font-weight: 400;
          color: @fontColorFFF;
          line-height: 16px;
        }
      }
      .btnDisabled {
        background: rgba(204, 204, 204, 1);
      }
    }
  }
}
</style>
