<template>
  <div class="chatDetails_page">
    <!-- <el-scrollbar> -->
    <div class="container">
      <div class="chat-item clearFix" v-for="(item, index) in chatList" :key="index">
        <div
          class="time-box"
          v-if="!item.noShow && $chatIMFormatTimeStamp(Number(item.sendTimestamp), index, chatList)"
        >{{$chatIMFormatTimeStamp(Number(item.sendTimestamp), index, chatList)}}</div>
        <!-- 消息盒子 -->
        <div :class="item.userId !== loginData.userMessage.userid ? 'itemLeft' : 'itemRight'">
          <div class="head-box" v-if="!item.noShow">
            <img
              :src="item.userId !== loginData.userMessage.userid ? item.sendUserHeadUrl : loginData.userMessage.headurl"
              alt
            />
            <div
              class="send-username"
              v-if="targetType==1 && item.userId !== loginData.userMessage.userid"
            >{{item.sendUserName}}</div>
          </div>
          <!-- 文字消息 -->
          <div
            class="msg-box"
            :class="{msgBoxSelect: item.isSelect}"
            v-if="item.messageType === 1"
            @contextmenu.stop="contextmenu($event, item, index)"
          >
            <span>{{item.content}}</span>
            <div class="icon-loading" v-if="item.isSendSuccess === 0">
              <i class="el-icon-loading"></i>
            </div>
            <div class="icon-loading" v-else-if="item.isSendSuccess === 1"></div>
            <div class="icon-warning" v-else-if="item.isSendSuccess === 2">
              <i class="el-icon-warning"></i>
            </div>
          </div>
          <!-- 语音 -->
          <div
            class="audio-box"
            v-if="item.messageType === 2"
            @contextmenu.stop="contextmenu($event, item, index)"
            @click.stop="playImAudio($event, item, index)"
          >
            <img :src="item.isPlaying ? audioPlayImg : audioStaticImg" alt />
            <div v-if="!item.isReaded" class="un-read"></div>
          </div>
          <!-- 图片消息 -->
          <div
            class="img-box"
            v-if="item.messageType === 3"
            @contextmenu.stop="contextmenu($event, item, index)"
          >
            <el-image fit="cover" :src="item.content" :preview-src-list="[item.content]">
              <div slot="error" class="image-slot">
                <i v-if="item.isSendSuccess === 2" class="el-icon-warning"></i>
                <i v-else class="el-icon-loading"></i>
              </div>
            </el-image>
          </div>
          <!-- 文件消息 -->
          <div
            class="file-box"
            v-if="item.messageType === 4"
            @contextmenu.stop="contextmenu($event, item, index)"
          >
            <div class="left-icon">
              <img
                v-if="($GetFileExt2(JSON.parse(item.content).name) === 'doc') || ($GetFileExt2(JSON.parse(item.content).name) === 'docx')"
                src="../../assets/images/icon_word.png"
                alt
              />
              <img
                v-else-if="($GetFileExt2(JSON.parse(item.content).name) === 'xls') || ($GetFileExt2(JSON.parse(item.content).name) === 'xlsx')"
                src="../../assets/images/icon_excel.png"
                alt
              />
              <img
                v-else-if="($GetFileExt2(JSON.parse(item.content).name) === 'ppt') || ($GetFileExt2(JSON.parse(item.content).name) === 'pptx')"
                src="../../assets/images/icon_ppt.png"
                alt
              />
              <img
                v-else-if="($GetFileExt2(JSON.parse(item.content).name) === 'png') || ($GetFileExt2(JSON.parse(item.content).name) === 'jpg')"
                src="../../assets/images/icon_skg.png"
                alt
              />
              <img v-else src="../../assets/images/icon_other.png" alt />
            </div>
            <div class="right-info">
              <p class="name">{{JSON.parse(item.content).name}}</p>
              <p
                class="size"
              >{{JSON.parse(item.content).displaysize || JSON.parse(item.content).displaySize}}</p>
            </div>
            <div class="icon-loading" v-if="item.isSendSuccess === 0">
              <i class="el-icon-loading"></i>
            </div>
            <div class="icon-loading" v-else-if="item.isSendSuccess === 1"></div>
            <div class="icon-warning" v-else-if="item.isSendSuccess === 2">
              <i class="el-icon-warning"></i>
            </div>
          </div>
        </div>
      </div>
      <ul class="contextmenu" :style="{'left': menuLeft, 'top': menuTop}" v-show="menuShow">
        <li v-if="!isSelectAudio && !isSelectFile && !isSelectImg" @click.stop="copy()">复制</li>
        <li v-if="!isSelectAudio" @click.stop="share()">发送给好友</li>
        <li v-if="!isSelectAudio && isSelectFile" @click.stop="saveLocal()">保存到本地</li>
        <li v-if="!isSelectAudio && isSelectFile" @click.stop="saveCloud()">保存到云盘</li>
        <li @click.stop="deleteMsg()">删除</li>
      </ul>
      <audio src ref="audio"></audio>
    </div>
    <!-- </el-scrollbar> -->
    <!--    文件分享弹窗-->
    <share-file-dialog
      :shareFileDialogShow="shareDialogShow"
      :isShareType="true"
      @submitShare="submitShare"
      v-if="shareDialogShow"
      @closeMoveFolderDialog="handleClose"
    ></share-file-dialog>
    <!--    移动文件弹窗-->
    <move-file-dialog
      :fileBreadcrumbData="tagList"
      :isSaveCloudType="true"
      @submitSaveCloudFile="submitSaveCloudFile"
      v-if="moveFolderDialogShow"
      :moveFolderDialogShow="moveFolderDialogShow"
      @closeMoveFolderDialog="handleClose"
    ></move-file-dialog>
  </div>
</template>

<script>
import shareFileDialog from "../fileDisk/shareFileDialog";
import moveFileDialog from "../fileDisk/moveFileDialog";
import audioStaticImg from "../../assets/images/icon_audio_static.png";
import audioPlayImg from "../../assets/images/icon_audio_playing.gif";
import { mapState } from "vuex";
import { serviceHost } from "@/utils/httpConfig";
export default {
  name: "chatDetails",
  components: {
    shareFileDialog,
    moveFileDialog
  },
  computed: {
    ...mapState(["homeData", "loginData", "mailListData", "imData"])
  },
  props: {
    chatList: {
      type: Array,
      default() {
        return [];
      }
    },
    targetType: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  watch: {
    menuShow(newValue, oldValue) {
      this.chatList.forEach((v, e) => {
        if (e == this.selectItemIndex) {
          this.chatList[e].isSelect = true;
        } else {
          this.chatList[e].isSelect = false;
        }
      });
    }
  },
  data() {
    return {
      audioStaticImg: audioStaticImg,
      audioPlayImg: audioPlayImg,
      menuShow: false,
      menuLeft: 0,
      menuTop: 0,
      selectItem: {}, // 记录选中的消息
      selectItemIndex: null, // 记录选中的消息下标
      selectItemIndexCopy: null,
      isSelectFile: false, // 右键选中的消息是否是文件类型
      isSelectAudio: false, // 右键选中的消息是否是语音类型
      isSelectImg: false, // 右键选中的消息是否是图片类型
      shareDialogShow: false, // 分享弹窗
      moveFolderDialogShow: false, // 保存云盘
      tagList: [{ folderName: "个人文件", folderId: 0 }] // 面包屑
    };
  },
  methods: {
    // 语音播放
    playImAudio(e, item, index) {
      e.preventDefault();

      this.chatList[index].isReaded = true;
      let chatListVuex = this.imData.chatList;
      chatListVuex.forEach((v, e) => {
        if (v.id == this.homeData.imSelectedInfo.id) {
          chatListVuex[e].chatList = this.chatList;
        }
      });
      this.$store.commit("imData/saveChatList", chatListVuex);

      let audioEl = document.getElementsByTagName("audio")[0];
      audioEl.setAttribute("src", item.content);
      audioEl.play();
      let timer1 = setTimeout(v => {
        this.chatList.forEach((v, e) => {
          this.chatList[e].isPlaying = false;
        });
        this.chatList[index].isPlaying = true;
        let duration = this.$refs.audio.duration;
        let timer2 = setTimeout(v => {
          this.chatList[index].isPlaying = false;
        }, duration * 1000);
      }, 100);
    },
    // 右键自定义事件
    contextmenu(e, item, index) {
      e.preventDefault();
      console.log("item, index: ", item, index);
      this.selectItem = item;
      this.selectItemIndex = index;
      this.selectItemIndexCopy = index;
      this.isSelectAudio = item.messageType == 2;
      this.isSelectImg = item.messageType == 3;
      this.isSelectFile = item.messageType == 4;
      this.menuShow = true;
      let showFlag = true;
      let top = e.pageY + 10 + "px";
      let left = e.pageX + 10 + "px";
      this.menuLeft = left;
      this.menuTop = top;

      document.onmouseup = () => {
        if (showFlag) {
          this.menuShow = false;
          // this.selectItem = {}; // 记录选中的消息
          this.selectItemIndex = null; // 记录选中的消息下标
        }
        showFlag = true;
      };
    },
    // 复制
    copy(copyText) {
      // console.log('copyText: ', copyText);
      let target = null;
      target = document.createElement("input");
      target.id = "tempTarget";
      target.style.opacity = "0";
      target.value = this.selectItem.content;

      document.body.appendChild(target);

      try {
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        console.log("复制成功");
      } catch (e) {
        console.log("复制失败", e);
      }

      target.parentElement.removeChild(target);
    },
    handleClose() {
      this.moveFolderDialogShow = false;
      this.shareDialogShow = false;
    },
    // 消息分享
    share() {
      this.shareDialogShow = true;
    },
    // 分享确定
    submitShare(val) {
      // console.log("选中分享人 群：", val.userList, val.groupList);
      // console.log("选中会话信息：", this.selectItem);
      this.shareDialogShow = false;

      if (this.selectItem.messageType !== 4) {
        this.mailListData.userList.forEach((v, e) => {
          val.userList.forEach((v2, e2) => {
            if (v2 === v.id) {
              this.sendContentHttp(0, v.id, v.nickname, v.headurl);
            }
          });
        });

        this.mailListData.groupList.forEach((v, e) => {
          val.groupList.forEach((v2, e2) => {
            if (v2 === v.id) {
              this.sendContentHttp(1, v.id, v.groupname);
            }
          });
        });
      } else {
        console.log("this.selectItem.: ", this.selectItem);
        let { userList, groupList } = val;
        this.$http
          .request({
            url: "/WpFileController/share",
            headers: {
              "Content-Type": "application/json"
            },
            method: "post",
            body: {
              wpFileId: JSON.parse(this.selectItem.content).id,
              userList: userList,
              groupList: groupList,
              sendMessageId: this.$uuid()
            }
          })
          .then(res => {
            if (res.data.success) {
              this.$message.success("分享成功");
              this.synchronismChatList(
                JSON.parse(this.selectItem.content),
                userList,
                groupList
              );
              this.handleClose();
            } else {
              this.$message.error("分享失败");
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
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

    // 消息http
    sendContentHttp(
      targettype = 0,
      id,
      toUserName = "",
      headurl = "",
      file = ""
    ) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("senduserid", this.loginData.userMessage.userid);
      formData.append("sendmessageid", this.$uuid());
      formData.append("targetid", id);
      formData.append("targettype", targettype);
      formData.append("content", this.selectItem.content);
      formData.append("nessagetype", this.selectItem.messageType);
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
            let parSon = {
              userId: this.loginData.userMessage.userid,
              sendUserId: this.loginData.userMessage.userid,
              messageId: this.selectItem.id,
              messageType: this.selectItem.messageType,
              content: this.selectItem.content,
              isPlaying: false,
              isReaded: false,
              sendTimestamp: new Date().getTime(),
              sendUserName: this.loginData.userMessage.nickname,
              sendUserHeadUrl: this.loginData.userMessage.headurl,
              toUserId: id,
              toUserName: toUserName,
              toUserHeadUrl: ""
            };
            let parFather = {
              targetType: targettype,
              sessionId: id,
              isActive: false,
              isShowSearch: true,
              unReadMessageCount: 0,
              chatList: [parSon],
              id: id,
              groupname: toUserName,
              username: toUserName,
              headurl: headurl
            };
            let num = 0;
            let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
            chatListVuex.forEach((v, e) => {
              if (v.id === id) {
                chatListVuex[e].chatList.push(parSon);
              } else {
                num++;
              }
            });
            if (num === chatListVuex.length) {
              chatListVuex.push(parFather);
            }
            this.$store.commit("imData/saveChatList", chatListVuex);
            // console.log('this.imData.chatList: ', this.imData.chatList, num, id);
          } else {
            this.$message.error(res.data.message || "服务异常");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 下载到本地
    saveLocal() {
      location.href =
        serviceHost +
        `/WpOriginController/download?wpFileId=${
          JSON.parse(this.selectItem.content).id
        }`;
    },
    // 上传到网盘
    saveCloud() {
      this.moveFolderDialogShow = true;
    },
    // 上传网盘提交
    submitSaveCloudFile(folderId) {
      console.log("folderId: ", folderId);
      if (folderId === JSON.parse(this.selectItem.content).id) {
        this.$message.error("非法操作");
      }
      let formData = new FormData();
      formData.append("wpFileId", JSON.parse(this.selectItem.content).id);
      formData.append("parentid", folderId);
      this.$http
        .request({
          url: "/WpOriginController/saveToMyWP", // 文件上传到网盘
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          body: formData
        })
        .then(res => {
          if (res.data.success) {
            this.moveFolderDialogShow = false;
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteMsg() {
      if (this.chatList.length === 1) {
        // this.chatList.length = 0;
        this.chatList[0].noShow = true;
        this.chatList[0].content = "";
        this.chatList[0].messageType = "0";
      } else {
        this.chatList.splice(this.selectItemIndexCopy, 1);
      }
      console.log("this.chatList: ", this.chatList);
      this.selectItemIndexCopy = null;
    }
  }
};
</script>

<style scoped lang="less">
.clearFix:before,
.clearFix:after {
  content: " ";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.chatDetails_page {
  height: calc(100% - 215px);

  .container {
    padding: 30px 30px 0;
    height: 100%;
    overflow-y: scroll;

    .chat-item {
      margin-bottom: 30px;

      .time-box {
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: @descTitleColor;
        line-height: 14px;
      }

      .itemLeft,
      .itemRight {
        width: 350px;

        // 头像
        .head-box {
          width: 45px;
          height: 45px;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        // 文字消息
        .msg-box {
          margin-top: 15px;
          max-width: 288px;
          padding: 15px 30px;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
          white-space: pre-wrap;
          word-break: break-all;
          position: relative;

          span {
            font-size: 14px;
            font-weight: 400;
            color: @titleColor;
            line-height: 14px;
          }

          .icon-loading,
          .icon-warning {
            position: absolute;
            left: -30px;
            top: 40%;

            i {
              font-size: 18px;
            }
          }

          .icon-warning {
            i {
              color: @exitGroupFontColor;
            }
          }
        }

        .audio-box {
          width: 136px;
          height: 44px;
          margin-top: 15px;
          background: @mainBackgroundColor;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
          position: relative;

          img {
            width: 24px;
            position: absolute;
            left: 15px;
            top: 10px;
          }
        }

        // 图片消息
        .img-box {
          width: 136px;
          // height: 136px;
          margin-top: 15px;
          background: @mainBackgroundColor;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;

          /deep/ .el-image {
            width: 100%;
            display: block;

            .el-icon-circle-close {
              color: #fff;
            }

            img {
              display: block;
            }
          }

          /deep/ .image-slot {
            width: 100%;
            text-align: center;
            padding: 15px;

            i {
              font-size: 34px;
              color: #999;
            }
          }
        }

        // 文件消息
        .file-box {
          margin: 15px 0 0 30px;
          width: 260px;
          background: @mainBackgroundColor;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          padding: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          .left-icon {
            width: 45px;
            margin-right: 10px;

            img {
              display: block;
              width: 100%;
            }
          }

          .right-info {
            flex: 1;
            width: 0;

            .name {
              width: 100%;
              font-size: 14px;
              font-weight: bold;
              color: @titleColor;
              line-height: 20px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .size {
              font-size: 14px;
              font-weight: 400;
              color: @descTitleColor;
              line-height: 20px;
            }
          }

          .icon-loading {
            position: absolute;
            left: -30px;
            top: 15px;
          }
        }
      }

      .itemLeft {
        float: left;
        position: relative;

        .head-box {
          margin-right: 15px;
          float: left;
          /*position: relative;*/

          .send-username {
            position: absolute;
            top: -8px;
            left: 60px;
            font-size: 14px;
            font-weight: bold;
            color: @titleColor;
            line-height: 14px;
          }
        }

        .msg-box {
          float: left;
          background: @mainBackgroundColor;
          border-radius: 0px 32px 32px 32px;
        }

        .msgBoxSelect {
          background: rgba(0, 0, 0, 0.1);
        }

        .audio-box {
          float: left;
          border-radius: 0px 32px 32px 32px;

          .un-read {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: @exitGroupFontColor;
            position: absolute;
            top: 16px;
            right: -22px;
          }
        }

        .img-box {
          float: left;
        }
      }

      .itemRight {
        float: right;

        .head-box {
          margin-left: 15px;
          float: right;
        }

        .msg-box {
          float: right;
          background: @myMsgBackgroundColor;
          border-radius: 32px 0 32px 32px;
        }

        .msgBoxSelect {
          background: @myMsgSelectedBackgroundColor;
        }

        .img-box {
          float: right;
        }
      }
    }

    .contextmenu {
      margin: 0;
      background: @mainBackgroundColor;
      width: 80px;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      z-index: 100;
      position: fixed;
      list-style-type: none;
      font-size: 12px;
      font-weight: 400;
      border-radius: 5px;

      li {
        height: 32px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 12px;
        font-weight: 400;
        color: @descTitleColor;
        line-height: 32px;
        padding-left: 10px;
        cursor: pointer;

        &:last-child {
          border: none;
        }

        &:hover {
          background: rgba(0, 105, 255, 0.05);
        }
      }
    }
  }
}
</style>
