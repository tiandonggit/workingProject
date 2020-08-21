/** *@desc 营养个体化方案(所需营养筛选) *@author 张松仁 *@date 2019/10/29
16:49:46 */
<template>
  <div class="needNutrition">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="main">
      <div class="top">
        <div class="top_title">
					营养参考建议
        </div>
        <div class="tag_border"></div>
        <div class="top_content">
        {{ attention?attention: "无" }}
        </div>
      </div>
      <div class="content">
        <div class="content_box">
<!--          <div class="content_box_top">-->
<!--            所需营养筛选-->
<!--          </div>-->
          <div
            class="content_box_list"
            v-for="(item, index) in objData"
            :key="index"
          >
            <div class="content_box_list_title">
              {{ index + 1 }}.{{ item.propertyname }}
              <span>
                {{ item.issingle == 1 ? "(单选)" : "(多选)" }}
              </span>
<!--              <span-->
<!--                v-if="item.issingle == 1"-->
<!--                class="hint"-->
<!--                v-show="keys ? result[index].propetyvalues === '' : false"-->
<!--                >*</span-->
<!--              >-->
<!--              <span-->
<!--                v-else-->
<!--                class="hint"-->
<!--                v-show="keys ? result[index].propetyvalues.length == 0 : false"-->
<!--                >*</span-->
<!--              >-->
            </div>

            <div class="content_box_list_content" v-if="item.issingle == 1">
              <van-radio-group v-model="result[index].propetyvalues">
                <van-radio
                  v-for="(item2, index2) in item.pPropertyValue"
                  :key="index2"
                  :name="index2"
                  >{{ item2.propertyvalue }}</van-radio
                >
              </van-radio-group>
            </div>
            <div class="content_box_list_content" v-else>
              <van-checkbox-group v-model="result[index].propetyvalues">
                <van-checkbox
                  v-for="(item3, index3) in item.pPropertyValue"
                  :key="index3"
                  :name="index3"
                  >{{ item3.propertyvalue }}</van-checkbox
                >
              </van-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <div class="foot">
        <van-button type="default" @click="$throttle(onSubmit)"
          >下一步</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";

export default {
  name: "needNutrition",
  data() {
    return {
      title: "定制成品套餐方案",
      customTitle: "营养方案",
      objData: [],
      result: [],
      result2: [],
      id: 0,
      keys: false,
      attention: ""
    };
  },
  components: {
    commonHeader
  },
  created() {
    this.onSelectAll();
    this.id = sessionStorage.getItem("id");
    this.attention = this.$store.state.Patient.attention;
    console.log(this.$store.state.Patient.attention);
  },
  methods: {
    onSubmit() {
      //提交验证
      //调用接口判断是否有药柜
      this.$http
        .request({
          method: "get",
          url: "/NNutritionPrescribeGoodsController/selectDeviceList",
          body: {
            id: this.id
          }
        })
        .then(res => {
          console.log(res.data.data);
          if (res.data.success) {
            //有药柜
            if (res.data.data.length != 0) {
              let key = true;
              this.keys = true;
              for (let i = 0; i < this.result.length; i++) {
                if (this.result[i].propetyvalues.length != 0) {
                  key = false;
                }
              }
              if (!key) {
                // console.log(this.result);
                // console.log(this.objData);

                //验证通过数据重组,并提交
                for (let i = 0; i < this.result.length; i++) {
                  // console.log(i + "i");
                  let index = this.result[i].propetyvalues;
                  index = index.toString();
                  // console.log(index + "选项");
                  if (index == "") {
                    continue;
                  } else if (index.indexOf(",") == -1) {
                    //单选
                    // console.log(this.objData[i].pPropertyValue[index].id)
                    this.result2[i].propetyvalues = this.objData[i].pPropertyValue[
                      index
                      ].id;
                    this.result2[i].propetynames = this.objData[i].pPropertyValue[
                      index
                      ].propertyvalue;
                  } else {
                    //多选
                    let str = "";
                    let str2 = "";
                    index = index.split(",");
                    for (let k = 0; k < index.length; k++) {
                      if (k == index.length - 1) {
                        str += this.objData[i].pPropertyValue[index[k]].id;
                        str2 += this.objData[i].pPropertyValue[index[k]].propertyvalue;
                      } else {
                        str += this.objData[i].pPropertyValue[index[k]].id + ",";
                        str2 +=
                          this.objData[i].pPropertyValue[index[k]].propertyvalue + "、";
                      }
                    }
                    this.result2[i].propetyvalues = str;
                    this.result2[i].propetynames = str2;
                  }
                }
                this.onInsertAll();
              } else {
                this.$toast("您必须选择一项");
              }
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
    onInsertAll() {
      for (let i = this.result2.length-1; i >= 0 ; i--) {
        console.log(i);
        console.log(this.result2[i]);
        console.log(this.result2[i].propetyvalues.length);

        if (this.result2[i].propetyvalues.length == 0) {
          this.result2.splice(i,1);
        }
      }
      console.log(this.result2);
      //提交保存
      this.$http
        .request({
          method: "post",
          url: "/NNutritionPrescribePlanController/insertAll",
          body: {
            list: JSON.stringify(this.result2)
          }
        })

        .then(res => {
          console.log(res.data);
          if (res.data.success) {
            this.$store.commit("Doctor/planNutritionList", "");
            this.$router.push({ path: "/ProductSearch" });
          } else {
            //失败
            this.$toast(res.data.total);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    onSelectAll() {
      //查询筛选条件
      this.$http
        .request({
          method: "get",
          url: "/PPropertyController/selectAll",
          body: {}
        })
        .then(res => {
          this.objData = res.data.data;
          for (let i = 0; i < this.objData.length; i++) {
            let obj = {};
            obj.propertyid = this.objData[i].id;
            if (this.objData[i].issingle == 1) {
              obj.propetyvalues = "";
            } else {
              obj.propetyvalues = [];
            }
            obj.propetynames = "";
            obj.npatientid = this.id;
            obj.propetytype = this.objData[i].type.toString();
            obj.pname = this.objData[i].propertyname;
            this.result.push(obj);
          }
          this.result2 = JSON.parse(JSON.stringify(this.result));
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    }
  }
};
</script>

<style scoped lang="less">
.needNutrition {
  .main {
      /deep/  .van-radio, .van-checkbox {
    margin-top: 4px;
}
    padding: 58px 12px 20px;
    .top {
      background: @backgroundColorff;
      border-radius: 10px;
      padding: 12px 0px;
      .tag_border {
        width: 100%;
        margin-top: 14px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .top_title {
        font-size: 18px;
        line-height: 20px;
        color: @fontColor33;
        text-align: center;
      }
      .top_content {
        font-size: 16px;
        line-height: 22px;
        color: @fontColor66;
        padding-top: 10px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .content {
      padding-top: 10px;
      .content_box {
        background: @backgroundColorff;
        border-radius: 10px;
        .content_box_top {
          font-size: 18px;
          line-height: 20px;
          color: @fontColor33;
          text-align: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .content_box_list {
          padding: 14px 10px 9px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          color: @fontColor66;
          .content_box_list_title {
            font-size: 16px;
            line-height: 16px;
            span {
              font-size: 16px;
              color: @mainColor;
            }
            .hint {
              color: @fontColorRed;
            }
          }
          .content_box_list_content {
            padding-top: 3px;
            font-size: 14px;
            .van-radio-group {
              .van-radio {
                height: 32px;
                /deep/ .van-radio__icon {
                  /deep/ .van-icon {
                    font-size: 12px;
                  }
                }
                /deep/ .van-radio__label {
                  color: @fontColor66;
                  line-height: 20px;
                  font-size: 16px;
                }
                 /deep/ .van-radio__icon .van-icon{
                  width: 20px;
                  height: 20px;
                   }
                   /deep/ .van-radio{
                    margin-top: 15px;
                }
              }
            }
            .van-checkbox-group {
              .van-checkbox {
                height: 32px;
                /deep/ .van-checkbox__icon {
                  /deep/ .van-icon {
                    font-size: 12px;
                  }
                }
                /deep/ .van-checkbox__label {
                  color: @fontColor66;
                  line-height: 14px;
                  font-size: 14px;
                }
                  /deep/ .van-checkbox__icon .van-icon{
                  width: 20px;
                  height: 20px;
                   }
                   /deep/ .van-radio{
                    margin-top: 15px;
                }
              }
            }
          }
        }
      }
    }
    .foot {
      padding-top: 20px;
      button {
        border-radius: 6px;
        width: 351px;
        height: 44px;
        line-height: 44px;
        color: @fontColorff;
      }
    }
  }
}
</style>
