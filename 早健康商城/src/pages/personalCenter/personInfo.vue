/*
 * @Author: 田东 
 * @Date: 2019-05-09 13:02:48 
 * @Last Modified by: 田东
 * @Last Modified time: 2019-06-19 18:06:00
 * @name 个人信息
 */

<template>
  <div id="personInfo">
    <!-- 头部 -->
    <v-header :title="title"></v-header>
    <!-- 内容区 -->
    <van-cell-group v-if="!showCropModal">
      <div class="head_portrait_box" @click="uploadHeadImg()">
        <van-cell title="头像" is-link>
          <div class="img_box">
            <img class="face-img" :src="hImages" alt>
          </div>
        </van-cell>
      </div>
      <van-field
        class="nick_name"
        label="昵称"
        v-on:focus="isNameFocus = true"
        v-on:blur="updateNickName()"
        v-model="nickName"
        maxlength="15"
        input-align="right"
        right-icon="arrow"
      />
    </van-cell-group>
    <!-- <input type="file" @change="change"> -->
    <van-popup class="popup_btn_group" v-model="isShowSelect" position="bottom">
      <div class="item_btn" @click="camera()">相机</div>
      <div class="item_btn" @click="gallery()">相册</div>
      <div class="item_btn" @click="isShowSelect = false">取消</div>
    </van-popup>
    <!-- 裁切遮罩层 -->
    <div class="mask-modal" v-show="showCropModal">
      <div class="caiqie">
        <img id="image" :src="url" alt="Picture">
      </div>
      <i class="iconfont iconfanhui" @click="showCropModal = false"></i>
      <div class="buttonbx">
        <div type="text" class="buttonbx-b" @click="cropImg">确定</div>
      </div>
    </div>
    <!-- 裁切提示层 -->
    <div class="crop-modal" v-show="showLoadingModal"></div>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";

import Cropper from "cropperjs";
import { Cell, CellGroup, Toast } from "vant";

import httpConfig from "@/utils/httpConfig";
import { setTimeout } from "timers";
const host = httpConfig.serviceHost;

export default {
  name: "personInfo",
  data() {
    return {
      // 组件数据
      title: "个人信息",

      // 本页数据
      // imgUrl: "https://dummyimage.com/100x100/e98c2e/fff",
      nickName: "",
      tempName: "",
      showCropModal: false,
      showLoadingModal: false,
      picValue: "",
      url: "",
      cropper: "",
      hImages:
        "http://pfks-oss-center.oss-cn-beijing.aliyuncs.com/FFA39D19F7D4451AB657401E43C09E19.png",
      headerImage: "",
      clickNum: false,
      isShowSelect: false,
      ToastRequest: "",
      isNameFocus: false // 名字是否获取焦点
    };
  },
  components: {
    "v-header": Header
  },
  mounted: function() {
    this.getData();
    // 初始化这个裁剪框
    this.initCropper();
  },
  methods: {
    getData() {
      this.$http
        .request({
          method: "get",
          url: "/SUserController/selectMine",
          body: {}
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.nickName = data.data.userInfo.nickname;
            this.tempName = this.nickName;
            if (data.data.userInfo.img) {
              this.hImages = data.data.userInfo.img;
            }
            this.isLogin = true;
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    change(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.showCropModal = true;
      this.picValue = files[0];
      this.url = this.getObjectURL(this.picValue);
      console.log("url" + this.url);
      // 每次替换图片要重新得到新的url
      if (this.cropper) {
        this.cropper.replace(this.url);
      }
      this.showCropModal = true;
      // if (this.showCropModal === true) this.mcont = false; // 当裁切页面不显示时，显示签名人像采集页面
    },
    uploadHeadImg() {
      !this.isNameFocus && (this.isShowSelect = true);
    },
    //--------plus相机拍摄
    camera() {
      this.isShowSelect = false;
      let _this = this;
      let cmr = plus.camera.getCamera();
      var res = cmr.supportedImageResolutions[0];
      var fmt = cmr.supportedImageFormats[0];
      cmr.captureImage(
        function(path) {
          var content = "file://" + plus.io.convertLocalFileSystemURL(path);
          _this.plusImg(content);
        },
        function(err) {},
        { resolution: res, format: fmt }
      );
    },
    //-------plus相册拍摄
    gallery() {
      this.isShowSelect = false;
      let _this = this;
      plus.gallery.pick(
        function(path) {
          _this.plusImg(path);
        },
        function(err) {},
        { filter: "image" }
      );
    },
    plusImg(path) {
      let newPath = "";
      let _this = this;
      _this.ToastRequest = Toast.loading({
        duration: 0,
        mask: true,
        message: "加载中..."
      });
      plus.zip.compressImage(
        {
          src: path,
          dst: "_doc/a.jpg",
          overwrite: true,
          width: "350px", //这里指定了宽度，同样可以修改
          format: "jpg",
          quality: 100 //图片质量不再修改，以免失真
        },
        e => {
          newPath = e.target;
          _this.createUpload(newPath);
        },
        error => {
          _this.ToastRequest.clear();
          alert("服务异常");
        }
      );
    },
    createUpload(newPath) {
      let _this = this;
      let task = plus.uploader.createUpload(
        host + "SUserController/fileToBase",
        { method: "POST", blocksize: 204800, priority: 100 },
        (t, status) => {
          // 上传完成
          _this.ToastRequest.clear();
          // console.log(t);
          if (status == 200) {
            // _this.goPanel(
            _this.url =
              "data:image/jpeg;base64," + JSON.parse(t.responseText).data;
            // console.log(_this.url);
            if (this.cropper) {
              this.cropper.replace(this.url);
            }
            this.showCropModal = true;
          } else {
            _this.ToastRequest.clear();
          }
        }
      );
      task.addFile(newPath, { key: "file" });
      task.start();
    },
    canvasDataURL(path, obj, callback) {
      var img = new Image();
      img.crossOrigin = "";
      img.src = path;
      console.log("path: " + path);
      img.onload = function() {
        console.log("onload: true");
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        var quality = 0.7; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },

    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    cropImg() {
      this.showLoadingModal = true;
      setTimeout(() => {
        this.crop();
        this.showLoadingModal = false;
      }, 800);
    },
    crop() {
      this.showCropModal = false;
      if (this.showCropModal === false) this.mcont = true; // 当裁切页面不显示时，显示签名人像采集页面
      var croppedCanvas;
      var roundedCanvas;
      if (!this.croppable) {
        return;
      }
      // Crop
      croppedCanvas = this.cropper.getCroppedCanvas();
      // console.log(this.cropper);
      // Round
      roundedCanvas = this.getRoundedCanvas(croppedCanvas);
      var headerimg = roundedCanvas.toDataURL();
      // console.log(headerimg.length + 'window');
      // 下面是压缩图片
      var img = new Image();
      sessionStorage["hImages"] = roundedCanvas.toDataURL("image/jpeg", 0.75);
      this.showLoadingModal = false;
      var _this = this;
      // 开始压缩图片
      img.onload = function() {
        var canvas;
        var ctx;
        var img64;
        canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100; // 设置创建的canvas的宽度100高度按等比例计算
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 100, 100);
        img64 = canvas.toDataURL("image/jpeg", 1); // 获取压缩之后图片的dataurl
        sessionStorage["faceImage"] = img64; // 缓存压缩之后图片的dataurl
        _this.headerImage = sessionStorage["faceImage"]; // 传给后台的参数(压缩之后的图片)
        _this.postImg();
        _this.showCropModal = false;
      };
      img.src = headerimg; // 裁切图片之后的dataurl
    },
    // 上传头像
    postImg() {
      this.button = true; // 这事是图片裁切成功时，提交按钮显示
      sessionStorage["faceImage"] = this.headerImage; // 缓存脸部识别照片用于测试
      // 去头
      let headerImageAfterCut = this.headerImage.replace(
        "data:image/jpeg;base64,",
        ""
      );
      // console.log(this.headerImage);
      let param = {
        faceImage: headerImageAfterCut // 图片文件内容，base64编码的字符串，图片大小200k以内
      };
      param = JSON.stringify(param);
      this.$http
        .request({
          method: "post",
          url: "SUserController/uploadUserHead", // 获取问题列表
          body: { baseString: headerImageAfterCut }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.hImages = sessionStorage["hImages"]; // 前台显示的图片为裁切下来的图片，传给后台的是等比例压缩的图片
            Toast("已上传");
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    },
    getRoundedCanvas(sourceCanvas) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      var width = sourceCanvas.width;
      var height = sourceCanvas.height;
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      context.fill();
      return canvas;
    },
    initCropper() {
      var self = this;
      var image = document.getElementById("image");
      // console.log("子组件faceRecognition mounted image:", image);
      this.cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        viewMode: 1,
        background: false,
        zoomable: false,
        ready: function() {
          self.croppable = true;
        },
        dragMode: "move",
        movable: false, // 是否能移动图片
        cropBoxMovable: true, // 是否允许拖动裁剪框
        cropBoxResizable: true // 是否允许拖动改变裁剪框大小
      });
    },
    // 修改昵称
    updateNickName() {
      setTimeout(() => {
        this.isNameFocus = false;
      }, 500);
      if (!this.nickName) {
        this.nickName = this.tempName;
        return;
      }
      if (this.nickName == this.tempName) {
        return;
      }
      this.$http
        .request({
          method: "post",
          url: "/SUserController/updateNickName",
          body: { nickName: this.nickName }
        })
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.tempName = this.nickName;
            Toast(data.message);
          } else {
            Toast(data.message);
          }
        })
        .catch(error => {
          console.log("错误为" + error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/cssCommon.less";

html {
  height: 100%;
  background: @backgroundColor;
}

* {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
  background: none;
}

#personInfo {
  .popup_btn_group {
    background: @backgroundColor;

    .item_btn {
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: @backgroundColorT;

      &:first-child {
        border-bottom: 1px solid @borderColor;
      }

      &:last-child {
        margin-top: 10px;
      }
    }
  }

  .head_portrait_box {
    position: relative;
    &::after {
      content: " ";
      position: absolute;
      pointer-events: none;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      left: 15px;
      right: 0;
      bottom: 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      border-bottom: 1px solid @borderColor;
    }
    .van-cell {
      line-height: 13.3vw;

      .van-icon {
        height: 13.3vw;
        line-height: 13.3vw;
      }

      .van-cell__value {
        height: 13.3vw;
        line-height: 13.3vw;
        width: 13.3vw;
        // border-radius: 6.7vw;
        overflow: hidden;

        img {
          width: 100%;
        }
      }
    }

    .van-field__control {
      text-align: right;
    }

    .img_box {
      height: 13.3vw;
      width: 13.3vw;
      line-height: 13.3vw;
      border-radius: 6.7vw;
      overflow: hidden;
      float: right;
    }
  }

  .van-cell__title {
    color: @titleColor;
    .fontSize(16);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
  }

  .nick_name {
    color: @titleColor;
    .fontSize(16);
    font-family: PingFang-SC-Medium;
    font-weight: 500;

    input {
      color: @titleColor;
      .fontSize(15);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
    }
  }

  .van-cell__value {
    color: @titleColor;
    .fontSize(15);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
  }

  .van-uploader {
    display: block;
  }
}
</style>
<style lang="less">
@import "../../assets/css/cssCommon.less";
#file {
  display: none;
}
.face-recognition {
  padding: 2vw 0;
}
.mask-modal {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(39, 38, 38, 0.87);
}
.mask-modal .iconfont {
  color: @fontOne;
  .fontSize(16);
  position: absolute;
  top: 4.4vw;
  left: 3.1vw;
}
.mask-modal .caiqie {
  width: 100vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.crop-modal {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 12;
}
.buttonbx {
  position: absolute;
  text-align: center;
  width: 100%;
  bottom: 0;
  /* top: 91.2vh; */
  background: @mainColor;
  border: none;
}
.buttonbx .buttonbx-b {
  position: relative;
  text-align: center;
  width: 100%;
  font-size: 4.8vw;
  color: @fontOne;
  line-height: 8.38vh;
  border: none;
}
#image {
  max-width: 100%;
}
.cropper-container {
  font-size: 0;
  line-height: 0;

  position: relative;

  -webkit-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none;

  direction: ltr;
  -ms-touch-action: none;
  touch-action: none;
}
.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg;
}
.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.cropper-crop-box {
  border-radius: 50%;
  overflow: hidden;
}
.cropper-wrap-box {
  overflow: hidden;
}
.cropper-drag-box {
  opacity: 0;
  background-color: @backgroundColorT;
}
.cropper-modal {
  opacity: 0.5;
  background-color: @background0;
}
.cropper-view-box {
  display: block;
  overflow: hidden;

  width: 100%;
  height: 100%;
}
.cropper-dashed {
  position: absolute;

  display: block;

  opacity: 0.5;
  border: 0 dashed @borderColor;
}
.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px;
}
.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px;
}
.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;

  display: block;

  width: 0;
  height: 0;

  opacity: 0.75;
}
.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: " ";
  background-color: @borderColor;
}
.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px;
}
.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px;
}
.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;

  display: block;

  width: 100%;
  height: 100%;

  opacity: 0.1;
}
.cropper-face {
  top: 0;
  left: 0;

  background-color: @backgroundColorT;
}
.cropper-line {
  background-color: @mainColor;
}
.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize;
}
.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize;
}
.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize;
}
.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize;
}
.cropper-point {
  width: 0;
  height: 7px;

  opacity: 0.75;
  background-color: @mainColor;
}
.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize;
}
.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize;
}
.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize;
}
.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize;
}
.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
}
.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
}
.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
}
.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 0;
  height: 20px;
  cursor: se-resize;
  opacity: 1;
}
.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: none;
  width: 200%;
  height: 200%;
  content: " ";
  opacity: 0;
  background-color: @mainColor;
}
.cropper-invisible {
  opacity: 0;
}
.cropper-bg {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}
.cropper-hide {
  position: absolute;

  display: block;

  width: 0;
  height: 0;
}
.cropper-hidden {
  display: none !important;
}
.cropper-move {
  cursor: move;
}
.cropper-crop {
  cursor: crosshair;
}
.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
button:focus {
  outline: 0;
}
</style>



