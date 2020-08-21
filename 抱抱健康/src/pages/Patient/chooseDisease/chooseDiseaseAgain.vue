/**
*@desc 选择疾病期数
*@author houpai
*@date 2020/01/14 16:22:26
*/
<template>
  <div class="chooseDiseaseAgain_page">
    <common-header
        :share-disabled="true"
        :title="'病期'"
        :header-show="true"
        :custom-title="'选择疾病'">
    </common-header>

    <div class="chooseDiseaseAgain_top">
      <div class="chooseDiseaseAgain_desc">
        <p>请选择病期期数</p>
        <p class="disease_name">{{rillnessname}}</p>
      </div>
      <div class="img_box">
        <img src="../../../assets/images/chooseDiseaseAgain.png" alt="">
      </div>
    </div>

    <ul class="disease_choice">
      <van-radio-group v-model="chooseIndex">
        <li v-for="(item, index) in diseaseStageList" :key="index">
          <p class="disease_stage_name">
            {{item.tasknumbertext}}
          </p>
          <div style="width: 32px"></div>
          <div class="disease_checkBox">
            <van-radio :name="index"></van-radio>
          </div>
        </li>
      </van-radio-group>
    </ul>

    <div class="footer-box">
      <div class="next-btn"
           @click="submitChooseDisease">
        <van-button slot="button" class="next-btn" size="large">完成</van-button>
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
    name: "chooseDiseaseAgain",
    components: {
      commonHeader
    },
    data() {
      return {
        loading: false,
        chooseIndex: "",
        rdoctorid: "",
        rillnessid: "",
        rillnessname: "",
        diseaseStageList: [],
        from: ""
      };
    },
    methods: {
      /**
       * 查询疾病期数**/
      getDiseaseStageList(id) {
        this.$http.request({
          method: "get",
          url: "/RIllnessController/selectqishuByid",
          body: {
            id: id,
            rdoctorid: this.rdoctorid
          }
        }).then(res => {
          if (res.data.success) {
            let diseaseStageList = res.data.data || [];
            this.diseaseStageList = diseaseStageList.filter(function (s) {
              return s.tasknumbertext;
            });
          }
        });
      },
      /**
       * 提交选择疾病
       * 选择疾病期数之前限制提交
       * **/
      submitChooseDisease() {
        let tasknumber;
        let periods = (this.chooseIndex !== "" && this.diseaseStageList[this.chooseIndex].tasknumbertext) || "";
        try {
          tasknumber = (this.chooseIndex !== "" && this.diseaseStageList[this.chooseIndex].tasknumber);
        } catch (e) {
          console.log(e);
        }
        if (!periods) {
          Toast({
            message: "请选择疾病期数",
            position: "bottom"
          });
          return false;
        }
        this.$http.request({
          method: "post",
          url: "/RReportIllnessController/insertReportIllness",
          body: {
            rdoctorid: this.rdoctorid,
            rillnessid: this.rillnessid,
            rillnessname: this.rillnessname,
            periods: periods,
            periodsnumber: tasknumber
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
                this.$router.go(-2);
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            console.log("选择疾病业务接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      }
    },
    created() {
      this.from = this.$route.query.from || "";
      let queryAry = Object.keys(this.$route.query);
      if (queryAry.length) {
        this.rillnessid = this.$route.query.rillnessid;
        this.rdoctorid = this.$route.query.rdoctorid;
        this.rillnessname = this.$route.query.rillnessname;
        this.getDiseaseStageList(this.rillnessid);
      }
    }
  };
</script>

<style scoped lang="less">
  .chooseDiseaseAgain_page {
    .padding(44, 12, 100, 12);
    box-sizing: border-box;

    .chooseDiseaseAgain_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .height(104);

      .chooseDiseaseAgain_desc {
        flex: 1;
        width: 0;

        p {
          .fontSize(18);
          .lineHeight(22);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          .margin(8, 0, 8, 0);
        }

        .disease_name {
          .fontSize(16);
          .lineHeight(20);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-weight: bold;
          color: rgba(0, 105, 255, 1);
        }
      }

      .img_box {
        height: 100%;
        .width(146);

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }

    .disease_choice {
      li {
        display: flex;
        position: relative;
        align-items: center;
        .height(46);
        background-color: #fff;
        .borderRadius(10, 10, 10, 10);
        .margin(0, 0, 20, 0);

        .disease_stage_name {
          display: flex;
          align-items: center;
          flex: 1;
          width: 0;
          height: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .fontSize(16);
          .lineHeight(20);
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          .margin(0, 0, 0, 10);
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
    }
  }

  .footer-box {
    z-index: 222;
  }
</style>
