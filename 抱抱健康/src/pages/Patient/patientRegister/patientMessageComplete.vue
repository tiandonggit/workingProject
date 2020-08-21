<template>
  <div class="patientMessageComplete_page">
    <common-header
        :share-disabled="true"
        :title="'完善信息'"
        :header-show="true"
        :custom-title="'完善信息'"
    ></common-header>
    <h4 class="message_title">
      <img src="../../../assets/images/patient2.png" alt="">
      基本信息<span class="tip" style="margin-left: 10px">必填信息</span>
    </h4>
    <van-cell-group class="patientMessage_form">
      <div class="patientMessage_div">
        <van-field
            placeholder="请输入真实姓名"
            class="labelWeight"
            v-model="patientMessage.name"
            @input="
          patientMessage.name = patientMessage.name.replace(
            /[^\u4e00-\u9fa5]/g,
            ''
          )
        "
            clearable
            label="姓名"
        ></van-field>
        <van-field
            placeholder="请输入真实证件信息"
            class="labelWeight"
            v-model="patientMessage.cardno"
            clearable
            label="身份证"
        ></van-field>
        <div class="van-cell-div borderWith">
          <p class="radio_title">性别</p>
          <van-radio-group label="性别" disabled v-model="patientMessage.sex">
            <van-radio name="1" shape="square" class="MarginRight20Radio">男</van-radio>
            <van-radio name="2" shape="square">女</van-radio>
          </van-radio-group>
        </div>
        <van-field
            placeholder="请输入真实年龄"
            class="labelWeight disabled noBorderCell"
            v-model="patientMessage.age"
            disabled
            label="年龄"
        ></van-field>
      </div>
    </van-cell-group>
    <h4 class="message_title noMarginTop">
      <img src="../../../assets/images/articleIcon.png" alt="">
      详细信息
    </h4>
    <van-cell-group class="patientMessage_form">
      <div class="patientMessage_div">
        <van-field
            placeholder="请输入籍贯信息"
            class="labelWeight"
            maxLength="20"
            v-model="patientMessage.nativeplace"
            clearable
            label="籍贯"
        ></van-field>
        <van-field
            placeholder="请输入您的民族"
            class="labelWeight"
            maxLength="10"
            v-model="patientMessage.nation"
            clearable
            label="民族"
        ></van-field>
        <div class="van-cell-div borderWith">
          <p class="radio_title" style="color:#333;">婚姻</p>
          <van-radio-group label="婚姻" v-model="patientMessage.marriage">
            <van-radio :name="2" shape="square" class="MarginRight20Radio">未婚</van-radio>
            <van-radio :name="1" shape="square">已婚</van-radio>
          </van-radio-group>
        </div>
        <div class="van-cell-div borderWith">
          <p class="radio_title" style="color:#333;">学历</p>
          <div class="select_education" @click="selectShow=true">
            <span v-if="patientMessage.educationname">{{patientMessage.educationname }}</span>
            <span v-else style="color: rgba(168, 168, 168, 1);">请选择学历</span>
            <van-icon name="arrow"/>
          </div>
        </div>
        <van-field
            placeholder="请输入常住地"
            class="labelWeight"
            type="textarea"
            v-model="patientMessage.homeaddress"
            :maxlength="50"
            autosize
            clearable
            label="常住地"
        ></van-field>
      </div>
    </van-cell-group>
    <h4 class="message_title noMarginTop">
      <img src="../../../assets/images/diseaseInfo.png" alt="">
      疾病信息
    </h4>
    <van-cell-group class="patientMessage_form">
      <div class="van-cell-div">
        <p class="radio_title noDisabled">疾病史</p>
        <van-radio-group v-model="disease">
          <van-radio :name="true" class="MarginRight20Radio">有</van-radio>
          <van-radio :name="false">无</van-radio>
        </van-radio-group>
      </div>
      <van-field
          placeholder="若有,请输入病史"
          class="lineHeight20"
          v-model="patientMessage.illness"
          v-if="disease"
          type="textarea"
          maxlength="100"
      ></van-field>
      <div class="van-cell-div">
        <p class="radio_title noDisabled">过敏史</p>
        <van-radio-group v-model="allergy">
          <van-radio :name="true" class="MarginRight20Radio">有</van-radio>
          <van-radio :name="false">无</van-radio>
        </van-radio-group>
      </div>
      <van-field
          placeholder="若有,请输入过敏史"
          class="lineHeight20"
          v-model="patientMessage.irritability"
          type="textarea"
          maxlength="100"
          v-if="allergy"
      ></van-field>
      <div class="van-cell-div noborderBottom">
        <p class="radio_title noDisabled">家族病史</p>
        <van-radio-group v-model="hereditaryDiseases">
          <van-radio :name="true" class="MarginRight20Radio">有</van-radio>
          <van-radio :name="false">无</van-radio>
        </van-radio-group>
      </div>
      <van-field
          placeholder="若有,请输入家族病史"
          class="lineHeight20 MarginRight20Radio paddingBottom12"
          type="textarea"
          v-model="patientMessage.inheritance"
          v-if="hereditaryDiseases"
          maxlength="100"
      ></van-field>
    </van-cell-group>
    <div class="tipBox">
        <span class="tip">
          本软件对用户信息严格保密,请放心填写
        </span>
      <span class="tip tip2">
          完善信息有助于医生更加了解您,并为您分配优秀的治疗方案
        </span>
    </div>
    <div class="footer-box">
      <div class="next-btn"
           @click.stop="submitPatientMessage"
           v-if="btnToggle">
        <van-button slot="button" class="next-btn" size="large">提交保存</van-button>
      </div>
    </div>


    <van-action-sheet
        @click-overlay="selectShow=false"
        v-model="selectShow"
        :actions="educationList"
        @select="onSelect"/>
  </div>
</template>

<script>

  import Vue from "vue";
  import {Toast} from "vant";

  Vue.use(Toast);
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "patientMessageComplete",
    components: {
      commonHeader
    },
    data() {
      return {
        disease: false, // 有无病史
        allergy: false, // 有无过敏史
        hereditaryDiseases: false, // 有无家族遗传病史
        educationList: [],
        patientMessage: {
          name: "",
          cardno: "",
          sex: "", // 性别 1为男 2为女
          age: "",
          illness: "",
          irritability: "",
          inheritance: "",
          nativeplace: "",// 籍贯
          nation: "",// 民族
          marriage: "",//婚否
          homeaddress: "",//常住地
          education: "",// 学历id,
          educationname: ""// 学历,
        },
        selectShow: false,
        btnToggle: true // 按钮是否隐藏(解决安卓端软键盘弹起会把fixed元素顶出来的问题)
      };
    },
    watch: {
      "patientMessage.cardno"(newValue, oldValue) {
        this.getAgeAndSexByIdNumber();
      },
      "patientMessage.sex"() {
        console.log("change radio", this.patientMessage.sex);
      }
    },
    methods: {
      /**
       * onSelect
       * **/
      onSelect(item) {
        this.patientMessage.education = item.code;
        this.patientMessage.educationname = item.text;
        this.selectShow = false;
      },
      /**
       * 提交患者修改信息**/
      submitPatientMessage() {
        if (!this.patientMessage.name) {
          Toast({
            message: "请将信息填写完整",
            position: "bottom"
          });
          return false;
        }
        if (!this.idNumberVerification(this.patientMessage.cardno)) {
          Toast({
            message: "请输入正确的身份证号",
            position: "bottom"
          });
          return false;
        }
        if (!this.disease) {
          this.patientMessage.illness = "";
        }
        if (!this.allergy) {
          this.patientMessage.irritability = "";
        }
        if (!this.hereditaryDiseases) {
          this.patientMessage.inheritance = "";
        }
        if (this.disease) {
          if (!this.patientMessage.illness) {
            Toast({
              message: "请将信息填写完整",
              position: "bottom"
            });
            return false;
          }
        }
        if (this.allergy) {
          if (!this.patientMessage.irritability) {
            Toast({
              message: "请将信息填写完整",
              position: "bottom"
            });
            return false;
          }
        }
        if (this.hereditaryDiseases) {
          if (!this.patientMessage.inheritance) {
            Toast({
              message: "请将信息填写完整",
              position: "bottom"
            });
            return false;
          }
        }
        let reg = /^[\u4e00-\u9fa5]+$/;
        if (this.patientMessage.nativeplace) {
          if (!reg.test(this.patientMessage.nativeplace)) {
            Toast("请输入正确的籍贯信息");
            return false;
          }
        }
        if (this.patientMessage.nation) {
          if (!reg.test(this.patientMessage.nation)) {
            Toast("请输入正确的民族");
            return false;
          }
        }
        this.$http
          .request({
            method: "post",
            url: "/RPatientController/updateByExampleSelective",
            body: this.patientMessage
          })
          .then(res => {
            if (res.data.success) {
              Toast({
                message: "保存成功",
                position: "bottom"
              });
              this.$router.go(-1);
              this.getPatientMessage();
            } else {
              console.log("修改患者信息接口报错");
              Toast({
                message: res.data.message || "操作失败",
                position: "bottom"
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
      },

      /**
       * 查询患者信息**/
      getPatientMessage() {
        this.$http
          .request({
            method: "get",
            url: "/RPatientController/selectByPrimaryS",
            body: {}
          })
          .then(res => {
            if (res.data.success && res.data.data) {
              this.patientMessage = res.data.data;
              // 如果有相应的病史 修改单选框的状态
              if (this.patientMessage.illness) {
                this.disease = true;
              }
              if (this.patientMessage.irritability) {
                this.allergy = true;
              }
              if (this.patientMessage.inheritance) {
                this.hereditaryDiseases = true;
              }
            } else {
              console.log("查询患者信息接口报错");
            }
          })
          .catch(e => {
            console.log(e);
          });
      },

      /**
       * 根据身份证号获取年龄或性别**/
      getAgeAndSexByIdNumber() {
        if (!this.idNumberVerification(this.patientMessage.cardno)) {
          this.patientMessage.sex = "";
          this.patientMessage.age = "";
          return false;
        } else {
          this.patientMessage.cardno.substring(6, 10) +
          "-" +
          this.patientMessage.cardno.substring(10, 12) +
          "-" +
          this.patientMessage.cardno.substring(12, 14);
          if (parseInt(this.patientMessage.cardno.substr(16, 1)) % 2 === 1) {
            this.patientMessage.sex = "1";
          } else {
            this.patientMessage.sex = "2";
          }
          let myDate = new Date();
          let month = myDate.getMonth() + 1;
          let day = myDate.getDate();
          let age =
            myDate.getFullYear() -
            this.patientMessage.cardno.substring(6, 10) -
            1;
          if (
            this.patientMessage.cardno.substring(10, 12) < month ||
            (this.patientMessage.cardno.substring(10, 12) == month &&
              this.patientMessage.cardno.substring(12, 14) <= day)
          ) {
            age++;
          }
          this.patientMessage.age = age;
        }
      },
      /**
       * 获取学历字典
       * **/
      getEducationList() {
        return new Promise((resolve, reject) => {
          this.$http.request({
            url: "/SysDictionaryController/selectEducation",
            method: "get",
            body: {}
          }).then(res => {
            if (res.data.success) {
              let educationList = res.data.data || [];
              try {
                educationList.forEach(item => {
                  item.name = item.text;
                });
              } catch (e) {
                console.log(e);
              }
              this.educationList = educationList;
              resolve(res.data.data);
            } else {
              console.log("获取学习字典接口报错");
              reject("err");
            }
          }).catch(err => {
            console.log(err);
            reject("err");
          });
        });
      }
    },
    created() {
      let educationPromise = this.getEducationList();
      Promise.all([educationPromise]).then(() => {
        this.getPatientMessage();
      });
    }
  };
</script>

<style scoped lang="less">
  .patientMessageComplete_page .patientMessage_form /deep/ .van-radio__icon--checked .van-icon {
    color: #fff;
    background-color: @buttonColor;
    border-color: @buttonColor;
  }

  .patientMessageComplete_page .labelWeight /deep/ .van-cell__title span {
    color: #333;
    font-weight: 600;
    font-size: 16px;
  }

  .patientMessageComplete_page .labelWeight.disabled /deep/ .van-cell__title span {
    color: #999;
  }

  .patientMessageComplete_page /deep/ .van-cell {
    .padding(15, 0, 15, 0);
    box-sizing: border-box;
    margin: 0 12px;
    width: calc(100% - 24px);
  }

  .patientMessageComplete_page /deep/ .van-cell.lineHeight20 {
    padding: 0px;
    border-bottom: none !important;

    .van-field__body textarea {
      background: rgba(242, 242, 242, 1);
      color: #333;
      min-height: 90px;
      font-size: 16px;
      padding-left: 10px;
      padding-top: 15px;
      border-radius: 0 0 10px 10px;
    }
  }

  .patientMessageComplete_page /deep/ .van-radio-group {
    display: flex;
    align-items: center;
  }

  .patientMessageComplete_page /deep/ .van-radio-group .van-radio {
    /*margin-left: 50px;*/
  }

  .patientMessageComplete_page {
    .padding(44, 0, 0, 0);
    background-color: @backgroundColor;

    .patientMessageComplete_page /deep/ .van-cell .van-field__control {
      font-size: 16px;
    }

    .van-cell {
      border-bottom: 1px solid #ebedf0;
    }

    .van-cell.noBorderCell {
      border-bottom: none;
    }

    .van-cell-div.noborderBottom {
      border-bottom: 0 !important;
    }


    .van-cell-div {
      border-bottom: 1px solid #ebedf0;
      display: flex;
      padding: 15px 0px;
      .margin(0, 15, 0, 15);
      .lineHeight(25);

      .radio_title {
        width: 90px;
        font-weight: 600;
        color: #999999;
      }

      .radio_title.noDisabled {
        color: #333;
        font-size: 16px;
      }
    }
  }

  .submit_btn {
    .height(44);
    .lineHeight(44);
    text-align: center;
    .borderRadius(10, 10, 10, 10);
    color: #fff;
    background-color: @mainColor;
  }

  .tip {
    font-size: 14px;
    color: #FF3000;
    line-height: 18px;
    display: inline-block;
  }

  .tip2 {
    margin: 15px 0 0 0;
    color: #999999;
  }

  .tipBox {
    padding: 16px 39px 76px 15px;
  }


  .patientMessageComplete_page /deep/ .van-hairline--top-bottom::after {
    border-width: 0 0 !important;
  }

  .patientMessageComplete_page /deep/ .van-cell:not(:last-child)::after {
    border-bottom: 0 !important;
  }

  .message_title {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .margin(28, 0, 0, 0);
    width: 100%;
    background-color: @backgroundColor;
    .fontSize(18);
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    .padding(0, 0, 15, 12);

    img {
      display: block;
      width: 20px;
      height: 20px;
      .margin(0, 11, 0, 0)
    }
  }

  .message_title.noMarginTop {
    .margin(20, 0, 0, 0);
  }

  .patientMessage_form {
    box-sizing: border-box;
    .margin(0, 12, 0, 12);
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;

    .patientMessage_div {
      background-color: #fff;
    }
  }

  /*隐藏radio选项  自定义label*/
  .patientMessageComplete_page {
    /deep/ .van-field__body {
      font-size: 16px;
    }

    /deep/ .van-radio__icon {
      display: none !important;
    }

    /deep/ .van-radio__label {
      width: 36px;
      height: 20px;
      border-radius: 10px;
      text-align: center;
      line-height: 20px;
      background-color: #cccccc;
      color: #fff;
      font-size: 14px;
      margin-left: 0;
    }

    /deep/ .van-radio__icon--checked + .van-radio__label {
      background-color: @mainColor;
    }

    .MarginRight20Radio.van-radio {
      margin-right: 20px;
      margin-left: 0 !important;
    }

    /deep/ .paddingBottom12.van-cell .van-field__body {
      padding-bottom: 12px;
    }
  }

  .patientMessageComplete_page {
    .select_education {
      flex: 1;
      display: flex;
      align-items: center;

      span {
        flex: 1;
      }

      i {
        font-size: 20px;
      }
    }
  }

</style>
