/* * @Author: 田东 * @Date: 2020-04-08 17:02:53 * @Last Modified by: 田东 *
@Last Modified time: 2020-07-12 15:29:29 * @name 待处理报告 */

<template>
  <div id="pendingReport">
    <commonHeader
      :share-disabled="true"
      :custom-title="'待处理报告'"
      :header-show="false"
      :title="''"
    ></commonHeader>

    <div class="tab_select">
      <ul class="tab-ul">
        <div
          @click.stop="tabChange(1)"
          :class="[{ selected: examineType === 1 }]"
        >
          待处理
        </div>
        <div
          @click.stop="tabChange(2)"
          :class="[{ selected: examineType === 2 }]"
        >
          审核中
        </div>
        <div
          @click.stop="tabChange(3)"
          :class="[{ selected: examineType === 3 }]"
        >
          已通过
        </div>
        <div
          @click.stop="tabChange(4)"
          :class="[{ selected: examineType === 4 }]"
        >
          未通过
        </div>
      </ul>
      <div class="sub-tab-box">
        <ul class="sub-tab-ul">
          <div
            @click.stop="subTabChange(1)"
            :class="[{ selected: subExamineType === 1 }]"
          >
            营养筛查
          </div>
          <div
            @click.stop="subTabChange(2)"
            :class="[{ selected: subExamineType === 2 }]"
          >
            营养诊断
          </div>
        </ul>
      </div>
      <div class="search_box">
        <van-search
          @search="onSearch"
          v-model="searchValue"
          placeholder="请输入患者姓名、手机号"
        ></van-search>
      </div>
    </div>

    <div class="main">
      <div class="main_box">
        <!--有报告信息-->
        <div class="content" v-if="objData.length == 0">
          <!--搜索之后无结果-->
          <div class="content_box">
            <img src="../../assets/img/unPendingReport2.png" alt />
            <p>无结果</p>
            <span>暂无此数据</span>
          </div>
        </div>
        <div class="content" v-else>
          <!--有搜索结果-->
          <div class="content_box">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onSelect"
            >
              <div v-for="(item, index) in objData" :key="index">
                <div class="box_list" @click.stop="onGo(item.id, item.illness)">
                  <div class="list_top">
                    <div class="top_left">患者姓名：{{ item.name }}</div>
                    <div class="top_right">{{ item.createtime }}</div>
                  </div>
                  <div class="list_bottom">
                    <div class="bottom_top">
                      <div class="bottom_top_left">
                        患者年龄：{{ item.age }}岁
                      </div>
                      <div class="bottom_top_right">
                        患者性别：{{ item.sex == 2 ? "女" : "男" }}
                      </div>
                    </div>
                    <div class="bottom_bottom">手机号码：{{ item.nphone }}</div>
                    <div
                      class="bottom_bottom"
                      v-if="examineType === 3 || examineType === 4"
                    >
                      {{subExamineType === 1 ? "筛查时间" : "诊断时间"}}：{{ item.createtime || "" }}
                    </div>
                    <div
                      class="bottom_bottom"
                      v-if="examineType === 3 || examineType === 4"
                    >
                      审核医生：{{ item.verifyname || "" }}
                    </div>
                    <div
                      class="bottom_bottom"
                      v-if="examineType === 3 || examineType === 4"
                    >
                      审核时间：{{ item.lastverifytime || "" }}
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";

export default {
  name: "pendingReport",
  components: {
    commonHeader
  },
  data() {
    return {
      objData: [], //待处理报告信息
      key: false, //进来查看第一次是否有值
      searchValue: "",
      loading: false,
      finished: false,
      page: 1,
      limit: 10,
      examineType: 1, // 1:待处理  2:审核中 3:已通过 4: 未通过
      subExamineType: 1, // 1:营养筛查   2: 营养诊断
      oldValue: "" //上一次搜索时的value
    };
  },
  created() {
    this.onSelect();
  },
  mounted() {},
  methods: {
    onSelect() {
      console.log('onSelect: ');

      this.getExamineList();
    },

    tabChange(type) {
      if (type === this.examineType) return false;
      this.page = 1;
      this.objData = [];
      this.finished = false;
      this.examineType = type;
      this.getExamineList();
    },

    subTabChange(type) {
      if (type === this.subExamineType) return false;
      this.page = 1;
      this.objData = [];
      this.finished = false;
      this.subExamineType = type;
      this.getExamineList();
    },

    onSearch() {
      this.page = 1;
      this.objData = [];
      this.finished = false;
      this.getExamineList();
      console.log('onSearch(): ');

    },

    // 根据类型获取报告列表
    getExamineList() {
      //查询数据
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/selectNNutrition",
          body: {
            page: this.page,
            limit: this.limit,
            text: this.searchValue,
            type: this.examineType,
            presType: this.subExamineType - 1
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.success) {
            // console.log("查询成功");
            let examineList = res.data.data.list || [];
            let examineList2 = this.objData.concat(examineList)
            this.objData = this.$objectArrNorepeat(examineList2, "id");
    
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.objData.length >= res.data.data.total) {
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
        });
    },

    // 查看报告详情
    onGo(id, illness) {
      window.sessionStorage.setItem("id", id);
      if (this.examineType == 1) {
        if (this.subExamineType == 1) {
          if (illness == 1) {
            // 风险结果后续选择
            this.$router.push({ name: "nutritionalRiskTotalScore" });
          } else {
            // 风险筛查结果
            this.$router.push({
              name: "screeningReferenceGo",
              query: { type: 1 }
            });
          }
        } else {
          this.$router.push({
            name: "NutritionalDiagnosis",
            query: { id: id ,type: 1}
          });
        }
      } else {
        if (this.subExamineType == 1) {
          this.$router.push({ name: "diagnosis", query: { id: id } });
        } else {
          this.$router.push({ name: "diagnosis", query: { id: id ,type: 1} });
        }
      }
    }
  },
  watch: {
    value(val) {
      val = val.replace(/\s*/g, "");
      this.searchValue = val;
    }
  }
};
</script>

<style>
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  /*导航操作栏上移*/
  #pendingReport {
    height: calc(100% - 34px) !important;
  }
}
</style>

<style lang="less" scoped>
#pendingReport {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /deep/ .van-search {
    padding: 0;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    overflow: hidden;

    .van-cell {
      .lineHeight(24);
    }

    .van-search__content {
      background-color: #fff;
    }

    .van-field__control {
      .fontSize(16);
      font-weight: 400;
    }

    .van-field__left-icon .van-icon,
    .van-field__right-icon .van-icon {
      .fontSize(22);
    }
  }

  .tab_select {
    ul.tab-ul {
      display: flex;
      align-items: center;

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100% / 3);
        .height(44);
        .fontSize(18);
        color: @fontColor66;
      }

      div.selected {
        color: @mainColor;
        background: #fff;
        .borderRadius(10, 10, 0, 0);
      }
    }

    .sub-tab-box {
      height: 51px;
      padding: 7px 12px 10px;
      background: rgba(255, 255, 255, 1);

      .sub-tab-ul {
        height: 34px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 0 55px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        div {
          font-size: 16px;
          font-weight: 400;
          color: @titleColor;
          line-height: 34px;
        }

        .selected {
          font-weight: bold;
          border-bottom: 2px solid @mainColor;
        }
      }
    }

    .search_box {
      background-color: #fff;
      .padding(6, 12, 8, 12);
    }
  }

  .main {
    flex: 1;
    overflow-y: hidden;
    background: #fff;

    .main_box {
      height: 100%;
      text-align: center;
      -webkit-overflow-scrolling: touch;

      img {
        width: 200px;
        padding: 108px 0 0 0;
      }

      p {
        padding: 30px 0 11px 0;
        line-height: 22px;
        font-weight: bold;
        color: @fontColor33;
        font-size: 18px;
      }

      span {
        line-height: 20px;
        font-size: 16px;
        color: @fontColor99;
      }

      .search {
        height: 44px;
        /deep/ .van-search {
          padding: 5px 0;
          /deep/.van-icon {
            font-size: 20px;
          }
          .van-search__content {
            background-color: @backgroundColorff;
            border-radius: 6px;
            input {
              font-size: 16px;
            }
          }
        }
      }

      .content {
        height: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none !important;
          width: 0px;
          height: 0px;
        }

        .content_box {
          text-align: center;
          /*padding: 89px 0 0 0;*/
          img {
            margin: 89px 0 0 0;
            width: 205px;
            padding: 0;
          }

          p {
            padding: 51px 0 11px 0;
            line-height: 22px;
            font-weight: bold;
            color: @fontColor33;
            font-size: 18px;
          }

          span {
            line-height: 20px;
            font-size: 16px;
            color: @fontColor99;
          }

          .swipe-delete {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 18px;
              padding: 0;
              display: block;
              margin-right: 12px;
            }
          }

          .box_list {
            width: 351px;
            padding: 0 10px;
            margin: 10px auto 15px;
            background-color: @backgroundColorff;
            border-radius: 10px;
            background-image: url("../../assets/img/pendingReport.png");
            background-repeat: no-repeat;
            background-position: right bottom;
            background-size: 65.5px 73.5px;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);

            .list_top {
              display: flex;
              align-items: center;
              /*justify-content: space-between;*/
              border-bottom: 1px solid @boederColorF8;
              padding: 11px 0;
              line-height: 24px;
              .top_left {
                color: @mainColor;
                text-align: left !important;
                font-size: 16px;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                /*! autoprefixer: off */
                -webkit-box-orient: vertical;
                /*! autoprefixer: on */
                flex: 1;
                .margin(0, 10, 0, 0);
              }
              .top_right {
                width: 131px;
                font-size: 14px;
                color: @fontColor99;
                text-align: right;
              }
            }
            .list_bottom {
              line-height: 24px;
              text-align: left;
              padding: 11px 0;
              font-size: 16px;

              .bottom_top {
                display: flex;
                justify-content: space-between;

                div {
                  width: 50%;
                }
              }
            }
            :last-child {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
