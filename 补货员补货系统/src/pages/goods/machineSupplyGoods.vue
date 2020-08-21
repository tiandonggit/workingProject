/*
 * @Author: 田东
 * @Date: 2019-08-29 10:29:46
 * @Last Modified by: 田东
 * @Last Modified time: 2019-09-26 15:38:48
 * @name 智能柜补货
 */
<template>
  <div class="machine_goods_page">
    <common-header :share-disabled="true" :custom-title="'补货'"></common-header>
    <div class="top-fixed">
      <div class="block-top">
        <p class="machine-name">{{params.devicename}}</p>
<!--        <p class="goods-detail">需补货{{params.goodskindquantity}}种商品，共{{params.exceptsupplyquantity}}件</p>-->
        <p class="goods-detail">需补货共{{params.exceptsupplyquantity}}件商品</p>
      </div>
      <!-- <div class="tabs-box">
        <div>
          <span class="tab" :class="{active: isMain}" @click="mainCabinet()">主柜</span>
          <span class="tab tab-right" :class="{active: !isMain}" @click="assistantCabinet()">副柜</span>
        </div>
      </div>-->
    </div>
    <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
      <div class="card-box" v-for="(good, index) in goodList" :key="index" :id="'id'+index">
        <p class="good-number">货道编号:{{good.cellcode}}</p>
        <div class="good-info">
          <div class="img">
            <img :src="good.picture.imgurl" alt />
          </div>
          <div class="info">
            <p class="name">{{good.goodsname}}</p>
            <p class="specification">{{good.specificationName}}</p>
          </div>
        </div>
        <div class="good-count">
          <div class="left">当前库存:{{good.goodsstorequantity}}件</div>
          <div class="right">
            本次补货:
            <input
              type="tel"
              v-model="good.realQuantity"
              @keyup="inputQuantity(good.realQuantity, good.exceptSupplyquantity, index)"
              @focus="inputFocus($event, index)"
              @blur="inputBlur($event, index)"
              placeholder="请填写"
            />件
          </div>
        </div>
      </div>
    </van-list>
    <div class="btn-box">
      <van-button class="btn" size="large" @click="nextFun()">补货完成</van-button>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "machineSupplyGoods",
  components: {
    commonHeader
  },
  data() {
    return {
      params: "",
      finishedText: "",
      loading: false,
      finished: false, // 上拉加载是否结束
      page: 1, // 查询第几页
      limit: 10, // 每页数据个数
      isMain: true,
      goodList: [],
      isAndroid: "",
      isiOS: ""
    };
  },
  created() {
    let u = navigator.userAgent;
    this.isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    this.params = JSON.parse(this.$route.query.params);
  },
  methods: {
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.getList();
      }, 500);
    },
    getList() {
      this.$http
        .request({
          method: "get",
          url: "/RSupplyDeviceCellController/selectDeviceCell",
          body: {
            id: this.params.id,
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          this.loading = false;
          let data = res.data;
          if (data.success) {
            data.data.forEach((v, e) => {
              v.realQuantity = "";
              this.goodList.push(v);
            });
            console.log(this.goodList);
            this.page > 1 && (this.finishedText = "没有更多了");
            this.page++;
            if (data.data.length == this.limit) {
              this.finished = false;
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
            Toast(data.message);
          }
        })
        .catch(error => {
          this.loading = false;
          this.finished = true;
          Toast({
            message: "无法连接服务",
            position: "bottom"
          });
          console.log("错误为" + error);
        });
    },
    // mainCabinet() {
    //   this.isMain = true;
    // },
    // assistantCabinet() {
    //   this.isMain = false;
    // },
    inputQuantity(realQuantity, exceptSupplyquantity, index) {
      if (!/^\d+$/.test(realQuantity)) {
        this.goodList[index].realQuantity = "";
        Toast("请输入数字");
      }
      if (parseInt(realQuantity) > parseInt(exceptSupplyquantity)) {
        this.goodList[index].realQuantity = "";
        Toast("补货数量不能超过货道可补商品数量");
      }
    },
    nextFun() {
      Dialog.confirm({
        title: "提醒",
        message: "请核对补货商品数量，确认后不可修改",
        confirmButtonColor: "#E98C2E",
        closeOnPopstate: true
      })
        .then(() => {
          this.next();
        })
        .catch(() => {});
    },
    next() {
      let quantityList = []; // 保存提交数量的list
      this.goodList.forEach((v, e) => {
        if (!v.realQuantity || v.realQuantity === "0") {
          v.realQuantity = "";
          Toast("请填写数量");
          return;
        }
        quantityList.push({
          id: v.id,
          specificationid: v.specificationid,
          cellid: v.cellid,
          actualsupplyquantity: v.realQuantity ? v.realQuantity : "0"
        });
      });
      console.log(JSON.stringify(quantityList));
      this.$http
        .request({
          method: "post",
          url: "/RSupplyDeviceCellController/insertDeviceCell",
          body: {
            id: window.localStorage.getItem("orderId"),
            // ids: this.params.id,
            list: JSON.stringify(quantityList)
          }
        })
        .then(res => {
          let data = res.data;
          if (data.code === "0000") {
            this.$router.push({ name: "index" });
          } else if (data.code === "0006") {
            this.$router.push({ name: "supplyGoods" });
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    inputFocus(e, key){
      if (this.isiOS) {
        var div = document.getElementById("id" + key);
        var height = div.offsetTop - 86;
        setTimeout(function() {
          document.documentElement.scrollTop = height;
          if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = height;
          } else {
            document.body.scrollTop = height;
          }
        }, 100);
      }
    },
    inputBlur(e, key) {
      if (this.isiOS) {
        var div = document.getElementById("id" + key);
        var height = div.offsetTop - 86;
        setTimeout(function() {
          document.documentElement.scrollTop = height;
          if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = height;
          } else {
            document.body.scrollTop = height;
          }
        }, 100);
      }
    }
  }
};
</script>

<style scoped lang="less">
.machine_goods_page {
  background: @bgColorF2;
  min-height: 100%;

  .top-fixed {
    left: 0;
    right: 0;
    top: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: fixed;
    z-index: 999;
    flex-direction: column;
    background: @bgColorF2;
  }

  .van-list {
    padding: 86px 0 68px;
  }

  .block-top {
    background: url("../../assets/images/top-bg.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 375px;
    margin-bottom: 12px;
    padding: 12px;

    .machine-name {
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: @titleColor;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .goods-detail {
      color: @titleColor;
      font-size: 14px;
      font-family: PingFang-SC;
      font-weight: bold;
      line-height: 20px;
      margin-top: 12px;
    }
  }

  .tabs-box {
    height: 44px;
    background: @bgColorF;
    padding-top: 16px;
    margin-bottom: 12px;

    div {
      width: 145px;
      height: 28px;
      margin: 0 auto;

      .tab {
        height: 28px;
        display: inline-block;
      }

      .tab-right {
        float: right;
      }

      .active {
        color: @mainColor;
        border-bottom: 2px solid @mainColor;
      }
    }
  }
}
</style>
