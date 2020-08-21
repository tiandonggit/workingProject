/*
 * @Author: 田东&&许鹏(修改)
 * @Date: 2019-08-29 10:33:09
 * @Last Modified by: 许鹏
 * @Last Modified time: 2020-06-23 13:48:50
 * @name 首页
 */
<template>
  <div class="index_page">
    <common-header :share-disabled="true" :custom-title="'首页'"></common-header>
    <!-- <form action="/">
      <van-search
        v-model="searchText"
        placeholder="关键词"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>-->
    <div class="search-condition">
      <van-row>
        <van-col @click="timeCondition()" span="12">
          <div class="col-box">
            <div class="flex-box" :style="{backgroundImage: 'url(' + timeSrc + ')'}">
              <span class="title">时间</span>
              <!-- <img class="img" :src="timeSrc" alt /> -->
            </div>
          </div>
        </van-col>
        <van-col @click="stateCondition()" span="12">
          <div class="col-box">
            <div class="flex-box" :style="{backgroundImage: 'url(' + stateSrc + ')'}">
              <span class="title">状态</span>
              <!-- <img class="img" :src="stateSrc" alt /> -->
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
		<!--浮动小球-->
		<floatball></floatball>
<!--		<div class="ball">-->
<!--			发起补货-->
<!--		</div>-->
    <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
      <div class="card-box" v-for="(good, index) in goodList" :key="index">
        <div class="order-num">
          工单号：{{good.id}}
          <span>{{good.createtime}}</span>
        </div>
        <div class="circle-box" @click="detail(good.supplystatus, good.id ,good.deviceid, good.devicename,  good.actualgetquantity)">
          <div class="address">
            <div class="left">库房地址：</div>
            <div class="right">{{good.address}}</div>
          </div>
					<div class="information">
						<div class="left">智配柜信息：</div>
						<div class="center">{{good.devicename}}</div>
						<div class="right">{{good.devicecode}}</div>
					</div>
					<div class="information">
						<div class="left">智配柜地址：</div>
						<div class="add_right">{{good.fulladdress}}</div>
					</div>
					<div class="supplement">
						<div class="type">
							<div class="type_num">{{good.actualgetquantity ? good.actualgetquantity : 0}}件</div>
							<div>需补商品件数</div>
						</div>
						<div class="num">
							<div class="num_num">{{good.suppliedgoodsquantity ? good.suppliedgoodsquantity : 0}}件</div>
							<div>完成商品件数</div>
						</div>
						<div class="finishNum">
							<div class="finishNum_num">{{good.returngoodsquantity ? good.returngoodsquantity : 0}}件</div>
							<div>返还商品件数</div>
						</div>
					</div>
					<div>
<!--          <van-row>-->
<!--            <van-col span="12">-->
<!--              <van-circle-->
<!--                v-model="good.deviceRate"-->
<!--                :rate="good.deviceRate"-->
<!--                :color="gradientColor1"-->
<!--                layer-color="#f2f2f2"-->
<!--                :stroke-width="60"-->
<!--              >-->
<!--                <div class="circle-text" slot="default">-->
<!--                  <p>需补{{good.devicequantity}}件</p>-->
<!--                  <p-->
<!--                    class="text-color1"-->
<!--                  >完成{{good.supplieddevicequantity ? good.supplieddevicequantity : 0}}件</p>-->
<!--                </div>-->
<!--              </van-circle>-->
<!--              <p class="circle-name">智能柜</p>-->
<!--            </van-col>-->
<!--            <van-col span="12">-->
<!--              <van-circle-->
<!--                v-model="good.goodRate"-->
<!--                :rate="good.goodRate"-->
<!--                :color="gradientColor2"-->
<!--                layer-color="#f2f2f2"-->
<!--                :stroke-width="60"-->
<!--              >-->
<!--                <div class="circle-text" slot="default">-->
<!--                  <p>需补{{good.expectgetquantity}}件</p>-->
<!--                  <p-->
<!--                    class="text-color2"-->
<!--                  >完成{{good.suppliedgoodsquantity? good.suppliedgoodsquantity : 0}}件</p>-->
<!--                </div>-->
<!--              </van-circle>-->
<!--              <p class="circle-name">商品</p>-->
<!--            </van-col>-->
<!--          </van-row>-->
					</div>
        </div>
        <div class="progress-img">
          <img :src="good.stepImg" alt />
        </div>
        <div class="look-inventory" v-if="good.supplystatus !== 0">
          <a @click="lookInventory(good.supplystatus, good.id)">查看领货清单</a>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";
import commonHeader from "../../components/commonHeader/common_header";
import jiantoudefault from "@/assets/images/icon-jiantoudefault.png";
import jiantoushang from "@/assets/images/icon-jiantoushang.png";
import jiantouxia from "@/assets/images/icon-jiantouxia.png";
import step0 from "@/assets/images/step1.png";
import step1 from "@/assets/images/step2.png";
import step2 from "@/assets/images/step3.png";
import step3 from "@/assets/images/step4.png";
import floatball from "@/components/floatball.vue";

export default {
  name: "index",
  components: {
    floatball,
    commonHeader
  },
  data() {
    return {
      gradientColor1: {
        "0%": "#97F4C4",
        "100%": "#00BC5D"
      },
      gradientColor2: {
        "0%": "#7EB7FF",
        "100%": "#2E7CE9"
      },
      finishedText: "",
      loading: false,
      finished: false, // 上拉加载是否结束
      page: 1, // 查询第几页
      limit: 10, // 每页数据个数
      sort: "desc", // desc为倒叙  asc为正序
      yn: "1", // 1位日期排序，2为状态排序（默认日期排序）（进入首页为日期倒叙）
      id: "1", // 补货员id
      timeSrc: jiantoudefault,
      timeStatistics: 0, // 时间删选统计
      stateSrc: jiantoudefault,
      stateStatistics: 0, // 状态删选统计
      goodList: []
    };
  },

  created() {
    this.id = window.localStorage.getItem("memberId");
  },

  methods: {
    getGoodList() {
      this.$http
        .request({
          method: "get",
          url: "/RSupplyController/selectSupply",
          body: {
            page: this.page,
            limit: this.limit,
            sort: this.sort,
            yn: this.yn,
            id: this.id
          }
        })
        .then(res => {
          this.loading = false;
          let data = res.data;
          if (data.success) {
            data.data.forEach((v, e) => {
              v.supplystatus === 0 && (v.stepImg = step0);
              v.supplystatus === 1 && (v.stepImg = step1);
              v.supplystatus === 2 && (v.stepImg = step2);
              (v.supplystatus === 3 || v.supplystatus === 4) &&
                (v.stepImg = step3);
              v.deviceRate =
                (v.supplieddevicequantity / v.devicequantity) * 100;
              v.goodRate =
                (v.suppliedgoodsquantity / v.expectgetquantity) * 100;
              this.goodList.push(v);
            });
            console.log(this.goodList);
            this.page > 1 && (this.finishedText = "没有更多了");
            this.page++;
            if (data.data.length == this.limit) {
              this.finished = false;
            } else {
              this.finished = true;
            }
          } else {
            this.loading = false;
            this.finished = true;
            Toast(data.message);
          }
        })
        .catch(error => {
          this.loading = false;
          this.finished = true;
          Toast({
            message: "无法连接服务",
            position: "bottom"
          });
          console.log("错误为" + error);
        });
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.getGoodList();
      }, 500);
    },
    // 时间排序
    timeCondition() {
      this.yn = 1;
      this.page = 1;
      this.goodList = [];
      this.stateSrc = jiantoudefault; // 重置状态默认排序
      if (this.timeStatistics === 0 || this.timeStatistics === 2) {
        this.sort = "desc"; //desc为倒叙  asc为正序
        this.timeStatistics = 1;
        this.timeSrc = jiantouxia;
      } else if (this.timeStatistics === 1) {
        this.sort = "asc";
        this.timeStatistics = 2;
        this.timeSrc = jiantoushang;
      }
      this.getGoodList();
    },
    // 状态排序
    stateCondition() {
      this.yn = 2;
      this.page = 1;
      this.goodList = [];
      this.timeSrc = jiantoudefault; // 重置时间默认排序
      if (this.stateStatistics === 0 || this.stateStatistics === 2) {
        this.sort = "desc";
        this.stateStatistics = 1;
        this.stateSrc = jiantouxia;
      } else if (this.stateStatistics === 1) {
        this.sort = "asc";
        this.stateStatistics = 2;
        this.stateSrc = jiantoushang;
      }
      this.getGoodList();
    },
    // 查看详情
    detail(type,id,machineId,devicename,exceptsupplyquantity) {
      let device={
        id:id,
        devicename:devicename,
        exceptsupplyquantity:exceptsupplyquantity
      }
      window.localStorage.setItem("orderId", id);
      type === 0 && this.$router.push({ name: "getGoods", query: { id: id } });
      (type === 2 || type === 1) &&
        // this.$router.push({ name: "supplyGoods", query: { id: id } });
      this.machineSupplyGoods(
        device.id,
        device.devicename,
        device.exceptsupplyquantity
      )
      type === 3 &&
        this.$router.push({ name: "returnGoods", query: { id: id } });
      type === 4 && console.log("已完成还货的订单");
      
    },
    lookInventory(supplystatus, id) {
      supplystatus !== 0 &&
        this.$router.push({ name: "getGoodsInventory", query: { id: id } });
    },

    machineSupplyGoods(
      machineId,
      devicename,
      exceptsupplyquantity,
    ) {
      let param = {
        id: machineId,
        devicename: devicename,
        exceptsupplyquantity: exceptsupplyquantity
      };
      this.$router.push({
        name: "machineSupplyGoods",
        query: { params: JSON.stringify(param) }
      });
    }
  }
};
</script>

<style scoped lang="less">
.index_page {
  background: @bgColorF2;
  min-height: 100%;

  .search-condition {
    background: @bgColorF;
    padding: 12px 53px;
    left: 0;
    right: 0;
    top: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: fixed;
    z-index: 999;

    .van-row {
      width: 100%;
    }

    .van-col {
      text-align: center;
    }

    .col-box {
      width: 81px;
      height: 30px;
      background: @bgColorF2;
      border-radius: 15px;
      margin: 0 auto;
      padding: 7px 19px;

      .flex-box {
        margin: 0 auto;
        height: 16px;
        text-align: left;
        // background: url(../../assets/images/icon-jiantoudefault.png);
        background-position: center right;
        background-repeat: no-repeat;
        background-size: 9px;
      }

      .title {
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        color: @titleColor;
        line-height: 16px;
        margin-right: 6px;
      }

      .img {
        width: 9px;
        line-height: 30px;
        vertical-align: middle;
        margin-top: -1.8px;
      }
    }
  }
	/*.ball{*/
	/*	width:72px;*/
	/*	height:72px;*/
	/*	background:#E98C2E;*/
	/*	box-shadow:0px 2px 4px 0px rgba(0,0,0,0.2);*/
	/*	border-radius:36px;*/
	/*	position: fixed;*/
	/*	bottom: 181px;*/
	/*	right: 12px;*/
	/*	font-size:16px;*/
	/*	font-weight:bold;*/
	/*	color:#fff;*/
	/*	line-height:24px;*/
	/*	text-align: center;*/
	/*	padding: 14px 18px;*/
	/*}*/
  .van-list {
    padding: 54px 0 1px;
  }

  .card-box {
    border-radius: 10px;
    overflow: hidden;
    background: @bgColorF;
    padding: 12px 0 0;
    margin-top: 12px;

    .order-num {
      font-size: 14px;
      font-family: PingFangSC;
      font-weight: 400;
      color: @titleColor;
      line-height: 20px;
      padding: 0 12px;

      span {
        float: right;
        font-size: 12px;
        font-family: PingFangSC;
        font-weight: 400;
        color: @descriptionColor;
        line-height: 20px;
      }
    }

    .circle-box {
      padding: 12px 0;

      .address {
        padding: 12px;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        color: @titleColor;
        line-height: 22px;
        border-top: 1px solid @borderColor;
        display: flex;

        .left {
          width: 73px;
					color: #666;
        }

        .right {
          flex: 1;
        }
      }
			
			.information{
				padding: 12px;
				font-size: 14px;
				font-family: PingFangSC;
				font-weight: 400;
				color: @titleColor;
				line-height: 22px;
				display: flex;
				padding-top: 0px;
				.left {
					width: 86px;
					color: #666;
				}
				
				.center{
					width: 140px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				
				.right {
					flex: 1;
					text-align: right;
				}
				
				.add_right{
					flex: 1;
				}
			}
			.supplement{
				width:327px;
				height:78px;
				background:#EFEFEF;
				border-radius:10px;
				margin-left: 12px;
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color:#666;
				text-align: center;
				padding: 12px;
				.type{
					.type_num{
						font-size: 16px;
						color:#00C36C;
						font-weight:bold;
						line-height: 26px;
						margin-bottom: 12px;
					}
				}
				.num{
					.num_num{
						font-size: 16px;
						color:#2E7BEC;
						font-weight:bold;
						line-height: 26px;
						margin-bottom: 12px;
					}
				}
				.finishNum{
					.finishNum_num{
						font-size: 16px;
						color:#E98C2E;
						font-weight:bold;
						line-height: 26px;
						margin-bottom: 12px;
					}
				}
			}
			
      .van-col {
        text-align: center;
      }

      .van-circle {
        width: 100px !important;
        height: 100px !important;
      }

      .circle-text {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        p {
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          color: @titleColor;
          line-height: 20px;
        }

        .text-color1 {
          color: @circleTextColor1;
        }

        .text-color2 {
          color: @circleTextColor2;
        }
      }

      .circle-name {
        font-size: 14px;
        margin-top: 6px;
        font-family: PingFangSC;
        font-weight: 400;
        color: @titleColor;
        line-height: 20px;
      }
    }

    .progress-img {
      padding: 12px;
      border-top: 1px solid @borderColor;

      img {
        display: block;
        width: 100%;
      }
    }

    .look-inventory {
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-top: 1px solid @borderColor;

      a {
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        color: @mainColor;
        line-height: 20px;
        text-decoration: underline;
      }
    }
  }
}
</style>
