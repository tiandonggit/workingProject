<!--
* @description
* @fileName 尿液生化检测评定.vue
* @author weixueyuan
* @date 2020/03/31 13:32:31
!-->
<template>
  <div id="UrineBiochemistry">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="urbiall">
      <div class="urbinotice">请根据患者报告信息选填录入结果数值</div>
      <div class="urbicontent">
        <div class="urbiacon">
          <span>尿羟脯氨酸排出量</span
          ><span
            ><input type="number" v-model="urinehypexcretion" />mmol/L/24h</span
          >
        </div>
        <div class="urbiacon">
          <span>尿中3-甲基组氨酸排出量</span
          ><span
            ><input type="number" v-model="methylhistidineexcr" />µmol/g</span
          >
        </div>
        <div class="urbiacon">
          <span>尿素/肌酐比值</span
          ><span><input type="number" v-model="ucpcr" />：1</span>
        </div>
        <div class="urbiacon">
          <span>尿肌酸酐体重系数(CBWI)</span
          ><span><input type="number" v-model="cbwi" />mg/kg</span>
        </div>
        <div class="urbiacon">
          <span>尿肌酸酐身高指数(CHI)</span
          ><span><input type="number" v-model="chi" />/24h</span>
        </div>
        <div class="urbiacon">
          <span>肌酐身高比(CHR)</span
          ><span><input type="number" v-model="chr" />%</span>
        </div>
      </div>
      <div class="urbiline"></div>
      <div class="urbicontentm">
        <div class="urbicontitle">1.尿盐类检测</div>
        <div class="urbiacon">
          <span>尿肌酸</span
          ><span><input type="number" v-model="urinecreatine" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿素</span
          ><span><input type="number" v-model="ucre" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿肌酐</span
          ><span><input type="number" v-model="creatinine" />µmol/kg/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿酸</span
          ><span><input type="number" v-model="uricacid" />mmol/24h</span>
        </div>
      </div>
      <div class="urbiline"></div>
      <div class="urbicontentm">
        <div class="urbicontitle">2.尿电解质检测</div>
        <div class="urbiacon">
          <span>尿钠</span
          ><span><input type="number" v-model="uricna" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿钾</span
          ><span><input type="number" v-model="urinek" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿钙</span
          ><span><input type="number" v-model="urineca" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿磷</span
          ><span><input type="number" v-model="urinep" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿锌</span
          ><span><input type="number" v-model="urinezn" />µmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿碘</span
          ><span><input type="number" v-model="urinei" />µg/L</span>
        </div>
        <div class="urbiacon">
          <span>尿氯</span
          ><span><input type="number" v-model="urinecl" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿镁</span
          ><span><input type="number" v-model="urinemg" />mmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿铜</span
          ><span><input type="number" v-model="urinecu" />µmol/24h</span>
        </div>
      </div>
      <div class="urbiline"></div>
      <div class="urbicontentb">
        <div class="urbicontitle">3.尿维生素代谢检测</div>
        <div class="urbiacon">
          <span>尿中烟酸代谢产物排出量</span
          ><span
            ><input type="number" v-model="urineniacinmetabolitees" />mg</span
          >
        </div>
        <div class="urbiacon">
          <span>尿中核黄素排出量</span
          ><span><input type="number" v-model="urineriboflavin" />µg/L</span>
        </div>
        <div class="urbiacon">
          <span>尿中硫胺素排出量</span
          ><span><input type="number" v-model="urinethiamine" />ug</span>
        </div>
        <div class="urbiacon">
          <span>尿Vit C负荷</span
          ><span><input type="number" v-model="urinevitcload" />mg</span>
        </div>
        <div class="urbiacon">
          <span>尿吡哆酸测定</span
          ><span><input type="number" v-model="pyridoxinetest" />µmol/24h</span>
        </div>
        <div class="urbiacon">
          <span>尿硫胺素/肌酐排出量</span
          ><span><input type="number" v-model="utco" />µg/L</span>
        </div>
        <div class="urbiacon">
          <span>尿核黄素/肌酐排出量</span
          ><span><input type="number" v-model="urce" />µg/L</span>
        </div>
        <div class="urbiacon">
          <span>烟酸代谢产物/肌酐排出量</span
          ><span><input type="number" v-model="nmco" />µg/L</span>
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
      <div class="urbibut" @click="$throttle(suburi)">提交</div>
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
  name: "UrineBiochemistry",
  data() {
    return {
      title: "尿液生化检测评定",
      customTitle: "营养诊断",
      urinehypexcretion: "",
      methylhistidineexcr: "",
      ucpcr: "",
      cbwi: "",
      chi: "",
      chr: "",
      urinecreatine: "",
      ucre: "",
      creatinine: "",
      uricacid: "",
      uricna: "",
      urinek: "",
      urinep: "",
      urineca: "",
      urinezn: "",
      urinei: "",
      urinemg: "",
      urinecl: "",
      urinecu: "",
      urineniacinmetabolitees: "",
      urineriboflavin: "",
      urinethiamine: "",
      urinevitcload: "",
      pyridoxinetest: "",
      utco: "",
      urce: "",
      nmco: "",
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
    this.selurbi();
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
    selurbi() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectUrine",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            needRet: 0,
          },
        })
        .then((res) => {
          this.urinehypexcretion = res.data.data.urinehypexcretion;
          this.methylhistidineexcr = res.data.data.methylhistidineexcr;
          this.ucpcr = res.data.data.ucpcr;
          this.cbwi = res.data.data.cbwi;
          this.chi = res.data.data.chi;
          this.chr = res.data.data.chr;
          this.urinecreatine = res.data.data.urinecreatine;
          this.ucre = res.data.data.ucre;
          this.creatinine = res.data.data.creatinine;
          this.uricacid = res.data.data.uricacid;
          this.uricna = res.data.data.uricna;
          this.urinek = res.data.data.urinek;
          this.urineca = res.data.data.urineca;
          this.urinep = res.data.data.urinep;
          this.urinezn = res.data.data.urinezn;
          this.urinei = res.data.data.urinei;
          this.urinemg = res.data.data.urinemg;
          this.urinecl = res.data.data.urinecl;
          this.urinecu = res.data.data.urinecu;
          this.urineniacinmetabolitees = res.data.data.urineniacinmetabolitees;
          this.urineriboflavin = res.data.data.urineriboflavin;
          this.urinethiamine = res.data.data.urinethiamine;
          this.urinevitcload = res.data.data.urinevitcload;
          this.pyridoxinetest = res.data.data.pyridoxinetest;
          this.utco = res.data.data.utco;
          this.urce = res.data.data.urce;
          this.nmco = res.data.data.nmco;
          this.images = res.data.data.picList || [];
        })
        .catch((error) => {
          console.log("错误为" + error);
        });
    },
    suburi() {
      let addpicIds = "";
      addpicIds = this.addpicIds.substring(0, this.addpicIds.lastIndexOf(","));
      let delpicIds = "";
      delpicIds = this.delpicIds.substring(0, this.delpicIds.lastIndexOf(","));
      this.$http
        .request({
          method: "post",
          url: "/NNutritionAssessmentController/insertOrUpdate",
          body: {
            id: window.sessionStorage.getItem("id"),
            // id: 501393130705262510,
            type: 4,
            prestype: this.Patient.prestype,
            urinehypexcretion: this.urinehypexcretion,
            methylhistidineexcr: this.methylhistidineexcr,
            ucpcr: this.ucpcr,
            cbwi: this.cbwi,
            chi: this.chi,
            chr: this.chr,
            urinecreatine: this.urinecreatine,
            ucre: this.ucre,
            creatinine: this.creatinine,
            uricacid: this.uricacid,
            uricna: this.uricna,
            urinek: this.urinek,
            urinep: this.urinep,
            urineca: this.urineca,
            urinezn: this.urinezn,
            urinei: this.urinei,
            urinemg: this.urinemg,
            urinecl: this.urinecl,
            urinecu: this.urinecu,
            urineniacinmetabolitees: this.urineniacinmetabolitees,
            urineriboflavin: this.urineriboflavin,
            urinethiamine: this.urinethiamine,
            urinevitcload: this.urinevitcload,
            pyridoxinetest: this.pyridoxinetest,
            utco: this.utco,
            urce: this.urce,
            nmco: this.nmco,
            addpicIds: addpicIds,
            delpicIds: delpicIds,
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            Toast("提交成功");
            this.$router.go(-1);
          } else {
            Toast("提交失败");
          }
        })
        .catch((error) => {
          console.log(error);
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
#UrineBiochemistry {
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
  .urbiline {
    width: 351px;
    height: 1px;
  }
  .urbiempty {
    width: 100%;
    height: 98px;
  }
  .urbiall {
    width: 351px;
    margin: 0 auto;
    padding-top: 48px;
  }
  .urbinotice {
    margin-top: 15px;
    width: 100%;
    color: #0069ff;
    font-size: 14px;
  }
  .urbicontentm {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    .urbicontitle {
      width: 100%;
      padding: 15px 10px 10px 10px;
      color: #333;
      font-size: 16px;
    }
  }
  .urbicontentb {
    width: 100%;
    height: auto;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #ffffff;
    .urbicontitle {
      width: 100%;
      padding: 15px 10px 10px 10px;
      color: #333;
      font-size: 16px;
    }
  }
  .urbicontent {
    width: 100%;
    height: auto;
    margin-top: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #ffffff;
  }
  .urbiacon:first-child {
    padding-top: 5px;
  }
  .urbiacon:last-child {
    padding-bottom: 5px;
  }
  .urbiacon {
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
  .urbibut {
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
