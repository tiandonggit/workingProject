/**
*@desc imDialog
*@author tiandong
*@date 2020/03/23 11:14:23
*/
<template>
  <div class="modal-box">
    <el-dialog
      class="imDialog_page"
      :modal-append-to-body="false"
      :visible.sync="imDialogShow"
      :show-close="false"
      :before-close="handleClose"
    >
      <div class="top" v-if="homeData.imSelectedInfo.targetType == 0">
        <div class="info" v-if="homeData.imSelectedInfo.sessionId === '0'">
           <p class="name">
            {{homeData.imSelectedInfo.chatList ? homeData.imSelectedInfo.chatList[0].sendUserName : ""}}
          </p>
        </div>
        <div class="info" v-else>
          <p class="name">
            {{homeData.imSelectedInfo.nickname}}
            <span>{{homeData.imSelectedInfo.phone}}</span>
          </p>
        </div>
        <!-- <div class="img" @click.stop="personSettings">
        <img src="../../assets/image/icon_person.png" alt />
        </div>-->
      </div>
      <div class="top" v-if="homeData.imSelectedInfo.targetType == 1">
        <div class="info">
          <p class="name">{{homeData.imSelectedInfo.groupname}}</p>
        </div>
        <div class="img" @click.stop="$throttle(groupSettings)">
          <img src="../../assets/image/icon_group.png" alt />
        </div>
      </div>
      <chat-details :chatList="chatList"></chat-details>
      <div class="input-container" v-if="homeData.imSelectedInfo.sessionId !== '0'">
        <div class="file-box">
          <label for="img">
            <img src="../../assets/image/icon_img.png" alt />
          </label>
          <input id="img" type="file" v-if="isShowInput" accept="image/*" @change="sendImg($event)" />
          <!-- <label for="file">
          <img src="../../assets/image/icon_local_file.png" alt />
        </label>
          <input id="file" type="file" />-->
          <img src="../../assets/image/icon_cloud_file.png" alt @click.stop="selectFile()" />
        </div>
        <div class="input-box">
          <textarea
            name
            id
            placeholder="请输入发送的内容"
            maxlength="200"
            v-model.trim="inputContent"
            v-hotkey="{'enter+shift': this.sendContent}"
          ></textarea>
        </div>
        <div class="send-btn" @click.stop="$throttle(sendContent($event))">
          <span class="btn">发送</span>
        </div>
      </div>
      <!-- 右侧设置弹窗 -->
      <div
        class="el-dialog__wrapper"
        v-show="isShowSettingPopup"
        @click.stop="isShowSettingPopup = false"
      ></div>
      <div class="settings-popup" v-show="isShowSettingPopup">
        <!-- <div class="search-box">
          <input v-model="searchText" placeholder="搜索" type="text" />
        </div>-->
        <div class="edit-member">
          <div class="add-member" @click.stop="editMember('2')">
            <img src="../../assets/image/add_person.png" alt />
            <p class="btn">添加成员</p>
          </div>
          <div
            class="del-member"
            @click.stop="editMember('3')"
            v-if="groupList[0].id == loginData.userMessage.userid"
          >
            <img src="../../assets/image/delete_person.png" alt />
            <p class="btn">删除成员</p>
          </div>
          <div class="member-info" v-for="(item, index) in groupList" :key="index">
            <img :src="item.headurl" alt />
            <p>{{item.nickname}}</p>
          </div>
        </div>
        <div class="exit-group" @click.stop="$throttle(outGroup)">
          <span>退出群聊</span>
        </div>
      </div>
      <!-- 群聊增减成员 -->
      <member-dialog
          v-if="isShowMemberPopup"
          :memberList="memberList"
          :isShowMemberPopup="isShowMemberPopup"
          @addGroupMember="addGroupMember"
          @removeGroupMember="removeGroupMember"
          @closePopup="closeMemberPopup"
          :memberType="memberType"
          :groupId="homeData.imSelectedInfo.id"
      ></member-dialog>
    </el-dialog>

     <!--    发送文件弹窗-->
    <send-file-dialog
        :filterFileSapceList="homeData.filterFileSpaceList"
        v-if="sendFolderDialogShow"
        :moveFolderDialogShow="sendFolderDialogShow"
        @submitSendFile="submitSendFile"
        @closeMoveFolderDialog="handleClose"
    ></send-file-dialog>



  </div>
</template>

<script>
import chatDetails from "./chatDetails";
import sendFileDialog from "./sendFileDialog";
import memberDialog from "../memberDialog/memberDialog";
import { mapState } from "vuex";
import { homeSrv } from "../../views/Home/home.service";
import { cloudDiskSrv } from "../../views/CloudDisk/cloudDisk.service";

export default {
  name: "imDialog",
  components: {
    chatDetails,
    sendFileDialog,
    memberDialog
  },
  props: {
    imDialogShow: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    ...mapState(["homeData", "loginData", "imData", "mailListData"])
  },
  watch: {
    imData: {
      handler: function(newValue, oldValue) {
        let chatListVuex = this.imData.chatList;
        if(this.homeData.imSelectedInfo.sessionId === "0") {
          this.imData.chatList.forEach((v, e) => {
            if (v.sessionId === "0") {
              // 根据选中会话id匹配相应聊天内容
              this.chatList = this.imData.chatList[e].chatList;
              chatListVuex[e].unReadMessageCount = 0;
            }
          });
        } else {
          this.imData.chatList.forEach((v, e) => {
            if (v.sessionId == this.homeData.imSelectedInfo.id) {
              // 根据选中会话id匹配相应聊天内容
              this.chatList = this.imData.chatList[e].chatList;
              chatListVuex[e].unReadMessageCount = 0;
            }
          });
        }
        this.$store.commit("imData/saveChatList", chatListVuex);
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
      tagList: [],
      sendImage: "", // 发送图片
      isSendSuccess: 0, // 默认loading   1：成功   2：失败
      searchText: "",
      groupList: [{ id: "" }],
      isShowMemberPopup: false, // 群成员操作弹窗
      memberList: [] // 群操作成员列表
    };
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
      homeSrv
        .sendMsgServer(formData)
        .then(res => {
          if (res.success) {
            this.isShowInput = true;
            this.chatList.forEach((v, e) => {
              if (v.messageId === uuid) {
                this.chatList[e].isSendSuccess = 1;
                if (messagetype === 3) {
                  this.chatList[e].content = res.data.imageUrl;
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
            this.$message.error(res.message || "服务异常");
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
      if (!this.homeData.filterFileSpaceList.length) {
        this.$message.error("您没有权限");
        return false;
      } else {
        this.sendFolderDialogShow = true;
      }
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

      let params = {
        fileId: this.content.id,
        userList: [this.homeData.imSelectedInfo.id],
        groupList: [],
        sendMessageId: this.$uuid(),
        token: localStorage.getItem("serverToken")
      };

      cloudDiskSrv
        .submitShareFile(params)
        .then(res => {
          if (res.success) {
            this.$message.success("发送成功");
            this.synchronismChatList(this.content, [
              this.homeData.imSelectedInfo.id
            ]);
            this.sendFolderDialogShow = false;
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
    // 群设置
    groupSettings() {
      this.getGroupMember();
      this.isShowSettingPopup = !this.isShowSettingPopup;
    },
    // 获取群成员
    getGroupMember() {
      homeSrv
        .getGroupMember({ groupid: this.homeData.imSelectedInfo.id })
        .then(res => {
          this.btnLoading = false;
          if (res.success) {
            this.groupList = res.data;
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 编辑群成员
    editMember(type) {
      // 2：添加；3：删除
      this.memberType = type;
      if (type == "2") {
        // 获取除群成员外的成员列表
        homeSrv
          .getGroupOutMember({ groupid: this.homeData.imSelectedInfo.id })
          .then(res => {
            if (res.success) {
              this.memberList = res.data.userList;
            } else {
              this.$message.error(res.message || "服务异常");
            }
          })
          .catch(e => {
            console.log(e);
          });
      } else if (type == "3") {
        this.memberList = this.groupList.filter(v => {
          return v.id !== this.loginData.userMessage.userid;
        });
      }
      this.isShowMemberPopup = true;
    },
    // 添加群成员
    addGroupMember(val) {
      let par = {
        groupid: this.homeData.imSelectedInfo.id,
        sendMessageId: this.$uuid(),
        userList: val
      };
      homeSrv
        .addGroupMember(par)
        .then(res => {
          this.btnLoading = false;
          if (res.success) {
            this.$message({
              message: "添加成员成功",
              type: "success"
            });
            this.isShowSettingPopup = false;
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 删除群成员
    removeGroupMember(val) {
      let par = {
        groupid: this.homeData.imSelectedInfo.id,
        sendMessageId: this.$uuid(),
        userList: val
      };
      homeSrv
        .deleteGroupMember(par)
        .then(res => {
          if (res.success) {
            this.$message({
              message: "删除成员成功",
              type: "success"
            });
            this.isShowSettingPopup = false;
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    closeMemberPopup(){
      this.isShowMemberPopup = false;
    },
    // 退出群聊
    outGroup() {
      let par = {
        groupid: this.homeData.imSelectedInfo.id,
        sendMessageId: this.$uuid()
      };
      homeSrv
        .exitFromGroup(par)
        .then(res => {
          this.btnLoading = false;
          if (res.success) {
            this.$message({
              message: "退出成功",
              type: "success"
            });
            this.imData.chatList.forEach((v, e) => {
              if (v.sessionId == this.homeData.imSelectedInfo.id) {
                this.imData.chatList.splice(e, 1);
              }
            });
            this.homeData.imSelectedInfo = {};
            this.$parent.getMailList();
            this.$parent.imDialogShow = false;
            this.$parent.$refs.menuBar.actionChecked = "";
            this.$parent.$refs.imBar.actionChecked = "";
            this.$store.commit("homeData/listSelectedInfo", {});
          } else {
            this.$message.error(res.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 发消息自动滚动底部
    scrollToBottom() {
      this.$nextTick(() => {
        setTimeout(function() {
          let ele = document.querySelector(".im_container");
          ele.scrollTop = ele.scrollHeight;
        }, 200);
      });
    },
    /**
     * handleClose
     * **/
    handleClose() {
      this.$emit("closeImDialog");
    }
  },
  created() {
    this.scrollToBottom();
  }
};
</script>

<style scoped lang="less">
.modal-box {
  /deep/ .v-modal {
    opacity: 0.2 !important;
  }
}
.imDialog_page {
  /deep/ .el-dialog {
    border-radius: 10px;
    overflow: hidden;
    width: 814px !important;
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
    position: relative;
  }

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
      cursor: pointer;

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .input-container {
    height: 140px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 12px 30px 0;

    .file-box {
      img {
        display: inline-block;
        margin-right: 20px;
        width: 20px;
        cursor: pointer;
      }

      #file,
      #img {
        display: none;
      }
    }

    .input-box {
      margin: 12px 0 12px;
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
      height: 28px;
      background: @addBtnColor;
      border-radius: 10px;
      text-indent: 21px;

      span {
        font-size: 14px;
        font-weight: 400;
        color: @fontColorFFF;
        line-height: 28px;
        letter-spacing: 18px;
      }
    }
  }

  .el-dialog__wrapper {
    z-index: 1;
  }

  .settings-popup {
    width: 238px;
    height: calc(100% - 55px);
    position: absolute;
    top: 55px;
    right: 0px;
    background: @mainBackgroundColor;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    z-index: 2;

    .group-name {
      width: 100%;
      padding: 0 20px 5px;
      margin-bottom: 20px;

      .title {
        margin: 20px 0 15px;
        font-size: 16px;
        font-weight: 400;
        color: @titleColor;
        line-height: 16px;
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

    .search-box {
      width: 218px;
      height: 36px;
      background-color: @searchBackgroundColor;
      border-radius: 10px;
      margin: 15px auto 6px;
      padding: 8px 0 8px 45px;
      background-image: url("../../assets/image/icon_search.png");
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

    .edit-member {
      flex: 1;
      width: 100%;
      overflow-y: auto;

      div {
        display: flex;
        align-items: center;
        padding: 6px 10px;
        cursor: pointer;

        &:hover {
          background: rgba(0, 105, 255, 0.05);
        }

        img {
          width: 36px;
          height: 36px;
          border-radius: 6%;
          display: block;
          margin-right: 10px;
        }

        p {
          font-size: 16px;
          color: @titleColor;
          line-height: 16px;
        }

        p.btn {
          font-weight: 400;
        }
      }
    }

    .exit-group {
      width: 100%;
      height: 46px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 15px 0;
      text-align: center;
      cursor: pointer;

      span {
        font-size: 16px;
        font-weight: 400;
        color: @exitGroupFontColor;
        line-height: 16px;
      }
    }
  }
}
</style>
