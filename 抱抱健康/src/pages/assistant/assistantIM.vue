/** *@desc 小智助手聊天 *@author houpai *@date 2019/11/07 10:30:47 */
<template>
  <div class="assistantIM_page">
    <common-header
        :share-disabled="true"
        :custom-title="'咨询管理'"></common-header>
    <div class="chatIM_title">
      <van-icon
          name="arrow-left"
          class="back_btn"
          @click.stop="$router.push({ path: '/chatIMList' })"></van-icon>
      <p>
        {{ "小智助手" }}
      </p>
      <div class="doctor_bar right_btn">
      </div>
    </div>

    <!--    聊天内容-->
    <ul
        class="chatIM_content"
        :class="hidden ? 'none' : 'show'"
        ref="chatContentBox"
    >
      <van-pull-refresh
          v-model="isLoading"
          @refresh="onRefresh"
          class="pullRefresh"
      >
        <div v-for="(item, index) in infoList" :key="index">
          <!--          文字聊天 -->
          <!--张松仁添加小智跳转客服-->
          <div @click="goSteward()">
            <p
                class="session_sendTime"
                v-if="
                item.type === 13 &&
                  item.identity === 'assistant' &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box" v-if="item.type === 13">
              <div>
                <img src="../../assets/images/assistant.png" alt=""/>
              </div>
              <div class="width68">
                <p class="patient_info_l" style="position: relative">
                  <span v-html="$options.filters.substitute(item.content)">
                  </span>
                  <!--                  <span class="arrow_left"></span>-->
                </p>
              </div>
            </div>
          </div>
          <!--张松仁添加小智跳转客服end-->
          <div>
            <p
                class="session_sendTime"
                v-if="
                item.type === 2 &&
                  item.identity === 'assistant' &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 2 && item.identity === 'assistant'">
              <div>
                <img src="../../assets/images/assistant.png" alt=""/>
              </div>
              <div class="width68">
                <p class="patient_info_l" style="position: relative">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p class="session_sendTime"
               v-if="item.type === 2 && item.identity === 'patient' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box_r"
                 v-if="item.type === 2 && item.identity === 'patient'">
              <div class="width68">
                <p class="patient_info_l" style="position: relative">
                  {{ item.content }}
                </p>
              </div>
              <div>
                <img :src="patientVxHeadUrl"
                     @click.stop="routerLink('patientMessageComplete', item)"/>
              </div>
            </div>
          </div>

          <!--          小智助手回复的答案列表 -->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 12 && item.identity === 'assistant' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 12 && item.identity === 'assistant'">
              <div>
                <img src="../../assets/images/assistant.png" alt=""/>
              </div>
              <div class="width68 anwser_box68">
                <div class="patient_info_l anwser_box"
                     style="position: relative">
                  <ul>
                    <h3 class="answer_header"></h3>
                    <ul class="anwser_ul">
                      <li v-for="(subItem, subIndex) in item.list"
                          @click="answerDetail(subItem.id)"
                          :key="subIndex"
                          v-if="subItem.show">
                        {{ subItem.question }}
                      </li>
                      <div class="more_btn"
                           v-if="item.list && item.list.length > 10 && !item.allShow"
                           @click="answerMore(infoList, index)">
                        <span>{{ "更多" }}</span>
                        <van-icon name="arrow-down"></van-icon>
                      </div>
                      <div class="more_btn"
                           v-if="item.list && item.list.length > 10 && item.allShow"
                           @click="answerLess(infoList, index)">
                        <span>{{ "收起" }}</span>
                        <van-icon name="arrow-up"></van-icon>
                      </div>
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!--小智助手跳转疾康知介绍-->
          <div @click.stop="goIntroduceList">
            <p
                class="session_sendTime"
                v-if="
                item.type === 'diseaseMessage' &&
                  item.identity === 'assistant' &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box" v-if="item.type === 'diseaseMessage'">
              <div>
                <img src="../../assets/images/assistant.png" alt=""/>
              </div>
              <div class="width68">
                <p class="patient_info_l diseaseMessage_box" style="position: relative">
                  {{item.content}}
                </p>
                <p class="read_tip">点击即可阅读</p>
              </div>
            </div>
          </div>

          <!--          系统消息-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 10 &&item.identity === 'system' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <p v-if="item.type === 10 && item.identity === 'system'"
               class="system_message">
              {{ item.content }}
            </p>
          </div>
        </div>
      </van-pull-refresh>
    </ul>

    <!--    聊天底部-->
    <div class="chatIM_input_box" id="chatIM_input_box" @click.stop="">
      <div class="chatIM_input_content">
        <van-cell-group>
          <van-field
              v-model.trim="chatValue"
              placeholder="不知道啥疾病?请简洁描述症状告诉我..."
              type="textarea"
              :autosize="{ maxHeight: 90, minHeight: 34 }"
              ref="chatIMInput"
          ></van-field>
        </van-cell-group>
        <van-button type="warning" size="small" @click.stop="sendMessage">
          发送
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapState} from "vuex";
  import commonHeader from "../../components/commonHeader/common_header";
  import stewardIM from "../Patient/steward/stewardIM";

  export default {
    name: "assistantIM",
    components: {
      commonHeader
    },
    filters: {
      substitute(val) {
        //张松仁加,健康管家蓝色
        val = val.replace("健康管家", "<span style='color: #FFF300'>健康管家</span>");
        return val;
      }
    },
    computed: {
      ...mapState(["PatientIM"]),
      ...mapState(["PatientMessage"])
    },
    watch: {
      chatValue(value) {
        //检测表情
        let reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
        this.chatValue = value.replace(reg2, "").trim();
      }
    },
    data() {
      return {
        isLoading: false, // 下拉查询历史聊天记录
        chatValue: "", // 聊天内容
        //websock初始变量值
        websock: null, //-websock服务支持
        infoList: [], // 聊天内容
        fromUserId: "", // 发送人id,
        sessionId: "", // 会话id，
        sessionType: "", // 会话类型 0 单聊 1 群聊 2 小智助手聊天
        doctorId: "", // 医生id
        hiddenTime: "",
        patientChatList: [], // 患者聊天列表
        patientVxHeadUrl: "", // 患者头像
        hidden: true,
        scrollTop: 0
      };
    },
    methods: {
      /**
       * 跳转客服管家页(张松仁)**/
      goSteward() {
        this.$router.push({name: "stewardIM"});
      },
      /**
       * 下拉刷新聊天记录
       * 初始加载10条聊天记录**/
      onRefresh() {
        setTimeout(() => {
          this.isLoading = true;
          this.getHistoryInfoList(this.infoList.length ? this.infoList[0] : "");
        }, 500);
      },

      /**
       * 查询历史聊天记录,默认为10条
       * 下拉再次加载10条**/
      getHistoryInfoList(item) {
        return new Promise((resolve, rejected) => {
          this.$http
            .request({
              method: "get",
              url: "/ImController/getHistoryMessageBySessionIdSendTime",
              body: {
                sessionId: this.sessionId,
                userId: this.fromUserId,
                sendTime: item ? item.sendTime : ""
              }
            })
            .then(res => {
              this.isLoading = false;
              if (res.data.success) {
                let infoListData = JSON.parse(JSON.stringify(res.data.data));
                infoListData &&
                infoListData.forEach(item => {
                  item.sendTime = Number(item.sendTime);
                  if (item.fromUserId === this.fromUserId) {
                    item.identity = "patient";
                  } else {
                    item.identity = "assistant";
                  }
                  if (item.type === 10) {
                    item.identity = "system";
                  }
                  // 如果是小智助手答案 重组数据
                  // ---------------假装我是一条分割线--------------------
                  if (item.type === 12) {
                    item.list = JSON.parse(item.content);
                    item.allShow = item.list.length < 10;
                    item.showNumber = 10;
                    item.list.forEach((subItem, subIndex) => {
                      subItem.show = subIndex <= 9;
                    });
                  }
                });
                this.infoList = this.infoList.length
                  ? infoListData.concat(this.infoList)
                  : infoListData;
                if (!item) {
                  this.getChatContentView();
                }
                resolve(res);
              } else {
                rejected(res);
                console.log("查询历史聊天记录接口报错");
              }
            })
            .catch(e => {
              this.isLoading = false;
              console.log(e);
            });
        });
      },

      /**
       * 页面跳转**/
      answerDetail(id) {
        console.log("router change");
        this.$router.push({
          path: "answerByAssistant",
          query: {
            answerId: id
          }
        });
      },

      /**
       * 发送消息**/
      sendMessage() {
        let _this = this;
        if (this.chatValue) {
          let uuid = this.$uuid();
          this.websock.send(
            JSON.stringify({
              msgId: uuid,
              type: 2,
              fromUserId: this.fromUserId,
              content: this.chatValue,
              sessionId: this.sessionId
            })
          );
          this.infoList.push({
            msgId: uuid,
            type: 2,
            fromUserId: this.fromUserId,
            content: this.chatValue,
            sessionId: this.sessionId,
            status: 1, // 消息发送状态,默认发送中
            identity: "patient",
            sendTime: new Date().getTime()
          });
          // 通过sessinId找到vuex中存储的未读(已读)消息,修改为最新的消息
          let chatListVuex = JSON.parse(
            JSON.stringify(this.PatientIM.chatListVuex)
          );
          let matchingResults = this.$hasValueFromArray(
            chatListVuex,
            "sessionId",
            this.sessionId
          );
          if (matchingResults.value) {
            chatListVuex[matchingResults.index].type = 2;
            chatListVuex[matchingResults.index].unReadMessage = this.chatValue;
          } else {
            let obj = {};
            let ary = [];
            ary.push(uuid);
            obj.sessionId = this.sessionId;
            obj.msgId = ary;
            obj.unReadMessage = this.chatValue;
            obj.unReadMessageCount = 0;
            obj.type = 2;
            chatListVuex.push(obj);
          }
          this.$store.commit("PatientIM/chatListVuex", chatListVuex);
          this.chatValue = "";
          // 每发送一条消息,push一条跳转到疾康知介的提示模板(产品设计的,瑜哥添油加醋最终喷成现在的这个需求,mark一下)
          this.infoList.push({
            msgId: uuid,
            type: 'diseaseMessage',
            fromUserId: this.fromUserId,
            content: '您好,我是小智,您咨询的疾病的详情、病因及诊疗方法等已推荐链接给您了,祝您身体健康',
            sessionId: this.sessionId,
            status: 1, // 消息发送状态,默认发送中
            identity: "assistant",
            sendTime: new Date().getTime()
          });

          _this.getChatContentView();
        }
      },

      /**
       * 聊天内容滚动到可视区**/
      getChatContentView() {
        let _this = this;
        try {
          this.$nextTick(() => {
            setTimeout(function () {
              _this.$refs.chatContentBox.scrollTop =
                _this.$refs.chatContentBox.scrollHeight;
              _this.hidden = false;
            }, 100);
          });
        } catch (e) {
          console.log(e);
        }
      },

      /**
       * 初始化websock**/
      initwebsock() {
        let socketUrl =
          this.$globalServiceHost.fullServiceHost.replace("https", "wss") +
          "/websocket";
        this.websock = new WebSocket(socketUrl);
        this.websock.onopen = this.websockonopen;
        this.websock.onmessage = this.websockonmessage;
        this.websock.onerror = this.websockonerror;
        this.websock.onclose = this.websockclose;
        window.onbeforeunload = this.onbeforeunload;
      },

      /**
       * websock success**/
      websockonopen() {
        console.log("socket连接成功");
        this.websock.send(
          JSON.stringify({
            msgId: this.$uuid(),
            type: 1,
            fromUserId: this.fromUserId
          })
        );
      },

      /**
       * websock receive
       * 接收到消息后发送回文代表已读**/
      websockonmessage(e) {
        let _this = this;
        let data = JSON.parse(e.data);
        console.log("接收到的消息====", data);
        if (data.sessionId === this.sessionId) {
          switch (data.type) {
            // 小智助手答案 推送过来的时候重组数据,接收到答案之后给个提示(仅供参考的提示)
            case 12:
              try {
                data.list = JSON.parse(data.content);
                data.allShow = data.list.length < 10;
                data.showNumber = 10;
                data.list.forEach((item, index) => {
                  item.show = index <= 9;
                });
              } catch (e) {
                console.log(e);
              }
              this.infoList.push({
                ...data,
                identity: "assistant"
              });

              this.infoList.push({
                type: 10,
                sendTime: new Date().getTime(),
                content:
                  "本次对话为建设性的医疗咨询,不同于线下问诊,所有建议仅供参考",
                identity: "system"
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            case 10:
              this.infoList.push({
                ...data,
                identity: "system"
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            case 13:
              //张松仁添加小智跳转客服
              this.infoList.push({
                ...data,
                identity: "assistant"
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            default:
              this.infoList.push({
                ...data,
                identity: "assistant"
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
          }
          // 通过sessinId找到vuex中存储的未读消息和未读消息数
          let chatListVuex = JSON.parse(
            JSON.stringify(this.PatientIM.chatListVuex)
          );
          let matchingResults = this.$hasValueFromArray(
            chatListVuex,
            "sessionId",
            data.sessionId
          );
          if (matchingResults.value) {
            chatListVuex[matchingResults.index].unReadMessageCount = 0;
            chatListVuex[matchingResults.index].msgId.length = 0;
            if (data.type === 12) {
              chatListVuex[matchingResults.index].unReadMessage =
                "[小智助手回答了您的问题]";
            } else {
              chatListVuex[matchingResults.index].unReadMessage = data.content;
            }
          } else {
            let obj = {};
            let ary = [];
            ary.push(data.msgId);
            obj.sessionId = data.sessionId;
            if (data.type === 12) {
              obj.unReadMessage = "[小智助手回答了您的问题]";
            } else {
              obj.unReadMessage = data.content;
            }
            obj.unReadMessageCount = 0;
            obj.type = data.type;
            obj.msgId = ary;
            chatListVuex.push(obj);
          }
          this.$store.commit("PatientIM/chatListVuex", chatListVuex);
          console.log("更新过后的聊天未读数", this.PatientIM.chatListVuex);
          _this.getChatContentView();
        }
      },

      /**
       * websock fail**/
      websockonerror() {
        console.log("websock连接失败");
      },

      /**
       * websock close**/
      websockclose(e) {
        try {
          this.websock.close();
        } catch (e) {
          console.log(e);
        }
      },

      /**
       * Browser close**/
      onbeforeunload() {
        this.websockclose();
      },

      onVisibilityChange() {
        document.addEventListener("visibilitychange", this.handleOffScreen);
      },

      /**
       * 手机熄屏处理**/
      handleOffScreen() {
        if (this.websock.readyState === 3) {
          console.log("websock已断开，正重新连接");
          this.websock = null;
          this.initwebsock();
        }
      },

      /**
       * 小智助手答案列表,每次加载10条**/
      answerMore(infoList, index) {
        this.infoList[index].showNumber += 10;
        this.infoList[index].list.forEach((item, subIndex) => {
          item.show = subIndex <= this.infoList[index].showNumber - 1;
        });
        for (let i = 0; i < this.infoList[index].list.length; i++) {
          if (this.infoList[index].list[i].show === false) {
            this.infoList[index].allShow = false;
            break;
          } else {
            this.infoList[index].allShow = true;
          }
        }
      },

      /**
       * 小智助手答案列表收起**/
      answerLess(infoList, index) {
        this.infoList[index].list.forEach((item, subIndex) => {
          item.show = subIndex <= 9;
        });
        this.infoList[index].allShow = false;
        this.infoList[index].showNumber = 10;
      },
      /**
       * 跳转疾康知介
       * **/
      goIntroduceList() {
        this.$router.push({
          path:'introduceList'
        })
      }
    },
    created() {
      this.fromUserId = this.PatientIM.patientMessage.id;
      this.sessionId = this.$route.query.sessionId || this.PatientIM.sessionMessage.sessionId || "";
      this.sessionType = this.$route.query.sessionType || this.PatientIM.sessionMessage.sessionType || 0;
      this.patientVxHeadUrl = this.PatientIM.patientMessage.vxheadurl;
      this.onVisibilityChange();
      let getHistoryInfoListPromise = null;
      getHistoryInfoListPromise = this.getHistoryInfoList();
      Promise.all([getHistoryInfoListPromise]).then(() => {
        this.initwebsock();
      });
      this.getChatContentView();
    },
    beforeDestroy() {
      if (this.websock) {
        this.websock.close();
      }
      document.removeEventListener("visibilitychange", this.handleOffScreen);
    }
  };
</script>

<style scoped lang="less">
  .assistantIM_page {

    /deep/ .van-field--min-height .van-field__control {
      min-height: 34px;
    }

    /deep/ .van-field__control {
      max-height: 90px !important;
      padding-top: 11px;
    }

    /deep/ .van-cell {
      .lineHeight(14);
    }

    /deep/ .van-pull-refresh {
      -webkit-user-select: auto;
      user-select: auto;
      overflow: visible !important;
      height: 96%;
    }

    /deep/ .van-pull-refresh__track {
      height: 100%;
      position: relative;
      z-index: 999;
    }

    /deep/ .van-button--warning {
      color: @mainColor;
      background-color: @backgroundColor;
      border: none;
      .width(56);
      .fontSize(16);
      font-weight: bold;
    }

    /deep/ .van-button--small {
      min-width: 56 / 375 * 100vw;
      .padding(0, 0, 0, 0);
    }


    /*组件样式*/


    /deep/ .van-field__control {
      background: #fff;
      .fontSize(16);
      .borderRadius(6, 6, 6, 6);
      flex: 1;
      .padding(14, 0, 0, 10);
    }

    /deep/ .van-cell.van-field {
      padding: 0;
    }

    /deep/ .van-hairline--top-bottom::after {
      border-width: 0 0;
    }

    /deep/ .van-cell-group.van-hairline--top-bottom {
      flex: 1;
      .margin(0, 4, 0, 0);
    }
  }

  /*页面样式*/
  .assistantIM_page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .chatIM_title {

      .van-icon,
      .van-icon::before {
        .width(36);
        .height(56);
        .lineHeight(56);
      }

      display: flex;
      align-items: center;
      .height(44);
      .padding(0, 12, 0, 12);

      .right_btn {
        .width(36);
        height: 100%;
        display: flex;
        align-items: center;
        color: @mainColor;
        .fontSize(18);
        font-weight: 400;
      }

      i {
        display: inline-block;
        .fontSize(28);
      }

      .back_btn {
        color: #000000;
      }

      .doctor_bar {
        color: @buttonColor;
      }

      p {
        width: 0;
        flex: 1;
        height: 100%;
        .lineHeight(44);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .fontSize(20);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .chatIM_input_content {
      position: relative;
      min-height: 56px;
      display: flex;
      .padding(4, 12, 4, 12);
      align-items: center;
      justify-content: space-between;

      i {
        .fontSize(28);
      }

      .option_btn {
        .height(56);
        display: flex;
        align-items: center;
        color: @buttonColor;
        .fontSize(16);
      }

      .input_option_btn_gray {
        color: rgba(76, 76, 76, 1);
      }
    }


    /deep/ .van-cell-group {
      .borderRadius(8, 8, 8, 8);
      overflow: hidden;
    }

    .chatIM_content {
      flex: 1;
      overflow: auto;
      .padding(24, 12, 0, 12);

      .img_box {
        position: absolute;
        right: 12 / 375 * 100vw;
        bottom: 200 / 375 * 100vw;
        .width(66);
        .height(66);
        z-index: 9999;
      }
    }

    .chatIM_input_box {
      justify-content: flex-end;
      width: 100%;
      z-index: 2;
      /*<!--box-shadow:0px -2px 10px 0px rgba(0,0,0,0.05);-->*/

      .chatIM_input_content {
        position: relative;
        min-height: 56px;
        display: flex;
        .padding(4, 12, 4, 12);
        align-items: center;
        justify-content: space-between;

        i {
          .fontSize(28);
        }

        .option_btn {
          .height(56);
          display: flex;
          align-items: center;
          color: @buttonColor;
          .fontSize(16);
        }

        .input_option_btn_gray {
          color: rgba(76, 76, 76, 1);
        }
      }

      .option_box {
        display: flex;
        .padding(8, 0, 8, 0);

        li {
          input {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
          }

          position: relative;
          display: flex;
          flex-direction: column;
          text-align: center;
          align-items: center;
          .margin(0, 0, 12, 31);

          img {
            display: block;
            .width(60);
            .height(60);
            .margin(0, 0, 12, 0);
          }

          span {
            display: inline-block;
            width: 100%;
            text-align: center;
            .height(12);
            .fontSize(14);
            .lineHeight(14);
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
      }

      /deep/ .van-cell-group {
        .borderRadius(8, 8, 8, 8);
        overflow: hidden;
      }
    }

  }

  /*聊天内容样式*/

  /*聊天内容样式*/
  .patient_box {
    display: flex;
    .padding(20, 0, 20, 0);

    & img {
      .width(55);
      .height(55);
      border-radius: 50%;
    }

    & p {
      color: @buttonColor;
      .fontSize(14);
      .lineHeight(14);
      font-weight: 400;
      max-width: 100%;
      word-wrap: break-word;
    }

    .patient_info_l {
      background: @buttonColor;
      color: #fff;
      /*box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);*/
      .padding(9, 12, 9, 12);
      .borderRadius(0, 10, 10, 10);
      .margin(0, 0, 0, 12);
      .lineHeight(20);
    }

    .patient_info_l.withOutBorder {
      background: none;
      /*box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);*/
    }

    .answer_header {
      height: 47px;
      /*background: linear-gradient(297deg, rgba(246, 192, 91, 1) 0%, rgba(233, 140, 46, 1) 100%);*/
      background: url("../../assets/images/assistantBackground.png") no-repeat center;
      background-size: 100% 100%;
      opacity: 0.863000000000001;
      border-radius: 0 10px 0 0;
      color: #fff;
      line-height: 50px;
      text-align: center;
      /*letter-spacing:24px;*/
    }

    .patient_info_l.anwser_box {
      padding: 0 !important;
      background: rgba(255, 255, 255, 1);
      /*box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.3);*/

      .anwser_ul {
        .padding(10, 10, 10, 10);

        li {
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          .fontSize(16);
          .lineHeight(28);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          border-bottom: 1px dashed #f1f1f1;
        }

        .more_btn {
          .padding(10, 0, 0, 0);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          /*height: 40px;*/
          .fontSize(14);
          font-weight: 400;
          color: @mainColor;
          text-align: center;

          /deep/ .van-icon {
            .fontSize(18);
          }

          /*/deep/ .van-icon::before {*/
          /*  width: 20px;*/
          /*  height: 100%;*/
          /*  line-height: 40px;*/
          /*}*/
        }
      }
    }
  }

  .patient_box_r {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .padding(20, 0, 20, 0);

    & img {
      .width(55);
      .height(55);
      border-radius: 50%;
    }

    & p {
      color: @buttonColor;
      font-weight: 400;
      .fontSize(14);
      .lineHeight(14);
      max-width: 100%;
      word-wrap: break-word;
    }

    .patient_info_l {
      background-color: #fff;
      /*box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);*/
      color: @buttonColor;
      .padding(9, 12, 9, 12);
      .borderRadius(10, 0, 10, 10);
      .margin(0, 12, 0, 0);
      .lineHeight(20);
    }

    .patient_info_l.withOutBorder {
      background: none;
      /*box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);*/
    }
  }

  .width68 {
    max-width: 68%;
  }

  .width68.anwser_box68 {
    width: 68%;
  }

  .system_message {
    .padding(10, 0, 10, 0);
    text-align: center;
    .fontSize(14);
    color: rgba(153, 153, 153, 1);
    font-weight: 400;
  }

  .show {
    opacity: 1;
  }

  .none {
    opacity: 0;
  }

  .session_sendTime {
    padding: 10px 0;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: rgba(155, 155, 155, 1) !important;
  }

  .patient_info_l.diseaseMessage_box {
    background: @buttonColor;
    color: #fff;
    .padding(9, 12, 9, 12);
    .borderRadius(0, 10, 0, 0);
    .margin(0, 0, 0, 12);
    .lineHeight(20);
  }
  .read_tip {
    background-color: @backgroundColorff;
    .margin(0, 0, 0, 12);
    .borderRadius(0, 0, 10, 10);
    .padding(5,0,5,0);
    text-align: center;
  }

</style>
