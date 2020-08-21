/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: statistics *
@function: 数据统计首页* @date: 2019/12/13 * @time: 13:03 * * */
<template>
  <div id="statistics">
    <!-- 统计头部 -->
    <common-header
      :share-disabled="true"
      :headerShow="'true'"
      :custom-title="title"
      :title="title"
      :right="'true'"
      :ricon="'question'"
      :rightClass="{ color: 'blue' }"
      @rightIconClick="onShow()"
    ></common-header>
    <!-- 统计内容 -->
    <div class="main">
      <!-- 今日开单 -->
      <div class="main_now main_box">
        <div class="img_box">
          <div class="box">
            <div class="box_top">
              {{ orderSeven }}
            </div>
            <div class="box_bottom">
              今日开单
            </div>
          </div>
        </div>
        <div class="foot_box">
          <div class="box">
            <div class="box_top">{{ successfulPurchaseSeven }}单</div>
            <div class="box_bottom">
              成功购买
            </div>
          </div>
          <div class="box">
            <div class="box_top">¥{{ amountMoney | money }}</div>
            <div class="box_bottom">
              销售金额
            </div>
          </div>
          <div class="box">
            <div class="box_top">{{ purchaseRate | substr }}%</div>
            <div class="box_bottom">
              购买率
            </div>
          </div>
        </div>
      </div>
      <!-- 历史开单 -->
      <div class="main_hostory main_box">
        <div class="img_box">
          <div class="box">
            <div class="box_top">
              {{ orders }}
            </div>
            <div class="box_bottom">
              历史开单
            </div>
          </div>
        </div>
        <div class="foot_box">
          <div class="box">
            <div class="box_top">{{ successfulPurchaseAll }}单</div>
            <div class="box_bottom">
              成功购买
            </div>
          </div>
          <div class="box">
            <div class="box_top">¥{{ amountMoneys | money }}</div>
            <div class="box_bottom">
              销售金额
            </div>
          </div>
          <div class="box">
            <div class="box_top">{{ purchaseRateAll | substr }}%</div>
            <div class="box_bottom">
              购买率
            </div>
          </div>
        </div>
      </div>
      <!-- 患者统计 -->
      <div class="main_patient main_box">
        <div class="box">
          <div class="box_top">今日新增患者</div>
          <div class="box_tottom">
            <span>{{ patientNum }}</span>
            人
          </div>
        </div>
        <div class="box">
          <div class="box_top">我的患者</div>
          <div class="box_tottom">
            <span>{{ patientNums }}</span>
            人
          </div>
        </div>
      </div>
      <!-- 流水统计 -->
      <div class="main_water main_box">
        <div id="echart" class="echart"></div>
      </div>
      <!-- 咨询统计 -->
      <div class="main_patient main_box">
        <div class="box">
          <div class="box_top">今日咨询服务收入</div>
          <div class="box_tottom">
            ¥
            <span>{{ total | money }}</span>
          </div>
        </div>
        <div class="box">
          <div class="box_top">总收入</div>
          <div class="box_tottom">
            ¥
            <span>{{ totals | money }}</span>
          </div>
        </div>
      </div>
      <!-- 统计列表 -->
      <div class="main_list main_box">
        <div class="list" @click="goNext('market')">
          <div class="list_title">
            产品销售统计
          </div>
          <van-icon name="arrow" />
        </div>
        <div class="list" @click="goNext('illness')">
          <div class="list_title">
            患者疾病分布
          </div>
          <van-icon name="arrow"/>
        </div>
        <div class="list" @click="goNext('history')">
          <div class="list_title">
            历史开单
          </div>
          <van-icon name="arrow"/>
        </div>
        <div class="list" @click="goNext('consult')">
          <div class="list_title">
            付费咨询记录
          </div>
          <van-icon name="arrow"/>
        </div>
        <div class="list" @click="goAuto">
          <div class="list_title">
            数据授权
          </div>
          <van-icon name="arrow"/>
        </div>
      </div>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model="show">
      <img
        src="../../../assets/images/statisticszz.png"
        @click="show = false"
        alt=""
      />
    </van-popup>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import {mapState} from "vuex";
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入柱状图
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
// 引入图例
import "echarts/lib/component/legend";
import { Overlay } from "vant";
export default {
  name: "statistics",
  computed: {
    ...mapState(["DoctorIM"])
  },
  components: {
    commonHeader
  },
  filters: {
    substr(value) {
      let num = (value * 1000) / 10;
      return num;
    },
    money(item) {
      if (!item) return "0.00";
      item = item.toString();
      let num = 0;
      if (item.length == 2) {
        num = "0." + item;
      } else if (item.length < 2) {
        num = "0.0" + item;
      } else {
        num =
          item.substring(0, item.length - 2) +
          "." +
          item.substring(item.length - 2, item.length);
      }

      return num;
    }
  },
  data() {
    return {
      title: "数据统计",
      sessionName: "返回",
      show: false,
      timeData: [0, 0, 0, 0, 0, 0, 0], //天数
      patientNums: 0, //我的患者总数
      successfulPurchaseSeven: 0, //今日开单成功数
      purchaseRate: 0, //今日比例
      patientNum: 0, //今日新增患者
      amountMoneys: 0, //总金额金额
      successfulPurchaseAll: 0, //历史开单成功数目
      orderSeven: 0, //今天开单数
      amountMoney: 0, //今日开单金额
      totals: 0, //当前为咨询总钱数
      purchaseRateAll: 0, //成功率
      total: 0, //当前为咨询总钱数
      orders: 0, //开单总数（如果开单总数为0则其他信息为0）
      orderss: [0, 0, 0, 0, 0, 0, 0], //开单数
      successfulPurchasess: [0, 0, 0, 0, 0, 0, 0], //购买数
      isAuto: false //用户是否授权
    };
  },
  created() {},
  mounted() {
    this.init();
    this.biao();
  },
  methods: {
    getAuto() {
      //设置用户是已授权了还是未授权
      this.isAuto;
    },
    goAuto() {
      this.$http
        .request({
          method: "get",
          url: "/RAssistantDoctorController/queryByBusinessIdAndDoctorId",
          body: {
            id: this.DoctorIM.doctorMessage.data.docId
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            //一键授权 先判断是已授权了还是未授权
            if (res.data.data.authorization == 1) {
              //已授权
              this.$router.push({
                name: "hasAuthorization"
              })
            } else {
              //未授权
              this.$router.push({
                name: "authorization"
              })
            }
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch(e => {
          console.log(e);
        });
      // //一键授权 先判断是已授权了还是未授权
      // if (this.isAuto) {
      //   // 已授权
      //   this.$router.push({
      //     name: "hasAuthorization"
      //   })
      // } else {
      //   // 未授权
      //   this.$router.push({
      //     name: "authorization"
      //   })
      // }


    },
    onShow() {
      this.show = !this.show;
    },
    biao() {
      let _this = this;
      let myChart = echarts.init(document.getElementById("echart"));

      // 绘制图表
      myChart.setOption({
        title: {
          text: "近七日开单情况",
          x: "center"
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "0",
          top: "26%",
          containLabel: true
        },
        tooltip: {},
        legend: {
          selectedMode: false,
          data: ["开单数", "购买数"],
          textStyle: {
            //图例文字的样式
            color: "#999999"
          },
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          orient: "category",
          x: "right",
          y: "10%"
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: "#666666" // 颜色
            }
          },
          axisLabel: {
            interval: 0,
            show: true,
            textStyle: {
              color: "#666666"
            }
          },
          data: _this.timeData,
          axisTick: { show: false }
        },
        yAxis: {
          type: "value",
          name: "             单位：单",
          splitNumber: 5,
          nameTextStyle: {
            color: "#666666"
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            textStyle: {
              color: "#666666"
            }
          }
        },
        series: [
          {
            name: "开单数",
            type: "bar",
            data: _this.orderss,
            barGap: "0" /*多个并排柱子设置柱子之间的间距*/,
            barCategoryGap: "50%" /*多个并排柱子设置柱子之间的间距*/,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: "#FF5900" }, //柱图渐变色
                  { offset: 0, color: "#FF813D" } //柱图渐变色
                ])
              }
            }
          },
          {
            name: "购买数",
            type: "bar",
            data: _this.successfulPurchasess,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: "#11D563" }, //柱图渐变色
                  { offset: 0, color: "#00E9A3" } //柱图渐变色
                ])
              }
            }
          }
        ]
      });
    },
    init() {
      this.$http
        .request({
          method: "get",
          url: "/StatisticsController/selectAll",
          body: {}
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            let data = res.data.data;
            //成功
            this.patientNums = data.patientNums;
            this.patientNum = data.patientNum;
            this.timeData = data.day_day.replace("[", "").replace("]", "");
            this.timeData = this.timeData.split(",");
            this.total = data.total;
            this.totals = data.totals;
            if (data.orders != 0) {
              this.successfulPurchaseSeven = data.successful_purchase_seven;
              this.purchaseRate = data.purchase_rate;
              this.amountMoneys = data.amount_moneys;
              this.successfulPurchaseAll = data.successful_purchase_all;
              this.orderSeven = data.order_seven;
              this.amountMoney = data.amount_money;
              this.purchaseRateAll = data.purchase_rate_all;
              this.orders = data.orders;
              this.orderss = JSON.parse(data.orderss);
              this.successfulPurchasess = JSON.parse(
                data.successful_purchasess
              );
            }

            this.biao();
          } else {
            //失败
            this.$toast("查询失败");
          }
          console.log(res.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    goNext(name) {
      console.log(name);
      //根据传值跳转下一页
      this.$router.push({ name: name });
    }
  }
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}
#statistics {
  background: @backgroundColor;
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  .common-header {
    /deep/ .header {
      z-index: 99;
    }
  }

  .main {
    &::-webkit-scrollbar {
      display: none !important;
      width: 0px;
      height: 0px;
    }

    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 44/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    overflow-y: auto;
    left: 0;
    right: 0;
    .padding(0, 12, 0, 12);

    .main_box {
      background-color: @backgroundColorT;
      .margin(15, 0, 0, 0);
      .borderRadius(10, 10, 10, 10);
      background-size: 100%;
      background-repeat: no-repeat;

      div {
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: center;
      }

      &:last-child {
        .margin(15, 0, 15, 0);
      }
    }
    .main_now {
      .padding(15, 24, 15, 24);
      text-align: center;
      background-image: url("../../../assets/images/bg1.png");
      .img_box {
        background-image: url("../../../assets/images/bga1.png");
      }
      .foot_box {
        .box_top {
          color: @statisticColor;
        }
      }
    }
    .main_hostory {
      .padding(15, 24, 15, 24);
      text-align: center;
      background-image: url("../../../assets/images/bg2.png");
      .img_box {
        background-image: url("../../../assets/images/bga2.png");
      }
      .foot_box {
        .box_top {
          color: @statisticHisColor;
        }
      }
    }
    .img_box {
      background-size: auto 100%;
      margin-top: 0px;
      width: 100%;
      .height(125);
      .box {
        .padding(35, 0, 29, 0);
        .box_top {
          .fontSize(28);
          font-weight: bold;
          .lineHeight(40);
          color: @fontOne;
        }
        .box_bottom {
          .fontSize(14);
          font-weight: bold;
          .lineHeight(16);
          color: @fontOne;
        }
      }
    }
    .foot_box {
      .padding(9, 0, 0, 0);
      .lineHeight(24);
      display: flex;
      justify-content: space-between;
      .fontSize(16);
      font-weight: bold;
      .box_bottom {
        .fontSize(14);
        color: @titleColor;
      }
    }
    .main_patient {
      .padding(15, 0, 15, 0);
      display: flex;
      justify-content: space-between;
      .fontSize(16);
      color: @titleColor;
      .box {
        width: 50%;
        text-align: center;
        .box_top {
          .lineHeight(16);
        }
        .box_tottom {
          .padding(15, 0, 0, 0);
          span {
            .fontSize(22);
            color: @statisticBlueColor;
          }
        }
      }
    }
    .main_water {
      .padding(15, 20, 15, 20);
      .echart {
        .height(278);
      }
      .height(278);
    }
    .main_list {
      .list {
        .padding(15, 10, 15, 10);
        border-bottom: 1px solid @listBorderColor;
        color: @shenSpan;
        display: flex;
        justify-content: space-between;
        .list_title {
          color: @titleColor;
          .fontSize(16);
          .lineHeight(16);
        }
        &:last-child {
          border-bottom: 0px;
        }
      }
    }
  }
  .van-popup {
    overflow-y: hidden;
    background-color: transparent;
    img {
      .width(314);
    }
  }
}
</style>
