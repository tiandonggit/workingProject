/**
*@desc home页布局组件
*@author houpai
*@date 2020/03/20 15:51:03
*/
<template>
  <div class="home_page">
    <div class="main_box">
      <div class="main">
        <chat-bar></chat-bar>
        <div class="routerView_box">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import chatBar from "../../components/chatBar/chatBar";
  import proto from "../../utils/ImServerProto_pb";
  import {mapState} from "vuex";

  export default {
    name: "home",
    components: {
      chatBar
    },
    data() {
      return {
        websocket: null,
        reconnectCount: 0, // websocket重连次数
        ImLogin: new proto.ImLogin(), // im登录
        ImMessageAck: new proto.ImMessageAck() // Ack回复,确认已收到离线消息
      };
    },
    computed: {
      ...mapState(["imData", "loginData"])
    },
    methods: {
      // 获取通讯录存入vuex
      getMailList() {
        return new Promise((resolve, rejected) => {
          this.$http
            .request({
              url: "/ImUserController/selectUserList",
              method: "get"
            })
            .then(res => {
              if (res.data.success) {
                this.$store.commit(
                  "mailListData/userList",
                  res.data.data.userList
                );
                this.$store.commit(
                  "mailListData/groupList",
                  res.data.data.groupList
                );
                resolve(res.data.data);
              } else {
                this.$message.error(res.data.message || "服务异常");
              }
            })
            .catch(e => {
              rejected(e);
              console.log(e);
            });
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

        // let socketUrl = "wss://channel.quickhealmall.com/im_websocket";
        let socketUrl = "wss://" + this.loginData.imServerToken.ImServer + "/im_websocket";
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
          this.ImMessageAck.setId(messageObj.getImmessagepush().getId().toString());
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
          notification.onclick = function (event) {
            // event.preventDefault(); // prevent the browser from focusing the Notification's tab
            // let url = location.origin + "/#/home";
            // window.open(url, "_blank");
            window.focus();
          };
          notification.onshow = function (event) {
            console.log("event", event);
          };
          notification.onerror = function (event) {
            console.log("event", event);
          };
          notification.onclose = function (event) {
            console.log("event", event);
          };
        }
        // Otherwise, we need to ask the user for permission
        // Note, Chrome does not implement the permission static property
        // So we have to check for NOT 'denied' instead of 'default'
        else if (Notification.permission !== "denied") {
          Notification.requestPermission(function (permission) {
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
              notification.onclick = function (event) {
                event.preventDefault(); // prevent the browser from focusing the Notification's tab
                // let url = location.origin + "/#/home";
                // window.open(url, "_blank");
                window.focus();
              };
              notification.onshow = function (event) {
                console.log("event", event);
              };
              notification.onerror = function (event) {
                console.log("event", event);
              };
              notification.onclose = function (event) {
                console.log("event", event);
              };
            }
          });
        } else {
          console.log(`Permission is ${Notification.permission}`);
        }
      }
    },
    created() {
      Promise.all([this.getMailList()]).then(() => {
        this.webSocketInit();
      });
    },
    beforeDestroy() {
      if (this.websocket) {
        this.websocket.close();
      }
    }
  };
</script>

<style scoped lang="less">
  .home_page {
    height: 100%;

    .main_box {
      position: relative;
      padding-top: 100px;
      height: 100%;
      width: 100%;
      z-index: 1;

      .main {
        display: flex;
        height: 90%;
        min-height: 600px;
        max-width: 1000px;
        min-width: 800px;
        margin: 0 auto;
        border-radius: 3px;
        overflow: hidden;
        box-shadow: 12px 12px 12px 12px rgba(0, 0, 0, 0.1);

        .routerView_box {
          flex: 1;
          background-color: @mainBackgroundColor;
          overflow: hidden;
        }
      }
    }

    .main_box::before {
      content: "";
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      filter: blur(4px);
      background: url("../../assets/images/bg.png") 0 / cover;
    }
  }
</style>
