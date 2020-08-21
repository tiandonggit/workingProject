/** *@desc 营养个体化方案(筛查参考) *@author 张松仁 *@date 2019/10/29 16:49:46
*/
<template>
  <div class="screeningReference">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="main">
      <div class="content">
        <div class="content_top">
          <div class="prsett_foot"></div>
          {{Patient.prestype==1?"诊断":"筛查"}}参考
          <div class="prsett_foot">
            <u @click="goNext">更多详情</u>
          </div>
        </div>
        <div class="tag_border"></div>
        <div class="list">
          <div class="list_box" v-if="objData.assessmentbranch !== ''">
            <div class="left">营养风险评分：</div>
            <div class="right all">{{ objData.assessmentbranch }}分</div>
          </div>
          <div class="list_box">
            <div class="left">疾病名称：</div>
            <div class="right illname">{{ objData.illname }}</div>
          </div>
          <div class="list_box">
            <div class="left">身体质量指数（BMI）：</div>
            <div class="right all">{{ objData.bmi }}</div>
          </div>
          <div class="list_box">
            <div class="left">每日能量总需求：</div>
            <div class="right ter">{{ objData.totalenergy }}kcal</div>
          </div>
          <div class="list_box">
            <div class="left">血清白蛋白值(g/L)：</div>
            <div class="right ter">
              {{
                objData.serumalbumin == 0 || objData.serumalbumin == ""
                  ? "无"
                  : objData.serumalbumin
              }}
            </div>
          </div>
          <div class="list_box">
            <div class="left">供能比建议：</div>
            <div class="right pcf">{{ objData.advice }}</div>
          </div>
        </div>
        <!--        <div class="tab">-->
        <!--          <div class="tab_box">-->
        <!--            <div class="bot">营养替代占比</div>-->
        <!--          </div>-->
        <!--          <div class="tab_box">-->
        <!--            <div class="bot" @click="onShowPicker3">-->
        <!--              <van-field v-model="value4" placeholder="请选择" readonly />%：={{-->
        <!--                num-->
        <!--              }}kcal-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="tab">
          <div class="tab_box">
            <div class="top"></div>
            <div class="bot">总供能比</div>
          </div>
          <div class="tab_box">
            <div class="top">蛋白质</div>
            <div class="bot" @click="onShowPicker1('value1')">
              <van-field v-model="value1" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value1) / 100 / 4) }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">碳水化合物</div>
            <div class="bot" @click="onShowPicker1('value2')">
              <van-field v-model="value2" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value2) / 100 / 4) }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">脂肪</div>
            <div class="bot">
              <input
                type="text"
                class="last"
                v-model="value3"
                placeholder="0"
                readonly
              />%
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value3) / 100 / 9) }}g
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab_box">
            <div class="top"></div>
            <div class="bot">营养路径</div>
          </div>
          <div class="tab_box">
            <div class="top">肠外</div>
            <div class="bot" @click="onShowPicker1('value4')">
              <van-field v-model="value4" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value4) / 100) }}kcal
            </div>
          </div>
          <div class="tab_box">
            <div class="top">肠内</div>
            <div class="bot" @click="onShowPicker1('value5')">
              <van-field v-model="value5" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value5) / 100) }}kcal
            </div>
          </div>
          <div class="tab_box">
            <div class="top">膳食</div>
            <div class="bot">
              <input
                type="text"
                class="last"
                v-model="value6"
                placeholder="0"
                readonly
              />%
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value6) / 100) }}kcal
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab_box">
            <div class="top"></div>
            <div class="bot">肠外供能比</div>
          </div>
          <div class="tab_box">
            <div class="top">蛋白质</div>
            <div class="bot" @click="onShowPicker1('value7')">
              <van-field v-model="value7" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value4 * value7) / 40000) }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">碳水化合物</div>
            <div class="bot" @click="onShowPicker1('value8')">
              <van-field v-model="value8" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value4 * value8) / 40000) }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">脂肪</div>
            <div class="bot">
              <input
                type="text"
                class="last"
                v-model="value9"
                placeholder="0"
                readonly
              />%
            </div>
            <div class="num">
              {{ Math.round((objData.totalenergy * value4 * value9) / 90000) }}g
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab_box">
            <div class="top"></div>
            <div class="bot">肠内供能比</div>
          </div>
          <div class="tab_box">
            <div class="top">蛋白质</div>
            <div class="bot" @click="onShowPicker1('value10')">
              <van-field v-model="value10" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{
                Math.round((objData.totalenergy * value5 * value10) / 40000)
              }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">碳水化合物</div>
            <div class="bot" @click="onShowPicker1('value11')">
              <van-field v-model="value11" placeholder="请选择" readonly />%：
            </div>
            <div class="num">
              {{
                Math.round((objData.totalenergy * value5 * value11) / 40000)
              }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">脂肪</div>
            <div class="bot">
              <input
                type="text"
                class="last"
                v-model="value12"
                placeholder="0"
                readonly
              />%
            </div>
            <div class="num">
              {{
                Math.round((objData.totalenergy * value5 * value12) / 90000)
              }}g
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab_box">
            <div class="top"></div>
            <div class="bot">膳食供能比</div>
          </div>
          <div class="tab_box">
            <div class="top">蛋白质</div>
            <div class="bot">
              <input
                type="text"
                class="last"
                v-model="value13"
                placeholder="0"
                readonly
              />%
            </div>
            <div class="num">
              {{
                Math.round((objData.totalenergy * value6 * value13) / 40000)
              }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">碳水化合物</div>
            <div class="bot">
              <input
                type="text"
                class="last"
                v-model="value14"
                placeholder="0"
                readonly
              />%
            </div>
            <div class="num">
              {{
                Math.round((objData.totalenergy * value6 * value14) / 40000)
              }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">脂肪</div>
            <div class="bot">
              <input
                type="text"
                class="last"
                v-model="value15"
                placeholder="0"
                readonly
              />%
            </div>
            <div class="num">
              {{
                Math.round((objData.totalenergy * value6 * value15) / 90000)
              }}g
            </div>
          </div>
        </div>
      </div>
      <van-popup v-model="showPicker1" v-if="showPicker1" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns1"
          @cancel="showPicker1 = false"
          @confirm="onConfirm1"
        />
      </van-popup>

      <div class="foot">
        <van-button type="default" @click="$throttle(onSubmit)"
          >下一步</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { mapState } from "vuex";
export default {
  name: "screeningReference",
  data() {
    return {
      title: "定制成品套餐方案",
      customTitle: "营养方案",
      id: 0,
      value1: "", //蛋白质比例
      value2: "", //碳水化合物比例
      value3: "", //脂肪比例
      value4: "", //肠外
      value5: "", //肠内
      value6: "", //膳食
      value7: "", //肠外蛋白质比例
      value8: "", //肠外碳水化合物比例
      value9: "", //肠外脂肪比例
      value10: "", //肠内蛋白质比例
      value11: "", //肠内碳水化合物比例
      value12: "", //肠内脂肪比例
      value13: "", //膳食蛋白质比例
      value14: "", //膳食碳水化合物比例
      value15: "", //膳食脂肪比例
      str: "", //当前操作的选项
      showPicker1: false, //蛋白质比例滚动是否显示
      showPicker2: false, //碳水化合物比例滚动是否显示
      columns1: [], //
      objData: {
        advice: "",
        nutritionreference: "", //注意事项
        bmi: "",
        dtotalenergy: "",
        illname: "",
        totalenergy: ""
      }
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.id = sessionStorage.getItem("id");
    this.$route.query.type == 0
      ? "系统推荐套餐方案"
      : this.$route.query.type == 1
      ? "医生经验套餐方案"
      : "定制成品套餐方案";
    this.selectKey();
    if (this.Doctor.proportion.proteinratio != undefined) {
      //进行赋值
      this.value1 = this.Doctor.proportion.proteinratio;
      this.value2 = this.Doctor.proportion.carbonratio;
      this.value3 = this.Doctor.proportion.fatratio;
      this.value4 = this.Doctor.proportion.parenteralratio;
      this.value5 = this.Doctor.proportion.enteralratio;
      this.value6 = this.Doctor.proportion.mealsratio;
      this.value7 = this.Doctor.proportion.parenteralproteinratio;
      this.value8 = this.Doctor.proportion.parenteralcarbonratio;
      this.value9 = this.Doctor.proportion.parenteralfatratio;
      this.value10 = this.Doctor.proportion.enteralproteinratio;
      this.value11 = this.Doctor.proportion.enteralcarbonratio;
      this.value12 = this.Doctor.proportion.enteralfatratio;
      this.value13 = this.Doctor.proportion.mealsproteinratio;
      this.value14 = this.Doctor.proportion.mealscarbonratio;
      this.value15 = this.Doctor.proportion.mealsfatratio;
      console.log("fuzhijieshu")
    }
    console.log(this.value1,this.value2,this.value3,this.value4,this.value5,this.value6,this.value7,this.value14,)
  },
  computed: {
    ...mapState(["Doctor"]),
    ...mapState(["Patient"]),
    num() {
      return (this.objData.totalenergy * this.value4) / 100;
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
    onShowPicker1(str) {
      //点击输入框事件
      let keys = true;
      let num = str.split("e")[1];
      if (num > 6) {
        //点击了大于6的了,判断下小于等于6的是否都已经设置值了
        for (let i = 1; i < 7; i++) {
          if (this["value" + i] === "") {
            keys = false;
            this.$toast("请先设置总共能比与营养路径");
            break;
          }
        }
      }
      new Promise((resolve, reject) => {
        //根据对应的字段更改当前的范围值
        console.log(num, "num");
        let res = {
          max: 100,
          min: 0
        };
        switch (num) {
          case "1":
            res.max = res.max - this.value2;
            break;
          case "2":
            res.max = res.max - this.value1;
            break;
          case "4":
            res.max = res.max - this.value5;
            break;
          case "5":
            res.max = res.max - this.value4;
            break;
          case "7":
            if (this.value1 === 0 || this.value4 === 0) {
              res.min = 0;
              res.max = 0;
            } else {
              res.max =
                this.value4 - (this.value8 * this.value4) / 100 >
                this.value1 - (this.value10 * this.value5) / 100
                  ? Math.floor(
                      ((this.value1 - (this.value10 * this.value5) / 100) /
                        this.value4) *
                        100
                    )
                  : Math.floor(
                      ((this.value4 - (this.value8 * this.value4) / 100) /
                        this.value4) *
                        100
                    );
              res.min =
                this.value4 -
                  (this.value8 === ""
                    ? this.value2
                    : (this.value8 * this.value4) / 100) -
                  (this.value3 -
                    (this.value12 * this.value5) / 100 -
                    (this.value15 * this.value6) / 100) >
                this.value1 -
                  (this.value10 === ""
                    ? this.value5
                    : (this.value10 * this.value5) / 100) -
                  this.value6
                  ? Math.floor(
                      ((this.value4 -
                        (this.value8 === ""
                          ? this.value2
                          : (this.value8 * this.value4) / 100) -
                        (this.value3 -
                          (this.value12 * this.value5) / 100 -
                          (this.value15 * this.value6) / 100)) /
                        this.value4) *
                        100
                    ) >= 0
                    ? Math.floor(
                        ((this.value4 -
                          (this.value8 === ""
                            ? this.value2
                            : (this.value8 * this.value4) / 100) -
                          (this.value3 -
                            (this.value12 * this.value5) / 100 -
                            (this.value15 * this.value6) / 100)) /
                          this.value4) *
                          100
                      )
                    : 0
                  : Math.round(
                      ((this.value1 -
                        (this.value10 === ""
                          ? this.value5
                          : (this.value10 * this.value5) / 100) -
                        this.value6) /
                        this.value4) *
                        100
                    ) >= 0
                  ? Math.round(
                      ((this.value1 -
                        (this.value10 === ""
                          ? this.value5
                          : (this.value10 * this.value5) / 100) -
                        this.value6) /
                        this.value4) *
                        100
                    )
                  : 0;
            }
            break;
          case "8":
            if (this.value2 === 0 || this.value4 === 0) {
              res.min = 0;
              res.max = 0;
            } else {
              res.max =
                this.value4 - (this.value7 * this.value4) / 100 >
                this.value2 - (this.value11 * this.value5) / 100
                  ? Math.floor(
                      ((this.value2 - (this.value11 * this.value5) / 100) /
                        this.value4) *
                        100
                    )
                  : Math.floor(
                      ((this.value4 - (this.value7 * this.value4) / 100) /
                        this.value4) *
                        100
                    );
              res.min =
                this.value4 -
                  (this.value7 === ""
                    ? this.value1
                    : (this.value7 * this.value4) / 100) -
                  (this.value3 -
                    (this.value12 * this.value5) / 100 -
                    (this.value15 * this.value6) / 100) >
                this.value2 -
                  (this.value11 === ""
                    ? this.value5
                    : (this.value11 * this.value5) / 100) -
                  this.value6
                  ? Math.floor(
                      ((this.value4 -
                        (this.value7 === ""
                          ? this.value1
                          : (this.value7 * this.value4) / 100) -
                        (this.value3 -
                          (this.value12 * this.value5) / 100 -
                          (this.value15 * this.value6) / 100)) /
                        this.value4) *
                        100
                    ) >= 0
                    ? Math.floor(
                        ((this.value4 -
                          (this.value7 === ""
                            ? this.value1
                            : (this.value7 * this.value4) / 100) -
                          (this.value3 -
                            (this.value12 * this.value5) / 100 -
                            (this.value15 * this.value6) / 100)) /
                          this.value4) *
                          100
                      )
                    : 0
                  : Math.round(
                      ((this.value2 -
                        (this.value11 === ""
                          ? this.value5
                          : (this.value11 * this.value5) / 100) -
                        this.value6) /
                        this.value4) *
                        100
                    ) >= 0
                  ? Math.round(
                      ((this.value2 -
                        (this.value11 === ""
                          ? this.value5
                          : (this.value11 * this.value5) / 100) -
                        this.value6) /
                        this.value4) *
                        100
                    )
                  : 0;
            }

            break;
          case "10":
            if (this.value1 === 0 || this.value5 === 0) {
              res.min = 0;
              res.max = 0;
            } else {
              res.max =
                this.value5 - (this.value11 * this.value5) / 100 >
                this.value1 - (this.value7 * this.value4) / 100
                  ? Math.floor(
                      ((this.value1 - (this.value7 * this.value4) / 100) /
                        this.value5) *
                        100
                    )
                  : Math.floor(
                      ((this.value5 - (this.value11 * this.value5) / 100) /
                        this.value5) *
                        100
                    );
              res.min =
                this.value5 -
                  (this.value11 === ""
                    ? this.value2
                    : (this.value11 * this.value5) / 100) -
                  (this.value3 -
                    (this.value9 * this.value4) / 100 -
                    (this.value15 * this.value6) / 100) >
                this.value1 -
                  (this.value7 === ""
                    ? this.value4
                    : (this.value7 * this.value4) / 100) -
                  this.value6
                  ? Math.floor(
                      ((this.value5 -
                        (this.value11 === ""
                          ? this.value2
                          : (this.value11 * this.value5) / 100) -
                        (this.value3 -
                          (this.value9 * this.value4) / 100 -
                          (this.value15 * this.value6) / 100)) /
                        this.value5) *
                        100
                    ) >= 0
                    ? Math.floor(
                        ((this.value5 -
                          (this.value11 === ""
                            ? this.value2
                            : (this.value11 * this.value5) / 100) -
                          (this.value3 -
                            (this.value9 * this.value4) / 100 -
                            (this.value15 * this.value6) / 100)) /
                          this.value5) *
                          100
                      )
                    : 0
                  : Math.floor(
                      ((this.value1 -
                        (this.value7 === ""
                          ? this.value4
                          : (this.value7 * this.value4) / 100) -
                        this.value6) /
                        this.value5) *
                        100
                    ) >= 0
                  ? Math.floor(
                      ((this.value1 -
                        (this.value7 === ""
                          ? this.value4
                          : (this.value7 * this.value4) / 100) -
                        this.value6) /
                        this.value5) *
                        100
                    )
                  : 0;
            }

            break;
          case "11":
            if (this.value2 === 0 || this.value5 === 0) {
              res.min = 0;
              res.max = 0;
            } else {
              res.max =
                this.value5 - (this.value10 * this.value5) / 100 >
                this.value2 - (this.value8 * this.value4) / 100
                  ? Math.floor(
                      ((this.value2 - (this.value8 * this.value4) / 100) /
                        this.value5) *
                        100
                    )
                  : Math.floor(
                      ((this.value5 - (this.value10 * this.value5) / 100) /
                        this.value5) *
                        100
                    );
              res.min =
                this.value5 -
                  (this.value10 === ""
                    ? this.value1
                    : (this.value10 * this.value5) / 100) -
                  (this.value3 -
                    (this.value9 * this.value4) / 100 -
                    (this.value15 * this.value6) / 100) >
                this.value2 -
                  (this.value8 === ""
                    ? this.value4
                    : (this.value8 * this.value4) / 100) -
                  this.value6
                  ? Math.floor(
                      ((this.value5 -
                        (this.value10 === ""
                          ? this.value1
                          : (this.value10 * this.value5) / 100) -
                        (this.value3 -
                          (this.value9 * this.value4) / 100 -
                          (this.value15 * this.value6) / 100)) /
                        this.value5) *
                        100
                    ) >= 0
                    ? Math.floor(
                        ((this.value5 -
                          (this.value10 === ""
                            ? this.value1
                            : (this.value10 * this.value5) / 100) -
                          (this.value3 -
                            (this.value9 * this.value4) / 100 -
                            (this.value15 * this.value6) / 100)) /
                          this.value5) *
                          100
                      )
                    : 0
                  : Math.round(
                      ((this.value2 -
                        (this.value8 === ""
                          ? this.value4
                          : (this.value8 * this.value4) / 100) -
                        this.value6) /
                        this.value5) *
                        100
                    ) >= 0
                  ? Math.round(
                      ((this.value2 -
                        (this.value8 === ""
                          ? this.value4
                          : (this.value8 * this.value4) / 100) -
                        this.value6) /
                        this.value5) *
                        100
                    )
                  : 0;
            }

            break;
        }
        console.log(res);
        this.columns1 = [];
        if( res.min > res.max ) {
          this.columns1.push({
            text: res.min,
            disabled: false
          });
        } else {
          for (let i = res.min; i <= res.max; i++) {
            this.columns1.push({
              text: i,
              disabled: false
            });
          }
        }

        resolve();
      }).then(() => {
        if (keys) {
          this.str = str;
          this.showPicker1 = true;
        }
      });
    },
    onConfirm1(value) {
      // console.log(value);
      this[this.str] = value.text;
      let num = this.str.split("e")[1];
      if (num < 7) {
        this.clear();
      }
      this.showPicker1 = false;
    },
    onSubmit() {
      let keys = true;
      //点击了大于6的了,判断下小于等于6的是否都已经设置值并且值不为负了
      for (let i = 1; i <= 15; i++) {
        if (this["value" + i] === "" || this["value" + i] < 0) {
          keys = false;
          this.$toast("请填写完整并且所有值都大于或等于0");
          break;
        }
      }
      if (keys) {
        this.$http
          .request({
            method: "post",
            url: "/NNutritionPrescribePatientController/upodatePatient",
            body: {
              id: this.id,
              pcfprotein: this.value1,
              pcfcarbohydrate: this.value2,
              pcffat: this.value3,
              parenteralratio: this.value4,
              enteralratio: this.value5,
              mealsratio: this.value6,
              parenteralproteinratio: this.value7,
              parenteralcarbonratio: this.value8,
              parenteralfatratio: this.value9,
              enteralproteinratio: this.value10,
              enteralcarbonratio: this.value11,
              enteralfatratio: this.value12,
              mealsproteinratio: this.value13,
              mealscarbonratio: this.value14,
              mealsfatratio: this.value15
            }
          })
          .then(res => {
            console.log(res.data);
            if (res.data.success) {
              //成功跳转下一页
              this.$store.commit("Doctor/planNutritionList", "");
              if (this.$route.query.type == 2) {
                this.$router.push({
                  path: "/ProductSearch",
                  query: { type: this.$route.query.type }
                });
              } else {
                this.$router.push({
                  path: "/ProductSearch",
                  query: {
                    type: this.$route.query.type,
                    id: this.Doctor.proportion.id
                  }
                });
              }
            } else {
              //失败
              this.$toast(res.data.total);
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      }
    },
    selectKey() {
      // return;
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeDepartmentPatientController/selectKey",
          body: {
            id: this.id
          }
        })
        .then(res => {
          console.log(res.data.data);
          this.objData = res.data.data;
          // if (
          //   res.data.data.protein &&
          //   res.data.data.carbohydrate &&
          //   res.data.data.fat
          // ) {
          //   this.value1 = res.data.data.protein;
          //   this.value2 = res.data.data.carbohydrate;
          //   this.value3 = res.data.data.fat;
          // }
          this.$store.commit(
            "Patient/attention",
            res.data.data.nutritionreference
              ? res.data.data.nutritionreference
              : "无"
          );
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    clear() {
      //更改功能比或营养路径要清空肠内肠外和膳食
      for (let i = 7; i < 19; i++) {
        this["value" + i] = "";
      }
    }
  },
  watch: {
    value1(val) {
      console.log("value1改变", val);

      if (this.value1 !== "" && this.value2 !== "") {
        this.value3 = 100 - this.value1 - this.value2;
      }

    },
    value2(val) {
      console.log("value2改变", val);

      if (this.value1 !== "" && this.value2 !== "") {
        this.value3 = 100 - this.value1 - this.value2;
      }

    },
    value4(val) {
      console.log("value4改变", val);

      if (this.value4 !== "" && this.value5 !== "") {
        this.value6 = 100 - this.value4 - this.value5;
      }

    },
    value5(val) {
      console.log("value5改变", val);

      if (this.value4 !== "" && this.value5 !== "") {
        this.value6 = 100 - this.value4 - this.value5;
      }

    },
    value7(val) {
      console.log("value7改变", val);
      if (this.value7 !== "" && this.value8 !== "") {
        if (this.value4 === 0) {
          this.value9 = 0;
        } else {
          this.value9 = 100 - this.value7 - this.value8;
        }
      }
      if (this.value7 !== "" && this.value10 !== "") {
        if (this.value1 === 0 || this.value3 === 0) {
          this.value13 = 0;
        } else {
          this.value13 =
            this.value6 == 0
              ? 0
              : Math.round(
                  ((this.value1 -
                    (this.value7 * this.value4) / 100 -
                    (this.value10 * this.value5) / 100) /
                    this.value6) *
                    100
                );
        }
      }
    },
    value8(val) {
      console.log("value8改变", val);
      if (this.value7 !== "" && this.value8 !== "") {
        if (this.value4 === 0) {
          this.value9 = 0;
        } else {
          this.value9 = 100 - this.value7 - this.value8;
        }
      }
      if (this.value8 !== "" && this.value11 !== "") {
        if (this.value2 === 0) {
          this.value14 = 0;
        } else {
          this.value14 =
            this.value6 == 0
              ? 0
              : Math.round(
                  ((this.value2 -
                    (this.value8 * this.value4) / 100 -
                    (this.value11 * this.value5) / 100) /
                    this.value6) *
                    100
                );
        }
        // console.log(this.value2, "value2");
        // console.log(this.value6, "value6");
        // console.log(
        //   (this.value8 / 100) * this.value4,
        //   "this.value8/100*this.value4"
        // );
        // console.log(
        //   (this.value11 * this.value5) / 100,
        //   "this.value11*this.value5/100"
        // );
        // console.log(
        //   (this.value11 * this.value5) / 100,
        //   "this.value11*this.value5/100"
        // );
        // console.log(this.value14, "value14");
      }
    },
    value10(val) {
      console.log("value10改变", val);
      if (this.value10 !== "" && this.value11 !== "") {
        if (this.value5 === 0) {
          this.value12 = 0;
        } else {
          this.value12 = 100 - this.value10 - this.value11;
        }
      }
      if (this.value7 !== "" && this.value10 !== "") {
        if (this.value1 === 0) {
          this.value13 = 0;
        } else {
          this.value13 =
            this.value6 == 0
              ? 0
              : Math.round(
                  ((this.value1 -
                    (this.value7 * this.value4) / 100 -
                    (this.value10 * this.value5) / 100) /
                    this.value6) *
                    100
                );
        }
      }
    },
    value11(val) {
      console.log("value11改变", val);
      if (this.value10 !== "" && this.value11 !== "") {
        if (this.value5 === 0) {
          this.value12 = 0;
        } else {
          this.value12 = 100 - this.value10 - this.value11;
        }
      }
      if (this.value8 !== "" && this.value11 !== "") {
        if (this.value2 === 0) {
          this.value14 = 0;
        } else {
          this.value14 =
            this.value6 == 0
              ? 0
              : Math.round(
                  ((this.value2 -
                    (this.value8 * this.value4) / 100 -
                    (this.value11 * this.value5) / 100) /
                    this.value6) *
                    100
                );
        }
      }
    },
    value13(val) {
      console.log("value13改变", val);
      if (this.value13 !== "" && this.value14 !== "") {
        this.value15 = 100 - this.value13 - this.value14;
      }
    },
    value14(val) {
      console.log("value14改变", val);
      if (this.value13 !== "" && this.value14 !== "") {
        this.value15 = 100 - this.value13 - this.value14;
      }
    }
  }
};
</script>

<style scoped lang="less">
.screeningReference {
  .main {
    padding: 58px 12px 20px;

    .content {
      background: @backgroundColorff;
      border-radius: 10px;
      .tag_border {
        width: 100%;
        margin-top: 14px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .content_top {
        div {
          width: 33.3%;
        }
        display: flex;
        justify-content: space-between;
        padding: 20px 10px 0;
        text-align: center;
        font-size: 16px;
        color: @fontColor33;
        line-height: 22px;
        font-weight: bold;
        .prsett_foot {
          color: @fontColor33;
          font-size: 16px;
          color: @mainColor;
          text-align: right;
          float: right;
        }
      }
      .list {
        padding: 15px 10px 0;
        border-bottom: 1px dashed @boederColorF1;
        font-size: 14px;
        line-height: 20px;
        color: @fontColor33;
        .list_box {
          padding-bottom: 15px;
          display: flex;
          flex-wrap: nowrap;
          .left {
            font-weight: bold;
          }
          .right {
            display: flex;
            flex-wrap: wrap;
            padding-left: 5px;
          }
          .illname {
            max-width: 260px;
          }
          .all {
            max-width: 230px;
          }
          .ter {
            max-width: 130px;
          }
          .pcf {
            max-width: 230px;
          }
        }
      }
      .tab {
        display: flex;
        padding: 15px 10px;
        color: @fontColor33;
        border-bottom: 1px dashed #f1f1f1;
        font-size: 14px;
        &:last-child {
          border-bottom: 0;
        }
        .tab_box {
          flex: 1;
          /deep/ input {
            color: @fontColorAA;
          }
          text-align: center;
          padding-left: 10px;
        }
        .top {
          font-weight: bold;
          height: 30px;
          line-height: 20px;
          padding: 0 0 10px 0;
        }
        .bot {
          font-weight: bold;
          line-height: 25px;
          height: 25px;
          /*padding-left: 10px;*/
          input {
            text-align: center;
            width: 45px;
            height: 23px;
            font-weight: 400;
            padding: 0px;
          }
          display: flex;
          .van-cell {
            padding: 0;
            width: 45px;
            border: 1px solid @boederColorF1;
            /deep/ input {
              text-align: center;
            }
          }
          .last {
            border: 0;
          }
        }
        .num {
          padding-top: 4px;
        }
      }
    }
    .foot {
      padding-top: 20px;
      button {
        border-radius: 6px;
        width: 351px;
        height: 44px;
        line-height: 44px;
        color: @fontColorff;
      }
    }
    .van-popup {
      .van-picker {
        /deep/.van-picker__cancel,
        .van-picker__confirm {
          color: #000;
        }
        /deep/.van-picker__columns {
          ul {
            li {
              color: @mainColor;
              height: 58px;
              font-size: 34px;
            }
          }
        }
      }
    }
  }
}
</style>
