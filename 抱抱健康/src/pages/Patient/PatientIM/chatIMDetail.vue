/** *@desc 患者IM详情页 *@author houpai *@date 2019/07/18 11:58:55 */
<template>
  <div class="chatIMDetail_page" id="chatIMDetail_page">
    <common-header :share-disabled="true"
                   :custom-title="'聊天详情'">
    </common-header>
    <!--    聊天头部-->
    <div class="chatIM_title">
      <van-icon name="arrow-left"
                class="back_btn"
                @click.stop="$router.push({ path: '/chatIMList' })"></van-icon>
      <p>
        {{ sessionName }}
        <span class="consulting-text"
              v-if="isPayConsulting">
          付费咨询中…
        </span>
      </p>
      <div class="doctor_bar right_btn" @click.stop="routerLink('chatIMSettings')">
        {{sessionType == 1 ? "详情" : "医讯"}}
      </div>
    </div>
    <!--    聊天内容-->
    <ul class="chatIM_content"
        :class="[{'none':hidden,'show':!hidden}]"
        ref="chatContentBox"
        @click.stop="showOption = false">
      <van-pull-refresh v-model="isLoading"
                        @refresh="onRefresh"
                        class="pullRefresh">
        <div v-for="(item, index) in infoList" :key="index">
          <!--          文字聊天 -->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 2 && item.identity === 'doctor' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 2 && item.identity === 'doctor'">
              <div>
                <img :src="item.vxheadurl"
                     alt=""
                     @click.stop="seeDoctorDetail(item.fromUserId)"/>
              </div>
              <div class="width68">
                <div class="identity_box_l" v-if="sessionType == 1">
                  <span class="identity_span">{{item.identityValue || ""}}</span>
                  <span class="name_span">{{item.nameValue || ""}}</span>
                </div>
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

          <!--          图片聊天-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 3 && item.identity === 'doctor' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 3 && item.identity === 'doctor'">
              <div>
                <img :src="item.vxheadurl" alt=""
                     @click.stop="seeDoctorDetail(item.fromUserId)"/>
              </div>
              <div class="width68">
                <div class="identity_box_l" v-if="sessionType == 1">
                  <span class="identity_span">{{item.identityValue || ""}}</span>
                  <span class="name_span">{{item.nameValue || ""}}</span>
                </div>
                <p
                    :class="[{'padding0':item.type === 3}]"
                    class="patient_info_l withOutBorder"
                    style="position: relative"
                    @click.stop="checkImg(item.content)"
                >
                  <img :src="item.content" alt="" class="sendorReciveImg"/>
                  <!--                  -->
                </p>
              </div>
            </div>
          </div>
          <div>
            <p class="session_sendTime"
               v-if="item.type === 3 && item.identity === 'patient' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box_r"
                 v-if="item.type === 3 && item.identity === 'patient'">
              <div class="width68">
                <p class="patient_info_l withOutBorder"
                   :class="[{'padding0':item.type === 3}]"
                   style="position: relative"
                   @click.stop="checkImg(item.content)">
                  <img :src="item.content" alt="" class="sendorReciveImg"/>
                </p>
              </div>
              <div>
                <img @click.stop="routerLink('patientMessageComplete', item)"
                     :src="patientVxHeadUrl"/>
              </div>
            </div>
          </div>

          <!--        新任务-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 5 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 5">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="patient_task_box flex_column"
                   @click.stop="getDetailViewByChatType(item)"
                   style="position: relative">
                <h3>
                  <div><i class="iconfont iconrenwu"></i></div>
                  提醒您有新任务
                </h3>
                <div class="task_btn">
                  查看任务
                </div>
              </div>
            </div>
          </div>

          <!--        医生发表问文章-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 6 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 6">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="patient_article_box"
                   @click.stop="getDetailViewByChatType(item)"
                   style="position: relative">
                <div class="article_message">
                  {{ item.content.title || "" }}
                </div>
                <div class="article_img">
                  <img :src="item.content.logourl" alt=""/>
                </div>
              </div>
            </div>
          </div>

          <!--        医生咨询回复-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 8 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box doctor_response"
                 v-if="item.type === 8">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="patient_task_box"
                   @click.stop="getDetailViewByChatType(item)"
                   style="position: relative">
                <h3>我已经解答了你的问题</h3>
                <div class="task_btn">
                  查看回复
                </div>
              </div>
            </div>
          </div>

          <!--        患者问卷回复-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 9 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box_r patient_response"
                 v-if="item.type === 9">
              <div class="patient_task_box"
                   @click.stop="getDetailViewByChatType(item)"
                   style="position: relative">
                <h3 style="text-align: left">
                  医生您好,我已经将我的情况如实反馈
                </h3>
                <div class="task_btn">
                  调查问卷反馈
                </div>
              </div>
              <div>
                <img @click.stop="routerLink('patientMessageComplete', item)"
                     :src="patientVxHeadUrl" alt=""/>
              </div>
            </div>
          </div>

          <!--        患者咨询-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 7 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box_r patient_response"
                 v-if="item.type === 7">
              <div class="patient_task_box"
                   @click.stop="getDetailViewByChatType(item)"
                   style="position: relative">
                <h4>
                  医生您好,希望得到您的解答和帮助
                  <span class="zixun_price">
                    <i class="iconfont iconlingdang"></i>
                    {{ item.content ? "¥" + (item.content.tarrif / 100).toFixed(2) : "" }}
                  </span>
                </h4>
                <div class="task_btn" style="position: relative">
                  付费咨询
                  <i></i>
                </div>
              </div>
              <div>
                <img @click.stop="routerLink('patientMessageComplete', item)"
                     :src="patientVxHeadUrl" alt=""/>
              </div>
            </div>
          </div>

          <!--          语音发送与回复-->
          <div>
            <p class="session_sendTime"
               v-if=" item.type === 4 && item.identity === 'doctor' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 4 && item.identity === 'doctor'">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="width68"
                   @click.stop="playWXvoice(item.content, item)">
                <div class="identity_box_l" v-if="sessionType == 1">
                  <span class="identity_span">
                    {{item.identityValue || ""}}
                  </span>
                  <span class="name_span">
                    {{item.nameValue || ""}}
                  </span>
                </div>
                <p class="patient_info_l" style="position: relative">
                  <span class="voice_play_btn">
                    <img class="playRadio"
                         v-if="item.audioPlay"
                         :src="playRight"
                         alt/>
                    <i class="iconyuyinzuo iconfont" v-else></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <p class="session_sendTime"
               v-if="item.type === 4 && item.identity === 'patient' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box_r"
                 v-if="item.type === 4 && item.identity === 'patient'">
              <div class="width68"
                   @click.stop="playWXvoice(item.content, item)">
                <p class="patient_info_l" style="position: relative">
                  <span class="voice_play_btn" style="text-align: right">
                    <i v-if="!item.audioPlay" class="iconyuyinyou iconfont"></i>
                    <img v-else class="playRadio" :src="playLeft" alt/>
                  </span>
                </p>
              </div>
              <div>
                <img @click.stop="routerLink('patientMessageComplete', item)"
                     :src="patientVxHeadUrl"/>
              </div>
            </div>
          </div>

          <!--        医生推荐产品-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 11 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 11">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="patient_task_box flex_column"
                   @click.stop="getDetailViewByChatType(item)"
                   style="position: relative">
                <h3>
                  <div class="LinkBox_img">
                    <img src="../../../assets/images/productIcon.png" alt="">
                  </div>
                  您有新的产品订单
                </h3>
                <div class="task_btn">
                  点击查看
                </div>
              </div>
            </div>
          </div>

          <!--          系统消息-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 10 && item.identity === 'system' && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <p v-if="item.type === 10 && item.identity === 'system'"
               class="system_message">
              {{ item.content }}
            </p>
          </div>

          <!-- 系统消息  付费咨询提示框 -->
          <div class="pay-tips-msg"
               @click.stop="payAdvisory(item)"
               v-if="item.type === 14 || item.type === 15 || item.type === 16">
            <p class="session_sendTime"
               v-if="$chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="pay-tips-box">
              <div class="top"
                   v-if="item.type === 14">
                医生已为您免费服务一段时间，请您付费后继续咨询。
              </div>
              <div class="top"
                   v-if="item.type === 15">
                咨询费用已成功支付。
              </div>
              <div class="top"
                   v-if="item.type === 16">
                医生未及时回复付费咨询，已支付费用已原路退回。
              </div>
              <div class="bottom">
                <span v-if="item.type === 14"><span>点击支付</span>¥{{(item.content.tarrif / 100).toFixed(2) || ""}}</span>
                <span v-else>¥{{(item.content.tarrif / 100).toFixed(2) || ""}}</span>
              </div>
            </div>
          </div>

          <!--          医生给患者做的营养筛查报告-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 18 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 18">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="patient_task_box flex_column"
                   @click.stop="SeeScreeningresult(item)"
                   style="position: relative">
                <h3>
                  <div class="LinkBox_img">
                    <img src="../../../assets/images/shaicha_icon.png" alt="">
                  </div>
                  您的营养风险筛查报告
                </h3>
                <div class="task_btn">
                  点击详情
                </div>
              </div>
            </div>
          </div>

          <!--        患者做的营养筛查报告-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 19 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box_r patient_response"
                 v-if="item.type === 19">
              <div class="patient_task_box flex_column"
                   @click.stop="SeeScreeningresult(item)"
                   style="position: relative">
                <h3>
                  <div class="LinkBox_img">
                    <img src="../../../assets/images/shaicha_icon.png" alt="">
                  </div>
                  我的营养风险筛查报告
                </h3>
                <div class="task_btn">
                  查看详情
                </div>
              </div>
              <div>
                <img @click.stop="routerLink('patientMessageComplete', item)"
                     :src="patientVxHeadUrl" alt=""/>
              </div>
            </div>
          </div>

          <!--          医生给患者定制的营养方案-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 17 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 17">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="patient_task_box flex_column"
                   @click.stop="goSubmitOrder(item.content)"
                   style="position: relative">
                <h3>
                  <div class="LinkBox_img">
                    <img src="../../../assets/images/shaicha_complete_icon.png" alt="">
                  </div>
                  您有新的产品订单
                </h3>
                <div class="task_btn">
                  点击详情
                </div>
              </div>
            </div>
          </div>

          <!--          医生发给患者的复诊通知-->
          <div>
            <p class="session_sendTime"
               v-if="item.type === 20 && $chatIMFormatTimeStamp(item.sendTime, index, infoList)">
              {{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}
            </p>
            <div class="patient_box"
                 v-if="item.type === 20">
              <div>
                <img @click.stop="seeDoctorDetail(item.fromUserId)"
                     :src="item.vxheadurl" alt=""/>
              </div>
              <div class="patient_task_box flex_column"
                   @click.stop="seeReturnVisitPDetail(item.content)"
                   style="position: relative">
                <h3>
                  <div class="LinkBox_img">
                    <img src="../../../assets/images/icon-im-fuzhen-hint.png" alt="">
                  </div>
                  复诊通知
                </h3>
                <div class="task_btn">
                  查看通知详情
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="withBottomPadding" v-if="consultFeedbackShow"></div>
      </van-pull-refresh>

      <!--客服聊天浮框-->
      <go-steward @goSteward="goSteward"></go-steward>
      <!--客服聊天浮框end-->
    </ul>
    <!--    聊天底部-->
    <div class="chatIM_input_box"
         id="chatIM_input_box"
         @click.stop="">
      <div class="chatIM_input_content">
        <img class="img"
             v-if="!sendVoice"
             @click.stop="sendVoice = !sendVoice"
             src="../../../assets/images/icon_yuyin.png"
             alt=""/>
        <img class="img"
             v-else
             @click.stop="sendVoice = !sendVoice"
             src="../../../assets/images/icon_wenzi.png"
             alt=""/>
        <van-cell-group>
          <van-field v-model="chatValue"
                     type="textarea"
                     :autosize="{ maxHeight: 90, minHeight: 34 }"
                     v-if="!sendVoice"
                     ref="chatIMInput"
                     @focus="focusEvent"
                     @blur="blurEvent"></van-field>
          <div class="sendDiv"
               v-else
               @touchstart="onTouchstart"
               @touchmove="onTouchmove"
               @touchend="onTouchend">
            {{ sendVoiceTip }}
          </div>
        </van-cell-group>
        <div class="option_btn"
             v-if="chatValue"
             @click.stop="sendMessage">
          发送
        </div>
        <div v-else
             class="option_btn"
             @click.stop="showOption = !showOption">
          更多
        </div>
      </div>
      <transition name="slide-fade" style="display:none">
        <ul v-if="showOption" class="option_box">
          <li>
            <img src="../../../assets/images/photoPick.png" alt=""/>
            <span>图片</span>
            <input type="file" accept="image/*" @change="imgSubmit"/>
          </li>
          <li @click.stop="goScreening" v-if="sessionType==0">
            <img src="../../../assets/images/shaicha_bar.png" alt=""/>
            <span>营养筛查</span>
          </li>
          <li @click.stop="nutritionRecommendation" v-if="sessionType==0">
            <img src="../../../assets/images/yingyangtuijian_bar.png" alt=""/>
            <span>营养推荐</span>
          </li>
          <li @click.stop="goReturnVisitP" v-if="sessionType==0">
            <img src="../../../assets/images/icon-im-fuzhen.png" alt=""/>
            <span>复诊通知</span>
          </li>
        </ul>
      </transition>
    </div>
    <!--    患者付费咨询反馈-->
    <consult-feedback
        v-if="consultFeedbackShow"
        :payConsultParams="payConsultParams"
        @closeConsultFeedback="closeConsultFeedback"
        @submitConsultFeedback="submitConsultFeedback">
    </consult-feedback>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import goSteward from "./goSteward";
  import consultFeedback from "./consultFeedback";
  import Vue from "vue";
  import {ImagePreview, Toast} from "vant";
  import {mapState} from "vuex";
  import playLeft from "../../../assets/images/IMplayRight.gif";
  import playRight from "../../../assets/images/playLeft.gif";
  import stewardIM from "../steward/stewardIM";
  import Exif from "exif-js";

  Vue.use(ImagePreview);
  export default {
    name: "chatIMDetail",
    components: {
      commonHeader,
      goSteward,
      consultFeedback
    },
    data() {
      return {
        chatValue: "", // 聊天内容
        showOption: false, //  是否显示聊天菜单
        //websock初始变量值
        websock: null, //-websock服务支持
        timeout: 10 * 1000, //-30秒一次心跳
        timeoutObj: null, //-心跳心跳倒计时
        serverTimeoutObj: null, //-心跳倒计时
        rest: "", //-存入返回的各种信息
        supported: "", //-连接情况显示
        ReconnectState: false, //-断线重连状态
        timeoutReconnect: null, //-断开重连倒计时
        infoList: [], // 聊天内容
        fromUserId: "", // 发送人id,
        sessionId: "", // 会话id，
        isLoading: false, // 下拉刷新聊天记录,
        sessionType: "", // 会话类型 0 单聊 1 群聊
        doctorId: "", // 医生id
        hiddenTime: "",
        patientChatList: [], // 患者聊天列表
        sessionName: "", // 聊天名,
        patientVxHeadUrl: "", // 患者头像
        startTime: "", // 发送语音开始时间,用于判断时间过短阻止发送语音
        endTime: "", // 发送语音开始时间,用于判断时间过短阻止发送语音
        pageY: "", // 上滑取消发送语音
        sendToggle: false, // 是否发送
        sendVoice: false, // 发送语音还是文字
        sendVoiceTip: "按住 说话", // 发送语音提示
        isPlay: false,
        playLeft: playLeft, //录音播放的gif图
        playRight: playRight, //录音播放的gif图
        hidden: true,
        scrollTop: 0,
        ToastRequest: "",
        isPayConsulting: false, // 是否是付费咨询状态
        consultFeedbackShow: false, // 是否付费咨询反馈状态
        payConsultParams: {}
      };
    },
    computed: {
      ...mapState(["PatientIM"]),
      ...mapState(["PatientMessage"])
    },
    watch: {
      sendVoice: function () {
        if (!this.sendVoice) {
          this.$nextTick(() => {
            this.$refs.chatIMInput.focus();
          });
        }
      },
      chatValue(value) {
        //检测表情
        let reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
        this.chatValue = value.replace(reg2, "").trim();
      },
      consultFeedbackShow(val) {
        if (val) {
          this.showOption = false;
        }
      }
    },
    methods: {
      goSteward() {
        //跳转到客服页
        this.$router.push({name: "stewardIM"});
      },
      blurEvent() {
        document.scrollingElement.scrollTo(0, this.scrollTop);
      },
      focusEvent() {
        this.showOption = false;
        this.getChatContentView();
      },
      /**
       * 点击预览图片**/
      checkImg(img) {
        ImagePreview([img]);
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
      onVisibilityChange() {
        document.addEventListener("visibilitychange", this.handleOffScreen);
      },
      /**
       * 初始化websock**/
      initwebsock() {
        if (typeof WebSocket != "undefined") {
          this.supported = "支持 websock";
        } else {
          this.supported = "不支持即时聊天";
        }
        let socketUrl = this.$globalServiceHost.fullServiceHost.replace("https", "wss") + "/websocket";
        this.websock = new WebSocket(socketUrl);
        //--连接成功
        this.websock.onopen = this.websockonopen;
        //--收到消息的回调
        this.websock.onmessage = this.websockonmessage;
        //--连接错误
        this.websock.onerror = this.websockonerror;
        //--连接关闭的回调
        this.websock.onclose = this.websockclose;
        //--浏览器关闭
        //--监听窗口关闭事件，当窗口关闭时，主动去关闭websock连接，防止连接还没断开就关闭窗口，server端会抛异常。
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
       * 处理未读消息缓存
       * **/
      handleUnreadMessage() {
        let chatListVuex = JSON.parse(
          JSON.stringify(this.PatientIM.chatListVuex)
        );
        let matchingResults = this.$hasValueFromArray(
          chatListVuex,
          "sessionId",
          this.sessionId
        );
        if (matchingResults.value) {
          chatListVuex[matchingResults.index].unReadMessageCount = 0;
          chatListVuex[matchingResults.index].msgId.length = 0;
          this.$store.commit("PatientIM/chatListVuex", chatListVuex);
        }
      },


      /**
       * websock receive,接收到消息后发送回文代表已读
       * v1.9.10新增sokect指令(特殊类型) 不同步聊天记录
       * **/
      websockonmessage(e) {
        let _this = this;
        let data = JSON.parse(e.data);
        if (data.type === 4) {
          data.audioPlay = false;
        }
        console.log("接收到的消息和消息类型====", data, data.type);
        if (data.sessionId === this.sessionId) {
          if (data && data.fromUserId) {
            this.patientChatList.forEach((item, i) => {
              if (data.fromUserId === item.userid) {
                data.vxheadurl = item.vxheadurl;
                data.identityValue = item.type === 1 ? "医生" : "";
                data.nameValue = item.username;
              }
            });
          }
          switch (data.type) {
            // 患者咨询类型(改为后端推送)
            case 7:
              this.infoList.push({
                ...data,
                identity: "patient"
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            // 患者调查问卷类型(后端推送)
            case 9:
              this.infoList.push({
                ...data,
                identity: "patient"
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            // 系统消息(后端推送)
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
            // 医生推荐的产品 type暂定11 待修改
            case 11:
              this.infoList.push({
                ...data,
                identity: "doctor"
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            // 付费提醒
            case 14:
              this.infoList.push({
                ...data
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            // 付费成功提醒
            case 15:
              this.isPayConsulting = true;
              this.infoList.push({
                ...data
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            // 付费咨询退费提醒
            case 16:
              this.infoList.push({
                ...data
              });
              this.websock.send(
                JSON.stringify({
                  msgId: data.msgId,
                  type: 8000 + data.type,
                  status: 0
                })
              );
              break;
            case 101:
              this.payConsultParams = data;
              this.consultFeedbackShow = true;
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
                identity: "doctor"
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
            switch (data.type) {
              // 文字
              case 2:
                chatListVuex[matchingResults.index].unReadMessage = data.content;
                break;
              case 3:
                chatListVuex[matchingResults.index].unReadMessage = "[图片]";
                break;
              case 4:
                chatListVuex[matchingResults.index].unReadMessage = "[语音]";
                break;
              case 5:
                chatListVuex[matchingResults.index].unReadMessage = "[任务]";
                break;
              case 6:
                chatListVuex[matchingResults.index].unReadMessage = "[文章]";
                break;
              case 7:
                chatListVuex[matchingResults.index].unReadMessage = "[咨询]";
                break;
              case 8:
                chatListVuex[matchingResults.index].unReadMessage = "[医生回答了你的问题]";
                break;
              case 9:
                chatListVuex[matchingResults.index].unReadMessage = "[调查问卷]";
                break;
              case 10:
                chatListVuex[matchingResults.index].unReadMessage = data.content;
                break;
              case 11:
                chatListVuex[matchingResults.index].unReadMessage = "[您有新的产品订单]";
                break;
              case 14:
                chatListVuex[matchingResults.index].unReadMessage = "[付费咨询]待支付";
                break;
              case 15:
                chatListVuex[matchingResults.index].unReadMessage = "[付费咨询]已支付";
                break;
              case 16:
                chatListVuex[matchingResults.index].unReadMessage = "[付费咨询]已退款";
                break;
              case 17:
                chatListVuex[matchingResults.index].unReadMessage = "[营养方案]已生成";
                break;
              case 18:
                chatListVuex[matchingResults.index].unReadMessage = "[营养筛查报告]已生成";
                break;
              case 19:
                chatListVuex[matchingResults.index].unReadMessage = "[营养筛查报告]已生成";
                break;
              case 20:
                chatListVuex[matchingResults.index].unReadMessage = "[待复诊通知]";
                break;
              case 101:
                chatListVuex[matchingResults.index].unReadMessage = "[付费咨询]待反馈";
                break;
              default:
              // 此处指令类型不需要同步vuex聊天记录
              // chatListVuex[matchingResults.index].unReadMessage = data.content;
            }
          } else {
            let obj = {};
            let ary = [];
            ary.push(data.msgId);
            obj.sessionId = data.sessionId;
            switch (data.type) {
              // 文字
              case 2:
                obj.unReadMessage = data.content;
                break;
              case 3:
                obj.unReadMessage = "[图片]";
                break;
              case 4:
                obj.unReadMessage = "[语音]";
                break;
              case 5:
                obj.unReadMessage = "[任务]";
                break;
              case 6:
                obj.unReadMessage = "[文章]";
                break;
              case 7:
                obj.unReadMessage = "[咨询]";
                break;
              case 8:
                obj.unReadMessage = "[医生回答了你的问题]";
                break;
              case 9:
                obj.unReadMessage = "[调查问卷]";
                break;
              case 10:
                obj.unReadMessage = data.content;
                break;
              case 11:
                obj.unReadMessage = "[您有新的产品订单]";
                break;
              case 14:
                obj.unReadMessage = "[付费咨询]待支付";
                break;
              case 15:
                obj.unReadMessage = "[付费咨询]已支付";
                break;
              case 16:
                obj.unReadMessage = "[付费咨询]已退款";
                break;
              case 17:
                obj.unReadMessage = "[营养方案]已生成";
                break;
              case 18:
                obj.unReadMessage = "[营养筛查报告]已生成";
                break;
              case 19:
                obj.unReadMessage = "[营养筛查报告]已生成";
                break;
              case 20:
                obj.unReadMessage = "[待复诊通知]";
                break;
              case 101:
                obj.unReadMessage = "[付费咨询]待反馈";
                break;
              default:
              // obj.unReadMessage = data.content;
            }
            obj.unReadMessageCount = 0;
            obj.type = data.type;
            obj.msgId = ary;
            // 此处指令类型不需要同步vuex聊天记录
            chatListVuex.push(obj);
          }
          this.$store.commit("PatientIM/chatListVuex", chatListVuex);
          // console.log("更新过后的聊天未读数", this.PatientIM.chatListVuex);
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
      /**
       * websock reconnect
       * 监听网络变化,重新连接socket**/
      reconnect() {
        let that = this;
        if (that.ReconnectState) {
          return false;
        }
        that.timeoutReconnect && clearTimeout(that.timeoutReconnect);
        that.timeoutReconnect = setTimeout(function () {
          that.initwebsock();
          that.ReconnectState = false;
        }, 5000);
      },
      /**
       * heartCheckReset**/
      heartCheckReset() {
        //清除时间
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        //重启心跳
        this.heartCheckStart();
      },
      //-开启心跳
      heartCheckStart() {
        console.log("开启心跳");
        let that = this;
        that.timeoutObj && clearTimeout(that.timeoutObj);
        that.serverTimeoutObj && clearTimeout(that.serverTimeoutObj);
        that.timeoutObj = setTimeout(function () {
          //这里发送一个心跳，后端收到后，返回一个心跳消息，
          if (that.websock.readyState === 1) {
            //如果连接正常
            //  that.websock.send("ping");
            console.log("ping!");
          }
          //否则重连
          // else{
          //    this.reconnect();
          // }
          that.serverTimeoutObj = setTimeout(function () {
            //超时关闭
            that.websock.close();
          }, that.timeout);
        }, that.timeout);
      },
      /**
       * 点击医生头像跳转,如果是已关联的医生,可查看医生名片
       * @params id 医生id
       * **/
      seeDoctorDetail(id) {
        this.$http.request({
          url: "/RReportController/selectRelation",
          method: "get",
          body: {
            id: id
          }
        }).then(res => {
          if (res.data.success) {
            if (res.data.code === "0001") {
              this.$router.push({
                path: "/docDepartmentCard",
                query: {
                  doctorId: id,
                  isPatient: true
                }
              });
            }
            if (res.data.code === "0000") {
              this.$router.push({
                path: "doctorMessage",
                query: {
                  doctorId: id
                }
              });
            }
          } else {
            Toast("接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 页面跳转**/
      routerLink(routerName, item) {
        if (!item) {
          if (this.sessionType == 0) {
            this.$router.push({
              path: "doctorMessage",
              query: {
                doctorId: this.doctorId
              }
            });
          }
          if (this.sessionType == 1) {
            if (routerName == "'chatIMSettings'") {
              this.$router.push({
                path: routerName,
                query: {
                  sessionId: this.sessionId || ""
                }
              });
            } else {
              this.$router.push({
                path: routerName,
                query: {}
              });
            }
          }
        } else {
          if (item.identity === "doctor" && routerName === "doctorMessage") {
            this.$router.push({
              path: "doctorMessage",
              query: {
                doctorId: item.fromUserId
              }
            });
          }
          if (
            item.identity === "patient" &&
            routerName === "patientMessageComplete"
          ) {
            this.$router.push({
              path: "patientMessageComplete",
              query: {}
            });
          }
          if (item.identity === "doctor" && routerName === "inventory") {
            this.$router.push({
              path: "inventory",
              query: {}
            });
          }
        }
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
          _this.getChatContentView();
        }
      },
      /**
       * 压缩图片处理**/
      compress(img, Orientation) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        //瓦片canvas
        let tCanvas = document.createElement("canvas");
        let tctx = tCanvas.getContext("2d");
        let initSize = img.src.length;
        let width = img.width;
        let height = img.height;
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio;
        if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio);
          width /= ratio;
          height /= ratio;
        } else {
          ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        //        铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //如果图片像素大于100万则使用瓦片绘制
        let count;
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
          //计算每块瓦片的宽和高
          let nw = ~~(width / count);
          let nh = ~~(height / count);
          tCanvas.width = nw;
          tCanvas.height = nh;
          for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }
        //修复ios上传图片的时候 被旋转的问题
        if (Orientation != "" && Orientation != 1) {
          switch (Orientation) {
            case 6://需要顺时针（向左）90度旋转
              this.rotateImg(img, "left", canvas);
              break;
            case 8://需要逆时针（向右）90度旋转
              this.rotateImg(img, "right", canvas);
              break;
            case 3://需要180度旋转
              this.rotateImg(img, "right", canvas);//转两次
              this.rotateImg(img, "right", canvas);
              break;
          }
        }
        //进行最小压缩
        let ndata = canvas.toDataURL("image/jpeg", 0.1);
        console.log("压缩前：" + initSize);
        console.log("压缩后：" + ndata.length);
        console.log("压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%");
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        return ndata;
      },
      /**
       * 旋转图片处理
       * **/
      rotateImg(img, direction, canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null) return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 2;
        if (step == null) {
          step = min_step;
        }
        if (direction == "right") {
          step++;
          //旋转到原位置，即超过最大值
          step > max_step && (step = min_step);
        } else {
          step--;
          step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180;
        let ctx = canvas.getContext("2d");
        switch (step) {
          case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
          case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
          case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
          case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
        }
      },
      /**
       * 图片压缩
       * **/
      compressImg(file) {
        this.ToastRequest = Toast.loading({
          duration: 0,
          mask: true,
          message: "上传中..."
        });
        let self = this;
        let Orientation;
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function () {
          Orientation = Exif.getTag(this, "Orientation");
        });
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return;

        // if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function (res) {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= (100 * 1024)) {
            let uploadImg = this.result;
            self.uploadImgs(uploadImg);
          } else {
            img.onload = function () {
              let uploadImg = self.compress(img, Orientation);
              self.uploadImgs(uploadImg);
            };
          }
        };
        // }
      },
      /**
       * 图片提交**/
      imgSubmit(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        let picValue = files[0];
        this.compressImg(picValue);
      },
      /**
       * 图片上传压缩**/
      uploadImgs(uploadImg) {
        let formData = new FormData();
        let blob = this.$dataURLtoBlob(uploadImg);
        formData.append("file", blob);
        this.$http
          .request({
            method: "post",
            url: "/Aliupload/aliuploads",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            if (res.data.success) {
              let uuid = this.$uuid();
              if (this.websock) {
                this.websock.send(
                  JSON.stringify({
                    msgId: uuid,
                    type: 3,
                    fromUserId: this.fromUserId,
                    content:
                      res.data.message +
                      "?x-oss-process=image/auto-orient,1,resize,m_pad,h_150,w_150",
                    sessionId: this.sessionId
                  })
                );
                this.infoList.push({
                  msgId: uuid,
                  type: 3,
                  fromUserId: this.fromUserId,
                  content:
                    res.data.message +
                    "?x-oss-process=image/auto-orient,1,resize,m_pad,h_150,w_150",
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
                  chatListVuex[matchingResults.index].type = 3;
                  chatListVuex[matchingResults.index].unReadMessage = "[图片]";
                } else {
                  let obj = {};
                  let ary = [];
                  ary.push(uuid);
                  obj.sessionId = this.sessionId;
                  obj.unReadMessage = "[图片]";
                  obj.unReadMessageCount = 0;
                  obj.type = 3;
                  obj.msgId = ary;
                  chatListVuex.push(obj);
                }
                this.$store.commit("PatientIM/chatListVuex", chatListVuex);
                this.getChatContentView();
              }
              this.showOption = false;
            }
            this.ToastRequest.clear();
          })
          .catch(e => {
            console.log(e);
            this.ToastRequest.clear();
          });
      },
      /**
       * 微信config设置,在socket之后**/
      setWXConfig() {
        return new Promise((resolve, rejected) => {
          this.$http
            .request({
              method: "post",
              url: "/wechat/getJsApiSignature",
              body: {
                url: window.location.href.split("#")[0]
              }
            })
            .then(res => {
              if (res.data.success && res.data.data) {
                let appId = res.data.data.appId || "";
                let timeStamp = res.data.data.timeStamp || "";
                let nonceStr = res.data.data.nonceStr || "";
                let signature = res.data.data.signature || "";
                try {
                  this.$wx.config({
                    debug: false, // 开启调试模式
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timeStamp, // 必填，生成签名的时间戳
                    nonceStr: nonceStr, // 必填，生成签名的随机串
                    signature: signature, // 必填，签名
                    jsApiList: [
                      "startRecord",
                      "onVoiceRecordEnd",
                      "stopRecord",
                      "playVoice",
                      "pauseVoice",
                      "stopVoice",
                      "onVoicePlayEnd",
                      "uploadVoice",
                      "downloadVoice",
                      "chooseWXPay"
                    ] // 必填，需要使用的JS接口列表
                  });
                } catch (e) {
                  console.log(e);
                }
                resolve(res.data.data);
              } else {
                rejected(res);
                console.log("获取公众号配置接口报错");
              }
            })
            .catch(e => {
              console.log(e);
            });
        });
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
       * 根据消息聊天类型判断跳转逻辑
       * item.type 5任务 6文章 7发起付费咨询 8医生咨询回复
       * @params item 聊天记录**/
      getDetailViewByChatType(item) {
        switch (item.type) {
          case 5:
            this.$router.push({
              path: "/patientTask",
              query: {
                diseaseId: item.content //疾病id
              }
            });
            break;
          case 6:
            this.$router.push({
              path: "/articleDetail",
              query: {
                articleId: item.content.articleId
              }
            });
            break;
          case 7:
            this.$router.push({
              path: "/payAdvisoryDetails",
              query: {
                payConsultId: item.content.payConsultId
              }
            });
            break;
          case 8:
            this.$router.push({
              path: "/payAdvisoryDetails",
              query: {
                payConsultId: item.content.payConsultId
              }
            });
            break;
          case 9:
            this.$router.push({
              path: "/questionnaireDetail",
              query: {
                id: item.content
              }
            });
            break;
          case 11:
            this.$router.push({
              path: "/productList",
              query: {
                productOrderId: item.content
              }
            });
            break;
        }
      },
      /**
       * 微信语音操作
       * onTouchstart 记录开始录音的时间和pageY,pageY用于计算上滑取消发送语音
       * onTouchend  记录结束录音的时间,如果小于2000ms 给出提示 不发语音
       * onTouchmove 阻止默认事件 pageY,pageY用于计算上滑取消发送语音
       * **/
      onTouchstart(e) {
        this.sendToggle = true;
        this.sendVoiceTip = "松开 结束";
        Toast({
          message: "手指上滑,取消发送",
          icon: "volume-o",
          duration: 0
        });
        e.preventDefault();
        this.pageY = e.touches[0].pageY;
        this.startTime = new Date().getTime();
        this.$wx.startRecord({
          success: function () {
            console.log("录音开始");
          },
          fail: function (e) {
            console.log("录音失败");
            Toast.clear();
          }
        });
      },
      onTouchmove(e) {
        let _this = this;
        e.preventDefault();
        let currentPageY = e.changedTouches[0].pageY;
        //上移取消录音
        if (currentPageY - _this.pageY < -100) {
          this.sendVoiceTip = "松开手指 取消发送";
          this.sendToggle = false;
          Toast.clear();
          _this.$wx.stopRecord({
            success: function (res) {
            },
            fail: function (res) {
            }
          });
        }
      },
      onTouchend(e) {
        this.sendVoiceTip = "按住 说话";
        e.preventDefault();
        let _this = this;
        _this.endTime = new Date().getTime();
        if (_this.endTime - _this.startTime < 2000) {
          Toast.clear();
          _this.$wx.stopRecord({
            success: function (res) {
              Toast.fail("说话时间太短");
            },
            fail: function (e) {
            }
          });
          return false;
        } else {
          Toast.clear();
          if (_this.sendToggle) {
            _this.$wx.stopRecord({
              success: function (res) {
                let localId = res.localId;
                _this.getVoice(localId);
              },
              fail: function (res) {
                console.log(res);
                Toast.fail("发送语音失败");
              }
            });
          }
        }
      },
      /**
       * 微信上传语音
       * **/
      getVoice(localId) {
        let _this = this;
        console.log("本地音频id", localId);
        this.$wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            // res.serverId 音频的服务器端ID socket发送音频id
            if (_this.websock) {
              let uuid = _this.$uuid();
              _this.websock.send(
                JSON.stringify({
                  msgId: uuid,
                  type: 4,
                  sessionId: _this.sessionId,
                  fromUserId: _this.fromUserId,
                  content: res.serverId
                })
              );
              _this.infoList.push({
                msgId: uuid,
                type: 4,
                sessionId: _this.sessionId,
                fromUserId: _this.fromUserId,
                content: res.serverId,
                status: 1, // 消息发送状态,默认发送中
                identity: "patient",
                audioPlay: false,
                sendTime: new Date().getTime()
              });
              // 通过sessinId找到vuex中存储的未读(已读)消息,修改为最新的消息
              let chatListVuex = JSON.parse(
                JSON.stringify(_this.PatientIM.chatListVuex)
              );
              let matchingResults = _this.$hasValueFromArray(
                chatListVuex,
                "sessionId",
                _this.sessionId
              );
              if (matchingResults.value) {
                chatListVuex[matchingResults.index].type = 4;
                chatListVuex[matchingResults.index].unReadMessage = "[语音]";
              } else {
                let obj = {};
                let ary = [];
                ary.push(uuid);
                obj.sessionId = _this.sessionId;
                obj.unReadMessage = "[语音]";
                obj.unReadMessageCount = 0;
                obj.type = 4;
                obj.msgId = ary;
                chatListVuex.push(obj);
              }
              _this.$store.commit("PatientIM/chatListVuex", chatListVuex);
              _this.getChatContentView();
            }
          },
          fail: function (res) {
            console.log(res);
            Toast.fail("发送语音失败");
          }
        });
      },
      /**
       * 语音播放**/
      playWXvoice(id, item) {
        this.infoList.forEach(item => {
          if (item.type === 7) {
            item.audioPlay = item.content === id;
          }
        });
        let _this = this;
        this.isPlay = true;
        this.$wx.downloadVoice({
          serverId: id, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            let localId = res.localId; // 返回音频的本地ID
            _this.$wx.playVoice({
              localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
              success: function (result) {
                item.audioPlay = true;
              }
            });
            _this.playWXvoiceEnd(id, item);
          }
        });
      },
      /**
       * 监听语音播放结束**/
      playWXvoiceEnd(voiveId, InfoListItem) {
        this.$wx.onVoicePlayEnd({
          serverId: voiveId,
          success: function (res) {
            InfoListItem.audioPlay = false;
          }
        });
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
       * 查询历史聊天记录,默认为10条
       * 下拉再次加载10条**/
      getHistoryInfoList(item) {
        return new Promise((resolve, rejected) => {
          this.$http
            .request({
              method: "get",
              url: "/ImController/getHistoryMessageBySessionIdSendTime" + "?timestamp=" + new Date().getTime(),
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
                  if (item.type === 4) {
                    item.audioPlay = false;
                  }
                  item.sendTime = Number(item.sendTime);
                  if (item.fromUserId === this.fromUserId) {
                    item.identity = "patient";
                  } else {
                    item.identity = "doctor";
                  }
                  if (item.type === 10) {
                    item.identity = "system";
                  }
                  if (item.type === 14 || item.type === 15 || item.type === 16) {
                    if (typeof item.content === "string") {
                      item.content = JSON.parse(item.content);
                    }
                  }
                  for (let i = 0; i < this.patientChatList.length; i++) {
                    if (item.fromUserId === this.patientChatList[i].userid) {
                      item.vxheadurl = this.patientChatList[i].vxheadurl;
                      item.identityValue = this.patientChatList[i].type === 1 ? "医生" : "";
                      item.nameValue = this.patientChatList[i].username;
                      break;
                    }
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
       * 付费咨询患者反馈提交
       * **/
      submitConsultFeedback(type) {
        this.$http.request({
          url: "/RPayConsultDoctorController/feedback",
          method: "post",
          body: {
            payConsultId: this.payConsultParams.content.payConsultId || "",
            feedback: type
          }
        }).then(res => {
          if (res.data.success) {
            this.consultFeedbackShow = false;
            type == 1 && (this.isPayConsulting = false);
          } else {
            Toast(res.data.message || "付费咨询反馈接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 付费咨询患者付费
       * @params: item 聊天消息
       * **/
      payAdvisory(item) {
        if (item.type === 14) {
          if (item.content.status === 0 || item.content.status === 7) {
            let ToastRequest = Toast.loading({
              duration: 0,
              mask: true,
              message: "加载中..."
            });
            this.$http.request({
              method: "post",
              url: "/RPayConsultDoctorController/payPaidConsult",
              body: {
                payConsultId: item.content.payConsultId
              },
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }).then(res => {
              ToastRequest.clear();
              if (res.data.success) {
                let data = res.data;
                this.$wx.ready(() => {
                  this.$wx.chooseWXPay({
                    appId: data.data.appId,
                    timestamp: data.data.timeStamp,
                    nonceStr: data.data.nonceStr,
                    package: data.data.package,
                    signType: data.data.signType,
                    paySign: data.data.paySign,
                    success: function (res) {
                      console.log("pay success", res);
                    },
                    fail: function (e) {
                      console.log("pay fail", e);
                    }
                  });
                });
              } else {
                Toast(res.data.message || "付费咨询支付接口报错");
              }
            }).catch(e => {
              ToastRequest.clear();
              console.log(e);
            });
          }
        }
      },
      /**
       * 页面初始化的查询是否是付费咨询反馈状态
       * **/
      getConsultFeedbackStatus() {
        this.$http.request({
          url: "/RPayConsultDoctorController/getSessionStatus",
          method: "get",
          body: {
            sessionId: this.sessionId
          }
        }).then(res => {
          if (res.data.success) {
            console.log("getConsultFeedbackStatus response ===", res.data.data);
            if (res.data.data.status === 2) {
              this.payConsultParams = {
                content: {
                  payConsultId: res.data.data.payConsultId,
                  launchfeedbacktime: res.data.data.launchfeedbacktime
                }
              };
              this.consultFeedbackShow = true;
            }
            this.isPayConsulting = res.data.data.status === 1 || res.data.data.status === 2;
          } else {
            Toast(res.data.message || "查询付费咨询状态报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 关闭患者反馈弹窗
       * **/
      closeConsultFeedback() {
        this.consultFeedbackShow = false;
      },
      /**
       * 患者发起营养筛查
       * **/
      goScreening() {
        // location.href = `https://channel.quickhealmall.com/healthZSR/#/inputPerson?id=${this.doctorId}`;
        location.href = `${this.$globalServiceHost.fullServiceHost}/nutrition_prescribe/#/inputPerson?id=${this.doctorId}`;
      },
      /**
       * 查看营养筛查结果
       * **/
      SeeScreeningresult(item) {
        // location.href = `https://channel.quickhealmall.com/healthZSR/#/screeningResult?id=${item.content}&from=im`;
        location.href = `${this.$globalServiceHost.fullServiceHost}/nutrition_prescribe/#/screeningResult?id=${item.content}&from=im`;
      },
      /**
       * 患者营养推荐,先查询医生是否有绑定柜
       * **/
      nutritionRecommendation() {
        this.$http.request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/selectDeviceListEx",
          body: {
            type: 1,
            id: this.doctorId
          }
        }).then(response => {
          if (response.data.success) {
            if (response.data.data) {
              this.$router.push({
                name: "chooseRecommendationType",
                query:{
                  doctorId:this.doctorId
                }
              });
            }
          } else {
            Toast(response.data.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 查看复诊通知
       * **/
      goReturnVisitP() {
        this.$router.push({
          path:'returnVisitP',
          query:{
            doctorId:this.doctorId,
            isFromIM:true
          }
        })
      },
      /**
       * 营养推荐产品购买(智能柜)
       * **/
      goSubmitOrder(orderId) {
       this.$router.push({
         path:'submitOrder',
         query:{
           orderId:orderId
         }
       })
      },
      /**
       * 查看复诊详情
       * **/
      seeReturnVisitPDetail(returnVisitId) {
        this.$router.push({
          path:'returnVisitPDetail',
          query:{
            id:returnVisitId,
            isFromIM:true
          }
        })
      }
    },
    created() {
      window.sessionStorage.clear("id");
      this.fromUserId = this.PatientIM.patientMessage.id;
      if(this.$route.query.lastconsultstatus == 'true') {
        this.isPayConsulting = true;
      }
      this.doctorId = this.$route.query.doctorId || "";
      this.sessionType = this.$route.query.sessionType || 0;
      this.sessionId = this.$route.query.sessionId || "";
      this.patientVxHeadUrl = this.PatientIM.patientMessage.vxheadurl;
      this.handleUnreadMessage();
      this.onVisibilityChange();
      this.getConsultFeedbackStatus();
      let patientChatList = this.PatientIM.patientChatList;
      for (let i = 0; i < patientChatList.length; i++) {
        if (patientChatList[i].id === this.sessionId && this.sessionType == 0) {
          this.patientChatList = patientChatList[i].imSessionUserList;
          this.sessionName = patientChatList[i].imSessionUserList[0].username;
          break;
        } else if (
          patientChatList[i].id === this.sessionId && this.sessionType == 1
        ) {
          this.sessionName = patientChatList[i].sessionname;
          this.patientChatList = patientChatList[i].imSessionUserList;
          break;
        }
      }
      if (this.$route.query.sessionName) {
        this.sessionName = this.$route.query.sessionName;
      }
      let wxConfigPromise = null;
      let getHistoryInfoListPromise = null;
      getHistoryInfoListPromise = this.getHistoryInfoList();
      wxConfigPromise = this.setWXConfig();
      Promise.all([wxConfigPromise, getHistoryInfoListPromise]).then(() => {
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

  .chatIMDetail_page {

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


    /*组件样式*/

    .van-icon,
    .van-icon::before {
      .width(36);
      .height(56);
      .lineHeight(56);
    }


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
      .margin(0, 12, 0, 0);
    }
  }


  /*页面样式*/
  .chatIMDetail_page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .chatIM_title {
      display: flex;
      align-items: center;
      .height(44);
      .padding(0, 12, 0, 12);

      .right_btn {
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

      .consulting-text {
        .fontSize(14);
        font-weight: 400;
        color: @topRightUpColor;
        .lineHeight(44);
        .margin(0, 0, 0, 5);
      }
    }

    /*患者付费咨询反馈弹窗防止消息被遮挡*/

    .withBottomPadding {
      .padding(24, 12, 180, 12);
    }

    .chatIM_content {
      flex: 1;
      overflow: auto;
      .padding(24, 12, 0, 12);

      .img_box {
        position: fixed;
        right: 12 / 375 * 100vw;
        bottom: 200 / 375 * 100vw;
        .width(66);
        .height(66);
        z-index: 999;
      }
    }

    .chatIM_input_box {
      justify-content: flex-end;
      width: 100%;
      z-index: 2;

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

        .img {
          .width(32);
          .margin(0, 15, 0, 0);
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

  /*动画样式*/
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }

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

  /*任务面板*/

  .flex_column.patient_task_box {
    h3 {
      display: flex;
      flex-direction: column;

      i {
        .fontSize(30);
        font-weight: bold;
        .margin(0, 0, 15, 0);
      }
    }
  }

  .patient_task_box {
    .margin(0, 0, 0, 12);
    display: flex;
    flex-direction: column;
    width: 60%;
    .borderRadius(0, 10, 10, 10);
    overflow: hidden;

    .task_btn {
      .height(44);
      .lineHeight(44);
      .fontSize(18);
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      background-color: @mainColor;
    }

    h3 {
      flex: 1;
      .fontSize(16);
      .lineHeight(20);
      background-color: #fff;
      color: @mainColor;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      .padding(13, 15, 13, 15);

      i {
        display: block;
      }
    }

    .LinkBox_img {
      img {
        .width(32);
        .height(32);
        border-radius: 0;
      }
    }
  }

  .patient_article_box {
    .margin(0, 0, 0, 12);
    display: flex;
    flex-direction: column;
    width: 60%;
    .borderRadius(0, 10, 10, 10);
    box-sizing: border-box;
    .padding(15, 15, 15, 15);
    background-color: #fff;

    .article_message {
      .fontSize(16);
      .lineHeight(16);
      font-weight: 400;
      color: @mainColor;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .article_img {
      width: 100%;
      .borderRadius(5, 5, 5, 5);
      overflow: hidden;
      .margin(8, 0, 0, 0);

      img {
        width: 100%;
        .height(86);
        object-fit: cover;
        .borderRadius(6, 6, 6, 6);
      }
    }
  }

  .patient_box_r .patient_task_box {
    .margin(0, 12, 0, 0);
    .borderRadius(10, 0, 10, 10);
  }

  .doctor_response .task_btn,
  .patient_response .task_btn {
    background-color: @buttonColor !important;
    color: #fff !important;
  }

  .doctor_response h3,
  .patient_response h3 {
    background-color: #fff !important;
    color: @buttonColor !important;
  }

  .width68 {
    max-width: 68%;
    display: flex;
    flex-direction: column;
  }

  .zixun_price {
    color: rgba(255, 48, 0, 1);
    width: 100%;
    text-align: right;
    .fontSize(14);
    .padding(12, 0, 2, 0);
    display: flex;
    justify-content: flex-end;
    align-items: center;

    i {
      .fontSize(30);
    }
  }

  .patient_box_r.patient_response {
    .borderRadius(10, 0, 10, 10);
    overflow: hidden;

    h4 {
      .padding(13, 13, 13, 13);
      background: #fff;
      color: @mainColor;
      .fontSize(16);
      .lineHeight(20);
      font-weight: 400;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .task_btn {
      position: relative;

      i {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: #fff;
        opacity: 0.4;
      }
    }
  }


  .chatIMDetail_page /deep/ .van-button--warning {
    background-color: @buttonColor;
    border: 1px solid @buttonColor;
  }

  .voice_play_btn {
    display: flex;
    .width(100);
    align-items: center;

    i {
      .fontSize(20);
    }
  }

  .system_message {
    .padding(10, 0, 10, 0);
    margin: 0 auto;
    text-align: center;
    .fontSize(14);
    color: rgba(153, 153, 153, 1);
    font-weight: 400;
    width: 70%;
  }


  .pay-tips-msg {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .margin(0, 0, 15, 0);

    .pay-tips-box {
      .width(209);
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;

      .top {
        .padding(16, 10, 8, 10);
        .fontSize(14);
        font-weight: 400;
        color: @titleColor;
        .lineHeight(20);
        background: @fontColorff;
      }

      .bottom {
        background: @mainColor;
        .fontSize(16);
        font-weight: 400;
        color: @fontColorff;
        .lineHeight(22);
        .padding(11, 0, 11, 0);
        text-align: center;
      }
    }
  }

  .patient_box .sendorReciveImg,
  .patient_box_r .sendorReciveImg {
    display: block;
    width: auto;
    height: auto;
    max-width: 150px;
    max-height: 150px;
    .borderRadius(5, 5, 5, 5);
    /*object-fit: cover;*/
  }

  .sendDiv {
    height: 42px;
    line-height: 42px;
    .borderRadius(6, 6, 6, 6);
    text-align: center;
    flex: 1;
    user-select: none;
  }

  //录音的gif图
  .playRadio {
    .width(20) !important;
    .height(20) !important;
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


  .identity_box_l {
    .margin(0, 0, 10, 12);

    span {
      .fontSize(14);
      .lineHeight(18);
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }

    .identity_span {
      .margin(0, 10, 0, 0);
    }

    .name_span {

    }
  }

  .padding0 {
    padding: 0 !important;
  }

</style>
