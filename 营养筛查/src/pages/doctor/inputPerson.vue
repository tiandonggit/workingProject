/* * @Author: 田东 * @Date: 2019-10-29 16:33:20 * @Last Modified by:
张松仁(添加手机号) * @Last Modified time: 2019-10-29 16:33:20 * @name
患者信息填写 */

<template>
  <div id="inputPerson">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="v-body">
      <div class="v-box-top">
        <div class="v-box">
          <van-field
            class="v-list"
            v-model="name"
            label="姓名"
            required
            placeholder="请填写用户姓名"
            maxlength="12"
          ></van-field>
          <van-field
            class="v-list"
            label="年龄"
            v-model="age"
            label-align="left"
            maxlength="3"
            placeholder="请填写真实年龄,单位(岁)"
          ></van-field>
          <van-cell class="v-list van-cell van-cell--required van-field van-field--label-left">
            <div class="van-list">
              <div
                class="van-cell__title_two van-field__label van-field__label--left"
              >
                <span>性别</span>
              </div>
              <div class="van-cell__value">
                <van-radio-group v-model="checkSex">
                  <van-radio name="1">男</van-radio>
                  <van-radio name="2">女</van-radio>
                </van-radio-group>
              </div>
            </div>
          </van-cell>
          <van-field
            class="v-list v-phone"
            label="联系电话"
            required
            v-model="phone"
            label-align="left"
            maxlength="11"
            placeholder="请填写电话号码"
          ></van-field>
        </div>
        <div class="v-box">
          <div class="card clearfix">
            <div class="title">
              <span class="span_kong"></span>
              <span style="width:50%">既往病史</span>
            </div>
            <van-field
              v-model="medical"
              class="textarea"
              :autosize="{ maxHeight: 30, minHeight: 30 }"
              type="input"
              placeholder="请填写既往病史"
              maxlength="20"
              rows="1"
            ></van-field>
            <div class="van-num">{{ medical.length }}/20</div>
          </div>
        </div>
        <div class="v-box">
          <div class="card clearfix">
            <div class="title">
              <span class="span_kong"></span>
              <span style="width:50%">药物过敏史</span>
            </div>
            <van-field
              v-model="DrugMess"
              class="textarea"
              :autosize="{ maxHeight: 30, minHeight: 30 }"
              type="input"
              placeholder="请填写药物过敏史"
              maxlength="20"
              rows="1"
            ></van-field>
            <div class="van-num">{{ DrugMess.length }}/20</div>
          </div>
        </div>
        <div class="v-box">
          <van-field
            maxlength="3"
            class="v-list"
            label="身高(cm)"
            required
            v-model="height"
            label-align="left"
            placeholder="请填写身高"
          ></van-field>
          <van-field
            maxlength="3"
            class="v-list"
            label="体重(kg)"
            required
            v-model="weight"
            label-align="left"
            placeholder="请填写体重"
          ></van-field>
          <van-field
            class="v-list v-protein"
            maxlength="5"
            label="血清白蛋白值(g/L)"
            v-model="protein"
            label-align="left"
            placeholder="请填写蛋白值"
          ></van-field>
        </div>
      </div>
      <div class="v-bottom">
        <van-button
          @click="$throttle(submitPatient)"
          class="v-nextBottom"
          type="warning"
        >
          <span v-if="$route.query.doctorId">提交</span>
          <span v-else>下一步</span>
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { Toast } from "vant";
import { mapState } from "vuex";

export default {
  name: "inputPerson",
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      title: "患者信息录入",
      customTitle: "营养风险筛查",
      name: "", //姓名
      age: "", //年龄
      checkSex: "", //性别
      medical: "", //既往病史
      DrugMess: "", //药物过敏史
      height: "", //身高
      phone: "", //手机号
      weight: "", //体重
      protein: "", // 血清白蛋白值(g/L)
      doctorId: "", //医生id
      usertype: 1, //用户类型 1医生 3患者
      patientid: "", //患者id
      lowerdoctorid: "", //处方医生id
      id: 0 //处方单id
    };
  },
  created() {},
  mounted() {
    console.log(this.$store.state.Doctor.prescriptionsourcetype);
    console.log(this.Patient.prestype,"prestype");
    //获取是否有筛查单号
    this.id = sessionStorage.getItem("id");
    console.log(this.id, "id");
    if (this.$route.query.id && this.$route.query.id != "") {
      //this.$route.query.id 不为空则是在抱抱健康的IM跳转过来的,将状态保存到vuex中
      this.Patient.isIM = true;
      this.Patient.prestype = 0;
      //根据不同的用户类型进行赋值
      console.log(this.Patient.isDoc, "...");
      if (this.Patient.isDoc) {
        //医生
        this.usertype = 1;
        this.patientid = this.$route.query.id;
      } else {
        //患者
        this.usertype = 3;
        this.doctorId = this.$route.query.id;
        this.patientid = this.Patient.patientMessage.id;
      }
    } else {
      //this.$route.query.id 为空则是在抱抱健康公众号跳转过来的,将状态保存到vuex中
      this.Patient.isIM = false;
      //根据不同的用户类型进行赋值
      if (this.Patient.isDoc) {
        //医生
        this.usertype = 1;
        this.lowerdoctorid = window.sessionStorage.getItem("pid");
      } else {
        //患者
        this.usertype = 3;
        this.doctorId = window.sessionStorage.getItem("pid");
        this.lowerdoctorid = window.sessionStorage.getItem("pid");
        this.patientid = this.Patient.patientMessage.id;
      }
    }
    if (this.id !== null) {
      //根据处方单id查询患者信息
      this.selectInfo();
    } else {
      //没有处方单id则判断用户类型通过患者id获取患者信息
      if (this.patientid != null && this.patientid != "") {
        //可以根据患者id查询信息
        this.selectPatient();
      }
    }
    this.Patient.prestype==1?"营养风险诊断":"营养风险筛查"
  },
  methods: {
    goNutritionPrograms() {
      this.$router.push({ name: "NutritionPrograms" });
    },
    selectInfo() {
      //查询患者信息
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/selectByPrimaryKeyId",
          body: {
            id: this.id
          }
        })
        .then(res => {
          this.name = res.data.data.name; //姓名
          this.age = parseInt(res.data.data.age); //年龄
          this.checkSex = res.data.data.sex.toString(); //性别
          this.medical = res.data.data.pasthistory; //既往病史
          this.DrugMess = res.data.data.allergyhistory; //药物过敏史
          this.height = parseInt(res.data.data.height * 100); //身高
          this.weight = res.data.data.weight; //体重
          this.phone = res.data.data.nphone; //手机号
          this.protein = res.data.data.serumalbumin; // 血清蛋白
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    //获取患者的个人信息,并渲染
    selectPatient() {
      console.log(this.patientid, "patientid");
      this.$http
        .request({
          method: "get",
          url: "/RPatientController/selectByPrimaryKey",
          body: {
            id: this.patientid
          }
        })
        .then(res => {
          console.log(res);
          let data = res.data;
          if (data.success) {
            this.name = data.data.name;
            this.age = data.data.age;
            data.data.sex != 0
              ? (this.checkSex = data.data.sex.toString())
              : "";
            this.phone = data.data.phone;
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    },
    //提交个人信息
    submitPatient() {
      if (
        !this.name ||
        !this.checkSex ||
        !this.height ||
        !this.weight ||
        !this.phone
      ) {
        Toast("请填写完整所有信息");
        return;
      }
      if (!this.TestPhone(this.phone)) {
        Toast("手机号填写错误");
        return;
      }
      // BMI(kg/m²)=体重(kg)÷身高²(m²)
      let BMI = (this.weight / this.height / this.height) * 10000;

      this.$http
        .request({
          method: "post",
          url: "/NNutritionPrescribePatientController/insertOrUpdate",
          body: {
            name: this.name,
            age: this.age,
            sex: this.checkSex,
            pasthistory: this.medical,
            allergyhistory: this.DrugMess,
            height: this.height / 100,
            weight: this.weight,
            nphone: this.phone,
            serumalbumin: this.protein,
            doctorId: this.doctorId,
            usertype: this.usertype,
            patientid: this.patientid,
            prestype: this.Patient.prestype,
            // prescriptionsourcetype: this.$store.state.Doctor.prescriptionsourcetype,  //有无智能机去掉
            lowerdoctorid: this.lowerdoctorid //之前逻辑选择的医生id
          }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            Toast("个人信息保存成功");
            window.sessionStorage.setItem("id", data.data.id);
            setTimeout(() => {
              console.log(this.Patient.prestype);
              if(this.Patient.prestype == 1) {
                this.goNutritionPrograms();
              } else {
                this.$router.push({ name: "nutritionalRisk" });
              }
            }, 1000);
          } else {
            Toast(data.message);
          }
        })
        .catch(() => {
          Toast("接口异常");
        });
    }
  },
  components: {
    commonHeader
  },
  watch: {
    //-监听输入身高正则验证
    height(val) {
      console.log(val);

      if (!val) {
        return;
      }
      val = val.toString();
      this.height = val.replace(/[^0-9]+/g, "");
    },
    //监听输入体重正则验证
    weight(val) {
      if (!val) {
        return;
      }
      val = val.toString();
      this.weight = val.replace(/[^0-9]+/g, "");
    },
    protein(val) {
      if (!val) {
        return;
      }
      val = val.toString();
      this.protein = val.replace(/[^0-9]+/g, "");
    },
    //监听年龄正则验证
    age(val) {
      if (!val) {
        return;
      }
      val = val.toString();
      this.age = val.replace(/[^0-9]+/g, "");
    },
    //监听手机号正则验证
    phone(val) {
      if (!val) {
        return;
      }
      val = val.toString();
      this.phone = val.replace(/[^0-9]+/g, "");
    }
  }
};
</script>
<style lang="less" scoped>
#inputPerson {
  width: 100%;
  .v-body {
    width: 100%;
    height: 100%;
    .fontSize(16);
    .padding(10, 12, 0, 12);
    .v-box-top {
      margin-top: 48px;
    }
    .v-box {
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 15, 0);
      position: relative;
      overflow: hidden;

      .card {
        background: #fff;
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
        &:after,
        &:before {
          display: block;
        }

        .title {
          .lineHeight(45);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          .padding(0, 0, 0, 10);
        }
      }

      /deep/ .van-field__label {
        width: auto;
        margin-right: 20px;
      }

      .van-cell__title {
        width: 30%;
      }

      .span_kong {
        float: left;
        width: 4px;
        height: 16px;
        background: linear-gradient(
          180deg,
          rgba(0, 105, 255, 1) 0%,
          rgba(1, 128, 255, 1) 100%
        );
        border-radius: 2px;
        .margin(14, 10, 0, 0);
      }

      .textarea:not(:last-child) {
        display: block;
        &:after {
          border: 0;
        }
      }

      .v-list {
        .height(46);
        &:after {
          left: 0;
        }

        /deep/ .van-cell__value {
          .fontSize(14);
          height: 30px;
          .lineHeight(30);
        }
      }
      /deep/ .van-cell {
        .fontSize(16);
        // padding-right: 1px;
        font-weight: 400;
        .lineHeight(30);
      }

      /deep/ .van-field__control {
        .fontSize(16);
      }

      /deep/ .van-field__control:disabled {
        color: #000;
      }
      .van-list {
        display: flex;
        span {
          .fontSize(16);
        }
        .van-cell__value {
          text-align: left;
        }
        /deep/ .van-radio-group {
          display: flex;
          height: 24px;

          .van-radio {
            .margin(0, 20);
          }
        }

        /deep/ .van-radio__icon .van-icon {
          width: 20px;
          height: 20px;
        }
        /deep/ .van-radio {
          margin-top: 15px;
        }
      }
      .textarea {
        .padding(8, 0, 8, 10);
        .fontSize(14);
        width: 80%;
        float: left;
      }
      .van-num {
        text-align: right;
        float: right;
        color: #969799;
        .lineHeight(45);
        .margin(0, 10, 0, 0);
      }
    }
    .v-bottom {
      .margin(25);
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      .v-nextBottom {
        .width(351);
        .height(44);
        .lineHeight(44);

        span {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: @fontColorff;
          line-height: 22px;
        }
      }
    }
  }
}
</style>
