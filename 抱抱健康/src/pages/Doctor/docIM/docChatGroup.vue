/* * @Author: 田东 * @Date: 2020-01-09 17:12:16 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-09 17:13:42 * @name 医生小组 */

<template>
  <div class="chatGroup_Page" id="docChatGroup">
    <common-header :share-disabled="true" :custom-title="''"></common-header>
    <div class="chatIMList_header">
      <div class="header-div header-left" @click="headerBack()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
          :placeholder="placeholder"
          v-model="groupName"
          @search="searchGroup"
          @focus="isGroup = false"></van-search>
    </div>
    <div class="content">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                v-show="isGroup">
        <div v-if="type === 'group' || type === 'addGroup'">
          <van-cell v-for="(item, index) in groupList"
                    :key="index"
                    @click="docGroup(index, item.groupname,item.doctorcount,item)">
            <template slot="title">
              <div class="chat_lists_item">
                <div class="img_box">
                  <img src="../../../assets/images/default.png" alt=""/>
                </div>
                <div class="right_box">
                   <span class="span_box">
                     {{ item.groupname.substr(0, 9)}}（{{item.doctorcount}}）
                   </span>
                 <div class="group_level" v-if="item.grouplibeltext">
                    <span>
                    {{item.grouplibeltext || ""}}
                  </span>
                 </div>
                </div>
              </div>
            </template>
          </van-cell>
        </div>
        <div v-else-if="type === 'steam'">
          <van-cell v-for="(item, index) in groupList"
                    :key="index"
                    @click="docGroup(index, item.groupname,'',item)">
            <template slot="title">
              <div class="chat_lists_item">
                <div class="img_box">
                  <img src="../../../assets/images/default.png" alt=""/>
                </div>
                <span class="span_box">
                  {{ item.SessionName_ }}（{{item.num - 1}}）
                </span>
              </div>
            </template>
          </van-cell>
        </div>
      </van-list>
    </div>


    <van-popup @close="docGroupName=''"
               class="docGroupMessage_popup"
               v-model="show">
    <h3>医疗团队名称</h3>
    <div class="inputBox">
      <van-field v-model="docGroupName"
                 class="textarea"
                 placeholder="请编辑您的医疗团队名称(1-15字)"
                 maxlength="15"
                 clearable
                 autosize
                 type="input"
                 rows="1"
      ></van-field>
    </div>
    <div class="btns_box">
      <div class="cancel_btn btn" @click.stop="show=false;docGroupName=''">取 消</div>
      <div class="sure_btn btn" @click.stop="confirmReject">确 认</div>
    </div>
  </van-popup>
  </div>
</template>

<script>
  import {Dialog} from "vant";
  import {Toast} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "docChatGroup",
    components: {
      commonHeader
    },
    data() {
      return {
        id: "", //小组id
        name: "", //创建的小组名称
        groupName: "",
        placeholder: "搜索",
        groupList: [],
        loading: false,
        finished: false,
        page: 1,
        limit: 20,
        isGroup: true,
        type: "",
        groupNameDialog: false, // 编辑医疗团队姓名弹窗
        docGroupName: "",
        show: false,
        createGroupIndex: ""
      };
    },
    created() {
      this.type = this.$route.query.type;
      this.id = this.$route.query.id;
      this.name = this.$route.query.name;
      if (this.type === "group" || this.type === "addGroup") {
        this.placeholder = "搜索医生小组";
      } else if (this.type === "steam") {
        this.placeholder = "搜索医疗团队";
      }
    },
    methods: {
      //提交创建医疗团队
      confirmReject() {
        if (!this.docGroupName) {
          Toast("请编辑您的医疗团队名称");
          return false;
        }
        if (this.createGroupIndex !== "") {
          this.createGroup(this.groupList[this.createGroupIndex].id);
        }
      },
      //添加小组变团队
      createGroup(zid) {
        this.$http
          .request({
            method: "post",
            url: "/ImSessionController/insertSessionZ",
            body: {
              zId: zid,
              id: this.id,
              // name: this.name
              name: this.docGroupName
            }
          })
          .then(res => {
            if (res.data.success && res.data.code !== "0001") {
              Toast("创建成功");
              this.$store.commit("DoctorIM/clearAddFriendList");
              this.$store.commit("DoctorIM/setSessionid", res.data.total);
              this.$store.commit("DoctorIM/setSessionType", 1);
              this.chatList();
              // this.$router.back();
            } else {
              Toast(res.data.message || "接口报错");
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },

      /**
       *@desc 增加编辑群聊姓名弹窗
       *@author houpai
       *@date 2020/04/26 09:55:12
       */
      docGroup(index, name, doctorcount, item) {
        if (this.type === "addGroup") {


          // Dialog.confirm({
          //   message: "确认添加该小组到医患二人会话中？",
          //   confirmButtonText: "确认",
          //   confirmButtonColor: "#E98C2E",
          //   cancelButtonColor: "#E98C2E"
          // })
          //   .then(() => {
          //     this.createGroup(this.groupList[index].id);
          //   })
          //   .catch(() => {
          //     this.$router.back();
          //   });
          if (doctorcount == 0) {
            Toast("该医疗小组无成员，无法创建服务团队");
            return false;
          }
          this.show = true;
          this.createGroupIndex = index;


        } else if (this.type === "steam") {
          this.$store.commit("DoctorIM/setSessionid", this.groupList[index].Id_);
          this.$store.commit(
            "DoctorIM/setSessionType",
            this.groupList[index].SessionType_
          );

          // 如果是群聊的话保存创建人id
          if (item.SessionType_ === 1) {
            localStorage.setItem("createDoctorId", item.CreateUserId_);
          }

          this.$router.push({
            name: "docChatIMDetail",
            query: {}
          });
        } else {
          this.$store.commit("DoctorIM/saveGroupName", name);
          // this.$router.push({
          //   name: "docSelectGroup",
          //   query: {
          //     gid: this.groupList[index].id
          //   }
          // });
          this.$router.push({
            path: "/docGroupDetail",
            query: {
              gid: this.groupList[index].id
            }
          });
        }
      },
      searchGroup() {
        this.groupList = [];
        this.page = 1;
        this.isGroup = true;
        if (this.type === "group" || this.type === "addGroup") {
          this.chatGroup();
        } else if (this.type === "steam") {
          this.chatSteam();
        }
      },
      //医生小组
      chatGroup() {
        this.$http
          .request({
            method: "get",
            url: "/ImGroupController/selectGroup",
            body: {
              name: this.groupName,
              page: this.page,
              limit: this.limit
            }
          })
          .then(res => {
            let list = this.groupList.slice();
            // 加载状态结束
            this.loading = false;
            if (res.data.success) {
              list = list.concat(res.data.data.list || []);
              this.groupList = list;
              if (this.groupList.length == res.data.data.total) {
                this.finished = true;
              } else {
                this.finished = false;
              }
              this.page++;
            } else {
              this.finished = true;
            }
          })
          .catch(e => {
            this.finished = true;
            Toast("加载失败，请检查网络连接");
          });
      },
      //医生团队
      chatSteam() {
        this.$http
          .request({
            method: "get",
            url: "/ImSessionController/selectSession",
            body: {
              name: this.groupName,
              page: this.page,
              limit: this.limit
            }
          })
          .then(res => {
            let list = this.groupList.slice();
            // 加载状态结束
            this.loading = false;
            if (res.data.success && res.data.data.length > 0) {
              list = list.concat(res.data.data);
              this.groupList = list;
              this.page++;
            } else {
              this.finished = true;
            }
          })
          .catch(e => {
            this.finished = true;
            Toast("加载失败，请检查网络连接");
          });
      },
      //查询医生会话列表
      chatList() {
        this.$http
          .request({
            method: "get",
            url: "/ImController/getDoctorSessionList",
            body: {
              limit: 999
            }
          })
          .then(res => {
            if (res.data.success && res.data) {
              this.$store.commit("DoctorIM/saveChatList", res.data.data);
              this.$router.push({
                name: "docChatIMDetail",
                query: {
                  createType: "true"
                }
              });
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },
      onLoad() {
        if (this.type === "group" || this.type === "addGroup") {
          this.placeholder = "搜索医生小组";
          this.chatGroup();
        } else if (this.type === "steam") {
          this.placeholder = "搜索医疗团队";
          this.chatSteam();
        }
      },
      headerBack() {
        this.$router.back(-1);
      }
    }
  };
</script>

<style scoped lang="less">
  .chat_lists_item {
    display: flex;
  }

  * {
    box-sizing: border-box;
  }

  .chatGroup_Page {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
    //padding-top: 54px;

    .chatIMList_header {
      display: flex;
      position: fixed;
      align-items: center;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      width: 100vw;
      height: auto;
      background: @backgroundColor;

      .header-left {
        float: left;
        .height(44);
        .lineHeight(44);
        .padding(0, 0, 0, 10);

        .back-icon {
          .fontSize(20);
          font-weight: 600;
          color: @titleColor;
        }
      }

      /deep/ .van-search {
        flex: 1;
        background: none !important;
        .padding(5, 12, 5, 12);

        .van-icon,
        .van-field__control {
          .fontSize(16);
          .lineHeight(24);
        }

        .van-search__content {
          padding-left: 0 !important;
          background-color: @backgroundColorT;
          .borderRadius(6, 6, 6, 6);

          .van-cell {
            .padding(5, 12, 5, 12);
          }
        }
      }

      .chat_add {
        color: @subtitleColor;
        .fontSize(20);
        font-weight: bold;
        flex-basis: 9%;
      }
    }

    .content {
      position: absolute;
      height: auto;
      width: 100%;
      top: 11.8vw;
      .padding(0, 12, 0, 12);

      /deep/ .van-list {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }

      /deep/ .van-cell {
        .padding(15, 10, 15, 10);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: @backgroundColor;
      }

      .img_box {
        .margin(0, 10, 0, 0);
        width: 60 / 375 * 100vw;
        .height(60);
        border-radius: 50%;
        overflow: hidden;

        img {
          display: block;
          width: 100%;
        }
      }

      .span_box {
        display: inline-block;
        flex: 1;
        width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .fontSize(18);
        .padding(4,0,0,0);
        color: @titleColor;
        .lineHeight(22);
      }
    }


    /*弹窗pop样式*/

    /deep/ .van-popup.docGroupMessage_popup {
      width: 80%;
      box-sizing: border-box;
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;

      .van-field__control {
        min-height: 24px;
        .fontSize(16);
        /*color: rgba(153, 153, 153, 1);*/
      }

      h3 {
        text-align: center;
        .padding(12, 0, 12, 0);
        .fontSize(16);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      .btns_box {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 100%;
        .height(44);

        .btn {
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .fontSize(16);
          font-weight: bold;
        }
      }

      .cancel_btn {
        color: rgba(51, 51, 51, 1);
        background-color: @backgroundColorff;
      }

      .sure_btn {
        color: @fontColorff;
        background-color: @mainColor;
      }

      .textarea {
        background-color: rgba(237, 237, 237, 1);
        .borderRadius(6, 6, 6, 6);
        overflow: hidden;
      }

      .inputBox {
        .padding(0, 10, 10, 10);
      }
    }


    .right_box {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 0;
      span {
        display: inline-block;
        width: 100% !important;
        /*line-height: 100%!important;*/
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .group_level {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          display: inline;
          background-color: rgba(118, 118, 118, 0.09);
          .borderRadius(4,4,4,4);
          .fontSize(14);
          .lineHeight(18);
          .padding(2,4,2,4);
          color:rgba(137,150,159,1)!important;
          font-weight:400;
        }
      }
    }
  }
</style>
