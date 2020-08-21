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
  <div>
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div id="his_report">
      <img :src="pic" class="pic" />
      <div class="title">{{ head_title }}</div>
      <PrescriptionNote :value="baseInfo" :list="productInfo"  />
      <div>
        <div class="bottom">
          <van-button @click="$throttle(lookpre)" size="large"
            >查看营养报告</van-button
          >
          <van-button
            @click="$throttle(lookcode)"
            v-show="baseInfo.type == 1"
            type="primary"
            >展示患者二维码</van-button
          >
        </div>
        <div class="pass">
          <div class="pass_tag">
            <div class="pass_title">
              <span class="span_kong"></span>智配柜信息
            </div>
            <div class="tag_border"></div>
            <div class="tag">
              <div class="tag_ai zz">
                智配柜编号：{{ baseInfo.deviceCode }}<br />
                地址：{{ baseInfo.deviceFullAdress }}<br />
              </div>
            </div>
          </div>
        </div>
        <div class="pass">
          <div class="pass_tag">
            <div class="pass_title">
              <span class="span_kong"></span>患者购买状态
            </div>
            <div class="tag_border"></div>
            <div class="tag">
              <div class="tag_n zz">
                患者购买状态:<span class="y">{{
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
  name: "his_report",
  data() {
    return {
      title: "营养方案",
      customTitle: "营养筛查",
      bg: false,
      head_title: "营养方案审核通过",
      pass: false,
      pic: require("../../assets/img/htbg.png"),
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
          prescriptionId: window.sessionStorage.getItem("id"),
          status: 1
        }
      });
    },
    //查看营养诊断报告
    lookpre() {
      this.$router.push({
        name: "results",
        query: {
          prescriptionId: window.sessionStorage.getItem("id"),
          state: 1
        }
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
            console.log(this.baseInfo);
            this.productInfo = res.data.data.specList;
            window.sessionStorage.setItem("pid", res.data.data.lowerdoctorid); //增加选择医生加的传参 (张松仁)
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
.main {
  margin-top: 58px;
}
#his_report {
  height: 100%;
  .presentation {
    color: @mainColor;
    .fontSize(14);
    text-align: center;
    .margin(30, 0, 30, 0);
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
  .padding(136, 0, 0, 0);

  .pic {
    .width(60);
    .height(60);
    position: absolute;
    top: (66/375) * 100vw;
    left: (163/375) * 100vw;
  }
  .title {
    color: @fontColor33;
    .fontSize(20);
    position: absolute;
    top: (139/375) * 100vw;
    left: (108/375) * 100vw;
  }
  .bottom {
    padding-bottom: (20 / 375) * 100vw;
    /deep/ .van-button {
      height: 44px;
      line-height: 44px;
      width: 93.6vw;
      margin-left: 3.2vw;
      color: @fontColorff;
      font-size: 4.3vw;
      .borderRadius(6, 6, 6, 6);
    }
    /deep/ .van-button--normal {
      width: 93.6vw;
      margin-left: 3.2vw;
      margin-top: 20px;
      color: @mainColor !important;
      font-size: 4.3vw;
      .borderRadius(6, 6, 6, 6);
      background: @backcolor !important;
      border: 1px solid @mainColor !important;
    }
  }
  .pass {
    width: 90%;
    margin: 0 auto;
    .pass_tag {
      border-radius: 2.7vw;
      background-color: #fff;
      .margin(10, 0, 20, 0);
      width: 100%;
      .pass_title {
        height: 52px;
        line-height: 52px;
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
      }

      .tag_border {
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .span_kong {
        float: left;
        width: 4px;
        height: 16px;
        background: linear-gradient(
          180deg,
          rgba(0, 105, 255, 1) 0%,
          rgba(1, 128, 255, 1) 100%
        );
        border-radius: 2px;
        margin-top: 18px;
        margin-left: 10px;
        margin-right: 10px;
      }
      .tag {
        // width: 93.5vw;
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
            color: @fontColor66;
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
          color: @fontColor66;
        }
        .tag_n:last-child {
          border-bottom: 0px;
        }
      }
    }
  }
}
</style>
