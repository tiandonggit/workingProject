/**
* @Description: Home页
* @Author: 侯湃
* @Date: 2020/6/11
*/
<template>
  <div class="home_page">
    <div class="content_box">
      <header-bar></header-bar>
      <div class="routerView_box">
        <router-view></router-view>
        <im-bar
          ref="imBar"
          @openDrawerShow="openDrawerShow"
          @showCreateGroupDialog="showCreateGroupDialog"
          @showMailListDialog="showMailListDialog"
          @lookNewMsg="lookNewMsg"
        ></im-bar>
        <im-drawer
          ref="menuBar"
          :imData="imData"
          @showMailListDialog="showMailListDialog"
          @showCreateGroupDialog="showCreateGroupDialog"
          :drawerShow="drawerShow"
          @closeDrawer="drawerShow=false"
        ></im-drawer>
      </div>
    </div>
    <!-- 会话弹窗 -->
    <im-dialog :imDialogShow="imDialogShow" v-if="imDialogShow" @closeImDialog="closeImDialog"></im-dialog>
    <!-- 通讯录 -->
    <mail-list-dialog
      :isShowMailListDialog="isShowMailListDialog"
      v-if="isShowMailListDialog"
      @closeMailListDialog="closeMailListDialog"
      @sendMsgBtn="sendMsgBtn"
    ></mail-list-dialog>
    <!-- 创建群聊弹窗 -->
    <div
      class="create-dialog__wrapper el-dialog__wrapper"
      v-show="isShowCreateGroupPopup"
      @click.stop="closeCreateGroupPopup"
    ></div>
    <div
      class="create-group-popup"
      :style="{'bottom': positionBottom, 'right': positionRight}"
      v-show="isShowCreateGroupPopup"
    >
      <div class="popup-box">
        <div class="flex-box">
          <div class="top">
            <div class="search-box">
              <input v-model="searchText" @change="getSearchList" placeholder="搜索" type="text" />
            </div>
            <div class="btn" @click.stop="createGroup">创建</div>
          </div>
          <div class="edit-member">
            <!-- <el-scrollbar> -->
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="item.id" v-for="(item, index) in memberList" :key="index">
                <div class="member-info">
                  <img :src="item.headurl" alt />
                  <p>{{item.nickname}}</p>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <!-- </el-scrollbar> -->
          </div>
        </div>
        <div class="jiantou"></div>
      </div>
    </div>
    <!-- 清单信息 -->
    <inventory-info-dialog
      :isShowInventoryInfoDialog="isShowInventoryInfoDialog"
      v-if="isShowInventoryInfoDialog"
      @closeInventoryInfoDialog="closeInventoryInfoDialog"
    ></inventory-info-dialog>
  </div>
</template>

<script>
import headerBar from "@/components/headerBar/headerBar";
import imBar from "@/components/imBar/imBar";
import imDrawer from "@/components/imDrawer/imDrawer";
import imDialog from "@/components/chat/imDialog";
import mailListDialog from "@/components/chat/mailListDialog";
import inventoryInfoDialog from "@/components/projectDialog/inventoryInfoDialog";
import proto from "@/utils/ImServerProto_pb";
import { mapState } from "vuex";
import { homeSrv } from "./home.service";

export default {
  name: "home",
  components: {
    headerBar,
    imBar,
    imDrawer,
    imDialog,
    mailListDialog,
    inventoryInfoDialog
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
      drawerShow: false, // IM抽屉
      websocket: null, // websocket
      reconnectCount: 0, // websocket重连次数
      ImLogin: new proto.ImLogin(), // im登录
      ImMessageAck: new proto.ImMessageAck(), // Ack回复,确认已收到离线消息
      imDialogShow: false, // 会话弹窗
      isShowMailListDialog: false, // 通讯录
      isShowCreateGroupPopup: false, // 创建群聊
      searchText: "", // 创建群聊成员搜索
      checkList: [], // 创建群聊成员列表
      positionBottom: "62px",
      positionRight: "70px",
      memberList: [],
      isShowInventoryInfoDialog: false
    };
  },
  watch: {
    imData: {
      handler: function(newValue, oldValue) {
        this.imData.chatList.forEach((v, e) => {
          this.mailListData.groupList.forEach((v2, e2) => {
            if (v2.id == v.sessionId) {
              console.log(
                "this.mailListData.groupList: ",
                this.mailListData.groupList,
                v2.id
              );
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
  mounted() {
    this.memberList = JSON.parse(JSON.stringify(this.mailListData.userList));
    this.$nextTick(() => {
      this.$bus.on("selectIMItem", v => {
        this.selectIMItem(v);
      });
      // 查看系统消息
      this.$bus.on("clickSystemMessage", v => {
        this.clickSystemMessage(v);
      });
    });
  },
  methods: {
    /**
     * IM抽屉效果
     * **/
    openDrawerShow() {
      this.drawerShow = true;
    },
    /**
     * 获取通讯录存入vuex
     * **/
    getMailList() {
      return new Promise((resolve, rejected) => {
        homeSrv
          .getMailList()
          .then(response => {
            if (response.success && response.data) {
              console.log("getMailList ==", response.data);
              this.$store.commit(
                "mailListData/userList",
                response.data.userList || []
              );
              this.$store.commit(
                "mailListData/groupList",
                response.data.groupList || []
              );
              resolve(response.data);
            } else {
              this.$message.error(response.message || "获取通讯录接口报错");
              rejected("error");
            }
          })
          .catch(error => {
            console.log(error);
            rejected("error");
          });
      });
    },
        // 查询项目看列表
    selectProjectList() {
      homeSrv
        .selectProject({})
        .then(response => {
          if (response.success && response.data) {
            response.data.forEach((v, e) => {
              v.isActive = false;
            });
            response.data[0].isActive = true;
            this.$store.commit("projectData/saveProjectList", response.data);
            this.$store.commit(
              "projectData/saveSelectedProject",
              response.data[0]
            );
          } else {
            this.$message.error(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 获取文件空间列表,IM分享保存需要过滤权限
     * **/
    getFileSpaceList() {
      let params = {
        token: window.localStorage.getItem("serverToken")
      };
      homeSrv
        .getFileSpaceList(params)
        .then(response => {
          if (response.success) {
            let fileSpaceList = response.data || [];
            this.$store.commit(
              "homeData/saveFilterFileSpaceList",
              fileSpaceList
            );
          } else {
            this.$message.error(response.message || "文件空间列表接口报错");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * proto ImServerMessage实例
     * **/
    ImServerMessage() {
      let ImServerMessage = new proto.ImServerMessage();
      return ImServerMessage;
    },
    /**
     * 初始化webSocket
     * **/
    webSocketInit() {
      let severToken = window.localStorage.getItem("serverToken");
      if (!severToken) {
        this.$message("登录已过期,请重新登录");
        this.$routerLink("login");
        return false;
      }

      // 测试服为ws协议
      let socketUrl =
        "ws://" + this.loginData.imServerToken.ImServer + "/im_websocket";
      // let socketUrl = "wss://" + this.loginData.imServerToken.ImServer + "/im_websocket";
      this.websocket = new WebSocket(socketUrl);
      this.websocket.binaryType = "arraybuffer";
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onclose = this.websocketclose;
    },
    /**
     *@desc websocket连接成功之后先登录拉取离线消息
     *@author houpai
     *@date 2020/03/26 10:59:01
     */
    websocketonopen() {
      this.$store.commit("imData/saveImSocketState", true);
      let serverToken = localStorage.getItem("serverToken");
      let ImServerMessage = this.ImServerMessage();
      ImServerMessage.setMsgtype(0);
      this.ImLogin.setJwttoken(serverToken.toString());
      ImServerMessage.setImlogin(this.ImLogin);
      let buff = ImServerMessage.serializeBinary();
      this.websocket.send(buff.buffer);
    },
    /**
     *@desc websocket接收消息,protocol反序列化
     *@author houpai
     *@date 2020/03/26 11:48:24
     */
    websocketonmessage(e) {
      let data = this.ImServerMessageDeserialization(e);
      console.log("vuex中的聊天列表数据", data);
      this.$store.commit("imData/saveChatList", data);
    },
    websocketonerror() {
      console.log("连接错误");
      this.$store.commit("imData/saveImSocketState", false);
    },
    websocketclose() {
      // console.log("webSocket断开连接");
      if (localStorage.getItem("online")) {
        // this.reconnectCount++;
        if (!this.imData.imSocketState) {
          setTimeout(() => {
            this.webSocketInit();
          }, 3000);
        }
      }
    },

    /**
     *@desc websocket接受消息反序列化, 接受到消息提交到vuex中,同时发送桌面提醒.
     *@author houpai
     *@date 2020/03/26 11:44:17
     */
    ImServerMessageDeserialization(e) {
      let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
      let messageObj = new proto.ImServerMessage.deserializeBinary(e.data);
      let id = messageObj.getImmessagepush().getId();
      let sendUserId = messageObj.getImmessagepush().getSenduserid();
      let targetId = messageObj.getImmessagepush().getTargetid();
      let targetType = messageObj.getImmessagepush().getTargettype();
      let sendUserName = messageObj.getImmessagepush().getSendusername();
      let sendUserHeadUrl = messageObj.getImmessagepush().getSenduserheadurl();
      let toUserId = messageObj.getImmessagepush().getTouserid();
      let toUserName = messageObj.getImmessagepush().getTousername();
      let toUserHeadUrl = messageObj.getImmessagepush().getTouserheadurl();
      let messageType = messageObj.getImmessagepush().getMessagetype();
      let content = messageObj.getImmessagepush().getContent();
      let type = messageObj.getMsgtype();
      let sendTimestamp = messageObj.getImmessagepush().getSendtimestamp();
      let sessionId, notifyContent;
      switch (messageType) {
        case 1:
          notifyContent = content;
          break;
        case 2:
          notifyContent = "[语音消息]";
          break;
        case 3:
          notifyContent = "[图片消息]";
          break;
        case 4:
          notifyContent = "[文件消息]";
          break;
        default:
          notifyContent = content;
      }
      if (targetType === 0) {
        sessionId = sendUserId;
      } else {
        sessionId = targetId;
      }

      if (messageType == 0) {
        this.getMailList();
      }

      // imServer消息回复(type为2)
      if (type === 2) {
        // 根据targetId匹配vuex中的聊天列表数据
        let matchingResults = this.$hasValueFromArray(
          chatListVuex,
          "sessionId",
          sessionId
        );
        // 如果匹配到,更新该会话的聊天内容,未匹配到则新建push
        if (matchingResults.value) {
          console.log("vuex中匹配到了", matchingResults.value);
          // 如果vuex中匹配到了该聊天的数据,则判断是否已经有该条消息(id做匹配)
          // 如果匹配到了则在chatList中push消息,否则不更新.
          let isExistValue = this.$hasValueFromArray(
            chatListVuex[matchingResults.index].chatList,
            "id",
            id
          );
          console.log(messageObj.getImmessagepush().getId(), isExistValue);
          // 过滤掉messageType为0的情况(群操作提示),不更新vuex中的数据
          if (messageType !== 0) {
            if (!isExistValue.value) {
              let chatListItem = {};
              chatListVuex[matchingResults.index].unReadMessageCount++;
              chatListItem.id = id;
              chatListItem.sendTimestamp = sendTimestamp;
              chatListItem.sendUserId = sendUserId;
              chatListItem.sendUserName = sendUserName;
              chatListItem.sendUserHeadUrl = sendUserHeadUrl;
              chatListItem.toUserId = toUserId;
              chatListItem.toUserName = toUserName;
              chatListItem.toUserHeadUrl = toUserHeadUrl;
              chatListItem.messageType = messageType;
              chatListItem.isPlaying = false;
              chatListItem.isReaded = false;
              chatListItem.content = content;
              chatListVuex[matchingResults.index].chatList.push(chatListItem);
              // 有新消息的聊天列表做置顶处理
              let topChatListItem = JSON.parse(
                JSON.stringify(chatListVuex[matchingResults.index])
              );
              chatListVuex.splice(matchingResults.index, 1);
              chatListVuex.unshift(topChatListItem);
              if (document.visibilityState === "hidden") {
                this.notifyMe(notifyContent, sendUserHeadUrl, sendUserName);
              }
            }
          }
        } else {
          console.log("vuex中没有匹配到");
          // 过滤掉messageType为0的情况(群操作提示),不更新vuex中的数据
          // sessionId用于分配会话(后端无会话的概念)
          // targetType为0是 sessionId为protocl推送中的sendUserId(发送人id)
          // targetType为1是 sessionId为protocl推送中的sendUserId(群聊id)
          if (messageType !== 0) {
            let newChatItem = {};
            newChatItem.targetType = targetType;
            if (targetType === 0) {
              newChatItem.sessionId = sendUserId;
            } else {
              newChatItem.sessionId = targetId;
            }
            newChatItem.isActive = false;
            newChatItem.isShowSearch = true;
            let chatList = [];
            let chatListItem = {};
            chatListItem.id = id;
            chatListItem.sendTimestamp = sendTimestamp;
            chatListItem.sendUserId = sendUserId;
            chatListItem.sendUserName = sendUserName;
            chatListItem.sendUserHeadUrl = sendUserHeadUrl;
            chatListItem.toUserId = toUserId;
            chatListItem.toUserName = toUserName;
            chatListItem.toUserHeadUrl = toUserHeadUrl;
            chatListItem.messageType = messageType;
            chatListItem.content = content;
            chatListItem.isPlaying = false;
            chatListItem.isReaded = false;
            newChatItem.unReadMessageCount = 1;
            chatList.push(chatListItem);
            newChatItem.chatList = chatList;
            chatListVuex.unshift(newChatItem);
            if (document.visibilityState === "hidden") {
              this.notifyMe(notifyContent, sendUserHeadUrl, sendUserName);
            }
          }
        }
        // 收到消息给后端回文
        let ImServerMessage = this.ImServerMessage();
        ImServerMessage.setMsgtype(3);
        this.ImMessageAck.setId(
          messageObj
            .getImmessagepush()
            .getId()
            .toString()
        );
        ImServerMessage.setImmessageack(this.ImMessageAck);
        let buff = ImServerMessage.serializeBinary();
        this.websocket.send(buff.buffer);
        return chatListVuex;
      }
    },

    /**
     *@desc sokect推送桌面提醒
     *@author houpai
     *@chatContent 聊天内容
     *@headUrl 聊天头像或者群聊头像
     *@date 2020/03/26 17:08:24
     */
    notifyMe(chatContent, headUrl, sendUserName) {
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
      }
      // Let's check if the user is okay to get some notification
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        let notification = new Notification(sendUserName, {
          dir: "rtl",
          body: chatContent,
          icon: headUrl
        });
        notification.onclick = function(event) {
          // event.preventDefault(); // prevent the browser from focusing the Notification's tab
          // let url = location.origin + "/#/home";
          // window.open(url, "_blank");
          window.focus();
        };
        notification.onshow = function(event) {
          console.log("event", event);
        };
        notification.onerror = function(event) {
          console.log("event", event);
        };
        notification.onclose = function(event) {
          console.log("event", event);
        };
      }
      // Otherwise, we need to ask the user for permission
      // Note, Chrome does not implement the permission static property
      // So we have to check for NOT 'denied' instead of 'default'
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function(permission) {
          // Whatever the user answers, we make sure we store the information
          if (!("permission" in Notification)) {
            Notification.permission = permission;
          }
          // If the user is okay, let's create a notification
          if (permission === "granted") {
            let notification = new Notification(sendUserName, {
              dir: "rtl",
              body: chatContent,
              icon: headUrl
            });
            notification.onclick = function(event) {
              event.preventDefault(); // prevent the browser from focusing the Notification's tab
              // let url = location.origin + "/#/home";
              // window.open(url, "_blank");
              window.focus();
            };
            notification.onshow = function(event) {
              console.log("event", event);
            };
            notification.onerror = function(event) {
              console.log("event", event);
            };
            notification.onclose = function(event) {
              console.log("event", event);
            };
          }
        });
      } else {
        console.log(`Permission is ${Notification.permission}`);
      }
    },
    lookNewMsg() {
      this.imDialogShow = true;
    },
    selectIMItem(item) {
      // console.log("item: ", item);
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
      // console.log('-----item: ', item);
      // console.log("-----this.homeData.imSelectedInfo", this.homeData.imSelectedInfo);
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
      this.imDialogShow = true;
    },
    showMailListDialog() {
      // console.log("111");
      this.isShowMailListDialog = true;
    },
    showCreateGroupDialog(v) {
      // v.position  1:会话面板； 2：home右侧导航条
      this.positionBottom = v.position === "1" ? "62px" : "116px";
      this.positionRight = v.position === "1" ? "70px" : "22px";
      this.isShowCreateGroupPopup = true;
    },
    closeCreateGroupPopup() {
      this.isShowCreateGroupPopup = false;
      this.$refs.menuBar.actionChecked = "";
      this.$refs.imBar.actionChecked = "";
    },
    getSearchList() {
      let par = { name: this.searchText };
      homeSrv
        .getSearchMember(par)
        .then(res => {
          if (res.success) {
            this.memberList = res.data.userList || [];
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    createGroup() {
      console.log("this.checkList: ", this.checkList);
      let par = {
        groupname: "",
        sendMessageId: this.$uuid(),
        imGroupUserList: this.checkList
      };
      homeSrv
        .createGroup(par)
        .then(res => {
          if (res.success) {
            this.$message({
              message: "群聊创建成功",
              type: "success"
            });
            this.checkList = [];
            this.getMailList();
            this.isShowMemberPopup = false;
            let item = {};
            item.groupname = res.data.groupname;
            item.id = res.data.groupid;
            item.targetType = 1;
            this.$store.commit("homeData/imSelectedInfo", item);
            let par = {
              targetType: 1,
              sessionId: res.data.groupid,
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
              id: res.data.groupid,
              phone: this.homeData.listSelectedInfo.phone || "",
              groupname: res.data.groupname
            };
            let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
            chatListVuex.forEach((v, e) => {
              chatListVuex[e].isActive = false;
            });
            // chatListVuex.unshift(par);
            this.$store.commit("imData/saveChatList", chatListVuex);
            this.closeCreateGroupPopup();
            this.imDialogShow = true;
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    sendMsgBtn() {
      this.closeMailListDialog();
      this.imDialogShow = true;
    },
    closeMailListDialog() {
      this.isShowMailListDialog = false;
      this.$refs.menuBar.actionChecked = "";
      this.$refs.imBar.actionChecked = "";
    },
    closeImDialog() {
      this.imDialogShow = false;
    },
    // 关闭任务详情弹窗
    closeInventoryInfoDialog() {
      this.isShowInventoryInfoDialog = false;
    },
    clickSystemMessage(contant) {
      console.log("contant: ", contant);
      this.imDialogShow = false;
      if (contant.type === 0) {
        this.isShowInventoryInfoDialog = true;
        let selectedTaskVuex = this.projectData.selectedTask;
        selectedTaskVuex.id = contant.entityId;
        // selectedTaskVuex.projectId = contant.projectId;
        this.$store.commit("projectData/saveSelectedTask", selectedTaskVuex);
      } else if (contant.type === 1) {
        let projectListVuex = JSON.parse(
          JSON.stringify(this.projectData.projectList)
        );
        projectListVuex.forEach((v, e) => {
          if (v.id === contant.entityId) {
            v.isActive = true;
            this.$store.commit("projectData/saveSelectedProject", v);
          } else {
            v.isActive = false;
          }
        });
        this.$store.commit("projectData/saveProjectList", projectListVuex);
        this.$route.name !== "board" && this.$router.push({name: "board"})
      }
    }
  },
  created() {
    Promise.all([this.getMailList(), this.selectProjectList()]).then(() => {
      this.webSocketInit();
    });
    this.getFileSpaceList();
  },
  beforeDestroy() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
};
</script>

<style lang="less" scoped>
.home_page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
  /*background: url("../../assets/image/bg.png") fixed 0 center;*/
  background-size: cover;

  .content_box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    -webkit-box-shadow: 12px 12px 12px 12px rgba(0, 0, 0, 0.1);
    box-shadow: 12px 12px 12px 12px rgba(0, 0, 0, 0.1);
    background-color: #fff;

    .routerView_box {
      flex: 1;
      position: relative;
    }
  }

  .create-dialog__wrapper {
    z-index: 9999;
  }

  .create-group-popup {
    width: 257px;
    height: 290px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    position: fixed;
    bottom: 55px;
    right: 22px;
    background: @mainBackgroundColor;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    z-index: 9999;

    .popup-box {
      padding: 15px 3px 10px 10px;
      width: 100%;
      height: 100%;
      position: relative;

      .jiantou {
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
        background: @mainBackgroundColor;
        // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
        position: absolute;
        right: 10px;
        bottom: -5px;
      }
    }

    .flex-box {
      display: flex;
      flex-direction: column;
      height: 100%;

      .top {
        width: 100%;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 15px;

        .search-box {
          width: 150px;
          height: 32px;
          background-color: @searchBackgroundColor;
          border-radius: 10px;
          padding: 6px 15px 6px 36px;
          background-image: url("../../assets/image/icon_search.png");
          background-position: 10px 8px;
          background-repeat: no-repeat;
          background-size: 14px;

          input {
            width: 100%;
            border: none;
            outline: none;
            background: @searchBackgroundColor;
            font-size: 14px;
            font-weight: 400;
            color: @subTitleColor;
            line-height: 20px;
          }
        }

        .btn {
          cursor: pointer;
          width: 72px;
          height: 32px;
          margin-right: 7px;
          background: @addBtnColor;
          text-align: center;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 400;
          color: @mainBackgroundColor;
          line-height: 32px;
        }
      }

      .edit-member {
        flex: 1;
        width: 100%;
        height: 0;
        overflow-y: auto;

        /deep/ .el-checkbox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row-reverse;
          padding: 7px 4px;
          margin-right: 0;
          cursor: pointer;

          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: @addBtnColor;
            border-color: @addBtnColor;
          }

          .el-checkbox__input {
            width: 16px;
            height: 16px;
            border-radius: 50%;

            .el-checkbox__inner {
              width: 16px;
              height: 16px;
              border-radius: 50%;

              &::after {
                // width: 5px;
                height: 8px;
                left: 5px;
              }
            }
          }
          .member-info {
            display: flex;
            align-items: center;
            margin-right: 0;
          }

          img {
            width: 28px;
            height: 28px;
            border-radius: 6%;
            display: block;
            margin-right: 10px;
          }

          p {
            font-size: 14px;
            font-weight: bold;
            color: @titleColor;
            line-height: 16px;
          }
        }
      }
    }
  }
}
</style>
