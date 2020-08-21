/*
 * @Author: 田东 
 * @Date: 2019-09-20 15:02:06 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-09-23 10:02:06
 * @name 领货清单
 */

<template>
  <div class="get_goods_inventory">
    <common-header :share-disabled="true" :custom-title="'领货清单'"></common-header>
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
        <div class="good-count good-detail">
          <div class="left">需领数量:{{warehouse.exceptgetquantity}}件</div>
          <div class="right">
            实领数量:{{warehouse.actualgetquantity}}件
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";
import commonHeader from "../../components/commonHeader/common_header";
export default {
  name: "getGoodsInventory",
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
      warehouseId: "",
      num: ""
    };
  },
  created() {
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
    }
  }
};
</script>

<style scoped lang="less">
.get_goods_inventory {
  background: @bgColorF2;
  min-height: 100%;
  padding-top: 12px;

  .van-list {
    padding-bottom: 12px;
  }

  .card-box {
    padding-top: 0;

    .good-info::after,
    .good-info::before {
      display: none;
    }

    .good-count {
      .right {
        margin-right: 54px;
      }
    }
  }
}
</style>
