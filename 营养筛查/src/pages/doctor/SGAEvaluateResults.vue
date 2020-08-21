<!--
* @description
* @fileName SGA综合评估结果.vue
* @author weixueyuan
* @date 2020/04/01 09:24:29
!-->
<template>
  <div id="SGAEvaluateResults">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="sgaeall">
      <div class="sgaecont">
        <div class="sgaecont1">
          <div class="sgaeconttitle">
            <img src="../../assets/img/sgae1.png" />1.体重变化
          </div>
          <div class="sgaecontxt">
            <span>患者目前的体重</span
            ><span style="display:flex;justify-content: center;"
              ><span style="margin-right:10px;">{{ weight }}</span
              ><span>kg</span></span
            >
          </div>
          <div class="sgaecontxt">
            <span>患者的身高约</span
            ><span style="display:flex;justify-content: center;"
              ><span style="margin-right:10px;">{{ height }}</span
              ><span>cm</span></span
            >
          </div>
          <div class="sgaecontxt">
            <span>一个月前我的体重约</span
            ><span style="display:flex;justify-content: center;"
              ><span style="margin-right:10px;">{{ after1weight }}</span
              ><span>kg</span></span
            >
          </div>
          <div class="sgaecontxt">
            <span>六个月前我的体重约</span
            ><span style="display:flex;justify-content: center;"
              ><span style="margin-right:10px;">{{ after6weight }}</span
              ><span>kg</span></span
            >
          </div>
          <div class="sgaecontxtx">
            体重下降：<span>{{ weightlossperc }}%</span>
          </div>
        </div>
        <div class="sgaecont2">
          <div class="sgaecontxt1">在过去二个星期内，您的体重是呈现？</div>
          <div class="sgaecontxt2">{{ twoweekweightStr }}</div>
        </div>
        <div class="sgaecont1">
          <div class="sgaeconttitle">
            <img src="../../assets/img/sgae2.png" />2.饮食情况
          </div>
          <div class="sgaecontxt3">
            (1)过去几个月以来，患者吃食物的量与以往相比？
          </div>
          <div class="sgaecontxt2">{{ patientcomparefoodStr }}</div>
        </div>
        <div class="sgaecont2">
          <div class="sgaecontxt1">(2)患者现在只吃？</div>
          <div
            class="sgaecontxt4"
            v-for="(item, index) in patientonlyfoodStr"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
        <div class="sgaecont2">
          <div class="sgaeconttitle">
            <img src="../../assets/img/sgae3.png" />3.症状
          </div>
          <div class="sgaecontxt3">
            (1)过去二个星期，患者有下列的问题困扰，使其无法吃的足够。
          </div>
          <div
            class="sgaecontxt4"
            v-for="(item, index) in twoweekeatquesStr"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
        <div class="sgaecont2">
          <div class="sgaeconttitle">
            <img src="../../assets/img/sgae4.png" />4.身体状况
          </div>
          <div class="sgaecontxt1">
            (1)患者自我评估过去几个月来，身体状况处于
          </div>
          <div class="sgaecontxt2">{{ recentbodystatusStr }}</div>
        </div>
        <div class="sgaecontpd">
          A项评分：<span>{{ proAScore }}</span>
        </div>
      </div>
      <div class="sgaeseparate">
        <img src="../../assets/img/sgae5.png" /><img
          src="../../assets/img/sgae5.png"
        />
      </div>
      <div class="sgaecont">
        <div class="sgaecont2">
          <div class="sgaeconttitle">
            <img src="../../assets/img/sgae6.png" />5.疾病及其与营养需求的关系
          </div>
          <div class="sgaecontxt1">
            (1)主要相关诊断<span>(*该题有年龄评分超过65默认1分)</span>
          </div>
          <div
            class="sgaecontxt4"
            v-for="(item, index) in maindiagnosisStr"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
        <div class="sgaecontpd">
          B项评分：<span>{{ ProBScore }}</span>
        </div>
      </div>
      <div class="sgaeseparate">
        <img src="../../assets/img/sgae5.png" /><img
          src="../../assets/img/sgae5.png"
        />
      </div>
      <div class="sgaecont">
        <div class="sgaecont2">
          <div class="sgaeconttitle">
            <img src="../../assets/img/sgae7.png" />6.代谢状态
          </div>
          <div class="sgaecontxt1">(1)体温状况</div>
          <div class="sgaecontxt2">{{ tempstatusStr }}</div>
          <div class="sgaecontxt1">(2)应激状态持续时间</div>
          <div class="sgaecontxt2">{{ stressstatetimeStr }}</div>
          <div class="sgaecontxt1">(3)强的松使用量</div>
          <div class="sgaecontxt2">{{ prednisonedosageStr }}</div>
        </div>
        <div class="sgaecontpd">
          <span v-if="ProCScore == 0" style="margin-right:10px;">无应激</span
          ><span v-else-if="ProCScore == 1" style="margin-right:10px;"
            >轻度应激</span
          ><span v-else-if="ProCScore == 2" style="margin-right:10px;"
            >中度应激</span
          ><span v-else-if="ProCScore == 3" style="margin-right:10px;"
            >高度应激</span
          >C项评分：<span>{{ ProCScore }}</span>
        </div>
      </div>
      <div class="sgaeseparate">
        <img src="../../assets/img/sgae5.png" /><img
          src="../../assets/img/sgae5.png"
        />
      </div>
      <div class="sgaecont">
        <div class="sgaecont2" style="border:none;">
          <div class="sgaeconttitle">
            <img src="../../assets/img/sgae8.png" />7.体格检查
          </div>
        </div>
        <div class="sgaecont3">
          <div class="sgaecont3tit">脂肪储存</div>
          <div class="sgaecont3txt">
            <span>颊部脂肪垫</span
            ><span v-if="buccalfatpad == 0" class="cblue">无异常</span
            ><span v-else-if="buccalfatpad == 1" class="cgreen">轻度异常</span
            ><span v-else-if="buccalfatpad == 2" class="cred">中度异常</span
            ><span v-else-if="buccalfatpad == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>三头肌皮褶厚度</span
            ><span v-if="tsft == 0" class="cblue">无异常</span
            ><span v-else-if="tsft == 1" class="cgreen">轻度异常</span
            ><span v-else-if="tsft == 2" class="cred">中度异常</span
            ><span v-else-if="tsft == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>下肋脂肪厚度</span
            ><span v-if="fatthickness == 0" class="cblue">无异常</span
            ><span v-else-if="fatthickness == 1" class="cgreen">轻度异常</span
            ><span v-else-if="fatthickness == 2" class="cred">中度异常</span
            ><span v-else-if="fatthickness == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3tit">肌肉情况</div>
          <div class="sgaecont3txt">
            <span>颞部(颞肌)</span
            ><span v-if="temporalpart == 0" class="cblue">无异常</span
            ><span v-else-if="temporalpart == 1" class="cgreen">轻度异常</span
            ><span v-else-if="temporalpart == 2" class="cred">中度异常</span
            ><span v-else-if="temporalpart == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>锁骨部位(胸三角肌)</span
            ><span v-if="collarbonepart == 0" class="cblue">无异常</span
            ><span v-else-if="collarbonepart == 1" class="cgreen">轻度异常</span
            ><span v-else-if="collarbonepart == 2" class="cred">中度异常</span
            ><span v-else-if="collarbonepart == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>肩膀(三角肌)</span
            ><span v-if="shoulderpart == 0" class="cblue">无异常</span
            ><span v-else-if="shoulderpart == 1" class="cgreen">轻度异常</span
            ><span v-else-if="shoulderpart == 2" class="cred">中度异常</span
            ><span v-else-if="shoulderpart == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>骨间肌肉</span
            ><span v-if="interosseousmuscles == 0" class="cblue">无异常</span
            ><span v-else-if="interosseousmuscles == 1" class="cgreen"
              >轻度异常</span
            ><span v-else-if="interosseousmuscles == 2" class="cred"
              >中度异常</span
            ><span v-else-if="interosseousmuscles == 3" class="crred"
              >重度异常</span
            >
          </div>
          <div class="sgaecont3txt">
            <span>肩胛部(背阔肌、斜方肌、三角肌)</span
            ><span v-if="scapularpart == 0" class="cblue">无异常</span
            ><span v-else-if="scapularpart == 1" class="cgreen">轻度异常</span
            ><span v-else-if="scapularpart == 2" class="cred">中度异常</span
            ><span v-else-if="scapularpart == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>大腿(四头肌)</span
            ><span v-if="legpart == 0" class="cblue">无异常</span
            ><span v-else-if="legpart == 1" class="cgreen">轻度异常</span
            ><span v-else-if="legpart == 2" class="cred">中度异常</span
            ><span v-else-if="legpart == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3tit">水分情况</div>
          <div class="sgaecont3txt">
            <span>踝水肿</span
            ><span v-if="ankleedema == 0" class="cblue">无异常</span
            ><span v-else-if="ankleedema == 1" class="cgreen">轻度异常</span
            ><span v-else-if="ankleedema == 2" class="cred">中度异常</span
            ><span v-else-if="ankleedema == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>胫骨水肿</span
            ><span v-if="tibiaedema == 0" class="cblue">无异常</span
            ><span v-else-if="tibiaedema == 1" class="cgreen">轻度异常</span
            ><span v-else-if="tibiaedema == 2" class="cred">中度异常</span
            ><span v-else-if="tibiaedema == 3" class="crred">重度异常</span>
          </div>
          <div class="sgaecont3txt">
            <span>腹水</span
            ><span v-if="ascites == 0" class="cblue">无异常</span
            ><span v-else-if="ascites == 1" class="cgreen">轻度异常</span
            ><span v-else-if="ascites == 2" class="cred">中度异常</span
            ><span v-else-if="ascites == 3" class="crred">重度异常</span>
          </div>
        </div>
        <div class="sgaecontpd">
          D项评分：<span>{{ ProDScore }}</span>
        </div>
      </div>
      <div class="sgaeres">评定结果：{{ word }}</div>
      <div class="sgaebut" @click="$throttle(toback)">确认返回</div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast } from "vant";
export default {
  name: "SGAEvaluateResults",
  data() {
    return {
      title: "SGA综合评定结果详情",
      customTitle: "营养诊断",
      weight: 0,
      height: 0,
      after1weight: 0,
      after6weight: 0,
      weightlossperc: 0,
      twoweekweightStr: "",
      patientcomparefoodStr: "",
      patientonlyfoodStr: [],
      twoweekeatquesStr: [],
      recentbodystatusStr: "",
      maindiagnosisStr: "",
      tempstatusStr: "",
      stressstatetimeStr: "",
      prednisonedosageStr:"",
      buccalfatpad: 0,
      tsft: 0,
      fatthickness: 0,
      temporalpart: 0,
      collarbonepart: 0,
      shoulderpart: 0,
      interosseousmuscles: 0,
      scapularpart: 0,
      legpart: 0,
      ankleedema: 0,
      tibiaedema: 0,
      ascites: 0,
      word: ""
    };
  },

  components: {
    commonHeader
  },

  created() {
    this.selsgaer();
    this.word = this.$route.query.word;
  },

  computed: {},

  mounted() {},

  methods: {
    toback() {
      this.$router.go(-1);
    },
    selsgaer() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectSGA",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            needStr: 1,
          },
        })
        .then((res) => {
          this.weight = res.data.data.weight;
          this.height = res.data.data.height;
          this.after1weight = res.data.data.after1weight;
          this.after6weight = res.data.data.after6weight;
          this.weightlossperc = res.data.data.weightlossperc;
          this.twoweekweightStr = res.data.data.twoweekweightStr;
          this.patientcomparefoodStr = res.data.data.patientcomparefoodStr;
          this.patientonlyfoodStr = res.data.data.patientonlyfoodStr.split(
            "||"
          );
          this.twoweekeatquesStr = res.data.data.twoweekeatquesStr.split("||");
          this.recentbodystatusStr = res.data.data.recentbodystatusStr;
          this.maindiagnosisStr = res.data.data.maindiagnosisStr.split("||");
          this.tempstatusStr = res.data.data.tempstatusStr;
          this.stressstatetimeStr = res.data.data.stressstatetimeStr;
          this.prednisonedosageStr = res.data.data.prednisonedosageStr;
          this.buccalfatpad = res.data.data.buccalfatpad;
          this.tsft = res.data.data.tsft;
          this.fatthickness = res.data.data.fatthickness;
          this.temporalpart = res.data.data.temporalpart;
          this.collarbonepart = res.data.data.collarbonepart;
          this.shoulderpart = res.data.data.shoulderpart;
          this.interosseousmuscles = res.data.data.interosseousmuscles;
          this.scapularpart = res.data.data.scapularpart;
          this.legpart = res.data.data.legpart;
          this.ankleedema = res.data.data.ankleedema;
          this.tibiaedema = res.data.data.tibiaedema;
          this.ascites = res.data.data.ascites;
          this.proAScore = res.data.data.proAScore;
          this.ProBScore = res.data.data.ProBScore;
          this.ProCScore = res.data.data.ProCScore;
          this.ProDScore = res.data.data.ProDScore;
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
  },
};
</script>

<style lang="less" scoped>
#SGAEvaluateResults {
  padding: 0px;
  font-size: 16px;
  .cblue {
    color: #0069ff;
  }
  .cgreen {
    color: #00cb5f;
  }
  .cred {
    color: #ff5900;
  }
  .crred {
    color: #ff3000;
  }
  .sgaecont {
    height: auto;
    background-color: #fff;
    border-radius: 10px;
    .sgaecont1 {
      padding: 0 10px;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    }
    .sgaeconttitle {
      padding-top: 14px;
      line-height: 20px;
      color: #333;
      font-weight: bold;
      display: flex;
      justify-content: center;
    }
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    .sgaecontxt {
      margin-top: 19px;
      display: flex;
      justify-content: space-between;
    }
    .sgaecontxtx {
      margin-top: 19px;
      padding-bottom: 14px;
      span {
        color: #0069ff;
      }
    }
    .sgaecont2 {
      padding: 0 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .sgaecontxt1 {
      margin-top: 15px;
      span {
        color: #0069ff;
        font-size: 14px;
      }
    }
    .sgaecontxt2 {
      padding-top: 15px;
      padding-bottom: 15px;
      color: #0069ff;
    }
    .sgaecontxt3 {
      padding-top: 15px;
      line-height: 20px;
    }
    .sgaecontxt4 {
      color: #0069ff;
      padding-top: 15px;
    }
    .sgaecontxt4:last-child {
      padding-bottom: 15px;
    }
    .sgaecontpd {
      padding: 15px 0px;
      display: flex;
      justify-content: center;
      text-align: center;
      font-weight: bold;
      span {
        color: #0069ff;
        font-weight: bold;
      }
    }
    .sgaecont3 {
      padding: 5px 10px 15px 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .sgaecont3tit {
        margin-top: 15px;
        font-weight: bold;
        color: #333;
      }
      .sgaecont3txt {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
      }
    }
  }
  .sgaeres {
    padding: 20px 0px;
    font-size: 18px;
    color: #0069ff;
    font-weight: bold;
    text-align: center;
    background-color: #fff;
    border-radius: 10px;
    margin-top: 15px;
  }
  .sgaeseparate {
    width: 271px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: -12px;
    margin-bottom: -12px;
    img {
      width: 8px;
      height: 39px;
    }
  }
  .sgaeall {
    width: 351px;
    height: 100%;
    margin: 0 auto;
    padding-top: 48px;
  }
  .sgaebut {
    width: 351px;
    height: 44px;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
    line-height: 44px;
    background: linear-gradient(
      225deg,
      rgba(1, 128, 255, 1) 0%,
      rgba(0, 105, 255, 1) 100%
    );
    border-radius: 10px;
    margin-top: 20px;
  }
}
</style>
