/**
* @Description: 复诊列表(患者端)
* @Author: 侯湃
* @Date: 2020/7/13
*/
<template>
  <div class="returnVisitP_page">
    <common-header
        :share-disabled="true"
        :custom-title="customTitle"
    ></common-header>
    <div style="position: fixed;background: #EDEDED;z-index: 10;width: 100%;">
      <div class="head">
        <div class="icon header-div header-left" @click="headerBack">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        复诊列表
      </div>
      <div class="search"
           @click="go_search" :class="[{'withSearchValue':searchValue}]">
        <van-icon name="search" class="icon"/>
        {{ "输入疾病/患者姓名搜索"}}
      </div>
      <van-tabs
          v-model="active"
          class="tabs"
          @change="changetabs">
        <van-tab title="待复诊"></van-tab>
        <van-tab title="过往复诊"></van-tab>
      </van-tabs>
    </div>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :class="[{'loading':loading,'vanList':true,'noHasValueTip':!list.length && !loading}]">
      <div @click.stop="getReturnVisitPDetail(item.id)"
           :class="[{'returnVisitP_before_item':item.isnofailure == 2,'today_returnVisitP':item.status == 2 && item.isnofailure != 2,'returnVisitP_item':item.isnofailure == 1}]"
           v-for="(item,index) in list"
           :key="index">
        <!--        待复诊-->
        <div class="contents_box" v-if="item.isnofailure == 1">
          <span class="returnVisitP_status"
                :class="[{'unRead':item.status == 0,'read':item.status != 0 && item.status != 2,'today':item.status == 2}]">
            {{ item.status | returnVisitpStatus}}
          </span>
          <div class="left_image">
            <img :src="item.imgurl || ''" alt="">
          </div>
          <div class="right_info">
            <p class="doctor_info">主治医生: {{item.doctorname || ""}}</p>
            <p class="patient_info">患者姓名: {{item.patientname || ""}}</p>
            <p class="disease_info">复诊疾病: {{item.illnessname || ""}}</p>
            <p class="returnVisitP_time_info">复诊时间: {{item.subsequentvisittime || ""}}</p>
          </div>
        </div>
        <!--        过往复诊-->
        <div class="contents_box" v-if="item.isnofailure == 2">
          <div class="top_box">
          <span class="invalid_tip">
            复诊提醒已失效
          </span>
            <span class="status_tip"
                  :class="[{'completed':item.subsequentvisitstatus == 1,'notComplete':item.subsequentvisitstatus != 1}]">
            {{item.subsequentvisitstatus == 1 ?"已复诊":"未复诊"}}
          </span>
          </div>
          <div class="bottom_box">
            <div class="left_image">
              <img src="../../../assets/images/patient.png" alt="">
            </div>
            <div class="right_info">
              <p class="doctor_info">主治医生:{{item.doctorname || ""}}</p>
              <p class="patient_info">患者姓名:{{item.patientname || ""}}</p>
              <p class="disease_info">复诊疾病: {{item.illnessname || ""}}</p>
              <p class="returnVisitP_time_info">复诊时间: {{item.subsequentvisittime || ""}}</p>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <div class="boxx" v-if="list.length==0&&!loading">
      <img src="../../../assets/images/unHistory.png" alt=""/>
      <p>暂无记录</p>
    </div>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast} from "vant";

  export default {
    name: "returnVisitP",
    data() {
      return {
        active: 0,
        list: [],
        loading: false,
        finished: false,
        doctorId: "",
        page: 1,
        limit: 20,
        isFromSearch: false,
        searchValue: "",
        isFromIM: false,
        times: Date.parse(new Date()) / 1000 - 7 * 24 * 60 * 60
      };
    },
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["PatientIM"]),
      customTitle() {
        let customTitle;
        if (this.isFromIM) {
          customTitle = "医患沟通";
        } else {
          customTitle = "首页";
        }
        return customTitle;
      }
    },
    filters: {
      returnVisitpStatus(value) {
        let returnVisitpStatus = "";
        if (value == 0) {
          returnVisitpStatus = "未读";
        } else if (value == 2) {
          returnVisitpStatus = "今日复诊";
        } else {
          returnVisitpStatus = "已读";
        }
        return returnVisitpStatus;
      }
    },
    methods: {
      /**
       * 返回上一页
       */
      headerBack() {
        if (window.history.length <= 1) {
          try {
            WeixinJSBridge.call("closeWindow");
          } catch (e) {
            console.log(e);
          }
        } else {
          this.$router.go(-1);
        }
      },
      /**
       * tab切换查询
       * **/
      changetabs() {
        this.page = 1;
        this.list = [];
        this.getReturnVisitPList();
      },
      /**
       * 搜索跳转
       * **/
      go_search() {
        this.$router.push({
          name: "returnVisitPSearch"
        });
      },
      /**
       * 待复诊下拉加载
       * **/
      onLoad() {
        this.loading = true;
        this.getReturnVisitPList();
      },
      /**
       * 获取复诊通知列表
       * **/
      getReturnVisitPList() {
        let params = {
          page: this.page,
          limit: this.limit,
          patientId: this.PatientIM.patientMessage.id || "",
          doctorid: this.doctorId,
          type: this.active == 0 ? 1 : this.active == 1 ? 2 : ""
        };
        if (!params.doctorid) {
          delete params.doctorid;
        }
        this.$http.request({
          method: "get",
          url: "/SSubsequentVisitController/selectPageModel",
          body: params
        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            if (this.list.length && this.list.length < res.data.total) {
              this.list = this.list.concat(res.data.data || []);
            } else {
              this.list = res.data.data || [];
            }
            if (this.list.length >= res.data.total) {
              this.finished = true;
            } else {
              this.finished = false;
              this.page++;
            }
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(err => {
          this.loading = false;
          console.log(err);
        });
      },
      /**
       * 查看复诊详情
       * **/
      getReturnVisitPDetail(id) {
        this.$router.push({
          path: "/returnVisitPDetail",
          query: {
            id: id || "",
            isFromIM: this.isFromIM
          }
        });
      }
    },
    created() {
      this.doctorId = this.$route.query.doctorId || "";
      // this.searchValue = this.$route.query.searchValue || "";
      // this.isFromSearch = !!this.searchValue;
      this.isFromIM = !!this.$route.query.isFromIM;
    }
  };
</script>

<style scoped lang="less">

  .returnVisitP_page::-webkit-scrollbar {
    display: none;
  }

  .returnVisitP_page {
    width: 100%;
    min-height: 100%;
    background: @backgroundColor;

    /deep/ .van-tab--active .van-tab__text {
      font-weight: bold;
    }

    /deep/ .van-tab .van-ellipsis {
      .fontSize(16) !important;
      font-weight: 400;
      color: @fontColor33;
    }

    /deep/ .van-tab.van-tab--active {
      .van-ellipsis {
        font-weight: bold;
      }
    }


    /deep/ .van-tab__text {
      .fontSize(16) !important;
      font-weight: 400;
      color: @fontColor33;
    }

    .head {
      .height(44);
      width: 100%;
      background: @backgroundColor;
      .lineHeight(44);
      .fontSize(18);
      font-weight: 400;
      color: @fontColor33;
      text-align: center;
      position: relative;

      .icon {
        width: 20%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: left;
        display: flex;
        align-items: center;
        height: 100%;
        color: @titleColor;
        position: absolute;
        left: 12/3.75vw;

        .back-icon {
          .fontSize(20);
          font-weight: 600;
          color: @titleColor;
        }
      }

      .button {
        .width(84);
        .height(34);
        background: @buttonColor;
        .fontSize(16) !important;
        color: @fontColorff;
        text-align: center;
        .lineHeight(36);
        .borderRadius(6, 6, 6, 6);
        position: absolute;
        right: 12/3.75vw;
        top: 5/3.75vw;
        padding: 0;
      }
    }

    .withSearchValue.search {
      color: rgba(51, 51, 48, 1);
    }

    .search {
      .width(312);
      .height(34);
      .lineHeight(36);
      .margin(10, 12, 10, 12);
      .padding(0, 0, 0, 38);
      background: @fontColorff;
      .borderRadius(10, 10, 10, 10);
      .fontSize(16);
      color: @fontColor99;
      position: relative;

      .icon {
        .fontSize(24);
        position: absolute;
        top: 5/375*100vw;
        left: 10/375*100vw;
      }
    }


    .tabs {
      .width(350);
      .fontSize(16);
      color: @fontColor33;
      .margin(0, 12, 0, 12);

      /deep/ .van-tabs__wrap {
        .height(40);
        .lineHeight(40);
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
      }

      /deep/ .van-tabs__line {
        background: @buttonColor;
        .width(50);
      }
    }

    .searchWithValue.vanList {
      .padding(104, 12, 30, 12) !important;
    }


    /deep/ .noHasValueTip.vanList {
      .van-list__finished-text {
        display: none;
      }
    }

    .vanList {

      .padding(152, 12, 30, 12);

      .today_returnVisitP {
        background-image: url("../../../assets/images/naozhong.png");
        background-position: right bottom;
        background-repeat: no-repeat;
        background-size: 70/375*100vw 70/375*100vw;
      }

      .returnVisitP_item {
        display: flex;
        .borderRadius(10, 10, 10, 10);
        .margin(0, 0, 15, 0);
        background-color: @fontColorff;
        .padding(18, 10, 18, 10);
        position: relative;
        overflow: hidden;

        .returnVisitP_status {
          .borderRadius(0, 8, 0, 8);
          position: absolute;
          right: 0;
          top: 0;
          .fontSize(16);
          .padding(2, 4, 2, 4);
          color: @fontColorff;
        }

        .returnVisitP_status.read {
          background-color: #4194ff;
        }

        .returnVisitP_status.unRead {
          background-color: #00cf68;
        }

        .returnVisitP_status.today {
          background-color: #ff5f00;
        }

        .left_image {
          .margin(0, 10, 0, 0);
          display: flex;
          height: 100%;

          img {
            display: block;
            .width(60);
            .height(60);
            border-radius: 50%;
            overflow: hidden;
          }
        }

        .right_info {
          flex: 1;
          width: 0;

          p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            .fontSize(16);
            .lineHeight(26);
            font-weight: 400;
            color: @fontColor33;
          }
        }
      }

      .returnVisitP_before_item {
        display: flex;
        flex-direction: column;
        .borderRadius(10, 10, 10, 10);
        .margin(0, 0, 15, 0);
        background-color: @fontColorff;
        .padding(18, 10, 18, 10);

        .top_box {
          .margin(0, 0, 12, 0);
          display: flex;
          justify-content: space-between;
          align-items: center;

          .invalid_tip {
            font-weight: 400;
            color: @fontColor66;
            .fontSize(14);
          }

          .status_tip {
            .fontSize(14);
            font-weight: 400;
            color: @fontColorff;
            .borderRadius(6, 6, 6, 6);
            .padding(4, 8, 4, 8);
          }

          .status_tip.completed {
            background: linear-gradient(226deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
          }

          .status_tip.notComplete {
            background: linear-gradient(226deg, rgba(255, 146, 0, 1) 0%, rgba(255, 89, 0, 1) 100%);
          }

        }

        .bottom_box {
          display: flex;

          .left_image {
            .margin(0, 10, 0, 0);
            display: flex;
            height: 100%;

            img {
              display: block;
              .width(60);
              .height(60);
              border-radius: 50%;
              overflow: hidden;
            }
          }

          .right_info {
            flex: 1;
            width: 0;

            p {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              .fontSize(16);
              .lineHeight(26);
              font-weight: 400;
              color: @fontColor33;
            }
          }
        }
      }
    }

    .contents_box {
      display: contents;
    }
  }

  .boxx {
    .width(205);
    .height(267);
    position: fixed;
    left: 0;
    right: 0;
    top:0;
    bottom:0;
    margin: auto;
    z-index: 100;

    img {
      display: block;
      width: 100%;
    }

    p {
      .fontSize(18);
      text-align: center;
      font-weight: bold;
      color: @titleColor;
    }
  }

</style>
