/**
*@desc 营养师端修改产品页
*@author houpai
*@date 2020/04/08 13:01:53
*/
<template>
  <div class="modifyProducts">
    <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="true"
        :title="title"
    ></commonHeader>
    <div class="farther">
      <div class="prset">
        <van-collapse v-model="activeNames">
          <van-collapse-item title="筛查参考" name="1">
            <div class="prsett">
              营养风险评分:
              <span>{{ score}}</span>
              <br/>疾病名称：
              <span>{{ Doctor.modifyProductList.illness }}</span>
              <br/>身体质量指数(BMI)：
              <span>{{ Doctor.modifyProductList.bmi }}</span>
              <br/>每日能量需求：
              <span>{{ Doctor.modifyProductList.ter }}kcal</span>
              <br/>营养替代能量：
              <span>{{ Doctor.modifyProductList.dtotalenergy }}kcal</span>
              <br/>血清白蛋白浓度(g/L)：
              <span>{{ ( Doctor.modifyProductList.serumalbumin == 0 || Doctor.modifyProductList.serumalbumin == "" ) ? "无" : Doctor.modifyProductList.serumalbumin }}</span>
              <br/>总功能比：
              <span>
                {{ Doctor.modifyProductList.pcfprotein }}%蛋白质；
                {{ Doctor.modifyProductList.pcfcarbohydrate}}%碳水化物物；
                {{ Doctor.modifyProductList.pcffat }}%脂肪
              </span>
              <br/>营养素供应量：
              <span style="padding-bottom: 12px">
                {{ Math.round((Doctor.modifyProductList.ter * Doctor.modifyProductList.pcfprotein) / 100 / 4) }}g蛋白质；
                {{ Math.round((Doctor.modifyProductList.ter * Doctor.modifyProductList.pcfcarbohydrate) / 100 / 4)}}g碳水化物物；
                {{ Math.round((Doctor.modifyProductList.ter * Doctor.modifyProductList.pcffat) / 100 / 9) }}g脂肪
              </span>
              <div class="yingyang_lujing">
                <p>营养路径</p>
                <ul>
                  <li>
                    <span>肠外: {{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.parenteralratio) / 100) || "0"}}kcal</span>
                    <span class="percentage">{{nutritionReferenceDetail.parenteralratio|| "0"}}%</span>
                  </li>
                  <li>
                    <span>肠内: {{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.enteralratio) / 100) || "0"}}kcal</span>
                    <span class="percentage">{{nutritionReferenceDetail.enteralratio|| "0"}}%</span>
                  </li>
                  <li>
                    <span>膳食: {{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.mealsratio) / 100)|| "0" }}kcal</span>
                    <span class="percentage">{{nutritionReferenceDetail.mealsratio || "0"}}%</span>
                  </li>
                </ul>
              </div>
              <div class="cell-box-title">
                <div class="first"></div>
                <div class="cellTitle">蛋白质(g)</div>
                <div class="cellTitle">碳水化合物(g)</div>
                <div class="cellTitle">脂肪(g)</div>
              </div>
              <div class="cell-box-content">
                <div class="first">肠外营养</div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcfprotein *
                  nutritionReferenceDetail.parenteralproteinratio) / 100 / 100 / 4) || "0"}}
                </div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcfcarbohydrate *
                  nutritionReferenceDetail.parenteralcarbonratio) / 100 / 100 / 4) || "0"}}
                </div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcffat *
                  nutritionReferenceDetail.parenteralfatratio) / 100 / 100 / 9) || "0"}}
                </div>
              </div>
              <div class="cell-box-content">
                <div class="first">肠内营养</div>
                <div>{{ Math.round((nutritionReferenceDetail.tee *nutritionReferenceDetail.pcfprotein *
                  nutritionReferenceDetail.enteralproteinratio) / 100 / 100 / 4) || "0"}}
                </div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcfcarbohydrate *
                  nutritionReferenceDetail.enteralcarbonratio) / 100 / 100 / 4) || "0"}}
                </div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcffat *
                  nutritionReferenceDetail.enteralfatratio) / 100 / 100 / 9) || "0"}}
                </div>
              </div>
              <div class="cell-box-content">
                <div class="first">膳食营养</div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcfprotein *
                  nutritionReferenceDetail.mealsproteinratio) / 100 / 100 / 4) || "0"}}
                </div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcfcarbohydrate *
                  nutritionReferenceDetail.mealscarbonratio) / 100 / 100 / 4) || "0"}}
                </div>
                <div>{{ Math.round((nutritionReferenceDetail.tee * nutritionReferenceDetail.pcffat *
                  nutritionReferenceDetail.mealsfatratio) / 100 / 100 / 9) || "0"}}
                </div>
              </div>
              <p class="link_p" @click="go_detail">筛查详情</p>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <div class="prsem">
      <div class="prsemt">
        <div class="prsemt_title">智配柜编号{{ Doctor.modifyProductList.deviceCode}}</div>
      </div>
      <div class="prsemb">
        <div class="add_box">
          <div class="add_btn" @click.stop="productsListSearch(true)">
            <van-icon name="plus"></van-icon>
            <span>新增营养成品</span>
          </div>
        </div>
        <!--        营养成品 推荐方案只可选一种营养成品-->
        <div class="prsemb" v-if="Doctor.modifyProductList.goods && Doctor.modifyProductList.goods[0].isFull == 1">
          <div>
            <div class="prselist">
              <div class="prsepic"
                   @click.stop="productDetails(Doctor.modifyProductList.goods[0].specificationId, Doctor.modifyProductList.goods[0].jiage)">
                <img :src="Doctor.modifyProductList.goods[0].topImg"/>
              </div>
              <div class="prselistr">
                <div class="prselistrt"
                     @click.stop="productDetails(Doctor.modifyProductList.goods.length &&Doctor.modifyProductList.goods[0].specificationId, Doctor.modifyProductList.goods.length &&Doctor.modifyProductList.goods[0].jiage)">
                  {{ Doctor.modifyProductList.goods.length && Doctor.modifyProductList.goods[0].productName }}
                </div>
                <div class="product-store">
                  {{Doctor.modifyProductList.goods.length &&
                  Doctor.modifyProductList.goods[0].proteinRatio}}%蛋：{{Doctor.modifyProductList.goods.length &&
                  Doctor.modifyProductList.goods[0].carbonRatio}}%碳：{{Doctor.modifyProductList.goods.length &&
                  Doctor.modifyProductList.goods[0].fatRatio}}%脂
                </div>
                <div class="product-store">
                  {{Doctor.modifyProductList.goods.length &&
                  Doctor.modifyProductList.goods[0].protein}}g蛋：{{Doctor.modifyProductList.goods.length &&
                  Doctor.modifyProductList.goods[0].carbon}}g碳：{{Doctor.modifyProductList.goods.length &&
                  Doctor.modifyProductList.goods[0].fat}}g脂
                </div>
                <div class="prselistrm">
                  <span>{{Doctor.modifyProductList.length ? Doctor.modifyProductList.goods[0].kcal + "kcal" : "未知"}}</span>
                  {{Doctor.modifyProductList.goods.length && Doctor.modifyProductList.goods[0].specificationName }}
                </div>
                <div class="prselistrb">
                  <div class="prselistrs pr-price">
                    ¥{{ (Doctor.modifyProductList.goods.length && Doctor.modifyProductList.goods[0].jiage /
                    100).toFixed(2) || 0}}
                  </div>
                  <div v-if="Doctor.modifyProductList.goods.length">
                    <van-stepper
                        v-model="Doctor.modifyProductList.goods[0].quantity"
                        min="1"
                        max="99"
                        integer
                        @change="onChange(Doctor.modifyProductList.goods[0].quantity, 0)"
                        @overlimit="onOverlimit(Doctor.modifyProductList.goods[0].quantity, 0)"/>
                  </div>
                </div>
              </div>
              <!--              <p v-else style="text-align: center;width: 100%">-->
              <!--                请添加营养成品-->
              <!--              </p>-->
            </div>
            <div class="use-method">
              <p class="title">使用方法设置：</p>
              <div class="use-setting">
                <div>
                  每日
                  <input type="number" v-model="Doctor.modifyProductList.goods[0].dailydose"/>
                  袋
                </div>
                <div>
                  服用
                  <input type="number" v-model="Doctor.modifyProductList.goods[0].takingtime"/>
                  天
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add-component-product">
          <van-button @click.stop="productsListSearch()" class="v-nextBottom">
            <van-icon name="plus"></van-icon>
            <span>添加组件产品</span>
          </van-button>
        </div>
        <div v-for="(item, index) in Doctor.modifyProductList.goods"
             v-if="item.isFull != 1"
             :key="index">
          <div class="prselist">
            <div class="prsepic" @click.stop="productDetails(item.specificationId,item.jiage)">
              <img :src="item.topImg"/>
            </div>
            <div class="prselistr">
              <div class="prselistrt"
                   @click.stop="productDetails(item.specificationId, item.jiage)">
                {{ item.productName }}
              </div>
              <div class="product-store">{{item.proteinRatio}}%蛋：{{item.carbonRatio}}%碳：{{item.fatRatio}}%脂</div>
              <div class="product-store">{{item.protein}}g蛋：{{item.carbon}}g碳：{{item.fat}}g脂</div>
              <div class="prselistrm">
                <span>{{ !item.kcal ? "未知" : item.kcal + "kcal" }}</span>
                {{ item.specificationName }}
              </div>
              <div class="prselistrb">
                <div class="prselistrs pr-price">
                  ¥{{ (item.jiage / 100).toFixed(2) }}
                </div>
                <div>
                  <van-stepper
                      v-model="item.quantity"
                      min="1"
                      max="99"
                      integer
                      @change="onChange(item.quantity, index)"
                      @overlimit="onOverlimit(item.quantity, index)"/>
                </div>
              </div>
            </div>
          </div>
          <div class="use-method">
            <p class="title">使用方法设置：</p>
            <div class="use-setting">
              <div>
                每日
                <input type="number" v-model="item.dailydose"/>
                袋
              </div>
              <div>
                服用
                <input type="number" v-model="item.takingtime"/>
                天
              </div>
            </div>
          </div>
        </div>
        <div class="total-nutrition">
          <p>
            当前肠内营养：
            <span>{{ gettotalProteinComponent }}g蛋白质/{{ gettotalCarbonComponent }}g碳水化物/{{ gettotalFatComponent }}g脂肪</span>
          </p>
          <p>
            当前膳食营养：
            <span>{{ gettotalProteinAllNutrition }}g蛋白质/{{ gettotalCarbonAllNutrition }}g碳水化物/{{ gettotalFatAllNutrition }}g脂肪</span>
          </p>
        </div>
        <div class="total-price">
          合计金额：<span>¥{{ (gettotalPrice / 100).toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <div class="prseempty"></div>
    <div class="prseb">
      <div class="prsebl">
        <div>已选(<span>{{ gettotal }}</span>)
          <div class="total-kcal">
            {{ gettotalKcal }}kcal
          </div>
        </div>
      </div>
      <div class="prsebr">
        <van-button
            color="linear-gradient(to right, #FE9F3F, #E98C2E)"
            @click="$throttle(submit)">确认修改
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import commonHeader from "@/components/commonHeader/common_header.vue";
  import {Toast, Dialog} from "vant";
  import {mapState} from "vuex";

  import pic from "../../assets/img/vendingMachine1.png";

  export default {
    name: "modifyProducts",
    components: {commonHeader},
    data() {
      return {
        title: "方案修改",
        customTitle: "营养方案审核",
        activeNames: ["0"],
        deviceId: "", // 设备id
        nutritionReferenceDetail: {}, //营养参考数据,
        nutritionId: "", // 营养方案id,本地缓存里取 键为'id'
        productsList: [], // 营养方案商品列表 可修改
        type: ""// 处方审核状态
      };
    },
    computed: {
      ...mapState(["Doctor"]),
      score() {
        let score = "";
        if (window.localStorage.getItem("score")) score = window.localStorage.getItem("score");
        return score;
      },
      gettotal() {
        let total = 0;
        try {
          for (let i = 0; i < this.Doctor.modifyProductList.goods.length; i++) {
            total += parseInt(this.Doctor.modifyProductList.goods[i].quantity);
          }
        } catch (e) {
          console.log(e);
        }
        return total;
      },
      gettotalKcal() {
        let totalKcal = 0;
        try {
          for (let i = 0; i < this.Doctor.modifyProductList.goods.length; i++) {
            totalKcal += this.Doctor.modifyProductList.goods[i].quantity * this.Doctor.modifyProductList.goods[i].kcal;
          }
        } catch (e) {
          console.log(e);
        }
        return totalKcal;
      },
      gettotalPrice() {
        let totalPrice = 0;
        try {
          for (let i = 0; i < this.Doctor.modifyProductList.goods.length; i++) {
            totalPrice += this.Doctor.modifyProductList.goods[i].quantity * this.Doctor.modifyProductList.goods[i].jiage;
          }
        } catch (e) {
          console.log(e);
        }
        return totalPrice;
      },
      gettotalProteinComponent() {
        let totalProteinComponent = 0;
        try {
          for (let i = 1; i < this.Doctor.modifyProductList.goods.length; i++) {
            totalProteinComponent +=
              this.Doctor.modifyProductList.goods[i].quantity *
              this.Doctor.modifyProductList.goods[i].protein;
          }
        } catch (e) {
          console.log(e);
        }
        return totalProteinComponent;
      },
      gettotalProteinAllNutrition() {
        let totalProteinComponent = 0;
        try {
          totalProteinComponent = (this.Doctor.modifyProductList.goods[0].quantity *
            this.Doctor.modifyProductList.goods[0].protein);
        } catch (e) {
          console.log(e);
        }
        return totalProteinComponent;
      },
      gettotalCarbonComponent() {
        let totalCarbonComponent = 0;
        try {
          for (let i = 1; i < this.Doctor.modifyProductList.goods.length; i++) {
            totalCarbonComponent +=
              this.Doctor.modifyProductList.goods[i].quantity *
              this.Doctor.modifyProductList.goods[i].carbon;
          }
        } catch (e) {
          console.log(e);
        }
        return totalCarbonComponent;
      },
      gettotalCarbonAllNutrition() {
        let totalCarbonAllNutrition = 0;
        try {
          totalCarbonAllNutrition = (this.Doctor.modifyProductList.goods[0].quantity *
            this.Doctor.modifyProductList.goods[0].carbon);
        } catch (e) {
          console.log(e);
        }
        return totalCarbonAllNutrition;
      },
      gettotalFatComponent() {
        let totalFatComponent = 0;
        try {
          for (let i = 1; i < this.Doctor.modifyProductList.goods.length; i++) {
            totalFatComponent +=
              this.Doctor.modifyProductList.goods[i].quantity *
              this.Doctor.modifyProductList.goods[i].fat;
          }
        } catch (e) {
          console.log(e);
        }
        return totalFatComponent;
      },
      gettotalFatAllNutrition() {
        let totalFatAllNutrition = 0;
        try {
          totalFatAllNutrition = (this.Doctor.modifyProductList.goods[0].quantity *
            this.Doctor.modifyProductList.goods[0].fat);
        } catch (e) {
          console.log(e);
        }
        return totalFatAllNutrition;
      }
    },
    methods: {
      /**
       * 营养配比详情(v1.13新增接口)
       * **/
      getNutritionReferenceDetail() {
        this.$http.request({
          url: "/NNutritionPrescribePatientController/selectByPrimaryKey",
          method: "get",
          body: {
            id: window.sessionStorage.getItem("id")
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            this.nutritionReferenceDetail = res.data.data || {};
            if (this.nutritionReferenceDetail.tee) {
              this.nutritionReferenceDetail.tee = (Number(this.nutritionReferenceDetail.tee)).toFixed(0);
            }
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 获取营养方案详情(商品列表和营养方案参考)
       * **/
      getNutritionProductList() {
        this.$http.request({
          url: "/NNutritionPrescribeSchemePatientGoodsController/selectPatientKey",
          method: "get",
          body: {
            patiId: window.sessionStorage.getItem("id")
          }
        }).then(res => {
          if (res.data.success) {
            let data = res.data;
            if (data.success) {
              data.data.planIsChange = false;
              this.$store.commit("Doctor/modifyProductList", data.data);
            } else {
              Toast(data.message);
            }
          } else {
            console.log("获取处方单详情接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      onOverlimit(quantity, index) {
        Dialog.confirm({
          title: "提示",
          message: "是否删除该产品？"
        }).then(() => {
          this.Doctor.modifyProductList.planIsChange = true;
          this.Doctor.modifyProductList.goods.splice(index, 1);
        }).catch(() => {
        });
      },
      // /**
      //  * 切换智配柜
      //  * **/
      // cutCabinet() {
      //   this.$router.push({name: "cabinet"});
      // },
      /**
       * 修改营养方案提交
       * **/
      submit() {
        Dialog.confirm({
          title: "提示",
          message: "是否对当前方案进行更新保存？"
        }).then(() => {
          let parData = [];
          this.Doctor.modifyProductList.goods.forEach((v, e) => {
            if (v.quantity !== 0) {
              parData.push(
                {
                  specId: v.specificationId,
                  quantity: v.quantity,
                  dailydose: v.dailydose,
                  takingtime: v.takingtime
                }
              );
            }
          });
          this.$http.request({
            url: "/NNutritionPrescribeGoodsController/saveNutritionPrescribe",
            method: "post",
            body: {
              npatientId: this.nutritionId,
              deviceId: this.Doctor.modifyProductList.deviceId,
              data: JSON.stringify(parData),
              atype: 6,
              type: 0,
              enteralproteincurrent: this.gettotalProteinComponent,
              enteralcarboncurrent: this.gettotalCarbonComponent,
              enteralfatcurrent: this.gettotalFatComponent,
              mealsproteincurrent: this.gettotalProteinAllNutrition,
              mealscarboncurrent: this.gettotalCarbonAllNutrition,
              mealsfatcurrent: this.gettotalFatAllNutrition
            }
          }).then(res => {
            if (res.data.success) {
              Toast("提交成功");
              this.$store.commit("Doctor/modifyProductList", "");
              this.$router.push({
                path: "/examineDetail",
                query: {
                  type: this.type
                }
              });
            } else {
              if (res.data.code === "00029") {
                Toast(res.data.message);
              } else {
                Toast(res.data.message || "接口报错");
              }
            }
          });
        }).catch(() => {
        });
      },
      /**
       * 步进器change事件
       * **/
      overlimit(item, index) {
        Dialog.confirm({
          title: "",
          message: "确定要删除该产品吗?"
        }).then(() => {
          this.Doctor.modifyProductList.goods.splice(index, 1);
        }).catch(() => {
        });
      },
      /**
       * 查看产品详情
       * **/
      productDetails(id, price) {
        this.$router.push({
          name: "productDetails",
          query: {specId: id, price: price}
        });
      },
      /**
       * 修改产品数量
       * **/
      onChange(quantity, index) {
        console.log("修改产品数量");
      },
      /**
       * 查看筛查详情
       * **/
      go_detail() {
        this.$router.push({
          name: "details"
        });
      },
      /**
       * 修改产品选择搜索
       * **/
      productsListSearch(type) {
        this.$router.push({
          path: "/productsListSearch",
          query: {
            isAllNutrition: type ? type : ""
          }
        });
      }
    },
    created() {
      this.type = this.$route.query.type || "";
      // 从vuex中获取智配柜id和营养方案id
      this.deviceId = this.$store.state.Doctor.cabNum ? this.$store.state.Doctor.cabNum : "";
      this.nutritionId = window.sessionStorage.getItem("id");
      if (!this.Doctor.modifyProductList.goods) {
        this.getNutritionProductList();
      }
      this.getNutritionReferenceDetail();
    }
  };
</script>
<style lang="less" scoped>

  @media only screen and (device-width: 375px) and (device-height: 812px) and

  (-webkit-device-pixel-ratio: 3) {
    /*导航操作栏上移*/
    .prseempty {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9;
      background-color: #F2F2F2;
    }
  }

</style>
<style scoped lang="less">
  .prseempty {
    width: 100%;
    height: 101px;
  }

  .prsebr {
    width: 263px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: @backgroundColorff;

    .van-button {
      margin-left: 70px;
      color: @fontColorff;
      font-size: 18px;
      font-weight: bold;
      width: 165px;
      height: 44px;
      background: linear-gradient(225deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
      .borderRadius(10, 10, 10, 10)
    }
  }

  .prsebl {
    width: 112px;
    height: 100%;
    background-color: @fontColorff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    color: @fontColor66;
    font-size: 18px;

    span {
      color: @mainColor;
    }

    .total-kcal {
      font-size: 12px;
      width: 100%;
      text-align: center;
      margin-top: 5px;
    }
  }

  .prseb {
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    z-index: 11;
  }

  .prselistrb {
    width: 100%;
    height: 18px;
    font-size: 14px;
    color: @fontColor66;
    line-height: 18px;
    display: flex;
    justify-content: space-between;

    /deep/ .van-stepper {
      width: 93px;
      height: 18px;
      margin-top: 1px;
    }

    /deep/ .van-stepper__minus,
    /deep/ .van-stepper__plus {
      width: 28px;
      height: 18px;
      background: rgba(246, 246, 246, 1);
      border: 0;
      border-radius: 9px;

    }

    /deep/ .van-stepper__minus--disabled  {
      color: #323232;
    }

    /deep/ .van-stepper__minus::before, /deep/ .van-stepper__plus::before {
      width: 10px;
    }

    /deep/ .van-stepper__input {
      height: 18px;
      background-color: @fontColorff;
    }

    .pr-price {
      color: @fontColorFF3;
    }
  }

  .prselistrm {
    width: 100%;
    // height: 15px;
    // margin-top: 5px;
    font-size: 12px;
    color: @fontColor66;
    line-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;

    span {
      width: 73px;
      display: inline-block;
    }
  }

  .product-store {
    font-size: 12px;
    color: @fontColor33;
    line-height: 20px;

    span {
      color: @mainColor;
    }
  }

  .prselistrs {
    font-size: 14px;
    font-weight: 400;
    color: @fontColor99;
    line-height: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }

  .prselistrt {
    width: 100%;
    height: 20px;
    margin-top: 2px;
    font-weight: bold;
    font-size: 16px;
    color: @fontColor33;
    line-height: 20px;
    display: -webkit-box; /*作为弹性伸缩盒子模型显示*/
    -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
    overflow: hidden;
    text-overflow: ellipsis; /* 溢出用省略号*/
    /*! autoprefixer: off */
    -webkit-box-orient: vertical; /*伸缩盒子的子元素排列：从上到下*/
    /* autoprefixer: on */
  }

  .prselistr {
    width: 245px;
    height: 100%;
    margin-left: 8px;
    display: flex;
    flex-direction: column;
  }

  .prsepic {
    width: 78px;
    height: 78px;
    border-radius: 10px;
    overflow: hidden;
    background-color: #f6f6f6;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .prselist {
    width: 100%;
    /*height: 107px;*/
    border-bottom: 1px solid @backcolor;
    padding: 15px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .add-component-product {
    padding: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .v-nextBottom {
      width: 100%;
      height: 34px;
      line-height: 31px;
    }

    /deep/ .van-button {
      background: linear-gradient(270deg,
      rgba(255, 122, 51, 1) 0%,
      rgba(255, 139, 78, 1) 100%) !important;
      border: 1px solid rgba(255, 122, 51, 1);

      .van-icon.van-icon-plus {
        color: @fontColorff;
        .margin(0, 5, 0, 0);
      }

      span {
        color: @fontColorff;
        .fontSize(16);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .use-method {
    padding: 15px 10px;
    border-bottom: 1px solid @backcolor;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: @titleColor;
      line-height: 18px;
    }

    .use-setting {
      margin-top: 15px;
      padding-left: 15px;
      display: flex;

      div {
        margin-right: 30px;
        display: flex;
        justify-content: center;
        align-items: center;

        input {
          width: 50px;
          height: 25px;
          margin: 0 5px 0 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          text-align: center;
        }
      }
    }
  }

  .prsemb {
    width: 100%;
    height: auto;

    .total-price {
      height: 44px;
      text-align: right;
      padding: 15px 10px;
      font-size: 14px;
      font-weight: 400;
      color: @fontColor33;
      line-height: 14px;

      span {
        color: @fontColorFF3;
      }
    }

    .add_box {
      display: flex;
      justify-content: center;
      align-items: center;
      .padding(15, 0, 15, 0);
      border: 1px solid #F2F2F2;

      .add_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .width(321);
        .height(34);
        .borderRadius(10, 10, 10, 10);
        color: @fontColorff;
        .fontSize(16);
        border: 1px solid #0069FF;
        background: linear-gradient(52deg, #0069FF 0%, #0180FF 100%) !important;

        .plus {
          color: @fontColorff;
        }

        span {
          .margin(0, 0, 0, 5);
        }
      }
    }
  }

  .prsemt {
    width: 100%;
    height: 45px;
    border-bottom: 1px solid @backcolor;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: @fontColor33;

    .van-button {
      width: 90px;
      height: 26px;
      border-radius: 8px;
      line-height: 26px;
      padding: 0;
      font-size: 14px;

      .van-button__text {
        width: 100%;
        height: 100%;
        color: @fontColorff;
        display: flex;
        align-items: center;

        span {
          .margin(0, 0, 0, 5);
        }
      }
    }

    .prsemt_title {
      .fontSize(16);
      font-weight: bold;
      color: @fontColor33;
    }
  }

  .prsem {
    width: 351px;
    height: auto;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
    margin-left: 12px;
    background-color: @fontColorff;
    font-size: 16px;
  }

  .prsett {
    width: 100%;
    height: auto;
    line-height: 26px;
    color: @fontColor33;
    font-size: 16px;

    span {
      color: @fontColor66;
    }
  }

  .total-nutrition {
    padding: 12px 10px 3px;
    border-bottom: 1px solid @backcolor;

    p {
      font-size: 16px;
      font-weight: 400;
      color: @fontColor33;
      line-height: 22px;
      margin-bottom: 9px;

      span {
        color: @fontColor66;
      }
    }
  }

  /deep/ .van-cell:not(:last-child)::after {
    left: 0;
  }

  /deep/ .van-collapse-item__content {
    color: @fontColor33;
    font-size: 16px;
    padding: 12px 10px;
  }

  /deep/ .van-cell {
    color: @fontColor33;
    font-size: 16px;
    padding: 10px;
  }

  .farther {
    padding-top: 58px;
  }

  .prset {
    width: 351px;
    height: auto;
    margin: 0 auto;
    border-radius: 10px;
    overflow: hidden;
  }

  .modifyProducts {
    width: 100%;
    height: 100%;
    font-size: 16px;
  }


  @media screen and (min-width: 375px) {

    //css style
    .prseb {
      bottom: 0;
    }
  }


  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-min-device-pixel-ratio: 2) {
    .prseb {
      bottom: 0;
    }
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and

  (-webkit-device-pixel-ratio: 3) {
    .prseb {
      bottom: 34px;
    }
  }

  .link_p {
    text-align: center;
    color: rgba(0, 105, 255, 1);
    .fontSize(16);
    .lineHeight(20);
    text-decoration: underline;
    padding-top: 12px;
    border-top: 1px solid #F2F2F2;
  }

  /*1.13新增营养功能比等*/
  .yingyang_lujing {
    border-top: 1px solid #F2F2F2;
    border-bottom: 1px solid #F2F2F2;
    padding-bottom: 12px;
    margin-bottom: 12px;

    p {
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding: 12px 0;
      text-align: center;
    }

    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          font-size: 16px;
          color: rgba(51, 51, 51, 1);
        }

        span.percentage {
          color: rgba(102, 102, 102, 1);
        }
      }
    }
  }

  .cell-box-title, .cell-box-content {
    display: flex;
    justify-content: space-around;
    align-items: center;

    div.first {
      width: 20%;
      justify-content: flex-start;
    }

    div.cellTitle {
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
    }

    div {
      width: calc(80% / 3);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
</style>
