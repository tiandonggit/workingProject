/*
 * @Author: 田东 
 * @Date: 2019-12-03 10:45:38 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-12-03 10:54:44
 * @name 雷达图
 */

<template>
  <div class="radar_chart">
    <div ref="chart"></div>
  </div>
</template>

<script>
const echarts = require("echarts");
// import "echarts/map/js/china"; // 引入中国地图数据

export default {
  name: "radar_chart",
  props: {
    title: {
      default: "", // 自定义标题 默认为空 不显示
      type: String
    },
    dataMax: {
      // 数据
      default: function() {
        return [];
      }, //一级分类
      type: Array
    },
    valueList: {
      // 数据
      default: function() {
        return [];
      }, //一级分类
      type: Array
    },
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drow();
    });
  },
  methods: {
    drow() {
      if (!this.chart) {
        let dom = this.$refs.chart;
        let chart = (this.chart = echarts.init(dom));
        if (chart === "undefined" || chart === null) {
          console.error(`echarts init err`);
          return false;
        }
        this.$nextTick(() => {
          this.chart.setOption(this.generatorChartOption());
        });
      } else {
        this.$nextTick(() => {
          this.chart.setOption(this.generatorChartOption());
        });
      }
      window.addEventListener("resize", this.handleResizeEvent);
    },
    generatorChartOption() {
      let option = {
        title: {
          text: this.title,
          x: "center",
          y: "5%",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {},
        legend: {
          show: false
        },
        radar: {
          name: {
            textStyle: {
              color: "#fff",
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          radius: 110,
          center: ['50%', '60%'],
          indicator: this.dataMax,
          splitArea: {
            areaStyle: {
              color: ["#0c1a63", "#1f23a0", "#0c1a63", "#1f23a0", "#0c1a63"],
              shadowColor: "rgba(0, 0, 255, 0.3)",
              shadowBlur: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: "#393fff"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#1f23a0"
            }
          }
        },

        series: [
          {
            name: this.title,
            type: "radar",
            // areaStyle: {normal: {}},
            data: [
              {
                value: this.valueList,
                name: "",
                lineStyle: {
                  normal: {
                    color: "#3c09bf"
                  }
                },
                areaStyle: {
                  normal: {
                    color: "rgba(70, 51, 202, 1)"
                  }
                }
              }
            ]
          }
        ]
      };
      return option;
    },
    /**
     * 如果有图表实例，则对实例进行自适应调整
     * */
    handleResizeEvent() {
      let self = this;
      if (this.chart) {
        setTimeout(function() {
          self.chart.resize();
        }, 100);
      }
    }
  }
};
</script>

<style scoped lang="less">
.radar_chart {
  width: 100%;
  height: 100%;
  background-color: #061B4D;

  div {
    height: 100%;
    width: 100%;
  }
}
</style>
