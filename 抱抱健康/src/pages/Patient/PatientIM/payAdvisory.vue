/**
*@desc 付费咨询
*@author houpai
*@date 2020/01/08 16:47:45
*/
<template>
  <div id="payAdvisory">
    <common-header
        :share-disabled="true"
        :title="'付费咨询'"
        header-show="true"
        :custom-title="'咨询管理'"></common-header>

    <van-cell
        :class="{ selected: selected }"
        :value="value"
        is-link
        @click="isShowActions = true">
      <template slot="title">
          <span class="custom-title">
            <img src="../../../assets/images/diseaseTime.png" alt="">
            患病时长
          </span>
      </template>
    </van-cell>
    <div class="des_box">
      <p class="des_title">
          <span class="des_title_info">
            <img src="../../../assets/images/diseaseInfo.png" alt="">
            <span>病情描述</span>
          </span>
        <span class="code_number">{{diseaseDes.length}} / 200</span>
      </p>
      <!--      @focus="btnToggle=false"-->
      <!--      @blur="btnToggle=true"-->
      <textarea
          v-model="diseaseDes"
          maxlength="200"
          class="des_details"
          placeholder="详细描述您的病情症状，曾经做过的检查、用药情况，目前病情的加重还是缓解，想要获得医生的什么帮(10-200字)"></textarea>
    </div>
    <div class="des_box">
      <p class="des_title">
        <img src="../../../assets/images/diseaseCaseIcon.png" alt="">
        病例资料
        <span class="diseaseCase_desc">(照片仅自己和医生可见)</span>
      </p>
      <!--        <span class="prompt">-->
      <!--          请上传病情照片，若是皮肤或整形问题，建议对准患处拍摄。照片仅自己和医生可见(最多9张图片)。-->
      <!--        </span>-->
      <div class="images_box">
        <div class="item_cell" v-for="(img, key) in images" :key="key">
          <div
              class="cell photo"
              @click="imagesPreview(key)"
              :style="'background-image: url(' + img + ')'">
            <!-- <img class="img" :src="img" alt /> -->
            <img class="iconfont"
                 src="../../../assets/images/iconDelete.png"
                 alt
                 @click.stop="deletePhoto(key)"/>
          </div>
        </div>
        <div class="item_cell" v-show="images.length < 9">
          <label for="uploadPhoto">
            <div class="cell">
              <div>
                <img class="iconfont" src="../../../assets/images/iconCamera.png" alt/>
                <span class="disease_img_number">
                    {{images.length}}/9
                  </span>
              </div>
            </div>
          </label>
          <input
              type="file"
              ref="clearFile"
              accept="image/*"
              id="uploadPhoto"
              @change="uploadPhoto"/>
        </div>
        <!--          <span class="prompt" v-show="images.length === 0">-->
        <!--            照片仅自己和医生可见-->
        <!--          </span>-->
      </div>
    </div>
    <p class="bottom_prompt">
      付款成功后，医生24小时内未回复您的问题，系统将自动退款。
    </p>

    <van-action-sheet
        v-model="isShowActions"
        :actions="actions"
        @select="onSelect"></van-action-sheet>

    <div class="footer-box">
      <div class="next-btn"
           @click="next()">
        <van-button slot="button" class="next-btn" size="large">
          <img src="../../../assets/images/btnPhoto.png" alt="">
          图文咨询(¥{{ (price / 100).toFixed(2) }})
        </van-button>
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from "vue"
  import {ImagePreview, Toast} from "vant"
  import Exif from 'exif-js'

  Vue.use(ImagePreview)
  import {mapState} from "vuex"

  import commonHeader from "../../../components/commonHeader/common_header"

  export default {
    name: "payAdvisory",
    components: {
      commonHeader
    },
    data() {
      return {
        doctorId: "", // 医生ID
        selected: false,
        value: "请选择患病时长",
        isShowActions: false,
        actions: [
          {name: " ≤ 1天", key: 1},
          {name: "1天 — 1周", key: 2},
          {name: "1周 — 1个月", key: 3},
          {name: "1个月 — 3个月", key: 4},
          {name: "3个月以上", key: 5}
        ],
        actionKey: "",
        diseaseDes: "",
        images: [],
        price: 0,
        payConsultId: "", // 咨询id
        btnToggle: true,
        ToastRequest: '',
      }
    },
    created() {
      this.doctorId = this.PatientIM.sessionMessage.doctorId
      this.getPrice() // 获取咨询费用
      this.wxConfig()
    },
    computed: {
      ...mapState(["PatientIM"])
    },
    methods: {
      getPrice() {
        this.$http.request({
          method: "get",
          url: "/RPayConsultController/getTarrifByDoctorId",
          body: {doctorId: this.doctorId}
        }).then(res => {
          let data = res.data
          if (data.success) {
            this.price = data.data
          } else {
            Toast(data.message)
          }
        }).catch(error => {
          Toast({
            message: "无法连接服务",
            position: "bottom"
          })
        })
      },

      onSelect(item, index) {
        this.value = item.name
        this.actionKey = item.key
        this.isShowActions = false
        this.selected = true
      },

      deletePhoto(key) {
        this.images.splice(key, 1)
      },


      /**
       * 压缩图片处理**/
      compress(img, Orientation) {
        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext('2d')
        //瓦片canvas
        let tCanvas = document.createElement("canvas")
        let tctx = tCanvas.getContext("2d")
        let initSize = img.src.length
        let width = img.width
        let height = img.height
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio
        if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio)
          width /= ratio
          height /= ratio
        } else {
          ratio = 1
        }
        canvas.width = width
        canvas.height = height
        //        铺底色
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        //如果图片像素大于100万则使用瓦片绘制
        let count
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1) //计算要分成多少块瓦片
          //计算每块瓦片的宽和高
          let nw = ~~(width / count)
          let nh = ~~(height / count)
          tCanvas.width = nw
          tCanvas.height = nh
          for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height)
        }
        //修复ios上传图片的时候 被旋转的问题
        if (Orientation != "" && Orientation != 1) {
          switch (Orientation) {
            case 6://需要顺时针（向左）90度旋转
              this.rotateImg(img, 'left', canvas)
              break
            case 8://需要逆时针（向右）90度旋转
              this.rotateImg(img, 'right', canvas)
              break
            case 3://需要180度旋转
              this.rotateImg(img, 'right', canvas)//转两次
              this.rotateImg(img, 'right', canvas)
              break
          }
        }
        //进行最小压缩
        let ndata = canvas.toDataURL('image/jpeg', 0.1)
        console.log('压缩前：' + initSize)
        console.log('压缩后：' + ndata.length)
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%")
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
        return ndata
      },

      /**
       * 旋转图片处理
       * **/
      rotateImg(img, direction, canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0
        const max_step = 3
        if (img == null) return
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height
        let width = img.width
        let step = 2
        if (step == null) {
          step = min_step
        }
        if (direction == 'right') {
          step++
          //旋转到原位置，即超过最大值
          step > max_step && (step = min_step)
        } else {
          step--
          step < min_step && (step = max_step)
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180
        let ctx = canvas.getContext('2d')
        switch (step) {
          case 0:
            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0)
            break
          case 1:
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree)
            ctx.drawImage(img, 0, -height)
            break
          case 2:
            canvas.width = width
            canvas.height = height
            ctx.rotate(degree)
            ctx.drawImage(img, -width, -height)
            break
          case 3:
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree)
            ctx.drawImage(img, -width, 0)
            break
        }
      },

      /**
       * 图片压缩
       * **/
      compressImg(file) {
        this.ToastRequest = Toast.loading({
          duration: 0,
          mask: true,
          message: "上传中..."
        })
        let self = this
        let Orientation
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function () {
          Orientation = Exif.getTag(this, 'Orientation')
        })
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return

        if (/^image/.test(file.type)) {
          // 创建一个reader
          let reader = new FileReader()
          // 将图片2将转成 base64 格式
          reader.readAsDataURL(file)
          // 读取成功后的回调
          reader.onloadend = function (res) {
            let result = this.result
            let img = new Image()
            img.src = result
            //判断图片是否大于100K,是就直接上传，反之压缩图片
            if (this.result.length <= (100 * 1024)) {
              let uploadImg = this.result
              self.postImg(uploadImg)
            } else {
              img.onload = function () {
                let uploadImg = self.compress(img, Orientation)
                self.postImg(uploadImg)
              }
            }
          }
        }
      },

      uploadPhoto(e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        let picValue = files[0]
        this.compressImg(picValue)
      },

      postImg(uploadImg) {
        let formData = new FormData()
        let blob = this.$dataURLtoBlob(uploadImg)
        formData.append("file", blob)
        this.$http.request({
          method: "post",
          url: "/Aliupload/aliupload",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(res => {
          let data = res.data
          if (data.success) {
            this.images.push(
              data.message + "?x-oss-process=image/auto-orient,1"
            )
            console.log('this.images', this.images);
            this.$refs.clearFile.value = ""
          } else {
            this.$refs.clearFile.value = ""
            Toast(data.message)
          }
          this.ToastRequest.clear()
        }).catch(error => {
          this.ToastRequest.clear()
          this.$refs.clearFile.value = ""
        })
      },

      imagesPreview(key) {
        ImagePreview({
          images: this.images,
          startPosition: key
        })
      },

      /**
       * 微信config**/
      wxConfig() {
        return new Promise((resolve, reject) => {
          this.$http
            .request({
              method: "post",
              url: "/wechat/getJsApiSignature",
              body: {
                url: window.location.href.split("#")[0]
              }
            })
            .then(res => {
              if (res.data.success && res.data.data) {
                let appId = res.data.data.appId || ""
                let timeStamp = res.data.data.timeStamp || ""
                let nonceStr = res.data.data.nonceStr || ""
                let signature = res.data.data.signature || ""
                try {
                  this.$wx.config({
                    debug: false, // 开启调试模式
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timeStamp, // 必填，生成签名的时间戳
                    nonceStr: nonceStr, // 必填，生成签名的随机串
                    signature: signature, // 必填，签名
                    jsApiList: ["chooseWXPay"]
                  })
                } catch (e) {
                  console.log(e)
                }
                resolve(res.data.data)
              }
            })
            .catch(e => {
              console.log(e)
              reject(e)
            })
        })
      },

      next() {
        let _this = this
        if (!this.actionKey) {
          Toast({
            message: "请选择患病时长",
            position: "bottom"
          })
          return
        }
        if (this.diseaseDes.length <= 10) {
          Toast({
            message: "病情描述不少于10字",
            position: "bottom"
          })
          return
        }

        this.$http.request({
          method: "post",
          url: "/RPayConsultController/patientConsult",
          body: {
            doctorId: this.doctorId, // 医生ID
            illnessDuration: this.actionKey, // 患病时长（字典ID值）
            illnessDesc: this.diseaseDes, // 病情描述
            imageList: this.images // 图片列表（每一个元素为一个图片URL）
          },
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          let data = res.data
          if (data.success) {
            this.payConsultId = data.data.payConsultId
            this.$wx.chooseWXPay({
              appId: data.data.appId,
              timestamp: data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
              package: data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: data.data.paySign, // 支付签名
              success: function (res) {
                // 支付成功后的回调函数
                _this.$router.back(-1)
              },
              fail: e => {
                Toast("支付失败")
              }
            })
          } else {
            Toast(data.message)
          }
        }).catch(error => {
          Toast({
            message: "无法连接服务",
            position: "bottom"
          })
        })
      }
    }
  }
</script>

<style scoped lang="less">
  #payAdvisory {
    background: @backgroundColor;
    display: flex;
    flex-direction: column;
    .padding(44, 12, 70, 12);

    /deep/ .van-cell {
      .borderRadius(10, 10, 10, 10);
      height: 48px;
      .padding(0, 10, 0, 10);
      align-items: center;

      .van-cell__title {
        display: flex;
        flex: none;
        align-items: center;
        .margin(0, 20, 0, 0);
      }

      .van-cell__value {
        display: flex;
        align-items: center;
        .fontSize(16);
        .lineHeight(20);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }

      .custom-title {
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
      }

      i {
        .fontSize(18);
        color: rgba(51, 51, 51, 1);
      }
    }

    .des_box {
      .margin(20);
      .borderRadius(10, 10, 10, 10);
      background: @backgroundColorT;
      .padding(10, 10, 10, 10);
      box-sizing: border-box;

      .des_title {
        padding-bottom: 15px;

        .des_title_info {
          display: flex;
          align-items: center;
          flex: 1;
        }

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

        .code_number {
          .fontSize(14);
          .lineHeight(18);
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
        }

        .diseaseCase_desc {
          color: #999999;
          .fontSize(16);
          .margin(0, 0, 0, 10)
        }
      }

      .des_details {
        .fontSize(16);
        .lineHeight(20);
        width: 100%;
        .height(144);
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

          .disease_img_number {
            display: block;
            color: #c5c5c5;
            .fontSize(14);
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
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
    }

    .bottom_prompt {
      font-weight: 400;
      color: rgba(255, 48, 0, 1);
      .fontSize(14);
      .lineHeight(18);
      .padding(20, 0, 54, 0)
    }
  }


  .footer-box {
    img {
      display: block;
      .margin(0, 10, 0, 0);
      width: 20px;
      height: 20px;
    }

    /deep/ .van-button__text {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
