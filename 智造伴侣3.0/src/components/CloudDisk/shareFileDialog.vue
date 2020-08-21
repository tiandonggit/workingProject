/**
*@desc 分享文件弹窗组件
*@author houpai
*@date 2020/03/23 11:14:54
*/
<template>
  <el-dialog
      title="选择会话"
      class="shareFileDialog_page"
      :append-to-body="true"
      :visible.sync="shareFileDialogShow"
      :before-close="handleClose">
    <div class="mailList_box">
      <div class="mailList_single_chat">
        <ul class="mailList">
          <div class="input-box search">
            <img src="../../assets/image/icon-p-search.png" alt/>
            <input type="text"
                   placeholder="搜索"
                   clearable
                   v-model="searchText"
                   v-hotkey="{'enter': searchByChatName }"/>
          </div>
<!--          <div class="search">-->
<!--            <el-input-->
<!--                v-model="searchText"-->
<!--                v-hotkey="{'enter': searchByChatName }"-->
<!--                clearable-->
<!--                placeholder="搜索"-->
<!--                type="text"/>-->
<!--          </div>-->
          <h4>通讯录</h4>
          <ul class="mailList_list"
              v-if="userList.length"
              v-loading="mailListLoading">
            <el-scrollbar>
              <el-checkbox-group v-model="checkedShareTarget">
                <li v-for="(item) in userList" :key="item.id">
                  <img :src="item.headurl" alt="">
                  <div class="name_phone">
                    <p class="name">{{item.nickname || ""}}</p>
                    <p class="phone">{{item.phone || ""}}</p>
                  </div>
                  <el-checkbox :label="item.id" :key="item.id"></el-checkbox>
                </li>
              </el-checkbox-group>
            </el-scrollbar>
          </ul>
          <p class="no_result" v-else>{{ searchText ? "无搜索结果" : "暂无好友"}}</p>
        </ul>
        <div class="btns_box">
          <button class="cancel_btn option_btn" @click="handleClose">取消</button>
          <button
              class="sure_btn option_btn disabled"
              :class="[{'disabled_btn':!checkedLength}]"
              @click="submitHandle">确定({{checkedLength}})
          </button>
        </div>
      </div>
      <div class="mailList_group_chat">
        <h3>
          <i class="el-icon-arrow-left"></i>
          <span>群聊</span>
        </h3>
        <ul class="groupChat_list"
            v-if="groupList.length"
            v-loading="mailListLoading">
          <el-scrollbar>
            <el-checkbox-group v-model="checkedShareTargetGroup">
              <li v-for="(item,index) in groupList" :key="item.id">
                <img src="../../assets/image/group_head_big.png" alt="">
                <div class="name_number">
                  <p class="group_name">{{item.groupname || ""}}</p>
                  <p class="member_number"></p>
                </div>
                <el-checkbox :label="item.id" :key="item.id"></el-checkbox>
              </li>
            </el-checkbox-group>
          </el-scrollbar>
        </ul>
        <p class="no_result" style="padding-top: 40px" v-else>暂无群聊</p>
      </div>
    </div>
  </el-dialog>
</template>

<script>

  import {homeSrv} from "../../views/Home/home.service";

  export default {
    name: "shareFileDialog",
    props: {
      shareFileDialogShow: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isShareType: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      checkedLength() {
        return this.checkedShareTargetGroup.length + this.checkedShareTarget.length;
      }
    },
    data() {
      return {
        searchText: "",
        checkedShareTarget: [],
        checkedShareTargetGroup: [],
        userList: [], // 通讯录列表
        groupList: [], // 群聊列表
        mailListLoading: false
      };
    },
    methods: {
      /**
       * handleClose dialog
       * **/
      handleClose() {
        this.$emit("closeMoveFolderDialog");
      },
      /**
       * searchFileByName single chat only
       * **/
      searchByChatName() {
        let params = {
          name: this.searchText
        };
        homeSrv.searchByChatName(params).then(response => {
          if (response.success) {
            this.userList = response.data.userList || [];
          } else {
            this.$message.error(response.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * share file submit
       * **/
      submitHandle() {
        if (!this.checkedLength) return false;
        let shareFileParams = {
          userList: this.checkedShareTarget,
          groupList: this.checkedShareTargetGroup
        };
        if (this.isShareType) {
          this.$emit("submitShare", shareFileParams);
        } else {
          this.$emit("submitShareFile", shareFileParams);
        }
      },
      /**
       * get mailList
       * **/
      getMailList() {
        this.mailListLoading = true;
        homeSrv.getMailList().then(response => {
          this.mailListLoading = false;
          if (response.success && response.data) {
            this.userList = response.data.userList || [];
            this.groupList = response.data.groupList || [];
          } else {
            this.$message.error(response.message || "获取通讯录接口报错");
          }
        }).catch(error => {
          this.mailListLoading = false;
          console.log(error);
        });
      }
    },
    created() {
      this.getMailList();
    }
  };
</script>

<style scoped lang="less">

  .shareFileDialog_page {
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
      padding: 0 !important;
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

    /deep/ .el-checkbox {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: absolute;
      left: 0;
      right: 20px;
      bottom: 0;
      top: 0;
    }

    /deep/ .el-checkbox__label {
      display: none !important;
    }

    /deep/ .el-checkbox__inner {
      border-radius: 50% !important;
      width: 20px !important;
      height: 20px !important;
      border: 1px solid rgba(151, 151, 151, 1) !important;
    }

    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: @barBackgroundColor !important;
      border-color: @barBackgroundColor !important;
    }

    /deep/ .el-checkbox__inner::after {
      height: 8px !important;
      left: 7px !important;
      top: 3px !important;
    }

    .mailList_box {
      display: flex;
      height: 413px;

      .mailList_single_chat {
        display: flex;
        flex-direction: column;
        width: 338px;
        height: 100%;
        overflow: hidden;
        box-shadow: 0px 12px 12px 0px rgba(0, 0, 0, 0.1);

        .btns_box {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 65px;
          box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);

          .option_btn {
            width: 129px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 400;
            cursor: pointer;
          }


          .sure_btn {
            background-color: @barBackgroundColor;
            color: @mainBackgroundColor;
            margin-left: 10px;
          }

          .cancel_btn {
            background-color: @mainBackgroundColor;
            color: @barBackgroundColor;
            border: 1px solid @barBackgroundColor;
            margin-right: 10px;
          }

          .disabled_btn {
            color: @mainBackgroundColor;
            background: rgba(204, 204, 204, 1);
          }
        }

        .mailList {
          display: flex;
          flex-direction: column;
          flex: 1;
          height: 0;
          padding: 20px 0 20px 20px;

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



          h4 {
            font-size: 16px;
            font-weight: bold;
            color: @mainFontColor;
            padding: 20px 0;
          }

          .mailList_list {
            flex: 1;
            height: 0;

            li {
              display: flex;
              align-items: center;
              position: relative;
              margin-bottom: 20px;

              img {
                display: block;
                width: 45px;
                height: 45px;
                margin-right: 10px;
                border-radius: 10%;
              }

              .name_phone {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                width: 0;
                padding-right: 40px;

                .name {
                  font-size: 16px;
                  font-weight: bold;
                  color: @mainFontColor;
                  line-height: 20px;
                  margin-bottom: 6px;
                }

                .phone {
                  font-size: 14px;
                  font-weight: 400;
                  color: rgba(102, 102, 102, 1);
                  line-height: 18px;
                }

                p {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }

      .mailList_group_chat {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        padding: 20px 0 20px 20px;

        h3 {
          span {
            font-size: 16px;
            font-weight: bold;
            color: @mainFontColor;
          }

          i {
            font-size: 16px;
            color: @contentFontColor;
            margin-right: 10px;
          }
        }

        .groupChat_list {
          flex: 1;
          height: 0;
          padding: 20px 0;

          li {
            display: flex;
            align-items: center;
            position: relative;
            margin-bottom: 20px;

            img {
              display: block;
              width: 45px;
              height: 45px;
              margin-right: 10px;
            }

            .name_number {
              display: flex;
              flex-direction: column;
              justify-content: center;
              flex: 1;
              width: 0;
              padding-right: 40px;

              .group_name {
                font-size: 16px;
                font-weight: bold;
                color: @mainFontColor;
                line-height: 20px;
                margin-bottom: 6px;
              }

              .member_number {
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                line-height: 18px;
              }

              p {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }


  .no_result {
    color: rgba(153, 153, 153, 1);
    text-align: center;
    padding: 20px 0;
  }


</style>
