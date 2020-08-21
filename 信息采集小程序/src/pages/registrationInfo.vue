<template>
  <div class="registrationInfo" style="z-index:-1;">
    <div class="input_box">
      <div class="input_box_l">
        <i class="icon_tjr"></i>
      </div>
      <div class="input_box_r">
        <input
          type="text"
          style="height:12.8vw;"
          name="referrerName"
          v-model="referrerName"
          placeholder="请填写推荐人姓名"
        />
      </div>
    </div>
    <div class="input_box">
      <div class="input_box_l">
        <i class="icon_mys"></i>
      </div>
      <div class="input_box_r">
        <input
          type="text"
          style="height:12.8vw;"
          name="doctorName"
          v-model="doctorName"
          placeholder="请填写医生真实姓名(必填)"
        />
      </div>
    </div>
    <div class="input_box">
      <div class="input_box_l">
        <i class="icon_yy"></i>
      </div>
      <div class="input_box_r">
        <input
          type="text"
          style="height:12.8vw;"
          name="hospitalName"
          v-model="hospitalName"
          placeholder="请填写所在医院名称(必填)"
        />
      </div>
    </div>
    <div class="input_box">
      <div class="input_box_l">
        <i class="icon_ks"></i>
      </div>
      <div class="input_box_r">
        <input
          type="text"
          style="height:12.8vw;"
          v-model="departmentName"
          placeholder="请填写所在科室名称(必填)"
        />
      </div>
    </div>
    <div class="input_box">
      <div class="input_box_l">
        <i class="icon_zc"></i>
      </div>
      <div class="input_box_r">
        <input type="text" style="height: 12.8vw;" v-model="doctorTitle" placeholder="请填写医生职称(必填)" />
      </div>
    </div>
    <div class="grjs_box">
      <i class="icon_grjs"></i>
      <textarea
        v-model="briefIntroduction"
        id="textarea"
        maxlength="120"
        placeholder="请填写个人简介（120字以内）"
        style="resize: none; width: 270px; height: 224px; overflow-y: hidden;"
      ></textarea>
    </div>
    <div class="scjb_box">
      <i class="icon_scjb"></i>
      <textarea
        v-model="specialityIllness"
        id="textarea2"
        maxlength="120"
        placeholder="请填写擅长疾病（120字以内）"
        style="resize: none; width: 270px; height: 224px; overflow-y: hidden;"
      ></textarea>
    </div>
    <!-- <div class="foot"></div> -->
    <div class="submit_kong" style="z-index: 99999;" :style="{marginBottom:iphoneX?'28vw':'4vw'}">
      <!-- <div class="submit_kong" style="z-index: 99999;" :style="{bottom:iphoneX?'44px':'10px'}"> -->
      <button class="submit" @click.stop="submit">提交信息</button>
    </div>
    <KToast :duration="10000" v-model="successTips" type="info">已完成</KToast>
  </div>
</template>

<script>
import Vue from "vue";
// eslint-disable-next-line no-unused-vars
import { Toast } from "vant";

export default Vue.extend({
  name: "RegistrationInfo",
  data() {
    return {
      phoneNum: "",
      iphoneX: false,
      referrerName: "",
      doctorName: "",
      hospitalName: "",
      departmentName: "",
      doctorTitle: "",
      briefIntroduction: "",
      specialityIllness: "",
      successTips: false
    };
  },
  created() {
    console.log(this.$store.state.iphoneX);
    console.log(this.$store.state.phoneNum);
    this.iphoneX = this.$store.state.iphoneX;
    this.phoneNum = this.$store.state.phoneNum;
    // 环境判定
    if (process.env.isMiniprogram) {
      this.titleWX();
    } else {
      console.log("I am in Web");
      this.titleWeb();
    }
  },
  mounted() {
    const text = document.getElementById("textarea");
    this.autoTextarea(text); // 调用
    const text2 = document.getElementById("textarea2");
    this.autoTextarea(text2); // 调用
  },
  methods: {
    // 小程序标题
    titleWX() {
      wx.setNavigationBarTitle({
        title: "注册信息"
      });
    },
    // web标题
    titleWeb() {
      document.title = "注册信息";
    },
    /* eslint-disable */
    // 文本框根据输入内容自适应高度
    autoTextarea(elem, extra, maxHeight) {
      /**
       * 文本框根据输入内容自适应高度
       * @param                {HTMLElement}        输入框元素
       * @param                {Number}                设置光标与输入框保持的距离(默认0)
       * @param                {Number}                设置最大高度(可选)
       */
      extra = extra || 0;
      var isFirefox = !!document.getBoxObjectFor || "mozInnerScreenX" in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf("Opera"),
        addEvent = function(type, callback) {
          elem.addEventListener
            ? elem.addEventListener(type, callback, false)
            : elem.attachEvent(`on${type}`, callback);
        },
        getStyle = elem.currentStyle
          ? function(name) {
              const val = elem.currentStyle[name];

              if (name === "height" && val.search(/px/i) !== 1) {
                const rect = elem.getBoundingClientRect();
                return `${rect.bottom -
                  rect.top -
                  parseFloat(getStyle("paddingTop")) -
                  parseFloat(getStyle("paddingBottom"))}px`;
              }

              return val;
            }
          : function(name) {
              return getComputedStyle(elem, null)[name];
            },
        minHeight = parseFloat(getStyle("height"));

      elem.style.resize = "none";

      const change = function() {
        let scrollTop,
          height,
          padding = 0,
          style = elem.style;

        if (elem._length === elem.value.length) return;
        elem._length = elem.value.length;

        if (!isFirefox && !isOpera) {
          padding =
            parseInt(getStyle("paddingTop")) +
            parseInt(getStyle("paddingBottom"));
        }
        scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;

        elem.style.height = `${minHeight}px`;
        if (elem.scrollHeight > minHeight) {
          if (maxHeight && elem.scrollHeight > maxHeight) {
            height = maxHeight - padding;
            style.overflowY = "auto";
          } else {
            height = elem.scrollHeight - padding;
            style.overflowY = "hidden";
          }
          style.height = `${height + extra}px`;
          scrollTop += parseInt(style.height) - elem.currHeight;
          document.body.scrollTop = scrollTop;
          document.documentElement.scrollTop = scrollTop;
          elem.currHeight = parseInt(style.height);
        }
      };
      addEvent("propertychange", change);
      addEvent("input", change);
      addEvent("focus", change);
      change();
    },
    /* eslint-enable */
    // 跳页确定
    submit() {
      // if (this.referrerName.length === 0) {
      //   Toast('请输入推荐人姓名')
      //   return
      // }
      if (this.doctorName.replace(/\s*/g, "").length === 0) {
        Toast("请输入医生姓名");
        return;
      }
      if (this.hospitalName.replace(/\s*/g, "").length === 0) {
        Toast("请输入医院名称");
        return;
      }
      if (this.departmentName.replace(/\s*/g, "").length === 0) {
        Toast("请输入科室");
        return;
      }
      if (this.doctorTitle.replace(/\s*/g, "").length === 0) {
        Toast("请输入医生职称");
        return;
      }
      // if (this.briefIntroduction.length === 0) {
      //   Toast('请输入个人简介')
      //   return
      // }
      // if (this.specialityIllness.length === 0) {
      //   Toast('请填写医生职称')
      //   return
      // }
      const saveInfoObject = {
        referrerName: this.referrerName.replace(/\s*/g, ""),
        doctorName: this.doctorName.replace(/\s*/g, ""),
        hospitalName: this.hospitalName.replace(/\s*/g, ""),
        departmentName: this.departmentName.replace(/\s*/g, ""),
        doctorTitle: this.doctorTitle.replace(/\s*/g, ""),
        briefIntroduction: this.briefIntroduction.replace(/\s*/g, ""),
        specialityIllness: this.specialityIllness.replace(/\s*/g, "")
      };
      this.$store.commit("saveInfoObject", saveInfoObject);
      console.log(JSON.stringify(this.$store.state.saveInfoObject));

      this.$router.push({
        path: "/infoConfirm"
      });
    },
    abc() {
      const self = this;
      this.referrerName = self.$store.state.saveInfoObject.referrerName;
      this.doctorName = self.$store.state.saveInfoObject.doctorName;
      this.hospitalName = self.$store.state.saveInfoObject.hospitalName;
      this.departmentName = self.$store.state.saveInfoObject.departmentName;
      this.doctorTitle = self.$store.state.saveInfoObject.doctorTitle;
      this.briefIntroduction =
        self.$store.state.saveInfoObject.briefIntroduction;
      this.specialityIllness =
        self.$store.state.saveInfoObject.specialityIllness;
    },
    successShow() {
      this.successTips = true;
    }
  },

  watch: {
    // 文本域-个人介绍限制
    briefIntroduction(newV, oldV) {
      console.log(newV, oldV);
      if (newV.length === 120) {
        Toast.fail("最多120字");
      }
    },
    // 文本域-个人介绍限制
    specialityIllness(newV, oldV) {
      console.log(newV, oldV);
      if (newV.length === 120) {
        Toast.fail("最多120字");
      }
    }
  },
  // 修改返回编辑
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === "infoConfirm") {
        vm.abc();
      } else {
        // vm.fetchData()
      }
    });
  }
});
</script>

<style lang="less">
.registrationInfo {
  padding-left: 12px;
  padding-right: 12px;
  textarea {
    width: 70%;
    .fontSize(18);
    color: @fontColor33;
    background: rgba(237, 237, 237, 1);
    height: 224px;
    margin-top: 12px;
    padding-left: 20px;
    border: 0;
    outline: none;
  }
  .input_box {
    display: flex;
    margin-top: 20px;
    .input_box_l {
      width: 52px;
      height: 48px;
      background: rgba(237, 237, 237, 1);
      .borderRadius(10, 0, 0, 10);
      .icon_tjr {
        width: 26px;
        height: 32px;
        background-image: data-uri("./../assets/img/tjr.png");
        background-repeat: no-repeat;
        display: block;
        margin-left: 15px;
        margin-top: 8px;
        background-size: 100%;
      }
      .icon_mys {
        width: 26px;
        height: 32px;
        background-image: data-uri("./../assets/img/mys.png");
        background-repeat: no-repeat;
        display: block;
        margin-left: 15px;
        margin-top: 8px;
        background-size: 100%;
      }
      .icon_yy {
        width: 32px;
        height: 32px;
        background-image: data-uri("./../assets/img/yy.png");
        background-repeat: no-repeat;
        display: block;
        margin-left: 15px;
        margin-top: 8px;
        background-size: 100%;
      }
      .icon_ks {
        width: 32px;
        height: 32px;
        background-image: data-uri("./../assets/img/ks.png");
        background-repeat: no-repeat;
        display: block;
        margin-left: 15px;
        margin-top: 8px;
        background-size: 100%;
      }
      .icon_zc {
        width: 32px;
        height: 32px;
        background-image: data-uri("./../assets/img/zc.png");
        background-repeat: no-repeat;
        display: block;
        margin-left: 15px;
        margin-top: 8px;
        background-size: 100%;
      }
    }
    .input_box_r {
      background: rgba(237, 237, 237, 1);
      height: 48px;
      line-height: 48px;
      .borderRadius(0, 10, 10, 0);
      padding-left: 8px;
      width: 299px;
      input {
        // padding-top: 10px;
        color: @fontColor33;
        .fontSize(18);
        outline: none;
        border: 0;
        background: rgba(237, 237, 237, 1);
        height: 48px;
        line-height: 48px;
        .borderRadius(0, 10, 10, 0);
        padding-left: 8px;
        width: 259px;
        display: block;
      }
    }
  }
  .grjs_box {
    display: flex;
    .borderRadius(10, 10, 10, 10);
    background: rgba(237, 237, 237, 1);
    margin-top: 20px;
    .icon_grjs {
      width: 32px;
      height: 32px;
      background-image: data-uri("./../assets/img/grjs.png");
      background-repeat: no-repeat;
      display: block;
      margin-left: 15px;
      margin-top: 8px;
      background-size: 100%;
    }
  }
  .scjb_box {
    display: flex;
    .borderRadius(10, 10, 10, 10);
    background: rgba(237, 237, 237, 1);
    margin-top: 20px;
    margin-bottom: 20px;
    .icon_scjb {
      width: 32px;
      height: 32px;
      background-image: data-uri("./../assets/img/sc.png");
      background-repeat: no-repeat;
      display: block;
      margin-left: 15px;
      margin-top: 8px;
      background-size: 100%;
    }
  }
  .submit {
    width: 100%;
    color: #fff;
    //  margin-left: 12px;
    //  margin-right: 12px;
    height: 44px;
    line-height: 44px;
    background: linear-gradient(
      270deg,
      rgba(14, 134, 254, 1) 0%,
      rgba(0, 105, 255, 1) 100%
    );
    border-radius: 10px;
    z-index: 9999;
    // position: fixed;
    // bottom: 10px;
  }
}
.submit_kong {
  width: 100%;
  // position: fixed;
  bottom: 10px;
}
.foot {
  height: 40px;
  display: flex;
}
a,
button {
  display: block;
  text-align: center;
  font-size: 20px;
  border: 0;
  outline: none;
}
</style>
