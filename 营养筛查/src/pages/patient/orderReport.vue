<!--
  作者:许鹏
  用途:历史营养诊断报告
  -------------------
  Created by webStorm
  User: xp
  Date: 2019年10月29日
  Time: 16:25
  Application: Historic Nutrition Diagnosis Report
  State: page
-->
<template>
  <div id="orderReport">
    <!-- <common_header :customTitle="title" /> -->
    <commonHeader
      :share-disabled="true"
      :custom-title="'营养方案'"
      :header-show="false"
      :left="false"
      :title="'营养筛查报告'"
    ></commonHeader>
    <div class="allhea">
      <!--<img :src="pic" class="pic" />
      <div class="title">{{ head_title }}</div>-->
      <PrescriptionNote :value="baseInfo" :list="productInfo" state="4" />
      <div>
        <div class="bottom">
          <van-button @click="$throttle(lookpre)" size="large"
            >查看营养报告</van-button
          >
          <!--<van-button @click="lookcode" type="primary">展示患者二维码</van-button>-->
        </div>
        <div class="pass">
          <div class="pass_tag">
            <div class="pass_title">智配柜信息</div>
            <div class="tag">
              <div class="tag_ai zz">
                智配柜编号：{{ baseInfo.deviceCode }}<br />
                地址：{{ baseInfo.deviceFullAdress }}<br />
                <!--							电话：{{}}-->
              </div>
            </div>
          </div>
        </div>
        <div class="pass">
          <div class="pass_tag">
            <div class="pass_title">患者购药状态</div>
            <div class="tag">
              <div class="tag_n zz">
                患者购药状态:<span class="y">{{
                  baseInfo.orderStateName
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div v-show="ending">
      <div class="presentation" @click="lookpre">
        查看营养监测报告
      </div>
      <div class="ending_tag">
        <div class="ending_title">患者购药状态</div>
        <div class="ending">
          <div class="ending_n zz">
            患者购药状态:<span class="y">已付款 线下自提 未完成</span>
          </div>
        </div>
      </div>
    </div>-->
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import PrescriptionNote from "@/components/PrescriptionNote.vue";
import { Toast } from "vant";
export default {
  name: "orderReport",
  data() {
    return {
      title: "审核通过营养监测报告",
      bg: false,
      head_title: "营养方案详情",
      pass: false,
      pic: require("../../assets/img/htbg1.png"),
      ending: false, //是否不显示
      baseInfo: {},
      productInfo: []
    };
  },
  components: {
    commonHeader,
    PrescriptionNote
  },
  created() {
    if (this.$route.query.id) {
      window.sessionStorage.setItem("id", this.$route.query.id);
    }
    if (!window.sessionStorage.getItem("id")) {
      Toast("当前处方不存在");
    } else {
      this.findReport();
    }
    if (this.$route.query.type === 1) {
      this.title = "审核通过营养监测报告";
    }
  },
  methods: {
    //查看患者二维码
    lookcode() {
      this.$router.push({
        name: "code",
        query: {
          prescriptionId: window.sessionStorage.getItem("id")
        }
      });
    },
    //查看营养诊断报告
    lookpre() {
      /*      this.$router.push({
        name: "resultsx",
        query: {
          prescriptionId: window.sessionStorage.getItem("id")
        }
      });*/
      window.sessionStorage.setItem("terminal", 2);
      this.$router.push({
        name: "results",
        query: {}
      });
    },
    //请求诊断报告信息
    findReport() {
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
          console.log("--------" + res);
          // console.log(JSON.stringify(res));
          if (res.data.success) {
            // alert(13);
            this.baseInfo = res.data.data;
            this.productInfo = res.data.data.specList;
            // if (res.data.data.prescriptionBaseInfo.checkStatus === 1) {
            //   this.pic = require("../../assets/img/htbgz.png");
            //   this.head_title = "营养诊断报告审核中...";
            // }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    }
  }
};
</script>

<style scoped lang="less">
#orderReport {
  .allhea {
    /*padding-top: 44px;*/
  }
  .presentation {
    color: @mainColor;
    .fontSize(14);
    text-align: center;
    .margin(20, 0, 30, 0);
  }
  .ending_tag {
    .margin(10, 0, 20, 0);
    width: 100%;
    .ending_title {
      .fontSize(18);
      color: @fontColor33;
      font-weight: bold;
      .margin(0, 0, 13, 12);
    }
    .ending {
      width: 93.5vw;
      background: @fontColorff;
      margin: 0 auto;
      border-radius: 2.7vw;
      .ending_n {
        width: 100%;
        .height(46);
        .lineHeight(46);
        border-bottom: 1px solid @backcolor;
        padding-left: 2.7vw;
        color: @fontColor66;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .fontSize(16);
        .z {
          color: @fontColor33;
        }
        .y {
          color: @mainColor;
          font-weight: 400;
        }
      }
      .zz {
        color: @fontColor33;
      }
      .ending_n:last-child {
        border-bottom: 0px;
      }
    }
  }
  -webkit-overflow-scrolling: touch;
  width: 100%;
  // .height(377);
  // .padding(136, 0, 0, 0);
  .pic {
    .width(102);
    .height(86);
    // position: absolute;
    // margin-top: (8/375) * 100vw;
    margin-left: (137/375) * 100vw;
  }
  .title {
    color: @fontColor33;
    .fontSize(18);
    // position: absolute;
    margin-top: (11/375) * 100vw;
    margin-left: (130/375) * 100vw;
    margin-bottom: (30/375) * 100vw;
  }
  .bottom {
    padding-bottom: (20 / 375) * 100vw;

    /deep/ .van-button {
      width: 93.6vw;
      .height(44);
      line-height: 44px;
      margin-left: 3.2vw;
      color: @fontColorff;
      font-size: 4.3vw;
      .borderRadius(10, 10, 10, 10);
    }
    /deep/ .van-button--normal {
      width: 93.6vw;
      margin-left: 3.2vw;
      margin-top: 20px;
      color: @mainColor !important;
      font-size: 4.3vw;
      .borderRadius(10, 10, 10, 10);
      background: @backcolor !important;
      border: 1px solid @mainColor !important;
    }
  }
  .pass {
    display: none;
    .pass_tag {
      .margin(10, 0, 20, 0);
      width: 100%;
      .pass_title {
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
        .margin(0, 0, 13, 12);
      }
      .tag {
        width: 93.5vw;
        background: @fontColorff;
        margin: 0 auto;
        border-radius: 2.7vw;
        .tag_n {
          width: 100%;
          .height(46);
          .lineHeight(46);
          border-bottom: 1px solid @backcolor;
          padding-left: 2.7vw;
          color: @fontColor66;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .fontSize(16);
          .z {
            color: @fontColor33;
          }
          .y {
            color: @mainColor;
            font-weight: 400;
          }
        }
        .tag_ai {
          padding: 10px 10px 5px;
          font-size: 16px;
          line-height: 30px;
        }
        .zz {
          color: @fontColor33;
        }
        .tag_n:last-child {
          border-bottom: 0px;
        }
      }
    }
  }
}
</style>
