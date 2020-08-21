<!--
* @description
* @fileName 血液生化检测评定.vue
* @author weixueyuan
* @date 2020/03/31 13:30:10
!-->
<template>
  <div id="BloodBiochemistry">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="blbiall">
      <div class="blbinotice">请根据患者报告信息选填录入结果数值</div>
      <div class="blbicontent">
        <div class="blbiacon">
          <span>血清蛋白值</span
          ><span><input type="number" v-model="serumprotein" />g/L</span>
        </div>
        <div class="blbiacon">
          <span>血清前白蛋白</span
          ><span><input type="number" v-model="pab" />g/L</span>
        </div>
        <div class="blbiacon">
          <span>血清转铁蛋白</span
          ><span><input type="number" v-model="stfr" />g/L</span>
        </div>
        <div class="blbiacon">
          <span>血清视黄醇结合蛋白</span
          ><span><input type="number" v-model="rbp" />µg/g</span>
        </div>
        <div class="blbiacon">
          <span>血清纤维结合蛋白</span
          ><span><input type="number" v-model="serumfibronectin" />µg/g</span>
        </div>
        <div class="blbiacon">
          <span>血浆氨基酸谱</span
          ><span><input type="number" v-model="aminoacidvalues" />值</span>
        </div>
      </div>
      <div class="blbiline"></div>
      <div class="blbicontentm">
        <div class="blbicontitle">1.人体内的电解质与微量元素检测</div>
        <div class="blbiacon">
          <span>钾</span
          ><span><input type="number" v-model="elementk" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>钠</span
          ><span><input type="number" v-model="elementna" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>铁</span
          ><span><input type="number" v-model="elementfe" />µmol/g</span>
        </div>
        <div class="blbiacon">
          <span>铜</span
          ><span><input type="number" v-model="elementcu" />µmol/g</span>
        </div>
        <div class="blbiacon">
          <span>血清总铁结合量(TIBC)</span
          ><span><input type="number" v-model="tibc" />µmol/g</span>
        </div>
        <div class="blbiacon">
          <span>锌</span
          ><span><input type="number" v-model="elementzn" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>钙</span
          ><span><input type="number" v-model="elementca" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>镁</span
          ><span><input type="number" v-model="elementmg" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>磷</span
          ><span><input type="number" v-model="elementp" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>硒</span
          ><span><input type="number" v-model="elementse" />µg/g</span>
        </div>
        <div class="blbiacon">
          <span>铬</span
          ><span><input type="number" v-model="elementcr" />µmol/g</span>
        </div>
        <div class="blbiacon">
          <span>碘</span
          ><span><input type="number" v-model="elementi" />mg</span>
        </div>
      </div>
      <div class="blbiline"></div>
      <div class="blbicontentb">
        <div class="blbicontitle">2.血清维生素测定</div>
        <div class="blbiacon">
          <span>VltA</span
          ><span><input type="number" v-model="elementvita" />µmol/g</span>
        </div>
        <div class="blbiacon">
          <span>VltC</span
          ><span><input type="number" v-model="elementvitc" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>血清维生素D3</span
          ><span><input type="number" v-model="serumvitd3" />µg/L</span>
        </div>
        <div class="blbiacon">
          <span>VltE</span
          ><span><input type="number" v-model="elementvite" />µmol/g</span>
        </div>
        <div class="blbiacon">
          <span>VltK</span
          ><span><input type="number" v-model="elementvitk" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>VltB1</span
          ><span><input type="number" v-model="elementvitb1" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>VltB2</span
          ><span><input type="number" v-model="elementvitb2" />µmol/g</span>
        </div>
        <div class="blbiacon">
          <span>VltB6</span
          ><span><input type="number" v-model="elementvitb6" />mmol/g</span>
        </div>
        <div class="blbiacon">
          <span>VltB12</span
          ><span><input type="number" v-model="elementvitb12" />pmol/g</span>
        </div>
        <div class="blbiacon">
          <span>叶酸</span
          ><span><input type="number" v-model="elementfolicacid" />mmol/g</span>
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
      <div class="blbibut" @click="$throttle(subblbi)">提交</div>
    </div>
    <van-image-preview v-model="show" :images="images1" v-myOn:click="fn">
    </van-image-preview>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { ImagePreview, Toast } from "vant";
import compressImg from "../../utils/compressImg";
import { mapState } from "vuex";

export default {
  name: "BloodBiochemistry",
  data() {
    return {
      title: "血液生化检测评定",
      customTitle: "营养诊断",
      serumprotein: "",
      pab: "",
      stfr: "",
      rbp: "",
      serumfibronectin: "",
      aminoacidvalues: "",
      elementk: "",
      elementna: "",
      elementfe: "",
      elementcu: "",
      tibc: "",
      elementzn: "",
      elementca: "",
      elementmg: "",
      elementp: "",
      elementse: "",
      elementcr: "",
      elementi: "",
      elementvita: "",
      elementvitc: "",
      serumvitd3: "",
      elementvite: "",
      elementvitk: "",
      elementvitb1: "",
      elementvitb2: "",
      elementvitb6: "",
      elementvitb12: "",
      elementfolicacid: "",
      images: [],
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
    this.selblbi();
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
    selblbi() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectBlood",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            needRet: 0,
          },
        })
        .then((res) => {
          this.serumprotein = res.data.data.serumprotein;
          this.pab = res.data.data.pab;
          this.stfr = res.data.data.stfr;
          this.rbp = res.data.data.rbp;
          this.serumfibronectin = res.data.data.serumfibronectin;
          this.aminoacidvalues = res.data.data.aminoacidvalues;
          this.elementk = res.data.data.elementk;
          this.elementna = res.data.data.elementna;
          this.elementfe = res.data.data.elementfe;
          this.elementcu = res.data.data.elementcu;
          this.tibc = res.data.data.tibc;
          this.elementzn = res.data.data.elementzn;
          this.elementca = res.data.data.elementca;
          this.elementmg = res.data.data.elementmg;
          this.elementp = res.data.data.elementp;
          this.elementse = res.data.data.elementse;
          this.elementcr = res.data.data.elementcr;
          this.elementi = res.data.data.elementi;
          this.elementvita = res.data.data.elementvita;
          this.elementvitc = res.data.data.elementvitc;
          this.serumvitd3 = res.data.data.serumvitd3;
          this.elementvite = res.data.data.elementvite;
          this.elementvitk = res.data.data.elementvitk;
          this.elementvitb1 = res.data.data.elementvitb1;
          this.elementvitb2 = res.data.data.elementvitb2;
          this.elementvitb6 = res.data.data.elementvitb6;
          this.elementvitb12 = res.data.data.elementvitb12;
          this.elementfolicacid = res.data.data.elementfolicacid;
          this.images = res.data.data.picList || [];
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
    subblbi() {
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
            type: 3,
            prestype: this.Patient.prestype,
            serumprotein: this.serumprotein,
            pab: this.pab,
            stfr: this.stfr,
            rbp: this.rbp,
            serumfibronectin: this.serumfibronectin,
            aminoacidvalues: this.aminoacidvalues,
            elementk: this.elementk,
            elementna: this.elementna,
            elementfe: this.elementfe,
            elementcu: this.elementcu,
            tibc: this.tibc,
            elementzn: this.elementzn,
            elementca: this.elementca,
            elementmg: this.elementmg,
            elementp: this.elementp,
            elementse: this.elementse,
            elementcr: this.elementcr,
            elementi: this.elementi,
            elementvita: this.elementvita,
            elementvitc: this.elementvitc,
            serumvitd3: this.serumvitd3,
            elementvite: this.elementvite,
            elementvitk: this.elementvitk,
            elementvitb1: this.elementvitb1,
            elementvitb2: this.elementvitb2,
            elementvitb6: this.elementvitb6,
            elementvitb12: this.elementvitb12,
            elementfolicacid: this.elementfolicacid,
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
#BloodBiochemistry {
  padding: 0px;
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
  .blbiline {
    width: 351px;
    height: 1px;
  }
  .blbiempty {
    width: 100%;
    height: 98px;
  }
  .blbiall {
    width: 351px;
    margin: 0 auto;
    padding-top: 48px;
  }
  .blbinotice {
    margin-top: 15px;
    width: 100%;
    color: #0069ff;
    font-size: 14px;
  }
  .blbicontentm {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    .blbicontitle {
      width: 100%;
      padding: 15px 10px 10px 10px;
      color: #333;
      font-size: 16px;
    }
  }
  .blbicontentb {
    width: 100%;
    height: auto;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #ffffff;
    .blbicontitle {
      width: 100%;
      padding: 15px 10px 10px 10px;
      color: #333;
      font-size: 16px;
    }
  }
  .blbicontent {
    width: 100%;
    height: auto;
    margin-top: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #ffffff;
  }
  .blbiacon:first-child {
    padding-top: 5px;
  }
  .blbiacon:last-child {
    padding-bottom: 5px;
  }
  .blbiacon {
    width: 100%;
    height: auto;
    padding: 0 10px;
    color: #333;
    font-size: 16px;
    line-height: 35px;
    span {
      height: 35px;
    }
    input {
      width: 50px;
      height: 25px;
      margin-left: 30px;
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
  .blbibut {
    width: 100%;
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
    margin-top: 20px;
  }
}
</style>
