/* * @Author: 田东 * @Date: 2020-01-10 14:44:18 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-10 14:44:18 @desc 聊天列表添加删减人员列表 */

<template>
  <div id="docAddChatGroupPerson">
    <common-header
        :share-disabled="true"
        :custom-title="'医患沟通'"
    ></common-header>
    <div class="header_box clearfix">
      <div class="header-div header-left" @click="back()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">{{ isHasTitleName ? "创建医疗服务团队" : titleName }}</div>
      <div class="price header-right" @click.stop="addList">
        <span :class="{ disabled: this.result.length == 0 }">{{
          rightText
        }}</span>
      </div>
    </div>

    <div class="content" v-if="result.length !== 0">
      <div class="previewPerson">
        <ul>
          <li v-for="(item, index) in result" :key="index">
            <div class="img_box">
              <img :src="list[item].url" alt/>
            </div>
            <span>{{ list[item].docName }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
        class="resultItem"
        :class="[result.length !== 0 ? 'activeResult' : 'resultStyle']"
    >
      <van-checkbox-group v-model="result">
        <van-cell-group class="groupList">
          <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
          >
            <van-cell
                title
                v-for="(item, index) in list"
                :key="index"
                @click="toggle(index)"
            >
              <template slot="title">
                <div class="chat_lists_item">
                  <div class="img_box">
                    <img :src="item.url" alt/>
                  </div>
                  <ul class="chat_message_box">
                    <li class="name_box">
                      <p class="public-title">
                        {{ item.docName }}
                        <span class="office">
                          <span>{{ item.positionName }}</span>
                        </span>
                        <span class="department" style="margin-left: 10px">{{
                          item.depName
                        }}</span>
                      </p>
                    </li>
                    <li class="unReadMessage_box">
                      <div class="unReadMessage_box_span">
                        <span class="unReadMessage_box_i">{{
                          item.hosName
                        }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
              <van-checkbox :name="index" ref="checkboxes" slot="right-icon"/>
            </van-cell>
          </van-list>
        </van-cell-group>
      </van-checkbox-group>
    </div>


    <van-popup
        @close="docGroupName=''"
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
  import {Toast, Dialog, NavBar} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";
  import navbar from "../../../components/navbar/navbar";
  import {clearTimeout} from "timers";

  export default {
    name: "docAddChatGroupPerson",
    components: {
      commonHeader,
      navbar
    },
    data() {
      return {
        titleName: "小组人员添加",
        id: "", //二人聊天id
        name: "", //聊天小组
        loading: false,
        finished: false,
        groupId: 0,
        isSearchBtn: false,
        placeholder: "请按医生姓名搜索",
        rightText: "添加(0)",
        list: [],
        result: [], //多选按钮
        page: 1,
        limit: 20,
        timeout: null,
        state: "add", //状态
        fromType: "", //来源
        docGroupName: "",
        show: false,
        isHasTitleName: false
      };
    },
    computed: {
      //返回多选result
      getFriendList() {
        let arr = [];
        let result = [];
        let data = this.$store.state.DoctorIM.addFriendList;
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].docId);
        }
        for (let a = 0; a < this.list.length; a++) {
          if (arr.includes(this.list[a].docId)) {
            result.push(a);
          }
        }
        return result;
      },
      //返回已选中的好友信息
      addFriendListMessage() {
        return this.$store.state.DoctorIM.addFriendList;
      }
    },
    watch: {
      result(n, o) {
        this.titleName = "小组人员添加";
        if (this.state === "add") {
          this.rightText = "添加(" + this.result.length + ")";
        } else if (this.state === "del") {
          this.rightText = "删减(" + this.result.length + ")";
          this.titleName = "小组人员删减";
        } else if (this.state === "addDoc") {
          this.rightText = "添加(" + this.result.length + ")";
        } else if (this.state === "addSteam") {
          this.rightText = "添加(" + this.result.length + ")";
        }
      }
    },
    created() {
      this.state = this.$route.query.res;
      this.id = this.$route.query.id;
      this.name = this.$route.query.name;
      this.isHasTitleName = this.$route.query.isHasTitleName || false;
      this.fromType = this.$route.query.fromType;
    },
    methods: {
      //提交创建医疗团队
      confirmReject() {
        localStorage.setItem("createDoctorId", this.$store.state.DoctorIM.doctorMessage.data.docId);
        if (!this.docGroupName) {
          Toast("请编辑您的医疗团队名称");
          return false;
        } else {
          if (this.state === "addDoc") {
            this.createGroup();
          }
          if (this.state === "addSteam") {
            this.addSteam();
          }
        }
      },
      //跳转到详细搜索
      soTire() {
        this.$router.push({
          name: "docSearchChatGroupPerson",
          query: {
            groupId: this.id,
            res: this.state,
            fromType: this.fromType
          }
        });
      },
      //添加 或 删减
      addList() {
        if (this.result.length == 0) {
          return;
        }
        let res = this.addFriendListMessage.slice();
        if (this.state === "addDoc") {
          //来源单聊 添加医生
          // clearTimeout(this.timeout);
          // this.timeout = setTimeout(() => {
            // this.createGroup();
            this.show = true;
          // }, 100);
        } else if (this.state === "addSteam") {
          //来源群聊 添加医生
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.addSteam();
            // this.show = true;
          }, 100);
        }
      },
      //团队添加医生
      addSteam() {
        if (this.result.length == 0) {
          return;
        }
        let res = [];
        for (let i = 0; i < this.result.length; i++) {
          res.push({
            username: this.list[this.result[i]].docName,
            userid: this.list[this.result[i]].docId,
            vxheadurl: this.list[this.result[i]].url
          });
          // this.name += "、" + this.list[this.result[i]].docName;
        }
        this.$http
          .request({
            method: "post",
            url: "/ImSessionController/insertSessionUser",
            body: {
              list: JSON.stringify(res),
              id: this.id
            }
          })
          .then(res => {
            if (res.data.success && res.data.code !== '0001') {
              Toast("添加成功");
              this.$store.commit("DoctorIM/clearAddFriendList");
              this.$store.commit("DoctorIM/setSessionid", this.id);
              this.$store.commit("DoctorIM/setSessionType", 1);
              this.chatList();
            } else {
              Toast(res.data.message || '接口报错');
            }
          })
          .catch(e => {
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
              setTimeout(() => {
                this.$router.push({
                  name: "docChatIMDetail",
                  query: {
                    createType: "true"
                  }
                });
              }, 50);
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },
      //添加创建  将二人对话通过添加医生变成团队
      createGroup() {
        let res = [];
        for (let i = 0; i < this.result.length; i++) {
          res.push({
            username: this.list[this.result[i]].docName,
            userid: this.list[this.result[i]].docId,
            vxheadurl: this.list[this.result[i]].url
          });
          // this.name += "、" + this.list[this.result[i]].docName;
        }
        this.$http
          .request({
            method: "post",
            url: "/ImSessionController/insertSession",
            body: {
              list: JSON.stringify(res),
              id: this.id,
              name: this.docGroupName
            }
          })
          .then(res => {
            // 0000：团队创建成功。0001：团队名称重复
            if (res.data.success && res.data.code !== '0001') {
              Toast("创建成功");
              this.$store.commit("DoctorIM/clearAddFriendList");
              this.$store.commit("DoctorIM/setSessionid", res.data.total);
              this.$store.commit("DoctorIM/setSessionType", 1);
              this.chatList();
            } else {
              Toast(res.data.message || '接口报错');
            }
          })
          .catch(e => {
            Toast("加载失败，请检查网络连接");
          });
      },
      //查询所有好友
      searchAllFriend() {
        this.$http
          .request({
            method: "get",
            url: "/ImFriendController/selectFriend",
            body: {
              page: this.page,
              limit: this.limit
            }
          })
          .then(res => {
            // 加载状态结束
            this.loading = false;
            this.finished = true;
            if (res.data.success && res.data.data.length > 0) {
              this.list = this.list.concat(res.data.data);
              this.page++;
              this.result = this.getFriendList; // 将选中的好友放入result中
            } else {
              this.finished = true;
              // Toast(res.data.message);
            }
          })
          .catch(e => {
            this.finished = true;
            Toast("加载失败，请检查网络连接");
          });
      },
      //查询好友(可以添加的好友) 需要团队id
      searchFriend() {
        this.$http
          .request({
            method: "get",
            url: "/ImSessionController/selectSessionUser",
            body: {
              id: this.id,
              page: this.page,
              limit: this.limit
            }
          })
          .then(res => {
            // 加载状态结束
            this.loading = false;
            this.finished = true;
            if (res.data.success && res.data.data.length > 0) {
              this.list = this.list.concat(res.data.data);
              this.page++;
              this.result = this.getFriendList; // 将选中的好友放入result中
            } else {
              this.finished = true;
              // Toast(res.data.message);
            }
          })
          .catch(e => {
            this.finished = true;
            Toast("加载失败，请检查网络连接");
          });
      },
      onLoad() {
        if (this.state === "addDoc") {
          this.searchAllFriend();
        } else if (this.state === "addSteam") {
          this.searchFriend();
        }
      },
      //多选
      toggle(index) {
        // if (this.getFriendList.includes(this.list[index].docId)) {
        //   return;
        // }
        // this.$refs.checkboxes[index].toggle();
      },
      //返回上一页
      back() {
        this.$router.back();
      }
    }
  };
</script>

<style scoped lang="less">
  * {
    box-sizing: border-box;
  }

  #docAddChatGroupPerson {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
    background: @backgroundColor;
    .padding(44, 0, 0, 0);

    .disabled {
      opacity: 0.4;
    }

    .header_box {
      position: fixed;
      -webkit-box-align: center;
      -ms-flex-align: center;
      display: flex;
      align-items: center;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      width: 100vw;
      height: auto;
      background: @backgroundColor;

      .header-left {
        .height(44);
        .width(100);
        .lineHeight(44);
        .padding(0, 0, 0, 10);

        .back-icon {
          .fontSize(20);
          font-weight: 600;
          color: @titleColor;
        }
      }

      .header-center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        .fontSize(18);
        width: 0;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 400;
        color: @titleColor;
        .lineHeight(44);
      }

      .header-right {
        .width(100);
        text-align: right;
        .padding(0, 12, 0, 0);
      }
    }

    .zhanwei {
      .height(44);
    }

    .resultStyle,
    .activeResult {
      .groupList {
        .width(351);
        margin: 0 auto;
        background: @backgroundColor;

        &::after {
          border-width: 0;
        }

        .van-list {
          .borderRadius(10, 10, 0, 0);
          overflow: hidden;
        }

        .van-cell {
          background: @backgroundColorT;
          // .borderRadius(10, 10, 10, 10);
          .padding(14, 10, 14, 10);
          overflow: hidden;
          // .margin(0, 0, 15, 0);
          position: relative;

          .van-checkbox {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            display: flex;
            justify-content: flex-end;
            margin-right: 4vw;
          }

          &:first-child {
            .borderRadius(10, 10, 0, 0);
            overflow: hidden;
          }

          &:nth-last-of-type(3) {
            .borderRadius(0, 0, 10, 10);
            overflow: hidden;

            &::after {
              border-width: 0;
            }
          }
        }

        .chat_lists_item {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;

          .img_box {
            .margin(0, 11, 0, 0);
            .width(60);
            .height(60);
            border-radius: 50%;
            overflow: hidden;

            img {
              height: 100%;
            }
          }

          .chat_message_box {
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            width: 0;
            .margin(0, 10, 0, 10);

            li {
              .lineHeight(28);
            }

            .name_box {
              padding: 0 !important;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .unReadMessage_box {
              .fontSize(12);
              color: @subtitleColor;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              .unReadMessage_box_span {
                float: left;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;

                .unReadMessage_box_i {
                  .fontSize(14);
                  line-height: 4.8vw;
                  display: inline-block;
                  width: 66vw;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }
    }

    .content {
      .width(351);
      margin: 0 auto 1px;
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);
      .padding(14, 10, 14, 10);
      /*overflow: hidden;*/

      .previewPerson {
        overflow-x: auto;
        white-space: nowrap;

        ul {
          display: flex;
          .height(60);
        }

        ul li {
          .margin(0, 7, 0, 7);
          text-align: center;
          height: auto;
        }

        .img_box {
          .width(32);
          .height(32);
          margin: 0 auto 2.7vw;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        span {
          .fontSize(14);
          font-weight: 400;
          color: @titleColor;
          .lineHeight(14);
        }
      }

      .previewPerson ::-webkit-scrollbar {
        display: none !important;
      }
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
</style>
