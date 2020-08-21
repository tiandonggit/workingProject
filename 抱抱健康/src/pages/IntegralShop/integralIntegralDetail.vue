/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: integralIntegralDetail
* @function: 积分明细页 * @date: 2020/1/3 * @time: 9:40 * * */
<template>
  <div id="integralIntegralDetail">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="'true'"
    ></common-header>
    <div class="main">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        v-if="objData.length != 0"
      >
        <div class="main_box">
          <div class="box_list" v-for="(item, index) in objData" :key="index">
            <div class="list_left">
              <div class="left_left">
                <img
                  src="../../assets/images/integralIntegralDetailInfo.png"
                  v-if="item.businesstype == 0"
                  alt=""
                />
                <img
                  src="../../assets/images/integralIntegralDetailRead.png"
                  v-else-if="item.businesstype == 1"
                  alt=""
                />
                <img
                  src="../../assets/images/integralIntegralDetailTask.png"
                  v-else-if="item.businesstype == 2"
                  alt=""
                />
                <img
                  src="../../assets/images/integralIntegralDetailBuy.png"
                  v-else-if="item.businesstype == 3 && type == 1"
                  alt=""
                />
                <img
                  src="../../assets/images/integralIntegralDetailBuys.png"
                  v-else-if="item.businesstype == 3 && type == 0"
                  alt=""
                />
                <img
                  src="../../assets/images/integralIntegralDetailExam.png"
                  v-else-if="item.businesstype == 4"
                  alt=""
                />
                <img
                  src="../../assets/images/integralIntegralDetailShop.png"
                  v-else-if="item.businesstype == 5"
                  alt=""
                />
                <img
                  src="../../assets/images/integralIntegralKnowledge.png"
                  v-else-if="item.businesstype == 6"
                  alt=""
                />
              </div>
              <div class="left_right">
                <div class="right_top">
                  {{
                    item.businesstype == 0
                      ? "完善个人信息"
                      : item.businesstype == 1
                      ? "阅读每日文章"
                  : item.businesstype == 2
                  ? "患者完成每日推送任务"
                  : item.businesstype == 3
                  ? type == 1
                  ? "患者购买商品"
                  : "购买产品"
                  : item.businesstype == 4
                  ? "营养筛查"
                  : item.businesstype == 5
                  ? "商品兑换"
                  : item.businesstype == 6
                  ? "知识学习"
                  : ""
                  }}
                </div>
                <div class="right_bottom">
                  {{ item.createtime | timeFormatting }}
                </div>
              </div>
            </div>
            <div
              :class="
                item.businesstype != 5 ? 'list_right blue' : 'list_right red'
              "
            >
              {{ item.businesstype != 5 ? "+" : "" }} {{ item.point }}
            </div>
          </div>
        </div>
      </van-list>
      <div class="main_boxs" v-else>
        <img v-if="type == 1" src="../../assets/images/unHistory.png" alt="" />
        <img
          v-else
          src="../../assets/images/unIntegralIntegralDetail.png"
          alt=""
        />
        <p>您暂时还没有任何{{ title }}呦！</p>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";

export default {
  name: "integralIntegralDetail",
  components: {
    commonHeader
  },
  filters: {
    timeFormatting(val) {
      val = val.replace(/-/g, "/");
      let date = new Date(val);
      let Y = date.getFullYear() + "年";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "月";
      let D = date.getDate() + "日 ";
      let h = date.getHours().toString();
      h = h.length == 2 ? h + ":" : "0" + h + ":";
      let m = date.getMinutes().toString();
      m = m.length == 2 ? m + ":" : "0" + m + ":";
      let s = date.getSeconds().toString();
      s = s.length == 2 ? s : "0" + s;
      return Y + M + D + h + m + s;
    }
  },
  data() {
    return {
      title: "智币明细",
      customTitle: "礼品商城",
      isPatient: true,
      type: 0, //0患者1医生
      objData: [
        // {
        //   id: 0,
        //   type: 0, //类型(类型(0完善个人记录，1：阅读文章，2：完成每日推送任务,3:购买产品，4:健康筛选,5：兑换商品))
        //   createtime: "2019年12月25日 20:09:13",
        //   point: 200
        // },
        // {
        //   status: 1,
        //   time: "2019年12月25日 20:09:13",
        //   num: 200
        // }
      ],
      loading: false,
      finished: false,
      page: 1,
      limit: 10
    };
  },
  created() {
    this.type = this.$route.query.type;
    console.log(this.type);
    this.title = this.type == 0 ? "健康币明细" : "智币明细";
    this.onLoad();
  },
  mounted() {},
  methods: {
    onLoad() {
      // 异步更新数据
      this.$http
        .request({
          method: "get",
          url: "/PointsCatalogController/selectPageModel",
          body: {
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            console.log("查询成功");
            for (let i = 0; i < res.data.data.length; i++) {
              this.objData.push(res.data.data[i]);
            }
            console.log(this.objData);
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.objData.length >= res.data.total) {
              this.finished = true;
            }
            this.page++;
          } else {
            //失败
            this.$toast("查询失败");
          }
        })
        .catch(e => {
          this.$toast(e);
          console.log(e);
        });
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.objData.push({
      //       status: 1,
      //       time: "2019年12月25日 20:09:13",
      //       num: 200
      //     });
      //   }
      //
      // }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}

#integralIntegralDetail {
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  background: @backgroundColor;

  .main {
    position: absolute;
    top: 44/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    left: 12/375 * 100vw;
    right: 12/375 * 100vw;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    .padding(15, 0, 15, 0);

    &::-webkit-scrollbar {
      display: none !important;
      width: 0px;
      height: 0px;
    }

    .main_box {
      background: @backgroundColorT;

      .borderRadius(10, 10, 10, 10);

      .padding(0, 10, 0, 10);

      .box_list {
        border-bottom: 1px solid @borderLeftColor;
        display: flex;
        justify-content: space-between;
        .padding(12, 0, 12, 0);

        .list_left {
          display: flex;
          align-items: center;

          .left_left {
            .width(32);
            .height(32);
            .padding(10, 10, 10, 0);

            img {
              .width(32);
              .height(32);
            }
          }

          .left_right {
            .right_top {
              .fontSize(18);
              color: @titleColor;
              .padding(0, 0, 15, 0);
            }

            .right_bottom {
              .fontSize(14);
              color: @qianSpan;
            }
          }
        }

        .list_right {
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        .blue {
          color: @font9FFColor;
        }

        .red {
          color: @fontFF3Color;
        }

        &:last-child {
          border: 0;
        }
      }
    }

    .main_boxs {
      text-align: center;

      img {
        .width(205);
        .padding(78, 0, 0, 0);
      }

      p {
        .padding(29, 0, 15, 0);
        font-weight: bold;
        color: @titleColor;
        .fontSize(18);
      }

      span {
        .fontSize(16);
        color: @qianSpan;
      }
    }
  }

  /deep/ .van-loading {
    position: relative;
  }
}
</style>
