/** *@desc 订单详情 *@author houpai *@date 2019/09/09 10:38:19 */
<template>
  <div class="productOrderDetail_page" :class="!headerShow?'noTitle':''">
    <common-header
        :share-disabled="true"
        :title="'订单详情'"
        :header-show="headerShow"
        :custom-title="'我的订单'"
    ></common-header>
    <div v-if="!loading" style="min-height: 100%">
      <div class="top_banner">
        <div class="order_title">
          <div class="state_img">
            <img
                v-if="productOrderDetail.orderstatus === 0"
                src="../../../assets/images/unpaid.png"
                alt=""
            />
            <img
                v-else-if="productOrderDetail.orderstatus === 3"
                src="../../../assets/images/complete.png"
                alt=""
            />
            <img
                v-else-if="productOrderDetail.orderstatus === 1"
                src="../../../assets/images/unfetchedDrugs.png"
                alt=""
            />
            <img
                v-else-if="productOrderDetail.orderstatus === 4"
                src="../../../assets/images/orderCancel.png"
                alt=""
            />
            <img
                v-else
                src="../../../assets/images/waitingReceive.png"
                alt=""
            />
          </div>
          <div class="state_desc_box">
            <div>
              <p class="order_state">
                {{ orderSate(productOrderDetail.orderstatus) }}
              </p>
              <p
                  class="order_tip"
                  v-if="productOrderDetail.orderstatus == 0 && date"
              >
                {{ date }}后未支付 订单将自动取消
              </p>
              <p class="order_tip" v-if="productOrderDetail.orderstatus == 4">
                订单未付款，自动取消
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="vendingMachine_address address">
        <div
            class="desc"
            @click.stop="checkAddress"
            v-if="productOrderDetail && productOrderDetail.address"
        >
          <p class="address_title">
            <span class="icon_box">
              <img src="../../../assets/images/place.png" alt=""/>
            </span>
            <span class="name">{{
              productOrderDetail && productOrderDetail.username
            }}</span>
            <span class="phone">{{
              productOrderDetail && productOrderDetail.phonenumber
            }}</span>
          </p>
          <p
              class="address_detail"
              :class="[
              {
                withBorderBottom:
                  productOrderDetail.orderstatus === 2 ||
                  productOrderDetail.orderstatus === 3
              }
            ]"
          >
            {{ productOrderDetail && productOrderDetail.address }}
          </p>

          <!--          快递信息-->
          <p class="express_title" v-if="productOrderDetail.expresscompany">
            <span class="icon_box">
              <img src="../../../assets/images/expressIcon.png" alt=""/>
            </span>
            <span class="express_name">
              {{ productOrderDetail && productOrderDetail.expresscompany }}
            </span>
          </p>
          <p class="express_number" v-if="productOrderDetail.trackingnumber">
            {{ productOrderDetail && productOrderDetail.trackingnumber }}
          </p>
        </div>
        <div class="desc" @click.stop="checkAddress" v-else>
          <p class="address_title">
            <span class="icon_box">
              <img src="../../../assets/images/place.png" alt=""/>
            </span>
            <span class="add_address">请添加收货地址</span>
          </p>
        </div>
      </div>

      <ul class="order_list">
        <li>
          <ul class="drugs_list">
            <li
                v-for="(subItem, subIndex) in orderProductInfo"
                :class="[
                { lastLiStyle: subIndex === orderProductInfo.length - 1 }
              ]"
                :key="subIndex"
            >
              <div class="drug_img_box">
                <!--                @click.stop="checkImg(subItem.icon)"-->
                <img :src="subItem.icon | formatProductImg" alt=""/>
              </div>
              <div class="drug_desc">
                <div>
                  <p class="drug_name">{{ subItem.productname }}</p>
                  <p class="drug_specifications">
                    <span> {{ subItem.specification }}</span>
                    <span class="drug_productCount">x{{ subItem.number }}</span>
                  </p>
                </div>
                <div class="price">¥{{ subItem.activityprice | formatPrice }}</div>
              </div>
            </li>
          </ul>
          <div
              class="btn_box"
              v-if="productOrderDetail && productOrderDetail.orderstatus === 0"
          >
            <div class="detail_btn" @click.stop="$throttle(pay)">
              去付款
            </div>
          </div>
          <div
              class="btn_box"
              v-if="productOrderDetail && productOrderDetail.orderstatus === 2"
          >
            <div class="detail_btn" @click.stop="$throttle(confirmReceipt)">
              确认收货
            </div>
          </div>
        </li>

        <li class="productOrderDetail_li">
          <div class="title">
            <div class="icon_box">
              <img src="../../../assets/images/integraOrderBook.png" alt=""/>
            </div>
            <span>订单详情</span>
          </div>
          <div>
            <p>订单编号: {{ productOrderDetail.orderno || "" }}</p>
            <p>下单时间: {{ productOrderDetail.createtime || "" }}</p>
            <p v-if="productOrderDetail.orderstatus  && productOrderDetail.paytime">支付方式: 微信支付</p>
            <p v-if="productOrderDetail.orderstatus && productOrderDetail.paytime">
              支付时间: {{ productOrderDetail.paytime || "" }}
            </p>
          </div>
        </li>

        <li class="drugDetail_li">
          <div class="title">
            <div class="icon_box">
              <img src="../../../assets/images/pharmacyIcon.png" alt=""/>
            </div>
            <span>商品详情</span>
          </div>
          <div
              v-if="
              productOrderDetail.ordermoney
            "
          >
            <p>
              商品总额: ¥{{
              (productOrderDetail.ordermoney -
              productOrderDetail.deliverycosts)
              | formatPrice
              }}
            </p>
            <p v-if="productOrderDetail.ordertype != 1">
              运费: ¥{{ productOrderDetail.deliverycosts | formatPrice }}
            </p>
            <p v-if="productOrderDetail.orderstatus && productOrderDetail.orderstatus != 4">
              实付款: ¥{{productOrderDetail.ordermoney | formatPrice}}
            </p>

          </div>
        </li>
      </ul>
    </div>

    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast, ImagePreview} from "vant";

  export default {
    name: "productOrderDetail",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    data() {
      return {
        productOrderDetail: "",
        orderProductInfo: "",
        loading: false,
        date: "", //倒计时的时间
        countDown: {},//倒计时时间(分钟)
        addressPerson: {}, // 收货地址
        headerShow: !this.$route.query.productOrderId,
        productOrderId: ""
      };
    },
    filters: {
      formatPrice(value) {
        let price = "";
        price = (value / 100).toFixed(2);
        return price;
      },

      formatProductImg(value) {
        let productImg = "";
        try {
          if (value) {
            productImg =
              value.split(",")[0] + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        return productImg;
      },

      formatOrderPayType(value) {
        let payType = "";
        if (value === 3) {
          payType = "微信支付";
        } else if (value === 2) {
          payType = "支付宝支付";
        }
        return payType;
      }
    },
    methods: {
      /**
       * 点击预览图片**/
      checkImg(img) {
        let productImg = "";
        try {
          if (img) {
            productImg = img.split(",")[0] + "?x-oss-process=image/auto-orient,1";
          }
        } catch (e) {
          console.log(e);
        }
        ImagePreview([productImg]);
      },

      /**
       * 订单状态显示
       * **/
      orderSate(orderstatus) {
        let orderState = "";
        switch (orderstatus) {
          case 0:
            orderState = "等待付款";
            break;
          case 1:
            orderState = "等待发货";
            break;
          case 2:
            orderState = "等待收货";
            break;
          case 3:
            orderState = "交易完成";
            break;
          case 4:
            orderState = "交易取消";
            break;
          default:
            orderState = "等待付款";
        }
        return orderState;
      },

      /**
       * 获取订单详情**/
      getProductOrderDetail() {
        this.loading = true;
        this.$http.request({
          method: "get",
          url: "/ZyOrderDetailsController/selectDetailByOrderId",
          body: {
            id: this.productOrderId
          }
        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            this.productOrderDetail = res.data.data.zyOrder || {};
            this.orderProductInfo = res.data.data.zyOrderDetails || [];
            console.log(this.productOrderDetail.createtime);
            //订单倒计时
            if (this.productOrderDetail.orderstatus == 0) {
              let dateInterval = setInterval(() => {

                if (this.productOrderDetail.orderstatus == 4) {
                  clearInterval(dateInterval);
                }
                this.countTime(this.productOrderDetail.createtime, this.countDown * 60);
                //this.countTime("2020-02-20 15:27", 30 * 60)
              }, 1000);
            }
            // 如果未付款,须选择地址才能付款, 取默认地址,付款之后不可更改收货地址
            let selectFrom = localStorage.getItem("productGo");
            if (this.productOrderDetail.orderstatus === 0 && selectFrom || !this.productOrderDetail.ruseraddressid) {
              this.productOrderDetail.ruseraddressid = this.addressPerson.id;
              this.productOrderDetail.phonenumber = this.addressPerson.phone;
              this.productOrderDetail.username = this.addressPerson.name;
              this.productOrderDetail.address =
                this.addressPerson.address + this.addressPerson.pointnum;
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
       * 微信config
       * **/
      wxConfig() {
        return new Promise((resolve, reject) => {
          let _this = this;
          this.$http.request({
            method: "post",
            url: "/wechat/getJsApiSignature",
            body: {
              url: window.location.href.split("#")[0]
            }
          }).then(res => {
            if (res.data.success && res.data.data) {
              let appId = res.data.data.appId || "";
              let timeStamp = res.data.data.timeStamp || "";
              let nonceStr = res.data.data.nonceStr || "";
              let signature = res.data.data.signature || "";
              try {
                this.$wx.config({
                  debug: false, // 开启调试模式
                  appId: appId, // 必填，公众号的唯一标识
                  timestamp: timeStamp, // 必填，生成签名的时间戳
                  nonceStr: nonceStr, // 必填，生成签名的随机串
                  signature: signature, // 必填，签名
                  jsApiList: ["chooseWXPay"]
                });
              } catch (e) {
                console.log(e);
              }
              resolve(res.data.data);
            }
          }).catch(e => {
            console.log(e);
            reject(e);
          });
        });
      },

      /**
       * 确认收货
       * **/
      confirmReceipt() {
        this.$dialog.confirm({
          message: "是否确认收货?",
          confirmButtonText: "确认"
        }).then(() => {
          this.$http.request({
            url: "/ZyOrderDetailsController/confirm",
            method: "get",
            body: {
              id: this.productOrderId
            }
          }).then(res => {
            if (res.data.success) {
              this.getProductOrderDetail();
            } else {
              console.log("确认收货接口报错");
            }
          })
            .catch(e => {
              console.log(e);
            });
        }).catch(() => {
          return false;
        });
      },

      /**
       * wx支付
       * **/
      pay() {
        if (!this.productOrderDetail.ruseraddressid) {
          Toast({
            message: "请先添加收货地址",
            position: "bottom"
          });
          return false;
        }
        let ToastRequest = Toast.loading({
          duration: 0,
          mask: true,
          message: "加载中..."
        });
        this.$http.request({
          method: "post",
          url: "/ZyOrderController/wechatPayOrder",
          body: {
            orderId: this.productOrderId,
            addressId: this.productOrderDetail.ruseraddressid
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          ToastRequest.clear();
          if (res.data.success) {
            let _this = this;
            let data = res.data;
            this.$wx.ready(() => {
              this.$wx.chooseWXPay({
                appId: data.data.appId,
                timestamp: data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.data.paySign, // 支付签名
                success: function (res) {
                  // 新增支付中页面
                  // _this.getProductOrderDetail();
                  _this.$router.push({
                    name:'payProgress',
                    query:{
                      orderType:0,
                      orderId:_this.productOrderId,
                    }
                  })
                },
                fail: function (e) {
                  console.log("pay fail");
                }
              });
            });
          } else {
            Toast({
              message: res.data.message || "操作失败",
              position: "bottom"
            });
            return false;
          }
        }).catch(e => {
          ToastRequest.clear();
          console.log(e);
        });
      },

      /**
       * 地址处理
       * **/
      addressInit() {
        let addressData = this.$store.state.Address.addressData;
        if (addressData.id) {
          this.addressPerson = addressData;
          this.getProductOrderDetail();
        } else {
          this.getUserAddress();
        }
      },

      /**
       * 当vuex被清除,再次查询是否有地址,选择第一个作为地址
       * **/
      getUserAddress() {
        this.$http
          .request({
            method: "get",
            url: "/RUserAddressController/getListRUserAddress",
            body: {}
          })
          .then(res => {
            if (res.data.success) {
              if (res.data.data.length > 0) {
                if (res.data.data[0].status === 0) {
                  this.addressPerson = res.data.data[0] || {};
                  this.$store.commit("Address/addressData", this.addressPerson);
                }
              }
              this.getProductOrderDetail();
            } else {
              console.log("地址查询接口报错");
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      /**
       * 未付款的情况下可以切换地址
       * **/
      checkAddress() {
        if (this.productOrderDetail.orderstatus !== 0) {
          return false;
        } else {
          this.$router.push({
            name: "integralAddressSelect",
            query: {}
          });
        }
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
      },
      /**
       * 获取订单倒计时时间
       * **/
      getCountDown() {
        let vm = this;
        console.log("vm.productOrderId", vm.productOrderId);
        return new Promise((resolve, reject) => {
          this.$http
            .request({
              method: "get",
              url: "/ZyOrderController/selectOrderCancleTime",
              body: {
                orderId: vm.productOrderId
              }
            })
            .then(res => {
              if (res.data.success) {
                vm.countDown = res.data.data;
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
      }
    },
    watch: {
      date(val) {
        if (val == "00秒") {
          this.productOrderDetail.orderstatus = 4;
        }
      }
    },

    created() {
      let wxCofigPromise = null;
      let getCountDownPromise = null;
      this.productOrderId = this.$route.query.productOrderId || "";
      wxCofigPromise = this.wxConfig();
      getCountDownPromise = this.getCountDown();
      Promise.all([wxCofigPromise, getCountDownPromise]).then(() => {
        this.addressInit();
      });
    },
    beforeDestroy() {
      localStorage.removeItem("productGo");
    }
  };
</script>

<style scoped lang="less">
  .productOrderDetail_page {
    .padding(44, 0, 0, 0);
    background: rgba(242, 242, 242, 1);
    min-height: 100%;

    .code_li {
      position: relative;
      top: -40 / 375 * 100vw;
      box-sizing: border-box;
      .padding(39, 66, 0, 66);
      .margin(0, 12, 0, 12);
      .height(190);
      background: url("../../../assets/images/code.png") no-repeat center;
      background-size: cover;
      .borderRadius(0, 0, 10, 10);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;

      .code_title {
        .fontSize(16);
        .lineHeight(22);
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        .padding(0, 0, 15, 0);
      }

      .title {
        .padding(0, 0, 12, 0);
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        li:nth-child(4) {
          .margin(0, 0, 20, 0);
        }

        li:nth-child(8) {
          .margin(0, 0, 20, 0);
        }

        li {
          .margin(0, 20, 20, 0);
          .width(32);
          .height(32);
          .lineHeight(32);
          text-align: center;
          color: @mainColor;
          .fontSize(18);
          font-weight: bold;
          .borderRadius(4, 4, 4, 4);
          background: rgba(255, 255, 255, 1);
          border: 2px solid rgba(255, 255, 255, 1);
        }
      }
    }

    .title {
      display: flex;
      align-items: center;
    }

    .icon_box {
      display: inline-block;
      .width(20);
      .height(20);

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .top_banner {
      box-sizing: border-box;
      width: 100%;
      .height(140);
      .padding(0, 12, 0, 12);
      background: url("../../../assets/images/orderDetailBanner.png") no-repeat center;
      background-size: cover;

      .order_title {
        display: flex;
        box-sizing: border-box;
        .padding(12, 12, 12, 12);

        .state_img {
          .width(78);
          .height(78);

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .state_desc_box {
          .margin(0, 0, 0, 6);
          flex: 1;
          display: flex;
          align-items: center;

          p {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .state_desc {
            .lineHeight(20);
            .fontSize(14);
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }

          .order_state {
            .lineHeight(22);
            .fontSize(16);
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            .padding(0, 0, 8, 0);
          }

          .order_tip {
            .fontSize(14);
            font-weight: 400;
            .lineHeight(14);
            color: #fff;
            .padding(7, 0, 0, 0);
          }
        }
      }
    }

    .vendingMachine_address {
      position: relative;
      top: -40 / 375 * 100vw;
      .margin(0, 12, 0, 12);
      /*<!--.height(106);-->*/
      .borderRadius(10, 10, 10, 10);
      background: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .padding(12, 12, 12, 12);

      .desc {
        flex: 1;

        .add_address {
          font-weight: bolder;
        }

        .address_title {
          display: flex;
          align-items: center;
          .fontSize(16);
          .lineHeight(20);
          .margin(0, 0, 9, 0);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);

          .icon_box {
            display: inline-block;
            .width(20);
            .height(20);
            .margin(0, 10, 0, 0);

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          .name,
          .phone {
            .fontSize(16);
            .lineHeight(20);
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }

          .name {
            .margin(0, 10, 0, 0);
          }
        }

        .express_title {
          display: flex;
          align-items: center;
          .padding(10, 0, 0, 0);

          .icon_box {
            .margin(0, 10, 0, 0);
          }

          .express_name {
            .fontSize(16);
            .lineHeight(16);
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
          }
        }

        .express_number {
          .fontSize(16);
          .lineHeight(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          .padding(11, 0, 0, 30);
        }

        .address_detail {
          .padding(0, 0, 10, 30);
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          /*overflow: hidden;*/
          /*text-overflow: ellipsis;*/
          /*display: -webkit-box;*/
          /*-webkit-line-clamp: 2;*/
          /*-webkit-box-orient: vertical;*/
        }

        .withBorderBottom.address_detail {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
      }
    }

    .order_list {
      box-sizing: border-box;
      .padding(0, 12, 12, 12);
      .margin(-28, 0, 0, 0);

      li {
        background: rgba(255, 255, 255, 1);
        .borderRadius(10, 10, 10, 10);
        .padding(12, 12, 12, 12);
        .margin(0, 0, 12, 0);
      }

      .productOrderDetail_li,
      .drugDetail_li {
        p {
          .fontSize(16);
          .lineHeight(20);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          .margin(12, 0, 12, 0);
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .title {
        .fontSize(16);
        .lineHeight(20);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);

        span {
          .margin(0, 0, 0, 9);
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
      }

      .drugs_list {
        .lastLiStyle {
          border-bottom: none;
          .margin(0, 0, 0, 0);
        }

        li {
          .padding(12, 0, 12, 0);
          .borderRadius(0, 0, 0, 0);
          border-bottom: 1px solid #f2f2f2;
          display: flex;

          .drug_img_box {
            .width(78);
            .height(78);
            background: rgba(246, 246, 246, 1);
            .borderRadius(10, 10, 10, 10);
            overflow: hidden;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          .drug_desc {
            box-sizing: border-box;
            .margin(0, 0, 0, 12);
            flex: 1;
            width: 0;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            justify-content: space-between;
            flex-direction: column;

            .drug_number {
              .lineHeight(21);
              .fontSize(17);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
            }

            .drug_specifications {
              display: flex;
              align-items: center;
              justify-content: space-between;

              span {
                .fontSize(14);
                .lineHeight(18);
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }

              .drug_productCount {
                .fontSize(16);
                .lineHeight(20);
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
            }

            .drug_name {
              .fontSize(16);
              .lineHeight(20);
              .padding(0, 0, 8, 0);
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }

            p {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }

          .price {
            display: flex;
            align-items: center;
            .fontSize(16);
            .lineHeight(20);
            font-weight: 400;
            color: rgba(255, 0, 0, 1);
          }
        }
      }

      .btn_box {
        display: flex;
        justify-content: flex-end;

        .detail_btn {
          .width(115);
          .height(31);
          .lineHeight(31);
          text-align: center;
          color: #fff;
          .borderRadius(10, 10, 10, 10);
          background: linear-gradient(225deg,
          rgba(1, 128, 255, 1) 0%,
          rgba(0, 105, 255, 1) 100%);
        }
      }
    }
  }

  .noTitle {
    .padding(0, 0, 0, 0);
  }
</style>
