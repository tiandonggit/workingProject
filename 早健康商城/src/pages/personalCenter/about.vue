/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-05 18:44:00
 * @name 系统设置
 */

<template>
  <div id="about" :style="{ height: bodyHeight + 'px' }">
    <div class="top">
      <!-- 头部 -->
      <v-header :title="title"></v-header>
      <!-- 内容区 -->
      <div class="card_box">
        <div class="top_img">
          <img src="../../assets/images/about.png" alt>
        </div>
        <div class="systom_box">
          <span class="systom_num">版本号V1.0</span>
        </div>
        <van-cell-group>
          <van-cell
            v-for="(agreement, key) in agreementList"
            :key="key"
            :title="agreement.sagreementname"
            @click="goAgreementDetails(agreement.id)"
            is-link
          />
        </van-cell-group>
      </div>
    </div>
    <div class="tel">
      <a>
        Copyright© 2018 365zjk.net
        <br>早健康商城 版权所有
      </a>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import { Toast } from "vant";

export default {
  name: "about",
  data() {
    return {
      // 组件数据
      title: "关于",
      // 本页数据
      agreementList: [],
      bodyHeight: 0
    };
  },
  components: {
    "v-header": Header
  },
  mounted: function() {
    this.bodyHeight = document.documentElement.clientHeight;
    this.getAgreement();
  },
  methods: {
    getAgreement() {
      this.$http
        .request({
          method: "get",
          url: "/SAgreementController/selectSagreementcontentS", // 获取协议
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.agreementList = data.data;
          } else {
            // 其他
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    goAgreementDetails(id) {
      if (!this.scienceWX) {
        this.$router.push({
          path: "../loginRegistered/agreementDetails",
          query: { id: id }
        });
      } else {
        this.$routerWX.push({
          path: "../loginRegistered/agreementDetails",
          query: { id: id }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

html {
  height: 100%;
  background: @backgroundColor;
}

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}

#about {
  height: 100%;

  .top {
    height: 92%;
  }
  .tel {
    height: 8%;
    text-align: center;

    a {
      .fontSize(12);
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: @descriptionColor;
    }
  }
  .card_box {
    width: 94vw;
    margin: 3vw auto;
    background: @backgroundColorT;
    border-radius: 2.7vw;
    overflow: hidden;

    .top_img {
      padding-top: 10.4vw;
      text-align: center;

      img {
        display: inline-block;
        width: 25.6vw;
      }
    }

    .systom_box {
      text-align: center;
      margin: 3.2vw 0 9.3vw;
      line-height: 3.2vw;

      .systom_num {
        .fontSize(12);
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: @descriptionColor;
      }
    }
  }

  .head_portrait_box {
    .van-cell {
      line-height: 13.3vw;

      .van-icon {
        height: 13.3vw;
        line-height: 13.3vw;
      }
      .van-cell__left-icon {
        width: 13.3vw;
        margin-right: 4.5vw;
        border-radius: 6.7vw;
        overflow: hidden;
      }
    }
  }

  .dividing {
    margin: 3.5vw 0;
  }

  .van-hairline--top-bottom::after {
    border: none;
  }

  .van-cell__title {
    color: @titleColor;
    .fontSize(15);
    font-family: PingFang-SC-Regular;
    font-weight: 400;
  }
}
</style>
