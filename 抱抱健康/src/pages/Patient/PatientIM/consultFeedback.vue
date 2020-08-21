/**
* @Description: 患者付费咨询反馈弹窗
* @Author: 侯湃
* @Date: 2020/5/22
*/
<template>
  <div class="consultFeedback_page">
    <div class="consultFeedback_box">
      <div class="desc_box">
        <p>本次付费咨询的问题是否得到满意的解答?</p>
        <p><span>{{formatedCountTime}}后</span>未确认结果</p>
        <p>将自动结束本次付费咨询</p>
      </div>
      <div class="btn_box">
        <div class="btn notSatisfied_btn" @click.stop="submitConsultFeedback(0)">不满意</div>
        <div class="btn satisfied_btn" @click.stop="submitConsultFeedback(1)">满意</div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "consultFeedback",
    props: {
      timeStamp: {
        type: Number,
        default() {
          return new Date().getTime();
        }
      },
      payConsultParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        formatedCountTime: "00分00秒",
        countDownTimer: null // 反馈结果倒计时
      };
    },
    methods: {
      /**
       * @desc: 患者付费咨询反馈
       * @params: type 1 --不满意 2-- 满意
       * @author: houpai
       * **/
      submitConsultFeedback(type) {
        this.$throttle(()=>{
          this.$emit("submitConsultFeedback",type);
        })
      },
      /**
       * @desc: 患者反馈倒计时
       * @params: time
       * @author: houpai
       * **/
      countTime(time, out = 60*60) {
        let formatedTime = "00分00秒";
        let now = new Date().getTime();
        let endDate = new Date(time.replace(/-/g, "/"));
        let end = endDate.getTime() + out * 1000;
        let leftTime = end - now;
        if (leftTime > 0) {
          let d, h, m, s;
          if (leftTime >= 0) {
            // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            // h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
            m = Math.floor((leftTime / 1000 / 60) % 60);
            s = Math.floor((leftTime / 1000) % 60);
            // d = d < 10 ? "0" + d : d;
            // h = h < 10 ? "0" + h : h;
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            // d = d === "00" ? "" : d + "天";
            // h = h === "00" ? "" : h + "时";
            // m = m === "00" ? "" : m + "分";
            s = s + "秒";
            m = m + '分';
            formatedTime = m + s;
          }
        } else {
          // this.$emit("closeConsultFeedback");
          this.submitConsultFeedback(1);
        }
        this.formatedCountTime = formatedTime;
      }
    },
    created() {
      try {
        if (this.payConsultParams.content.launchfeedbacktime) {
          this.countTime(this.payConsultParams.content.launchfeedbacktime);
          this.countDownTimer = window.setInterval(() => {
            this.countTime(this.payConsultParams.content.launchfeedbacktime);
          }, 1000);
        }
      } catch (e) {
        console.log(e);
      }
    },
    beforeDestroy() {
      window.clearInterval(this.countDownTimer);
    }
  };
</script>

<style scoped lang="less">
  .consultFeedback_box {
    position: fixed;
    z-index: 1000;
    left: 0;
    right: 0;
    bottom: 0;
    .padding(22, 12, 22, 12);
    /*<!--.height(174);-->*/
    background: @backgroundColorff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    .borderRadius(10, 10, 0, 0);

    .desc_box {
      .padding(0, 0, 22, 0);

      p {
        text-align: center;
        .fontSize(16);
        .lineHeight(22);
        font-weight: 400;
        color: @fontColor33;

        span {
          color: rgba(0, 105, 255, 1);
        }
      }
    }

    .btn_box {
      display: flex;
      justify-content: center;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        .width(165);
        .height(44);
        .fontSize(18);
        font-weight: bold;
        .borderRadius(10, 10, 10, 10);
      }

      .satisfied_btn {
        background-color: rgba(0, 105, 255, 1);
        color: @fontColorff;
        border: 2px solid rgba(0, 105, 255, 1);
        .margin(0, 0, 0, 10);
      }

      .notSatisfied_btn {
        background-color: @backgroundColorff;
        color: rgba(0, 105, 255, 1);
        border: 2px solid rgba(0, 105, 255, 1);
        .margin(0, 10, 0, 0);
      }
    }
  }
</style>
