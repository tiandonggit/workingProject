/* *
@Author: 张松仁 *
@Last Modified by: 张松仁 *
@name: introduceDetail *
@function: 疾康知介详情页 *
@date: 2020/7/8 *
@time: 10:21 *
* */
<template>
  <div id="introduceDetail">
    <common-header
      :share-disabled="true"
      :header-show="true"
      :custom-title="titleName"
      :title="title"
    ></common-header>
    <div class="main">
      <div class="top">
        <img v-lazy="illness.coverpictureurl" alt="">
      </div>
      <div class="content">
        <van-tabs v-model="active" scrollspy sticky background="#ededed" line-height="0" line-width="0"
                  title-active-color="#0069FF" title-inactive-color="#333333">
          <van-tab v-for="(item, index) in detail" :key="index" :title="item.anchor">
            <div class="content_title">
              {{ item.name }}
            </div>
            <div class="box">
              <p v-for="(item, index) in strg(item.explain)" :key="index" v-html="item">
              </p>
            </div>
            <div v-if="item.pictureurl != ''" class="pictureurl">
              <div v-for="(item1, index) in item.pictureurl.split(',')"
                   :class="item.pictureurl.split(',').length > 3?'min':''" :key="index">
                <img :src="item1" alt="">
              </div>

            </div>

          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import commonHeader from "../../components/commonHeader/common_header";

  export default {
    name: "introduceDetail",
    components: {
      commonHeader
    },
    data() {
      return {
        titleName: "疾康知介",
        title: "",
        illnessknowid: 0,
        active: 0,
        detail: [], //知介8项
        illness: [] //疾病标题和封面图
      };
    },
    created() {
      this.illnessknowid = this.$route.query.id;
      this.getDetail();
    },
    mounted() {
    },
    methods: {
      strg(str) {
        let arr = str.split("\n");
        // console.log(arr);
        // return str.replace(/\n/g,"<br />");
        return arr;
      },
      getDetail() {
        this.$http
          .request({
            method: "get",
            url: "/IllnessKnowDetailController/selectDetailInfo",
            body: {
              illnessknowid: this.illnessknowid
            }
          })
          .then(res => {
            if (res.data.success) {
              this.title = res.data.data.illness.illnesstitle;
              this.illness = res.data.data.illness;
              this.detail = res.data.data.detail;
            } else {
              //失败
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
  #introduceDetail {
    .main {
      .padding(44, 0, 0, 0);

      .top {
        img {
          width: 100%;
          //.height(200);
        }
      }

      .content {
        .van-tabs {
          /deep/ .van-sticky {
            position: relative;
            z-index: 2001;
            //.height(55);
            height: 55px;
            background-color: @backgroundColor;

            .van-tabs__wrap {
              //.height(55);
              height: 55px;

              .van-tabs__nav {
                padding: 0;

                .van-tab .van-tab__text {
                  .fontSize(18);
                  padding: 0;
                  .lineHeight(55);
                }

                .van-tab--active .van-tab__text {
                  .fontSize(20);
                }
              }

            }
          }

          /deep/ .van-sticky--fixed {
            position: fixed;
          }
        }

        /deep/ .van-tabs__content {
          .van-tab__pane {

            background-color: @backgroundColorff;
            //.margin(15, 0, 0, 0);
            margin-top: 15px;

            .content_title {
              text-align: center;
              .fontSize(18);
              .lineHeight(26);
              padding: 20px 0;
              //.padding(20, 0, 20, 0);
              font-weight: bold;
              background-image: url("../../assets/images/introduceDetail.png");
              background-repeat: no-repeat;
              background-position: center;
              background-size: 103/365*100vw 36/365*100vw;
            }

            .box {
              //.padding(0, 12, 15, 12);
              padding: 0 12px 15px;
              .fontSize(16);
              .lineHeight(22);

              p {
                text-indent: 2em;
              }
            }

            .pictureurl {
              padding: 0px 7px 5px;
              display: flex;
              flex-wrap: wrap;

              div {
                //flex: 1;
                width: 100%;
                padding: 0 5px 10px;

                img {
                  width: 100%;
                }
              }

              .min {
                min-width: 45%;
              }
            }

            &:first-child {
              margin: 0;
            }
          }

        }
      }
    }
  }
</style>
