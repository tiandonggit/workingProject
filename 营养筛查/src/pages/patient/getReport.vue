/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: getReport * @function:
领取报告 * @date: 2020/4/26 * @time: 15:52 * * */
<template>
  <div id="getReport">
    <!-- 标题 -->
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :title="title"
      :header-show="false"
    ></commonHeader>
    <div class="main">
      <!-- 提示 -->
      <div class="title">
        <span> </span>
      </div>
      <div class="pass_box_all">
        <div class="pass_box">
          <van-password-input
            :value="value"
            :length="8"
            :error-info="errorInfo"
            :mask="false"
            :focused="showKeyboard"
            @focus="showKeyboard = true"
          />
        </div>
      </div>

      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
    </div>
    <!-- 确认按钮 -->
    <div class="foot">
      <van-button type="default" @click="onSubmit">确认</van-button>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import wx from "weixin-js-sdk";
export default {
  name: "getReport",
  data() {
    return {
      customTitle: "方案领取",
      title: "请输入方案码领取方案",
      value: "",
      showKeyboard: false,
      errorInfo: "",
      type: 0
    };
  },
  components: { commonHeader },
  created() {
    /*   this.type = this.$route.query.type;  (作废)
         console.log(this.type);*/
  },
  mounted() {},
  methods: {
    onInput(key) {
      this.errorInfo = "";
      this.value = (this.value + key).slice(0, 8);
      // console.log(this.value);
      if (this.value.length === 8) {
        this.showKeyboard = false;
        this.onSubmit();
      }
    },
    onDelete() {
      this.errorInfo = "";
      this.value = this.value.slice(0, this.value.length - 1);
    },
    onSubmit() {
      console.log(this.value);
      if (this.value.length !== 8) {
        //必须八位数
        this.errorInfo = "请输入八位方案码";
      } else {
        this.errorInfo = "";
        //调用接口绑定
        this.bindReport();
      }
      this.value;
      console.log("确认");
    },
    bindReport() {
      //成功关闭
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribePatientController/receiveNnutrition",
          body: {
            number: this.value
            // type: this.type (作废)
          }
        })
        .then(res => {
          console.log("res" + res);
          if (res.data.code == "0000") {
            //绑定成功
            wx.closeWindow();
          } else {
            this.errorInfo = "方案码有误，请重新输入！";
          }
        })
        .catch(() => {
          this.$toast("接口异常");
        });
    }
  }
};
</script>

<style lang="less" scoped>
#getReport {
  height: 100%;
  background: url("../../assets/img/getReportBg.png");
  background-size: 268px 219px;
  background-repeat: no-repeat;
  background-position: center;
  .main {
    /*padding: 54px 20px 0;*/
    padding: 20px 15px 0;
    .title {
      line-height: 24px;
      text-align: center;
      font-size: 18px;
      color: @fontColor33;
    }
    .pass_box_all {
      padding-top: 20px;
      .pass_box {
        height: 70px;
        border-radius: 10px;
        border: 10px solid @mainColor;
        /deep/ .van-password-input {
          margin: 0;
          .van-password-input__security {
            border-radius: 10px;
            overflow: hidden;
          }
          .van-password-input__error-info {
            margin-top: 28px;
          }
        }
      }
    }
  }
  .foot {
    position: fixed;
    bottom: 10px;
    left: 12px;
    right: 12px;
    button {
      width: 100%;
      height: 44px;
      line-height: 44px;
      color: @fontColorff;
      font-size: 18px;
    }
  }
}
</style>
