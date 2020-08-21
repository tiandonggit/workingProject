/*
 * @Author: 田东 
 * @Date: 2019-08-29 10:29:46 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-09-18 17:28:01
 * @name 补货
 */
<template>
  <div class="supply_goods_page">
    <common-header :share-disabled="true" :custom-title="'补货'"></common-header>
    <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
      <div
        class="block-box"
        v-for="(device, index) in list"
        :key="index"
        @click="machineSupplyGoods(device.id, device.devicename, device.goodskindquantity, device.exceptsupplyquantity, device.issupplyfinish)"
      >
        <img
          class="over-img"
          v-if="device.issupplyfinish === 1"
          src="../../assets/images/over.png"
          alt
        />
        <p class="machine-name">{{device.devicename}}</p>
        <span class="machine-address">地址：{{device.deviceaddress}}</span>
        <p class="goods-detail">需补货{{device.goodskindquantity}}种商品，共{{device.exceptsupplyquantity}}件</p>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";

import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "supplyGoods",
  components: {
    commonHeader
  },

  data() {
    return {
      finishedText: "", // 数据加载完成提示文字
      loading: false,
      finished: false, // 上拉加载是否结束
      page: 1, // 查询第几页
      limit: 10, // 每页数据个数
      id: "", // 主键id
      list: []
    };
  },
  created() {
    this.id = window.localStorage.getItem("orderId");
  },
  methods: {
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.getData();
      }, 500);
    },
    getData() {
      this.$http
        .request({
          method: "get",
          url: "/RSupplyDeviceController/selectPageModel",
          body: { supplyid: this.id, page: this.page, limit: this.limit }
        })
        .then(res => {
          this.loading = false;
          let data = res.data;
          console.log(data);
          if (data.success) {
            data.data.forEach((v, e) => {
              this.list.push(v);
            });
            this.page > 1 && (this.finishedText = "没有更多了");
            this.page++;
            if (data.data.length == this.limit) {
              this.finished = false;
            } else {
              this.finished = true;
            }
          } else {
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
        });
    },
    machineSupplyGoods(
      machineId,
      devicename,
      goodskindquantity,
      exceptsupplyquantity,
      issupplyfinish
    ) {
      if (issupplyfinish === 1) return;
      let param = {
        id: machineId,
        devicename: devicename,
        goodskindquantity: goodskindquantity,
        exceptsupplyquantity: exceptsupplyquantity
      };
      this.$router.push({
        name: "machineSupplyGoods",
        query: { params: JSON.stringify(param) }
      });
    }
  }
};
</script>

<style scoped lang="less">
.supply_goods_page {
  background: @bgColorF2;
  padding: 12px;
  min-height: 100%;

  .block-box {
    margin-bottom: 12px;
    background: @bgColorF;
    border-radius: 10px;
    padding: 14px 12px 10px;
    background: url("../../assets/images/item-bg.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 351px;
    position: relative;

    .over-img {
      position: absolute;
      right: 0;
      top: 5px;
      width: 96px;
    }

    .machine-name {
      margin: 0 0 12px;
      font-size: 16px;
      font-family: PingFang-SC;
      font-weight: bold;
      color: @mainColor;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .machine-address {
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: @titleColor;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .goods-detail {
      margin: 12px 0 0;
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      line-height: 20px;
      color: @titleColor;
    }
  }
}
</style>
