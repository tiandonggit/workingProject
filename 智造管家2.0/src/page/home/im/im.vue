<template>
  <div class="im_page">
    <div class="list-block">
      <div class="search-box">
        <div class="search">
          <input v-model="searchText" placeholder="搜索" type="text" @change="getSearchList()"/>
        </div>
        <div class="add-group" @click.stop="$throttle(insertGroup)">
          <img src="../../../assets/images/icon_add.png" alt/>
        </div>
      </div>
      <div class="list-box">
        <el-scrollbar>
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
                  :src="item.targetType == 1 ? require('../../../assets/images/group_head_small.png') : item.headurl !== undefined ? item.headurl : item.chatList[0].sendUserHeadUrl"
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
              >{{item.unReadMessageCount > 99 ? "99+" : item.unReadMessageCount}}
              </div>
              <div
                  class="time"
              >{{$timestampToTime(Number(item.chatList[item.chatList.length - 1].sendTimestamp))}}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div
        class="delete-item"
        :style="{'left': menuLeft, 'top': menuTop}"
        v-show="menuShow"
        @click.stop="deleteItem"
    >删除
    </div>
    <div class="routerView_box">
      <router-view></router-view>
    </div>
    <member-dialog
        v-if="isShowMemberPopup"
        :memberList="memberList"
        :isShowMemberPopup="isShowMemberPopup"
        @insertGroupMember="insertGroupMember"
        @closePopup="closePopup"
        :memberType="'1'"
    ></member-dialog>
  </div>
</template>

<script>
  import memberDialog from "../../../components/memberDialog/memberDialog";
  import {mapState} from "vuex";

  export default {
    name: "im",
    components: {
      memberDialog
    },
    computed: {
      ...mapState(["homeData", "loginData", "imData", "mailListData"])
    },
    watch: {
      imData: {
        handler: function (newValue, oldValue) {
          this.imData.chatList.forEach((v, e) => {
            this.mailListData.groupList.forEach((v2, e2) => {
              if (v2.id == v.sessionId) {
                // console.log('this.mailListData.groupList: ', this.mailListData.groupList, v2.id);
                this.imData.chatList[e].groupname = this.mailListData.groupList[
                  e2
                  ].groupname;
              }
            });
          });
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        menuShow: false,
        menuLeft: 0,
        menuTop: 0,
        selectDetele: {}, // 保存选中需要删除的列表元素
        searchText: "",
        isShowMemberPopup: false,
        imlist: [],
        memberList: [] // 小组成员列表
      };
    },
    methods: {
      insertGroup() {
        this.memberList = this.mailListData.userList;
        this.isShowMemberPopup = true;
      },
      insertGroupMember(val) {
        this.$http
          .request({
            url: "/ImGroupController/insertGroup",
            method: "post",
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            body: {
              groupname: "",
              sendMessageId: this.$uuid(),
              imGroupUserList: val
            }
          })
          .then(res => {
            if (res.data.success) {
              this.$message({
                message: "群聊创建成功",
                type: "success"
              });
              this.$parent.getMailList();
              this.isShowMemberPopup = false;
              let item = {};
              item.groupname = res.data.data.groupname;
              item.id = res.data.data.groupid;
              this.$store.commit("homeData/imSelectedInfo", item);
              let par = {
                targetType: 1,
                sessionId: res.data.data.groupid,
                isActive: true,
                isShowSearch: true,
                unReadMessageCount: 0,
                chatList: [
                  {
                    noShow: true,
                    id: "",
                    sendTimestamp: new Date().getTime(),
                    sendUserId: "",
                    sendUserName: "",
                    sendUserHeadUrl: "",
                    toUserId: this.loginData.userMessage.userid,
                    toUserName: this.loginData.userMessage.nickname,
                    toUserHeadUrl: this.loginData.userMessage.headurl,
                    messageType: "0", // 特殊类型  页面不显示
                    isPlaying: false,
                    isReaded: false,
                    content: ""
                  }
                ],
                id: res.data.data.groupid,
                phone: this.homeData.listSelectedInfo.phone,
                groupname: res.data.data.groupname
              };
              this.imData.chatList.forEach((v, e) => {
                this.imData.chatList[e].isActive = false;
              });
              this.imData.chatList.push(par);
              this.$router.push({
                name: "groupChat"
              });
            } else {
              this.$message.error(res.data.message || "服务异常");
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      // 搜索会话
      getSearchList() {
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
            }
          }
          if (v.targetType == 0) {
            if (v.username) {
              if (v.username.search(this.searchText) != -1) {
                this.imData.chatList[e].isShowSearch = true;
              }
            } else if (v.chatList[0].sendUserName) {
              if (v.chatList[0].sendUserName.search(this.searchText) != -1) {
                this.imData.chatList[e].isShowSearch = true;
              }
            }
          }
        });
        console.log("this.imData.chatList: ", this.imData.chatList);
      },
      closePopup(val) {
        this.isShowMemberPopup = val;
      },
      selectIM(item) {
        // 当前选中聊天信息存入内存
        item.id = item.sessionId;
        this.mailListData.userList.forEach((v, e) => {
          if (v.id == item.id) {
            item.phone = v.phone;
          }
        });
        item.nickname =
          item.username !== undefined
            ? item.username
            : item.chatList[0].sendUserName;
        this.$store.commit("homeData/imSelectedInfo", item);
        // console.log('item: ', item);
        // console.log("this.homeData.imSelectedInfo", this.homeData.imSelectedInfo);
        this.imData.chatList.forEach((v, e) => {
          if (v.id === item.id) {
            this.imData.chatList[e].isActive = true;
            this.imData.chatList[e].unReadMessageCount = 0;
          } else {
            this.imData.chatList[e].isActive = false;
          }
        });
        let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
        this.$store.commit("imData/saveChatList", chatListVuex);
        if (item.targetType == "0") {
          this.$router.push({
            name: "singleChat"
          });
        } else if (item.targetType == "1") {
          this.$router.push({
            name: "groupChat"
          });
        }
      },
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
      deleteItem() {
        this.imData.chatList.forEach((v, e) => {
          if (v.sessionId == this.selectDetele.sessionId) {
            this.imData.chatList.splice(e, 1);
          }
        });
        if (this.selectDetele.sessionId == this.homeData.imSelectedInfo.id) {
          this.$router.push({name: "noChat"});
        }
        this.menuShow = false;
      }
    }
  };
</script>

<style scoped lang="less">
  .im_page {
    height: 100%;
    display: flex;
    position: relative;

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
      color: @exitGroupFontColor;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
    }

    .list-block {
      width: 306px;
      height: 100%;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
      z-index: 1;
      position: relative;
      display: flex;
      flex-direction: column;

      .search-box {
        width: 100%;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;

        .search {
          width: 181px;
          height: 50px;
          background-color: @searchBackgroundColor;
          border-radius: 10px;
          margin-right: 15px;
          padding: 15px 0 15px 45px;
          background-image: url("../../../assets/images/icon_search.png");
          background-position: 15px 15px;
          background-repeat: no-repeat;
          background-size: 21px;

          input {
            width: 100px;
            border: none;
            outline: none;
            background: @searchBackgroundColor;
            font-size: 16px;
            font-weight: 400;
            color: @subTitleColor;
            line-height: 20px;
          }
        }

        .add-group {
          width: 50px;
          height: 50px;
          cursor: pointer;

          img {
            display: block;
            width: 100%;
          }
        }
      }

      .list-box {
        flex: 1;
        height: 0;

        .item {
          display: flex;
          padding: 20px 0;
          cursor: pointer;
          position: relative;

          &::after {
            content: "";
            position: absolute;
            left: 20px;
            bottom: 0;
            width: 266px;
            height: 1px;
            background-color: rgba(0, 0, 0, 0.05);
            z-index: 1;
          }

          .left {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            overflow: hidden;
            margin-left: 20px;

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
              line-height: 18px;
              margin-bottom: 11px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
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
          background: rgba(0, 105, 255, 0.1);
        }
      }
    }

    .routerView_box {
      flex: 1;
      background-color: @mainBackgroundColor;
    }

    .el-dialog__wrapper {
      z-index: 1;
    }

    .popup-box {
      width: 270px;
      height: 593px;
      position: absolute;
      top: 85px;
      left: 131px;
      background: @mainBackgroundColor;
      box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      z-index: 2;
    }
  }
</style>
