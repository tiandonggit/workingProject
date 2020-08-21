/* * @Author: 田东 * @Date: 2020-01-03 15:00:00 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-03 15:00:26 * @Description:智配柜 商品清单 */
<template>
  <div id="productList">
    <common-header :share-disabled="true" :custom-title="'商品清单'" :header-show="true" title="商品清单"></common-header>

    <div class="recommended-plan" v-if="isFromIM" @click.stop="selectIllness">
      <van-cell title="使用快捷推荐方案" is-link />
    </div>

    <div class="product-search-box">
      <div class="search-box">
        <img src="../../../assets/images/icon_product_search.png" alt />
        <van-field @input="getSearchResult" v-model="searchValue" placeholder="输入要搜索的内容" />
      </div>
    </div>

    <div class="search-shade">
      <!-- <van-checkbox-group v-model="result"> -->
      <van-cell-group
        class="groupList"
        v-for="(item, index) in list"
        v-show="item.isSearchResult"
        :key="index"
        :id="'id' + index"
      >
        <van-cell title @click.stop="toggle(item.productCount, index)">
          <template slot="title">
            <van-checkbox
              :name="item"
              v-model="item.isCheck"
              shape="round"
              ref="checkboxes"
              slot="right-icon"
              checked-color="#0069FF"
            />
          </template>

          <div class="chat_lists_item">
            <div class="img_box"  @click.stop="productDetails(item.specificationId, item.productPrice)">
              <img :src="item.topImg.split(',')[0]" alt />
            </div>
            <div class="chat_message_box">
              <p class="name">{{ item.productName }}</p>
              <p class="specification">{{ item.specificationName }}</p>
              <p class="num">
                <span>￥{{ (item.productPrice / 100).toFixed(2) }}</span>
              </p>
            </div>
          </div>
        </van-cell>

        <div class="stepper">
          <van-stepper
            v-model="item.productCount"
            min="0"
            integer
            async-change
            @blur="onblur(index)"
            :max="item.productStore"
            @change="
                onChange(
                  item.productCount,
                  index,
                  item.goodsId,
                  item.specificationId
                )
              "
          />
        </div>
      </van-cell-group>
      <!-- </van-checkbox-group> -->
    </div>

    <div class="footer-box">
      <van-button
        v-if="isFromIM"
        slot="button"
        class="next-btn"
        size="large"
        @click="goAdd('submit')"
      >提交</van-button>
      <van-button v-else slot="button" class="next-btn" size="large" @click="goAdd('code')">生成二维码</van-button>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog, Stepper } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
import { setTimeout } from "timers";

export default {
  name: "docProductList",
  data() {
    return {
      list: [],
      searchValue: "",
      value: 9,
      title: "",
      lastTime: 0,
      result: [], //具体列表
      allNum: 0,
      isiOS: "",
      deviceData: null,
      isFromIM: "",
      infoItems: [],
      totalPrice: 0,
    };
  },
  components: {
    commonHeader,
  },
  computed: {},
  created() {
    this.isFromIM = this.$route.query.isFromIM;
    let u = navigator.userAgent;
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (this.$route.query) {
      this.deviceData = this.$route.query;
      if (window.localStorage.getItem("docProductList")) {
        this.list = JSON.parse(window.localStorage.getItem("docProductList"));
      } else {
        this.getListData(this.deviceData.deviceId);
      }
    }
  },
  methods: {
    onblur(key) {
      if (this.isiOS) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        var div = document.getElementById("id" + key);
        var height = div.offsetTop - 13;
        setTimeout(function () {
          document.documentElement.scrollTop = height;
          if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = height;
          } else {
            document.body.scrollTop = height;
          }
        }, 100);
      }
    },
    //多选
    toggle(value, index) {
      if (value === 0) {
        setTimeout(() => {
          this.$refs.checkboxes[index].checked = false;
        });
        return false;
      }
      //this.$refs.checkboxes[index].toggle();
    },
    // specificationId，商品id同时匹配
    onChange(value, index, goodsId, specificationId) {
      for (let i = 0; i < this.list.length; i++) {
        if (
          this.list[i].goodsId == goodsId &&
          this.list[i].specificationId == specificationId &&
          value > this.list[i].productStore
        ) {
          Toast("输入商品数量超过最大库存，请重新输入");
        }
      }

      if (value === 0) {
        this.$refs.checkboxes[index].checked = false;
      }
    },
    getListData(data) {
      let url =
        this.$globalServiceHost.selfMachineHost +
        "/MDeviceCellController/productList";
      this.$http
        .request({
          method: "get",
          url: url,
          body: {
            deviceId: data,
          },
        })
        .then((res) => {
          if (res.data.success) {
            res.data.data.forEach((item, index) => {
              item.productCount = 1;
              item.isCheck = false;
              item.isSearchResult = true;
            });
            this.list = res.data.data;
            window.localStorage.setItem(
              "docProductList",
              JSON.stringify(this.list)
            );
          } else {
            console.log("获取数据失败");
          }
        })
        .catch((error) => {
          Toast("请求数据失败~~");
        });
    },
    getSearchResult() {
      if (!this.searchValue) {
        this.list.forEach((v, e) => {
          v.isSearchResult = true;
        });
        return;
      }
      this.list.forEach((v, e) => {
        v.isSearchResult = false;
      });
      this.list.forEach((v, e) => {
        if (v.productName.search(this.searchValue) != -1) {
          v.isSearchResult = true;
        } else {
          v.isSearchResult = false;
        }
      });
    },
    goAdd(btn) {
      this.allNum = 0;

      this.list.forEach((v) => {
        if (v.isCheck) {
          this.result.push(v);
        }
      });

      for (let i = 0; i < this.result.length; i++) {
        if (this.result[i].productCount > this.result[i].productStore) {
          Toast("输入商品数量超过最大库存，请重新输入");
          return;
        }
        var obj = {
          specificationId: this.result[i].specificationId,
          goodsId: this.result[i].goodsId,
          productCount: this.result[i].productCount,
          productPrice: this.result[i].productPrice,
        };

        this.infoItems.push(obj);
        this.totalPrice +=
          this.result[i].productCount * this.result[i].productPrice;
        this.allNum += this.result[i].productCount;
      }
      console.log("allNum", this.allNum,this.result);

      if (this.allNum == 0 || this.result.length == 0) {
        btn === "submit" ? Toast("未选择产品") : Toast("暂无法生成二维码~");
        return;
      }

      if (btn === "submit") {
        Dialog.confirm({
          title: "是否确认提交？",
          message: "提交后生成订单进行支付",
        })
          .then(() => {
            this.goAddFun(btn);
          })
          .catch(() => {});
      } else {
        this.goAddFun(btn);
      }
    },
    goAddFun(btn) {
      // let url =
      //   this.$globalServiceHost.selfMachineHost +
      //   "/ROrderController/createOrder";

      let nowTime = new Date().getTime();

      if (nowTime - this.lastTime < 600) {
        Toast("请不要重复点击");
        return;
      }

      let url = "",
        params = {};
      if (btn === "submit") {
        url = "/PayRecommendController/imDocRecommendOrder";
        params = {
          commitProductInfo: JSON.stringify(this.infoItems),
          orderTotalPrice: this.totalPrice,
          deviceId: this.deviceData.deviceId,
          orderProductNum: this.allNum,
          deviceName: this.deviceData.deviceName,
          deviceCode: this.deviceData.deviceCode,
          patiId: this.$route.query.patientId,
        };
      } else {
        url = "/PayRecommendController/placeOrder";
        params = {
          commitProductInfo: JSON.stringify(this.infoItems),
          orderTotalPrice: this.totalPrice,
          deviceId: this.deviceData.deviceId,
          orderProductNum: this.allNum,
          deviceName: this.deviceData.deviceName,
          deviceCode: this.deviceData.deviceCode,
        };
      }

      if (nowTime - this.lastTime >= 600) {
        this.$http
          .request({
            url: url,
            method: "post",
            body: params,
          })
          .then((res) => {
            if (res.data.success) {
              window.localStorage.removeItem("docProductList");
              if (btn === "submit") {
                this.$router.push({
                  name: "docChatIMDetail",
                });
              } else {
                this.$router.push({
                  name: "docListQRCode",
                  query: {
                    orderId: res.data.data,
                    total: res.data.total,
                  },
                });
              }
            } else {
              Toast(res.data.message);
            }
          })
          .catch((error) => {
            Toast("加载失败，请检查网络连接");
          });
        this.lastTime = nowTime;
      }
    },
    productDetails(specificationId, price) {
      window.localStorage.setItem("docProductList", JSON.stringify(this.list));
      this.$router.push({
        name: "productDetails",
        query: { specId: specificationId, price: price },
      });
    },
    selectIllness() {
      let params = { ...this.$route.query };
      this.$store.commit("DoctorIM/savePlanProductList", params);
      this.$router.push({ name: "selectIllness" });
    },
  },
};
</script>

<style lang="less" scoped>
#productList /deep/.van-cell__value {
  text-align: left;
  &:not(:last-child) {
    border-bottom: 1px solid #ebedf0;
  }
}
#productList /deep/ .groupList .van-cell {
  .padding(15, 10, 15, 10);
  background-color: transparent;
}
#productList /deep/.van-cell__title {
  flex: initial;
  display: flex;
  align-items: center;
}
#productList /deep/.van-checkbox {
  .height(20);

  .van-checkbox__icon {
    .height(20);
  }
}
#productList /deep/.van-checkbox__icon .van-icon {
  border-color: @descriptionColor;
  .width(20);
  .height(20);
}
#productList /deep/.van-search__action:active {
  background-color: transparent;
}
#productList /deep/ .groupList {
  border-radius: 10px;
  margin-bottom: 12px;
  // &:not(:last-child) {
  //   margin-bottom: 12px;
  // }
}
#productList /deep/ .van-checkbox-group {
  padding: 0 2px 0 2px;
}
#productList /deep/ .stepper {
  position: absolute;
  right: 0;
  bottom: 0;
  .margin(0, 15, 15, 0);
}
#productList /deep/ .van-cell:after {
  border: none;
}
#productList /deep/ .van-hairline--top-bottom:after {
  border: none;
}
#productList /deep/ .van-hairline-unset--top-bottom:after {
  border: none;
}
#productList /deep/ .van-stepper__minus,
#productList /deep/ .van-stepper__plus {
  .width(28);
  .height(18);
  padding: 0;
  .borderRadius(9, 9, 9, 9);
}
#productList /deep/ .van-stepper__input {
  .width(28);
  .height(18);
  padding: 0;
  background: none;
}
#productList {
  width: 100vw;
  overflow: hidden;
  position: relative;
  background-color: @backgroundColor;
  .padding(44, 0, 68, 0);
}

.recommended-plan {
  .padding(0, 12, 0, 12);

  /deep/ .van-cell {
    .borderRadius(10, 10, 10, 10);
    .padding(11, 15, 11, 15);
    overflow: hidden;

    .van-cell__title {
      flex: 1 !important;

      span {
        .fontSize(16);
        font-weight: bold;
        color: @titleColor;
        .lineHeight(18);
      }
    }

    .van-icon-arrow {
      .fontSize(18);
      color: @titleColor;
    }
  }
}

.search-shade {
  .padding(12, 12, 12, 12);
  height: 88%;
  overflow: auto;

  .groupList {
    position: relative;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.chat_message_box {
  display: flex;
  .width(210);
  flex-flow: column;
  .padding(2, 2, 2, 2);

  .name {
    .fontSize(16);
    font-weight: 400;
    color: @titleColor;
    .lineHeight(20);
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .specification {
    .fontSize(14);
    font-weight: 400;
    color: @descriptionColor;
    .lineHeight(14);
    .margin(5, 0, 24, 0);
  }

  .num {
    .fontSize(16);
    font-weight: 400;
    color: @orderPriceColor;
    .lineHeight(16);

    span {
      font-weight: bold;
    }
  }
}
.chat_lists_item {
  display: flex;
  .img_box {
    .width(78);
    .height(78);
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;
    .margin(0, 8, 0, 10);

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
