/**
*@desc 市医院列表组件
*@author houpai
*@date 2019/12/05 13:59:20
*/
<template>
  <div class="cityMap_page">
    <div class="cityMap_content">
      <ul class="hospital_box">
        <el-scrollbar style="height: 100%">
          <li class="hospital_li"
              v-for="(item,index) in cityHospitalsList"
              :key="index"
              @click="openDetailDialog(item.cityName,item.name,item.id)"
              :class="[{'hospital_li_border':index !== cityHospitalsList.length - 1}]">
            <div class="left_box">
              <img src="../../assets/images/hospital.png" alt="">
            </div>
            <div class="right_box">
              <p class="hospital_name textCenter">
                {{item.name}}
              </p>
              <p class="hospital_message">
                <span>医院等级: {{item.level}} </span>
                <span style="margin-left: 12px">医院性质: {{item.nature}} </span>
                <span style="margin-left: 12px">医院类别: {{item.type}} </span>
              </p>
              <p class="hospital_address">
                <span>医院地址: {{item.address}} </span>
              </p>
            </div>
          </li>
        </el-scrollbar>
      </ul>
      <ul class="orderMessage_box" id="orderMessage_box">
        <order-scroll :order-list="cityHospitalOrdersList"></order-scroll>
      </ul>
    </div>
  </div>
</template>

<script>
  import {Bus} from '../../utils/bus.js'
  import orderScroll from '../../components/orderScroll/orderScroll'

  export default {
    name: "cityMap",
    components: {
      orderScroll
    },
    computed: {
      citysList() {
        let cityList = []
        cityList = JSON.parse(JSON.stringify(require('../../resources/hospitalData/hospital')))
        return cityList
      },
      cityHospitalsList() {
        let cityHospitalsList = []
        let cityName = this.$route.query.cityName || ''
        cityHospitalsList = this.citysList.filter((item) => {
          return item.cityName === cityName
        })
        return cityHospitalsList
      },
      cityHospitalOrdersList() {
        let ordersList = []
        this.cityHospitalsList.forEach((item) => {
          ordersList = ordersList.concat(item.orderList)
        })
        return ordersList
      }
    },
    methods: {
      /**
       * 点击查看医院数据
       * @params cityName 市名字
       * @params name 医院名字
       * **/
      openDetailDialog(cityName, name, hospitalId, type = "yiyuanxiangqing") {
        let params = {
          position: 'middle',
          type: type,
          isShow: true,
          hospitalId: hospitalId
        }
        Bus.$emit('updateChartOptions', params)
      }
    }
  }
</script>

<style scoped lang="less">
  .cityMap_page {
    width: 100%;
    height: 100%;
    position: relative;

    .cityMap_content {
      display: flex;
      flex-direction: column;
      position: absolute;
      z-index: 111;
      width: 680px;
      bottom: 70px;
      left: 522px;
      right: 522px;
      top: 230px;
      margin: auto;
      border: 2px solid rgba(63, 54, 250, 1);
      overflow: hidden;

      .orderMessage_box {
        height: 138px;
      }

      .hospital_box {
        flex: 1;
        height: calc(100% - 141px);
        border-bottom: 2px solid rgba(63, 54, 250, 1);

        .hospital_li {
          height: 33%;
          display: flex;
          align-items: center;
          cursor: pointer;

          .left_box {
            margin: 38px 20px 38px 50px;
            display: flex;
            align-items: center;
            height: 100%;

            img {
              display: block;
              width: 74px;
              /*height: 74px;*/
            }
          }

          .right_box {
            flex: 1;
            width: 0;

            p {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              font-size: 18px;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              margin: 10px 0;

              .textCenter {
                text-align: center;
              }

              span {
                font-size: 16px;
                font-weight: 400;
                color: rgba(73, 164, 187, 1);
              }
            }
          }
        }

        .hospital_li_border {
          border-bottom: 2px solid #0A1C65;
        }
      }
    }

  }
</style>
