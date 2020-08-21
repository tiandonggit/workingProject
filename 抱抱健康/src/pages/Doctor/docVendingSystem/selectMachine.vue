/*
 * @Author: 田东 
 * @Date: 2020-01-03 15:00:33 
 * @Last Modified by: 田东
 * @Last Modified time: 2020-07-13 09:43:15
 * @Description:智配柜 选择
 */
<template>
  <div id="selectMachine">
    <common-header
      :share-disabled="true"
      :custom-title="'选择智配柜'"
      :header-show="false"
      :title="items.length > 0 ? '选择智配柜' : '暂未绑定智配柜'"
    ></common-header>
    <ul v-if="items.length > 0">
      <li
        v-for="(item, index) in items"
        :key="index"
        @click.stop="goList(item)"
      >
        <div class="imgDiv">
          <img :src="item.vendingMachine" alt v-if="item.vendingMachine" />
        </div>
        <div class="content">
          <p class="num">{{ item.deviceName }}{{ item.deviceCode }}</p>
          <p class="address">{{ item.deviceFullAdress }}</p>
        </div>
        <div class="iconDiv">
          <van-icon name="arrow" />
        </div>
      </li>
    </ul>
    <div class="noResult" v-else>
      <img :src="noResult" alt="" />
      <p>您还未绑定智配柜 请绑定后再进行营养推荐</p>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import commonHeader from "../../../components/commonHeader/common_header";
import vendingMachine from "../../../assets/images/vendingMachine1.png";
import noResult from "../../../assets/images/noResult.png";

export default {
  name: "selectMachine",
  data() {
    return {
      items: [],
      noResult: noResult,
      vendingMachine: vendingMachine
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.getDocMachineId();
  },
  methods: {
    goList(data) {
      window.localStorage.removeItem("docProductList");
      this.$router.push({
        name: "docProductList",
        query: {
          deviceId: data.deviceId,
          deviceName: data.deviceName,
          deviceCode: data.deviceCode
        }
      });
    },
    //获取的商城id
    getDocMachineId() {
      this.$http
        .request({
          method: "get",
          url: "RDoctorController/getDeviceList",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.getMachineId(res.data.data);
          } else {
            console.log("获取数据失败");
          }
        })
        .catch(error => {
          Toast("请求数据失败~~");
        });
    },
    //获取机器的商城id
    getMachineId(data) {
      let url =
        this.$globalServiceHost.selfMachineHost +
        "/MDeviceController/deviceList";
      this.$http
        .request({
          method: "get",
          url: url,
          body: {
            deviceId: data
          }
        })
        .then(res => {
          if (res.data.success) {
            this.items = res.data.data;
            this.items.forEach(item => {
              item.vendingMachine = this.vendingMachine;
            });
          } else {
            Toast(res.data.message);
          }
        })
        .catch(error => {
          Toast("请求数据失败~~");
        });
    }
  }
};
</script>

<style lang="less" scoped>
#selectMachine {
  overflow: auto;
  width: 100%;
  height: 100%;
  .padding(12, 12, 12, 12);
  box-sizing: border-box;
  background-color: @backgroundColor;

  ul {
    width: 100%;
    height: 100%;
    // overflow: auto;
    li {
      background-color: @backgroundColorT;
      // .height(80);
      .padding(11, 8, 11, 8);
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 15, 0);
      display: flex;
      justify-content: space-around;
      align-items: center;

      .imgDiv {
        .width(57);
        .height(57);
        text-align: center;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        width: 70%;
        .height(57);
        padding-left: 5px;

        .num {
          .lineHeight(22);
          .fontSize(16);
          color: @titleColor;
          word-break: break-all;
          font-weight: bold;
          .overflowline(1);
        }
        .address {
          .margin(14,0,0,0);
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
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: @descriptionColor;
      line-height: 20px;
    }
  }
}
</style>
