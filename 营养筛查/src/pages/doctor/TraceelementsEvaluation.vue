<!--
* @description
* @fileName 微量元素检测评定
* @author weixueyuan
* @date 2020/03/31 10:08:27
!-->
<template>
  <div id="TraceelementsEvaluation">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="trevall">
      <div class="trevnotice">请根据患者报告信息选填录入结果数值</div>
      <div class="trevcontent">
        <div class="trevacon">
          <span>锌</span
          ><span><input type="number" v-model="hairtestzn" />µg/g</span>
        </div>
        <div class="trevacon">
          <span>铁</span
          ><span><input type="number" v-model="hairtestfe" />µg/g</span>
        </div>
        <div class="trevacon">
          <span>铜</span
          ><span><input type="number" v-model="hairtestcu" />µg/g</span>
        </div>
        <div class="trevacon">
          <span>铅</span
          ><span><input type="number" v-model="hairtestpb" />µg/g</span>
        </div>
        <div class="trevacon">
          <span>钙</span
          ><span><input type="number" v-model="hairtestca" />µg/g</span>
        </div>
        <div class="trevacon">
          <span>镁</span
          ><span><input type="number" v-model="hairtestmg" />µg/g</span>
        </div>
      </div>
      <div class="v-box">
        <div class="v-listBox">
          <div class="v-title">
            <div class="v-titleall">
              <div class="v-titleicon"></div>
              <div class="v-titletxt">上传报告图片</div>
            </div>
            <div class="imglen">
              <span>{{ images.length }}张</span>/3
            </div>
          </div>
          <div class="v-upload">
            <div class="images_box">
              <div class="item_cell" v-for="(img, key) in images" :key="key">
                <div
                  class="cell photo"
                  @click.stop="imagesPreview(img.url)"
                  :style="
                    'background-image: url(' +
                      img.url +
                      '?x-oss-process=image/auto-orient,1)'
                  "
                >
                  <!-- <img class="img" :src="img" alt /> -->
                  <img
                    class="iconfont"
                    style="width:20px;height:20px;"
                    src="../../assets/img/deleteimg.png"
                    alt
                    @click.stop="deletePhoto(key, img.id)"
                  />
                </div>
              </div>
              <div class="item_cell" v-show="images.length < 3">
                <label for="uploadPhoto">
                  <div class="cell">
                    <div class="cell_camera">
                      <div>
                        <img
                          class="iconfont"
                          style="width:40px;height:33px;"
                          src="../../assets/img/uploadimg.png"
                          alt
                        />
                      </div>
                      <!-- <div class="cell_text">上传凭证</div> -->
                    </div>
                  </div>
                </label>
                <input
                  type="file"
                  ref="clearFile"
                  accept="image/*"
                  id="uploadPhoto"
                  @change="uploadPhoto"
                />
              </div>
              <!--  <span class="prompt" v-show="images.length == 0"
                  >照片仅自己和医生可见</span
                >-->
            </div>
          </div>
        </div>
      </div>
      <div class="trevbut" @click="$throttle(subtrev)">提交</div>
    </div>
    <van-image-preview v-model="show" :images="images1" v-myOn:click="fn">
    </van-image-preview>
  </div>
</template>

<script>
import { ImagePreview, Toast } from "vant";
import compressImg from "../../utils/compressImg";
import commonHeader from "@/components/commonHeader/common_header.vue";
import { mapState } from "vuex";

export default {
  name: "TraceelementsEvaluation",
  data() {
    return {
      title: "微量元素检测评定",
      customTitle: "营养诊断",
      hairtestzn: "",
      hairtestfe: "",
      hairtestcu: "",
      hairtestpb: "",
      hairtestca: "",
      hairtestmg: "",
      images: [
        // {
        //   id: "1",
        //   url:
        //     "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1321718548,2436156433&fm=26&gp=0.jpg",
        // },
      ],
      addpicIds: "",
      delpicIds: "",
      images1: [],
      show: false,
    };
  },

  components: {
    commonHeader,
  },

  created() {
    // window.sessionStorage.setItem("id",511953014312013963)
    this.seltrev();
  },

  computed: {
    ...mapState(["Patient"])
  },

  mounted() {},

  directives: {
    myOn: {
      bind(el, binding, vnode) {
        const event = binding.arg;
        const fn = binding.value;
        el.addEventListener(event, fn);
      },
    },
  },

  methods: {
    fn() {
      this.show = false;
    },
    seltrev() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectHair",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            needRet: 0,
          },
        })
        .then((res) => {
          this.hairtestzn = res.data.data.hairtestzn;
          this.hairtestfe = res.data.data.hairtestfe;
          this.hairtestcu = res.data.data.hairtestcu;
          this.hairtestpb = res.data.data.hairtestpb;
          this.hairtestca = res.data.data.hairtestca;
          this.hairtestmg = res.data.data.hairtestmg;
          this.images = res.data.data.picList || [];
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
    subtrev() {
      let addpicIds = "";
      addpicIds = this.addpicIds.substring(0, this.addpicIds.lastIndexOf(","));
      let delpicIds = "";
      delpicIds = this.delpicIds.substring(0, this.delpicIds.lastIndexOf(","));
      this.$http
        .request({
          method: "post",
          url: "/NNutritionAssessmentController/insertOrUpdate",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            id: window.sessionStorage.getItem("id"),
            type: 2,
            prestype: this.Patient.prestype,
            hairtestzn: this.hairtestzn,
            hairtestfe: this.hairtestfe,
            hairtestcu: this.hairtestcu,
            hairtestpb: this.hairtestpb,
            hairtestca: this.hairtestca,
            hairtestmg: this.hairtestmg,
            addpicIds: addpicIds,
            delpicIds: delpicIds,
          },
        })
        .then((res) => {
          if (res.data.success) {
            Toast("提交成功");
            this.$router.go(-1);
          } else {
            Toast("提交失败");
          }
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
    /**
     * 删除图片
     * @param key 图片下标
     */
    deletePhoto(key, id) {
      this.images.splice(key, 1);
      this.delpicIds += id + ",";
    },
    /**
     * 上传图片
     * @param e file对象
     */
    uploadPhoto(e) {
      let files = e.target.files || e.dataTransfer.files;
      let _this = this;
      if (!files.length) return;
      if (files[0].size > 15 * 1024 * 1024) {
        Toast("图片大小不能大于15M");
        return;
      }
      let formData = new FormData();
      console.log(files[0]);
      Toast.loading({
        duration: 1500,
        mask: true,
        message: "上传中...",
      });
      compressImg(files[0], { type: "blob", size: 100 }).then((blob) => {
        console.log(blob);
        // formData.append("file", blob);
        formData.append("uploadFile", blob);
        _this.uploadHttp(formData);
      });
    },
    //图片上传
    uploadHttp(formData) {
      this.$http
        .request({
          method: "post",
          // baseURL: "https://bbjk.quickhealmall.com/api/",
          // url: "/Aliupload/aliuploads",
          url: "/NNutritionAnnexController/uploadPic",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          let data = res.data;
          console.log(123123);
          Toast.clear();
          if (data.success) {
            this.images.push(data.data);
            this.addpicIds += data.data.id + ",";
            this.$refs.clearFile.value = "";
          } else {
            this.$refs.clearFile.value = "";
            Toast(data.message);
          }
        })
        .catch((error) => {
          //this.$refs.clearFile.value = "";
          Toast({
            message: "无法连接服务",
            position: "bottom",
          });
        });
    },
    /**
     * 查看大图
     * @param key 图片下标
     */
    imagesPreview(img) {
      let newImg = img + "?x-oss-process=image/auto-orient,1";
      this.images1 = [newImg];
      this.show = true;
      // var arr = [];
      // for (var i = 0; i < this.images.length; i++) {
      //   arr.push(this.images[i].url);
      // }
      // console.log(newImg);
      // ImagePreview({
      //   images: [newImg],
      //   showIndex: false,
      //   closeOnPopstate: true,
      //   onClose(option) {
      //     let url =
      //       option +
      //       "?x-oss-process=image/auto-orient,1,resize,m_pad,h_150,w_150";
      //     option.url = url;
      //   },
      // });
    },
  },
};
</script>

<style lang="less" scoped>
#TraceelementsEvaluation {
  padding: 0px;
  width: 100%;
  height: 100%;
  .v-box {
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 12px;
    margin-top: 17px;
    padding: 0;
    .v-listBox {
      padding: 0;
      .v-title {
        height: 45px;
        line-height: 45px;
        font-weight: bold;
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        .v-titleicon {
          width: 4px;
          height: 14px;
          background: linear-gradient(
            180deg,
            rgba(0, 105, 255, 1) 0%,
            rgba(1, 128, 255, 1) 100%
          );
          border-radius: 2px;
          margin-left: 10px;
          margin-right: 10px;
        }
        .imglen {
          color: #666;
          margin-right: 11px;
          span {
            color: #0069ff;
          }
        }
        .v-titleall {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
      .v-mesRadio {
        font-size: 14px;
        line-height: 18px;
        span {
          font-size: 12px;
          color: @fontColor99;
          margin-left: 8px;
        }
      }
      .v-textarea {
        border-radius: 10px;
        overflow: hidden;
      }
      .v-upload {
        .images_box {
          padding: 15px 0 0 15px;
          .item_cell {
            width: 33.334%;
            // margin-right: 15px;
            display: inline-block;
            /*text-align: center;*/
            margin-bottom: 15px;
            // margin: 15px 17px 17px 17px;
            input {
              display: none;
            }
          }
          .item_cell:last-child {
            margin-right: 0;
          }

          .cell {
            width: 96px;
            height: 96px;
            display: inline-block;
            vertical-align: bottom;
            .cell_camera {
              background: rgba(237, 237, 237, 1);
              border-radius: 10px;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              .iconfont {
                font-size: 36px;
                color: @fontColorAA;
              }
              .cell_text {
                font-size: 12px;
                color: @fontColorAA;
              }
            }
          }

          .photo {
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 6px;
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
            margin: 0 0 0 19px;
            line-height: 14px;
          }
        }
      }
    }
  }
  .trevall {
    width: 351px;
    height: 100%;
    margin: 0 auto;
    padding-top: 48px;
  }
  .trevnotice {
    margin-top: 15px;
    width: 100%;
    color: #0069ff;
    font-size: 14px;
  }
  .trevcontent {
    width: 100%;
    height: auto;
    margin-top: 10px;
    border-radius: 10px;
    background-color: #ffffff;
  }
  .trevacon:first-child {
    padding-top: 5px;
  }
  .trevacon:last-child {
    padding-bottom: 5px;
  }
  .trevacon {
    width: 100%;
    height: auto;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    color: #333;
    font-size: 16px;
    line-height: 35px;
    span {
      height: 35px;
    }
    input {
      width: 50px;
      height: 25px;
      margin-right: 10px;
      text-align: center;
      line-height: 25px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    input::-webkit-input-placeholder {
      color: rgba(0, 0, 0, 0.1);
    }
    input::-moz-input-placeholder {
      color: rgba(0, 0, 0, 0.1);
    }
    input::-ms-input-placeholder {
      color: rgba(0, 0, 0, 0.1);
    }
  }
  .trevbut {
    width: 351px;
    height: 44px;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
    line-height: 44px;
    background: linear-gradient(
      225deg,
      rgba(1, 128, 255, 1) 0%,
      rgba(0, 105, 255, 1) 100%
    );
    border-radius: 10px;
    // position: absolute;
    // bottom: 20px;
    margin-top: 132px;
  }
}
</style>
