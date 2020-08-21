/*
 * @Author: 田东 
 * @Date: 2019-08-29 10:28:41 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-09-24 17:24:10
 * @name 退货
 */
<template>
  <div class="return_goods_page">
    <common-header :share-disabled="true" :custom-title="'归还货物'"></common-header>
    <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
      <div class="card-box" v-for="(warehouse, index) in warehouseList" :key="index">
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
        <div class="good-detail good-statistics">
          <span class="left">实领数量:{{warehouse.actualgetquantity}}件</span>
          <span>已补数量:{{warehouse.suppliedquantity}}件</span>
        </div>
        <div
          class="good-detail good-color"
        >需还数量:{{warehouse.actualgetquantity - warehouse.suppliedquantity}}件</div>
      </div>
    </van-list>

    <div class="btn-box">
      <van-button class="btn" size="large" @click="nextFun()">还货完成</van-button>
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
  name: "returnGoods",
  components: {
    commonHeader
  },
  data() {
    return {
      finishedText: "",
      loading: false,
      finished: false, // 上拉加载是否结束
      page: 1, // 查询第几页
      limit: 999, // 每页数据个数（不做分页 默认全展示）
      id: "",
      warehouseList: [],
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
      warehouseId: ""
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  methods: {
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.getGoodDetail();
      }, 500);
    },
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
              this.warehouseList.push(v);
            });
            // console.log(this.warehouseList);
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
    nextFun() {
      Dialog.confirm({
        title: "提醒",
        message: "请核对还货商品数量，确认后不可修改",
        confirmButtonColor: "#E98C2E",
        closeOnPopstate: true
      })
        .then(() => {
          this.next();
        })
        .catch(() => {});
    },
    next() {
      let orderId = window.localStorage.getItem("orderId");
      let quantityList = [];
      this.warehouseList.forEach((v, e) => {
        quantityList.push({
          id: v.id,
          returnquantity: v.actualgetquantity - v.suppliedquantity
        });
      });
      console.log(orderId, quantityList);
      this.$http
        .request({
          method: "post",
          url: "/RSupplyGoodsController/insertHH",
          body: { id: orderId, list: JSON.stringify(quantityList) }
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
    }

    // selectWarehouse() {
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
    // }
  }
};
</script>

<style scoped lang="less">
.return_goods_page {
  background: @bgColorF2;
  min-height: 100%;
  padding-top: 12px;

  .van-list {
    padding-bottom: 68px;
  }

  .card-box {
    padding-top: 0;

    ::after,
    ::before {
      display: none;
    }

    .good-statistics {
      .left {
        margin-right: 79px;
      }
    }
  }
}
</style>
