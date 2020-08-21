/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: introduce * @function:
图文介绍 * @date: 2019/12/13 * @time: 13:42 * * */
<template>
  <div id="introduce">
    <common-header :share-disabled="true" :custom-title="title"></common-header>
    <div class="main">
      <img src="../../../assets/images/introduce.jpg" alt=""/>
    </div>
    <div class="foot">
      <div class="box">
        <div class="foot_left">
          此为普通用户注册入口，专业医生请勿注册(如需注册请联系平台客服4000909975)
        </div>
        <div class="foot_right">
          <van-button type="default" @click="goRegister()">点击注册</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {serviceHost} from '../../../utils/httpConfig';

  export default {
    name: "introduce",
    components: {
      commonHeader
    },

    data() {
      return {
        title: "抱抱健康患者端"
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      goRegister() {
        //调用重定向
        // window.location.href = 'https://bbjk.quickhealmall.com/api/wechat/getAuthorizeUrl?menuId=8001';
        window.location.href = serviceHost + "wechat/getAuthorizeUrl?menuId=8001";
        // this.$http
        //   .request({
        //     method: "get",
        //     url: "/wechat/getAuthorizeUrl?menuId=8001",
        //     body: {
        //     }
        //   })
        // this.$router.push({
        //   name: "patientRegister"
        // });
      }
    }
  };
</script>

<style lang="less" scoped>
  #introduce {
    .main {
      width: 100%;
      padding-bottom: 50px;

      img {
        width: 100%;
      }
    }

    .foot {
      width: 100%;
      position: fixed;
      bottom: 0px;
      background: @backgroundColorT;

      .box {
        padding: 7px 12px;
        display: flex;
        justify-content: space-between;

        .foot_left {
          .width(230);
          .fontSize(12);
          .lineHeight(17);
          .padding(0, 10, 0, 0);
          color: @font9FFColor;
        }

        .foot_right {
          display: flex;
          align-items: center;

          button {
            height: 36px;
            width: 111px;
            line-height: 36px;
            border: 0;
            font-size: 20px;
            font-weight: bold;
            color: @fontOne;
            border-radius: 10px;
            background: linear-gradient(131deg,
            rgba(0, 105, 255, 1) 0%,
            rgba(1, 128, 255, 1) 100%);
          }
        }
      }
    }
  }
</style>
