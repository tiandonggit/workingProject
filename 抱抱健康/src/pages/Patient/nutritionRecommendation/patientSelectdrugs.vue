/**
* @Description: 患者主动购买自营产品
* @Author: 侯湃
* @Date: 2020/7/14
*/
<template>
  <div id="patientSelectDrugs">
    <common-header
        :share-disabled="true"
        :custom-title="'推荐产品'"
        :header-show="true"
        title="产品推荐"></common-header>
    <div class="container">
      <div class="block-item"
           v-for="(item, index) in dataList"
           :key="index">
        <div class="top-info">
          <div class="img-box">
            <img :src="item.icon" alt/>
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
              @change="change()"/>
        </div>
      </div>
    </div>

    <div class="footer-box">
      <van-button
          slot="button"
          class="next-btn"
          :class="{isDisabled: isDisabled}"
          size="large"
          @click="confirm">
        确认产品
      </van-button>
    </div>
  </div>
</template>

<script>

  import {Toast, Dialog, Stepper} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "patientSelectdrugs",
    data() {
      return {
        dataList: [],
        isDisabled: true // 底部按钮是否禁用状态
      };
    },
    components: {
      commonHeader
    },
    computed: {},
    created() {
      this.getData();
    },
    methods: {
      /**
       * 获取自营产品列表
       * **/
      getData() {
        this.$http.request({
          method: "get",
          url: "ZyProductController/selectProduct",
          body: {}
        }).then(res => {
          if (res.data.success) {
            let dataList = res.data.data || [];
            dataList.forEach((item) => {
              item.number = 0;
            });
            this.dataList = dataList;
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(error => {
          console.log(error);
        });
      },
      /**
       * 药品数量发生变化
       * **/
      change() {
        let falseNum = 0;
        this.dataList.forEach(v => {
          if (v.number > 0) {
            this.isDisabled = false;
            return false;
          } else {
            falseNum++;
          }
        });
        if (falseNum === this.dataList.length) {
          this.isDisabled = true;
        }
      },
      /**
       * 提交已选
       * **/
      confirm() {
        window.localStorage.setItem(
          "patientDrugsList",
          JSON.stringify(this.dataList)
        );
        this.$router.push({
          name: "patientDrugsList"
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  #patientSelectDrugs {
    .padding(44, 12, 80, 12);

    .container {
      .block-item {
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
        .padding(15, 10, 0, 10);
        background: @backgroundColorT;
        .margin(0, 0, 15, 0);

        .top-info {
          display: flex;

          .img-box {
            .width(78);
            .height(78);
            background: @backgroundColorImg;
            .borderRadius(10, 10, 10, 10);
            overflow: hidden;
            .margin(0, 10, 0, 0);
            position: relative;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }

            .inventory {
              position: absolute;
              right: 0;
              left: 0;
              bottom: 0;
              .height(20);
              background: rgba(0, 0, 0, 0.3);
              display: flex;
              justify-content: center;
              align-items: center;

              span {
                .fontSize(12);
                font-weight: 400;
                color: @fontOne;
                .lineHeight(14);
              }
            }
          }

          .right-info {
            flex: 1;
            width: 0;

            p {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .name {
              .fontSize(16);
              font-weight: bold;
              color: @titleColor;
              .lineHeight(18);
            }

            .specification {
              .margin(13, 0, 13, 0);
              .fontSize(16);
              font-weight: 400;
              color: @subtitleColor;
              .lineHeight(18);
            }

            .manufacturer {
              .fontSize(14);
              font-weight: 400;
              color: @descriptionColor;
              .lineHeight(16);
            }

            .price-box {
              .margin(13, 0, 14, 0);

              .activity {
                .fontSize(16);
                font-weight: bold;
                color: @orderPriceColor;
                .lineHeight(18);
                .margin(0, 10, 0, 0);
              }

              .price {
                .fontSize(12);
                font-weight: 400;
                color: @descriptionColor;
                .lineHeight(14);
                text-decoration: line-through;
              }

              .num {
                .fontSize(16);
                font-weight: bold;
                color: @titleColor;
                .lineHeight(19);
                float: right;
              }
            }
          }
        }

        .bottom-num {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          .height(45);
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            .fontSize(16);
            font-weight: 400;
            color: @titleColor;
            .lineHeight(18);
          }

          /deep/ .van-stepper {
            .van-stepper__minus,
            .van-stepper__plus {
              .width(28);
              .height(18);
              background: @backgroundColorImg;
              .borderRadius(9, 9, 9, 9);
            }

            .van-stepper__input {
              background-color: @backgroundColorT;
              .fontSize(16);
            }
          }
        }
      }
    }

    .footer-box .next-btn.isDisabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.6;
      background: @gengqianSpan;
    }
  }
</style>
