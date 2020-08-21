<template>
  <div id="selectionScheme">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="top_box"></div>
    <div class="max_main">
      <div class="main">
        <div class="top">{{ headline }}选择：</div>
        <div class="box">
          <commonRadio
            :objList="objList"
            v-model="result"
            :update="type == 1 ? true : false"
            @onDelect="onDelect"
            @onUpdate="onUpdate"
          ></commonRadio>
        </div>
      </div>
    </div>

    <div class="foot">
      <van-button type="default" @click="$throttle(onNext)">下一步</van-button>
    </div>

    <commonInsertOrUpdate v-model="show" @confirm="confirm" :status="status" :objData="objData"></commonInsertOrUpdate>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import commonRadio from "@/components/commonRadio/commonRadio.vue";
import commonInsertOrUpdate from "@/components/commonInsertOrUpdate/commonInsertOrUpdate.vue";
import { mapState } from "vuex";
export default {
  name: "selectionScheme",
  data() {
    return {
      title: "方案选择",
      customTitle: "营养方案",
      headline: "",
      id: 0,
      objList: [],
      result: "",
      show: false, //方案删除修改展示与否
      status: 0, //方案删除0修改1
      objData: {}, //修改或删除的值
      nutritionreference: "" //疾病id
    };
  },
  computed: {
    ...mapState(["DoctorIM"])
  },
  components: {
    commonHeader,
    commonRadio,
    commonInsertOrUpdate
  },
  created() {
    this.id = this.DoctorIM.planProductList.illId;
    this.type = this.DoctorIM.planProductList.planType; //0系统推荐套餐 1医生经验套餐
    this.title = this.type == 0 ? "系统推荐套餐方案" : "我的经验套餐方案";
    this.headline = this.DoctorIM.planProductList.illname;
    this.selectKey();
  },
  mounted() {},
  methods: {
    confirm(e) {
      console.log("点击确定触发", e);
      //访问接口执行删除或修改
      this.$http
        .request({
          method: "post",
          url: "/NNutritionPrescribeSchemeDoctorController/insertOrUpdate",
          body: {
            id: e.id,
            status: this.status,
            name: e.name,
            synopsis: e.synopsis
          }
        })
        .then(res => {
          console.log(res.data);
          if (this.status == 0) {
            if (res.data.success) {
              this.$toast("删除成功");
              this.objList.splice(e.key, 1);
            } else {
              this.$toast("删除失败");
            }
          } else {
            if (res.data.success) {
              this.objList[e.key].synopsis = e.synopsis;
              this.objList[e.key].name = e.name;
              this.$toast("修改成功");
            } else {
              this.$toast("修改失败");
            }
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    onDelect(e) {
      this.show = true;
      this.status = 0;
      this.objData = e;
      console.log("删除", e, this.show);
    },
    insertOrUpdate(e, status) {},
    onUpdate(e) {
      this.show = true;
      this.status = 1;
      this.objData = e;
      console.log("修改", e, this.show);
    },
    onNext() {
      console.log(this.result);
      //判断是否选择方案
      if (this.result == "") {
        //还没选择
        this.$toast("您未选择疾病方案");
      } else {
        //选完了 进行提交
        let planProductListVuex = JSON.parse(
          JSON.stringify(this.DoctorIM.planProductList)
        );
        planProductListVuex.goods = [];
        planProductListVuex.planId = this.result;
        this.$store.commit("DoctorIM/savePlanProductList", planProductListVuex);
        this.$router.push({
          name: "docPlanProductList"
        });
      }
    },
    selectKey() {
      //获取系统方案列表或者医生自己方案
      let url =
        this.type == 0
          ? "/RNutritionPrescriptionController/selectIllid"
          : "/NNutritionPrescribeSchemeDoctorController/selectIllid";
      this.$http
        .request({
          method: "get",
          url: url,
          body: {
            id: this.id
          }
        })
        .then(res => {
          this.objList = res.data.data;
          if (res.data.data.length == 0) {
            this.$toast("暂无此方案");
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
body,
html {
  overflow: hidden;
}
#selectionScheme {
  overflow-y: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  .top_box {
    width: 100%;
    .height(48);
  }
  .max_main {
    position: absolute;
    top: 13.6vw;
    left: 2.7vw;
    bottom: 17.1vw;
    right: 2.7vw;

    .main {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      border-radius: 2.7vw;
      background: @backgroundColorff;
      .top {
        .padding(15, 12, 0, 12);
        // width: 100%;
        .lineHeight(22);
        .fontSize(16);
        font-weight: bold;
        color: @fontColor33;
      }
      .box {
        flex: 1;
        // position: absolute;
        left: 2.7vw;
        right: 2.7vw;
        top: 11.2vw;
        bottom: 21.3vw;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        /*border-radius: 2.7vw;*/

        &::-webkit-scrollbar {
          display: none !important;
          width: 0;
          height: 0;
        }
      }
    }
  }

  .foot {
    text-align: center;
    position: absolute;
    left: 3.2vw;
    right: 3.2vw;
    bottom: 2.7vw;

    button {
      background: linear-gradient(
        52deg,
        @startColor 0%,
        @endColor 100%
      ) !important;
      border: 1px solid @mainColor;
      .borderRadius(10, 10, 10, 10);
      width: 100%;
      .height(44);
      .lineHeight(44);
      color: @fontColorff;

      span {
        .fontSize(18);
        font-weight: bold;
        color: @fontColorff;
        .lineHeight(43);
      }
    }
  }
}
</style>
