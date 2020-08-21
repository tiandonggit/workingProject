<template>
  <div class="docGroupCardMessage_page" id="editIntro">
    <common-header
        :share-disabled="true"
        :custom-title="'医生名片'"
    ></common-header>
    <div class="navBar">
      <van-nav-bar
          left-arrow
          :title="groupName + '医疗小组简介'"
          right-text="保存"
          @click-left="onClickLeft"
          @click-right="onClickRight"
      ></van-nav-bar>
    </div>
    <div class="content">
      <p class="title" v-text="'简介'"></p>
      <div class="edit">
        <van-cell-group>
          <van-field
              v-model="message"
              type="textarea"
              row="6"
              :placeholder="'请编辑名片简介(0-100字)'"
              autosize
          ></van-field>
        </van-cell-group>
      </div>
    </div>
    <div style="height: 10px"></div>

    <van-popup v-model="dialogShow">
      <div
          role="dialog"
          class="van-dialog"
          style="z-index: 2007;"
          v-if="dialogShow"
          aria-labelledby="是否保存该备注?"
      >
        <div class="van-dialog__content">
          <div class="van-dialog__message">是否保存该医疗团队介绍信息?</div>
        </div>
        <div
            class="van-hairline--top van-dialog__footer van-dialog__footer--buttons"
        >
          <button
              class="van-button van-button--default van-button--large van-dialog__cancel"
              @click.stop="cancelUpdate"
          >
            <span class="van-button__text">取消</span>
          </button>
          <button
              class="van-button van-button--default van-button--large van-dialog__confirm
                        van-hairline--left"
              @click.stop="updateDoctorGroupDetail"
          >
            <span class="van-button__text">确认</span>
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>

  import commonHeader from "../../../components/commonHeader/common_header";
  import {Toast} from 'vant';

  export default {
    name: "modifyDocGroupMessage",
    components: {
      commonHeader
    },
    watch: {
      message(value) {
        let reg2 = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
        this.message = value.replace(reg2, "").trim();
        if(value.length > 100) {
          Toast(`请编辑医疗小组名片简介0-100字`);
          this.message = value.substring(0,100);
        }
      }
    },
    data() {
      return {
        dialogShow: false,
        message: "", // 医疗团队介绍
        groupId: "", // 医疗团队id
        groupName:''
      };
    },
    methods: {
      cancelUpdate() {
        this.isSave = true;
        this.$router.go(-1);
      },
      onClickLeft() {
        this.$router.go(-1);
      },
      onClickRight() {
        this.updateDoctorGroupDetail();
      },
      updateDoctorGroupDetail() {
        this.$http.request({
          url:'/ImGroupController/updateGroupUserName',
          method:'post',
          body: {
            id:this.groupId,
            groupintroduction:this.message
          }
        }).then(res => {
          if (res.data.success) {
            Toast("修改成功");
            this.isSave = true;
            this.$router.go(-1);
          } else {
            Toast(res.data.message || "接口报错");
          }
        });
      }
    },
    created() {
      if(this.$route.query.groupId) {
        this.groupId = this.$route.query.groupId;
      }
      if(this.$route.query.docGroupMessage) {
        this.message = this.$route.query.docGroupMessage;
      }
      if(this.$route.query.groupName) {
        this.groupName = this.$route.query.groupName
      }
    },
    /**
     * 路由钩子判断是否保存
     * 如果保存可以跳转**/
    beforeRouteLeave(to, from, next) {
      if (!this.isSave) {
        // this.handle();
        this.dialogShow = true;
        next(false);
      } else {
        next();
      }
    }
  };
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  /deep/ .van-nav-bar {
    background-color: @backgroundColor;

    .van-icon {
      .fontSize(24);
      color: @titleColor !important;
    }

    .van-nav-bar__text {
      color: @mainColor;
      .fontSize(16);
    }
  }

  #editIntro /deep/ textarea {
    .fontSize(16);
    word-break: break-all !important;
    word-wrap: break-word !important;
  }

  .van-hairline--top-bottom::after {
    border: none;
  }

  #editIntro {
    width: 100%;
    min-height: 100%;
    background-color: @backgroundColor;

    /deep/ .van-popup {
      .width(320);
      .height(146);
      background: none;

      .van-dialog {
        top: 50%;
      }
    }

    .content {
      width: 94%;
      //height: 30%;
      margin: 0 auto;
      margin-bottom: 0 !important;
      background: @backgroundColorT;
      .borderRadius(10, 10, 10, 10);

      .title {
        .fontSize(16);
        font-weight: bold;
        color: @titleColor;
        .lineHeight(46);
        .padding(0, 0, 0, 27);
        border-bottom: 1px solid @backgroundColor;
        background: url("../../../assets/images/icon_zhu.png") 3.5vw center
        no-repeat;
        background-size: 1.07vw;
      }

      .van-cell {
        .padding(15, 10, 15, 10);
      }

      .van-cell-group {
        .borderRadius(0, 0, 10, 10);
        overflow: hidden;
      }
    }
  }
</style>

