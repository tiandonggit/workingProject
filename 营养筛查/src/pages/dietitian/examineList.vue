/**
*@desc 营养师审核列表
*@author houpai
*@date 2020/04/07 10:08:56
*/
<template>
  <div class="examineList_page">
    <commonHeader :share-disabled="true" :custom-title="'营养方案审核'" :header-show="false"></commonHeader>
    <div class="tab_select">
      <ul class="tab-ul">
        <div @click.stop="tabChange(2)" :class="[{'selected':examineType === 2}]">待审核</div>
        <div @click.stop="tabChange(3)" :class="[{'selected':examineType === 3}]">已通过</div>
        <div @click.stop="tabChange(4)" :class="[{'selected':examineType === 4}]">未通过</div>
      </ul>
      <div class="sub-tab-box">
        <ul class="sub-tab-ul">
          <div @click.stop="subTabChange(1)" :class="[{'selected':subExamineType === 1}]">营养筛查</div>
          <div @click.stop="subTabChange(2)" :class="[{'selected':subExamineType === 2}]">营养诊断</div>
        </ul>
      </div>
      <div class="search_box">
        <van-search @search="onSearch" v-model="searchValue" placeholder="输入要搜索的内容"></van-search>
      </div>
    </div>
    <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <div class="examineList_box">
        <ul class="examineList">
          <li
              v-for="(item,index) in examineList"
              @click.stop="getExamineDetail(item)"
              :key="item.id"
          >
            <img src="../../assets/img/examineListBg.png"/>
            <p class="title">
              <span>方案编号: {{item.id || ""}}</span>
              <span
                  class="state_span"
                  :class="[{'state_span_success':examineType === 3,'state_span_fail':examineType === 4}]"
              >{{ examineTypeFormat(examineType)}}</span>
            </p>
            <div class="content">
              <p class="patient_name">患者姓名: {{item.name || ""}}</p>
              <p class="doctor_name">医生姓名: {{item.tee || ""}}</p>
              <p class="submit_time">提交时间: {{item.createtime || ""}}</p>
            </div>
          </li>
        </ul>
        <!--        <p class="no_result" v-else>暂无方案</p>-->
      </div>
    </van-list>
  </div>
</template>

<script>
  import commonHeader from "../../components/commonHeader/common_header";

  export default {
    name: "examineList",
    components: {
      commonHeader
    },
    data() {
      return {
        examineType: 2, // 2:待审核 3:已审核 4: 未通过
        subExamineType: 1, // 1:营养筛查   2: 营养诊断
        searchValue: "",
        page: 1,
        limit: 10,
        examineList: [], // 审核列表
        loading: false, // loading
        finished: false // 是否已经全部加载
      };
    },
    methods: {
      examineTypeFormat(value) {
        let examineType = "待审核";
        switch (value) {
          case 2:
            examineType = "待审核";
            break;
          case 3:
            examineType = "已通过";
            break;
          case 4:
            examineType = "未通过";
            break;
          default:
            examineType = "待审核";
        }
        return examineType;
      },
      /**
       * 分页加载
       * **/
      onLoad() {
        setTimeout(() => {
          this.getExamineList();
          console.log("onload");
        }, 0);
      },
      /**
       * tab change
       * **/
      tabChange(type) {
        if (type === this.examineType) return false;
        this.examineType = type;
        this.page = 1;
        this.examineList = [];
        this.finished = false;
        this.getExamineList();
      },

      subTabChange(type) {
        if (type === this.subExamineType) return false;
        this.page = 1;
        this.examineList = [];
        this.finished = false;
        this.subExamineType = type;
        this.getExamineList();
      },
      /**
       * search
       * **/
      onSearch() {
        this.page = 1;
        this.examineList = [];
        this.finished = false;
        this.getExamineList();
        console.log("onsearch");
      },
      /**
       * getExamineList
       * **/
      getExamineList() {
        this.$http
          .request({
            url: "/NNutritionPrescribePatientController/selectNNutrition",
            method: "get",
            body: {
              page: this.page,
              limit: 10,
              text: this.searchValue,
              type: this.examineType,
              presType: this.subExamineType - 1,
              state: 1
            }
          })
          .then(res => {
            this.loading = false;
            if (res.data.success && res.data.data) {
              let examineList = res.data.data.list || [];
              let examineList2 = this.examineList.concat(examineList);
              this.examineList = this.$objectArrNorepeat(examineList2, "id");
              this.page++;
              // 数据全部加载完成
              if (this.examineList.length >= res.data.data.total) {
                this.finished = true;
              }
            } else {
              console.log("审核单列表接口报错");
              this.finished = true;
            }
          })
          .catch(e => {
            console.log(e);
            this.finished = true;
            this.loading = false;
          });
      },
      /**
       * go ExamineDetail
       * 由于后台无审核状态字段,自行传入审核详情页
       * **/
      getExamineDetail(item) {
        if (this.examineType !== 2) {
          let prestype = this.subExamineType == 2 ? 1 : 0;
          this.$store.commit("Patient/prestype", prestype);
          this.$router.push({
            path: "/examineDetail",
            query: {
              id: item.id,
              type: this.examineType
            }
          });
        } else {
          // 待审核报告跳转前判断是否已审核（多营养师同时操作情况下）
          this.$http
            .request({
              url: "/NNutritionVerifyController/getVerifyStatus",
              method: "get",
              body: {
                patiId: item.id
              }
            })
            .then(res => {
              if (res.data.success) {
                if (res.data.data == 12) {
                  Toast(res.data.message || "该营养方案已被审核完毕");
                  this.onSearch();
                } else if (res.data.data == 13) {
                  Toast(res.data.message || "该营养方案已被驳回");
                  this.onSearch();
                } else {
                  let prestype = this.subExamineType == 2 ? 1 : 0;
                  this.$store.commit("Patient/prestype", prestype);
                  this.$router.push({
                    path: "/examineDetail",
                    query: {
                      id: item.id,
                      type: this.examineType
                    }
                  });
                }
              }
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    }
  };
</script>

<style>
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    /*导航操作栏上移*/
    .examineList_page {
      min-height: calc(100% - 34px) !important;
    }
  }
</style>
<style scoped lang="less">
  .examineList_page {
    min-height: 100%;
    /*overflow: hidden;*/
    display: flex;
    flex-direction: column;

    /deep/ .van-list {
      flex: 1;
      background-color: @backgroundColorff;
    }

    /deep/ .van-search {
      padding: 0;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      overflow: hidden;

      .van-search__content {
        background-color: #fff;
      }

      .van-field__control {
        .fontSize(16);
        font-weight: 400;
        color: @fontColor33;
      }

      .van-field__left-icon .van-icon,
      .van-field__right-icon .van-icon {
        .fontSize(22);
      }
    }

    .tab_select {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      background-color: @backcolor;

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
          color: rgba(102, 102, 102, 1);
          background-color: @backcolor;
        }

        div.selected {
          color: rgba(0, 105, 255, 1);
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

    .examineList_box {
      /*flex: 1;*/
      /*height: 100%;*/
      background: #fff;
      .padding(144, 0, 24, 12);

      .examineList {
        .padding(7, 0, 0, 0);

        li {
          overflow: hidden;

          img {
            display: block;
            .width(96);
            .height(108);
            position: absolute;
            right: -27 / 375 * 100vw;
            bottom: -24 / 375 * 100vw;
          }

          display: flex;
          flex-direction: column;
          position: relative;
          .borderRadius(10, 10, 10, 10);
          .height(150);
          .margin(0, 12, 15, 0);
          .padding(10, 10, 10, 10);
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);

          .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .padding(0, 0, 15, 0);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            span {
              .fontSize(16);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              // text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
            }

            .state_span {
              color: rgba(0, 105, 255, 1);
              border-bottom: 1px solid rgba(0, 105, 255, 1);
            }

            .state_span_success {
              color: rgba(0, 203, 95, 1);
              border-bottom: 0;
            }

            .state_span_fail {
              color: rgba(153, 153, 153, 1);
              border-bottom: 0;
            }

            .notPass {
              color: rgba(0, 0, 0, 0.2);
            }

            .pass {
              color: rgba(0, 203, 95, 1);
            }
          }

          .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;

            p {
              .fontSize(16);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              // text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
              .padding(8, 0, 8, 0);
            }
          }
        }
      }

      .no_result {
        text-align: center;
        color: rgba(153, 153, 153, 1);
        .padding(60, 0, 0, 0);
      }
    }
  }
</style>
