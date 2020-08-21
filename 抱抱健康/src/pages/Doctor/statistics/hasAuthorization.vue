/* *
@Author: 张松仁 *
@Last Modified by: 张松仁 *
@name: hasAuthorization *
@function: 已授权 *
@date: 2020/7/12 *
@time: 16:27 *
* */
<template>
  <div id="hasAuthorization">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="'true'"
    ></common-header>
    <div class="main">
      <div class="top">

        <div class="instructions">
          关联数据使用权：
        </div>
        <div class="information">
          <img src="../../../assets/images/authorization.png" alt="">
          <div class="right">
            <div class="right-top">
              <span class="name">
                {{ name }}
              </span>
              <span class="hint">
                授权申请人
              </span>
            </div>
            <div class="right-bot">
              {{ phone }}
            </div>
          </div>
          <div class="btn">
            已授权
          </div>
        </div>
        <div class="auth-time">
          授权时间：{{ time }}
        </div>
        <div class="list">
          <ul>
            <li>授权范围系因使用抱抱健康公众号等工具产生的数据</li>
            <li>被授权人将对授权数据进行筛选、归纳、整理等统计行为</li>
            <li>被授权人将就使用数据而支付数据使用权转让费用</li>
          </ul>
        </div>
      </div>
      <div class="foot">
        <div class="determine">已阅读并同意 <span @click.stop="goNext">《数据使用授权书》</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
import {mapState} from "vuex";

  export default {
    name: "hasAuthorization",
    computed: {
      ...mapState(["DoctorIM"])
    },
    components: {
      commonHeader
    },
    data() {
      return {
        customTitle: "数据统计",
        title: "一键授权",
        name: "",
        phone: "",
        time: ""
      };
    },
    created() {
      this.selectAuto();
    },
    mounted() {
    },
    methods: {
      goNext() {
        this.$router.push({
          name: "agreement",
          params: {
            type: "7"
          }
        });
        console.log("点击了协议")
      },
      selectAuto() {
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
              this.name = res.data.data.businessname;
              this.phone = res.data.data.businessphone;
              this.time = res.data.data.authorizationtime;
            } else {
              this.$toast(res.data.message);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  }
</script>

<style lang="less" scoped>
  #hasAuthorization {
    .main {
      .padding(60, 12, 0, 12);

      .top {
        .padding(15, 10, 12, 10);
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
        background-color: @backgroundColorff;

        .instructions {
          .lineHeight(26);
          color: @fontColor33;
          .fontSize(18);
          text-align: left;
          font-weight: 400;
        }

        .information {
          display: flex;
          align-items: center;
          .padding(25, 0, 0, 0);

          img {
            .width(52);
            .height(52);
            .borderRadius(26);
          }

          .right {
            flex: 1;
            .padding(0, 0, 0, 15);

            .right-top {
              .padding(1, 3, 0, 0);
              color: @fontColor33;
              .lineHeight(26);

              .name {
                font-weight: bold;
                .fontSize(18);
              }

              .hint {
                .padding(0, 0, 0, 9);
                .fontSize(16);
              }
            }

            .right-bot {
              .lineHeight(22);
              .fontSize(16);
              color: @fontColor66;
            }
          }

          .btn {
            background-color: @buttonColor;
            .padding(6, 10, 6, 10);
            .borderRadius(6, 6, 6, 6);
            .lineHeight(22);
            .fontSize(16);
            color: @fontColorff;
          }
        }

        .auth-time {
          .padding(22, 0, 11, 0);
          .lineHeight(22);
          .fontSize(16);
          color: @fontColor66;
          border-bottom: 1px solid @borderColor;
        }

        .list {
          .padding(12, 0, 12, 0);

          ul {
            list-style-type: circle;

            li {
              .lineHeight(22);
              .fontSize(16);
              color: @fontColor66;
              .padding(0, 0, 9, 0);

              &:last-child {
                padding-bottom: 0;
              }
            }
          }
        }
      }

      .foot {
        .determine {
          .fontSize(16);
          .padding(12, 0, 0, 0);
          color: @fontColor66;

          span {
            color: @statisticBlueColor;
          }

        }
      }
    }
  }
</style>
