/**
*@desc 发送文件弹窗，会话文件保存网盘组件
*@author tiandong
*@date 2020/03/23 11:14:23
*/
<template>
  <el-dialog
    :title="isFileSaveCloud?'选择保存目录':'选择文件'"
    class="moveFileDialog_page"
    :append-to-body="true"
    :visible.sync="moveFolderDialogShow"
    :before-close="handleClose"
  >
    <ul class="fileType">
      <li
        v-for="item in filterFileSapceList"
        @click.stop="checkedFileSpace(item)"
        :class="[{'checkedFolderId':checkedFileSpaceMessage.fileSpaceId === item.id}, {'isOnePlace':fileSpaceList.length === 1}]"
        :key="item.id"
      >{{item.name || ""}}</li>
    </ul>
    <file-breadcrumb :tagList="tagList" @breadcrumbChange="breadcrumbChange"></file-breadcrumb>
    <!-- 文件保存到网盘 -->
    <ul class="folder_list" v-loading="folderLoading" v-if="isFileSaveCloud">
      <el-scrollbar>
        <li
          v-for="(item,index) in folderList"
          @click.stop="currentSelect2(item)"
          @dblclick.stop="getFileList(item.id, true, item)"
          :class="[{'checkedFolderId':checkedFolderId === item.id}]"
          :key="index"
          v-if="item.isfile == 1"
        >
          <div class="folder_icon_box">
            <img v-if="item.isfile == 1" src="../../assets/image/icon_file.png" alt />
          </div>

          <p class="folder_name">{{item.name}}</p>
          <div class="folder_icon_box">
            <i class="el-icon-arrow-right"></i>
          </div>
        </li>
      </el-scrollbar>
    </ul>
    <!-- 网盘选择文件发送 -->
    <ul class="folder_list" v-loading="folderLoading" v-else>
      <el-scrollbar>
        <li
          v-for="(item,index) in folderList"
          @click.stop="currentSelect(item)"
          @dblclick.stop="getFileList(item.id, true, item)"
          :class="[{'checkedFolderId':checkedFolderId === item.id}]"
          :key="index"
        >
          <div class="folder_icon_box">
            <img v-if="item.isfile == 1" src="../../assets/image/icon_file.png" alt />
            <img
              v-else-if="($GetFileExt2(item.name) === 'doc') || ($GetFileExt2(item.name) === 'docx')"
              src="../../assets/image/icon_word.png"
              alt
            />
            <img
              v-else-if="($GetFileExt2(item.name) === 'xls') || ($GetFileExt2(item.name) === 'xlsx')"
              src="../../assets/image/icon_excel.png"
              alt
            />
            <img
              v-else-if="($GetFileExt2(item.name) === 'ppt') || ($GetFileExt2(item.name) === 'pptx')"
              src="../../assets/image/icon_ppt.png"
              alt
            />
            <img
              v-else-if="($GetFileExt2(item.name) === 'png') || ($GetFileExt2(item.name) === 'jpg')"
              src="../../assets/image/icon_skg.png"
              alt
            />
            <img v-else src="../../assets/image/icon_other.png" alt />
          </div>

          <p class="folder_name">{{item.name}}</p>
          <p class="folder_size" v-if="item.isfile !== 1">{{item.displaysize}}</p>
          <div class="folder_icon_box" v-if="item.isfile == 1">
            <i class="el-icon-arrow-right"></i>
          </div>
        </li>
      </el-scrollbar>
    </ul>
    <span slot="footer" class="dialog-footer">
      <button
        :class="[{'disabled_btn':tagList.length === 1}]"
        class="back_pre_folder_btn action_btn"
        @click="backPreFolder"
      >返回上一级</button>
      <!--      :class="[{'disabled_btn':checkedFolderId === ''}]"-->
      <button class="sure_btn action_btn" @click="submitHandle">{{isFileSaveCloud?"保存":"发送"}}</button>
    </span>
  </el-dialog>
</template>

<script>
import fileBreadcrumb from "../CloudDisk/fileBreadcrumb";
import { cloudDiskSrv } from "../../views/CloudDisk/cloudDisk.service";
import { mapState } from "vuex";

export default {
  name: "moveFileDialog",
  components: {
    fileBreadcrumb
  },
  props: {
    moveFolderDialogShow: {
      type: Boolean,
      default() {
        return false;
      }
    },
    currentcheckedFolderIdFiles: {
      type: Array,
      default() {
        return [];
      }
    },
    fileBreadcrumbData: {
      type: Array,
      default() {
        return [];
      }
    },
    isFileSaveCloud: {
      type: Boolean,
      default() {
        return false;
      }
    },
    filterFileSapceList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    ...mapState(["homeData", "fileDiskData"]),
    currentFolderId() {
      let currentFolderId = 0;
      if (this.tagList.length) {
        currentFolderId = this.tagList[this.tagList.length - 1].folderId;
      }
      return currentFolderId;
    },
    fileSpaceId() {
      let tagertSpaceId = this.checkedFileSpaceMessage.fileSpaceId || "";
      return tagertSpaceId;
    }
  },
  watch: {
    fileBreadcrumbData: {
      handler(val, oldVal) {
        this.tagList = val.concat([]);
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      fileSpaceList: [],
      checkedFileSpaceMessage: {},
      folderLoading: false,
      tagList: [{ folderName: "", folderId: 0 }], // 面包屑 只显示文件夹类型
      folderList: [], // 文件夹列表
      checkedFolderId: "", // 当前文件id
      checkedFileDetails: {} // 当前文件信息
    };
  },
  methods: {
    checkedFileSpace(fileSpaceItem) {
      if (fileSpaceItem.id === this.checkedFileSpaceMessage.fileSpaceId) {
        return false;
      }
      this.checkedFileSpaceMessage = {
        fileSpaceName: fileSpaceItem.name || "",
        fileSpaceId: fileSpaceItem.id || "",
        filePermission: fileSpaceItem.permission.split(",") || []
      };
      this.tagList = [
        {
          folderName: this.checkedFileSpaceMessage.fileSpaceName,
          folderId: 0
        }
      ];
      this.getFileList();
    },
    /**
     * handleClose
     * **/
    handleClose() {
      this.$emit("closeMoveFolderDialog");
    },

    /**
     * 获取文件列表
     * @id 文件(文件夹)id
     * @routeRequire 是否需要查询全路径
     * **/
    getFileList(id = 0, routeRequire = true, item = {}) {
      if (item.isfile == 0) {
        return;
      }
      this.folderLoading = true;
      let par = {
        parentId: id,
        isFinish: 1,
        fileSpaceId: this.checkedFileSpaceMessage.fileSpaceId,
        token: localStorage.getItem("serverToken")
      };
      cloudDiskSrv
        .getFileList(par)
        .then(res => {
          this.folderLoading = false;
          if (res.success) {
            let fileList = res.data || [];
            let folderList = res.data || [];
            // 如果不是根目录,就获取当前目录的全路径拼接面包屑tagList
            if (id && routeRequire) {
              this.getAllRoute(id);
            }
            this.folderList = folderList;
          } else {
            this.$message.error(res.message || "操作失败");
          }
        })
        .catch(e => {
          this.folderLoading = false;
          console.log(e);
        });
    },

    /**
     * 获取当前目录的全路径
     * 自行拼接根目录(个人文件)
     * **/
    getAllRoute(id) {
      let par = {
        fileId: id,
        token: localStorage.getItem("serverToken")
      };
      cloudDiskSrv
        .getAllRoute(par)
        .then(res => {
          if (res.success && res.data) {
            let tagList = res.data || [];
            if (tagList.length) {
              this.tagList.splice(1, this.tagList.length - 1, ...tagList);
            }
          } else {
            this.$message.error(res.message || "操作失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    /**
     * breadcrumbChange
     * **/
    breadcrumbChange(params) {
      let { index, folderId } = params;
      this.tagList = this.tagList.slice(0, index + 1);
      this.getFileList(folderId, false);
    },
    /**
     * submitHandle
     * **/
    submitHandle() {
      if (this.isFileSaveCloud) {
        if (!this.checkedFolderId) {
          this.checkedFileDetails.id = this.currentFolderId;
          this.checkedFileDetails.fileSpaceId = this.fileSpaceId;
        }
        // if (this.checkedFileSpaceMessage.filePermission.includes("8")) {
        this.$emit("submitSaveCloudFile", this.checkedFileDetails);
        // } else {
        //   this.$message.error("网络连接异常");
        // }
      } else {
        if (!this.checkedFolderId) {
          this.$message({
            message: "请选择文件",
            type: "error"
          });
          return;
        }
        this.$emit("submitSendFile", this.checkedFileDetails);
      }
    },
    /**
     * 返回上一级
     * **/
    backPreFolder() {
      if (this.tagList.length === 1) return false;
      this.tagList.splice(this.tagList.length - 1, 1);
      this.getFileList(this.tagList[this.tagList.length - 1].folderId);
      this.checkedFolderId = "";
    },

    /**
     * currentSelect
     * **/
    currentSelect(item) {
      if (item.isfile == 1) {
        return;
      }
      this.checkedFolderId = item.id;
      this.checkedFileDetails = item;
    },
    currentSelect2(item) {
      this.checkedFolderId = item.id;
      this.checkedFileDetails = item;
    }
  },
  created() {
    if (
      !this.checkedFileSpaceMessage.fileSpaceId &&
      this.filterFileSapceList.length
    ) {
      this.checkedFileSpaceMessage = {
        fileSpaceName: this.filterFileSapceList[0].name || "",
        fileSpaceId: this.filterFileSapceList[0].id || "",
        filePermission: this.filterFileSapceList[0].permission.split(",") || []
      };
    }
    this.tagList = [
      {
        folderName: this.checkedFileSpaceMessage.fileSpaceName,
        folderId: 0
      }
    ];
    this.getFileList();
  }
};
</script>

<style scoped lang="less">
.moveFileDialog_page {
  /deep/ .el-dialog {
    border-radius: 10px;
    width: 677px !important;
    margin-top: 238px !important;
  }

  /deep/ .el-dialog__header {
    padding: 20px 0 10px 0 !important;
    margin: 0 20px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  /deep/ .el-dialog__footer {
    padding: 20px !important;
  }

  /deep/ .el-dialog__body {
    padding: 0 20px !important;
  }

  .fileType {
    display: flex;
    height: 42px;
    // border-radius: 10px;
    // overflow: hidden;
    margin: 10px 0;

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 104px;
      flex-direction: column;
      color: @contentFontColor;
      font-size: 16px;
      line-height: 20px;
      border: 1px solid @contentFontColor;

      .desc {
        font-size: 12px;
        line-height: 16px;
      }

      &:first-child {
        border-radius: 10px 0 0 10px;
      }

      &:last-child {
        border-radius: 0 10px 10px 0;
      }
    }

    li.isOnePlace {
      border-radius: 10px 10px 10px 10px;
    }

    li.checkedFolderId {
      color: @mainBackgroundColor;
      background: @barBackgroundColor;
      border: 0;
    }
  }

  .fileBreadcrumb_page {
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .folder_list {
    height: 300px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    li.checkedFolderId {
      background: #ecf5ff;
    }

    li:hover {
      background: #f5f7fa;
    }

    li {
      display: flex;
      height: 70px;
      align-items: center;
      cursor: pointer;
      /*border-bottom: 1px solid #EBEEF5;*/

      .folder_icon_box {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 10px;

        img {
          display: block;
          width: 45px;
          height: 45px;
        }

        i {
          font-size: 20px;
        }
      }

      .folder_name {
        flex: 1;
        width: 0;
        height: 70px;
        line-height: 70px;
        margin-right: 16px;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        color: @mainFontColor;
      }

      .folder_size {
        width: 70px;
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: @descTitleColor;
        line-height: 20px;
      }
    }
  }

  /deep/ .dialog-footer {
    display: flex;
    justify-content: space-between;

    .action_btn {
      width: 165px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
    }

    .sure_btn {
      background-color: @highlightFontColor;
      color: @mainBackgroundColor;
    }

    .disabled_btn {
      background: rgba(204, 204, 204, 1);
    }

    .back_pre_folder_btn {
      background-color: @mainBackgroundColor;
      color: @barBackgroundColor;
      border: 1px solid @barBackgroundColor;
    }

    .back_pre_folder_btn.disabled_btn {
      background: rgba(204, 204, 204, 1);
      border: 0;
      color: @mainBackgroundColor;
    }
  }
}
</style>
