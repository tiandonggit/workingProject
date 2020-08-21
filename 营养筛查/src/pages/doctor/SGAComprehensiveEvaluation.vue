<!--
* @description
* @fileName SGAComprehensiveEvaluation.vue
* @author weixueyuan
* @date 2020/04/02 16:51:27
!-->
<template>
  <div id="SGAComprehensiveEvaluation">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="sgacall">
      <div class="sgaccont">
        <div class="sgaccont1">
          <div class="sgacconttitle">
            <img src="../../assets/img/sgae1.png" />1.体重变化
          </div>
          <div class="sgaccontxt">
            <span><span class="state" v-if="state1">*</span>患者目前的体重</span
            ><span style="display:flex;justify-content: center;"
              ><input v-model="weight" v-focus /><span>kg</span></span
            >
          </div>
          <div class="sgaccontxt">
            <span><span class="state" v-if="state2">*</span>患者的身高约</span
            ><span style="display:flex;justify-content: center;"
              ><input
                v-model="height"
                style="margin-right: 8px;"
                v-focus
              /><span>cm</span></span
            >
          </div>
          <div class="sgaccontxt">
            <span
              ><span class="state" v-if="state3">*</span
              >一个月前患者的体重约</span
            ><span style="display:flex;justify-content: center;"
              ><input v-model="after1weight" v-focus /><span>kg</span></span
            >
          </div>
          <div class="sgaccontxt">
            <span
              ><span class="state" v-if="state4">*</span
              >六个月前患者的体重约</span
            ><span style="display:flex;justify-content: center;"
              ><input v-model="after6weight" v-focus /><span>kg</span></span
            >
          </div>
          <div class="sgaccontxtx">
            <span class="state" v-if="state5">*</span>体重下降：<span
              >{{ countwei | numFilter }}%</span
            >
          </div>
        </div>
        <div class="sgaccont2">
          <div class="sgaccontxt1">
            <span class="state" v-if="state6">*</span
            >在过去二个星期内，患者的体重是呈现？
          </div>
          <div class="sgaccontxt2">
            <van-radio-group v-model="twoweekweight">
              <van-radio :name="1" icon-size="20px">减少</van-radio>
              <van-radio :name="2" icon-size="20px">不变</van-radio>
              <van-radio :name="4" icon-size="20px">增加</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="sgaccont1">
          <div class="sgacconttitle">
            <img src="../../assets/img/sgae2.png" />2.饮食情况
          </div>
          <div class="sgaccontxt3">
            <span class="state" v-if="state7">*</span
            >(1)过去几个月以来，患者吃食物的量与以往相比？
          </div>
          <div class="sgaccontxt2">
            <van-radio-group v-model="patientcomparefood">
              <van-radio :name="1" icon-size="20px">没有改变</van-radio>
              <van-radio :name="2" icon-size="20px">比以前多</van-radio>
              <van-radio :name="4" icon-size="20px">比以前少</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="sgaccont2">
          <div class="sgaccontxt1">
            <span class="state" v-if="state8">*</span>(2)患者现在只吃？
          </div>
          <div class="sgaccontxt2">
            <van-checkbox-group v-model="patientonlyfood">
              <van-checkbox :name="8">比正常量少的一般食物</van-checkbox>
              <van-checkbox :name="16">一点固体食物</van-checkbox>
              <van-checkbox :name="32">只有流质饮食</van-checkbox>
              <van-checkbox :name="64">只有营养补充品</van-checkbox>
              <van-checkbox :name="128">非常少的任何事物</van-checkbox>
              <van-checkbox :name="256">管灌喂食或有静脉注射营养</van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
        <div class="sgaccont2">
          <div class="sgacconttitle">
            <img src="../../assets/img/sgae3.png" />3.症状
          </div>
          <div class="sgaccontxt3">
            <span class="state" v-if="state9">*</span
            >(1)过去二个星期，患者有下列的问题困扰，使其无法吃的足够。
          </div>
          <div class="sgaccontxt2">
            <van-checkbox-group v-model="twoweekeatques">
              <van-checkbox :name="1" icon-size="20px"
                >没有饮食方面的问题</van-checkbox
              >
              <van-checkbox :name="2" icon-size="20px"
                >没有食欲，就是不想吃</van-checkbox
              >
              <van-checkbox :name="4" icon-size="20px">口干</van-checkbox>
              <van-checkbox :name="8" icon-size="20px">恶心</van-checkbox>
              <van-checkbox :name="16" icon-size="20px">呕吐</van-checkbox>
              <van-checkbox :name="32" icon-size="20px">便秘</van-checkbox>
              <van-checkbox :name="64" icon-size="20px">腹泻</van-checkbox>
              <van-checkbox :name="128" icon-size="20px">口痛</van-checkbox>
              <van-checkbox :name="256" icon-size="20px">容易饱胀</van-checkbox>
              <van-checkbox :name="512" icon-size="20px">吞咽困难</van-checkbox>
              <van-checkbox :name="1024" icon-size="20px"
                >吃起来感觉没有味道，或味道变得奇怪</van-checkbox
              >
              <van-checkbox :name="2048" icon-size="20px"
                >有怪味困扰着我</van-checkbox
              >
              <van-checkbox :name="4096" icon-size="20px">疼痛</van-checkbox>
              <van-checkbox :name="8192" icon-size="20px"
                >其他（例如牙齿、资金等方面）</van-checkbox
              >
            </van-checkbox-group>
          </div>
        </div>
        <div class="sgaccont2">
          <div class="sgacconttitle">
            <img src="../../assets/img/sgae4.png" />4.身体状况
          </div>
          <div class="sgaccontxt3">
            <span class="state" v-if="state10">*</span
            >(1)患者自我评估过去几个月来，身体状况处于
          </div>
          <div class="sgaccontxt2">
            <van-radio-group v-model="recentbodystatus">
              <van-radio :name="1" icon-size="20px"
                >正常，没有任何限制</van-radio
              >
              <van-radio :name="2" icon-size="20px"
                >与平常的我不同，但日常生活起居还能自我料理</van-radio
              >
              <van-radio :name="4" icon-size="20px"
                >感觉不舒服，但躺在床上的时间不会长于半天</van-radio
              >
              <van-radio :name="8" icon-size="20px"
                >只能做少数活动，大多数时间躺在床上或坐在椅子上</van-radio
              >
              <van-radio :name="16" icon-size="20px"
                >绝大多数的时间躺在床上</van-radio
              >
            </van-radio-group>
          </div>
        </div>
        <div class="sgaccont2">
          <div class="sgacconttitle">
            <img src="../../assets/img/sgae6.png" />5.疾病及其与营养需求的关系
          </div>
          <div class="sgaccontxt1">
            <span class="state" v-if="state11">*</span>(1)主要相关诊断<span
              >(*年龄如为65以上该题默认增加1分)</span
            >
          </div>
          <div class="sgaccontxt2">
            <van-checkbox-group v-model="maindiagnosis">
              <van-checkbox :name="1" icon-size="20px">无</van-checkbox>
              <van-checkbox :name="2" icon-size="20px">癌症</van-checkbox>
              <van-checkbox :name="4" icon-size="20px">AIDS</van-checkbox>
              <van-checkbox :name="8" icon-size="20px"
                >肺源性或心源性恶液质</van-checkbox
              >
              <van-checkbox :name="16" icon-size="20px">出现褥疮</van-checkbox>
              <van-checkbox :name="32" icon-size="20px"
                >开放伤口或瘘</van-checkbox
              >
              <van-checkbox :name="64" icon-size="20px">存在创伤</van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
        <div class="sgaccont1">
          <div class="sgacconttitle">
            <img src="../../assets/img/sgae7.png" />6.代谢状态
          </div>
          <div class="sgaccontxt1">
            <span class="state" v-if="state12">*</span>(1)体温状况
          </div>
          <div class="sgaccontxt2">
            <van-radio-group v-model="tempstatus">
              <van-radio :name="1" icon-size="20px">37.2-38.3℃</van-radio>
              <van-radio :name="2" icon-size="20px">38.4-38.8℃</van-radio>
              <van-radio :name="4" icon-size="20px">≥38.8℃</van-radio>
              <van-radio :name="8" icon-size="20px">体温正常</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="sgaccont1">
          <div class="sgaccontxt1">
            <span class="state" v-if="state13">*</span>(2)应激状态持续时间？
          </div>
          <div class="sgaccontxt2">
            <van-radio-group v-model="stressstatetime">
              <van-radio :name="16" icon-size="20px">＜3天</van-radio>
              <van-radio :name="32" icon-size="20px">3天</van-radio>
              <van-radio :name="64" icon-size="20px">＞3天</van-radio>
              <van-radio :name="128" icon-size="20px">无</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="sgaccont2">
          <div class="sgaccontxt1">
            <span class="state" v-if="state14">*</span>(3)强的松使用量？
          </div>
          <div class="sgaccontxt2">
            <van-radio-group v-model="prednisonedosage">
              <van-radio :name="256" icon-size="20px">＜10mg</van-radio>
              <van-radio :name="512" icon-size="20px">10-30mg</van-radio>
              <van-radio :name="1024" icon-size="20px">＞30mg</van-radio>
              <van-radio :name="2048" icon-size="20px">未使用</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="sgaccont3">
          <div class="sgacconttitle">
            <img src="../../assets/img/sgae8.png" />7.体格检查
          </div>
          <div class="sgaccontxt4">
            <span class="state" v-if="state15">*</span
            >请根据检查结果进行选择异常状态
          </div>
          <div class="sgaccontxt2">
            <div class="box">
              <div class="top">
                <div class="left">部位</div>
                <div class="left_right">无异常</div>
                <div class="right_left">轻度</div>
                <div class="right">中度</div>
                <div class="right_right">重度</div>
              </div>
              <div class="bodytit">
                脂肪储存
              </div>
              <div class="body">
                <div class="body_box">
                  <div class="left">颊部脂肪垫</div>
                  <van-radio-group
                    v-model="buccalfatpad"
                    direction="horizontal"
                  >
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">三头肌皮褶厚度</div>
                  <van-radio-group v-model="tsft" direction="horizontal">
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">下肋脂肪厚度</div>
                  <van-radio-group
                    v-model="fatthickness"
                    direction="horizontal"
                  >
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
              </div>
              <div class="bodytit">
                肌肉情况
              </div>
              <div class="body">
                <div class="body_box">
                  <div class="left">颞部(颞肌)</div>
                  <van-radio-group
                    v-model="temporalpart"
                    direction="horizontal"
                  >
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">锁骨部位(胸三角肌)</div>
                  <van-radio-group
                    v-model="collarbonepart"
                    direction="horizontal"
                  >
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">肩膀(三角肌)</div>
                  <van-radio-group
                    v-model="shoulderpart"
                    direction="horizontal"
                  >
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">骨间肌肉</div>
                  <van-radio-group
                    v-model="interosseousmuscles"
                    direction="horizontal"
                  >
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">肩胛部(背阔肌、斜方肌、三角肌)</div>
                  <van-radio-group
                    v-model="scapularpart"
                    direction="horizontal"
                  >
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">大腿(四头肌)</div>
                  <van-radio-group v-model="legpart" direction="horizontal">
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
              </div>
              <div class="bodytit">
                水分情况
              </div>
              <div class="body">
                <div class="body_box">
                  <div class="left">踝水肿</div>
                  <van-radio-group v-model="ankleedema" direction="horizontal">
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">胫骨水肿</div>
                  <van-radio-group v-model="tibiaedema" direction="horizontal">
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
                <div class="body_box">
                  <div class="left">腹水</div>
                  <van-radio-group v-model="ascites" direction="horizontal">
                    <van-radio class="left_right" :name="0"></van-radio>
                    <van-radio class="right_left" :name="1"></van-radio>
                    <van-radio class="right" :name="2"></van-radio>
                    <van-radio class="right_right" :name="3"></van-radio>
                  </van-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sgacbut" @click="$throttle(sgacbut)">提交</div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast, Dialog, Field } from "vant";
import { mapState } from "vuex";

export default {
  name: "SGAComprehensiveEvaluation",
  data() {
    return {
      title: "SGA综合评定",
      customTitle: "营养诊断",
      weight: "",
      height: "",
      after1weight: "",
      after6weight: "",
      weightlossperc: "",
      twoweekweight: "",
      patientcomparefood: "",
      recentbodystatus: "",
      tempstatus: "",
      stressstatetime: "",
      prednisonedosage: "",
      buccalfatpad: "",
      tsft: "",
      fatthickness: "",
      temporalpart: "",
      collarbonepart: "",
      shoulderpart: "",
      interosseousmuscles: "",
      scapularpart: "",
      legpart: "",
      ankleedema: "",
      tibiaedema: "",
      ascites: "",
      patientonlyfood: [],
      twoweekeatques: [],
      maindiagnosis: [],
      state1: false,
      state2: false,
      state3: false,
      state4: false,
      state5: false,
      state6: false,
      state7: false,
      state8: false,
      state9: false,
      state10: false,
      state11: false,
      state12: false,
      state13: false,
      state14: false,
      state15: false,
    };
  },

  created() {
    this.selsga();
  },

  components: {
    commonHeader,
  },

  computed: {
    ...mapState(["Patient"]),
    countwei() {
      this.weightlossperc =
        ((this.after6weight - this.weight) / this.after6weight) * 100;
      if (this.after6weight && this.weight) {
        console.log();
        return this.weightlossperc;
      } else {
        return 0;
      }
    },
  },

  mounted() {},

  methods: {
    selsga() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectSGA",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            needStr: 0,
          },
        })
        .then((res) => {
          var arr = Object.keys(res.data.data);
          if (arr.length > 0) {
            this.weight = res.data.data.weight;
            this.height = res.data.data.height;
            this.after1weight = res.data.data.after1weight;
            this.after6weight = res.data.data.after6weight;
            this.weightlossperc = res.data.data.weightlossperc;
            this.twoweekweight = res.data.data.twoweekweight;
            this.patientcomparefood = res.data.data.patientcomparefood;
            if ((res.data.data.patientonlyfood & 8) != 0) {
              this.patientonlyfood.push(8);
            }
            if ((res.data.data.patientonlyfood & 16) != 0) {
              this.patientonlyfood.push(16);
            }
            if ((res.data.data.patientonlyfood & 32) != 0) {
              this.patientonlyfood.push(32);
            }
            if ((res.data.data.patientonlyfood & 64) != 0) {
              this.patientonlyfood.push(64);
            }
            if ((res.data.data.patientonlyfood & 128) != 0) {
              this.patientonlyfood.push(128);
            }
            if ((res.data.data.patientonlyfood & 256) != 0) {
              this.patientonlyfood.push(256);
            }
            if ((res.data.data.twoweekeatques & 1) != 0) {
              this.twoweekeatques.push(1);
            }
            if ((res.data.data.twoweekeatques & 2) != 0) {
              this.twoweekeatques.push(2);
            }
            if ((res.data.data.twoweekeatques & 4) != 0) {
              this.twoweekeatques.push(4);
            }
            if ((res.data.data.twoweekeatques & 8) != 0) {
              this.twoweekeatques.push(8);
            }
            if ((res.data.data.twoweekeatques & 16) != 0) {
              this.twoweekeatques.push(16);
            }
            if ((res.data.data.twoweekeatques & 32) != 0) {
              this.twoweekeatques.push(32);
            }
            if ((res.data.data.twoweekeatques & 64) != 0) {
              this.twoweekeatques.push(64);
            }
            if ((res.data.data.twoweekeatques & 128) != 0) {
              this.twoweekeatques.push(128);
            }
            if ((res.data.data.twoweekeatques & 256) != 0) {
              this.twoweekeatques.push(256);
            }
            if ((res.data.data.twoweekeatques & 512) != 0) {
              this.twoweekeatques.push(512);
            }
            if ((res.data.data.twoweekeatques & 1024) != 0) {
              this.twoweekeatques.push(1024);
            }
            this.recentbodystatus = res.data.data.recentbodystatus;
            if ((res.data.data.maindiagnosis & 1) != 0) {
              this.maindiagnosis.push(1);
            }
            if ((res.data.data.maindiagnosis & 2) != 0) {
              this.maindiagnosis.push(2);
            }
            if ((res.data.data.maindiagnosis & 4) != 0) {
              this.maindiagnosis.push(4);
            }
            if ((res.data.data.maindiagnosis & 8) != 0) {
              this.maindiagnosis.push(8);
            }
            if ((res.data.data.maindiagnosis & 16) != 0) {
              this.maindiagnosis.push(16);
            }
            if ((res.data.data.maindiagnosis & 32) != 0) {
              this.maindiagnosis.push(32);
            }
            if ((res.data.data.maindiagnosis & 64) != 0) {
              this.maindiagnosis.push(64);
            }
            this.tempstatus = res.data.data.tempstatus;
            this.stressstatetime = res.data.data.stressstatetime;
            this.prednisonedosage = res.data.data.prednisonedosage;
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
          }
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
    sgacbut() {
      console.log(this.weight);
      // console.log(
      //   this.weight,
      //   this.height,
      //   this.after1weight,
      //   this.after6weight,
      //   this.weightlossperc,
      //   this.twoweekweight,
      //   this.patientcomparefood,
      //   this.patientonlyfood,
      //   this.twoweekeatques,
      //   this.recentbodystatus,
      //   this.maindiagnosis,
      //   this.tempstatus,
      //   this.stressstatetime,
      //   this.prednisonedosage,
      //   this.buccalfatpad,
      //   this.tsft,
      //   this.fatthickness,
      //   this.temporalpart,
      //   this.collarbonepart,
      //   this.shoulderpart,
      //   this.interosseousmuscles,
      //   this.scapularpart,
      //   this.legpart,
      //   this.ankleedema,
      //   this.tibiaedema,
      //   this.ascites
      // );
      if (
        this.weight &&
        this.height &&
        this.after1weight &&
        this.after6weight &&
        this.weightlossperc &&
        this.twoweekweight &&
        this.patientcomparefood &&
        this.patientonlyfood &&
        this.twoweekeatques &&
        this.recentbodystatus &&
        this.maindiagnosis &&
        this.tempstatus &&
        this.stressstatetime &&
        this.prednisonedosage &&
        typeof this.buccalfatpad == "number" &&
        typeof this.tsft == "number" &&
        typeof this.fatthickness == "number" &&
        typeof this.temporalpart == "number" &&
        typeof this.collarbonepart == "number" &&
        typeof this.shoulderpart == "number" &&
        typeof this.interosseousmuscles == "number" &&
        typeof this.scapularpart == "number" &&
        typeof this.legpart == "number" &&
        typeof this.ankleedema == "number" &&
        typeof this.tibiaedema == "number" &&
        typeof this.ascites == "number"
      ) {
        this.butnext();
      } else {
        Dialog.confirm({
          title: "提示",
          message: "SGA综合评估需全部完善方可生成结果是否继续提交",
        })
          .then(() => {
            this.butnext();
          })
          .catch(() => {
            // on cancel\
            if (!this.weight) {
              this.state1 = true;
            }
            if (!this.height) {
              this.state2 = true;
            }
            if (!this.after1weight) {
              this.state3 = true;
            }
            if (!this.after6weight) {
              this.state4 = true;
            }
            if (!this.weightlossperc) {
              this.state5 = true;
            }
            if (!this.twoweekweight) {
              this.state6 = true;
            }
            if (!this.patientcomparefood) {
              this.state7 = true;
            }
            if (this.patientonlyfood.length == 0) {
              this.state8 = true;
            }
            if (this.twoweekeatques.length == 0) {
              this.state9 = true;
            }
            if (!this.recentbodystatus) {
              this.state10 = true;
            }
            if (this.maindiagnosis.length == 0) {
              this.state11 = true;
            }
            if (!this.tempstatus) {
              this.state12 = true;
            }
            if (!this.stressstatetime) {
              this.state13 = true;
            }
            if (!this.prednisonedosage) {
              this.state14 = true;
            }
            if (
              typeof this.buccalfatpad == "string" &&
              typeof this.tsft == "string" &&
              typeof this.fatthickness == "string" &&
              typeof this.temporalpart == "string" &&
              typeof this.collarbonepart == "string" &&
              typeof this.shoulderpart == "string" &&
              typeof this.interosseousmuscles == "string" &&
              typeof this.scapularpart == "string" &&
              typeof this.legpart == "string" &&
              typeof this.ankleedema == "string" &&
              typeof this.tibiaedema == "string" &&
              typeof this.ascites == "string"
            ) {
              this.state15 = true;
            }
          });
      }
    },
    butnext() {
      var arr = this.patientonlyfood.map(Number);
      var patientonlyfood = 0;
      for (var i = arr.length - 1; i >= 0; i--) {
        patientonlyfood += arr[i];
      }
      if (patientonlyfood == 0) {
        patientonlyfood = "";
      }
      var arrx = this.twoweekeatques.map(Number);
      var twoweekeatques = 0;
      for (var j = arrx.length - 1; j >= 0; j--) {
        twoweekeatques += arrx[j];
      }
      if (twoweekeatques == 0) {
        twoweekeatques = "";
      }
      var arry = this.maindiagnosis.map(Number);
      var maindiagnosis = 0;
      for (var k = arry.length - 1; k >= 0; k--) {
        maindiagnosis += arry[k];
      }
      if (maindiagnosis == 0) {
        maindiagnosis = "";
      }
      this.$http
        .request({
          method: "post",
          url: "/NNutritionAssessmentController/insertOrUpdate",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            id: window.sessionStorage.getItem("id"),
            type: 1,
            prestype: this.Patient.prestype,
            weight: this.weight,
            height: this.height,
            after1weight: this.after1weight,
            after6weight: this.after6weight,
            weightlossperc: this.weightlossperc,
            twoweekweight: this.twoweekweight,
            patientcomparefood: this.patientcomparefood,
            patientonlyfood: patientonlyfood,
            twoweekeatques: twoweekeatques,
            recentbodystatus: this.recentbodystatus,
            maindiagnosis: maindiagnosis,
            tempstatus: this.tempstatus,
            stressstatetime: this.stressstatetime,
            prednisonedosage: this.prednisonedosage,
            buccalfatpad: this.buccalfatpad,
            tsft: this.tsft,
            fatthickness: this.fatthickness,
            temporalpart: this.temporalpart,
            collarbonepart: this.collarbonepart,
            shoulderpart: this.shoulderpart,
            interosseousmuscles: this.interosseousmuscles,
            scapularpart: this.scapularpart,
            legpart: this.legpart,
            ankleedema: this.ankleedema,
            tibiaedema: this.tibiaedema,
            ascites: this.ascites,
          },
        })
        .then((res) => {
          if (res.data.success) {
            Toast("提交成功");
            this.$router.go(-1);
          } else {
            Toast("提交失败");
          }
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },

    weightInput(e) {
      console.log(e);
      // console.log(e.split("."));
      e = e.replace(/[^0-9]+/g, "");
      // this.weight = e.split(".")[0];
      e = e.substring(0, 3);
      this.weight = e;
      // let str = "" + this.weight;
      // if (str.indexOf(".") !== -1) {
      //   console.log(str)
      //   let arr = str.split("");
      //   console.log(arr)
      //   arr.splice(arr.length - 1);
      //   let str2 = arr.join("");
      //   this.weight = +str2;
      // }
    },
    heightInput() {
      let str = "" + this.height;
      if (str.indexOf(".") !== -1) {
        let arr = str.split("");
        arr.splice(arr.length - 1);
        let str2 = arr.join("");
        this.height = +str2;
      }
    },
    after1weightInput() {
      let str = "" + this.after1weight;
      if (str.indexOf(".") !== -1) {
        let arr = str.split("");
        arr.splice(arr.length - 1);
        let str2 = arr.join("");
        this.after1weight = +str2;
      }
    },
    after6weightInput() {
      let str = "" + this.after6weight;
      if (str.indexOf(".") !== -1) {
        let arr = str.split("");
        arr.splice(arr.length - 1);
        let str2 = arr.join("");
        this.after6weight = +str2;
      }
    },
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el, validateStr) {
        el.addEventListener("input", function() {
          //进行验证
          checkedfun(el);
        });
        function checkedfun(el) {
          let reg = new RegExp("^[0-9]*$");
          if (!reg.test(el.value)) {
            el.value = el.value.replace(/[^0-9]+/g, "");
            el.dispatchEvent(new Event("input")); //调用input事件使vue v-model绑定更新
          }
        }
      },
    },
  },
  filters: {
    numFilter(value) {
      let realVal = "";
      if (!isNaN(value) && value !== "") {
        let tempVal = parseFloat(value).toFixed(3);
        realVal = tempVal.substring(0, tempVal.length - 1);
      } else {
        realVal = " ";
      }
      return realVal;
    },
  },
};
</script>

<style lang="less" scoped>
.state {
  color: #0069ff;
}
.van-radio,
.van-checkbox {
  margin-top: 15px;
  height: auto;
}
.van-radio__icon,
.van-radio__icon--round {
  border-color: #979797;
}

#SGAComprehensiveEvaluation {
  padding: 0px;
  font-size: 16px;
  .sgaccont3 {
    padding: 0;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .sgaccontxt4 {
    padding: 15px 10px 0px 10px;
  }
  .box {
    width: 351px;
    margin-top: 15px;
    font-size: 16px;
    color: #666;
    .top {
      color: #333;
      display: flex;
      line-height: 46px;
      border-top: 1px dashed rgba(0, 0, 0, 0.1);
      //   border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    }
    .bodytit {
      color: #333;
      height: 46px;
      line-height: 46px;
      font-weight: bold;
      padding-left: 10px;
      border-top: 1px dashed rgba(0, 0, 0, 0.1);
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
      text-align: left;
      span {
        color: #0069ff;
      }
    }
    .body:last-child {
      padding-bottom: 0;
    }
    .body {
      padding-bottom: 15px;
    }
    .body .body_box {
      display: flex;
      line-height: 20px;
      padding: 15px 0 0 0;
      .van-radio-group {
        // width: 219px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .van-radio {
          margin: 0;
        }
      }
    }
    // div {
    //   text-align: center;
    // }
    .left {
      width: 132px;
      text-align: left;
      padding-left: 8px;
    }
    .left_right {
      width: 63px;
      text-align: center;
    }
    .right_left {
      width: 52px;
      text-align: center;
    }
    .right {
      width: 52px;
      text-align: center;
    }
    .right_right {
      width: 52px;
      text-align: center;
    }
  }
  .sgaccont {
    height: auto;
    background-color: #fff;
    border-radius: 10px;
    .sgaccont1 {
      padding: 0 10px;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    }
    .sgacconttitle {
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
    .sgaccontxt {
      margin-top: 19px;
      line-height: 25px;
      display: flex;
      justify-content: space-between;
      .van-cell {
        width: 50px;
        height: 25px;
        line-height: 25px;
        margin-right: 10px;
        text-align: center;
        padding: 0px;
        font-size: 16px;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      input {
        width: 50px;
        height: 25px;
        line-height: 25px;
        margin-right: 10px;
        text-align: center;
        // color: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      input::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.1);
      }
      input::-moz-input-placeholder {
        color: rgba(0, 0, 0, 0.1);
      }
      input::-ms-input-placeholder {
        color: rgba(0, 0, 0, 0.1);
      }
    }
    .sgaccontxtx {
      margin-top: 19px;
      padding-bottom: 14px;
      span {
        color: #0069ff;
      }
    }
    .sgaccont2 {
      padding: 0 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .sgaccontxt1 {
      margin-top: 15px;
      span {
        color: #0069ff;
        font-size: 14px;
      }
    }
    .sgaccontxt2 {
      padding-bottom: 15px;
      color: #0069ff;
    }
    .sgaccontxt3 {
      padding-top: 15px;
      line-height: 20px;
    }
    .sgaccontpd {
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
  }
  .sgaccontxt2 {
    /deep/ .van-icon {
      width: 20px;
      height: 20px;
    }
    /deep/ .van-radio__icon--checked .van-icon {
      width: 20px;
      height: 20px;
      border-color: #979797;
      background: linear-gradient(
        223deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%
      );
    }
    /deep/ .van-radio__label {
      .fontSize(16);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @fontColor66;
      line-height: 20px;
    }
    /deep/ .van-checkbox__label {
      .fontSize(16);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @fontColor66;
      line-height: 20px;
    }
  }

  .sgacres {
    padding: 20px 0px;
    font-size: 18px;
    color: #0069ff;
    font-weight: bold;
    text-align: center;
    background-color: #fff;
    border-radius: 10px;
    margin-top: 15px;
  }
  .sgacseparate {
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
  .sgacall {
    width: 351px;
    height: 100%;
    margin: 0 auto;
    padding-top: 48px;
  }
  .sgacbut {
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
