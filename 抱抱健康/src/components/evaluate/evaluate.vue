/* *
@Author: 张松仁 *
@Last Modified by: 张松仁 *
@name: evaluate *
@function:  *
@date: 2020/5/19 *
@time: 15:18 *
* */
<template>
  <div id="evaluate">
    <div class="main">
      <div class="main_box" v-if="obj.status == 0">
        <div class="title"
             :style="dataObj.status == 0?'text-align:left;color:#02A7F0':dataObj.status < 3?'color:#FF3000':dataObj.status == 3?'color:#00CB5F':'color:#0069FF'">
          {{dataObj.status == 0?"当前咨询的客服服务已结束，请点击星星对服务进行评价":dataObj.status == 1?"非常不满意":dataObj.status ==
          2?"不满意":dataObj.status == 3?"一般":dataObj.status ==
          4?"满意":"非常满意"}}
        </div>
        <div class="eva_box">
          <van-rate size="24px" color="#FFAE00" void-icon="star" v-model="dataObj.status" @change="onChange"/>
        </div>
        <div class="sub">
          <van-button v-if="dataObj.status > 0" type="default" @click="onSubmit">确认提交</van-button>
        </div>
      </div>
      <div class="main_box_bott" v-else>
        <div class="title">
          我的评价 <span :style="'color:'+(obj.status < 3)?'color:#FF3000':obj.status == 3?'color:#00CB5F':'color:#0069FF'">：{{obj.status == 1?"非常不满意":obj.status == 2?"不满意":obj.status == 3?"一般":obj.status == 4?"满意":"非常满意"}}</span>
        </div>
        <div class="eva_box">
          <van-rate size="24px" readonly color="#FFAE00" void-icon="star" v-model="obj.status"/>
        </div>
        <div class="sub">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "evaluate",
    props: {
      obj: Object,
      mark: Number
    },
    data() {
      return {
        dataObj: {
          evaluationId: 0,
          status: 0
        }
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      onChange(value) {
        console.log('当前值：' + value);
        this.$emit("change", value);
      },
      onSubmit() {
        this.dataObj.evaluationId = this.obj.evaluationId;
        this.dataObj.mark = this.mark;
        console.log(this.dataObj);
        console.log(this.obj);
        this.$emit("submit", this.dataObj);
      }
    },
    watch: {}
  }
</script>

<style lang="less" scoped>
  #evaluate {
    .main {
      .padding(10, 30, 10, 30);

      .main_box {
        background: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;

        .title {
          .lineHeight(20);
          .padding(18, 15, 18, 15);
          word-wrap: break-word;
          word-break: normal;
          white-space: normal;
          .fontSize(16);
        }

        .eva_box {
          /deep/ .van-rate {
            .van-rate__item:not(:last-child) {
              .padding(0, 25, 0, 0);
            }
          }
        }

        .sub {
          .padding(25, 0, 0, 0);

          button {
            width: 100%;
            .height(46);
            .lineHeight(46);
            color: @fontOne;
            .fontSize(16);
            background: linear-gradient(228deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
            .borderRadius(0, 0, 10, 10);
          }

        }
      }

      .main_box_bott {
        .title {
          .lineHeight(56);
          .fontSize(16);
        }

        .eva_box {
          /deep/ .van-rate {
            .van-rate__item:not(:last-child) {
              .padding(0, 25, 0, 0);
            }
          }
        }

        .sub {
          .padding(25, 0, 0, 0);
          border-bottom: 2px solid #000000;
          opacity: .1;
        }
      }
    }
  }
</style>
