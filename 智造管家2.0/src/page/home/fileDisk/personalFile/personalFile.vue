/**
*@desc 个人文件
*@author houpai
*@date 2020/03/21 13:53:43
*/
<template>
  <div class="personalFile_page">
    <div class="header_box">
      <div class="newFolder_btn"
           @click.stop="dialogShow.newFolderDialogShow=true">
        新建文件夹
      </div>
      <div class="search">
        <el-input
            v-model="searchText"
            v-hotkey="{'enter': searchFileByName }"
            clearable
            placeholder="搜索"
            type="text"/>
      </div>
    </div>
    <!--    面包屑-->
    <file-breadcrumb
        :isAllSearch="isAllSearch"
        :searchText="searchText"
        :tagList="tagList"
        @breadcrumbChange="breadcrumbChange">
    </file-breadcrumb>
    <!--    文件操作-->
    <div class="action_box">
      <div class="uploadFile_btn"
           element-loading-spinner="el-icon-loading"
           v-loading="uploadLoading">
        <img src="../../../../assets/images/icon_upload.png" alt="">
        {{uploadLoading ? "上传中...": "上传文件"}}
        <input
            type="file"
            ref="clearFile"
            @change="uploadFile"/>
      </div>
      <div class="action_btn_box">
        <div class="action_btn" @click.stop="downloadFile">
          <img src="../../../../assets/images/icon_download.png" alt="">
          <span>下载</span>
        </div>
        <div class="action_btn" @click.stop="deleteFile">
          <img src="../../../../assets/images/icon_delete.png" alt="">
          <span>删除</span>
        </div>
        <div class="action_btn" @click.stop="moveFile">
          <img src="../../../../assets/images/icon_move.png" alt="">
          <span>移动</span>
        </div>
        <div class="action_btn" style="margin-right: 0" @click.stop="shareFile">
          <img src="../../../../assets/images/icon_share.png" alt="">
          <span>分享</span>
        </div>
      </div>
    </div>
    <!--    文件列表-->
    <div class="fileList_box">
      <el-scrollbar>
        <!--        @selection-change="handleSelectionChange"-->
        <el-table
            :empty-text="'暂无文件'"
            v-loading="fileLoading"
            highlight-current-row
            ref="multipleTable"
            :data="fileList"
            style="width: 100%"
            @row-dblclick="dbClickCurrentChange"
            @current-change="handleCurrentChange">
          <!--          <el-table-column-->
          <!--              type="selection">-->
          <!--          </el-table-column>-->
          <el-table-column
              width="240"
              label="名称">
            <template slot-scope="scope">
              <div class="file_item">
                <img src="../../../../assets/images/icon_file.png"
                     v-if="scope.row.isfile === 1"
                     alt="">
                <img src="../../../../assets/images/icon_excel.png"
                     v-else-if="scope.row.mimetype === 'application/vnd.ms-excel' || scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                     alt="">
                <img src="../../../../assets/images/icon_ppt.png"
                     v-else-if="scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || scope.row.mimetype === 'application/vnd.ms-powerpoint'"
                     alt="">
                <img src="../../../../assets/images/icon_word.png"
                     v-else-if="scope.row.mimetype === 'application/msword' || scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'"
                     alt="">
                <img src="../../../../assets/images/icon_skg.png"
                     v-else-if="scope.row.mimetype === 'image/png' || scope.row.mimetype === 'image/jpeg' || scope.row.mimetype === 'image/gif'"
                     alt="">
                <img src="../../../../assets/images/icon_other.png"
                     v-else
                     alt="">
                <span class="file_name"
                      v-if="!scope.row.modifyFileName">
                  {{ scope.row.name }}
                </span>
                <el-input
                    v-model="scope.row.fileNameModifyText"
                    maxLength="50"
                    :ref="`${scope.row.id}`"
                    v-if="scope.row.modifyFileName"
                    placeholder=""></el-input>
                <span class="modify_fileName"
                      @click.stop="modifyFileName(scope.row,scope.$index)"
                      v-if="!scope.row.modifyFileName">
                  <img src="../../../../assets/images/icon_rename.png" alt="">
                </span>
                <span class="modify_fileName"
                      @click.stop="closeModifyFileName(scope.row,scope.$index)"
                      v-if="scope.row.modifyFileName">
                  <img src="../../../../assets/images/icon_close.png" alt="">
                </span>

                <span class="modify_fileName"
                      @click.stop="submitModifyFileName(scope.row,scope.$index)"
                      v-if="scope.row.modifyFileName">
                  <img src="../../../../assets/images/icon_submit.png" alt="">
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="上传时间">
            <template slot-scope="scope">
              <span class="upload_time_span">
                {{ scope.row.addtime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              prop="displaysize"
              align="center"
              width="120"
              label="大小"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <!--    新建文件弹窗-->
    <new-folder-dialog
        v-if="dialogShow.newFolderDialogShow"
        :new-folder-dialog-show="dialogShow.newFolderDialogShow"
        @submitNewFolderDialog="submitNewFolder"
        @closeNewFolderDialog="handleClose"></new-folder-dialog>
    <!--    提示弹窗-->
    <tips-dialog
        v-if="dialogShow.tipsDialogShow"
        :dialogVisible="dialogShow.tipsDialogShow"
        :dialogRemindDesc="tipsDialogDesc"
        :dialog-type="tipsDialogType"
        @makeSureDeleteFile="makeSureDeleteFile"
        @makeSureModifyFileName="makeSureModifyFileName"
        @closeDialog="handleClose"></tips-dialog>
    <!--    移动文件弹窗-->
    <move-file-dialog
        v-if="dialogShow.moveFolderDialogShow"
        :fileBreadcrumbData="tagList"
        :parentId="currentFolderId"
        :checkedFileId="checkedFileId"
        :moveFolderDialogShow="dialogShow.moveFolderDialogShow"
        @submitMoveFile="submitMoveFile"
        @closeMoveFolderDialog="handleClose"></move-file-dialog>
    <!--    文件分享弹窗-->
    <share-file-dialog
        :shareFileDialogShow="dialogShow.shareFileDialogShow"
        v-if="dialogShow.shareFileDialogShow"
        @submitShareFile="submitShareFile"
        @closeMoveFolderDialog="handleClose"></share-file-dialog>
  </div>
</template>

<script>

  import newFolderDialog from "../../../../components/fileDisk/newFolderDialog";
  import fileBreadcrumb from "../../../../components/fileDisk/fileBreadcrumb";
  import tipsDialog from "../../../../components/tipsDialog/tipsDialog";
  import moveFileDialog from "../../../../components/fileDisk/moveFileDialog";
  import shareFileDialog from "../../../../components/fileDisk/shareFileDialog";
  import {mapState} from "vuex";
  import {serviceHost} from "@/utils/httpConfig";

  export default {
    name: "personalFile",
    components: {
      newFolderDialog,
      fileBreadcrumb,
      tipsDialog,
      moveFileDialog,
      shareFileDialog
    },
    computed: {
      currentFolderId() {
        let currentFolderId = this.tagList[this.tagList.length - 1].folderId;
        return currentFolderId;
      },
      ...mapState(["homeData", "loginData", "imData", "mailListData"])
    },
    data() {
      return {
        dialogShow: {
          newFolderDialogShow: false,
          tipsDialogShow: false,
          moveFolderDialogShow: false,
          shareFileDialogShow: false
        },
        tipsDialogDesc: "您确定要修改吗?",
        tipsDialogType: "makeSureModify",
        searchText: "", // 文件搜索
        isAllSearch: false,
        fileLoading: false,
        uploadLoading: false,
        fileList: [], // 文件列表
        checkedFileId: "", // 当前选中的文件id 移动 删除 分享等
        tagList: [
          {folderName: "个人文件", folderId: 0}
        ],
        messageTimer: null
      };
    },
    methods: {
      /**
       * 获取文件列表
       * @id 文件(文件夹)id
       * @routeRequire 是否需要查询全路径
       * **/
      getFileList(id = 0, routeRequire = true) {
        this.fileList = [];
        this.checkedFileId = "";
        this.fileLoading = true;
        this.$http.request({
          url: "/WpFileController/getChildren",
          method: "get",
          body: {
            parentId: id
          }
        }).then(res => {
          this.fileLoading = false;
          if (res.data.success) {
            let fileList = res.data.data || [];
            fileList.forEach(item => {
              item.modifyFileName = false;
              item.fileNameModifyText = this.$GetFileNameNoExt(item.name);
            });
            // 如果不是根目录,就获取当前目录的全路径拼接面包屑tagList
            if (id && routeRequire) {
              this.getAllRoute(id);
            }
            this.fileList = fileList;
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).catch(e => {
          this.fileLoading = false;
          console.log(e);
        });
      },

      /**
       * 在根目录下搜索文件(夹),tagList只保留根目录
       * 再次点击文件夹查询的时候 再次获取目录的全路径
       * **/
      searchFileByName() {
        // if (!this.searchText) return false;
        this.fileList = [];
        this.isAllSearch = true;
        this.tagList = this.tagList.slice(0, 1);
        this.$http.request({
          url: "/WpFileController/lookup",
          method: "get",
          body: {
            name: this.searchText
          }
        }).then(res => {
          if (res.data.success) {
            let fileList = res.data.data || [];
            fileList.forEach(item => {
              item.modifyFileName = false;
              item.fileNameModifyText = this.$GetFileNameNoExt(item.name);
            });
            this.fileList = fileList;
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).then(e => {
          console.log(e);
        });
      },

      /**
       * 关闭弹窗
       * **/
      handleClose() {
        Object.keys(this.dialogShow).forEach(item => {
          this.dialogShow[item] = false;
        });
      },

      /**
       * 新建文件夹
       * **/
      submitNewFolder(newFolderName) {
        this.$http.request({
          url: "/WpOriginController/createNewFloder",
          method: "post",
          body: {
            parentid: this.currentFolderId,
            folderName: newFolderName
          }
        }).then(res => {
          if (res.data.success) {
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * 获取当前目录的全路径
       * 自行拼接根目录(个人文件)
       * **/
      getAllRoute(id) {
        this.$http.request({
          url: "/WpFileController/returnPath",
          method: "get",
          body: {
            wpFileId: id
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            let tagList = res.data.data || [];
            if (tagList.length) {
              this.tagList.splice(1, this.tagList.length - 1, ...tagList);
            }
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * 面包屑change事件
       * **/
      breadcrumbChange(params) {
        this.isAllSearch = false;
        let {index, folderId} = params;
        this.tagList = this.tagList.slice(0, index + 1);
        this.getFileList(folderId, false);
      },

      /**
       * 文件上传
       * **/
      uploadFile(e) {
        let file = e.target.files || e.dataTransfer.files;
        if (!file.length) return;
        let fileData = file[0];
        let size = fileData.size;
        if (size > 1024 * 1024 * 300) {
          this.$message.error("上传文件不得超过300M");
          return false;
        }
        this.uploadLoading = true;
        let parentid = this.currentFolderId;
        let formData = new FormData();
        formData.append("file", fileData);
        formData.append("parentid", parentid);
        this.$http.request({
          url: "/WpOriginController/uploadFile",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          method: "post",
          body: formData
        }).then(res => {
          this.uploadLoading = false;
          if (res.data.success) {
            this.$message.success(res.data.message || "上传成功");
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
          this.$refs.clearFile.value = ""; // 清空file文件
        }).catch(e => {
          this.uploadLoading = false;
          this.$refs.clearFile.value = ""; // 清空file文件
          console.log(e);
        });
      },

      /**
       * 如果是文件夹类型 不可下载
       * **/
      downloadFile() {
        if (!this.checkedFileId) {
          this.$message.error("请选择文件");
          return false;
        }
        let matchingResults = this.$hasValueFromArray(
          this.fileList,
          "id",
          this.checkedFileId
        );
        if (matchingResults.value && matchingResults.value.isfile) {
          this.$message.error("文件夹不可单独下载");
          return false;
        }
        location.href = serviceHost + `/WpOriginController/download?wpFileId=${this.checkedFileId}`;
      },

      /**
       * 删除文件
       * **/
      deleteFile() {
        if (!this.checkedFileId) {
          this.$message.error("请选择文件");
          return false;
        }
        let fileName = "";
        let matchingResults = this.$hasValueFromArray(
          this.fileList,
          "id",
          this.checkedFileId
        );
        if (matchingResults.value) {
          fileName = matchingResults.value.name;
        }
        this.tipsDialogDesc = `您确定要永久删除文件 " ${fileName} " 吗?`;
        this.tipsDialogType = "makeSureDeleteFile";
        this.dialogShow.tipsDialogShow = true;
      },

      /**
       * 删除文件提交
       * **/
      makeSureDeleteFile() {
        this.$http.request({
          url: "/WpFileController/deleteByPrimaryKey",
          method: "post",
          body: {
            id: this.checkedFileId
          }
        }).then(res => {
          if (res.data.success) {
            this.$message.success("删除成功");
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error("删除失败");
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * 移动文件
       * **/
      moveFile() {
        if (!this.checkedFileId) {
          this.$message.error("请选择文件");
          return false;
        }
        this.dialogShow.moveFolderDialogShow = true;
      },

      /**
       * 移动文件提交
       * **/
      submitMoveFile(folderId) {
        if (folderId === this.checkedFileId) {
          this.$message.error("非法操作");
        }
        this.$http.request({
          url: "/WpFileController/move",
          method: "post",
          body: {
            wpFileId: this.checkedFileId,
            targetId: folderId
          }
        }).then(res => {
          if (res.data.success) {
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * 如果是文件夹类型 不可分享
       * **/
      shareFile() {
        if (!this.checkedFileId) {
          this.$message.error("请选择文件");
          return false;
        }
        let matchingResults = this.$hasValueFromArray(
          this.fileList,
          "id",
          this.checkedFileId
        );
        if (matchingResults.value && matchingResults.value.isfile) {
          this.$message.error("文件夹不可单独分享");
          return false;
        }
        this.dialogShow.shareFileDialogShow = true;
      },

      /**
       * 确认分享文件,分享成功之后匹配vuex中的聊天,如果存在则push新消息如果不存在新建聊天列表
       * **/
      submitShareFile(shareFileParams) {
        let {userList, groupList} = shareFileParams;
        this.$http.request({
          url: "/WpFileController/share",
          headers: {
            "Content-Type": "application/json"
          },
          method: "post",
          body: {
            wpFileId: this.checkedFileId,
            userList: userList,
            groupList: groupList,
            sendMessageId: this.$uuid()
          }
        }).then(res => {
          if (res.data.success) {
            this.$message.success("分享成功");
            this.synchronismChatList(this.checkedFileId, userList, groupList);
            this.handleClose();
          } else {
            this.$message.error("分享失败");
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * 匹配或者新建vuex中的本地聊天记录
       * @params checkedFileId {String}
       * @params userList {Array}
       * @params groupList {Array}
       * **/
      synchronismChatList(checkedFileId, userList = [], groupList = []) {
        console.log("userList", userList);
        let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
        let shareFileItem = this.$hasValueFromArray(
          this.fileList,
          "id",
          checkedFileId
        );
        let content = {
          id: checkedFileId,
          displaysize: shareFileItem.value.displaysize || "",
          name: shareFileItem.value.name || ""
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

      /**
       * 文件选择,如果是文件夹类型,点击切换目录
       * 如果在全盘搜索的话,拼接tag(所有层级)
       * isfile -- 该文件是否为文件夹.
       * **/
      handleCurrentChange(val) {
        if (val) {
          this.checkedFileId = val.id;
        }
      },

      /**
       * 双击文件夹类型 -- 更新目录文件
       * **/
      dbClickCurrentChange(val) {
        if (val && val.isfile) {
          this.isAllSearch = false;
          this.getFileList(this.checkedFileId);
        }
      },

      /**
       * modifyFileName
       * @params fileItem
       * @$index fileList索引
       * **/
      modifyFileName(fileItem, $index) {
        fileItem.modifyFileName = true;
        let refsName = fileItem.id || "";
        this.fileList.forEach((item, index) => {
          item.modifyFileName = index === $index;
        });
        try {
          this.$nextTick(() => {
            this.$refs[refsName].select();
          });
        } catch (e) {
          console.log(e);
        }
      },

      /**
       * closeModifyFileName
       * @params fileItem
       * @$index fileList索引
       * **/
      closeModifyFileName(fileItem, $index) {
        fileItem.modifyFileName = false;
      },

      /**
       * submitModifyFileName
       * @params fileItem
       * @$index fileList索引
       * **/
      submitModifyFileName(fileItem, $index) {
        this.checkedFileId = fileItem.id;
        console.log("checkedFileId", this.checkedFileId);
        if (!fileItem.fileNameModifyText) return false;
        if (!this.$fileNameTest(fileItem.fileNameModifyText)) {
          clearTimeout(this.messageTimer);
          this.messageTimer = setTimeout(() => {
            this.$message.error("名称不能包含 \\ / : * ? \" < > |");
          }, 800);
          return false;
        } else {
          this.tipsDialogDesc = `您确定要修改该文件名为 " ${fileItem.fileNameModifyText} " 吗?`;
          this.tipsDialogType = "makeSureModifyFileName";
          this.dialogShow.tipsDialogShow = true;
        }
      },

      /**
       * 确认修改文件名称
       * **/
      makeSureModifyFileName() {
        let matchingResults = this.$hasValueFromArray(
          this.fileList,
          "id",
          this.checkedFileId
        );
        if (!matchingResults.value) return false;
        this.$http.request({
          url: "/WpFileController/rename",
          method: "post",
          body: {
            wpFileId: this.checkedFileId,
            newName: matchingResults.value.fileNameModifyText
          }
        }).then(res => {
          if (res.data.success) {
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).catch(e => {
          console.log(e);
        });
      }
    },
    created() {
      this.getFileList();
    }
  };
</script>

<style scoped lang="less">

  .personalFile_page {
    height: 100%;
    display: flex;
    flex-direction: column;

    /deep/ .uploadFile_btn .el-loading-mask {
      background-color: rgba(0, 0, 0, .5) !important;
    }

    /deep/ .el-loading-spinner {
      top: 0 !important;
      margin-top: 0 !important;
      height: 100% !important;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px !important;
      overflow: hidden;
    }

    .header_box {
      display: flex;
      align-items: center;
      height: 82px;
      padding: 20px 30px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .search {
        width: 455px;
        height: 42px;
        background-color: @searchBackgroundColor;
        border-radius: 10px;
        background-image: url("../../../../assets/images/icon_search.png");
        background-position: 15px 12px;
        background-repeat: no-repeat;
        background-size: 18px;

        /deep/ .el-input {
          width: 400px;
          margin-left: 45px;
        }

        /deep/ .el-input__inner {
          height: 42px;
          line-height: 42px;
          border: none;
          outline: none;
          background: @searchBackgroundColor;
          font-size: 16px;
          font-weight: 400;
          color: @subTitleColor;
          padding: 0 10px 0 0;
        }
      }
    }

    .newFolder_btn, .uploadFile_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 42px;
      background: @barBackgroundColor;
      color: @mainBackgroundColor;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
      cursor: pointer;

      img {
        display: block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }

    .newFolder_btn {
      width: 120px;
      margin-right: 30px;
    }

    .uploadFile_btn {
      width: 134px;
      margin-right: 30px;
      position: relative;
      overflow: hidden;

      input {
        width: 134px;
        height: 42px;
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }
    }

    .action_box {
      display: flex;
      padding: 10px 30px;
      align-items: center;

      .action_btn_box {
        display: flex;
        height: 100%;
        align-items: center;

        .action_btn {
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;

          img {
            display: block;
            width: 18px;
            height: 18px;
            margin-bottom: 4px;
          }

          span {
            font-size: 16px;
            font-weight: 400;
            color: @mainFontColor;
          }
        }
      }
    }

    .fileList_box {
      flex: 1;
      padding: 20px 30px;
      overflow: hidden;

      .upload_time_span {
        color: @mainFontColor;
      }

      .file_item {
        display: flex;
        align-items: center;

        img {
          display: block;
          width: 45px;
          height: 45px;
          margin-right: 10px;
        }

        .file_name {
          color: @mainFontColor;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /deep/ .el-input {
          width: 132px !important;
        }

        /deep/ .el-input__inner {
          height: 34px !important;
          line-height: 34px !important;
          border-radius: 10px !important;
          border: 1px solid @barBackgroundColor !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          color: @mainFontColor !important;
          padding: 6px 10px !important;
        }

        .modify_fileName {
          margin-left: 10px;
          cursor: pointer;

          img {
            display: block;
            width: 18px;
            height: 18px;
            margin-right: 0;
          }
        }
      }

    }

  }


</style>
