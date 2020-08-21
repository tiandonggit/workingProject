/* *
@Author: 张松仁 *
@Last Modified by: 张松仁 *
@name: introduceSearch *
@function: 疾康知介搜索页 *
@date: 2020/7/8 *
@time: 10:20 *
* */
<template>
  <div id="introduceSearch">
    <common-header
      :share-disabled="true"
      :custom-title="titleName"
    ></common-header>
    <div class="search_box clearfix">
      <div class="header-div header-left" @click="headerBack()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
        placeholder="输入疾病名称搜索"
        @search="onSearch"
        v-model="searchName"
      >
      </van-search>
    </div>
    <div class="main">
      <div class="main_list">
        <div class="list">
          <div v-if="listShow" class="noResult">
            <img src="../../assets/images/no_articles.png" alt=""/>
            <p class="top">暂未找到您的搜索内容</p>
            <p class="again">
              请尝试输入其他关键词搜索
            </p>
          </div>
          <!--          <div v-if="listShow" class="list_no">-->
          <!--            <img src="../../assets/images/no_articles.png" alt="">-->
          <!--          </div>-->
          <div class="history" v-show="historyShow">
            <div class="history_title">
              历史搜索
            </div>
            <div class="history_list" v-if="History.historyData.length != 0">
              <div class="box" v-for="(item, index) in History.historyData"
                   v-if="item.date+3600*24*7*1000 >= Date.parse(new Date())" :key="index" @click="onSet(item.value)">
                {{item.value}}
              </div>
            </div>
            <div class="history_list centent" v-else>
              暂时没有历史搜索记录
            </div>
          </div>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            v-if="list.length != 0"
          >
            <div class="list_all">
              <div class="list_box" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
                <img v-lazy="item.coverpictureurl" alt="">
                <div class="list_box_title">
                  {{item.illnesstitle}}
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
  import {mapState} from "vuex";

  export default {
    name: "introduceSearch",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["History"]),
      ...mapState(["PatientIM"])
    },
    data() {
      return {
        titleName: "疾康知介",
        searchName: "",
        list: [],
        status: 1,
        loading: false,
        finished: false,
        limit: 20,
        page: 1,
        historyShow: true,
        listShow: false
      };
    },
    created() {
      console.log(new Date());
      //设置是医生还是患者
      if (this.PatientIM.patientMessage == {}) {
        //医生
        this.status = 1;
      } else {
        //患者
        this.status = 0;
      }
      if (this.History.historyData[0].date + 3600 * 24 * 7 * 1000 < Date.parse(new Date())) {
        this.History.historyData = [];
      }
    },
    mounted() {
    },
    methods: {
      onSet(value) {
        this.searchName = value;
        this.onSearch();
      },
      goDetail(item) {
        this.$router.push({
          name: "introduceDetail",
          query: {
            id: item.id
          }
        })
        console.log(item);
      },
      onSearch() {
        this.listShow = false;
        console.log(this.searchName)

        if (this.searchName == "") {
          this.page = 1;
          this.list = [];
          this.historyShow = true;
          // this.$toast("请输入疾病名称进行搜索");
          return;
        }

        // console.log(value);
        //将搜索值放入数组
        let str = this.searchName.replace(/\s+/g, "");
        if (str != "") {
          this.History.historyData.unshift({value: str, date: Date.parse(new Date())})
        }
        //判断数组中有值重复的么,有则去除
        let num = "";
        let value = this.History.historyData.filter((element, index, self) => {
          if (num === "") {
            if (element.value == str) {
              num = index;
              return true
            }
          } else {
            if (element.value == str) {
              return false
            }
          }

          return true;
        })
        //判断 value 的长度不能超过10
        if (value.length > 10) {
          value = value.slice(0, 10);
        }
        this.History.historyData = value;
        this.page = 1;
        this.list = [];
        this.historyShow = false;
        this.onLoad();

      },
      onLoad() {
        if (this.searchName == "") {
          this.loading = false;
          return;
        }
        // 异步更新数据
        this.$http
          .request({
            method: "get",
            url: "/IllnessKnowController/selectPageModels",
            body: {
              status: this.status,
              page: this.page,
              limit: this.limit,
              illnesstitle: this.searchName
            }
          })
          .then(res => {
            if (res.data.success) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.list.push(res.data.data[i]);
              }
              //计算最后一页
              this.endPage = Math.floor(res.data.total / this.limit);
              this.endPage = res.data.total % this.limit == 0 ? this.endPage : this.endPage + 1;
              //判断是最后一页重新从第一页开始 否则页数加一
              if (this.page == this.endPage) {
                this.finished = true;
                // this.page = 1;
              } else {
                this.page++;
              }
              // 加载状态结束
              this.loading = false;
              //判断手否展示缺省页
              console.log(this.page)
              console.log(this.list.length)
              if (res.data.total == 0) {
                this.listShow = true;
              }
            } else {
              //失败
              this.$toast(res.data.message);
            }

          })
          .catch(e => {
            console.log(e);
          });
      },
      headerBack() {
        this.$router.go(-1)
      }
    },
    watch: {
      searchName(newVal, oldVal) {
        if (newVal == "") {
          this.onSearch();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #introduceSearch {
    background-color: @backgroundColor !important;
    height: 100%;
    /*overflow: auto; !* winphone8和android4+ *!*/
    -webkit-overflow-scrolling: touch; /* ios5+ */
    width: 100%;
    box-sizing: border-box;

    .search_box {
      position: fixed;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      width: 100vw;
      height: auto;
      background: @backgroundColor;

      .header-left {
        float: left;
        .height(44);
        .lineHeight(44);
        .padding(0, 0, 0, 10);

        .back-icon {
          .fontSize(20);
          font-weight: 600;
          color: @titleColor;
        }
      }

      /deep/ .van-search {
        .width(333);
        float: left;
        .padding(5, 0, 5, 8);
        background: @backgroundColor !important;

        .van-search__content {
          background-color: @backgroundColorT;
          .borderRadius(6, 6, 6, 6);
        }

        .van-icon-search,
        .van-field__control {
          .fontSize(16);
          .lineHeight(24);
        }

        .van-field__body,
        .van-field__left-icon {
          .lineHeight(24);
        }
      }
    }

    .main {
      .padding(44, 0, 0, 0);

      .main_list {
        .padding(0, 12, 15, 12);

        .list_title {
          .lineHeight(25);
          .fontSize(18);
          color: @fontColor33;
          .padding(5, 0, 5, 0);
          font-weight: bold;
        }

        .list {
          .noResult {
            .padding(60, 0, 0, 0);
          }

          .van-list {
            .list_all {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;

              .list_box {
                display: flex;
                flex-direction: column;
                .width(170);
                .height(154);
                .borderRadius(6, 6, 6, 6);
                background-color: @backgroundColorff;
                .margin(10, 0, 0, 0);
                overflow: hidden;

                img {
                  .width(170);
                  .height(90);
                }

                .list_box_title {
                  flex: 1;
                  .padding(0, 10, 0, 10);
                  .margin(10, 0, 10, 0);
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  .fontSize(16);
                  .lineHeight(22);
                  color: @fontColor33;
                }
              }

            }
          }

          .history {
            .padding(20, 0, 15, 0);

            .history_title {
              color: @fontColor33;
              .fontSize(16);
              font-weight: bold;
              .lineHeight(22);
            }

            .centent {
              .lineHeight(22);
              color: @fontColorcc;
              justify-content: center;
            }

            .history_list {
              .padding(10, 0, 0, 0);
              display: flex;
              flex-wrap: wrap;

              .box {
                .margin(5, 10, 5, 0);
                .borderRadius(6, 6, 6, 6);
                background-color: @backgroundColorff;
                .padding(4, 10, 4, 10);
                .lineHeight(22);
                .fontSize(16);
              }
            }
          }

          .list_no {
            img {
              .width(205);
            }

          }
        }
      }
    }
  }
</style>
