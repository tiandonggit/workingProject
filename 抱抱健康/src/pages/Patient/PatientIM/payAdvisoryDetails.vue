/**
*@desc 付费咨询医生回复
*@author houpai
*@date 2020/01/08 16:47:12
*/
<template>
  <div id="payAdvisoryDetails">
    <common-header
        :share-disabled="true"
        :title="'付费咨询'"
        header-show="true"
        :rightContent=" '¥' + (consultDetail.tarrif / 100).toFixed(2)"
        :rightClass="{'color':'#FF3000'}"
        :custom-title="'咨询管理'"></common-header>
    <div class="card_box">
      <div class="title des_title">
        <img src="../../../assets/images/patientInfo.png" alt="">
        患者信息
      </div>
      <div class="content">
        <p>
          基本信息：{{ personInfo.name }} | {{ personInfo.sexDesc }} |
          {{ personInfo.age }}岁
        </p>
        <p>患病时长：{{ illnessdurationDes }}</p>
        <p>
          过敏史：{{ personInfo.irritability ? personInfo.irritability : "无" }}
        </p>
        <p>过往病史：{{ personInfo.illness ? personInfo.illness : "无" }}</p>
        <p>
          家族病史：{{ personInfo.inheritance ? personInfo.inheritance : "无" }}
        </p>
      </div>
    </div>


    <div class="card_box">
      <div class="title des_title">
        <img src="../../../assets/images/diseaseInfo.png" alt="">
        病情描述
      </div>
      <div class="content images_box">
        <p class="des_details">{{ consultDetail.illnessdesc }}</p>
        <div class="item_cell"
             v-for="(img, key) in consultDetail.imageList"
             :key="key">
          <div class="cell photo"
               @click="imagesPreview(key)"
               :style="'background-image: url(' + img + ')'">
            <!-- <img class="img" :src="img + '?x-oss-process=image/resize,l_200'" alt /> -->
          </div>
        </div>
      </div>
    </div>

    <div class="card_box" v-if="consultDetail.status === 2">
      <div class="title des_title">
        <img src="../../../assets/images/huifu.png" alt="">
        医生回复
      </div>
      <div class="content">
        <p class="des_details">{{ consultDetail.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from "vue"
  import {ImagePreview, Toast} from "vant"

  Vue.use(ImagePreview)
  import fly from "flyio"
  import {mapState} from "vuex"

  import commonHeader from "../../../components/commonHeader/common_header"

  export default {
    name: "payAdvisoryDetails",
    components: {
      commonHeader
    },
    data() {
      return {
        actions: [
          {name: ">1天", key: 1},
          {name: "1天 — 1周", key: 2},
          {name: "1周 — 1个月", key: 3},
          {name: "1个月 — 3个月", key: 4},
          {name: "3个月以上", key: 5}
        ],
        illnessdurationDes: "",
        payConsultId: "", // 咨询ID
        personInfo: "",
        consultDetail: "" // 咨询详情
      }
    },
    created() {
      this.personInfo = this.PatientIM.patientMessage
      this.personInfo.sexDesc = this.personInfo.sex == "1" ? "男" : this.personInfo.sex == "2" ? "女" : " "
      this.payConsultId = this.$route.query.payConsultId ? this.$route.query.payConsultId : ""
      this.getConsultDetail()
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    methods: {
      getConsultDetail() {
        this.$http.request({
          method: "get",
          url: "/RPayConsultController/getConsultDetail",
          body: {payConsultId: this.payConsultId}
        }).then(res => {
          if (res.data.success) {
            this.consultDetail = res.data.data
            this.actions.forEach((v, e) => {
              if (v.key === this.consultDetail.illnessduration) {
                this.illnessdurationDes = v.name
              }
            })
          } else {
            Toast(res.data.message)
          }
        }).catch(error => {
          Toast({
            message: "无法连接服务",
            position: "bottom"
          })
        })
      },

      imagesPreview(key) {
        ImagePreview({
          images: this.consultDetail.imageList,
          startPosition: key
        })
      }
    }
  }
</script>

<style scoped lang="less">
  #payAdvisoryDetails {
    background: @backgroundColor;
    box-sizing: border-box;
    .padding(44, 12, 44, 12);

    .card_box {
      .margin(20);
      .borderRadius(10, 10, 10, 10);
      background: @backgroundColorT;
      .padding(10, 10, 10, 10);
      box-sizing: border-box;


      .des_title {
        padding-bottom: 15px;
        display: flex;
        align-items: center;
        .fontSize(18);
        .lineHeight(22);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);

        img {
          display: block;
          width: 20px;
          height: 20px;
          .margin(0, 10, 0, 0);
        }

        .diseaseCase_desc {
          color: #999999;
          .fontSize(16);
          .margin(0, 0, 0, 10)
        }
      }

      .des_details {
        word-break: break-all;
        .fontSize(16);
        .lineHeight(20);
        width: 100%;
        /*<!--min-height: 100 / 375 * 100vw;-->*/
        border: none;
      }

      .images_box {

        .item_cell {
          width: 33%;
          display: inline-block;
          text-align: center;
          .margin(0, 0, 12, 0);

          input {
            display: none;
          }
        }

        .cell {
          .width(78);
          .height(78);
          display: inline-block;
          vertical-align: bottom;

          div {
            border: 2px dashed @payAdvisoryBordercolor;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .iconfont {
              .fontSize(36);
              color: @payAdvisoryIconColor;
            }
          }
        }

        .photo {
          background-position: center center;
          background-repeat: no-repeat;
          background-size: cover;
          .borderRadius(8, 8, 8, 8);
          overflow: hidden;
          position: relative;

          .iconfont {
            position: absolute;
            top: 0;
            right: 0;
          }

          .img {
            width: 100%;
          }
        }

        .prompt {
          .margin(0, 0, 0, 19);
          .lineHeight(14);
        }
      }


      .content {
        p {
          .fontSize(16);
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          .padding(8, 0, 8, 0);
        }
      }

    }
  }
</style>
