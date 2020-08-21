/* * @Author: 张松仁 * @Last Modified by: 张松仁 * @name: selectDoctor *
@function: * @date: 2019/12/7 * @time: 9:09 * * */
<template>
  <div id="selectDoctor">
    <commonHeader
      :left="true"
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="false"
      :title="title"
    ></commonHeader>
    <div class="main">
      <div class="top">
        <div class="top_title">
          请选择本次{{Patient.prestype == 1?"诊断":"筛查"}}患者的主治医生
        </div>
        <div class="tag_border"></div>
        <div class="top_select">
          <div class="prsemm">
            <van-search
              placeholder="请输入医生姓名关键字"
              @input="search"
              v-model="searchData"
            />
          </div>
        </div>
      </div>
      <div class="box">
        <div
          class="personal"
          v-if="Patient.isDoc"
          @click="onSumbit(personal)"
        >
          <div class="box_top">
            <div class="box_name">
              {{ personal.docName }}
            </div>
            <div class="box_personal">
              <div>
                本人
              </div>
            </div>
            <div class="box_grade">
              {{ personal.titleName }}
            </div>
            <div class="box_department">
              {{ personal.depName }}
            </div>
          </div>
          <div class="box_bottom">
            <div class="box_hospital">
              {{ personal.hosName }}
            </div>
          </div>
        </div>
        <div
          class="box_list"
          v-for="(item, index) in objData"
          :key="index"
          @click="onSumbit(item)"
        >
          <div class="box_top">
            <div class="box_name">
              {{ item.docName || item.doctorname }}
            </div>
            <div class="box_grade">
              {{ item.titleName || item.doctorposition }}
            </div>
            <div class="box_department">
              {{ item.depName || item.departmentname }}
            </div>
          </div>
          <div class="box_bottom">
            <div class="box_hospital">
              {{ item.hosName || item.hospitalname }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import commonHeader from "@/components/commonHeader/common_header.vue";
import { mapState } from "vuex";
export default {
  name: "selectDoctor",
  computed: {
    ...mapState(["Patient"])
  },
  data() {
    return {
      title: "主治医生选择",
      customTitle: "营养风险筛查",
      personal: {}, //本人信息
      objData: [], //其他医生信息
      searchData: "",
      id: 0,
      isDoc: true //是否是医生
    };
  },
  components: {
    commonHeader
  },
  created() {
    if (typeof this.$route.query.prestype != "undefined") {
      this.Patient.prestype = this.$route.query.prestype;
      if (this.Patient.prestype == 1) {
        this.customTitle = "营养风险诊断"
      }
    } else {
      this.Patient.prestype = 0;
    }
    console.log(this.Patient.prestype);
    console.log(typeof this.$route.query.type,"type");
    window.sessionStorage.clear("id");
    console.log(this.Patient.isDoc, "这个");
    this.isDoc = this.Patient.isDoc;
    if (this.isDoc) {
      //说明是医生 查询医生自己的信息
      console.log("我是医生");
      this.selectPersonal();
      //查询其他医生的信息
      this.selectDoctor();
    } else {
      console.log("我是患者");
      this.selectDoctor();
      //
    }
  },
  // mounted() {},
  methods: {
    selectPersonal() {
      //查询自己的信息
      this.$http
        .request({
          method: "get",
          url: "/RDoctorController/selectDoctor"
          // body: {
          //   id: "467756267025338406" // 临时测试账号
          // }
        })
        .then(res => {
          console.log(res.data.data.data);
          this.personal = res.data.data.data;
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    search() {
      //通过医生名字进行医生搜索
      this.selectDoctor();
      // if (this.searchData === "" || typeof this.searchData == "undefined") {
      //   this.objData = [];
      //   // this.$toast("请输入关键字进行查询");
      // } else {
      //
      // }
      // console.log(this.list);
    },
    selectDoctor() {
      //通过医生名字搜索医生
      let data = {};
      let url = this.isDoc
        ? "/RDoctorController/selectName"
        : "/RReportController/selectPatientDoc";
      this.isDoc
        ? (data.name = this.searchData)
        : this.searchData == ""
        ? ""
        : (data.docname = this.searchData);
      this.$http
        .request({
          method: "get",
          url: url,
          body: data
        })
        .then(res => {
          console.log(res.data);
          this.objData = res.data.data;
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    onSumbit(item) {
      console.log(item);
      // return;
      this.id = this.Patient.isDoc ? item.docId : item.id;
      this.dialog();
      console.log(this.id,"thisid");
    },
    dialog() {
      Dialog.confirm({
        title: "操作提示",
        message: "是否确认选择？"
      })
        .then(() => {
          window.sessionStorage.setItem("pid", this.id);
          this.$router.push({ name: "inputPerson" }); //提交成功
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
#selectDoctor {
  // height: 100%;
  background: @backcolor;
  .main {
    height: 100%;
    overflow-y: auto;
    padding: 16px 0;
    .top {
      background: @backgroundColorff;
      position: absolute;
      width: 94%;
      margin: 0 auto;
      margin-left: 3%;
      margin-right: 3%;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-top-left-radius: 2.7vw;
      border-top-right-radius: 2.7vw;
      .tag_border {
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .top_title {
        padding: 17px 10px;
        color: @fontColor33;
        font-size: 16px;
        line-height: 25px;
        font-weight: bold;
      }
      .top_select {
        margin-top: 15px;
        .prsemm {
          width: 92%;
          margin: 0 auto;
          /deep/ .van-icon-search {
            color: @backgroundColorcc;
          }
          /deep/.van-search,
          .van-cell {
            height: 34px;
            padding: 0;
            line-height: 34px;
            font-size: 14px;
            color: @backgroundColorcc;
            border-radius: 6px;
            overflow: hidden;
            .van-cell__value {
              .van-field__body {
                input {
                  line-height: 22px;
                  padding: 6px 0;
                }
                input::-webkit-input-placeholder {
                  /* WebKit browsers */
                  color: @backgroundColorcc;
                }
                input:-moz-placeholder {
                  /* Mozilla Firefox 4 to 18 */
                  color: @backgroundColorcc;
                }
                input::-moz-placeholder {
                  /* Mozilla Firefox 19+ */
                  color: @backgroundColorcc;
                }
                input:-ms-input-placeholder {
                  /* Internet Explorer 10+ */
                  color: @backgroundColorcc;
                }
              }
            }
          }
          .van-search__content {
            width: 315px;
            padding: 0 9px 0 9px;
          }
        }
      }
    }
    .box {
      width: 94%;
      margin-left: 3%;
      margin-right: 3%;
      padding-top: 124px;
      /*height: 100%;*/
      border-bottom-left-radius: 2.7vw;
      border-bottom-right-radius: 2.7vw;
      overflow: hidden;
      .personal,
      .box_list {
        background-color: @backgroundColorff;
        padding: 15px 0;
        border-bottom: 1px solid @backcolor;
      }
      .box_top {
        padding-left: 10px;
        padding-bottom: 15px;
        line-height: 22px;
        display: flex;
        align-items: center;
        .box_name,
        .box_grade,
        .box_department {
          font-size: 16px;
          color: @fontColor33;
        }
        .box_personal {
          div {
            font-size: 14px;
            width: 38px;
            height: 20px;
            color: @fontColorff;
            text-align: center;
            line-height: 20px;
            border-radius: 4px 4px 4px 4px;
            background: linear-gradient(
              226deg,
              rgba(255, 146, 0, 1) 0%,
              rgba(255, 89, 0, 1) 100%
            );
          }
        }
        .box_personal {
          padding: 0 10px 0 8px;
        }
        .box_grade,
        .box_department {
          color: @fontColor66;
          padding: 0 10px;
        }
      }
      .box_bottom {
        margin-left: 10px;
        line-height: 20px;
        font-size: 14px;
        color: @fontColor33;
      }
    }
  }
}
</style>
