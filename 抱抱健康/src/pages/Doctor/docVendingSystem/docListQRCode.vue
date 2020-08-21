/* * @Author: 田东 * @Date: 2020-01-03 14:59:25 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-10 17:05:27 * @Description:智配柜 生成二维码 */

<!---->
<template>
  <div id="docListQRCode">
    <common-header
      :share-disabled="true"
      :custom-title="'商品清单二维码'"
      :header-show="true"
      title="商品清单二维码"
    ></common-header>
    <div class="content">
      <div class="code">
        <span>
          请告知用户此8位方案码，
          <br />由用户在“抱抱健康”公众号(或智配柜)
          <br />输入领取方案
        </span>
        <p>{{total}}</p>
      </div>
      <div class="qrcode">
        <img :src="qrcode" alt />
      </div>
      <p class="desc">也可由用户扫描二维码直接领取方案</p>
      <van-button slot="button" class="next-btn" size="large" @click="close">完成</van-button>
    </div>
  </div>
</template>

<script>
import faillog from "../../../assets/images/bgList.png";
import commonHeader from "../../../components/commonHeader/common_header";
import wx from "weixin-js-sdk";

export default {
  name: "docListQRCode",
  data() {
    return {
      qrcode: "",
      orderId: "",
      total: ""
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.total = this.$route.query.total;
    this.getState(this.orderId);
  },
  methods: {
    getState(data) {
      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/generateQrCodeForOrder",
          body: {
            orderId: data
          }
        })
        .then(res => {
          if (res.data.success) {
            this.qrcode =
              "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" +
              res.data.data;
          } else {
            console.log("数据请求失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 关闭
    close() {
      wx.closeWindow();
    }
  }
};
</script>

<style lang="less" scoped>
#docListQRCode {
  // overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: @backgroundColor;
  .padding(44, 0, 0, 0);

  .content {
    .height(582);
    box-sizing: border-box;
    .margin(35, 0, 0, 0);
    text-align: center;
    background: url("../../../assets/images/QRCode_bg.png") no-repeat center
      center;
    background-size: cover;
    .padding(177, 0, 0, 0);

    div.qrcode {
      background-color: #fff;
      .width(110);
      .height(110);
      margin: 0 auto 4vw;

      img {
        width: 100%;
        height: 100%;
      }
    }

    div.code {
      text-align: center;

      span {
        .fontSize(16);
        font-weight: 400;
        color: @titleColor;
        .lineHeight(22);
      }

      p {
        .fontSize(40);
        font-weight: 800;
        .lineHeight(56);
        color: @mainColor;
        .margin(15, 0, 28, 0);
      }
    }

    p.desc {
      .fontSize(16);
      text-align: center;
      color: @titleColor;
      .lineHeight(22);
      font-weight: 400;
    }

    .next-btn {
      .width(275);
      .height(44);
      background: linear-gradient(225deg, #0180ff 0%, #0069ff 100%);
      .borderRadius(10, 10, 10, 10);
      .lineHeight(44);
      margin: 5.3vw auto 0;

      .van-button__text {
        .fontSize(18);
        font-weight: bold;
        color: #fff;
        .lineHeight(42);
      }
    }
  }
}
</style>
