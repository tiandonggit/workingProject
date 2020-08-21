<template>
  <div class="infoConfirm">
      <div class="input_box">
        <div class="input_box_l">
          <span class="icon_tjr" style="line-height:7.3vw">推荐人:</span>
        </div>
         <div class="input_box_r">
            <input type="text" style="height:12.8vw;" disabled="lockDisabled" v-model="referrerName" placeholder="未填写">
         </div>
      </div>
        <div class="input_box">
        <div class="input_box_l" style="width:70px;">
          <span class="icon_mys" style="line-height:7.3vw">医生:</span>
        </div>
         <div class="input_box_r">
            <input type="text" style="height:12.8vw;" disabled="lockDisabled" v-model="doctorName" placeholder="未填写">
         </div>
      </div>
        <div class="input_box">
        <div class="input_box_l" style="width:70px;">
          <span class="icon_yy" style="line-height:7.3vw">医院:</span>
        </div>
         <div class="input_box_r">
            <input type="text" style="height:12.8vw;" disabled="lockDisabled" v-model="hospitalName" placeholder="未填写">
         </div>
      </div>
        <div class="input_box">
        <div class="input_box_l" style="width:70px;">
          <span class="icon_ks" style="line-height:7.3vw">科室:</span>
        </div>
         <div class="input_box_r">
            <input type="text" style="height:12.8vw;" disabled="lockDisabled" v-model="departmentName" placeholder="未填写">
         </div>
      </div>
        <div class="input_box">
        <div class="input_box_l" style="width:70px;">
          <span class="icon_zc" style="line-height:7.3vw">职称:</span>
        </div>
         <div class="input_box_r">
            <input type="text" style="height:12.8vw;" disabled="lockDisabled" v-model="doctorTitle" placeholder="未填写">
         </div>
      </div>
      <div class="grjs_box">
      <span class="icon_grjs" style="width:90px;line-height:7.3vw;" >个人简介:</span>
       <textarea
            v-model="briefIntroduction"
            disabled="lockDisabled"
            id="textarea"
            placeholder="未填写"
            style="resize: none; width: 230px; height: 224px; overflow-y: hidden;"
          ></textarea>
      </div>
       <div class="scjb_box">
         <span class="icon_scjb" style="width:90px; line-height:7.3vw;">擅长疾病:</span>
          <textarea
            v-model="specialityIllness"
            disabled="lockDisabled"
            id="textarea2"
            placeholder="未填写"
            style="resize: none; width: 230px; height: 224px; overflow-y: hidden;"
          ></textarea>
       </div>
       <div class="button_box" :style="{marginBottom:iphoneX?'44px':'10px'}">
 <button class="button_l" @click="modify">修改</button>
          <button class="button_r" @click="submit">确认提交</button>
       </div>

<!-- <div class="kong" :style="{bottom:iphoneX?'44px':'10px'}" style="width:94%;">

       </div> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { Toast } from 'vant'

export default Vue.extend({
  name: 'RegistrationInfo',
  data() {
    return {
      submitText: '',
      submitText2: '',
      iphoneX: false,
      referrerName: '',
      doctorName: '',
      hospitalName: '',
      departmentName: '',
      doctorTitle: '',
      briefIntroduction: '',
      specialityIllness: '',
      saveInfoObject: {},
      lockDisabled: false,
      phoneNum: ''
    }
  },
  created() {
    this.referrerName = this.$store.state.saveInfoObject.referrerName
    this.doctorName = this.$store.state.saveInfoObject.doctorName
    this.hospitalName = this.$store.state.saveInfoObject.hospitalName
    this.departmentName = this.$store.state.saveInfoObject.departmentName
    this.doctorTitle = this.$store.state.saveInfoObject.doctorTitle
    this.briefIntroduction = this.$store.state.saveInfoObject.briefIntroduction
    this.specialityIllness = this.$store.state.saveInfoObject.specialityIllness
    console.log(JSON.stringify(this.$store.state.saveInfoObject))
    this.iphoneX = this.$store.state.iphoneX
    this.phoneNum = this.$store.state.phoneNum
    // 环境判定
    if (process.env.isMiniprogram) {
      this.titleWX()
    } else {
      console.log('I am in Web')
      this.titleWeb()
    }
  },
  mounted() {
    const text = document.getElementById('textarea')
    this.autoTextarea(text) // 调用
    const text2 = document.getElementById('textarea2')
    this.autoTextarea(text2) // 调用
  },
  methods: {
    // 小程序标题
    titleWX() {
      wx.setNavigationBarTitle({
        title: '信息确认'
      })
    },
    // web标题
    titleWeb() {
      document.title = '信息确认'
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
      extra = extra || 0
      var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
        addEvent = function (type, callback) {
          elem.addEventListener
            ? elem.addEventListener(type, callback, false)
            : elem.attachEvent(`on${type}`, callback)
        },
        getStyle = elem.currentStyle
          ? function (name) {
            const val = elem.currentStyle[name]

            if (name === 'height' && val.search(/px/i) !== 1) {
              const rect = elem.getBoundingClientRect()
              return (
                `${rect.bottom -
                  rect.top -
                  parseFloat(getStyle('paddingTop')) -
                  parseFloat(getStyle('paddingBottom'))
                }px`
              )
            }

            return val
          }
          : function (name) {
            return getComputedStyle(elem, null)[name]
          },
        minHeight = parseFloat(getStyle('height'))

      elem.style.resize = 'none'

      const change = function () {
        let scrollTop,
          height,
          padding = 0,
          style = elem.style

        if (elem._length === elem.value.length) return
        elem._length = elem.value.length

        if (!isFirefox && !isOpera) {
          padding =
            parseInt(getStyle('paddingTop')) +
            parseInt(getStyle('paddingBottom'))
        }
        scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop

        elem.style.height = `${minHeight}px`
        if (elem.scrollHeight > minHeight) {
          if (maxHeight && elem.scrollHeight > maxHeight) {
            height = maxHeight - padding
            style.overflowY = 'auto'
          } else {
            height = elem.scrollHeight - padding
            style.overflowY = 'hidden'
          }
          style.height = `${height + extra}px`
          scrollTop += parseInt(style.height) - elem.currHeight
          document.body.scrollTop = scrollTop
          document.documentElement.scrollTop = scrollTop
          elem.currHeight = parseInt(style.height)
        }
      }
      addEvent('propertychange', change)
      addEvent('input', change)
      addEvent('focus', change)
      change()
    },
    /* eslint-enable */
    // 修改
    modify() {
      this.$router.push({
        path: '/registrationInfo'
      })
    },
    // 提交
    submit() {
      console.log(`手机号--${this.phoneNum}`)
      this.$http
        .request({
          method: 'post',
          url: '/InformationCollectionController/loggingData',
          body: {
            doctorPhone: this.phoneNum,
            referrerName: this.referrerName,
            doctorName: this.doctorName,
            hospitalName: this.hospitalName,
            departmentName: this.departmentName,
            doctorTitle: this.doctorTitle,
            briefIntroduction: this.briefIntroduction,
            specialityIllness: this.specialityIllness,
          }
        })
        .then((res) => {
          console.log(JSON.stringify(res.data))

          if (res.data.success) {
            Toast.success('提交成功')
            this.$router.push({
              path: '/successCode'
            })
          } else {
            Toast(res.data.message)
          }
        })
        .catch((error) => {
          Toast(`错误为${error}`)
        })
    }
  },
})
</script>

<style lang="less">
.infoConfirm{
  padding-left: 12px;
  padding-right: 12px;
  textarea{
     width: 64%;
     .fontSize(18);
     color: @fontColor33;
     background:rgba(237,237,237,1);
     height: 224px;
     margin-top: 10px;
     padding-left: 5px;
     border: 0;
     outline:none;
  }
  .input_box{
    display: flex;
    margin-top: 20px;
    .fontSize(18);
    .input_box_l{
       width: 82px;
       height: 48px;
       background:rgba(237,237,237,1);
       .borderRadius(10,0,0,10);
       .icon_tjr{
        // width:26px;
        height:32px;
  display: block;
  margin-left: 15px;
  margin-top: 10px;
  background-size: 100%;
  }
  .icon_mys{
        // width:26px;
         height:32px;
  display: block;
  margin-left: 15px;
  margin-top: 10px;
  background-size: 100%;
  }
    .icon_yy{
        // width:32px;
         height:32px;
  display: block;
  margin-left: 15px;
  margin-top: 10px;
  background-size: 100%;
  }
    .icon_ks{
        // width:32px;
         height:32px;
  display: block;
  margin-left: 15px;
  margin-top: 10px;
  background-size: 100%;
  }
      .icon_zc{
        // width:32px;
         height:32px;
  display: block;
  margin-left: 15px;
  margin-top: 10px;
  background-size: 100%;
  }
    }
   .input_box_r{
       background:rgba(237,237,237,1);
       height: 48px;
       line-height: 48px;
       .borderRadius(0,10,10,0);
       padding-left: 3px;
       width: 299px;
        input {
        // padding-top: 10px;
       color: @fontColor33;
       .fontSize(18);
       outline:none;
       border: 0;
       background:rgba(237,237,237,1);
       height: 48px;
       line-height: 48px;
       .borderRadius(0,10,10,0);
       padding-left: 8px;
       width: 259px;
       display: block;
     }
    }
  }
.grjs_box{
  .fontSize(18);
    display: flex;
.borderRadius(10,10,10,10);
 background:rgba(237,237,237,1);
 margin-top: 20px;
      .icon_grjs{
        // width:32px;
         height:32px;
  display: block;
  margin-left: 15px;
  margin-top: 10px;
  background-size: 100%;
  }
}
.scjb_box{
  .fontSize(18);
    display: flex;
.borderRadius(10,10,10,10);
 background:rgba(237,237,237,1);
 margin-top: 20px;
 margin-bottom: 20px;
  .icon_scjb{
        // width:32px;
         height:32px;
  display: block;
  margin-left: 15px;
  margin-top: 10px;
  background-size: 100%;
  }
}
.button_box{
display: flex;
justify-content: space-between;
.button_l{
width: 44%;
color: @startColor;
  //  margin-left: 12px;
  //  margin-right: 12px;
height:42px;
line-height: 42px;
border:2px solid;
border-radius:10px;
background-color: #fff;
}
.button_r{
width: 44%;
    color: #fff;
  //  margin-left: 12px;
  //  margin-right: 12px;
height:44px;
line-height: 44px;
background:linear-gradient(270deg,rgba(14,134,254,1) 0%,rgba(0,105,255,1) 100%);
border-radius:10px;
}
}


}
a, button {
  display: block;
  text-align: center;
  font-size: 20px;
  border: 0;
  outline:none;
}
</style>
