/* *
@Author: 张松仁 *
@Last Modified by: 张松仁 *
@name: introduceList.vue *
@function: 疾康知介列表页 *
@date: 2020/7/8 *
@time: 10:16 *
* */
<template>
  <div id="introduceList">
    <common-header
      :share-disabled="true"
      :custom-title="titleName"
      :title="titleName"
    ></common-header>
    <div class="search_box clearfix">
      <div class="header-div header-left" @click="headerBack()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <van-search
        placeholder="输入疾病名称搜索"
        @click.stop="onSearch"
        readonly
      ></van-search>
    </div>
    <div class="main">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img v-lazy="image.url"/>
        </van-swipe-item>
      </van-swipe>
      <div class="main_list">
        <div class="list_title">
          疾病康复知识介绍
        </div>
        <div class="list">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
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
    name: "introduceList",
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    data() {
      return {
        titleName: "疾康知介",
        status: 1,
        images: [],
        list: [],
        loading: false,
        finished: false,
        limit: 40,
        page: 1,
        swipeId: 0,
        endPage: 0
      };
    },
    created() {
      console.log(this.PatientIM.patientMessage.id, "this.PatientIM.patientMessage");
      //设置是医生还是患者
      if (!this.PatientIM.patientMessage.id && this.PatientIM.patientMessage.id != "") {
        //医生
        this.status = 1;
        this.swipeId = "548490953724399618";
      } else {
        //患者
        this.status = 0;
        this.swipeId = "548490954043166723";
      }
      //获取轮播图片
      this.getImages();
    },
    mounted() {

    },
    methods: {
      onSearch() {
        this.$router.push({
          name: "introduceSearch",
        });
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
      onLoad() {
        // 异步更新数据
        this.$http
          .request({
            method: "get",
            url: "/IllnessKnowController/selectPageModels",
            body: {
              status: this.status,
              page: this.page,
              limit: this.limit,
              illnesstitle: ""
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
              // console.log(this.endPage, "endPage");
              // console.log(this.page, "page");
              // console.log(this.page == this.endPage, "this.page == this.endPage");

              if (this.page == this.endPage) {
                // this.page = 1;
                this.finished = true;
                console.log(this.finished);
              } else {
                this.page++;
              }
              // 加载状态结束
              this.loading = false;
            } else {
              //失败
              this.$toast(res.data.message);
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      getImages() {
        //获取轮播图片
        this.$http
          .request({
            method: "get",
            url: "/BackgroundPictureController/select",
            body: {
              id: this.swipeId
            }
          })
          .then(res => {
            if (res.data.success) {
              console.log(res.data.data);
              this.images = res.data.data;
            } else {
              //失败
              this.$toast("获取图片失败");
            }
            console.log(res.data);
          })
          .catch(e => {
            console.log(e);
          });
      },
      headerBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  #introduceList {
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
      .padding(54, 0, 0, 0);

      .van-swipe {
        .height(200);

        .van-swipe__track {
          .van-swipe-item {
            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        /deep/ .van-swipe__indicators {
          .van-swipe__indicator {
            .width(16);
            .borderRadius(4, 4, 4, 4);
          }
        }
      }

      .main_list {
        .padding(15, 12, 15, 12);

        .list_title {
          .lineHeight(25);
          .fontSize(18);
          color: @fontColor33;
          .padding(5, 0, 5, 0);
          font-weight: bold;
        }

        .list {
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
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  .fontSize(16);
                  .lineHeight(22);
                  color: @fontColor33;
                }
              }

            }
          }
        }
      }
    }
  }
</style>
