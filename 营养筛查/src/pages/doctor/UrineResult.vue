<!--
* @description
* @fileName 尿液生化检测评定结果.vue
* @author weixueyuan
* @date 2020/04/01 15:31:50
!-->
<template>
  <div id="UrineResult">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="urreall">
      <div class="urretable">
        <div class="urretabletit">
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
              <div class="left">尿羟脯氨酸排出量</div>
              <div v-if="urinehypexcretionRet == 1" class="left_right trretop">
                {{ urinehypexcretion }}
              </div>
              <div
                v-else-if="urinehypexcretionRet == 2"
                class="left_right trrebut"
              >
                {{ urinehypexcretion }}
              </div>
              <div v-else class="left_right">
                {{ urinehypexcretion }}
              </div>
              <div class="right_left">mmol/L/24h</div>
              <div class="right">0.11～0.42</div>
            </div>
            <div class="body_box">
              <div class="left">尿中3-甲基氨酸排出量</div>
              <div
                v-if="methylhistidineexcrRet == 1"
                class="left_right trretop"
              >
                {{ methylhistidineexcr }}
              </div>
              <div
                v-else-if="methylhistidineexcrRet == 2"
                class="left_right trrebut"
              >
                {{ methylhistidineexcr }}
              </div>
              <div v-else class="left_right">
                {{ methylhistidineexcr }}
              </div>
              <div class="right_left">µmol/g</div>
              <div class="right">197～311</div>
            </div>
            <div class="body_box">
              <div class="left">尿素/肌酐比例</div>
              <div v-if="ucpcrRet == 1" class="left_right trretop">
                {{ ucpcr }}
              </div>
              <div v-else-if="ucpcrRet == 2" class="left_right trrebut">
                {{ ucpcr }}
              </div>
              <div v-else class="left_right">
                {{ ucpcr }}
              </div>
              <div class="right_left">比值</div>
              <div class="right">12～20</div>
            </div>
            <div class="body_box">
              <div class="left">尿肌酸酐体重系数（CBWI）</div>
              <div v-if="cbwiRet == 1" class="left_right trretop">
                {{ cbwi }}
              </div>
              <div v-else-if="cbwiRet == 2" class="left_right trrebut">
                {{ cbwi }}
              </div>
              <div v-else class="left_right">
                {{ cbwi }}
              </div>
              <div class="right_left">值/24h</div>
              <div class="right">19～21</div>
            </div>
            <div class="body_box">
              <div class="left">尿肌酸酐身高指数（CHI）</div>
              <div v-if="chiRet == 1" class="left_right trretop">
                {{ chi }}
              </div>
              <div v-else-if="chiRet == 2" class="left_right trrebut">
                {{ chi }}
              </div>
              <div v-else class="left_right">
                {{ chi }}
              </div>
              <div class="right_left">mg/kg</div>
              <div class="right">0.9～1.0</div>
            </div>
            <div class="body_box">
              <div class="left">肌酐身高比（CHR）</div>
              <div v-if="chrRet == 1" class="left_right trretop">
                {{ chr }}
              </div>
              <div v-else-if="chrRet == 2" class="left_right trrebut">
                {{ chr }}
              </div>
              <div v-else class="left_right">
                {{ chr }}
              </div>
              <div class="right_left">%</div>
              <div class="right">90～100</div>
            </div>
          </div>
        </div>
      </div>

      <div class="urretable">
        <div class="urretabletit">
          <p>尿盐类检测</p>
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
              <div class="left">尿肌酸</div>
              <div v-if="urinecreatineRet == 1" class="left_right trretop">
                {{ urinecreatine }}
              </div>
              <div v-else-if="urinecreatineRet == 2" class="left_right trrebut">
                {{ urinecreatine }}
              </div>
              <div v-else class="left_right">{{ urinecreatine }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">0～0.30</div>
            </div>
            <div class="body_box">
              <div class="left">尿素</div>
              <div v-if="ucreRet == 1" class="left_right trretop">
                {{ ucre }}
              </div>
              <div v-else-if="ucreRet == 2" class="left_right trrebut">
                {{ ucre }}
              </div>
              <div v-else class="left_right">{{ ucre }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">0.43～0.71</div>
            </div>
            <div class="body_box">
              <div class="left">肌酐</div>
              <div v-if="creatinineRet == 1" class="left_right trretop">
                {{ creatinine }}
              </div>
              <div v-else-if="creatinineRet == 2" class="left_right trrebut">
                {{ creatinine }}
              </div>
              <div v-else class="left_right">{{ creatinine }}</div>
              <div class="right_left">µmol/kg/24h</div>
              <div class="right">124～230</div>
            </div>
            <div class="body_box">
              <div class="left">尿酸</div>
              <div v-if="uricacidRet == 1" class="left_right trretop">
                {{ uricacid }}
              </div>
              <div v-else-if="uricacidRet == 2" class="left_right trrebut">
                {{ uricacid }}
              </div>
              <div v-else class="left_right">{{ uricacid }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">1.48～4.43</div>
            </div>
          </div>
        </div>
      </div>

      <div class="urretable">
        <div class="urretabletit">
          <p>尿电解质检测</p>
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
              <div class="left">尿钠</div>
              <div v-if="uricnaRet == 1" class="left_right trretop">
                {{ uricna }}
              </div>
              <div v-else-if="uricnaRet == 2" class="left_right trrebut">
                {{ uricna }}
              </div>
              <div v-else class="left_right">{{ uricna }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">130～220</div>
            </div>
            <div class="body_box">
              <div class="left">尿钾</div>
              <div v-if="urinekRet == 1" class="left_right trretop">
                {{ urinek }}
              </div>
              <div v-else-if="urinekRet == 2" class="left_right trrebut">
                {{ urinek }}
              </div>
              <div v-else class="left_right">{{ urinek }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">51～102</div>
            </div>
            <div class="body_box">
              <div class="left">尿钙</div>
              <div v-if="urinecaRet == 1" class="left_right trretop">
                {{ urineca }}
              </div>
              <div v-else-if="urinecaRet == 2" class="left_right trrebut">
                {{ urineca }}
              </div>
              <div v-else class="left_right">{{ urineca }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">0～6.25</div>
            </div>
            <div class="body_box">
              <div class="left">尿磷</div>
              <div v-if="urinepRet == 1" class="left_right trretop">
                {{ urinep }}
              </div>
              <div v-else-if="urinepRet == 2" class="left_right trrebut">
                {{ urinep }}
              </div>
              <div v-else class="left_right">{{ urinep }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">23～48</div>
            </div>
            <div class="body_box">
              <div class="left">尿锌</div>
              <div v-if="urineznRet == 1" class="left_right trretop">
                {{ urinezn }}
              </div>
              <div v-else-if="urineznRet == 2" class="left_right trrebut">
                {{ urinezn }}
              </div>
              <div v-else class="left_right">{{ urinezn }}</div>
              <div class="right_left">µmol/24h</div>
              <div class="right">2.3～18.4</div>
            </div>
            <div class="body_box">
              <div class="left">尿碘</div>
              <div v-if="urineiRet == 1" class="left_right trretop">
                {{ urinei }}
              </div>
              <div v-else-if="urineiRet == 2" class="left_right trrebut">
                {{ urinei }}
              </div>
              <div v-else class="left_right">{{ urinei }}</div>
              <div class="right_left">µg/L</div>
              <div class="right">100-500</div>
            </div>
            <div class="body_box">
              <div class="left">尿氯</div>
              <div v-if="urineclRet == 1" class="left_right trretop">
                {{ urinecl }}
              </div>
              <div v-else-if="urineclRet == 2" class="left_right trrebut">
                {{ urinecl }}
              </div>
              <div v-else class="left_right">{{ urinecl }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">280～420</div>
            </div>
            <div class="body_box">
              <div class="left">尿镁</div>
              <div v-if="urinemgRet == 1" class="left_right trretop">
                {{ urinemg }}
              </div>
              <div v-else-if="urinemgRet == 2" class="left_right trrebut">
                {{ urinemg }}
              </div>
              <div v-else class="left_right">{{ urinemg }}</div>
              <div class="right_left">mmol/24h</div>
              <div class="right">3.0～5.0</div>
            </div>
            <div class="body_box">
              <div class="left">尿铜</div>
              <div v-if="urinecuRet == 1" class="left_right trretop">
                {{ urinecu }}
              </div>
              <div v-else-if="urinecuRet == 2" class="left_right trrebut">
                {{ urinecu }}
              </div>
              <div v-else class="left_right">{{ urinecu }}</div>
              <div class="right_left">µmol/24h</div>
              <div class="right">0～0.79</div>
            </div>
          </div>
        </div>
      </div>

      <div class="urretable">
        <div class="urretabletit">
          <p>尿维生素检测结果</p>
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
              <div class="left">尿中烟酸代谢产物排出量</div>
              <div
                v-if="urineniacinmetaboliteesRet == 1"
                class="left_right trretop"
              >
                {{ urineniacinmetabolitees }}
              </div>
              <div
                v-else-if="urineniacinmetaboliteesRet == 2"
                class="left_right trrebut"
              >
                {{ urineniacinmetabolitees }}
              </div>
              <div v-else class="left_right">{{ urineniacinmetabolitees }}</div>
              <div class="right_left">mg</div>
              <div class="right">≥2.5</div>
            </div>
            <div class="body_box">
              <div class="left">尿中核黄素排出量</div>
              <div v-if="urineriboflavinRet == 1" class="left_right trretop">
                {{ urineriboflavin }}
              </div>
              <div
                v-else-if="urineriboflavinRet == 2"
                class="left_right trrebut"
              >
                {{ urineriboflavin }}
              </div>
              <div v-else class="left_right">{{ urineriboflavin }}</div>
              <div class="right_left">µg/L</div>
              <div class="right">800～1300</div>
            </div>
            <div class="body_box">
              <div class="left">尿中硫胺素排出量</div>
              <div v-if="urinethiamineRet == 1" class="left_right trretop">
                {{ urinethiamine }}
              </div>
              <div v-else-if="urinethiamineRet == 2" class="left_right trrebut">
                {{ urinethiamine }}
              </div>
              <div v-else class="left_right">{{ urinethiamine }}</div>
              <div class="right_left">ug</div>
              <div class="right">100～200</div>
            </div>
            <div class="body_box">
              <div class="left">尿VitC负荷</div>
              <div v-if="urinevitcloadRet == 1" class="left_right trretop">
                {{ urinevitcload }}
              </div>
              <div v-else-if="urinevitcloadRet == 2" class="left_right trrebut">
                {{ urinevitcload }}
              </div>
              <div v-else class="left_right">{{ urinevitcload }}</div>
              <div class="right_left">mg</div>
              <div class="right">3～10</div>
            </div>
            <div class="body_box">
              <div class="left">尿呲哆酸测定</div>
              <div v-if="pyridoxinetestRet == 1" class="left_right trretop">
                {{ pyridoxinetest }}
              </div>
              <div
                v-else-if="pyridoxinetestRet == 2"
                class="left_right trrebut"
              >
                {{ pyridoxinetest }}
              </div>
              <div v-else class="left_right">{{ pyridoxinetest }}</div>
              <div class="right_left">µmol/24h</div>
              <div class="right">2.7～7.1</div>
            </div>
            <div class="body_box">
              <div class="left">尿硫铵素/肌酐排出量</div>
              <div v-if="utcoRet == 1" class="left_right trretop">
                {{ utco }}
              </div>
              <div v-else-if="utcoRet == 2" class="left_right trrebut">
                {{ utco }}
              </div>
              <div v-else class="left_right">{{ utco }}</div>
              <div class="right_left">µg/L</div>
              <div class="right">≥66</div>
            </div>
            <div class="body_box">
              <div class="left">尿核黄素/肌酐排出量</div>
              <div v-if="urceRet == 1" class="left_right trretop">
                {{ urce }}
              </div>
              <div v-else-if="urceRet == 2" class="left_right trrebut">
                {{ urce }}
              </div>
              <div v-else class="left_right">{{ urce }}</div>
              <div class="right_left">µg/L</div>
              <div class="right">80～269</div>
            </div>
            <div class="body_box">
              <div class="left">烟酸代谢产物/肌酐排出量</div>
              <div v-if="nmcoRet == 1" class="left_right trretop">
                {{ nmco }}
              </div>
              <div v-else-if="nmcoRet == 2" class="left_right trrebut">
                {{ nmco }}
              </div>
              <div v-else class="left_right">{{ nmco }}</div>
              <div class="right_left">µg/L</div>
              <div class="right">1.6～4.2</div>
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
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="urresbut" @click="$throttle(toback)">确认返回</div>
    </div>
    <van-image-preview v-model="show" :images="images1" v-myOn:click="fn">
    </van-image-preview>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { ImagePreview } from "vant";
export default {
  name: "UrineResult",
  data() {
    return {
      title: "尿液生化检测评定结果",
      customTitle: "营养诊断",
      urinehypexcretion: "",
      urinehypexcretionRet: "",
      methylhistidineexcr: "",
      methylhistidineexcrRet: "",
      ucpcr: "",
      ucpcrRet: "",
      cbwi: "",
      cbwiRet: "",
      chi: "",
      chiRet: "",
      chr: "",
      chrRet: "",
      urinecreatine: "",
      urinecreatineRet: "",
      ucre: "",
      ucreRet: "",
      creatinine: "",
      creatinineRet: "",
      uricacid: "",
      uricacidRet: "",

      uricna: "",
      uricnaRet: "",
      urinek: "",
      urinekRet: "",
      urineca: "",
      urinecaRet: "",
      urinep: "",
      urinepRet: "",
      urinezn: "",
      urineznRet: "",
      urinei: "",
      urineiRet: "",
      urinecl: "",
      urineclRet: "",
      urinemg: "",
      urinemgRet: "",
      urinecu: "",
      urinecuRet: "",

      urineniacinmetabolitees: "",
      urineniacinmetaboliteesRet: "",
      urineriboflavin: "",
      urineriboflavinRet: "",
      urinethiamine: "",
      urinethiamineRet: "",
      urinevitcload: "",
      urinevitcloadRet: "",
      pyridoxinetest: "",
      pyridoxinetestRet: "",
      utco: "",
      utcoRet: "",
      urce: "",
      urceRet: "",
      nmco: "",
      nmcoRet: "",
      images: [],
      images1: [],
      show: false,
    };
  },

  components: {
    commonHeader,
  },

  created() {
    this.selurre();
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
    selurre() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectUrine",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            // patiId: '511953014312013963',
            needRet: 1,
          },
        })
        .then((res) => {
          this.urinehypexcretion = res.data.data.urinehypexcretion;
          this.methylhistidineexcr = res.data.data.methylhistidineexcr;
          this.ucpcr = res.data.data.ucpcr;
          this.cbwi = res.data.data.cbwi;
          this.chi = res.data.data.chi;
          this.chr = res.data.data.chr;
          this.urinehypexcretionRet = res.data.data.urinehypexcretionRet;
          this.methylhistidineexcrRet = res.data.data.methylhistidineexcrRet;
          this.ucpcrRet = res.data.data.ucpcrRet;
          this.cbwiRet = res.data.data.cbwiRet;
          this.chiRet = res.data.data.chiRet;
          this.chrRet = res.data.data.chrRet;

          this.urinecreatine = res.data.data.urinecreatine;
          this.urinecreatineRet = res.data.data.urinecreatineRet;
          this.ucre = res.data.data.ucre;
          this.ucreRet = res.data.data.ucreRet;
          this.creatinine = res.data.data.creatinine;
          this.creatinineRet = res.data.data.creatinineRet;
          this.uricacid = res.data.data.uricacid;
          this.uricacidRet = res.data.data.uricacidRet;

          this.uricna = res.data.data.uricna;
          this.uricnaRet = res.data.data.uricnaRet;
          this.urinek = res.data.data.urinek;
          this.urinekRet = res.data.data.urinekRet;
          this.urineca = res.data.data.urineca;
          this.urinecaRet = res.data.data.urinecaRet;
          this.urinep = res.data.data.urinep;
          this.urinepRet = res.data.data.urinepRet;
          this.urinezn = res.data.data.urinezn;
          this.urineznRet = res.data.data.urineznRet;
          this.urinei = res.data.data.urinei;
          this.urineiRet = res.data.data.urineiRet;
          this.urinecl = res.data.data.urinecl;
          this.urineclRet = res.data.data.urineclRet;
          this.urinemg = res.data.data.urinemg;
          this.urinemgRet = res.data.data.urinemgRet;
          this.urinecu = res.data.data.urinecu;
          this.urinecuRet = res.data.data.urinecuRet;

          this.urineniacinmetabolitees = res.data.data.urineniacinmetabolitees;
          this.urineniacinmetaboliteesRet =
            res.data.data.urineniacinmetaboliteesRet;
          this.urineriboflavin = res.data.data.urineriboflavin;
          this.urineriboflavinRet = res.data.data.urineriboflavinRet;
          this.urinethiamine = res.data.data.urinethiamine;
          this.urinethiamineRet = res.data.data.urinethiamineRet;
          this.urinevitcload = res.data.data.urinevitcload;
          this.urinevitcloadRet = res.data.data.urinevitcloadRet;
          this.pyridoxinetest = res.data.data.pyridoxinetest;
          this.pyridoxinetestRet = res.data.data.pyridoxinetestRet;
          this.utco = res.data.data.utco;
          this.utcoRet = res.data.data.utcoRet;
          this.urce = res.data.data.urce;
          this.urceRet = res.data.data.urceRet;
          this.nmco = res.data.data.nmco;
          this.nmcoRet = res.data.data.nmcoRet;
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
#UrineResult {
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
  .urreall {
    .urretable {
      margin-top: 15px;
      background-color: #fff;
      border-radius: 10px;
      .urretabletit {
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
      .urretablet {
        height: 46px;
        padding: 0px 34px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
        color: #333333;
        flex: 1;
      }

      .urretableb {
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
    .urresbut {
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
