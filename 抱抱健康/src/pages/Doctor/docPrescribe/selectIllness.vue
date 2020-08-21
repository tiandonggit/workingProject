<template>
  <div id="selectIllness">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="main">
      <div class="box">
        <div class="box_top">
          <van-dropdown-menu>
            <van-dropdown-item v-model="value2" :options="option2" @change="onChange2" />
          </van-dropdown-menu>
        </div>
      </div>
      <div class="foot">
        <van-button type="default" @click="onSubmitOne(0)">系统推荐套餐方案</van-button>
        <van-button type="default" @click="onSubmitOne(1)">我的经验套餐方案</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { mapState } from "vuex";
export default {
  name: "selectIllness",
  data() {
    return {
      title: "营养方案选择",
      customTitle: "营养方案",
      id: "", //处方id
      value2: "null,0", //疾病选项结果
      illname: "", //疾病名称
      value: 0, //疾病id
      option2: [] //疾病选项
    };
  },
  computed: {
    ...mapState(["DoctorIM"])
  },
  components: {
    commonHeader
  },
  created() {
    this.id = sessionStorage.getItem("id");
    this.selectByExample();
  },
  mounted() {},
  methods: {
    selectByExample() {
      //查询科系与疾病列表
      this.$http
        .request({
          method: "get",
          url: "/RIllnessController/selectDoctorIll",
          body: {}
        })
        .then(res => {
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {};
            obj.text = res.data.data[i].name;
            obj.value = res.data.data[i].id + "," + (i + 1);
            this.option2.push(obj);
          }
          // this.option2 = arr;
          this.illname = res.data.data[0].name;
          this.value2 = res.data.data[0].id + "," + "1";
          this.value = res.data.data[0].id;
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    onChange2(e) {
      let arr = e.split(",");
      this.illname = this.option2[arr[1] - 1].text;
      this.value = arr[0];
    },
    onSubmitOne(val) {
      console.log(val);
      //判断是否选择了疾病
      if (this.value2 == "null,0") {
        this.$toast("您还未选择疾病");
      } else {
        let planProductListVuex = JSON.parse(
          JSON.stringify(this.DoctorIM.planProductList)
        );
        planProductListVuex.illname = this.illname;
        planProductListVuex.illId = this.value;
        planProductListVuex.planType = val;
        this.$store.commit("DoctorIM/savePlanProductList", planProductListVuex);
        this.$router.push({
          path: "/selectionScheme"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
#selectIllness {
  .main {
    .padding(58, 12, 20, 12);
    .box {
      .box_top {
        .van-dropdown-menu {
          .borderRadius(10, 10, 10, 10);
          .padding(11, 10, 11, 10);
          .height(46);
          box-sizing: border-box;
          // width: 351px;
          .lineHeight(24);
          .fontSize(16);
          color: @fontColor33;
          display: flex;
          justify-content: space-between;
          align-items: center;
          /deep/ .van-dropdown-menu__item {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .van-dropdown-menu__title {
              padding: 0;
              width: 100%;
              color: @fontColor33;
              .fontSize(16);
              .lineHeight(24);
              &::after {
                margin-top: -1.3vw;
                .width(9);
                .height(9);
                border: 2px solid;
                border-color: transparent transparent currentColor currentColor;
                right: 1.3vw;
                top: 30%;
              }
            }
            .van-dropdown-menu__title--down {
              color: @fontColor33 !important;
            }
            .van-dropdown-menu__title--down::after {
              .margin(3, 0, 0, 0);
            }
          }
          /deep/.van-overlay {
            background-color: rgba(0, 0, 0, 0);
          }
          /deep/.van-popup {
            .width(351);
            .margin(1, 12, 1, 12);
            background-color: unset;
            .borderRadius(10, 10, 10, 10);
            .van-cell {
              .van-cell__title {
                color: @fontColor66 !important;
                .fontSize(16);
              }
              .van-icon {
                color: @fontColor66 !important;
              }
              .van-icon-success:before {
                content: "";
              }
            }
            .van-cell:not(:last-child)::after {
              left: 0;
            }
          }
        }
      }
    }
    .foot {
      .padding(15, 0, 0, 0);
      button {
        .margin(0, 0, 15, 0);
        .borderRadius(10, 10, 10, 10);
        border: 0 !important;
        .width(351);
        background: @backgroundColorff !important;
        .height(46);
        .lineHeight(46);
        color: @mainColor;
        .fontSize(18);
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
