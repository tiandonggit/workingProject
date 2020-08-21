<template>
  <div class="modifyDoctorGroupName_page">
    <common-header
        :share-disabled="true"
        :custom-title="'医患沟通'"
        :header-show="true"
        :rightContent="'保存'"
        :rightClass="{'color':'rgba(0, 105, 255, 1)'}"
        @rightContentClick="rightContentClick"
        :title="'修改医疗服务团队名称'"
    ></common-header>
    <div class="content_box">
      <van-field v-model="docGroupName"
                 placeholder="请编辑医疗服务团队名称(1-15字)"
                 clearable/>
    </div>

    <van-popup v-model="dialogShow" class="makeSurePop">
      <div
          role="dialog"
          class="van-dialog"
          style="z-index: 2007;"
          v-if="dialogShow"
          aria-labelledby="是否保存该信息?"
      >
        <div class="van-dialog__content">
          <div class="van-dialog__message">{{ "是否保存该信息?" }}</div>
        </div>
        <div
            class="van-hairline--top van-dialog__footer van-dialog__footer--buttons"
        >
          <button
              class="van-button van-button--default van-button--large van-dialog__cancel"
              @click.stop="cancelUpdateDetail"
          >
            <span class="van-button__text">取消</span>
          </button>
          <button
              class="van-button van-button--default van-button--large van-dialog__confirm
                        van-hairline--left"
              @click.stop="updateDocGroupName"
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
  import {Toast} from "vant";


  export default {
    name: "modifyDoctorGroupName",
    components: {
      commonHeader
    },
    watch:{
      docGroupName(val) {
        if(val.length > 15) {
          Toast('请编辑医疗服务团队名称(1-15字)');
          this.docGroupName = val.substring(0,15);
        }
      }
    },
    data() {
      return {
        docGroupName: "",
        isSave: false,
        dialogShow: false,
        id: ""
      };
    },
    /**
     * 路由钩子判断是否保存
     * 如果保存可以跳转**/
    beforeRouteLeave(to, from, next) {
      if (!this.isSave) {
        this.dialogShow = true;
        next(false);
      } else {
        next();
      }
    },
    methods: {
      /**
       * 保存提交
       * **/
      rightContentClick() {
        this.dialogShow = true;
      },
      /**
       * 取消按钮
       * **/
      cancelUpdateDetail() {
        this.isSave = true;
        this.$router.go(-1);
      },
      /**
       * 修改医疗团队名称
       * **/
      updateDocGroupName() {
        if (!this.docGroupName) {
          Toast("请编辑医疗服务团队名称(1-15字)");
          return false;
        }
        this.$http.request({
          url: "/ImSessionController/updateImSession",
          method: "post",
          body: {
            id: this.id,
            sessionname: this.docGroupName
          }
        }).then(res => {
          // 0000：团队修改成功。0001：团队名称重复。
          if (res.data.success && res.data.code !== '0001') {
            Toast("修改成功");
            this.isSave = true;
            // this.$router.go(-1);
            this.$router.push({
              path:'/docChatIMDetail',
              query:{
                sessionName:this.docGroupName
              }
            })
          } else {
            Toast(res.data.message || "接口报错");
          }
        });
      }
    },
    created() {
      this.docGroupName = this.$route.query.name || "";
      this.id = this.$route.query.id || "";
    }
  };
</script>

<style scoped lang="less">
  .modifyDoctorGroupName_page {
    .padding(60, 12, 12, 12);

    /deep/ .van-cell {
      padding: 10px;
      font-size: 18px;
    }

    /deep/ .van-field__control {
      .fontSize(16);
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    /deep/ .van-popup.makeSurePop {
      .width(320);
      .height(146);
      background: none;

      .van-dialog {
        top: 50%;
      }
    }

    .content_box {
      overflow: hidden;
      .height(46);
      background-color: @backgroundColorff;
      .borderRadius(10, 10, 10, 10);
      .margin(0, 0, 15, 0);
    }
  }
</style>
