/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: history * @function:
历史开单 * @date: 2019/12/14 * @time: 14:36 * * */
<template>
  <div id="history">
    <!-- 头部 -->
    <common-header
        :share-disabled="true"
        :custom-title="customTitle"
        :title="title"
        :headerShow="'true'"
    ></common-header>
    <!--内容-->
    <div class="main">
      <van-tabs
        @click="onClick"
        line-width="17vw"
        color="#0069FF"
        title-active-color="#333333"
        title-inactive-color="#333333"
      >
        <van-tab title="营养筛查">
          <div class="box" v-if="screeningData.length != 0">
            <div
              class="tab_list"
              @click="goNext(item.Id_)"
              v-for="(item, index) in screeningData"
              :key="index"
            >
              <div class="list_top">
                <div class="top_left">
                  <img src="../../../assets/images/history.png" alt="" />
                  <span>{{ item.DeviceName_ | overstep(12) }}</span>
                </div>
                <div
                  :class="
                  item.PayStatus_ == 11 ?'top_right':
                    item.PayStatus_ != 1
                      ? 'top_right'
                      : item.PushOutStatus_ == 3
                      ? 'top_right_secc'
                      : 'top_right_up'
                  "
                >
                  {{
                  item.PayStatus_ == 11 ?"未下单":
                  item.PayStatus_ != 1
                  ? "未付款"
                  : item.PushOutStatus_ == 3
                  ? "交易完成"
                  : "待自提"
                  }}
                </div>
              </div>
              <div class="list_body">
                <div class="body_top">
                  <div class="body_top_left">
                    <div>{{ item.Name_ | overstep(4) }}</div>
                    <div>{{ item.Sex_==1?"男":"女" }}</div>
                    <div>{{ item.Age_ }}岁</div>
                  </div>
                  <div class="body_top_right">
                    {{ item.illnessName | overstep(6) }}
                  </div>
                </div>
                <div class="body_bottom">
                  {{ item.CreateTime_ }}
                </div>
              </div>
              <div class="list_bottom" @click.stop="goNexts(item.Id_)">
                <span>营养筛查报告</span>
              </div>
            </div>
          </div>
          <div class="boxx" v-else>
            <img src="../../../assets/images/unHistory.png" alt=""/>
            <p>暂无历史开单信息</p>
          </div>
        </van-tab>
        <van-tab title="营养诊断">
          <div class="box" v-if="diagnosticsData.length != 0">
            <div
                class="tab_list"
                @click="goNext(item.Id_)"
                v-for="(item, index) in diagnosticsData"
                :key="index"
            >
              <div class="list_top">
                <div class="top_left">
                  <img src="../../../assets/images/history.png" alt=""/>
                  <span>{{ item.DeviceName_ | overstep(12) }}</span>
                </div>
                <div
                    :class="
                  item.PayStatus_ == 11 ?'top_right':
                    item.PayStatus_ != 1
                      ? 'top_right'
                      : item.PushOutStatus_ == 3
                      ? 'top_right_secc'
                      : 'top_right_up'
                  "
                >
                  {{
                    item.PayStatus_ == 11 ? "未下单" :
                        item.PayStatus_ != 1
                            ? "未付款"
                            : item.PushOutStatus_ == 3
                            ? "交易完成"
                            : "待自提"
                  }}
                </div>
              </div>
              <div class="list_body">
                <div class="body_top">
                  <div class="body_top_left">
                    <div>{{ item.Name_ | overstep(4) }}</div>
                    <div>{{ item.Sex_ == 1 ? "男" : "女" }}</div>
                    <div>{{ item.Age_ }}岁</div>
                  </div>
                  <div class="body_top_right">
                    {{ item.illnessName | overstep(6) }}
                  </div>
                </div>
                <div class="body_bottom">
                  {{ item.CreateTime_ }}
                </div>
              </div>
              <div class="list_bottom" @click.stop="goNexts(item.Id_)">
                <span>营养诊断报告</span>
              </div>
            </div>
          </div>
          <div class="boxx" v-else>
            <img src="../../../assets/images/unHistory.png" alt=""/>
            <p>暂无历史开单信息</p>
          </div>
        </van-tab>
        <van-tab title="营养推荐">
          <div class="box" v-if="nutritionData.length != 0">
            <div
                class="tab_list"
                v-for="(item, index) in nutritionData"
              :key="index"
              @click="goNext(item.Id_)"
            >
              <div class="list_top">
                <div class="top_left">
                  <img src="../../../assets/images/history.png" alt=""/>
                  <span>{{ item.DeviceName_ | overstep(12) }}</span>
                </div>
                <div
                  :class="
                    item.PayStatus_ != 1
                      ? 'top_right'
                      : item.PushOutStatus_ == 3
                      ? 'top_right_secc'
                      : 'top_right_up'
                  "
                >
                  {{
                    item.PayStatus_ != 1
                      ? "待支付"
                      : item.PushOutStatus_ == 3
                      ? "交易完成"
                      : "待自提"
                  }}
                </div>
              </div>
              <div class="list_body">
                <div class="body_top">
                  <div class="body_top_left">
                    <div
                      class="img_box"
                      v-for="(item2, idnex2) in item.Url"
                      :key="idnex2"
                    >
                      <div class="img_list" v-if="idnex2 < 3">
                        <img :src="item2.ImgUrl_" alt="" />
                      </div>
                    </div>
                  </div>
                  <div class="body_top_right">
                    共{{ item.GoodsQuantity_ }}件
                  </div>
                </div>
                <div class="body_bottom">
                  {{ item.CreateTime_ }}
                </div>
              </div>
            </div>
          </div>
          <div class="boxx" v-else>
            <img src="../../../assets/images/unHistory.png" alt="" />
            <p>暂无历史开单信息</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import { globalServiceHost } from "@/utils/httpConfig";
export default {
  name: "history",
  components: {
    commonHeader
  },
  filters: {
    overstep(item, num) {
      if (!item || item.length < num) return item;
      let str = "";
      str = item.substring(0, num) + "...";
      return str;
    }
  },
  data() {
    return {
      customTitle: "数据统计",
      title: "历史开单",
      type: 1, //展示的类型 1 营养筛查; 2 营养方案
      screeningData: [
        // {
        //   DeviceName_:"1",
        //   PayStatus_: 1,
        //   PushOutStatus_: 3,
        //   Name_: "da asd ",
        //   Sex_: "1",
        //   Age_: "11",
        //   illnessName: "asd ",
        //   CreateTime_: "2019"
        // }
      ], //营养筛查数据
      diagnosticsData: [], //营养诊断数据
      nutritionData: [
        // {
        //   DeviceName_:"1",
        //   PayStatus_: 1,
        //   PushOutStatus_: 3,
        //   Name_: "da asd ",
        //   Sex_: "1",
        //   Age_: "11",
        //   illnessName: "asd ",
        //   CreateTime_: "2019"
        // }
      ] //营养方案数据
    };
  },
  created() {
    console.log(globalServiceHost);
    this.selectScreening(0); //查询营养筛查
    this.selectScreening(1); //查询营养筛查
    this.selectNutrition(); //查询营养方案
  },
  mounted() {},
  methods: {
    selectScreening(type) {
      //查询营养筛查
      this.$http
          .request({
            method: "get",
            url: "/RReportIllnessController/getScreeningSolution",
            body: {
              type: type
            }
          })
          .then(res => {
          if (res.data.success) {
            if (type == 0) {
              this.screeningData = res.data.data;
            } else if (type == 1) {
              this.diagnosticsData = res.data.data;
            }

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
    onClick(name, title) {
      console.log(name, "name");
      //切换标签
      this.type = name;

      console.log(name);
    },
    selectNutrition() {
      //查询营养方案
      this.$http
        .request({
          method: "get",
          url: "/RReportIllnessController/getNutrientSolution",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.nutritionData = res.data.data;
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
    goNexts(id) {
      //是筛查报告
      window.open(
        globalServiceHost.nutritionUrl + "results?id=" + id + "&state=1"
      );
    },
    goNext(id) {
      // type类型 是筛查或者方案
      if (this.type < 2) {
        //是筛查
        window.open(globalServiceHost.nutritionUrl + "his_report?id=" + id);
      } else {
        //是方案
        this.$store.commit("vendingMachine/saveOrderId", id);
        this.$router.push({
          name: "statisOrder"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
#history {
  width: 100%;
  height: 100%;
  background: @backgroundColor;
  .main {
    position: absolute;
    top: 44/375 * 100vw;
    margin-bottom: env(safe-area-inset-bottom);
    bottom: 0;
    overflow-y: hidden;
    left: 0;
    right: 0;

    /deep/ .van-tabs {
      .width(351);
      .height(46);
      .margin(0, 12, 0, 12);
      .borderRadius(10, 10, 10, 10);
      padding-top: 0;
      .van-tabs__wrap {
        .height(46);
        .borderRadius(10, 10, 10, 10);
      }
      .van-tab {
        .fontSize(16);
        .lineHeight(46);
      }

      .van-tab--active {
        span {
          font-weight: bold;
        }
      }
      .van-tabs__line {
        width: (54 / 375) * 100vw !important;
        .height(2);
        background-color: @mainColor;
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
      position: fixed;
      top: 103/375 * 100vw;
      left: 12/375 * 100vw;
      right: 12/375 * 100vw;
      bottom: 0;

      .tab_list {
        background-color: @backgroundColorT;
        .margin(0, 0, 15, 0);
        .borderRadius(10, 10, 10, 10);

        .list_top,
        .list_body {
          border-bottom: 1px solid @listBorderColor;
        }

        div {
          &:last-child {
            border-bottom: 0;
          }
        }
        .list_top {
          .padding(11, 10, 11, 10);
          justify-content: space-between;
          display: flex;

          .top_left {
            display: flex;

            img {
              .width(20);
              .height(27);
            }

            span {
              .lineHeight(30);
              .fontSize(16);
              font-weight: bold;
              color: @titleColor;
              .padding(0, 0, 0, 10);
            }
          }

          .top_right {
            .lineHeight(30);
            .fontSize(16);
            color: @fontRedColor;
          }

          .top_right_secc {
            .lineHeight(30);
            .fontSize(16);
            color: @titleColor;
          }

          .top_right_up {
            .lineHeight(30);
            .fontSize(16);
            color: @topRightUpColor;
          }
        }
        .list_body {
          .padding(15, 10, 15, 10);
          .body_top {
            .fontSize(16);
            .lineHeight(22);
            color: @titleColor;
            display: flex;
            justify-content: space-between;
            .body_top_left {
              display: flex;
              div {
                .padding(0, 20, 0, 0);
              }
              .img_box {
                padding: 0;
                display: flex;
                .img_list {
                  padding: 0;
                  .margin(0, 10, 0, 0);
                  .width(78);
                  .height(78);
                  .borderRadius(10, 10, 10, 10);
                  overflow: hidden;

                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background-color: #f6f6f6;
                  }
                }
              }
            }
            .body_top_right {
              display: flex;
              align-items: center;
            }
          }
          .body_bottom {
            .padding(15, 0, 0, 0);
            .fontSize(14);
            .lineHeight(20);
            color: @descriptionColor;
          }
        }
        .list_bottom {
          .padding(15, 0, 15, 0);
          text-align: center;

          span {
            .lineHeight(22);
            .fontSize(16);
            color: @statisticBlueColor;
            text-decoration: underline;
          }
        }
      }
    }

    .boxx {
      .lineHeight(22);
      text-align: center;

      img {
        .width(205);
        .padding(112, 0, 0, 0);
      }

      p {
        .fontSize(18);
        .padding(24, 0, 0, 0);
        font-weight: bold;
        color: @titleColor;
      }
    }
  }
}
</style>
