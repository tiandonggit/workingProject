/*
 * @Author: 田东 
 * @Date: 2019-05-09 11:35:20 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-05-09 14:48:29
 */
 
<template>
  <div class="next_button" :style="[buttonClass]" @click="btnClick()">
    <a>{{buttonText}}</a>
  </div>
</template>
<script>
import Vue from "vue";
import { Button } from "vant";
Vue.use(Button);

export default {
  name: "v-button",
  props: {
    buttonText: {
      default: "文字", // 按钮文字显示
      type: String
    },
    buttonClass: {
      default: function() {
        return {
          // backgroundColor: '#ffffff',
        };
      }, //自定义属性
      type: Object
    }
  },
  data() {
    return {};
  },
  components: {},
  created() {
    document.buttonText = this.buttonText;
  },
  mounted() {},
  methods: {
    btnClick() {
      this.$emit("callFather");
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

.next_button {
  width: 93.3vw;
  height: 10.7vw;
  line-height: 10.7vw;
  text-align: center;
  background: @mainColor;
  margin: 0 auto;
  border-radius: 2.7vw;

  a {
    .fontSize(15);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: @fontOne;
  }
}
</style>
