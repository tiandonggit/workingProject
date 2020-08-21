/*
 * @Author: 田东
 * @Date: 2020-04-09 13:09:01
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-29 16:27:20
 * name 产品详情
 */

<template>
  <div id="productDetails">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="swipe-box">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in productDetails.imgUrlList" :key="index">
          <img :src="image" alt />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="card-block">
      <div class="block-box">
        <p class="price">¥{{price}}</p>
        <p class="name">{{productDetails.goodsName}}</p>
      </div>
    </div>
    <div class="card-block">
      <div class="product-info">
        <p class="info-title">产品信息</p>
        <p class="info-desc">产品编号：{{productDetails.sid}}</p>
        <p class="info-desc">产品类别：{{productDetails.category}}</p>
        <p class="info-desc">规格：{{productDetails.sname}}</p>
        <p class="info-desc">营养比例：{{productDetails.yybi}}</p>
        <p class="info-desc">保质期：{{productDetails.expiDate}}天</p>
        <p class="info-desc">用法用量：{{productDetails.susage}}</p>
      </div>
    </div>
    <div class="card-block">
      <div class="product-info">
        <p class="info-title">产品属性</p>
        <p class="info-desc">蛋白种类：{{productDetails.dbzl}}</p>
        <p class="info-desc">蛋白类型：{{productDetails.dblx}}</p>
        <p class="info-desc">维生素：{{productDetails.vit}}</p>
        <p class="info-desc">膳食纤维：{{productDetails.ssxw}}</p>
        <p class="info-desc">益生元：{{productDetails.ysy}}</p>
        <p class="info-desc">益生菌：{{productDetails.ysj}}</p>
        <p class="info-desc">微量元素：{{productDetails.wlys}}</p>
        <p class="info-desc">电解质：{{productDetails.djz}}</p>
        <p class="info-desc">不饱和脂肪酸：{{productDetails.bbhzfs}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast } from "vant";

export default {
  name: "productDetails",
  components: {
    commonHeader,
  },
  data() {
    return {
      title: "产品详情",
      customTitle: "营养方案",
      productDetails: {},
      specId: "",
      price: "",
    };
  },
  created() {
    this.specId = this.$route.query.specId || "";
    if (this.$route.query.price) {
      this.price = (this.$route.query.price / 100).toFixed(2) || "";
    }
    this.getProductDetails();
  },
  methods: {
    getProductDetails() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/getSpecDetial",
          body: { specId: this.specId },
        })
        .then((res) => {
          let data = res.data;
          if (data.success) {
            this.productDetails = data.data;
            this.scrollToTop();
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    scrollToTop() {
      let _this = this;
      try {
        this.$nextTick(() => {
          setTimeout(function () {
            // document.querySelectorAll("html")[0].scrollTop = 0;
            window.pageYoffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }, 100);
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="less" scoped>
#productDetails {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .swipe-box {
    .padding(44,0,0,0);
    margin-bottom: 4vw;

    /deep/ .van-swipe {
      img {
        width: 100%;
        display: block;
      }
    }
  }

  .card-block {
    .width(351);
    margin: 0 auto 4vw;
    background: #fff;
    .borderRadius(10,10,10,10);
    .padding(15,0,15,0);

    p {
      .padding(0,10,0,10);
    }

    .price {
      .fontSize(24);
      font-weight: 600;
      color: @fontColorFF3;
      .lineHeight(26);
      .margin(0,0,13,0);
    }

    .name {
      .fontSize(16);
      font-weight: 600;
      color: @fontColor33;
      .lineHeight(20);
    }

    .info-title {
      .fontSize(16);
      .padding(0,10,13,25);
      font-weight: 400;
      color: @fontColor33;
      .lineHeight(18);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background-image: url("../../../assets/images/icon_zhu.png");
      background-repeat: no-repeat;
      background-position: 2.67vw top;
      background-size: 1.07vw;
    }

    .info-desc {
      .fontSize(16);
      font-weight: 400;
      color: @fontColor66;
      .lineHeight(18);
      .margin(13,0,0,0);
    }
  }
}
</style>
