/**
*@desc mailListDialog
*@author tiandong
*@date 2020/03/23 11:14:23
*/
<template>
  <div class="modal-box">
    <el-dialog
      class="mailListDialog_page"
      :modal-append-to-body="false"
      :visible.sync="isShowMailListDialog"
      :show-close="false"
      :before-close="handleClose"
    >
      <div class="mailList-container">
        <div class="left-box">
          <div
            class="item-box"
            :class="{isActive : space.isActive}"
            v-for="(space, index) in mailListSpace"
            :key="index"
            @click.stop="selectMailListSpace(index)"
          >
            <div class="line-box">
              <div class="left-img">
                <img v-if="space.isActive" :src="space.activeImg" alt />
                <img v-else :src="space.img" alt />
              </div>
              <div class="right-text">{{space.text}}</div>
            </div>
          </div>
        </div>
        <div class="middle-box">
          <div v-show="this.spaceType == 1" class="search-box">
            <div class="search">
              <input v-model="searchText" placeholder="搜索" type="text" @change="getSearchList()" />
            </div>
          </div>
          <div class="list-box-flex">
            <el-scrollbar>
              <div class="serach-list" v-if="searchList.length > 0">
                <div
                  class="menu-item"
                  v-for="(item, index) in searchList"
                  :key="index"
                  :class="{active: item.isActive}"
                >
                  <div class="list-box" @click.stop="lookInfo('0', item)">
                    <div class="item">
                      <div class="left">
                        <img :src="item.headurl" alt />
                      </div>
                      <div class="middle">
                        <p class="name">{{item.nickname}}</p>
                        <p class="msg">{{item.phone}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="searchList.length === 0 && !isNoSearchResult && spaceType == 1"
                class="menu"
              >
                <el-menu default-active="0">
                  <el-submenu index="1">
                    <template slot="title">
                      <span>通讯录</span>
                      <span class="count">{{mailListData.userList.length}}</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item
                        v-for="(item, index) in mailListData.userList"
                        :key="index"
                        :class="{active: item.isActive}"
                      >
                        <div class="list-box" @click.stop="lookInfo('0', item)">
                          <div class="item">
                            <div class="left">
                              <img :src="item.headurl" alt />
                            </div>
                            <div class="middle">
                              <p class="name">{{item.nickname}}</p>
                              <p class="msg">{{item.phone}}</p>
                            </div>
                          </div>
                        </div>
                      </el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                </el-menu>
              </div>
              <div
                v-if="searchList.length === 0 && !isNoSearchResult && spaceType == 2"
                class="menu"
              >
                <el-menu default-active="0">
                  <el-submenu index="1">
                    <template slot="title">
                      <span>群聊</span>
                      <span class="count">{{mailListData.groupList.length}}</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item
                        v-for="(item, index) in mailListData.groupList"
                        :key="index"
                        :class="{active: item.isActive}"
                      >
                        <div class="list-box" @click.stop="lookInfo('1', item)">
                          <div class="item">
                            <div class="left">
                              <img src="../../assets/image/group_head_small.png" alt />
                            </div>
                            <div class="middle">
                              <p class="name">{{item.groupname}}</p>
                            </div>
                          </div>
                        </div>
                      </el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                </el-menu>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="right-box">
          <div class="single-box" v-if="homeData.listSelectedInfo.targetType == '0'">
            <div class="block-top">
              <div class="name">{{homeData.listSelectedInfo.nickname}}</div>
              <div class="img">
                <img :src="homeData.listSelectedInfo.headurl" alt />
              </div>
            </div>
            <p class="phone">
              手机号码：
              <span>{{homeData.listSelectedInfo.phone}}</span>
            </p>
            <div class="send-msg" @click.stop="sendMsgBtn">发消息</div>
          </div>
          <div class="group-box" v-if="homeData.listSelectedInfo.targetType == '1'">
            <img src="../../assets/image/group_head_small.png" alt />
            <p class="name">{{homeData.listSelectedInfo.groupname}}</p>
            <div class="send-msg" @click.stop="sendMsgBtn">发消息</div>
            <!-- <p class="delete" @click.stop="outGroup(homeData.listSelectedInfo.id)">从通讯录中删除</p> -->
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { homeSrv } from "../../views/Home/home.service";

export default {
  name: "mailListDialog",
  components: {},
  props: {
    isShowMailListDialog: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    ...mapState(["homeData", "loginData", "imData", "mailListData"])
  },

  data() {
    return {
      mailListSpace: [
        {
          text: "个人联系人",
          img: require("../../assets/image/personal_space_icon_gray.png"),
          activeImg: require("../../assets/image/personal_space_icon_white.png"),
          isActive: true
        },
        {
          text: "我的群聊",
          img: require("../../assets/image/group_space_icon_gray.png"),
          activeImg: require("../../assets/image/group_space_icon_white.png"),
          isActive: false
        }
      ],
      spaceType: 1,
      searchText: "",
      searchList: [],
      isNoSearchResult: false
    };
  },
  methods: {
    getSearchList() {
      if (!this.searchText) {
        this.searchList = [];
        this.isNoSearchResult = false;
        return;
      }
      homeSrv
        .searchByChatName({ name: this.searchText })
        .then(res => {
          if (res.success) {
            this.searchList = res.data.userList;
            if (res.data.userList.length === 0) {
              this.isNoSearchResult = true;
            }
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    selectMailListSpace(index) {
      this.spaceType = index + 1;
      this.mailListSpace.forEach((v, e) => {
        if (e == index) {
          v.isActive = true;
        } else {
          v.isActive = false;
        }
      });
    },
    lookInfo(targetType, item) {
      // 当前选中聊天信息存入内存
      item.targetType = targetType;
      this.$store.commit("homeData/listSelectedInfo", item);
    },
    sendMsgBtn() {
      this.$store.commit(
        "homeData/imSelectedInfo",
        this.homeData.listSelectedInfo
      );
      if (this.homeData.listSelectedInfo.targetType == "0") {
        let par = {
          targetType: 0,
          sessionId: this.homeData.listSelectedInfo.id,
          isActive: true,
          isShowSearch: true,
          unReadMessageCount: 0,
          chatList: [
            {
              noShow: true,
              id: "",
              sendTimestamp: new Date().getTime(),
              sendUserId: this.homeData.listSelectedInfo.id,
              sendUserName: this.homeData.listSelectedInfo.nickname,
              sendUserHeadUrl: this.homeData.listSelectedInfo.headurl,
              toUserId: this.loginData.userMessage.userid,
              toUserName: this.loginData.userMessage.nickname,
              toUserHeadUrl: this.loginData.userMessage.headurl,
              messageType: "1",
              isPlaying: false,
              isReaded: false,
              content: " "
            }
          ],
          id: this.homeData.listSelectedInfo.id,
          phone: this.homeData.listSelectedInfo.phone,
          username: this.homeData.listSelectedInfo.nickname,
          headurl: this.homeData.listSelectedInfo.headurl
        };
        let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
        if (chatListVuex.length == 0) {
          chatListVuex.unshift(par);
        } else {
          let num = 0;
          chatListVuex.forEach((v, e) => {
            if (this.homeData.listSelectedInfo.id == v.sessionId) {
              chatListVuex[e].isActive = true;
            } else {
              chatListVuex[e].isActive = false;
              num++;
            }
          });
          if (num == chatListVuex.length) {
            chatListVuex.unshift(par);
          }
        }
        this.$store.commit("imData/saveChatList", chatListVuex);
        this.$emit("sendMsgBtn");
      } else if (this.homeData.listSelectedInfo.targetType == "1") {
        let par = {
          targetType: 1,
          sessionId: this.homeData.listSelectedInfo.id,
          isActive: true,
          isShowSearch: true,
          unReadMessageCount: 0,
          chatList: [
            {
              noShow: true,
              id: "",
              sendTimestamp: new Date().getTime(),
              sendUserId: this.homeData.listSelectedInfo.id,
              sendUserName: this.homeData.listSelectedInfo.nickname,
              sendUserHeadUrl: this.homeData.listSelectedInfo.headurl,
              toUserId: this.loginData.userMessage.userid,
              toUserName: this.loginData.userMessage.nickname,
              toUserHeadUrl: this.loginData.userMessage.headurl,
              messageType: "1",
              isPlaying: false,
              isReaded: false,
              content: " "
            }
          ],
          id: this.homeData.listSelectedInfo.id,
          phone: this.homeData.listSelectedInfo.phone,
          groupname: this.homeData.listSelectedInfo.groupname
        };
        let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
        if (chatListVuex.length == 0) {
          chatListVuex.unshift(par);
        } else {
          let num = 0;
          chatListVuex.forEach((v, e) => {
            if (this.homeData.listSelectedInfo.id == v.sessionId) {
              chatListVuex[e].isActive = true;
            } else {
              chatListVuex[e].isActive = false;
              num++;
            }
          });
          if (num == chatListVuex.length) {
            chatListVuex.unshift(par);
          }
        }
        this.$store.commit("imData/saveChatList", chatListVuex);
        this.$emit("sendMsgBtn");
      }
    },
    /**
     * handleClose
     * **/
    handleClose() {
      this.$emit("closeMailListDialog");
    }
  },
  created() {}
};
</script>

<style scoped lang="less">
.modal-box {
  /deep/ .v-modal {
    opacity: 0.2 !important;
  }
}
.mailListDialog_page {
  /deep/ .el-dialog {
    border-radius: 10px;
    overflow: hidden;
    width: 946px !important;
    height: 77%;
    margin-top: 115px !important;
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

  /deep/ .el-menu-item:hover,
  /deep/ .el-submenu__title:hover {
    background-color: @bgActiveIM;
  }

  .mailList-container {
    width: 100%;
    height: 100%;
    display: flex;

    .left-box {
      width: 200px;
      height: 100%;
      background: @mainBackgroundColor;
      box-shadow: 2px 0px 5px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px 0px 0px 10px;
      z-index: 2;

      .item-box {
        height: 68px;
        padding: 0 8px 0 12px;

        .line-box {
          height: 100%;
          // border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;

          .left-img {
            width: 44px;
            height: 44px;
            margin-right: 10px;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }

          .right-text {
            font-size: 16px;
            font-weight: 400;
            color: @titleColor;
            line-height: 22px;
          }
        }
      }

      .isActive {
        background: @bgActiveIM;
      }
    }

    .middle-box {
      width: 250px;
      height: 100%;
      background: @mainBackgroundColor;
      box-shadow: 2px 0px 5px 0px rgba(0, 0, 0, 0.1);
      // border-radius: 10px 0px 0px 10px;
      z-index: 1;
      display: flex;
      flex-direction: column;

      .search-box {
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;

        .search {
          width: 230px;
          height: 40px;
          background-color: @searchBackgroundColor;
          border-radius: 10px;
          padding: 10px 15px 10px 45px;
          background-image: url("../../assets/image/icon_search.png");
          background-position: 10px 10px;
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
      }
      .list-box-flex {
        flex: 1;
        height: 0;
      }

      .menu {
        /deep/ .el-menu {
          border-right: none;

          .el-submenu__title {
            padding-left: 50px !important;

            span {
              font-size: 16px;
              font-weight: bold;
              color: @titleColor;
              line-height: 16px;
            }

            .count {
              float: right;
              font-size: 14px;
              font-weight: 400;
              color: @mainColor;
              line-height: 56px;
            }

            .el-submenu__icon-arrow {
              position: absolute;
              top: 50%;
              left: 20px;
              right: auto;
              margin-top: -9px;
              font-size: 18px;
              color: @descTitleColor;
            }
          }

          .el-menu-item-group__title {
            padding: 0;
          }

          .el-menu-item {
            height: 65px;
            padding: 0 16px 0 10px !important;
          }
        }
      }

      .menu-item {
        height: 65px;
        padding: 0 30px;
      }

      .list-box {
        height: 66px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);

        .item {
          height: 65px;
          display: flex;
          padding: 11px 0;
          cursor: pointer;
          position: relative;

          .left {
            width: 44px;
            height: 44px;
            border-radius: 10%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              display: block;
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
            display: flex;
            flex-direction: column;
            justify-content: center;

            .name {
              font-size: 16px;
              // font-weight: bold;
              color: @titleColor;
              line-height: 16px;
              margin-bottom: 6px;
              padding-top: 4px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            .msg {
              font-size: 14px;
              font-weight: 400;
              color: @subTitleColor;
              line-height: 14px;
            }
          }
        }

        .active {
          background: @bgActiveIM;
        }
      }
    }

    .right-box {
      flex: 1;
      width: 0;

      .single-box {
        padding: 120px 88px 0;

        .block-top {
          padding: 30px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          .name {
            font-size: 24px;
            font-weight: 400;
            color: @titleColor;
            line-height: 24px;
          }

          .img {
            width: 80px;
            height: 80px;
            border-radius: 6%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
        }

        .phone {
          margin: 20px 0 50px;
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          color: @subTitleColor;
          line-height: 18px;

          span {
            color: @titleColor;
          }
        }

        .send-msg {
          width: 111px;
        }
      }

      .group-box {
        padding-top: 180px;
        text-align: center;

        img {
          width: 120px;
          display: block;
          margin: 0 auto;
        }

        .name {
          margin: 20px 0 50px;
          font-size: 24px;
          font-weight: 400;
          color: @titleColor;
          line-height: 24px;
        }

        .send-msg {
          width: 110px;
        }

        .delete {
          margin-top: 225px;
          font-size: 14px;
          font-weight: 400;
          color: @subTitleColor;
          line-height: 14px;

          &:hover {
            color: @exitGroupFontColor;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }

      .send-msg {
        height: 30px;
        margin: 0 auto;
        background: @addBtnColor;
        border-radius: 10px;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        font-weight: 400;
        color: @fontColorFFF;
        line-height: 30px;

        &:hover {
          background: rgba(1, 128, 255, 0.6);
        }
      }
    }
  }
}
</style>
