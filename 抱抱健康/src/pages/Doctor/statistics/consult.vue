/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: consult * @function:
付费咨询记录 * @date: 2019/12/14 * @time: 14:35 * * */
<template>
  <div id="consult">
    <!-- 头部 -->
    <common-header
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :headerShow="'true'"
    ></common-header>

    <div class="main" v-if="objData.length > 0">
      <div
        class="list_box"
        v-for="(item, index) in objData"
        :key="index"
      >
        <div class="box_top">
          <div class="left">
            <img src="../../../assets/images/consult.png" alt="" />
            <span>
              图文咨询
            </span>
          </div>
          <div
            :class="
              item.state == 1 || item.state == 2 || item.state == 7
                ? 'right'
                : item.state == 4
                ? 'right_succeed'
                : item.state == 6
                ? 'right_cancel'
                : item.state == 0
                ? 'right_obligation'
                : 'right_refund'
            "
          >
            {{
            item.state == 1 || item.state == 2 || item.state == 7
            ? "未完成"
            : item.state == 4
            ? "已完成"
            : item.state == 6
            ? "已取消"
            : item.state == 0
            ? "待付款"
            : "已退款"
            }}
          </div>
        </div>
        <div class="box_bottom">
          <div class="left">
            <div class="left_top">
              <div class="name_box">
                {{ item.NAME }}
              </div>
              <div class="sex_box">
                {{ item.sex == 1 ? "男" : item.sex == 2 ? "女" : "" }}
              </div>
              <div class="age_box">{{ item.age?item.age+"岁":"" }}</div>
            </div>
            <div class="left_bottom">
              {{ item.paytime }}
            </div>
          </div>
          <div class="right">¥{{ item.tarrif | money }}</div>
        </div>
      </div>
    </div>
    <div class="box" v-else>
      <img src="../../../assets/images/unHistory.png" alt="" />
      <p>暂无付费咨询历史</p>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";

export default {
  name: "consult",
  components: {
    commonHeader
  },
  filters: {
    money(item) {
      item = item.toString();
      let num = 0;
      if (item.length == 2) {
        num = "0." + item;
      } else if (item.length < 2) {
        num = "0.0" + item;
      } else {
        num =
          item.substring(0, item.length - 2) +
          "." +
          item.substring(item.length - 2, item.length);
      }

      return num;
    }
  },
  data() {
    return {
      customTitle: "数据统计",
      title: "付费咨询记录",
      objData: [
        // {
        //   name: "111",
        //   state: "1",
        //   sex: "1",
        //   paytime: "2019",
        //   tarrif: "123"
        // }
      ] //数据
    };
  },
  created() {
    this.selectAll();
  },
  mounted() {},
  methods: {
    selectAll() {
      //查询记录
      this.$http
        .request({
          method: "get",
          url: "/RPayConsultController/selectAll",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            console.log(res.data.data);
            this.objData = res.data.data;
          } else {
            //失败
            this.$toast("查询失败");
          }
          console.log(res.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    goNext(id) {
      //跳转下一页(已作废)
      this.$router.push({ name: "submitAdvise", query: { payConsultId: id } });
    }
  }
};
</script>

<style lang="less" scoped>
#consult {
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  background: @backgroundColor;

  .main {
    &::-webkit-scrollbar {
      display: none !important;
      width: 0px;
      height: 0px;
    }

    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 44/375 * 100vw;
    bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
    overflow-y: auto;
    left: 12/375 * 100vw;
    right: 12/375 * 100vw;
    .padding(15, 0, 10, 0);

    .list_box {
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 15, 0);

      .box_top {
        .padding(11, 10, 11, 7);
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid @listBorderColor;

        .left {
          display: flex;

          img {
            .width(30);
            .height(30);
          }

          span {
            .lineHeight(30);
            .fontSize(16);
            font-weight: bold;
            .margin(0, 0, 0, 4);
          }
        }

        .right {
          .lineHeight(30);
          color: @fontRedColor;
        }

        .right_succeed {
          .lineHeight(30);
          color: @titleColor;
        }

        .right_cancel {
          .lineHeight(30);
          color: @qianSpan;
        }

        .right_obligation {
          .lineHeight(30);
          color: @font9FFColor;
        }

        .right_refund {
          .lineHeight(30);
          color: @fontColor00C;
        }
      }

      .box_bottom {
        display: flex;
        justify-content: space-between;
        .padding(15, 10, 15, 10);

        .left {
          .left_top {
            display: flex;

            div {
              .fontSize(16);
              .lineHeight(22);
              color: @titleColor;
              .margin(0, 0, 0, 20);

              &:first-child {
                .margin(0, 0, 0, 0);
              }
            }
          }

          .left_bottom {
            .padding(15, 0, 0, 0);
            color: @qianSpan;
            .fontSize(14);
          }
        }

        .right {
          display: flex;
          align-items: center;
          color: @fontRedColor;
          font-weight: bold;
        }
      }
    }
  }

  .box {
    .lineHeight(22);
    text-align: center;

    img {
      .width(205);
      .padding(112, 0, 0, 0);
    }

    p {
      .padding(24, 0, 0, 0);
      .fontSize(18);
      font-weight: bold;
      color: @titleColor;
    }
  }
}
</style>
