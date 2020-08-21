<!--
  作者：刘硕
  时间：2019/5/14
  康复包页
-->
<template>
  <div id="Recovery">
    <v-header :title="title"></v-header>
    <!--轮播图-->
    <van-swipe :autoplay="6000" v-if="images.length > 0" :height="height" indicator-color="#E98C2E">
      <van-swipe-item
        v-for="(image, index) in images"
        :key="index"
        @click="advertLink(image.jumptype, image.jumplink)"
      >
        <img v-lazy="image.advertimg">
      </van-swipe-item>
    </van-swipe>

    <!--超值特卖-->
    <div v-if="overflowPrice.length > 0" class="rec-special">
      <span class="rec-special-span">超值特卖</span>
      <div class="rec-special-loop">
        <div
          class="rec-special-item"
          v-for="(item, index) in overflowPrice"
          :key="index"
          @click="productes(item.productid)"
        >
          <img :src="item.sproductimg" alt class="rec-special-img">
          <!--          <img-->
          <!--            src="../../assets/images/pro231.png"-->
          <!--            alt=""-->
          <!--            class="rec-special-img"-->
          <!--          />-->
          <!--          弃用下面的改为图片显示-->
          <!--          <span class="rec-special-spanT">十月结晶待产包</span>-->
          <!--          <span class="rec-special-spanTh">￥987.00</span>-->
        </div>
      </div>
    </div>
    <!--新品推荐-->
    <div class="new-pro" @click="productes(hotProduct.productid)" v-if="hotProduct">
      <div class="new-pro-left">
        <span class="new-pro-span">热门新品推荐</span>
        <button class="new-pro-button">立即抢购</button>
      </div>
      <div class="new-pro-right">
        <img :src="hotProduct.producttagimg" alt class="new-pro-img">
      </div>
    </div>
    <!--广告位-->
    <div v-if="overflowPrice.length > 0 && hotProduct"  class="advertising" @click="advertLink(advert1.jumptype, advert1.jumplink)">
      <img :src="advert1.advertimg" alt>
    </div>
    <!--编辑精选-->
    <div class="edit-selected" v-if="handpick.length > 0">
      <div class="edit-selected-title">编辑精选</div>
      <div
        class="edit-selected-background"
        @click="productes(item.productid)"
        v-for="(item, index) in handpick"
        :key="index"
      >
        <img :src="item.sproductimg" alt class="edit-selecte-img">
        <div class="edit-selected-ul">
          <div class="edit-selected-li">
            <div
              class="edit-selected-item"
              v-for="(item2, index2) in item.packageAndChild.childProductInfo"
              :key="index2"
              @click.stop="productes(item2.OwnerId_)"
            >
              <div class="edit-selected-item-top">
                <img :src="item2.img" alt class="edit-selected-imgT">
                <div class="edit-selected-item-title">{{ item2.productName }}</div>
              </div>
              <div class="edit-selected-span">￥{{ (item2.productPrice / 100).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
      <!--      <div-->
      <!--        class="edit-selected-background"-->
      <!--        @click="productes(handpickChildhood.packageInfo.id)"-->
      <!--        v-if="handpickChildhood.childProductInfo.length>0"-->
      <!--      >-->
      <!--        <img-->
      <!--          src="../../assets/images/yun.png"-->
      <!--          alt=""-->
      <!--          class="edit-selecte-img"-->
      <!--        />-->
      <!--        <div class="edit-selected-ul">-->
      <!--          <div class="edit-selected-li">-->
      <!--            <div-->
      <!--              class="edit-selected-item"-->
      <!--              v-for="(item, index) in handpickChildhood.childProductInfo"-->
      <!--              :key="index"-->
      <!--              @click.stop="productes(item.OwnerId_)"-->
      <!--            >-->
      <!--              <div class="edit-selected-item-top">-->
      <!--                <img :src="item.img" alt="" class="edit-selected-imgT" />-->
      <!--                <div class="edit-selected-item-title">-->
      <!--                  {{ item.productName }}-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <div class="edit-selected-span">-->
      <!--                ￥{{ (item.productPrice / 100).toFixed(2) }}-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div-->
      <!--        class="edit-selected-background"-->
      <!--        @click="productes(handpickOldPeople.packageInfo.id)"-->
      <!--        v-if="handpickOldPeople.childProductInfo.length>0"-->
      <!--      >-->
      <!--        <img-->
      <!--          src="../../assets/images/oldpeople.png"-->
      <!--          alt=""-->
      <!--          class="edit-selecte-img"-->
      <!--        />-->
      <!--        <div class="edit-selected-ul">-->
      <!--          <div class="edit-selected-li">-->
      <!--            <div-->
      <!--              class="edit-selected-item"-->
      <!--              v-for="(item, index) in handpickOldPeople.childProductInfo"-->
      <!--              :key="index"-->
      <!--              @click.stop="productes(item.OwnerId_)"-->
      <!--            >-->
      <!--              <div class="edit-selected-item-top">-->
      <!--                <img :src="item.img" alt="" class="edit-selected-imgT" />-->
      <!--                <div class="edit-selected-item-title">-->
      <!--                  {{ item.productName }}-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <div class="edit-selected-span">-->
      <!--                ￥{{ (item.productPrice / 100).toFixed(2) }}-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <!--为您推荐-->
    <Recommended :title="titleT"></Recommended>
  </div>
</template>

<script>
import Recommended from "@/components/Recommended";
import header from "@/components/Header/Header";
import Vue from "vue";
import { Lazyload } from "vant";
import { Toast } from "vant";

Vue.use(Toast);
Vue.use(Lazyload);
export default {
  name: "Recovery",
  data() {
    return {
      title: "康复套餐",
      titleT: "为您推荐",
      //轮播图的高
      height: 146,
      //轮播图
      images: [],
      advert1: {},
      handpick: [], // 编辑精选
      overflowPrice: [], // 超值特卖
      hotProduct: "", // 新品推荐
    };
  },
  components: {
    "v-header": header,
    Recommended: Recommended
  },
  created() {
    this.recommendProduct();
    this.advertising();
  },
  methods: {
    //广告
    advertising(pagePosition) {
      this.$http
        .request({
          method: "get",
          url: "/SAdvertController/selectAdvert",
          body: {
            pagePlace: 1
          }
        })
        .then(res => {
          if (res.data.success) {
            Toast.clear();
            this.images = res.data.data.top;
            this.advert1 = res.data.data.mid[0];
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 广告连接
    advertLink(jumptype, jumplink) {
      // 外部链接
      if (jumptype == 1) {
        window.location.href = jumplink;
      } else {
        this.$router.push({
          name: "MallHome"
        });
      }
    },
    productes(id) {
      this.$router.push({
        name: "Particular",
        query: {
          pid: id
        }
      });
    },
    //查询康复包
    recommendProduct() {
      this.$http
        .request({
          method: "get",
          url: "/SProductTagController/selectRecommendProductS",
          body: {
            showposition: 2
          }
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            for (let i = 0; i < res.data.data.length; i++) {
              if(res.data.data[i].id === "400287298555613186"){
                this.handpick = res.data.data[i].sProductTagDetailList; //编辑精选
              }else if(res.data.data[i].id === "402178526335340575"){
                this.overflowPrice = res.data.data[i].sProductTagDetailList; //超值特卖
              }else if(res.data.data[i].id === "403918429268086795"){
                this.hotProduct = res.data.data[i].sProductTagDetailList[0]; //新品推荐
              }
            }
          } else {
            console.log("获取康复包列表失败");
          }
        })
        .catch(error => {
          Toast.clear();
          console.log("接口异常");
        });
    }
  }
};
</script>

<style lang="less" scoped>
#Recovery {
  width: 100vw;
  height: auto;
  /*background: url("./city.png") no-repeat;*/
  /*background-size: 100% 100%;*/
  background-color: @backgroundColor;
  /*padding-top: 16px;*/
}
.van-search__content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background-color: #f7f8fa;
  .borderRadius(10, 10, 10, 10);
  padding-left: 2.6vw;
}
.van-swipe {
  width: 94%;
  margin: 2vw 3% 0 3%;
  .borderRadius(10, 10, 10, 10);
}
.van-swipe img {
  width: 100%;
  height: 39vw;
  display: block;
  box-sizing: border-box;
  background-color: @backgroundColor;
  .borderRadius(10, 10, 10, 10);
  pointer-events: none;
}
.rec-special {
  width: 94vw;
  height: 40vw;
  margin: 4% 3% 0 3%;
}
.rec-special-span {
  display: block;
  width: 100%;
  height: 20%;
  .fontSize(17);
  font-weight: bold;
}
.rec-special-loop {
  width: 100%;
  height: 80%;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
.rec-special-item {
  width: 43%;
  height: 88%;
  display: inline-block;
  margin-right: 4%;
}
.rec-special-spanT {
  .fontSize(18);
  display: block;
  margin: 14% 6% 4% 9%;
}
.rec-special-spanTh {
  .fontSize(13);
  display: block;
  margin: 0 0 0 6%;
  color: red;
}
.rec-special-img {
  width: 100%;
  height: 100%;
}
.new-pro {
  width: 94vw;
  height: 40vw;
  margin: 0 3% 0 3%;
  display: flex;
}
.new-pro-left {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.new-pro-right {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.new-pro-span {
  font-weight: bold;
  .fontSize(16);
}
.new-pro-button {
  background-color: #000;
  color: #ffffff;
  .borderRadius(10, 10, 10, 10);
  margin-top: 2%;
}
.new-pro-img {
  width: 82%;
  height: 82%;
}
.advertising {
  width: 94%;
  height: 31.2vw;
  margin: 3% 3% 0 3%;
  overflow: hidden;
  .borderRadius(10, 10, 10, 10);
}
.advertising img {
  width: 100%;
}
.edit-selected {
  width: 94vw;
  height: auto;
  margin: 3% 3% 0 3%;
}
.edit-selected-title {
  width: 100%;
  height: 10vw;
  .fontSize(18);
  font-weight: bold;
  line-height: 2.2;
}
.edit-selected-background {
  width: 100%;
  height: 52vw;
  position: relative;
}
.edit-selecte-img {
  width: 100%;
  height: 76%;
}
.edit-selected-ul {
  width: 100%;
  height: 80%;
  position: absolute;
  top: 19%;
  .borderRadius(10, 10, 10, 10);
  overflow-x: scroll;
  overflow-y: hidden;
}
.edit-selected-li {
  width: auto;
  height: 84%;
  margin-left: 6%;
  position: absolute;
  top: 18%;
  .borderRadius(10, 10, 10, 10);
  background-color: #ffffff;
  overflow-y: scroll;
  display: flex;
}
.edit-selected-item {
  width: 24vw;
  height: 96%;
  margin: 0 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.edit-selected-item-top {
  width: 100%;
  height: 78%;
  position: relative;
}
.edit-selected-imgT {
  width: 100%;
  height: 100%;
}
.edit-selected-item-title {
  width: 100%;
  height: 20%;
  background-color: rgba(51, 51, 51, 0.3);
  color: #ffffff;
  position: absolute;
  bottom: 0;
  .borderRadius(0, 0, 10, 10);
  .fontSize(13);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
.edit-selected-span {
  .fontSize(16);
  color: red;
}
</style>
