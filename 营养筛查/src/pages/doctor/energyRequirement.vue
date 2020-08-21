/** *@desc 营养个体化方案(能量需求) *@author 张松仁 *@date 2019/10/29 16:49:46
**/
<template>
  <div class="energyRequirement">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="main">
      <div class="content">
        <div class="content_box">
          <div class="content_box_list">
            <div class="content_box_list_title">
              1.疾病选择。<span
                class="hint"
                v-show="key ? value2 == null : false"
                >*</span
              >
            </div>
            <div class="content_box_list_content select_box">
              <div class="dropdown">
                <van-dropdown-menu>
                  <van-dropdown-item
                    v-model="value2"
                    :options="option2"
                    @change="onChange2"
                  />
                </van-dropdown-menu>
              </div>
            </div>
          </div>
          <div
            class="content_box_list choice_box"
            v-for="(item, index, keys) in objData"
            :key="keys"
          >
            <div class="content_box_list_title">
              {{ keys + 2 }}.{{ index }}
              <span>
                {{
                  item[0].optiontype === 0
                    ? "(单选)"
                    : item[0].optiontype === 1
                    ? "(多选)"
                    : item[0].optiontype === 2
                    ? "(简答)"
                    : "(未知)"
                }}
              </span>
              <span
                class="hint"
                v-show="
                  key
                    ? result[keys] == undefined
                      ? true
                      : result[keys].length == 0
                    : false
                "
                >*</span
              >
            </div>
            <div
              class="content_box_list_content"
              v-if="item[0].optiontype === 0"
            >
              <van-radio-group
                v-model="result[keys]"
                @change="onCheck2(index, keys)"
              >
                <van-radio
                  v-for="(item1, index1) in item"
                  :key="index1"
                  :name="item1.id"
                  >{{ item1.optioncontent }}</van-radio
                >
              </van-radio-group>
            </div>
            <div
              class="content_box_list_content"
              v-if="item[0].optiontype === 1"
            >
              <!--              <van-checkbox-group v-model="result[keys]">-->
              <!--                <van-checkbox-->
              <!--                  v-for="(item2, index2) in item"-->
              <!--                  @click="onCheck(index, keys, index2)"-->
              <!--                  :key="index2"-->
              <!--                  :name="item2.id"-->
              <!--                  >{{ item2.optioncontent }}</van-checkbox-->
              <!--                >-->
              <van-checkbox-group
                v-model="result[keys]"
                @change="onCheck(index, keys)"
              >
                <van-checkbox
                  v-for="(item2, index2) in item"
                  :key="index2"
                  :name="item2.id"
                  >{{ item2.optioncontent }}</van-checkbox
                >
              </van-checkbox-group>
            </div>
          </div>
        </div>
      </div>
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
export default {
  name: "energyRequirement",
  data() {
    return {
      title: "每日热量计算",
      customTitle: "营养方案",
      result: [],
      value2: null, //疾病选项结果
      option2: [], //疾病选项
      key: false,
      npatientid: 0,
      objData: {}
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.selectByExample(0); //查询医生疾病
    console.log(this.$route.query.id);
    this.npatientid = this.$route.query.id
      ? this.$route.query.id
      : sessionStorage.getItem("id"); //病历单id
    window.sessionStorage.setItem("id", this.npatientid);
  },
  computed: {
    num() {
      return this.age;
    }
  },
  methods: {
    onCheck(index, keys) {
      let that = this;
      let e = that.result[keys];
      let res = e[e.length - 1];
      // let key;
      // console.log(e,"选择结果");
      // console.log(res,"最后一次选的id");
      that.objData[index].map((val, d) => {
        if (
          val.factortype == 0 &&
          val.id == res &&
          that.result[keys].length != 1
        ) {
          //最后点击的是0
          that.result[keys].splice(0, that.result[keys].length - 1);
        }
        // console.log(val.factortype == 0 && d == 0 && that.result[keys].length > 1 && that.result[keys].indexOf(val.id) != -1);
        // console.log(val.factortype == 0,val.factortype);
        // console.log(d == 0,d);
        // console.log(that.result[keys].indexOf(val.id) != -1,that.result[keys].indexOf(val.id));
        if (
          val.factortype == 0 &&
          that.result[keys].length > 1 &&
          that.result[keys].indexOf(val.id) != -1
        ) {
          //第一个点击的0
          that.result[keys].splice(0, 1);
          console.log(that.result[keys], "第一个点击的0");
        }
        if (that.result[keys].indexOf(val.id) != -1) {
          val.selected = true;
        } else {
          val.selected = false;
        }
        // console.log(that.objData[index]);
        // console.log(d);
        return val;
      });

      console.log(that.objData[index], "jieguo");
    },
    onCheck2(index, key) {
      //单选处理逻辑
      for (let i = 0; i < this.objData[index].length; i++) {
        if (this.result[key] == this.objData[index][i].id) {
          this.objData[index][i].selected = true;
        } else {
          this.objData[index][i].selected = false;
        }
      }
    },
    onSubmit() {
      //验证选项
      let length = Object.keys(this.objData).length;

      if (this.value2 == null) {
        this.$toast("您还未选择疾病");
      } else if (length == 0) {
        this.$toast("该疾病还未设置问卷");
      } else if (this.result.length != length || !this.isEmpty(this.result)) {
        this.$toast("您有选项未选择");
      } else {
        this.key = true;
        //执行提交
        this.onInsertPatient();
      }
    },
    isEmpty(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] == undefined || obj[i].length == 0) {
          return false;
        }
      }
      return true;
    },
    onInsertPatient() {
      let arr = this.value2.split(",");
      console.log(this.value2);
      console.log(arr);
      if (!arr[0]) return;
      let obj = {};
      obj.npatientid = this.npatientid;
      obj.departmentid = this.value1;
      obj.illid = arr[0];
      obj.data = this.objData;
      console.log(obj);
      this.$store.commit("Doctor/nutritionreference", arr[0]);
      console.log(arr[1]);
      //执行提交api
      this.$http
        .request({
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          url: "/NNutritionQuestionnaireItemOptionController/calculateByFactor",
          body: JSON.stringify(obj)
        })
        .then(res => {
          console.log(res.data);
          if (res.data.success) {
            //跳转下一页
            this.$router.push({ path: "/screeningReferenceGo" });
          } else {
            //失败
            this.$toast(res.data.total);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    onChange2(val) {
      console.log(val);
      //查询问卷
      this.questionApi(val);
    },
    questionApi(val) {
      console.log(val, "dianji ");
      console.log(val.split(","), "dianji ");
      let arr = val.split(",");

      //通过疾病id查询问卷
      if (!arr[1]) {
        this.objData = [];
        return;
      } else {
        this.$http
          .request({
            method: "get",
            url: "/NNutritionQuestionnaireItemOptionController/questionApi",
            body: {
              id: arr[1]
            }
          })
          .then(res => {
            console.log(res.data.message);
            if (res.data.success) {
              this.objData = res.data.data;
              this.result = new Array(res.data.data.length);
            } else {
              this.objData = [];
              this.result = [];
              this.$toast(res.data.message);
            }
          })
          .catch(error => {
            console.log("错误为" + error);
          });
      }
    },
    selectByExample(val) {
      //查询科系与疾病列表
      this.$http
        .request({
          method: "get",
          url: "/RIllnessController/selectDoctorIll",
          body: {}
        })
        .then(res => {
          console.log(res.data);
          let arr = [];
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {};
            obj.text = res.data.data[i].name;
            obj.value =
              res.data.data[i].id +
              "," +
              res.data.data[i].nnutritionquestionnaireid;
            // if (val == 0) {
            this.option2.push(obj);
            // } else {
            // arr.push(obj);
            // }
          }
          // this.option2 = arr;
          this.value2 =
            res.data.data[0].id +
            "," +
            res.data.data[0].nnutritionquestionnaireid;
          //查询问卷
          console.log("查询问卷");
          this.questionApi(this.value2);
          console.log(this.option2);
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    }
  }
};
</script>

<style scoped lang="less">
.energyRequirement {
  .main {
    /deep/ .van-radio,
    .van-checkbox {
      margin-top: 5px;
    }
    padding: 58px 12px 20px;
    .content {
      .content_box {
        .select_box {
          margin-top: 15px;
        }
        background: @backgroundColorff;
        border-radius: 10px;
        .content_box_top {
          font-size: 18px;
          line-height: 20px;
          color: @fontColor33;
          text-align: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .choice_box {
          padding-bottom: 8px;
        }
        .content_box_list {
          padding-top: 14px;
          padding-left: 10px;
          padding-right: 10px;
          border-bottom: 1px solid @backcolor;
          color: @fontColor66;
          .content_box_list_title {
            font-size: 16px;
            line-height: 16px;
            span {
              font-size: 16px;
              color: @mainColor;
            }
            .hint {
              color: @fontColorRed;
            }
          }
          .content_box_list_content {
            font-size: 14px;
            .van-radio-group {
              .van-radio {
                height: 32px;
                /deep/ .van-radio__icon {
                  /deep/ .van-icon {
                    font-size: 12px;
                  }
                }
                /deep/ .van-radio__label {
                  color: @fontColor66;
                  line-height: 20px;
                  font-size: 16px;
                }
                /deep/ .van-radio__icon .van-icon {
                  width: 20px;
                  height: 20px;
                }
                /deep/ .van-radio {
                  margin-top: 15px;
                }
              }
            }
            .dropdown {
              padding-bottom: 15px;
              .van-dropdown-menu {
                border: 1px solid @boederColor97;
                border-radius: 3px;
                height: 28px;
                padding: 6px 10px;
                width: 331px;
                line-height: 18px;
                font-size: 16px;
                color: @fontColor99;
                display: flex;
                justify-content: space-between;
                align-items: center;
                /deep/ .van-dropdown-item {
                  .van-popup {
                    width: 331px;
                    left: 22px;
                  }
                }
              }
            }

            .van-checkbox-group {
              .van-checkbox {
                // padding-bottom: 12px;
                height: 32px;

                /deep/ .van-checkbox__icon {
                  /deep/ .van-icon {
                    font-size: 12px;
                  }
                }

                /deep/ .van-checkbox__label {
                  color: @fontColor66;
                  line-height: 16px;
                  font-size: 16px;
                }
                /deep/ .van-checkbox__icon .van-icon {
                  width: 20px;
                  height: 20px;
                }
                /deep/ .van-radio {
                  margin-top: 15px;
                }
              }
            }

            /deep/ .van-dropdown-item--down {
              /deep/ .van-cell__title,
              .van-cell__value {
                flex: auto;
              }
            }
            /deep/ .van-dropdown-menu__item {
              width: 208px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              .van-dropdown-menu__title {
                width: 100%;
                color: @fontColor66;
                font-size: 14px;
                &:after {
                  padding: 0;
                  right: 5px;
                }
              }
            }
          }
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
  }
}
</style>
