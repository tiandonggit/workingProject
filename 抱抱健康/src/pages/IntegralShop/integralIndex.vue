<!--
  作者:马林
  用途:
  -------------------
  Created by webStorm
  User: tyx
  Date: 2020/1/2 0002
  Time: 9:19
  Application: integralIndex
  State: page
-->
<template>
  <div class="integralIndex">
    <div class="v-title">
      <commonHeader
        :share-disabled="true"
        :custom-title="customTitle"
        :header-show="true"
        :title="title"
      ></commonHeader>
    </div>
    <div class="v-body">
      <div class="v-top">
        <div class="v-card">
          <div class="v-main">
            <div class="v-number">
              <div class="v-num">
                <span>{{ pointTotal > 9999 ? "9999+" : pointTotal }}</span>
                {{ type == 0 ? "健康" : "智" }}币
                <van-icon
                  @click="
                    $router.push({
                      name: 'integralIntegralExplain',
                      query: { type: type }
                    })
                  "
                  name="info"
                ></van-icon>
              </div>
              <div
                @click="
                  $router.push({
                    name: 'integralIntegralDetail',
                    query: { type: type }
                  })
                "
                class="v-text"
              >
                <div class="v-textMain">
                  {{ type == 0 ? "健康" : "智" }}币明细
                </div>
              </div>
            </div>
            <div class="v-goList">
              <div
                @click="
                  $router.push({
                    name: 'integralOrderList',
                    query: { type: type }
                  })
                "
                class="v-text"
              >
                兑换记录
              </div>
              <i class="van-icon van-icon-arrow van-cell__right-icon"
                ><!----></i
              >
            </div>
          </div>
        </div>
      </div>
      <div class="v-listMain">
        <div class="v-listTitle">赚{{ type == 0 ? "健康" : "智" }}币</div>
        <div class="v-listRest">
          <div @click="openUrl" class="v-iconMain">
            <div class="v-img">
              <img
                v-if="type == 0"
                src="../../assets/images/integraOpenBox.png"
                alt=""
              />
              <img
                v-if="type == 1"
                src="../../assets/images/integraSealBox.png"
                alt=""
              />
            </div>
            <div class="v-text">{{ type == 0 ? "完成任务" : "营养筛查" }}</div>
          </div>
          <div
            @click="
              $router.push({
                name: type == 0 ? 'patientMessageComplete' : 'docCard',
                query: {}
              })
            "
            class="v-iconMain"
          >
            <div class="v-img">
              <img src="../../assets/images/integraBag.png" alt="" />
            </div>
            <div class="v-text">完善信息</div>
          </div>
          <div
            @click="
              $router.push({
                name: type == 0 ? 'articlesSearch' : 'docArticlesSearchWater',
                query: {}
              })
            "
            class="v-iconMain"
          >
            <div class="v-img">
              <img src="../../assets/images/integraReadBook.png" alt="" />
            </div>
            <div class="v-text">阅读文章</div>
          </div>
        </div>
      </div>
      <div class="v-listMain">
        <div class="v-listTitle">
          换商品
        </div>
        <div class="v-listMove">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getList"
          >
            <div class="v-listLoad">
              <div
                @click="
                  $router.push({
                    name: 'integralProductDetail',
                    query: { id: item.id, type: type }
                  })
                "
                v-for="(item, index) in list"
                :key="index"
                class="v-product"
              >
                <div class="v-img"><img :src="item.productimg" alt="" /></div>
                <div class="v-name">{{ item.saletitle }}</div>
                <div class="v-total">
                  <span>{{ item.points }}</span
                  >{{ type == 0 ? "健康" : "智" }}币
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../components/commonHeader/common_header";
import { serviceHost } from "../../utils/httpConfig";

import { Toast } from "vant";
export default {
  name: "integralIndex",
  data() {
    return {
      customTitle: "礼品商城",
      title: "商城首页",
      pointTotal: "--",
      type: this.$route.query.type ? this.$route.query.type : 0, //身份:0患者 1医生
      page: 0, //当前是第几页
      limit: 10, //每页显示多少条数据
      loading: false, //列表是否加载中
      finished: false, //数据整体是否加载完毕
      list: [
        /*{
          id: 1,
          productname: "舒脑欣滴丸",
          saletitle: "舒脑欣滴丸天津中新药厂制作缓解头痛嗷嗷灵验了",
          points: "20",
          productimg:
            "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1022776950,3969976370&fm=26&gp=0.jpg"
        }*/
      ] //商品列表
    };
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.getPoints();
      this.$store.commit("Address/addressData", {
        id: "",
        status: 1,
        name: "",
        phone: "",
        address: "",
        pointnum: ""
      });
    },
    /**
     * 获取列表信息(测试)
     */
    getListTest() {
      console.log("加载");
      // 异步更新数据
      setTimeout(() => {
        this.list.push({
          id: 3,
          name: "舒脑欣滴丸天津中新药厂制作缓解头痛等相关症状",
          total: "1000",
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
    openUrl() {
      if (this.type == 0) {
        this.$router.push({
          name: "patientTask",
          query: { type: this.type }
        });
      } else {
        //window.location.href = globalServiceHost.nutritionUrl + "selectDoctor";
        window.location.href = serviceHost + "wechat/getAuthorizeUrl?menuId=7011";
      }
    },
    getList() {
      this.page++;
      this.$http
        .request({
          method: "get",
          url: "/ProductManagerController/selectPageModel",
          body: {
            page: this.page,
            limit: this.limit
          }
        })
        .then(res => {
          if (res.data.success) {
            this.list = this.list.concat(res.data.data);
            // 加载状态结束
            this.loading = false;
            console.log(this.list);
            console.log(this.list.length, res.data.total);

            if (this.list.length == res.data.total) {
              this.finished = true;
            }
          } else {
            Toast("查询用户积分数失败");
          }
        })
        .catch(error => {
          Toast(error);
        });
    },
    /**
     * 获取用户积分
     */
    getPoints() {
      this.$http
        .request({
          method: "post",
          url: "/RUserController/getPoints",
          body: {}
        })
        .then(res => {
          if (res.data.success) {
            this.pointTotal = res.data.data;
            if (!res.data.data) {
              this.pointTotal = 0;
            }
            console.log(this.pointTotal);
            window.sessionStorage.setItem("userPoint", res.data.data);
          } else {
            Toast("查询用户积分数失败");
          }
        })
        .catch(error => {
          Toast(error);
        });
    }
  },
  components: {
    commonHeader
  }
};
</script>

<style lang="less" scoped>
.integralIndex {
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
    .height(44);
    background-color: @cardColor !important;
    /deep/ .header {
      background-color: @cardColor !important;
    }
  }
  .v-body {
    &::-webkit-scrollbar {
      display: none !important;
      width: 0;
      height: 0;
    }
    -webkit-overflow-scrolling: touch;
    flex: 1;
    overflow: auto;
    .v-top {
      background-color: @cardColor;
      .padding(24, 10, 24, 10);
      .v-card {
        .width(351);
        .height(149);
        background-image: url("../../assets/images/integraCard.png");
        background-size: 100% 100%;
        .v-main {
          .padding(34, 32, 36, 37);
          .v-number {
            display: flex;
            justify-content: space-between;
            .v-num {
              .fontSize(20);
              position: relative;
              span {
                .fontSize(30);
                color: @mainColor;
              }
              /deep/ .van-icon-info {
                .fontSize(14);
                color: @mainColor;
                position: absolute;
                top: 0;
                right: -(17 / 375) * 100vw;
              }
            }
            .v-text {
              display: flex;
              align-items: flex-end;
            }
          }
          .v-goList {
            margin-top: (10 / 375) * 100vw;
            .fontSize(16);
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .v-listMain {
      .padding(20, 5, 0, 5);
      .v-listTitle {
        font-weight: bold;
        .fontSize(20);
        .padding(0, 7, 0, 7);
      }
      .v-listRest {
        .padding(15, 30, 0, 30);
        display: flex;
        justify-content: space-between;
        .v-iconMain {
          .v-img {
            .width(60);
            .height(60);
            img {
              width: 100%;
              height: 100%;
            }
          }
          .v-text {
            .margin(7, 0, 0, 0);
            font-weight: 400;
          }
        }
      }
      .v-listMove {
        .v-listLoad {
          display: flex;
          flex-wrap: wrap;
          .v-product {
            .width(170);
            .height(273);
            .margin(15, 6, 0, 6);
            .borderRadius(10, 10, 10, 10);
            overflow: hidden;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .v-img {
              .width(170);
              .height(170);
              img {
                width: 100%;
                height: 100%;
              }
            }
            .v-name {
              margin: auto (10 / 375) * 100vw;
              .lineHeight(20);
              font-weight: bold;
              .overflowline(2);
            }
            .v-total {
              .margin(0, 10, 15, 10);
              .fontSize(14);
              color: @redOne;
              .overflowline(1);
              span {
                .fontSize(18);
              }
            }
          }
        }
      }
    }
  }
  /deep/ .van-loading {
    position: static;
  }
}
</style>
