/* * @Author: 田东 * @Date: 2020-01-13 11:03:44 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-13 11:04:05 * @name 聊天详情 */
<template>
  <div class="chatIMDetail_page" id="chatIMDetail_page">
    <common-header :share-disabled="true" :custom-title="'聊天详情'"></common-header>
    <!--    聊天头部-->
    <div class="header_box clearfix">
      <div class="header-div header-left" @click="onClickLeft()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">
        {{ sessionName == "" ? patientName : sessionName }}
        <span
          class="consulting-text"
          v-if="isPayConsulting"
        >付费咨询中…</span>
      </div>
      <div class="price header-right">
        <!-- :class="docId == '424987751667077197' ? 'helper' : 'doctor_bar'" -->
        <span @click="routerLink()">{{sessionType == 1 ? "详情" : "患讯"}}</span>
      </div>
    </div>

    <!--    聊天内容-->
    <ul
      class="chatIM_content"
      :class="hidden ? 'none' : 'show'"
      ref="chatContentBox"
      @click.stop="showOption = false"
    >
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div v-for="(item, index) in infoList" :key="index">
          <!-- 患者 -->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 2 &&
                  item.fromUserId !== docId &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box" v-if="item.type === 2 && item.fromUserId !== docId">
              <div>
                <img :src="item.vxheadurl" alt @click="getPatientInfo(item.fromUserId)" />
              </div>
              <div class="width68">
                <div class="identity_box_l" v-if="sessionType === 1">
                  <span class="identity_span" v-if="item.identityValue">{{ item.identityValue }}</span>
                  <span class="name_span" v-if="item.nameValue">{{ item.nameValue }}</span>
                </div>
                <p class="patient_info_l">
                  {{ item.content }}
                  <span class="arrow_left"></span>
                </p>
              </div>
            </div>
          </div>

          <!-- 医生 -->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 2 &&
                  item.fromUserId == docId &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r" v-if="item.type === 2 && item.fromUserId == docId">
              <div class="width68">
                <div class="identity_box_l" v-if="sessionType === 1">
                  <span class="identity_span" v-if="item.identityValue">{{ item.identityValue }}</span>
                  <span class="name_span" v-if="item.nameValue">{{ item.nameValue }}</span>
                </div>
                <p class="patient_info_l">
                  <span class="arrow_right"></span>
                  {{ item.content }}
                </p>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!--        图片-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 3 &&
                  item.fromUserId !== docId &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box" v-if="item.type === 3 && item.fromUserId !== docId">
              <div>
                <img :src="item.vxheadurl" alt @click="getPatientInfo(item.fromUserId)" />
              </div>
              <div class="width68">
                <div class="identity_box_l" v-if="sessionType === 1">
                  <span class="identity_span" v-if="item.identityValue">{{ item.identityValue }}</span>
                  <span class="name_span" v-if="item.nameValue">{{ item.nameValue }}</span>
                </div>
                <div class style="position: relative" @click.stop="checkImg(item.content)">
                  <div class="imgStyle">
                    <img :src="item.content" alt />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 3 &&
                  item.fromUserId === docId &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r" v-if="item.type === 3 && item.fromUserId === docId">
              <div class="width68">
                <div class="identity_box_l" v-if="sessionType === 1">
                  <span class="identity_span" v-if="item.identityValue">{{ item.identityValue }}</span>
                  <span class="name_span" v-if="item.nameValue">{{ item.nameValue }}</span>
                </div>
                <div class style="position: relative" @click.stop="checkImg(item.content)">
                  <div class="imgStyle imgStyleMe">
                    <img :src="item.content" alt />
                  </div>
                </div>
              </div>

              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!--          语音发送与回复-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 4 &&
                  item.fromUserId !== docId &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>

            <div class="patient_box" v-if="item.type === 4 && item.fromUserId !== docId">
              <div @click="getPatientInfo(item.fromUserId)">
                <img :src="item.vxheadurl" alt />
              </div>
              <div class="width68" @click.stop="playWXvoice(item)">
                <div class="identity_box_l" v-if="sessionType === 1">
                  <span class="identity_span" v-if="item.identityValue">{{ item.identityValue }}</span>
                  <span class="name_span" v-if="item.nameValue">{{ item.nameValue }}</span>
                </div>
                <p class="patient_info_l" style="position: relative">
                  <span class="voice_play_btn">
                    <i v-if="!item.audioPlay" class="iconyuyinzuo iconfont"></i>
                    <img class="playRadio" v-else :src="playRight" alt />
                  </span>

                  <span class="arrow_left"></span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 4 &&
                  item.fromUserId == docId &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r" v-if="item.type === 4 && item.fromUserId == docId">
              <div class="width68" @click.stop="playWXvoice(item)">
                <div class="identity_box_l" v-if="sessionType === 1">
                  <span class="identity_span" v-if="item.identityValue">{{ item.identityValue }}</span>
                  <span class="name_span" v-if="item.nameValue">{{ item.nameValue }}</span>
                </div>
                <p class="patient_info_l" style="position: relative">
                  <span class="arrow_right" style="text-align: right"></span>
                  <span class="voice_play_btn" style="text-align: right">
                    <i v-if="!item.audioPlay" class="iconyuyinyou iconfont"></i>
                    <img v-else class="playRadio" :src="playLeft" alt />
                  </span>
                </p>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!--        新任务-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 5 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r" v-if="item.type === 5">
              <div class="patient_task_box" @click="pushMission(item)">
                <span class="arrow_right"></span>
                <h3>
                  <i class="iconfont iconrenwu"></i>
                  <p>提醒您有新任务</p>
                </h3>
                <div class="task_btn">查看任务</div>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!--        医生发表问文章-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 6 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r" v-if="item.type === 6">
              <div class="patient_article_box" style="position: relative">
                <span class="arrow_right"></span>
                <div class="article_message">{{ item.content.title }}</div>
                <div class="article_img" @click="linkArticle(item.content.articleId)">
                  <img :src="item.content.logourl" alt />
                </div>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!--        患者付费回复-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 7 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box patient_response" v-if="item.type === 7">
              <div>
                <img :src="item.vxheadurl" alt @click="getPatientInfo(item.fromUserId)" />
              </div>
              <div class="patient_task_box" @click="getResponse(item.content.payConsultId)">
                <span class="arrow_left white"></span>
                <h3>医生您好,希望得到您的解答和帮助</h3>
                <p class="zixun_price">
                  <img src="../../../assets/images/iconBell.png" alt />
                  {{
                  item.content.tarrif
                  ? "¥" + (item.content.tarrif / 100).toFixed(2)
                  : "¥" + "0.00"
                  }}
                </p>
                <div class="task_btn" style="position: relative">
                  付费咨询
                  <i></i>
                </div>
              </div>
            </div>
          </div>

          <!--        医生咨询回复-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 8 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r doctor_response" v-if="item.type === 8">
              <div class="patient_task_box" @click="getResponse(item.content.payConsultId)">
                <span class="arrow_right white"></span>
                <h3>我已解答您的问题，祝您早日康复</h3>
                <div class="task_btn">查看回复</div>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!--        医生开药-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 11 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r doctor_response" v-if="item.type === 11">
              <div class="patient_task_box" @click="getDrugsList(item.content)">
                <!-- <span class="arrow_right white"></span> -->
                <h3>
                  <img src="../../../assets/images/icon_drugsList.png" alt />
                  您有新的产品订单
                </h3>
                <div class="task_btn drugs_list">点击查看</div>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!--        调查问卷-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 9 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box patient_response" v-if="item.type === 9">
              <div @click="getPatientInfo(item.fromUserId)">
                <img :src="item.vxheadurl" alt />
              </div>
              <div class="patient_task_box" @click="getQuestion(item)">
                <span class="arrow_left white"></span>
                <h3>医生您好,我已经将我的情况如实反馈</h3>
                <div class="task_btn">调差问卷反馈</div>
              </div>
            </div>
          </div>

          <!-- 系统发送消息 -->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 10 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <p v-if="item.type === 10" class="system_message">
              <span>{{ item.content }}</span>
            </p>
          </div>
          <!-- 系统消息  付费咨询提示框 -->
          <div class="pay-tips-msg" v-if="item.type === 14 || item.type === 15 || item.type === 16">
            <p
              class="session_sendTime"
              v-if="$chatIMFormatTimeStamp(item.sendTime, index, infoList)"
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="pay-tips-box">
              <div class="top" v-if="item.type === 14">医生已为您免费服务一段时间，请您付费后继续咨询。</div>
              <div class="top" v-if="item.type === 15">咨询费用已成功支付。</div>
              <div class="top" v-if="item.type === 16">医生未及时回复付费咨询，已支付费用已原路退回。</div>
              <div
                class="bottom"
              >¥{{item.content.tarrif ? (item.content.tarrif / 100 ).toFixed(2) : (JSON.parse(item.content).tarrif / 100 ).toFixed(2)}}</div>
            </div>
          </div>

          <!-- 营养筛查   医生发起 -->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 18 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r doctor_response" v-if="item.type === 18">
              <div class="patient_task_box" @click="nutritionPrescribeReport(item.content)">
                <!-- <span class="arrow_right white"></span> -->
                <h3>
                  <img src="../../../assets/images/shaicha_icon.png" alt />
                  您的营养风险筛查报告
                </h3>
                <div class="task_btn drugs_list">查看详情</div>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!-- 营养推荐自提   医生 -->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 17 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r doctor_response" v-if="item.type === 17">
              <div class="patient_task_box" @click="getProductList(item.content)">
                <!-- <span class="arrow_right white"></span> -->
                <h3>
                  <img src="../../../assets/images/icon_drugsList.png" alt />
                  您有新的产品订单
                </h3>
                <div class="task_btn drugs_list">点击查看</div>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>

          <!-- 营养筛查  患者发起-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 19 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box patient_response patient_response_box" v-if="item.type === 19">
              <div @click="getPatientInfo(item.fromUserId)">
                <img :src="item.vxheadurl" alt />
              </div>
              <div class="patient_task_box" @click.stop="nutritionPrescribeReport(item.content)">
                <!-- <span class="arrow_left white"></span> -->
                <h3>
                  <img src="../../../assets/images/shaicha_icon.png" alt />
                  我的营养风险筛查报告
                </h3>
                <div class="task_btn">查看详情</div>
              </div>
            </div>
          </div>

          <!-- 复诊提醒  医生发起-->
          <div>
            <p
              class="session_sendTime"
              v-if="
                item.type === 20 &&
                  $chatIMFormatTimeStamp(item.sendTime, index, infoList)
              "
            >{{ $chatIMFormatTimeStamp(item.sendTime, index, infoList) }}</p>
            <div class="patient_box_r doctor_response" v-if="item.type === 20">
              <div class="patient_task_box" @click.stop="returnVisitDetail(item.content)">
                <!-- <span class="arrow_right white"></span> -->
                <h3>
                  <img src="../../../assets/images/icon-im-fuzhen-hint.png" alt />
                  复诊通知
                </h3>
                <div class="task_btn drugs_list">查看通知详情</div>
              </div>
              <div>
                <img :src="docAvator" @click="getDocInfo" />
              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </ul>
    <!--    聊天底部-->
    <div class="chatIM_input_box" id="chatIM_input_box">
      <div class="chatIM_input_content">
        <img
          class="img"
          v-if="!sendVoice"
          @click.stop="sendVoice = !sendVoice"
          src="../../../assets/images/icon_yuyin.png"
          alt
        />
        <img
          class="img"
          v-else
          @click.stop="sendVoice = !sendVoice"
          src="../../../assets/images/icon_wenzi.png"
          alt
        />
        <van-cell-group>
          <van-field
            v-model="chatValue"
            v-if="!sendVoice"
            type="textarea"
            rows="1"
            maxlength="500"
            :autosize="{ maxHeight: 90, minHeight: 40 }"
            ref="chatIMInput"
            @focus="focusEvent"
            @blur="blurEvent"
          ></van-field>
          <div
            class="sendDiv"
            v-else
            @touchstart="onTouchstart"
            @touchmove="onTouchmove"
            @touchend="onTouchend"
          >{{ sendVoiceTip }}</div>
        </van-cell-group>
        <span class="more-btn" v-if="chatValue" @click.stop="sendMessage">发送</span>
        <span class="more-btn" v-else @click.stop="showOption = !showOption">更多</span>
      </div>

      <transition name="slide-fade" style="display:none">
        <ul v-if="showOption" class="option_box">
          <li>
            <img src="../../../assets/images/docPic.png" alt />
            <span>图片</span>
            <input type="file" accept="image/*" @change="imgSubmit" />
          </li>
          <li @click="nutritionPrescribe">
            <img src="../../../assets/images/icon-yingyangshaicha.png" alt />
            <span>营养筛查</span>
          </li>
          <li @click="product">
            <img src="../../../assets/images/product.png" alt />
            <span>营养推荐</span>
          </li>
          <li @click="getAllMission">
            <img src="../../../assets/images/mission.png" alt />
            <span>任务</span>
          </li>
          <li @click="getPatientInfo(patientId)">
            <img src="../../../assets/images/log.png" alt />
            <span>康复日志</span>
          </li>
          <li v-if="this.sessionType == 0" @click.stop="returnVisit">
            <img src="../../../assets/images/icon-im-fuzhen.png" alt />
            <span>复诊通知</span>
          </li>
        </ul>
      </transition>
    </div>
    <!-- 提醒付费咨询浮窗 -->
    <drag-box
      :sessionId="chatId"
      v-if="sessionType == 0"
      v-show="isShowPayBtn"
      @remindPatientPay="remindPatientPay"
      :isSendPayMsg="isSendPayMsg"
    ></drag-box>
    <!-- 付费咨询医生输入数字弹窗 -->
    <van-dialog
      v-model="isShowInputPriceDialog"
      title="咨询费用"
      show-cancel-button
      :beforeClose="dialogConfirm"
      class="pay-dialog"
    >
      <div class="input-box" @touchstart.stop="showKeyboard">
        <input :value="consultingPrice" readonly type="text" placeholder="0.00" />
        <div>元</div>
      </div>
      <p class="desc">咨费最高可设置{{( maxConsultingPrice / 100 ).toFixed(2)}}元</p>
      <p class="desc">确认后，平台将会向患者发送付费提醒。患者付费后24小时内未回复，会自动退款</p>
    </van-dialog>
    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model="consultingPrice"
      :show="isShowKeyboard"
      extra-key="."
      :maxlength="6"
      @blur="isShowKeyboard = false"
    />
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import playLeft from "../../../assets/images/IMplayRight.gif";
import playRight from "../../../assets/images/playLeft.gif";
import Vue from "vue";
import Exif from "exif-js";
import { ImagePreview, Toast, Dialog, Icon } from "vant";
import dragBox from "../../../components/dragBox/dragBox";

Vue.use(ImagePreview);
export default {
  name: "chatIMDetail",
  components: {
    commonHeader,
    dragBox
  },
  data() {
    return {
      isLoading: "",
      docAvator: "", //医生头像
      docName: "", //医生名字
      patientName: "", //患者名字
      patientId: "", //患者id
      imSessionUserList: "", //会话聊天里的对方信息列表
      unreadList: "",
      chatList: "",
      docId: "",
      chatId: "",
      diseaseId: "", //疾病id
      sessionType: null, //0 单聊， 1群聊

      chatValue: "", // 聊天内容
      showOption: false, //  是否显示聊天菜单
      scrollTop: 0,

      recordTime: null,
      startTime: "",
      currentVoiceId: "", //当前录音播放
      playLeft: playLeft, //录音播放的gif图
      playRight: playRight, //录音播放的gif图
      endTime: "", //语言，防止误操作

      websocket: null, //-websocket服务支持
      timeout: 10 * 1000, //-30秒一次心跳
      timeoutObj: null, //-心跳心跳倒计时
      serverTimeoutObj: null, //-心跳倒计时
      rest: "", //-存入返回的各种信息
      supported: "", //-连接情况显示
      ReconnectState: false, //-断线重连状态
      timeoutReconnect: null, //-断开重连倒计时
      hiddenTime: "",
      hidden: true,
      sendToggle: false, // 是否发送
      pageY: "",
      sendVoice: false, // 发送语音还是文字
      sendVoiceTip: "按住 说话", // 发送语音提示
      isPullRefresh: false,
      // 聊天内容
      infoList: [],
      sessionName: "",
      ToastRequest: "",

      isShowInputPriceDialog: false, // 是否显示咨询价格弹窗
      consultingPrice: "", // 设置付费咨询价格
      maxConsultingPrice: 0, // 付费咨询价格上限
      isShowKeyboard: false, // 是否谈起数字键盘
      isSendPayMsg: false, // 是否向患者发送付费消息
      isShowPayBtn: true, // 是否显示付费咨询浮窗按钮（等待患者反馈时隐藏）
      isPayConsulting: false, // 是否是付费咨询状态
      payConsultId: "" // 付费咨询Id
    };
  },
  watch: {
    sendVoice: function() {
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
    consultingPrice: function(newValue, oldValue) {
      if (!newValue) {
        return false;
      }
      // 先点 . 默认改 0.
      if (newValue === ".") {
        this.consultingPrice = "0.";
      }
      if (oldValue === "0") {
        if (newValue.split("")[1] !== ".") {
          this.consultingPrice = newValue.split("")[1];
        }
      }
      // 禁止输入两个小数点
      if (newValue.indexOf(".") !== newValue.lastIndexOf(".")) {
        this.consultingPrice = oldValue;
      }
      // 小数点后只可以输入两位
      if (newValue.split(".")[1] && newValue.split(".")[1].length > 2) {
        this.consultingPrice = oldValue;
      }
      if (newValue * 100 > this.maxConsultingPrice) {
        Toast("不能超过咨费上限");
        this.consultingPrice = oldValue;
      }
    }
  },
  methods: {
    blurEvent() {
      document.scrollingElement.scrollTo(0, this.scrollTop);
    },
    focusEvent() {
      this.scrollTop = document.scrollingElement.scrollTop;
      this.showOption = false;
      this.scrollToBottom();
    },
    //将存储vuex中的未读消息改为已读
    changeUnRead(data) {
      if (this.unreadList.length >= 0) {
        let flag = false;
        if (!data) {
          console.log("没有数据了啊");
          //阻止返回为空
          return;
        }
        console.log("this.unreadList: ", this.unreadList);
        for (let i = 0; i < this.unreadList.length; i++) {
          if (this.unreadList[i].id == this.chatId) {
            flag = true;
            this.unreadList[i].unReadMessageCount = 0;

            // 某固定一账号(周测试)给某固定一账号(蒋测试)开药报错 unreadList某一条缺少msgId字段
            try {
              this.unreadList[i].msgId.length = 0;
            } catch (error) {
              console.log(error);
            }

            let type = data.type;
            if (type == 3) {
              this.unreadList[i].unReadMessage = "[图片]";
            } else if (type == 2) {
              this.unreadList[i].unReadMessage = data.content;
            } else if (type == 4) {
              this.unreadList[i].unReadMessage = "[音频]";
            } else if (type == 5) {
              this.unreadList[i].unReadMessage = "[任务]";
            } else if (type == 6) {
              this.unreadList[i].unReadMessage = "[文章]";
            } else if (type == 7) {
              this.unreadList[i].unReadMessage = "[咨询]";
            } else if (type == 8) {
              this.unreadList[i].unReadMessage = "[咨询]";
            } else if (type == 9) {
              this.unreadList[i].unReadMessage = "[调查问卷]";
            } else if (type == 10) {
              this.unreadList[i].unReadMessage = data.content; // "[系统消息]";
            } else if (type == 11) {
              this.unreadList[i].unReadMessage = "[产品推荐]";
            } else if (type == 14) {
              this.unreadList[i].unReadMessage = "[付费咨询]待支付";
            } else if (type == 15) {
              this.unreadList[i].unReadMessage = "[付费咨询]已支付";
            } else if (type == 16) {
              this.unreadList[i].unReadMessage = "[付费咨询]已退款";
            } else if (type == 17) {
              this.unreadList[i].unReadMessage = "[产品推荐]";
            } else if (type == 18) {
              this.unreadList[i].unReadMessage = "[营养筛查]";
            } else if (type == 19) {
              this.unreadList[i].unReadMessage = "[营养筛查]";
            } else if (type == 20) {
              this.unreadList[i].unReadMessage = "[复诊通知]";
            } else {
              // this.unreadList[i].unReadMessage = data.content;
            }

            if (this.sessionType == 1) {
              //群聊加姓名
              for (let j = 0; j < this.imSessionUserList.length; j++) {
                if (this.imSessionUserList[j].userid === data.fromUserId) {
                  this.unreadList[i].unReadMessage =
                    this.imSessionUserList[j].username +
                    ":" +
                    this.unreadList[i].unReadMessage;
                }
              }
            }
            this.$store.commit("DoctorIM/saveUnreadList", this.unreadList);
          }
        }

        if (!flag) {
          let obj = {};
          let ary = [];
          ary.push(data.msgId);
          obj.id = data.sessionId;
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
              obj.unReadMessage = "[产品推荐]";
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
              obj.unReadMessage = "[产品推荐]";
              break;
            case 18:
              obj.unReadMessage = "[营养筛查]";
              break;
            case 19:
              obj.unReadMessage = "[营养筛查]";
              break;
            case 20:
              obj.unReadMessage = "[复诊通知]";
              break;
            // case 101:
            //   obj.unReadMessage = "[付费咨询]";
            //   break;
            // case 102:
            //   obj.unReadMessage = "[付费咨询]";
            //   break;
            default:
            // obj.unReadMessage = data.content;
          }

          if (this.sessionType == 1) {
            //群聊加姓名
            for (let j = 0; j < this.imSessionUserList.length; j++) {
              if (this.imSessionUserList[j].userid == data.fromUserId) {
                obj.unReadMessage =
                  this.imSessionUserList[j].username + ":" + obj.unReadMessage;
              }
            }
          }

          console.log("ww", obj.unReadMessage);

          obj.unReadMessageCount = 0;
          obj.type = data.type;
          obj.msgId = ary;
          this.unreadList.push(obj);
          this.$store.commit("DoctorIM/saveUnreadList", this.unreadList);
        }
      }
    },
    //点击查看图片
    checkImg(img) {
      let newImg = img.substring(0, img.lastIndexOf("/")) + "/auto-orient,1";

      ImagePreview({
        images: [newImg]
      });
    },
    nutritionPrescribe() {
      if (this.sessionType == 1 || this.docId == "424987751667077197") {
        Toast("对不起，您当前没有权限查看");
        return;
      }
      // window.location.href = `https://channel.quickhealmall.com/healthZSR/#/inputPerson?id=${this.patientId}`;
      window.location.href = `${this.$globalServiceHost.fullServiceHost}/nutrition_prescribe/#/inputPerson?id=${this.patientId}`;
    },
    nutritionPrescribeReport(id) {
      // window.location.href = `https://channel.quickhealmall.com/healthZSR/#/screeningReferenceGo?id=${id}&type=1&from=im`
      window.location.href = `${this.$globalServiceHost.fullServiceHost}/nutrition_prescribe/#/screeningReferenceGo?id=${id}&type=1&from=im`;
    },
    nutritionPrescribeReportOver(id) {
      // window.location.href = `https://channel.quickhealmall.com/healthZSR/#/diagnosis?id=${id}`;
      window.location.href = `${this.$globalServiceHost.fullServiceHost}/nutrition_prescribe/#/diagnosis?id=${id}`;
    },
    product() {
      if (this.sessionType == 1 || this.docId == "424987751667077197") {
        Toast("对不起，您当前没有权限查看");
        return;
      }

      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/getDoctorBindedDevice",
          body: { doctorId: this.docId }
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.data == 1) {
              this.$router.push({
                name: "selectMachineIM",
                query: {
                  patientId: this.patientId
                }
              });
            } else if (res.data.data == 0) {
              window.localStorage.removeItem("docDrugsList");
              this.$router.push({
                name: "docSelectDrugs"
              });
            }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("网络异常，请检查网络连接");
        });
    },
    returnVisit() {
      if (this.sessionType == 1 || this.docId == "424987751667077197") {
        Toast("对不起，您当前没有权限查看");
        return;
      }

      this.$router.push({
        path: "returnVisit",
        query: {
          patientId: this.patientId,
          patientName:
            this.sessionName == "" ? this.patientName : this.sessionName
        }
      });
    },
    /**
     * 下拉刷新聊天记录
     * 初始加载10条聊天记录**/
    onRefresh() {
      setTimeout(() => {
        this.isPullRefresh = true;
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
            url:
              "/ImController/getHistoryMessageBySessionIdSendTime" +
              "?timestamp=" +
              new Date().getTime(),
            body: {
              sessionId: this.chatId,
              userId: this.docId,
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

                  if (item.fromUserId === this.docId && item.type == 4) {
                    //医生添加audioPlay属性
                    item.audioPlay = false;
                  }
                  this.imSessionUserList.forEach(subitem => {
                    if (item.fromUserId === subitem.userid) {
                      item.vxheadurl = subitem.vxheadurl;
                      item.identityValue = subitem.type === 1 ? "医生" : "";
                      item.nameValue =
                        subitem.type === 1 ? subitem.username : "";
                      if (item.type == 4) {
                        //添加audioPlay属性
                        item.audioPlay = false;
                      }
                    }
                  });
                });
              this.infoList = this.infoList.length
                ? infoListData.concat(this.infoList)
                : infoListData;
              if (this.isPullRefresh) {
                this.scrollToTop();
                this.isPullRefresh = false;
              } else {
                this.scrollToBottom();
              }

              resolve(res.data.data);
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
    // 进入会话，查询当前患者是否是付费咨询状态
    getSessionStatus() {
      this.$http
        .request({
          method: "get",
          url: "/RPayConsultDoctorController/getSessionStatus",
          body: {
            sessionId: this.chatId
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            if (data.data.status == 1) {
              this.payConsultId = data.data.payConsultId;
              this.isPayConsulting = true;
              this.isSendPayMsg = true;
            } else if (data.data.status == 2) {
              this.payConsultId = data.data.payConsultId;
              this.isPayConsulting = true;
              this.isShowPayBtn = false;
              this.isSendPayMsg = true;
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(e => {
          Toast("网络异常，请检查网络连接");
        });
    },
    //付费咨询
    getResponse(id) {
      this.$router.push({ name: "submitAdvise", query: { payConsultId: id } });
    },
    // 提醒患者付费 & 问题已解决
    remindPatientPay(val) {
      // 提醒患者付费 (按钮)
      if (!this.isSendPayMsg) {
        this.getConsultPriceMax();
        this.isShowInputPriceDialog = true;
      } else {
        // 问题已解决（按钮）
        this.$http
          .request({
            method: "post",
            url: "/RPayConsultDoctorController/launchFeedback",
            body: {
              payConsultId: this.payConsultId
            }
          })
          .then(res => {
            let data = res.data;
            if (data.success) {
              // 医生端不显示按钮，患者端弹出待确认，等待患者端反馈
              this.isShowPayBtn = false;
            } else {
              Toast(data.message);
            }
          })
          .catch(e => {
            Toast("网络异常，请检查网络连接");
          });
      }
    },
    // IM查询付费咨询价格上限
    getConsultPriceMax() {
      this.$http
        .request({
          method: "get",
          url: "/RPayConsultDoctorController/consultPriceMax",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.maxConsultingPrice = res.data.data || 0;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("网络异常，请检查网络连接");
        });
    },
    // 数字键盘
    showKeyboard() {
      this.isShowKeyboard = true;
    },
    // 输入付费咨询价格收确认事件
    dialogConfirm(action, done) {
      if (action === "confirm") {
        if (!this.consultingPrice) {
          done(false);
          Toast("请输入费用");
          return;
        }
        if (this.consultingPrice * 100 === 0) {
          done(false);
          Toast("咨询费用不可为0元");
          this.consultingPrice = "";
          return;
        }
        done();
        // 接口
        this.$http
          .request({
            method: "post",
            url: "/RPayConsultDoctorController/launchPaidConsult",
            body: {
              patientId: this.patientId,
              sessionId: this.chatId,
              tarrif: Math.floor(this.consultingPrice * 100)
            }
          })
          .then(res => {
            if (res.data.success) {
              // this.isSendPayMsg = true;
              // this.isPayConsulting = true;
              this.consultingPrice = "";
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("网络异常，请检查网络连接");
          });
        console.log("this.consultingPrice: ", this.consultingPrice * 100);
      } else {
        done();
        this.consultingPrice = "";
      }
    },
    //医生开药清单
    getDrugsList(orderId) {
      this.$router.push({
        name: "docCheckDrugsList",
        query: { orderId: orderId }
      });
    },
    getProductList(orderId) {
      this.$router.push({
        name: "docCheckProductList",
        query: { orderId: orderId }
      });
    },
    returnVisitDetail(content) {
      console.log("复诊详情");
      this.$router.push({
        name: "returnVisitDetails",
        query: { id: content, active: 2, patientId: this.patientId }
      });
    },
    //推送任务
    pushMission(item) {
      this.$router.push({
        name: "docPatientTask",
        query: {
          docid: this.docId,
          diseaseId: item.content,
          patientId: this.patientId
        }
      });
    },
    //获取患者所有疾病任务
    getAllMission() {
      //如果是群聊，不能点击

      if (this.sessionType == 1 || this.docId == "424987751667077197") {
        Toast("对不起，您当前没有权限查看");
        return;
      }

      this.$router.push({
        name: "docPatientTask",
        query: {
          docid: this.docId,
          patientId: this.patientId,
          allDisease: true
        }
      });
    },
    //跳转文章
    linkArticle(id) {
      this.$router.push({
        name: "docArticlesDetail",
        query: { articleId: id, docname: this.docName }
      });
    },
    //推送消息
    getQuestion(item) {
      this.$router.push({
        name: "docGetQuestionnaire",
        query: { id: item.content, patientId: item.fromUserId }
      });
    },
    //手机熄屏处理
    handleOffScreen() {
      if (document.visibilityState === "hidden") {
        this.hiddenTime = new Date().getTime();
      } else {
        let visibleTime = new Date().getTime();

        //console.log("亮屏状态", this.websock.readyState);
        if (this.websock.readyState == 3) {
          console.log("websocket已断开，正重新连接");
          this.websock = null;
          this.initWebSocket();
        }

        // if ((visibleTime - this.hiddenTime) / 1000 > 1) {
        //   //页面再次可见的时间-隐藏时间>1S,重连
        //   console.log("时间超过1s");
        //   //typeof this.websock.onclose === "function" && this.websock.onclose();
        //   // setTimeout(() => {
        //   //   this.websock.onopen();
        //   //   console.log("已重新链接");
        //   // }, 50); //重连
        // } else {
        //   console.log("还没有到断开的时间");
        // }
      }
    },
    onVisibilityChange() {
      document.addEventListener("visibilitychange", this.handleOffScreen);
    },
    onClickLeft() {
      this.$router.push({
        name: "docChatIMList",
        params: {}
      });
    },
    //获取医生头像
    getDocAvatar() {
      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/selectDoctor"
        })
        .then(res => {
          if (res.data.success && res.data) {
            let data = res.data.data.data;
            this.docAvator = data.url;
            this.docId = data.docId;
            this.docName = data.docName;
            this.initWebSocket();
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          Toast("刷新一下，或者检查网络连接");
        });
    },
    // 对方端信息
    getPatientInfo(id) {
      this.imSessionUserList.forEach((item, index) => {
        if (item.userid == id && item.type == 1) {
          //则是医生
          // this.$router.push({
          //   name: "docCard",
          //   query: {
          //     doctorId: id
          //   }
          // });

          this.$router.push({
            path: "/docDepartmentCard",
            query: {
              doctorId: id,
              isPatient: true
            }
          });
        } else if (item.userid == id && item.type == 0) {
          //则是患者
          this.$router.push({
            name: "docPatientInfo",
            params: {
              chatId: this.chatId
            },
            query: {
              patientId: id,
              sessiontype: this.sessionType
            }
          });
        }
      });
    },
    // 医生端信息
    getDocInfo() {
      // this.$router.push({name: "docCard"});
      this.$router.push({
        path: "/docDepartmentCard",
        query: {}
      });
    },
    /**
     * 初始化websocket**/
    initWebSocket() {
      if (typeof WebSocket != "undefined") {
        this.supported = "支持 websocket";
      } else {
        this.supported = "不支持即时聊天";
      }
      let socketUrl =
        this.$globalServiceHost.fullServiceHost.replace("https", "wss") +
        "/websocket";
      this.websock = new WebSocket(socketUrl);
      //--连接成功
      this.websock.onopen = this.websocketonopen;
      //--收到消息的回调
      this.websock.onmessage = this.websocketonmessage;
      //--连接错误
      this.websock.onerror = this.websocketonerror;
      //--连接关闭的回调
      this.websock.onclose = this.websocketclose;
      //--浏览器关闭
      //--监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload;
    },

    /**
     * websocket success**/
    websocketonopen() {
      this.websock.send(
        JSON.stringify({
          msgId: this.$uuid(),
          type: 1,
          fromUserId: this.docId
        })
      );
    },

    /**
     * websocket receive**/
    websocketonmessage(e) {
      let data = JSON.parse(e.data);
      //console.log('ssss',data);
      if (data.sessionId === this.chatId) {
        //保证当前的会话id
        let userinfo = {};
        //将未读改为已读
        if (data.isRead == 0) {
          this.websock.send(
            JSON.stringify({
              msgId: data.msgId,
              type: 8000 + data.type,
              status: 0
            })
          );
          this.changeUnRead(data);
        }

        if (data.type == 4) {
          data.audioPlay = false; //针对语音类型添加属性，用于标识播放，暂停
        }
        if (data && data.fromUserId) {
          this.imSessionUserList.forEach((item, i) => {
            if (data.fromUserId == item.userid) {
              userinfo.identityValue = item.type === 1 ? "医生" : "";
              userinfo.nameValue = item.username;
              //每次接收消息时和userList匹配，获得对方具体信息
              Object.assign(userinfo, item, data);
            }
          });

          if (Object.keys(userinfo).length == 0) {
            //如果没有和userList匹配成功
            userinfo = data;
          }

          this.infoList.push(userinfo);

          console.log("有推送的新消息: ", userinfo);
          // 患者咨询费用支付完成
          if (userinfo.type == 15) {
            this.payConsultId = userinfo.content.payConsultId;
            this.isPayConsulting = true;
            this.isSendPayMsg = true;
          } else if (userinfo.type == 16) {
            // 超24小时医生未回复
            this.isPayConsulting = false;
            // 患者浮窗按钮状态 false
            this.isSendPayMsg = false;
            this.isShowPayBtn = true;
          } else if (userinfo.type == 102) {
            // 付费咨询反馈结果
            if (userinfo.content.feedback == 0) {
              // 不满意
              this.isShowPayBtn = true;
            } else if (userinfo.content.feedback == 1) {
              // 满意
              this.isPayConsulting = false;
              this.isSendPayMsg = false;
              this.isShowPayBtn = true;
            }
          } else if (userinfo.type == 103) {
            // 患者1小时未评价 自动结束
            this.isPayConsulting = false;
            this.isSendPayMsg = false;
            this.isShowPayBtn = true;
          }

          this.scrollToBottom();
        }
      }
    },

    /**
     * websocket fail**/
    websocketonerror() {
      console.log("WebSocket连接失败");
    },

    /**
     * websocket close**/
    websocketclose(e) {
      try {
        this.websock.close();
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Browser close**/
    onbeforeunload() {
      this.websocketclose();
    },

    /**
     * websocket reconnect
     * 监听网络变化,重新连接socket**/
    reconnect() {
      let that = this;
      if (that.ReconnectState) {
        return false;
      }
      that.timeoutReconnect && clearTimeout(that.timeoutReconnect);
      that.timeoutReconnect = setTimeout(function() {
        that.initWebSocket();
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
      that.timeoutObj = setTimeout(function() {
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
        that.serverTimeoutObj = setTimeout(function() {
          //超时关闭
          that.websock.close();
        }, that.timeout);
      }, that.timeout);
    },

    /**
     * 页面跳转**/
    routerLink() {
      //如果是助手，禁止点击
      if (this.docId == "424987751667077197") {
        return;
      }
      //单聊
      if (this.sessionType == 0) {
        this.$router.push({
          name: "docIMPatientInfo",
          query: {
            id: this.imSessionUserList[0].imsessionid,
            patientId: this.imSessionUserList[0].userid,
            name: this.imSessionUserList[0].username + "、" + this.docName
          }
        });
      }

      //群聊
      if (this.sessionType == 1) {
        let createDoctorId = localStorage.getItem("createDoctorId");
        let DoctorIM = JSON.parse(JSON.stringify(this.$store.state.DoctorIM));
        let { docId } = DoctorIM.doctorMessage.data;
        let isAdmin = createDoctorId === docId;

        if (isAdmin) {
          this.$router.push({
            path: "/docIMSettings",
            query: {
              // userList: this.imSessionUserList,
              // sessionId: this.imSessionUserList.imsessionid,
              sessionname: this.sessionName
            }
          });
        } else {
          this.$router.push({
            path: "/docGroupCard",
            query: {
              id: this.chatId,
              isPatient: true,
              fromDoctorIM: true
            }
          });
        }
      }
    },

    /**
     * 发送消息**/
    sendMessage() {
      if (this.chatValue) {
        let uuid = this.$uuid();
        let obj = {
          msgId: uuid,
          type: 2,
          fromUserId: this.docId,
          content: this.chatValue,
          sessionId: this.chatId
        };
        this.websock.send(JSON.stringify(obj));
        let infoMsg = {
          msgId: uuid,
          type: 2,
          fromUserId: this.docId,
          content: this.chatValue,
          sendTime: new Date().getTime(),
          sessionId: this.chatId
        };
        this.infoList.push(infoMsg);

        //将会话列表显示改为已发送的,无则添加，有则修改
        let isValue = false;
        if (this.unreadList.length >= 0) {
          for (let i = 0; i < this.unreadList.length; i++) {
            if (this.unreadList[i].id == this.chatId) {
              isValue = true;
              this.unreadList[i].type = 2;
              this.unreadList[i].unReadMessage = this.chatValue;
              break;
            }
          }
          if (!isValue) {
            this.unreadList.push({
              id: this.chatId,
              unReadMessage: this.chatValue,
              unReadMessageCount: 0
            });
          }
        }
        this.$store.commit("DoctorIM/saveUnreadList", this.unreadList);

        this.chatValue = "";
        this.scrollToBottom();
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
      if ((ratio = (width * height) / 4000000) > 1) {
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
      if ((count = (width * height) / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
      );
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
      let degree = (step * 90 * Math.PI) / 180;
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
      Exif.getData(file, function() {
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
      reader.onloadend = function(res) {
        let result = this.result;
        let img = new Image();
        img.src = result;
        //判断图片是否大于100K,是就直接上传，反之压缩图片
        if (this.result.length <= 100 * 1024) {
          let uploadImg = this.result;
          self.uploadImgs(uploadImg);
        } else {
          img.onload = function() {
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
     * 图片上传**/
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
              let obj = {
                msgId: uuid,
                type: 3,
                fromUserId: this.docId,
                content:
                  res.data.message +
                  "?x-oss-process=image/auto-orient,1,resize,m_pad,h_150,w_150", //res.data.message
                sessionId: this.chatId
              };
              this.websock.send(JSON.stringify(obj));

              let imgInfo = {
                msgId: uuid,
                type: 3,
                fromUserId: this.docId,
                content:
                  res.data.message +
                  "?x-oss-process=image/auto-orient,1,resize,m_pad,h_150,w_150", //res.data.message
                sendTime: new Date().getTime(),
                sessionId: this.chatId
              };

              this.infoList.push(imgInfo);
              this.scrollToBottom();
              this.onVisibilityChange();

              //将会话列表显示改为已发送的图片
              let isValue = false;
              if (this.unreadList.length > 0) {
                for (let i = 0; i < this.unreadList.length; i++) {
                  if (this.unreadList[i].id == this.chatId) {
                    isValue = true;
                    this.unreadList[i].type = 3;
                    this.unreadList[i].unReadMessage = "[图片]";
                    break;
                  }
                }
                if (!isValue) {
                  this.unreadList.push({
                    id: this.chatId,
                    unReadMessage: "[图片]",
                    unReadMessageCount: 0
                  });
                }
              }
              this.$store.commit("DoctorIM/saveUnreadList", this.unreadList);
            }
            this.showOption = false;
          }
          this.ToastRequest.clear();
        })
        .catch(e => {
          console.log("图片上传失败", e);
          this.ToastRequest.clear();
        });
    },
    scrollToBottom() {
      let _this = this;
      if (!_this.$refs.chatContentBox) {
        return;
      }
      try {
        this.$nextTick(() => {
          setTimeout(function() {
            _this.$refs.chatContentBox.scrollTop =
              _this.$refs.chatContentBox.scrollHeight;
            _this.hidden = false;
          }, 300);
        });
      } catch (e) {
        console.log(e);
      }
    },
    scrollToTop() {
      let _this = this;
      try {
        this.$nextTick(() => {
          setTimeout(function() {
            _this.$refs.chatContentBox.scrollTop = 0;
            _this.hidden = false;
          }, 100);
        });
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 微信config设置,在socket之后**/
    setWXConfig() {
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
                  "downloadVoice"
                ] // 必填，需要使用的JS接口列表
              });
            } catch (e) {
              console.log(e);
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 微信语音操作
     * onTouchstart
     * onTouchend
     * onTouchmove**/
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
      this.recordTime = setTimeout(() => {
        this.$wx.startRecord({
          success: function() {
            return false;
          },
          fail: function(e) {
            console.log(e);
            Toast.clear();
          }
        });
      }, 100);
    },
    onTouchmove(e) {
      e.preventDefault();
      let _this = this;
      let currentPageY = e.changedTouches[0].pageY;
      //上移取消录音
      if (currentPageY - _this.pageY < -100) {
        this.sendVoiceTip = "松开手指 取消发送";
        this.sendToggle = false;
        Toast.clear();
        _this.$wx.stopRecord({
          success: function(res) {},
          fail: function(res) {}
        });
      }
    },
    onTouchend(e) {
      e.preventDefault();
      this.sendVoiceTip = "按住 说话";
      this.endTime = new Date().getTime();

      Toast.clear();
      if (this.endTime - this.startTime < 300) {
        clearTimeout(this.recordTime);
        this.$wx.stopRecord({
          success: function(res) {
            Toast.fail("说话时间太短");
          },
          fail: function(e) {}
        });
      } else {
        var _this = this;
        //录音成功
        this.$wx.stopRecord({
          success: function(res) {
            console.log("录音成功,获取到的音频id=====" + res.localId);
            let localId = res.localId;
            //上传微信并下载到服务器
            _this.getVoice(localId);
          },
          fail: function(res) {
            console.log(res);
            Toast("录音失败");
          }
        });
      }
    },
    //上传语音
    getVoice(localId) {
      var _this = this;
      this.$wx.uploadVoice({
        localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          if (_this.websock) {
            let uuid = _this.$uuid();
            let obj = {
              msgId: uuid,
              type: 4,
              sessionId: _this.chatId,
              fromUserId: _this.docId,
              content: res.serverId
            };

            _this.websock.send(JSON.stringify(obj));
            let obj1 = {
              msgId: uuid,
              type: 4,
              sessionId: _this.chatId,
              fromUserId: _this.docId,
              audioPlay: false,
              sendTime: new Date().getTime(),
              content: res.serverId
            };
            _this.infoList.push(obj1);
            _this.scrollToBottom();

            //将会话列表显示改为已发送的
            let isValue = false;
            if (_this.unreadList.length > 0) {
              for (let i = 0; i < _this.unreadList.length; i++) {
                if (_this.unreadList[i].id == _this.chatId) {
                  isValue = true;
                  _this.unreadList[i].type = 4;
                  _this.unreadList[i].unReadMessage = "[语音]";
                  break;
                }
              }
              if (!isValue) {
                _this.unreadList.push({
                  id: _this.chatId,
                  unReadMessage: "[语音]",
                  unReadMessageCount: 0
                });
              }
            }
            _this.$store.commit("DoctorIM/saveUnreadList", _this.unreadList);
          }
        },
        fail: function(res) {
          console.log(res);
          Toast("发送语音失败");
        }
      });
    },
    /**
     * 语音播放**/
    playWXvoice(item) {
      let id = item.content;
      let _this = this;

      _this.infoList.forEach((item, index) => {
        if (item.type == 4) {
          item.audioPlay = false;
        }
      });

      this.$wx.downloadVoice({
        serverId: id, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function(res) {
          var localId = res.localId; // 返回音频的本地ID
          _this.currentVoiceId = localId;
          _this.$wx.playVoice({
            localId: localId,
            success: function(result) {
              item.audioPlay = true;
            }
          });
          _this.playWXvoiceEnd(localId, item);
        }
      });
    },
    playWXvoiceEnd(localId, item) {
      this.$wx.onVoicePlayEnd({
        serverId: localId,
        success: function(res) {
          item.audioPlay = false;
        }
      });
    },
    /**
     * 处理未读消息缓存
     * **/
    handleUnreadMessage() {
      let chatListVuex = JSON.parse(
        JSON.stringify(this.$store.state.DoctorIM.chatList)
      );
      let matchingResults = this.$hasValueFromArray(
        chatListVuex,
        "sessionId",
        this.chatId
      );
      if (matchingResults.value) {
        chatListVuex[matchingResults.index].unReadMessageCount = 0;
        chatListVuex[matchingResults.index].msgId.length = 0;
        this.$store.commit("DoctorIM/saveChatList", chatListVuex);
      }
    }
  },
  beforeDestroy() {
    if (this.websock) {
      this.websock.onclose();
    }
    if (this.$wx) {
      this.$wx.stopVoice({
        localId: this.currentVoiceId
      });
      this.$wx = null;
    }
    if (Toast) {
      Toast.clear();
    }

    document.removeEventListener("visibilitychange", this.handleOffScreen);
  },
  // computed: {
  //   infoList: function() {
  //     this.scrollToBottom();
  //   }
  // },
  created() {
    window.sessionStorage.clear("id");
    let DoctorIM = JSON.parse(JSON.stringify(this.$store.state.DoctorIM));
    //初始化医生信息
    let { docId, docName, url } = DoctorIM.doctorMessage.data;
    if (docId) {
      this.docAvator = url;
      this.docId = docId;
      this.docName = docName;
    } else {
      this.getDocAvatar();
    }

    if (this.$route.query.currentSessionId || DoctorIM.currentSessionId) {
      this.chatId =
        this.$route.query.currentSessionId || DoctorIM.currentSessionId;
    } else {
      return false;
    }

    this.handleUnreadMessage();

    if (this.$route.query.setSessionType != undefined) {
      this.sessionType = this.$route.query.setSessionType;
    } else if (DoctorIM.setSessionType !== undefined) {
      this.sessionType = DoctorIM.setSessionType;
    }

    //未读消息置为已读
    this.unreadList = DoctorIM.unreadList;
    //this.changeUnRead();
    if (DoctorIM.chatList) {
      let chatList = DoctorIM.chatList;

      // 匹配到合适的会话id
      for (var i = 0; i < chatList.length; i++) {
        //一对一聊天,现在有了小智助手，三个人

        if (chatList[i].id == this.chatId && this.sessionType == 0) {
          this.imSessionUserList = chatList[i].imSessionUserList;
          this.patientName = this.imSessionUserList[0].username;
          this.patientId = this.imSessionUserList[0].userid;
          break;
        } else if (chatList[i].id == this.chatId && this.sessionType == 1) {
          this.sessionName = chatList[i].sessionname;
          this.imSessionUserList = chatList[i].imSessionUserList;

          this.imSessionUserList.forEach((item, i) => {
            if (item.type == 0) {
              //则为患者，群聊只有一个患者
              this.patientId = item.userid;
            }
          });
        }
      }
    }
    //监听熄屏事件
    this.onVisibilityChange();

    let wxConfigPromise = this.setWXConfig();
    let getHistoryInfoListPromise = this.getHistoryInfoList();
    Promise.all([wxConfigPromise, getHistoryInfoListPromise]).then(() => {
      this.initWebSocket();
    });
    this.scrollToBottom();
    if (this.$route.query.sessionName) {
      this.sessionName = this.$route.query.sessionName;
    }

    // 查询session付费咨询状态
    this.getSessionStatus();

   
  }
};
</script>

<style scoped lang="less">
/*组件样式*/
.van-icon,
.van-icon::before {
  .width(30);
  // .height(56);
  // .lineHeight(56);
}

.patient_info_l {
  .van-loading {
    right: -6.4vw;
    top: 2.1vw;
    position: absolute;
    .width(20);
    .height(20);
  }
}

.patient_box_r {
  .van-loading {
    left: -40%;
    top: 2.1vw;
    position: absolute;
    .width(20);
    .height(20);
  }
}

.chatIMDetail_page /deep/ .van-field__control {
  background: @backgroundColorT;
  .borderRadius(8, 8, 8, 8);
  .padding(12, 0, 12, 10);
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 10.67vw !important;
  .fontSize(16);
  .lineHeight(16);
  min-height: 0;
  word-break: break-all;
  word-wrap: break-word;
}

.chatIMDetail_page /deep/ .van-pull-refresh {
  height: 100%;
  overflow: initial;
}

.chatIMDetail_page /deep/ .van-cell.van-field {
  padding: 0;
}

.chatIMDetail_page /deep/ .van-nav-bar__title {
  .lineHeight(52);
}

.chatIMDetail_page /deep/ .van-hairline--top-bottom::after {
  border-width: 0 0;
}

.chatIMDetail_page /deep/ .van-cell-group.van-hairline--top-bottom {
  flex: 1;
  .margin(0, 15, 0, 0);
  .borderRadius(8, 8, 8, 8);
  overflow: hidden;
}

/*页面样式*/

.chatIMDetail_page {
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .header_box {
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
      float: left;
      .width(50);
      .height(44);
      .lineHeight(44);
      .padding(0, 0, 0, 10);

      .back-icon {
        .fontSize(20);
        font-weight: 600;
        color: @titleColor;
      }
    }

    .header-center {
      text-align: center;
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

      .consulting-text {
        .fontSize(14);
        font-weight: 400;
        color: @topRightUpColor;
        .lineHeight(42);
        .margin(0, 0, 0, 5);
      }
    }

    .header-right {
      text-align: right;
      .width(50);
      .padding(0, 12, 0, 0);
      color: @mainColor;
      .fontSize(16);
      font-weight: 500;
      .lineHeight(16);
    }
  }

  .chatIM_content {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: auto; /* winphone8和android4+ */
    -webkit-overflow-scrolling: touch; /* ios5+ */
    background: @backgroundColor;
    padding: 6.4vw 3.2vw 0 3.2vw;

    .tips {
      text-align: center;
      color: @titleColor;
      .fontSize(14);
      .width(129);
      .height(25);
      .lineHeight(25);
      background: #fff;
      border-radius: 1.3vw;
      margin: 0 auto;
      margin-bottom: 1.3vw;
    }
  }

  .chatIM_input_box {
    justify-content: flex-end;
    width: 100%;
    background: #f6f6f6;
    // box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
    z-index: 2;

    .chatIM_input_content {
      .padding(10, 12, 10, 12);
      position: relative;
      min-height: 15.5vw;
      box-sizing: border-box;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      i {
        .fontSize(28);
      }

      .input_option_btn {
        color: @buttonColor;
        margin-right: 2.13vw;
      }

      .more-btn {
        .fontSize(16);
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: @subtitleColor;
        .lineHeight(16);
      }

      .img {
        .width(32);
        .margin(0, 15, 0, 0);
      }
    }

    .option_box {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      flex-wrap: wrap;
      .padding(20, 0, 8, 0);

      li {
        input {
          .width(60);
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
        }

        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        text-align: center;
        align-items: center;
        .margin(0, 10, 12, 21);

        img {
          display: block;
          .width(60);
          .height(60);
          .margin(0, 0, 10, 0);
        }

        span {
          display: inline-block;
          width: 100%;
          text-align: center;
          .fontSize(14);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: @subtitleColor;
          .lineHeight(14);
        }
      }
    }
  }

  .pay-dialog {
    .width(270);
    top: 38%;

    /deep/ .van-dialog__header {
      .padding(20, 0, 0, 0);
      .fontSize(18);
      font-weight: bold;
      color: @titleColor;
      .lineHeight(24);
    }

    /deep/ .van-dialog__content {
      .padding(15, 10, 20, 10);

      .input-box {
        .height(46);
        width: 100%;
        background: @backgroundColor;
        .borderRadius(10, 10, 10, 10);
        .padding(0, 10, 0, 10);
        margin-bottom: 4vw;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        ::-webkit-input-placeholder {
          .fontSize(16);
          .lineHeight(20);
        }
        :-moz-placeholder {
          .fontSize(16);
          .lineHeight(20);
        }
        ::-moz-placeholder {
          .fontSize(16);
          .lineHeight(20);
        }
        :-ms-input-placeholder {
          .fontSize(16);
          .lineHeight(20);
        }

        input {
          flex: 1;
          width: 0;
          .fontSize(16);
          font-weight: 400;
          outline: none;
          background: @backgroundColor;
          border: none;
        }

        div {
          float: right;
          .width(20);
          .margin(0, 0, 0, 15);
          .fontSize(16);
          font-weight: 400;
          color: @titleColor;
          .lineHeight(20);
        }
      }
    }

    .desc {
      .fontSize(14);
      font-weight: 400;
      color: @descriptionColor;
      .lineHeight(20);
    }
  }

  /deep/ .van-overlay {
    z-index: 2000 !important;
  }

  /deep/ .van-number-keyboard {
    z-index: 2001 !important;
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
  margin-bottom: 4.8vw;
  /*align-items: center;*/

  .width68 {
    max-width: 68%;
    display: flex;
    flex-direction: column;
    justify-content: center;

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
        .margin(0, 0, 10, 0);
      }
    }
  }

  & img {
    .width(60);
    .height(60);
    border-radius: 50%;
  }

  .imgStyle {
    .width(150);
    .height(150);
    text-align: left;
    margin-left: 3.2vw;
    border-radius: 0;
    overflow: hidden;

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }

  & p {
    color: @mainColor;
    .fontSize(14);
    font-weight: 400;
    .lineHeight(18);
    max-width: 100%;
    word-break: break-all;
    word-wrap: break-word;
    position: relative;
    user-select: text;
  }

  .patient_info_l {
    // .height(40);
    .fontSize(16);
    background: @mainColor;
    color: @fontOne;
    // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    .borderRadius(0, 10, 10, 10);
    .margin(0, 0, 0, 12);
    .lineHeight(20);
    .padding(10, 15, 10, 15);
  }
}

//录音的gif图
.playRadio {
  width: 3.7vw !important;
  height: 3.7vw !important;
}

.patient_box_r {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  /*align-items: center;*/
  .margin(0, 0, 20, 0);

  .width68 {
    max-width: 68%;
    display: flex;
    align-items: center;
  }

  & img {
    .width(60);
    .height(60);
    border-radius: 50%;
  }

  .imgStyle {
    .width(150);
    .height(150);
    text-align: right;
    //margin-right: 3.2vw;
    border-radius: 0;
    overflow: hidden;

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }

  .imgStyleMe {
    margin-right: 3.2vw;
  }

  & p {
    color: @mainColor;
    .fontSize(14);
    font-weight: 400;
    .lineHeight(18);
    max-width: 100%;
    word-break: break-all;
    word-wrap: break-word;
    position: relative;
    user-select: text;
  }

  .patient_info_l {
    // .height(40);
    .fontSize(16);
    background-color: @backgroundColorT;
    // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    color: @mainColor;
    .borderRadius(10, 0, 10, 10);
    .margin(0, 12, 0, 0);
    .lineHeight(20);
    .padding(10, 15, 10, 15);
  }
}

/*任务面板*/
.patient_task_box {
  margin-left: 3.2vw;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  /*height: 22.67vw;*/
  .width(206);
  /*border-radius: 1.6vw;*/
  /*overflow: hidden;*/
  .borderRadius(10, 0, 10, 10);

  .task_btn {
    .height(44);
    text-align: center;
    background-color: @buttonColor;
    .fontSize(18);
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: @fontOne;
    .lineHeight(42);
    .borderRadius(0, 0, 10, 10);
  }

  h3 {
    background-color: @backgroundColorT;
    color: @buttonColor;
    text-align: center;
    .padding(15, 5, 15, 5);
    .borderRadius(10, 0, 0, 0);

    p {
      .fontSize(16);
      font-weight: 400;
      color: @buttonRightColorBlue;
      .lineHeight(16);
      .margin(15, 0, 0, 0);
    }

    .iconrenwu {
      .fontSize(30);
    }
  }
}

.doctor_response {
  .task_btn {
    opacity: 0.7;
  }
}

.patient_response,
.doctor_response {
  .patient_task_box {
    .borderRadius(0, 10, 10, 10);

    h3 {
      .borderRadius(0, 10, 0, 0);
      .fontSize(16);
      font-weight: 400;
      color: @mainColor;
      .lineHeight(20);
      text-align: left;
    }

    .zixun_price {
      background: @backgroundColorT;
      .padding(0, 15, 15, 12);
      text-align: right;
      .fontSize(14);
      font-weight: 500;
      color: @fontFF3Color;
      .lineHeight(17);
      display: flex;
      align-items: center;
      justify-content: flex-end;

      img {
        .width(19);
        .height(20);
        .margin(0, 10, 0, 0);
      }
    }
  }
}

.patient_response_box .patient_task_box {
  h3 {
    .borderRadius(0, 10, 10, 10) !important;
  }
}

.patient_response,
.doctor_response {
  .patient_task_box {
    .borderRadius(10, 0, 0, 0);

    h3 {
      .borderRadius(10, 0, 0, 0);
      text-align: center;

      img {
        .width(38);
        .height(38);
        display: block;
        margin: 0 auto 3.2vw;
        border-radius: 0;
      }
    }

    .drugs_list {
      opacity: 1;
    }
  }
}

.patient_article_box {
  margin-left: 3.2vw;
  display: flex;
  -webkit-box-orient: vertical;
  flex-direction: column;
  width: 60%;
  .borderRadius(10, 0, 10, 10);
  box-sizing: border-box;
  color: @titleColor;
  .padding(15, 15, 15, 15);
  background-color: @backgroundColorT;
  margin-right: 3.2vw !important;
  margin-left: 0 !important;

  .article_message {
    width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: @mainColor;
    font-weight: 400;
    .fontSize(16);
    font-weight: 400;
    .lineHeight(18);
    .margin(0, 0, 15, 0);
  }

  .article_img {
    width: 100%;
    // .height(86);
    border-radius: 1.6vw;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      border-radius: 0 !important;
    }
  }
}

.patient_box_r .patient_task_box {
  margin-right: 3.2vw !important;
  margin-left: 0 !important;
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
  text-align: left;
}

.patient_box_r.patient_response {
  h4 {
    .padding(16, 19, 16, 19);
    background: #fff;
    text-align: center;
    color: @buttonColor;
    .borderRadius(6, 6, 0, 0);
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
  display: inline-block;
  .width(100);
  height: 3.2vw;
}

.sendDiv {
  .height(40);
  .lineHeight(40);
  text-align: center;
  background: @backgroundColorT;
  .borderRadius(8, 8, 8, 8);
  flex: 1;
  user-select: none; /* Non-prefixed version, currently not supported by any browser */
}

.system_message {
  max-width: 72%;
  min-width: 0;
  margin: 2.4vw auto 4vw;
  text-align: center;
  display: table;
  .padding(5, 10, 5, 10);
  font-size: 3.2vw;
  color: @mainColor;
  // .height(24);
  .lineHeight(18);
  background: #fff;
  border-radius: 1.3vw;
}

.session_sendTime {
  /*padding: 0 0 5.3vw 0;*/
  margin-bottom: 4vw;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 3.2vw;
  color: rgba(155, 155, 155, 1) !important;
}

.patient_box .sendorReciveImg,
.patient_box_r .sendorReciveImg {
  display: block;
  .width(93);
  .height(93);
  .borderRadius(5, 5, 5, 5);
}

.show {
  opacity: 1;
}

.none {
  opacity: 0;
}
</style>
