<template>
  <div id="returnVisitSearch">
    <common-header :share-disabled="true" :custom-title="'医生工作室'"></common-header>
    <div style="position: fixed;background: #EDEDED;z-index: 10;width: 100%;top:0">
      <div class="head">
        <div class="icon header-div header-left" @click="headerBack">
          <i class="iconfont iconleft back-icon"></i>
        </div>
        复诊搜索
      </div>
      <van-search
          v-model="value"
          placeholder="输入医生名字/疾病名称搜索"
          class="search"
          @input="find=false"
          @search="history_tag"
          type="search"
          show-action
      >
        <template #action>
          <div @click="history_tag" class="button">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="history" v-if="!find || !value">
      <div class="title">历史搜索</div>
      <div class="tag_body">
        <div
            class="tag"
            v-for="(item,index) in history_list"
            :key="index"
            v-if="item.time>times"
            @click="history_search(item.name)"
        >{{item.name}}
        </div>
      </div>
    </div>
    <div class="no_find" v-else-if="find && no_list">
      <img src="../../../assets/images/no_find.png" class="images"/>
      <div class="text_title">暂未找到您的搜索内容</div>
      <div class="text_toast">请尝试输入其他关键词搜索</div>
    </div>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        class="waiting"
        v-else-if="find && list.length"
    >
      <div v-for="(item , index) in list" :key="index">
        <div class="cell" @click="go_detail(item.id , 0)" v-if="item.isnofailure==1">
          <div class="marker_send" v-if="item.status==0">已发送</div>
          <div class="marker_true" v-else-if="item.status==1">已确认</div>
          <div class="marker_today" v-else>今日复诊</div>
          <img :src="item.imgurl" class="image"/>
          <img src="../../../assets/images/naozhong.png" class="backImage" v-if="item.status==2"/>
          <div class="text_short">
            患者姓名：
            <span>{{item.patientname}}</span>
          </div>
          <div class="text_long">
            复诊疾病：
            <span>{{item.illnessname}}</span>
          </div>
          <div class="text">
            复诊时间：
            <span>{{item.subsequentvisittime}}</span>
          </div>
        </div>
        <div class="over_cell" @click="go_detail(item.id , 1)" v-else>
          <div class="title">复诊提醒已失效</div>
          <img :src="item.imgurl" class="image"/>
          <div class="text_short">
            患者姓名：
            <span>{{item.patientname}}</span>
          </div>
          <div class="text_long">
            复诊疾病：
            <span>{{item.illnessname}}</span>
          </div>
          <div class="text">
            复诊时间：
            <span>{{item.subsequentvisittime}}</span>
          </div>
          <div v-if="item.subsequentvisitstatus==0">
            <van-button
                type="primary"
                class="gone"
                @click.stop="updateSubsequentVisitStatus(item,1)"
            >已复诊
            </van-button>
            <van-button
                type="primary"
                class="going"
                @click.stop="updateSubsequentVisitStatus(item,2)"
            >未复诊
            </van-button>
          </div>
          <van-button
              disabled
              type="primary"
              class="no_go"
              v-else-if="item.subsequentvisitstatus==1"
          >已复诊
          </van-button>
          <van-button disabled type="primary" class="no_go" v-else>未复诊</van-button>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "returnVisitSearch",
    data() {
      return {
        active: 0,
        value: "",
        history_list: [], //历史记录列表
        list: [], //搜索列表
        loading: false,
        finished: false,
        timeId: "", //暂时无用
        times: Date.parse(new Date()) / 1000 - 7 * 24 * 60 * 60, //暂时无用
        doctorid: "", //医生id
        page: 1,
        limit: 20,
        no_list: false, //是否展示没有搜索内容的背景图
        find: false, //判断是否已查询,但是貌似判断有问题,但是暂时不影响展示效果
        patientId: "" //患者id
      };
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
      this.history_list = JSON.parse(window.localStorage.getItem("history_list")) || [];
      // this.setTime();
    },
    components: {
      commonHeader
    },
    beforeDestroy() {
      window.clearTimeout(this.timeId);
    },
    methods: {
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
          .then((res) => {
            if (res.data.success) {
              value.subsequentvisitstatus = key;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      //查询历史记录时间以及是否需要创建定时任务
      setTime() {
        let nowTime = Date.parse(new Date()) / 1000;
        let hisTime = window.localStorage.getItem("history_list_time");
        let times = nowTime - hisTime;
        console.log(nowTime);
        console.log(hisTime);
        console.log(times);
        if (times >= 7 * 24 * 60 * 60) {
          console.log("7天以外");
          window.clearTimeout(this.timeId);
        } else if (times < 7 * 24 * 60 * 60 && times > 6 * 24 * 60 * 60) {
          console.log("第6-7天");
          this.timeId = setTimeout(function () {
            this.history_list = [];
            // window.clearTimeout(this.timeId);
          }, times);
        } else {
          console.log("6天之内");
        }
      },
      //查询字符串中指定字符个数
      getStrCount(scrstr, armstr) {
        //scrstr 源字符串 armstr 特殊字符
        var count = 0;
        while (scrstr.indexOf(armstr) != -1) {
          scrstr = scrstr.replace(armstr, "");
          count++;
        }
        return count;
      },
      //历史记录标签
      history_tag() {
        if (!this.value) {
          return;
        }
        let spaceNum = this.getStrCount(this.value, " ");
        if (this.value.length == spaceNum) {
          this.value = "";
          return;
        }
        let new_list = {name: this.value, time: Date.parse(new Date()) / 1000};
        let getArray = this.$hasValueFromArray(
          this.history_list,
          "name",
          new_list.name
        );
        if (getArray.value) {
          this.history_list.splice(getArray.index, 1);
          this.history_list.unshift(new_list);
        } else {
          this.history_list.unshift(new_list);
          if (this.history_list.length >= 10) {
            this.history_list.splice(10, 11);
          }
        }
        let timestamp = Date.parse(new Date()) / 1000;
        window.localStorage.setItem("history_list_time", timestamp);
        window.localStorage.setItem(
          "history_list",
          JSON.stringify(this.history_list)
        );
        if (this.timeId) {
          window.clearTimeout(this.timeId);
        }
        // this.back=2;
        this.list = [];
        this.page = 1;
        this.findList();
      },
      //查询详情跳转
      go_detail(value, active) {
        this.$router.push({
          name: "returnVisitDetails",
          query: {
            id: value,
            active: active
          }
        });
      },
      //点击历史记录查询
      history_search(value) {
        this.value = value;
        this.history_tag();
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

      onSearch(val) {
        // console.log(val);
      },
      //待复诊下拉加载
      onLoad() {
        this.findList();
      },
      //查询信息
      findList() {
        this.find = true;
        let body = {};
        if (this.patientId) {
          body = {
            patientId: this.patientId,
            doctorid: this.doctorid,
            page: this.page,
            limit: this.limit,
            fuzzySearch: this.value
          };
        } else {
          body = {
            doctorid: this.doctorid,
            page: this.page,
            limit: this.limit,
            fuzzySearch: this.value
          };
        }
        this.$http
          .request({
            method: "get",
            url: "/SSubsequentVisitController/selectPageModel",
            body: body
          })
          .then((res) => {
            this.loading = false;
            if (res.data.success) {
              if (res.data.total == 0) {
                this.no_list = true;
              } else {
                this.no_list = false;
              }
              this.page = this.page + 1;
              for (let i = 0; i < res.data.data.length; i++) {
                this.list.push(res.data.data[i]);
              }
              this.allNum = Number(res.data.total);
              // 数据全部加载完成
              if (this.list.length >= this.allNum) {
                this.finished = true;
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  };
</script>

<style scoped lang="less">
  /*#returnVisitSearch::-webkit-scrollbar {*/
  /*	display: none; !* Chrome Safari *!*/
  /*}*/
  #returnVisitSearch {
    /*overflow-y: scroll;*/
    /*scrollbar-width: none; !* firefox *!*/
    /*-ms-overflow-style: none; !* IE 10+ *!*/
    width: 100%;
    /*height: 100%;*/
    background: @backgroundColor;
    .padding(100, 0, 0, 0);

    .head {
      .height(44);
      width: 100%;
      background: @backgroundColor;
      .lineHeight(44);
      .fontSize(18);
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
    }

    .search {
      background: @backgroundColor !important;

      /deep/ .van-search__content {
        .borderRadius(10, 10, 10, 10);
      }

      .button {
        .width(52);
        .height(34);
        .lineHeight(34);
        //.fontSize(16);
        .borderRadius(10, 10, 10, 10);
        background: @buttonColor;
        text-align: center;
        color: @fontColorff;
      }
    }

    .history {
      .margin(20, 12, 0, 12);

      .title {
        .fontSize(16);
        font-weight: bold;
        color: @fontColor33;
      }

      .tag_body {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .tag {
          width: auto;
          //.height(30);
          text-align: center;
          .padding(4, 10, 4, 10);
          .margin(10, 0, 0, 10);
          background: @fontColorff;
          .borderRadius(6, 6, 6, 6);
        }
      }
    }

    .no_find {
      .images {
        .width(200);
        .height(200);
        position: fixed;
        top: 160/375 * 100vw;
        left: 88/375 * 100vw;
      }

      .text_title {
        width: 100%;
        .fontSize(18);
        font-weight: bold;
        color: @fontColor33;
        text-align: center;
        position: fixed;
        top: 390/375 * 100vw;
      }

      .text_toast {
        width: 100%;
        .fontSize(16);
        color: @fontColor99;
        text-align: center;
        position: fixed;
        top: 422/375 * 100vw;
      }
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
          background: linear-gradient(226deg,
          rgba(0, 231, 152, 1) 0%,
          rgba(0, 203, 95, 1) 100%);
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
          background: linear-gradient(226deg,
          rgba(1, 128, 255, 1) 0%,
          rgba(0, 105, 255, 1) 100%);
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
          background: linear-gradient(226deg,
          rgba(255, 146, 0, 1) 0%,
          rgba(255, 89, 0, 1) 100%);
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
</style>
