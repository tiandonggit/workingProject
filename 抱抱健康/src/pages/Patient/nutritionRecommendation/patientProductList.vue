/**
* @Description: 营养推荐 -- 智能柜专区 --- 患者主动购买
* @Author: 侯湃
* @Date: 2020/7/15
*/
<template>
  <div id="productList">
    <common-header
        :share-disabled="true"
        :custom-title="'商品清单'"
        :header-show="true"
        title="商品清单"></common-header>
    <div class="product-search-box">
      <div class="search-box">
        <img src="../../../assets/images/icon_product_search.png" alt="">
        <van-field
            @change="getSearchResult"
            v-model="searchValue"
            placeholder="输入要搜索的内容"/>
      </div>
    </div>
    <div class="search-shade">
      <van-cell-group
          class="groupList"
          v-for="(item, index) in list"
          v-show="item.isSearchResult"
          :key="index"
          :id="'id' + index">
        <van-cell title @click.stop="toggle(item.productCount, index)">
          <template slot="title">
            <van-checkbox
                :name="item"
                v-model="item.isCheck"
                shape="round"
                ref="checkboxes"
                slot="right-icon"
                checked-color="#0069FF"/>
          </template>
          <div class="chat_lists_item"
               @click.stop="productDetails(item.specificationId, item.productPrice)">
            <div class="img_box">
              <img :src="item.topImg.split(',')[0]" alt/>
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
                ) "/>
        </div>
      </van-cell-group>
    </div>
    <div class="footer-box">
      <van-button
          slot="button"
          class="next-btn"
          size="large"
          @click="$throttle(goAdd)">
        提交
      </van-button>
    </div>
  </div>
</template>

<script>

  import {Toast, Dialog, Stepper} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "patientProductList",
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
        doctorId:''
      };
    },
    components: {
      commonHeader
    },
    computed: {},
    created() {
      this.doctorId = this.$route.query.doctorId || '';
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
          let div = document.getElementById("id" + key);
          let height = div.offsetTop - 13;
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
        let url = this.$globalServiceHost.selfMachineHost + "/MDeviceCellController/productList";
        this.$http.request({
            method: "get",
            url: url,
            body: {
              deviceId: data
            }
          }).then(res => {
            if (res.data.success) {
              res.data.data.forEach((item) => {
                item.productCount = 1;
                item.isCheck = false;
                item.isSearchResult = true;
              });
              this.list = res.data.data;
              window.localStorage.setItem("patientProductList", JSON.stringify(this.list));
            } else {
              Toast(res.data.message || '操作失败')
            }
          }).catch(error => {
             console.log(error)
          });
      },
      getSearchResult() {
        if (!this.searchValue) {
          this.list.forEach((v) => {
            v.isSearchResult = true;
          });
          return false;
        }
        this.list.forEach((v, e) => {
          v.isSearchResult = false;
        });
        this.list.forEach((v, e) => {
          v.isSearchResult = v.productName.search(this.searchValue) != -1;
        });
      },
      /**
       * 提交订单
       * **/
      goAdd() {
        let infoItems = [];
        let totalPrice = 0;
        this.allNum = 0;
        this.list.forEach(v => {
          if (v.isCheck) {
            this.result.push(v);
          }
        });
        for (let i = 0; i < this.result.length; i++) {
          if (this.result[i].productCount > this.result[i].productStore) {
            Toast("输入商品数量超过最大库存，请重新输入");
            return;
          }
          let obj = {
            specificationId: this.result[i].specificationId,
            goodsId: this.result[i].goodsId,
            productCount: this.result[i].productCount,
            productPrice: this.result[i].productPrice
          };

          infoItems.push(obj);
          totalPrice += this.result[i].productCount * this.result[i].productPrice;
          this.allNum += this.result[i].productCount;
        }
        console.log("allNum", this.allNum);
        if (this.allNum == 0 || this.result.length == 0) {
          return false;
        }
        let url = "",
          params = {};
        url = "/PayRecommendController/imRecommendOrder";
        params = {
          commitProductInfo: JSON.stringify(infoItems),
          orderTotalPrice: totalPrice,
          deviceId: this.deviceData.deviceId,
          orderProductNum: this.allNum,
          deviceName: this.deviceData.deviceName,
          deviceCode: this.deviceData.deviceCode,
          patiId: this.$route.query.patientId,
          doctorId: this.doctorId
        };
        this.$http.request({
          url: url,
          method: "post",
          body: params
        }).then(res => {
          if (res.data.success) {
            window.localStorage.removeItem("patientProductList");
            // 提交订单返回订单id 跳转支付页面
            this.$router.push({
              path:'/submitOrder',
              query:{
                orderId:res.data.data || ''
              }
            })
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(error => {
          console.log(error)
        });
      },
      /**
       * 查看产品详情
       * **/
      productDetails(specificationId, price) {
        window.localStorage.setItem("patientProductList", JSON.stringify(this.list));
        this.$router.push({
          name: "productDetails",
          query: { specId: specificationId, price: price }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  #productList /deep/ .van-cell__value {
    text-align: left;

    &:not(:last-child) {
      border-bottom: 1px solid #ebedf0;
    }
  }

  #productList /deep/ .groupList .van-cell {
    .padding(15, 10, 15, 10);
    background-color: transparent;
  }

  #productList /deep/ .van-cell__title {
    flex: initial;
    display: flex;
    align-items: center;
  }

  #productList /deep/ .van-checkbox {
    .height(20);

    .van-checkbox__icon {
      .height(20);
    }
  }

  #productList /deep/ .van-checkbox__icon .van-icon {
    border-color: @descriptionColor;
    .width(20);
    .height(20);
  }

  #productList /deep/ .van-search__action:active {
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
