/**
*@desc 首页面板折线图
*@author houpai
*@date 2019/12/05 08:54:48
*/
<template>
  <div class="lineChart_page"
       :class="[{'scale':scale}]"
       ref="chartBox"
       @click="openDetailDialog">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>

  import {Bus} from '../../utils/bus.js'

  const echart = require('echarts')

  export default {
    name: "line_chart",
    props: {
      confine:{
        type: Boolean,
        default() {
          return false
        }
      },
      xGranularity: {
        type: String,
        default() {
          return 'month'
        }
      },
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
      // 弹窗是否在显示,如显示点击不缩放canvas容器
      dialogShow: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 是否显示分割线
      showSplitLine: {
        type: Boolean,
        default() {
          return true
        }
      },
      // chart 类型,传入不同配置项
      chartType: {
        type: String,
        default() {
          return '2'
        }
      },

      // chart标题
      chartTitle: {
        type: String,
        default() {
          return '综合数值'
        }
      },

      // 是否颜色渐变
      lineGradual: {
        type: Boolean,
        default() {
          return false
        }
      },

      // 是否带区域渐变背景色
      areaStyle: {
        type: Boolean,
        default() {
          return false
        }
      },

      // color配置项
      color: {
        type: Array,
        default() {
          return ['#2EC775', '#EE7438']
        }
      },

      // 图例
      legend: {
        type: Array,
        default() {
          return ['康复任务累计数量', '产品累计数量']
        }
      },

      yData: {
        type: Array,
        default() {
          return [10, 800, 650]
        }
      },

      // y轴title
      yAxisName: {
        type: String,
        default() {
          return '个'
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

      lineColorBeg2: {
        type: String,
        default() {
          return '#a30bff'
        }
      },

      lineColorEnd2: {
        type: String,
        default() {
          return '#45b8e2'
        }
      }
    },

    computed: {
      xData() {
        let xdataArray = []
        if (this.xGranularity === 'date') {
          xdataArray = this.$getXAxisDay()
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
                  name: this.legendData[0],
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  data: this.yData,
                  itemStyle: {
                    normal: {
                      color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                        {offset: 0, color: this.lineColorBeg},
                        {offset: 1, color: this.lineColorEnd}
                      ])
                    },
                    emphasis: {}
                  },
                  areaStyle: {
                    normal: {
                      color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: this.lineGradual ? this.lineColorBeg : this.color[0]
                      }, {
                        offset: 1,
                        color: '#061845'
                      }]),
                      opacity: this.areaStyle ? 1 : 0
                    },
                  },
                },
                {
                  name: this.legendData[1],
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  data: this.yData.data2,
                  itemStyle: {
                    normal: {
                      color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                        {offset: 0, color: this.lineColorBeg2},
                        {offset: 1, color: this.lineColorEnd2}
                      ])
                    },
                    emphasis: {}
                  },
                  areaStyle: {
                    normal: {
                      color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: this.lineGradual ? this.lineColorBeg2 : this.color[1]
                      }, {
                        offset: 1,
                        color: '#061845'
                      }]),
                      opacity: this.areaStyle ? 0.5 : 0
                    }
                  }
                }
              ]
              break
            case '2':
              seriesOption = [
                {
                  name: this.legendData[0],
                  type: 'line',
                  smooth: true,
                  data: this.yData,
                  itemStyle: this.lineGradual ? {
                    normal: {
                      color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                        {offset: 0, color: this.lineColorBeg},
                        {offset: 1, color: this.lineColorEnd}
                      ])
                    },
                    emphasis: {}
                  } : {},
                  areaStyle: {
                    normal: {
                      color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: this.lineGradual ? this.lineColorBeg : this.color[0]
                      }, {
                        offset: 1,
                        color: '#061845'
                      }]),
                      opacity: this.areaStyle ? 0.5 : 0
                    },
                  },
                }
              ]
              break
            case '3':
              seriesOption = [{
                name: this.legendData[0],
                smooth: true,   //关键点，为true是不支持虚线，实线就用true
                type: 'line',
                data: [120, 132, 191, 234, 190, "-", "-"],
                itemStyle: {
                  // normal: {
                  //   color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                  //     {offset: 0, color: this.lineColorBeg},
                  //     {offset: 1, color: this.lineColorEnd}
                  //   ])
                  // },
                  emphasis: {}
                },
                // areaStyle: {
                //   normal: {
                //     color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                //       offset: 0,
                //       color: this.lineGradual ? this.lineColorBeg : this.color[0]
                //     }, {
                //       offset: 1,
                //       color: '#061845'
                //     }]),
                //     opacity: this.areaStyle ? 1 : 0
                //   },
                // },
                // data: this.yData.data1
              },
                {
                  name: this.legendData[0],
                  type: 'line',
                  smooth: true,   //关键点，为true是不支持虚线，实线就用true
                  itemStyle: {
                    // normal: {
                    //   color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                    //     {offset: 0, color: this.lineColorBeg},
                    //     {offset: 1, color: this.lineColorEnd}
                    //   ])
                    // },
                    emphasis: {}
                  },
                  // areaStyle: {
                  //   normal: {
                  //     color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                  //       offset: 0,
                  //       color: this.lineGradual ? this.lineColorBeg : this.color[0]
                  //     }, {
                  //       offset: 1,
                  //       color: '#061845'
                  //     }]),
                  //     opacity: this.areaStyle ? 1 : 0
                  //   },
                  // },
                  data: ["-", "-", "-", "-", 190, 330, '-']
                },
                {
                  name: this.legendData[0],
                  type: 'line',
                  smooth: true,   //关键点，为true是不支持虚线，实线就用true
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        width: 2,
                        type: 'dotted'  //'dotted'虚线 'solid'实线
                      },
                      // normal: {
                      //   color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                      //     {offset: 0, color: this.lineColorBeg},
                      //     {offset: 1, color: this.lineColorEnd}
                      //   ])
                      // },
                    }
                  },
                  // areaStyle: {
                  //   normal: {
                  //     color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                  //       offset: 0,
                  //       color: this.lineGradual ? this.lineColorBeg : this.color[0]
                  //     }, {
                  //       offset: 1,
                  //       color: '#061845'
                  //     }]),
                  //     opacity: this.areaStyle ? 1 : 0
                  //   },
                  // },
                  data: ["-", "-", "-", "-", "-", 330, 410]
                },
                {
                  name: this.legendData[1],
                  smooth: true,   //关键点，为true是不支持虚线，实线就用true
                  type: 'line',
                  data: [10, 32, 331, 3, 190, "-", "-"],
                  itemStyle: {
                    // normal: {
                    //   color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                    //     {offset: 0, color: this.lineColorBeg2},
                    //     {offset: 1, color: this.lineColorEnd2}
                    //   ])
                    // },
                    emphasis: {}
                  },
                  // areaStyle: {
                  //   normal: {
                  //     color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                  //       offset: 0,
                  //       color: this.lineGradual ? this.lineColorBeg2 : this.color[0]
                  //     }, {
                  //       offset: 1,
                  //       color: '#061845'
                  //     }]),
                  //     opacity: this.areaStyle ? 1 : 0
                  //   },
                  // },
                  // data: this.yData.data1
                },
                {
                  name: this.legendData[1],
                  type: 'line',
                  smooth: true,   //关键点，为true是不支持虚线，实线就用true
                  itemStyle: {
                    normal: {
                      // color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                      //   {offset: 0, color: this.lineColorBeg2},
                      //   {offset: 1, color: this.lineColorEnd2}
                      // ])
                    },
                    emphasis: {}
                  },
                  // areaStyle: {
                  //   normal: {
                  //     color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                  //       offset: 0,
                  //       color: this.lineGradual ? this.lineColorBeg2 : this.color[0]
                  //     }, {
                  //       offset: 1,
                  //       color: '#061845'
                  //     }]),
                  //     opacity: this.areaStyle ? 1 : 0
                  //   },
                  // },
                  data: ["-", "-", "-", "-", 190, 33, '-']
                },
                {
                  name: this.legendData[1],
                  type: 'line',
                  smooth: true,   //关键点，为true是不支持虚线，实线就用true
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        width: 2,
                        type: 'dotted'  //'dotted'虚线 'solid'实线
                      },
                      // normal: {
                      //   color: new echart.graphic.LinearGradient(0, 0, 1, 0, [
                      //     {offset: 0, color: this.lineColorBeg2},
                      //     {offset: 1, color: this.lineColorEnd2}
                      //   ])
                      // },
                    }
                  },
                  // areaStyle: {
                  //   normal: {
                  //     color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                  //       offset: 0,
                  //       color: this.lineGradual ? this.lineColorBeg2 : this.color[0]
                  //     }, {
                  //       offset: 1,
                  //       color: '#061845'
                  //     }]),
                  //     opacity: this.areaStyle ? 1 : 0
                  //   },
                  // },
                  data: ["-", "-", "-", "-", "-", 33, 310]
                }
              ]
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
    },

    data() {
      return {
        chart: null,
        legendData: this.legend,
        scale: false
      }
    },

    watch: {
      legend(val, newVal) {
        this.legendData = this.legend
      },
      yAxisName(val, oldVal) {
        this.echartDrew()
      },
      yData(val, newVal) {
        this.echartDrew()
      },
      dialogShow(val, oldval) {
        if (!this.dialogShow) {
          this.scale = false
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.echartDrew()
        // document.addEventListener('click', this.handleDocumentClick)
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
            // this.chart.on('legendselectchanged', (obj) => {
            //   if (this.chartType !== '2') {
            //     let selected = obj.selected
            //     console.log('legend obj', obj)
            //     if (selected !== undefined) {
            //       if (this.isFirstUnSelect(selected)) {
            //         this.triggerAction('legendToggleSelect', selected, this.chart)
            //       } else if (this.isAllUnSelected(selected)) {
            //         this.triggerAction('legendSelect', selected, this.chart)
            //       }
            //     }
            //   }
            // })
          })
        } else {
          this.$nextTick(() => {
            this.chart.setOption(this.generatorChartOption())
            // this.chart.on('legendselectchanged', (obj) => {
            //   if (this.chartType !== '2') {
            //     let selected = obj.selected
            //     console.log('legend obj', obj)
            //     if (selected !== undefined) {
            //       if (this.isFirstUnSelect(selected)) {
            //         this.triggerAction('legendToggleSelect', selected, this.chart)
            //       } else if (this.isAllUnSelected(selected)) {
            //         this.triggerAction('legendSelect', selected, this.chart)
            //       }
            //     }
            //   }
            // })
          })
        }
        window.addEventListener('resize', this.handleResizeEvent)
      },

      /**
       * 图表配置
       * **/
      generatorChartOption() {
        let option = {
          title: [{
            x: 'center',
            // y: '5%',
            text: this.chartTitle,
            textStyle: {
              color: 'white',
              fontSize: '100%',
            },
            padding: [12, 0, 0, 0]
          }],
          tooltip: this.chartType === '3' ? {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
              let htmlStr = ''
              let valMap = {}
              for (let i = 0; i < params.length; i++) {
                let param = params[i]
                let xName = param.name//x轴的名称
                let seriesName = param.seriesName//图例名称
                let value = param.value//y轴值
                let color = param.color//图例颜色
                console.log(param.color)
                //过滤无效值
                if (value == '-') {
                  continue
                }
                //过滤重叠值
                if (valMap[seriesName] == value) {
                  continue
                }
                if (i === 0) {
                  htmlStr += xName + '<br/>'//x轴的名称
                }
                // background-color:${color};
                htmlStr += '<div>'
                htmlStr += `<span style='margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:${color};'></span>`
                htmlStr += seriesName + '：' + value
                htmlStr += '</div>'
                valMap[seriesName] = value
              }
              return htmlStr
            }
          } : {
            trigger: 'axis',
            confine:this.confine,
            // position: function (p,params, dom, rect, size) {
            //   dom.style.transform = "translateZ(0)";
            //   return [p[0] + 10, p[1] - 10]
            // }
            // axisPointer: {
            //   type: 'cross',
            //   label: {
            //     backgroundColor: '#6a7985'
            //   }
            // }
          },
          // legend: {
          //   data: this.legendData,
          //   right: '0%',
          //   top: '8%',
          //   // bottom:'5%',
          //   orient: 'vertical',
          //   icon: "roundRect",
          //   textStyle: {
          //     color: 'white',
          //     padding: [2, 0, 0, 0]
          //   }
          //   //  这个字段控制形状 类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          //   // padding:[100,0],
          //   // itemGap:100,
          // },
          color: this.color,
          grid: {
            bottom: '5%',
            top: '35%',
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
                verticalAlign: 'bottom'
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
        return option
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

      triggerAction(action, selected, chart) {
        this.legendData = []
        for (name in selected) {
          if (selected.hasOwnProperty(name)) {
            this.legendData.push({name: name})
          }
        }
        chart.dispatchAction({
          type: action,
          batch: this.legendData
        })
      },

      isFirstUnSelect(selected) {
        var unSelectedCount = 0
        for (name in selected) {
          if (!selected.hasOwnProperty(name)) {
            continue
          }
          if (selected[name] == false) {
            ++unSelectedCount
          }
        }
        return unSelectedCount == 1
      },

      isAllUnSelected(selected) {
        var selectedCount = 0
        for (name in selected) {
          if (!selected.hasOwnProperty(name)) {
            continue
          }
          // 所有 selected Object 里面 true 代表 selected， false 代表 unselected
          if (selected[name] == true) {
            ++selectedCount
          }
        }
        return selectedCount == 0
      },

      handleDocumentClick(e) {
        if (!this.$el.contains(e.target) && !this.dialogShow) {
          this.scale = false
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
      // document.removeEventListener('click', this.handleDocumentClick)
    }
  }
</script>

<style scoped lang="less">
  .lineChart_page {
    width: 100%;
    height: 100%;
    font-size: 16px;
    /*padding: 10px;*/
    border-radius: 16px;
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

  .scale.lineChart_page {
    -webkit-transform: scale(1.1) !important;
    -webkit-box-shadow: 0px 0px 30px #022762 !important;
    -moz-transform: scale(1.1) !important;
    -moz-box-shadow: 0px 0px 30px #022762 !important;
    -o-transform: scale(1.1) !important;
    -o-box-shadow: 0px 0px 30px #022762 !important;
  }

</style>
