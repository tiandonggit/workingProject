<template>
  <div class="payCancel_page">
    <common-header
        :share-disabled="true"
        :title="'取消支付'"
        :header-show="true"
        :custom-title="'营养方案'"></common-header>
    <div class="tip_box">
      <img src="../../../assets/images/testinglog.png" alt="">
      <p>支付遇到问题? 您可以使用一下帮助</p>
      <a href="tel:4000909975">联系客服</a>
    </div>

    <ul class="address_box">
      <h4 class="address_box_title">
        我要货到付款
      </h4>
      <div class="content_div"></div>
      <li class="contacts">
        <span>联系人</span>
        <van-field v-model="orderParams.contacts" maxlength="5" placeholder="请输入联系人姓名"/>
      </li>
      <li class="phone">
        <span>电话号码</span>
        <van-field v-model="orderParams.phone"
                   maxlength="11"
                   type="number"
                   placeholder="请输入电话号码"/>
      </li>
      <li class="address" @click.stop="checkAddress">
        <span>所在地址</span>
        <em v-if="!orderParams.address"
            class="withOutAddress_span">
          请选择收货地址
        </em>
        <em v-else>{{orderParams.address}}</em>
        <van-icon name="arrow"/>
      </li>
      <li class="address_detail">
        <span>详细地址</span>
        <van-field v-model="orderParams.address_detail"
                   maxlength="20"
                   autosize
                   rows="1"
                   type="textarea"
                   placeholder="街道、小区、楼牌号等"/>
      </li>
      <li class="submit_btn">
        <div class="btn" @click.stop="submitHandle">
          确认提交
        </div>
      </li>
    </ul>

    <select-address
        v-model="show"
        :title="'所在地址'"
        :data="addressData"
        @gitAddress="gitAddress"
    ></select-address>

  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import selectAddress from "../../../components/selectAddress/select_address";
  import areaList from "../../../assets/js/cs";
  import {mapState} from "vuex";
  import {Toast} from "vant";

  export default {
    name: "payCancel",
    components: {
      commonHeader,
      selectAddress
    },
    computed: {
      ...mapState(["order"])
    },
    data() {
      return {
        orderParams: {
          contacts: "",
          phone: "",
          address: "",
          address_detail: ""
        },
        show: false,
        onLineOrderId:''
      };
    },
    methods: {
      /**
       * 选择收货地址
       * **/
      checkAddress() {
        this.show = true;
      },
      /**
       * 存储地址
       * **/
      gitAddress(e) {
        this.orderParams.address = e;
      },

      /**
       * 存储线下收货地址信息
       * **/
      submitHandle() {
        if (!this.orderParams.contacts) {
          Toast("请输入联系人姓名");
          return false;
        }
        if (!this.orderParams.phone) {
          Toast("请输入联系人电话号码");
          return false;
        }

        if (!this.TestPhone(this.orderParams.phone)) {
          Toast({
            message: "请输入格式正确的手机号",
          });
          return false;
        }

        if (!this.orderParams.address) {
          Toast("请选择收货地区");
          return false;
        }
        if (!this.orderParams.address_detail) {
          Toast("请输入详细的收货地址");
          return false;
        }
        this.$store.commit("order/saveOrderParams", this.orderParams);
        this.$router.push({
          name: "submitOfflineOrder",
          query: {
            onLineOrderId:this.onLineOrderId
          }
        });
      }
    },
    created() {
      this.addressData = areaList.data;
      this.orderParams = this.order.orderParams;
      this.onLineOrderId = this.$route.query.onLineOrderId;
    }
  };
</script>

<style scoped lang="less">
  .payCancel_page {
    .padding(56, 12, 12, 12);

    /deep/ .van-cell.van-field {
      flex: 1;
    }

    /deep/ .van-field__control {
      .fontSize(16);
    }

    .address_box {
      .address_detail {
        align-items: start;

        /deep/ .van-field__control {
          /*height: 24px !important;*/
        }
      }
    }


    .tip_box {
      display: flex;
      align-items: center;
      flex-direction: column;
      .padding(60, 0, 50, 0);

      img {
        display: block;
        .width(60);
        .height(60);
        .margin(0, 0, 27, 0);
      }

      p {
        .fontSize(16);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .margin(0, 0, 17, 0);
      }

      a {
        display: inline-flex;
        color: #fff;
        .borderRadius(10, 10, 10, 10);
        width: 100%;
        .height(44);
        justify-content: center;
        align-items: center;
        background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
      }
    }

    .address_box {
      .padding(15, 0, 0, 0);
      overflow: hidden;
      background-color: @backgroundColorff;
      .borderRadius(10, 10, 10, 10);

      .address_box_title {
        text-align: center;
        background: url("../../../assets/images/offLinePay.png") no-repeat center;
        background-size: contain;
        .fontSize(16);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      .content_div {
        .height(15);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .submit_btn {
        .padding(14, 0, 14, 0);
        justify-content: center;
      }

      .address {
        /deep/ .van-icon {
          color: rgba(51, 51, 51, 1);
          .fontSize(22);
        }

        em.withOutAddress_span {
          color: #969799;
        }

        em {
          .padding(0, 0, 0, 16);
          .lineHeight(26);
          flex: 1;
          color: #323233;
          width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      li {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        min-height: 44 /375 * 100vw;
        .padding(0, 10, 0, 10);
        span {
          .padding(10, 0, 10, 0);
          .lineHeight(24);
          .width(68);
          .fontSize(16);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .btn {
          display: flex;
          justify-content: center;
          align-items: center;
          .width(299);
          .height(44);
          background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
          .borderRadius(10, 10, 10, 10);
          color: @fontColorff;
          font-weight: bold;
        }
      }
    }
  }
</style>
