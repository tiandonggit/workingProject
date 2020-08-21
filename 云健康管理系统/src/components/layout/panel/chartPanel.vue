/**
*@desc 首页统计图面板
*@author houpai
*@date 2019/12/05 08:53:18
*/
<template>
  <div class="chartPanel_page">
    <div class="left_box" v-if="panelType === 'left'">
      <el-row :gutter="0">
        <el-col :span="12">
          <div class="chart_box">
            <line-chart :chartType="'2'"
                        :type="'jiaoyichengguo'"
                        :position="'right'"
                        :y-data="jiaoyichengguo.yData"
                        :detail-dialog="true"
                        :confine="true"
                        :yAxisName="'万'"
                        :color="['#6340FF']"
                        :chartTitle="'医智成果累计交易数量 ＞'"
                        :legend="['医智成果累计交易数量', '']"
                        :lineGradual="false"
                        :dialogShow="dialogShow"
                        :areaStyle="true"></line-chart>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart_box">
            <line-chart :chartType="'2'"
                        :type="'huanjiaowenzhang'"
                        :position="'right'"
                        :detail-dialog="true"
                        :color="['#38F083']"
                        :chartTitle="'患教文章累计数量 ＞'"
                        :legend="['患教文章累计数量', '']"
                        :y-data="huanjiaowenzhang.yData"
                        :yAxisName="wenzhangCompany"
                        :lineGradual="false"
                        :dialogShow="dialogShow"
                        :areaStyle="true"></line-chart>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <div class="chart_box">
            <line-chart :chartType="'2'"
                        :color="['#00ACFF']"
                        :type="'kangfurenwu'"
                        :position="'right'"
                        :confine="true"
                        :detail-dialog="true"
                        :chartTitle="'康复任务累计数量 ＞'"
                        :legend="['康复任务累计数量', '']"
                        :y-data="kangfurenwu.yData"
                        :yAxisName="'个'"
                        :lineGradual="false"
                        :dialogShow="dialogShow"
                        :areaStyle="true"></line-chart>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart_box">
            <line-chart :chartType="'2'"
                        :color="['#F07538']"
                        :type="'chanpin'"
                        :position="'right'"
                        :detail-dialog="true"
                        :chartTitle="'产品累计数量 ＞'"
                        :legend="['产品累计数量', '']"
                        :y-data="chanpin.yData"
                        :yAxisName="'个'"
                        :lineGradual="false"
                        :dialogShow="dialogShow"
                        :areaStyle="true"></line-chart>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <div class="chart_box">
            <line-chart :chartType="'2'"
                        :color="['#DFF12B']"
                        :type="'rihuoyue'"
                        :xGranularity="'date'"
                        :position="'right'"
                        :detail-dialog="true"
                        :chartTitle="'日活跃医生数量 ＞'"
                        :legend="['日活跃医生数量', '']"
                        :y-data="rihuoyue.yData"
                        :yAxisName="'人'"
                        :lineGradual="false"
                        :dialogShow="dialogShow"
                        :areaStyle="true"></line-chart>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="right_box" v-if="panelType === 'right'">
      <el-row :gutter="0">
        <el-col :span="12" v-if="!cityStatistics">
          <bar-chart :dialogShow="dialogShow"
                     :cityStatistics="cityStatistics"
                     :y-data="hezuoshengfen.yData"
                     :chartTitle="'合作省份数量'"
                     :legend="['合作省份数量']"
                     :color="['#005EE5']"></bar-chart>
        </el-col>
        <el-col :span="12" v-if="!cityStatistics">
          <bar-chart :dialogShow="dialogShow"
                     :cityStatistics="cityStatistics"
                     :y-data="hezuoyiyuan.yData"
                     :detail-dialog="true"
                     :type="'hezuoyiyuan'"
                     :position="'left'"
                     :yAxisName="'家'"
                     :chartTitle="'合作医院数量 ＞'"
                     :legend="['合作医院数量']"
                     :color="['#31FFB4']"></bar-chart>
        </el-col>
        <el-col :span="24" v-if="cityStatistics">
          <bar-chart :dialogShow="dialogShow"
                     :y-data="hezuoyiyuan.yData"
                     :type="'hezuoyiyuan'"
                     :cityStatistics="cityStatistics"
                     :detail-dialog="true"
                     :xGranularity="'12month'"
                     :position="'left'"
                     :yAxisName="'家'"
                     :chartTitle="'合作医院数量 ＞'"
                     :legend="['合作医院数量']"
                     :color="['#31FFB4']"></bar-chart>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <bar-chart :dialogShow="dialogShow"
                     :type="'hezuokeshi'"
                     :position="'left'"
                     :detail-dialog="true"
                     :y-data="hezuokeshi.yData"
                     :chartTitle="'合作科室数量 ＞'"
                     :legend="['合作科室数量']"
                     :color="['#0CE5FF']"></bar-chart>
        </el-col>
        <el-col :span="12">
          <bar-chart :dialogShow="dialogShow"
                     :y-data="hezuogui.yData"
                     :chartTitle="'合作柜数量'"
                     :legend="['合作柜数量']"
                     :color="['#6340FF']"></bar-chart>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <bar-chart :dialogShow="dialogShow"
                     :chartTitle="'合作医生数量 ＞'"
                     :type="'hezuoyisheng'"
                     :detail-dialog="true"
                     :position="'left'"
                     :yAxisName="yishengCompany"
                     :y-data="hezuoyisheng.yData"
                     :legend="['合作医生数量']"
                     :color="['#FF45CD']"></bar-chart>
        </el-col>
        <el-col :span="12">
          <bar-chart :dialogShow="dialogShow"
                     :chartTitle="'合作患者数量 ＞'"
                     :type="'hezuohuanzhe'"
                     :detail-dialog="true"
                     :yAxisName="'万'"
                     :position="'left'"
                     :y-data="hezuohuanzhe.yData"
                     :legend="['合作患者数量']"
                     :color="['#FF864A']"></bar-chart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

  import lineChart from '../../panelChart/line_chart'
  import barChart from '../../panelChart/bar_chart'
  import {mapState} from "vuex"

  export default {
    name: "chartPanel",
    components: {
      lineChart,
      barChart
    },
    watch: {
      $route(to, from) {
        this.chartDataInit()
        this.showProvinceInit()
        this.companyInit()
      }
    },
    computed: {
      ...mapState(["mapData"]),
    },
    props: {
      dialogShow: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 省和市统计粒度下,无合作省份合作统计图表
      showProvinceChart: {
        type: Boolean,
        default() {
          return true
        }
      },
      // 面板显示类型, 左面板 右面板
      panelType: {
        type: String,
        default() {
          return 'left'
        }
      }
    },
    data() {
      return {
        jiaoyichengguo: {
          yData: [],
        },
        huanjiaowenzhang: {
          yData: [],
        },
        kangfurenwu: {
          yData: [],
        },
        chanpin: {
          yData: [],

        },
        rihuoyue: {
          yData: [],

        },
        hezuoshengfen: {
          yData: [],

        },
        hezuoyiyuan: {
          yData: [],

        },
        hezuokeshi: {
          yData: [],

        },
        hezuogui: {
          yData: [],

        },
        hezuoyisheng: {
          yData: [],

        },
        hezuohuanzhe: {
          yData: [],

        },
        cityStatistics: false, // 是否为省和市级数据统计
        yishengCompany: '千',
        wenzhangCompany: '千篇',
      }
    },
    methods: {
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
          Object.keys(chartData).forEach(key => {
            this[key] = chartData[key]
          })
        } catch (e) {
          console.log('面板json数据有误')
        }
      },

      /**
       * 是否显示合作省份统计**/
      showProvinceInit() {
        let path = this.$route.path.replace(/\//g, '')
        this.cityStatistics = path !== 'home'
      },

      /**
       * 患教文章和合作医生y轴名称适配修改**/
      companyInit() {
        let path = this.$route.path.replace(/\//g, '')
        if (path === 'home') {
          this.yishengCompany = '千'
          this.wenzhangCompany = '千篇'
        } else {
          this.yishengCompany = '个'
          this.wenzhangCompany = '篇'
        }
      }
    },
    created() {
      this.chartDataInit()
      this.showProvinceInit()
    }
  }
</script>

<style scoped lang="less">
  .chartPanel_page {
    width: 100%;
    height: 100%;

    /deep/ .el-row {
      height: 33%;
    }

    /deep/ .el-col {
      height: 100%;
    }

    .chart_box {
      width: 100%;
      height: 100%;
    }

    .left_box {
      width: 100%;
      height: 100%;
      padding: 10px;
    }

    .right_box {
      width: 100%;
      height: 100%;
      padding: 10px;
    }
  }
</style>
