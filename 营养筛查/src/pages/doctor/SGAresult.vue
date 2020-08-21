<!--
* @description
* @fileName SGA综合评定结果.vue
* @author weixueyuan
* @date 2020/03/31 16:49:07
!-->
<template>
  <div id="SGAresult">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="sgarall">
      <div class="sgarpic" v-if="lv == 1"><img :src="pic1" /></div>
      <div class="sgarpic" v-else-if="lv == 2"><img :src="pic2" /></div>
      <div class="sgarpic" v-else-if="lv == 3"><img :src="pic3" /></div>
      <div class="sgarstatus" v-if="lv == 1">营养状态良好</div>
      <div class="sgarstatus" v-else-if="lv == 2">
        轻度营养不良或可疑营养不良
      </div>
      <div class="sgarstatus" v-else-if="lv == 3">严重营养不良</div>
      <div class="sgarnotice">与患者沟通进入营养治疗或结束治疗</div>
      <div class="sgarbut" @click="$throttle(tosgare)">查看评定详情</div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
export default {
  name: "SGAresult",
  data() {
    return {
      title: "SGA综合评定结果",
      customTitle: "营养诊断",
      pic1: require("../../assets/img/SGAA.png"),
      pic2: require("../../assets/img/SGAB.png"),
      pic3: require("../../assets/img/SGAC.png"),
      lv: 0,
      word: "",
    };
  },

  components: {
    commonHeader
  },
  created() {
    if (this.$route.query.sgaScore > 0 && this.$route.query.sgaScore <= 3) {
      this.lv = 1;
    } else if (
      this.$route.query.sgaScore > 3 &&
      this.$route.query.sgaScore <= 8
    ) {
      this.lv = 2;
    } else if (this.$route.query.sgaScore > 8) {
      this.lv = 3;
    }
  },

  computed: {},

  mounted() {},

  methods: {
    tosgare() {
      if (this.lv == 1) {
        this.word = "A";
      } else if (this.lv == 2) {
        this.word = "B";
      } else if (this.lv == 3) {
        this.word = "C";
      }
      this.$router.push({
        name: "SGAEvaluateResults",
        query: { word: this.word },
      });
    },
  },
};
</script>

<style lang="less" scoped>
#SGAresult {
  padding: 0px;
  width: 100%;
  height: 100%;
  .sgarall {
    width: 351px;
    height: 100%;
    margin: 0 auto;
    padding-top: 48px;
    display: flex;
    align-items: center;
    flex-direction: column;

    .sgarpic {
      width: 201px;
      height: 201px;
      margin-top: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .sgarstatus {
      color: #333;
      margin-top: 39px;
      font-size: 18px;
      font-weight: bold;
    }
    .sgarnotice {
      color: #999999;
      margin-top: 11px;
      font-size: 16px;
    }
    .sgarbut {
      width: 351px;
      height: 44px;
      color: #ffffff;
      font-size: 18px;
      text-align: center;
      line-height: 44px;
      background: linear-gradient(
        225deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%
      );
      border-radius: 10px;
      position: absolute;
      bottom: 20px;
    }
  }
}
</style>
