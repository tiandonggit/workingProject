/* * @Author: 田东 * @Date: 2020-01-03 16:52:50 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-03 16:52:50 * @name 付费咨询 医生回复 */
<template>
  <div id="submitAdvise">
    <common-header
      :share-disabled="true"
      :custom-title="'付费咨询'"
    ></common-header>
    <div class="header_box clearfix">
      <div class="header-div header-left" @click="headerBack()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">付费咨询</div>
      <div class="price header-right">
        <img src="../../../assets/images/iconBell.png" alt />
        ¥ {{ (consultDetail.tarrif / 100).toFixed(2) }}
      </div>
    </div>
    <div class="card_box">
      <div class="title"><span>患者信息</span></div>
      <div class="content">
        <p>
          基本信息：{{ personInfo.name }} | {{ sex }} | {{ personInfo.age }}岁
        </p>
        <p>患病时长：{{ illnessdurationDes }}</p>
        <p>
          过敏史：{{ personInfo.irritability ? personInfo.irritability : "无" }}
        </p>
        <p>过往病史：{{ personInfo.illness ? personInfo.illness : "无" }}</p>
        <p>
          家族病史：{{ personInfo.inheritance ? personInfo.inheritance : "无" }}
        </p>
      </div>
    </div>
    <div class="card_box">
      <div class="title">
        <span>病情描述</span>
        <span class="price">
          <img src="../../../assets/images/iconBell.png" alt />
          ¥ {{ (consultDetail.tarrif / 100).toFixed(2) }}
        </span>
      </div>
      <div class="content">
        <p class="des">{{ consultDetail.illnessdesc }}</p>
        <div
          class="item_cell"
          v-for="(img, key) in consultDetail.imageList"
          :key="key"
        >
          <div class="cell photo" @click="checkImg(key)">
            <img class="img" :src="img" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="card_box" v-if="consultDetail.status === 1">
      <div class="title"><span>医生回复</span></div>
      <div class="content">
        <van-field
          v-model="message"
          type="textarea"
          placeholder="请输入您的回复"
          autosize
        />
      </div>
    </div>

    <div class="card_box" v-if="consultDetail.status === 2">
      <div class="title"><span>医生回复</span></div>
      <div class="content">
        <p class="des">{{ consultDetail.answer }}</p>
      </div>
    </div>

    <div class="foot" v-if="consultDetail.status === 1">
      <p><span>*</span>24小时内未回复，系统将自动退款，付费咨询失效。</p>
      <div class="footer-box">
        <van-button
          slot="button"
          class="next-btn"
          size="large"
          @click="sendMessage"
          >发送</van-button
        >
      </div>
    </div>

    <div class="foot" v-if="consultDetail.status === 3">
      <p><span>*</span>24小时内未回复，问题已失效。</p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { ImagePreview, Toast, Field } from "vant";
Vue.use(ImagePreview);
Vue.use(Field);
import fly from "flyio";

import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "submitAdvise",
  components: {
    commonHeader
  },
  data() {
    return {
      actions: [
        { name: "<1天", key: 1 },
        { name: "1天 — 1周", key: 2 },
        { name: "1周 — 1个月", key: 3 },
        { name: "1个月 — 3个月", key: 4 },
        { name: "3个月以上", key: 5 }
      ],
      illnessdurationDes: "",
      message: "", //回复内容
      payConsultId: "", // 咨询ID
      personInfo: "",
      sex: "",
      rpatientid: "", //患者id
      consultDetail: "" // 咨询详情
    };
  },
  created() {
    this.payConsultId = this.$route.query.payConsultId;
    this.getConsultDetail();
  },
  computed: {},
  methods: {
    sendMessage() {
      this.$http
        .request({
          method: "post",
          url: "/RPayConsultController/doctorAnswer",
          body: {
            content: this.message,
            payConsultId: this.payConsultId
          }
        })
        .then(res => {
          if (res.data.success) {
            console.log(this.$route.query.status);
            if (this.$route.query.status == 1) {
              WeixinJSBridge.call("closeWindow");
            } else {
              this.$router.go(-1);
            }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("未知错误");
        });
    },
    getPersonInfo() {
      this.$http
        .request({
          method: "get",
          url: "/RPatientController/selectByPrimarySId",
          body: {
            id: this.rpatientid
          }
        })
        .then(res => {
          if (res.data.success) {
            this.personInfo = res.data.data;
            if (this.personInfo.sex == 1) {
              this.sex = "男";
            } else if (this.personInfo.sex == 2) {
              this.sex = "女";
            } else {
              this.sex = "";
            }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getConsultDetail() {
      this.$http
        .request({
          method: "get",
          url: "/RPayConsultController/getConsultDetail",
          body: {
            payConsultId: this.payConsultId
          }
        })
        .then(res => {
          if (res.data.success) {
            this.consultDetail = res.data.data;
            this.rpatientid = this.consultDetail.rpatientid;
            this.actions.forEach((v, e) => {
              if (v.key === this.consultDetail.illnessduration) {
                this.illnessdurationDes = v.name;
              }
            });
            this.getPersonInfo();
          } else {
            Toast(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkImg(key) {
      console.log("sss", key);
      ImagePreview({
        images: this.consultDetail.imageList,
        closeOnPopstate: true,
        onClose() {
          // do something
          console.log("关闭了");
        },
        startPosition: key
      });
    },
    headerBack() {
      console.log("window.history.length: ", window.history.length);
      if (window.history.length <= 1) {
        //如果没有上一页了则退出公众号
        try {
          WeixinJSBridge.call("closeWindow");
        } catch (e) {
          console.log(e);
        }
        // this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
.van-field {
  padding-left: 0;
}
#submitAdvise {
  background: @backgroundColor;
  height: 100%;

  .header_box {
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100vw;
    height: auto;
    background: @backgroundColor;

    .header-left {
      float: left;
      .width(100);
      .height(44);
      .lineHeight(44);
      .padding(0, 0, 0, 10);

      .back-icon {
        .fontSize(20);
        font-weight: 600;
        color: @titleColor;
      }
    }

    .header-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      .fontSize(18);
      width: 0;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 400;
      color: @titleColor;
      .lineHeight(44);
    }

    .header-right {
      text-align: right;
      .width(100);
      .padding(0, 12, 0, 0);
      color: @fontFF3Color;
      .fontSize(16);
      font-weight: 500;
      .lineHeight(16);

      img {
        .width(19);
        vertical-align: text-bottom;
      }
    }
  }

  .card_box {
    background: @backgroundColorT;
    .width(351);
    // .height(178);
    // min-height: 47.467vw;
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;
    margin: 0 auto 20px;

    .title {
      .height(40);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background: url("../../../assets/images/icon_zhu.png") 3.2vw center
        no-repeat;
      background-size: 1.07vw;

      span {
        .padding(0, 0, 0, 14);
        .fontSize(16);
        display: inline-block;
        font-weight: bold;
        color: @titleColor;
        .lineHeight(17);
      }

      .price {
        .margin(0, 10, 0, 0);
        color: @fontFF3Color;
        .fontSize(16);
        font-weight: 500;
        .lineHeight(16);

        img {
          .width(19);
          vertical-align: text-bottom;
        }
      }
    }

    .content {
      p {
        .fontSize(16);
        font-weight: 400;
        color: @titleColor;
        .lineHeight(44);
        .padding(0, 0, 0, 10);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        &:last-child {
          border-bottom: none;
        }
      }

      .des {
        .padding(15, 12, 15, 12);
        .lineHeight(20);
        word-break: break-all;
      }

      .item_cell {
        width: 33%;
        display: inline-block;
        text-align: center;
        .margin(15, 0, 15, 0);

        input {
          display: none;
        }
      }

      .cell {
        .width(78);
        .height(78);
        display: inline-block;
        vertical-align: bottom;

        div {
          border: 2px dashed @payAdvisoryBordercolor;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          .iconfont {
            .fontSize(36);
            color: @payAdvisoryIconColor;
          }
        }
      }

      .photo {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        .borderRadius(8, 8, 8, 8);
        overflow: hidden;
        position: relative;

        .iconfont {
          position: absolute;
          top: 0;
          right: 0;
        }

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      /deep/ .van-field {
        .padding(10, 10, 10, 10);

        textarea {
          .fontSize(16);
          .height(29) !important;
        }
      }
    }
  }

  .foot {
    .margin(12, 0, 70, 0);

    p {
      .margin(0, 0, 12, 12);
      color: @descriptionColor;
      .fontSize(14);
      span {
        color: @payAdvisoryRedColor;
      }
    }
  }
}
</style>
