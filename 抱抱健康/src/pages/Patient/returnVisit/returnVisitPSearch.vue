/**
* @Description: 患者端复诊列表搜索页
* @Author: 侯湃
* @Date: 2020/7/19
*/
<template>
  <div class="returnVisitPSearch_page">
    <common-header
        :share-disabled="true"
        :title="'复诊详情'"
        :header-show="true"
        :custom-title="'医患沟通'"
    ></common-header>
    <div class="search_returnVisitP_box">
      <div class="search_header">
        <van-search
            @search="onSearch"
            @input="find=false"
            placeholder="输入疾病/患者姓名搜索"
            show-action
            type="search"
            v-model="searchValue">
          <template #action>
            <div @click.stop="onSearch" class="search_btn">搜索</div>
          </template>
        </van-search>
      </div>
    </div>
    <div class="search_history_box" v-if="!searchValue || !find">
      <h3 class="search_title">历史搜索</h3>
      <ul class="search_history">
        <li class="search_history_item"
            @click.stop="history_search(item.name)"
            v-if="item.time>times"
            v-for="(item,index) in searchHistoryList"
            :key="index">
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class="no_find" v-else-if="find && !list.length && !loading">
      <img src="../../../assets/images/no_find.png" class="images"/>
      <div class="text_title">暂未找到您的搜索内容</div>
      <div class="text_toast">请尝试输入其他关键词搜索</div>
    </div>
    <van-list
        v-else-if="find && list.length"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :class="[{'loading':loading,'vanList':true}]">
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
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast} from "vant";

  export default {
    name: "returnVisitPSearch",
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
    data() {
      return {
        page: 1,
        limit: 20,
        isFromIM: false,
        doctorId: "",
        searchValue: "",
        searchHistoryList: [],
        times: Date.parse(new Date()) / 1000 - 7 * 24 * 60 * 60,
        find: false, // 是否已查询
        list: [],
        loading: false,
        finished: false
      };
    },
    methods: {
      /**
       * 搜索复诊
       * **/
      onSearch(val) {
        this.history_tag();
      },
      //点击历史记录查询
      history_search(value) {
        if (typeof value === "string") {
          this.searchValue = value;
          this.history_tag();
        } else {
          return false;
        }
      },
      /**
       * 待复诊下拉加载
       * **/
      onLoad() {
        this.loading = true;
        this.getReturnVisitPList();
      },
      /**
       * 查看复诊详情
       * **/
      getReturnVisitPDetail(id) {
        if (this.searchValue) {
          window.localStorage.setItem("returnVisitPSearch_value", this.searchValue);
        }
        this.$router.push({
          path: "/returnVisitPDetail",
          query: {
            id: id || ""
          }
        });
      },
      /**
       * 搜索复诊
       * **/
      getReturnVisitPList() {
        this.find = true;
        this.loading = true;
        let params = {
          page: this.page,
          limit: this.limit,
          patientId: this.PatientIM.patientMessage.id || "",
          doctorid: this.doctorId,
          fuzzySearch: this.searchValue
        };
        if (!params.doctorid) {
          delete params.doctorid;
        }
        if (!params.fuzzySearch) {
          delete params.fuzzySearch;
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
      //查询字符串中指定字符个数
      getStrCount(scrstr, armstr) { //scrstr 源字符串 armstr 特殊字符
        let count = 0;
        while (scrstr.indexOf(armstr) != -1) {
          scrstr = scrstr.replace(armstr, "");
          count++;
        }
        return count;
      },
      //历史记录标签
      history_tag() {
        if (!this.searchValue) {
          return false;
        }
        let spaceNum = this.getStrCount(this.searchValue, " ");
        if (this.searchValue.length == spaceNum) {
          this.searchValue = "";
          return false;
        }
        let new_list = {name: this.searchValue, time: Date.parse(new Date()) / 1000};
        let getArray = this.$hasValueFromArray(
          this.searchHistoryList,
          "name",
          new_list.name
        );
        if (getArray.value) {
          this.searchHistoryList.splice(getArray.index, 1);
          this.searchHistoryList.unshift(new_list);
        } else {
          this.searchHistoryList.unshift(new_list);
          if (this.searchHistoryList.length >= 10) {
            this.searchHistoryList.splice(10, 11);
          }
        }
        window.localStorage.setItem("returnVisitPSearch_history", JSON.stringify(this.searchHistoryList));
        this.list = [];
        this.page = 1;
        this.getReturnVisitPList();
      }
    },
    created() {
      this.doctorId = this.$route.query.doctorId || "";
      this.isFromIM = !!this.$route.query.isFromIM;
      this.searchHistoryList = JSON.parse(window.localStorage.getItem("returnVisitPSearch_history")) || [];
      this.searchValue = window.localStorage.getItem("returnVisitPSearch_value") || "";
      if (this.searchValue) {
        this.getReturnVisitPList();
      }
    }
  };
</script>

<style scoped lang="less">
  .returnVisitPSearch_page {
    .padding(100, 12, 24, 12);

    /deep/ .van-search__action {
      padding: 0 !important;
    }

    /deep/ .vanList.loading .van-list__finished-text {
      display: none;
    }

    .search_returnVisitP_box {
      position: fixed;
      z-index: 999;
      left: 12/375*100vw;
      right: 12/375*100vw;
      top:40/375*100vw;

      .search_header {
        .height(44);
        z-index: 10;
        display: flex;
        align-items: center;
        background-color: @backgroundColor;


        /deep/ .van-search {
          background-color: @backgroundColor !important;
          flex: 1;
          padding: 0 !important;

          /deep/ .van-icon {
            .fontSize(20);
            color: rgba(204, 204, 204, 1);
          }

          /deep/ .van-field__body {
            .fontSize(16);
          }
        }

        /deep/ .van-search__content {
          background-color: rgba(255, 255, 255, 1);
          .borderRadius(6, 6, 6, 6);
        }

        .search_btn {
          display: flex;
          justify-content: center;
          align-items: center;
          .width(52);
          .height(34);
          color: @fontColorff;
          .fontSize(16);
          background: rgba(0, 105, 255, 1);
          .borderRadius(10, 10, 10, 10);
          .margin(0, 0, 0, 10);
        }
      }
    }

    .search_history_box {

      .search_title {
        .padding(15, 0, 15, 0);
        .fontSize(16);
        font-weight: bold;
        color: @fontColor33;
      }

      .search_history {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .search_history_item {
          background-color: @backgroundColorff;
          .fontSize(16);
          font-weight: 400;
          color: @fontColor33;
          .borderRadius(6, 6, 6, 6);
          .padding(4, 10, 4, 10);
          .margin(0, 10, 10, 0)
        }
      }
    }

    .no_find {
      .images {
        .width(200);
        .height(200);
        position: fixed;
        top: 160/375 *100vw;
        left: 88/375 * 100vw;
      }

      .text_title {
        width: 100%;
        .fontSize(18);
        font-weight: bold;
        color: @fontColor33;
        text-align: center;
        position: fixed;
        top: 390/375 * 100vw;
      }

      .text_toast {
        width: 100%;
        .fontSize(16);
        color: @fontColor99;
        text-align: center;
        position: fixed;
        top: 422/375 * 100vw;
      }
    }

    .vanList {

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
</style>
