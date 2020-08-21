/* * @Author: 田东 * @Date: 2020-02-14 17:00:10 * @Last Modified by: 田东 *
@Last Modified time: 2020-02-14 17:16:31 * @Description: 医生开药 产品推荐 */

<template>
  <div id="docSelectDrugs">
    <common-header :share-disabled="true" :custom-title="'推荐产品'" :header-show="true" title="产品推荐"></common-header>

    <div class="container">
      <div class="block-item" v-for="(item, index) in dataList" :key="index">
        <div class="top-info">
          <div class="img-box">
            <img :src="item.icon" alt />
            <div class="inventory">
              <span>库存：{{ item.repertory }}</span>
            </div>
          </div>
          <div class="right-info">
            <p class="name">{{ item.name }}</p>
            <p class="specification">{{ item.specification }}</p>
            <p class="manufacturer">{{ item.manufacturers }}</p>
            <p class="price-box">
              <span class="activity">¥{{ (item.activityprice / 100).toFixed(2) }}</span>
              <span class="price">¥{{ (item.sellingprice / 100).toFixed(2) }}</span>
            </p>
          </div>
        </div>
        <div class="bottom-num">
          <span>数量：</span>
          <van-stepper
            v-model="item.number"
            disabled-input
            min="0"
            :max="item.repertory"
            @change="change()"
          />
        </div>
      </div>
    </div>

    <div class="footer-box">
      <van-button
        slot="button"
        class="next-btn"
        :class="{isDisabled: isDisabled}"
        size="large"
        @click="confirm"
      >确认产品</van-button>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Stepper } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
import { setTimeout } from "timers";

export default {
  name: "docSelectDrugs",
  data() {
    return {
      dataList: [],
      patientId: "",
      isDisabled: true // 底部按钮是否禁用状态
    };
  },
  components: {
    commonHeader
  },
  computed: {},
  created() {
    this.patientId = this.$route.query.patientId;
    if (window.localStorage.getItem("docDrugsList")) {
      this.dataList = JSON.parse(window.localStorage.getItem("docDrugsList"));
      this.change();
    } else {
      this.getData();
    }
  },
  methods: {
    // 获取数据列表
    getData() {
      this.$http
        .request({
          method: "get",
          url: "ZyProductController/selectProduct",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.dataList = res.data.data;
            this.dataList.forEach((v, e) => {
              this.dataList[e].number = 0;
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("加载失败，请检查网络连接");
        });
    },
    // 药品数量发生变化
    change() {
      let falseNum = 0;
      this.dataList.forEach(v => {
        if (v.number > 0) {
          this.isDisabled = false;
          return;
        } else {
          falseNum++;
        }
      });
      if (falseNum === this.dataList.length) {
        this.isDisabled = true;
      }
    },
    // 提交
    confirm() {
      window.localStorage.setItem(
        "docDrugsList",
        JSON.stringify(this.dataList)
      );
      this.$router.push({
        name: "docDrugsList"
      });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
#docSelectDrugs {
  .footer-box .next-btn.isDisabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
    background: @gengqianSpan;
  }
}
</style>
