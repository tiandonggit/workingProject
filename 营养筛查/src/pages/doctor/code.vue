<!--
  作者:许鹏
  用途:二维码页面
  -------------------
  Created by webStorm
  User: xp
  Date: 2019年10月29日
  Time: 17:55
  Application: code
  State: page
-->
<template>
  <div class="code">
    <div class="top_box">
      <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="false"
        :title="title"
      ></commonHeader>
    </div>
    <div id="code1">
      <div class="code_title">
        <div class="code_title_top">
          <p>请告知用户此8位方案码，</p>
          <p>由用户在“抱抱健康”公众号</p>
          <p>输入领取方案</p>
          <p>{{ num }}</p>
        </div>
      </div>
      <div class="code_back">
        <img :src="pic" class="pic" />
      </div>
      <div class="code_title_bot">
        <p>
          也可由用户扫描二维码直接领取方案
        </p>
      </div>
      <div class="bottom">
        <van-button @click="codeButton()" size="large">完成</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import http from "@/utils/request";
import wx from "weixin-js-sdk";
import {Toast} from "vant";
export default {
  name: "code1",
  data() {
    return {
      title: "筛查结果",
      customTitle: "筛查结果",
      pic: "",
      id: 0, //增加选择医生加的传参 (张松仁)
      judge: 0,
      num: 0
    };
  },
  created: function() {
    // console.log(typeof this.$route.query.val != undefined && this.$route.query.val != "")
    console.log(typeof this.$route.query.val != "undefined")
    this.id = window.sessionStorage.getItem("pid"); //增加选择医生加的传参 (张松仁)
    if (typeof this.$route.query.val != "undefined" && this.$route.query.val != "") {
      this.num = this.$route.query.val;
    } else {
      this.findReport();
      this.title = "诊断结果";
      this.customTitle = "诊断结果";
    }

    this.ercode();
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route.query.type == 1) {
      wx.closeWindow();
    } else {
      next();
    }
  },
  components: {
    commonHeader
  },
  methods: {
    //请求诊断报告信息
    findReport() {
      console.log("获取code");
      this.$http
        .request({
          method: "get",
          url:
            "/NNutritionPrescribeGoodsController/selectNutritionPrescribeData",
          body: {
            patiId: window.sessionStorage.getItem("id")
          }
        })
        .then(res => {
          console.log("--------", res);
          if (res.data.success) {
            // alert(13);

            this.num = res.data.data.preSaleCode
          } else {
            Toast(res.data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    ercode() {
      http
        .request({
          method: "get",
          url: "/RDoctorController/generateQrCodeTwoPatinet",
          body: {
            npid: window.sessionStorage.getItem("id"),
            id: this.id //增加选择医生加的传参 (张松仁)
            // nutritionPrescribeId:"455106805983481857"
          },
          headers: {
            // 'X-Auth-Token': this.$localStorage.getItem('doctorToken')
          }
        })
        .then(res => {
          console.log(res);
          // if (res.data.data.code == "0") {
          //   this.$router.push({
          //     name: "remind",
          //     query: {}
          //   });
          // }
          this.pic =
            "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" +
            res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    codeButton() {
      console.log("点击了");
      console.log(
        this.$route.query.type != undefined && this.$route.query.type == 1
      );
      console.log(this.$route.query.type);
      if (this.$route.query.type != undefined && this.$route.query.type == 1) {
        //如果是筛查完成 则关闭
        wx.closeWindow();
      } else {
        this.$router.go(-1);
      }
      // wx.closeWindow();
      // this.judge = 1;
      // this.$router.push({
      //   name: "pendingReport"
      //   //path: '/his_report'
      // });
    }
  }
};
</script>

<style scoped lang="less">
.code {
  .top_box {
    width: 100%;
    height: 44px;
  }
}
#code1 {
  width: 100%;
  /*height: 100%;*/
  background: url("../../assets/img/codeBackground.png") no-repeat;
  background-size: 100%;
  margin: 0 auto;
  padding: 175px 0 50px;
  .code_back {
    width: 110px;
    height: 148px;
    padding: 26px 0 11px;
    margin: 0 auto;
    .pic {
      width: 100%;
    }
  }
  .code_title {
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    color: @fontColor33;
    .code_title_top {
      p {
        &:last-child {
          font-weight: 800;
          font-size: 40px;
          line-height: 56px;
          color: @mainColor;
          padding-top: 15px;
        }
      }
    }
  }
  .code_title_bot {
    padding-top: 11px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    color: @fontColor33;
  }
  .bottom {
    padding-top: 20px;
    text-align: center;
    /deep/ .van-button {
      // width: 93.6vw;
      height: 44px;
      line-height: 44px;
      color: @fontColorff;
      font-size: 4.3vw;
      border-radius: 10px;
    }
    /deep/ .van-button--normal {
      margin-top: 20px;
      color: @mainColor !important;
      font-size: 4.3vw;
      border-radius: 10px;
      background: @backcolor !important;
      border: 1px solid @mainColor !important;
    }
    /deep/ .van-button--large {
      width: 275px;
    }
  }
}
.code {
  height: 91.5%;
}
</style>
