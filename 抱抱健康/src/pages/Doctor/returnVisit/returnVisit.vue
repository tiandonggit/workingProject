<template>
  <div class="returnVisit">
    <common-header
        :share-disabled="true"
        :custom-title="patientId ? '医患沟通' : '医生工作室'"
    ></common-header>
    <div style="position: fixed;background: #EDEDED;z-index: 10;width: 100%;">
      <div class="head">
        <div class="icon header-div header-left" @click="headerBack">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        复诊列表
        <van-button type="info" class="button" @click="initiate" v-show="patientId">发起复诊</van-button>
      </div>
      <div class="search" @click="go_search" v-show="!patientId">
        <van-icon name="search" class="icon"/>
        输入疾病/患者姓名搜索
      </div>
      <van-tabs v-model="active" class="tabs" @change="changetabs">
        <van-tab title="待复诊"></van-tab>
        <van-tab title="过往复诊"></van-tab>
      </van-tabs>
    </div>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="waiting"
        :class="[{'waiting_pendant2':patientId,'waiting_pendant1':!patientId,'noHasValueTip':!list.length && !loading}]"
        v-if="active=='0'"
    >
      <div class="cell" v-for="(item , index) in list" :key="index" @click="go_detail(item.id)">
        <div class="marker_send" v-if="item.status==0">已发送</div>
        <div class="marker_true" v-else-if="item.status==1">已确认</div>
        <div class="marker_today" v-else>今日复诊</div>
        <img :src="item.imgurl" class="image"/>
        <img src="../../../assets/images/naozhong.png" class="backImage" v-if="item.status==2"/>
        <div class="text_short">患者姓名：<span>{{item.patientname}}</span></div>
        <div class="text_long">复诊疾病：<span>{{item.illnessname}}</span></div>
        <div class="text">复诊时间：<span>{{item.subsequentvisittime}}</span></div>
      </div>
    </van-list>
    <van-list
        v-model="over_loading"
        :finished="over_finished"
        finished-text="没有更多了"
        @load="over_onLoad"
        class="waiting"
        :class="[{'waiting_pendant2':patientId,'waiting_pendant1':!patientId,'noHasValueTip':!over_list.length && !over_loading}]"
        v-else-if="active=='1'"
    >
      <div class="over_cell" v-for="(item , index) in over_list" :key="index" @click="go_detail(item.id)">
        <div class="title">复诊提醒已失效</div>
        <img :src="item.imgurl" class="image"/>
        <div class="text_short">患者姓名：<span>{{item.patientname}}</span></div>
        <div class="text_long">复诊疾病：<span>{{item.illnessname}}</span></div>
        <div class="text">复诊时间：<span>{{item.subsequentvisittime}}</span></div>
        <div v-if="item.subsequentvisitstatus==0">
          <van-button type="primary" class="gone" @click.stop="updateSubsequentVisitStatus(item,1)">已复诊</van-button>
          <van-button type="primary" class="going" @click.stop="updateSubsequentVisitStatus(item,2)">未复诊</van-button>
        </div>
        <van-button disabled type="primary" class="no_go" v-else-if="item.subsequentvisitstatus==1">已复诊</van-button>
        <van-button disabled type="primary" class="no_go" v-else>未复诊</van-button>
      </div>
    </van-list>
    <div class="boxx" v-if="active==0&&list.length==0&&!loading">
      <img src="../../../assets/images/unHistory.png" alt=""/>
      <p>暂无记录</p>
    </div>
    <div class="boxx" v-if="active==1&&over_list.length==0&&!over_loading">
      <img src="../../../assets/images/unHistory.png" alt=""/>
      <p>暂无记录</p>
    </div>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";
  import {mapState} from "vuex";

  export default {
    name: "returnVisit",
    data() {
      return {
        active: 0,  //tag的id
        list: [],   //展示待复诊列表
        allNum: 0,   //待复诊总数
        over_allNum: 0,   //过往复诊总数
        over_list: [],   //过往复诊列表(为啥分页写俩列表,下面方法写俩判断,别问,问就是套路,我是不会承认我的傻逼的)
        loading: false,
        finished: false,
        over_loading: false,
        over_finished: false,
        page: 1,
        limit: 20,
        doctorid: "",    //医生id
        patientId: ""   //患者id
      };
    },
    computed: {
      ...mapState(["DoctorIM"])
    },
    created() {
      if (this.$route.query.doctorid) {
        this.doctorid = this.$route.query.doctorid;
      } else {
        this.doctorid = this.DoctorIM.doctorMessage.data.docId;
      }
      if (this.$route.query.patientId) {
        this.patientId = this.$route.query.patientId;
      }
      // this.findList();
    },
    components: {
      commonHeader
    },
    methods: {
      //查询信息
      findList() {
        let type = 0;
        if (this.active == 0) {
          type = 1;
        } else {
          type = 2;
        }
        let body = {};
        if (this.patientId) {
          body = {
            doctorid: this.doctorid,
            type: type,
            patientId: this.patientId,
            page: this.page,
            limit: this.limit
          };
        } else {
          body = {
            doctorid: this.doctorid,
            type: type,
            page: this.page,
            limit: this.limit
          };
        }
        this.$http
          .request({
            method: "get",
            url: "/SSubsequentVisitController/selectPageModel",
            body: body
          })
          .then(res => {
            if (res.data.success) {
              this.page = this.page + 1;
              if (this.active == 0) {
                for (let i = 0; i < res.data.data.length; i++) {
                  this.list.push(res.data.data[i]);
                }
                this.allNum = Number(res.data.total);
                this.loading = false;
                // 数据全部加载完成
                if (this.list.length >= this.allNum) {
                  this.finished = true;
                }
              } else {
                for (let i = 0; i < res.data.data.length; i++) {
                  this.over_list.push(res.data.data[i]);
                }
                this.over_allNum = Number(res.data.total);
                // 加载状态结束
                this.over_loading = false;

                // 数据全部加载完成
                if (this.over_list.length >= this.over_allNum) {
                  this.over_finished = true;
                }
              }
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      //点击已复诊未复诊去修改复诊状态
      updateSubsequentVisitStatus(value, key) {
        this.$http
          .request({
            method: "post",
            url: "/SSubsequentVisitController/updateSubsequentVisitStatus",
            body: {
              id: value.id,
              subsequentvisitstatus: key
            }
          })
          .then(res => {
            if (res.data.success) {
              value.subsequentvisitstatus = key;
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      /**
       * 返回上一页
       */
      headerBack() {
        if (window.history.length <= 1) {
          try {
            WeixinJSBridge.call("closeWindow");
          } catch (e) {
            console.log(e);
          }
        } else {
          this.$router.go(-1);
        }
      },
      //查询详情跳转
      go_detail(value) {
        this.$router.push({
          name: "returnVisitDetails",
          query: {
            patientId: this.patientId,
            id: value,
            active: this.active
          }
        });
      },
      //发起复诊跳转
      initiate() {
        this.$router.push({
          name: "initDiagnoseReminder",
          query: {
            patientId: this.$route.query.patientId,
            patientName: this.$route.query.patientName
          }
        });
      },
      //搜索跳转
      go_search() {
        let query = {};
        if (this.patientId) {
          query = {
            doctorid: this.doctorid,
            patientId: this.patientId
          };
        } else {
          query = {
            doctorid: this.doctorid
          };
        }
        this.$router.push({
          name: "returnVisitSearch",
          query: query
        });
      },
      //tabs状态修改捕捉
      changetabs() {
        this.page = 1;
      },
      //待复诊下拉加载
      onLoad() {
        // 异步更新数据
        this.findList();
        // 加载状态结束
      },
      //过往复诊下拉加载
      over_onLoad() {
        // 异步更新数据
        this.findList();
      }
    }
  };
</script>

<style scoped lang="less">
  /*.returnVisit::-webkit-scrollbar {*/
  /*	display: none; !* Chrome Safari *!*/
  /*}*/
  .returnVisit {
    /*overflow-y: scroll;*/
    /*scrollbar-width: none; !* firefox *!*/
    /*-ms-overflow-style: none; !* IE 10+ *!*/
    width: 100%;
    /*height: 100%;*/
    background: @backgroundColor;


    /deep/ .van-tab--active .van-tab__text {
      font-weight: bold;
    }

    /deep/ .van-tab .van-ellipsis {
      .fontSize(16) !important;
      font-weight: 400;
      color: @fontColor33;
    }

    /deep/ .van-tab.van-tab--active {
      .van-ellipsis {
        font-weight: bold;
      }
    }


    /deep/ .van-tab__text {
      .fontSize(16) !important;
      font-weight: 400;
      color: @fontColor33;
    }

    /deep/ .noHasValueTip {
      .van-list__finished-text {
        display: none;
      }
    }

    .head {
      .height(44);
      width: 100%;
      background: @backgroundColor;
      .lineHeight(44);
      .fontSize(18);
      .margin(0, 0, 10, 0);
      font-weight: 400;
      color: @fontColor33;
      text-align: center;
      position: relative;

      .icon {
        width: 20%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: left;
        display: flex;
        align-items: center;
        height: 100%;
        color: @titleColor;
        position: absolute;
        left: 12/3.75vw;

        .back-icon {
          .fontSize(20);
          font-weight: 600;
          color: @titleColor;
        }
      }

      .button {
        .width(84);
        .height(34);
        background: @buttonColor;
        .fontSize(16) !important;
        color: @fontColorff;
        text-align: center;
        .lineHeight(34);
        .borderRadius(6, 6, 6, 6);
        position: absolute;
        right: 12/3.75vw;
        top: 5/3.75vw;
        padding: 0px;
      }
    }

    .search {
      .width(312);
      .height(34);
      .lineHeight(34);
      .margin(0, 12, 10, 12);
      .padding(0, 0, 0, 38);
      background: @fontColorff;
      .borderRadius(10, 10, 10, 10);
      .fontSize(16);
      color: @fontColor99;
      position: relative;

      .icon {
        .fontSize(24);
        position: absolute;
        top: 5/375*100vw;
        left: 10/375*100vw;
      }
    }

    .tabs {
      .width(350);
      //.height(40);
      .fontSize(16);
      color: @fontColor33;
      .margin(0, 12, 0, 12);
      padding-top: 0px;

      /deep/ .van-tabs__wrap {
        .height(40);
        .lineHeight(40);
        .borderRadius(10, 10, 10, 10);
        overflow: hidden;
      }

      /deep/ .van-tabs__line {
        background: @buttonColor;
        .width(50);
      }
    }

    .waiting_pendant1 {
      top: 140/375 * 100vw;
      left: 0;
      right: 0;
    }

    .waiting_pendant2 {
      top: 90/375 * 100vw;
      left: 0;
      right: 0;
    }

    .waiting {
      position: absolute;
      .padding(0, 12, 30, 12);

      .cell {
        .width(350);
        .height(104);
        .borderRadius(10, 10, 10, 10);
        .margin(15, 0, 0, 0);
        background: @fontColorff;
        position: relative;

        .marker_send {
          position: absolute;
          top: 0px;
          right: 0px;
          background: linear-gradient(226deg, rgba(0, 231, 152, 1) 0%, rgba(0, 203, 95, 1) 100%);
          .width(52);
          .height(20);
          .borderRadius(0, 10, 0, 10);
          .lineHeight(20);
          text-align: center;
          color: @fontColorff;
          .fontSize(14);
        }

        .marker_true {
          position: absolute;
          top: 0px;
          right: 0px;
          background: linear-gradient(226deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
          .width(52);
          .height(20);
          .borderRadius(0, 10, 0, 10);
          .lineHeight(20);
          text-align: center;
          color: @fontColorff;
          .fontSize(14);
        }

        .marker_today {
          position: absolute;
          top: 0px;
          right: 0px;
          background: linear-gradient(226deg, rgba(255, 146, 0, 1) 0%, rgba(255, 89, 0, 1) 100%);
          .width(66);
          .height(20);
          .borderRadius(0, 10, 0, 10);
          .lineHeight(20);
          text-align: center;
          color: @fontColorff;
          .fontSize(14);
        }

        .image {
          .width(60);
          .height(60);
          .borderRadius(30, 30, 30, 30);
          overflow: hidden;
          position: absolute;
          top: 18/375 * 100vw;
          left: 10/375 * 100vw;
        }

        .backImage {
          .width(67);
          .height(67);
          position: absolute;
          right: 0px;
          bottom: 0px;
          z-index: 2;
        }

        .text_short {
          .fontSize(16);
          .lineHeight(18);
          .width(200);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          position: absolute;
          left: 80/375 * 100vw;
          top: 20/375 * 100vw;
        }

        .text_long {
          .fontSize(16);
          .lineHeight(18);
          .width(220);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          position: absolute;
          left: 80/375 * 100vw;
          top: 46/375 * 100vw;
        }

        .text {
          .fontSize(16);
          .lineHeight(18);
          position: absolute;
          left: 80/375 * 100vw;
          top: 72/375 * 100vw;
        }
      }

      .over_cell {
        .width(350);
        .height(176);
        .borderRadius(10, 10, 10, 10);
        .margin(15, 0, 0, 0);
        background: @fontColorff;
        position: relative;

        .title {
          .fontSize(14);
          color: @fontColor66;
          position: absolute;
          top: 10/375 * 100vw;
          left: 10/375 * 100vw;
        }

        .image {
          .width(60);
          .height(60);
          .borderRadius(30, 30, 30, 30);
          overflow: hidden;
          position: absolute;
          top: 48/375 * 100vw;
          left: 10/375 * 100vw;
        }

        .text_short {
          .fontSize(16);
          .lineHeight(18);
          .width(200);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          position: absolute;
          left: 80/375 * 100vw;
          top: 50/375 * 100vw;
        }

        .text_long {
          .fontSize(16);
          .lineHeight(18);
          .width(220);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          position: absolute;
          left: 80/375 * 100vw;
          top: 76/375 * 100vw;
        }

        .text {
          .fontSize(16);
          .lineHeight(18);
          position: absolute;
          left: 80/375 * 100vw;
          top: 102/375 * 100vw;
        }

        .gone {
          .width(175);
          .height(42);
          .fontSize(16);
          .borderRadius(0, 0, 0, 10);
          background: @buttonColor;
          color: @fontColorff;
          border: 0;
          position: absolute;
          left: 0;
          bottom: 0;
        }

        .going {
          .width(175);
          .height(42);
          .fontSize(16);
          .borderRadius(0, 0, 10, 0);
          background: @buttonFF59;
          color: @fontColorff;
          border: 0;
          position: absolute;
          right: 0;
          bottom: 0;
        }

        .no_go {
          .width(350);
          .height(42);
          .fontSize(16);
          .borderRadius(0, 0, 10, 10);
          background: @fontColor99;
          color: @fontColorff;
          border: 0;
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }
    }
  }

  .boxx {
    .width(205);
    .height(267);
    position: fixed;
    left: 0;
    right: 0;
    top:0;
    bottom:0;
    margin: auto;
    z-index: 100;

    img {
      display: block;
      width: 100%;
    }

    p {
      .fontSize(18);
      font-weight: bold;
      color: @titleColor;
      text-align: center;
    }
  }

</style>
