/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: snappedUpImmediately *
@function: 立即抢购页 * @date: 2020/2/20 * @time: 13:58 * * */
<template>
  <div id="snappedUpImmediately">
    <common-header
      :share-disabled="true"
      custom-title="活动主题"
    ></common-header>
    <div class="main" v-show="key">
      <div class="main_box">
        <img src="../../assets/images/snappedUpImmediately.jpg" alt=""/>
      </div>
      <div class="foot">
        <van-button
          :class="key ? (disabled ? 'noDisabled' : 'disabled') : 'noDisabled'"
          type="default"
          :disabled="key ? disabled : true"
          @click="$throttle(snappedUpImmediately)"
        >{{ disabled ? countDown : "立即抢购" }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "snappedUpImmediately",
  components: {
    commonHeader
  },
  data() {
    return {
      disabled: true, //按钮是否能禁用
      startTime: "", //抢购开始时间
      systemCurrentTime: "", //系统时间
      key: false,
      message: ""
    };
  },
  created() {
    this.panicBuyingTime();
  },
  mounted() {},
  computed: {
    countDown() {
      let that = this,
        h,
        m,
        s,
        value;
      if (that.key) {
        //判断时间是否可以开始
        if (that.systemCurrentTime >= that.startTime) {
          //可以开始
          that.disabled = false;
        } else {
          value = that.startTime - that.systemCurrentTime;
          // console.log(value);
          h = Math.floor(value / 3600);

          m = Math.floor((value % 3600) / 60);
          s = (value % 3600) % 60;
          if (h < 10) h = "0" + h;
          if (m < 10) m = "0" + m;
          if (s < 10) s = "0" + s;
          // console.log(h);
          // console.log(m);
          // console.log(s);

          return h + ":" + m + ":" + s;
        }
      } else {
        return "活动未开启";
      }
    }
  },
  methods: {
    panicBuyingTime() {
      this.$http
        .request({
          method: "post",
          url: "/ZyOrderController/panicBuyingTime",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.data.remainingNum) //名额已抢购一空
              this.message = res.data.data.remainingNum;
            if (res.data.data.payOrder) {
              //3天内有付款订单payOrder剩余多少秒
              let d = Math.floor(res.data.data.payOrder / (3600 * 24)); //几天
              let h = Math.floor(res.data.data.payOrder % (3600 * 24) / 3600); //几时
              let m = Math.floor(res.data.data.payOrder % (3600 * 24) % 3600 / 60); //几分
              let s = Math.floor(res.data.data.payOrder % (3600 * 24) % 3600 % 60); //几秒

              this.message = "您已抢购成功，" + d + "天" + h + "小时" + m + "分钟" + s + "秒后可再次购买，把口罩留给更多需要的人吧~";
            }
            if (res.data.data.notPayOrder) //有抢购成功未付款的订单
              this.message = res.data.data.notPayOrder;

            let startTime = res.data.data.startTime;
            let systemCurrentTime = res.data.data.systemCurrentTime;

            //兼容苹果
            startTime = new Date(startTime.toString().replace(/-/g, "/"));
            systemCurrentTime = new Date(
              systemCurrentTime.toString().replace(/-/g, "/")
            );
            let startTimeH = startTime.getHours(); //开始时间小时
            let systemCurrentTimeH = systemCurrentTime.getHours(); //系统时间小时
            let startTimeM = startTime.getMinutes(); //开始时间分钟
            let systemCurrentTimeM = systemCurrentTime.getMinutes(); //系统时间分钟
            let startTimeS = startTime.getSeconds(); //开始时间秒
            let systemCurrentTimeS = systemCurrentTime.getSeconds(); //系统时间秒
            let newStartTime = startTimeH * 3600 + startTimeM * 60 + startTimeS;
            let newSystemCurrentTime =
              systemCurrentTimeH * 3600 +
              systemCurrentTimeM * 60 +
              systemCurrentTimeS;
            // console.log(newStartTime);
            // console.log(newSystemCurrentTime, "今天");

            // console.log(this.disabled);
            // console.log(this.key);
            // console.log(startTime);
            // console.log(systemCurrentTime);

            this.startTime = newStartTime;
            this.systemCurrentTime = newSystemCurrentTime;
            this.timer();
            //查询成功
            this.key = true;
          } else {
            //查询失败
            this.$toast(res.data.message);
          }
        })
        .catch(error => {
          this.$toast("查询接口失败");
        });
    },
    timer() {
      // console.log(1111);
      let that = this,
        t = null;
      t = setInterval(() => {
        that.systemCurrentTime++;
        if (that.systemCurrentTime >= that.startTime) clearTimeout(t);
      }, 1000);
    },
    snappedUpImmediately() {
      if (this.message != "") {
        this.$dialog
          .alert({
            className: "loge",
            message: this.message,
            confirmButtonText: "知道了"
          })
          .then(() => {
            // on close
          });
      } else {
        //执行抢购
        this.$http
          .request({
            method: "post",
            url: "/ZyOrderController/panicBuying",
            body: {}
          })
          .then(res => {
            console.log(res);
            if (res.data.data == 0) {
              //抢购成功
              this.$router.replace({
                name: "panicBuyingResult",
                query: {
                  result: 0
                }
              });
            } else {
              //抢购失败
              this.$router.replace({
                name: "panicBuyingResult",
                query: {
                  result: 1
                }
              });
            }
          })
          .catch(error => {
            this.$toast("查询接口失败");
          });
      }
      //抢购
      console.log("点击了");
    }
  }
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}

#snappedUpImmediately {
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  background: @backgroundColor;

  .main {
    position: absolute;
    top: 0;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    left: 0;
    right: 0;

    .main_box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 64/375 * 100vw;
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none !important;
        width: 0px;
        height: 0px;
      }

      text-align: center;

      img {
        .width(375);
      }
    }

    .foot {
      position: absolute;
      bottom: 10/375 * 100vw;
      left: 12/375 * 100vw;
      right: 12/375 * 100vw;

      .noDisabled {
        .fontSize(18);
        width: 100%;
        background-image: linear-gradient(
          to right,
          @gengqianSpan,
          @gengqianSpan
        );
        border-radius: 10px;
        color: @fontOne;
      }

      .disabled {
        .fontSize(18);
        width: 100%;
        background-image: linear-gradient(
          to right,
          @buttonColor,
          @buttonRightColorBlue
        );
        border-radius: 10px;
        color: @fontOne;
      }
    }
  }
}

/deep/ .loge {
  .borderRadius(10);
}
</style>
