<template>
  <div class="cloudDisk_page">
    <div class="left-list">
      <div class="search-box">
        <div class="input-box">
          <img src="../../assets/image/icon-p-search.png" alt/>
          <input type="text" placeholder="搜索" v-model="fileSpaceSearchText" @change="getSearchFileSpaceList()"/>
        </div>
      </div>
      <div
          class="fileSpaceList"
          :class="[{'isActive':fileDiskData.checkedFileSpaceMessage.fileSpaceId === item.id}]"
          v-for="(item, index) in fileSpaceList"
          v-show="item.isShowSearch"
          :key="index"
          @click.stop="selectFileSpace(item)"
      >
        <div class="line-box">
          <div class="img-box" :class="[{'personal':index == 0}]"></div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="right-content">
      <cloud-disk-component></cloud-disk-component>
    </div>
  </div>
</template>

<script>

  import cloudDiskComponent from "@/components/CloudDisk/cloudDiskComponent";
  import {mapState} from "vuex";
  import {homeSrv} from "../Home/home.service";


  export default {
    name: "cloudDisk",
    components: {
      cloudDiskComponent
    },
    computed: {
      ...mapState(["fileDiskData"])
    },
    data() {
      return {
        fileSpaceSearchText: "",
        fileSpaceList: []
      };
    },
    methods: {
      /**
       * 获取文件空间列表
       * **/
      getFileSpaceList() {
        return new Promise((resolve, rejected) => {
          let params = {
            token: window.localStorage.getItem("serverToken")
          };
          homeSrv.getFileSpaceList(params).then(response => {
            if (response.success) {
              let fileSpaceList = response.data || [];
              fileSpaceList.forEach(item => {
                item.isShowSearch = true;
              });
              this.fileSpaceList = fileSpaceList;
              // 由于和项目模块的文件共用一个缓存,此处不再保留文件空间选择记忆 后续有需求再另行修改
              // if (!this.fileDiskData.checkedFileSpaceMessage.fileSpaceId && this.fileSpaceList.length) {
              if ( this.fileSpaceList.length) {
                let checkedFileSpaceMessage = {
                  fileSpaceName: response.data[0].name || "",
                  fileSpaceId: response.data[0].id || "",
                  filePermission: response.data[0].permission.split(",") || []
                };
                this.$store.commit("fileDiskData/saveCheckedFileSpaceMessage", checkedFileSpaceMessage);
                this.$bus.emit("getFileListByFileSpaceId");
              }
              // else if (this.fileDiskData.checkedFileSpaceMessage.fileSpaceId) {
              //   this.$bus.emit("getFileListByFileSpaceId");
              // }
              resolve(this.fileSpaceList);
            } else {
              this.$message.error(response.message || "文件空间列表接口报错");
              rejected("error");
            }
          }).catch(error => {
            console.log(error);
            rejected("error");
          });
        });
      },
      /**
       * 选择文件空间
       * **/
      selectFileSpace(fileSpaceItem) {
        if (fileSpaceItem.id === this.fileDiskData.checkedFileSpaceMessage.fileSpaceId) {
          return false;
        }
        let checkedFileSpaceMessage = {
          fileSpaceName: fileSpaceItem.name || "",
          fileSpaceId: fileSpaceItem.id || "",
          filePermission: fileSpaceItem.permission.split(",") || []
        };
        this.$store.commit("fileDiskData/saveCheckedFileSpaceMessage", checkedFileSpaceMessage);
        this.$bus.emit("getFileListByFileSpaceId");
      },
      /**
       * 文件列表搜索(前端实现)
       * **/
      getSearchFileSpaceList() {
        if (!this.fileSpaceSearchText) {
          this.fileSpaceList.forEach(item => {
            item.isShowSearch = true;
          });
          return false;
        } else {
          this.fileSpaceList.forEach(item => {
            item.isShowSearch = item.name.search(this.fileSpaceSearchText) != -1;
          });
        }
      }
    },
    created() {
      this.getFileSpaceList();
    }
  };
</script>

<style scoped lang="less">
  .cloudDisk_page {
    height: 100%;
    display: flex;

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

    .left-list {
      width: 306px;
      height: 100%;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);

      .fileSpaceList {
        padding: 0 10px;
        cursor: pointer;

        .line-box {
          padding: 12px 20px 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          justify-items: center;
          align-items: center;

          .img-box {
            height: 44px;
            width: 44px;
            margin-right: 10px;
            background: url("../../assets/image/file_space_icon_gray.png") center center no-repeat;
            background-size: 44px;
          }

          .img-box.personal {
            background: url("../../assets/image/personal_file_space_icon_gray.png") center center no-repeat;
            background-size: 44px;
          }

          .name {
            flex: 1;
            width: 0;
            font-size: 16px;
            font-weight: 400;
            text-align: justify;
            color: @titleColor;
            line-height: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      .fileSpaceList.isActive {
        background: rgba(108, 203, 255, 0.25);

        .line-box {
          .img-box {
            background: url("../../assets/image/file_space_icon_white.png") center center no-repeat;
            background-size: 44px;
          }

          .img-box.personal {
            background: url("../../assets/image/personal_file_space_icon_white.png") center center no-repeat;
            background-size: 44px;
          }
        }
      }
    }

    .right-content {
      flex: 1;
      height: 100%;
      width: 0;
      display: flex;
      flex-direction: column;
      padding-right: 74px;
      overflow: hidden;
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
</style>
