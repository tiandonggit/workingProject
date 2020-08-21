/*
 * @Author: 田东&&许鹏(修改)
 * @Date: 2019-08-29 10:29:46
 * @Last Modified by: 许鹏
 * @Last Modified time: 2020-06-23 13:48:50
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
        >
<!--        <img-->
<!--          class="over-img"-->
<!--          v-if="device.issupplyfinish === 1"-->
<!--          src="../../assets/images/over.png"-->
<!--          alt-->
<!--        />-->
				<p class="machine-name"><span class="devicename">{{device.devicename}}</span><span class="deviceid">{{device.devicecode}}</span></p>
        <span class="machine-address">地址：{{device.fulladdress}}</span>
				<div class="bottom">
					<van-button class="machine-btn" size="large" @click="machineSupplyGoods(device.id)">发起补货单</van-button>
				</div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";

import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "initiateReplenishment",
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
    this.id = window.localStorage.getItem("memberId");
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
          url: "/MDeviceController/selectSupplyUserDevice",
          body: { supplyuserid: this.id, page: this.page, limit: this.limit }
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
    machineSupplyGoods(id) {
      this.$http
        .request({
          method: "get",
          url: "/RSupplyController/createRSupply",
          body: { deviceid: id}
        })
        .then(res => {
          this.loading = false;
          let data = res.data;
          if (data.success) {
            if(res.data.data>0){
              Toast("补货工单已生成");
						}else{
              Toast("暂不需要补货");
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
      font-weight: bold;
      color: @mainColor;
      line-height: 22px;
			display: flex;
			.devicename{
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.deviceid{
				text-align: right;
				color: #333;
				float:right;
			}
    }
    .machine-address {
      font-size: 14px;
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
      font-weight: 400;
      line-height: 20px;
      color: @titleColor;
    }
  }
	.bottom{
		height: 44px;
		border-top: 1px solid #F2F2F2;
		position: relative;
		.machine-btn{
			width:94px;
			height:32px;
			background:rgba(233,140,46,1);
			border-radius:17px;
			font-size:14px;
			line-height: 32px;
			font-weight:400;
			color: #fff;
			text-align: center;
			position: absolute;
			right: 0px;
			bottom: 0px;
		}
	}
}
</style>
