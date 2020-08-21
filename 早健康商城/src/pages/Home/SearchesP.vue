<!--
  作者：刘硕
  时间：2019/5/14
  商品列表页
-->
<template>
  <div id="SearchesP">
    <div class="header-div">
      <div class="header">
        <span class="iconfont iconleft header-back" @click="back"></span>
        <form action="/" class="header-from">
          <van-search
                  v-model="searchvalue"
                  placeholder="搜索"
                  background="#FFFFFF"
                  @click="onSearchBtn"
                  readonly="readonly"
          >
          </van-search>
        </form>
      </div>
      <div class="tabber">
        <div class="tabber-item" @click="tabs(0)">
        <span :class="[tabberClass, isActive === 0 ? 'tabber-item-fontT' : '']"
        >综合</span
        >
        </div>
        <div class="tabber-item" @click="tabs(1)">
        <span :class="[tabberClass, isActive === 1 ? 'tabber-item-fontT' : '']"
        >销量</span
        >
        </div>
        <div class="tabber-item" @click="tabs(2)">
        <span :class="[tabberClass, isActive === 2 ? 'tabber-item-fontT' : '']"
        >价格</span
        >
          <span :class="[tabberClassT, isActive === 2 ? '' : '']"></span>
        </div>
        <div class="tabber-item" @click="tabs(3)">
        <span :class="[tabberClass, isActive === 3 ? 'tabber-item-fontT' : '']"
        >筛选</span
        >
          <span
                  class="iconfont iconshaixuan1"
                  :class="[isActive === 3 ? 'tabber-item-fontT' : '']"
          ></span>
        </div>
      </div>
    </div>


    <Recommended
      :title="title"
      :searchvalue="searchvalue"
      :basepricesort="basepricesort"
      :salesvolumesort="salesvolumesort"
      :brandcode="brandcode"
      :maintypecodeList="maintypecodeList"
      :maxbaseprice="maxprice"
      :minbaseprice="minprice"
      :maintypecode="maintypecode"
      :subtypecode="subtypecode"
      :isActive="isActive"
      :sord="sord"
      ref="getChild"
    ></Recommended>

    <!--弹出层-->
    <van-popup v-model="show" position="right" :overlay="true" class="popups">
      <div class="popups-title">
        <span>筛选</span>
        <span
          @click="close"
          class="popups-title-span iconfont iconguanbi"
        ></span>
      </div>
      <div class="popups-brand">
        <span>品牌</span>
        <div class="popups-brand-content">
          <span
            :class="[popupsBrandFont, popupsBrand[index]]"
            v-for="(item, index) in filtratelist.brand"
            :key="index"
            @click="brandId(item.code, index)"
            >{{ item.text }}</span
          >
        </div>
      </div>
      <div class="popups-brand">
        <span>类型</span>
        <div class="popups-brand-content">
          <span
            :class="[popupsBrandFont, popupsBrandT[index]]"
            v-for="(item, index) in filtratelist.class"
            :key="index"
            @click="classId(item.code, index)"
            >{{ item.text }}</span
          >
        </div>
      </div>
      <div class="popups-brand">
        <span>价格</span>
        <div class="popups-brand-content">
          <input
            type="number"
            v-model="minprice"
            class="popups-brand-price"
            placeholder="最低价"
            @focus="checkedFocus"
          />
          —
          <input
            type="number"
            v-model="maxprice"
            class="popups-brand-price"
            placeholder="最高价"
            @focus="checkedFocus"
          />
        </div>
      </div>
      <div class="popups-brand-bottom" v-show="isBottom">
        <button class="popups-brand-button" @click="resetFiltratelist">
          重置
        </button>
        <button class="popups-brand-buttonT" @click="submitFiltratelist">
          确定
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import { NumberKeyboard } from 'vant';

Vue.use(NumberKeyboard);
Vue.use(Toast);
import Recommended from "@/components/Recommended";
export default {
  name: "SearchesP",
  data() {
    return {
      originalHeight: 0,
      isBottom: true,//是否显示底部筛选按钮
      filtratelist: [], //筛选条件集合
      minprice: "",
      maxprice: "",
      show: false, //弹出层
      isActive: 0,
      tabberClass: "tabber-item-font",
      tabberClassT: "iconfont iconjiantou",
      title: "",
      //搜索
      searchvalue: "",
      sord: 0, // 价格排序 状态
      basepricesort: "asc", //价格排序
      salesvolumesort: "desc", //销量排序
      brandcode: [], //品牌
      maintypecodeList: [], //类型
      maintypecode: "", //分类页面一级分类
      subtypecode: "", //分类页面二级分类
      popupsBrandFont: "popups-brand-font", //品牌 style
      popupsBrand: [], // 品牌 选中 style
      popupsBrandT: [] //类型 选中 style
    };
  },
  components: {
    Recommended: Recommended
  },
  watch: {
    minprice(news, old) {
      if (!this.Testnum(news)) {
        this.minprice = this.minprice.replace(/[^0-9]/g, "");
      }
    },
    maxprice(news, old) {
      if (!this.Testnum(news)) {
        this.maxprice = this.maxprice.replace(/[^0-9]/g, "");
      }
      if (news === 0) {
        this.maxprice = "";
      }
      if (/^0+/g.test(news)) {
        this.maxprice = this.maxprice.replace(/^[0]{1,}/, "");
      }
    }
  },
  computed: {
    cityCode() {
      return this.$store.state.Home.address.city_code;
    }
  },
  created() {
    if(this.$route.query.name){
      this.searchvalue = this.$route.query.name;
    }
    if(this.$route.query.firstLevelCode){
      this.maintypecode = this.$route.query.firstLevelCode;
    }
    if(this.$route.query.secondLevelCode){
      this.subtypecode = this.$route.query.secondLevelCode;
    }
    this.filtrate();
  },
  updated() {
    let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    this.originalHeight = originalHeight;
  },
  beforeRouteLeave (to, from, next) {
    document.body.removeEventListener("focusin", this.openBottom);
    document.body.removeEventListener("focusout", this.closeBottom);
    window.onresize = function () {
      return;
    }
    next();
  },
  methods: {
    //键盘不会遮挡输入框
    checkedFocus(){
      document.getElementsByClassName("popups").scrollTop = 0;
      this.resizeH();
    },
    //键盘落下
    openBottom(){
      this.isBottom = true;
    },
    closeBottom(){
      this.isBottom = false;
    },
    resizeH(){
      let that = this;
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isAndroid){
        let originalHeight = this.originalHeight;
        // alert("原窗口高度:"+this.originalHeight);
        window.onresize = function () {
          //键盘弹起与隐藏都会引起窗口的高度发生变化
          let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
          if(resizeHeight < originalHeight) {
            // console.log("当软键盘弹起，在此处操作");
            that.closeBottom();
            //当软键盘弹起，在此处操作
          } else {
            that.openBottom();
            // console.log("当软键盘收起，在此处操作");
            //当软键盘收起，在此处操作
          }
          // alert(resizeHeight+"+"+originalHeight)
        }
        // document.body.addEventListener("resize",this.clientResize(originalHeight));

      }

      if(isiOS){
        document.body.addEventListener("focusin", this.openBottom);
        document.body.addEventListener("focusout", this.closeBottom);
      }
    },
    //提交筛选
    submitFiltratelist() {
      if (parseInt(this.minprice) > parseInt(this.maxprice)) {
        let minprice = this.minprice;
        let maxprice = this.maxprice;
        this.maxprice = minprice;
        this.minprice = maxprice;
      }
      let that = this;
      setTimeout(function () {
        that.onSearch();
        that.close();
      },500)

    },
    //重置
    resetFiltratelist() {
      this.brandcode = [];
      this.maintypecodeList = [];
      this.minprice = "";
      this.maxprice = "";
      this.popupsBrand = [];
      this.popupsBrandT = [];
    },
    //品牌id
    brandId(id, index) {
      if (this.popupsBrand[index] === "popupsBrandActive") {
        this.popupsBrand.splice( index , 1);
        this.brandcode.splice(this.brandcode.indexOf(id), 1);
        return;
      }
      // if (this.popupsBrand.includes("popupsBrandActive")) {
      //   this.popupsBrand.splice(
      //     this.popupsBrand.indexOf("popupsBrandActive"),
      //     1
      //   );
      //   this.brandcode.splice(this.brandcode.indexOf(id), 1);
      // }

      this.popupsBrand[index] = "popupsBrandActive";
      this.brandcode.push(id);
    },
    //类型id
    classId(id, index) {
      if (this.popupsBrandT[index] === "popupsBrandActive") {
        this.popupsBrandT.splice(
          this.popupsBrandT.indexOf("popupsBrandActive"),
          1
        );
        this.maintypecodeList.splice(this.maintypecodeList.indexOf(id), 1);
        return;
      }
      if (this.popupsBrandT.includes("popupsBrandActive")) {
        this.popupsBrandT.splice(
          this.popupsBrandT.indexOf("popupsBrandActive"),
          1
        );
        this.maintypecodeList.splice(this.maintypecodeList.indexOf(id), 1);
      }

      this.popupsBrandT[index] = "popupsBrandActive";
      this.maintypecodeList.push(id);
    },
    //筛选条件查询
    filtrate() {
      this.$http
        .request({
          method: "get",
          url: "/SysDictionaryController/selectFilterCondition",
          body: {
            title: this.searchvalue,
            baiducitycode: this.cityCode
          }
        })
        .then(res => {
          Toast.clear();
          if (res.data.success) {
            this.filtratelist = res.data.data;
          } else {
            console.log("获取筛选条件失败");
          }
        })
        .catch(error => {Toast.clear();});
    },
    //关闭 弹出层
    close() {
      this.show = false;
    },
    //选项卡
    tabs(num) {
      this.isActive = num;
      if (num === 1) {
        //销量
        this.salesvolumesort = "desc";
      } else {
        this.salesvolumesort = "";
      }
      //价格
      if (num === 2) {
        //console.log(this.sord);
        if (this.sord === 0) {
          this.tabberClassT = "iconfont iconjiantoushang1 tabber-item-fontT";
          this.sord = 1; // 升序
          this.basepricesort = "asc"; //正序
        } else if (this.sord === 1) {
          this.tabberClassT = "iconfont iconjiantouxia1 tabber-item-fontT";
          this.sord = 2;
          this.basepricesort = "desc"; //倒序
        } else {
          this.tabberClassT = "iconfont iconjiantoushang1 tabber-item-fontT";
          this.sord = 1;
          this.basepricesort = "asc"; //正序
        }
      } else {
        this.tabberClassT = "iconfont iconjiantou";
        this.sord = 0;
        this.basepricesort = "";
      }

      if (num === 3) {
        //筛选
        this.show = true;
        return;
      }
      // this.onSearch();
      // let that = this;
      // setTimeout(function() {
      //   that.onSearch();
      // }, 100);
    },
    //搜索事件监听
    onSearch() {
      this.$refs.getChild.Page = 1;
      this.$refs.getChild.onLoad();
    },
    //取消事件
    onCancel() {},
    back() {
      this.$router.back(-1);
    },
    //搜索事件监听
    onSearchBtn() {
      this.$router.replace({
        name: "Searches"
      });
    },
  }
};
</script>

<style lang="less" scoped>
#SearchesP {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // background-color: @backgroundColorT;
  /*background: url("./city.png") no-repeat;*/
  /*background-size: 100% 100%;*/
  /*padding-top: 13px;*/
}
.header-div{
  width: 100%;
  height: auto;
  position: fixed;
  top: 0;
  z-index: 99;
}
.header {
  width: 96%;
  height: auto;
  display: flex;
  align-items: center;
  padding: 0 2%;
  /*position: fixed;*/
  /*top: 0;*/
  background-color: @backgroundColorT;
}
#Recommended{
  min-height: 85% !important;
  margin-top: 26.4vw;
}
.header-back {
  .fontSize(20);
  color: @titleColor;
  margin-right: 2%;
}
.van-search {
  padding-left: 0 !important;
}
.search-button {
  width: 14vw;
  color: #ffffff;
  text-align: center;
  line-height: 2.3;
  height: 100%;
  background-color: @homeHeaderBackgroundColor;
  .borderRadius(10, 10, 10, 10);
}
.header-from {
  width: 91%;
}
.van-search__content {
  width: 80%;
}
.van-search__action {
  padding: 0 0 0 14px !important;
}
.tabber {
  width: 100%;
  height: 10vw;
  display: flex;
  align-items: center;
  margin-bottom: 2%;
  background-color: @backgroundColorT;
}
.tabber-item {
  width: 19%;
  margin: 0 6%;
  /*display: flex;*/
  vertical-align: middle;
  .iconfont {
    height:100%;
    vertical-align:middle;
    .fontSize(15);
    /*margin-top: 0.2vw;*/
  }
}
.tabber-item-font {
  .fontSize(15);
}
.tabber-item-fontT {
  /*display: block;*/
  color: @homeHeaderBackgroundColor;
}
.popups {
  width: 80vw;
  height: 100% !important;
  /*height: 178vw;*/
}
.popups-title {
  width: 95%;
  height: 10vw;
  display: flex;
  justify-content: space-between;
  padding: 2% 0 2% 5%;
}
.popups-title-span {
  display: block;
  width: 8vw;
  height: 8vw;
  text-align: center;
}
.popups-brand {
  width: 90%;
  padding: 2% 5%;
}
.popups-brand-content {
  width: 100%;
  padding: 5% 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.popups-brand-font {
  .fontSize(14);
  display: block;
  margin: 0 5% 5% 0;
  background-color: #f2f2f2;
  .borderRadius(10, 10, 10, 10);
  padding: 3%;
}
.popups-brand-price {
  width: 30%;
  height: 12vw;
  background-color: #f2f2f2;
  .borderRadius(10, 10, 10, 10);
  text-align: center;
  margin: 0 3%;
  border: 0;
  .fontSize(14);
}
.popups-brand-bottom {
  width: 100%;
  height: 27vw;
  display: flex;
  align-items: flex-end;
  position: absolute;
  bottom: 0;
}
.popups-brand-button {
  width: 40%;
  height: 14vw;
  background-color: #ffffff;
  text-align: center;
  line-height: 1.2;
  border: 0;
}
.popups-brand-buttonT {
  width: 60%;
  height: 50%;
  background-color: @homeHeaderBackgroundColor;
  text-align: center;
  line-height: 1.2;
  border: 0;
  color: #ffffff;
}
.popupsBrandActive {
  color: #ffffff;
  background-color: @homeHeaderBackgroundColor;
}
.van-overlay{
  background-color: rgba(0,0,0,0);
}
</style>
