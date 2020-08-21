/**
*@desc 移动文件弹窗组件
*@author houpai
*@date 2020/03/23 11:14:23
*/
<template>
  <el-dialog
      title="选择保存目录"
      class="moveFileDialog_page"
      :append-to-body="true"
      :visible.sync="moveFolderDialogShow"
      :before-close="handleClose">
    <ul class="fileType">
      <li class="checkedFolderId">我的文件</li>
      <li>
        <div>共享文件</div>
        <div class="desc">(暂未开放)</div>
      </li>
      <li style="border-left: 0;border-radius: 0 10px 10px 0">
        <div>企业文件</div>
        <div class="desc">(暂未开放)</div>
      </li>
    </ul>
    <file-breadcrumb
        :tagList="tagList"
        @breadcrumbChange="breadcrumbChange"></file-breadcrumb>
    <ul class="folder_list" v-loading="folderLoading">
      <el-scrollbar>
        <li v-for="(item,index) in folderList"
            @click.stop="currentSelect(item)"
            @dblclick.stop="getFileList(item.id,true)"
            :class="[{'checkedFolderId':checkedFolderId === item.id}]"
            :key="index">
          <div class="folder_icon_box">
            <img src="../../assets/images/icon_file.png" alt="">
          </div>
          <p class="folder_name">
            {{item.name}}
          </p>
          <div class="folder_icon_box">
            <i class="el-icon-arrow-right"></i>
          </div>
        </li>
      </el-scrollbar>
    </ul>
    <span slot="footer" class="dialog-footer">
      <button
          :class="[{'disabled_btn':tagList.length === 1}]"
          class="back_pre_folder_btn action_btn"
          @click="backPreFolder">返回上一级</button>
      <button class="sure_btn action_btn"
              :class="[{'disabled_btn':checkedFolderId === parentId || checkedFolderId === ''}]"
              @click="submitHandle">
        {{isSaveCloudType ? "保存" : checkedFolderId === 0 ?"移动至 根目录":"移动至 当前目录"}}
      </button>
    </span>
  </el-dialog>
</template>

<script>

  import fileBreadcrumb from "./fileBreadcrumb";
  import {mapState} from "vuex";

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
      parentId: {
        type: [String, Number],
        default() {
          return 0;
        }
      },
      fileBreadcrumbData: {
        type: Array,
        default() {
          return [];
        }
      },
      checkedFileId: {
        type: [String, Number],
        default() {
          return "";
        }
      },
      isSaveCloudType: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      ...mapState(["homeData"]),
      currentFolderId() {
        return this.tagList[this.tagList.length - 1].folderId;
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
        folderLoading: false,
        tagList: [], // 面包屑 只显示文件夹类型
        folderList: [],// 文件夹列表
        checkedFolderId: 0 // 当前文件夹id
      };
    },
    methods: {
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
      getFileList(id = 0, routeRequire = true) {
        this.folderLoading = true;
        this.$http.request({
          url: "/WpFileController/getChildren",
          method: "get",
          body: {
            parentId: id
          }
        }).then(res => {
          this.folderLoading = false;
          if (res.data.success) {
            let fileList = res.data.data || [];
            let folderList = fileList.filter(item => {
              return item.isfile === 1 && item.id !== this.checkedFileId;
            });
            // 如果不是根目录,就获取当前目录的全路径拼接面包屑tagList
            if (id && routeRequire) {
              // this.checkedFolderId = '';
              this.getAllRoute(id);
            }
            this.folderList = folderList;
          } else {
            this.$message.error(res.data.message || "操作失败");
          }
        }).catch(e => {
          this.folderLoading = false;
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
       * breadcrumbChange
       * **/
      breadcrumbChange(params) {
        let {index, folderId} = params;
        this.tagList = this.tagList.slice(0, index + 1);
        // this.checkedFolderId = '';
        if (this.tagList.length === 1) {
          this.checkedFolderId = 0;
        } else {
          this.checkedFolderId = this.tagList[this.tagList.length - 1].folderId || "";
        }
        this.getFileList(folderId, false);
      },
      /**
       * submitHandle
       * **/
      submitHandle() {
        // if (!this.checkedFolderId) this.checkedFolderId = this.currentFolderId;
        if (this.checkedFolderId === this.parentId) return false;
        if (this.checkedFolderId === "") return false;
        if (this.isSaveCloudType) {
          this.$emit("submitSaveCloudFile", this.checkedFolderId);
        } else {
          this.$emit("submitMoveFile", this.checkedFolderId);
        }
      },
      /**
       * 返回上一级
       * **/
      backPreFolder() {
        if (this.tagList.length === 1) return false;
        this.tagList.splice(this.tagList.length - 1, 1);
        this.getFileList(this.tagList[this.tagList.length - 1].folderId);
        if (this.tagList.length === 1) {
          this.checkedFolderId = 0;
        } else {
          this.checkedFolderId = this.tagList[this.tagList.length - 1].folderId || "";
        }
      },

      /**
       * currentSelect
       * **/
      currentSelect(item) {
        this.checkedFolderId = item.id;
      }
    },
    created() {
      this.checkedFolderId = this.parentId;
      this.getFileList(this.currentFolderId, false);
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
      border-radius: 10px;
      overflow: hidden;
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
        background: #F5F7FA;
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
