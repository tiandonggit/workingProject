<!--
  作者：刘硕
  时间：2019/5/9
  首页
-->
<template>
  <div id="MallHome">
    <div class="header">
      <div class="header-title">
        <div class="header-left" @click="searchCity">
          <span class="iconfont iconlocation header-leftFont"></span>
          <span class="header-leftFontThree">{{ city }}</span>
        </div>
        <div class="header-right">
          <span
            @click="notOpen()"
            class="iconfont iconsaoyisao1 header-leftFontT"
          ></span>
          <span
            @click="notOpen()"
            class="iconfont iconxiaoxi1 header-leftFont"
          ></span>
        </div>
      </div>
      <form action="/" @click="onSearch">
        <van-search
          v-model="searchvalue"
          placeholder="搜索"
          background="#E98C2E"
          disabled
        />
      </form>
    </div>
    <!--轮播图-->
    <van-swipe :autoplay="6000" :height="height" indicator-color="#E98C2E">
      <van-swipe-item
        v-for="(image, index) in images"
        :key="index"
        @click="advertLink(image.jumptype, image.jumplink)"
      >
        <img v-lazy="image.advertimg" />
      </van-swipe-item>
    </van-swipe>
    <!--条目-->
    <div class="medic">
      <div class="itemlist">
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconchengren item-fontsize"></span>-->
          <img src="../../assets/images/icon1.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">成人用品</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconyingyangbaojian item-fontsize"></span>-->
          <img src="../../assets/images/icon2.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">营养保健</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconkangfubao item-fontsize"></span>-->
          <img src="../../assets/images/icon3.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">常备药品</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconyunying item-fontsize"></span>-->
          <img src="../../assets/images/icon5.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">孕婴用品</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconqixie item-fontsize"></span>-->
          <img src="../../assets/images/icon6.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">医疗器械</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconzhengzhuangzhaoyao item-fontsize"></span>-->
          <img src="../../assets/images/icon7.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">症状找药</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconjibingzhaoyao item-fontsize"></span>-->
          <img src="../../assets/images/icon8.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">疾病找药</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconxunyiwenyao item-fontsize"></span>-->
          <img src="../../assets/images/icon9.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">求医问药</span>
        </div>
        <div class="item-pro" @click="notOpen()">
          <!--          <span class="iconfont iconjiankangketang item-fontsize"></span>-->
          <img src="../../assets/images/icon10.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">健康课堂</span>
        </div>
        <div class="item-pro" @click="recovery">
          <!--          <span class="iconfont iconkangfubao1 item-fontsize"></span>-->
          <img src="../../assets/images/icon11.png" class="item-pro-img" alt />
          <span class="item-fontsizeT">康复包</span>
        </div>
      </div>
      <div class="messages" @click="notOpen()">
        <!--        <span class="iconfont iconxiaoxi me-fontsize"></span>-->
        <img src="../../assets/images/notice.png" class="me-img" alt />
        <span class="me-fontsizeT">健康课堂：</span>
        <span class="me-fontsizeTR">药店大促，一律八折，速来...</span>
        <span class="iconfont iconfengexianICON"></span>
        <span class="me-fontsizeE">更多</span>
      </div>
    </div>
    <!--广告位-->
    <div
      class="advertising"
      @click="advertLink(advert1.jumptype, advert1.jumplink)"
    >
      <img :src="advert1.advertimg" alt />
    </div>
    <!--每日精选-->
    <div class="todaychoiceness" @click="notOpen()">
      <div class="todaychoiceness-top">每日精选</div>
      <div class="todaychoiceness-loop">
        <div class="todaychoiceness-item">
          <img
            src="../../assets/images/everyday.png"
            alt
            class="todaychoiceness-img"
          />
          <span class="todaychoiceness-span">限时抢购</span>
        </div>
        <div class="todaychoiceness-item">
          <img
            src="../../assets/images/everyday.png"
            alt
            class="todaychoiceness-img"
          />
          <span class="todaychoiceness-span">新春特惠</span>
        </div>
        <div class="todaychoiceness-item">
          <img
            src="../../assets/images/everyday.png"
            alt
            class="todaychoiceness-img"
          />
          <span class="todaychoiceness-span">清仓爆款</span>
        </div>
      </div>
    </div>
    <!--广告位-->
    <div
      class="advertising"
      @click="advertLink(advert2.jumptype, advert2.jumplink)"
    >
      <img :src="advert2.advertimg" alt />
    </div>
    <!--专场-->
    <div class="site" @click="notOpen()">
      <div class="site-one">
        <span class="site-span">老人专场</span>
        <img src="../../assets/images/lunyi.png" alt class="site-img" />
        <img src="../../assets/images/medicine.png" alt class="site-img" />
      </div>
      <div class="site-two">
        <div class="site-two-left">
          <span class="site-spanT">儿童专场</span>
          <img src="../../assets/images/mus.png" alt class="site-imgT" />
        </div>
        <div class="site-two-right">
          <img src="../../assets/images/mus.png" alt class="site-imgT" />
          <span class="site-spanT">儿童专场</span>
        </div>
      </div>
      <div class="site-two">
        <div class="site-two-pro site-two-pro-border">
          <span class="site-two-pro-span">机械专场</span>
          <img
            src="../../assets/images/jixie.png"
            alt
            class="site-two-pro-img"
          />
        </div>
        <div class="site-two-pro site-two-pro-border">
          <span class="site-two-pro-span">成人专场</span>
          <img
            src="../../assets/images/chengren.png"
            alt
            class="site-two-pro-img"
          />
        </div>
        <div class="site-two-pro site-two-pro-border">
          <span class="site-two-pro-span">慢病专场</span>
          <img
            src="../../assets/images/baojianyi.png"
            alt
            class="site-two-pro-img"
          />
        </div>
        <div class="site-two-pro">
          <span class="site-two-pro-span">保健专场</span>
          <img
            src="../../assets/images/baojian.png"
            alt
            class="site-two-pro-img"
          />
        </div>
      </div>
    </div>
    <!--家庭常备-->
    <div class="family" @click="notOpen()">
      <div class="family-spare"></div>
      <div class="family-conserve">
        <div class="family-conserve-im"></div>
        <div class="family-conserve-da"></div>
      </div>
    </div>
    <!--健康小课堂-->
    <div class="health" @click="notOpen()">
      <div class="health-top">
        <span class="health-top-span">健康小课堂</span>
        <span class="health-top-spanT">查看更多</span>
      </div>
      <div class="health-mes">
        <img src="../../assets/images/health1.png" alt class="health-img" />
        <div class="health-con">
          <div class="health-con-title">健齿牙膏，关爱生活，更关爱你</div>
          <div class="health-con-com">
            倍力达蛋白固体饮料采用新颖独特的瓶盖式专利包装技术,营养物质在储运过程中干湿分离,保持营...
          </div>
          <div class="health-con-bottom">
            <span class="health-con-span">辽宁医治汇</span>
            <span class="health-con-span">32.5w阅读</span>
          </div>
        </div>
      </div>
      <div class="health-mes">
        <img src="../../assets/images/health2.png" alt class="health-img" />
        <div class="health-con">
          <div class="health-con-title">多维果味饮料的作用</div>
          <div class="health-con-com">
            倍力达蛋白固体饮料采用新颖独特的瓶盖式专利包装技术,营养物质在储运过程中干湿分离,保持营...
          </div>
          <div class="health-con-bottom">
            <span class="health-con-span">99健康</span>
            <span class="health-con-span">59874阅读</span>
          </div>
        </div>
      </div>
      <div class="health-mes">
        <img src="../../assets/images/health3.png" alt class="health-img" />
        <div class="health-con">
          <div class="health-con-title">蜜柚的作用</div>
          <div class="health-con-com">
            蜜柚（Honey
            pomelo），又名香抛，系柚子优质品的一种。多见生长于南方，并以福建省平和县...
          </div>
          <div class="health-con-bottom">
            <span class="health-con-span">99健康</span>
            <span class="health-con-span">59874阅读</span>
          </div>
        </div>
      </div>
    </div>
    <Recommended :title="title"></Recommended>
    <Tabbers></Tabbers>
  </div>
</template>
<script>
import Vue from "vue";
import { Lazyload, Toast } from "vant";

Vue.use(Lazyload);

import Recommended from "@/components/Recommended";
import Tabber from "@/components/Tabber";
export default {
  name: "MallHome",
  data() {
    return {
      title: "猜您喜欢",
      address: "",
      city: "",
      //轮播图的高
      height: 120,
      //搜索
      searchvalue: "",
      //轮播图
      images: [],
      advert1: {},
      advert2: {}
    };
  },
  components: {
    Tabbers: Tabber,
    Recommended: Recommended
  },
  created() {
    this.IPcoor();
    this.advertising();
    this.shopCardNum();
  },
  mounted() {},
  beforeRouteLeave(to,from,next){
    // plus.key.removeEventListener("backbutton", this.resstart);
    // console.log("移除监听resstart")
    next();
  },
  methods: {
    // appback() {
    //   console.log("移除监听");
    //   plus.key.removeEventListener("backbutton", this.$appback);
    //   // document.addEventListener('plusready', function () {
    //
    //
    //   plus.key.addEventListener("backbutton", this.resstart);
    //   // })
    // },
    // resstart(){
    //   var webview = plus.webview.currentWebview();
    //   console.log("重新监听");
    //   webview.canBack(function(e) {
    //     if (e.canBack) {
    //       console.log("返回上一页");
    //     } else {
    //       console.log("退出app");
    //     }
    //   });
    // },
    //广告
    advertising() {
      this.$http
        .request({
          method: "get",
          url: "/SAdvertController/selectAdvert",
          body: {
            pagePlace: 0
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.success) {
            Toast.clear();
            this.images = res.data.data.top;
            this.advert1 = res.data.data.mid[0];
            this.advert2 = res.data.data.bottom[0];
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
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
    //ip定位
    IPcoor() {
      if (this.$store.state.Home.address) {
        if (this.$store.state.Home.address.city.length > 6) {
          this.city =
            this.$store.state.Home.address.city.substring(0, 6) + "...";
        } else {
          this.city = this.$store.state.Home.address.city;
        }
      } else {
        this.$jsonp("http://api.map.baidu.com/location/ip", {
          ak: "4DqvvHg6LtEkiBPwcjdolbcH5LitO9NI"
        })
          .then(response => {
            Toast.clear();
            if (response.content.address_detail.city.length > 6) {
              this.city =
                response.content.address_detail.city.substring(0, 6) + "...";
            } else {
              this.city = response.content.address_detail.city;
            }
            this.$store.commit("Home/address", {
              city: response.content.address_detail.city,
              city_code: response.content.address_detail.city_code
            });
          })
          .catch(err => {
            this.city = "定位失败";
          });
      }
    },
    //搜索事件监听
    onSearch() {
      this.$router.push({
        name: "Searches"
      });
    },
    //取消事件
    onCancel() {},

    searchCity() {
      this.$router.push({
        name: "SearchCity",
        query: {
          title: this.city
        }
      });
    },
    recovery() {
      this.$router.push({
        name: "Recovery"
      });
    },
    notOpen() {
      Toast("暂未开通");
    }
  }
};
</script>
<style lang="less" scoped>
#MallHome {
  width: 100vw;
  height: auto;
  background-color: @backgroundColor;
}
.header {
  width: 100vw;
  height: 11vw;
  background-color: @homeHeaderBackgroundColor;
  margin-bottom: 10%;
  padding-top: 3%;
  position: fixed;
  top: 0;
  z-index: 1;

  .van-search {
    padding: 10px 3.2vw;
  }
}
.header-title {
  width: 92%;
  height: 48%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 3%;
}
.header-left {
  color: @fontOne;
  line-height: 1.2;
  width: 49%;
}
.header-leftFont {
  .fontSize(22);
  vertical-align: middle;
}
.header-leftFontT {
  margin-right: 25%;
  .fontSize(22);
}
.header-leftFontThree {
  white-space: nowrap;
  margin-left: 1%;
  .fontSize(16);
}
.header-right {
  color: @fontOne;
  line-height: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin: 25.2vw 3% 0 3%;
  /*.borderRadius(10, 10, 10, 10);*/
}
.van-swipe img {
  width: 100%;
  height: 32vw;
  display: block;
  box-sizing: border-box;
  background-color: @backgroundColor;
  .borderRadius(10, 10, 10, 10);
  pointer-events: none;
}
.itemlist {
  width: 94%;
  height: 78%;
  margin: 3% 3%;
  .borderRadius(10, 10, 10, 10);
  display: flex;
  flex-wrap: wrap;
}
.item-pro {
  width: 20%;
  height: 48%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding-top: 2%;
}
.item-pro-img {
  width: auto;
  height: 50% !important;
}
.item-fontsize {
  .fontSize(40);
  color: @homeHeaderBackgroundColor;
}
.item-fontsizeT {
  color: @titleColor;
  .fontSize(12);
}
.medic {
  width: 94%;
  height: 60vw;
  margin: 3% 3% 0 3%;
  .borderRadius(10, 10, 10, 10);
  background-color: @backgroundColorT;
}
.messages {
  width: 94%;
  height: 16%;
  margin: 0 3%;
  display: flex;
  align-items: center;
  padding-left: 3%;
}
.me-img {
  width: 4vw;
  height: 4vw;
  margin: 0 1% 0 0;
}
.me-fontsize {
  .borderRadius(10, 10, 10, 10);
  color: @homeHeaderBackgroundColor;
  margin-right: 2%;
}
.me-fontsizeT {
  .borderRadius(10);
  color: @homeHeaderBackgroundColor;
}
.me-fontsizeTR {
  width: 52%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .fontSize(13);
  color: @titleColor;
}
.me-fontsizeE {
  .fontSize(15);
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  color: @titleColor;
  display: block;
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
.todaychoiceness {
  width: 94%;
  height: 54vw;
  margin: 3% 3% 0 3%;
  .borderRadius(10, 10, 10, 10);
  background-color: @backgroundColorT;
}
.todaychoiceness-top {
  width: 100%;
  height: 24%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.todaychoiceness-loop {
  width: 94%;
  height: 67%;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  padding-left: 4%;
}
//隐藏滚动条
.element::-webkit-scrollbar {
  width: 0 !important;
}
.element {
  -ms-overflow-style: none;
}
.element {
  overflow: -moz-scrollbars-none;
}
.todaychoiceness-item {
  width: 55vw;
  height: 100%;
  margin: 0 4% 0 0;
  display: inline-block;
  background-color: #fafafa;
  .borderRadius(10, 10, 10, 10);
}
.todaychoiceness-img {
  width: 100%;
  height: 74% !important;
}
.todaychoiceness-span {
  display: block;
  width: 100%;
  height: 22%;
  line-height: 2;
  margin-left: 5%;
  .fontSize(16);
}
.site {
  width: 94%;
  height: 75vw;
  margin: 3% 3% 0 3%;
  background-color: @backgroundColorT;
  .borderRadius(10, 10, 10, 10);
}
.site-one {
  width: 100%;
  height: 38%;
  display: flex;
  align-items: center;
}
.site-span {
  width: 43%;
  display: block;
  .fontSize(25);
  text-align: center;
  line-height: 1;
}
.site-img {
  width: 22vw;
  height: 22vw;
  margin-left: 2%;
}
.site-two {
  width: 100%;
  height: 31%;
  display: flex;
  align-items: center;
  border-top: 0.01vw solid #e6e6e6;
}
.site-two-left {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 0.01vw solid #e6e6e6;
}
.site-spanT {
  display: block;
  width: 50%;
  height: 100%;
  text-align: center;
  line-height: 5.8;
}
.site-imgT {
  width: 18vw;
  height: 18vw;
  margin-left: 2%;
}
.site-two-right {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  //border-right: 0.01vw solid #E6E6E6;
}
.site-two-pro {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.site-two-pro-border {
  border-right: 0.01vw solid #e6e6e6;
}
.site-two-pro-span {
  width: 100%;
  display: block;
  text-align: center;
}
.site-two-pro-span,
.site-spanT {
  .fontSize(15);
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: @titleColor;
}
.site-two-pro-img {
  width: 15vw;
  height: 15vw;
}
.family {
  width: 94%;
  box-sizing: border-box;
  // height: 62vw;
  margin: 3% 3% 0 3%;
  .borderRadius(10, 10, 10, 10);
  padding: 3.2%;
  display: flex;
  justify-content: space-between;
  background-color: @backgroundColorT;
}
.family-spare {
  width: 48%;
  // height: 94%;
  background: url("../../assets/images/family.png") no-repeat;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}
.family-conserve {
  width: 41.7vw;
  height: 60.4vw;
  // height: 94%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.family-conserve-im {
  width: 100%;
  height: 46%;
  background: url("../../assets/images/yanghu.png") no-repeat;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}
.family-conserve-da {
  width: 100%;
  height: 46%;
  background: url("../../assets/images/daxing.png") no-repeat;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}
.health {
  width: 94%;
  margin: 3% 3% 0 3%;
  .borderRadius(10, 10, 10, 10);
  background-color: @backgroundColorT;
  padding-bottom: 1%;
}
.health-top {
  width: 100%;
  height: 16vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fffaf5;
  .borderRadius(10, 10, 0, 0);
}
.health-top-span {
  .fontSize(16);
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: @titleColor;
}
.health-top-spanT {
  width: 18.8vw;
  border-top: 0.01vw solid @titleColor;
  .fontSize(12);
  color: @titleColor;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  text-align: center;
  padding-top: 0.8vw;
  margin-top: 0.8vw;
}
.health-mes {
  width: 94%;
  height: 23vw;
  margin: 3%;
  display: flex;
  align-items: center;
}
.health-img {
  width: 23%;
  height: 100% !important;
}
.health-con {
  width: 73%;
  height: 97%;
  margin-left: 3%;
}
.health-con-title {
  .fontSize(15);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 1%;
}
.health-con-com {
  width: 100%;
  height: 38%;
  .fontSize(11);
  color: @qianSpan;
  .overflowline(2);
}
.health-con-bottom {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.health-con-span {
  .fontSize(10);
  color: @qianSpan;
}
</style>
