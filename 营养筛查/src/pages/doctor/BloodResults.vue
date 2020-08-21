<!--
* @description
* @fileName 血液生化检测评定结果.vue
* @author weixueyuan
* @date 2020/04/01 16:51:15
!-->
<template>
  <div id="BloodResults">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="blreall">
      <div class="blretable">
        <div class="blretabletit">
          “<img src="../../assets/img/trretop.png" />”代表高于标准值，“<img
            src="../../assets/img/trrebut.png"
          />”代表低于标准值， 无箭头代表正常值
        </div>
        <div class="box">
          <div class="top">
            <div class="left">项目</div>
            <div class="left_right">结果</div>
            <div class="right_left">单位</div>
            <div class="right">参考值</div>
          </div>
          <div class="body">
            <div class="body_box">
              <div class="left">血清蛋白值</div>
              <div v-if="serumproteinRet == 1" class="left_right trretop">
                {{ serumprotein }}
              </div>
              <div v-else-if="serumproteinRet == 2" class="left_right trrebut">
                {{ serumprotein }}
              </div>
              <div v-else class="left_right">{{ serumprotein }}</div>
              <div class="right_left">g/L</div>
              <div class="right">35～51</div>
            </div>
            <div class="body_box">
              <div class="left">血清前白蛋白</div>
              <div v-if="pabRet == 1" class="left_right trretop">{{ pab }}</div>
              <div v-else-if="pabRet == 2" class="left_right trrebut">
                {{ pab }}
              </div>
              <div v-else class="left_right">{{ pab }}</div>
              <div class="right_left">g/L</div>
              <div class="right">0.28～0.36</div>
            </div>
            <div class="body_box">
              <div class="left">血清转铁蛋白</div>
              <div v-if="stfrRet == 1" class="left_right trretop">
                {{ stfr }}
              </div>
              <div v-else-if="stfrRet == 2" class="left_right trrebut">
                {{ stfr }}
              </div>
              <div v-else class="left_right">{{ stfr }}</div>
              <div class="right_left">g/L</div>
              <div class="right">2.0～4.0</div>
            </div>
            <div class="body_box">
              <div class="left">血清视黄醇结合蛋白</div>
              <div v-if="rbpRet == 1" class="left_right trretop">{{ rbp }}</div>
              <div v-else-if="rbpRet == 2" class="left_right trrebut">
                {{ rbp }}
              </div>
              <div v-else class="left_right">{{ rbp }}</div>
              <div class="right_left">µg/g</div>
              <div class="right">26.7～57.9</div>
            </div>
            <div class="body_box">
              <div class="left">血清纤维结合蛋白</div>
              <div v-if="serumfibronectinRet == 1" class="left_right trretop">
                {{ serumfibronectin }}
              </div>
              <div
                v-else-if="serumfibronectinRet == 2"
                class="left_right trrebut"
              >
                {{ serumfibronectin }}
              </div>
              <div v-else class="left_right">{{ serumfibronectin }}</div>
              <div class="right_left">µg/g</div>
              <div class="right">185～277</div>
            </div>
            <div class="body_box">
              <div class="left">血浆氨基酸谱</div>
              <div v-if="aminoacidvaluesRet == 1" class="left_right trretop">
                {{ aminoacidvalues }}
              </div>
              <div
                v-else-if="aminoacidvaluesRet == 2"
                class="left_right trrebut"
              >
                {{ aminoacidvalues }}
              </div>
              <div v-else class="left_right">{{ aminoacidvalues }}</div>
              <div class="right_left">值</div>
              <div class="right">1.8～2.2</div>
            </div>
          </div>
        </div>
      </div>
      <div class="blretable">
        <div class="blretabletit">
          <p>人体内的电解质与微量元素检测</p>
          “<img src="../../assets/img/trretop.png" />”代表高于标准值，“<img
            src="../../assets/img/trrebut.png"
          />”代表低于标准值， 无箭头代表正常值
        </div>
        <div class="box">
          <div class="top">
            <div class="left">项目</div>
            <div class="left_right">结果</div>
            <div class="right_left">单位</div>
            <div class="right">参考值</div>
          </div>
          <div class="body">
            <div class="body_box">
              <div class="left">钾</div>
              <div v-if="elementkRet == 1" class="left_right trretop">
                {{ elementk }}
              </div>
              <div v-else-if="elementkRet == 2" class="left_right trrebut">
                {{ elementk }}
              </div>
              <div v-else class="left_right">{{ elementk }}</div>
              <div class="right_left">mmol/L</div>
              <div class="right">3.6～5.5</div>
            </div>
            <div class="body_box">
              <div class="left">钠</div>
              <div v-if="elementnaRet == 1" class="left_right trretop">
                {{ elementna }}
              </div>
              <div v-else-if="elementnaRet == 2" class="left_right trrebut">
                {{ elementna }}
              </div>
              <div v-else class="left_right">{{ elementna }}</div>
              <div class="right_left">mmol/L</div>
              <div class="right">131～148</div>
            </div>
            <div class="body_box">
              <div class="left">铁</div>
              <div v-if="elementfeRet == 1" class="left_right trretop">
                {{ elementfe }}
              </div>
              <div v-else-if="elementfeRet == 2" class="left_right trrebut">
                {{ elementfe }}
              </div>
              <div v-else class="left_right">{{ elementfe }}</div>
              <div class="right_left">µmol/L</div>
              <div class="right">13.6～28.28</div>
            </div>
            <div class="body_box">
              <div class="left">铜</div>
              <div v-if="elementcuRet == 1" class="left_right trretop">
                {{ elementcu }}
              </div>
              <div v-else-if="elementcuRet == 2" class="left_right trrebut">
                {{ elementcu }}
              </div>
              <div v-else class="left_right">{{ elementcu }}</div>
              <div class="right_left">µmol/L</div>
              <div class="right">10.99～21.98</div>
            </div>
            <div class="body_box">
              <div class="left">血清总铁结合量(TIBC)</div>
              <div v-if="tibcRet == 1" class="left_right trretop">
                {{ tibc }}
              </div>
              <div v-else-if="tibcRet == 2" class="left_right trrebut">
                {{ tibc }}
              </div>
              <div v-else class="left_right">{{ tibc }}</div>
              <div class="right_left">µmol/L</div>
              <div class="right">45～75</div>
            </div>
            <div class="body_box">
              <div class="left">锌</div>
              <div v-if="elementznRet == 1" class="left_right trretop">
                {{ elementzn }}
              </div>
              <div v-else-if="elementznRet == 2" class="left_right trrebut">
                {{ elementzn }}
              </div>
              <div v-else class="left_right">{{ elementzn }}</div>
              <div class="right_left">mmol/L</div>
              <div class="right">8.42～22.95</div>
            </div>
            <div class="body_box">
              <div class="left">钙</div>
              <div v-if="elementcaRet == 1" class="left_right trretop">
                {{ elementca }}
              </div>
              <div v-else-if="elementcaRet == 2" class="left_right trrebut">
                {{ elementca }}
              </div>
              <div v-else class="left_right">{{ elementca }}</div>
              <div class="right_left">mmol/L</div>
              <div class="right">2.25～3.0</div>
            </div>
            <div class="body_box">
              <div class="left">镁</div>
              <div v-if="elementmgRet == 1" class="left_right trretop">
                {{ elementmg }}
              </div>
              <div v-else-if="elementmgRet == 2" class="left_right trrebut">
                {{ elementmg }}
              </div>
              <div v-else class="left_right">{{ elementmg }}</div>
              <div class="right_left">mmol/L</div>
              <div class="right">0.70～1.15</div>
            </div>
            <div class="body_box">
              <div class="left">磷</div>
              <div v-if="elementpRet == 1" class="left_right trretop">
                {{ elementp }}
              </div>
              <div v-else-if="elementpRet == 2" class="left_right trrebut">
                {{ elementp }}
              </div>
              <div v-else class="left_right">{{ elementp }}</div>
              <div class="right_left">mmol/L</div>
              <div class="right">0.97～1.66</div>
            </div>
            <div class="body_box">
              <div class="left">硒</div>
              <div v-if="elementseRet == 1" class="left_right trretop">
                {{ elementse }}
              </div>
              <div v-else-if="elementseRet == 2" class="left_right trrebut">
                {{ elementse }}
              </div>
              <div v-else class="left_right">{{ elementse }}</div>
              <div class="right_left">µg/L</div>
              <div class="right">18.0～40.0</div>
            </div>
            <div class="body_box">
              <div class="left">铬</div>
              <div v-if="elementcrRet == 1" class="left_right trretop">
                {{ elementcr }}
              </div>
              <div v-else-if="elementcrRet == 2" class="left_right trrebut">
                {{ elementcr }}
              </div>
              <div v-else class="left_right">{{ elementcr }}</div>
              <div class="right_left">µmol/L</div>
              <div class="right">0.24～1.06</div>
            </div>
            <div class="body_box">
              <div class="left">碘</div>
              <div v-if="elementiRet == 1" class="left_right trretop">
                {{ elementi }}
              </div>
              <div v-else-if="elementiRet == 2" class="left_right trrebut">
                {{ elementi }}
              </div>
              <div v-else class="left_right">{{ elementi }}</div>
              <div class="right_left">mg</div>
              <div class="right">15～20</div>
            </div>
          </div>
        </div>
      </div>
      <div class="blretable">
        <div class="blretabletit">
          <p>血清维生素测定</p>
          “<img src="../../assets/img/trretop.png" />”代表高于标准值，“<img
            src="../../assets/img/trrebut.png"
          />”代表低于标准值， 无箭头代表正常值
        </div>
        <div class="box">
          <div class="top">
            <div class="left">项目</div>
            <div class="left_right">结果</div>
            <div class="right_left">单位</div>
            <div class="right">参考值</div>
          </div>
          <div class="body">
            <div class="body_box">
              <div class="left">VitA</div>
              <div v-if="elementvitaRet == 1" class="left_right trretop">
                {{ elementvita }}
              </div>
              <div v-else-if="elementvitaRet == 2" class="left_right trrebut">
                {{ elementvita }}
              </div>
              <div v-else class="left_right">{{ elementvita }}</div>
              <div class="right_left">µmol/L</div>
              <div class="right">1.05～3.15</div>
            </div>
            <div class="body_box">
              <div class="left">VitC</div>
              <div v-if="elementvitcRet == 1" class="left_right trretop">
                {{ elementvitc }}
              </div>
              <div v-else-if="elementvitcRet == 2" class="left_right trrebut">
                {{ elementvitc }}
              </div>
              <div v-else class="left_right">{{ elementvitc }}</div>
              <div class="right_left">mmol/L</div>
              <div class="right">1.42～1.71</div>
            </div>
            <div class="body_box">
              <div class="left">血清维生素D3</div>
              <div v-if="serumvitd3Ret == 1" class="left_right trretop">
                {{ serumvitd3 }}
              </div>
              <div v-else-if="serumvitd3Ret == 2" class="left_right trrebut">
                {{ serumvitd3 }}
              </div>
              <div v-else class="left_right">{{ serumvitd3 }}</div>
              <div class="right_left">µg/L</div>
              <div class="right">10～80</div>
            </div>
            <div class="body_box">
              <div class="left">VitE</div>
              <div v-if="elementviteRet == 1" class="left_right trretop">
                {{ elementvite }}
              </div>
              <div v-else-if="elementviteRet == 2" class="left_right trrebut">
                {{ elementvite }}
              </div>
              <div v-else class="left_right">{{ elementvite }}</div>
              <div class="right_left">µmol/L</div>
              <div class="right">26.98～42.96</div>
            </div>
            <div class="body_box">
              <div class="left">VitK</div>
              <div v-if="elementvitkRet == 1" class="left_right trretop">
                {{ elementvitk }}
              </div>
              <div v-else-if="elementvitkRet == 2" class="left_right trrebut">
                {{ elementvitk }}
              </div>
              <div v-else class="left_right">{{ elementvitk }}</div>
              <div class="right_left">nmol/L</div>
              <div class="right">1.1～4.4</div>
            </div>
            <div class="body_box">
              <div class="left">VitB1</div>
              <div v-if="elementvitb1Ret == 1" class="left_right trretop">
                {{ elementvitb1 }}
              </div>
              <div v-else-if="elementvitb1Ret == 2" class="left_right trrebut">
                {{ elementvitb1 }}
              </div>
              <div v-else class="left_right">{{ elementvitb1 }}</div>
              <div class="right_left">nmol/L</div>
              <div class="right">0.0～75.4</div>
            </div>
            <div class="body_box">
              <div class="left">VitB2</div>
              <div v-if="elementvitb2Ret == 1" class="left_right trretop">
                {{ elementvitb2 }}
              </div>
              <div v-else-if="elementvitb2Ret == 2" class="left_right trrebut">
                {{ elementvitb2 }}
              </div>
              <div v-else class="left_right">{{ elementvitb2 }}</div>
              <div class="right_left">µg/g</div>
              <div class="right">1.2～1.4</div>
            </div>
            <div class="body_box">
              <div class="left">VitB6</div>
              <div v-if="elementvitb6Ret == 1" class="left_right trretop">
                {{ elementvitb6 }}
              </div>
              <div v-else-if="elementvitb6Ret == 2" class="left_right trrebut">
                {{ elementvitb6 }}
              </div>
              <div v-else class="left_right">{{ elementvitb6 }}</div>
              <div class="right_left">µmol/L</div>
              <div class="right">15～53</div>
            </div>
            <div class="body_box">
              <div class="left">VitB12</div>
              <div v-if="elementvitb12Ret == 1" class="left_right trretop">
                {{ elementvitb12 }}
              </div>
              <div v-else-if="elementvitb12Ret == 2" class="left_right trrebut">
                {{ elementvitb12 }}
              </div>
              <div v-else class="left_right">{{ elementvitb12 }}</div>
              <div class="right_left">pmol/L</div>
              <div class="right">81～590</div>
            </div>
            <div class="body_box">
              <div class="left">叶酸</div>
              <div v-if="elementfolicacidRet == 1" class="left_right trretop">
                {{ elementfolicacid }}
              </div>
              <div
                v-else-if="elementfolicacidRet == 2"
                class="left_right trrebut"
              >
                {{ elementfolicacid }}
              </div>
              <div v-else class="left_right">{{ elementfolicacid }}</div>
              <div class="right_left">nmol/L</div>
              <div class="right">4.3～31.7</div>
            </div>
          </div>
        </div>
      </div>
      <div class="v-box">
        <div class="v-listBox">
          <div class="v-title">
            <div class="v-titleall">
              <div class="v-titleicon"></div>
              <div class="v-titletxt">报告图片</div>
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
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="blrebut" @click="$throttle(toback)">确认返回</div>
    </div>
    <van-image-preview v-model="show" :images="images1" v-myOn:click="fn">
    </van-image-preview>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { ImagePreview } from "vant";
export default {
  name: "BloodResults",
  data() {
    return {
      title: "血液生化检测评定结果",
      customTitle: "营养诊断",
      serumprotein: "",
      serumproteinRet: "",
      pab: "",
      pabRet: "",
      stfr: "",
      stfrRet: "",
      rbp: "",
      rbpRet: "",
      serumfibronectin: "",
      serumfibronectinRet: "",
      aminoacidvalues: "",
      aminoacidvaluesRet: "",
      elementk: "",
      elementkRet: "",
      elementna: "",
      elementnaRet: "",
      elementfe: "",
      elementfeRet: "",
      elementcu: "",
      elementcuRet: "",
      tibc: "",
      tibcRet: "",
      elementzn: "",
      elementznRet: "",
      elementca: "",
      elementcaRet: "",
      elementmg: "",
      elementmgRet: "",
      elementp: "",
      elementpRet: "",
      elementse: "",
      elementseRet: "",
      elementcr: "",
      elementcrRet: "",
      elementi: "",
      elementiRet: "",

      elementvita: "",
      elementvitaRet: "",
      elementvitc: "",
      elementvitcRet: "",
      serumvitd3: "",
      serumvitd3Ret: "",
      elementvite: "",
      elementviteRet: "",
      elementvitk: "",
      elementvitkRet: "",
      elementvitb1: "",
      elementvitb1Ret: "",
      elementvitb2: "",
      elementvitb2Ret: "",
      elementvitb6: "",
      elementvitb6Ret: "",
      elementvitb12: "",
      elementvitb12Ret: "",
      elementfolicacid: "",
      elementfolicacidRet: "",
      images: [],
      images1: [],
      show: false,
    };
  },

  components: {
    commonHeader,
  },

  created() {
    this.selblre();
  },

  computed: {},

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
    toback() {
      this.$router.go(-1);
    },
    selblre() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectBlood",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            needRet: 1,
          },
        })
        .then((res) => {
          this.serumprotein = res.data.data.serumprotein;
          this.serumproteinRet = res.data.data.serumproteinRet;
          this.pab = res.data.data.pab;
          this.pabRet = res.data.data.pabRet;
          this.stfr = res.data.data.stfr;
          this.stfrRet = res.data.data.stfrRet;
          this.rbp = res.data.data.rbp;
          this.rbpRet = res.data.data.rbpRet;
          this.serumfibronectin = res.data.data.serumfibronectin;
          this.serumfibronectinRet = res.data.data.serumfibronectinRet;
          this.aminoacidvalues = res.data.data.aminoacidvalues;
          this.aminoacidvaluesRet = res.data.data.aminoacidvaluesRet;
          this.elementk = res.data.data.elementk;
          this.elementkRet = res.data.data.elementkRet;
          this.elementna = res.data.data.elementna;
          this.elementnaRet = res.data.data.elementnaRet;
          this.elementfe = res.data.data.elementfe;
          this.elementfeRet = res.data.data.elementfeRet;
          this.elementcu = res.data.data.elementcu;
          this.elementcuRet = res.data.data.elementcuRet;
          this.tibc = res.data.data.tibc;
          this.tibcRet = res.data.data.tibcRet;
          this.elementzn = res.data.data.elementzn;
          this.elementznRet = res.data.data.elementznRet;
          this.elementca = res.data.data.elementca;
          this.elementcaRet = res.data.data.elementcaRet;
          this.elementmg = res.data.data.elementmg;
          this.elementmgRet = res.data.data.elementmgRet;
          this.elementp = res.data.data.elementp;
          this.elementpRet = res.data.data.elementpRet;
          this.elementse = res.data.data.elementse;
          this.elementseRet = res.data.data.elementseRet;
          this.elementcr = res.data.data.elementcr;
          this.elementcrRet = res.data.data.elementcrRet;
          this.elementi = res.data.data.elementi;
          this.elementiRet = res.data.data.elementiRet;

          this.elementvita = res.data.data.elementvita;
          this.elementvitaRet = res.data.data.elementvitaRet;
          this.elementvitc = res.data.data.elementvitc;
          this.elementvitcRet = res.data.data.elementvitcRet;
          this.serumvitd3 = res.data.data.serumvitd3;
          this.serumvitd3Ret = res.data.data.serumvitd3Ret;
          this.elementvite = res.data.data.elementvite;
          this.elementviteRet = res.data.data.elementviteRet;
          this.elementvitk = res.data.data.elementvitk;
          this.elementvitkRet = res.data.data.elementvitkRet;
          this.elementvitb1 = res.data.data.elementvitb1;
          this.elementvitb1Ret = res.data.data.elementvitb1Ret;
          this.elementvitb2 = res.data.data.elementvitb2;
          this.elementvitb2Ret = res.data.data.elementvitb2Ret;
          this.elementvitb6 = res.data.data.elementvitb6;
          this.elementvitb6Ret = res.data.data.elementvitb6Ret;
          this.elementvitb12 = res.data.data.elementvitb12;
          this.elementvitb12Ret = res.data.data.elementvitb12Ret;
          this.elementfolicacid = res.data.data.elementfolicacid;
          this.elementfolicacidRet = res.data.data.elementfolicacidRet;
          this.images = res.data.data.picList || [];
        })
        .catch((error) => {
          console.log("错误为" + error);
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
#BloodResults {
  padding: 0px;
  font-size: 16px;
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
  .blreall {
    .blretable {
      margin-top: 15px;
      background-color: #fff;
      border-radius: 10px;
      .blretabletit {
        padding: 13px 20px;
        text-align: center;
        line-height: 20px;
        color: #666;
        // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        p {
          font-size: 18px;
          color: #333;
          margin-bottom: 5px;
        }
        img {
          width: 8px;
          height: 17px;
        }
      }
      .blretablet {
        height: 46px;
        padding: 0px 34px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
        color: #333333;
        flex: 1;
      }

      .blretableb {
        margin-top: 15px;
      }
      .box {
        .top {
          display: flex;
          line-height: 46px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
        }
        .body {
          padding-bottom: 15px;
        }
        .body .body_box {
          display: flex;
          line-height: 20px;
          padding: 15px 0 0 0;
          color: #666666;
          div {
            display: flex;
            align-items: center;
            justify-content: center;
            background-repeat: no-repeat;
            background-position: right center;
            background-size: 9px auto;
          }
          .trrebut {
            background-image: url("../../assets/img/trrebut.png");
          }
          .trretop {
            background-image: url("../../assets/img/trretop.png");
          }
        }
        div {
          text-align: center;
        }
        .left {
          width: 100px;
        }
        .left_right {
          width: 56px;
        }
        .right_left {
          width: 77px;
        }
        .right {
          width: 118px;
        }
      }
    }
    width: 351px;
    height: 100%;
    margin: 0 auto;
    padding-top: 48px;
    font-size: 16px;
    line-height: 46px;
    .blrebut {
      width: 351px;
      height: 44px;
      color: #ffffff;
      font-size: 18px;
      text-align: center;
      line-height: 44px;
      margin-top: 20px;
      background: linear-gradient(
        225deg,
        rgba(1, 128, 255, 1) 0%,
        rgba(0, 105, 255, 1) 100%
      );
      border-radius: 10px;
      margin-bottom: 20px;
    }
  }
}
</style>
