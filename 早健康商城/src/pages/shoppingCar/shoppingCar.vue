/*
 * @Author: 田东 
 * @Date: 2019-05-08 09:40:49 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-07-24 17:42:33
 * @name: 购物车
 */

<template>
  <div id="shoppingCar">
    <!-- 头部 -->
    <v-header :title="title" :left="left"></v-header>
    <div v-if="list.length > 0">
      <!-- 搜索栏 -->
      <!-- <van-search
        v-model="searchText"
        placeholder="搜索购物车商品"
        background="#f2f2f2"
        show-action
        @search="onSearch()"
        @focus="onFocus()"
        @blur="onBlur()"
      >
        <div slot="action" @click="onSearch()">搜索</div>
      </van-search>-->
      <!-- 购物车内容区 -->
      <div class="card_box" v-for="(data, key) in list" :key="key">
        <van-checkbox
          :disabled="data.spharmacyproductstatus == 1"
          checked-color="#E98C2E"
          @click="checkPharmacy(data.pharmacyid, data.isSelectPharmacy)"
          v-model="data.isSelectPharmacy"
        >{{data.pharmacyname}}</van-checkbox>
        <div class="goods_box" v-for="(sProductCart, key) in data.sProductCartList" :key="key">
          <van-swipe-cell :right-width="72">
            <van-checkbox
              :disabled="sProductCart.logicdel == 1 || sProductCart.inventory < sProductCart.productcount"
              checked-color="#E98C2E"
              @click="checkProduct(data.pharmacyid, sProductCart.id, sProductCart.selectProduct, sProductCart.logicdel, sProductCart.inventory < sProductCart.productcount)"
              v-model="sProductCart.selectProduct"
            ></van-checkbox>
            <div class="goods_info">
              <div class="left_img" @click="producdDetails(sProductCart.sproductid)">
                <img :src="sProductCart.productimg" alt>
                <div class="product_logicdel" v-if="sProductCart.logicdel">商品已下架</div>
              </div>
              <div class="right_describe">
                <div class="top" @click="producdDetails(sProductCart.sproductid)">
                  <p class="describe_title">{{sProductCart.producttitle}}</p>
                  <p class="describe_info">{{sProductCart.specificationname}}</p>
                  <p
                    class="describe_inventory"
                    :class="{inventory_tension: sProductCart.inventory <= 20}"
                  >库存{{sProductCart.inventory}}件</p>
                </div>
                <div class="bottom">
                  <div class="price_count">
                    <div class="price">¥{{(sProductCart.productprice / 100).toFixed(2)}}</div>
                    <div class="number">
                      <a
                        v-if="sProductCart.productcount <= 1 || sProductCart.logicdel"
                        :class="{disabled: sProductCart.productcount <= 1 || sProductCart.logicdel}"
                        class="subtract_btn"
                      >-</a>
                      <a
                        v-else
                        class="subtract_btn"
                        @click="updateCartNum(sProductCart.id, 1, sProductCart.productcount, sProductCart.inventory)"
                      >-</a>
                      <span>{{sProductCart.productcount >= 200 ? 200 : sProductCart.productcount}}</span>
                      <a
                        v-if="sProductCart.productcount >= sProductCart.inventory || sProductCart.productcount >= 200 || sProductCart.logicdel"
                        :class="{disabled: sProductCart.productcount >= sProductCart.inventory || sProductCart.productcount >= 200 || sProductCart.logicdel}"
                        class="add_btn"
                      >+</a>
                      <a
                        v-else
                        class="add_btn"
                        @click="updateCartNum(sProductCart.id, 0, sProductCart.productcount, sProductCart.inventory)"
                      >+</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span class="swipe_right" slot="right">
              <div @click="remove(data.pharmacyid, sProductCart.id)">删除</div>
            </span>
          </van-swipe-cell>
        </div>
      </div>
    </div>
    <div v-if="list.length == 0">
      <div class="empty_car"></div>
    </div>
    <!-- 为您推荐 -->
    <!-- <p class="recommend">为您推荐</p> -->
    <Recommended :title="recommendTitle"></Recommended>
    <!-- 结算 -->
    <van-submit-bar
      v-if="list.length > 0 && isFocus"
      :price="total"
      button-text="结算"
      @submit="onSubmit()"
    >
      <van-checkbox checked-color="#E98C2E" v-model="isSelectAll" @click="selectAll()">全选</van-checkbox>
      <span
        v-if="this.saveMoney != 0"
        slot="tip"
        v-show="isShowSaveMoney"
      >立省：¥ {{(this.saveMoney / 100).toFixed(2)}}</span>
    </van-submit-bar>

    <Tabber v-if="isFocus"></Tabber>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import Tabber from "@/components/Tabber";
import Recommended from "@/components/Recommended";

import { Toast, Dialog } from "vant";
import { setTimeout } from "timers";

export default {
  name: "shoppingCar",
  data() {
    return {
      title: "购物车",
      left: false,
      recommendTitle: "为您推荐",
      searchText: "",
      isSelectAll: false,
      list: [],
      total: 0,
      saveMoney: 0,
      productCartId: "",
      isShowSaveMoney: false,
      canClick: false,
      shopCard: "",
      canChange: true,
      isFocus: true
    };
  },
  components: {
    "v-header": Header,
    Tabber: Tabber,
    Recommended: Recommended
  },
  destroyed() {
    this.list.forEach((v, e) => {
      v.isSelectPharmacy = this.isSelectAll;
      v.sProductCartList.forEach((v2, e2) => {
        if (v2.selectProduct) {
          this.productCartId += v2.id + ",";
        }
      });
    });
    this.productCartId = this.productCartId.substring(
      0,
      this.productCartId.length - 1
    );
    // console.log(this.productCartId);
    this.$http
      .request({
        method: "post",
        url: "/SProductCartController/selectCarts", // 购物车选中状态
        body: { SProductCarts: this.productCartId }
      })
      .then(res => {
        let data = res.data;
        if (data.success) {
          // console.log(data.data.message);
        } else {
          console.log(data.message);
        }
      })
      .catch(error => {
        console.log("错误为" + error);
      });
  },
  created() {
    if (this.getshopCardNum) {
      this.shopCard = this.getshopCardNum;
    }
  },
  mounted: function() {
    // |获取购物车产品列表
    this.getData();
  },
  computed: {
    //获取购物车数量
    getshopCardNum() {
      return this.$store.state.Home.shopCardNum;
    }
  },
  methods: {
    getData(ad) {
      this.$http
        .request({
          method: "get",
          url: "/SProductCartController/selectSProductCarts",
          body: { searchName: this.searchText }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.list = data.data;
            this.list.forEach((v, e) => {
              v.sProductCartList.forEach((v2, e2) => {
                // if (v2.selectProduct) {
                this.checkProduct(
                  v.pharmacyid,
                  v2.id,
                  v2.selectProduct,
                  v2.logicdel
                );
                // }
              });
            });
            if (ad == "delete") {
              Toast("删除成功");
            }
          } else {
            if (data.code !== "00006") {
              Toast(data.message);
            } else {
              this.$store.commit("Home/shopCardNum", 0); // 更新购物车数量
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    onFocus() {
      this.isFocus = false;
    },
    onBlur() {
      this.isFocus = true;
    },
    onSearch() {
      this.getData();
    },
    // 药房选中
    checkPharmacy(pharmacyid, isSelectPharmacy) {
      let num = 0,
        num2 = 0;
      this.list.forEach((v, e) => {
        if (v.pharmacyid == pharmacyid) {
          v.sProductCartList.forEach((v2, e2) => {
            if (
              v2.logicdel == 1 ||
              v2.inventory == 0 ||
              v2.productcount > v2.inventory
            ) {
              return;
            }
            v2.selectProduct = isSelectPharmacy;
            // }
          });
        }
        if (v.isSelectPharmacy == true) {
          num++;
        }
        if (v.spharmacyproductstatus == 1) {
          num2++;
        }
        if (num + num2 == this.list.length) {
          this.isSelectAll = true;
        } else {
          this.isSelectAll = false;
        }
      });
      this.countTotal();
    },
    // 药品选中
    checkProduct(pharmacyid, id, selectProduct, logicdel, isInventoryEnough) {
      if (logicdel == 1) {
        // Toast("商品已下架");
        this.list.forEach((v, e) => {
          if (v.pharmacyid == pharmacyid) {
            let num = 0;
            if(v.sProductCartList.length == 1){
              v.spharmacyproductstatus = 1;
            } else {
              v.sProductCartList.forEach((v2, e2) => {
                if (v2.id == id) {
                  v2.selectProduct = false;
                }
                if(v2.logicdel == 1){
                  num++;
                }
                if(num == v.sProductCartList.length){
                  v.spharmacyproductstatus = 1;
                }
              });
            }
          }
        });
        return;
      }
      if (isInventoryEnough) {
        return;
      }
      // console.log(pharmacyid, id, selectProduct);
      if (selectProduct) {
        this.isSelectAll = true;
        this.list.forEach((v, e) => {
          if (v.pharmacyid == pharmacyid) {
            let num = 0,
              num2 = 0;
            v.sProductCartList.forEach((v2, e2) => {
              if (v2.productcount > v2.inventory && v2.selectProduct) {
                v2.selectProduct = false;
                // Toast("库存不足");
                num2++;
              } else if (v2.logicdel == 1) {
                num2++;
              } else if (v2.productcount > v2.inventory) {
                num2++;
              }
              if (v2.selectProduct == selectProduct) {
                num++;
              }
              if (num + num2 == v.sProductCartList.length) {
                v.isSelectPharmacy = selectProduct;
              }
            });
          }
        });
      } else {
        this.isSelectAll = false;
        this.list.forEach((v, e) => {
          if (v.pharmacyid == pharmacyid) {
            let num = 0,
              num2 = 0;
            v.sProductCartList.forEach((v2, e2) => {
              if (v.sProductCartList.length == 1) {
                if (v2.productcount > v2.inventory || v2.logicdel == 1) {
                  v.spharmacyproductstatus = 1;
                } else {
                  v.spharmacyproductstatus = 0;
                }
                v.isSelectPharmacy = selectProduct;
              } else {
                if (v2.selectProduct == selectProduct) {
                  num++;
                }
                if (num != v.sProductCartList.length) {
                  v.isSelectPharmacy = selectProduct;
                }
                if (v2.productcount > v2.inventory) {
                  num2++;
                } else if (v2.logicdel == 1) {
                  num2++;
                }
                if (num2 == v.sProductCartList.length) {
                  v.spharmacyproductstatus = 1;
                } else {
                  v.spharmacyproductstatus = 0;
                }
              }
            });
          }
        });
      }

      let num1 = 0,
        num2 = 0;
      this.list.forEach((v, e) => {
        this.isSelectAll = true;
        if (v.spharmacyproductstatus == 0 && v.isSelectPharmacy) {
          num1++;
        } else if (v.spharmacyproductstatus == 1) {
          num2++;
        }
        if (num1 + num2 == this.list.length && num1 !== 0) {
          this.isSelectAll = true;
        } else {
          this.isSelectAll = false;
        }
      });

      this.countTotal();
    },
    // 全选
    selectAll() {
      this.list.forEach((v, e) => {
        if (v.spharmacyproductstatus == 1) {
          return;
        }
        v.isSelectPharmacy = this.isSelectAll;
        v.sProductCartList.forEach((v2, e2) => {
          if (
            v2.logicdel == 1 ||
            v2.inventory == 0 ||
            v2.inventory < v2.productcount
          ) {
            return;
          }
          v2.selectProduct = this.isSelectAll;
        });
      });

      this.countTotal();
    },
    // 更新购物车商品数量 0+ 1-
    updateCartNum(id, type, productcount, inventory) {
      if (!this.canChange) return;
      if (type == 1 && inventory >= 1) {
        if (productcount <= 1) {
          Toast("最少一件");
          return;
        }
      } else if (type == 1 && inventory < 1) {
        Toast("库存不足");
        return;
      }
      this.canChange = false;
      this.$http
        .request({
          method: "post",
          url: "/SProductCartController/updateCartNum",
          body: { id: id, type: type }
        })
        .then(res => {
          let data = res.data;
          this.canChange = true;
          if (data.success) {
            if (data.data.updatestatus == 0) {
              // this.total = data.total;
              this.list.forEach((v, e) => {
                v.sProductCartList.forEach((v2, e2) => {
                  if (v2.id == data.data.id) {
                    v2.productcount = data.data.productcount;
                    v2.producttotalprice = data.data.producttotalprice;
                    v2.inventory = data.data.inventory;
                    this.checkProduct(
                      v.pharmacyid,
                      v2.id,
                      v2.selectProduct,
                      v2.logicdel
                    );
                    this.countTotal();
                  }
                });
              });
            } else {
              Toast(data.data.msg);
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 删除购物车商品
    remove(pharmacyid, id) {
      // console.log(pharmacyid, id);
      Dialog.confirm({
        title: "",
        message: "确认删除这一种商品吗？"
      })
        .then(() => {
          this.$http
            .request({
              method: "post",
              url: "/SProductCartController/deleteSProductCarts",
              body: {
                SProductCarts: id
              }
            })
            .then(res => {
              let data = res.data;
              if (data.success) {
                this.shopCard = data.data.sproductcartsnum;
                this.$store.commit("Home/shopCardNum", this.shopCard); // 更新购物车数量
                this.getData("delete");
              } else {
                Toast(data.message);
              }
            })
            .catch(error => {
              console.log("错误为" + error);
            });
        })
        .catch(() => {});
    },
    // 总价
    countTotal() {
      this.total = 0;
      this.saveMoney = 0;
      this.isShowSaveMoney = false;
      this.list.forEach((v, e) => {
        v.sProductCartList.forEach((v2, e2) => {
          if (v2.selectProduct) {
            this.total = parseInt(this.total) + parseInt(v2.producttotalprice);
            //console.log(this.total)
          }
        });
      });

      this.list.forEach((v, e) => {
        v.sProductCartList.forEach((v2, e2) => {
          if (v2.selectProduct) {
            this.isShowSaveMoney = true;
            this.saveMoney =
              parseInt(this.saveMoney) +
              parseInt(v2.productcount * v2.preferentialprice);
            //console.log(this.total)
          }
        });
      });

      if (this.total != 0) {
        this.canClick = true;
      } else {
        this.canClick = false;
      }

      // this.total -= this.saveMoney;
    },
    // 结算
    onSubmit: function() {
      if (!this.canClick) return;
      this.list.forEach((v, e) => {
        v.isSelectPharmacy = this.isSelectAll;
        v.sProductCartList.forEach((v2, e2) => {
          if (v2.selectProduct) {
            this.productCartId += v2.id + ",";
          }
        });
      });
      this.productCartId = this.productCartId.substring(
        0,
        this.productCartId.length - 1
      );
      this.$http
        .request({
          method: "post",
          url: "/SProductCartController/cartSettlement",
          body: { productCartId: this.productCartId }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            window.localStorage.setItem("orderData", JSON.stringify(data.data));
            window.localStorage.setItem("productCartId", this.productCartId);
            this.$localStorage.removeItem("payBack");
            if (!this.scienceWX) {
              this.$router.push({
                path: "../order/submitOrder"
              });
            } else {
              this.$routerWX.push({
                path: "../order/submitOrder"
              });
            }
          } else {
            if (data.code == "00006") {
              Dialog.confirm({
                title: "",
                message: "您已退出登录，请重新登录",
                confirmButtonText: "去登录"
              })
                .then(() => {
                  if (!this.scienceWX) {
                    this.$router.push({ name: "login" });
                  } else {
                    this.$routerWX.push({ name: "login" });
                  }
                })
                .catch(() => {});
              // 其他
            } else {
              Toast(data.message);
            }
          }
          this.productCartId = "";
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    // 商品详情
    producdDetails(sproductid) {
      if (!this.scienceWX) {
        this.$router.push({
          name: "Particular",
          query: { pid: sproductid }
        });
      } else {
        this.$routerWX.push({
          name: "Particular",
          query: { pid: sproductid }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}
#shoppingCar {
  padding-bottom: 25.4vw;
  background: @backgroundColor;
  &::-webkit-scrollbar {
    display: none;
  }

  .van-search {
    padding: 0;
    width: 93vw;
    margin: 2.5vw auto 0;

    .van-search__content {
      border-radius: 1.3vw;
      background: @backgroundColorT;
    }

    .van-search__action {
      background: @mainColor;
      border-radius: 2.6vw;
      color: @fontOne;
      width: 14.5vw;
      margin-left: 3.3vw;
      text-align: center;
    }
  }

  .card_box {
    box-sizing: border-box;
    width: 94vw;
    margin: 3vw auto 3vw;
    padding: 3vw 3vw 2vw;
    background: @backgroundColorT;
    // opacity: 0.7;
    border-radius: 2.7vw;

    .goods_box {
      display: flex;
      align-items: center;

      .van-checkbox {
        // display: inline-block;
        float: left;
        margin-top: 13vw;
      }
    }

    .goods_info {
      width: 79vw;
      display: inline-block;
      margin: 4vw 0 0 3vw;

      .left_img {
        width: 21vw;
        // height: 21vw;
        display: inline-block;
        overflow: hidden;
        padding: 4vw 2vw 2vw;
        margin-right: 2vw;
        vertical-align: top;
        position: relative;

        img {
          width: 100%;
        }

        .product_logicdel {
          position: absolute;
          bottom: 0;
          left: 0;
          background: @background0;
          opacity: 0.2;
          border-bottom-left-radius: 2.7vw;
          border-bottom-right-radius: 2.7vw;
          .fontSize(12);
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: @fontOne;
          width: 100%;
          text-align: center;
          padding: 0.8vw 0 1.3vw;
        }
      }

      .right_describe {
        display: inline-block;
        width: 56vw;
        height: 28vw;
        position: relative;

        .top {
          .describe_title {
            .fontSize(15);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
            color: @titleColor;
            background: none;
            margin: 0;
            word-break: keep-all;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .describe_info {
            .fontSize(13);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
            color: @descriptionColor;
            margin: 0.3vw 0 0.8vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .describe_inventory {
            .fontSize(12);
            font-family: PingFang-SC-Regular;
            font-weight: 400;
            color: @descriptionColor;
          }
          .inventory_tension {
            color: @mainColor;
          }
        }

        .bottom {
          width: 100%;
          position: absolute;
          bottom: 0;
          .price_count {
            .price {
              float: left;
              .fontSize(18);
              font-family: PingFang-SC-Medium;
              font-weight: 500;
              color: @orderPriceColor;
            }
            .number {
              float: right;
              margin-top: 3px;
              line-height: 4.8vw;

              span {
                display: inline-block;
                width: 8vw;
                text-align: center;
              }

              .subtract_btn,
              .add_btn {
                width: 8vw;
                height: 5vw;
                background: @addBtnBgColor;
                border-radius: 1.3vw;
                display: inline-block;
                text-align: center;
                color: @titleColor;
              }
              .disabled {
                opacity: 0.5;
              }
            }
          }
        }
      }
    }

    .van-swipe-cell {
      .swipe_right {
        background: @mainColor;
        display: inline-block;
        width: 60px;
        margin-left: 12px;
        height: 100%;

        div {
          width: 100%;
          height: 100%;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;
          color: @fontOne;
        }
      }
    }
  }

  .empty_car {
    height: 31.3vw;
    padding: 15.6vw 22.4vw 8vw 42.4vw;
    background: url("../../assets/images/icon_shoppingcar.png") no-repeat;
    background-size: 51.7vw;
    background-position: center center;

    span {
      color: @buzanColor;
    }
  }

  .recommend {
    .fontSize(15);
    text-align: center;
    color: @titleColor;
    margin-top: 5vw;
  }

  // 结算
  .van-submit-bar {
    bottom: 50px;

    .van-submit-bar__bar {
      height: 50px;
    }

    .van-checkbox {
      padding-left: 6vw;

      .van-checkbox__label {
        color: @subtitleColor;
        margin-left: 2vw;
      }
    }

    .van-submit-bar__text {
      text-align: left;
      padding-left: 7vw;
      color: @titleColor;
      .fontSize(15);
      line-height: 22px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;

      .van-submit-bar__price {
        .fontSize(15);
        color: @titleColor;
      }

      .save_money {
        .fontSize(12);
        color: @titleColor;
      }
    }

    .van-button {
      width: 33vw;
      background: @mainColor;
      border: none;

      // .van-button__text {
      //   color: @submitOrderColor;
      // }
    }
  }
}
</style>
