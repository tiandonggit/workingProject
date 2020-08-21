<!--
  作者:许鹏
  用途:营养诊断结果
  -------------------
  Created by webStorm
  User: xp
  Date: 2019年10月29日
  Time: 17:50
  Application: Nutrition diagnostic results
  State: page
-->
<template>
  <div id="results">
    <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="true"
        :title="title"
    ></commonHeader>

    <div class="top_kong"></div>
    <div class="pass_tag">
      <div class="pass_title"><span class="span_kong"></span>患者信息</div>
      <div class="tag_border"></div>
      <div class="tag">
        <div class="tag_n">
          <span class="nr"
          >姓名:<span class="z">{{ person_info.name }}</span></span
          ><span class="nr"
        >电话:<span class="z">{{ person_info.nphone }}</span></span
        >
        </div>
        <div class="tag_n">
          <span class="nr"
          >年龄:<span class="z">{{ person_info.age }}岁</span></span
          >
          <span class="nr"
          >性别:<span class="z">
              {{ person_info.sex == 1 ? "男" : "女" }}
            </span></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
          >身高:<span class="z"
          >{{
                person_info.height ? parseInt(person_info.height * 100) : "0"
              }}cm</span
          ></span
          ><span class="nr"
        >体重:<span class="z">{{ person_info.weight }}kg</span></span
        >
        </div>
        <div class="tag_n">
          <div class="tag_feed">
            既往疾病史:
            <div class="z">
              {{ person_info.pasthistory ? person_info.pasthistory : "无" }}
            </div>
          </div>
        </div>
        <div class="tag_n">
          <div class="tag_feed">
            既往过敏史:
            <div class="z">
              {{
              person_info.allergyhistory ? person_info.allergyhistory : "无"
              }}
            </div>
          </div>
        </div>
        <div class="tag_n">
          <span>{{Patient.prestype==0?"筛查":"诊断"}}时间:<span class="z">{{ person_info.createtime }}</span></span>
        </div>
      </div>
    </div>
    <div class="information">
      <div class="information_title">
        <div class="span_kong"></div>
        {{Patient.prestype==0?"筛查信息":"诊断信息"}}
        <div class="information_details" @click="go_details">更多详情</div>
      </div>
      <div class="tag_border"></div>
      <div class="tag">
        <div class="tag_n" v-if="Patient.prestype != 1">
          <span class="nr"
          >营养风险评分:<span class="z"
          >{{ disease_info.assessmentbranch }}分</span
          ></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
          >疾病名称:<span class="z">{{ disease_info.illname }}</span></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
          >身体质量指数（BMI）:<span class="z">{{
              disease_info.bmi
            }}</span></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
          >每日能量需求:<span class="z"
          >{{ disease_info.totalenergy }}kcal</span
          ></span
          >
        </div>
        <div
            class="tag_n"
            v-if="disease_info.dtotalenergy && disease_info.dtotalenergy != 0"
        >
          <span class="nr"
          >营养替代能量:<span class="z"
          >{{ disease_info.dtotalenergy }}kcal</span
          ></span
          >
        </div>
        <div class="tag_n">
          <span class="nr"
          >血清白蛋白浓度:<span class="z">{{
              disease_info.serumalbumin
                ? disease_info.serumalbumin + "g/L"
                : "无"
            }}</span></span
          >
        </div>
        <!--        <div class="tag_n" v-if="person_info.pcfprotein != 0 || person_info.pcffat !=0 || person_info.pcfcarbohydrate != 0">-->
        <!--          <span class="nr"-->
        <!--            >供能比参考:<span class="z"-->
        <!--              >{{ person_info.pcfprotein }}%蛋白质：{{-->
        <!--                person_info.pcffat-->
        <!--              }}%脂肪：{{ person_info.pcfcarbohydrate }}%碳水化合物</span-->
        <!--            ></span-->
        <!--          >-->
        <!--        </div>-->
        <div class="tab">
          <div class="tab_box">
            <div class="top"></div>
            <div class="bot">总供能比</div>
          </div>
          <div class="tab_box">
            <div class="top">蛋白质</div>
            <div class="bot" @click="onShowPicker1('value1')">
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value1"
              />%：
            </div>
            <div class="num">
              {{ Math.round((disease_info.totalenergy * value1) / 100 / 4) }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="top">碳水化合物</div>
            <div class="bot" @click="onShowPicker1('value2')">
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value2"
              />%：
            </div>
            <div class="num">
              {{ Math.round((disease_info.totalenergy * value2) / 100 / 4) }}g
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
              {{ Math.round((disease_info.totalenergy * value3) / 100 / 9) }}g
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
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value4"
              />%：
            </div>
            <div class="num">
              {{ Math.round((disease_info.totalenergy * value4) / 100) }}kcal
            </div>
          </div>
          <div class="tab_box">
            <div class="top">肠内</div>
            <div class="bot" @click="onShowPicker1('value5')">
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value5"
              />%：
            </div>
            <div class="num">
              {{ Math.round((disease_info.totalenergy * value5) / 100) }}kcal
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
              {{ Math.round((disease_info.totalenergy * value6) / 100) }}kcal
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab_box">
            <div class="bot">肠外供能比</div>
          </div>
          <div class="tab_box">
            <div class="bot" @click="onShowPicker1('value7')">
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value7"
              />%：
            </div>
            <div class="num">
              {{
              Math.round(
              (disease_info.totalenergy * value4 * value7) / 40000
              )
              }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="bot" @click="onShowPicker1('value8')">
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value8"
              />%：
            </div>
            <div class="num">
              {{
              Math.round(
              (disease_info.totalenergy * value4 * value8) / 40000
              )
              }}g
            </div>
          </div>
          <div class="tab_box">
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
              {{
              Math.round(
              (disease_info.totalenergy * value4 * value9) / 90000
              )
              }}g
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab_box">
            <div class="bot">肠内供能比</div>
          </div>
          <div class="tab_box">
            <div class="bot" @click="onShowPicker1('value10')">
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value10"
              />%：
            </div>
            <div class="num">
              {{
              value16
              }}g
            </div>
          </div>
          <div class="tab_box">
            <div class="bot" @click="onShowPicker1('value11')">
              <input
                  type="text"
                  class="last"
                  placeholder="0"
                  readonly
                  v-model="value11"
              />%：
            </div>
            <div class="num">
              {{
              value17
              }}g
            </div>
          </div>
          <div class="tab_box">
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
              value18
              }}g
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab_box">
            <div class="bot">膳食供能比</div>
          </div>
          <div class="tab_box">
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
              value19
              }}g
            </div>
          </div>
          <div class="tab_box">
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
              value20
              }}g
            </div>
          </div>
          <div class="tab_box">
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
              value21
              }}g
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="presentation">
      <div class="pre_title" v-if="lsa.length != 0">
        <span class="span_kong"></span>所需营养素
      </div>
      <div class="tag_border" v-if="lsa.length != 0"></div>
      <div class="table_box" v-if="lsa.length != 0">
        <table v-if="lsa.length != 0">
          <tr class="tou">
            <th>类型</th>
            <th>摄入种类</th>
          </tr>
          <tr v-for="(item, index) in lsa" :key="index">
            <td class="bor">
              <div class="xzyh">{{ item.pname }}</div>
            </td>
            <td class="even">
              <div class="xzyh">{{ item.propetynames }}</div>
            </td>
          </tr>
        </table>
      </div>

      <div class="column_box" v-if="lsb.length != 0"></div>
      <div class="pre_title" v-if="lsb.length != 0">
        <span class="span_kong"></span>
        膳食纤维与益生菌
      </div>
      <div class="tag_border" v-if="lsb.length != 0"></div>
      <div class="table_box" v-if="lsb.length != 0">
        <table>
          <tr class="tou">
            <th>所需类型</th>
            <th>建议摄入量</th>
          </tr>
          <tr v-for="(item, index) in lsb" :key="index">
            <td class="bor">
              <div class="xzyh">{{ item.pname }}</div>
            </td>
            <td class="even">
              <div class="xzyh">{{ item.propetynames }}</div>
            </td>
          </tr>
        </table>
      </div>

      <div class="column_box" v-if="lsc.length != 0"></div>
      <div class="pre_title" v-if="lsc.length != 0">
        <span class="span_kong"></span>
        营养颗粒补充
      </div>
      <div class="tag_border" v-if="lsc.length != 0"></div>
      <div class="table_box" v-if="lsc.length != 0">
        <table>
          <tr class="tou">
            <th>所需类型</th>
            <th>建议摄入量</th>
          </tr>
          <tr v-for="(item, index) in lsc" :key="index">
            <td class="bor">
              <div class="xzyh">{{ item.pname }}</div>
            </td>
            <td class="even">
              <div class="xzyh">{{ item.propetynames }}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- <div class="pre_title"><span class="span_kong"></span>膳食摄入量</div>
<div class="tag_border"></div>
<div class="table_box" >
      <table>
        <tr class="tou">
          <th>所需类型</th>
          <th>建议摄入量</th>
        </tr>
        <tr>
          <td class="bor">
            <div class="xzyh">33333</div>
          </td>
          <td class="even">
            <div class="xzyh">44444444</div>
          </td>
        </tr>
      </table>
    </div> -->
    </div>

    <div class="screening_doctors">
      <div class="information_title">
        <div class="span_kong"></div>
        {{Patient.prestype==0?"筛查":"诊断"}}发起人
      </div>
      <div class="tag_border"></div>
      <div class="tag">
        <div class="tag_n">
          <span class="nr"
          >姓名:<span class="z">{{ doctorInfo.docName }}</span></span
          >
          <span class="nr"
          >类型:<span class="z">{{
              person_info.usertype == "1" ? "医生" : "用户"
            }}</span></span
          >
        </div>

        <div class="tag_n" v-if="person_info.usertype == '1'">
          <span class="nr"
          >科室:<span class="z">{{ doctorInfo.depName }}</span></span
          >
          <span class="nr"
          >职称:<span class="z">{{ doctorInfo.titleName }}</span></span
          >
        </div>
        <div class="tag_n" v-if="person_info.usertype == '1'">
          <span class="nrl"
          >医院:<span class="z">{{ doctorInfo.hosName }}</span></span
          >
        </div>
      </div>
    </div>

    <div class="presentation">
      <div class="pre_title"><span class="span_kong"></span>营养参考建议</div>
      <div class="tag_border"></div>
      <div class="pre_nr">
        {{
        disease_info.nutritionreference
        ? disease_info.nutritionreference
        : "无"
        }}
      </div>
      <div class="pre_nr_zw"></div>
    </div>

    <div class="bottom-menu-fixed pre_nr_out" @click="$throttle(lookCommen)">
      营养产品推荐<span class="look">点击查看 <van-icon name="arrow"/></span>
    </div>
  </div>
</template>

<script>
  import commonHeader from "@/components/commonHeader/common_header.vue";
  import {Toast} from "vant";
  import {mapState} from "vuex";

  export default {
    name: "results",
    computed: {
      ...mapState(["Patient"])
    },
    data() {
      return {
        title: "营养方案详情",
        customTitle: "营养方案",
        person_info: {},
        disease_info: {},
        list: [],
        count: 0,
        lsa: [],
        lsb: [],
        lsc: [],
        doctorInfo: {},
        lowerdoctorid: "0",
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
        examineState: "" // 营养处方审核状态
      };
    },
    components: {
      commonHeader
    },
    created() {
      if (this.$route.query.id) {
        window.sessionStorage.setItem("id", this.$route.query.id);
      }
      if (window.sessionStorage.getItem("terminal") == 1) {
        this.customTitle = "营养方案审核";
      }
      if (!window.sessionStorage.getItem("id")) {
        Toast("当前处方不存在");
      } else {
        this.showlist();
      }
      console.log(this.lsa);
      this.examineState = this.$route.query.type || "";
    },
    methods: {
      //跳转至查看详情
      go_details() {
        this.$router.push({
          name: "details"
        });
        // //判断进入路径  0:医生端 1:营养师端
        // if(this.$route.query.terminal=='0'){
        // }else{
        //   this.$router.push({
        //     name: "details",
        //   });
        // }
      },
      //展示数据
      showlist() {
        this.$http
          .request({
            method: "get",
            url: "/NNutritionPrescribePatientController/selectAll",
            body: {
              id: window.sessionStorage.getItem("id")
              // id: "516955081824932928"
            }
          })
          .then(res => {
            console.log(res);
            this.Patient.prestype =
              res.data.data.nNutritionPrescribePatient.prestype;
            this.person_info = res.data.data.nNutritionPrescribePatient;
            this.disease_info = res.data.data.instance;
            this.lsa = res.data.data.lsita;
            this.lsb = res.data.data.lsitb;
            // this.lsc = res.data.data.lsitc;
            this.lowerdoctorid =
              res.data.data.nNutritionPrescribePatient.doctorid;
            // console.log(this.lowerdoctorid);
            this.screeningDoctor(this.lowerdoctorid);
            this.value1 = res.data.data.nNutritionPrescribePatient.pcfprotein;
            this.value2 = res.data.data.nNutritionPrescribePatient.pcfcarbohydrate;
            this.value3 = res.data.data.nNutritionPrescribePatient.pcffat;
            this.value4 = res.data.data.nNutritionPrescribePatient.parenteralratio;
            this.value5 = res.data.data.nNutritionPrescribePatient.enteralratio;
            this.value6 = res.data.data.nNutritionPrescribePatient.mealsratio;
            this.value7 = res.data.data.nNutritionPrescribePatient.parenteralproteinratio;
            this.value8 = res.data.data.nNutritionPrescribePatient.parenteralcarbonratio;
            this.value9 = res.data.data.nNutritionPrescribePatient.parenteralfatratio;
            this.value10 = res.data.data.nNutritionPrescribePatient.enteralproteinratio;
            this.value11 = res.data.data.nNutritionPrescribePatient.enteralcarbonratio;
            this.value12 = res.data.data.nNutritionPrescribePatient.enteralfatratio;
            this.value13 = res.data.data.nNutritionPrescribePatient.mealsproteinratio;
            this.value14 = res.data.data.nNutritionPrescribePatient.mealscarbonratio;
            this.value15 = res.data.data.nNutritionPrescribePatient.mealsfatratio;
            this.value16 = res.data.data.nNutritionPrescribePatient.enteralproteincurrent;
            this.value17 = res.data.data.nNutritionPrescribePatient.enteralcarboncurrent;
            this.value18 = res.data.data.nNutritionPrescribePatient.enteralfatcurrent;
            this.value19 = res.data.data.nNutritionPrescribePatient.mealsproteincurrent;
            this.value20 = res.data.data.nNutritionPrescribePatient.mealscarboncurrent;
            this.value21 = res.data.data.nNutritionPrescribePatient.mealsfatcurrent;

            // this.list = res.data.data.prescriptionProductInfo;
            // this.count = res.data.data.productCount;
          })
          .catch(() => {
            Toast("接口异常");
          });
      },
      //页面跳转
      lookCommen() {
        if (this.$route.query.state == 1) {
          this.$router.push({
            name: "confirmOrder",
            query: {
              state: this.$route.query.state
            }
          });
        } else if (this.examineState) {
          let score = this.disease_info.assessmentbranch || "";
          localStorage.setItem("score", score);
          this.$router.push({
            name: "confirmOrder",
            query: {
              state: this.examineState,
              from: this.$route.query.from
            }
          });
        } else {
          this.$http
            .request({
              method: "get",
              url: "/NNutritionPrescribePatientController/selectByPrimaryKeyId",
              body: {
                id: window.sessionStorage.getItem("id")
                // id: "455106805983481857"
              }
            })
            .then(res => {
              if (res.data.data.departmentid) {
                this.$store.commit(
                  "Patient/saveOrderId",
                  res.data.data.departmentid
                );
                this.$router.push({
                  name: "orderDetail"
                });
              } else {
                this.$router.push({
                  name: "confirmOrder"
                });
              }
            })
            .catch(() => {
              Toast("接口异常");
            });
        }
      },
      //获取筛查医生信息
      screeningDoctor(id) {
        this.$http
          .request({
            method: "get",
            url: "/RDoctorController/selectDoctor",
            body: {
              id: id
              // id: "455106805983481857"
            }
          })
          .then(res => {
            console.log(res.data);
            console.log(res.data.data.data);
            this.doctorInfo = res.data.data.data;
          })
          .catch(() => {
            Toast("接口异常");
          });
      }
    }
  };
</script>

<style scoped lang="less">
  #results {
    .padding(0, 0, 20, 0);
    -webkit-overflow-scrolling: touch;
    background: @backcolor;

    .top_kong {
      width: 100%;
      height: 48px;
    }

    .pass_tag {
      /*.margin(20, 0, 0, 0);*/
      .padding(10, 0, 0, 0);
      width: 100%;

      .pass_title {
        width: 93.5vw;
        height: 45px;
        line-height: 45px;
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
        background-color: @fontColorff;
        margin: 0 auto;
        margin-left: 12px;
        border-top-left-radius: 2.7vw;
        border-top-right-radius: 2.7vw;
      }

      .tag_border {
        width: 93.5vw;
        margin: 0 auto;
        margin-left: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .span_kong {
        float: left;
        width: 4px;
        height: 16px;
        background: linear-gradient(180deg,
        rgba(0, 105, 255, 1) 0%,
        rgba(1, 128, 255, 1) 100%);
        border-radius: 2px;
        margin-top: 14px;
        margin-left: 10px;
        margin-right: 10px;
      }

      .tag {
        width: 93.5vw;
        background: @fontColorff;
        margin: 0 auto;
        border-bottom-left-radius: 2.7vw;
        border-bottom-right-radius: 2.7vw;

        .tag_n {
          width: 100%;
          min-height: 46px;
          .lineHeight(46);
          border-bottom: 1px solid @backcolor;
          padding-left: 2.7vw;
          color: @fontColor66;
          /*overflow: hidden;*/
          /*white-space: nowrap;*/
          /*text-overflow: ellipsis;*/
          display: flex;
          .fontSize(16);

          .tag_feed {
            display: flex;
            flex-direction: row;

            .z {
              flex: 1;
              padding: 8px 12px 8px 0px;
              line-height: 30px;
            }
          }

          .nr {
            width: 50%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .z {
            color: @fontColor33;
          }

          .y {
            color: @mainColor;
            font-weight: 400;
          }
        }

        .zz {
          color: @fontColor33;
        }

        .tag_n:last-child {
          border-bottom: 0px;
        }
      }
    }

    .information {
      .padding(15, 0, 0, 0);

      .information_title {
        width: 93.5vw;
        height: 45px;
        line-height: 45px;
        background-color: @fontColorff;
        margin: 0 auto;
        margin-left: 12px;
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
        .margin(0, 0, 0, 12);
        border-top-left-radius: 2.7vw;
        border-top-right-radius: 2.7vw;

        .information_details {
          float: right;
          margin-right: 10px;
          font-size: 16px;
          font-weight: bold;
          color: @mainColor;
          text-decoration: underline;
          cursor: pointer;
        }
      }

      .tag_border {
        width: 93.5vw;
        margin: 0 auto;
        margin-left: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .span_kong {
        float: left;
        width: 4px;
        height: 16px;
        background: linear-gradient(180deg,
        rgba(0, 105, 255, 1) 0%,
        rgba(1, 128, 255, 1) 100%);
        border-radius: 2px;
        margin-top: 14px;
        margin-left: 10px;
        margin-right: 10px;
      }

      .tag {
        width: 93.5vw;
        background: @fontColorff;
        margin: 0 auto;
        padding: 12px 10px;
        border-bottom-left-radius: 2.7vw;
        border-bottom-right-radius: 2.7vw;

        .tag_n {
          width: 100%;
          min-height: 30px;
          line-height: 24px;

          .nr {
            color: @fontColor33;
            font-size: 16px;

            .z {
              color: @fontColor66;
            }
          }
        }

        .tab {
          display: flex;
          padding: 15px 0;
          color: @fontColor33;
          border-top: 1px dashed #f1f1f1;
          font-size: 14px;

          &:first-child {
            border-bottom: 0;
          }

          .tab_box {
            flex: 1;

            /deep/ input {
              color: @fontColorAA;
            }

            text-align: center;
            padding-left: 10px;

            &:first-child {
              padding: 0;
            }
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
    }

    .medicine {
      .margin(20, 0, 0, 0);

      .medicine_title {
        .fontSize(18);
        color: @fontColor33;

        span {
          font-weight: bold;
        }

        .margin(0, 0, 0, 12);
        .padding(0, 12, 0, 0);
        display: flex;
        justify-content: space-between;

        .medicine_num {
          .fontSize(14);
          .lineHeight(16);
          color: @fontColor66;
          font-weight: normal;

          .y {
            color: @mainColor;
            font-weight: 400;
          }
        }
      }

      .tag {
        width: 93.5vw;
        background: @fontColorff;
        margin: 0 auto;
        border-radius: 2.7vw;
        .padding(5, 10, 5, 10);

        .pre-line {
          border-bottom: 0.2vw solid rgba(0, 0, 0, 0.1);
        }

        .pre-line:last-child {
          border-bottom: 0px;
        }

        .pre-message {
          align-items: center;
          /*height: 14vw;*/
          .padding(10, 0, 10, 0);
          position: relative;
        }

        .pre-message-left {
          .width(92);
          .height(92);
          border-radius: 2vw;
          overflow: hidden;
        }

        .pre-message-left img {
          width: 100%;
          height: 100%;
          align-items: center;
        }

        .pre-message-right {
          width: 65%;
          .height(92);
          display: flex;
          margin-left: 5vw;
          flex-direction: column;
          justify-content: space-between;
          .padding(10, 0, 0, 0);
        }

        .pre-message-noDrug {
          position: absolute;
          z-index: 33;
          background: rgba(0, 0, 0, 0.1);
          .width(92);
          .height(92);
          border-radius: 2vw;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;

          img {
            width: 100%;
            margin: auto;
          }
        }

        .p-display-column {
          display: flex;
          flex-direction: column;
        }

        .p-display-row {
          display: flex;
          flex-direction: row;
        }

        .pre-span-line {
          justify-content: space-between;
        }

        .pre-span-4 {
          display: block;
          text-align: left;
          .fontSize(12);
          margin: 2% 0;
        }

        .pre-span-3 {
          color: red;
          .fontSize(16);
        }

        .pre-span-2 {
          .fontSize(14);
        }

        .pre-span {
          .fontSize(16);
          .lineHeight(24);
          font-weight: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
        }

        .num {
          display: flex;
          justify-content: space-between;
          .margin(10, 0, 0, 0);
          align-items: center;
        }

        .pre-spanLit {
          .fontSize(14);
          font-weight: 400;
          .lineHeight(16);
          color: @fontColor99;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
        }

        .pre-spanLit-y {
          .fontSize(14);
          font-weight: bold;
          font-weight: 400;
          .lineHeight(16);
          color: @fontColor33;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
        }

        .pre-message-bottom {
          .fontSize(15);
        }

        .pre-more {
          font-weight: 400;
          .padding(15, 15, 15, 15);
          display: flex;
          justify-content: center;
        }
      }
    }

    .presentation {
      .column_box {
        height: 15px;
      }

      // width: 93.5vw;
      // background-color: @fontColorff;
      .tag_border {
        width: 93.5vw;
        margin: 0 auto;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .span_kong {
        width: 93.5vw;
        float: left;
        width: 4px;
        height: 16px;
        background: linear-gradient(180deg,
        rgba(0, 105, 255, 1) 0%,
        rgba(1, 128, 255, 1) 100%);
        border-radius: 2px;
        margin-top: 14px;
        margin-left: 10px;
        margin-right: 10px;
      }

      .margin(15, 0, 0, 0);

      /deep/ .pre_title {
        width: 93.5vw;
        margin-top: 20px;
        height: 45px;
        line-height: 45px;
        background-color: @fontColorff;
        margin: 0 auto;
        border-top-left-radius: 2.7vw;
        border-top-right-radius: 2.7vw;
        // margin-left: 12px;
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
        // .margin(0, 0, 0, 12);
      }

      /deep/ .pre_lil_title {
        &:first-child {
          margin-top: 0px;
        }

        .fontSize(16);
        color: @fontColor33;
        font-weight: 400;
        .margin(20, 0, 10, 12);
      }

      /deep/ .pre_lil_body {
        .padding(0, 12, 0, 12);
        text-align: justify;
        .lineHeight(20);
        .fontSize(14);
        color: @fontColor66;
        font-weight: 400;

        /deep/ span {
          font-weight: bold;
          color: @fontColor33;
        }
      }

      .pre_nr {
        width: 93.5vw;
        background: @fontColorff;
        margin: 0 auto 15px auto;
        border-bottom-left-radius: 2.7vw;
        border-bottom-right-radius: 2.7vw;
        padding: 12px 10px;
        font-size: 16px;
        color: @fontColor33;
        line-height: 22px;
        text-align: justify;

        .look {
          font-size: 16px;
          color: @mainColor;
          float: right;

          /deep/ .van-icon {
            top: 3px;
            color: @fontColor66;
          }
        }
      }

      .pre_nr_zw {
        padding: 12px 10px;
        margin: 15px auto;
      }
    }

    .table_box {
      width: 93.5vw;
      background: @fontColorff;
      margin: 0 auto 0 auto;
      padding: 12px 12px 17px 12px;
      border-bottom-left-radius: 2.7vw;
      border-bottom-right-radius: 2.7vw;
    }

    /deep/ table {
      border-radius: 2.1vw;
      border-spacing: 0px;
      -moz-box-shadow: 0px 1px 10px #e0d9d9;
      -webkit-box-shadow: 0px 1px 10px #e0d9d9;
      box-shadow: 0px 1px 10px #e0d9d9;
      overflow: hidden;
      font-size: 14px;
      background: @fontColorff;
      width: 100%;
    }

    //  /deep/.bor{
    // }
    /deep/ .even {
      width: 65vw;
      width: 70%;
    }

    /deep/ tr {
      .height(36);
      background: @fontColorff;
    }

    /deep/ table tr:nth-child(odd) {
      background: @ed;
    }

    /deep/ table tr:first-child {
      .height(49);
      .lineHeight(49);
      background-color: @mainColor !important;
      color: @fontColorff;
      border: 0px;
    }

    /deep/ th {
      // width: 50%;
      border: 0px;
      font-size: 16px;
      font-weight: normal;
      text-align: center;
    }

    /deep/ td {
      text-align: center;
      .lineHeight(36);
      // width: 50%;
      .xzyh {
        width: 90%;
        overflow: hidden;
        // white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0px auto;
      }
    }

    /deep/ tr:first-child {
      /deep/ th:first-child {
        border-top-left-radius: 2.1vw;
        // width: 50%;
      }
    }

    /deep/ tr:first-child {
      /deep/ th:last-child {
        border-top-right-radius: 2.1vw;
        // width: 50%;
      }
    }

    /deep/ tr:first-child {
      /deep/ td:first-child {
        border-top-left-radius: 2.1vw;
        // width: 50%;
        .height(49);
        .lineHeight(49);
      }
    }

    /deep/ tr:first-child {
      /deep/ td:last-child {
        border-top-right-radius: 2.1vw;
        // width: 50%;
        .height(49);
        .lineHeight(49);
      }
    }

    /deep/ tr:last-child {
      /deep/ td:first-child {
        border-radius: 0 0 0 2.1vw;
      }

      /deep/ td:last-child {
        border-radius: 0 0 2.1vw 0;
      }
    }

    /deep/ tr {
      td:first-child {
        border-right: 1px solid @d4;

        .xzyh {
          width: 113px;
        }
      }

      td:last-child {
        .xzyh {
          // width: 60vw;
          padding: 0 10px;
        }
      }
    }

    .report {
      .padding(20, 12, 0, 12);
      background: @backcolor !important;
      text-align: justify;
    }

    .pre_nr_out {
      position: fixed;
      //  bottom: 0px;
      left: 12px;
      width: 93.5vw;
      background: @fontColorff;
      margin: 15px auto;
      border-radius: 2.7vw;
      padding: 12px 10px;
      font-size: 16px;
      color: @fontColor33;
      line-height: 22px;
      text-align: justify;
      // display: block;
      bottom: 0;
      // z-index: 99999;
      .look {
        font-size: 16px;
        color: @mainColor;
        float: right;

        /deep/ .van-icon {
          top: 3px;
          color: @fontColor66;
        }
      }
    }
  }

  .screening_doctors {
    .padding(15, 0, 0, 0);

    .information_title {
      width: 93.5vw;
      height: 45px;
      line-height: 45px;
      background-color: @fontColorff;
      margin: 0 auto;
      margin-left: 12px;
      .fontSize(18);
      color: @fontColor33;
      font-weight: bold;
      .margin(0, 0, 0, 12);
      border-top-left-radius: 2.7vw;
      border-top-right-radius: 2.7vw;
    }

    .tag_border {
      width: 93.5vw;
      margin: 0 auto;
      margin-left: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .span_kong {
      float: left;
      width: 4px;
      height: 16px;
      background: linear-gradient(180deg,
      rgba(0, 105, 255, 1) 0%,
      rgba(1, 128, 255, 1) 100%);
      border-radius: 2px;
      margin-top: 14px;
      margin-left: 10px;
      margin-right: 10px;
    }

    .tag {
      width: 93.5vw;
      background: @fontColorff;
      margin: 0 auto;
      padding: 12px 10px;
      border-bottom-left-radius: 2.7vw;
      border-bottom-right-radius: 2.7vw;

      .tag_n {
        width: 100%;
        min-height: 30px;
        line-height: 24px;

        .nr {
          color: @fontColor33;
          font-size: 16px;
          display: block;
          float: left;
          width: 50%;

          .z {
            color: @fontColor66;
          }
        }

        .nrl {
          color: @fontColor33;
          font-size: 16px;
          display: block;
          width: 100%;

          .z {
            color: @fontColor66;
          }
        }
      }
    }
  }

  @media screen and (min-width: 375px) {
    //css style
    .pre_nr_out {
      bottom: 0;
    }
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-min-device-pixel-ratio: 1) {
    .pre_nr_out {
      bottom: 0;
    }
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-min-device-pixel-ratio: 2) {
    .pre_nr_out {
      bottom: 0;
    }
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    .pre_nr_out {
      bottom: 34px;
    }
  }
</style>
