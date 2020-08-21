/** *@desc 患者端IM聊天列表 *@author houpai *@date 2019/07/04 17:27:48 */
<template>
  <div class="chatIMList_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医疗团队'"></common-header>
    <div class="search_header_box">
      <van-search
          placeholder="搜索"
          v-model="chatName"
          disabled
          @click.stop="routerLink('chatIMListSearch')"></van-search>
    </div>
    <van-tabs v-model="active">
      <van-tab title="会话列表">
        <div slot="title" class="tabSlot_box">
          会话列表
          <span class="unRead_message" v-if="unReadMessageCount">
            {{ unReadMessageCount }}
          </span>
        </div>
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad">
          <ul class="chat_lists">
            <li class="chat_lists_item"
                @click="goSteward"
                v-if="steward != null">
              <div class="img_box">
                <img src="../../../assets/images/stewardIM.png" alt=""/>
              </div>
              <ul class="chat_message_box">
                <li class="name_box">
                  <div class="name">
                    <em class="session_name">
                      健康管家
                    </em>
                    <span class="time">
                      {{ $timestampToTime(steward.createtime) }}
                    </span>
                  </div>
                </li>
                <li class="unReadMessage_box">
                  <div class="unReadMessage_box_span">
                    <i class="unReadMessage_box_i">
                      {{ steward.sendmsg }}
                    </i>
                  </div>
                </li>
              </ul>
            </li>
            <li class="chat_lists_item"
                :class="[{'noBorder':index === chatList.length - 1}]"
                v-for="(item, index) in chatList"
                @click="gotoChatDetail(item)"
                :key="index">
              <div class="img_box">
                <img src="../../../assets/images/default.png"
                     alt=""
                     v-if="item.sessiontype === 1"/>
                <img :src="item.imSessionUserList[0].vxheadurl" alt="" v-else/>
              </div>
              <ul class="chat_message_box">
                <li class="name_box">
                  <div class="name">
                    <em class="session_name">
                      {{item.sessionname || item.imSessionUserList[0].username }}
                    </em>
                    <span class="type_pay"
                          v-if="item.lastconsultstatus == 1 || item.lastconsultstatus == 2 ||item.lastconsultstatus == 3">
                      <img src="../../../assets/images/status_vip.png" alt/>
                    </span>
                    <span class="time">
                      {{$timestampToTime(item.imSessionUserList[0].lastmessagetime)}}
                    </span>
                  </div>
                </li>
                <li class="unReadMessage_box">
                  <div class="unReadMessage_box_span">
                    <i class="unReadMessage_box_i">
                      {{ getUnReadMessageBySessionId(item.id).unReadMessage }}
                    </i>
                    <span class="unReadMessage"
                          v-if="getUnReadMessageBySessionId(item.id).unReadMessageCount">
                  {{getUnReadMessageBySessionId(item.id).unReadMessageCount > 99 ? "···" : getUnReadMessageBySessionId(item.id).unReadMessageCount}}
                </span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </van-list>
      </van-tab>
      <van-tab title="我的医生">
        <van-collapse v-model="activeName">
          <van-collapse-item name="2" class="noMargin">
            <div slot="title">
              <i class="border_title"></i>
              <span>医生({{ doctorList.length }})</span>
            </div>
            <ul class="chat_lists">
              <li class="chat_lists_item"
                  v-for="(item, index) in doctorList"
                  @click="gotoChatDetail(item)"
                  :key="index">
                <div class="img_box">
                  <img :src="item.vxheadurl" alt=""/>
                </div>
                <ul class="chat_message_box">
                  <li class="name_box">
                    <span class="name">
                      {{ item.doctorname }}
                      <span class="type">
                        医生
                      </span>
                    </span>
                  </li>
                  <li class="unReadMessage_box">
                    <span class="unReadMessage_box_span">
                      <i class="unReadMessage_box_i">
                        {{ item.hospitalname }}
                        <b class="Department" style="margin-left: 10px">
                          {{ item.positionname }}
                        </b>
                      </i>
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </van-collapse-item>
        </van-collapse>
        <div class="doctorTeam_box"
             @click.stop="routerLink('doctorTeamSearch')">
          <i class="border_title"></i>
          <span>医疗团队({{ groupChatCount }})</span>
          <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
        </div>
      </van-tab>
    </van-tabs>
    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="searchLoading"></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import stewardIM from "../steward/stewardIM";

  export default {
    name: "chatIMList",
    components: {
      commonHeader
    },
    data() {
      return {
        searchLoading: false, // loading
        fromUserId: "", // 患者id,vuex中获取,sokect登录时用
        chatList: [], // 聊天列表
        chatName: "", // 聊天查询
        active: 0,
        activeName: ["2"],
        doctorList: [], // 医生列表
        patientSessionList: [], // 患者端聊天列表
        finished: false, // 是否还有更多
        loading: false, // loading
        //websocket初始变量值
        websock: null, //-websocket服务支持
        timeout: 10 * 1000, //-30秒一次心跳
        timeoutObj: null, //-心跳心跳倒计时
        serverTimeoutObj: null, //-心跳倒计时
        rest: "", //-存入返回的各种信息
        supported: "", //-连接情况显示
        ReconnectState: false, //-断线重连状态
        timeoutReconnect: null, //-断开重连倒计时
        steward: null, //客服最后一条消息
        groupChatCount: 0 // 患者群聊数
      };
    },
    computed: {
      /**
       * 聊天列表未读信息**/
      unReadMessageCount() {
        let messageCount = 0;
        this.PatientIM.chatListVuex.forEach(item => {
          for (let i = 0; i < this.chatList.length; i++) {
            if (item.sessionId === this.chatList[i].id) {
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
      ...mapState(["PatientIM"])
    },
    methods: {
      /**
       * 跳转客服页**/
      goSteward() {
        //跳转客服页
        this.$router.push({name: "stewardIM"});
      },
      /**
       * 查寻客服管家最后一条记录**/
      selectHistory() {
        this.$http
          .request({
            method: "get",
            url: "/SMessageController/selectHistoryByServerId",
            body: {
              clientId: this.PatientIM.patientMessage.ruserid
            }
          })
          .then(res => {
            if (res.data.success) {
              console.log(res.data.data);
              if (res.data.data.length > 0) {
                res.data.data[0].createtime =
                  Date.parse(
                    new Date(res.data.data[0].createtime.replace(/-/g, "/"))
                  ) / 1000;
                this.steward = res.data.data[0];
              }
            } else {
              console.log("查询历史聊天记录接口报错");
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      /**
       * 查看聊天详情**/
      gotoChatDetail(item) {
        let lastconsultstatus = false;
        if (item.lastconsultstatus == 1 || item.lastconsultstatus == 2 || item.lastconsultstatus == 3) {
          lastconsultstatus = true;
        }
        let sessionMessage = {
          sessionType: item.sessiontype || 0,
          sessionId: item.id || item.imsessionid,
          doctorId: (item.imSessionUserList && item.imSessionUserList[0].userid) || item.doctorid,
          lastconsultstatus: item.sessiontype == 0 ? lastconsultstatus : false
        };
        this.$store.commit("PatientIM/sessionMessage", sessionMessage);
        if (sessionMessage.sessionType === 2) {
          this.$router.push({
            path: "assistantIM",
            query: {
              sessionType: item.sessiontype || 0,
              sessionId: item.id || item.imsessionid,
              doctorId: (item.imSessionUserList && item.imSessionUserList[0].userid) || item.doctorid,
              // lastconsultstatus: item.sessiontype == 0 ? lastconsultstatus : false
            }
          });
        } else {
          this.$router.push({
            path: "chatIMDetail",
            query: {
              sessionType: item.sessiontype || 0,
              sessionId: item.id || item.imsessionid,
              doctorId: (item.imSessionUserList && item.imSessionUserList[0].userid) || item.doctorid,
              lastconsultstatus: item.sessiontype == 0 ? lastconsultstatus : false
            }
          });
        }
      },
      /**
       * 路由跳转**/
      routerLink(name) {
        this.$router.push({
          path: name,
          query: {}
        });
      },

      /**
       * 查询关联医生**/
      getMyDoctorList(name) {
        this.searchLoading = true;
        this.$http
          .request({
            method: "get",
            url: "/ImController/getMyDoctorList",
            body: {
              name: name ? name : ""
            }
          })
          .then(res => {
            this.searchLoading = false;
            if (res.data.success) {
              this.doctorList = res.data.data;
            } else {
              console.log("获取患者医生接口报错");
            }
          })
          .catch(e => {
            this.searchLoading = false;
            console.log(e);
          });
      },

      /**
       * 查询患者聊天列表
       * **/
      getPatientSessionList() {
        this.loading = true;
        this.searchLoading = true;
        this.$http
          .request({
            method: "get",
            url: "/ImController/getPatientSessionList",
            body: {
              limit: 999
            }
          }).then(res => {
          this.loading = false;
          this.searchLoading = false;
          let ary = [];
          if (res.data.success) {
            if (res.data.other) {
              try {
                if (res.data.data) {
                  res.data.data.unshift(res.data.other.data);
                } else {
                  ary.push(res.data.other.data);
                }
              } catch (e) {
                console.log(e);
              }
            }

            this.chatList = res.data.data || ary;
            console.log("chatList", this.chatList);
            this.$store.commit("PatientIM/patientChatList", this.chatList);
            this.finished = !res.data.hashMore;
            if (!this.websock) {
              this.initWebSocket();
            }
          } else {
            console.log("获取患者聊天记录接口报错");
          }
        }).catch(e => {
          console.log(e);
          this.loading = false;
          this.searchLoading = false;
        });
      },
      /**
       * 分页加载**/
      onLoad() {
        // 异步更新数据
        setTimeout(() => {
          console.log(123);
        }, 500);
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
        console.log("连接成功");
        this.websock.send(
          JSON.stringify({
            msgId: this.$uuid(),
            type: 1,
            fromUserId: this.fromUserId
          })
        );
      },

      websocketonmessage(e) {
        let chatListVuex = JSON.parse(
          JSON.stringify(this.PatientIM.chatListVuex)
        );
        let data = JSON.parse(e.data);
        console.log("chatList接收到的信息====", data);
        switch (data.type) {
          case 3:
            data.content = "[图片]";
            break;
          case 4:
            data.content = "[语音]";
            break;
          case 5:
            data.content = "[任务]";
            break;
          case 6:
            data.content = "[文章]";
            break;
          case 7:
            data.content = "[咨询]";
            break;
          case 8:
            data.content = "[医生回答了你的问题]";
            break;
          case 9:
            data.content = "[调查问卷]";
            break;
          case 11:
            data.content = "[您有新的产品订单]";
            break;
          case 14:
            data.content = "[付费咨询]待支付";
            break;
          case 15:
            data.content = "[付费咨询]已支付";
            break;
          case 16:
            data.content = "[付费咨询]已退款";
            break;
          case 17:
            data.content = "[营养方案]已生成";
            break;
          case 18:
            data.content = "[营养筛查报告]已生成";
            break;
          case 19:
            data.content = "[营养筛查报告]已生成";
            break;
          case 20:
            data.content = "[待复诊通知]";
            break;
          case 101:
            data.content = "[付费咨询]待反馈";
            break;
          default:
        }
        if (data.sessionId && data.isRead === 0) {
          let matchingResults = this.$hasValueFromArray(
            chatListVuex,
            "sessionId",
            data.sessionId
          );
          if (matchingResults.value) {
            if (matchingResults.value.msgId.indexOf(data.msgId) === -1) {
              chatListVuex[matchingResults.index].unReadMessage = data.content;
              if (data.type !== 101) {
                chatListVuex[matchingResults.index].unReadMessageCount++;
              }
              chatListVuex[matchingResults.index].msgId.push(data.msgId);
            }
            this.$store.commit("PatientIM/chatListVuex", chatListVuex);
          } else {
            let obj = {};
            let ary = [];
            ary.push(data.msgId);
            obj.sessionId = data.sessionId;
            obj.unReadMessage = data.content;
            if (data.type !== 101) {
              obj.unReadMessageCount = 1;
            } else {
              obj.unReadMessageCount = 0;
            }
            obj.unReadMessageCount = 1;
            obj.type = data.type;
            obj.msgId = ary;
            chatListVuex.push(obj);
            this.$store.commit("PatientIM/chatListVuex", chatListVuex);
            // 未匹配的时候判断是否有此条聊天,
            // 如果不存在 刷新聊天列表
            let toggle = false;
            for (let i = 0; i < this.chatList.length; i++) {
              if (data.sessionId === this.chatList[i].id) {
                toggle = true;
                break;
              }
            }
            if (!toggle) {
              this.getPatientSessionList();
            }
          }
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

      /**
       * 根据sessionId查询vuex中存储的未读消息和未读消息数
       * socket推送过来的时候更新对应的未读消息和未读消息数**/
      getUnReadMessageBySessionId(id) {
        let obj = {
          unReadMessageCount: "",
          unReadMessage: ""
        };
        this.PatientIM.chatListVuex.forEach(item => {
          if (id === item.sessionId) {
            obj.unReadMessageCount = item.unReadMessageCount;
            obj.unReadMessage = item.unReadMessage;
          }
        });
        return obj;
      },

      /**
       * 查询患者群聊个数**/
      getPatientSessionListGroupChat() {
        this.$http
          .request({
            method: "get",
            url: "/ImController/getPatientSessionListGroupChat",
            body: {}
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              this.groupChatCount = res.data.data.length;
            } else {
              console.log("患者群聊接口报错");
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    created() {
      this.fromUserId = this.PatientIM.patientMessage.id;
      this.getPatientSessionList();
      this.getMyDoctorList("");
      this.getPatientSessionListGroupChat();
      this.selectHistory();
    },
    beforeDestroy() {
      if (this.websock) {
        this.websock.close();
      }
    }
  };
</script>

<style scoped lang="less">

  .chatIMList_page {
    box-sizing: border-box;
    .padding(0, 12, 12, 12);

    /*隐藏v-list自带的loading*/

    /deep/ .van-loading {
      .van-loading__spinner.van-loading__spinner--circular {
        display: none;
      }

      .van-loading__text {
        display: none;
      }
    }

    /*vant样式初始化*/

    /deep/ .van-tabs__content {
      .borderRadius(0, 0, 10, 10);
      overflow: hidden;
    }

    /deep/ .van-tab__text--ellipsis {
      display: flex !important;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      .fontSize(18);
    }

    /deep/ .van-tab__pane {
      .borderRadius(0, 0, 10, 10);
    }

    /deep/ .van-tabs__wrap {
      overflow: visible !important;
    }

    /deep/ .van-icon-search {
      margin-left: 10 / 375 * 100vw;
    }

    /deep/ .van-list__loading .van-loading {
      display: none;
    }

    /deep/ .van-icon-close {
      margin-right: 10 / 375 * 100vw;
    }

    .search_header_box {
      position: fixed;
      z-index: 999;
      top: 0;
      left: 12 / 375 * 100vw;
      right: 12 / 375 * 100vw;
      background-color: @backgroundColor;
      .padding(12, 0, 12, 0);

      /deep/ .van-search {
        padding: 0;
        .height(34);
        .borderRadius(6, 6, 6, 6);
        overflow: hidden;

        .van-search__content {
          padding-left: 0 !important;
          background-color: #fff;
        }

        .van-cell {
          padding: 0;

          .van-field__left-icon .van-icon-search {
            font-size: 22px;
            color: #cccccc;
          }

          /deep/ .van-field__control {
            font-size: 16px;
            color: #cccccc;
          }

        }

      }
    }


    /*tab栏定位*/

    /deep/ .van-tabs__wrap.van-hairline--top-bottom {
      .height(44);
      position: fixed;
      top: 52 / 375 * 100vw;
      left: 12 / 375 * 100vw;
      right: 12 / 375 * 100vw;
      z-index: 999;
      .borderRadius(10, 10, 0, 0);
      overflow: hidden !important;
    }

    /deep/ .van-tabs__nav--line {
      padding-bottom: 0;
    }

    /deep/ .van-tabs__line {
      bottom: 0;
      background-color: @mainColor;
    }


    .tabSlot_box {
      .fontSize(18);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    /deep/ .van-tab.van-ellipsis {
      .fontSize(18);
    }

    /deep/ .van-tab.van-tab--active.van-ellipsis .van-tab__text{
      font-weight: bold !important;
    }

    .van-tab--active .tabSlot_box {
      font-weight: bold !important;
    }

    /deep/ .van-tab.van-tab--active span.van-tab__text.van-tab__text--ellipsis {
      font-weight: bold !important;
    }


    /deep/ .van-hairline--top-bottom::after {
      border-width: 0 0;
    }

    /deep/ .van-hairline--top-bottom::after {
      border-width: 0 0 !important;
    }

    /deep/ .van-tabs--line {
      padding-top: 96 / 375 * 100vw;
    }

    /deep/ .van-ellipsis {
      .fontSize(18);
      color: #323233;
    }

    /deep/ .van-tab.van-tab--active .van-ellipsis{
      font-weight: bold !important;
    }
  }


  .chatIMList_page {
    display: flex;
    flex-direction: column;

    .van-tabs {
      .unRead_message {
        min-width: 18px;
        height: 18px;
        background: @mainColor;
        border-radius: 50%;
        line-height: 18px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        position: absolute;
        top: 6px;
        right: 22%;
      }

      /deep/ .van-tabs__nav {

        .van-tabs__line {
          background-color: @mainColor;
        }
      }
    }

    .chat_lists.backgroundGray {
      background: #f5f5f5;
    }

    .chat_lists {
      height: 100%;
      background: #fff;
      .borderRadius(0, 0, 10, 10);
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      li.chat_lists_item.noBorder {
        border-bottom: none;
      }

      li.chat_lists_item {
        .padding(15, 12, 15, 12);
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .img_box {
          .margin(0, 11, 0, 0);
          width: 60 / 375 * 100vw;
          position: relative;
          .height(60);

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

        }

        .chat_message_box {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          li {
            .padding(6, 0, 6, 0);
          }

          .type_pay {
            .margin(0, 0, 0, 10);

            img {
              width: 37px;
              display: block;
            }
          }

          .name_box {
            .name {
              display: flex;
              align-items: center;
              width: 100%;
              .fontSize(18);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);

              .session_name {
                display: inline-block;
                max-width: 70%;
                .lineHeight(24);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }

              .time {
                flex: 1;
                .fontSize(14);
                .lineHeight(18);
                text-align: right;
              }
            }

            .type {
              display: inline-block;
              .height(20);
              .lineHeight(20);
              .fontSize(14);
              .margin(0, 0, 0, 10);
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(226deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
              .borderRadius(4, 4, 4, 4);
              .padding(0, 4, 0, 4);
            }

            .time {
              .fontSize(14);
              .lineHeight(18);
              color: rgba(153, 153, 153, 1);
              float: right;
            }
          }

          .unReadMessage_box {
            .fontSize(12);
            color: rgba(153, 153, 153, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .unReadMessage_box_span {
              float: left;
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              .fontSize(14);
              .lineHeight(20);

              .unReadMessage_box_i {
                display: inline-block;
                flex: 1;
                width: 0;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                .fontSize(14);
                .lineHeight(18);
                font-weight: 400;
                color: rgba(102, 102, 102, 1);

                .Department {
                  color: rgba(153, 153, 153, 1);
                }
              }

              .unReadMessage {
                min-width: 18px;
                height: 18px;
                background: @mainColor;
                border-radius: 50%;
                line-height: 18px;
                text-align: center;
                color: #fff;
                font-size: 12px;
              }
            }
          }
        }
      }
    }


    /*我的医生部分样式*/

    .border_title {
      border: 2px solid @mainColor;
      .margin(0, 12, 0, 0);
    }

    /deep/ .van-collapse.van-hairline--top-bottom {
      .margin(12, 0, 0, 0);
    }


    /deep/ .van-collapse-item__content {
      padding: 0 !important;
    }

    /deep/ .van-cell:not(:last-child)::after {
      border-bottom: none !important;
    }

    /deep/ .van-cell.van-cell--clickable.van-collapse-item__title {
      border-top: 1px solid rgba(0, 0, 0, .1);
    }

    /deep/ .van-cell__title {
      .fontSize(16);
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .noMargin {
      .margin(-12, 0, 0, 0);
    }


    .doctorTeam_box {
      .padding(10, 15, 10, 15);
      border-top: 1px solid rgba(0, 0, 0, .1);
      overflow: hidden;
      .fontSize(16);
      .lineHeight(20);
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      background-color: #fff;

      .van-icon {
        float: right;
        /*transform: rotate(90deg);*/
      }
    }
  }


</style>
