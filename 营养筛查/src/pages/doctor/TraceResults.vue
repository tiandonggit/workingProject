<!--
* @description
* @fileName TraceResults.vue
* @author weixueyuan
* @date 2020/04/01 15:31:50
!-->
<template>
  <div id="TraceResults">
    <commonHeader
      :share-disabled="true"
      :custom-title="customTitle"
      :header-show="true"
      :title="title"
    ></commonHeader>
    <div class="trreall">
      <div class="trretable">
        <div class="trretabletit">
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
              <div class="left">锌</div>
              <div v-if="hairtestznRet == 1" class="left_right trretop">
                {{ hairtestzn }}
              </div>
              <div v-else-if="hairtestznRet == 2" class="left_right trrebut">
                {{ hairtestzn }}
              </div>
              <div v-else class="left_right">
                {{ hairtestzn }}
              </div>
              <div class="right_left">µg/g</div>
              <div class="right">170～300</div>
            </div>
            <div class="body_box">
              <div class="left">铁</div>
              <div v-if="hairtestfeRet == 1" class="left_right trretop">
                {{ hairtestfe }}
              </div>
              <div v-else-if="hairtestfeRet == 2" class="left_right trrebut">
                {{ hairtestfe }}
              </div>
              <div v-else class="left_right">
                {{ hairtestfe }}
              </div>
              <div class="right_left">µg/g</div>
              <div class="right">20～60</div>
            </div>
            <div class="body_box">
              <div class="left">铜</div>
              <div v-if="hairtestcuRet == 1" class="left_right trretop">
                {{ hairtestcu }}
              </div>
              <div v-else-if="hairtestcuRet == 2" class="left_right trrebut">
                {{ hairtestcu }}
              </div>
              <div v-else class="left_right">
                {{ hairtestcu }}
              </div>
              <div class="right_left">µg/g</div>
              <div class="right">9～30</div>
            </div>
            <div class="body_box">
              <div class="left">铅</div>
              <div v-if="hairtestpbRet == 1" class="left_right trretop">
                {{ hairtestpb }}
              </div>
              <div v-else-if="hairtestpbRet == 2" class="left_right trrebut">
                {{ hairtestpb }}
              </div>
              <div v-else class="left_right">
                {{ hairtestpb }}
              </div>
              <div class="right_left">µg/g</div>
              <div class="right">0～12</div>
            </div>
            <div class="body_box">
              <div class="left">钙</div>
              <div v-if="hairtestcaRet == 1" class="left_right trretop">
                {{ hairtestca }}
              </div>
              <div v-else-if="hairtestcaRet == 2" class="left_right trrebut">
                {{ hairtestca }}
              </div>
              <div v-else class="left_right">
                {{ hairtestca }}
              </div>
              <div class="right_left">µg/g</div>
              <div class="right">600～3000</div>
            </div>
            <div class="body_box">
              <div class="left">镁</div>
              <div v-if="hairtestmgRet == 1" class="left_right trretop">
                {{ hairtestmg }}
              </div>
              <div v-else-if="hairtestmgRet == 2" class="left_right trrebut">
                {{ hairtestmg }}
              </div>
              <div v-else class="left_right">
                {{ hairtestmg }}
              </div>
              <div class="right_left">µg/g</div>
              <div class="right">50～300</div>
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
      <div class="trresbut" @click="$throttle(toback)">确认返回</div>
    </div>
    <van-image-preview v-model="show" :images="images1" v-myOn:click="fn">
    </van-image-preview>
  </div>
</template>

<script>
import commonHeader from "@/components/commonHeader/common_header.vue";
import { ImagePreview } from "vant";
export default {
  name: "TraceResults",
  data() {
    return {
      title: "微量元素检测评定结果",
      customTitle: "营养诊断",
      hairtestzn:'',
      hairtestfe:'',
      hairtestcu:'',
      hairtestpb:'',
      hairtestca:'',
      hairtestmg:'',
      hairtestznRet:'',
      hairtestfeRet:'',
      hairtestcuRet:'',
      hairtestpbRet:'',
      hairtestcaRet:'',
      hairtestmgRet:'',
      images: [],
      images1: [],
      show: false,
    };
  },

  components: {
    commonHeader
  },

  created() {
    this.seltrre();
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
    seltrre() {
      this.$http
        .request({
          method: "get",
          url: "/NNutritionAssessmentController/selectHair",
          body: {
            patiId: window.sessionStorage.getItem("id"),
            needRet: 1,
          },
        })
        .then((res) => {
          this.hairtestzn = res.data.data.hairtestzn;
          this.hairtestfe = res.data.data.hairtestfe;
          this.hairtestcu = res.data.data.hairtestcu;
          this.hairtestpb = res.data.data.hairtestpb;
          this.hairtestca = res.data.data.hairtestca;
          this.hairtestmg = res.data.data.hairtestmg;
          this.hairtestznRet = res.data.data.hairtestznRet;
          this.hairtestfeRet = res.data.data.hairtestfeRet;
          this.hairtestcuRet = res.data.data.hairtestcuRet;
          this.hairtestpbRet = res.data.data.hairtestpbRet;
          this.hairtestcaRet = res.data.data.hairtestcaRet;
          this.hairtestmgRet = res.data.data.hairtestmgRet;
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
#TraceResults {
  padding: 0px;
  width: 100%;
  height: 100%;
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
  .trreall {
    .trretable {
      margin-top: 15px;
      background-color: #fff;
      border-radius: 10px;
      .trretabletit {
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
      .trretablet {
        height: 46px;
        padding: 0px 34px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
        color: #333333;
        flex: 1;
      }

      .trretableb {
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
    .trresbut {
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
      position: absolute;
      bottom: 20px;
    }
  }
}
</style>
