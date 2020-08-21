<template>
  <div id="cabinet">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="cabinet_box">
      <div class="list_box">
        <div
          class="tag"
          v-for="(item, index) in list"
          :key="index"
          @click="$throttle(returngo(item.deviceCode,item.deviceId))"
        >
          <img :src="pic" class="tu" />
          <div class="imptext">
            <div class="cab_name">{{item.deviceName}}{{item.deviceCode}}</div>
            <div class="cab_body">{{item.deviceFullAdress}}</div>
          </div>
          <div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { mapState } from "vuex";
export default {
  name: "cabinet",
  components: {
    commonHeader
  },
  computed: {
    ...mapState(["Doctor"])
  },
  data() {
    return {
      title: "选择智配柜",
      customTitle: "智配柜",
      pic: require("../../assets/img/vendingMachine1.png"),
      list: []
    };
  },
  created() {
    this.cabList();
  },
  methods: {
    cabList() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/selectDeviceList",
          body: {
            type: 1
          }
        })
        .then(res => {
          console.log(res);
          this.list = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    returngo(key1, key2) {
      let planNutritionListVuex = this.Doctor.planNutritionList;
      planNutritionListVuex.deviceCode = key1;
      if(this.Doctor.planNutritionList.deviceId !== key2) { 
        planNutritionListVuex.deviceId = key2;
        planNutritionListVuex.isChangeDevice = true;
      }
      this.$store.commit("Doctor/planNutritionList", planNutritionListVuex);
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="less">
.cabinet_box {
  padding: 1px 12px 0px;
  .list_box {
    margin-top: 48px;
  }
  .tag {
    margin-top: 15px;
    &:last-child {
      margin-bottom: 0px;
    }
    width: 350px;
    min-height: 80px;
    background: @fontColorff;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 7.5px 8px 7.5px 10px;
    margin-bottom: 10px;
    .imptext {
      width: 70%;
      margin-left: 10px;
      overflow: hidden;
      /*white-space: nowrap;*/
      /*text-overflow: ellipsis;*/
      .cab_name {
        font-size: 16px;
        font-weight: bold;
        color: @fontColor33;
        margin: 0px 0px 14px;
        width: 95%;
        /*overflow: hidden;*/
        /*white-space: nowrap;*/
        /*text-overflow: ellipsis;*/
        line-height: 18px;
      }
      .cab_body {
        width: 95%;
        font-size: 14px;
        color: @fontColor99;
        /*overflow: hidden;*/
        /*white-space: nowrap;*/
        /*text-overflow: ellipsis;*/
      }
    }
    .tu {
      width: 64px;
      height: 60px;
    }
  }
}
</style>
