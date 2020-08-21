/*
 * @Author: 田东 
 * @Date: 2019-08-29 10:32:30 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-09-26 15:38:37
 * @name 领货
 */
<template>
  <div class="get_goods_page">
    <common-header :share-disabled="true" :custom-title="'领取货物'"></common-header>
    <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
      <div
        class="card-box"
        v-for="(warehouse, index) in warehouseList"
        :key="index"
        :id="'id'+index"
      >
        <div class="good-info">
          <div class="img">
            <img :src="warehouse.picture.imgurl" alt />
          </div>
          <div class="info">
            <p class="name">{{warehouse.goodsName}}</p>
            <p class="specification">{{warehouse.specificationName}}</p>
          </div>
        </div>
        <!-- <div class="good-detail">商品编号:1234567898</div> -->
        <div class="good-detail" @click="selectWarehouse()">库房名称:{{warehouse.repositoryName}}</div>
        <div class="good-count good-detail">
          <div class="left good-color">需领数量:{{warehouse.exceptgetquantity}}件</div>
          <div class="right">
            实领数量:
            <input
              type="tel"
              v-model="warehouse.realQuantity"
              @keyup="inputQuantity(warehouse.realQuantity, index)"
              @focus="inputFocus($event, index)"
              @blur="inputBlur($event, index)"
              placeholder="请填写"
            />件
          </div>
        </div>
      </div>
    </van-list>

    <div class="btn-box">
      <van-button class="btn" size="large" @click="submitFun()">领取完成</van-button>
    </div>

    <!-- <van-popup v-model="show" position="right" :overlay="true" class="popups">
      <p class="popup-title">库存名称</p>
      <div
        class="cell"
        v-for="(house, index) in list"
        :key="index"
        @click="select(house.id)"
        :class="{active: house.isSelect}"
      >{{house.name}}</div>
      <div class="btn-box">
        <van-button class="btn" size="large" @click="sureBtn()">确定</van-button>
      </div>
    </van-popup>-->
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import commonHeader from "../../components/commonHeader/common_header";
export default {
  name: "getGoods",
  components: {
    commonHeader
  },
  data() {
    return {
      finishedText: "",
      loading: false,
      finished: false, // 上拉加载是否结束
      page: 1, // 查询第几页
      limit: 10, // 每页数据个数
      id: "",
      warehouseList: [], // 库房列表
      // show: false,
      // isSelect: false,
      // list: [
      //   { id: 1, name: "沈阳市沈河区奉天银座c座库房", isSelect: false },
      //   { id: 2, name: "沈阳市沈", isSelect: false },
      //   { id: 3, name: "沈阳市沈河", isSelect: false },
      //   {
      //     id: 4,
      //     name: "沈阳市沈河区奉天银座c座库房区奉天银座c座库房",
      //     isSelect: true
      //   },
      //   { id: 5, name: "沈阳市沈河区奉天银座c座库房--", isSelect: false }
      // ],
      warehouseId: "",
      num: "",
      isAndroid: "",
      isiOS: ""
    };
  },
  created() {
    let u = navigator.userAgent;
    this.isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    this.id = this.$route.query.id;
  },
  methods: {
    getGoodDetail() {
      this.$http
        .request({
          method: "get",
          url: "/RSupplyGoodsController/selectSupplyGoods",
          body: {
            id: this.id,
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
              this.warehouseList.push(v);
            });
            this.page > 1 && (this.finishedText = "没有更多了");
            this.page++;
            if (data.data.length == this.limit) {
              this.finished = false;
            } else {
              this.finished = true;
            }
          } else {
            this.loading = false;
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
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.getGoodDetail();
      }, 500);
    },
    inputQuantity(realQuantity, index) {
      if (!/^\d+$/.test(realQuantity)) {
        this.warehouseList[index].realQuantity = "";
        Toast("请输入数字");
      }
    },
    submitFun() {
      Dialog.confirm({
        title: "提醒",
        message: "请确认商品清单领货完成，确认后不可修改",
        confirmButtonColor: "#E98C2E",
        closeOnPopstate: true
      })
        .then(() => {
          this.submit();
        })
        .catch(() => {});
    },
    submit() {
      let quantityList = []; // 保存提交数量的list
      this.warehouseList.forEach((v, e) => {
        quantityList.push({
          id: v.id,
          actualgetquantity: v.realQuantity ? v.realQuantity : "0"
        });
      });
      this.$http
        .request({
          method: "post",
          url: "/RSupplyGoodsController/insertSupplyGoods",
          body: {
            id: window.localStorage.getItem("orderId"),
            list: JSON.stringify(quantityList)
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            if (data.total === "2") {
              this.$router.push({ name: "index" });
            } else {
              Toast(data.message);
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    inputFocus(e, key) {
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
    },

    selectWarehouse() {
      //   // this.show = true;
      // },
      // select(id) {
      //   this.warehouseId = id;
      //   this.warehouseList.forEach((v, e) => {
      //     if (v.id === id) {
      //       v.isSelect = true;
      //     } else {
      //       v.isSelect = false;
      //     }
      //   });
      // },
      // sureBtn() {
      //   this.show = false;
      //   Toast(this.warehouseId);
    }
  }
};
</script>

<style scoped lang="less">
.get_goods_page {
  background: @bgColorF2;
  min-height: 100%;
  padding-top: 12px;

  .van-list {
    padding-bottom: 68px;
  }

  .card-box {
    padding-top: 0;

    .good-info::after,
    .good-info::before {
      display: none;
    }
  }
}
</style>
