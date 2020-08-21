/**
* @Description: 文件模块组件(网盘文件和项目文件)
* @Author: 侯湃
* @Date: 2020/6/15
*/
<template>
  <div class="cloudDisk_component">
    <div class="search-box">
      <div class="newFolder-search_box">
        <div class="newFolder_btn"
             v-show="isNotPermission('NEW_FOLDER(1)')"
             @click.stop="dialogShow.newFolderDialogShow=true">
          新建文件夹
        </div>
        <div class="input-box">
          <img src="../../assets/image/icon-p-search.png" alt/>
          <input v-model="searchText"
                 v-hotkey="{'enter': searchFileByName }"
                 clearable
                 placeholder="搜索"
                 type="text"/>
        </div>
      </div>
      <div class="breadcrumb_box">
        <file-breadcrumb
            :isAllSearch="isAllSearch"
            :searchText="searchText"
            :tagList="tagList"
            @breadcrumbChange="breadcrumbChange"></file-breadcrumb>
      </div>
    </div>
    <div class="file_box">
      <div class="file_content">
        <div class="file_action_box">
          <div class="uploadFile_btn"
               v-show="isNotPermission('UPLOAD(5)')"
               element-loading-spinner="el-icon-loading">
            <img src="../../assets/image/icon_upload.png" alt="">
            {{"上传文件"}}
            <input multiple
                   @click.stop="$stopstop"
                   type="file"
                   ref="clearFile"
                   @change="uploadFile"/>
          </div>
          <div class="action_btn_box">
            <div class="action_btn"
                 v-show="isNotPermission('DOWNLOAD(6)')"
                 @click.stop="downloadFile">
              <img src="../../assets/image/icon_download.png" alt="">
              <span>下载</span>
            </div>
            <div class="action_btn"
                 v-show="isNotPermission('DELETE(2)')"
                 @click.stop="deleteFile">
              <img src="../../assets/image/icon_delete.png" alt="">
              <span>删除</span>
            </div>
            <div class="action_btn"
                 v-show="isNotPermission('MOVE(3)')"
                 @click.stop="moveFile">
              <img src="../../assets/image/icon_move.png" alt="">
              <span>移动</span>
            </div>
            <div class="action_btn"
                 v-show="isNotPermission('SHARE(4)') && !projectCloudDisk"
                 style="margin-right: 0"
                 @click.stop="shareFile">
              <img src="../../assets/image/icon_share.png" alt="">
              <span>分享</span>
            </div>
          </div>
        </div>
        <!--    文件列表-->
        <div class="fileList_box">
          <el-table
              :empty-text="'暂无文件'"
              v-loading="fileLoading"
              highlight-current-row
              height="100%"
              ref="multipleTable"
              :data="computedFilesList"
              style="width: 100%"
              @row-dblclick="dbClickCurrentChange"
              @current-change="handleCurrentChange">
            <el-table-column
                label="名称">
              <template slot-scope="scope">
                <div class="file_item">
                  <img src="../../assets/image/icon_file.png"
                       v-if="scope.row.isfile === 1 && scope.row.id !== checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_file_checked.png"
                       v-else-if="scope.row.isfile === 1 && scope.row.id === checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_excel.png"
                       v-else-if="(scope.row.mimetype === 'application/vnd.ms-excel' || scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') && scope.row.id !== checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_excel_checked.png"
                       v-else-if="(scope.row.mimetype === 'application/vnd.ms-excel' || scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') && scope.row.id === checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_ppt.png"
                       v-else-if="(scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || scope.row.mimetype === 'application/vnd.ms-powerpoint')&& scope.row.id !== checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_ppt_checked.png"
                       v-else-if="(scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || scope.row.mimetype === 'application/vnd.ms-powerpoint')&& scope.row.id === checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_word.png"
                       v-else-if="(scope.row.mimetype === 'application/msword' || scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && scope.row.id !== checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_word_checked.png"
                       v-else-if="(scope.row.mimetype === 'application/msword' || scope.row.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && scope.row.id === checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_skg.png"
                       v-else-if="(scope.row.mimetype === 'image/png' || scope.row.mimetype === 'image/jpeg' || scope.row.mimetype === 'image/gif') && scope.row.id !== checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_skg_checked.png"
                       v-else-if="(scope.row.mimetype === 'image/png' || scope.row.mimetype === 'image/jpeg' || scope.row.mimetype === 'image/gif') && scope.row.id === checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_other.png"
                       v-else-if="scope.row.id !== checkedFileId"
                       alt="">
                  <img src="../../assets/image/icon_other_checked.png"
                       v-else-if="scope.row.id === checkedFileId"
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
                        v-if="!scope.row.modifyFileName && isNotPermission('RENAME(7)') && scope.row.id!=='uploading'">
                  <img src="../../assets/image/icon_rename.png" alt="">
                </span>
                  <span class="modify_fileName"
                        @click.stop="closeModifyFileName(scope.row,scope.$index)"
                        v-if="scope.row.modifyFileName">
                  <img src="../../assets/image/icon_close.png" alt="">
                </span>

                  <span class="modify_fileName"
                        @click.stop="submitModifyFileName(scope.row,scope.$index)"
                        v-if="scope.row.modifyFileName">
                  <img src="../../assets/image/icon_submit.png" alt="">
                </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="280"
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
                width="280"
                label="进度/大小">
              <template slot-scope="scope">
                <el-progress :percentage="scope.row.progress"
                             :format="format"
                             :status="scope.row.uploadStatus==='error'?'exception':undefined"
                             v-if="scope.row.uploading"></el-progress>
                <div v-else>
                  {{ scope.row.displaysize || "" }}
                </div>
              </template>
            </el-table-column>
            <div slot="empty">
              <div class="empty_tip">
                <img src="../../assets/image/noFile_tip.png" alt="">
                <span>
                    暂无文件,  <i @click.stop="uploadFileClick">去上传</i>
                  </span>
              </div>
            </div>
          </el-table>
        </div>
      </div>
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

  import fileBreadcrumb from "@/components/CloudDisk/fileBreadcrumb";
  import newFolderDialog from "@/components/CloudDisk/newFolderDialog";
  import tipsDialog from "@/components/tipsDialog/tipsDialog";
  import moveFileDialog from "@/components/CloudDisk/moveFileDialog";
  import shareFileDialog from "@/components/CloudDisk/shareFileDialog";

  import {mapState} from "vuex";
  import proto from "@/utils/UploadRequest_pb";
  import proto1 from "@/utils/UploadResponse_pb";

  const CryptoJS = require("crypto-js");
  import {homeSrv} from "../../views/Home/home.service";
  import {loginSrv} from "../../views/Login/login.service";
  import {cloudDiskSrv} from "../../views/CloudDisk/cloudDisk.service";


  export default {
    props: {
      projectCloudDisk: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    components: {
      fileBreadcrumb,
      newFolderDialog,
      tipsDialog,
      moveFileDialog,
      shareFileDialog
    },
    computed: {
      /**
       * @Description: 当前根目录
       * @Author: 侯湃
       * @Date: 2020/5/19
       */
      currentFolderId() {
        let currentFolderId = this.tagList[this.tagList.length - 1].folderId;
        return currentFolderId;
      },
      /**
       * @Description: 文件列表(混合正在上传的文件,前端处理数据)
       * @Author: 侯湃
       * @Date: 2020/5/19
       */
      computedFilesList() {
        let computedFilesList;
        if (!this.projectCloudDisk) {
          computedFilesList = this.uploadData.uploadingFileList.concat(this.fileList);
          computedFilesList = computedFilesList.filter(item => {
            return item.parentid == this.currentFolderId && item.fileSpaceId == this.fileDiskData.checkedFileSpaceMessage.fileSpaceId;
          });
        } else {
          computedFilesList = this.uploadData.uploadingFileListProject.concat(this.fileList);
          computedFilesList = computedFilesList.filter(item => {
            return item.parentid == this.currentFolderId && item.fileSpaceId == this.fileDiskData.checkedFileSpaceMessage.fileSpaceId;
          });
          console.log("computedFilesList filtered", computedFilesList, this.currentFolderId);
        }
        return computedFilesList;
      },
      ...mapState(["homeData", "loginData", "imData", "mailListData", "fileDiskData", "uploadData"])
    },
    data() {
      return {
        fileSpaceList: [],
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
        ], // 面包屑
        messageTimer: null,
        uploadFileSocket: null, // webSocket 文件上传
        isDestroy: false // 用于优化计算大文件SHA1值过久(组件销毁之后还在继续执行)的内存回收问题
      };
    },
    methods: {
      /**
       * 文件上传webSocket初始化
       * **/
      uploadFileSocketInit() {
        console.log("文件上传sokect连接中...");
        let severToken = window.localStorage.getItem("serverToken");
        if (!severToken) {
          this.$message("登录已过期,请重新登录");
          this.$routerLink("login");
          return false;
        }
        // let socketUrl = "wss://" + this.loginData.imServerToken.ImServer + "/im_websocket";
        let socketUrl = this.$globalServiceHost.fileDiskSocketHost;
        this.uploadFileSocket = new WebSocket(socketUrl);
        this.uploadFileSocket.binaryType = "arraybuffer";
        this.uploadFileSocket.onopen = this.websocketonopen;
        this.uploadFileSocket.onmessage = this.websocketonmessage;
        this.uploadFileSocket.onerror = this.websocketonerror;
        this.uploadFileSocket.onclose = this.websocketclose;
      },

      /**
       * proto UploadRequest
       * **/
      UploadRequest() {
        let UploadRequest = new proto.UploadRequest();
        return UploadRequest;
      },

      /**
       * proto UploadResponse
       * **/
      UploadResponse() {
        let UploadResponse = new proto1.UploadResponse();
        return UploadResponse;
      },

      /**
       * proto CreationRequest
       * **/
      CreationRequest() {
        let CreationRequest = new proto.CreationRequest();
        return CreationRequest;
      },

      /**
       * proto PatchRequest
       * **/
      PatchRequest() {
        let PatchRequest = new proto.PatchRequest();
        return PatchRequest;
      },

      /**
       *@desc websocket连接成功后,如果还有待上传,则继续上传.
       *@author houpai
       *@date 2020/03/26 10:59:01
       */
      websocketonopen() {
        console.log("文件上传sokect连接成功");
        if (this.uploadData.uploadingFileList.length && this.uploadData.uploadingFileList[0].uploadOffset && this.uploadData.uploadingFileList[0].chunkSize && this.uploadData.uploadingFileList[0].fileId) {
          let patchParams = {
            uploadOffset: this.uploadData.uploadingFileList[0].uploadOffset,
            chunkSize: this.uploadData.uploadingFileList[0].chunkSize,
            fileId: this.uploadData.uploadingFileList[0].fileId
          };
          this.synchronizationUploadHandle("PatchRequest", patchParams);
        } else if (this.uploadData.uploadingFileList.length && !this.uploadData.uploadingFileList[0].fileId) {
          this.synchronizationUploadHandle("CreationRequest");
        }
      },

      /**
       *@desc websocket接收消息,protocol反序列化
       *@author houpai
       *@date 2020/03/26 11:48:24
       */
      websocketonmessage(e) {
        this.uploadResponseHandle(e);
      },

      websocketonerror() {
        console.log("文件上传socket连接错误");
      },

      websocketclose() {
        if (!this.uploadFileSocket) {
          console.log("socket重新连接");
          setTimeout(() => {
            this.uploadFileSocketInit();
          }, 3000);
        }
      },

      /**
       * socket responese 消息处理,每上传成功一条 vuex待上传(同步队列)清除首条.
       * response MsgType:  SUCCESS = 1; ERROR = 2;
       * response Body:
       *  SuccessResponse(
       *    fileId -- web端用不到,
       *    newOffset -- 再次上传的切片索引,
       *    chunkSize -- 切片大小,
       *    isFinish -- 是否上传完成)
       * @param: data protocolbuff 数据
       * **/
      uploadResponseHandle(e) {
        let uploadResponse = new proto1.UploadResponse.deserializeBinary(e.data);
        let uploadFileAry, uploadingFileList;
        if (!this.projectCloudDisk) {
          uploadFileAry = this.uploadData.uploadFileAry.concat();
          uploadingFileList = this.uploadData.uploadingFileList.concat();
        } else {
          uploadFileAry = this.uploadData.uploadFileAryProject.concat();
          uploadingFileList = this.uploadData.uploadingFileListProject.concat();
        }
        let msgType = uploadResponse.getMsgtype();
        if (msgType === 1) {
          let SuccessResponse = uploadResponse.getSuccessresponse();
          let successCode = SuccessResponse.getCode();
          // jwtToken即将过期
          console.log("successCode", successCode);
          if (successCode == "10008") {
            // console.log('jwtToken即将过期');
            this.getServerToken();
          }
          let newOffset = SuccessResponse.getNewoffset();
          let fileId = SuccessResponse.getFileid();
          let chunkSize = SuccessResponse.getChunksize();
          let isFinish = SuccessResponse.getIsfinish();
          if (isFinish) {
            uploadFileAry.splice(0, 1);
            uploadingFileList.splice(0, 1);
            if (!this.projectCloudDisk) {
              this.$store.commit("uploadData/saveUploadFileAry", uploadFileAry);
              this.$store.commit("uploadData/saveUploadingFileList", uploadingFileList);
            } else {
              this.$store.commit("uploadData/saveUploadFileAryProject", uploadFileAry);
              this.$store.commit("uploadData/saveUploadingFileListProject", uploadingFileList);
            }
            if (this.uploadData.uploadFileAry.length) {
              this.synchronizationUploadHandle("CreationRequest");
            }
            this.getFileList(this.currentFolderId);
          } else {
            if (uploadingFileList.length) {
              let progress = (newOffset * chunkSize) / uploadingFileList[0].filesize;
              uploadingFileList[0].progress = Number(progress) * 100;
              uploadingFileList[0].uploadOffset = newOffset;
              uploadingFileList[0].chunkSize = chunkSize;
              uploadingFileList[0].uploadStatus = "uploading";
              uploadingFileList[0].fileId = fileId;
              if (!this.projectCloudDisk) {
                this.$store.commit("uploadData/saveUploadingFileList", uploadingFileList);
              } else {
                this.$store.commit("uploadData/saveUploadingFileListProject", uploadingFileList);
              }
            }
            let patchParams = {
              uploadOffset: newOffset,
              chunkSize: chunkSize,
              fileId: fileId
            };
            this.synchronizationUploadHandle("PatchRequest", patchParams);
          }
        } else if (msgType === 2) {
          // 上传失败的时候处理,上传进度样式置红,同时处理vuex里相应的缓存数据
          let ErrorResponse = uploadResponse.getErrorresponse();
          let errorMessage = ErrorResponse.getMessage();
          let errorCode = ErrorResponse.getCode();
          this.$message.error(errorMessage || "上传失败");
          // jwtToken失效重新获取,然后再次重新上传
          if (errorCode == "10009") {
            console.log("errCode", errorCode);
            this.getServerToken();
            this.synchronizationUploadHandle("CreationRequest");
          } else if (this.uploadData.uploadFileAry.length) {
            uploadingFileList[0].uploadStatus = "error";
            uploadFileAry.splice(0, 1);
            uploadingFileList.splice(0, 1);
            if (!this.projectCloudDisk) {
              this.$store.commit("uploadData/saveUploadFileAry", uploadFileAry);
              this.$store.commit("uploadData/saveUploadingFileList", uploadingFileList);
            } else {
              this.$store.commit("uploadData/saveUploadFileAryProject", uploadFileAry);
              this.$store.commit("uploadData/saveUploadingFileListProject", uploadingFileList);
            }
            this.synchronizationUploadHandle("CreationRequest");
          }
        }
      },

      readBlob(file, start, step, reader) {
        //指定开始位置和结束位置读取文件
        let blob = file.slice(start, start + step);
        reader.readAsArrayBuffer(blob);
      },

      /**
       * 同步上传处理,取vuex头一条待上传的file,依次处理
       * @param: type CreationRequest 初次上传 PatchRequest 切片续传
       * @param: patchParams 切片续传参数 {uploadOffset:1,chunkSize:2}
       * **/
      synchronizationUploadHandle(type = "CreationRequest", patchParams = {}) {
        if (!this.uploadFileSocket) {
          this.$message.error("网络连接异常");
          return false;
        }
        let uploadFileAry, uploadingFileList;
        if (this.projectCloudDisk) {
          uploadFileAry = this.uploadData.uploadFileAryProject || [];
          uploadingFileList = this.uploadData.uploadingFileListProject.concat();
        } else {
          uploadFileAry = this.uploadData.uploadFileAry || [];
          uploadingFileList = this.uploadData.uploadingFileList.concat();
        }
        if (!uploadFileAry.length) return false;
        let uploadFile = uploadFileAry[0];
        let size = uploadFile.size;
        let name = uploadFile.name;
        let vm = this;
        let parentId = String(this.currentFolderId);
        let fileSpaceId;
        let sha1 = CryptoJS.algo.SHA1.create();
        let step = 1024 * 1024;
        let total = uploadFile.size;
        let cuLoaded = 0;
        if (type === "CreationRequest") {
          let reader = new FileReader();
          // reader.readAsArrayBuffer(uploadFile);
          vm.readBlob(uploadFile, 0, step, reader);
          console.time("计算文件sha1耗时");
          reader.onload = function (e) {
            let wordBuffer = CryptoJS.lib.WordArray.create(e.target.result);
            sha1.update(wordBuffer);
            cuLoaded += e.loaded;
            //如果没有读完，继续
            if (cuLoaded < total && !vm.isDestroy) {
              // console.info("cuLoaded:" + cuLoaded, vm.isDestroy);
              vm.readBlob(uploadFile, cuLoaded, step, reader);
            } else if (!vm.isDestroy) {
              cuLoaded = total;
              // let hash = sha1.array(reader.result);// 优化前不是分流计算的方式
              // let sha1Base64 = vm.$arrayBufferToBase64(hash); // 优化前不是分流计算的方式
              let sha1Base64 = sha1.finalize().toString(CryptoJS.enc.Base64);
              console.log("sha1 base64 === ", sha1Base64);
              console.timeEnd("计算文件sha1耗时");
              let UploadRequest = vm.UploadRequest();
              let CreationRequest = vm.CreationRequest();
              CreationRequest.setHashsha512(sha1Base64);
              CreationRequest.setFilename(name);
              CreationRequest.setFilesize(size);
              CreationRequest.setParentid(parentId);
              UploadRequest.setAction(3);
              let jwtToken = localStorage.getItem("serverToken");
              console.log("jwtToken", jwtToken);
              UploadRequest.setJwttoken(jwtToken);
              // fileSpaceId = vm.fileDiskData.checkedFileSpaceMessage.fileSpaceId;
              fileSpaceId = uploadingFileList[0].fileSpaceId;
              UploadRequest.setFilespaceid(fileSpaceId);
              UploadRequest.setCreationrequest(CreationRequest);
              let buff = UploadRequest.serializeBinary();
              console.log("buffer ===", buff);
              try {
                vm.uploadFileSocket.send(buff.buffer);
              } catch (e) {
                console.log(e, "socket端开连接");
              }
            }
          };
        } else {
          // 切片上传
          console.log(type, patchParams);
          let start = patchParams.uploadOffset * patchParams.chunkSize;
          let end = start + patchParams.chunkSize;
          let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
          if (end > size) {
            end = size;
          }
          let reader = new FileReader();
          reader.readAsArrayBuffer(blobSlice.call(uploadFile, start, end));
          reader.onload = function (e) {
            let UploadRequest = vm.UploadRequest();
            let PatchRequest = vm.PatchRequest();
            fileSpaceId = uploadingFileList[0].fileSpaceId;
            UploadRequest.setFilespaceid(fileSpaceId);
            UploadRequest.setAction(1);
            let jwtToken = localStorage.getItem("serverToken");
            UploadRequest.setJwttoken(jwtToken);
            PatchRequest.setUploadoffset(patchParams.uploadOffset);
            PatchRequest.setChunksize(patchParams.chunkSize);
            PatchRequest.setFileid(patchParams.fileId);
            PatchRequest.setData(new Uint8Array(e.target.result));
            UploadRequest.setPatchrequest(PatchRequest);
            console.log("UploadRequest", UploadRequest);
            let buff = UploadRequest.serializeBinary();
            vm.uploadFileSocket.send(buff.buffer);
          };
        }
      },

      /**
       * socket文件切片上传 文件大小不得300M,
       * 上传过程中计算文件上传进度,正确的显示在对应的网盘目录里
       * (组数据存入vuex,同时网盘fileList改为computed处理是否显隐)
       * 发送createUpload获取文件切片大小和切片索引.
       * **/
      uploadFile(e) {
        let file = e.target.files || e.dataTransfer.files;
        if (!file.length) return false;
        let fileAry = Array.from(file);
        let isAllow = true;
        for (let i = 0; i < fileAry.length; i++) {
          if (fileAry[i].size > 1024 * 1024 * 300) {
            this.$message.error("单个上传文件不得超过300M");
            this.$refs.clearFile.value = ""; // 清空file文件
            isAllow = false;
            break;
          }
        }
        if (!isAllow) return false;
        if (!this.uploadFileSocket) {
          this.$message.error("网络连接异常,请稍候重试");
          this.$refs.clearFile.value = ""; // 清空file文件
          return false;
        }
        let uploadFileAry, uploadingFileList;
        if (this.projectCloudDisk) {
          uploadFileAry = this.uploadData.uploadFileAryProject;
          uploadingFileList = this.uploadData.uploadingFileListProject;
        } else {
          uploadFileAry = this.uploadData.uploadFileAry;
          uploadingFileList = this.uploadData.uploadingFileList;
        }
        uploadFileAry = uploadFileAry.concat(fileAry);
        fileAry.length && fileAry.forEach(item => {
          let uploadingFileItem = {
            uploadOffset: 0,
            chunkSize: 0,
            fileId: "",
            id: "uploading",
            userid: "",
            filesize: item.size,
            name: item.name,
            modifyFileName: false,
            fileNameModifyText: this.$GetFileNameNoExt(item.name),
            displaysize: "",
            addtime: this.$formatedDate(new Date()),
            parentid: this.currentFolderId,
            isfile: 0,
            mimetype: item.type,
            uploading: true, // 是否待上传
            uploadStatus: "wait", // wait uploading error
            fileSpaceId: this.fileDiskData.checkedFileSpaceMessage.fileSpaceId,
            progress: 0
          };
          uploadingFileList.push(uploadingFileItem);
        });
        // 更新vuex中uploadingFileList,computed中处理文件显示上传进度,上传完成后清除
        if (this.projectCloudDisk) {
          this.$store.commit("uploadData/saveUploadFileAryProject", uploadFileAry);
          this.$store.commit("uploadData/saveUploadingFileListProject", uploadingFileList);
        } else {
          this.$store.commit("uploadData/saveUploadFileAry", uploadFileAry);
          this.$store.commit("uploadData/saveUploadingFileList", uploadingFileList);
        }
        this.$refs.clearFile.value = ""; // 清空file文件
        let continueUpload = true;
        for (let i = 0; i < uploadingFileList.length; i++) {
          if (uploadingFileList[i].uploadStatus === "uploading") {
            continueUpload = false;
            break;
          }
        }
        if (continueUpload) {
          this.synchronizationUploadHandle("CreationRequest");
        }
      },

      /**
       * 获取文件列表
       * @id 文件(文件夹)id
       * @routeRequire 是否需要查询全路径
       * **/
      getFileList(id = 0, routeRequire = true) {
        this.fileList = [];
        this.checkedFileId = "";
        this.fileLoading = true;
        let params = {
          fileSpaceId: this.fileDiskData.checkedFileSpaceMessage.fileSpaceId,
          parentId: id,
          isFinish: 1,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.getFileList(params).then(response => {
          this.fileLoading = false;
          if (response.success) {
            let fileList = response.data || [];
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
            this.$message.error(response.message || "获取文件列表报错");
          }
        }).catch(error => {
          console.log(error);
          this.fileLoading = false;
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
        let params = {
          name: this.searchText,
          isFinish: 1,
          fileSpaceId: this.fileDiskData.checkedFileSpaceMessage.fileSpaceId,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.searchFileByName(params).then(response => {
          if (response.success) {
            let fileList = response.data || [];
            fileList.forEach(item => {
              item.modifyFileName = false;
              item.fileNameModifyText = this.$GetFileNameNoExt(item.name);
            });
            this.fileList = fileList;
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
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
        let params = {
          parentId: this.currentFolderId,
          folderName: newFolderName,
          fileSpaceId: this.fileDiskData.checkedFileSpaceMessage.fileSpaceId,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.submitNewFolder(params).then(response => {
          if (response.success) {
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 获取当前目录的全路径
       * 自行拼接根目录(个人文件)
       * **/
      getAllRoute(id) {
        let params = {
          fileId: id,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.getAllRoute(params).then(response => {
          if (response.success) {
            let tagList = response.data || [];
            if (tagList.length) {
              this.tagList.splice(1, this.tagList.length - 1, ...tagList);
            }
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
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
       * 如果是文件夹类型 不可下载
       * **/
      downloadFile() {
        if (this.checkedFileId === "uploading") {
          this.$message.error("上传中的文件不可操作");
          return false;
        }
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
        this.submitDownloadFile(this.checkedFileId);
      },

      /**
       * 文件是否可以下载
       * **/
      submitDownloadFile(fileId) {
        let vm = this;
        window.removeEventListener("beforeunload", vm.$returnValue, false);
        let params = {
          fileId: fileId,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.submitDownloadFile(params).then(response => {
          if (response.success) {
            location.href = this.$globalServiceHost.fileDiskServiceHost + "/file" + response.data;
            window.addEventListener("beforeunload", vm.$returnValue, false);
          } else {
            this.$message.error(response.message || "文件下载接口报错");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 删除文件
       * **/
      deleteFile() {
        if (this.checkedFileId === "uploading") {
          this.$message.error("上传中的文件不可操作");
          return false;
        }
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
        let params = {
          fileId: this.checkedFileId,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.makeSureDeleteFile(params).then(response => {
          if (response.success) {
            this.$message.success("删除成功");
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(response.message || "删除失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 移动文件
       * **/
      moveFile() {
        if (this.checkedFileId === "uploading") {
          this.$message.error("上传中的文件不可操作");
          return false;
        }
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
          return false;
        }
        let params = {
          fileId: this.checkedFileId,
          targetId: folderId,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.submitMoveFile(params).then(response => {
          if (response.success) {
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 如果是文件夹类型 不可分享
       * **/
      shareFile() {
        if (this.checkedFileId === "uploading") {
          this.$message.error("上传中的文件不可操作");
          return false;
        }
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
        let params = {
          fileId: this.checkedFileId,
          userList: userList,
          groupList: groupList,
          sendMessageId: this.$uuid(),
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.submitShareFile(params).then(response => {
          if (response.success) {
            this.$message.success("分享成功");
            this.synchronismChatList(this.checkedFileId, userList, groupList);
            this.handleClose();
          } else {
            this.$message.error("分享失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 匹配或者新建vuex中的本地聊天记录
       * @params checkedFileId {String}
       * @params userList {Array}
       * @params groupList {Array}
       * **/
      synchronismChatList(checkedFileId, userList = [], groupList = []) {
        let chatListVuex = JSON.parse(JSON.stringify(this.imData.chatList));
        let shareFileItem = this.$hasValueFromArray(
          this.computedFilesList,
          "id",
          checkedFileId
        );
        // console.log("shareFileItem===", shareFileItem);
        if (!shareFileItem.value) return false;
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
        // console.log("chatListVuex", chatListVuex);
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
        if (val.id === "uploading") {
          return false;
        }
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
        if (fileItem.id === "uploading") {
          return false;
        }
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
      closeModifyFileName(fileItem) {
        fileItem.modifyFileName = false;
      },

      /**
       * submitModifyFileName
       * @params fileItem
       * @$index fileList索引
       * **/
      submitModifyFileName(fileItem) {
        this.checkedFileId = fileItem.id;
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
        let params = {
          fileId: this.checkedFileId,
          newName: matchingResults.value.fileNameModifyText,
          token: localStorage.getItem("serverToken")
        };
        cloudDiskSrv.makeSureModifyFileName(params).then(response => {
          if (response.success) {
            this.handleClose();
            this.getFileList(this.currentFolderId, false);
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 是否有权限操作文件
       * @params actionType String 文件操作类型
       * **/
      isNotPermission(actionType) {
        let actionPermission = false;
        let actionString = "";
        switch (actionType) {
          case "BROWSE(0)":
            actionString = "0";
            break;
          case "NEW_FOLDER(1)":
            actionString = "1";
            break;
          case "DELETE(2)":
            actionString = "2";
            break;
          case "MOVE(3)":
            actionString = "3";
            break;
          case "SHARE(4)":
            actionString = "4";
            break;
          case "UPLOAD(5)":
            actionString = "5";
            break;
          case "DOWNLOAD(6)":
            actionString = "6";
            break;
          case "RENAME(7)":
            actionString = "7";
            break;
          case "SAVE_TO_SPACE(8)":
            actionString = "8";
            break;
          default:
            actionString = "undefined";
        }
        actionPermission = this.fileDiskData.checkedFileSpaceMessage.filePermission.includes(actionString);
        if (this.projectCloudDisk) {
          actionPermission = true;
        }
        return actionPermission;
      },

      /**
       * @Description: 上传进度format
       * @Author: 侯湃
       * @Date: 2020/5/20
       */
      format(percentage) {
        return percentage === 0 ? "等待" : `${percentage.toFixed(0)}%`;
      },

      /**
       * @Description: 刷新jwttoken
       * @Author: 侯湃
       * @Date: 2020/6/2
       */
      getServerToken() {
        loginSrv.getServerToken().then(response => {
          if (response.success) {
            try {
              let imServerToken = {...response.data};
              window.localStorage.setItem("serverToken", response.data.jwtToken || "");
              this.$store.commit("loginData/saveImServerToken", imServerToken);
              window.localStorage.setItem("online", "true");
            } catch (e) {
              console.log(e);
            }
          } else {
            this.$message.error(response.message || "获取JWTTOKEN接口报错");
          }
        }).catch(error => {
          console.log(error);
        });
      },

      /**
       * 点击缺醒提示上传
       * **/
      uploadFileClick() {
        this.$nextTick(() => {
          try {
            this.$refs.clearFile.click();
          } catch (e) {
            console.log(e);
          }
        });
      }
    },
    created() {
      this.uploadFileSocketInit();
    },
    mounted() {
      this.$bus.on("getFileListByFileSpaceId", () => {
        this.tagList = [{
          folderName: this.fileDiskData.checkedFileSpaceMessage.fileSpaceName,
          folderId: 0
        }];
        this.getFileList();
      });
    },
    beforeDestroy() {
      this.isDestroy = true;
      if (this.uploadFileSocket) {
        this.uploadFileSocket.close();
      }
    }
  };
</script>

<style scoped lang="less">
  .cloudDisk_component {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    /deep/ .uploadFile_btn .el-loading-mask {
      background-color: rgba(255, 255, 255, .0) !important;
    }

    /deep/ .el-table::before {
      display: none !important;
    }

    /deep/ .el-table__header-wrapper {
      font-size: 16px;

      .has-gutter .cell {
        color: @titleColor;
        font-weight: 400;
      }
    }

    .uploadFile_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      background: @barBackgroundColor;
      color: @mainBackgroundColor;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
      cursor: pointer;
      width: 134px;
      margin-right: 40px;
      position: relative;
      overflow: hidden;
      z-index: 100;

      img {
        display: block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }

      input {
        width: 134px;
        height: 36px;
        position: absolute;
        opacity: 0;
        z-index: 1;
      }
    }


    .search-box {
      padding: 12px 10px;

      .input-box {
        background: @searchBackgroundColor;
        border-radius: 10px;
        width: 286px;
        height: 34px;
        padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 21px;
          margin-right: 9px;
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

    .search-box {
      padding: 12px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .newFolder-search_box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .newFolder_btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 30px;
          background: @barBackgroundColor;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 400;
          color: @fontColorFFF;
        }
      }
    }

    .file_box {
      flex: 1;
      height: 0;
      padding: 20px;

      .file_content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: @mainBackgroundColor;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;


        .file_action_box {
          display: flex;
          padding: 20px 10px;
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
                font-size: 14px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
            }
          }
        }

        .fileList_box {
          flex: 1;
          padding: 0;
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
              min-width: 180px !important;
              max-width: 260px !important;
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
    }

    .empty_tip {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        display: block;
        width: 237px;
        height: 232px;
      }

      span {
        display: inline-block;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        cursor: pointer;
      }

      i {
        text-decoration: underline;
        color: @barBackgroundColor;
      }
    }
  }
</style>
