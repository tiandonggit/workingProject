<template>
  <div class="imDrawer_page">
    <el-drawer
      :visible.sync="drawer"
      :modal-append-to-body="false"
      @close="closeDrawer"
      :with-header="false"
    >
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
      <div class="container" v-if="imData.chatList.length > 0">
        <el-scrollbar v-if="!isNoSearchResult">
          <div
            class="item"
            :class="{active: item.isActive}"
            v-for="(item, index) in imData.chatList"
            :key="index"
            @click.stop="selectIM(item)"
            @contextmenu.stop="contextmenu($event, item, index)"
            v-show="item.isShowSearch"
          >
            <div class="left">
              <img
                :src="item.targetType == 1 ? require('../../assets/image/group_head_small.png') : item.headurl !== undefined ? item.headurl : item.chatList[0].sendUserHeadUrl"
                alt
              />
            </div>
            <div class="middle">
              <p class="name" v-if="item.targetType == 0 && item.username">{{item.username}}</p>
              <p class="name" v-else-if="item.targetType == 0">{{item.chatList[0].sendUserName}}</p>
              <p class="name" v-else-if="item.targetType == 1">{{item.groupname}}</p>
              <span
                class="msg"
              >{{item.chatList[item.chatList.length - 1].messageType === 1 ? item.chatList[item.chatList.length - 1].content : item.chatList[item.chatList.length - 1].messageType === 2 ? "[语音]" : item.chatList[item.chatList.length - 1].messageType === 3 ? "[图片]" : item.chatList[item.chatList.length - 1].messageType === 4 ? "[文件]" : ""}}</span>
            </div>
            <div class="right">
              <div
                class="un-read"
                v-show="item.unReadMessageCount > 0"
              >{{item.unReadMessageCount > 99 ? "99+" : item.unReadMessageCount}}</div>
              <div
                class="time"
              >{{$timestampToTime(Number(item.chatList[item.chatList.length - 1].sendTimestamp))}}</div>
            </div>
          </div>
        </el-scrollbar>
        <div class="no-list" v-else>
          <img src="../../assets/image/no_search_result.png" alt />
          <p>未找到该内容，请重新搜索</p>
        </div>
      </div>
      <div class="no-list" v-else>
        <img src="../../assets/image/no_im.png" alt />
        <p>暂无信息！</p>
      </div>
      <div class="bottom-menu">
        <ul class="action_box">
          
          <!-- <li>
            <i
              class="icon-liaotian- iconfont"
              :class="[{'checked':actionChecked === 'chat'}]"
              @click.stop="imActionInit('chat')"
            ></i>
          </li> -->
          <li>
            <i
              class="icon-tongxunlu iconfont"
              :class="[{'checked':actionChecked === 'mailList'}]"
              @click.stop="imActionInit('mailList')"
            ></i>
          </li>
          <li>
            <i
              class="icon-jiahao1 iconfont"
              :class="[{'checked':actionChecked === 'addGroupChat'}]"
              @click.stop="imActionInit('addGroupChat')"
            ></i>
          </li>
          <li>
            <i
              class="icon-xiangzuo iconfont"
              :class="[{'checked':true}]"
              @click.stop="imActionInit('closeDrawer')"
            ></i>
          </li>
        </ul>
      </div>
    </el-drawer>

    <div
      class="delete-item"
      :style="{'left': menuLeft, 'top': menuTop}"
      v-show="menuShow"
      @click.stop="deleteItem"
    >删除</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "imDrawer",
  computed: {
    ...mapState(["homeData", "loginData", "imData", "mailListData"])
  },
  props: {
    drawerShow: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    drawerShow(val, oldval) {
      this.drawer = val;
    }
  },
  data() {
    return {
      drawer: false,
      menuShow: false,
      menuLeft: 0,
      menuTop: 0,
      searchText: "",
      isNoSearchResult: false,
      actionChecked: ""
    };
  },
  methods: {
    imActionInit(actionType) {
      this.actionChecked = actionType;
      if (actionType === "closeDrawer") {
        this.closeDrawer();
      } else if (actionType === "mailList") {
        this.$emit("showMailListDialog");
      } else if (actionType === "addGroupChat") {
        this.$emit("showCreateGroupDialog", {position: "1"});
      } else {
        // 路由操作 ----
      }
    },
    /**
     * 关闭抽屉
     * **/
    closeDrawer() {
      this.$emit("closeDrawer");
    },
    // 搜索会话
    getSearchList() {
      let num = 0;
      this.isNoSearchResult = false;
      if (!this.searchText) {
        this.imData.chatList.forEach((v, e) => {
          this.imData.chatList[e].isShowSearch = true;
        });
        return;
      }
      this.imData.chatList.forEach((v, e) => {
        this.imData.chatList[e].isShowSearch = false;
      });
      this.imData.chatList.forEach((v, e) => {
        if (v.targetType == 1) {
          if (v.groupname.search(this.searchText) != -1) {
            this.imData.chatList[e].isShowSearch = true;
            num++;
          }
        }
        if (v.targetType == 0) {
          if (v.username) {
            if (v.username.search(this.searchText) != -1) {
              this.imData.chatList[e].isShowSearch = true;
              num++;
            }
          } else if (v.chatList[0].sendUserName) {
            if (v.chatList[0].sendUserName.search(this.searchText) != -1) {
              this.imData.chatList[e].isShowSearch = true;
              num++;
            }
          }
        }
      });
      if (num === 0) {
        this.isNoSearchResult = true;
      }
      console.log("this.imData.chatList: ", this.imData.chatList);
    },
    selectIM(item) {
      this.$bus.emit("selectIMItem", item);
    },
    // 右键
    contextmenu(e, item, index) {
      e.preventDefault();
      this.selectDetele = item;
      this.menuShow = true;
      let showFlag = true;
      let top = e.pageY + 10 + "px";
      let left = e.pageX + 10 + "px";
      this.menuLeft = left;
      this.menuTop = top;

      document.onmouseup = () => {
        if (showFlag) {
          this.menuShow = false;
        }
        showFlag = true;
      };
    },
    // 删除会话
    deleteItem() {
      this.imData.chatList.forEach((v, e) => {
        if (v.sessionId == this.selectDetele.sessionId) {
          this.imData.chatList.splice(e, 1);
        }
      });
      this.menuShow = false;
    }
  },
  created() {
    console.log("this,imData:", this.imData);
    this.drawer = this.drawerShow;
  }
};
</script>

<style scoped lang="less">
.imDrawer_page {
  /deep/ .el-drawer__wrapper {
    position: absolute !important;
    right: 0;
  }

  /deep/ .el-drawer {
    width: 305px !important;
    background: @mainBackgroundColor;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);

    .el-drawer__body {
      display: flex;
      flex-direction: column;
    }
  }

  /deep/ .v-modal {
    opacity: 0 !important;
  }

  .search-box {
    padding: 12px 10px;
    height: 64px;

    .input-box {
      background: @searchBackgroundColor;
      border-radius: 10px;
      width: 286px;
      height: 40px;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 20px;
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

  .container {
    flex: 1;
    height: 0;

    .item {
      display: flex;
      padding: 12px 0;
      cursor: pointer;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        left: 10px;
        bottom: 0;
        width: 276px;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.05);
        z-index: 1;
      }

      .left {
        width: 44px;
        height: 44px;
        border-radius: 6px;
        overflow: hidden;
        margin-left: 10px;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .right {
        width: 40px;
        margin-right: 20px;
        position: relative;

        .un-read {
          width: fit-content;
          padding: 0 6px;
          height: 20px;
          line-height: 20px;
          background: @badgeFontColor;
          border-radius: 12px;
          font-size: 12px;
          color: @fontColorFFF;
          margin-top: 3px;
        }

        .time {
          font-size: 14px;
          font-weight: 400;
          color: @descTitleColor;
          line-height: 16px;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }

      .middle {
        flex: 1;
        width: 0;
        padding-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;

        .name {
          font-size: 16px;
          font-weight: bold;
          color: @titleColor;
          padding-top: 3px;
          margin-bottom: 8px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          line-height: 16px;
        }

        .msg {
          font-size: 14px;
          font-weight: 400;
          color: @descTitleColor;
          line-height: 16px;
        }
      }
    }

    .item:hover {
      background: rgba(0, 105, 255, 0.05);
    }

    .active {
      background: @bgActiveIM;
    }
  }

  .no-list {
    flex: 1;
    padding: 124px 12px 0;

    img {
      width: 245px;
      margin: 0 auto;
      display: block;
    }

    p {
      margin-top: 31px;
      text-align: center;
      font-size: 18px;
      font-weight: 400;
      color: @titleColor;
      line-height: 20px;
    }
  }

  .bottom-menu {
    height: 69px;
    padding: 15px 20px 20px 15px;

    .action_box {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      li {
        // width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 0 0 15px;

        i {
          font-size: 34px;
          color: rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        i.icon-xiangzuo {
          transform: rotate(180deg);
        }

        i.checked {
          color: @barBackgroundColor;
        }
      }
    }
  }

  .delete-item {
    cursor: pointer;
    margin: 0;
    background: @mainBackgroundColor;
    width: 100px;
    text-align: center;
    z-index: 100;
    position: fixed;
    list-style-type: none;
    padding: 15px 0;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 400;
    z-index: 9999;
    color: @exitGroupFontColor;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
  }
}
</style>
