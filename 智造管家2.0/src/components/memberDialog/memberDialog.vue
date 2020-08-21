<template>
  <div class="memberDialog_page">
    <div class="el-dialog__wrapper" v-show="isShowMemberPopup" @click="closePopup"></div>
    <div class="popup-box" v-show="isShowMemberPopup">
      <div class="search-box">
        <input v-model="searchText" placeholder="搜索" type="text" @change="getSearchList()" />
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
        <div class="btn1" @click.stop="closePopup">
          <span>取消</span>
        </div>
        <div class="btn2" :class="{'btnDisabled': checkList.length === 0}" @click.stop="confirm">
          <span>{{memberType == "1" ? "创建" : memberType == "2" ? "添加" : "删除"}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "memberDialog",
  props: {
    isShowMemberPopup: {
      type: Boolean,
      default() {
        return false;
      }
    },
    memberType: {
      type: String,
      default() {
        return "1"; // 1:创建；2：添加；3：删除。
      }
    },
    memberList: {
      type: Array,
      default() {
        return [];
      }
    },
    groupId: {
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
      memberListCopy:[],
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
      let par;
      this.memberType === "1" && (par = { name: this.searchText }); // 创建
      this.memberType === "2" && (par = { name: this.searchText, groupid: this.groupId, type: "add" }); // 添加群成员
      this.memberType === "3" && (par = { name: this.searchText, groupid: this.groupId, type: "delete" }); // 删除群成员
      this.$http
        .request({
          url: "/ImUserController/selectUserByName",
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: par
        })
        .then(res => {
          if (res.data.success) {
            this.memberListCopy = res.data.data.userList || [];
          } else {
            this.$message.error(res.data.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    closePopup() {
      this.checkList = [];
      this.searchText = "";
      this.$emit("closePopup", false);
    },
    confirm() {
      if (this.checkList.length === 0) return false;
      switch (this.memberType) {
        case "1":
          // console.log("创建");
          this.$emit("insertGroupMember", this.checkList);
          break;
        case "2":
          // console.log("增加");
          this.$emit("addGroupMember", this.checkList);
          break;
        case "3":
          // console.log("删除");
          this.$emit("removeGroupMember", this.checkList);
          // this.removeGroupMember();
          break;
        default:
          console.log("不知道什么操作。。。");
      }
      this.checkList = [];
      this.closePopup();
    }
  },
  created() {
    this.memberListCopy = this.memberList || [];
  }
};
</script>

<style scoped lang="less">
.memberDialog_page {
  .el-dialog__wrapper {
    z-index: 1;
  }

  .popup-box {
    width: 270px;
    height: 80%;
    position: absolute;
    top: 85px;
    left: 131px;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;

    .search-box {
      width: 230px;
      height: 36px;
      background-color: @searchBackgroundColor;
      border-radius: 10px;
      margin: 20px auto 10px;
      padding: 8px 0 8px 45px;
      background-image: url("../../assets/images/icon_search.png");
      background-position: 15px 8px;
      background-repeat: no-repeat;
      background-size: 21px;

      input {
        width: 100%;
        border: none;
        outline: none;
        background: @searchBackgroundColor;
        font-size: 16px;
        font-weight: 400;
        color: @subTitleColor;
        line-height: 20px;
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
        padding: 10px 20px;
        margin-right: 0;
        cursor: pointer;

        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: @mainColor;
          border-color: @mainColor;
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
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: block;
          margin-right: 10px;
        }

        p {
          font-size: 16px;
          font-weight: bold;
          color: @titleColor;
          line-height: 16px;
        }
      }
    }

    .btn-group {
      height: 66px;
      width: 100%;
      padding: 15px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);

      .btn1 {
        width: 94px;
        height: 36px;
        padding: 10px 0;
        text-align: center;
        border: 1px solid @mainColor;
        border-radius: 10px;
        cursor: pointer;

        span {
          font-size: 16px;
          font-weight: 400;
          color: @mainColor;
          line-height: 16px;
        }
      }

      .btn2 {
        cursor: pointer;
        width: 94px;
        height: 36px;
        padding: 10px 0;
        text-align: center;
        background: linear-gradient(270deg, @beginColor 0%, @mainColor 100%);
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
