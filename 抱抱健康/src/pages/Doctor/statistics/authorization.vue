/* *
@Author: 张松仁 *
@Last Modified by: 张松仁 *
@name: authorization *
@function: 一键授权 *
@date: 2020/7/12 *
@time: 9:49 *
* */
<template>
  <div id="authorization">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="'true'"
    ></common-header>
    <div class="main">
      <div class="top">
        <div class="img-box">
          <img src="../../../assets/images/authorizationTopImg.png" alt="">
        </div>
        <div class="instructions">
          将关联数据使用授权给
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
        <van-button :class="checked?'':'un-but'" type="default" @click="onAuthorization">授权</van-button>
        <van-checkbox v-model="checked">我已阅读并同意 <span @click.stop="goNext">《数据使用授权书》</span></van-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";

  export default {
    name: "authorization",
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
        checked: true,
        name: "",
        phone: ""
      };
    },
    created() {
      //获取用户授权信息
      console.log(this.DoctorIM, "doc");

      this.selectAuto();
    },
    mounted() {
    },
    methods: {
      onAuthorization() {
        console.log("授权");
        if (!this.checked) {
          return;
        }
        this.$dialog.confirm({
          message: '确认申请人取得您授权，\n' +
            '可以使用相关数据，是否确认授权？',
        })
          .then(() => {
            // on confirm
            console.log("确认");
            this.$http
              .request({
                method: "get",
                url: "/RAssistantDoctorController/updateByBusinessIdAndDoctorId",
                body: {
                  id: this.DoctorIM.doctorMessage.data.docId
                }
              })
              .then(res => {
                console.log(res);
                if (res.data.success) {
                  //授权成功
                  this.$router.replace({
                    name: "hasAuthorization",
                  })
                } else {
                  this.$toast(res.data.message);
                }
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(() => {
            // on cancel
            console.log("取消")
          });
      },
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
  #authorization {
    .main {
      .padding(60, 12, 0, 12);

      .top {
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
        background-image: url("../../../assets/images/authorizationTopBg.png");
        background-repeat: no-repeat;
        background-size: 100%;
        background-color: @backgroundColorff;

        .img-box {
          .padding(40, 0, 0, 0);
          display: flex;
          justify-content: center;

          img {
            .width(60);
            .height(60);
          }
        }

        .instructions {
          .padding(11, 0, 58, 0);
          .lineHeight(26);
          color: @fontColorff;
          .fontSize(18);
          text-align: center;
        }

        .information {
          display: flex;
          .padding(0, 20, 0, 20);
          .margin(-26, 0, 0, 0);

          img {
            .width(52);
            .height(52);
            .borderRadius(26);
          }

          .right {
            .padding(0, 0, 0, 15);

            .right-top {
              .padding(1, 3, 0, 0);
              color: @fontColorff;
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
              color: @fontColor33;
            }
          }
        }

        .list {
          .padding(25, 20, 25, 20);

          ul {
            list-style-type: circle;

            li {
              .lineHeight(22);
              .fontSize(16);
              color: @fontColor66;
              .padding(0, 0, 9, 16);
              background-image: url("../../../assets/images/authorizationList.png");
              background-repeat: no-repeat;
              background-size: 6/375*100vw 6/375*100vw;
              background-position: left 8/375*100vw;

              &:last-child {
                padding-bottom: 0;
              }
            }
          }
        }
      }

      .foot {
        .padding(15, 0, 0, 0);

        button {
          background-color: @buttonColor;
          width: 100%;
          .lineHeight(44);
          .height(44);
          color: @fontColorff;
          .fontSize(18);
          .borderRadius(10, 10, 10, 10);

        }

        .un-but {
          background-color: @fontColor99;
        }

        .van-checkbox {
          .padding(12, 0, 0, 0);
          display: flex;
          align-items: center;

          /deep/ .van-checkbox__label {
            color: @fontColor66;

            span {
              color: @statisticBlueColor;
            }
          }
        }
      }
    }
  }
</style>
