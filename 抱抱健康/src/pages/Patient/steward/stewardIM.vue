/** *@desc 患者客服IM *@author 张松仁 *@date 2019/12/12 10:15:47 */
<template>
  <div class="stewardIM assistantIM_page">
    <common-header
        :share-disabled="true"
        :custom-title="'咨询管理'"
    ></common-header>
    <div class="chatIM_title">
      <van-icon
          name="arrow-left"
          class="back_btn"
          @click.stop="$router.push({ path: '/chatIMList' })"></van-icon>
      <p>
        {{ '健康管家' }}
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
      <div v-for="(item, index) in infoList" :key="index">
        <!--评价-->
        <div>
          <div v-if="item.sendtype === 3">
            <p
              class="session_sendTime system"
            >
              <evaluate @submit="onSubmit" :obj="item" :mark="index"></evaluate>
            </p>
          </div>
        </div>
        <!--文字聊天 -->
        <div>
          <p
            class="session_sendTime"
            v-if="
              item.sendtype === 1 &&
                item.identity === 'assistant' &&
                $chatIMFormatTimeStamp(item.sendTime, index, infoList)
            "
          >
            {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
          </p>
          <div
              class="patient_box"
              v-if="item.sendtype === 1 && item.identity === 'assistant'"
          >
            <div class="stewardIM_head_img">
              <img src="../../../assets/images/stewardIM.png" alt=""/>
            </div>
            <div class="width68">
              <p class="patient_info_l">
                <!--                <span class="assistant_img">-->
                <!--                  <span>{{-->
                <!--                    item.fromuserid == 0 ? "" : item.fromusername-->
                <!--                  }}</span>-->
                <!--                </span>-->
                {{ item.sendmsg }}
              </p>
            </div>
          </div>
        </div>
        <div>
          <p
              class="session_sendTime"
              v-if="
              item.sendtype === 1 &&
                item.identity === 'patient' &&
                $chatIMFormatTimeStamp(item.createtime, index, infoList)
            "
          >
            {{ $chatIMFormatTimeStamp(item.createtime, index, infoList) }}
          </p>
          <div
              class="patient_box_r"
              v-if="item.sendtype === 1 && item.identity === 'patient'"
          >
            <div class="width68">
              <p class="patient_info_l" style="position: relative">
                {{ item.sendmsg }}
              </p>
            </div>

            <div class="stewardIM_head_img">
              <img :src="patientVxHeadUrl"/>
            </div>
          </div>
        </div>
        <!--图片消息-->
        <div>
          <p
              class="session_sendTime"
              v-if="
              item.sendtype === 2 &&
                item.identity === 'assistant' &&
                $chatIMFormatTimeStamp(item.sendTime, index, infoList)
            "
          >
            {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
          </p>
          <div
              class="patient_box"
              v-if="item.sendtype === 2 && item.identity === 'assistant'"
          >
            <div class="stewardIM_head_img">
              <img src="../../../assets/images/stewardIM.png" alt=""/>
            </div>
            <div class="width68">
              <p
                  class="patient_info_l"
                  style="position: relative"
                  @click.stop="checkImg(item.sendmsg)"
              >
                <!--                <span class="assistant_img">-->
                <!--                  <img src="../../../assets/images/stewardIM.png" alt=""/>-->
                <!--                </span>-->

                <img class="sendorReciveImg" :src="item.sendmsg" alt=""/>
              </p>
            </div>
          </div>
        </div>
        <div>
          <p
              class="session_sendTime"
              v-if="
              item.sendtype === 2 &&
                item.identity === 'patient' &&
                $chatIMFormatTimeStamp(item.sendTime, index, infoList)
            "
          >
            {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
          </p>
          <div
              class="patient_box_r"
              v-if="item.sendtype === 2 && item.identity === 'patient'"
          >
            <div class="width68">
              <p class="patient_info_l" style="position: relative">
                <!--                  <span class="arrow_right"></span>-->
                {{ item.sendmsg }}
              </p>
            </div>

            <div>
              <img :src="patientVxHeadUrl"/>
            </div>

          </div>
        </div>
        <!--系统消息-->
        <div>
          <p
              class="session_sendTime system"
              v-if="item.msgType === 11"
              @click.once="initwebsock()"
          >
            {{ item.info }} <span> 点击重连</span>
          </p>
        </div>
      </div>
    </ul>

    <!--    聊天底部-->
    <div class="chatIM_input_box" id="chatIM_input_box" @click.stop="">
      <div class="chatIM_input_content">
        <van-cell-group>
          <van-field
              :autosize="{ maxHeight: 90, minHeight: 34 }"
              v-model.trim="chatValue"
              placeholder="请描述您的问题..."
              type="textarea"
              ref="chatIMInput"
          ></van-field>
        </van-cell-group>
        <van-button type="warning" size="small" @click.stop="sendMessage">
          发送
        </van-button>
      </div>
    </div>
    <van-popup v-model="show" @click="(show = false), (img = null)">
      <img :src="img" alt=""/>
    </van-popup>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import commonHeader from "../../../components/commonHeader/common_header"
  import evaluate from "../../../components/evaluate/evaluate"
  import proto from "@/utils/ServiceIM.proto3_pb"

  export default {
    name: "stewardIM",
    components: {
      commonHeader,
      evaluate
    },
    computed: {
      ...mapState(["PatientIM"]),
      ...mapState(["PatientMessage"])
    },
    watch: {
      chatValue(value) {
        //检测表情
        let reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g
        this.chatValue = value.replace(reg2, "").trim()
      }
    },
    data() {
      return {
        isLoading: false, // 下拉查询历史聊天记录
        chatValue: "", // 聊天内容
        //websock初始变量值
        websock: null, //-websock服务支持
        infoList: [], // 聊天内容
        openId: "",
        fromUserId: "", // 发送人id(自己的),
        fromUserName: "", //发送人name(自己的)
        patientVxHeadUrl: "", // 患者头像
        hidden: true,
        scrollTop: 0,
        UserLogin: new proto.UserLogin(), //用户登录
        UserLoginReponse: new proto.UserLoginReponse(), //用户登录-返回值
        SendMsg: null, //发送消息实体
        SendMsgResponse: new proto.SendMsgResponse(), //发送消息回复
        ReceiveMsgResponse: new proto.ReceiveMsgResponse(), //接收消息回复
        show: false, //放大图片
        img: null, //放大的图片
        isSend: false, //sock是否连接
        sendObj: {}, //发送的消息
        serviceEvaluationId: 0, //服务评价记录Id
        evaluate: 1, //评价分数
      }
    },
    methods: {
      /**
       * 点击确认提交事件**/
      onSubmit(value) {
        console.log('当前值：', value);
        this.$http
          .request({
            method: "post",
            url: "/SServiceEvaluationController/evaluateRecord",
            body: {
              id: value.evaluationId,
              status: value.status
            }
          })
          .then(res => {
            console.log(res);
            //成功后更改当前评价的状态
            if (res.data.success) {
              this.infoList[value.mark].status = value.status;
              this.infoList[value.mark].evaluationId = value.evaluationId;
            } else {
              this.$toast(res.data.message);
            }

          })
          .catch(e => {
            this.$toast(e);
            console.log(e)
          })
      },
      /**
       * 点击更改评分事件**/
      onChange(value) {
        console.log('当前值：' + value);
        let that = this;
        switch (value) {
          case 1:
            that.evaObj.title = "非常不满意";
            that.evaObj.color = "#FF3000";
            break;
          case 2:
            that.evaObj.title = "不满意";
            that.evaObj.color = "#FF3000";
            break;
          case 3:
            that.evaObj.title = "一般";
            that.evaObj.color = "#00CB5F";
            break;
          case 4:
            that.evaObj.title = "满意";
            that.evaObj.color = "#0069FF";
            break;
          default:
            that.evaObj.title = "非常满意";
            that.evaObj.color = "#0069FF";
        }
      },
      /**
       * 查询历史聊天记录,全部查询
       * 下拉再次加载10条**/
      getHistoryInfoList(item) {
        return new Promise((resolve, rejected) => {
          this.$http
            .request({
              method: "get",
              url: "/SMessageController/selectHistoryByClientId",
              body: {
                clientId: this.fromUserId
              }
            })
            .then(res => {
              this.isLoading = false
              if (res.data.success) {
                let infoListData = JSON.parse(JSON.stringify(res.data.data))
                infoListData &&
                infoListData.forEach(item => {
                  let time = Date.parse(
                    new Date(item.createtime.replace(/-/g, "/"))
                  )
                  item.createtime = time
                  item.sendTime = time
                  if (item.fromuserid === this.fromUserId) {
                    item.identity = "patient"
                  } else {
                    item.identity = "assistant"
                  }
                })
                console.log("查到的历史聊天记录")
                console.log(infoListData)
                this.infoList = this.infoList.length
                  ? infoListData.concat(this.infoList)
                  : infoListData
                console.log(this.infoList)
                if (!item) {
                  this.getChatContentView()
                }
                resolve(res)
              } else {
                rejected(res)
                console.log("查询历史聊天记录接口报错")
              }
            })
            .catch(e => {
              this.isLoading = false
              console.log(e)
            })
        })
      },

      /**
       * 点击预览图片**/
      checkImg(img) {
        this.img = img
        this.show = true
      },

      /**
       * 发送消息**/
      sendMessage() {
        console.log("发送消息的时间", new Date())
        if ((this.websock && this.websock.readyState != 1) || !this.isSend) {
          this.$toast("当前未连接到客服,请点击重连")
          return
        }
        this.SendMsg = new proto.SendMsg()
        let _this = this
        let obj = {}
        let buff
        let uuid = this.$uuid()
        if (this.chatValue) {
          obj.clientuuid = uuid
          obj.fromuserid = _this.fromUserId
          obj.fromusername = _this.fromUserName
          obj.sendmsg = _this.chatValue
          obj.identity = "patient"
          obj.createtime = new Date().getTime()
          obj.sendTime = obj.createtime
          obj.sendtype = 1
          obj.direction = 1
          obj.msgType = 8
          obj.status = 0
          obj.evaluationId = _this.serviceEvaluationId
          //发送聊天消息
          let ServiceMsg = this.ServiceMsgClass()
          //设置ServiceMsg实例类型
          ServiceMsg.setMsgtype(obj.msgType) //消息
          //向SendMsg实例添加内容
          this.SendMsg.setClientuuid(obj.clientuuid)
          this.SendMsg.setFromuserid(obj.fromuserid)
          this.SendMsg.setFromusername(obj.fromusername)
          this.SendMsg.setSendmsg(obj.sendmsg)
          this.SendMsg.setSendtype(obj.sendtype)
          this.SendMsg.setDirection(obj.direction)
          this.SendMsg.setWxheadurl(_this.patientVxHeadUrl)
          this.SendMsg.setWxheadurl(_this.patientVxHeadUrl)
          this.SendMsg.setServiceevaluationid(obj.evaluationId)
          //设置ServiceMsg实例的setUserlogin信息
          ServiceMsg.setSendmsg(this.SendMsg)
          console.log("发送的消息", ServiceMsg, obj)
          //对ServiceMsg进行实例化
          let buff = ServiceMsg.serializeBinary()
          //通过websock发送登录信息
          _this.websock.send(buff.buffer)
          if (obj.msgType == 8) this.infoList.push(obj)
          _this.chatValue = ""
          _this.SendMsg = null
          _this.getChatContentView()
        }
      },

      /**
       * 聊天内容滚动到可视区**/
      getChatContentView() {
        let _this = this
        try {
          this.$nextTick(() => {
            setTimeout(function () {
              if (_this.$refs.chatContentBox) {
                _this.$refs.chatContentBox.scrollTop =
                  _this.$refs.chatContentBox.scrollHeight
              }
              _this.hidden = false
            }, 100)
          })
        } catch (e) {
          console.log(e)
        }
      },

      /**
       * 初始化websock**/
      initwebsock() {
        let socketUrl =
          this.$globalServiceHost.stewardServiceHost.replace("https", "wss") +
          "/jkgj"
        console.log(socketUrl, "重连socket")
        this.websock = new WebSocket(socketUrl)
        this.websock.binaryType = "arraybuffer"
        this.websock.onopen = this.websockonopen
        this.websock.onmessage = this.websockonmessage
        this.websock.onerror = this.websockonerror
        this.websock.onclose = this.websockclose
        // window.onbeforeunload = this.onbeforeunload;

      },

      /**
       * 创建ServiceMsg实例**/
      ServiceMsgClass() {
        //创建ServiceMsg实体
        let ServiceMsg = new proto.ServiceMsg()
        // console.log(ServiceMsg);
        return ServiceMsg
      },

      /**
       * 对后台传值进行反序列化**/
      ServiceMsgDeserialization(data) {
        let _this = this
        //对后台传值进行反序列化
        let jsonObj = {}
        let obj = proto.ServiceMsg.deserializeBinary(data.data)
        let msgType = obj.getMsgtype()
        jsonObj.msgType = msgType
        switch (msgType) {
          //判断消息类型
          case 1:
            //用户登录返回值
            try {
              let objData = obj.getUserloginreponse()
              jsonObj.openId = objData.getOpenid()
              jsonObj.userid = objData.getUserid()
              jsonObj.username = objData.getUsername()
              jsonObj.servername = objData.getServername()
              jsonObj.success = objData.getSuccess()
              jsonObj.serviceEvaluationId = objData.getServiceevaluationid();
              jsonObj.info = objData.getInfo()
            } catch (e) {
              console.log(e)
            }
            break
          case 8:
            //收客服发送消息
            try {
              let objData = obj.getSendmsg()
              jsonObj.id = objData.getId()
              jsonObj.clientuuid = objData.getClientuuid()
              jsonObj.fromuserid = objData.getFromuserid()
              jsonObj.fromusername = objData.getFromusername()
              jsonObj.touserid = objData.getTouserid()
              jsonObj.tousername = objData.getTousername()
              jsonObj.evaluationId = objData.getServiceevaluationid() || _this.serviceEvaluationId;
              jsonObj.sendmsg = objData.getSendmsg()
              jsonObj.status = 0
              let time = objData.getCreatetime()
              // let time = Date.parse(new Date(objData.getCreatetime()));
              jsonObj.createtime = time * 1000
              jsonObj.sendTime = jsonObj.createtime
              if (jsonObj.fromuserid === _this.fromUserId) {
                jsonObj.identity = "patient"
              } else {
                jsonObj.identity = "assistant"
              }
              jsonObj.sendtype = objData.getSendtype()
              jsonObj.direction = objData.getDirection()
              jsonObj.received = 0
              jsonObj.wxheadurl = objData.getWxheadurl()
            } catch (e) {
              console.log(e)
            }
            //向后台发送接收通知
            this.msgReceipt(jsonObj.id)
            break
          case 9:
            //发送消息回复
            try {
              let objData = obj.getSendmsgresponse()
              jsonObj.id = objData.getId()
              jsonObj.clientUUId = objData.getClientuuid()
              jsonObj.userId = objData.getUserid()
              jsonObj.createTime = objData.getCreatetime()
              jsonObj.status = objData.getStatus()
            } catch (e) {
              console.log(e)
            }
            break
          case 11:
            _this.isSend = false //设置客服掉线
            //客服掉线
            try {
              let objData = obj.getServeroffline()
              console.log(objData);
              console.log(objData.getType());
              jsonObj.info = objData.getInfo()
              jsonObj.sendTime = new Date().getTime()
              jsonObj.evaluationId = _this.serviceEvaluationId
              jsonObj.type = objData.getType()
              jsonObj.createtime = jsonObj.sendTime
            } catch (e) {
              console.log(e)
            }
            // _this.websock.onclose();
            break
          default:
            //其他的类型protobuff未定义无法处理
            _this.$toast("接收消息未定义")
        }
        //告诉后台收到消息
        return jsonObj
      },

      /**
       * 告诉服务端收到消息了**/
      msgReceipt(id) {
        //发送收到消息
        let ServiceMsg = this.ServiceMsgClass()
        //设置ServiceMsg实例类型
        ServiceMsg.setMsgtype(10) //用户收到消息
        //向ReceiveMsgResponse实例设置id
        this.ReceiveMsgResponse.setId(id.toString())
        //设置ServiceMsg实例的setReceivemsgresponse信息
        ServiceMsg.setReceivemsgresponse(this.ReceiveMsgResponse)
        let buff = ServiceMsg.serializeBinary()
        console.log("向服务端发送接收到消息了", ServiceMsg)
        //通过websock发送登录信息
        this.websock.send(buff.buffer)
      },

      /**
       * websock success**/
      websockonopen() {
        this.isSend = true
        console.log("socket连接成功")
        //发送登录信息
        let ServiceMsg = this.ServiceMsgClass()
        //设置ServiceMsg实例类型
        ServiceMsg.setMsgtype(0) //用户登录
        //向UserLogin实例添加openId
        this.UserLogin.setOpenid(this.openId.toString())
        //设置ServiceMsg实例的setUserlogin信息
        ServiceMsg.setUserlogin(this.UserLogin)
        // console.log("用户登录信息", ServiceMsg);
        //对ServiceMsg进行实例化
        let buff = ServiceMsg.serializeBinary()
        // console.log(buff.buffer);
        //通过websock发送登录信息
        this.websock.send(buff.buffer)
      },

      /**
       * websock receive
       * 接收到消息后处理**/
      websockonmessage(e) {
        console.log("接收到的消息", e);
        let _this = this
        //对后台推送的消息反序列化
        let data = this.ServiceMsgDeserialization(e)
        //获取推送的消息类型
        console.log("接收到的消息反序列化====", data)
        //将接收消息放到infoList里
        if (data.msgType == 8 || data.msgType == 11) {
          //客服发送消息及被踢掉线
          _this.infoList.push(data)
          console.log(_this.infoList)
        } else if (data.msgType == 1) {
          //登录返回的
          _this.fromUserId = data.userid
          _this.serviceEvaluationId = data.serviceEvaluationId
          // this.$toast("连接成功");
        } else if (data.msgType == 9) {
          //发送消息回复
        }
        console.log(_this.infoList);
        //滚动到可视区域
        _this.getChatContentView()
      },

      /**
       * websock fail**/
      websockonerror() {
        console.log("websock连接失败")
      },

      /**
       * websock close**/
      websockclose(e) {
        console.log("断开连接", console.log(new Date()))
        console.log(e)
        if (
          this.websock &&
          this.websock.readyState != 1 &&
          (e != undefined && e.code == 1006)
        ) {
          let obj = {
            msgType: 11,
            info: "连接客服失败",
            sendTime: "",
            createtime: ""
          }
          obj.sendTime = new Date().getTime()
          obj.createtime = obj.sendTime
          if (this.isSend != false) this.infoList.push(obj)
          this.getChatContentView()
        }
        // try {
        //   this.websock.close();
        // } catch (e) {
        //   console.log(e);
        // }
      },

      /**
       * Browser close**/
      onbeforeunload() {
        // this.websock.onclose();
      },

      onVisibilityChange() {
        // document.addEventListener("visibilitychange", this.handleOffScreen);
      },

      /**
       * 手机熄屏处理**/
      handleOffScreen() {
        if (this.websock.readyState === 3) {
          console.log("websock已断开，正重新连接")
          this.websock = null
          this.initwebsock()
        }
      }
    },

    created() {
      this.fromUserName = this.PatientIM.patientMessage.name
      console.log(this.PatientIM)
      this.openId = this.PatientIM.patientMessage.opendId
      console.log(this.PatientIM.patientMessage)
      this.fromUserId = this.PatientIM.patientMessage.ruserid
      this.patientVxHeadUrl = this.PatientIM.patientMessage.vxheadurl
      this.onVisibilityChange()
      let getHistoryInfoListPromise = null
      getHistoryInfoListPromise = this.getHistoryInfoList()
      console.log("返回的历史聊天记录")
      Promise.all([getHistoryInfoListPromise]).then(() => {
        this.initwebsock()
        console.log("初始化websock")
      })
      this.getChatContentView()
    },
    beforeDestroy() {
      if (this.websock) {
        this.websock.close()
      }
      // document.removeEventListener("visibilitychange", this.handleOffScreen);
    }
  }
</script>

<style scoped lang="less">
  .assistantIM_page {
    /deep/ .van-popup {
      background-color: rgba(0,0,0,0);
      img {
        width: 100%;
      }
    }

    /deep/ .van-field--min-height .van-field__control {
      min-height: 34px;
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
      .height(34);
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
      /*<!--box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.05);-->*/

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

    .stewardIM_head_img img {
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
      .sendorReciveImg {
        display: block;
        width: auto;
        height: auto;
        max-width: 150px;
        max-height: 150px;
        .borderRadius(5, 5, 5, 5);
      }
    }

    .patient_info_l.withOutBorder {
      background: none;
      /*box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);*/
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

    .stewardIM_head_img img {
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
      .sendorReciveImg {
        display: block;
        width: auto;
        height: auto;
        max-width: 150px;
        max-height: 150px;
        .borderRadius(5, 5, 5, 5);
      }
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

    span {
      color: @mainColor;
      border-bottom: 1px solid @mainColor;
    }
  }

</style>
