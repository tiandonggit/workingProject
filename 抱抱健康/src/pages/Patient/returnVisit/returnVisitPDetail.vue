/**
* @Description: 复诊详情
* @Author: 侯湃
* @Date: 2020/7/13
*/
<template>
  <div class="returnVisitPDetail_page">
    <common-header
        :share-disabled="true"
        :title="'复诊详情'"
        :header-show="true"
        :custom-title="customTitle"
    ></common-header>
    <ul class="content_box">
      <li>主治医生：{{returnVisitPDetail.doctorname || ""}}</li>
      <li>患者姓名：{{returnVisitPDetail.patientname || ""}}</li>
      <li>复诊疾病：{{returnVisitPDetail.illnessname || ""}}</li>
      <li>复诊时间：{{returnVisitPDetail.subsequentvisittime || ""}}</li>
      <li>
        复诊状态：
        <!-- <span
            :class="[{'confirm_status':returnVisitPDetail.status <= 2,'waiting_status':returnVisitPDetail.status > 2}]">
          {{returnVisitPDetail.status | returnVisitpStatus}}
        </span> -->
        <span class="waiting_status">已读</span>
        <span class="waiting" v-if="returnVisitPDetail.subsequentvisitstatus==1">已复诊</span>
        <span class="noVisit" v-else>未复诊</span>
      </li>
      <li class="desc">
        <div>
          复诊说明：
        </div>
        <p>
          {{returnVisitPDetail.explain || ""}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";
  import {Toast} from "vant";

  export default {
    name: "returnVisitPDetail",
    components: {
      commonHeader
    },
    computed: {
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
        if (value == 1 || value == 2) {
          returnVisitpStatus = "已读";
        } else {
          returnVisitpStatus = "未读";
        }
        return returnVisitpStatus;
      }
    },
    data() {
      return {
        returnVisitPDetail: {},
        id: "", // 查询参数
        isFromIM: false
      };
    },
    methods: {
      getReturnVisitPDetail() {
        this.$http.request({
          url: "/SSubsequentVisitController/updateStatusToNotarize",
          method: "post",
          body: {
            id: this.id
          }
        }).then(res => {
          if (res.data.success && res.data.data) {
            this.returnVisitPDetail = res.data.data || {};
          } else {
            Toast(res.data.message || "操作失败");
          }
        }).catch(err => {
          console.log(err);
        });
      }
    },
    created() {
      this.id = this.$route.query.id || "";
      this.isFromIM = !!this.$route.query.isFromIM;
      this.getReturnVisitPDetail();
    }
  };
</script>

<style scoped lang="less">
  .returnVisitPDetail_page {
    background-color: @backgroundColor;
    .padding(50, 12, 24, 12);

    .content_box {
      .borderRadius(10, 10, 10, 10);
      .padding(15, 10, 15, 10);
      background-color: @backgroundColorff;

      li {
        .fontSize(16);
        .lineHeight(30);
        font-weight: 400;
        color: @fontColor33;

        .waiting_status, .confirm_status, .waiting, .noVisit {
          .padding(3, 5, 3, 5);
          color: @fontColorff;
          .borderRadius(6, 6, 6, 6);
          .margin(0, 10, 0, 0);
        }

        .waiting_status {
          background: linear-gradient(226deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
        }

        .confirm_status {
          background: linear-gradient(226deg, rgba(0, 231, 152, 1) 0%, rgba(0, 203, 95, 1) 100%);
        }

        .waiting {
          background: linear-gradient(226deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
        }

        .noVisit {
          background: linear-gradient(226deg, rgba(255, 146, 0, 1) 0%, rgba(255, 89, 0, 1) 100%);
        }
      }

      .desc {
        display: flex;

        p {
          flex: 1;
        }
      }
    }
  }
</style>
