/* * @Author: 田东 * @Date: 2020-02-14 16:59:52 * @Last Modified by: 田东 *
@Last Modified time: 2020-02-15 09:27:28 * @Description: 医生开药 产品清单查看
*/

<template>
  <div id="docCheckProductList">
    <common-header :share-disabled="true" :custom-title="'推荐产品'" :header-show="true" title="产品清单"></common-header>

    <ul class="drugs_list">
      <li
        v-for="(item, index) in productList"
        :key="index"
        @click.stop="productDetails(item.specificationId, item.productPrice)"
      >
        <div class="drug_img_box">
          <img :src="item.topImg | formatProductImg" alt />
        </div>
        <div class="drug_desc">
          <div>
            <p class="drug_name">{{ item.productName }}</p>
            <p class="drug_specifications">{{ item.specificationName }}</p>
          </div>
          <p class="price_num">
            <span class="price">¥{{ (item.productPrice / 100).toFixed(2) }}</span>
            <span class="number">x{{ item.productCount }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Toast, Dialog, Stepper } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "docCheckProductList",
  data() {
    return {
      productList: [],
      orderId: ""
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
          baseURL: this.$globalServiceHost.selfMachineHost,
          method: "get",
          url: "/ROrderController/orderProductDetail",
          body: {
            orderId: this.orderId
          }
        })
        .then(res => {
          if (res.data.success) {
            this.productList = res.data.data.length && res.data.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    productDetails(specificationId, price) {
      window.localStorage.setItem("docProductList", JSON.stringify(this.list));
      this.$router.push({
        name: "productDetails",
        query: { specId: specificationId, price: price }
      });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

#docCheckProductList {
  .drugs_list {
    .padding(56, 12, 60, 12);

    li {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .padding(12, 12, 12, 12);
      .height(102);
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 12, 0);

      .drug_img_box {
        .width(78);
        .height(78);
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .drug_desc {
        display: flex;
        flex: 1;
        width: 0;
        flex-direction: column;
        justify-content: space-between;
        .margin(0, 8, 0, 8);
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .drug_name {
          .margin(0, 0, 10, 0);
          .fontSize(16);
          .lineHeight(20);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .drug_specifications {
          .fontSize(14);
          .lineHeight(18);
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }

        .price_num {
          display: flex;
          justify-content: space-between;

          .price {
            .fontSize(16);
            .lineHeight(20);
            font-weight: bold;
            color: rgba(255, 48, 0, 1);
          }

          .number {
            .fontSize(16);
            .lineHeight(20);
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
  }
}
</style>
