<template>
  <div id="selectMachineIM">
    <common-header
        :share-disabled="true"
        :custom-title="'选择智配柜'"
        :header-show="false"
        :title="'选择智配柜'"
    ></common-header>
    <ul class="post-box">
      <li @click="post()">
        <div class="content">
          <p class="title">邮寄专区</p>
          <p class="desc">邮寄到家方便省心</p>
        </div>
        <div class="iconDiv">
          <van-icon name="arrow"/>
        </div>
      </li>
    </ul>
    <ul class="device-box">
      <div class="title">智配柜自提</div>
      <li v-for="(item, index) in items"
          :key="index" @click.stop="goList(item)">
        <div class="imgDiv">
          <img :src="item.vendingMachine" alt
               v-if="item.vendingMachine"/>
        </div>
        <div class="content">
          <p class="num">{{ item.deviceName }}{{ item.deviceCode }}</p>
          <p class="address">{{ item.deviceFullAdress }}</p>
        </div>
        <div class="iconDiv">
          <van-icon name="arrow"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

  import {Toast, Dialog} from "vant";
  import commonHeader from "../../../components/commonHeader/common_header";
  import vendingMachine from "../../../assets/images/vendingMachine1.png";
  import noResult from "../../../assets/images/noResult.png";
  import {mapState} from 'vuex'

  export default {
    name: "chooseRecommendationType",
    data() {
      return {
        items: [],
        noResult: noResult,
        vendingMachine: vendingMachine,
        doctorId:'',
      };
    },
    components: {
      commonHeader
    },
    computed:{
      ...mapState(["Patient","PatientIM"])
    },
    methods: {
      /**
       * 自营产品自选
       * **/
      post() {
        window.localStorage.removeItem("patientDrugsList");
        this.$router.push({
          name: "patientSelectdrugs"
        });
      },
      /**
       * 药柜产品自选
       * **/
      goList(data) {
        window.localStorage.removeItem("patientProductList");
        this.$router.push({
          name: "patientProductList",
          query: {
            patientId: this.PatientIM.patientMessage.id || '',
            deviceId: data.deviceId,
            deviceName: data.deviceName,
            deviceCode: data.deviceCode,
            doctorId:this.doctorId
          }
        });
      },
      /**
       * 获取自提柜列表
       * **/
      getMachineId() {
        this.$http.request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/selectDeviceListEx",
          body: {
            type: this.doctorId ? 1 : 0,
            id: this.doctorId ? this.doctorId : this.PatientIM.patientMessage.id
          }
        }).then(res => {
          if (res.data.success) {
            this.items = res.data.data || [];
            this.items.forEach(item => {
              item.vendingMachine = this.vendingMachine;
            });
          } else {
            Toast(res.data.message || '操作失败');
          }
        }).catch(error => {
          console.log(error);
        });
      }
    },
    created() {
      this.doctorId = this.$route.query.doctorId || '';
      this.getMachineId();
    },
  };
</script>

<style lang="less" scoped>
  #selectMachineIM {
    overflow: auto;
    width: 100%;
    height: 100%;
    .padding(12, 12, 12, 12);
    box-sizing: border-box;
    background-color: @backgroundColor;

    ul.device-box {
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;
      .padding(0, 10, 3, 10);
      background-color: @backgroundColorT;

      .title {
        .fontSize(16);
        font-weight: bold;
        color: @titleColor;
        .lineHeight(20);
        .padding(13, 0, 13, 0);
      }

      li {
        background-color: @backgroundColor;
        .padding(11, 10, 11, 10);
        display: flex;
        justify-content: space-around;
        align-items: center;
        .margin(0, 0, 12, 0);
        .borderRadius(10, 10, 10, 10);

        .imgDiv {
          .width(48);
          .height(48);
          text-align: center;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .content {
          width: 70%;
          .height(48);
          padding-left: 5px;

          .num {
            .margin(2, 0, 0, 0);
            .lineHeight(20);
            .fontSize(14);
            color: @titleColor;
            word-break: break-all;
            font-weight: bold;
            .overflowline(1);
          }

          .address {
            .fontSize(14);
            .margin(4, 0, 0, 0);
            color: #999999;
            .lineHeight(20);
            word-break: break-all;
            .overflowline(1);
          }
        }

        .iconDiv {
          font-size: 20px;
        }
      }
    }

    ul.post-box {
      width: 100%;
      .borderRadius(10, 10, 10, 10);
      overflow: hidden;
      .margin(0, 0, 20, 0);

      li {
        background-color: @backgroundColorT;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .padding(15, 10, 12, 10);
      }

      .content {
        flex: 1;
        padding-left: 0;

        .title {
          .fontSize(16);
          font-weight: bold;
          color: @titleColor;
          .lineHeight(20);
          .margin(0, 0, 15, 0);
        }

        .desc {
          .fontSize(14);
          font-weight: 400;
          color: @descriptionColor;
          .lineHeight(20);
        }
      }

      .iconDiv {
        font-size: 20px;
      }
    }

    // 医生未绑定药柜
    .noResult {
      width: 100%;
      display: flex;
      // justify-content: center;
      align-items: center;
      flex-direction: column;

      img {
        .margin(45, 0, 75, 0);
        .width(209);
      }

      p {
        .fontSize(16);
        font-weight: 400;
        color: @descriptionColor;
        line-height: 20px;
      }
    }
  }
</style>

