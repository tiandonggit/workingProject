<!--
  作者:马林
  用途:
  -------------------
  Created by webStorm
  User: tyx
  Date: 2020/1/2 0002
  Time: 9:24
  Application: integralOrderList
  State: page
-->
<template>
  <div class="integralOrderList">
    <div class="v-title">
      <div class="v-pageTitle">
        <commonHeader
          :share-disabled="true"
          :custom-title="customTitle"
          :header-show="true"
          :title="title"
        ></commonHeader>
      </div>
      <div class="v-tabTitle">
        <van-tabs v-model="tabActive">
          <van-tab
            :title="item.title"
            v-for="(item, index) in tabList"
            :key="index"
          >
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="v-body">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="!noList ? '没有更多了' : ''"
        safe-area-inset-bottom
        :immediate-check="false"
        @load="getList"
      >
        <div v-show="list.length > 0" class="v-list">
          <div
            @click="
              $router.push({
                name: 'integralOrderDetail',
                query: { orderId: item.id, type: type }
              })
            "
            v-for="(item, index) in list"
            :key="index"
            class="v-product"
          >
            <div class="v-img">
              <img :src="item.imgicon" alt="" />
            </div>
            <div class="v-main">
              <div class="v-name">
                {{ item.saletitle }}
              </div>
              <div class="v-number">
                <div class="v-total">
                  <span>{{ item.pricepoint }}</span
                  >{{ type == 0 ? "健康" : "智" }}币
                </div>
                <div class="v-num">x{{ item.num }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <div v-show="noList" class="v-noProduct">
        <div class="v-productImg">
          <img src="../../assets/images/integralNoProduct.png" alt="" />
        </div>
        <div class="v-productTitle">暂无订单</div>
        <div class="v-productText">您暂时还没有兑换任何商品哟！</div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import { Toast } from "vant";
export default {
  name: "integralOrderList",
  data() {
    return {
      customTitle: "礼品商城",
      title: "兑换记录",
      tabList: [{ title: "待发货" }, { title: "已发货" }], //选项卡列表
      tabActive: 0,
      type: this.$route.query.type ? this.$route.query.type : 0, //身份:0患者 1医生
      list: [], //列表
      noList: false,
      page: 0, //当前是第几页
      limit: 10, //每页显示多少条数据
      loading: false, //列表是否加载中
      finished: false //数据整体是否加载完毕
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**
     * 测试加载
     */
    getListTest() {
      console.log("加载" + this.list.length);
      // 异步更新数据
      setTimeout(() => {
        this.list.push({
          id: 3,
          name: "舒脑欣滴丸天津中新药厂制作缓解头痛等相关症状",
          total: "1000",
          num: 11,
          img:
            "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1226102349,2613178901&fm=15&gp=0.jpg"
        });

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 10) {
          this.finished = true;
        }
      }, 500);
    },
    /**
     * 获取订单列表
     */
    getList() {
      this.page++;
      this.$http
        .request({
          method: "get",
          url: "/OrderManagerController/selectPageModel",
          body: {
            page: this.page,
            limit: this.limit,
            status: this.tabActive
          }
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.data.length > 0) {
              this.list = this.list.concat(res.data.data);
              // 加载状态结束
              this.loading = false;
              if (this.list.length == res.data.total) {
                this.finished = true;
              }
            } else {
              this.loading = false;
              this.finished = true;
              this.noList = true;
            }
          } else {
            Toast("获取积分列表繁忙");
          }
        })
        .catch(error => {
          Toast(error);
        });
    }
  },
  watch: {
    tabActive(val, valOld) {
      console.log(val, valOld);
      this.list = [];
      this.page = 0;
      this.noList = false;
      this.getList();
    }
  },
  components: {
    commonHeader
  }
};
</script>

<style lang="less" scoped>
.integralOrderList {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .fontSize(16);
  color: @titleColor;
  background-color: @backgroundColor;

  .v-title {
    width: 100%;
    /*border-bottom: 1px solid red;*/

    .v-pageTitle {
      .height(44);
    }

    .v-tabTitle {
      .height(46);

      /deep/ .van-tabs {
        .width(351);
        .height(46);
        .margin(0, 12, 0, 12);
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
        .van-tabs__wrap {
          .height(46);
          .borderRadius(10, 10, 10, 10);
        }
        .van-tab {
          .fontSize(18);
          .lineHeight(46);
        }

        .van-tab--active {
          span {
            font-weight: bold;
          }
        }
        .van-tabs__line {
          width: (54 / 375) * 100vw !important;
          .height(2);
          background-color: @mainColor;
        }
      }

      /deep/ .van-tabs--line {
        padding-top: 0;
      }
    }
  }

  .v-body {
    flex: 1;
    overflow: auto;
    padding-bottom: env(safe-area-inset-bottom);
    &::-webkit-scrollbar {
      display: none !important;
      width: 0px;
      height: 0px;
    }
    -webkit-overflow-scrolling: touch;
    .v-list {
      .padding(15, 12, 0, 12);

      .v-product {
        .margin(0, 0, 15, 0);
        background-color: #fff;
        .borderRadius(10, 10, 10, 10);
        display: flex;
        .padding(15, 10, 15, 10);

        .v-img {
          .width(78);
          .height(78);
          .borderRadius(10, 10, 10, 10);
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        &:last-child {
          margin: 0;
        }

        .v-main {
          .margin(0, 0, 0, 10);
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .v-name {
            .width(238);
            font-weight: bold;
            .overflowline(2);
            .lineHeight(20);
          }

          .v-number {
            display: flex;
            justify-content: space-between;

            .v-total {
              .fontSize(14);
              color: @redOne;

              span {
                .fontSize(18);
              }
            }

            .v-num {
              font-weight: 400;
              .lineHeight(18);
            }
          }
        }
      }
    }

    .v-noProduct {
      text-align: center;

      .v-productImg {
        width: 200px;
        height: 200px;
        margin: (50 / 375) * 100vw auto (30 / 375) * 100vw auto;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .v-productTitle {
        .margin(30, 0, 0, 0);
        .fontSize(18);
        font-weight: bold;
      }

      .v-productText {
        .margin(11, 0, 0, 0);
        color: @qianSpan;
      }
    }
    /deep/ .van-loading {
      position: static;
    }
  }
}
</style>
