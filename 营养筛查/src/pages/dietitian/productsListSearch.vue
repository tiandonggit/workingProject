/**
*@desc 产品列表搜索
*@author houpai
*@date 2020/04/08 15:11:42
*/
<template>
  <div class="productsListSearch_page">
    <commonHeader
        :share-disabled="true"
        :custom-title="'营养方案'"
        :header-show="true"
        :title="'产品列表'"
    ></commonHeader>
    <div class="productsListSearch_box" v-if="isAllNutrition">
      <div class="search_box">
        <van-search @search="onSearch" v-model="searchValue" placeholder="请输入产品名称"></van-search>
      </div>
      <ul class="products_list">
        <van-radio-group v-model="checkedProducts">
          <li
              v-for="(product, index) in productsList"
              :class="[{'noBorder':index === productsList.length - 1}]"
              :key="index"
              v-show="product.isSearchShow"
          >
            <div class="radio_box">
              <van-radio :name="product.specificationId" :disabled="product.isSelected === 1"></van-radio>
            </div>
            <div class="product_img_box">
              <img :src="product.topImg" alt/>
              <div class="checked_tip" v-if="product.isSelected === 1">已添加</div>
            </div>
            <div class="product_desc_box">
              <h4>{{product.productName}}</h4>
              <div
                  class="product-store"
              >{{product.proteinRatio}}%蛋：{{product.carbonRatio}}%碳：{{product.fatRatio}}%脂
              </div>
              <div
                  class="product-store"
              >{{product.protein}}g蛋：{{product.carbon}}g碳：{{product.fat}}g脂
              </div>
              <div class="prselistrm">
                <span>{{ !product.kcal ? "未知" : product.kcal + "kcal" }}</span>
                {{ product.specificationName }}
              </div>
              <p class="price">¥{{(product.jiage / 100).toFixed(2)}}</p>
            </div>
          </li>
        </van-radio-group>
      </ul>
    </div>
    <div class="productsListSearch_box" v-if="!isAllNutrition">
      <div class="search_box">
        <div class="select-box">
          <van-dropdown-menu>
            <van-dropdown-item v-model="dropdownValue" :options="options" @change="onChange"/>
          </van-dropdown-menu>
        </div>
        <van-search @search="onSearch" v-model="searchValue" placeholder="请输入产品名称"></van-search>
      </div>
      <ul class="products_list">
        <van-checkbox-group v-model="checkedProductsAry">
          <li
              v-for="(product, index) in productsList"
              :class="[{'noBorder':index === productsList.length - 1}]"
              :key="index"
              v-show="product.isSearchShow"
          >
            <div class="radio_box">
              <van-checkbox :name="product.specificationId" :disabled="product.isSelected === 1"></van-checkbox>
            </div>
            <div class="product_img_box">
              <img :src="product.topImg" alt/>
              <div class="checked_tip" v-if="product.isSelected === 1">已添加</div>
            </div>
            <div class="product_desc_box">
              <h4>{{product.productName}}</h4>
              <div
                  class="product-store"
              >{{product.proteinRatio}}%蛋：{{product.carbonRatio}}%碳：{{product.fatRatio}}%脂
              </div>
              <div
                  class="product-store"
              >{{product.protein}}g蛋：{{product.carbon}}g碳：{{product.fat}}g脂
              </div>
              <div class="prselistrm">
                <span>{{ !product.kcal ? "未知" : product.kcal + "kcal" }}</span>
                {{ product.specificationName }}
              </div>
              <p class="price">¥{{(product.jiage / 100).toFixed(2)}}</p>
            </div>
          </li>
        </van-checkbox-group>
      </ul>
    </div>
    <div class="submit_btn_box">
      <div class="submit_btn" @click.stop="$throttle(submitModify)">确认添加</div>
    </div>

  </div>
</template>

<script>

  import commonHeader from "../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast, Dialog} from "vant";

  export default {
    name: "productsListSearch",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["Doctor"])
    },
    filters: {
      formatPrice(value) {
        let price = "";
        price = (value / 100).toFixed(2);
        return price;
      }
    },
    data() {
      return {
        isAllNutrition: false,
        searchValue: "",
        checkedProducts: {}, // 选择的全营养产品
        checkedProductsAry: [], // 选择的组件产品
        productsList: [],
        dropdownValue: "0",
        options: [{text: "全部商品", value: "0"}]
      };
    },
    methods: {
      /**
       * 搜索产品
       * **/
      onSearch() {
        if (this.dropdownValue == "0") {
          if (!this.searchValue) {
            this.productsList.forEach((v, e) => {
              v.isSearchShow = true;
            });
            return false;
          }
          this.productsList.forEach((v, e) => {
            v.isSearchShow = v.productName.search(this.searchValue) != -1;
          });
        } else {
          if (!this.searchValue) {
            this.productsList.forEach((v, e) => {
              v.isSearchShow = v.secCatalogId == this.dropdownValue;
            });
            return false;
          }
          this.productsList.forEach((v, e) => {
            v.isSearchShow = v.productName.search(this.searchValue) != -1 && v.secCatalogId == this.dropdownValue;
          });
        }
      },
      /**
       * 修改提交
       * **/
      submitModify() {
        let modifyProductListVuex = JSON.parse(
          JSON.stringify(this.Doctor.modifyProductList)
        );
        if (this.isAllNutrition) {
          this.productsList.forEach((v2, e2) => {
            if (this.checkedProducts === v2.specificationId) {
              console.log("this.checkedProducts ====", this.checkedProducts, "v2.specificationId===", v2.specificationId);
              try {
                if (modifyProductListVuex.goods.length) {
                  if(modifyProductListVuex.goods[0].isFull == 1) {
                    modifyProductListVuex.goods.splice(0, 1);
                    modifyProductListVuex.goods.unshift(v2);
                  } else {
                    modifyProductListVuex.goods.unshift(v2);
                  }
                } else {
                  modifyProductListVuex.goods = [v2];
                }
              } catch (e) {
                console.log(e);
              }
            }
          });
        } else {
          this.checkedProductsAry.forEach((v, e) => {
            this.productsList.forEach((v2, e2) => {
              if (v === v2.specificationId) {
                modifyProductListVuex.goods.push(v2);
              }
            });
          });
        }
        this.$store.commit("Doctor/modifyProductList", modifyProductListVuex);
        this.$router.go(-1);
      },
      /**
       * 获取产品列表
       * **/
      getProductsList() {
        let specificationIds = [];
        if (this.isAllNutrition) {
          specificationIds = this.Doctor.modifyProductList.goods.length && this.Doctor.modifyProductList.goods[0].specificationId;
        } else {
          for (let i = 1; i < this.Doctor.modifyProductList.goods.length; i++) {
            specificationIds.push(this.Doctor.modifyProductList.goods[i].specificationId);
          }
          specificationIds = specificationIds.join(",");
        }
        this.$http.request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/getPresGoodsList",
          body: {
            deviceId: this.Doctor.modifyProductList.deviceId,
            specificationIds: specificationIds,
            type: this.isAllNutrition ? 1 : 0
          }
        }).then(res => {
          let data = res.data;
          if (data.success) {
            data.data.forEach((v, e) => {
              v.isSearchShow = true;
            });
            this.productsList = data.data;
          } else {
            Toast(data.message || "操作失败");
          }
        }).catch(err => {
          console.log(err);
        });
      },
      /**
       * 获取营养类别
       * **/
      selectCatalog() {
        this.$http.request({
          method: "get",
          url: "/SysDictionaryController/selectCatalog",
          body: {}
        }).then(res => {
          let data = res.data;
          if (data.success) {
            data.data.forEach(v => {
              this.options.push({text: v.text, value: v.code});
            });
          } else {
            Toast(data.message || "操作失败");
          }
        }).catch(err => {
          console.log(err);
        });
      },
      onChange() {
        this.searchValue = "";
        if (this.dropdownValue == "0") {
          this.productsList.forEach((v, e) => {
            v.isSearchShow = true;
          });
          return;
        }
        this.productsList.forEach((v, e) => {
          if (v.secCatalogId == this.dropdownValue) {
            v.isSearchShow = true;
          } else {
            v.isSearchShow = false;
          }
        });
      }
    },
    created() {
      this.isAllNutrition = this.$route.query.isAllNutrition || "";
      this.getProductsList();
      !this.isAllNutrition && this.selectCatalog();
    }
  };
</script>
<style lang="less" scoped>

  @media only screen and (device-width: 375px) and (device-height: 812px) and

  (-webkit-device-pixel-ratio: 3) {
    /*导航操作栏上移*/
    .productsListSearch_page {
      min-height: calc(100% - 34px) !important;
    }

    .submit_btn_box {
      bottom: 0 !important;
      .padding(0, 0, 34, 0);
      .height(98) !important;
    }
  }

</style>
<style scoped lang="less">

  .productsListSearch_page {
    min-height: 100%;
    .padding(54, 10, 84, 10);

    /deep/ .van-icon.van-icon-success {
      .width(20);
      .height(20);
      .margin(0, 0, 0, 10);
    }

    /deep/ .van-search {
      padding: 0;
      /*box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);*/
      border-radius: 6px;
      overflow: hidden;
      flex: 1;
      width: 0;

      .van-cell {
        .lineHeight(24);
      }

      .van-field__control {
        .fontSize(16);
        font-weight: 400;
      }

      .van-field__left-icon .van-icon,
      .van-field__right-icon .van-icon {
        .fontSize(22);
      }
    }

    .common-header {
      top: 0 !important;
    }

    .productsListSearch_box {
      background-color: @backgroundColorff;
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;

      .search_box {
        height: 64px;
        .padding(15, 12, 15, 12);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .select-box {
          width: 112px;
          margin-right: 18px;

          /deep/ .van-dropdown-menu {
            height: 34px;
            border-radius: 6px;
            border: 1px solid @fontColor99;

            .van-dropdown-menu__item {
              justify-content: left;
              position: relative;

              .van-dropdown-menu__title {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
              }

              .van-dropdown-menu__title::after {
                display: none;
              }

              &::after {
                position: absolute;
                top: 50%;
                right: 8px;
                margin-top: -5px;
                border: 0.8vw solid;
                border-color: transparent transparent currentColor currentColor;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                opacity: 0.8;
                content: "";
              }
            }

            .van-dropdown-item {
              .van-popup {
                width: 196px;
                padding: 15px 10px;
                background: @backgroundColorff;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                left: 24px;

                .van-cell {
                  padding: 0;

                  .van-cell__title {
                    flex: auto;
                  }

                  .van-cell__value {
                    flex: auto;
                  }

                  &::after {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }


      .products_list {
        li.noBorder {
          border-bottom: 0;
        }

        li {
          position: relative;
          .padding(15, 15, 15, 15);
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          .radio_box {
            display: flex;
            align-items: center;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 3;
            height: 100%;

            /deep/ .van-checkbox {
              width: 100%;
              height: 100%;
              margin-top: 0;

              div {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                width: 100%;
                height: 100%;

                i {
                  .margin(0, 0, 0, 10);
                }
              }
            }
          }

          .product_img_box {
            position: relative;
            .width(78);
            .height(78);
            .borderRadius(10, 10, 10, 10);
            .margin(0, 8, 0, 24);
            overflow: hidden;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }

            .checked_tip {
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              margin: auto;
              .width(48);
              .height(48);
              .borderRadius(10, 10, 10, 10);
              background-color: rgba(0, 0, 0, 0.3);
              .fontSize(14);
              color: @fontColorff;
            }
          }

          .product_desc_box {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;

            h4 {
              font-weight: bold;
              color: @fontColor33;
              .fontSize(16);
              .lineHeight(20);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .guige1, .guige2 {
              font-weight: bold;
              color: @fontColor66;
              .fontSize(12);
              .lineHeight(20);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .guige2 {
              span {
                margin-left: 30px;
                color: @fontColor99;
              }
            }

            .product-store {
              color: @fontColor66;
              .fontSize(12);
              .lineHeight(20);

              span {
                color: @mainColor;
              }
            }

            .price {
              color: rgba(255, 48, 0, 1);
              .fontSize(14);
              .lineHeight(18);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-weight: 400;
            }

          }
        }
      }
    }

    .submit_btn_box {
      position: fixed;
      z-index: 3;
      display: flex;
      justify-content: center;
      align-items: center;
      left: 0;
      right: 0;
      bottom: 0;
      .height(64);
      background-color: #F2F2F2;

      .submit_btn {
        display: flex;
        justify-content: center;
        align-items: center;
        .width(351);
        .height(44);
        background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
        .borderRadius(10, 10, 10, 10);
        color: @fontColorff;
        .fontSize(18);
      }
    }
  }
</style>
