/*
 * @Author: 田东 
 * @Date: 2019-12-03 10:51:53 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-12-17 14:37:08
 * @name doublePie_chart 上嵌套环形图 下扇形图 组合组件 
 */

<template>
  <div class="doublePie_chart">
    <div ref="chart"></div>
  </div>
</template>

<script>
const echarts = require("echarts");
// import "echarts/map/js/china"; // 引入中国地图数据

export default {
  name: "doublePie_chart",
  props: {
    title: {
      default: "", // 自定义标题 默认为空 不显示
      type: String
    },
    subtitle1: {
      default: "", // 自定义标题 默认为空 不显示
      type: String
    },
    subtitle2: {
      default: "", // 自定义标题 默认为空 不显示
      type: String
    },
    data1: {
      // 数据
      default: function() {
        return [];
      }, //一级分类
      type: Array
    },
    data2: {
      // 数据
      default: function() {
        return [];
      }, //一级分类
      type: Array
    }
  },
  data() {
    return {
      dataNameList: [], // 底部名称数组
      chart: null,
      topChartPositionY: "27%"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.data1.forEach((v, e) => {
        this.dataNameList.push(v.name);
      });
      this.chartsDrow();
    });
  },
  methods: {
    chartsDrow() {
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
        // title: {
        //   // 标题配置
        //   text: this.title,
        //   x: "center",
        //   textStyle: {
        //     color: "#fff"
        //   }
        // },
        title: [
          {
            // 标题配置
            text: this.title,
            x: "center",
            y: "2%",
            textStyle: {
              color: "#fff",
              fontSize: "120%"
            }
          },
          {
            subtext: this.subtitle1,
            x: "center",
            y: "7%",
            subtextStyle: {
              color: "#fff",
              fontSize: "100%"
            }
          },
          {
            subtext: this.subtitle2,
            x: "center",
            y: "44%",
            subtextStyle: {
              color: "#fff",
              fontSize: "100%"
            }
          }
        ],
        tooltip: {
          // 鼠标进入显示文本
          trigger: "item",
          formatter: "{b} {d}% "
        },
        legend: {
          // 底部名称配置
          x: "center",
          top: "80%",
          data: this.dataNameList,
          textStyle: {
            color: "#fff"
          }
        },
        // calculable: true,
        series: [
          {
            name: "",
            type: "pie",
            color: [
              "#1cc2ff",
              "#ff7e46",
              "#68ffe4",
              "#fc31b4",
              "#811cc8",
              "#ff4a4a",
              "#6234ff",
              "#34ff8a",
              "#ffae31",
              "#ffec00",
              "#144AFF"
            ],
            radius: ["16%", "50%"],
            center: ["50%", "66%"],
            roseType: "radius",
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              },
              emphasis: {
                formatter: "{b} {d}% ",
                show: false
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: this.data2
          },
          {
            name: "",
            type: "pie",
            radius: ["34%", "44%"],
            center: ["50%", this.topChartPositionY],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  textStyle: {
                    color: "#fff"
                  }
                },
                labelLine: {
                  show: true
                }
              },
              emphasis: {
                label: {
                  formatter: "{b} {d}% ",
                  show: false,
                  position: "center"
                }
              }
            },
            data: this.data1
          },
          {
            name: "",
            type: "pie",
            radius: ["0%", "27%"],
            center: ["50%", this.topChartPositionY],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  textStyle: {
                    color: "#fff"
                  }
                },
                labelLine: {
                  show: false
                }
              },
              emphasis: {
                label: {
                  show: false
                }
              }
            },
            data: this.data1
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
.doublePie_chart {
  width: 100%;
  height: 100%;
  background-color: #061B4D;
  float: left;

  div {
    height: 100%;
    width: 100%;
  }
}
</style>
