/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: selectionScheme *
@function: * @date: 2019/11/28 * @time: 10:38 * * */
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

    <commonInsertOrUpdate
      v-model="show"
      @confirm="confirm"
      :status="status"
      :objData="objData"
    ></commonInsertOrUpdate>
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
      type: 0,
      objList: [],
      result: "",
      show: false, //方案删除修改展示与否
      status: 0, //方案删除0修改1
      objData: {}, //修改或删除的值
      nutritionreference: "" //疾病id
    };
  },
  computed: {
    ...mapState(["Doctor"])
  },
  components: {
    commonHeader,
    commonRadio,
    commonInsertOrUpdate
  },
  created() {
    this.id = sessionStorage.getItem("id");
    this.nutritionreference = this.$store.state.Doctor.nutritionreference;
    this.type = this.$route.query.val; //0系统推荐套餐 1医生经验套餐 2患者定制套餐方案
    this.title =
      this.type == 0
        ? "系统推荐套餐方案"
        : this.type == 1
        ? "医生经验套餐方案"
        : "患者定制套餐方案";
    this.headline = this.$route.query.name;
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
      console.log(this.result.id);
      //下一步,判断是系统推荐0||我的经验1||患者定制2
      if (this.type == 2) {
        //判断是否选择方案
        if (this.result.id == "" || this.result.id == undefined) {
          //还没选择
          this.$toast("您未选择疾病方案");
        } else {
          this.selectDeviceList(0);
        }
      } else {
        //判断是否选择方案
        if (this.result.id == "" || this.result.id == undefined) {
          //还没选择
          this.$toast("您未选择疾病方案");
        } else {
          this.selectDeviceList(2);
          // this.$http
          //   .request({
          //     method: "post",
          //     url:
          //       "/NNutritionPrescribeSchemeDoctorController/insertSubmission",
          //     body: {
          //       id: this.id,
          //       schemeDoctorId: this.result
          //     }
          //   })
          //   .then(res => {
          //     console.log(res.data);
          //     if (res.data.success) {
          //
          //     } else {
          //       this.$toast("疾病方案提交失败");
          //     }
          //   })
          //   .catch(error => {
          //     console.log("错误为" + error);
          //   });
        }
      }
    },
    selectDeviceList(type) {
      //查询是否有药柜
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/selectDeviceList",
          body: {
            type: 1
          }
        })
        .then(res => {
          console.log(res.data.data);
          if (res.data.success) {
            this.Doctor.proportion = {};
            if (res.data.data.length != 0) {
              //选完了 进行提交
              this.Doctor.proportion = type == 2 ? this.result : {};
              this.$store.commit("Doctor/planNutritionList", "");
              // if (type == 0) {
              this.$router.push({
                path: "/screeningReference",
                query: { type: this.type }
              });
              // } else {
              //
              //
              //
              //   this.$router.push({
              //     path: "/screeningReference",
              //     query: { type: this.type }
              //   }); //提交成功
              //   // this.$router.push({
              //   //   path: "/ProductSearch",
              //   //   query: { id: this.result, type: this.type }
              //   // }); //提交成功
              // }
            } else {
              this.$toast("您当前还未绑定智配柜，无法进行下一步操作");
            }
          } else {
            this.$toast(res.data.message);
          }
        })
        .catch(error => {
          this.$toast(error);
          console.log("错误为" + error);
        });
    },
    selectKey() {
      if (this.type == 2) {
        let obj = {
          id: 1,
          synopsis: "",
          name: "定制成品营养方案"
        };
        this.objList.push(obj);
        console.log(this.objList);
      } else {
        //获取系统方案列表或者医生自己方案
        let url =
          this.type == 0
            ? "/RNutritionPrescriptionController/selectIllid"
            : "NNutritionPrescribeSchemeDoctorController/selectAll";
        let id = this.type == 0 ? this.nutritionreference : this.id;
        this.$http
          .request({
            method: "get",
            url: url,
            body: {
              id: id
            }
          })
          .then(res => {
            console.log(res, "查询方案列表");
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
  padding-bottom: env(safe-area-inset-bottom);

  .top_box {
    width: 100%;
    height: 48px;
  }
  .max_main {
    position: absolute;
    top: 51px;
    left: 10px;
    bottom: 64px;
    right: 10px;

    .main {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      border-radius: 2.7vw;
      background: @backgroundColorff;
      /*padding: 15px 12px 17px 12px;*/
      .top {
        padding: 15px 12px 0;
        width: 100%;
        line-height: 22px;
        font-size: 16px;
        font-weight: bold;
        color: @fontColor33;
      }
      .box {
        flex: 1;
        // position: absolute;
        left: 10px;
        right: 10px;
        top: 42px;
        bottom: 80px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        /*border-radius: 2.7vw;*/

        &::-webkit-scrollbar {
          display: none !important;
          width: 0px;
          height: 0px;
        }
      }
    }
  }

  .foot {
    text-align: center;
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 10px;
    button {
      border-radius: 10px;
      width: 100%;
      height: 44px;
      line-height: 44px;
      color: @fontColorff;
    }
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-min-device-pixel-ratio: 2) {
  .foot {
    bottom: 20px;
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .foot {
    bottom: 54px;
  }
}
</style>
