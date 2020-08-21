/* * @Author: 田东 * @Date: 2020-01-06 09:39:00 * @Last Modified by: 田东 *
@Last Modified time: 2020-01-06 09:47:26 * @name 医生名片 */
<!---->
<template>
  <div id="docCard">
    <common-header
        :share-disabled="true"
        :custom-title="'医生名片'"
        :header-show="true"
        :rightContent="isAdmin?'小组名片':''"
        :rightClass="{'color':'rgba(0, 105, 255, 1)'}"
        @rightContentClick="rightContentClick"
        :title="'医生  ' + name"
    ></common-header>


    <div class="cardHeader">
      <div class="header_box">
        <div class="header_content_box">
          <div class="header" ref="docCardContent">
            <div class="headerLeft_box">
              <div class="headerLeft">
                <img :src="avatar" alt/>
              </div>
            </div>
            <div class="headerRight">
              <p class="name docName">
                {{ name }}
              </p>
              <p class="name subName" style="padding-top:0">
                {{ department }}
                <span> {{titleName}}</span>
              </p>
              <p class="hospital">
                <span>{{ hospital }}</span>
              </p>
            </div>
            <div class="code-box">
              <div class="qrCode">
                <img :src="QrcodeImg" alt/>
              </div>
            </div>
            <div class="change_style" v-if="isAdmin">
              <img @click.stop="docCardStyleCheck"
                   src="../../../assets/images/changeStyle_icon.png" alt="">
              <span @click.stop="docCardStyleCheck">名片样式</span>
            </div>
          </div>
        </div>

        <div class="introduce-box">
          <h4 class="detail_h4" v-if="isAdmin">
            基本信息
            <span v-if="isAdmin">(公开信息,患者可查看,建议完善)</span>
          </h4>
          <div class="message_box">
            <div class="disease">
              <!--              不是医生本人的话 样式不同 -->
              <p class="itemKey" :class="[{'isNotMyself':!isAdmin}]">
                <img v-if="!isAdmin" src="../../../assets/images/shanchang.png" alt="">
                擅长疾病：
              </p>
              <div class="itemValue_flex">
                <span class="itemValue"
                      :class="[{'isNotMyself':!isAdmin}]"
                      v-if="isDataOne"
                      @click.stop="editContent('disease')">
                  {{isAdmin?"请填写您擅长的疾病":"暂无信息"}}
                </span>
                <span class="itemValue hasData"
                      :class="[{'isNotMyself':!isAdmin}]"
                      @click.stop="editContent('disease')"
                      v-else>
                   {{ speciality }}
                </span>
                <van-icon v-if="isAdmin" name="arrow"/>
              </div>
            </div>
            <div class="introduce">
              <!--              不是医生本人的话 样式不同 -->
              <p class="itemKey" :class="[{'isNotMyself':!isAdmin}]">
                <img v-if="!isAdmin" src="../../../assets/images/jianjie.png" alt="">
                个人简介：
              </p>
              <div class="itemValue_flex">
                <span class="itemValue"
                      v-if="isDataTwo"
                      :class="[{'isNotMyself':!isAdmin}]"
                      @click.stop="editContent('introduce')">
                  {{isAdmin?"请填写您的个人简介":"暂无信息"}}
                </span>
                <span class="itemValue hasData"
                      :class="[{'isNotMyself':!isAdmin}]"
                      @click.stop="editContent('introduce')"
                      v-else>
                  {{ dprofile }}
                </span>
                <van-icon v-if="isAdmin" name="arrow"/>
              </div>
            </div>
          </div>
        </div>
        <div class="introduce-box" style="margin:20px 0 0 0" v-if="isAdmin">
          <div>
            <div class="disease"
                 @click.stop="editDetailContent"
                 style="display: flex;border-bottom: 0">
              <p class="itemKey" style="margin-bottom: 0;flex: 1;align-items: center">
                详细信息：
              </p>
              <van-icon name="arrow"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import Vue from "vue";
  import {Toast, NavBar} from "vant";
  import {mapState} from "vuex";

  Vue.use(NavBar);
  import commonHeader from "../../../components/commonHeader/common_header";

  export default {
    name: "docCard",
    data() {
      return {
        department: "",
        name: "",
        hospital: "",
        QrcodeImg: "",
        dprofile: "", //擅长疾病
        speciality: "", //个人简介
        isData: true, //是否有数据
        titleName: "", //医生职称
        isDataOne: true, //是否默认显示
        isDataTwo: true,

        isMoreOne: "", //是否显示更多
        isMoreTwo: "",
        avatar: "",
        doctorId: "",// 医疗小组成员医生id  query参数获取
        isPatient: false
      };
    },
    components: {
      commonHeader
    },
    computed: {
      ...mapState(["DoctorIM"]),
      isAdmin() {
        let isAdmin = false;
        try {
          if (this.doctorId === this.DoctorIM.doctorMessage.data.docId) {
            isAdmin = true;
          }
          ;
        } catch (e) {
          console.log(e);
        }
        if (this.doctorId === "") {
          isAdmin = true;
        }
        if (this.isPatient) {
          isAdmin = false;
        }
        return isAdmin;
      }
    },
    created() {
      if (this.$route.query.doctorId) {
        this.doctorId = this.$route.query.doctorId;
      }
      if (this.$route.query.isPatient) {
        this.isPatient = this.$route.query.isPatient;
      }
      this.getQrImg();
      this.getInfo();
    },
    methods: {
      //医生基本信息
      getInfo() {
        let params = {
          id: this.doctorId
        };
        this.$http
          .request({
            method: "get",
            url: "/RDoctorController/selectDoctorQrCode",
            body: this.doctorId ? params : {}
          })
          .then(res => {
            if (res.data.success && res.data) {
              let data = res.data.data.data;
              this.name = data.docName;
              this.department = data.depName;
              this.hospital = data.hosName;
              this.avatar = data.url;
              this.titleName = data.titleName;

              if (data.poctureurl) {
                this.$nextTick(() => {
                  let docCardContent = this.$refs.docCardContent;
                  docCardContent.style.background = `url("${data.poctureurl}") no-repeat center`;
                  docCardContent.style.backgroundSize = `100% 100%`;
                });
              }

              //疾病文本二次处理
              if (data.speciality.length > 0) {
                this.isDataOne = false;
                this.speciality = data.speciality;
              }

              //简历文本二次处理
              if (data.dprofile.length > 0) {
                this.isDataTwo = false;
                this.dprofile = data.dprofile;
              }
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("数据请求失败");
          });
      },
      editContent(option) {
        if (!this.isAdmin) {
          return false;
        }
        this.$router.push({
          path: "/editIntro",
          query: {
            option: option,
            isAdminQuery: this.isAdmin,
            doctorId: this.doctorId
          }
        });
      },
      editDetailContent() {
        if (!this.isAdmin) {
          return false;
        } else {
          this.$router.push({
            path: "/docDetail",
            query: {
              isAdminQuery: this.isAdmin,
              doctorId: this.doctorId
            }
          });
        }
      },
      //医生二维码
      getQrImg() {
        let params = {
          id: this.doctorId
        };
        this.$http
          .request({
            method: "get",
            url: "/RDoctorController/generateQrCodeForPatient",
            body: this.doctorId ? params : {}
          })
          .then(res => {
            if (res.data.success && res.data) {
              let imgQr = res.data.data;
              this.QrcodeImg = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${imgQr}`;
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            Toast("保存数据失败");
          });
      },
      rightContentClick() {
        if (!this.isAdmin) {
          return false;
        } else {
          this.$router.push({
            path: "/docGroupList"
          });
        }
      },
      docCardStyleCheck() {
        this.$router.push({
          path: "/docCardStyleCheck"
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  #docCard {
    height: 100%;
    // min-height: 687px;
    .padding(0, 0, 10, 0);
    box-sizing: border-box;
    background: @backgroundColor;

    .cardHeader {
      text-align: center;
      overflow: hidden;
      .width(351);
      margin: 0 auto;
      .padding(50, 12, 20, 12);

      .header_box {
        .padding(10, 10, 10, 10);
        .borderRadius(10, 10, 10, 10);
        background: #fff;

        .header_content_box {
          .padding(0, 14, 0, 14);
        }

        .header {
          .borderRadius(10, 10, 10, 10);
          background: url('../../../assets/images/docCardBg.png') no-repeat center;
          position: relative;

          .headerLeft_box {
            display: flex;
            align-items: center;
            justify-content: center;
            .padding(85, 0, 0, 0);

            .headerLeft {
              .width(72);
              .height(72);
              border-radius: 50%;
              border: 5px solid rgba(255,255,255,0.5);
              overflow: hidden;

              img {
                width: 100%;
              }
            }
          }

          .headerRight {
            .padding(0, 0, 14, 0);
            /*border-bottom: 1px solid rgba(0, 0, 0, 0.1);*/

            p.hospital {
              .fontSize(14);
              font-weight: 400;
              color: @fontColor33;
              .lineHeight(18);
            }

            p.name.docName {
              .padding(25, 0, 10, 0);
            }
            p.name {
              .padding(10, 0, 10, 0);
              .fontSize(18);
              font-weight: 400;
              color: @fontColor33;
              .lineHeight(18);

              span {
                font-weight: 400;
                color: @fontColor33;
                .lineHeight(18);
                .margin(0, 0, 0, 15);
              }
            }

            p.subName {
              .fontSize(16) !important;

              span {
                .fontSize(16) !important;
              }
            }
          }

          .code-box {
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;

            .qrCode {
              .width(176);
              .height(176);
              background: #fff;
              box-sizing: border-box;
              .margin(0, 0, 10, 0);

              img {
                width: 100%;
              }
            }
          }

          .change_style {
            display: flex;
            align-items: center;
            justify-content: center;
            .padding(0, 0, 10, 0);

            img {
              display: block;
              .width(20);
              .height(20);
            }

            span {
              .fontSize(16);
              font-weight: 400;
              color: @fontColor33;
              .margin(0, 0, 0, 10);
            }
          }
        }
      }
    }


    .introduce-box {

      .message_box {
        .padding(15, 0, 0, 0);
      }

      h4.detail_h4 {
        .padding(15, 0, 0, 0);
        display: flex;
        align-items: center;
        background: #fff;
        .fontSize(18);
        .lineHeight(22);
        font-weight: bold;
        color: rgba(51, 51, 51, 1);

        span {
          .fontSize(14);
          .lineHeight(18);
          color: rgba(153, 153, 153, 1);
        }
      }

      .itemValue_flex {
        display: flex;
        align-items: center;
      }

      .borderRadius(10, 10, 10, 10);
      overflow: hidden;

      .disease,
      .introduce {
        background: @backgroundColor;
        .padding(15, 14, 12, 10);
        text-align: left;

        p {
          .fontSize(16);
          font-weight: bold;
          color: @titleColor;
          .lineHeight(16);
          .margin(0, 0, 13, 0);
          .padding(0, 0, 0, 14);
          background: url("../../../assets/images/icon_zhu.png") 0 center no-repeat;
          background-size: 1.07vw;
        }

        p.isNotMyself {
          background: none !important;
          display: flex;
          align-items: center;
          padding-left: 0 !important;

          img {
            display: block;
            .width(20);
            .height(20);
            .margin(0, 10, 0, 0);
          }

        }

        .itemValue {
          .fontSize(16);
          font-weight: 400;
          color: @fontColor33;
          .lineHeight(20);
          flex: 1;
          width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .itemValue.isNotMyself {
          display: inline-block !important;
        }

        .hasData {
          color: @titleColor;
          word-break: break-all;
        }

        .checkMore {
          color: @mainColor;
        }
      }

      .disease {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        .borderRadius(10, 10, 0, 0);
      }
    }

  }
</style>
