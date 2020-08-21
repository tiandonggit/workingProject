/**
*@desc 面板组件
*@author houpai
*@date 2019/12/05 08:54:01
*/
<template>
  <div class="panel_page">
    <div class="left_box">
      <div class="panel1_box">
        <span class="percentage">
          {{numericalValuePercentage}}
        </span>
        <div class="message_box">
          <div class="message_box_left">
            <p class="numericalValue">
              {{numericalValue}}
            </p>
            <p class="numericalValue_desc">
              今日交易额
              <img src="../../../assets/images/rise.png" alt="">
            </p>
          </div>
          <div class="message_box_right">
            <!--            <i class="el-icon-arrow-right"></i>-->
          </div>
        </div>
      </div>
      <div class="panel2_box" @click="openDetailDialog('kaidanshu')">
        <span class="percentage">
          {{ordersNumberPercentage}}
        </span>
        <div class="message_box">
          <div class="message_box_left">
            <p class="numericalValue">
              {{ordersNumber}}
            </p>
            <p class="numericalValue_desc">
              今日开单数量
              <img src="../../../assets/images/rise.png" alt="">
            </p>
          </div>
          <div class="message_box_right">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="right_box">
      <div class="panel3_box" @click="openDetailDialog('goumailv')">
        <span class="percentage">{{jinrigoumailvyuce}}</span>
        <div class="message_box">
          <div class="message_box_left">
            <p class="numericalValue">
              {{jinrigoumailv}}
            </p>
            <p class="numericalValue_desc">
              今日购买率
              <img src="../../../assets/images/rise.png" alt="">
            </p>
          </div>
          <div class="message_box_right">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <div class="panel4_box" @click="openDetailDialog('pingjunkedanjian')">
        <span class="percentage">{{jinripingjunkejiayuce}}</span>
        <div class="message_box">
          <div class="message_box_left">
            <p class="numericalValue">
              {{jinripingjunkejia}}
            </p>
            <p class="numericalValue_desc">
              今日客单均价
              <img src="../../../assets/images/rise.png" alt="">
            </p>
          </div>
          <div class="message_box_right">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {Bus} from '../../../utils/bus.js'
  import {mapState} from "vuex"

  export default {
    name: "panel",
    props: {
      panelData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        jinrigoumailv: '',
        jinrigoumailvyuce: '',
        jinripingjunkejian: '',
        jinripingjunkejianyuce: '',
      }
    },
    watch: {
      $route(to, from) {
        this.chartDataInit()
      }
    },
    computed: {
      ...mapState(["mapData"]),
      ...mapState(["homeData"]),
      /**
       * 根据全国,省,市来统计今日交易额**/
      numericalValue() {
        let numericalValue = 0
        let path = this.$route.path.replace(/\//g, '')
        let chartData = this.homeData.hospitalData
        switch (path) {
          case 'cityMap':
            let cityName = this.$route.query.cityName || ''
            chartData = chartData.filter(item => {
              return item.cityName === cityName
            })
            chartData.forEach((hospital => {
              numericalValue += Number(hospital.today[1].value)
            }))
            break
          case 'provinceMap':
            let provinceName = this.$route.query.provinceName || ''
            chartData = chartData.filter(item => {
              return item.provinceName === provinceName
            })
            chartData.forEach((hospital => {
              numericalValue += Number(hospital.today[1].value)
            }))
            break
          default:
            chartData.forEach((hospital => {
              numericalValue += Number(hospital.today[1].value)
            }))
        }
        return this.$scientificBase(numericalValue.toFixed(2))
      },
      numericalValuePercentage() {
        let numericalValuePercentage = ''
        let path = this.$route.path.replace(/\//g, '')
        let chartData = JSON.parse(JSON.stringify(require('../../../resources/chartData/china/china.json')))
        let index
        switch (path) {
          case 'cityMap':
            let cityName = this.$route.query.cityName || ''
            index = this.$indexVf(this.mapData.citysText, cityName)
            if (index > -1) {
              chartData = require(`../../../resources/chartData/city/${this.mapData.citys[index]}.json`)
            }
            break
          case 'provinceMap':
            let provinceName = this.$route.query.provinceName
            index = this.$indexVf(this.mapData.provincesText, provinceName)
            if (index > -1) {
              chartData = require(`../../../resources/chartData/province/${this.mapData.provinces[index]}.json`)
            }
            break
          default:
            chartData = JSON.parse(JSON.stringify(require('../../../resources/chartData/china/china.json')))
        }
        numericalValuePercentage = chartData.jinrixiaoshoueyuce || ''
        return numericalValuePercentage
      },
      /**
       * 根据全国,省,市来统计今日开单数量**/
      ordersNumber() {
        let ordersNumber = 0
        let path = this.$route.path.replace(/\//g, '')
        let chartData = this.homeData.hospitalData
        let index
        switch (path) {
          case 'cityMap':
            let cityName = this.$route.query.cityName || ''
            chartData = chartData.filter(item => {
              return item.cityName === cityName
            })
            chartData.forEach((hospital => {
              ordersNumber += Number(hospital.today[0].value)
            }))
            break
          case 'provinceMap':
            let provinceName = this.$route.query.provinceName || ''
            chartData = chartData.filter(item => {
              return item.provinceName === provinceName
            })
            chartData.forEach((hospital => {
              ordersNumber += Number(hospital.today[0].value)
            }))
            break
          default:
            chartData.forEach((hospital => {
              ordersNumber += Number(hospital.today[0].value)
            }))
        }
        return this.$scientificBase(ordersNumber)
      },
      ordersNumberPercentage() {
        let ordersNumberPercentage = ''
        let path = this.$route.path.replace(/\//g, '')
        let chartData = JSON.parse(JSON.stringify(require('../../../resources/chartData/china/china.json')))
        let index
        switch (path) {
          case 'cityMap':
            let cityName = this.$route.query.cityName || ''
            index = this.$indexVf(this.mapData.citysText, cityName)
            if (index > -1) {
              chartData = require(`../../../resources/chartData/city/${this.mapData.citys[index]}.json`)
            }
            break
          case 'provinceMap':
            let provinceName = this.$route.query.provinceName
            index = this.$indexVf(this.mapData.provincesText, provinceName)
            if (index > -1) {
              chartData = require(`../../../resources/chartData/province/${this.mapData.provinces[index]}.json`)
            }
            break
          default:
            chartData = JSON.parse(JSON.stringify(require('../../../resources/chartData/china/china.json')))
        }
        ordersNumberPercentage = chartData.jinrikaidanshuyuce || ''
        return ordersNumberPercentage
      }
    },
    methods: {
      /**
       * 开启详情弹窗**/
      openDetailDialog(type) {
        let params = {
          position: 'middle',
          type: type,
          isShow: true
        }
        Bus.$emit('updateChartOptions', params)
      },

      /**
       * 根据路由获取chart数据
       * **/
      chartDataInit() {
        let path = this.$route.path.replace(/\//g, '')
        let chartData = JSON.parse(JSON.stringify(require('../../../resources/chartData/china/china.json')))
        let index
        switch (path) {
          case 'cityMap':
            let cityName = this.$route.query.cityName
            index = this.$indexVf(this.mapData.citysText, cityName)
            if (index > -1) {
              chartData = require(`../../../resources/chartData/city/${this.mapData.citys[index]}.json`)
            }
            break
          case 'provinceMap':
            let provinceName = this.$route.query.provinceName
            index = this.$indexVf(this.mapData.provincesText, provinceName)
            if (index > -1) {
              chartData = require(`../../../resources/chartData/province/${this.mapData.provinces[index]}.json`)
            }
            break
          default:
            chartData = JSON.parse(JSON.stringify(require('../../../resources/chartData/china/china.json')))
        }
        try {
          this.jinrigoumailv = chartData.jinrigoumailv || ''
          this.jinripingjunkejia = chartData.jinripingjunkejia || ''
          this.jinrigoumailvyuce = chartData.jinrigoumailvyuce || ''
          this.jinripingjunkejiayuce = chartData.jinripingjunkejiayuce || ''
        } catch (e) {
          console.log('面板json数据有误')
        }
      },
    },
    created() {
      this.chartDataInit()
    }
  }
</script>

<style scoped lang="less">
  .panel_page {
    position: relative;
    z-index: 998;
    display: flex;
    height: 196px;
    align-items: center;

    .panel1_box, .panel2_box, .panel3_box, .panel4_box {
      width: 380px;
      height: 156px;
    }

    .percentage {
      display: inline-block;
      position: absolute;
      left: 0;
      width: 42%;
      height: 92%;
      line-height: 149px;
      text-align: center;
      font-size: 23px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }

    .message_box {
      display: flex;
      width: 58%;
      height: 100%;

      .message_box_left {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        flex: 1;
        height: 100%;
        padding-top: 20px;

        .numericalValue {
          margin: 0 0 6px 0;
        }

        .numericalValue_desc {
          margin: 6px 0 0 0;
          display: flex;
          align-items: center;

          img {
            display: block;
            width: 18px;
            height: 20px;
            margin-left: 10px;
          }
        }

        p {
          width: 100%;
          text-align: left;
          padding-left: 30px;
          font-size: 20px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }
      }

      .message_box_right {
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      i {
        font-size: 24px;
        display: inline-block;
        height: 30px;
        margin: 20px 0 0 0;
      }
    }

    .left_box {
      display: flex;
      width: 50%;
      height: 146px;
      padding-left: 60px;

      .panel1_box {
        display: flex;
        justify-content: flex-end;
        position: relative;
        margin-right: 40px;
        background: url("../../../assets/images/panel1.gif") no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;
      }

      .panel2_box {
        display: flex;
        justify-content: flex-end;
        position: relative;
        background: url("../../../assets/images/panel2.gif") no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .right_box {
      display: flex;
      justify-content: flex-end;
      width: 50%;
      height: 146px;
      padding-right: 60px;

      .panel3_box {
        display: flex;
        justify-content: flex-end;
        position: relative;
        background: url("../../../assets/images/panel3.gif") no-repeat center;
        background-size: 100% 100%;
        margin-right: 40px;
        cursor: pointer;
      }

      .panel4_box {
        display: flex;
        justify-content: flex-end;
        position: relative;
        background: url("../../../assets/images/panel4.gif") no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
  }
</style>
