<!--
  作者：刘硕
  时间：2019/5/16
  商品详情
-->
<template>
  <div id="Particular">
    <div class="header" v-show="show">
      <div class="header-div header-left" @click="headerBack">
        <i class="iconfont iconleft"></i>
      </div>
      <div class="header-div header-center">
        <div
          :class="[
            headerCenterSpan,
            isActive === 0 ? 'header-div-bottom' : 'header-div-bottomT'
          ]"
        ></div>
        <span
          :class="[
            isActive === 0
              ? 'header-center-span header-center-active'
              : 'header-center-span'
          ]"
          @click="tab(0)"
          >商品</span
        >
        <span
          :class="[
            isActive === 1
              ? 'header-center-span header-center-active'
              : 'header-center-span'
          ]"
          @click="tab(1)"
          >详情</span
        >
      </div>
      <div class="header-left"></div>
    </div>
    <span
      class="iconfont iconfanhui1 pro-return"
      v-show="!show"
      @click="headerBack"
    ></span>
    <div class="pro-top">
      <!--轮播图-->
      <van-swipe
        :autoplay="6000"
        :height="height"
        indicator-color="#E98C2E"
        @change="onChange"
      >
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
        <div class="custom-indicator" slot="indicator">
          {{ current + 1 }}/{{ images.length }}
        </div>
      </van-swipe>
      <div class="pro-item pro-margin">
        <!--        <span class="pro-item-font"-->
        <!--          >￥{{ (list.product.baseprice / 100).toFixed(2) }}</span-->
        <!--        >-->
        <span class="pro-item-font">￥{{ baseprice }}</span>
        <div>
          <span class="iconfont iconzhuanfa pro-item-fontT"></span>
          <span class="iconfont iconfenxiang pro-item-fontT"></span>
        </div>
      </div>
      <div class="pro-item-title pro-marginT">
        <img
          src="../../assets/images/212d0d536efa1b2398e965c21fc77e5.png"
          alt
          class="pro-item-img"
        />
        <div class="pro-item-titleSex">
          {{ list.product.title }}
        </div>
      </div>
      <div class="pro-item-titleT pro-marginT">{{ list.product.effect }}</div>
    </div>
    <div
      class="pro-item-titleTh"
      v-if="list.product.ispackage === 1 && discounts"
    >
      <span class="pro-item-span">促销</span>
      <img
        src="../../assets/images/69ef99b0b6f51e17c07f392aa13abbe.png"
        alt
        class="pro-item-imgT"
      />
      <span class="pro-item-spanT">整包优惠{{ discounts }}元</span>
    </div>
    <div class="pro-item-titleEi" @click="showSp">
      <span class="pro-item-span">规格</span>
      <span class="pro-item-spanT">{{ productDetails }}</span>
      <span class="pro_num" v-if="inventory === 0">0件</span>
      <span class="pro_num" v-else>{{ pronum }}件</span>
    </div>
    <div class="pro-item-titleTh">
      <span class="pro-item-span">服务</span>
      <div class="pro-item-titleF">
        <div class="pro-item-titleFi">
          <span class="pro-item-spanTh iconfont iconfuwu"></span>
          <span class="pro-item-spanF">精准达</span>
        </div>
        <div class="pro-item-titleFi">
          <span class="pro-item-spanTh iconfont iconfuwu"></span>
          <span class="pro-item-spanF">二十四小时售后服务</span>
        </div>
        <div class="pro-item-titleFi">
          <span class="pro-item-spanTh iconfont iconfuwu"></span>
          <span class="pro-item-spanF">品质保证</span>
        </div>
        <div class="pro-item-titleFi">
          <span class="pro-item-spanTh iconfont iconfuwu"></span>
          <span class="pro-item-spanF">特权保证</span>
        </div>
      </div>
    </div>
    <div class="pro-item-pro">
      <div class="pro-item-pro-left">
        <div class="pro-item-pro-img">
          <img :src="list.product.logoimg" alt />
        </div>
        <span class="pro-item-pro-span">{{ list.product.pharmacyname }}</span>
      </div>

      <span class="pro-item-pro-spanT">
        <a href="tel:4000909975">客服电话</a>
      </span>
    </div>
    <div class="rich_media_content" v-html="productHtmls"></div>
    <!--弹出层-->
    <van-popup
      v-model="showSpecification"
      position="bottom"
      :overlay="true"
      class="specification"
    >
      <div class="popups-title">
        <span
          @click="closeSp"
          class="popups-title-span iconfont iconguanbi"
        ></span>
      </div>
      <div class="popups-titleT">
        <img :src="list.product.img" alt class="popups-titleT-img" />
        <div class="popups-titleT-rigth">
          <span class="popups-titleT-span">￥{{ baseprice }}</span>
          <span class="popups-titleT-spanT" v-if="inventory === 0"
            >库存不足</span
          >
          <span class="popups-titleT-spanT" v-if="inventory"
            >库存{{ inventory }}件</span
          >
        </div>
      </div>
      <div class="popups-scroll">
        <div class="popups-scroll-title">
          <span class="popups-scroll-title-span">套餐</span>
        </div>
        <div class="popups-center">
          <span
            class="popups-center-span"
            :id="index"
            :class="{
              popupsActive:
                popupsActive === index && popupsActiveBoolen === true
            }"
            @click="
              popupsActiveType(
                index,
                item.price,
                item.id,
                item.preferentialprice,
                item.inventory
              )
            "
            v-for="(item, index) in list.specification"
            :key="index"
            >{{ item.specificationname }}</span
          >
        </div>
        <div class="popups-bottom">
          <span class="popups-scroll-title-span">数量</span>
          <van-stepper
            v-model="pronum"
            integer
            :min="1"
            :max="inventory"
            :step="1"
          />
        </div>
      </div>
      <van-button
        square
        type="primary"
        size="normal"
        class="popups-button"
        @click="onClickBigBtn"
        :disabled="
          list.product.logicdel === 1 || inventory === 0 ? true : false
        "
        >加入购物车</van-button
      >
    </van-popup>
    <van-goods-action>
      <van-goods-action-mini-btn
        icon-class="iconkefu"
        text="客服"
        @click="onlineService(4000909975)"
      />
      <van-goods-action-mini-btn
        icon-class="iconshoucang"
        text="收藏"
        @click="notOpen"
      />
      <van-goods-action-mini-btn
        v-if="shopCard == 0"
        icon-class="icongouwuche1"
        text="购物车"
        @click="onClickMiniBtn"
      />
      <van-goods-action-mini-btn
        v-else
        icon-class="icongouwuche1"
        :info="shopCard"
        text="购物车"
        @click="onClickMiniBtn"
      />
      <van-goods-action-big-btn
        text="加入购物车"
        @click="onClickBigBtnT"
        :disabled="
          list.product.logicdel === 1 || inventory === 0 ? true : false
        "
      />
    </van-goods-action>
  </div>
</template>

<script>
import Vue from "vue";
import { Lazyload } from "vant";
import { Toast } from "vant";
import { Dialog } from "vant";

Vue.use(Dialog);
Vue.use(Toast);
Vue.use(Lazyload);
export default {
  name: "Particular",
  data() {
    return {
      popupsActive: "",
      popupsActiveBoolen: false,
      pronum: 1, //商品数量
      specificationid: "", //规格id
      id: "",
      isActive: 0,
      headerCenterSpan: "header-center-bottom",
      popupsCenter: "popups-center-span", //类型样式
      //popupsActive: [], //类型是否选中
      active: 1, // 标签
      show: false, //商品详情是否显示
      showSpecification: false, //规格是否显示
      isBottom: false, //是否到达底部
      list: {
        product: [],
        pharmacy: [],
        specification: []
      },
      current: 0, //轮播图当前下标
      //轮播图的高
      height: 375,
      //轮播图
      images: [
        // require("../../assets/images/b61d16afed23b52bf6080aed38c2175.png"),
        // require("../../assets/images/b61d16afed23b52bf6080aed38c2175.png")
      ],
      productDetails: "", //商品规格描述 请选择您要购买的商品规格
      inventory: "", //库存
      isInventoryActive: false, //可购买数量是否超出库存
      baseprice: 0, //基础价格
      shopCard: "", //购物车数量
      discounts: "", //优惠价格
      productHtmls: "" //商品详情
    };
  },
  watch: {},
  created() {
    window.scrollTo(0, 0);
    this.id = this.$route.query.pid;
    this.prodetails();
    if (this.getshopCardNum) {
      this.shopCard = this.getshopCardNum;
    } else {
      this.shopCardNum();
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  computed: {
    //获取购物车数量
    getshopCardNum() {
      return this.$store.state.Home.shopCardNum;
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.handleScroll, false);
    next();
  },
  methods: {
    //购物车数量
    shopCardNum() {
      this.$http
        .request({
          method: "get",
          url: "/SProductCartController/selectSProductCartsNum",
          body: {}
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.shopCard = res.data.data.sproductcartsnum;
            this.$store.commit("Home/shopCardNum", this.shopCard);
          } else {
            console.log("获取购物车数量失败");
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },
    //规格选中效果
    popupsActiveType(index, price, id, preferentialPrice, inventory) {
      //console.log(index, price, id, preferentialPrice, inventory);
      // if (this.popupsActive[index] === "popupsActive") {
      //   //取消选中
      //   this.popupsActive.splice(this.popupsActive.indexOf("popupsActive"), 1);
      //   // this.popupsActive.splice(this.popupsActive.indexOf(index), 1);
      //   this.baseprice = (this.list.product.baseprice / 100).toFixed(2);//基础价格
      //   return;
      // }
      // //取消其他选中
      // if (this.popupsActive.includes("popupsActive")) {
      //   this.popupsActive.splice(this.popupsActive.indexOf("popupsActive"), 1);
      // }

      // this.popupsActive[index] = "popupsActive";

      if (!this.popupsActiveBoolen) {
        this.popupsActiveBoolen = true;
      }
      if (index === this.popupsActive && this.popupsActiveBoolen === true) {
        //取消选中
        this.popupsActiveBoolen = false;
        this.popupsActive = "";
        // this.inventory = "";
      } else {
        //选中
        this.popupsActive = index;
        this.baseprice = (price / 100).toFixed(2);
        this.productDetails = this.list.specification[index].specificationname;
        this.specificationid = id;
        this.discounts = (preferentialPrice / 100).toFixed(2);
        this.inventory = inventory;
      }
      this.pronum = 1;
    },
    //关闭 弹出层
    closeSp() {
      this.showSpecification = false;
    },
    //打开弹出层
    showSp() {
      this.showSpecification = true;
    },
    //商品信息
    prodetails() {
      this.$http
        .request({
          method: "get",
          url: "/SProductController/selectProductDetail",
          body: {
            id: this.id
          }
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.list = res.data.data;
            this.popupsActiveType(
              0,
              this.list.specification[0].price,
              this.list.specification[0].id,
              this.list.specification[0].preferentialprice,
              this.list.specification[0].inventory
            );
            this.images = res.data.data.product.listSProductSlideImgs.split(
              ","
            );
            this.inventory = res.data.data.specification[0].inventory;
            // this.baseprice = (res.data.data.product.baseprice / 100).toFixed(2);
            this.productHtml();
          } else {
            console.log("获取商品详情失败");
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },
    //商品详情
    productHtml() {
      this.$http
        .request({
          method: "get",
          url: "/SProductController/selectProductHtml",
          body: {
            id: this.id
          }
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.productHtmls = res.data.data;
          } else {
            console.log("获取商品详情失败");
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },
    //返回
    headerBack() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    },
    //切换tab
    tab(index) {
      this.isActive = index;
      if (index === 0) {
        window.scrollTo(0, 0);
      } else {
        let offsetTop = document.querySelector(".rich_media_content").offsetTop; //详情距离顶部高度
        window.scrollTo(0, offsetTop - 52);
      }
    },
    //滚动控制
    handleScroll(e) {
      let clientHeight = document.documentElement.clientHeight; //可视区域高度
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; //滚动高度
      let offsetHeight = document.querySelector("#Particular").offsetHeight; //文档高度
      let offsetTop = document.querySelector(".rich_media_content").offsetTop; //详情距离顶部高度
      //标题是否显示
      if (scrollTop >= 100) {
        this.show = true;
      } else {
        this.show = false;
      }
      //标题是否被选中
      if (scrollTop >= offsetTop - 100) {
        //详情
        this.isActive = 1;
      } else {
        this.isActive = 0;
      }
      // if (clientHeight + scrollTop >= offsetHeight) {
      // } else {
      // }
    },
    //轮播图 改变事件
    onChange(index) {
      this.current = index;
    },
    onClickMiniBtn() {
      this.$router.push({
        name: "shoppingCar"
      });
    },
    //规格加入购物车
    onClickBigBtn() {
      if (this.popupsActiveBoolen) {
        this.addShopCard("BigBtn");
        this.closeSp();
      } else {
        Toast("请先选择规格");
      }
    },
    //加入购物车
    onClickBigBtnT() {
      if (!this.specificationid) {
        this.showSp();
        return;
      }
      this.addShopCard("BigBtnT");
    },
    //追加购物车接口
    addShopCard(state) {
      this.$http
        .request({
          method: "post",
          url: "/SProductCartController/insertSProductCartS",
          body: {
            spharmacyid: this.list.product.spharmacyid,
            sproductid: this.id,
            sproducttype: this.list.product.ispackage,
            sproductspecificationid: this.specificationid,
            productcount: this.pronum
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.success) {
            if (res.data.data.cartcode !== 1) {
              Toast(res.data.data.msg);
              return;
            }

            if (state === "BigBtn") {
              this.shopCard = res.data.data.sproductcartsnum;
              // this.shopCard += this.pronum;
            } else if (state === "BigBtnT") {
              this.shopCard = res.data.data.sproductcartsnum;
              // this.shopCard++;
            }
            this.$store.commit("Home/shopCardNum", this.shopCard);
            Toast("商品已成功加入购物车");
            //加入购物车成功
          } else {
            if (res.data.code === "00006") {
              Dialog.confirm({
                title: "",
                message: "您尚未登录，无法添加购物车，请您先登录。",
                confirmButtonText: "去登录"
              })
                .then(() => {
                  this.$router.push({
                    name: "login"
                  });
                })
                .catch(() => {
                  // on cancel
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 在线客服
    onlineService(mobile) {
      window.location.href = "tel:4000909975";
    },
    notOpen() {
      Toast("暂未开通");
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/wx_note.css";
#Particular {
  width: 100vw;
  height: auto;
  //background: url("./product.png") no-repeat;
  //background-size: 100% 100%;
  background-color: @backgroundColor;
  //padding-top: 16px;
  overflow-y: scroll;
}
.header {
  width: 94%;
  height: 14vw;
  padding: 0 3%;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  text-align: center;
  color: @titleColor;
  background-color: #ffffff;
}
.header-div {
  width: auto;
}
.header-left {
  float: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-weight: bold;
  text-align: left;
}
.header-center-bottom {
  position: absolute;
  bottom: -1vw;
  left: 3.6vw;
  background-color: @homeHeaderBackgroundColor;
}
.header-center {
  margin-left: 30%;
  font-weight: bold;
  white-space: nowrap;
  display: flex;
  align-items: center;
  position: relative;
  height: 50%;
}
.header-right {
  display: flex;
  justify-content: flex-end;
}
.header-center-active {
  .fontSize(18) !important;
}
.header-center-span {
  .fontSize(16);
  color: #333333;
  margin-left: 20%;
}
.header-div-bottom {
  width: 4.8vw;
  height: 0.6vw;
  transform: translateX(3vw);
}
.header-div-bottomT {
  width: 4.8vw;
  height: 0.6vw;
  transform: translateX(14.4vw);
}
.van-swipe {
  width: 94%;
  margin: 0 3% 0 3%;
  .borderRadius(10, 10, 10, 10);
}
.van-swipe img {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  background-color: @backgroundColor;
  pointer-events: none;
}
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  color: #fff;
  background: rgba(51, 51, 51, 0.6);
  .borderRadius(10, 10, 10, 10);
}
.pro-top {
  width: 100%;
  height: auto;
  background-color: @backgroundColorT;
  padding-bottom: 1%;
}
.pro-item {
  width: 96%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pro-item-title {
  width: 96%;
  height: auto;
  color: #333333;
  line-height: 1.3;
}
.pro-item-titleT {
  width: 96%;
  height: auto;
  color: #808080;
  line-height: 1.6;
  .fontSize(12);
  text-align: left;
  .overflowline(3);
}
.pro-item-titleTh {
  margin-top: 3%;
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 3% 0;
  background-color: #ffffff;
}
.pro-item-titleF {
  width: 80%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
}
.pro-item-titleFi {
  width: auto;
  margin-bottom: 1%;
}
.pro-item-titleSex {
  .overflowline(3);
}
.pro-item-titleEi {
  margin-top: 3%;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3% 0;
  background-color: #ffffff;
  white-space: nowrap;
}
.pro-item-span {
  .fontSize(14);
  color: #808080;
  margin-left: 3vw;
}
.pro-item-spanT {
  width: 73%;
  .fontSize(13);
  font-family: PingFang-SC-Regular;
  font-weight: bold;
  color: @titleColor;
  margin-left: 3vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pro_num {
  float: right;
  .fontSize(13);
  font-family: PingFang-SC-Regular;
  font-weight: bold;
  color: @titleColor;
  margin-right: 4%;
}
.pro-item-spanTh {
  margin-left: 3vw;
  .fontSize(14);
  color: @homeHeaderBackgroundColor;
}
.pro-item-spanF {
  margin-left: 3vw;
  .fontSize(13);
  white-space: nowrap;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  color: @subtitleColor;
}
.pro-margin {
  margin: 3% 2% 0 2%;
}
.pro-marginT {
  margin: 2% 2%;
}
.pro-item-font {
  .fontSize(23);
  color: red;
}
.pro-item-fontT {
  margin: 0 1vw;
  .fontSize(21);
}
.pro-item-img {
  width: 10vw;
  height: 4vw;
  vertical-align: -2px;
}
.pro-item-imgT {
  width: 8vw;
  height: 4vw !important;
  margin-left: 4vw;
}
.pro-item-pro {
  width: 96%;
  height: auto;
  margin-top: 3%;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 2%;
  white-space: nowrap;
}
.pro-item-pro-left {
  width: 80%;
  display: flex;
  align-items: center;
}
.pro-item-pro-img {
  width: 15vw;
  height: 15vw;
}
.pro-item-pro-img img {
  width: 100%;
  height: 100%;
}
.pro-item-pro-span {
  display: block;
  color: #333333;
  .fontSize(15);
  margin-left: 6%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pro-item-pro-spanT {
  display: block;
  border: 0.1vw solid @homeHeaderBackgroundColor;
  .fontSize(12);
  /*margin-left: 33%;*/
  .borderRadius(6, 6, 6, 6);
  padding: 1% 2%;

  a {
    color: @homeHeaderBackgroundColor;
  }
}
.van-button--warning {
  background-color: @homeHeaderBackgroundColor;
  border: 0.1vw solid @homeHeaderBackgroundColor;
}
.pro-return {
  position: absolute;
  top: 3vw;
  left: 3vw;
  color: #333333;
  .fontSize(36);
  z-index: 99;
  opacity: 0.6;
}
.pro-toast {
  width: 100%;
  height: 40vw;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  padding-top: 8%;
  .fontSize(12);
  color: #999999;
}
.rich_media_content {
  margin-top: 3vw;
  margin-bottom: 62px;
}
.specification {
  width: 100%;
  height: 100vw;
}
.popups-title {
  width: 95%;
  height: 6vw;
  display: flex;
  justify-content: flex-end;
  margin: 2% 0 2% 3%;
}
.popups-titleT {
  width: 95%;
  height: 19vw;
  display: flex;
  margin: 2% 0 2% 3%;
}
.popups-titleT-img {
  width: 19vw;
  height: 19vw !important;
}
.popups-titleT-rigth {
  width: 50%;
  height: 100%;
  margin-left: 4vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.popups-titleT-span {
  color: red;
  .fontSize(15);
}
.popups-titleT-spanT {
  color: #999999;
  .fontSize(12);
}
.popups-scroll {
  width: 95%;
  height: 46vw;
  margin: 2% 0 2% 3%;
  overflow-x: scroll;
}
.popups-scroll-title {
  width: 100%;
  height: 8vw;
}
.popups-scroll-title-span {
  .fontSize(15);
}
.popups-center {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
}
.popups-center-span {
  width: auto;
  .fontSize(14);
  display: block;
  margin: 0 5% 5% 0;
  background-color: #f2f2f2;
  .borderRadius(10, 10, 10, 10);
  padding: 2%;
}
.popupsActive {
  color: #ffffff;
  background-color: @homeHeaderBackgroundColor;
}
.popups-bottom {
  width: 100%;
  height: 8vw;
  display: flex;
  justify-content: space-between;
}
.popups-button {
  width: 96%;
  margin: 2% 2%;
  .fontSize(16);
  .borderRadius(10, 10, 10, 10);
  border: 0.1vw solid @homeHeaderBackgroundColor;
  background-color: @homeHeaderBackgroundColor;
}
.popups-title-span {
  display: block;
  width: 8vw;
  height: 8vw;
  text-align: center;
}
.van-overlay {
  background-color: rgba(0, 0, 0, 0);
}
</style>
