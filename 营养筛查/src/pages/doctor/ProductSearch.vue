/* * @Author: 田东 * @Date: 2020-06-09 14:17:51 * @Last Modified by: 田东 *
@Last Modified time: 2020-06-09 14:18:19 * @name 营养方案 */

<template>
  <div class="ProductSearch">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="farther">
      <div class="prset">
        <van-collapse v-model="activeNames">
          <van-collapse-item :title="Patient.prestype==1?'诊断参考':'筛查参考'" name="1">
            <div class="prsett">
              <span v-if="Patient.prestype != 1">
                营养风险评分:
                <span>{{ Doctor.planNutritionList.assessmentbranch }}分</span>
                <br />
              </span>
              <span>
                疾病名称：
                <span>{{ Doctor.planNutritionList.illness }}</span>
              </span>
              <br />
              <span>
                身体质量指数(BMI)：
                <span>{{ topInfoData.bmi }}</span>
                <br />
              </span>
              <span>
                每日能量需求：
                <span>{{ topInfoData.tee }}kcal</span>
                <br />
              </span>
              <span v-if="topInfoData.dtotalenergy != 0">
                营养替代能量：
                <span>{{ topInfoData.dtotalenergy }}kcal</span>
                <br />
              </span>
              <span>
                血清白蛋白(g/L)：
                <span>
                  {{
                  topInfoData.serumalbumin == 0 ||
                  topInfoData.serumalbumin == "无"
                  ? "无"
                  : topInfoData.serumalbumin
                  }}
                </span>
                <br />
              </span>
              <span
                v-if="
                  topInfoData.pcfprotein != 0 &&
                    topInfoData.pcfcarbohydrate != 0 &&
                    topInfoData.pcffat != 0
                "
              >
                供能比参考：
                <span>
                  {{ topInfoData.pcfprotein }}%(蛋白质)；
                  {{ topInfoData.pcfcarbohydrate }}%(碳水化物物)；
                  {{ topInfoData.pcffat }}%(脂肪)
                </span>
                <br />
              </span>
              <span>
                营养素供应量：
                <span>
                  {{ Math.round( topInfoData.tee * topInfoData.pcfprotein / 400)}}g蛋白值：
                  {{ Math.round( topInfoData.tee * topInfoData.pcfcarbohydrate / 400)}}g碳水化合物：
                  {{ Math.round( topInfoData.tee * topInfoData.pcffat / 900)}}g脂肪
                </span>
              </span>
            </div>
            <div class="yingyang_lujing">
              <p>营养路径</p>
              <ul>
                <li>
                  <span>肠外: {{ Math.round((topInfoData.tee * topInfoData.parenteralratio) / 100) || "0"}}kcal</span>
                  <span class="percentage">{{topInfoData.parenteralratio|| "0"}}%</span>
                </li>
                <li>
                  <span>肠内: {{ Math.round((topInfoData.tee * topInfoData.enteralratio) / 100) || "0"}}kcal</span>
                  <span class="percentage">{{topInfoData.enteralratio|| "0"}}%</span>
                </li>
                <li>
                  <span>膳食: {{ Math.round((topInfoData.tee * topInfoData.mealsratio) / 100)|| "0" }}kcal</span>
                  <span class="percentage">{{topInfoData.mealsratio || "0"}}%</span>
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
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcfprotein *
                topInfoData.parenteralproteinratio) / 100 / 100 / 4) || "0"}}
              </div>
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcfcarbohydrate *
                topInfoData.parenteralcarbonratio) / 100 / 100 / 4) || "0"}}
              </div>
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcffat *
                topInfoData.parenteralfatratio) / 100 / 100 / 9) || "0"}}
              </div>
            </div>
            <div class="cell-box-content">
              <div class="first">肠内营养</div>
              <div>
                {{ Math.round((topInfoData.tee *topInfoData.pcfprotein *
                topInfoData.enteralproteinratio) / 100 / 100 / 4) || "0"}}
              </div>
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcfcarbohydrate *
                topInfoData.enteralcarbonratio) / 100 / 100 / 4) || "0"}}
              </div>
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcffat *
                topInfoData.enteralfatratio) / 100 / 100 / 9) || "0"}}
              </div>
            </div>
            <div class="cell-box-content">
              <div class="first">膳食营养</div>
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcfprotein *
                topInfoData.mealsproteinratio) / 100 / 100 / 4) || "0"}}
              </div>
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcfcarbohydrate *
                topInfoData.mealscarbonratio) / 100 / 100 / 4) || "0"}}
              </div>
              <div>
                {{ Math.round((topInfoData.tee * topInfoData.pcffat *
                topInfoData.mealsfatratio) / 100 / 100 / 9) || "0"}}
              </div>
            </div>
            <div class="prsett_foot">
              <u @click="goNext">更多详情</u>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <div class="prsem">
      <div class="prsemt">
        <div>智配柜编号{{ Doctor.planNutritionList.deviceCode }}</div>
        <div>
          <van-button color="#0069FF" @click="cutCabinet()">切换智配柜</van-button>
        </div>
      </div>
      <div class="add-product">
        <van-button @click.stop="$throttle(addProduct(true))" class="v-nextBottom" type="warning">
          <span>+其他全营养产品</span>
        </van-button>
      </div>
      <div
        class="prsemb"
        v-if="Doctor.planNutritionList.goods.length > 0 && Doctor.planNutritionList.goods[0].isFull == 1"
      >
        <div>
          <div class="prselist">
            <div
              class="prsepic"
              @click.stop="productDetails(Doctor.planNutritionList.goods[0].specificationId, Doctor.planNutritionList.goods[0].jiage)"
            >
              <img :src="Doctor.planNutritionList.goods[0].topImg" />
            </div>
            <div class="prselistr">
              <div
                class="prselistrt"
                @click.stop="productDetails(Doctor.planNutritionList.goods[0].specificationId, Doctor.planNutritionList.goods[0].jiage)"
              >{{ Doctor.planNutritionList.goods[0].productName }}</div>
              <div
                class="product-store"
              >{{Doctor.planNutritionList.goods[0].proteinRatio}}%蛋：{{Doctor.planNutritionList.goods[0].carbonRatio}}%碳：{{Doctor.planNutritionList.goods[0].fatRatio}}%脂</div>
              <div
                class="product-store"
              >{{Doctor.planNutritionList.goods[0].protein}}g蛋：{{Doctor.planNutritionList.goods[0].carbon}}g碳：{{Doctor.planNutritionList.goods[0].fat}}g脂</div>
              <div class="prselistrm">
                <span>{{!Doctor.planNutritionList.goods[0].kcal ? "未知" : Doctor.planNutritionList.goods[0].kcal + "kcal"}}</span>
                {{ Doctor.planNutritionList.goods[0].specificationName }}
              </div>
              <div class="prselistrb">
                <div
                  class="prselistrs pr-price"
                >¥{{ (Doctor.planNutritionList.goods[0].jiage / 100).toFixed(2) }}</div>
                <div>
                  <!-- :max="i.productStore"-->
                  <van-stepper
                    v-model="Doctor.planNutritionList.goods[0].quantity"
                    min="1"
                    max="99"
                    integer
                    @change="onChange(Doctor.planNutritionList.goods[0].quantity, 0)"
                    @overlimit="onOverlimit(Doctor.planNutritionList.goods[0].quantity, 0)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="use-method">
            <p class="title">使用方法设置：</p>
            <div class="use-setting">
              <div>
                每日
                <input v-model="Doctor.planNutritionList.goods[0].dailydose" type="number" />
                袋
              </div>
              <div>
                服用
                <input v-model="Doctor.planNutritionList.goods[0].takingtime" type="number" />
                天
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="add-component-product">
        <van-button @click.stop="$throttle(addProduct())" class="v-nextBottom">
          <span>+添加组件产品</span>
        </van-button>
      </div>
      <div class="prsemb">
        <div v-for="(i, index) in Doctor.planNutritionList.goods" :key="index" v-if="i.isFull == 0">
          <div class="prselist">
            <div class="prsepic" @click.stop="productDetails(i.specificationId, i.jiage)">
              <img :src="i.topImg" />
            </div>
            <div class="prselistr">
              <div
                class="prselistrt"
                @click.stop="productDetails(i.specificationId, i.jiage)"
              >{{ i.productName }}</div>
              <!-- <div class="prselistrm">{{ i.bili }}</div> -->
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
          <div class="use-method">
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
          </div>
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
    <div class="save-plan" v-if="type == 1 || type == 0">
      <van-checkbox v-model="checked" @change="selectPlanDoc()" v-if="type == 1">提交时按当前方案进行更新保存</van-checkbox>
      <van-checkbox v-model="checked" @change="selectPlan()" v-if="type == 0">同时将当前方案保存到“我的经验默认方案”中</van-checkbox>
    </div>
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
        <van-button @click="$throttle(submitHandle)">{{ sure }}</van-button>
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
import pic from "../../assets/img/vendingMachine1.png";
import commonInsertOrUpdate from "@/components/commonInsertOrUpdate/commonInsertOrUpdate.vue";
import { mapState } from "vuex";
import { Toast, Dialog } from "vant";

export default {
  name: "ProductSearch",
  components: {
    commonHeader,
    commonInsertOrUpdate
  },
  data() {
    return {
      title: "",
      customTitle: "营养方案",
      topInfoData: {},
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
        text: ""
      },
      //1.9新增修改功能,为减少修改规模,新增以下字段进行新功能实现
      goods: [], //产品列表
      NewDeviceCode: "",
      NewDeviceFullAdress: "",
      NewDeviceId: "",
      NewDeviceName: "",
      //1.9新增结束
      isShowEditDialog: false // 是否显示 请为该方案设置名称与备注信息 弹窗
    };
  },
  created() {
    this.type = this.$route.query.type; //0系统推荐套餐 1医生经验套餐 2患者定制套餐方案
    this.planId = this.$route.query.id || "";
    this.title =
      this.type == 0
        ? "系统推荐套餐方案"
        : this.type == 1
        ? "医生经验套餐方案"
        : "定制成品套餐方案";
    this.url =
      this.type == 0
        ? "/RNutritionPrescriptionGoodsController/selectSystemKey"
        : this.type == 1
        ? "/NNutritionPrescribeSchemeDoctorGoodsController/selectDoctorKey"
        : "/NNutritionPrescribeGoodsController/matchingGoods";
    this.id = window.sessionStorage.getItem("id");
    this.getInfoByPrimaryKey();
    if (this.$route.query.nutritionType) {
      this.sure = "确认修改";
      this.title = "方案修改";
      this.customTitle = "营养方案审核";
      this.planId = 0;
      // this.Doctor.planNutritionList.deviceId = this.$route.query.deviceId;
      if (!this.Doctor.planNutritionList.goods) {
        this.url = "/NNutritionPrescribeSchemePatientGoodsController/selectPatientKey";
        this.getData();
      }
    } else {
      if (!this.Doctor.planNutritionList.goods) {
        this.getData();
      }
      if (this.Doctor.planNutritionList.isChangeDevice) {
        this.getData();
      }
    }
  },
  computed: {
    ...mapState(["Doctor"]),
    ...mapState(["Patient"]),
    gettotal() {
      let total = 0;
      // total = this.list.length;
      for (let i = 0; i < this.Doctor.planNutritionList.goods.length; i++) {
        total += parseInt(this.Doctor.planNutritionList.goods[i].quantity);
      }
      return total;
    },
    gettotalKcal() {
      let totalKcal = 0;
      // total = this.list.length;
      for (let i = 0; i < this.Doctor.planNutritionList.goods.length; i++) {
        totalKcal +=
          this.Doctor.planNutritionList.goods[i].quantity *
          this.Doctor.planNutritionList.goods[i].kcal;
      }
      return totalKcal;
    },
    gettotalPrice() {
      let totalPrice = 0;
      // total = this.list.length;
      // console.log("长度",this.Doctor.planNutritionList.goods.length);
      for (let i = 0; i < this.Doctor.planNutritionList.goods.length; i++) {
        totalPrice +=
          this.Doctor.planNutritionList.goods[i].quantity *
          this.Doctor.planNutritionList.goods[i].jiage;
      }
      return totalPrice;
    },
    gettotalProteinComponent() {
      let totalProteinComponent = 0;
      this.Doctor.planNutritionList.goods.forEach(V => {
        if (V.isFull == 0) {
          totalProteinComponent += V.quantity * V.protein;
        }
      });

      return totalProteinComponent;
    },
    gettotalProteinAllNutrition() {
      let totalProteinComponent = 0;
      this.Doctor.planNutritionList.goods.forEach(V => {
        if (V.isFull == 1) {
          totalProteinComponent += V.quantity * V.protein;
        }
      });

      return totalProteinComponent;
    },
    gettotalCarbonComponent() {
      let totalCarbonComponent = 0;
      this.Doctor.planNutritionList.goods.forEach(V => {
        if (V.isFull == 0) {
          totalCarbonComponent += V.quantity * V.carbon;
        }
      });

      return totalCarbonComponent;
    },
    gettotalCarbonAllNutrition() {
      let totalCarbonAllNutrition = 0;
      this.Doctor.planNutritionList.goods.forEach(V => {
        if (V.isFull == 1) {
          totalCarbonAllNutrition += V.quantity * V.carbon;
        }
      });

      return totalCarbonAllNutrition;
    },
    gettotalFatComponent() {
      let totalFatComponent = 0;
      this.Doctor.planNutritionList.goods.forEach(V => {
        if (V.isFull == 0) {
          totalFatComponent += V.quantity * V.fat;
        }
      });
      return totalFatComponent;
    },
    gettotalFatAllNutrition() {
      let totalFatAllNutrition = 0;
      this.Doctor.planNutritionList.goods.forEach(V => {
        if (V.isFull == 1) {
          totalFatAllNutrition += V.quantity * V.fat;
        }
      });

      return totalFatAllNutrition;
    }
  },
  watch: {
    Doctor: {
      handler: function(newValue, oldValue) {
        this.$store.commit(
          "Doctor/planNutritionList",
          newValue.planNutritionList
        );
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    goNext() {
      //跳转到下一页
      this.$router.push({
        path: "/details",
        query: {}
      });
    },
    getData() {
      this.$http
        .request({
          method: "get",
          url: this.url,
          body: {
            id: this.planId,
            patiId: this.id,
            deviceId: this.Doctor.planNutritionList.deviceId || ""
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            data.data.planIsChange = false;
            this.$store.commit("Doctor/planNutritionList", data.data);
            console.log(this.goods);
            if (this.goods.length != 0) {
              console.log("测试");
              this.Doctor.planNutritionList.goods = this.goods;
            }
            if (this.NewDeviceCode) {
              this.Doctor.planNutritionList.deviceCode = this.NewDeviceCode;
              this.Doctor.planNutritionList.deviceFullAdress = this.NewDeviceFullAdress;
              this.Doctor.planNutritionList.deviceId = this.NewDeviceId;
              this.Doctor.planNutritionList.deviceName = this.NewDeviceName;
            }
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    getInfoByPrimaryKey() {
      this.$http
        .request({
          method: "get",
          url: "NNutritionPrescribePatientController/selectByPrimaryKey",
          body: {
            id: this.id
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.topInfoData = data.data;
            this.topInfoData.tee = Number(this.topInfoData.tee).toFixed(0);
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    // 新增成品
    addProduct(type) {
      this.Doctor.planNutritionList.planIsChange = true;
      this.$router.push({
        name: "productsListSearchAdd",
        query: {
          isAllNutrition: type
        }
      });
    },
    productDetails(id, price) {
      this.$router.push({
        name: "productDetails",
        query: {
          specId: id,
          price: price
        }
      });
    },
    // 修改产品数量
    onChange(quantity, index) {
      if (quantity > 0 && this.Doctor.planNutritionList.planIsChange)
        return false;
      this.Doctor.planNutritionList.planIsChange = true;
    },
    onOverlimit(quantity, index) {
      Dialog.confirm({
        title: "提示",
        message: "是否删除该产品？"
      })
        .then(() => {
          this.Doctor.planNutritionList.planIsChange = true;
          this.Doctor.planNutritionList.goods.splice(index, 1);
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
    cutCabinet() {
      this.$router.push({
        name: "cabinet"
      });
    },
    submitHandle() {
      if (this.checked && this.type == 0) {
        this.isShowEditDialog = true;
      } else if (this.type == 1) {
        if (this.checked) {
          this.checked &&
            Dialog.confirm({
              title: "提示",
              message: "是否确认对当前方案进行更新保存？"
            })
              .then(() => {
                this.submit();
              })
              .catch(() => {
                this.checked = false;
              });
        } else {
          this.submit();
        }
      } else {
        this.submit();
      }
    },
    submit() {
      if (this.gettotal == "0") {
        Toast("请选择产品后再进行提交");
        return;
      }
      let parData = [];
      this.Doctor.planNutritionList.goods.forEach((v, e) => {
        if (v.quantity !== 0) {
          parData.push({
            specId: v.specificationId,
            quantity: v.quantity,
            dailydose: v.dailydose,
            takingtime: v.takingtime
          });
        }
      });

      let atype,
        type = 0;
      if (this.type == 0) {
        atype = this.Doctor.planNutritionList.planIsChange ? 2 : 4;
        type = this.checked ? 1 : 0;
      } else if (this.type == 1) {
        atype = 3;
        type = this.checked ? 2 : 0;
      } else {
        atype = 1;
        type = this.checked ? 1 : 0;
      }
      if (this.$route.query.nutritionType) {
        type = 0;
        atype = 5;
        this.planId = 0;
      }

      this.$http
        .request({
          method: "post",
          url: "/NNutritionPrescribeGoodsController/saveNutritionPrescribe",
          body: {
            npatientId: this.id,
            deviceId: this.Doctor.planNutritionList.deviceId,
            data: JSON.stringify(parData),
            atype: atype,
            schemeDoctorId: this.planId,
            name: this.planObj.name,
            text: this.planObj.text,
            type: type,
            nptype: this.type == 0 ? 1 : this.type == 1 ? 2 : 3,
            enteralproteincurrent: this.gettotalProteinComponent,
            enteralcarboncurrent: this.gettotalCarbonComponent,
            enteralfatcurrent: this.gettotalFatComponent,
            mealsproteincurrent: this.gettotalProteinAllNutrition,
            mealscarboncurrent: this.gettotalCarbonAllNutrition,
            mealsfatcurrent: this.gettotalFatAllNutrition
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.$store.commit("Doctor/planNutritionList", "");
            this.$router.push({
              name: "diagnosis"
            });
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    }
  }
};
</script>

<style lang="less" scoped>
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  /*导航操作栏上移*/
  .prseempty {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background-color: #f2f2f2;
  }

  .ProductSearch {
    padding-bottom: 75px !important;
  }
}
</style>
<style scoped lang="less">
.ProductSearch {
  width: 100%;
  padding-bottom: 0;
  font-size: 16px;

  /deep/ .van-checkbox {
    height: auto !important;
  }

  .add-product,
  .add-component-product {
    padding: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .v-nextBottom {
      width: 100%;
      height: 34px;
      line-height: 31px;
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
    border-radius: 10px;
    width: 351px;
    margin: 15px auto 0;
    padding: 13px 10px;

    /deep/ .van-checkbox {
      margin: 0;

      .van-icon {
        width: 20px;
        height: 20px;
      }

      .van-checkbox__label {
        font-size: 16px;
        font-weight: 400;
        color: @fontColor33;
        line-height: 20px;
      }
    }
  }
}

.prseempty {
  width: 100%;
  height: 101px;
  background-color: #f2f2f2;
}

.prsebr {
  width: 263px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .van-button {
    margin-left: 70px;
    // width: 70%;
    // height: 90%;
    border-radius: 0;
    color: @fontColorff;
    font-size: 18px;
    font-weight: bold;
    width: 165px;
    height: 44px;
    background: linear-gradient(
      225deg,
      rgba(1, 128, 255, 1) 0%,
      rgba(0, 105, 255, 1) 100%
    );
    border-radius: 10px;
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

    .van-stepper__minus,
    .van-stepper__plus {
      width: 28px;
      height: 18px;
      background: rgba(246, 246, 246, 1);
      border: 0;
      border-radius: 9px;
    }

    .van-stepper__minus::before,
    .van-stepper__plus::before {
      width: 10px;
    }

    .van-stepper__minus--disabled {
      color: #323232;
    }

    .van-stepper__input {
      height: 18px;
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
  font-size: 12px;
  color: @fontColor99;
  line-height: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;

  span {
    margin-right: 15px;
    display: inline-block;
  }
}

.product-store {
  font-size: 12px;
  color: @fontColor66;
  line-height: 14px;

  span {
    color: @mainColor;
  }
}

.prselistrs {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
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
  margin-top: 3px;
  font-weight: bold;
  font-size: 16px;
  color: @fontColor33;
  line-height: 20px;
  display: -webkit-box;
  /*作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 1;
  /*显示的行数；如果要设置2行加...则设置为2*/
  overflow: hidden;
  text-overflow: ellipsis;
  /* 溢出用省略号*/
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /*伸缩盒子的子元素排列：从上到下*/
  /* autoprefixer: on */
}

.prselistr {
  width: 245px;
  height: 120%;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  height: 117px;
  border-bottom: 1px solid @backcolor;
  padding: 20px 10px;
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
    height: 44px;
    text-align: right;
    padding: 15px 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: @fontColor33;
    line-height: 14px;

    span {
      color: @fontColorFF3;
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
}

.prsemm {
  width: 100%;
  height: 63px;
  border-bottom: 1px solid @backcolor;
  padding: 15px 13px;

  /deep/ .van-search,
  .van-cell {
    width: 324px;
    height: 34px;
    padding: 0;
    line-height: 34px;
    font-size: 14px;
    color: @fontColor33;
    border-radius: 6px;
    overflow: hidden;
  }

  .van-search__content {
    width: 315px;
    padding: 0 9px 0 9px;
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
    }
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
    color: @fontColor33;

    span {
      color: @fontColor66;
    }
  }
}

.prsett_foot {
  width: 100%;
  line-height: 26px;
  color: @fontColor33;
  font-size: 16px;
  color: @mainColor;
  text-align: center;
  margin-top: 10px;
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

/*1.13新增营养功能比等*/
.yingyang_lujing {
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 12px;
  margin-bottom: 12px;

  p {
    font-size: 16px;
    font-weight: 400;
    color: @titleColor;
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
        color: @titleColor;
      }

      span.percentage {
        color: @fontColor66;
      }
    }
  }
}

.cell-box-title,
.cell-box-content {
  display: flex;
  justify-content: space-around;
  align-items: center;

  div.first {
    width: 20%;
    justify-content: flex-start;
  }

  div.cellTitle {
    font-size: 14px;
    color: @fontColor66;
  }

  div {
    width: calc(80% / 3);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    color: @titleColor;
  }
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

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .prseb {
    bottom: 34px;
  }
}
</style>