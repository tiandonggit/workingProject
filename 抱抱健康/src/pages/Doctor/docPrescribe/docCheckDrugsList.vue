/* * @Author: 田东 * @Date: 2020-02-14 16:59:52 * @Last Modified by: 田东 *
@Last Modified time: 2020-02-15 09:27:28 * @Description: 医生开药 产品清单查看
*/

<template>
  <div id="docCheckDrugsList">
    <common-header
      :share-disabled="true"
      :custom-title="'推荐产品'"
      :header-show="true"
      title="产品清单"
    ></common-header>

    <div class="container">
      <div class="block-item" v-for="(item, index) in list" :key="index">
        <div class="top-info">
          <div class="img-box">
            <img :src="item.icon" alt="" />
          </div>
          <div class="right-info">
            <p class="name">{{ item.productname }}</p>
            <p class="specification">{{ item.specification }}</p>
            <p class="manufacturer">{{ item.manufacturers }}</p>
            <p class="price-box">
              <span class="activity">
                ¥{{ (item.activityprice / 100).toFixed(2) }}
              </span>
              <span class="price">¥{{ (item.price / 100).toFixed(2) }}</span>
              <span class="num">x{{ item.number }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Stepper } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
import { setTimeout } from "timers";

export default {
  name: "docCheckDrugsList",
  data() {
    return {
      list: [],
      id: ""
    };
  },
  components: {
    commonHeader
  },
  computed: {},
  created() {
    this.orderId = this.$route.query.orderId;
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .request({
          method: "get",
          url: "ZyOrderDetailsController/selectByOrderId",
          body: {
            id: this.orderId
          }
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data.data;
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("加载失败，请检查网络连接");
        });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
</style>
