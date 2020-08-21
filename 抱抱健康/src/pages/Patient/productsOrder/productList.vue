/** *@desc 药品清单 *@author houpai *@date 2019/09/09 10:37:28 */
<template>
  <div class="productsList_page">
    <common-header
        :share-disabled="true"
        :custom-title="'产品购买'"
        :header-show="true"
        :title="'产品清单'"
    ></common-header>
    <div v-if="(status == 0 && date) || status == 4" class="v-box">
      <div v-if="status == 0 && date" class="v-date">{{date}}未支付，订单将失效无法购买。</div>
      <div v-if="status == 4" class="v-date v-closeDate">订单超时失效</div>
    </div>
    <ul class="drugs_list" :class="((status == 0 && date) || status == 4)?'drugs_box':''">
      <li v-for="(item, index) in productsList" :key="index">
        <div class="drug_img_box">
          <img :src="item.icon | formatProductImg" alt=""/>
        </div>
        <div class="drug_desc">
          <div>
            <p class="drug_name">{{ item.productname }}</p>
            <p class="drug_specifications">{{ item.specification }}</p>
          </div>
          <p class="price_num">
            <span class="price">
              ¥{{ (item.activityprice / 100).toFixed(2) }}
              <i> ¥{{ (item.price / 100).toFixed(2) }}</i>
            </span>
            <span class="number">x{{ item.number }}</span>
          </p>
        </div>
      </li>
    </ul>

    <div class="footer-box" v-if="orderstatus">
      <div class="next-btn"
           @click.stop="gotoBuy">
        <van-button slot="button" class="next-btn" size="large">购买</van-button>
      </div>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";

  export default {
    name: "productList",
    components: {
      commonHeader
    },
    data() {
      return {
        productOrderId: "", // 定单id
        productsList: [], // 商品清单
        orderstatus: true,// 购买按钮是否显示
        date: "",//倒计时的时间显示
        countDown: "", //倒计时时间(分钟)
        status: 2 //订单类型
      };
    },
    filters: {
      formatProductImg(value) {
        let productImg = "";
        try {
          if (value) {
            productImg = value.split(",")[0];
          }
        } catch (e) {
          console.log(e);
        }
        return productImg;
      }
    },
    methods: {
      /**
       * 购买产品
       * 如果已提交订单,跳转到订单详情**/
      gotoBuy() {
        this.$router.push({
          name: "submitProductOrder",
          query:{
            productOrderId:this.productOrderId
          }
        });
      },

      /**
       * 获取商品清单列表
       * 通过清单id查询 **/
      getProductsList(id) {
        this.$http.request({
          method: "get",
          url: "/ZyOrderDetailsController/selectByOrderId",
          body: {
            id: id
          }
        }).then(res => {
          if (res.data.success) {
            this.productsList = res.data.data.length && res.data.data;
          }
        }).catch(e => {
          console.log(e);
        });
      },

      /**
       * 查询订单状态 如果已付款 隐藏购买按钮
       * orderStatus 0 未f付款
       * **/
      getProductOrderDetail() {
        this.$http.request({
          method: "get",
          url: "/ZyOrderDetailsController/selectDetailByOrderId",
          body: {
            id: this.productOrderId
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            try {
              this.orderstatus = res.data.data.zyOrder.orderstatus === 0;
              this.status = res.data.data.zyOrder.orderstatus;
              //订单倒计时
              if (this.status == 0) {
                let dateInterval = setInterval(() => {
                  if (this.status == 4) {
                    clearInterval(dateInterval);
                  }
                  this.countTime(res.data.data.zyOrder.createtime, this.countDown * 60);
                  //this.countTime("2020-02-20 15:04",30*60);
                }, 1000);
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            console.log("get productOrderDetail fail");
          }
        }).catch(e => {
          this.loading = false;
          console.log(e);
        });
      },
      /**
       * 获取订单倒计时时间
       * **/
      getCountDown() {
        return new Promise((resolve, reject) => {
          this.$http
            .request({
              method: "get",
              url: "/ZyOrderController/selectOrderCancleTime",
              body: {
                orderId: this.productOrderId
              }
            })
            .then(res => {
              if (res.data.success) {
                this.countDown = res.data.data;
                resolve();
              } else {
                console.log("get CountDown fail");
              }
            })
            .catch(e => {
              reject(e);
              console.log(e);
            });
        });
      },
      /**
       * 时间处理
       * **/
      countTime(time, out) {
        //获取当前时间
        let date = new Date();
        let now = date.getTime();
        let endDate = new Date(time.replace(/-/g, "/"));
        let end = endDate.getTime() + out * 1000;

        //时间差
        let leftTime = end - now;
        //定义变量 d,h,m,s保存倒计时的时间
        let d, h, m, s;
        if (leftTime >= 0) {
          d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
          m = Math.floor((leftTime / 1000 / 60) % 60);
          s = Math.floor((leftTime / 1000) % 60);
          //将0-9的数字前面加上0，例1变为01
          d = checkTime(d);
          h = checkTime(h);
          m = checkTime(m);
          s = checkTime(s);

          function checkTime(i) {
            if (i < 10) {
              i = "0" + i;
            }
            return i;
          }

          //处理是否显示问题
          d = d == "00" ? "" : d + "天";
          h = h == "00" ? "" : h + "时";
          m = m == "00" ? "" : m + "分";
          s = s + "秒";
          this.date = d + h + m + s;
        }

        //将倒计时赋值到div中
        // document.getElementById("_d").innerHTML = d+"天";
        // document.getElementById("_h").innerHTML = h+"时";
        // document.getElementById("_m").innerHTML = m+"分";
        // document.getElementById("_s").innerHTML = s+"秒";
        //递归每秒调用countTime方法，显示动态时间效果
      }
    },
    watch: {
      date(value) {
        if (value == "00秒") {
          this.status = 4;
          this.orderstatus = false;
        }
      }
    },
    created() {
      console.log("productList");
      // 清空选择地址的缓存 避免提交订单的时候不能正确的显示默认地址
      this.$store.commit("Address/addressData", {
        id: "",
        status: 1,
        name: "",
        phone: "",
        address: "",
        pointnum: ""
      });
      this.productOrderId = this.$route.query.productOrderId || '';
      Promise.all([this.getCountDown()]).then(() => {
        this.getProductOrderDetail();
      });
      this.getProductsList(this.productOrderId);
    }
  };
</script>

<style scoped lang="less">
  .productsList_page {
    min-height: 100%;

    .v-box {
      .padding(54, 12, 20, 12);

      .v-date {
        .padding(13, 10, 13, 10);
        background: rgba(226, 238, 255, 1);
        .borderRadius(10, 10, 10, 10);
        .fontSize(14);
        font-weight: 400;
        color: rgba(0, 105, 255, 1);
      }

      .v-closeDate {
        background: #fff;
        color: rgba(153, 153, 153, 1);
      }
    }

    .drugs_box {
      .padding(0, 12, 60, 12) !important;
    }

    .drugs_list {
      .padding(54, 12, 60, 12);

      li {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        .padding(12, 12, 12, 12);
        .height(102);
        background: rgba(255, 255, 255, 1);
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
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .price_num {
            display: flex;
            justify-content: space-between;

            .price {
              .fontSize(16);
              .lineHeight(20);
              font-weight: bold;
              color: rgba(255, 48, 0, 1);

              i {
                .margin(0, 0, 0, 10);
                text-decoration: line-through;
                .fontSize(12);
                .lineHeight(16);
                color: rgba(153, 153, 153, 1);
              }
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
