/*
 * @Author: 田东
 * @Date: 2020-04-09 13:09:01
 * @Last Modified by: 田东
 * @Last Modified time: 2020-04-10 17:31:24
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
          <img :src="image" alt="">
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
// import { Toast } from "vant";

export default {
  name: "productDetails",
  components: {
    commonHeader
  },
  data() {
    return {
      title: "产品详情",
      customTitle: "营养方案",
      productDetails: {},
      specId: "",
      price:''
    };
  },
  created() {
    this.specId = this.$route.query.specId || "";
    if(this.$route.query.price) {
      this.price = (this.$route.query.price/100).toFixed(2) || ''
    }
    this.getProductDetails();
  },
  methods: {
    getProductDetails(){
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/getSpecDetial",
          body: { specId: this.specId}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.productDetails = data.data;
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    }
  }
};
</script>
<style lang="less" scoped>
#productDetails {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .swipe-box {
    padding-top: 44px;
    margin-bottom: 15px;

    /deep/ .van-swipe {
      img {
        width: 100%;
        display: block;
      }
    }
  }

  .card-block {
    width: 351px;
    margin: 0 auto 15px;
    background: #fff;
    border-radius: 10px;
    padding: 15px 0;

    p {
      padding: 0 10px;
    }

    .price {
      font-size: 24px;
      font-weight: 600;
      color: @fontColorFF3;
      line-height: 26px;
      margin-bottom: 13px;
    }

    .name {
      font-size: 16px;
      font-weight: 600;
      color: @fontColor33;
      line-height: 20px;
    }

    .info-title {
      font-size: 16px;
      padding: 0 10px 13px 25px;
      font-weight: 400;
      color: @fontColor33;
      line-height: 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background-image: url("../../assets/img/icon_zhu.png");
      background-repeat: no-repeat;
      background-position: 10px top;
      background-size: 4px;
    }

    .info-desc {
      font-size: 16px;
      font-weight: 400;
      color: @fontColor66;
      line-height: 18px;
      margin-top: 13px;
    }
  }
}
</style>
