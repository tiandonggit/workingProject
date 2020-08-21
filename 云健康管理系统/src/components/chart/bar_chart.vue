/*
 * @Author: 田东 
 * @Date: 2019-12-03 10:51:05 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-12-20 13:25:36
 * @name bar_chart 柱状图组件柱类型根据传递数据控制 type: 1：1柱；2：2柱；3：叠柱；
 */

<template>
  <div class="bar_chart">
    <div ref="chart"></div>
  </div>
</template>

<script>
const echarts = require("echarts");
// import "echarts/map/js/china"; // 引入中国地图数据

export default {
  name: "bar_chart",
  props: {
    title: {
      default: "", // 自定义标题 默认为空 不显示
      type: String
    },
    subTitle: {
      default: "", //
      type: String
    },
    type: {
      // 几柱图 1：1柱；2：2柱；3：叠柱；
      default: 1,
      type: Number
    },
    legendType: {
      // 图例类型 1：竖排列；2：横排列
      default: 1,
      type: Number
    },
    xAxisType: {
      default: 3, // x轴name    1：7天；2：12个月; 3: 数据自定义
      type: Number
    },
    barColorList: {
      default: ["", "", "", ""], // 柱子颜色数组 参数：（1）、1柱上；（2）、1柱下；（3）、2柱上；（4）、2柱下
      type: Array
    },
    data1: {
      // 数据
      default: function() {
        return {};
      }, //一级分类
      type: Object
    },
    data2: {
      // 数据
      default: function() {
        return {};
      }, //一级分类
      type: Object
    },
    data3: {
      // 数据
      default: function() {
        return {};
      }, //一级分类
      type: Object
    }
  },
  data() {
    return {
      chart: null,
      barAxisColor: "#3e8ea9",
      dataX: [],
      dataY1: [],
      dataY2: [],
      dataY3: [],
      legendData: [] // 图例
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.legendData.push(this.data1.name);
      this.data1.value.forEach((v1, e1) => {
        // this.dataX.push(v1.name);
        this.dataY1.push(v1.value);
      });
      if (this.data2.name) {
        this.legendData.push(this.data2.name);
        this.data2.value.forEach((v1, e1) => {
          this.dataY2.push(v1.value);
        });
      }
      if (this.data3.name) {
        this.legendData.push(this.data3.name);
        this.data3.value.forEach((v1, e1) => {
          this.dataY3.push(v1.value);
        });
      }
      if (this.xAxisType === 1) {
        this.dataX = this.$getXAxisDay();
      } else if (this.xAxisType === 2) {
        this.dataX = this.$getXAxisMonth();
      } else if(this.xAxisType === 3) {
        this.data1.value.forEach((v1, e1) => {
          this.dataX.push(v1.name);
        });
      }
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
      let right = "4%",
        top = "38%",
        bottom = "3%",
        subtextY = "16%";
      if (this.type === 2) {
        right = "10%";
        top = "45%";
        subtextY = "23%";

        right = this.legendType === 2 ? "8%" : right;
        right = this.legendType === 3 ? "4%" : right;
        top = this.legendType === 3 ? "33%" : top;
        subtextY = this.legendType === 3 ? "12%" : subtextY;
        bottom = this.legendType === 3 ? "15%" : bottom;
      }
      this.type === 3 && (right = "30%"); // 叠状右侧偏移配置
      subtextY = this.legendType === 5 ? "5%" : subtextY;
      top = this.legendType === 5 ? "28%" : top;

      // 图例配置
      let legend;
      if (this.type === 1) {
        // 单柱不显示图例
        if (this.legendType !== 5) {
          legend = {
            show: false
          };
        } else {
          legend = {
            data: this.legendData,
            right: "7%",
            align: "left",
            y: "12%",
            itemGap: 15,
            itemWidth: 14,
            orient: "vertical",
            textStyle: {
              color: "#fff",
              fontSize: "100%"
            }
          };
        }
      } else if (this.type === 2) {
        // 双柱图例显示右上
        legend = {
          data: this.legendData,
          right: "8.5%",
          align: "left",
          y: "20%",
          itemGap: this.legendType === 1 ? 10 : 35,
          itemWidth: 14,
          orient: this.legendType === 1 ? "vertical" : "horizontal",
          align: "left",
          textStyle: {
            color: "#fff",
            fontSize: "100%"
          }
        };
        // 双柱图例显示下面
        this.legendType === 3 &&
          (legend = {
            data: this.legendData,
            bottom: 10,
            itemGap: 50,
            itemWidth: 14,
            orient: this.legendType === 1 ? "vertical" : "horizontal",
            align: "left",
            textStyle: {
              color: "#fff",
              fontSize: "100%"
            }
          });
      } else {
        legend = {
          // 叠柱图例显示右下
          data: this.legendData,
          right: 20,
          bottom: 30,
          itemGap: 30,
          icon: "circle",
          itemWidth: 14,
          itemHeight: 14,
          orient: "vertical",
          align: "left",
          textStyle: {
            color: "#fff",
            fontSize: "100%"
          }
        };
      }
      // 数据配置 —— 默认单柱
      let series = [
        {
          name: this.data1.name,
          type: "bar",
          // barWidth: "60%",
          itemStyle: {
            normal: {
              // 柱子渐变颜色配置
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.barColorList[0] },
                { offset: 0.1, color: this.barColorList[0] },
                { offset: 1, color: this.barColorList[1] }
              ])
            },
            emphasis: {}
          },
          data: this.dataY1
        }
      ];
      // 双柱
      this.type === 2 &&
        series.push({
          name: this.data2.name,
          type: "bar",
          // barWidth: "60%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.barColorList[2] },
                { offset: 1, color: this.barColorList[3] }
              ])
            },
            emphasis: {}
          },
          data: this.dataY2
        });

      if (this.type === 3) {
        // 叠柱
        series = [];
        let dataYList = [this.dataY1, this.dataY2];
        this.dataY3.length > 1 && dataYList.push(this.dataY3);
        let num = this.data3.name ? 3 : 2;
        for (let i = 0; i < num; i++) {
          series.push({
            name: this.legendData[i],
            type: "bar",
            stack: "1",
            itemStyle: {
              normal: {
                color: this.barColorList[i]
              },
              emphasis: {}
            },
            data: dataYList[i]
          });
        }
      }
      let option = {
        title: [
          {
            // 标题配置
            text: this.title,
            x: "center",
            y: "5%",
            textStyle: {
              color: "#fff",
              fontSize: "120%"
            }
          },
          {
            subtext: this.subTitle,
            left: "10px",
            y: subtextY,
            subtextStyle: {
              color: this.barAxisColor
            }
          }
        ],
        legend: legend,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "4%",
          right: right,
          top: top,
          bottom: bottom,
          containLabel: true
        },
        xAxis: [
          {
            axisLine: false,
            type: "category",
            data: this.dataX,
            axisLabel: {
              textStyle: {
                color: this.barAxisColor
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            axisLine: false,
            type: "value",
            axisLabel: {
              textStyle: {
                color: this.barAxisColor
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#041d52"
              }
            }
          }
        ],
        series: series
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
.bar_chart {
  width: 100%;
  height: 100%;
  background-color: #061b4d;
  float: left;

  div {
    height: 100%;
    width: 100%;
    // margin: 15px;
  }
}
</style>
