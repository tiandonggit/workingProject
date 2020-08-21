<!--
  作者：刘硕
  时间：2019/5/9
-->
<template>
  <div id="Recommended">
    <div class="title" v-if="title">{{ title }}</div>
    <div class="product-ul">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text
        loading-text=" "
        @load="onLoad"
        class="product-li"
        
      >
        <div
          class="product-item"
          v-for="(item, index) in list"
          :key="index"
          :title="item"
          @click="productes(item.id)"
        >
          <img :src="item.img" alt class="product-item-img">
          <span class="product-item-title" v-if="item.title.length <= 25">
            {{
            item.title
            }}
          </span>
          <span class="product-item-title" v-else>{{ item.title.substring(0, 25) }}...</span>
          <div class="product-item-money">
            <span class="product-item-price">￥{{(item.baseprice / 100).toFixed(2) }}</span>
          </div>
          <span
            class="product-item-total"
            v-if="item.salesvolume.length < 5"
          >月销量{{ item.salesvolume }}</span>
          <span
            class="product-item-total"
            v-if="item.salesvolume.length >= 5"
          >月销量{{(item.salesvolume / 10000).toFixed(2) }}万</span>
          <span class="product-item-hotel">{{ item.pharmacyname }}</span>
        </div>
      </van-list>
      <!--      <van-list-->
      <!--        v-model="loading"-->
      <!--        :finished="finished"-->
      <!--        finished-text=""-->
      <!--        @load="onLoad"-->
      <!--        class="product-li"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="product-item"-->
      <!--          v-for="(item, index) in list"-->
      <!--          :key="index"-->
      <!--          :title="item"-->
      <!--          v-if="index % 2 === 1"-->
      <!--        >-->
      <!--          <img :src="item.img" alt="" class="product-item-img" />-->
      <!--          <span class="product-item-title" v-if="item.title.length <= 25">{{-->
      <!--            item.title-->
      <!--          }}</span>-->
      <!--          <span class="product-item-title" v-else-->
      <!--            >{{ item.title.substring(0, 25) }}...</span-->
      <!--          >-->
      <!--          <div class="product-item-money">-->
      <!--            <span class="product-item-price">￥{{ item.baseprice / 100 }}</span>-->
      <!--          </div>-->
      <!--          <span class="product-item-total" v-if="item.salesvolume.length < 5"-->
      <!--            >月销量{{ item.salesvolume }}</span-->
      <!--          >-->
      <!--          <span class="product-item-total" v-if="item.salesvolume.length >= 5"-->
      <!--            >月销量{{ item.salesvolume / 10000 }}万</span-->
      <!--          >-->
      <!--          <span class="product-item-hotel">{{ item.pharmacyname }}</span>-->
      <!--        </div>-->
      <!--      </van-list>-->
    </div>
    <div v-if="isNoProduct" class="finished-text" v-show="finished">未找到相关商品</div>
    <div v-else class="finished-text" v-show="finished">到底了</div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";

Vue.use(Toast);
export default {
  name: "Recommended",
  data() {
    return {
      Page: 1,
      limit: 10,
      list: [],
      loading: false,
      finished: false,
      // offsetTops: [0, 0], // top
      // offsetLefts: [0, "180px"], // left
      itemHeight: [], // item的高度
      leftoffsetHieght: 0, // 距离顶部高度
      rightoffsetHieght: 0, //距离顶部高度
      isNoProduct: false //是否有返回商品
    };
  },
  props: {
    title: {
      default: "", // 自定义标题 默认为空 不显示
      type: String
    },
    searchvalue: {
      default: "", // 搜索内容
      type: String
    },
    basepricesort: {
      default: "", //价格
      type: String
    },
    salesvolumesort: {
      default: "",
      type: String
    },
    brandcode: {
      default: function() {
        return [];
      }, //品牌code
      type: Array
    },
    maintypecodeList: {
      default: function() {
        return [];
      }, //一级分类
      type: Array
    },
    maxbaseprice: {
      default: "", //最大价格
      type: String
    },
    minbaseprice: {
      default: "", //最小价格
      type: String
    },
    maintypecode: {
      default: "", //分类页面一级分类
      type: String
    },
    subtypecode: {
      default: "", //分类页面二级分类
      type: String
    },
    isActive: {
      default: 0, //当前选项卡
      type: Number
    },
    sord: {
      default: 0, //当前价格
      type: Number
    }
  },
  computed: {
    cityCode() {
      return this.$store.state.Home.address.city_code;
    }
  },
  watch:{
    isActive(n,o){
      if(this.isActive===2){
        return;
      }
      this.Page = 1;
      this.onLoad();
    },
    sord(n,o){
      if(this.isActive===2){
        this.Page = 1;
        this.onLoad();
      }
    }
  },
  created() {},
  methods: {
    productes(id) {
      this.$router.push({
        name: "Particular",
        query: {
          pid: id
        }
      });
    },
    //瀑布流
    waterfall() {
      let arr = this.itemHeight;
      let column = 1; //行数
      let itemWidth = 170; //宽度
      let interval = 10; //间隔
      let clientWidth = document.body.clientWidth; //页面宽度
      let num = this.list.length;
      let columnItemNumber = 0; //每行显示的个数
      let listleight = 10; //数据长度
      let index; // 索引
      column = Math.round(num / (clientWidth / (itemWidth + interval))); //得到行数
      if (arr === []) {
        return;
      }
      columnItemNumber = (clientWidth / (itemWidth + interval)).toFixed();
      // console.log("每行显示的个数：" + columnItemNumber);
      for (let i = 0; i < listleight; i++) {
        if (i < columnItemNumber) {
          this.offsetTops[i] = 0 + "px";
          this.offsetLefts[i] = i * (itemWidth + interval) + "px";
        } else {
          index = i - columnItemNumber;
          this.$set(
            this.offsetLefts,
            i,
            (i % columnItemNumber) * (itemWidth + interval) + "px"
          );
          if (i % columnItemNumber === 0) {
            this.leftoffsetHieght += arr[index] + 20;
            console.log("LEFT高度: " + this.leftoffsetHieght, arr[index]);
            this.$set(this.offsetTops, i, this.leftoffsetHieght + "px");
          } else {
            this.rightoffsetHieght += arr[index] + 20;
            console.log("RIGHT高度: " + this.rightoffsetHieght, arr[index]);
            this.$set(this.offsetTops, i, this.rightoffsetHieght + "px");
          }
        }
        column++;
      }
    },
    calculatordiv() {
      let that = this;
      setTimeout(function() {
        let h = document.getElementsByClassName("product-item");
        if (h === []) {
          return;
        }
        for (let i = 0; i < h.length; i++) {
          that.itemHeight.push(h[i].clientHeight);
        }

        that.waterfall();
      }, 500);
    },
    //请求数据
    onLoad() {
      let minbaseprice = "";
      let maxbaseprice = "";
      if (this.minbaseprice) {
        minbaseprice = this.minbaseprice * 100;
      }
      if (this.maxbaseprice) {
        maxbaseprice = this.maxbaseprice * 100;
      }
      this.$http
        .request({
          method: "post",
          url: "/SProductController/selectProductList",
          body: {
            page: this.Page,
            limit: this.limit,
            baiducitycode: this.cityCode,
            title: this.searchvalue,
            basepricesort: this.basepricesort,
            salesvolumesort: this.salesvolumesort,
            brandcodeList: JSON.stringify(this.brandcode),
            maintypecodeList: JSON.stringify(this.maintypecodeList),
            maxbaseprice: maxbaseprice,
            minbaseprice: minbaseprice,
            maintypecode: this.maintypecode,
            subtypecode: this.subtypecode
          }
        })
        .then(res => {
          Toast.clear();
          this.loading = false;
          if (res.data.success) {
            this.finished = false;
            if (this.Page === 1) {
              this.list = res.data.data;
              if(this.list.length == 0){
                this.isNoProduct = true;
              }
            } else {
              this.list = this.list.concat(res.data.data);
            }
            if (res.data.data.length === 0) {
              this.finished = true;
            }
            this.Page++;
            if (res.data.data.length > 0) {
              this.$nextTick(function() {
                // this.calculatordiv();
              });
            }
          }else {
            this.finished = true;
          }
        })
        .catch(error => {
          Toast.clear();
          this.loading = false;
          this.finished = true;
        });
    }
  }
};
</script>

<style scoped lang="less">
.zhage {
  /*background: -webkit-linear-gradient(left, red, blue); !* Safari 5.1 - 6.0 *!*/
  /*background: -o-linear-gradient(right, red, blue); !* Opera 11.1 - 12.0 *!*/
  /*background: -moz-linear-gradient(right, red, blue); !* Firefox 3.6 - 15 *!*/
  /*background: linear-gradient(to right, red, blue); !* 标准的语法 *!*/

  background-image: -webkit-gradient(
    linear,
    left 0,
    right 0,
    from(rgb(4, 94, 170)),
    to(rgb(1, 152, 216))
  );
  -webkit-background-clip: text; /*必需加前缀 -webkit- 才支持这个text值 */
  -webkit-text-fill-color: transparent; /*text-fill-color会覆盖color所定义的字体颜色： */
  width: 100%;
  text-align: center;
}
.zhage-img {
  margin: 0 9%;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    /*transform:rotate(0)*/
  }
  50% {
    transform: scale(1.5);
    /*transform:rotate(360deg)*/
  }
  100% {
    transform: scale(1);
  }
}

#Recommended {
  width: 100vw;
  height: auto;
  background-color: @backgroundColor;
}
.title {
  width: 100%;
  height: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .fontSize(16);
  margin-top: 6vw;
}
.product-ul {
  width: 94%;
  /*display: block;*/
  display: flex;
  justify-content: space-between;
  padding: 5% 3%;
}
.product-li {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.product-item {
  width: 48%;
  height: auto;
  margin-bottom: 5%;
  .borderRadius(10, 10, 10, 10);
  padding-bottom: 3%;
  background-color: @backgroundColorT;
}
.product-item-img {
  width: 100%;
  /*height: auto;*/
  height: 38vw !important;
  .borderRadius(10, 10, 0, 0);
}
.product-item-title {
  margin: 0 5%;
  display: block;
  width: 90%;
  .fontSize(12);
  color: #333;
  padding-top: 2%;
  line-height: 1.6;
  .overflowline(2);
  height: 10vw;
}
.product-item-money {
  width: 90%;
}
.product-item-price {
  .fontSize(18);
  color: red;
  margin: 0 5%;
}
.product-item-priceT {
  .fontSize(10);
  color: @qianSpan;
  margin-left: 6%;
  text-decoration: line-through;
}
.product-item-total {
  display: block;
  width: 100%;
  .fontSize(12);
  color: @qianSpan;
  margin-top: 3%;
  margin-left: 5%;
}
.product-item-hotel {
  display: block;
  width: 100%;
  .fontSize(12);
  color: @qianSpan;
  margin-top: 3%;
  margin-left: 5%;
}
.finished-text {
  width: 100%;
  height: 23vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  .fontSize(12);
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  color: @buzanColor;
}
.van-overlay {
  background-color: rgba(0, 0, 0, 0);
}
</style>
