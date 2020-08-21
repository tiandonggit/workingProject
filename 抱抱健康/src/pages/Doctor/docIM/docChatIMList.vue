/* * @Author: 田东 * @Date: 2020-01-09 17:49:54 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-09 17:49:54 * @name im首页列表 */
<template>
  <div class="chatIMList_page">
    <common-header :share-disabled="true" :custom-title="'医患沟通'"></common-header>
    <div class="chatIMList_header">
      <van-search placeholder="搜索" v-model="chatName" disabled="true" @click="search"></van-search>
      <van-icon name="plus" class="chat_add" @click.stop="chatOpen">
        <div class="show-one" v-if="isOnce == 2">
          <div class="block-box">
            <p>
              点击此处可添加医生、创建医生小组
              <img src="../../../assets/images/icon_tishi.png" alt />
            </p>
            <div class="arrow-right"></div>
            <div class="close" @click.stop="isOnce = 1">
              <van-icon name="cross" />
            </div>
          </div>
        </div>
      </van-icon>
    </div>

    <van-tabs v-model="active" :class="[active == 1 ? 'two' : 'one']" @click="onClick">
      <van-tab title="会话列表" name="1">
        <div slot="title" class="chat_title">
          <span class="titleList">会话列表</span>
          <span class="unRead_message" v-show="unReadMessageCount != 0">{{ unReadMessageCount }}</span>
        </div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <ul class="chat_lists">
            <li
              class="chat_lists_item"
              v-for="(item, index) in list"
              :key="index"
              @click="goDetail(item.id, item.sessiontype,item)"
            >
              <div class="img_box">
                <img src="../../../assets/images/default.png" alt v-if="item.sessiontype === 1" />
                <img :src="item.imSessionUserList[0].vxheadurl" alt v-else />
              </div>
              <ul class="chat_message_box">
                <!--群组-->
                <li class="name_box" v-if="item.sessiontype === 1">
                  <span
                    class="name"
                    v-if="item.sessionname.length >= 9"
                  >{{ item.sessionname.substr(0, 9) }}...</span>
                  <span class="name" v-else>{{ item.sessionname.substr(0, 9) }}</span>
                  <span class="time">
                    {{
                    $timestampToTime(
                    item.imSessionUserList[0].lastmessagetime
                    )
                    }}
                  </span>
                </li>
                <li class="name_box" v-else>
                  <!--患者一对一-->
                  <span class="name clearfix">
                    <span class="name-span">{{ item.imSessionUserList[0].username }}</span>
                    <!-- 是否是付费咨询中状态 -->
                    <span
                      class="type"
                      v-if="item.lastconsultstatus == 1 || item.lastconsultstatus == 2 || item.lastconsultstatus == 3"
                    >
                      <img src="../../../assets/images/status_vip.png" alt />
                    </span>
                    <span class="time">
                      {{
                      $timestampToTime(
                      item.imSessionUserList[0].lastmessagetime
                      )
                      }}
                    </span>
                  </span>
                </li>
                <li class="unReadMessage_box">
                  <span class="unReadMessage_box_span">
                    <i class="unReadMessage_box_i">
                      {{
                      getUnReadMessageBySessionId(item.id).unReadMessage
                      }}
                    </i>
                    <span
                      class="unReadMessage"
                      v-if="
                        getUnReadMessageBySessionId(item.id).unReadMessageCount
                      "
                    >
                      {{
                      getUnReadMessageBySessionId(item.id)
                      .unReadMessageCount > 99
                      ? "···"
                      : getUnReadMessageBySessionId(item.id)
                      .unReadMessageCount
                      }}
                    </span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </van-list>
      </van-tab>
      <van-tab title="我的好友" name="2">
        <van-cell value is-link to="docChatGroup?type=group" class="chat_item">
          <template slot="title">
            <span>医生小组({{ group }})</span>
          </template>
        </van-cell>
        <van-cell value is-link to="docChatGroup?type=steam" class="chat_item">
          <template slot="title">
            <span>医疗团队({{ steam }})</span>
          </template>
        </van-cell>
        <van-collapse class="my-friend" v-model="activeName">
          <van-collapse-item name="1">
            <div slot="title">
              <span>医生好友({{ friendList.length }})</span>
            </div>
            <ul class="chat_lists" v-if="friendList.length">
              <li
                class="chat_lists_item"
                v-for="(item, index) in friendList"
                :key="index"
                @click="docDetail(item.docId)"
              >
                <div class="img_box">
                  <img :src="item.url" alt />
                </div>
                <ul class="chat_message_box">
                  <li class="name_box">
                    <p class="public-title">
                      {{ item.docName }}
                      <span class="office">
                        <span>{{ item.positionName }}</span>
                      </span>
                      <span class="department" style="margin-left: 10px">{{ item.depName }}</span>
                    </p>
                  </li>
                  <li class="unReadMessage_box">
                    <div class="unReadMessage_box_span">
                      <span class="unReadMessage_box_i">{{ item.hosName }}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </van-collapse-item>
        </van-collapse>
      </van-tab>
    </van-tabs>

    <!--弹出层-->
    <van-popup
      v-model="chatAdd"
      :overlay-style="{ background: 'rgba(0,0,0,0.1)' }"
      :style="{ background: 'none' }"
    >
      <div class="chat_addButton" @click="addFriend()">添加好友</div>
      <div class="chat_addButton" @click="createGroup()">创建医生小组</div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
import { mapState } from "vuex";

export default {
  name: "chatIMList",
  components: {
    commonHeader
  },
  data() {
    return {
      isOnce: null,
      loading: false,
      finished: false,
      chatName: "", // 聊天查询
      active: 1,
      activeName: [],
      chatAdd: false, //弹出层
      page: 1, //会话
      limit: 999, //会话
      Fpage: 1, //医生好友
      Flimit: 999, //医生好友
      list: [], //会话列表
      friendList: [], //医生好友列表
      group: "0", //医生小组数量
      steam: "0", // 医生团队数量
      //websocket初始变量值
      websock: null, //-websocket服务支持
      timeout: 10 * 1000, //-30秒一次心跳
      timeoutObj: null, //-心跳心跳倒计时
      serverTimeoutObj: null, //-心跳倒计时
      rest: "", //-存入返回的各种信息
      supported: "", //-连接情况显示
      ReconnectState: false, //-断线重连状态
      timeoutReconnect: null, //-断开重连倒计时
      groupChatCount: 0, // 患者群聊数
      fromUserId: "", // 医生id,vuex中获取,sokect登录时用
      lastMessageTime: new Date().getTime() //最后会话消息时间
    };
  },
  created() {
    this.getIsOnce();
    this.$route.query.active
      ? (this.active = this.$route.query.active)
      : (this.active = 0);
    this.fromUserId = this.getDocInfo.data.docId;
    this.chatList();
    this.active = this.getTabIndex;
    this.onVisibilityChange();
    //tab
    this.chatFriend();
    this.chatGroup();
    this.chatSteam();
  },
  mounted() {
    document.getElementsByClassName("van-hairline--top-bottom")[0].style.top =
      document.getElementsByClassName("chatIMList_header")[0].offsetHeight +
      "px";
  },
  computed: {
    getDocInfo() {
      return this.$store.state.DoctorIM.doctorMessage;
    },
    //未读消息
    unReadMessageCount() {
      let messageCount = 0;
      this.$store.state.DoctorIM.unreadList.forEach(item => {
        for (let i = 0; i < this.list.length; i++) {
          if (item.id === this.list[i].id) {
            if (item.unReadMessageCount) {
              messageCount += item.unReadMessageCount;
            }
            break;
          }
        }
      });

      if (messageCount > 99) {
        messageCount = "99+";
      }
      return messageCount;
    },
    //获取聊天列表未读消息缓存
    getUnreadChatList() {
      return this.$store.state.DoctorIM.unreadList;
    },
    //获取聊天列表未读消息缓存
    getChatList() {
      return this.$store.state.DoctorIM.chatList;
    },
    //下标 tab
    getTabIndex() {
      return this.$store.state.DoctorIM.tabIndex;
    }
  },
  beforeDestroy() {
    if (this.websock) {
      this.websock.close();
    }
    document.removeEventListener("visibilitychange", this.handleOffScreen);
  },
  methods: {
    getIsOnce() {
      // 判断右上角弹窗是否显示
      this.$http
        .request({
          method: "get",
          url: "/RReportController/selectDocPatient",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.isOnce = res.data.data;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    /**
     * 连接socket**/
    initWebSocket() {
      let socketUrl =
        this.$globalServiceHost.fullServiceHost.replace("https", "wss") +
        "/websocket";
      this.websock = new WebSocket(socketUrl);
      this.websock.onopen = this.websocketonopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      window.onbeforeunload = this.onbeforeunload;
    },
    /**
     * websocket success**/
    websocketonopen() {
      this.websock.send(
        JSON.stringify({
          msgId: this.$uuid(),
          type: 1,
          fromUserId: this.fromUserId
        })
      );
    },

    websocketonmessage(e) {
      let chatListVuex = JSON.parse(JSON.stringify(this.getUnreadChatList));
      let allChatList = JSON.parse(JSON.stringify(this.getChatList));
      let data = JSON.parse(e.data);
      console.log("接收的数据", data);

      if (data.type == 2) {
        // data.content = data.content;
      } else if (data.type == 3) {
        data.content = "[图片]";
      } else if (data.type == 4) {
        data.content = "[音频]";
      } else if (data.type == 5) {
        data.content = "[任务]";
      } else if (data.type == 6) {
        data.content = "[文章]";
      } else if (data.type == 7) {
        data.content = "[咨询]";
      } else if (data.type == 8) {
        data.content = "[咨询]";
      } else if (data.type == 9) {
        data.content = "[调查问卷]";
      } else if (data.type == 10) {
        // data.content = "[系统消息]";
      } else if (data.type == 11) {
        data.content = "[产品推荐]";
      } else if (data.type == 14) {
        data.content = "[付费咨询]待支付";
      } else if (data.type == 15) {
        this.chatList();
        data.content = "[付费咨询]已支付";
      } else if (data.type == 16) {
        this.chatList();
        data.content = "[付费咨询]已退款";
      } else if (data.type == 102) {
        data.content = "[系统消息]";
        this.chatList();
      } else if (data.type == 103) {
        data.content = "[系统消息]";
        this.chatList();
      } else if (data.type == 17) {
        data.content = "[产品推荐]";
      } else if (data.type == 18) {
        data.content = "[营养筛查]";
      } else if (data.type == 19) {
        data.content = "[营养筛查]";
      } else if (data.type == 20) {
        data.content = "[复诊通知]";
      }

      allChatList.forEach((item, index) => {
        if (item.id == data.sessionId && item.sessiontype == 1) {
          //群聊添加发送人姓名
          item.imSessionUserList.forEach(function(userItem, j) {
            if (userItem.userid == data.fromUserId) {
              data.content = userItem.username + ":" + data.content;
            }
          });
        }
      });

      if (data.sessionId && data.isRead === 0) {
        let matchingResults = this.$hasValueFromArray(
          chatListVuex,
          "id",
          data.sessionId
        );

        if (matchingResults.value) {
          if (
            matchingResults.value.hasOwnProperty("msgId") &&
            !matchingResults.value.msgId.includes(data.msgId)
          ) {
            //如果没有
            console.log(
              "未读数",
              chatListVuex[matchingResults.index].unReadMessageCount
            );
            if (data.type == 102 || data.type == 103) {
            } else {
              chatListVuex[matchingResults.index].unReadMessage = data.content;
              chatListVuex[matchingResults.index].msgId.push(data.msgId);
              chatListVuex[matchingResults.index].unReadMessageCount++;
              // ? chatListVuex[matchingResults.index].unReadMessageCount++
              // : (chatListVuex[matchingResults.index].unReadMessageCount = 1);
              //console.log('未读数', chatListVuex[matchingResults.index].unReadMessageCount)
            }
          } else {
            console.log("msgId异常！！！");
          }
        } else {
          //新的
          let obj = {};
          let arr = [];
          arr.push(data.msgId);
          obj.id = data.sessionId;
          obj.unReadMessage = data.content;
          obj.unReadMessageCount = 1;
          obj.type = data.type;
          obj.msgId = arr;
          if (obj.type == 102 || obj.type == 103) {
          } else {
            chatListVuex.push(obj);
          }

          // 未匹配的时候判断是否有此条聊天,
          // 如果不存在 刷新聊天列表,主动创建
          let toggle = false;
          for (let i = 0; i < allChatList.length; i++) {
            if (data.sessionId == allChatList[i].id) {
              toggle = true;
              break;
            }
          }
          if (!toggle) {
            this.chatList();
          }
        }
        // console.log(chatListVuex);
        this.$store.commit("DoctorIM/saveUnreadList", chatListVuex);
      }
    },
    websocketonerror() {
      console.log("WebSocket连接失败");
    },
    websocketclose(e) {
      try {
        this.websock.close();
      } catch (e) {
        console.log(e);
      }
    },
    onbeforeunload() {
      this.websocketclose();
    },
    onVisibilityChange() {
      document.addEventListener("visibilitychange", this.handleOffScreen);
    },
    /**
     * 手机熄屏处理**/
    handleOffScreen() {
      if (document.visibilityState === "hidden") {
        this.hiddenTime = new Date().getTime();
      } else {
        let visibleTime = new Date().getTime();

        if (this.websock.readyState == 3) {
          console.log("websocket已断开，正重新连接");
          this.websock = null;
          this.initWebSocket();
        }

        // if ((visibleTime - this.hiddenTime) / 1000 > 0.1) {
        //   //页面再次可见的时间-隐藏时间>0.1s,重连
        //   typeof this.websock.onclose == "function" && this.websock.onclose();
        //   setTimeout(() => {
        //     this.websock.onopen();
        //   }, 1500); //1.5S后重连
        // } else {
        //   console.log("还没有到断开的时间");
        // }
      }
    },
    //跳转一对一详情
    goDetail(id, sessiontype, item) {
      this.$store.commit("DoctorIM/setSessionid", id);
      this.$store.commit("DoctorIM/setSessionType", sessiontype);

      //将消息id置空
      let chatListVuex = JSON.parse(JSON.stringify(this.getUnreadChatList));
      let matchingResults = this.$hasValueFromArray(chatListVuex, "id", id);
      if (matchingResults.value) {
        chatListVuex[matchingResults.index].msgId = [];
      }

      // 如果是群聊的话保存创建人id
      if (item.sessiontype === 1) {
        localStorage.setItem("createDoctorId", item.createuserid);
      }

      this.$router.push({
        name: "docChatIMDetail",
        query: {
          currentSessionId: id,
          setSessionType: sessiontype
        }
      });
    },
    //查询医生小组数量
    chatGroup() {
      this.$http
        .request({
          method: "get",
          url: "/ImGroupController/selectGroup",
          body: {
            name: "",
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.group = res.data.data.list.length || "0";
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    //查询医生小组数量
    chatSteam() {
      this.$http
        .request({
          method: "get",
          url: "/ImSessionController/selectSession",
          body: {
            name: "",
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          if (res.data.success && res.data.data.length > 0) {
            this.steam = res.data.data.length;
          } else {
            this.finished = true;
          }
        })
        .catch(e => {
          this.finished = true;
          Toast("加载失败，请检查网络连接");
        });
    },
    onClick(name, title) {
      this.$store.commit("DoctorIM/saveTabIndex", name);
    },
    //查询医生会话列表
    chatList() {
      this.$http
        .request({
          method: "get",
          url: "/ImController/getDoctorSessionList",
          body: {
            // lastMessageTime: "",
            // page:1,
            limit: this.limit
          }
        })
        .then(res => {
          // 加载状态结束
          this.loading = false;
          this.finished = true; //因为没有分页 page 参数 所以只能手动结束，传时间参数lastMessageTime空 结果为空
          if (res.data.success && res.data.data.length > 0) {
            this.$store.commit("DoctorIM/saveChatList", res.data.data);
            if (!this.websock) {
              this.initWebSocket();
            }
            this.list = res.data.data;
          } else {
            this.finished = true;
          }
        })
        .catch(e => {
          this.finished = true;
        });
    },
    //查询医生好友
    chatFriend() {
      this.$http
        .request({
          method: "get",
          url: "/ImFriendController/selectFriend",
          body: {
            page: this.Fpage,
            limit: this.Flimit
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.friendList = res.data.data;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("加载失败，请检查网络连接");
        });
    },
    chatOpen() {
      this.chatAdd = true;
    },
    search() {
      this.$router.push({
        name: "docSearchPerson"
      });
    },
    addFriend() {
      this.$router.push({
        name: "docIMaddFriend"
      });
    },
    createGroup() {
      // this.$router.push({
      //   name: "docCreateGroup"
      // });
      this.$router.push({
        name: "createDocGroupFirst"
      });
    },
    onLoad() {},
    /**
     * 根据sessionId查询vuex中存储的未读消息和未读消息数
     * socket推送过来的时候更新对应的未读消息和未读消息数**/
    getUnReadMessageBySessionId(id) {
      let obj = {
        unReadMessageCount: "",
        unReadMessage: ""
      };
      this.getUnreadChatList.forEach(item => {
        if (id === item.id) {
          obj.unReadMessageCount = item.unReadMessageCount;
          obj.unReadMessage = item.unReadMessage;
        }
      });

      return obj;
    },
    docDetail(docId) {
      // this.$router.push({
      //   name: "docIMCardDetail",
      //   query: {
      //     doctorId: docId
      //   }
      // });

      this.$router.push({
        name: "docDepartmentCard",
        query: {
          doctorId: docId
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.chatIMList_page {
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
  background: @backgroundColor;

  .chatIMList_header {
    display: flex;
    position: fixed;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    width: 100vw;
    height: 11.7vw;
    background: @backgroundColor;

    /deep/ .van-search {
      flex: 1;
      background: none !important;
      .padding(5, 10, 5, 12);

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
      position: relative;

      .show-one {
        position: absolute;
        box-sizing: border-box;
        .width(138);
        .height(74);
        top: 0;
        right: 12.8vw;
        .padding(10, 29, 10, 10);
        background: @backgroundColorT;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        .borderRadius(5, 5, 5, 5);

        .block-box {
          p {
            .fontSize(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: @descriptionColor;
            .lineHeight(18);
            text-align: left;

            img {
              .width(20);
              vertical-align: middle;
            }
          }

          .arrow-right {
            position: absolute;
            top: 1.6vw;
            right: -3.2vw;
            width: 0;
            height: 0;
            font-size: 0;
            border: solid 1.6vw;
            border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)
              @backgroundColorT;
          }

          .close {
            .width(14);
            .height(14);
            position: absolute;
            top: 3.47vw;
            right: 1.9vw;
            .fontSize(14);
            color: @subtitleColor;
          }
        }
      }
    }
  }

  /deep/ .van-tab__text--ellipsis {
    display: flex !important;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    .fontSize(18);
  }

  /deep/ .van-tabs {
    flex: 1;
    // overflow: auto; /* winphone8和android4+ */
    -webkit-overflow-scrolling: touch; /* ios5+ */
    .width(351);
    margin: 0 auto;
    .padding(89, 0, 0, 0);

    .van-tab {
      .lineHeight(44);
    }

    .van-tabs__wrap {
      .width(351);
      margin: 0 auto;
      .borderRadius(10, 10, 0, 0);
      .height(44);
      position: fixed;
      z-index: 999;
      top: 11.7vw !important;

      &::after {
        border-width: 0;
      }

      .van-tabs__nav {
        padding-bottom: 0;

        .van-ellipsis {
          .fontSize(18);
          color: @titleColor;
        }

        .van-tab--active {
          span {
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: @titleColor;
          }
        }

        .van-tabs__line {
          bottom: 0;
          background-color: @mainColor;
        }
      }
    }

    .van-tabs__content {
      .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border: none;
      }

      .van-tab__pane {
        .borderRadius(0, 0, 10, 10);
        overflow: hidden;
      }

      .van-cell {
        .padding(10, 12, 10, 12);
      }

      .van-cell__title {
        .border_title {
          border: 2px solid @mainColor;
          .margin(0, 12, 0, 0);
          border-radius: 2px;
        }

        span {
          .fontSize(16);
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          .lineHeight(16);
          background: url("../../../assets/images/icon_zhu.png") left center
            no-repeat;
          background-size: 1.07vw;
          padding-left: 5.3vw;
        }
      }
    }

    .titleList {
      display: flex;
      width: 100%;
      height: 100%;
      .fontSize(18);
      justify-content: center;
      align-items: center;
    }

    .chat_title {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .unRead_message {
      // .width(18);
      .height(16);
      background: @mainColor;
      .borderRadius(8, 8, 8, 8);
      .lineHeight(16);
      text-align: center;
      color: @fontOne !important;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      .fontSize(12);
      position: absolute;
      right: 22%;
      top: 1vw;
      .padding(0, 6, 0, 6);
    }
  }

  .chat_lists {
    height: 100%;
    background: @backgroundColorT;
    .borderRadius(0, 0, 10, 10);

    li.chat_lists_item {
      .padding(14, 10, 14, 8);
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      &:last-child {
        border-bottom: none;
      }

      .img_box {
        .margin(0, 11, 0, 0);
        .width(60);
        .height(60);
        border-radius: 50%;
        overflow: hidden;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .chat_message_box {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        width: 0;

        .name_box {
          .height(20);
          .padding(8, 0, 0, 0);
          .margin(0, 0, 10, 0);

          .name {
            .margin(8, 0, 10, 0);
            .fontSize(18);
            font-weight: 400;
            color: @titleColor;
            .lineHeight(20);
          }

          .name-span {
            .fontSize(18);
            font-weight: 400;
            color: @titleColor;
            .lineHeight(20);
            float: left;
          }

          .type {
            // .fontSize(14);
            // color: rgba(122, 179, 255, 1);
            .margin(0, 0, 0, 10);
            float: left;

            img {
              width: 37px;
              display: block;
            }
          }

          .time {
            .fontSize(14);
            .lineHeight(20);
            color: @descriptionColor;
            float: right;
          }
        }

        .unReadMessage_box {
          .fontSize(12);
          color: @descriptionColor;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .unReadMessage {
            .height(16);
            background: @mainColor;
            .borderRadius(8, 8, 8, 8);
            .lineHeight(16);
            text-align: center;
            color: @fontOne !important;
            .fontSize(12);
            .padding(0, 6, 0, 6);
          }

          .unReadMessage_box_span {
            float: left;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .unReadMessage_box_i {
              .fontSize(14);
              .lineHeight(18);
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

  .my-friend {
    /deep/ .van-collapse-item__content {
      padding: 0;
    }

    .name_box {
      padding: 0 !important;
    }

    .unReadMessage_box {
      .unReadMessage_box_i {
        color: @titleColor;
      }
    }
  }

  .chat_addButton {
    width: 280px;
    height: 50px;
    color: @mainColor;
    background: @backgroundColorT;
    .fontSize(16);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1px;
  }
}
</style>
