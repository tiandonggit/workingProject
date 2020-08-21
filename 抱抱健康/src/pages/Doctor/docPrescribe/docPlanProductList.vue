/*
 * @Author: 田东 
 * @Date: 2020-07-21 13:44:56 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-27 16:25:24
 * @name 营养推荐——方案产品列表
 */
<template>
  <div class="docPlanProductList">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="prsem">
      <div class="add-product">
        <van-button @click.stop="addProduct(true)" class="v-nextBottom" type="warning">
          <span>+其他全营养产品</span>
        </van-button>
      </div>
      <div
        class="prsemb"
        v-if="DoctorIM.planProductList.goods.length > 0 && DoctorIM.planProductList.goods[0].isFull == 1"
      >
        <div>
          <div class="prselist">
            <div
              class="prsepic"
              @click.stop="productDetails(DoctorIM.planProductList.goods[0].specificationId, DoctorIM.planProductList.goods[0].jiage)"
            >
              <img :src="DoctorIM.planProductList.goods[0].topImg" />
            </div>
            <div class="prselistr">
              <div
                class="prselistrt"
                @click.stop="productDetails(DoctorIM.planProductList.goods[0].specificationId, DoctorIM.planProductList.goods[0].jiage)"
              >{{ DoctorIM.planProductList.goods[0].productName }}</div>
              <div
                class="product-store"
              >{{DoctorIM.planProductList.goods[0].proteinRatio}}%蛋：{{DoctorIM.planProductList.goods[0].carbonRatio}}%碳：{{DoctorIM.planProductList.goods[0].fatRatio}}%脂</div>
              <div
                class="product-store"
              >{{DoctorIM.planProductList.goods[0].protein}}g蛋：{{DoctorIM.planProductList.goods[0].carbon}}g碳：{{DoctorIM.planProductList.goods[0].fat}}g脂</div>
              <div class="prselistrm">
                <span>{{!DoctorIM.planProductList.goods[0].kcal ? "未知" : DoctorIM.planProductList.goods[0].kcal + "kcal"}}</span>
                {{ DoctorIM.planProductList.goods[0].specificationName }}
              </div>
              <div class="prselistrb">
                <div
                  class="prselistrs pr-price"
                >¥{{ (DoctorIM.planProductList.goods[0].jiage / 100).toFixed(2) }}</div>
                <div>
                  <van-stepper
                    v-model="DoctorIM.planProductList.goods[0].quantity"
                    min="1"
                    max="99"
                    integer
                    @change="onChange(DoctorIM.planProductList.goods[0].quantity, 0)"
                    @overlimit="onOverlimit(DoctorIM.planProductList.goods[0].quantity, 0)"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="use-method">
            <p class="title">使用方法设置：</p>
            <div class="use-setting">
              <div>
                每日
                <input v-model="DoctorIM.planProductList.goods[0].dailydose" type="number" />
                袋
              </div>
              <div>
                服用
                <input v-model="DoctorIM.planProductList.goods[0].takingtime" type="number" />
                天
              </div>
            </div>
          </div>-->
        </div>
      </div>
      <div class="add-component-product">
        <van-button @click.stop="addProduct()" class="v-nextBottom">
          <span>+添加组件产品</span>
        </van-button>
      </div>
      <div class="prsemb">
        <div v-for="(i, index) in DoctorIM.planProductList.goods" :key="index" v-if="i.isFull == 0">
          <div class="prselist">
            <div class="prsepic" @click.stop="productDetails(i.specificationId, i.jiage)">
              <img :src="i.topImg" />
            </div>
            <div class="prselistr">
              <div
                class="prselistrt"
                @click.stop="productDetails(i.specificationId, i.jiage)"
              >{{ i.productName }}</div>
              <div class="product-store">{{i.proteinRatio}}%蛋：{{i.carbonRatio}}%碳：{{i.fatRatio}}%脂</div>
              <div class="product-store">{{i.protein}}g蛋：{{i.carbon}}g碳：{{i.fat}}g脂</div>
              <div class="prselistrm">
                <span>{{ !i.kcal ? "未知" : i.kcal + "kcal" }}</span>
                {{ i.specificationName }}
              </div>
              <div class="prselistrb">
                <div class="prselistrs pr-price">¥{{ (i.jiage / 100).toFixed(2) }}</div>
                <div>
                  <!-- :max="i.productStore"-->
                  <van-stepper
                    v-model="i.quantity"
                    min="1"
                    max="99"
                    integer
                    @change="onChange(i.quantity, index)"
                    @overlimit="onOverlimit(i.quantity, index)"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="use-method">
            <p class="title">使用方法设置：</p>
            <div class="use-setting">
              <div>
                每日
                <input v-model="i.dailydose" type="number" />
                袋
              </div>
              <div>
                服用
                <input v-model="i.takingtime" type="number" />
                天
              </div>
            </div>
          </div>-->
        </div>
        <div class="total-nutrition">
          <p>
            当前肠内营养：
            <span>{{ gettotalProteinComponent }}g蛋白质/{{ gettotalCarbonComponent }}g碳水化合物/{{ gettotalFatComponent }}g脂肪</span>
          </p>
          <p>
            当前膳食营养：
            <span>{{ gettotalProteinAllNutrition }}g蛋白质/{{ gettotalCarbonAllNutrition }}g碳水化合物/{{ gettotalFatAllNutrition }}g脂肪</span>
          </p>
        </div>
        <div class="total-price">
          合计金额：
          <span>¥{{ (gettotalPrice / 100).toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="save-plan" v-if="type || type == 0">
      <van-checkbox v-model="checked" @change="selectPlanDoc()" v-if="type == 1">提交时按当前方案进行更新保存</van-checkbox>
      <van-checkbox v-model="checked" @change="selectPlan()" v-if="type == 0">同时将当前方案保存到“我的经验默认方案”中</van-checkbox>
    </div>-->
    <div class="prseempty"></div>
    <div class="prseb">
      <div class="prsebl">
        <div>
          已选(
          <span>{{ gettotal }}</span>)
          <div class="total-kcal">{{ gettotalKcal }}kcal</div>
        </div>
        <!-- <div class="total-kcal">{{ gettotalKcal }}kcal</div> -->
      </div>
      <div class="prsebr">
        <van-button @click="submitHandle">{{ sure }}</van-button>
      </div>
    </div>
    <commonInsertOrUpdate
      v-model="isShowEditDialog"
      @confirm="confirm"
      @cancel="cancel"
      :status="1"
    ></commonInsertOrUpdate>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import pic from "../../../assets/images/vendingMachine1.png";
import commonInsertOrUpdate from "@/components/commonInsertOrUpdate/commonInsertOrUpdate.vue";
import { mapState } from "vuex";
import { Toast, Dialog } from "vant";

export default {
  name: "docPlanProductList",
  components: { commonHeader, commonInsertOrUpdate },
  data() {
    return {
      title: "",
      customTitle: "营养方案",
      activeNames: ["0"],
      num: 1,
      searchData: "",
      id: "",
      planId: "",
      data: {},
      list: [],
      cabinetNum: "",
      deviceId: "",
      topInfo: "",
      url: "",
      checked: false,
      sure: "确认提交",
      planObj: {
        name: "",
        text: "",
      },
      //1.9新增修改功能,为减少修改规模,新增以下字段进行新功能实现
      goods: [], //产品列表
      //1.9新增结束
      isShowEditDialog: false, // 是否显示 请为该方案设置名称与备注信息 弹窗
    };
  },
  created() {
    this.type = this.DoctorIM.planProductList.planType; //0系统推荐套餐 1医生经验套餐
    this.planId = this.DoctorIM.planProductList.planId || "";
    this.title = this.type == 0 ? "系统推荐套餐方案" : "我的经验套餐方案";
    this.url =
      this.type == 0
        ? "/RNutritionPrescriptionGoodsController/selectSystemKey"
        : "/NNutritionPrescribeSchemeDoctorGoodsController/selectDoctorKey";
    if (this.DoctorIM.planProductList.goods.length <= 0) {
      this.getData();
    }
  },
  computed: {
    ...mapState(["DoctorIM"]),
    gettotal() {
      let total = 0;
      // total = this.list.length;
      for (let i = 0; i < this.DoctorIM.planProductList.goods.length; i++) {
        total += parseInt(this.DoctorIM.planProductList.goods[i].quantity);
      }
      return total;
    },
    gettotalKcal() {
      let totalKcal = 0;
      // total = this.list.length;
      for (let i = 0; i < this.DoctorIM.planProductList.goods.length; i++) {
        totalKcal +=
          this.DoctorIM.planProductList.goods[i].quantity *
          this.DoctorIM.planProductList.goods[i].kcal;
      }
      return totalKcal;
    },
    gettotalPrice() {
      let totalPrice = 0;
      for (let i = 0; i < this.DoctorIM.planProductList.goods.length; i++) {
        totalPrice +=
          this.DoctorIM.planProductList.goods[i].quantity *
          this.DoctorIM.planProductList.goods[i].jiage;
      }
      return totalPrice;
    },
    gettotalProteinComponent() {
      let totalProteinComponent = 0;
      this.DoctorIM.planProductList.goods.forEach((V) => {
        if (V.isFull == 0) {
          totalProteinComponent += V.quantity * V.protein;
        }
      });

      return totalProteinComponent;
    },
    gettotalProteinAllNutrition() {
      let totalProteinComponent = 0;
      this.DoctorIM.planProductList.goods.forEach((V) => {
        if (V.isFull == 1) {
          totalProteinComponent += V.quantity * V.protein;
        }
      });

      return totalProteinComponent;
    },
    gettotalCarbonComponent() {
      let totalCarbonComponent = 0;
      this.DoctorIM.planProductList.goods.forEach((V) => {
        if (V.isFull == 0) {
          totalCarbonComponent += V.quantity * V.carbon;
        }
      });

      return totalCarbonComponent;
    },
    gettotalCarbonAllNutrition() {
      let totalCarbonAllNutrition = 0;
      this.DoctorIM.planProductList.goods.forEach((V) => {
        if (V.isFull == 1) {
          totalCarbonAllNutrition += V.quantity * V.carbon;
        }
      });

      return totalCarbonAllNutrition;
    },
    gettotalFatComponent() {
      let totalFatComponent = 0;
      this.DoctorIM.planProductList.goods.forEach((V) => {
        if (V.isFull == 0) {
          totalFatComponent += V.quantity * V.fat;
        }
      });
      return totalFatComponent;
    },
    gettotalFatAllNutrition() {
      let totalFatAllNutrition = 0;
      this.DoctorIM.planProductList.goods.forEach((V) => {
        if (V.isFull == 1) {
          totalFatAllNutrition += V.quantity * V.fat;
        }
      });

      return totalFatAllNutrition;
    },
  },
  methods: {
    goNext() {
      //跳转到下一页
      this.$router.push({
        path: "/details",
        query: {},
      });
    },
    getData() {
      this.$http
        .request({
          method: "get",
          url: this.url,
          body: {
            id: this.planId,
            deviceId: this.DoctorIM.planProductList.deviceId
          },
        })
        .then((res) => {
          let data = res.data;
          if (data.success) {
            let planProductListVuex = JSON.parse(
              JSON.stringify(this.DoctorIM.planProductList)
            );
            planProductListVuex.goods = data.data.goods;
            this.$store.commit(
              "DoctorIM/savePlanProductList",
              planProductListVuex
            );
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    // 新增营养成品
    addProduct(type) {
      this.$router.push({
        name: "productsListSearchAdd",
        query: { isAllNutrition: type },
      });
    },
    productDetails(id, price) {
      this.$router.push({
        name: "productDetails",
        query: { specId: id, price: price },
      });
    },
    // 修改产品数量
    onChange(quantity, index) {
      if (quantity > 0) return false;
    },
    onOverlimit(quantity, index) {
      Dialog.confirm({
        title: "提示",
        message: "是否删除该产品？",
      })
        .then(() => {
          this.DoctorIM.planProductList.goods.splice(index, 1);
        })
        .catch(() => {});
    },
    // 是否 保存到“我的经验默认方案”中
    selectPlan() {
      // if (this.checked) {
      //   this.isShowEditDialog = true;
      // } else {
      //   this.planObj = {
      //     name: "",
      //     text: ""
      //   };
      // }
    },
    // 医生经验套餐方案 是否 保存
    selectPlanDoc() {
      // this.checked &&
      // Dialog.confirm({
      //   title: "提示",
      //   message: "是否确认对当前方案进行更新保存？"
      // })
      //   .then(() => {
      //   })
      //   .catch(() => {
      //     this.checked = false;
      //   });
    },
    // 确认 保存到“我的经验默认方案”中
    confirm(val) {
      this.planObj.name = val.name;
      this.planObj.text = val.synopsis;
      if (this.planObj.name) {
        this.submit();
      }
    },
    // 取消 保存到“我的经验默认方案”中
    cancel(val) {
      this.isShowEditDialog = false;
      this.checked = false;
    },
    submitHandle() {
      Dialog.confirm({
        title: "是否确认提交？",
        message: "提交后生成订单进行支付",
      })
        .then(() => {
          this.submit();
        })
        .catch(() => {});
    },
    submit() {
      if (this.gettotal == "0") {
        Toast("请选择产品后再进行提交");
        return;
      }
      let parData = [];
      this.DoctorIM.planProductList.goods.forEach((v, e) => {
        if (v.quantity !== 0) {
          parData.push({
            specificationId: v.specificationId,
            goodsId: v.goodsId,
            productCount: v.quantity,
            productPrice: v.jiage,
          });
        }
      });

      // let type = 0;
      // if (this.type == 0) {
      //   type = this.checked ? 1 : 0;
      // } else if (this.type == 1) {
      //   type = this.checked ? 2 : 0;
      // }

      this.$http
        .request({
          method: "post",
          url: "/PayRecommendController/imDocRecommendOrder",
          body: {
            commitProductInfo: JSON.stringify(parData),
            orderTotalPrice: this.gettotalPrice,
            deviceId: this.DoctorIM.planProductList.deviceId,
            deviceName: this.DoctorIM.planProductList.deviceName,
            deviceCode: this.DoctorIM.planProductList.deviceCode,
            orderProductNum: this.gettotal,
            patiId: this.DoctorIM.planProductList.patientId,
          },
        })
        .then((res) => {
          let data = res.data;
          if (data.success) {
            window.localStorage.removeItem("docProductList");
            this.$router.push({ name: "docChatIMDetail" });
            this.$store.commit("DoctorIM/savePlanProductList", {});
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
  },
};
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}

.docPlanProductList {
  width: 100%;
  padding-bottom: 0;
  .fontSize(16);
  .padding(44, 0, 0, 0);

  /deep/ .van-checkbox {
    height: auto !important;
  }

  .add-product,
  .add-component-product {
    .padding(15, 15, 15, 15);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .v-nextBottom {
      .borderRadius(10, 10, 10, 10);
      background: linear-gradient(
        52deg,
        @startColor 0%,
        @endColor 100%
      ) !important;
      border: 1px solid @mainColor;
      width: 100%;
      .height(34);
      .lineHeight(31);
    }
  }

  .add-component-product {
    /deep/ .van-button {
      background: linear-gradient(
        270deg,
        rgba(255, 122, 51, 1) 0%,
        rgba(255, 139, 78, 1) 100%
      ) !important;
      border: 1px solid rgba(255, 122, 51, 1);

      span {
        color: @fontColorff;
      }
    }
  }

  .save-plan {
    background: #fff;
    .borderRadius(10, 10, 10, 10);
    .width(351);
    margin: 4vw auto 0;
    .padding(13, 10, 13, 10);

    /deep/ .van-checkbox {
      margin: 0;

      .van-icon {
        .width(20);
        .height(20);
      }

      .van-checkbox__label {
        .fontSize(16);
        font-weight: 400;
        color: @fontColor33;
        .lineHeight(20);
      }
    }
  }
}

.prseempty {
  width: 100%;
  .height(75);
  // background-color: #f2f2f2;
}

.prsebr {
  .width(263);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .van-button {
    .margin(0, 0, 0, 70);
    // width: 70%;
    // height: 90%;
    border-radius: 0;
    color: @fontColorff;
    .fontSize(18);
    font-weight: bold;
    .width(165);
    .height(44);
    background: linear-gradient(
      225deg,
      rgba(1, 128, 255, 1) 0%,
      rgba(0, 105, 255, 1) 100%
    );
    .borderRadius(10, 10, 10, 10);
  }
}

.prsebl {
  .width(112);
  height: 100%;
  background-color: @fontColorff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  color: @fontColor66;
  .fontSize(18);

  span {
    color: @mainColor;
  }

  .total-kcal {
    .fontSize(12);
    width: 100%;
    text-align: center;
    .margin(5, 0, 0, 0);
  }
}

.prseb {
  width: 100%;
  .height(60);
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  z-index: 11;
}

.prselistrb {
  width: 100%;
  .height(18);
  .fontSize(14);
  color: @fontColor66;
  .lineHeight(18);
  display: flex;
  justify-content: space-between;

  /deep/ .van-stepper {
    .width(93);
    .height(18);
    margin-top: 1px;

    .van-stepper__minus,
    .van-stepper__plus {
      .width(28);
      .height(18);
      background: rgba(246, 246, 246, 1);
      border: 0;
      .borderRadius(10, 10, 10, 10);
    }

    .van-stepper__minus::before,
    .van-stepper__plus::before {
      .width(10);
    }

    .van-stepper__minus--disabled {
      color: #323232;
    }

    .van-stepper__input {
      .height(18);
      width: 8.533vw;
      font-size: 3.733vw;
      margin: 0 0.533vw;
      background-color: @fontColorff;
    }
  }

  .pr-price {
    color: @fontColorFF3;
  }
}

.prselistrm {
  width: 100%;
  // height: 20px;
  /*margin-top: 5px;*/
  .fontSize(12);
  color: @fontColor66;
  .lineHeight(14);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;

  span {
    .width(73);
    display: inline-block;
  }
}

.product-store {
  .fontSize(12);
  color: @fontColor33;
  .lineHeight(14);

  span {
    color: @mainColor;
  }
}

.prselistrs {
  .fontSize(14);
  font-weight: 400;
  color: @fontColor99;
  .lineHeight(18);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}

.prselistrt {
  width: 100%;
  .height(20);
  .margin(2, 0, 0, 0);
  font-weight: bold;
  .fontSize(16);
  color: @fontColor33;
  .lineHeight(20);
  display: -webkit-box; /*作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
  overflow: hidden;
  text-overflow: ellipsis; /* 溢出用省略号*/
  /*! autoprefixer: off */
  -webkit-box-orient: vertical; /*伸缩盒子的子元素排列：从上到下*/
  /* autoprefixer: on */
}

.prselistr {
  .width(245);
  height: 120%;
  .margin(0, 0, 0, 8);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.prsepic {
  .width(78);
  .height(78);
  .borderRadius(10, 10, 10, 10);
  overflow: hidden;
  background-color: #f6f6f6;

  img {
    width: 100%;
    height: 100%;
  }
}

.prselist {
  width: 100%;
  .height(107);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .padding(15, 10, 15, 10);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.display {
  display: none;
}

.prsemb {
  width: 100%;
  height: auto;

  .total-price {
    .height(44);
    text-align: right;
    .padding(15, 10, 15, 10);
    .fontSize(14);
    font-weight: 400;
    color: @fontColor33;
    .lineHeight(16);

    span {
      color: @fontColorFF3;
    }
  }

  .total-nutrition {
    .padding(12, 10, 3, 10);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    p {
      .fontSize(16);
      font-weight: 400;
      color: @fontColor33;
      .lineHeight(22);
      .margin(0, 0, 9, 0);

      span {
        color: @fontColor66;
      }
    }
  }

  .use-method {
    .padding(15, 10, 15, 10);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .title {
      .fontSize(16);
      font-weight: bold;
      color: @titleColor;
      .lineHeight(18);
    }

    .use-setting {
      .margin(15, 0, 0, 0);
      .padding(0, 0, 0, 15);
      display: flex;

      div {
        .margin(0, 30, 0, 0);
        display: flex;
        justify-content: center;
        align-items: center;

        input {
          .width(50);
          .height(25);
          .margin(0, 5, 0, 10);
          border: 1px solid rgba(0, 0, 0, 0.1);
          text-align: center;
        }
      }
    }
  }
}

.prsemm {
  width: 100%;
  .height(63);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .padding(15, 13, 15, 13);

  /deep/ .van-search,
  .van-cell {
    .width(324);
    .height(34);
    padding: 0;
    .lineHeight(34);
    .fontSize(14);
    color: @fontColor33;
    .borderRadius(6, 6, 6, 6);
    overflow: hidden;
  }

  .van-search__content {
    .width(315);
    .padding(0, 9, 0, 9);
  }
}

.prsemt {
  width: 100%;
  .height(45);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .padding(0, 10, 0, 10);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: @fontColor33;

  .van-button {
    .width(90);
    .height(26);
    .borderRadius(8, 8, 8, 8);
    .lineHeight(26);
    padding: 0;
    .fontSize(14);

    .van-button__text {
      width: 100%;
      height: 100%;
      color: @fontColorff;
    }
  }
}

.prsem {
  .width(351);
  height: auto;
  .borderRadius(10, 10, 10, 10);
  overflow: hidden;
  .margin(10, 0, 0, 12);
  background-color: @fontColorff;
  .fontSize(16);
}

.prsett {
  width: 100%;
  height: auto;
  .lineHeight(26);
  color: @fontColor33;
  .fontSize(16);

  span {
    color: @fontColor66;
  }
}
.prsett_foot {
  width: 100%;
  .lineHeight(26);
  color: @fontColor33;
  .fontSize(16);
  color: @mainColor;
  text-align: center;
}

/deep/ .van-cell:not(:last-child)::after {
  left: 0;
}

/deep/ .van-collapse-item__content {
  color: @fontColor33;
  .fontSize(16);
  .padding(12, 10, 12, 10);
}

/deep/ .van-cell {
  color: @fontColor33;
  .fontSize(16);
  .padding(10, 10, 10, 10);
}

.farther {
  .padding(58, 0, 0, 0);
}

.prset {
  .width(351);
  height: auto;
  margin: 0 auto;
  .borderRadius(10, 10, 10, 10);
  overflow: hidden;
}
</style>
