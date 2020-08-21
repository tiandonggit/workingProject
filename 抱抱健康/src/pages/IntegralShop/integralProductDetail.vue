<!--
  作者:马林
  用途:
  -------------------
  Created by webStorm
  User: tyx
  Date: 2020/1/2 0002
  Time: 9:27
  Application: integralProductDetail
  State: page
-->
<template>
  <div class="integralProductDetail">
    <div class="v-title">
      <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="true"
        :title="title"
      ></commonHeader>
    </div>
    <div class="v-body">
      <div class="v-swipe">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img
              @click="showImagePreview(index)"
              v-lazy="image"
              :src="image"
              alt
            />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="v-message">
        <div class="v-total">
          <span>{{ product.points }}</span
          >{{ type == 0 ? "健康" : "智" }}币
        </div>
        <div class="v-name">
          {{ product.saletitle }}
        </div>
        <div class="v-tip">规格：{{ product.specification }}</div>
        <div class="v-tip v-tips">库存：{{ product.store }}</div>
      </div>
      <div class="v-main">
        <div class="v-mainTitle">
          <div class="v-mainImg">
            <img src="../../assets/images/integraProductTitle.png" alt="" />
          </div>
        </div>
        <div class="v-mainHtml" v-html="product.html"></div>
        <div class="noHtml"></div>
      </div>
    </div>
    <div class="footer-box" :class="!payState ? 'v-noPay' : ''">
      <van-button
        @click="$throttle(pay)"
        slot="button"
        class="next-btn"
        size="large"
        >立即兑换</van-button
      >
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import { ImagePreview, Toast } from "vant";

export default {
  name: "integralProductDetail",
  data() {
    return {
      id: this.$route.query.id,
      customTitle: "礼品商城",
      title: "礼品详情",
      point: window.sessionStorage.getItem("userPoint"),
      type: this.$route.query.type ? this.$route.query.type : 0, //身份:0患者 1医生
      payState: false, //是否可以购买
      images: [
        /* "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=186640083,2965120701&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3051638283,922006353&fm=15&gp=0.jpg",
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3420903978,3746274559&fm=15&gp=0.jpg"*/
      ],
      product: {
        // saletitle:
        //   "舒脑欣滴丸天津中新药厂制作缓解头痛舒脑欣滴丸天津中新药厂制作缓解头痛嗷嗷灵验了", //商品标题
        // points: "1225", //积分数
        // specification: "12g*10袋/盒", //规格
        // store: "3837" //库存
        saletitle: "", //商品标题
        points: "", //积分数
        specification: "", //规格
        store: "" //库存
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.selectByPrimaryKey();
    },
    /**
     * 查询商品详情
     */
    selectByPrimaryKey() {
      this.$http
        .request({
          method: "get",
          url: "/ProductManagerController/selectByPrimaryKey",
          body: {
            id: this.id
          }
        })
        .then(res => {
          if (res.data.success) {
            this.product = res.data.data.productManager;
            // this.images = res.data.data.productImgList;
            for (let i = 0; i < res.data.data.productImgList.length; i++) {
              this.images.push(res.data.data.productImgList[i].imgurl);
            }
            if (

                this.point &&
                this.point > 0 &&
                this.point / res.data.data.productManager.points > 1 &&
                this.product.store >0

            ) {
              this.payState = true;
            }
          } else {
            Toast("查询用户积分数失败");
          }
        })
        .catch(error => {
          Toast(error);
        });
    },
    /**
     * 查询商品详情
     */
    pay() {
      if (!this.payState) {
        if(this.product.store  <= 0){
            Toast("库存不足");
        }else{
          Toast("您的积分不足");
        }
        return;
      }
      this.$router.push({
        name: "integralConfirm",
        query: { id: this.product.id, type: this.type }
      });
    },
    /**
     * 点击图片放大
     * @param position
     */
    showImagePreview(position) {
      let images = this.images;
      ImagePreview({
        images,
        startPosition: typeof position === "number" ? position : 0
      });
    }
  },
  components: {
    commonHeader
  }
};
</script>

<style lang="less" scoped>
.integralProductDetail {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .fontSize(16);
  color: @titleColor;
  background-color: @backgroundColor;

  .v-title {
    width: 100%;
    .height(44);
    /deep/ .header {
      z-index: 99;
    }
  }

  .v-body {
    flex: 1;
    overflow: auto;

    .v-swipe {
      .height(330);

      /deep/ .van-swipe {
        .height(330);
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .v-message {
      .margin(15, 12, 12, 12);
      .borderRadius(10, 10, 10, 10);
      background-color: #fff;
      .padding(15, 10, 13, 10);

      .v-total {
        .fontSize(18);
        font-weight: 600;
        color: @redOne;

        span {
          font-weight: 600;
          .fontSize(24);
        }
      }

      .v-name {
        font-weight: 600;
        .lineHeight(20);
        .overflowline(2);
        .margin(13, 0, 11, 0);
      }

      .v-tip {
        .fontSize(14);
        font-weight: 400;
        .lineHeight(18);
        color: @subtitleColor;
      }
      .v-tips {
        .margin(13, 0, 0, 0);
      }
    }

    .v-main {
      .v-mainTitle {
        .v-mainImg {
          .width(189);
          .height(31);
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .v-mainHtml {
        .margin(8, 0, 0, 0);
        /deep/ img {
          max-width: 100% !important;
        }
      }
      .noHtml {
        .height(68);
      }
    }
  }
  .v-noPay {
    /deep/ .next-btn {
      background: @descriptionColor;
    }
  }
}
</style>
