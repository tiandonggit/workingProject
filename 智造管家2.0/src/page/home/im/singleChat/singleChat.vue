<template>
  <div class="singleChat_page">
    <div class="top">
      <div class="info">
        <p class="name">
          {{homeData.imSelectedInfo.nickname}}
          <span>{{homeData.imSelectedInfo.phone}}</span>
        </p>
      </div>
      <div class="img" @click.stop="personSettings">
        <img src="../../../../assets/images/icon_person.png" alt />
      </div>
    </div>
    <chat-details :chatList="chatList"></chat-details>
    <div class="input-container">
      <div class="file-box">
        <label for="img">
          <img src="../../../../assets/images/icon_img.png" alt />
        </label>
        <input id="img" type="file" v-if="isShowInput" accept="image/*" @change="sendImg($event)" />
        <!-- <label for="file">
          <img src="../../../../assets/images/icon_local_file.png" alt />
        </label>
        <input id="file" type="file" />-->
        <img src="../../../../assets/images/icon_cloud_file.png" alt @click.stop="selectFile()" />
      </div>
      <div class="input-box">
        <textarea
          name
          id
          maxlength="200"
          v-model.trim="inputContent"
          v-hotkey="{'enter+shift': this.sendContent}"
        ></textarea>
      </div>
      <div class="send-btn" @click.stop="$throttle(sendContent($event))">
        <span class="btn">发送</span>
      </div>
    </div>
    <!-- 右上图标弹出框 -->
    <div class="settings-popup" v-show="isShowSettingPopup">
      <p class="title">好友备注</p>
      <input type="text" v-model="personalRemark" placeholder="好友备注" />
    </div>
    <!--    移动文件弹窗-->
    <send-file-dialog
      v-if="sendFolderDialogShow"
      :fileBreadcrumbData="tagList"
      :checkedFileId="checkedFileId"
      :moveFolderDialogShow="sendFolderDialogShow"
      @submitSendFile="submitSendFile"
      @closeMoveFolderDialog="handleClose"
    ></send-file-dialog>
  </div>
</template>

<script>
import chatDetails from "../../../../components/chat/chatDetails";
import sendFileDialog from "../../../../components/chat/sendFileDialog";
import { mapState } from "vuex";
export default {
  name: "singleChat",
  components: {
    chatDetails,
    sendFileDialog
  },
  computed: {
    ...mapState(["homeData", "loginData", "imData", "mailListData"])
  },
  watch: {
    imData: {
      handler: function(newValue, oldValue) {
        this.imData.chatList.forEach((v, e) => {
          if (v.sessionId == this.homeData.imSelectedInfo.id) {
            // 根据选中会话id匹配相应聊天内容
            this.chatList = this.imData.chatList[e].chatList;
            this.imData.chatList[e].unReadMessageCount = 0;
          }
        });
        // console.log('this.chatList: ', this.chatList);
        // this.imData.chatList[0].unReadMessageCount = 0;
        // this.chatList = this.imData.chatList[0].chatList; // 假数据 根据上面判断条件为空
        // this.scrollToBottom();
      },
      deep: true,
      immediate: true
    },
    chatList(newValue, oldValue) {
      this.$nextTick(() => {
        if (newValue.length !== oldValue.length) {
          this.scrollToBottom();
        }
      });
    },
    homeData: {
      handler: function(newValue, oldValue) {
        this.inputContent = "";
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      chatList: [],
      isShowInput: true,
      inputContent: "",
      content: "",
      personalRemark: "", // 好友备注
      isShowSettingPopup: false, // 是否显示右侧弹出框
      sendFolderDialogShow: false, // 选择文件弹窗
      tagList: [{ folderName: "个人文件", folderId: 0 }],
      sendImage: "", // 发送图片
      isSendSuccess: 0 // 默认loading   1：成功   2：失败
    };
  },
  created() {
    this.scrollToBottom();
  },
  methods: {
    personSettings() {
      return; // 功能取消
      this.isShowSettingPopup = !this.isShowSettingPopup;
    },
    // 发送图片
    sendImg(e) {
      if (!this.imData.imSocketState) {
        this.$message.error("网络连接异常");
        return;
      }

      let file = e.target.files[0];
      if (!file) {
        return;
      }
      this.isShowInput = false;
      this.sendContentHttp(3, file);

      // let url = "";
      // var reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = e => {
      //   url = reader.result.substring(reader.result.indexOf(",") + 1);
      //   this.content = "data:image/png;base64," + url;
      //   this.sendContentHttp(3);
      // };
    },
    // 发送文字
    sendContent(e) {
      if (!this.imData.imSocketState) {
        this.$message.error("网络连接异常");
        return;
      }

      e.preventDefault();
      if (!this.inputContent) {
        return false;
      }
      this.content = this.inputContent;
      this.sendContentHttp(1, "");
    },
    // 消息http
    sendContentHttp(messagetype, file) {
      this.isSendSuccess = 0;
      let uuid = this.$uuid();
      this.chatList.push({
        userId: this.loginData.userMessage.userid,
        sendUserId: this.loginData.userMessage.userid,
        messageId: uuid,
        messageType: messagetype,
        content:
          messagetype === 1
            ? this.content
            : messagetype === 3
            ? ""
            : messagetype === 4
            ? this.content
            : "",
        isPlaying: false,
        isReaded: false,
        sendTimestamp: new Date().getTime(),
        sendUserName: this.loginData.userMessage.nickname,
        sendUserHeadUrl: this.loginData.userMessage.headurl,
        toUserId: "touserid",
        toUserName: this.homeData.imSelectedInfo.id,
        toUserHeadUrl: " ",
        isSendSuccess: this.isSendSuccess
      });
      this.scrollToBottom();
      this.inputContent = "";

      let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
      chatListVuex.forEach((v, e) => {
        if (v.sessionId == this.homeData.imSelectedInfo.id) {
          // 根据选中会话id匹配相应聊天内容
          chatListVuex[e].chatList = this.chatList;
        }
      });
      this.$store.commit("imData/saveChatList", chatListVuex);

      let formData = new FormData();
      formData.append("file", file);
      formData.append("senduserid", this.loginData.userMessage.userid);
      formData.append("sendmessageid", this.$uuid());
      formData.append("targetid", this.homeData.imSelectedInfo.id);
      formData.append("targettype", 0);
      formData.append("content", this.content);
      formData.append("nessagetype", messagetype);
      this.$http
        .request({
          url: "/ImSeverController/DataToMqByJson",
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          body: formData
        })
        .then(res => {
          if (res.data.success) {
            this.isShowInput = true;
            this.chatList.forEach((v, e) => {
              if (v.messageId === uuid) {
                this.chatList[e].isSendSuccess = 1;
                if (messagetype === 3) {
                  this.chatList[e].content = res.data.data.imageUrl;
                  this.scrollToBottom();
                }
              }
            });
            this.content = "";
            let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
            chatListVuex.forEach((v, e) => {
              if (v.sessionId == this.homeData.imSelectedInfo.id) {
                // 根据选中会话id匹配相应聊天内容
                chatListVuex[e].chatList = this.chatList;
                let obj = chatListVuex.splice(e, 1);
                chatListVuex.unshift(obj[0]);
              }
            });
            this.$store.commit("imData/saveChatList", chatListVuex);
          } else {
            this.isShowInput = true;
            this.chatList.forEach((v, e) => {
              if (v.messageId === uuid) {
                this.chatList[e].isSendSuccess = 2;
              }
            });
            this.$message.error(res.data.message || "服务异常");
          }
        })
        .catch(e => {
          this.isShowInput = true;
          this.chatList.forEach((v, e) => {
            if (v.messageId === uuid) {
              this.chatList[e].isSendSuccess = 2;
            }
          });
        });
    },
    // 选择文件发送
    selectFile() {
      if (!this.imData.imSocketState) {
        this.$message.error("网络连接异常");
        return;
      }

      this.sendFolderDialogShow = true;
    },
    submitSendFile(val) {
      this.content = {
        id: val.id,
        displaysize: val.displaysize,
        name: val.name
      };
      // this.content = JSON.stringify(this.content);
      // this.sendContentHttp(4, "");
      this.sendFolderDialogShow = false;

      this.$http
        .request({
          url: "/WpFileController/share",
          headers: {
            "Content-Type": "application/json"
          },
          method: "post",
          body: {
            wpFileId: this.content.id,
            userList: [this.homeData.imSelectedInfo.id],
            groupList: [],
            sendMessageId: this.$uuid()
          }
        })
        .then(res => {
          if (res.data.success) {
            this.$message.success("发送成功");
            this.synchronismChatList(this.content, [
              this.homeData.imSelectedInfo.id
            ]);
            this.handleClose();
          } else {
            // this.$message.error("分享失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 匹配或者新建vuex中的本地聊天记录
     * @params checkedFileId {String}
     * @params userList {Array}
     * @params groupList {Array}
     * **/
    synchronismChatList(checkedFile, userList = [], groupList = []) {
      let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
      let content = {
        id: checkedFile.id,
        displaysize: checkedFile.displaysize || "",
        name: checkedFile.name || ""
      };

      // 单聊
      for (let i = 0; i < userList.length; i++) {
        let matchingResults = this.$hasValueFromArray(
          chatListVuex,
          "sessionId",
          userList[i]
        );
        let sendUserName, sendUserHeadUrl;
        for (let k = 0; k < this.mailListData.userList.length; k++) {
          if (userList[i] === this.mailListData.userList[k].id) {
            sendUserName = this.mailListData.userList[k].nickname || "";
            sendUserHeadUrl = this.mailListData.userList[k].headurl || "";
            break;
          }
        }
        // 如果匹配到了,push分享的文件信息,未匹配到则新建
        if (matchingResults.value) {
          let chatListItem = {};
          chatListItem.id = this.$uuid();
          chatListItem.sendTimestamp = new Date().getTime();
          chatListItem.sendUserId = userList[i];
          chatListItem.userId = this.loginData.userMessage.userid;
          chatListItem.sendUserName = sendUserName;
          chatListItem.sendUserHeadUrl = sendUserHeadUrl;
          chatListItem.toUserId = "";
          chatListItem.toUserName = "";
          chatListItem.toUserHeadUrl = "";
          chatListItem.messageType = 4;
          chatListItem.content = JSON.stringify(content);
          chatListItem.isPlaying = false;
          chatListItem.isReaded = false;
          chatListVuex[matchingResults.index].chatList.push(chatListItem);
          // 有新消息的聊天列表做置顶处理
          let topChatListItem = JSON.parse(
            JSON.stringify(chatListVuex[matchingResults.index])
          );
          chatListVuex.splice(matchingResults.index, 1);
          chatListVuex.unshift(topChatListItem);
        } else {
          let newChatItem = {};
          let chatList = [];
          let chatListItem = {};
          newChatItem.targetType = 0;
          newChatItem.sessionId = userList[i];
          newChatItem.username = sendUserName;
          newChatItem.headurl = sendUserHeadUrl;
          newChatItem.isActive = false;
          newChatItem.isShowSearch = true;
          newChatItem.unReadMessageCount = 0;
          chatListItem.id = this.$uuid();
          chatListItem.sendTimestamp = new Date().getTime();
          chatListItem.sendUserId = userList[i];
          chatListItem.userId = this.loginData.userMessage.userid;
          chatListItem.sendUserName = sendUserName;
          chatListItem.sendUserHeadUrl = sendUserHeadUrl;
          chatListItem.toUserId = "";
          chatListItem.toUserName = "";
          chatListItem.toUserHeadUrl = "";
          chatListItem.messageType = 4;
          chatListItem.content = JSON.stringify(content);
          chatListItem.isPlaying = false;
          chatListItem.isReaded = false;
          chatList.push(chatListItem);
          newChatItem.chatList = chatList;
          chatListVuex.unshift(newChatItem);
        }
      }

      // 群聊
      for (let i = 0; i < groupList.length; i++) {
        let matchingResults = this.$hasValueFromArray(
          chatListVuex,
          "sessionId",
          groupList[i]
        );
        let groupname;
        for (let k = 0; k < this.mailListData.groupList.length; k++) {
          if (groupList[i] === this.mailListData.groupList[k].id) {
            groupname = this.mailListData.groupList[k].groupname || "";
            break;
          }
        }
        // 如果匹配到了,push分享的文件信息,未匹配到则新建
        if (matchingResults.value) {
          let chatListItem = {};
          chatListItem.id = this.$uuid();
          chatListItem.sendTimestamp = new Date().getTime();
          chatListItem.sendUserId = groupList[i];
          chatListItem.userId = this.loginData.userMessage.userid;
          chatListItem.groupname = groupname;
          chatListItem.toUserId = "";
          chatListItem.toUserName = "";
          chatListItem.toUserHeadUrl = "";
          chatListItem.messageType = 4;
          chatListItem.content = JSON.stringify(content);
          chatListItem.isPlaying = false;
          chatListItem.isReaded = false;
          chatListVuex[matchingResults.index].chatList.push(chatListItem);
          // 有新消息的聊天列表做置顶处理
          let topChatListItem = JSON.parse(
            JSON.stringify(chatListVuex[matchingResults.index])
          );
          chatListVuex.splice(matchingResults.index, 1);
          chatListVuex.unshift(topChatListItem);
        } else {
          let newChatItem = {};
          let chatList = [];
          let chatListItem = {};
          newChatItem.targetType = 1;
          newChatItem.sessionId = groupList[i];
          newChatItem.groupname = groupname;
          newChatItem.isActive = false;
          newChatItem.isShowSearch = true;
          newChatItem.unReadMessageCount = 0;
          chatListItem.id = this.$uuid();
          chatListItem.sendTimestamp = new Date().getTime();
          chatListItem.sendUserId = groupList[i];
          chatListItem.userId = this.loginData.userMessage.userid;
          chatListItem.sendUserName = "";
          chatListItem.sendUserHeadUrl = "";
          chatListItem.toUserId = "";
          chatListItem.toUserName = "";
          chatListItem.toUserHeadUrl = "";
          chatListItem.messageType = 4;
          chatListItem.content = JSON.stringify(content);
          chatListItem.isPlaying = false;
          chatListItem.isReaded = false;
          chatList.push(chatListItem);
          newChatItem.chatList = chatList;
          chatListVuex.unshift(newChatItem);
        }
      }

      console.log("chatListVuex", chatListVuex);
      this.$store.commit("imData/saveChatList", chatListVuex);
    },
    // 发消息自动滚动底部
    scrollToBottom() {
      this.$nextTick(() => {
        setTimeout(function() {
          let ele = document.querySelector(".container");
          ele.scrollTop = ele.scrollHeight;
        }, 200);
      });
    },
    handleClose() {
      this.sendFolderDialogShow = false;
    }
  }
};
</script>

<style scoped lang="less">
.singleChat_page {
  height: 100%;

  .top {
    height: 55px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;

    .info {
      .name {
        font-size: 16px;
        font-weight: bold;
        color: @titleColor;
        line-height: 20px;

        span {
          font-size: 14px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: @descTitleColor;
          line-height: 20px;
          margin-left: 5px;
        }
      }
    }

    .img {
      width: 26px;
      height: 26px;
      // cursor: pointer;

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .input-container {
    height: 160px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 15px 30px 0;

    .file-box {
      img {
        display: inline-block;
        margin-right: 20px;
        width: 24px;
        cursor: pointer;
      }

      #file,
      #img {
        display: none;
      }
    }

    .input-box {
      margin: 15px 0 12px;
      height: 44px;

      textarea {
        border: none;
        outline: none;
        resize: none;
        height: 100%;
        width: 100%;
        font-size: 16px;
        font-weight: 400;
        color: @titleColor;
        line-height: 22px;
      }
    }

    .send-btn {
      cursor: pointer;
      float: right;
      width: 87px;
      height: 35px;
      background: linear-gradient(270deg, @beginColor 0%, @mainColor 100%);
      border-radius: 10px;
      text-indent: 21px;

      span {
        font-size: 14px;
        font-weight: 400;
        color: @fontColorFFF;
        line-height: 35px;
        letter-spacing: 18px;
      }
    }
  }

  .settings-popup {
    width: 238px;
    height: calc(100% - 55px);
    position: absolute;
    top: 55px;
    right: 0px;
    background: @mainBackgroundColor;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    padding: 20px 10px 20px 20px;

    .title {
      font-size: 16px;
      font-weight: 400;
      color: @titleColor;
      line-height: 16px;
      margin-bottom: 15px;
    }

    input {
      outline: none;
      border: none;
      height: 18px;
      font-size: 16px;
      font-weight: 400;
      color: @subTitleColor;
      line-height: 18px;
    }
  }
}
</style>
