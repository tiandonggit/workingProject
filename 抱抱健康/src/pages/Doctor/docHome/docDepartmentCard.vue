/*
* @Author: 田东
* @Date: 2020-05-06 08:55:35
 * @Last Modified by: 田东
 * @Last Modified time: 2020-08-03 17:29:26
* @name 科室工作室名片
*/
<!--科室工作室名片-->
<template>
  <div id="docDepartmentCard" ref="swiperCardBox">
    <!-- <common-header
        :share-disabled="true"
        :custom-title="''"
        :header-show="true"
        :title="title"
        :right-content="(Index+1) + '/' + (departmentList.length + 1)"
        :right-class="{color: '#0069ff'}"
    ></common-header> -->

    <div class="header_box_block clearfix">
      <div class="header-div header-left" @click="back()">
        <i class="iconfont iconleft back-icon"></i>
      </div>
      <div class="header-center">
        <van-tabs swipe-threshold="2" v-model="Index" @change="tabChange">
          <van-tab v-for="(title, index) in titleArray" :title="title" :name="index" :key="index">
          </van-tab>
        </van-tabs>
      </div>
       <div class="price header-right"></div>
    </div>

    <div class="bg-block">
      <div class="down-remind" v-if="Index !== departmentList.length">
        <span v-if="!isAdmin">请点击头像关联医生</span>
        <img src="../../../assets/images/1.gif" alt="">
      </div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in departmentList" :key="index">
            <div class="swiper-item">
              <div class="swiper-title">
                <div class="title">{{item.businesscard || ""}}
                  
                </div>
                <div class="img_box">
                  <img src="../../../assets/images/departmentBg.png" alt="">
                </div>
              </div>
              <div class="department-info">
                <p class="title">
                  {{item.businesscard || ""}}简介
                  <img src="../../../assets/images/left_jiao_icon.png" alt="" class="left_jiao">
                  <img src="../../../assets/images/right_jiao_icon.png" alt="" class="right_jiao">
                </p>
                <p class="desc">{{item.text}}</p>
              </div>
              <div class="doc-info">
                <p class="title">
                  {{item.title}}
                  <img src="../../../assets/images/left_jiao_icon.png" alt="" class="left_jiao">
                  <img src="../../../assets/images/right_jiao_icon.png" alt="" class="right_jiao">
                </p>
                <div class="doc-message-box">
                  <div class="left_message_box">
                    <div class="doc-title">
                      {{item.docname || ""}}
                      <span>工作室</span>
                    </div>
                    <ul class="doc-detail">
                      <li>
                        <span class="title_name">{{item.titlename}}</span>
                      </li>
                      <li>
                        <span>{{item.delname}}</span>
                      </li>
                      <li>
                        <span>{{item.hosname}}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="right_avatar_box" @click="selectCheckDocCard(item)">
                    <div style="position: relative">
                      <img :src="item.docurl" alt="">
                      <img src="../../../assets/images/icon_hand.png" class="hand" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-info" v-for="(group, index2) in item.group" :key="index2">
                <p class="title">
                  {{group.groupname}}
                  <img src="../../../assets/images/left_jiao_icon.png" alt="" class="left_jiao">
                  <img src="../../../assets/images/right_jiao_icon.png" alt="" class="right_jiao">
                </p>
                <div class="group-introduce">
                  简介：
                  <span>{{group.grouptext}}</span>
                </div>
                <div class="group-leader">
                  <div class="line left">
                    <span></span>
                  </div>
                  <div class="img-box" @click="selectCheckDocCard(group)">
                    <img class="url" :src="group.docurl" alt/>
                    <img class="img" src="../../../assets/images/d-card-5.png" alt/>
                    <img src="../../../assets/images/icon_hand.png" alt="" class="hand">
                    <p>{{group.docname}}</p>
                  </div>
                  <div class="line right">
                    <span></span>
                  </div>
                </div>
                <div class="member-list clearFix">
                  <div class="cell-box"
                       v-for="(member, index3) in group.doctor"
                       :key="index3"
                       @click="selectCheckDocCard(member)"
                  >
                    <div class="isNotRelation_box">
                      <img :src="member.docurl" alt/>
                      <img src="../../../assets/images/icon_hand.png" class="hand" alt="">
                    </div>
                    <p>{{member.docname}}</p>
                  </div>
                </div>

              </div>
            </div>
            <div class="code_box">
              <img :src="item.qrcode" alt/>
              <p v-if="item.qrcode">{{item.name}}二维码</p>
            </div>
          </div>
          <div class="swiper-slide" v-show="!loading">
            <div class="swiper-item">
              <div class="cardHeader">
                <div class="header_box">
                  <div class="header_content_box">
                    <div class="header header_content" ref="docCardContent">
                      <div class="headerLeft_box">
                        <div class="headerLeft">
                          <img :src="avatar" alt/>
                        </div>
                      </div>
                      <div class="headerRight">
                        <p class="name docName">{{ name }}</p>
                        <p class="name subName" style="padding-top:0">
                          {{ department }}
                          <span>{{titleName}}</span>
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
                    </div>
                    <div class="change_style" v-if="isAdmin">
                      <img
                          @click.stop="docCardStyleCheck"
                          src="../../../assets/images/changeStyle_icon.png"
                          alt
                      />
                      <span @click.stop="docCardStyleCheck">名片样式</span>
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
                          <img v-if="!isAdmin" src="../../../assets/images/shanchang.png" alt/>
                          擅长疾病：
                        </p>
                        <div class="itemValue_flex">
                          <span
                              class="itemValue"
                              :class="[{'isNotMyself':!isAdmin}]"
                              v-if="isDataOne"
                              @click.stop="editContent('disease')"
                          >{{isAdmin?"请填写您擅长的疾病":"暂无信息"}}</span>
                          <span
                              class="itemValue hasData"
                              :class="[{'isNotMyself':!isAdmin}]"
                              @click.stop="editContent('disease')"
                              v-else
                          >{{ speciality }}</span>
                          <van-icon v-if="isAdmin" name="arrow"/>
                        </div>
                      </div>
                      <div class="introduce">
                        <!--              不是医生本人的话 样式不同 -->
                        <p class="itemKey" :class="[{'isNotMyself':!isAdmin}]">
                          <img v-if="!isAdmin" src="../../../assets/images/jianjie.png" alt/>
                          个人简介：
                        </p>
                        <div class="itemValue_flex">
                          <span
                              class="itemValue"
                              v-if="isDataTwo"
                              :class="[{'isNotMyself':!isAdmin}]"
                              @click.stop="editContent('introduce')"
                          >{{isAdmin?"请填写您的个人简介":"暂无信息"}}</span>
                          <span
                              class="itemValue hasData"
                              :class="[{'isNotMyself':!isAdmin}]"
                              @click.stop="editContent('introduce')"
                              v-else
                          >{{ dprofile }}</span>
                          <van-icon v-if="isAdmin" name="arrow"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="introduce-box" style="margin:20px 0 0 0" v-if="isAdmin">
                    <div>
                      <div
                          class="disease"
                          @click.stop="editDetailContent"
                          style="display: flex;border-bottom: 0"
                      >
                        <p
                            class="itemKey"
                            style="margin-bottom: 0;flex: 1;align-items: center"
                        >详细信息：</p>
                        <van-icon name="arrow"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

    <div class="footer-box">
      <van-button slot="button" class="next-btn" size="large" @click.stop="downloadImg">下载名片</van-button>
    </div>
    <van-loading type="spinner" color="#0069ff" v-if="loading"></van-loading>
  </div>
</template>

<script>
  import {Toast} from "vant";
  import {mapState} from "vuex";
  import Swiper from "swiper";
  import "swiper/css/swiper.min.css";
  import commonHeader from "../../../components/commonHeader/common_header";
  import merge from "webpack-merge";
  import html2canvas from "html2canvas";

  export default {
    name: "docDepartmentCard",
    data() {
      return {
        title: "",
        titleArray: [],
        tabIndex: 0,
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
        doctorId: "", // 医疗小组成员医生id  query参数获取
        isPatient: false,

        // 科室工作室名片数据
        swiper: null,
        departmentList: [],
        Index: 0,
        isTurnCard: false,
        loading: false,
        ToastRequest: ""
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
    watch: {
      departmentList() {
        this.$nextTick(() => {
          this.swiperInit();
        });
      },

      $route(val, old) {
        this.doctorId = val.query.doctorId || "";
        this.swiper.destroy(false);
        this.Index = 0;
        this.dprofile = "";
        this.speciality = "";
        this.isDataOne = true; //是否默认显示
        this.isDataTwo = true;
        this.titleArray = [];
        this.getQrImg();
        this.getInfo();
        this.getDepartmentInfo();
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
      this.getDepartmentInfo();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (
          from.name === "editIntro" ||
          from.name === "docDetail" ||
          from.name === "docCardStyleCheck"
        ) {
          vm.isTurnCard = true;
        }
      });
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
              this.title =
                this.departmentList.length > 0
                  ? this.departmentList[0].name
                  : "医生名片";
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
      //医生基本信息
      getDepartmentInfo() {
        this.loading = true;
        let params = {
          id: this.doctorId
        };
        this.$http
          .request({
            method: "get",
            url: "/RStudioController/selectAll",
            body: this.doctorId ? params : {}
          })
          .then(res => {
            this.loading = false;
            if (res.data.success && res.data) {
              res.data.data.forEach(v => {
                this.titleArray.push(v.name);
              });
              this.titleArray.push("医生名片");
              this.departmentList = res.data.data || [];
              this.scrollToTop();
            } else {
              Toast(res.data.message);
            }
          })
          .catch(e => {
            this.loading = false;
            Toast("数据请求失败");
          });
      },
      // 查看科室工作室小组中医生名片
      selectCheckDocCard(item) {
        if (item.rdoctor && item.rdoctor != "0") {
          if (!this.isPatient) {
            this.$router.push({
              query: merge(this.$route.query, {doctorId: item.rdoctor})
            });
          } else {
            this.$http
              .request({
                url: "/RReportController/selectRelation",
                method: "get",
                body: {
                  id: item.rdoctor
                }
              })
              .then(res => {
                if (res.data.success) {
                  if (res.data.code === "0001") {
                    let sessionMessage = {
                      sessionType: 0,
                      sessionId: res.data.data || "",
                      doctorId: item.rdoctor
                    };
                    this.$store.commit(
                      "PatientIM/sessionMessage",
                      sessionMessage
                    );
                    this.$router.push({
                      path: "chatIMDetail",
                      query: {}
                    });
                  } else {
                    this.$router.push({
                      query: merge(this.$route.query, {doctorId: item.rdoctor})
                    });
                  }
                } else {
                  Toast(res.data.message || "接口报错");
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        } else {
          // 假医生跳转医生名片模板
          let docInfo = {
            docurl: item.docurl,
            docname: item.docname,
            delname: item.delname,
            titlename: item.titlename,
            hosname: item.hosname
          };
          this.$router.push({
            name: "docCardStatic",
            query: {docInfo: JSON.stringify(docInfo)}
          });
        }
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
              // 二维码图片链接转换为服务器源
              let QrcodeImg = `${this.$globalServiceHost.fullServiceHost}/api/CommonController/convertUrl2Png?pngUrl=https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${imgQr}`;
              this.$urlToBlob(QrcodeImg, (resBlob) => {
                let QrcodeImgBlob = resBlob;
                this.$blobToBase64(QrcodeImgBlob, (resBase64) => {
                  this.QrcodeImg = resBase64;
                });
              });
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
      },
      // 初始化滑动组件
      swiperInit() {
        let vm = this;
        this.swiper = new Swiper(".swiper-container", {
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          },
          loop: false,
          grabCursor: true,
          spaceBetween : 20,
          onlyExternal: false,
          centeredSlides: true,
          slidesPerView: "auto",
          autoplayDisableOnInteraction: false,
          autoHeight: true, // 自适应高度
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          on: {
            slideChange: function () {
              vm.scrollToTop();
              vm.Index = this.activeIndex;
              if (vm.departmentList.length > 0) {
                vm.title =
                  vm.departmentList.length === vm.Index
                    ? "医生名片"
                    : vm.departmentList[vm.Index].name;
              }
            }
          }
        });
        if (this.isTurnCard) {
          this.swiper.slideTo(this.departmentList.length, 1, function () {
          });
        }
        this.title =
          this.departmentList.length > 0
            ? this.departmentList[0].name
            : "医生名片";
      },
      tabChange(){
        this.swiper.slideTo(this.Index, 1, () => {});
      },
      scrollToTop() {
        let _this = this;
        try {
          this.$nextTick(() => {
            setTimeout(function () {
              // document.querySelectorAll("html")[0].scrollTop = 0;
              window.pageYoffset = 0;
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }, 100);
          });
        } catch (e) {
          console.log(e);
        }
      },
      // 下载名片
      downloadImg() {
        this.ToastRequest = Toast.loading({
          duration: 0,
          mask: true
        });
        setTimeout(() => {
          let el =
            this.Index === this.departmentList.length
              ? document.querySelectorAll(".header_content")[0]
              : document.querySelectorAll(".swiper-slide")[this.Index];
          window.pageYoffset = 0;
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          this.toImg(el);
        }, 1000);
      },
      toImg(el) {
        html2canvas(el, {
          // allowTaint: true,
          useCORS: true
          // width: '100%',
          // height: '100%'
          // windowHeight: el.style.height,
          // windowWidth: el.style.width
          // scale: window.devicePixelRatio * 2 // 默认值是window.devicePixelRatio
        })
          .then(canvas => {
            let imgUrl = canvas.toDataURL("image/png");
            this.ToastRequest.clear();
            window.sessionStorage.setItem("downloadImgUrl", imgUrl);
            // this.dataURL = imgUrl;
            this.$router.push({name: "docDownloadCard"});
          })
          .catch(error => {
            console.log(error);
            this.ToastRequest.clear();
          });
      },
      back(){
        if (window.history.length <= 1) {
          try {
            WeixinJSBridge.call("closeWindow")
          } catch (e) {
            console.log(e)
          }
        } else {
          this.$router.go(-1)
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  /*清除浮动*/
  .clearFix:before,
  .clearFix:after {
    content: " ";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  #docDepartmentCard {
    .padding(60, 12, 95, 12);

    .header_box_block {
      position: fixed;
      -webkit-box-align: center;
      -ms-flex-align: center;
      display: flex;
      align-items: center;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      width: 100vw;
      height: auto;
      background: @backgroundColor;

      .header-left {
        .height(44);
        .width(70);
        .lineHeight(44);
        .padding(0, 0, 0, 10);

        .back-icon {
          .fontSize(20);
          font-weight: 600;
          color: @titleColor;
        }
      }

      .header-center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        .fontSize(18);
        width: 0;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 400;
        color: @titleColor;
        .lineHeight(44);

        /deep/ .van-tabs {
          width: 100%;

          .van-tabs__nav {
            background: none;

            .van-tab {
              .fontSize(14);
            }

            .van-tab--active {
              span {
                color: @titleColor;
                font-weight: bold;
                .fontSize(18);
              }
            }

            .van-tabs__line {
              background: @mainColor;
              .width(80) !important;
            }
          }
        }
      }

      .header-right {
        .width(70);
        .height(44);
        text-align: right;
        .padding(0, 12, 0, 0);
      }
    }

    .bg-block {
      .borderRadius(10, 10, 10, 10);
      position: relative;

      .down-remind {
        position: absolute;
        top: 26vw;
        left: 3.2vw;
        text-align: left;
        z-index: 99;
            
        span {
          .fontSize(14);
          font-weight:400;
          color:@fontColorff;
          .lineHeight(20);
          .margin(9, 0, 0, 0);
        }

        img {
          .width(18);
          .height(18);
          vertical-align: middle;
        }
      }
    }

    .swiper-container {
      .swiper-slide {
        background-color: @mainColor;
        overflow: hidden;
        .borderRadius(10, 10, 10, 10);

        &:last-child{
          background-color: #fff;
        }

        .swiper-item {
          /*background-image: url("../../../assets/images/d-card-1.png");*/
          background-size: 93.6vw;
          background-position: 0 0;
          background-repeat: no-repeat;
        }
      }

      .swiper-title {
        display: flex;
        .padding(10, 0, 0, 0);

        div.title {
          flex: 1;
          width: 0;
          text-align: center;
          .fontSize(24);
          font-weight: bold;
          color: @fontColorff;
          .lineHeight(30);
          .padding(12, 12, 12, 12);
          position: relative;
        }

        .img_box {
          .width(132);
          /*height: 100%;*/
          min-height: 128/375*100vw;
          position: relative;

          img {
            position: absolute;
            bottom: 0;
            right: 0;
            display: block;
            width: 100%;
            .height(128);
          }
        }

      }

      .department-info {
        .padding(0, 0, 15, 0) !important;
        .width(331);
        margin: 0 auto 24/375*100vw;
        background: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);

        p {
          .fontSize(16);
          font-weight: bold;
          color: @titleColor;
          .lineHeight(20);
        }

        p.desc {
          font-weight: 400;
          .padding(0, 10, 0, 10);
        }

        p.title {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          .width(246);
          background-color: rgba(201, 227, 255, 1);
          min-height: 47/375*100vw;
          .padding(8, 10, 8, 10);
          position: relative;
          top: -10/375*100vw;
          left: 42/375*100vw;
          .fontSize(16);
          color: @fontColor33;
          font-weight: bold;
          .lineHeight(22);
          .borderRadius(0, 0, 10, 10);

          img {
            position: absolute;
            top: 0;
            display: block;
            .width(7);
            .height(10);
          }

          .left_jiao {
            left: -7/375*100vw;
          }

          .right_jiao {
            right: -7/375*100vw;
          }
        }
      }

      .doc-info {
        .width(331);
        margin: 0 auto 24/375*100vw;
        background: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);
        .padding(0, 0, 15, 0) !important;

        p.title {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          .width(246);
          background-color: rgba(201, 227, 255, 1);
          min-height: 47/375*100vw;
          .padding(8, 10, 8, 10);
          position: relative;
          top: -10/375*100vw;
          left: 42/375*100vw;
          .fontSize(16);
          color: @fontColor33;
          font-weight: bold;
          .lineHeight(22);
          .borderRadius(0, 0, 10, 10);

          img {
            position: absolute;
            top: 0;
            display: block;
            .width(7);
            .height(10);
          }

          .left_jiao {
            left: -7/375*100vw;
          }

          .right_jiao {
            right: -7/375*100vw;
          }
        }

        .doc-message-box {
          display: flex;
          .padding(0, 10, 0, 10);

          .left_message_box {
            flex: 1;
            width: 0;

            .doc-title {
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              .padding(14, 0, 16, 0);
              .fontSize(16);
              font-weight: 400;
              color: @titleColor;


              span {
                background: linear-gradient(230deg, rgba(1, 128, 255, 1) 0%, rgba(0, 105, 255, 1) 100%);
                .borderRadius(5, 5, 5, 5);
                .padding(2, 6, 2, 6);
                .fontSize(14);
                color: @fontColorff;
                .margin(0, 0, 0, 14);
              }
            }

            .doc-detail {
              .padding(14, 0, 0, 0);

              li {
                .title_name {
                  .margin(0, 24, 0, 0);
                }

                span {
                  .fontSize(14);
                  .lineHeight(28);
                  font-weight: 400;
                  color: rgba(102, 102, 102, 1);
                }
              }
            }
          }

          .right_avatar_box {
            .margin(0, 0, 0, 10);

            img {
              display: block;
              .width(60);
              .height(60);
              border-radius: 50%;
            }
          }
        }
      }


      .group-info {
        .width(331);
        margin: 0 auto 24/375*100vw;
        background: @backgroundColorT;
        .borderRadius(10, 10, 10, 10);

        p.title {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          .width(246);
          background-color: rgba(201, 227, 255, 1);
          min-height: 47/375*100vw;
          .padding(8, 10, 8, 10);
          position: relative;
          top: -10/375*100vw;
          left: 42/375*100vw;
          .fontSize(16);
          color: @fontColor33;
          font-weight: bold;
          .lineHeight(22);
          .borderRadius(0, 0, 10, 10);

          img {
            position: absolute;
            top: 0;
            display: block;
            .width(7);
            .height(10);
          }

          .left_jiao {
            left: -7/375*100vw;
          }

          .right_jiao {
            right: -7/375*100vw;
          }
        }

        .group-introduce {
          .padding(12, 10, 0, 10);
          .fontSize(16);
          font-weight: bold;
          color: @fontColor33;
          .lineHeight(20);
          margin-bottom: 4vw;

          span {
            font-weight: 400;
          }
        }

        .member {
          .padding(0, 0, 0, 10);
          .fontSize(16);
          font-weight: bold;
          color: @fontColor33;
          .lineHeight(20);
        }

        .group-leader {
          padding: 4vw 0;
          display: flex;
          align-items: center;

          .line {
            width: calc(100% - 87 / 375 * 50vw);;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              width: 100%;
              height: 1px;
              display: inline-block;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
          }

          .line.left {
            .padding(0, 20, 0, 10)
          }

          .line.right {
            .padding(0, 10, 0, 20)
          }

          .img-box {
            .width(87);
            .height(99);
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;

            img.hand {
              bottom: 30/375*100vw !important;
            }

            .url {
              .width(72);
              .height(72);
              margin: 0 auto;
              display: block;
              border-radius: 50%;
            }

            .img {
              .width(87);
              position: absolute;
              top: 14.7vw;
            }

            p {
              .fontSize(16);
              font-weight: 400;
              color: @fontColor33;
              .lineHeight(18);
              .margin(9, 0, 0, 0);
              text-align: center;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }

        .member-list {
          .borderRadius(0, 0, 10, 10);
          background: #fff;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .cell-box {
            .width(60);
            // float: left;
            .margin(0, 11, 15, 11);

            div {
              .width(60);
              .height(60);

              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }

            p {
              position: relative;
              z-index: 11;
              .fontSize(16);
              font-weight: 400;
              color: @fontColorff;
              .borderRadius(6, 6, 6, 6);
              .lineHeight(18);
              .margin(-2, 0, 0, 0);
              text-align: center;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              background-color: rgba(0, 105, 255, 1);
              .padding(2, 0, 2, 0);
            }
          }
        }
      }

      .code_box {
        .width(351);
        /*<!--.height(273);-->*/
        /*background-image: url("../../../assets/images/d-card-2.png");*/
        background-size: cover;
        background-position: 0 0;
        background-repeat: no-repeat;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;
        margin-top: -4px;

        img {
          display: block;
          .width(159);
          .margin(0, 0, 13, 0);
        }

        p {
          text-align: center;
          .padding(0, 0, 18, 0);
          .fontSize(16);
          font-weight: 400;
          color: @fontColorff;
          .lineHeight(20);
        }
      }
    }

    .cardHeader {
      text-align: center;
      overflow: hidden;
      .width(352);
      margin: 0 auto;
      // .padding(50, 12, 20, 12);

      .header_box {
        .padding(10, 10, 10, 10);
        /*<!--.borderRadius(10, 10, 10, 10);-->*/
        background: #fff;

        .header_content_box {
          .padding(0, 14, 0, 14);
          position: relative;


          .change_style {
            position: absolute;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            .padding(0, 0, 10, 0);
            .width(304);

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

        .header {
          .borderRadius(10, 10, 10, 10);
          background: url("../../../assets/images/docCardBg.png") no-repeat center;
          position: relative;
          .padding(0, 0, 30, 0);

          .headerLeft_box {
            display: flex;
            align-items: center;
            justify-content: center;
            .padding(85, 0, 0, 0);

            .headerLeft {
              .width(72);
              .height(72);
              border-radius: 50%;
              border: 5px solid rgba(255, 255, 255, 0.5);
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
          color: @fontColor99;
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

    .footer-box {
      background: #fff;
      z-index: 2;
    }

    .isNotRelation_box {
      position: relative;

      img {
        border-radius: 50%;
      }
    }

    img.isNotRelation {
      display: block;
      .width(20) !important;
      .height(20) !important;
      position: absolute;
      top: 0;
      right: -8/375*100vw;
      z-index: 12;
    }

    img.hand {
      display: block;
      .width(15) !important;
      .height(16) !important;
      position: absolute !important;
      bottom: -7/375*100vw;;
      right: -4/375*100vw;
      z-index: 12;
    }

    .right_avatar_box {
      img.hand {
        bottom: 0 !important;
      }
    }
  }

  .swiper-button-prev, .swiper-button-next {
    position: fixed !important;
    z-index: 20;
    top: 290/375*100vw;
    .width(32);
    .height(32);
    background-size: cover;
    padding: 2px;
  }

  .swiper-button-prev {
    background-image: url("../../../assets/images/left_swiper.png");
    left: 12/375*100vw;
  }

  /*改变了颜色和加粗的样式*/
  .swiper-button-next {
    background-image: url("../../../assets/images/right_swiper.png");
    right: 12/375*100vw;
  }
</style>
