/**
*@desc 首页面板柱状图
*@author houpai
*@date 2019/12/05 08:52:53
*/
<template>
  <div class="barChart_page"
       :class="[{'scale':scale}]"
       ref="chartBox"
       @click="openDetailDialog">
    <div ref="chart"></div>
  </div>
</template>

<script>

  import {Bus} from '../../utils/bus.js'

  const echart = require('echarts')

  export default {
    name: "bar_chart",
    props: {
      /**
       * 弹窗交互
       * type 根据type触发不同统计类型的弹窗
       * position 弹窗位置
       * detailDialog 是否可以触发弹窗
       * **/
      type: {
        type: [String, Number],
        default() {
          return 1
        }
      },
      position: {
        type: String,
        default() {
          return 'middle'
        }
      },
      detailDialog: {
        type: Boolean,
        default() {
          return false
        }
      },
      dialogShow: {
        type: Boolean,
        default() {
          return false
        }
      },

      showSplitLine: {
        type: Boolean,
        default() {
          return true
        }
      },

      chartType: {
        type: String,
        default() {
          return '1'
        }
      },

      chartTitle: {
        type: String,
        default() {
          return '综合数值'
        }
      },

      color: {
        type: Array,
        default() {
          return ['#6340ff']
        }
      },

      legend: {
        type: Array,
        default() {
          return ['合作省份数']
        }
      },

      yData: {
        type: Array,
        default() {
          return [230]
        }
      },

      yAxisName: {
        type: String,
        default() {
          return '个'
        }
      },

      // 是否颜色渐变
      lineGradual: {
        type: Boolean,
        default() {
          return false
        }
      },
      /**
       * 线性渐变颜色**/
      lineColorBeg: {
        type: String,
        default() {
          return '#2EC775'
        }
      },

      lineColorEnd: {
        type: String,
        default() {
          return '#EE7438'
        }
      },

      cityStatistics: {
        type: Boolean,
        default() {
          return false
        }
      },

      xGranularity: {
        type: String,
        default() {
          return ''
        }
      },
    },

    computed: {
      xData() {
        let xdataArray = []
        if (this.xGranularity === '12month') {
          xdataArray = this.$getXAxisMonth(9, 'chinese')
        } else {
          xdataArray = this.$getXAxisMonth(3, 'chinese')
        }
        return xdataArray
      },
      series() {
        let seriesOption = []
        if (this.yData) {
          switch (this.chartType) {
            case '1':
              seriesOption = [
                {
                  name: this.legend[0],
                  barWidth: this.xGranularity ? 18 : 24,//柱图宽度
                  type: 'bar',
                  stack: '总量',
                  smooth: true,
                  data: this.yData,
                  itemStyle: {
                    normal: this.lineGradual ? {
                      color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                        {offset: 0, color: this.lineColorBeg},
                        {offset: 1, color: this.lineColorEnd}
                      ])
                    } : {},
                    emphasis: {}
                  }
                }
              ]
              break
            case '2':
              break
            case '3':
              break
            default:
              seriesOption = []
          }
        }
        return seriesOption
      },
      yAxisFormated() {
        return '单位: ' + this.yAxisName
      },
      gridBigger() {
        let grid = true
        for (let i = 0; i < this.yData.length; i++) {
          if (this.yData[i] > 10) {
            grid = false
            break
          }
        }
        return grid
      },
    },

    watch: {
      yData(val, oldVal) {
        this.echartDrew()
      },
      yAxisName(val, oldVal) {
        this.echartDrew()
      },
      dialogShow(val, oldVal) {
        if (!this.dialogShow) {
          this.scale = false
        }
      },
      cityStatistics(val, oldval) {
        this.handleResizeEvent()
      }
    },

    data() {
      return {
        chart: null,
        scale: false,
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.echartDrew()
      })
    },

    methods: {
      /**
       * echart init
       * **/
      echartDrew() {
        if (!this.chart) {
          let dom = this.$refs.chart
          let chart = this.chart = echart.init(dom)
          if (chart === 'undefined' || chart === null) {
            console.error(`echarts init err`)
            return false
          }
          this.$nextTick(() => {
            this.chart.setOption(this.generatorChartOption())
          })
        } else {
          this.$nextTick(() => {
            this.chart.setOption(this.generatorChartOption())
          })
        }
        window.addEventListener('resize', this.handleResizeEvent)
      },

      /**
       * 图表配置
       * **/
      generatorChartOption() {
        return {
          title: {
            x: 'center',
            // y: '3%',
            text: this.chartTitle,
            textStyle: {
              color: 'white',
              fontSize: '100%',
            },
            padding: [12, 0, 0, 0]
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          color: this.color,
          grid: {
            bottom: '5%',
            left: this.gridBigger ? '12%' : '10%',
            top: '36%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              axisLine: {
                show: false,
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#347993'
                }
              },
              data: this.xData,
            }
          ],
          yAxis: [
            {
              name: this.yAxisFormated,
              nameLocation: 'end',
              type: 'value',
              nameTextStyle: {
                color: '#347993',
                align: 'center',
                verticalAlign:'bottom'
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#347993'
                }
              },
              splitLine: {
                show: this.showSplitLine,
                lineStyle: {
                  color: '#5e5e5e'
                },
              }
            }
          ],
          series: this.series
        }
      },

      /**
       * 如果有图表实例，则对实例进行自适应调整
       * */
      handleResizeEvent() {
        let self = this
        if (this.chart) {
          setTimeout(function () {
            self.chart.resize()
          }, 100)
        }
      },

      openDetailDialog() {
        if (this.detailDialog) {
          this.scale = true
          let params = {
            position: this.position,
            type: this.type,
            isShow: true
          }
          Bus.$emit('updateChartOptions', params)
        } else {
          return false
        }
      }
    },

    beforeDestroy() {
      if (this.chart) {
        this.chart = null
      }
      window.removeEventListener('resize', this.handleResizeEvent)
    }
  }
</script>

<style scoped lang="less">
  .barChart_page {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    font-size: 16px;
    /*padding: 10px;*/
    -webkit-transform: scale(1.0);
    -moz-transform: scale(1.0);
    -o-transform: scale(1.0);
    -webkit-transition-duration: 0.5s;
    -moz-transition-duration: 0.5s;
    -o-transition-duration: 0.5s;

    div {
      width: 100%;
      height: 100%;
    }
  }

  .scale.barChart_page {
    -webkit-transform: scale(1.1) !important;
    -webkit-box-shadow: 0px 0px 30px #022762 !important;
    -moz-transform: scale(1.1) !important;
    -moz-box-shadow: 0px 0px 30px #022762 !important;
    -o-transform: scale(1.1) !important;
    -o-box-shadow: 0px 0px 30px #022762 !important;
  }
</style>
