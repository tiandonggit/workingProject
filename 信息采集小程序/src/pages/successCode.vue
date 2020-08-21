<template>
  <div class="successCode">
    <div class="logo_icon"></div>
    <p>信息提交成功</p>
     <!-- <div class="sao_box">
<p>扫一扫关注<p>
<p><span>“抱抱健康”</span>公众号</p>
<div class="code"></div>
     </div> -->

<div class="info_explain_box">
     <div class="info_explain">
       您的信息已提交成功，将在1个工作日内预注册完成，届时会有客服跟您进行激活确认，请保持电话通畅。
     </div>
     <div class="telephone">
       <p>客服电话：<span>400-090-9975</span></p>
     </div>
</div>
     <div class="kong" :style="{bottom:iphoneX?'44px':'10px'}">

       </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'SuccessCode',
  data() {
    return {
      iphoneX: false
    }
  },
  created() {
    this.iphoneX = this.$store.state.iphoneX
    // 环境判定
    if (process.env.isMiniprogram) {
      this.titleWX()
    } else {
      console.log('I am in Web')
      this.titleWeb()
    }
  },
  methods: {
    // 小程序标题
    titleWX() {
      wx.setNavigationBarTitle({
        title: '提交成功'
      })
    },
    // web标题
    titleWeb() {
      document.title = '提交成功'
    },
    // 跳转信息页
    infoHref() {
      this.$router.push({
        path: '/registrationInfo'
      })
    },
  }
})
</script>

<style lang="less">
.successCode{
    padding-bottom: 65px;
    padding-top: 75px;
      .submit{
    width: 94%;
    margin: 0 auto;
    color: #fff;
   margin-left: 12px;
   margin-right: 12px;
height:44px;
line-height: 44px;
background:linear-gradient(270deg,rgba(14,134,254,1) 0%,rgba(0,105,255,1) 100%);
border-radius:10px;
// position: fixed;
// bottom: 10px;
  }
  .logo_icon{
  width:60px;
  height:60px;
  background-image: data-uri('./../assets/img/success.png');
  background-repeat: no-repeat;
  margin: 0 auto;
  background-size: 100%;

 }
 p{
   color: @fontColor33;
   .fontSize(20);
    margin: 0 auto;
    margin-top: 15px;
    text-align: center;
 }

.sao_box{
width:300px;
  height:326px;
  background-image: data-uri('./../assets/img/frame.png');
  background-repeat: no-repeat;
  margin: 0 auto;
  margin-top: 133px;
  background-size: 100%;
  position: relative;
  padding-top:30px;
  p{
    width: 100%;
      color: @fontColor33;
   .fontSize(20);
    margin: 0 auto;
    text-align: center;
    display: block;
    top:20px;
    margin: 0 auto;
    text-align:center;
    width: 100%;
    span{
        color:@startColor;
    }
  }
  .code{
      width: 172px;
      height: 167px;
     position: absolute;
    top:115px;
    margin: 0 auto;
    left:20%;
    text-align:center;
    background-image: data-uri('./../assets/img/code.png');
  background-repeat: no-repeat;
  background-size: 100%;
 }
}
}
.miniprogram-root {
  .for-web {
    display: none;
  }
}


.info_explain_box{
      padding-left: 33px;
      padding-right: 33px;
      text-align: center;
      color:@fontColor33;
      .fontSize(16);
          margin-top: 57px;
}

.telephone{
  text-align: center;
  .fontSize(16);
}
.telephone p{
  .fontSize(16);
      margin-top: 0px;
}
.telephone span{
  .fontSize(16);
 color:@startColor;
}

</style>
