/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: market * @function:
产品销售统计* @date: 2019/12/14 * @time: 14:32 * * */
<template>
  <div id="market">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="'true'"
    ></common-header>
    <!--内容-->
    <div class="main">
      <!-- 选择按钮 -->
      <div class="top">
        <div :class="isBut ? 'but' : 'is_but'" @click="select(false)">
          既往总销量
        </div>
        <div :class="isBut ? 'is_but' : 'but'" @click="select(true)">
          {{ month }}
        </div>
      </div>
      <!-- 表格 -->
      <div class="box" v-if="lsb.length > 0">
        <table>
          <tr class="tou">
            <th>产品名称</th>
            <th>销售数量(件)</th>
          </tr>
          <tr v-for="(item, index) in lsb" :key="index">
            <td class="bor">
              <div class="xzyh">{{ item.GoodsName }}</div>
            </td>
            <td>
              <div class="xzyh">{{ item.num }}</div>
            </td>
          </tr>
          <tr v-if="lsb.length == 0">
            <td class="bor" colspan="2">
              <div class="xzyh">暂无当前数据</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="boxx" v-else>
        <img src="../../../assets/images/unMarket.png" alt="" />
        <p>暂无产品销售数据</p>
      </div>
      <!-- 弹出层 -->
      <van-popup v-model="isShow" @click-overlay="cancel()">
        <div class="pop_box">
          <div class="time_box">
            <van-datetime-picker
              v-model="currentDate"
              type="year-month"
              :max-date="maxDate"
              :min-date="minDate"
              visible-item-count="3"
              item-height="66"
              ref="picker"
              @confirm="query"
            />
          </div>
          <div class="foot">
            <van-button type="default" @click="resetTime()">重置</van-button>
            <van-button type="default" @click="selectTime()">确定</van-button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "market",
  components: {
    commonHeader
  },
  data() {
    return {
      customTitle: "数据统计",
      title: "产品销量",
      isBut: false,
      month: "选择月份",
      lsb: [],
      isShow: false,
      currentDate: new Date(),
      maxDate: new Date(),
      minDate: new Date(2018, 0, 1),
      date: ""
    };
  },
  created() {
    this.selectMarket();
  },
  mounted() {},
  methods: {
    query(value) {
      //时间选择器确定事件
      let y = value.getFullYear();
      let m = value.getMonth();
      this.isShow = false;
      m = m + 1;
      if (m < 10) m = "0" + m;
      this.date = y + "-" + m + "-01";
      this.month = y + "年" + m + "月销量";
      this.selectMarket();
    },
    selectMarket() {
      //根据时间查询销量
      this.$http
        .request({
          method: "get",
          url: "/RReportIllnessController/getSaleNum",
          body: {
            date: this.date
          }
        })
        .then(res => {
          if (res.data.success) {
            this.lsb = res.data.data;
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
    resetTime() {
      //重置时间
      this.currentDate = new Date();
    },
    select(bool) {
      //选择既往还是月份
      if (bool === false && this.isBut === false) return;
      if (bool === false) {
        //既往
        this.date = "";
        this.isBut = false;
        this.month = "选择月份";
        this.selectMarket();
      } else {
        //月份
        this.isBut = true;
        this.isShow = true;
      }
    },
    selectTime() {
      //点击确定
      this.$refs.picker.$el.children[0].children[1].click();
    },
    cancel() {
      //取消选择时间
      if (this.month === "选择月份") {
        this.isBut = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
#market {
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
    position: absolute;
    top: 59/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    overflow-y: hidden;
    left: 12/375 * 100vw;
    right: 12/375 * 100vw;
    .padding(0, 0, 15, 0);

    .top {
      display: flex;

      div {
        .borderRadius(5, 5, 5, 5);
        .lineHeight(26);
        .padding(0, 5, 0, 5);
        .fontSize(16);

        &:last-child {
          .margin(0, 0, 0, 15);
        }
      }

      .but {
        background: @backgroundColorT;
        color: @titleColor;
      }

      .is_but {
        background-image: linear-gradient(
          to right,
          @buttonColor,
          @buttonRightColorBlue
        );
        color: @fontOne;
      }
    }

    .box {
      &::-webkit-scrollbar {
        display: none !important;
        width: 0px;
        height: 0px;
      }

      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      position: absolute;
      top: 45/375 * 100vw;
      left: 0;
      right: 0;
      bottom: 15/375 * 100vw;

      table {
        width: 93.5vw !important;
        border-radius: 2.1vw;
        border-spacing: 0px;
        -moz-box-shadow: 0px 1px 10px #e0d9d9;
        -webkit-box-shadow: 0px 1px 10px #e0d9d9;
        box-shadow: 0px 1px 10px #e0d9d9;
        overflow: hidden;
        font-size: 14px;
      }

      tr {
        .height(36);
        background: @backgroundColorT;
      }

      table tr:nth-child(odd) {
        background: @ed;
      }

      table tr:first-child {
        .height(49);
        .lineHeight(49);
        background-color: @mainColor !important;
        color: @backgroundColorT;
        border: 0px;
      }

      th {
        width: 50%;
        border: 0px;
        font-size: 16px;
        font-weight: normal;
        text-align: center;
      }

      td {
        text-align: center;
        .lineHeight(36);
        width: 50%;

        .xzyh {
          width: 90%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin: 0px auto;
        }
      }

      tr:first-child {
        th:first-child {
          border-top-left-radius: 2.1vw;
          border-right: 1px solid @d4;
          .width(218);
        }
      }

      tr:first-child {
        th:last-child {
          border-top-right-radius: 2.1vw;
          .width(131);
        }
      }

      tr:first-child {
        td:first-child {
          border-top-left-radius: 2.1vw;
          .width(218);
          .height(49);
          .lineHeight(49);
        }
      }

      tr:first-child {
        td:last-child {
          border-top-right-radius: 2.1vw;
          .width(131);
          .height(49);
          .lineHeight(49);
        }
      }

      tr:last-child {
        td:first-child {
          border-radius: 0 0 0 2.1vw;
        }

        td:last-child {
          border-radius: 0 0 2.1vw 0;
        }
      }

      tr {
        td:first-child {
          border-right: 1px solid @d4;

          .xzyh {
            .width(198);
            .padding(0, 10, 0, 10);
          }
        }

        td:last-child {
          .xzyh {
            .width(111);
            .padding(0, 10, 0, 10);
          }
        }
      }
    }

    .boxx {
      .lineHeight(22);
      text-align: center;

      img {
        .width(205);
        .padding(34, 0, 0, 0);
      }

      p {
        .fontSize(18);
        .padding(34, 0, 0, 0);
        font-weight: bold;
        color: @titleColor;
      }
    }

    .van-popup {
      background-color: transparent;

      .pop_box {
        background-image: url("../../../assets/images/timeBox.png");
        background-repeat: no-repeat;
        background-size: 100%;
        overflow-y: hidden;

        .time_box {
          .width(292);
          .height(174);
          overflow-y: hidden;
          .padding(117, 0, 0, 0);

          .van-picker {
            .height(126);

            /deep/ .van-picker__toolbar {
              display: none;
            }

            /deep/ .van-picker-column__item {
              color: @mainColor;
            }
          }
        }

        .foot {
          button {
            border: 0;
            .height(42);
            .lineHeight(42);

            .width(146);
            .fontSize(16);

            &:last-child {
              .borderRadius(0, 0, 10, 0);
              background-image: linear-gradient(
                to right,
                @buttonColor,
                @buttonRightColorBlue
              );
              color: @fontOne;
            }

            &:first-child {
              .borderRadius(0, 0, 0, 10);
            }
          }
        }
      }
    }
  }
}
</style>
