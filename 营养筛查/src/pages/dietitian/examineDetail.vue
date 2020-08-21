/**
*@desc 审核详情页(待审核,审核通过,审核未通过)
*@author houpai
*@date 2020/04/07 10:08:43
*/
<template>
  <div class="examineDetail_page">
    <commonHeader
        :share-disabled="true"
        :custom-title="'营养方案审核'"
        :header-show="true"
        :title="wxTitle"
    ></commonHeader>
    <div class="examineDetail_box">
      <h4>{{examineDetail.patiName || ""}}营养方案</h4>
      <ul class="examine_desc">
        <li v-if="examineDetail.prescriptionSourceType == '0'">
          <span class="title_span">营养筛查方案码: </span>
          <span class="content_span">{{examineDetail.preSaleCode || ""}}</span>
        </li>
        <li>
          <span class="title_span">方案编号: </span>
          <span class="content_span">{{examineDetail.patiCode || ""}}</span>
        </li>
        <li>
          <span class="title_span">科别: </span>
          <span class="content_span">{{examineDetail.depName || ""}}</span>
        </li>
        <li>
          <span class="title_span">姓名: </span>
          <span class="content_span">{{examineDetail.patiName || ""}}</span>
        </li>
        <li>
          <span class="title_span">性别: </span>
          <span class="content_span">{{examineDetail.patiSex === 1? "男" : "女" }}</span>
        </li>
        <li>
          <span class="title_span">年龄: </span>
          <span class="content_span">{{examineDetail.patiAge || ""}}</span>
        </li>
        <li>
          <span class="title_span">电话: </span>
          <span class="content_span">{{examineDetail.patiPhone || ""}}</span>
        </li>
        <li>
          <span class="title_span">既往疾病史: </span>
          <span class="content_span">{{examineDetail.pastHistory || "无"}}</span>
        </li>
        <li>
          <span class="title_span">药物过敏史: </span>
          <span class="content_span">{{examineDetail.allergyHistory || "无"}}</span>
        </li>
        <li>
          <span class="title_span">日期: </span>
          <span class="content_span">{{examineDetail.createTime || ""}}</span>
        </li>
      </ul>
      <ul class="usage_method">
        <h4>使用方法</h4>
        <li v-for="(item,index) in examineDetail.specList" :key="index">
          <div class="question_box">
            <span class="name">{{index + 1}}.{{item.productName}}</span>
            <span class="number">{{item.quantity}}盒</span>
          </div>
          <div class="question_content">
            Sig: 每日{{ item.dailydose }}袋，{{ item.timesday }}，共{{item.takingtime }}天
          </div>
        </li>
        <div class="main-end">
          <div class="supplement">
            补充：{{ !examineDetail.supplement ? "无" :examineDetail.supplement }}
          </div>
          <div>
            使用详情请遵医嘱
          </div>
        </div>
        <p class="result_detail">
          <span>医师: {{examineDetail.doctorName || ""}}</span>
          <span>
            营养师审核:
            <i :class="[{'success':examineDetail.currentPage === 12,'fail':examineDetail.currentPage === 13}]">
              {{examineDetail.currentPage === 12 ? "已通过":examineDetail.currentPage === 13?"未通过":""}}
            </i>
          </span>
        </p>
      </ul>
    </div>

    <!--        待审核显示-->
    <!--    <div v-if="examineState === 2 && state !== 3 && state !== 4">-->
    <div v-if="examineState === 2">
      <p class="seeDetail" @click.stop="seeResults">查看营养方案详情</p>
      <div class="btn_box">
        <div class="btn reject_btn" @click.stop="submitReject">驳回</div>
        <div class="btn resolve_btn" @click.stop="submitResolve">通过</div>
      </div>
    </div>

    <!--    审核通过显示-->
    <div v-if="examineState === 3">
      <p class="seeDetail_btn" @click.stop="seeResults">查看方案详情</p>
      <ul class="zinenggui_desc">
        <div class="pass_title"><span class="span_kong"></span>智配柜信息</div>
        <li>
          <span class="title_span">智配柜编号: </span>
          <span class="content_span">{{examineDetail.deviceCode || ""}}</span>
        </li>
        <li>
          <span class="title_span">地址: </span>
          <span class="content_span">{{examineDetail.deviceName || ""}}</span>
        </li>
        <!--        <li>-->
        <!--          <span class="title_span">电话: </span>-->
        <!--          <span class="content_span">-->
        <!--            <a href="tel:4000909975">400-0909975</a>-->
        <!--          </span>-->
        <!--        </li>-->
      </ul>
      <ul class="zinenggui_desc buyState">
        <div class="pass_title"><span class="span_kong"></span>患者购药状态</div>
        <li>
          <span class="title_span">患者购药状态: </span>
          <span class="content_span buyState_span">
            {{examineDetail.orderState === 2 ?"待自提" : examineDetail.orderState === 3 ?"交易完成":"未付款" }}
          </span>
        </li>
      </ul>
    </div>

    <!--    未通过显示-->
    <div v-if="examineState === 4">
      <ul class="reject_desc">
        <div class="pass_title"><span class="span_kong"></span>未通过原因</div>
        <li>{{examineDetail.lastVerifyAdvice || ""}}</li>
      </ul>
      <p class="seeDetail_btn" @click.stop="seeResults">查看方案详情</p>
    </div>


    <van-popup v-model="show"
               title="标题">
      <h3>请输入驳回原因</h3>
      <van-field v-model="failReason"
                 class="textarea"
                 placeholder="请填驳回原因"
                 maxlength="100"
                 clearable
                 autosize
                 type="textarea"
                 rows="1"
      ></van-field>
      <div class="btns_box">
        <div class="cancel_btn btn" @click.stop="show=false">取 消</div>
        <div class="sure_btn btn" @click.stop="confirmReject">确 认</div>
      </div>
    </van-popup>

  </div>
</template>

<script>

  import commonHeader from "../../components/commonHeader/common_header";
  import {Dialog, Toast} from "vant";

  export default {
    name: "examineDetail",
    components: {
      commonHeader
    },
    computed: {
      wxTitle() {
        let exTitle = "待审核营养方案";
        let type = this.$route.query.type;
        switch (Number(type)) {
          case 2:
            exTitle = "待审核营养方案";
            break;
          case 3:
            exTitle = "审核已通过";
            break;
          case 4:
            exTitle = "审核未通过";
            break;
          default:
            exTitle = "待审核营养方案";
        }
        return exTitle;
      },

      examineState() {
        let examineState = 2;
        let type = this.$route.query.type;
        switch (Number(type)) {
          case 2:
            examineState = 2;
            break;
          case 3:
            examineState = 3;
            break;
          case 4:
            examineState = 4;
            break;
          default:
            examineState = 2;
        }
        return examineState;
      }

    },
    data() {
      return {
        patiId: "", // 营养处方id
        examineDetail: {},
        show: false,
        failReason: "",
        state: "", // 审核状态  审核或者驳回之后更变视图(往后续页面路由传参的时候需注意)
        type: ""
      };
    },
    methods: {
      /**
       * 获取审核单详情
       * **/
      getExamineDetail() {
        this.$http.request({
          url: "/NNutritionPrescribeGoodsController/selectNutritionPrescribeData",
          method: "get",
          body: {
            patiId: this.patiId
          }
        }).then(res => {
          if (res.data.success) {
            this.examineDetail = res.data.data || {};
          } else {
            console.log("营养处方审核详情接口报错");
          }
        }).catch(e => {
          console.log(e);
        });
      },
      /**
       * 审核通过
       * **/
      submitResolve() {
        Dialog.confirm({
          title: "",
          message: "您确定要审核通过此处方吗?"
        }).then(() => {
          this.$http.request({
            url: "/NNutritionVerifyController/verify",
            method: "post",
            body: {
              patiId: this.patiId,
              guid: this.examineDetail.lastVerifyGuid || "",
              advice: "",
              result: 12
            }
          }).then(res => {
            if (res.data.success) {
              Toast("审核通过");
              this.$router.push({
                path: "/examineList"
              });
              // this.state = 3;
              // this.getExamineDetail();
            } else {
              if (res.data.code === "00029") {
                Toast(res.data.message || "该营养方案已被审核完毕，无需重复操作");
              } else {
                Toast(res.data.message || "接口报错");
              }
            }
          }).catch(e => {
            console.log(e);
          });
        }).catch(() => {
        });
      },
      /**
       * 审核驳回
       * **/
      submitReject() {
        this.show = true;
      },
      /**
       * 审核驳回
       * **/
      confirmReject() {
        if (!this.failReason) {
          Toast("请输入驳回原因");
          return false;
        }
        this.$http.request({
          url: "/NNutritionVerifyController/verify",
          method: "post",
          body: {
            patiId: this.patiId,
            guid: this.examineDetail.lastVerifyGuid || "",
            advice: this.failReason,
            result: 13
          }
        }).then(res => {
          if (res.data.success) {
            this.show = false;
            this.failReason = "";
            Toast("已驳回");
            this.$router.push({
              path: "/examineList"
            });
            // this.state = 4;
            // this.getExamineDetail();
          } else {
            if (res.data.code === "00029") {
              Toast(res.data.message || "该营养方案已被驳回，无需重复操作");
            } else {
              Toast(res.data.message || "接口报错");
            }
          }
        });
      },
      /**
       * 查看营养方案详情 传参id(审核单id)
       * **/
      seeResults() {
        // 传入值固定为1  区分标题
        window.sessionStorage.setItem("terminal", 1);
        this.$router.push({
          path: "/results",
          query: {
            id: this.patiId,
            type: this.state ? this.state : this.examineState,
          }
        });
      }
    },
    created() {
      this.type = this.$route.query.type || "";
      this.patiId = this.$route.query.id || window.sessionStorage.getItem("id") || "";
      this.getExamineDetail();
    }
  };
</script>

<style>

  @media only screen and (device-width: 375px) and (device-height: 812px) and

  (-webkit-device-pixel-ratio: 3) {
    /*导航操作栏上移*/
    .examineDetail_page {
      /*height: calc(100% - 34px) !important;*/
    }
  }

</style>
<style scoped lang="less">
  .common-header {
    left: 0;
  }

  .examineDetail_page {
    display: flex;
    flex-direction: column;
    .padding(0, 12, 24, 12);

    .examineDetail_box {
      background-color: @fontColorff;
      .borderRadius(10, 10, 10, 10);
      .margin(50, 0, 0, 0);

      h4 {
        text-align: center;
        .fontSize(16);
        color: @fontColor33;
        .padding(15, 0, 15, 0);
        font-weight: bold;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      }

      .examine_desc {
        .padding(14, 10, 0, 10);
        .fontSize(16);

        li {
          .margin(0, 0, 15, 0);
          display: flex;

          .title_span {
            color: @fontColor66;
            .fontSize(16);
            .lineHeight(20);
          }

          .content_span {
            display: inline-block;
            color: @fontColor33;
            .fontSize(16);
            .lineHeight(20);
            flex: 1;
            width: 0;

            a {
              color: @fontColor33;
            }
          }
        }
      }

      .usage_method {
        .padding(0, 10, 0, 10);

        h4 {
          text-align: left;
          .fontSize(18);
          font-weight: bold;
          color: @fontColor33;
          .padding(0, 0, 14, 10);
          padding-left: 0 !important;
          border-bottom: 0;
        }

        .question_box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .margin(0, 0, 10, 0);
        }

        .question_content {
          .fontSize(16);
          font-weight: 400;
          color: @fontColor66;
          .margin(0, 0, 10, 0);
        }

        .result_detail {
          .padding(10, 0, 10, 0);
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            display: inline-block;
            width: 50%;
            color: @fontColor33;
            .fontSize(16);
          }

          .fail {
            color: rgba(220, 96, 22, 1);
          }

          .success {
            color: rgba(32, 184, 103, 1);
          }
        }
      }
    }

    .seeDetail {
      text-align: center;
      color: #0069FF;
      .fontSize(18);
      .padding(25, 0, 25, 0);
      text-decoration: underline;
    }

    .btn_box {
      display: flex;
      justify-content: center;
      align-items: center;
      .padding(22, 0, 0, 0);

      .btn {
        .width(165);
        .height(44);
        .lineHeight(44);
        text-align: center;
        .fontSize(18);
        font-weight: bold;
        .borderRadius(10, 10, 10, 10);
      }

      .resolve_btn {
        color: @fontColorff;
        background-color: #0069FF;
        .margin(0, 0, 0, 10);
      }

      .reject_btn {
        color: #0069FF;
        background-color: @backgroundColorff;
        .margin(0, 10, 0, 0);
        border: 1px solid #0069FF;
      }
    }


    .seeDetail_btn {
      .margin(20, 0, 15, 0);
      text-align: center;
      .height(44);
      .lineHeight(44);
      .borderRadius(10, 10, 10, 10);
      background-color: #0069FF;
      color: @fontColorff;
      .fontSize(18);
      font-weight: bold;
    }

    .zinenggui_desc {
      .borderRadius(10, 10, 10, 10);
      .padding(0, 0, 1, 0);
      background-color: @backgroundColorff;

      .pass_title {
        height: 45px;
        line-height: 45px;
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
        background-color: @fontColorff;
        margin: 0 auto;
        margin-left: 12px;
        border-top-left-radius: 2.7vw;
        border-top-right-radius: 2.7vw;

        .span_kong {
          float: left;
          width: 4px;
          height: 16px;
          background: linear-gradient(180deg, rgba(0, 105, 255, 1) 0%, rgba(1, 128, 255, 1) 100%);
          border-radius: 2px;
          margin-top: 14px;
          margin-right: 10px;
        }
      }

      li {
        .padding(0, 10, 0, 10);
        .margin(0, 0, 15, 0);
        display: flex;


        .title_span {
          color: @fontColor33;
          .fontSize(16);
          .lineHeight(20);
        }

        .content_span {
          display: inline-block;
          color: @fontColor66;
          .fontSize(16);
          .lineHeight(20);
          flex: 1;
          width: 0;
        }
      }
    }

    .reject_desc {
      .margin(15, 0, 0, 0);
      .borderRadius(10, 10, 10, 10);
      .padding(0, 0, 1, 0);
      background-color: @backgroundColorff;

      .pass_title {
        height: 45px;
        line-height: 45px;
        .fontSize(18);
        color: @fontColor33;
        font-weight: bold;
        background-color: @fontColorff;
        margin: 0 auto;
        margin-left: 12px;
        border-top-left-radius: 2.7vw;
        border-top-right-radius: 2.7vw;

        .span_kong {
          float: left;
          width: 4px;
          height: 16px;
          background: linear-gradient(180deg, rgba(0, 105, 255, 1) 0%, rgba(1, 128, 255, 1) 100%);
          border-radius: 2px;
          margin-top: 14px;
          margin-right: 10px;
        }
      }

      li {
        .padding(0, 10, 15, 10);
        .fontSize(16);
        .lineHeight(20);
        color: @fontColor33;
      }
    }

    .buyState {
      .margin(15, 0, 0, 0);

      .buyState_span {
        color: #0180FF !important;
      }

    }

    .main-end {
      color: @fontColor33;
      .fontSize(16);
      .margin(15, 0, 0, 0);

      .supplement {
        color: @fontColor66;
        .padding(0, 0, 10, 0);
        word-wrap: break-word;
        word-break: normal;
        .lineHeight(20);
      }
    }

  }


  /*弹窗pop样式*/
  /deep/ .van-popup {
    width: 80%;
    box-sizing: border-box;
    .padding(20, 0, 0, 0);
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;

    h3 {
      text-align: center;
    }

    .btns_box {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 100%;
      .height(44);

      .btn {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .cancel_btn {
      color: @fontColor33;
      background-color: @backgroundColorff;
    }

    .sure_btn {
      color: @fontColorff;
      background-color: @mainColor;
    }
  }
</style>

