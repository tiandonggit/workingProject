/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: selectIllness *
@function: 选择疾病 * @date: 2020/4/10 * @time: 13:53 * * */
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
            <van-dropdown-item
              v-model="value2"
              :options="option2"
              @change="onChange2"
            />
          </van-dropdown-menu>
        </div>
      </div>
      <div class="foot">
        <van-button type="default" @click="$throttle(onSubmitOne(0))"
          >系统推荐套餐方案</van-button
        >
        <van-button type="default" @click="$throttle(onSubmitOne(1))"
          >我的经验套餐方案</van-button
        >
        <van-button type="default" @click="$throttle(onSubmitOne(2))"
          >患者定制套餐方案</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
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
          console.log(res.data);
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {};
            obj.text = res.data.data[i].name;
            obj.value = res.data.data[i].id + "," + (i + 1);
            // if (val == 0) {
            this.option2.push(obj);
            // } else {
            // arr.push(obj);
            // }
          }
          // this.option2 = arr;
          this.illname = res.data.data[0].name;
          this.value2 = res.data.data[0].id +","+ "1";
          this.value = res.data.data[0].id;
          console.log(this.option2);
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    onChange2(e) {
      console.log(e);
      let arr = e.split(",");
      console.log(arr);
      this.illname = this.option2[arr[1]-1].text;
      this.value = arr[0];
      console.log(this.value);
      console.log(this.illname);
    },
    onSubmitOne(val) {
      console.log(val);
      //判断是否选择了疾病
      if (this.value2 == "null,0") {
        this.$toast("您还未选择疾病");
      } else {
        //提交疾病id
        this.$http
          .request({
            method: "post",
            url:
              "/NNutritionPrescribeDepartmentPatientController/insertOrUpdate",
            body: {
              npatientid: this.id,
              illid: this.value
            }
          })
          .then(res => {
            console.log(res.data);
            if (res.data.success) {
              //接口正常
              this.$store.commit("Doctor/nutritionreference", this.value);
              this.$router.push({
                path: "/selectionScheme",
                query: { name: this.illname, val: val }
              });
            } else {
              this.$toast(res.data.message);
            }
          })
          .catch(error => {
            this.$toast(error);
            console.log("错误为" + error);
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
#selectIllness {
  .main {
    padding: 58px 12px 20px;
    .box {
      .box_top {
        .van-dropdown-menu {
          border-radius: 10px;
          padding: 11px 10px;
          height: 46px;
          width: 351px;
          line-height: 24px;
          font-size: 16px;
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
              font-size: 16px;
              line-height: 24px;
              &::after {
                margin-top: -5px;
                width: 9px;
                height: 9px;
                border: 2px solid;
                border-color: transparent transparent currentColor currentColor;
                right: 5px;
                top: 30%;
              }
            }
            .van-dropdown-menu__title--down {
              color: @fontColor33 !important;
            }
            .van-dropdown-menu__title--down::after {
              margin-top: 3px;
            }
          }
          /deep/.van-overlay {
            background-color: rgba(0, 0, 0, 0);
          }
          /deep/.van-popup {
            width: 351px;
            margin: 1px 12px;
            background-color: unset;
            border-radius: 10px;
            .van-cell {
              .van-cell__title {
                color: @fontColor66 !important;
                font-size: 16px;
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
      .top_bottom {
      }
    }
    .foot {
      padding-top: 15px;
      button {
        margin-bottom: 15px;
        border-radius: 10px;
        border: 0px !important;
        width: 351px;
        background: @backgroundColorff !important;
        height: 46px;
        line-height: 46px;
        color: @mainColor;
        font-size: 18px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
