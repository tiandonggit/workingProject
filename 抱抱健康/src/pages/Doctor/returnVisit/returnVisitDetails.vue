<template>
  <div id="returnVisitDetails">
    <common-header :share-disabled="true" :custom-title="patientId ? '医患沟通' : '医生工作室'"></common-header>
    <div class="head">
      <div class="icon header-div header-left" @click="headerBack">
        <i class="iconfont iconleft back-icon"></i>
      </div>复诊详情
    </div>
    <div class="body">
      <img
        src="../../../assets/images/follow_up.png"
        class="marker"
        v-show="list.subsequentvisitstatus==1 && isHavaBtn"
      />
      <img
        src="../../../assets/images/follow_down.png"
        class="marker"
        v-show="list.subsequentvisitstatus==2 && isHavaBtn"
      />
      <div class="text">
        患者姓名：
        <span>{{list.patientname}}</span>
      </div>
      <div class="text">
        复诊疾病：
        <span>{{list.illnessname}}</span>
      </div>
      <div class="text">
        复诊时间：
        <span>{{list.subsequentvisittime}}</span>
      </div>
      <div class="text">
        复诊状态：
        <span>
          <div class="sure" v-show="list.status==1 && list.active==0">已确认</div>
          <div class="sure" v-show="list.subsequentvisitstatus==1 && !isHavaBtn">已复诊</div>
          <div class="sure" v-show="list.status==0 && list.active==0">已发送</div>
          <div class="today" v-show="list.status==2 && list.active!==1">今日复诊</div>
          <div class="waiting" v-show="list.active==0">待复诊</div>
          <div class="noVisit" v-show="list.subsequentvisitstatus==2 && !isHavaBtn">未复诊</div>
          <div class="invalid" v-show="list.active==1">复诊已失效</div>
        </span>
      </div>
      <div class="text">
        复诊说明：
        <span>{{list.explain}}</span>
      </div>
    </div>
    <div class="bottom" v-show="list.active==1 && list.subsequentvisitstatus==0">
      <van-button type="info" class="done" @click="updateSubsequentVisitStatus(1)">已复诊</van-button>
      <van-button plain type="info" class="doing" @click="updateSubsequentVisitStatus(2)">未复诊</van-button>
    </div>
  </div>
</template>

<script>
import commonHeader from "../../../components/commonHeader/common_header";
export default {
  name: "returnVisitDetails",
  data() {
    return {
      id: "", //复诊单id
      list: {}, //展示信息
      active: 2, //原先有用,现在没啥逼用(前端后端互相折磨的产物)
      isHavaBtn: false,
      patientId: "",
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.active = this.$route.query.active;
    this.patientId = this.$route.query.patientId;
    this.findDetail();
  },
  components: {
    commonHeader,
  },
  methods: {
    //点击已复诊未复诊去修改复诊状态
    updateSubsequentVisitStatus(key) {
      this.$http
        .request({
          method: "post",
          url: "/SSubsequentVisitController/updateSubsequentVisitStatus",
          body: {
            id: this.id,
            subsequentvisitstatus: key,
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.list.subsequentvisitstatus = key;
            this.isHavaBtn = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //查询详情接口
    findDetail() {
      this.$http
        .request({
          method: "get",
          url: "/SSubsequentVisitController/selectByPrimaryKey",
          body: {
            id: this.id,
          },
        })
        .then((res) => {
          if (res.data.success) {
            this.list = res.data.data;
            let timeNow = Date.parse(new Date());
            let tims = new Date(res.data.data.subsequentvisittime.replace(/-/g, "/")).getTime();
            if (timeNow > tims) {
              this.list.active = 1;
            } else {
              this.list.active = 0;
            }
          }
        })
        .catch((e) => {
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
  },
};
</script>

<style scoped lang="less">
#returnVisitDetails {
  width: 100%;
  height: 100%;
  background: @backgroundColor;
  display: flex;
  flex-direction: column;

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

  .body {
    .width(330);
    height: auto;
    .lineHeight(30);
    background: @fontColorff;
    .padding(15, 10, 15, 10);
    .margin(20, 12, 0, 12);
    margin-bottom: auto;
    .borderRadius(10, 10, 10, 10);
    overflow: hidden;
    .fontSize(16);
    color: @fontColor33;
    position: relative;

    .marker {
      .width(52);
      .height(32);
      position: absolute;
      top: 0;
      right: 10/375 * 100vw;
    }

    .text {
      display: flex;

      span {
        width: 73%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .lineHeight(31);

        div {
          .padding(0, 5, 0, 5);
          .fontSize(14);
          color: @fontColorff;
          .borderRadius(6, 6, 6, 6);
          .margin(3, 10, 3, 0);
          .height(22);
          .lineHeight(24);
        }

        .sure {
          background: linear-gradient(
            226deg,
            rgba(0, 231, 152, 1) 0%,
            rgba(0, 203, 95, 1) 100%
          );
        }

        .today {
          background: linear-gradient(
            226deg,
            rgba(255, 104, 68, 1) 0%,
            rgba(255, 48, 0, 1) 100%
          );
        }

        .waiting {
          background: linear-gradient(
            226deg,
            rgba(1, 128, 255, 1) 0%,
            rgba(0, 105, 255, 1) 100%
          );
        }

        .noVisit {
          background: linear-gradient(
            226deg,
            rgba(255, 146, 0, 1) 0%,
            rgba(255, 89, 0, 1) 100%
          );
        }

        .invalid {
          background: @fontColor99;
        }
      }
    }
  }

  .bottom {
    width: 100%;
    .height(140);

    button {
      .width(350);
      .height(44);
      .margin(0, 12, 15, 12);
      .borderRadius(10, 10, 10, 10);
      .fontSize(18);
      font-weight: 400;
    }

    .done {
      background: @buttonColor;
    }

    .doing {
      background: @backgroundColor;
      color: @buttonColor;
    }
  }
}
</style>