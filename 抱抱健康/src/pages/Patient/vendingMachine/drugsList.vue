/** *@desc 药品清单 *@author houpai *@date 2019/09/09 10:37:28 */
<template>
  <div class="drugsList_page">
    <common-header
      :share-disabled="true"
      :custom-title="'商品清单'"
    ></common-header>
    <ul class="drugs_list">
      <li v-for="(item, index) in drugsList" :key="index">
        <div class="drug_img_box">
          <img :src="item.topImg | formatProductImg" alt="" />
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

    <div class="footer-box">
      <div class="next-btn"
           @click.stop="gotoBuy">
        <van-button slot="button" class="next-btn" size="large">购买</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "drugsList",
  components: {
    commonHeader
  },
  data() {
    return {
      orderId: "", // 定单id
      drugsList: [] // 商品清单
    };
  },
  filters:{
    formatProductImg(value) {
      let productImg = '';
      try {
        if (value) {
          productImg = value.split(',')[0];
        }
      } catch (e) {
        console.log(e);
      }
      return productImg;
    },
  },
  methods: {
    /**
     * 购买产品
     * 如果已提交订单,跳转到订单详情**/
    gotoBuy() {
      this.$router.push({
        name: "submitOrder"
      });
    },

    /**
     * 获取商品清单列表
     * 通过清单id查询 **/
    getDrugsList(id) {
      this.$http
        .request({
          baseURL: this.$globalServiceHost.selfMachineHost,
          method: "get",
          url: "/ROrderController/orderProductDetail",
          body: {
            orderId: id
          }
        })
        .then(res => {
          if (res.data.success) {
            this.drugsList = res.data.data.length && res.data.data;
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  created() {
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId;
      this.getDrugsList(this.orderId);
      this.$store.commit("vendingMachine/saveOrderId", this.orderId);
    }
  }
};
</script>

<style scoped lang="less">
.drugsList_page {
  min-height: 100%;

  .drugs_list {
    .padding(12, 12, 60, 12);

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
            color:rgba(255,48,0,1);
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
