<template>
  <div class="circle_progress">
    <div class="box_div" v-if="type === 0">
      <div class="box_x">
        <div class="container_x">
          <div class="wave_x" :style="{ color: '#000' }"></div>
        </div>
        <p class="progress-text">{{ data }}</p>
      </div>
    </div>
    <div class="box" v-if="type === 1" style="display: none">
      <div id="liquidFill" :style="{ width: '4.08vw', height: '4.08vw' }"></div>
    </div>
    <div class="box_a" v-if="type === 1">
      <div
        id="liquidFill_Two_a"
        class="liquidFill"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_b" v-if="type === 2">
      <div
        id="liquidFill_Two_b"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_c" v-if="type === 3">
      <div
        id="liquidFill_Two_c"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_d" v-if="type === 4">
      <div
        id="liquidFill_Two_d"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_e" v-if="type === 5">
      <div
        id="liquidFill_Two_e"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_f" v-if="type === 6">
      <div
        id="liquidFill_Two_f"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_g" v-if="type === 7">
      <div
        id="liquidFill_Two_g"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_h" v-if="type === 8">
      <div
        id="liquidFill_Two_h"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_i" v-if="type === 9">
      <div
        id="liquidFill_Two_i"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_j" v-if="type === 10">
      <div
        id="liquidFill_Two_j"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>
    <div class="box_j" v-if="type === 11">
      <div
        id="liquidFill_Two_k"
        :style="{ width: '4.08vw', height: '4.08vw' }"
      ></div>
    </div>

    <div class="box_div box_div_2" v-if="type === 12">
      <div class="box_k">
        <div class="container_k">
          <div class="wave_k"></div>
        </div>
        <p class="progress-text">{{ data }}</p>
      </div>
    </div>

    <div class="box_div box_div_2" v-if="type === 13">
      <div class="box_l">
        <div class="container_l">
          <div class="wave_l"></div>
        </div>
        <p class="progress-text">{{ data }}</p>
      </div>
    </div>

    <div class="box_div box_div_2" v-if="type === 14">
      <div class="box_m">
        <div class="container_m">
          <div class="wave_m"></div>
        </div>
        <p class="progress-text">{{ data }}</p>
      </div>
    </div>

    <div class="box_div box_div_2" v-if="type === 15">
      <div class="box_n">
        <div class="container_n">
          <div class="wave_n"></div>
        </div>
        <p class="progress-text">{{ data }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import echartsLiquidfill from "echarts-liquidfill";
import "echarts-liquidfill/src/liquidFill.js";
import Echarts from "echarts";
import Vue from "vue";
Vue.prototype.$echarts = Echarts;
export default {
  name: "circle_progress",
  props: {
    type: {
      default: 1, // 自定义标题 默认为空 不显示
      type: Number
    },
    data: {
      default: "0%",
      type: String
    }
  },
  data() {
    return {
      chart: null,
      //水球背景颜色
      colorBackground: "rgba(207, 214, 255,0.1)",
      //水波的颜色
      colorArray: [
        "rgba(207, 214, 255,1)",
        "rgba(207, 214, 255,1)",
        "rgba(207, 214, 255,1)"
      ],
      //水球边框颜色
      colorBorder: "#2141e4",
      //水波阴影
      shadowColor: "",
      liquid: ""
    };
  },
  mounted() {
    this.liquidFill();
    this.$nextTick(() => {});
  },
  created() {
    this.dataInfo();
  },
  beforeDestroy() {},
  destroyed() {
    this.liquid.clear();
  },
  methods: {
    //数据
    dataInfo() {
      if (this.type === 1) {
        var aa = 1;
        aa++;
        console.log(aa);
        this.colorBorder = "#2141e4";
        this.colorArray = [
          "rgba(207, 214, 255,1)",
          "rgba(207, 214, 255,1)",
          "rgba(207, 214, 255,1)"
        ];
        this.colorBackground = "rgba(207, 214, 255,0.1)";
        this.shadowColor = "#2141e4";
      } else if (this.type === 2) {
        this.colorBorder = "#00c984";
        this.colorArray = [
          "rgba(196, 255, 233,1)",
          "rgba(196, 255, 233,1)",
          "rgba(196, 255, 233,1)"
        ];
        this.colorBackground = "rgba(196, 255, 233,0.1)";
        this.shadowColor = "#00c984";
      } else if (this.type === 3) {
        this.colorBorder = "#3d0ebc";
        this.colorArray = [
          "rgba(188, 172, 255,1)",
          "rgba(188, 172, 255,1)",
          "rgba(188, 172, 255,1)"
        ];
        this.colorBackground = "rgba(188, 172, 255,0.1)";
        this.shadowColor = "#3d0ebc";
      } else if (this.type === 4) {
        this.colorBorder = "#d2158f";
        this.colorArray = [
          "rgba(255, 169, 225,1)",
          "rgba(255, 169, 225,1)",
          "rgba(255, 169, 225,1)"
        ];
        this.colorBackground = "rgba(255, 169, 225,0.1)";
        this.shadowColor = "#d2158f";
      } else if (this.type === 5) {
        this.colorBorder = "#7100ad";
        this.colorArray = [
          "rgba(214, 138, 255,1)",
          "rgba(214, 138, 255,1)",
          "rgba(214, 138, 255,1)"
        ];
        this.colorBackground = "rgba(214, 138, 255,0.1)";
        this.shadowColor = "#7100ad";
      } else if (this.type === 6) {
        this.colorBorder = "#52b600";
        this.colorArray = [
          "rgba(105, 233, 0,1)",
          "rgba(105, 233, 0,1)",
          "rgba(105, 233, 0,1)"
        ];
        this.colorBackground = "rgba(105, 233, 0,0.1)";
        this.shadowColor = "#52b600";
      } else if (this.type === 7) {
        this.colorBorder = "#ed4f00";
        this.colorArray = [
          "rgba(255, 205, 179,1)",
          "rgba(255, 205, 179,1)",
          "rgba(255, 205, 179,1)"
        ];
        this.colorBackground = "rgba(255, 205, 179,0.1)";
        this.shadowColor = "#ed4f00";
      } else if (this.type === 8) {
        this.colorBorder = "#e58a00";
        this.colorArray = [
          "rgba(255, 223, 175,1)",
          "rgba(255, 223, 175,1)",
          "rgba(255, 223, 175,1)"
        ];
        this.colorBackground = "rgba(255, 223, 175,0.1)";
        this.shadowColor = "#e58a00";
      } else if (this.type === 9) {
        this.colorBorder = "#d31212";
        this.colorArray = [
          "rgba(255, 183, 183,1)",
          "rgba(255, 183, 183,1)",
          "rgba(255, 183, 183,1)"
        ];
        this.colorBackground = "rgba(255, 183, 183,0.1)";
        this.shadowColor = "#d31212";
      } else if (this.type === 10) {
        this.colorBorder = "#00aabf";
        this.colorArray = [
          "rgba(208, 250, 255,1)",
          "rgba(208, 250, 255,1)",
          "rgba(208, 250, 255,1)"
        ];
        this.colorBackground = "rgba(208, 250, 255,0.1)";
        this.shadowColor = "#00aabf";
      } else if (this.type === 11) {
        this.colorBorder = "#00aabf";
        this.colorArray = [
          "rgba(208, 250, 255,1)",
          "rgba(208, 250, 255,1)",
          "rgba(208, 250, 255,1)"
        ];
        this.colorBackground = "rgba(208, 250, 255,0.1)";
        this.shadowColor = "#00aabf";
      }
    },
    //生成水球
    liquidFill() {
      //方法
      var vant = this;
      //  console.log(this.type);
      //  //水球背景颜色
      //  var colorBackground
      //  //水球边框颜色
      //  var colorBorder="#2141e4";
      //  //水波的颜色
      //  var colorArray=['rgba(207, 214, 255,1)','rgba(207, 214, 255,1)','rgba(207, 214, 255,1)']
      //  if(this.type===1){
      //     colorBorder="#2141e4";
      //     colorArray=[]
      //  }
      var colorBorder = vant.colorBorder;
      var colorArray = vant.colorArray;
      var colorBackground = vant.colorBackground;
      var shadowColor = vant.shadowColor;

      var data = [0.4, 0.4, 0.33];

      this.liquid = this.$echarts.init(document.getElementById("liquidFill"));
      if (vant.type === 1) {
        // var liquid = this.$echarts.init(document.getElementsByClassName('liquidFill'));
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_a")
        );
      } else if (vant.type === 2) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_b")
        );
      } else if (vant.type === 3) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_c")
        );
      } else if (vant.type === 4) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_d")
        );
      } else if (vant.type === 5) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_e")
        );
      } else if (vant.type === 6) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_f")
        );
      } else if (vant.type === 7) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_g")
        );
      } else if (vant.type === 8) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_h")
        );
      } else if (vant.type === 9) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_i")
        );
      } else if (vant.type === 10) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_j")
        );
      } else if (vant.type === 11) {
        this.liquid = this.$echarts.init(
          document.getElementById("liquidFill_Two_k")
        );
      }

      this.liquid.setOption({
        title: {
          //标题
          text: "",
          textStyle: {
            //标题的样式
            color: "#FFF", //字体颜色
            fontFamily: "Microsoft YaHei", //字体
            align: "center", //文字的水平方式
            verticalAlign: "middle" //文字的垂直方式
          },
          left: "center", //定位
          backgroundColor: "#03dbdb" //文字区域的背景颜色
        },
        series: [
          {
            type: "liquidFill", //类型
            name: "Liquid Fill",
            name: "Liquid Fill",
            data: [
              {
                name: "First Data",
                value: vant.data
              },
              0.4,
              0.4,
              0.33
            ],
            // data: data,//数据是个数组 数组的每一项的值是0-1
            label: {},
            outline: {
              show: true, //是否显示轮廓 布尔值
              borderDistance: 0, //外部轮廓与图表的距离 数字
              itemStyle: {
                borderColor: colorBorder, //边框的颜色
                borderWidth: 5, //边框的宽度
                shadowBlur: 0, //外部轮廓的阴影范围 一旦设置了内外都有阴影
                shadowColor: "#000" //外部轮廓的阴影颜色
              }
            },
            label: {
              normal: {
                formatter: function(param) {
                  return param.value;
                },
                // formatter: function(param) {
                //   return param.seriesName + '\n'
                //     + param.name + '\n'
                //     + 'Value:' + param.value;
                // },
                textStyle: {
                  color: "#fff",
                  insideColor: "yellow",
                  fontSize: 14
                }
              }
            },
            backgroundStyle: {
              color: colorBackground, //图表的背景颜色
              //borderWidth: '10',//图表的边框宽度
              //borderColor: '#000',//图表的边框颜色
              itemStyle: {
                shadowBlur: 100, //设置无用
                shadowColor: "#f60", //设置无用
                opacity: 1 //设置无用
              }
            },
            itemStyle: {
              opacity: 0.5, //波浪的透明度
              shadowBlur: 10, //波浪的阴影范围
              shadowColor: shadowColor //阴影颜色
            },
            emphasis: {
              itemStyle: {
                opacity: 1 //鼠标经过波浪颜色的透明度
              }
            },
            color: colorArray, //水波的颜色 对应的是data里面值
            shape: "circle", //水填充图的形状 circle默认圆形  rect圆角矩形  triangle三角形  diamond菱形  pin水滴状 arrow箭头状  还可以是svg的path
            center: ["50%", "50%"], //图表相对于盒子的位置 第一个是水平的位置 第二个是垂直的值 默认是[50%,50%]是在水平和垂直方向居中 可以设置百分比 也可以设置具体值
            radius: "80%", //图表的大小 值是圆的直径 可以是百分比 也可以是具体值 100%则占满整个盒子 默认是40%; 百分比下是根据宽高最小的一个为参照依据
            amplitude: 5, //振幅 是波浪的震荡幅度 可以取具体的值 也可以是百分比 百分比下是按图标的直径来算
            waveLength: "85%", //波的长度 可以是百分比也可以是具体的像素值  百分比下是相对于直径的 取得越大波浪的起伏越小
            phase: 0, //波的相位弧度 默认情况下是自动
            period: (value, index) => {
              //控制波的移动速度 可以是函数 也可以是数字 两个参数  value 是data数据里面的值 index 是data值的索引
              return index * 1000;
            },
            direction: "left", //波移动的速度 两个参数  left 从右往左 right 从左往右
            waveAnimation: true, //控制波动画的开关  值是布尔值 false 是关闭动画 true 是开启动画 也是默认值
            animationEasing: "linear", //初始动画
            animationEasingUpdate: "quarticInOut", //数据更新的动画效果
            animationDuration: 3000, //初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果
            animationDurationUpdate: 300 //数据更新动画的时长
          }
        ]
        //backgroundColor: 'rgba(255,0,0,0.1)'容器背景颜色
      });
    }
  }
};
</script>

<style scoped lang="less">
/* -------------------蓝色-------------- */
.container_x {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid rgb(207, 214, 255);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_x {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(66, 139, 255, 1);
  border-radius: 50%;
}
.wave_x ::before,
.wave_x::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 34%;
  transform: translate(-60%, -80%) rotate(0);
  /**4秒的动画间隔，linear设置动画速度, infinite浏览器前缀**/
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_x::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /** translate(-60%, -80%)水纹高度  同调 **/
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate {
  50% {
    /** translate(-60%, -80%)水纹高度  同调 **/
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    /** translate(-60%, -80%)水纹高度  同调 **/
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.container_a {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #2141e4;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_a {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(66, 139, 255, 1);
  border-radius: 50%;
}
.wave_a ::before,
.wave_a::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 34%;
  transform: translate(-60%, -80%) rotate(0);
  /**4秒的动画间隔，linear设置动画速度, infinite浏览器前缀**/
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_a::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /** translate(-60%, -80%)水纹高度  同调 **/
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate {
  50% {
    /** translate(-60%, -80%)水纹高度  同调 **/
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    /** translate(-60%, -80%)水纹高度  同调 **/
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.box_a {
  width: 78px;
  height: 78px;
  position: relative;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    2deg,
    rgba(82, 69, 252, 1) 0%,
    rgba(66, 139, 255, 1) 100%
  );
}

/* -------------------绿色-------------- */

.container_b {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #00c984;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_b {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(76, 255, 190, 1);
  border-radius: 50%;
}
.wave_b ::before,
.wave_b::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_b::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_b 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_b {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.box_b {
  width: 78px;
  height: 78px;
  position: relative;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    359deg,
    rgba(0, 222, 141, 1) 0%,
    rgba(76, 255, 190, 1) 100%
  );
}

/* -------------------紫色-------------- */

.container_c {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #3d0ebc;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_c {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(145, 120, 255, 1);
  border-radius: 50%;
}
.wave_c ::before,
.wave_c::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_c::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_c 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_c {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.box_c {
  width: 78px;
  height: 78px;
  position: relative;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    358deg,
    rgba(75, 43, 220, 1) 0%,
    rgba(145, 120, 255, 1) 100%
  );
}

/* -------------------粉色-------------- */

.container_d {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #d2158f;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_d {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 112, 204, 1);
  border-radius: 50%;
}
.wave_d ::before,
.wave_d::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_d::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_d 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_d {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

/* -------------------紫粉色-------------- */

.container_e {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #7100ad;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_e {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(189, 65, 254, 1);
  border-radius: 50%;
}
.wave_e ::before,
.wave_e::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_e::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_d 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_e {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

/* -------------------荧光绿-------------- */

.container_f {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #52b600;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_f {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(206, 255, 165, 1);
  border-radius: 50%;
}
.wave_f ::before,
.wave_f::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_f::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_f 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_f {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

/* -------------------橘黄-------------- */
.container_g {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #ed4f00;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_g {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 157, 109, 1);
  border-radius: 50%;
}
.wave_g ::before,
.wave_g::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_g::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_g 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_g {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

/* -------------------黄-------------- */
.container_h {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #e58a00;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_h {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 196, 105, 1);
  border-radius: 50%;
}
.wave_h ::before,
.wave_h::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_h::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_h 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_h {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

/* -------------------橘红-------------- */
.container_i {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #d31212;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_i {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(253, 94, 94, 1);
  border-radius: 50%;
}
.wave_i ::before,
.wave_i::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_i::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_i 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_i {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

/* -------------------浅蓝-------------- */

.container_j {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid #00aabf;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}
.wave_j {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: rgba(83, 235, 255, 1);
  border-radius: 50%;
}
.wave_j ::before,
.wave_j::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_j::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_j 10s linear -5s infinite;
  z-index: 20;
}

@keyframes rotate_j {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

/* -------------------炫彩动态球-蓝------------- */

.container_k {
  position: absolute;
  width: 90px;
  height: 90px;
  border: 5px solid #0067ee;
  top: 51%;
  left: 48%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  background-color: #0067ee;
}
.wave_k {
  position: relative;
  width: 90px;
  height: 90px;
  background: linear-gradient(
    358deg,
    rgb(2, 99, 255) 0%,
    rgb(179, 213, 255) 100%
  );
  border-radius: 50%;
}
.wave_k ::before,
.wave_k::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_k::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_k 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_k {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.box_k {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/blue.png");
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
}

/* -------------------炫彩动态球-黄------------- */
.container_l {
  position: absolute;
  width: 92px;
  height: 92px;
  border: 5px solid #ca6c36;
  top: 52%;
  left: 49%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  background-color: #ca6c36;
}
.wave_l {
  position: relative;
  width: 90px;
  height: 90px;
  background: linear-gradient(
    358deg,
    rgb(255, 94, 1) 0%,
    rgb(255, 198, 160) 100%
  );
  border-radius: 50%;
}
.wave_l ::before,
.wave_l::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_l::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_l 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_l {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.box_l {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/yellow.png");
  background-repeat: no-repeat;
  position: relative;
}

/* -------------------炫彩动态球-紫色------------- */

.container_m {
  position: absolute;
  width: 92px;
  height: 92px;
  border: 5px solid #b57fff;
  top: 51%;
  left: 48%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  background-color: #b57fff;
}
.wave_m {
  position: relative;
  width: 90px;
  height: 90px;
  background: linear-gradient(358deg, #8340df 0%, #b57fff 100%);
  border-radius: 50%;
}
.wave_m ::before,
.wave_m::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_m::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_m 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_m {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.box_m {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/violet.png");
  background-repeat: no-repeat;
  position: relative;
}

/* -------------------炫彩动态球-粉色------------- */

.container_n {
  position: absolute;
  width: 92px;
  height: 92px;
  border: 5px solid #ed6c9e;
  top: 51%;
  left: 49%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  background-color: #ed6c9e;
}
.wave_n {
  position: relative;
  width: 90px;
  height: 90px;
  background: linear-gradient(358deg, #e06565 0%, #ffb7b7 100%);
  border-radius: 50%;
}
.wave_n ::before,
.wave_n::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  top: 0;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  /* border-radius: 45%; */
  border-radius: 34%;
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  /* animation: rotate 6s linear infinite; */
  animation: rotate 2s linear infinite;
  z-index: 10;
}

.wave_n::after {
  /* border-radius: 47%; */
  border-radius: 38%;
  background-color: rgba(255, 255, 255, 0.8);
  /* transform: translate(-50%, -70%) rotate(0); */
  transform: translate(-60%, -80%) rotate(0);
  animation: rotate_n 10s linear -5s infinite;
  z-index: 20;
}
@keyframes rotate_n {
  50% {
    transform: translate(-60%, -83%) rotate(180deg);
  }
  100% {
    transform: translate(-60%, -80%) rotate(360deg);
  }
}

.box_n {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/pink.png");
  background-repeat: no-repeat;
  position: relative;
}

.box_div {
  position: relative;
  width: 78px;
  height: 78px;
  margin: 0 auto;
  // float: left;

  p.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #fff;
    line-height: 32px;
    width: 100%;
    text-align: center;
  }
}

.box_div_2 {
  width: 140px;
  height: 140px;
  margin: 0 auto;

  p.progress-text {
    font-size: 18px;
  }
}

.box_a {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
  background: linear-gradient(2deg, #5245fc 0%, #428bff 100%);
}
.box_b {
  width: 78px;
  height: 78px;
  position: relative;
  border-radius: 50%;
  margin: 0 auto;
  background: linear-gradient(
    359deg,
    rgba(0, 222, 141, 1) 0%,
    rgba(76, 255, 190, 1) 100%
  );
}
.box_c {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(
    358deg,
    rgba(75, 43, 220, 1) 0%,
    rgba(145, 120, 255, 1) 100%
  );
}

.box_d {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    2deg,
    rgba(222, 38, 157, 1) 0%,
    rgba(255, 112, 204, 1) 100%
  );
}

.box_e {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    358deg,
    rgba(142, 8, 214, 1) 0%,
    rgba(189, 65, 254, 1) 100%
  );
}

.box_f {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    358deg,
    rgba(160, 255, 80, 1) 0%,
    rgba(206, 255, 165, 1) 100%
  );
}

.box_g {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    358deg,
    rgba(255, 115, 45, 1) 0%,
    rgba(255, 157, 109, 1) 100%
  );
}

.box_h {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    2deg,
    rgba(255, 171, 43, 1) 0%,
    rgba(255, 196, 105, 1) 100%
  );
}

.box_i {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    2deg,
    rgba(255, 36, 36, 1) 0%,
    rgba(253, 94, 94, 1) 100%
  );
}

.box_j {
  width: 78px;
  height: 78px;
  position: relative;
  margin: 0 auto;
  /* top: 50%;
    left: 50%; */
  border-radius: 50%;
  background: linear-gradient(
    358deg,
    rgba(0, 225, 255, 1) 0%,
    rgba(83, 235, 255, 1) 100%
  );
}

.ceshiaa {
  background-color: rgb(208, 250, 255);
}
</style>
