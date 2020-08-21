<template>
  <div class="memberDialog_page">
    <div class="memberDialog__wrapper " v-show="isShowMemberPopup" @click.stop="closePopup"></div>
    <div class="popup-box" v-show="isShowMemberPopup">
      <div class="search-box">
        <p class="title">{{memberType == "2" ? "添加成员" : "删减成员"}}</p>
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
        <p class="list-title">通讯录</p>
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
          <span>确定 ({{checkList.length}})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { homeSrv } from "../../views/Home/home.service";
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
      let par;
      this.memberType === "2" &&
        (par = { name: this.searchText, groupid: this.groupId, type: "add" }); // 添加群成员
      this.memberType === "3" &&
        (par = {
          name: this.searchText,
          groupid: this.groupId,
          type: "delete"
        }); // 删除群成员
      homeSrv
        .getSearchMember(par)
        .then(res => {
          if (res.success) {
            this.memberListCopy = res.data.userList || [];
          } else {
            this.$message.error(res.message || "服务异常");
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
  width: 339px;
  height: 560px;
  z-index: 9999;
  position: absolute;
  top: 79px;
  left: 200px;

  .memberDialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
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
      padding: 0 20px;
      height: 126px;
      // background-color: @searchBackgroundColor;
      // border-radius: 10px;
      // margin: 20px auto 10px;
      // padding: 8px 0 8px 45px;
      /*background-image: url("../../assets/image/icon_search.png");*/
      background-position: 15px 8px;
      background-repeat: no-repeat;
      background-size: 21px;

      .title {
        line-height: 45px;
        font-size: 16px;
        font-weight: bold;
        color: @titleColor;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .list-title {
        line-height: 26px;
        font-size: 16px;
        font-weight: bold;
        color: @titleColor;
      }

      .input-box {
        background: @searchBackgroundColor;
        border-radius: 10px;
        width: 278px;
        height: 34px;
        padding: 0 10px;
        margin: 10px 0;
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
        padding: 10px 20px;
        margin-right: 0;
        cursor: pointer;

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
          width: 44px;
          height: 44px;
          border-radius: 10%;
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
      height: 50px;
      width: 100%;
      padding: 10px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);

      .btn1 {
        width: 129px;
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
        width: 129px;
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
