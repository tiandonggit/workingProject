/** *@desc 选择疾病 *@author houpai *@date 2019/07/03 15:07:16 */
<template>
  <div class="choose_disease_page">
    <common-header
        :share-disabled="true"
        :custom-title="'选择疾病'"></common-header>

    <div class="search_header_box">
      <div class="search_header">
        <div class="header-div header-left" @click="headerBack" v-show="false">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        <van-search
            placeholder="输入疾病名称"
            v-model="diseaseName"
            @clear="getDiseaseListByDoctorID"
            @search="getDiseaseListByDoctorID"></van-search>
      </div>
    </div>
    <!--<ul class="disease_choice" v-if="diseaseList.length">-->
    <ul class="disease_choice">
      <van-radio-group v-model="chooseIndex">
        <li v-for="(item, index) in diseaseList" :key="index">
          <div class="disease_img_box">
            <span class="diseases_img"></span>
          </div>
          <p class="disease_name">
            {{item.name}}
          </p>
          <div style="width: 32px"></div>
          <div class="disease_checkBox">
            <van-radio :name="index"></van-radio>
          </div>
        </li>
        <li :class="(chooseIndex == diseaseList.length+1)?'disease_other':''">
          <div class="disease_img_box">
            <span class="diseases_img"></span>
          </div>
          <p class="disease_name">
            其它疾病
          </p>
          <div style="width: 32px"></div>
          <div class="disease_checkBox">
            <van-radio :name="diseaseList.length+1"></van-radio>
          </div>
        </li>
        <div v-show="chooseIndex == diseaseList.length+1" class="disease_other_box">
          <div class="disease_other_rom">
            <div class="disease_input">
              <van-field v-model="otherDisease" placeholder="请输入疾病名称"/>
            </div>
            <div class="disease_text">
              请输入您当前疾病名称，更多疾病相关知识会持续更新，敬请期待！
            </div>
          </div>
        </div>
      </van-radio-group>
    </ul>
    <!--    @click="submitChooseDisease"-->

    <!--    搜索无结果-->
    <!-- <div class="noDisease" v-else>
       <img src="../../../assets/images/noDisease.png" alt="">
       <p>正在努力更新中,敬请期待!</p>
     </div>-->


    <div class="footer-box">
      <div class="next-btn"
           v-if="btnToggle"
           @click=" submitChooseDisease">
        <van-button slot="button" class="next-btn" size="large">
          {{this.chooseIndex == (this.diseaseList.length + 1)?"确认":"下一步"}}
        </van-button>
      </div>
    </div>

    <van-loading
        type="spinner"
        color="#0069ff"
        v-if="loading"></van-loading>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import Vue from "vue";
  import {Toast} from "vant";

  Vue.use(Toast);
  export default {
    name: "chooseDisease",
    components: {
      commonHeader
    },
    data() {
      return {
        chooseIndex: "", // 已选中的疾病
        diseaseName: "", // 疾病名称
        diseaseList: [], // 疾病列表
        loading: false, // loading
        doctorId: "", // 医生id 从url中获取
        btnToggle: true, // 按钮是否隐藏(解决安卓端软键盘弹起会把fixed元素顶出来的问题)
        otherDisease: "", //其它疾病名称
        from: "" // 区分页面入口,如果是公众号模板跳转 完成选择后closeWindow
      };
    },
    watch: {
      diseaseList: function () {
        this.$nextTick(() => {
          let oSpan = document.getElementsByClassName("diseases_img");
          let spans = Array.prototype.slice.call(oSpan);
          spans &&
          spans.forEach(item => {
            let num = Math.ceil(Math.random() * 34 + 1);
            let path = require(`../../../assets/images/${num}.png`);
            item.style.background = `url("${path}") no-repeat center`;
            item.style.backgroundSize = `100% 100%`;
          });
        });
      }
    },
    methods: {
      /**
       * 根据医生ID查询疾病
       * 支持模糊查询**/
      getDiseaseListByDoctorID() {
        this.chooseIndex = "";
        this.loading = true;
        this.$http.request({
          method: "get",
          url: "/RIllnessController/select",
          body: {
            id: this.doctorId || "478616730042765674",
            name: this.diseaseName
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            this.diseaseList = res.data.data;
            this.loading = false;
          } else {
            console.log("获取医生疾病失败");
            this.loading = false;
          }
        }).catch(e => {
          console.log(e);
          this.loading = false;
        });
      },

      /**
       * 提交选择疾病**/
      submitChooseDisease() {
        if (this.chooseIndex == this.diseaseList.length + 1) {
          this.setOtherDisease();
          return;
        }
        let rillnessid = (this.chooseIndex !== "" && this.diseaseList[this.chooseIndex].id) || "";
        let rillnessname = (this.chooseIndex !== "" && this.diseaseList[this.chooseIndex].name) || "";
        if (!rillnessid || !rillnessname) {
          Toast({
            message: "请选择疾病",
            position: "bottom"
          });
          return false;
        }
        let params = {
          rdoctorid: this.doctorId,
          rillnessid: rillnessid,
          rillnessname: rillnessname
        };

        // 疾病无任务 直接提交(不在选择疾病期数) v1.13添加(接口 -- 赵瑜)
        if (this.diseaseList[this.chooseIndex].logicdel == 2) {
          this.$http.request({
            method: "post",
            url: "/RReportIllnessController/insertReportIllness",
            body: {
              rdoctorid: params.rdoctorid,
              rillnessid: params.rillnessid,
              rillnessname: params.rillnessname,
              periods: "",
              periodsnumber: ""
            }
          }).then(res => {
            if (res.data.success) {
              try {
                if (!this.from) {
                  WeixinJSBridge.call("closeWindow");
                } else {
                  this.$router.go(-1);
                }
              } catch (e) {
                console.log(e);
              }
            } else {
              Toast(res.data.message || "操作失败");
            }
          }).catch(err => {
            console.log(err);
          });
        } else {
          this.nextAction(params);
        }
      },

      headerBack() {
        this.$router.go(-1);
      },

      /**
       * 选择疾病下一步
       * 选择疾病期数,接口待定
       * **/
      nextAction(params) {
        this.$router.push({
            path: "chooseDiseaseAgain",
            query: {
              rdoctorid: params.rdoctorid,
              rillnessid: params.rillnessid,
              rillnessname: params.rillnessname,
              from: this.from
            }
          }
        );
      },
      /**
       * 设置其它疾病
       */
      setOtherDisease() {
        if (!this.otherDisease) {
          Toast({
            message: "请填写其它疾病名称",
            position: "bottom"
          });
          return;
        }
        this.$http.request({
          method: "post",
          url: "/RReportIllnessController/insertReportIllnessName",
          body: {
            rillnessname: this.otherDisease,
            rdoctorid: this.doctorId || ''
          }
        }).then(res => {
          if (res.data.success) {
            Toast({
              message: "疾病确认成功",
              position: "bottom"
            });
            try {
              if (!this.from) {
                WeixinJSBridge.call("closeWindow");
              } else {
                this.$router.go(-1);
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            Toast({
              message: "确认其它疾病接口出错",
              position: "bottom"
            });
            console.log("输入其它疾病接口出错");
          }
        }).catch(e => {
          console.log(e);
        });
      }

    },
    created() {
      if (this.$route.query.doctorId) {
        this.doctorId = this.$route.query.doctorId;
        this.getDiseaseListByDoctorID();
      }
      this.from = this.$route.query.from || "";
      // this.getDiseaseListByDoctorID();
      this.$nextTick(() => {
        let oSpan = document.getElementsByClassName("diseases_img");
        let spans = Array.prototype.slice.call(oSpan);
        spans &&
        spans.forEach(item => {
          let num = Math.ceil(Math.random() * 34 + 1);
          let path = require(`../../../assets/images/${num}.png`);
          item.style.background = `url("${path}") no-repeat center`;
          item.style.backgroundSize = `100% 100%`;
        });
      });
    }
  };
</script>

<style scoped lang="less">

  .choose_disease_page {
    background-color: @backgroundColor;
    box-sizing: border-box;
    .padding(54, 12, 100, 12);

    /deep/ .van-cell.van-cell--borderless.van-field {
      font-size: 16px;
    }

    /deep/ .van-field__left-icon .van-icon, .van-field__right-icon .van-icon {
      font-size: 20px;
      color: #CCCCCC;
    }

    .disease_choice {
      li {
        display: flex;
        position: relative;
        align-items: center;
        .height(46);
        background-color: #fff;
        .borderRadius(10, 10, 10, 10);
        margin-bottom: 10px;

        .disease_img_box {
          padding: 0 12px;
          border-right: 1px solid #F2F2F2;

          .diseases_img {
            display: block;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }

        .disease_name {
          flex: 1;
          width: 0;
          height: 100%;
          .lineHeight(46);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .fontSize(16);
          .margin(0, 0, 0, 10);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .disease_checkBox {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
          height: 100%;

          /deep/ .van-radio {
            width: 100%;
            height: 100%;

            div {
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              width: 100%;
              height: 100%;

              i {
                .margin(0, 12, 0, 0);
              }
            }
          }
        }
      }

      .disease_other {
        margin-bottom: 0;
        .borderRadius(10, 10, 0, 0);
      }

      .disease_other_box {
        background-color: #fff;
        .borderRadius(0, 0, 10, 10);

        .disease_other_rom {
          .padding(0, 10, 7, 54);

          .disease_input {
            /deep/ .van-cell {
              background-color: @borderColor;
              .padding(10, 10, 10, 10);
              .borderRadius(10, 10, 10, 10);

              .van-field__control {
                .fontSize(16);
              }
            }
          }

          .disease_text {
            .fontSize(14);
            font-weight: 400;
            color: @buttonColor;
            .lineHeight(20);
            .margin(7, 0, 0, 0);
          }
        }
      }
    }

    .noDisease {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        display: block;
        .width(200);
        .height(200);
        .margin(71, 0, 30, 0)
      }

      p {
        .fontSize(18);
        .lineHeight(18);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        text-align: center;
      }
    }
  }


  .footer-box {
    z-index: 222;
  }

</style>
